# Kemmstudio Production Website

**Short/display name:** Kemmstudio Production  
**Full name:** Kuria Entertainment Music and Movie Studio

A production-ready, full-stack website for a creative studio focused on Kuria music, entertainment, sports, and sports-centre content. Services include music production, video production, film production, videography, and photography.

## Stack
- **Frontend:** React (Vite), React Router, Framer Motion, Axios
- **Backend:** Node.js, Express
- **Database (Postgres):** Neon/PostgreSQL for app data (users, sessions, portfolio, bookings, messages) and rate limiting via `rate-limiter-flexible` (`pg`). **For now, if `DATABASE_URL` is unset/unavailable the server runs in in-memory mode (no live DB required).** Postgres schema: `server/src/db/schema.sql`.
- **Email (2FA):** Resend API

## Project structure
```text
.
├── client/                 # React + Vite frontend
│   ├── public/             # Static assets, robots.txt, sitemap.xml
│   └── src/
│       ├── api/            # Axios client (in-memory access token, refresh handling)
│       ├── components/     # Layout, Navbar, Footer, FloatingSocials, SEO, guards
│       ├── context/        # Auth context (memory token, heartbeat, sendBeacon logout)
│       └── pages/          # Home, About, Services, Portfolio, Contact, Auth, Admin
├── server/                 # Express API
│   └── src/
│       ├── config/         # Env and DB connections (Mongo + Postgres)
│       ├── controllers/    # Auth, portfolio, bookings/messages
│       ├── middleware/     # Auth, rate limiting, validation, errors
│       ├── models/         # Mongoose models
│       ├── routes/         # API routes
│       ├── seed/           # Seed script
│       └── utils/          # Tokens, email, helpers
└── README.md
```

## Environment variables
Copy the examples and fill in values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | API port (default 5000) |
| `CLIENT_URL` | Frontend origin for CORS/cookies (e.g. `http://localhost:5173`) |
| `DATABASE_URL` | Neon Postgres connection string (app data + rate limiting). Optional for now: if unset/unavailable the server runs in-memory (no live DB). |
| `JWT_ACCESS_SECRET` | Secret for short-lived access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `ACCESS_TOKEN_TTL` | Access token TTL (default `15m`) |
| `RESEND_API_KEY` | Resend API key for 2FA emails |
| `EMAIL_FROM` | Sender address configured in Resend |
| `HEARTBEAT_TIMEOUT_MS` | Session inactivity timeout (default `90000`) |
| `SEED_ADMIN_EMAIL` | Admin email for seed (optional) |
| `SEED_ADMIN_PASSWORD` | Admin password for seed (optional) |
| `WHATSAPP_LINK`, `FACEBOOK_LINK`, `INSTAGRAM_LINK` | Social URLs (kept in config) |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |
| `VITE_SITE_URL` | Public site URL |
| `VITE_STUDIO_NAME` | Display name |
| `VITE_STUDIO_FULL_NAME` | Full studio name |
| `VITE_WHATSAPP_LINK` | WhatsApp click-to-chat URL |
| `VITE_FACEBOOK_LINK` | Facebook page URL |
| `VITE_INSTAGRAM_LINK` | Instagram profile URL |

## Setup
### Prerequisites
- Node.js 20+ and npm
- (Optional for now) Neon Postgres database/URI (`DATABASE_URL`) for persistent storage and Postgres-backed rate limiting; without it the server runs in-memory
- Resend account + API key + verified sender (for production email delivery)

### Install
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Seed demo data and admin user
```bash
cd server
npm run seed
```
Creates a demo admin user (default `admin@kemmstudio.com` / `Admin@12345` unless overridden) and demo portfolio items. With no live DB configured this seeds the in-memory store for the running process; with Postgres configured it seeds persistent data.

## Run locally
Start backend and frontend in separate terminals:

```bash
# Terminal 1 - API
cd server
npm run dev
```

```bash
# Terminal 2 - Client
cd client
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

> **Note:** In development, 2FA emails are sent via Resend if configured; if sending fails in non-production, the server logs the generated code to the console to allow testing the flow. Use a valid `RESEND_API_KEY` and `EMAIL_FROM` for real email delivery.

## Deployment
### General guidance
- **Frontend:** Build with `cd client && npm run build` and deploy the `client/dist` output to any static host (Vercel, Netlify, Nginx, CDN). Set `VITE_*` env vars at build time and point `VITE_API_URL` to the deployed API.
- **Backend:** Deploy the Express server to a Node-capable host (Render, Railway, Fly.io, VPS, container). Set all `server/.env` variables, use production MongoDB/Neon URIs, strong JWT secrets, and `NODE_ENV=production`.
- **HTTPS:** Required in production (secure cookies, transport security). Terminate TLS at your proxy/host.
- **CORS/Cookies:** Set `CLIENT_URL` to the exact frontend origin. Because auth uses `httpOnly` cookies with `credentials: true`, frontend and API origins/config must match correctly.

### Example (split deploy)
1. Deploy API (e.g. Render/Railway) with MongoDB Atlas + Neon Postgres, `CLIENT_URL=https://your-site.example`.
2. Deploy Vite build (e.g. Vercel/Netlify) with `VITE_API_URL=https://your-api.example/api`.
3. Update `sitemap.xml`/OG URLs and Resend sender/domain settings for production.

## Security features (implemented and explained)

### 1. Rate limiting (strict limits + lockout)
- **What:** Request throttling is enforced with `rate-limiter-flexible` using a **Neon Postgres** store (durable/shared counters). Dedicated limiters protect **login, register, verification/2FA, resend-code, password reset (limiter provisioned), and contact/booking/message** endpoints, applied per IP and per email where applicable. A general API limiter is also applied.
- **Behavior:** When exceeded, the API returns **HTTP 429** with a `Retry-After` header and a retry message. Temporary **block/lockout durations** are configured after repeated failures/hits.
- **Note:** Uses Neon/Postgres for durable rate limiting when available, with an in-memory fallback when no DB is configured (Postgres-ready refactor, no live DB required for now).

### 2. Two-step verification (2FA) via email
- **What:** After a correct password, the server generates a **6-digit code** using `crypto.randomInt`, stores only a **hashed** code with a **5-minute expiry** and **max 5 attempts**, and sends it via **Resend** (`RESEND_API_KEY`/`EMAIL_FROM` from env; never hardcoded).
- **Flow:** Login returns a short-lived pending verification token; the session/access tokens are issued **only after** successful code verification. Resend is supported but **rate-limited**.

### 3. JWT session that ends when the browser/tab closes
- **Access token:** Short-lived (**15 min**, in-memory only on the client; never stored in localStorage/sessionStorage) sent as `Authorization: Bearer` for API calls.
- **Refresh token:** Stored in an **httpOnly, Secure (in production), SameSite=Strict session cookie** with **no maxAge/expires**, so the browser drops it on close. Exposed only to `/api/auth` paths.
- **Server-side sessions:** Session IDs and refresh token identifiers (jti) are stored server-side (Postgres when configured, in-memory otherwise). On **logout or invalidation**, the session is deleted/invalidated and the presented access token is **blacklisted immediately**.
- **Close/logout beacon:** On `pagehide` and `visibilitychange` (hidden), the client calls `navigator.sendBeacon('/api/auth/logout')` to invalidate the server session.
- **Heartbeat backup:** Client sends a heartbeat every **30s**; server tracks `lastHeartbeat` and a sweeper invalidates sessions with **no heartbeat for 90s** (and refresh rejects stale sessions).
- **Rotation & reuse detection:** Refresh tokens are **rotated on every use**; if a presented refresh jti does not match the current session jti, **reuse is detected** and sessions are revoked.

### 4. Baseline hardening
- **Headers & CORS:** `helmet` enabled; strict CORS limited to `CLIENT_URL` with credentials.
- **Passwords:** Hashed with **bcrypt** (cost factor 12).
- **Validation & sanitization:** Request validation with **zod** schemas and HTTP parameter pollution protection (`hpp`) to reduce injection risk. Centralized error handling avoids leaking internals in production.
- **CSRF mitigation:** `SameSite=Strict` cookies for auth, credentialed CORS restrictions, and origin checks on cookie-based auth endpoints.
- **File uploads:** Admin upload endpoint validates allowed MIME types and enforces size limits before storing (secure file-upload validation). Portfolio media in this build is primarily managed as **static repo assets/URLs** (per project choice).
- **HTTPS & secrets:** Cookies marked `Secure` in production; HTTPS expected in production; all secrets/keys loaded from environment variables (`.env`), never hardcoded.
- **Error handling:** Centralized not-found and error middleware with safe production responses.

## Portfolio media note
Per project decision, demo/portfolio images are committed as **static repo assets** (e.g. `client/public/assets/portfolio`) and portfolio items can reference repo paths or external URLs. A validated admin upload endpoint is included for secure server-side handling when needed.

## Testing the implementation
- `client`: `npm run build` verifies the frontend compiles.
- `server`: modules load and server starts in **in-memory mode without a live DB** when `DATABASE_URL` is unset/unavailable; configure `DATABASE_URL` (Neon/Postgres) for persistent storage/rate limiting.
- End-to-end auth requires configured env (JWT/Resend for real email delivery). In development the 2FA code is logged on email-send fallback to enable flow testing.
