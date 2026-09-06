// src/lib/telegraphic.ts
//
// Steps 1 and 2 of the telegraphic summary, Bautista and Bondad (1997),
// Chapter 11 "Interpreting Data", pages 80 to 82. No model involved.
//
// Step 1: one line per row. Treatments that share a mean-separation letter
//         are "=". Treatments that share none are ">" in order of value.
// Step 2: rows with the same line are collapsed into one group.

import type {
  HighlightedCell,
  ParsedCell,
  PatternGroup,
  RowKind,
  RowSummary,
  TableData,
  Telegraphic,
} from "../types";

const NS_WORDS = new Set(["ns", "n.s.", "n.s", "nsd"]);
const EMPTY_WORDS = new Set(["", "-", "–", "—", "na", "n/a", "nd"]);

export function parseCell(input: string | number): ParsedCell {
  const raw = String(input).trim();
  const lower = raw.toLowerCase();
  if (EMPTY_WORDS.has(lower)) return { raw, value: null, letters: "", ns: false };
  if (NS_WORDS.has(lower)) return { raw, value: null, letters: "", ns: true };

  // number, optional space, optional run of a-z letters, optional trailing NS/asterisks
  const m = raw.match(/^([-+]?\d[\d,]*\.?\d*|[-+]?\.\d+)\s*([a-zA-Z]*)\s*(\*{0,2}|ns|NS)?$/);
  if (!m) return { raw, value: null, letters: "", ns: false };
  const value = Number(m[1].replace(/,/g, ""));
  const letters = (m[2] || "").toLowerCase();
  return { raw, value: Number.isFinite(value) ? value : null, letters, ns: /ns/i.test(m[3] || "") };
}

function sharesLetter(a: string, b: string): boolean {
  for (const ch of a) if (b.includes(ch)) return true;
  return false;
}

function isMonotonic(values: number[]): "up" | "down" | null {
  if (values.length < 3) return null;
  let up = true;
  let down = true;
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) up = false;
    if (values[i] >= values[i - 1]) down = false;
  }
  if (up) return "up";
  if (down) return "down";
  return null;
}

export function summarizeRow(
  parameter: string,
  rawCells: (string | number)[],
  headers: string[],
  lowerIsBetter = false,
): RowSummary {
  const cells = rawCells.map(parseCell);
  const idx = cells.map((_, i) => i).filter((i) => cells[i].value !== null);
  const label = (i: number) => headers[i] ?? String.fromCharCode(65 + i);
  const allLabels = headers.map((_, i) => label(i)).join("=");

  const base = { parameter, cells, lowerIsBetter, overlapping: false };

  if (idx.length === 0) {
    return { ...base, pattern: "no data", kind: "nodata", tiers: [] };
  }

  // A single stray letter (2120a, 2090, 2062 ...) is not a mean separation.
  const hasLetters = idx.filter((i) => cells[i].letters !== "").length >= 2;
  const anyNs = cells.some((c) => c.ns);

  if (!hasLetters) {
    // Book p83: no significance, no discussion of differences. Mention a
    // consistent trend only, and say what it might mean.
    const trend = isMonotonic(idx.map((i) => cells[i].value as number));
    if (trend) {
      const dir = trend === "up" ? "increasing" : "decreasing";
      return {
        ...base,
        pattern: `${allLabels} or NS; ${dir} from ${label(idx[0])} to ${label(idx[idx.length - 1])}`,
        kind: "trend",
        tiers: [idx],
      };
    }
    return {
      ...base,
      pattern: anyNs ? `${allLabels} or NS` : `${allLabels} (no mean separation given)`,
      kind: "same",
      tiers: [idx],
    };
  }

  // Sort by value, best first. Book's ">" is numeric; lowerIsBetter flips the order.
  const sorted = [...idx].sort((a, b) => {
    const d = (cells[b].value as number) - (cells[a].value as number);
    return lowerIsBetter ? -d : d;
  });

  // Chain adjacent treatments that share a letter into tiers (the book's clean case).
  let tiers: number[][] = [];
  for (const i of sorted) {
    const last = tiers[tiers.length - 1];
    if (last && sharesLetter(cells[last[last.length - 1]].letters, cells[i].letters)) {
      last.push(i);
    } else {
      tiers.push([i]);
    }
  }

  // Overlap: a tier where not every pair shares a letter (a, ab, b).
  let overlapping = false;
  for (const tier of tiers) {
    for (let x = 0; x < tier.length && !overlapping; x++) {
      for (let y = x + 1; y < tier.length; y++) {
        if (!sharesLetter(cells[tier[x]].letters, cells[tier[y]].letters)) {
          overlapping = true;
          break;
        }
      }
    }
  }

  // The book does not cover overlap. Chaining would call everything equal, which
  // misreads the letters. Instead, tier by leading letter in order of appearance:
  // each tier is one letter group, and tiers that share a letter get "≥", not ">".
  if (overlapping) {
    tiers = [];
    const taken = new Set<number>();
    for (const i of sorted) {
      if (taken.has(i)) continue;
      const lead = cells[i].letters[0];
      const tier = sorted.filter((j) => !taken.has(j) && cells[j].letters.includes(lead));
      tier.forEach((j) => taken.add(j));
      tiers.push(tier);
    }
  }

  // Inside a tier keep table order, as the book does (A=B>C=D, not A=B>D=C).
  for (const t of tiers) t.sort((a, b) => a - b);
  const anyShared = (t1: number[], t2: number[]) =>
    t1.some((x) => t2.some((y) => sharesLetter(cells[x].letters, cells[y].letters)));
  let pattern = tiers[0].map(label).join("=");
  for (let k = 1; k < tiers.length; k++) {
    pattern += (anyShared(tiers[k - 1], tiers[k]) ? "≥" : ">") + tiers[k].map(label).join("=");
  }
  const kind: RowKind = tiers.length === 1 ? "same" : "differ";
  return {
    ...base,
    pattern: kind === "same" ? `${pattern} or NS` : pattern,
    kind,
    tiers,
    overlapping,
  };
}

export function groupRows(rows: RowSummary[]): PatternGroup[] {
  const groups: PatternGroup[] = [];
  for (const r of rows) {
    const g = groups.find((x) => x.pattern === r.pattern);
    if (g) g.parameters.push(r.parameter);
    else groups.push({ pattern: r.pattern, parameters: [r.parameter], kind: r.kind });
  }
  return groups;
}

/** Highlight only the best tier of rows that actually differ. Same-letter rows get nothing (p83). */
export function highlightCells(rows: RowSummary[], headers: string[]): HighlightedCell[] {
  const out: HighlightedCell[] = [];
  rows.forEach((r, rowIndex) => {
    if (r.kind !== "differ") return;
    const best = r.tiers[0];
    const word = r.lowerIsBetter ? "lowest" : "highest";
    for (const col of best) {
      out.push({
        row: rowIndex,
        col,
        color: "top",
        reason: `${headers[col]} is in the ${word} group for ${r.parameter} (letters ${r.cells[col].letters || "none"}).`,
      });
    }
  });
  return out;
}

export function formatSummary(rows: RowSummary[], groups: PatternGroup[]): string {
  const width = Math.max(...rows.map((r) => r.parameter.length), 4) + 2;
  const perRow = rows.map((r) => r.parameter.padEnd(width) + r.pattern).join("\n");
  if (groups.length === rows.length) return perRow;
  const grouped = groups
    .map((g) => `{ ${g.parameters.join("; ")} }`.padEnd(width) + "  " + g.pattern)
    .join("\n");
  return `${perRow}\n\nCollapsed:\n${grouped}`;
}

function list(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/** Plain-English reading of one group, from the tiers of its first row. The model gets this, not the notation. */
export function describeGroup(group: PatternGroup, rows: RowSummary[], headers: string[]): string {
  const row = rows.find((r) => r.pattern === group.pattern);
  const params = list(group.parameters);
  if (!row) return `${params}: no reading.`;
  const name = (i: number) => headers[i] ?? String.fromCharCode(65 + i);
  const word = row.lowerIsBetter ? "better (lower)" : "greater";

  if (row.kind === "nodata") return `${params}: no data.`;
  if (row.kind === "same") return `${params}: the treatments did not differ from one another.`;
  if (row.kind === "trend") {
    const m = row.pattern.match(/;\s*(.+)$/);
    return `${params}: the treatments did not differ statistically, but values were ${m ? m[1] : "in a consistent trend"}. This is a trend only.`;
  }

  const parts: string[] = [];
  const tiers = row.tiers.map((t) => t.map(name));
  for (let k = 0; k < tiers.length; k++) {
    const here = tiers[k];
    const below = tiers.slice(k + 1).flat();
    if (here.length === 1 && below.length === 0) continue; // already named as "below" of the tier above
    let s = here.length > 1 ? `${list(here)} did not differ from one another` : here[0];
    if (below.length) {
      const shared = row.overlapping && row.pattern.includes("≥");
      s +=
        (here.length > 1 ? "; " : " ") +
        `${here.length > 1 ? "they were" : "was"} ${word} than ${list(below)}` +
        (shared ? " (some of these share a letter, so the separation is not clean)" : "");
    }
    parts.push(s);
  }
  return `${params}: ${parts.join(". ")}.`;
}

export function telegraphic(table: TableData): Telegraphic {
  const headers = table.headers;
  const rows = table.rows.map((row, i) =>
    summarizeRow(String(row[0]), row.slice(1), headers, table.lowerIsBetter?.[i] ?? false),
  );
  const groups = groupRows(rows);
  const highlightedCells = highlightCells(rows, headers);
  const notes: string[] = [];

  const overlapping = rows.filter((r) => r.overlapping).map((r) => r.parameter);
  if (overlapping.length) {
    notes.push(
      `Letters overlap for: ${overlapping.join(", ")}. Each "=" group is one letter group. "≥" joins groups that still share a letter, ">" joins groups that share none. The book uses only "=" and ">" and gives no rule for overlap; confirm the reading with your adviser.`,
    );
  }
  if (rows.some((r) => r.kind === "trend")) {
    notes.push(
      "A row without significant differences shows a consistent trend. The book (p83) allows mentioning the trend and what it could mean, but not discussing the treatments as different.",
    );
  }
  if (rows.some((r) => r.cells.every((c) => c.letters === "")) && rows.some((r) => r.kind !== "trend")) {
    notes.push(
      "Some rows carry no mean-separation letters. Without a statistical test the method cannot say which treatments differ (p83).",
    );
  }

  const facts = groups.map((g) => describeGroup(g, rows, headers));
  return { rows, groups, highlightedCells, summary: formatSummary(rows, groups), facts, notes };
}
