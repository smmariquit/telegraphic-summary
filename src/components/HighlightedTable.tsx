// src/components/HighlightedTable.tsx

"use client";

import { useState } from "react";
import type { HighlightedCell, ParsedCell, RowSummary, TableData } from "@/types";
import Pattern from "./Pattern";

interface Props {
  tableData: TableData;
  rows: RowSummary[];
  highlightedCells: HighlightedCell[];
  /** Plain-English reading for a row, shown when the row is opened. */
  factFor: (row: RowSummary) => string;
}

/** "45ab" as 45 with the letters set small, so the letters can be read as letters. */
function Cell({ cell }: { cell: ParsedCell }) {
  if (cell.value === null) return <>{cell.raw || "–"}</>;
  const number = cell.raw.replace(/[a-zA-Z]+\s*(\*{0,2}|ns|NS)?$/, "").trim();
  return (
    <>
      {number}
      {cell.letters && <span className="letters">{cell.letters}</span>}
    </>
  );
}

export default function HighlightedTable({ tableData, rows, highlightedCells, factFor }: Props) {
  const { headers } = tableData;
  const [open, setOpen] = useState<number | null>(0);
  const find = (r: number, c: number) => highlightedCells.find((h) => h.row === r && h.col === c);
  const cols = headers.length + 2;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[length:var(--text-sm)]">
        <caption className="sr-only">
          The table with the best statistical group of each row marked, and the telegraphic line for each row. Select a
          row to read it in words.
        </caption>
        <thead>
          <tr className="border-rule-strong border-b">
            <th scope="col" className="py-[var(--space-2xs)] pr-[var(--space-sm)] text-left font-medium">
              Parameter
            </th>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-[var(--space-xs)] py-[var(--space-2xs)] text-right font-medium">
                {h}
              </th>
            ))}
            <th
              scope="col"
              className="hidden py-[var(--space-2xs)] pl-[var(--space-lg)] text-left font-medium sm:table-cell"
            >
              Reads as
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const isOpen = open === ri;
            return (
              <RowGroup key={ri} isOpen={isOpen}>
                <tr
                  className={`border-rule border-b transition-[background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] ${isOpen ? "bg-paper-2" : "hover:bg-paper-2"}`}
                >
                  <th scope="row" className="py-[var(--space-xs)] pr-[var(--space-sm)] text-left font-normal">
                    <button
                      type="button"
                      className="link text-left"
                      aria-expanded={isOpen}
                      aria-controls={`row-reading-${ri}`}
                      onClick={() => setOpen(isOpen ? null : ri)}
                    >
                      {row.parameter}
                    </button>
                    {row.lowerIsBetter && (
                      <span className="text-muted block text-[length:var(--text-xs)]">lower is better</span>
                    )}
                  </th>
                  {row.cells.map((cell, ci) => {
                    const h = find(ri, ci);
                    return (
                      <td
                        key={ci}
                        className={`px-[var(--space-xs)] py-[var(--space-xs)] text-right font-mono ${h ? "cell--top" : ""}`}
                        title={h?.reason}
                        aria-label={h ? `${cell.raw}. ${h.reason}` : undefined}
                      >
                        <Cell cell={cell} />
                      </td>
                    );
                  })}
                  <td className="hidden py-[var(--space-xs)] pl-[var(--space-lg)] sm:table-cell">
                    <Pattern row={row} headers={headers} size="sm" />
                  </td>
                </tr>
                <tr className={`border-rule border-b sm:hidden ${isOpen ? "bg-paper-2" : ""}`}>
                  <td colSpan={cols} className="py-[var(--space-2xs)]">
                    <span className="text-muted mr-[var(--space-2xs)] text-[length:var(--text-xs)]">Reads as</span>
                    <Pattern row={row} headers={headers} size="sm" />
                  </td>
                </tr>
                {isOpen && (
                  <tr id={`row-reading-${ri}`} className="rise border-rule bg-paper-2 border-b">
                    <td colSpan={cols} className="py-[var(--space-xs)] pr-[var(--space-sm)] pl-[var(--space-sm)]">
                      <p className="max-w-[var(--measure)] [text-wrap:pretty]">
                        <span className="text-muted">In words: </span>
                        {factFor(row).replace(/^[^:]*:\s*/, "")}
                      </p>
                    </td>
                  </tr>
                )}
              </RowGroup>
            );
          })}
        </tbody>
      </table>
      <p className="text-muted mt-[var(--space-xs)] text-[length:var(--text-xs)]">
        <span className="chip chip--sm chip--top">A</span> best statistical group.{" "}
        <span className="chip chip--sm">C</span> lower group. Rows where every treatment shares a letter show no
        difference and get no mark (p83). Select a parameter to read its row in words.
      </p>
    </div>
  );
}

// A fragment that keeps the key on the pair of rows.
function RowGroup({ children }: { isOpen: boolean; children: React.ReactNode }) {
  return <>{children}</>;
}
