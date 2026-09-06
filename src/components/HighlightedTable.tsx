// src/components/HighlightedTable.tsx

"use client";

import type { HighlightedCell, RowSummary, TableData } from "@/types";

interface Props {
  tableData: TableData;
  rows: RowSummary[];
  highlightedCells: HighlightedCell[];
}

export default function HighlightedTable({ tableData, rows, highlightedCells }: Props) {
  const { headers } = tableData;
  const find = (r: number, c: number) => highlightedCells.find((h) => h.row === r && h.col === c);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[length:var(--text-sm)]">
        <caption className="sr-only">
          The table with the best statistical group of each row marked, and the telegraphic line for each row.
        </caption>
        <thead>
          <tr className="border-b border-rule-strong">
            <th scope="col" className="py-[var(--space-2xs)] pr-[var(--space-sm)] text-left font-medium">
              Parameter
            </th>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-[var(--space-xs)] py-[var(--space-2xs)] text-right font-medium">
                {h}
              </th>
            ))}
            <th scope="col" className="pl-[var(--space-md)] py-[var(--space-2xs)] text-left font-medium">
              Telegraphic line
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-rule">
              <th scope="row" className="py-[var(--space-2xs)] pr-[var(--space-sm)] text-left font-normal">
                {row.parameter}
                {row.lowerIsBetter && <span className="text-muted"> (lower is better)</span>}
              </th>
              {row.cells.map((cell, ci) => {
                const h = find(ri, ci);
                return (
                  <td
                    key={ci}
                    className={`px-[var(--space-xs)] py-[var(--space-2xs)] text-right font-mono ${h ? "cell--top" : ""}`}
                    title={h?.reason}
                    aria-label={h ? `${cell.raw}. ${h.reason}` : undefined}
                  >
                    {cell.raw || "–"}
                  </td>
                );
              })}
              <td className="pl-[var(--space-md)] py-[var(--space-2xs)] font-mono whitespace-nowrap">
                {row.pattern}
                {row.overlapping && (
                  <span className="ml-[var(--space-2xs)] text-accent" title="Letters overlap; see the note below">
                    ?
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {highlightedCells.length > 0 && (
        <p className="mt-[var(--space-2xs)] text-[length:var(--text-xs)] text-muted">
          <span className="cell--top px-[var(--space-3xs)] font-mono">45ab</span> marks the best statistical
          group in rows where the treatments differ. Rows that share a letter throughout get no mark (p83).
        </p>
      )}
    </div>
  );
}
