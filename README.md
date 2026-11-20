# Kemmstudio Production Website (Frontend)

**Short/display name:** Kemmstudio Production  
**Full name:** Kuria Entertainment Music and Movie Studio

Frontend for a creative studio focused on Kuria music, entertainment, sports, and sports-centre content. Services include music production, video production, film production, videography, and photography.

- **Stack:** React (Vite), React Router, Framer Motion, Axios
- **Backend:** hosted separately → https://github.com/manu-kali3/kemmstudio-backend

## Project structure
```text
.
├── public/
│   ├── assets/brand/     # Hero and studio photography
│   ├── assets/portfolio/ # Gallery imagery / sample media
│   ├── favicon.svg       # Amber monogram mark
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── api/            # Axios client (in-memory access token, refresh handling)
│   ├── components/     # Layout, Navbar, Footer, UI primitives (Field, Alert,
│   │                   # Lightbox, ConfirmDialog, Reveal, Skeleton, …)
│   ├── context/        # Auth context (memory token, heartbeat, sendBeacon logout)
│   ├── data/site.js    # Site copy: nav, services, process, testimonials, contact
│   ├── pages/          # Home, About, Services, Portfolio, Contact, Auth, Admin
│   ├── styles/         # tokens.css → base.css → components.css → pages.css
│   └── utils/          # Small shared helpers (media type detection)
├── vercel.json         # SPA rewrites for Vercel
└── README.md
```

## Design system
The UI is a dark, cinematic theme built on CSS custom properties — edit the
tokens once and the whole site follows.

| File | Contains |
|---|---|
| `src/styles/tokens.css` | Colour, typography scale, spacing, radii, shadows, motion easings |
| `src/styles/base.css` | Reset, document defaults, utilities, a11y helpers, reduced-motion |
| `src/styles/components.css` | Buttons, cards, forms, nav, footer, dock, lightbox, tables |
| `src/styles/pages.css` | Hero, marquee, split sections, portfolio, auth and admin layouts |

- **Fonts:** Sora (display) + Inter (body), loaded from Google Fonts with system fallbacks.
- **Brand colour:** amber `#ff9f1c` with an ember gradient for emphasis.
- **Motion:** Framer Motion for entrances and overlays; everything is disabled automatically under `prefers-reduced-motion`.
- **Accessibility:** skip link, visible focus rings, labelled inputs with inline errors, keyboard-navigable lightbox/dialogs, 44px minimum touch targets.

Site copy (navigation, services, process, testimonials, contact details) lives in
`src/data/site.js`. `SAMPLE_WORK` in that file is a small placeholder gallery that
renders **only** when the API returns no portfolio items — delete it once real work
is published from the admin dashboard.

## Environment variables
Copy the example and fill in values:

```bash
cp .env.example .env
```

### Frontend (`.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `https://your-backend.example.com/api`) |
| `VITE_SITE_URL` | Public site URL |
| `VITE_STUDIO_NAME` | Display name |
| `VITE_STUDIO_FULL_NAME` | Full studio name |
| `VITE_WHATSAPP_LINK` | WhatsApp click-to-chat URL |
| `VITE_FACEBOOK_LINK` | Facebook page URL |
| `VITE_INSTAGRAM_LINK` | Instagram profile URL |
| `VITE_CONTACT_EMAIL` | Studio email shown in the footer and booking page |
| `VITE_CONTACT_PHONE` | Studio phone number |
| `VITE_CONTACT_LOCATION` | Studio location line |

## Setup & run locally
### Prerequisites
- Node.js 20+ and npm
- Running backend API (see backend repo) for full functionality

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```
- Frontend: `http://localhost:5173`

### Build
```bash
npm run build
```
Output: `dist/`

## Deployment (Vercel)
This is now a standalone Vite frontend at the repo root, so Vercel can auto-detect it (no custom root directory needed).

1. Import the repo in Vercel: https://vercel.com/new
2. Confirm defaults (or set):
   - **Framework Preset:** Vite
   - **Install Command:** `npm install`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Set environment variables in Vercel (e.g. `VITE_API_URL`, `VITE_SITE_URL`, and `VITE_*` branding/social vars).
4. Deploy.

`vercel.json` includes SPA rewrites so client-side routes work on refresh/direct links.

> The frontend builds and deploys without the backend, but API-dependent features (auth, portfolio data, bookings, admin) require `VITE_API_URL` to point to a running backend.

## Backend
The Express/Postgres API (auth, 2FA, portfolio, bookings/messages, admin, uploads) is maintained separately:
- https://github.com/manu-kali3/kemmstudio-backend

Configure and deploy it independently, then point `VITE_API_URL` to the deployed API.
