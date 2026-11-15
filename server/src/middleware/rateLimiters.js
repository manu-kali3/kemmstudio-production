import { RateLimiterPostgres, RateLimiterMemory } from 'rate-limiter-flexible';
import { pgPool, dbReady } from '../config/db.js';

const limiters = new Map();
let readyPromise;

async function ensureTable() {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      key varchar(255) PRIMARY KEY,
      points integer NOT NULL DEFAULT 0,
      expire bigint
    )
  `);
}

function createLimiter(opts) {
  if (dbReady) {
    return new RateLimiterPostgres({
      storeClient: pgPool,
      storeType: 'pg',
      tableName: 'rate_limits',
      tableCreated: true,
      ...opts,
    });
  }
  return new RateLimiterMemory(opts);
}

export async function initRateLimiters() {
  if (!readyPromise) {
    readyPromise = (async () => {
      if (dbReady) {
        try { await ensureTable(); } catch (e) { console.warn('[rate-limit] table setup skipped:', e.message); }
      }
      limiters.set('login', createLimiter({ keyPrefix: 'rl_login', points: 5, duration: 60 * 15, blockDuration: 60 * 15 }));
      limiters.set('register', createLimiter({ keyPrefix: 'rl_register', points: 5, duration: 60 * 60, blockDuration: 60 * 30 }));
      limiters.set('verify', createLimiter({ keyPrefix: 'rl_verify', points: 10, duration: 60 * 10, blockDuration: 60 * 10 }));
      limiters.set('resend', createLimiter({ keyPrefix: 'rl_resend', points: 3, duration: 60 * 10, blockDuration: 60 * 10 }));
      limiters.set('passwordReset', createLimiter({ keyPrefix: 'rl_pwreset', points: 5, duration: 60 * 30, blockDuration: 60 * 30 }));
      limiters.set('contact', createLimiter({ keyPrefix: 'rl_contact', points: 5, duration: 60 * 60, blockDuration: 60 * 30 }));
      limiters.set('api', createLimiter({ keyPrefix: 'rl_api', points: 120, duration: 60 }));
    })();
  }
  return readyPromise;
}

function getIp(req) {
  return req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection?.remoteAddress || 'unknown';
}

export function rateLimit(name, { byEmail = false } = {}) {
  return async (req, res, next) => {
    try {
      await initRateLimiters();
      const limiter = limiters.get(name);
      if (!limiter) return next();
      const keys = [getIp(req)];
      if (byEmail && req.body?.email) keys.push(String(req.body.email).toLowerCase());
      for (const key of keys) {
        await limiter.consume(key);
      }
      next();
    } catch (rejRes) {
      const secs = Math.round((rejRes?.msBeforeNext || 1000) / 1000) || 1;
      res.set('Retry-After', String(secs));
      return res.status(429).json({ message: 'Too many requests. Please try again later.', retryAfterSeconds: secs });
    }
  };
}
