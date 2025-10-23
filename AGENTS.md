# Repository Guidelines

## Project Structure & Module Organization
- Source lives under `app/` using Next.js App Router; localized routes sit in `app/(locale)/` with parallel directories for `en` and `zh`.
- Shared utilities belong in `lib/`, configuration JSON in `config/`, static assets in `public/`, and docs remain in `docs/` for reference material.
- Content strings live in `content/en.json` and `content/zh.json`; keep keys aligned so fallback logic remains predictable.

## Build, Test, and Development Commands
- `npm install` – install dependencies (Node 18+ recommended).
- `npm run dev` – launch the Next.js dev server with hot reload.
- `npm run lint` – run ESLint with the Next.js config and Tailwind plugins.
- `npm run build` – create the production bundle and prerender pages.
- `npm run test` – execute Vitest unit/interaction suites in JSDOM.
- `npm run test:e2e` – run Playwright end-to-end checks (uses `playwright.config.ts`).

## Coding Style & Naming Conventions
- TypeScript is mandatory; prefer explicit props/interfaces and avoid `any`.
- Components use PascalCase files within `app/` or `components/`; hooks live in `lib/hooks` with camelCase names prefixed by `use`.
- Follow Tailwind utility-first classes for layout; extract shared styles into `globals.css` or `tailwind.config.ts` theme tokens.
- Run `npm run lint` and `npm run format` (Prettier) before pushing; CI blocks non-formatted code.

## Testing Guidelines
- Unit and component tests target ToolCard logic, language toggles, and navigation anchors using Testing Library queries.
- Mock async flows with `vi.fn()` and ensure loading states render for ≥600 ms per PRD.
- End-to-end flows cover desktop and mobile viewports, verifying locale redirects, SEO metadata, and form submissions.
- Investigate flaky Playwright specs immediately; rerun once locally before muting.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `docs:`…) so release notes can be generated automatically.
- Squash noisy WIP commits before opening the PR; each PR should link a tracking ticket or PRD section.
- PR description must include a summary, test plan (`npm run test`, `npm run test:e2e`), and any screenshots for UI changes.
- Request review from both product and engineering leads when touching shared configs or i18n content.

## Internationalization & SEO Notes
- Always update both locale JSON files; if a translation is unknown, mirror the English copy and tag the TODO.
- When adding pages, extend `config/seo.config.json` for each locale and verify canonical/hreflang links via `npm run build` locally before merge.
