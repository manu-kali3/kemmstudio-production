import Session from '../models/Session.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import { verifyAccessToken, hashValue } from '../utils/tokens.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const blacklisted = await TokenBlacklist.findOne({ tokenHash: hashValue(token) });
    if (blacklisted) return res.status(401).json({ message: 'Token invalidated' });
    const payload = verifyAccessToken(token);
    const session = await Session.findOne({ sessionId: payload.sid, userId: payload.sub, valid: true });
    if (!session) return res.status(401).json({ message: 'Session invalid' });
    req.user = { id: payload.sub, role: payload.role, sessionId: payload.sid };
    req.accessToken = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}
