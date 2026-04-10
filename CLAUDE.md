# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173 (also accessible on LAN)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Architecture

This is a single-page React + TypeScript + Vite + Tailwind CSS v4 tattoo studio website.

**Routing** is handled manually (no React Router). `App.tsx` uses `window.history.pushState` and a `popstate` listener to switch between three "pages": `home`, `calendar` (`/prenota`), and `artists` (`/artisti`). The active page component is rendered inline inside `TattooStudio` (the root component in `App.tsx`).

**Pages/Components:**
- `App.tsx` — Root component + entire home page (hero, studio slider, portfolio, services, testimonials, FAQ, contact/map). Contains `TattooStudio` as the default export.
- `ArtistsPage.tsx` — Artists listing with mini-cards and full profile view (with lightbox gallery). All artist data is defined as a `ARTISTS` constant in this file.
- `CalendarPage.tsx` — Multi-step booking form (artist → date → time → details → confirmation).

**Shared color palette** is defined as a `COLORS` constant in each file (same values: sage, sand, leather, charcoal, crimson). It is not shared via a module — each file has its own copy.

**Assets** live in `src/elements/`: tattooer profile photos (`tattooer1-3.png`), portfolio works (`tattoo1-1` through `tattoo3-3.png`), studio photos (`studio1-3.webp`), and hero images (`tat1-3.PNG`).

**Tailwind** is loaded via the `@tailwindcss/vite` plugin (v4 approach — no PostCSS config needed). Global CSS is minimal (`src/index.css` only imports tailwind and sets `scroll-behavior: smooth`).

**Deployment** targets Vercel (there is a `vercel.json` implied by the routing setup and git history).
