
# QuranNest

QuranNest is a responsive Quran reading web application (Next.js + TypeScript) that includes:
- full Quran text (Arabic + English translation)
- verse-level audio playback
- search and navigation (surah / juz / page)
- font and reading customizations and light/dark/sepia themes

This repository contains a frontend Next.js app and a small backend API used to serve chapter data and audio URLs.

---

## Structure

```text
quran-web-app/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │   └── reader/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   ├── top-header.tsx
│   │   │   ├── left-sidebar.tsx
│   │   │   ├── icon-sidebar.tsx
│   │   │   ├── verse-display.tsx
│   │   │   ├── right-sidebar.tsx
│   │   │   ├── search-modal.tsx
│   │   │   └── feature-card.tsx
│   │   ├── hooks/
│   │   │   └── useQuran.ts
│   │   ├── types/
│   │   │   └── quran.ts
│   │   └── utils/
│   │       └── cn.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── postcss.config.js
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── controllers/
│   │   │   └── quranController.ts
│   │   ├── services/
│   │   │   ├── quranDataService.ts
│   │   │   └── audioService.ts
│   │   └── routes/
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/
└── README.md
```

## Quick Start

Prerequisites:
- Node.js 18+ (recommended)
- npm or Yarn

1) Install and run backend (API)

```bash
cd quran-web-app/backend
npm install
npm run dev
```

By default the backend runs on `http://localhost:5000` (check `package.json` scripts).

2) Install and run frontend (Next.js)

```bash
cd quran-web-app/frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

To run both concurrently open two terminals (one for backend, one for frontend).

---

## Project Structure

Top-level layout:

```
quran-web-app/
	├─ frontend/        # Next.js app (TypeScript + Tailwind)
	└─ backend/         # Minimal Node/Express TypeScript API
```

Frontend highlights (src):
- `src/app/reader/page.tsx` — main reader page and audio player
- `src/components/` — UI components (TopHeader, LeftSidebar, VerseDisplay, RightSidebar, SearchModal)
- `src/hooks/useQuran.ts` — API hooks for chapters, chapter detail, and search

Backend highlights:
- `src/controllers/quranController.ts` — API controllers
- `src/services/quranDataService.ts` — chapter/verse data resolver and audio URL helpers

---

## Environment & Configuration

The app reads a few environment variables (check `frontend/.env` or `backend/.env` if present). Typical variables:

- `NEXT_PUBLIC_API_URL` — frontend: base URL for backend API (defaults to localhost candidates)
- `PORT` — backend server port override

If you run both services locally and keep defaults, no additional env configuration is required.

---

## Scripts

Common scripts are defined in each package's `package.json`.

Frontend (from `quran-web-app/frontend`):
- `npm run dev` — run Next.js dev server
- `npm run build` — production build
- `npm start` — start Next.js production server

Backend (from `quran-web-app/backend`):
- `npm run dev` — run backend in dev mode (ts-node / nodemon)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run production server from `dist/`

---

## Development Notes

- Audio playback is implemented with the native HTML5 `Audio` element and uses per-verse audio URLs. The frontend preloads metadata and resets currentTime when playback ends.
- The `useQuran` hooks implement a short API base resolution and include an AbortController timeout for reliability.
- Theme support (light / dark / sepia) is implemented via `src/context/theme-context.tsx` and persisted to `localStorage`.

If you change API endpoints, update the `NEXT_PUBLIC_API_URL` or the logic in `useQuran.ts`.

---

## Troubleshooting

- If audio fails to load with CORS errors, ensure the backend provides proper CORS headers and `audio.crossOrigin = 'anonymous'` is allowed.
- If chapters fail to load, inspect the backend logs and verify `GET /api/chapters` responds correctly.
- For TypeScript build errors, run `npm run build` in the failing package to get the compiler messages.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo and create a feature branch
2. Add/modify code and tests
3. Run linting and tests
4. Create a pull request describing the change

Please follow the existing code style (Tailwind utilities, TypeScript types, React hooks).

---

## License

Please see the project `LICENSE` file at the repository root for licensing details.

---

If you want, I can also:
- add a small `Makefile`/`run-dev` script to launch both servers concurrently
- add a Dockerfile + docker-compose for local dev
- add a brief architecture diagram

Feel free to tell me which extras you'd like and I'll add them.
