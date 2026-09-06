// src/components/Pattern.tsx
//
// One telegraphic line drawn as chips: treatments in the same tier sit
// together, tiers are joined by ">" (or "≥" when letters overlap). The
// best tier is filled. The notation string stays available to copy.

"use client";

import type { RowSummary } from "@/types";

interface Props {
  row: RowSummary;
  headers: string[];
  /** Compact for table cells, regular for the summary. */
  size?: "sm" | "md";
}

export default function Pattern({ row, headers, size = "md" }: Props) {
  const name = (i: number) => headers[i] ?? String.fromCharCode(65 + i);
  const seps = row.pattern.match(/[>≥]/g) ?? [];
  const sizeClass = size === "sm" ? "chip--sm" : "";

  if (row.kind === "nodata") {
    return <span className="text-muted">no data</span>;
  }

  if (row.kind === "same" || row.kind === "trend") {
    const idx = row.tiers[0] ?? [];
    const trend = row.pattern.match(/;\s*(.+)$/)?.[1];
    return (
      <span className="pattern" title={row.pattern}>
        <span className="tier">
          {idx.map((i) => (
            <span key={i} className={`chip ${sizeClass}`}>
              {name(i)}
            </span>
          ))}
        </span>
        <span className="pattern__note">{trend ? `no difference, ${trend}` : "no difference"}</span>
      </span>
    );
  }

  return (
    <span className="pattern" title={row.pattern}>
      {row.tiers.map((tier, k) => (
        <span key={k} className="contents">
          {k > 0 && (
            <span className="sep" aria-label={seps[k - 1] === "≥" ? "greater than or overlapping" : "greater than"}>
              {seps[k - 1] ?? ">"}
            </span>
          )}
          <span className="tier">
            {tier.map((i) => (
              <span key={i} className={`chip ${sizeClass} ${k === 0 ? "chip--top" : ""}`}>
                {name(i)}
              </span>
            ))}
          </span>
        </span>
      ))}
      {row.overlapping && (
        <span className="pattern__note text-accent" title="Letters overlap; see the note">
          overlap
        </span>
      )}
    </span>
  );
}
