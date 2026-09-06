// src/types/index.ts

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
  /** One flag per data row. True when a smaller number is the better result (disease rating). */
  lowerIsBetter?: boolean[];
}

/** One table cell after parsing. "45ab" becomes value 45, letters "ab". */
export interface ParsedCell {
  raw: string;
  value: number | null;
  letters: string;
  ns: boolean;
}

export type RowKind = "same" | "differ" | "trend" | "nodata";

/** Book step 1 (p80-82): one telegraphic line per row. */
export interface RowSummary {
  parameter: string;
  cells: ParsedCell[];
  /** Book notation, e.g. "A=B>C=D" or "A=B=C=D or NS". */
  pattern: string;
  kind: RowKind;
  /** Column indices grouped into tiers, best tier first. */
  tiers: number[][];
  /** Letters overlap in a chain (a, ab, b). Book gives no rule. Flagged for the author. */
  overlapping: boolean;
  lowerIsBetter: boolean;
}

/** Book step 2 (p82): rows with the same pattern collapsed into one line. */
export interface PatternGroup {
  pattern: string;
  parameters: string[];
  kind: RowKind;
}

export interface HighlightedCell {
  row: number;
  col: number;
  reason: string;
  color: "top" | "bottom";
}

/** Deterministic part, computed in the browser. */
export interface Telegraphic {
  rows: RowSummary[];
  groups: PatternGroup[];
  highlightedCells: HighlightedCell[];
  /** Plain-text telegraphic summary, one line per group. */
  summary: string;
  /** Cases the book does not settle. Shown to the user, sent to the author. */
  notes: string[];
}

/** Book step 3 (p82): sentences, then paragraphs. Written by the model. */
export interface Prose {
  sentences: string[];
  paragraph: string;
}

export interface AnalysisResult extends Telegraphic, Prose {}
