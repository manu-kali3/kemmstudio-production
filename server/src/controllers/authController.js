import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import VerificationCode from '../models/VerificationCode.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  newId,
  generateSixDigitCode,
  hashValue,
} from '../utils/tokens.js';
import { sendVerificationCodeEmail } from '../utils/email.js';
import { env } from '../config/env.js';

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    // no maxAge/expires => session cookie dropped on browser close
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });
  res.status(201).json({ message: 'Registration successful. Please log in.', user: { id: user._id, email: user.email, name: user.name } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const code = generateSixDigitCode();
  const codeHash = hashValue(code);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await VerificationCode.deleteMany({ userId: user._id, purpose: 'login', consumed: false });
  await VerificationCode.create({ userId: user._id, codeHash, expiresAt, attempts: 0, maxAttempts: 5, purpose: 'login' });

  try {
    await sendVerificationCodeEmail(user.email, code);
  } catch (e) {
    // In dev without valid key, log code so flow can be tested
    if (env.nodeEnv !== 'production') console.log(`[dev] 2FA code for ${user.email}: ${code}`);
    if (env.nodeEnv === 'production') throw e;
  }

  const pendingToken = jwt.sign({ sub: String(user._id), purpose: '2fa' }, env.jwtAccessSecret, { expiresIn: '10m' });
  res.json({ message: 'Verification code sent to your email', pendingToken });
});

export const verifyTwoFactor = asyncHandler(async (req, res) => {
  const { code, pendingToken } = req.body;
  let pending;
  try {
    pending = jwt.verify(pendingToken, env.jwtAccessSecret);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired verification session' });
  }
  if (pending.purpose !== '2fa') return res.status(401).json({ message: 'Invalid verification session' });

  const record = await VerificationCode.findOne({ userId: pending.sub, purpose: 'login', consumed: false }).sort({ createdAt: -1 });
  if (!record) return res.status(400).json({ message: 'No verification code found. Please log in again.' });
  if (record.expiresAt < new Date()) return res.status(400).json({ message: 'Verification code expired. Please log in again.' });
  if (record.attempts >= record.maxAttempts) return res.status(429).json({ message: 'Too many attempts. Please log in again.' });

  const match = hashValue(code) === record.codeHash;
  if (!match) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ message: 'Invalid verification code', attemptsRemaining: Math.max(0, record.maxAttempts - record.attempts) });
  }

  record.consumed = true;
  await record.save();

  const user = await User.findById(pending.sub);
  if (!user) return res.status(401).json({ message: 'User not found' });

  const sessionId = newId();
  const refreshTokenId = newId();
  await Session.create({
    userId: user._id,
    sessionId,
    refreshTokenId,
    valid: true,
    lastHeartbeat: new Date(),
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  const accessToken = signAccessToken({ sub: String(user._id), role: user.role, sid: sessionId });
  const refreshToken = signRefreshToken({ sub: String(user._id), sid: sessionId, jti: refreshTokenId });

  res.cookie('refreshToken', refreshToken, refreshCookieOptions());
  res.json({
    message: 'Login successful',
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const resendCode = asyncHandler(async (req, res) => {
  const { pendingToken } = req.body;
  let pending;
  try {
    pending = jwt.verify(pendingToken, env.jwtAccessSecret);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired verification session' });
  }
  if (pending.purpose !== '2fa') return res.status(401).json({ message: 'Invalid verification session' });
  const user = await User.findById(pending.sub);
  if (!user) return res.status(401).json({ message: 'User not found' });

  const code = generateSixDigitCode();
  const codeHash = hashValue(code);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await VerificationCode.deleteMany({ userId: user._id, purpose: 'login', consumed: false });
  await VerificationCode.create({ userId: user._id, codeHash, expiresAt, attempts: 0, maxAttempts: 5, purpose: 'login' });
  try {
    await sendVerificationCodeEmail(user.email, code);
  } catch (e) {
    if (env.nodeEnv !== 'production') console.log(`[dev] 2FA code for ${user.email}: ${code}`);
    if (env.nodeEnv === 'production') throw e;
  }
  res.json({ message: 'Verification code resent' });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
  const session = await Session.findOne({ sessionId: payload.sid, userId: payload.sub });
  if (!session || !session.valid) {
    res.clearCookie('refreshToken', { path: '/api/auth' });
    return res.status(401).json({ message: 'Session invalid' });
  }
  // reuse detection: presented jti must match current
  if (session.refreshTokenId !== payload.jti) {
    await Session.updateMany({ userId: payload.sub }, { $set: { valid: false } });
    res.clearCookie('refreshToken', { path: '/api/auth' });
    return res.status(401).json({ message: 'Refresh token reuse detected. Sessions revoked.' });
  }
  // heartbeat timeout backup check
  if (Date.now() - new Date(session.lastHeartbeat).getTime() > env.heartbeatTimeoutMs) {
    session.valid = false;
    await session.save();
    res.clearCookie('refreshToken', { path: '/api/auth' });
    return res.status(401).json({ message: 'Session expired due to inactivity' });
  }

  const newRefreshId = newId();
  session.refreshTokenId = newRefreshId;
  session.lastHeartbeat = new Date();
  await session.save();

  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ message: 'User not found' });
  const accessToken = signAccessToken({ sub: String(user._id), role: user.role, sid: session.sessionId });
  const newRefresh = signRefreshToken({ sub: String(user._id), sid: session.sessionId, jti: newRefreshId });
  res.cookie('refreshToken', newRefresh, refreshCookieOptions());
  res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

async function blacklistAccessToken(token) {
  if (!token) return;
  try {
    const decoded = jwt.decode(token);
    const exp = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 15 * 60 * 1000);
    await TokenBlacklist.updateOne({ tokenHash: hashValue(token) }, { $set: { tokenHash: hashValue(token), expiresAt: exp } }, { upsert: true });
  } catch {}
}

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await Session.updateOne({ sessionId: payload.sid }, { $set: { valid: false } });
    } catch {}
  }
  // also blacklist access token if provided
  const header = req.headers.authorization || '';
  const access = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (access) await blacklistAccessToken(access);
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ message: 'Logged out' });
});

export const heartbeat = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(204).end();
  try {
    const payload = verifyRefreshToken(token);
    await Session.updateOne({ sessionId: payload.sid, valid: true, refreshTokenId: payload.jti }, { $set: { lastHeartbeat: new Date() } });
  } catch {}
  res.status(204).end();
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('name email role');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() });
  // Always respond generically to avoid account enumeration
  if (!user) return res.json({ message: 'If an account with that email exists, a reset code has been sent.' });

  const code = generateSixDigitCode();
  const codeHash = hashValue(code);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await VerificationCode.deleteMany({ userId: user._id, purpose: 'password_reset', consumed: false });
  await VerificationCode.create({ userId: user._id, codeHash, expiresAt, attempts: 0, maxAttempts: 5, purpose: 'password_reset' });

  try {
    // reuse same email utility by sending a generic code email; subject/body handled there
    await sendVerificationCodeEmail(user.email, code);
  } catch (e) {
    if (env.nodeEnv !== 'production') console.log(`[dev] Password reset code for ${user.email}: ${code}`);
    if (env.nodeEnv === 'production') throw e;
  }

  res.json({ message: 'If an account with that email exists, a reset code has been sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) return res.status(400).json({ message: 'Invalid or expired reset code' });

  const record = await VerificationCode.findOne({ userId: user._id, purpose: 'password_reset', consumed: false }).sort({ createdAt: -1 });
  if (!record) return res.status(400).json({ message: 'Invalid or expired reset code' });
  if (record.expiresAt < new Date()) return res.status(400).json({ message: 'Invalid or expired reset code' });
  if (record.attempts >= record.maxAttempts) return res.status(429).json({ message: 'Too many attempts. Please request a new reset code.' });

  const match = hashValue(code) === record.codeHash;
  if (!match) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ message: 'Invalid or expired reset code', attemptsRemaining: Math.max(0, record.maxAttempts - record.attempts) });
  }

  record.consumed = true;
  await record.save();
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  // invalidate sessions for security
  await Session.updateMany({ userId: user._id }, { $set: { valid: false } });

  res.json({ message: 'Password reset successful. Please log in with your new password.' });
});
