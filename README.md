# Telegraphic Summary

Paste a research data table with mean-separation letters, state the objective, and get the telegraphic summary of Bautista and Bondad (1997, *Technical Writing for Beginners*, Chapter 11) plus a model-written draft of the sentences. Steps 1 and 2 (row lines, grouping) are deterministic and run in the browser. Step 3 (prose) runs in the Next.js route `/api/analyze`.

Live at https://telsum.stimmie.dev (Vercel).

## Local

```bash
npm install
echo "OPENAI_API_KEY=sk-..." > .env.local
npm run dev
```

Open http://localhost:3000. Without `OPENAI_API_KEY`, steps 1 and 2 still work; step 3 shows an error.

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Next.js dev server |
| `npm test` | Checks the core against Table 5 of the book |
| `npm run check` | Lint, typecheck, Prettier check, tests. What CI runs. |
| `npm run format` | Prettier, write |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

## Deploy (Vercel)

Vercel builds from the `main` branch of the GitHub repo. Environment variables:

| Name | Where | Purpose |
|------|-------|---------|
| `OPENAI_API_KEY` | Vercel project, Production and Preview | Step 3, required |
| `NEXT_PUBLIC_SENTRY_DSN` | Vercel project | Error monitoring, browser and server. Optional; off when unset. |
| `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | Vercel project | Source map upload at build. Optional. |

Set with `vercel env add <NAME> production`. Deployments made before a variable existed need a redeploy.

## Error monitoring

Sentry via `@sentry/nextjs`. Browser errors, server errors, and failures inside `/api/analyze` are reported when a DSN is set. `src/app/error.tsx` and `global-error.tsx` catch render errors and show a retry. With no DSN the SDK is disabled and nothing leaves the site. To turn it on: create a Sentry project, add `NEXT_PUBLIC_SENTRY_DSN` to Vercel, redeploy.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, OpenAI SDK.

## Source

Bautista, O.K., and N.D. Bondad. 1997. Technical writing for beginners. ECRC and Associates, Los Baños, Laguna. ISBN 971-91902-0-5. Chapter 11, pages 80 to 85. See `USER_GUIDE.md`.
