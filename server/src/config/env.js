import dotenv from 'dotenv';

dotenv.config();

const required = [
  'PORT',
  'CLIENT_URL',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'RESEND_API_KEY',
  'EMAIL_FROM',
];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key} - set it in .env`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL, // Neon Postgres (app data + rate limiting)
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM || 'onboarding@resend.dev',
  whatsappLink: process.env.WHATSAPP_LINK || 'https://wa.me/0000000000',
  facebookLink: process.env.FACEBOOK_LINK || 'https://facebook.com/',
  instagramLink: process.env.INSTAGRAM_LINK || 'https://instagram.com/',
  heartbeatTimeoutMs: Number(process.env.HEARTBEAT_TIMEOUT_MS || 90000),
};
