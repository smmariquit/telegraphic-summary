// src/lib/prose.ts
//
// Step 3 of the telegraphic summary (Bautista and Bondad 1997, p82): the
// prompt that turns the grouped lines into sentences, and the parser for
// the model's answer. Pure functions, so they can be tested without a key.

import type { Prose, TableData } from "@/types";

export interface ProseRequest {
  tableData: TableData;
  objective: string;
  summary: string;
  facts?: string[];
  notes?: string[];
}

export const LIMITS = {
  rows: 40,
  columns: 16,
  cellChars: 40,
  objectiveChars: 600,
  summaryChars: 6000,
  facts: 40,
  factChars: 600,
  notes: 10,
  noteChars: 600,
} as const;

/** Returns an error message, or null when the body is acceptable. */
export function validateBody(b: unknown): string | null {
  const body = b as Partial<ProseRequest> | null;
  if (!body || typeof body !== "object") return "Body must be JSON.";
  const t = body.tableData;
  if (!t || !Array.isArray(t.headers) || !Array.isArray(t.rows)) return "Table is required.";
  if (typeof body.summary !== "string" || !body.summary.trim()) return "Telegraphic summary is required.";
  if (typeof body.objective !== "string" || !body.objective.trim()) return "Objective is required.";
  if (t.headers.length > LIMITS.columns || t.rows.length > LIMITS.rows) {
    return `Table too large. Up to ${LIMITS.rows} rows and ${LIMITS.columns} treatments.`;
  }
  for (const row of t.rows) {
    if (!Array.isArray(row) || row.length > LIMITS.columns + 1) return "Malformed row.";
    for (const c of row) if (String(c).length > LIMITS.cellChars) return "A cell is too long.";
  }
  if (body.objective.length > LIMITS.objectiveChars) return `Objective over ${LIMITS.objectiveChars} characters.`;
  if (body.summary.length > LIMITS.summaryChars) return "Summary too long.";
  if (body.facts && (!Array.isArray(body.facts) || body.facts.length > LIMITS.facts)) return "Too many facts.";
  if (body.facts?.some((f) => typeof f !== "string" || f.length > LIMITS.factChars)) return "A fact is too long.";
  if (body.notes && (!Array.isArray(body.notes) || body.notes.length > LIMITS.notes)) return "Too many notes.";
  if (body.notes?.some((n) => typeof n !== "string" || n.length > LIMITS.noteChars)) return "A note is too long.";
  return null;
}

// Chapter 14, pages 108 to 113. Wordy or faulty phrase, then the book's replacement.
export const WORDY: ReadonlyArray<readonly [string, string]> = [
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

export const SYSTEM = `You write the Results and Discussion of an agricultural research paper following "Technical Writing for Beginners" by Bautista and Bondad (1997). You respond only with valid JSON, no markdown.

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

export function formatTable(t: TableData): string {
  const head = `| Parameter | ${t.headers.join(" | ")} |`;
  const rule = `|${"----|".repeat(t.headers.length + 1)}`;
  const body = t.rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return `${head}\n${rule}\n${body}`;
}

export function buildPrompt(req: ProseRequest): string {
  const { tableData, objective, summary, facts = [], notes = [] } = req;
  return `OBJECTIVE OF THE EXPERIMENT:
${objective.trim()}

TABLE:
${formatTable(tableData)}

TELEGRAPHIC SUMMARY (step 1 and 2, already done, do not change it):
${summary}

WHAT EACH LINE MEANS (the only comparisons you may state; do not add, reverse, or split any):
${facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}
${notes.length ? `\nCAUTIONS:\n${notes.map((n) => `- ${n}`).join("\n")}` : ""}

Write step 3 of the method (p82).

1. "sentences": exactly ${facts.length || "one per line"} sentences, one for each numbered meaning above, no more. Each sentence turns that meaning into a statement that answers the objective, in the manner of the book's example: "Fertilizer B proved to be a good substitute for A since the growth and yield of plants fertilized with A and B were almost equal." Order the sentences so the one that answers the objective comes first.

2. "paragraph": the sentences expanded into one paragraph of 3 to 6 sentences, as the book describes: "Each of the two sentences can be expanded into paragraphs by giving explanations, clarifications, and citing literature." You have no literature. Where an explanation would need a citation, write the placeholder "[cite]" in place of the source. Do not fabricate a reason.

Respond ONLY with JSON: {"sentences": ["..."], "paragraph": "..."}`;
}

/** Parses the model's answer. Returns null when it is not the expected shape. */
export function parseProse(content: string | null | undefined): Prose | null {
  const cleaned = (content || "").replace(/```json\n?|\n?```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<Prose>;
    if (!Array.isArray(parsed.sentences) || typeof parsed.paragraph !== "string") return null;
    const sentences = parsed.sentences.map(String).filter((s) => s.trim());
    if (!sentences.length || !parsed.paragraph.trim()) return null;
    return { sentences, paragraph: parsed.paragraph.trim() };
  } catch {
    return null;
  }
}
