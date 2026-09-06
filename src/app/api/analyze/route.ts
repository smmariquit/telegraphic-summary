// src/app/api/analyze/route.ts
//
// Step 3 of the telegraphic summary: the model writes prose from the
// finished summary. Steps 1 and 2 happen in the browser. The prompt and the
// parser live in src/lib/prose.ts so they can be tested here without a key.
//
// Protection: same-site requests only, size caps on the body, and a small
// per-address rate limit. The key belongs to whoever deployed this.

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import OpenAI from "openai";
import { buildPrompt, parseProse, SYSTEM, validateBody, type ProseRequest } from "@/lib/prose";

const MODEL = "gpt-4o-mini";
const MAX_BODY_BYTES = 32_000;

// ponytail: in-memory per-instance limiter. Enough to stop a loop or a script.
// Move to KV/Upstash if the site ever has real traffic.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

function sameSite(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin" || fetchSite === "same-site";
  // Older clients: fall back to comparing Origin with Host.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return NextResponse.json(
      { error: "The writing service has no OPENAI_API_KEY set in the project environment." },
      { status: 500 },
    );
  }

  if (!sameSite(request)) {
    return NextResponse.json({ error: "This endpoint serves the worksheet page only." }, { status: 403 });
  }

  const ip =
    request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Table too large for the writing service." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }
  const problem = validateBody(body);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  try {
    const openai = new OpenAI({ apiKey });
    const res = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0,
      max_tokens: 900,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildPrompt(body as ProseRequest) },
      ],
    });
    const prose = parseProse(res.choices[0]?.message.content);
    if (!prose) {
      console.error("Unreadable model response");
      Sentry.captureMessage("Unreadable model response", { level: "warning", extra: { model: MODEL } });
      return NextResponse.json({ error: "The model returned an unreadable answer. Try again." }, { status: 502 });
    }
    return NextResponse.json(prose);
  } catch (error) {
    console.error("Analysis error:", error);
    Sentry.captureException(error, { tags: { route: "analyze", model: MODEL } });
    // Pass the provider's own message through (no credits, invalid key, rate limit) so the page can say why.
    const e = error as { status?: number; message?: string };
    const upstream = typeof e?.status === "number" && e.status >= 400 && e.status < 600;
    return NextResponse.json(
      { error: upstream ? `Writing service: ${e.message}` : "Failed to write the interpretation" },
      { status: upstream ? 502 : 500 },
    );
  }
}
