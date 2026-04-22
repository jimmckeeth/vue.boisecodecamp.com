# BoiseCodeCamp - Primary Site

The primary website for [Boise Code Camp](https://boisecodecamp.com), a free annual community tech conference in Boise, ID.

## Repository Layout

```
source-astro/   Astro 6 + Vue 3 — primary production site
legacy/         Vue 3 SPA — original site (for reference)
inf/            Pulumi infrastructure (Azure)
boisecodecamp.github.io/  Built output (git submodule → GitHub Pages)
```

---

## Updating for a New Year

All year-specific content lives in `source-astro/src/AppState.js`. Update these fields:

| Field                          | Description                                                       |
| ------------------------------ | ----------------------------------------------------------------- |
| `STORAGE_KEY`                  | Bump the year (e.g. `BOISECODECAMP27`) to bust localStorage cache |
| `SESSIONIZE_KEY`               | New key from Sessionize for the year's event                      |
| `cfs`                          | Call-for-speakers URL                                             |
| `register`                     | Eventbrite registration URL                                       |
| `currentYear`                  | Four-digit year string                                            |
| `event.date`, `event.dTime`    | Event date                                                        |
| `event.venue`, `event.address` | Venue details                                                     |
| `keynote`                      | Uncomment and fill in keynote speaker block                       |
| `sponsors`                     | Update sponsor list                                               |

---

## Development

### Production Astro site (`source-astro/`)

```bash
cd source-astro
npm install

# Local dev server (http://localhost:4321)
npm run dev

# Production build
npm run build

# Local preview of production build
npm run preview
```

### Legacy Vue SPA (`legacy/`)

```bash
cd legacy
npm install

# Local dev server (http://localhost:8080 by default)
npm run serve

# Lint
npm run lint
```

---

## Testing

Tests live in `source-astro/tests/` and use Playwright. They run against a production preview build (not the dev server).

```bash
cd source-astro

# Run all tests (builds the site first, then serves it)
npx playwright test

# Run a specific test file
npx playwright test tests/migration.spec.js

# Run with visible browser
npx playwright test --headed

# Install browsers (first time only)
npx playwright install chromium
```

The `playwright.config.js` automatically runs `npm run build && npm run preview` before the suite. If a server is already running on port 4321, it reuses it.

---

## Deployment

Deployment is triggered by pushing to the **`production`** branch. GitHub Actions (`.github/workflows/build-client.yml`) then:

1. Builds `source-astro/` with `npm ci && npm run build`
2. Pushes the contents of `source-astro/dist/` to the GitHub Pages repository

```bash
# Merge your changes to production and push
git checkout production
git merge main
git push origin production
```

The site is live at [boisecodecamp.com](https://boisecodecamp.com) within a few minutes of the workflow completing.
