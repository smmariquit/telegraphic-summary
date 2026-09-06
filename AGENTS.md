# AGENTS.md

Paste a research data table with mean-separation letters, state the objective, get the telegraphic summary (Bautista and Bondad 1997, Chapter 11, pp. 80–85) and a model-written draft of the sentences.

## Stack

Next.js 16 (App Router, static export, React Compiler), React 19, TypeScript, Tailwind CSS 4, Cloudflare Pages + Pages Functions, OpenAI SDK.

## Key files

- `src/lib/telegraphic.ts`: steps 1 and 2 of the method, deterministic. Parses `45ab` cells, builds `A=B>C=D` lines from letters, collapses equal rows, picks highlight cells. No model.
- `src/lib/telegraphic.test.ts`: `npm test`. Asserts Table 5 of the book reproduces the book's groups, plus overlap, trend, and lower-is-better cases.
- `functions/api/analyze.ts`: Cloudflare Pages Function, POST /api/analyze. Step 3 only. Receives objective, table, finished summary, returns `{ sentences, paragraph }`. System prompt encodes the book's rules with page numbers. Needs `OPENAI_API_KEY`.
- `src/app/page.tsx`: single client page. Objective (required), table input, results as three stages.
- `src/components/`: TableInput (manual grid, CSV, five sample tables), HighlightedTable, InterpretationDisplay (stages 1.0, 2.0, 3.0), Guide.
- `src/types/index.ts`: shared types, used by the function too.
- `src/app/tokens.css`, `src/app/globals.css`: design tokens (Hallmark stamp at the top of tokens.css) and the few shared classes (`.field`, `.btn`, `.link`, `.stage`, `.cell--top`).
- `USER_GUIDE.md`: end-user docs, with page references to the book.
- `.github/workflows/`: ci.yml (install + build), deploy-cloudflare.yml (wrangler deploy on push to main).

## Commands

- Install: `npm install`
- Dev: `npm run dev` (http://localhost:3000)
- Test: `npm test`
- Build: `npm run build` (static export to `out/`)
- Lint: `npm run lint`
- Deploy (CI does this on push to main): `wrangler pages deploy out --project-name=telegraphic-summary`

## Rules

- Faithful to the book. Steps 1 and 2 stay deterministic. Do not move the comparison logic into the prompt. Anything the book does not settle (overlapping letters, tables without letters, two-factor tables) is flagged to the user, not guessed.
- Prompt edits keep the page references and the strict JSON shape `{ sentences, paragraph }`.
- Credits: 1997 edition is Bautista and Bondad (Nestor D. Bondad). 2012 edition is Bautista, Rosario, and Bautista Jr.
- Prose in UI and docs: no em dashes, no AI filler.

## Gotchas

- `output: "export"`: no Next API routes. The only backend is `functions/api/analyze.ts`, deployed alongside `out/` by Cloudflare Pages.
- `npm run dev` does not serve `/api/analyze`; stage 3 shows an error locally unless run under the Cloudflare Functions runtime with `OPENAI_API_KEY`.
- `**/*.test.ts` is excluded from tsconfig so the `./telegraphic.ts` import (needed by Node's type stripping) does not break `next build`.
- Text size is a `data-size` attribute on `<html>` scaling root font-size, not per-component class maps.
- Secrets: GitHub Actions has `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; `OPENAI_API_KEY` lives in Cloudflare Pages, set via `wrangler pages secret put`.
