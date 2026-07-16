# Telegraphic Summary

Paste a dense data table. Get a short, plain-language readback. Runs as a static Next.js export on Cloudflare Pages; `/api/analyze` is a Pages Function.

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
