# AGENTS.md

Paste a research data table with mean-separation letters, state the objective, get the telegraphic summary (Bautista and Bondad 1997, Chapter 11, pp. 80–85) and a model-written draft of the sentences.

## Stack

Next.js 16 (App Router, React Compiler), React 19, TypeScript, Tailwind CSS 4, OpenAI SDK. Hosted on Vercel at telsum.stimmie.dev.

## Key files

- `src/lib/telegraphic.ts`: steps 1 and 2 of the method, deterministic. Parses `45ab` cells, builds `A=B>C=D` lines from letters, collapses equal rows, picks highlight cells. No model.
- `src/lib/telegraphic.test.ts`: `npm test`. Asserts Table 5 of the book reproduces the book's groups, plus overlap, trend, and lower-is-better cases.
- `src/app/api/analyze/route.ts`: POST /api/analyze. Same-site only (Sec-Fetch-Site or Origin), 32 KB body cap, validation from `prose.ts`, in-memory rate limit of 20 per 10 minutes per address. Returns `{ sentences, paragraph }`. Needs `OPENAI_API_KEY`.
- `src/app/page.tsx`: the worksheet. Choose a table, state the objective, start. Pushes to `/t/<sample>?step=1&o=...` or `/t/custom?d=<base64url json>&o=...`.
- `src/app/t/[id]/page.tsx`: the three stages for one table, step in the URL. Step 3 calls the API once. Print button.
- `src/app/guide/page.tsx`: the Guide.
- `src/components/Shell.tsx`: header, nav links, text size, footer. Used by `layout.tsx`.
- `src/lib/samples.ts`: the five sample tables with slugs, and the custom-table URL codec.
- `src/lib/csv.ts`: delimited text to a table. Quoted fields, doubled quotes, newlines in quotes, CRLF, comma or tab or semicolon. Tested in `csv.test.ts`.
- `instrumentation-client.ts`, `instrumentation.ts`, `sentry.*.config.ts`, `src/app/error.tsx`, `src/app/global-error.tsx`: Sentry. Disabled without `NEXT_PUBLIC_SENTRY_DSN`. The route handler reports failures with tags.
- `src/lib/prose.ts`: step 3 prompt, body validation with size caps, response parser. Tested in `prose.test.ts` with a recorded response, no key needed.
- `src/components/`: TableInput (manual grid, CSV, five sample tables), HighlightedTable, InterpretationDisplay (stages 1.0, 2.0, 3.0), Guide.
- `src/types/index.ts`: shared types, used by the function too.
- `src/app/tokens.css`, `src/app/globals.css`: design tokens (Hallmark stamp at the top of tokens.css) and the few shared classes (`.field`, `.btn`, `.link`, `.stage`, `.cell--top`).
- `USER_GUIDE.md`: end-user docs, with page references to the book.
- `.github/workflows/`: ci.yml (check job: lint, typecheck, format, tests; then build), pr-checks.yml (semantic PR title, closing keyword), stale.yml. Dependabot weekly. Vercel deploys from GitHub on push to main.
- `src/lib/photos.ts`, `public/photos/*.jpg`: Wikimedia Commons photographs of the sample crops (cucumber, peanut, broiler, tapuy, mango) with author and licence. `Photo` renders one with its credit. No page scans of the book: quote it, cite the page.

## Commands

- Install: `npm install`
- Dev: `npm run dev` (http://localhost:3000)
- Test: `npm test`
- Everything CI runs: `npm run check` (lint, typecheck, prettier check, tests)
- Format: `npm run format`
- Build: `npm run build`
- Lint: `npm run lint`
- Deploy: push to main; Vercel builds it.

## Rules

- Faithful to the book. Steps 1 and 2 stay deterministic. Do not move the comparison logic into the prompt. Anything the book does not settle (overlapping letters, tables without letters, two-factor tables) is flagged to the user, not guessed.
- Prompt edits keep the page references and the strict JSON shape `{ sentences, paragraph }`.
- Credits: 1997 edition is Bautista and Bondad (Nestor D. Bondad). 2012 edition is Bautista, Rosario, and Bautista Jr.
- Prose in UI and docs: no em dashes, no AI filler.

## Gotchas

- Local dev needs `OPENAI_API_KEY` in `.env.local` for stage 3; stages 1 and 2 work without it.
- `**/*.test.ts` is excluded from tsconfig so the `./telegraphic.ts` import (needed by Node's type stripping) does not break `next build`.
- Text size is a `data-size` attribute on `<html>` scaling root font-size, not per-component class maps.
- `OPENAI_API_KEY` lives in the Vercel project (Production and Preview). The old Cloudflare Pages project still exists but is not production.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
