# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repo contains the Boise Code Camp website — an annual free community tech conference. There are **two separate implementations** side by side:

- **`source/`** — Original Vue 3 SPA built with Vite. This is the currently deployed site.
- **`source-astro/`** — In-progress migration to Astro 6 with Vue 3 components (verified with Playwright).

The built output is pushed to `boisecodecamp.github.io/` (a git submodule pointing to the GitHub Pages repo).

## Commands

### Vue SPA (`source/`)

```bash
cd source
npm install
npm run serve      # dev server at http://localhost:8080
npm run build      # outputs to source/dist
npm run lint       # ESLint with auto-fix
```

### Astro site (`source-astro/`)

```bash
cd source-astro
npm install
npm run dev        # dev server
npm run build      # production build
npx playwright test  # run migration verification tests
```

## Deployment

- **CI trigger:** Push to the `production` branch runs `.github/workflows/build-client.yml`, which builds `source/` and pushes `source/dist` to the GitHub Pages repo.
- The `static` branch holds a pre-built static version.
- The `main` branch is the integration branch.

## Architecture

### Shared patterns (both `source/` and `source-astro/`)

Both implementations share the same structure and many of the same files:

- **`AppState.js`** — Central reactive state (Vue `reactive()`). Holds all app config: event details, Sessionize API key (`SESSIONIZE_KEY`), sponsor list, speaker/session arrays, etc. This is the single source of truth — update year/event info here first.
- **`SessionizeService.js`** — Fetches speaker and session data from the Sessionize API (`https://sessionize.com/api/v2/{key}/view/All`). Results are cached in `localStorage` for 24 hours using `STORAGE_KEY` from AppState.
- **`services/`** — Service layer handles all external data fetching. Components never fetch directly.
- **`pages/`** — Top-level route components (Vue) or Astro page files.
- **`components/`** — Reusable Vue components (Navbar, Hero, SessionList, Speaker, Sponsors, etc.).

### Astro-specific

- `source-astro/src/layouts/Layout.astro` — Root HTML shell; imports global SCSS, MDI icons, Bootstrap JS, and mounts `Init.vue` with `client:load` to trigger Sessionize data loading on the client.
- `source-astro/src/components/Init.vue` — Invisible component that calls `SessionizeService.loadData()` on mount. Required on every page for data to populate.

### Styling

- Bootstrap 5 for layout/utilities.
- Custom SCSS in `src/assets/scss/`.
- Material Design Icons via `mdi mdi-*` CSS classes.
- CSS custom properties: `--theme-info` (#66fcf1), `--theme-dark` (#1f2833).

## Annual Update Checklist

When updating for a new year, the key changes are in `AppState.js`:

- `STORAGE_KEY`, `SESSIONIZE_KEY`, `cfs`, `register`, `currentYear`, `event.*`, `keynote`, `sponsors`
