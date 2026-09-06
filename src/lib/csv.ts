// src/lib/csv.ts
//
// Delimited text to a table. Handles quoted fields, doubled quotes inside
// them, newlines inside quotes, CRLF, and comma, tab, or semicolon delimiters
// chosen by whichever the first line has most of.

import type { TableData } from "@/types";

export function detectDelimiter(text: string): string {
  // Count separators outside quotes on the first non-blank line.
  const first = (text.split(/\r?\n/).find((l) => l.trim()) ?? "").replace(/"[^"]*"/g, "");
  let best = ",";
  let count = -1;
  for (const d of ["\t", ",", ";"]) {
    const n = first.split(d).length - 1;
    if (n > count) {
      best = d;
      count = n;
    }
  }
  return best;
}

/** RFC 4180 style parse. Returns rows of cells, trimmed. Blank lines dropped. */
export function parseDelimited(text: string, delimiter = detectDelimiter(text)): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/\r\n?/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      quoted = true;
    } else if (ch === delimiter) {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.trim());
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  row.push(cell.trim());
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

/** First row is headers (first cell ignored, it names the parameter column). Remaining rows are data. */
export function parseTable(text: string): TableData | null {
  const rows = parseDelimited(text);
  if (rows.length < 2) return null;
  const headers = rows[0].slice(1);
  if (headers.length === 0) return null;
  const width = headers.length + 1;
  const data = rows.slice(1).map((r) => {
    const padded = r.slice(0, width);
    while (padded.length < width) padded.push("");
    return padded;
  });
  return { headers, rows: data };
}
