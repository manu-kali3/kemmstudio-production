import app from './app.js';
import { env } from './config/env.js';
import { connectPostgres } from './config/db.js';
import { initRateLimiters } from './middleware/rateLimiters.js';
import Session from './models/Session.js';

async function startHeartbeatSweeper() {
  const sweep = async () => {
    try {
      const cutoff = new Date(Date.now() - env.heartbeatTimeoutMs);
      // in-memory store supports simple matching; for expired heartbeat we handle in model logic via scan
      const all = await Session.find({ valid: true });
      for (const s of all) {
        if (new Date(s.lastHeartbeat).getTime() < cutoff.getTime()) {
          s.valid = false;
          await s.save();
        }
      }
    } catch (e) {
      console.error('[heartbeat-sweeper]', e.message);
    }
  };
  setInterval(sweep, 30000);
}

async function start() {
  try {
    await connectPostgres();
    await initRateLimiters();
    await startHeartbeatSweeper();
    app.listen(env.port, () => {
      console.log(`[server] listening on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
