# Kemmstudio Production Website (Frontend)

**Short/display name:** Kemmstudio Production  
**Full name:** Kuria Entertainment Music and Movie Studio

Frontend for a creative studio focused on Kuria music, entertainment, sports, and sports-centre content. Services include music production, video production, film production, videography, and photography.

- **Frontend:** React (Vite), React Router, Framer Motion, Axios (`client/`)
- **Backend:** hosted separately → https://github.com/manu-kali3/kemmstudio-backend

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
├── vercel.json             # Vercel build config (deploys client)
└── README.md
```

## Environment variables
Copy the example and fill in values:

```bash
cp client/.env.example client/.env
```

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `https://your-backend.example.com/api`) |
| `VITE_SITE_URL` | Public site URL |
| `VITE_STUDIO_NAME` | Display name |
| `VITE_STUDIO_FULL_NAME` | Full studio name |
| `VITE_WHATSAPP_LINK` | WhatsApp click-to-chat URL |
| `VITE_FACEBOOK_LINK` | Facebook page URL |
| `VITE_INSTAGRAM_LINK` | Instagram profile URL |

## Setup & run locally
### Prerequisites
- Node.js 20+ and npm
- Running backend API (see backend repo) and its `VITE_API_URL`

### Install
```bash
cd client
npm install
```

### Development
```bash
cd client
npm run dev
```
- Frontend: `http://localhost:5173`

### Build
```bash
cd client
npm run build
```
Output: `client/dist`

## Deployment (Vercel)
- Repo includes `vercel.json` for building `client/` from the repo root, and `client/vercel.json` for SPA rewrites.
- Recommended Vercel settings: **Root Directory** = `client` (auto-detect Vite, output `dist`), or use root config as-is.
- Set env vars in Vercel: `VITE_API_URL`, `VITE_SITE_URL`, `VITE_STUDIO_NAME`, `VITE_STUDIO_FULL_NAME`, and social links.
- Ensure the backend `CLIENT_URL`/CORS allows your Vercel domain.

## Backend
The Express/Postgres API (auth, 2FA, portfolio, bookings/messages, admin, uploads) is maintained separately:
- https://github.com/manu-kali3/kemmstudio-backend

Configure and deploy it independently, then point `VITE_API_URL` to the deployed API.
