import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.accessTokenTtl });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: '7d' });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

export function newId() {
  return crypto.randomUUID();
}

export function generateSixDigitCode() {
  return String(crypto.randomInt(100000, 1000000));
}

export function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}
