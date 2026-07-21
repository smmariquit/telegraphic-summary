# AGENTS.md

Paste a dense data table, get a plain-language readback with highlighted cells and patterns, powered by an OpenAI two-step prompt.

## Stack

Next.js 16 (App Router, static export, React Compiler), React 19, TypeScript, Tailwind CSS 4, Cloudflare Pages + Pages Functions, OpenAI SDK.

## Key files

- `src/app/page.tsx`: single client page, all UI state (tabs, text size, analysis flow).
- `src/components/`: TableInput, HighlightedTable, InterpretationDisplay, Guide.
- `src/types/index.ts`: TableData and AnalysisResult types, shared with the function.
- `functions/api/analyze.ts`: Cloudflare Pages Function, POST /api/analyze, calls OpenAI, needs `OPENAI_API_KEY`.
- `.github/workflows/`: ci.yml (install + build), deploy-cloudflare.yml (wrangler deploy), pr-checks.yml, stale.yml.
- `USER_GUIDE.md`: end-user docs.

## Commands

- Install: `npm install`
- Dev: `npm run dev` (http://localhost:3000)
- Build: `npm run build` (static export to `out/`)
- Lint: `npm run lint`
- Deploy (CI does this): `wrangler pages deploy out --project-name=telegraphic-summary`

No test suite; `npm test` is a no-op in CI via `--if-present`.

## Gotchas

- `output: "export"` in next.config.ts: no Next.js API routes or server components with dynamic data. The only backend is the Pages Function in `functions/`, which exists outside the Next build and is deployed alongside `out/` by Cloudflare Pages.
- `npm run dev` does not serve `/api/analyze`; that route only runs under the Cloudflare Functions runtime, which also needs `OPENAI_API_KEY` (missing key returns 500).
- `functions/api/analyze.ts` imports types from `../../src/types`, so type changes affect both frontend and function.
- The function expects the model to return strict JSON; prompt edits must keep the exact response format described in the prompt text.
- Secrets live in two places: GitHub Actions has `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; the `OPENAI_API_KEY` secret lives in Cloudflare Pages, set via `wrangler pages secret put`.
