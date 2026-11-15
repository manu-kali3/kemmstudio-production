import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pgPool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined,
});

export let dbReady = false;

export async function connectPostgres() {
  if (!env.databaseUrl) {
    console.warn('[db] DATABASE_URL not set - running without Postgres (in-memory mode)');
    dbReady = false;
    return false;
  }
  try {
    const client = await pgPool.connect();
    await client.query('SELECT 1');
    client.release();
    dbReady = true;
    console.log('[db] Postgres connected');
    return true;
  } catch (err) {
    console.warn('[db] Postgres unavailable, running in-memory mode:', err.message);
    dbReady = false;
    return false;
  }
}

export async function closeDbs() {
  try { await pgPool.end(); } catch {}
}
