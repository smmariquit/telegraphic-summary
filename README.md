# Telegraphic Summary

Paste a research data table with mean-separation letters, state the objective, and get the telegraphic summary of Bautista and Bondad (1997, *Technical Writing for Beginners*, Chapter 11) plus a model-written draft of the sentences. Steps 1 and 2 (row lines, grouping) are deterministic and run in the browser. Step 3 (prose) runs in the `/api/analyze` Pages Function. Static Next.js export on Cloudflare Pages.

## Local

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For the analyze API locally you need `OPENAI_API_KEY` in the environment the Functions runtime can read (see Cloudflare section below for production).

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint |

## Deploy (Cloudflare Pages)

GitHub Actions workflow `.github/workflows/deploy-cloudflare.yml` builds and runs:

`wrangler pages deploy out --project-name=telegraphic-summary`

### GitHub Actions secrets

| Name | Purpose |
|------|---------|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy |
| `CLOUDFLARE_ACCOUNT_ID` | Account for Pages |

### Cloudflare Pages secrets (not GitHub)

| Name | Purpose |
|------|---------|
| `OPENAI_API_KEY` | Required by `functions/api/analyze.ts` |

Set it for production (and preview if you use preview Functions):

```bash
wrangler pages secret put OPENAI_API_KEY --project-name=telegraphic-summary
```

Or: Cloudflare dashboard → Pages → telegraphic-summary → Settings → Variables and Secrets.

Without `OPENAI_API_KEY`, `POST /api/analyze` returns 500.

Production: https://telegraphic-summary.pages.dev

## Stack

Next.js (static export), Tailwind, Cloudflare Pages + Pages Functions, OpenAI API.
