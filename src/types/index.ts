export interface TableCell {
  value: string | number;
  row: number;
  col: number;
  isHighlighted?: boolean;
  highlightColor?: string;
  highlightReason?: string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface HighlightedCell {
  row: number;
  col: number;
  reason: string;
  color: "high" | "low" | "notable" | "comparison";
}

export interface PatternInsight {
  parameter: string;
  pattern: string; // The identified pattern or relationship
  insight: string; // Brief explanation of what makes this interesting
  type: "trend" | "comparison" | "outlier" | "correlation" | "grouping" | "other";
}

export interface AnalysisResult {
  highlightedCells: HighlightedCell[];
  patterns: PatternInsight[];
  telegraphicSummary: string;
  expandedIdea: string;
  fullInterpretation: string;
}
