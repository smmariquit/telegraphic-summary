// src/app/api/analyze/route.ts
//
// Step 3 of the telegraphic summary (Bautista and Bondad 1997, p82):
// translate the grouped telegraphic lines into sentences, then a paragraph.
// Steps 1 and 2 are computed in the browser (src/lib/telegraphic.ts) and
// arrive here as text. The model writes prose only. It never decides which
// treatments differ.

import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { Prose, TableData } from "@/types";

type Body = {
  tableData: TableData;
  objective: string;
  summary: string;
  notes?: string[];
};

// Chapter 14, pages 108 to 113. Wordy or faulty phrase, then the book's replacement.
const WORDY = [
  ["at this point in time", "now"],
  ["a majority of", "most"],
  ["a number of", "many"],
  ["due to the fact that", "because"],
  ["in order to", "to"],
  ["it is clear that", "clearly"],
  ["it is apparent that", "apparently"],
  ["it has long been known that", "(leave out)"],
  ["it is of interest to note that", "(leave out)"],
  ["needless to say", "(leave out)"],
  ["in the neighborhood of", "about"],
  ["prior to", "before"],
  ["subsequent to", "after"],
  ["utilize", "use"],
  ["red in color", "red"],
  ["fewer in number", "fewer"],
  ["the data shows", "(leave out)"],
  ["in comparison", "(leave out)"],
  ["showed higher value", "was higher"],
  ["this result would seem to indicate", "this result indicates"],
];

const SYSTEM = `You write the Results and Discussion of an agricultural research paper following "Technical Writing for Beginners" by Bautista and Bondad (1997). You respond only with valid JSON, no markdown.

Rules from the book, all mandatory:
- Chapter 11, p80: keep the objective of the experiment in view. The discussion answers the objective. Everything else is secondary.
- p82: state trends and patterns. Never cite the data one by one as they appear in the table. Do not enumerate cell values.
- p83: when treatments share a letter they had no effect on each other. Do not discuss them as different, whatever the numbers say. A numerical gap without significance is due to factors other than the treatment.
- p83: if a row is not significant but shows a consistent trend, you may mention the trend and what it could mean, and give a possible reason for the lack of significance.
- p84: state the effect, not the statistic. Write "Fertilizer B matched A in yield", not "B was significantly higher than C". Use the words "significant" and "insignificant" sparingly, if at all. The text must read correctly with those words removed.
- p84: relate findings to the objective. Give a reason only if the table or the stated objective supports it. If not, say that the explanation needs literature, in one short clause. Do not invent mechanisms, causes, or citations.
- p85: interpret, do not restate. "Growth increased as the weed-free area increased", not "there was an increase in tree height and trunk diameter".
- Chapter 14, p106: accurate, brief, clear. Formal language. No literary language. No emotional words such as "unfortunately", "remarkably", "interestingly". No contractions. Do not write "The data shows" or "In comparison". Use "In this study" only to avoid confusion with cited work.
- p113: the plant or animal changes, not the treatment. "Lighted plants had lower dry weight", not "Lighting plants had lower dry weight".
- Avoid these wordy phrases (book list, p108 to 113): ${WORDY.map(([w, b]) => `"${w}" (use ${b})`).join("; ")}.
- Use the treatment names exactly as given in the table headers.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json(
        { error: "The writing service has no OPENAI_API_KEY set in the project environment." },
        { status: 500 },
      );
    }

    const { tableData, objective, summary, notes = [] } = (await request.json()) as Body;
    if (!tableData?.headers || !tableData?.rows || !summary || !objective?.trim()) {
      return NextResponse.json(
        { error: "Table, telegraphic summary, and objective are required" },
        { status: 400 },
      );
    }

    const prompt = `OBJECTIVE OF THE EXPERIMENT:
${objective.trim()}

TABLE:
${formatTable(tableData)}

TELEGRAPHIC SUMMARY (step 1 and 2, already done, do not change it):
${summary}
${notes.length ? `\nCAUTIONS:\n${notes.map((n) => `- ${n}`).join("\n")}` : ""}

Write step 3 of the method (p82).

1. "sentences": one sentence per line of the collapsed summary (or per row if nothing collapsed). Each sentence translates that telegraphic line into a meaningful statement that answers the objective, in the manner of the book's example: "Fertilizer B proved to be a good substitute for A since the growth and yield of plants fertilized with A and B were almost equal." Order the sentences so the one that answers the objective comes first.

2. "paragraph": the sentences expanded into one paragraph of 3 to 6 sentences, as the book describes: "Each of the two sentences can be expanded into paragraphs by giving explanations, clarifications, and citing literature." You have no literature. Where an explanation would need a citation, write the placeholder "[cite]" in place of the source. Do not fabricate a reason.

Respond ONLY with JSON: {"sentences": ["..."], "paragraph": "..."}`;

    const openai = new OpenAI({ apiKey });
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
    });

    let prose: Prose;
    try {
      const content = (res.choices[0].message.content || "{}").replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(content) as Partial<Prose>;
      prose = {
        sentences: Array.isArray(parsed.sentences) ? parsed.sentences.map(String) : [],
        paragraph: typeof parsed.paragraph === "string" ? parsed.paragraph : "",
      };
    } catch {
      console.error("Failed to parse model response");
      return NextResponse.json({ error: "The model returned an unreadable answer. Try again." }, { status: 502 });
    }

    return NextResponse.json(prose);
  } catch (error) {
    console.error("Analysis error:", error);
    // Pass the provider's own message through (no credits, invalid key, rate limit) so the page can say why.
    const e = error as { status?: number; message?: string };
    const upstream = typeof e?.status === "number" && e.status >= 400 && e.status < 600;
    return NextResponse.json(
      { error: upstream ? `Writing service: ${e.message}` : "Failed to write the interpretation" },
      { status: upstream ? 502 : 500 },
    );
  }
}

function formatTable(t: TableData): string {
  const head = `| Parameter | ${t.headers.join(" | ")} |`;
  const rule = `|${"----|".repeat(t.headers.length + 1)}`;
  const body = t.rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return `${head}\n${rule}\n${body}`;
}
