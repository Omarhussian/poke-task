# Pokédex Browser

A responsive Pokémon browser built with **React + TypeScript**, using the public [PokéAPI](https://pokeapi.co).

It implements the Front-End assessment requirements:

- **Two list views**
  - **Pagination** — grid of cards with numbered pagination + prev/next controls
  - **Load More** — grid that appends the next batch, de-duplicated
- **Dedicated detail route** (`/pokemon/:id`) — name, sprite, height, weight, types (+ base stats). Not a modal/drawer.
- **Loading, error & retry** states throughout
- **Fully responsive** across desktop, tablet and mobile

## Tech & approach

| Concern | Choice |
| --- | --- |
| Build | Vite + React 18 + TypeScript |
| Routing | React Router v6 (separate detail route) |
| Data | **React Query** (caching, `keepPreviousData`, infinite query) |
| Resilience | **Error Boundaries** + `withAsyncBoundary` (Suspense) HOCs |
| Layout | **Tailwind CSS** (`tailwind.config.ts`) for the app shell, spacing & animations |
| Component styling | **CSS Modules** per component |
| Composition | **Higher-Order Components** (`withErrorBoundary`, `withAsyncBoundary`) |

### Styling split
- **Tailwind** drives the app *shell* — the responsive container, flex layout, spacing and entrance animations (see `tailwind.config.ts` and the utilities in `Layout`).
- **CSS Modules** own each component's visual detail (cards, badges, buttons, detail page) as well as the responsive grid columns (`PokemonGrid.module.css`), keeping styles scoped and colocated.

## Project structure

```
src/
├─ api/                # PokéAPI service + types (separation of concerns)
│  ├─ pokemon.ts       # fetch + normalize
│  └─ types.ts
├─ hooks/              # React Query hooks (page / infinite / detail)
├─ hocs/               # withErrorBoundary, withAsyncBoundary
├─ components/         # Reusable UI (Card, Grid, Pagination, LoadMore, …) + .module.css
├─ views/              # PaginationView, LoadMoreView, DetailPage, NotFound
├─ utils/              # formatting helpers
├─ styles/global.css   # Tailwind directives + design tokens
├─ App.tsx             # routes
└─ main.tsx            # providers (QueryClient, Router, ErrorBoundary)
```

## Getting started

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build
npm run preview    # preview the build
npm run lint       # ESLint
npm test           # Vitest + Testing Library
```

## Deployment

SPA rewrites are pre-configured for both platforms:
- **Vercel** — `vercel.json`
- **Netlify** — `public/_redirects`

> Deployment is intentionally left to be completed manually.

## Testing

Unit tests (Vitest + Testing Library) cover the API normalizers, the
`Pagination` component, and `PaginationView` (URL-synced page state and the
error/retry path). The pagination page lives in the `?page=` search param, so
it survives navigating to a detail page and back, and pages are shareable.

## Notes / what I'd do next

- Add a search / filter bar and type filtering.
- Convert the "Load More" view to auto-load via `IntersectionObserver`.
