// src/components/InterpretationDisplay.tsx
//
// The three stages of the method, Chapter 11 p80-82.

"use client";

import type { Prose, TableData, Telegraphic } from "@/types";
import HighlightedTable from "./HighlightedTable";

interface Props {
  tableData: TableData;
  telegraphic: Telegraphic;
  prose: Prose | null;
  proseLoading: boolean;
  proseError: string | null;
  onRetry: () => void;
}

export default function InterpretationDisplay({ tableData, telegraphic, prose, proseLoading, proseError, onRetry }: Props) {
  const { rows, groups, highlightedCells, notes } = telegraphic;
  const collapsed = groups.length < rows.length;

  return (
    <div className="rise space-y-[var(--space-2xl)]">
      {/* 1.0 */}
      <section className="stage" aria-labelledby="s1">
        <div className="grid gap-[var(--space-sm)] sm:grid-cols-[minmax(0,5rem)_minmax(0,1fr)]">
          <p className="stage__num" aria-hidden="true">
            1.0
          </p>
          <div className="min-w-0">
            <h2 id="s1" className="text-[length:var(--text-xl)]">
              Summarize each row
            </h2>
            <p className="mt-[var(--space-2xs)] max-w-[var(--measure)] text-muted">
              Treatments that share a letter are written as equal. Treatments that share none are ordered by value.
              The comparison comes from the letters, not from the numbers.
            </p>
            <div className="mt-[var(--space-md)]">
              <HighlightedTable tableData={tableData} rows={rows} highlightedCells={highlightedCells} />
            </div>
            {notes.length > 0 && (
              <ul className="mt-[var(--space-md)] max-w-[var(--measure)] space-y-[var(--space-2xs)] border-l-2 border-accent pl-[var(--space-sm)] text-[length:var(--text-sm)]">
                {notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* 2.0 */}
      <section className="stage" aria-labelledby="s2">
        <div className="grid gap-[var(--space-sm)] sm:grid-cols-[minmax(0,5rem)_minmax(0,1fr)]">
          <p className="stage__num" aria-hidden="true">
            2.0
          </p>
          <div className="min-w-0">
            <h2 id="s2" className="text-[length:var(--text-xl)]">
              Group the rows
            </h2>
            <p className="mt-[var(--space-2xs)] max-w-[var(--measure)] text-muted">
              {collapsed
                ? "Rows with the same line collapse into one. This is the telegraphic summary."
                : "Every row has its own line, so nothing collapses. This is the telegraphic summary."}
            </p>
            <dl className="mt-[var(--space-md)] grid gap-y-[var(--space-xs)] font-mono text-[length:var(--text-sm)] sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-[var(--space-lg)]">
              {groups.map((g) => (
                <div key={g.pattern} className="contents">
                  <dt className="text-muted">
                    {g.parameters.length > 1 ? `{ ${g.parameters.join("; ")} }` : g.parameters[0]}
                  </dt>
                  <dd className="min-w-0 [overflow-wrap:anywhere] sm:text-right">{g.pattern}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 3.0 */}
      <section className="stage" aria-labelledby="s3" aria-busy={proseLoading}>
        <div className="grid gap-[var(--space-sm)] sm:grid-cols-[minmax(0,5rem)_minmax(0,1fr)]">
          <p className="stage__num" aria-hidden="true">
            3.0
          </p>
          <div className="min-w-0 max-w-[var(--measure)]">
            <h2 id="s3" className="text-[length:var(--text-xl)]">
              Translate into sentences
            </h2>
            <p className="mt-[var(--space-2xs)] text-muted">
              One sentence per line of the summary, the one that answers the objective first. Then the sentences expanded
              into a paragraph. A language model writes this part under the book’s rules for Chapter 11 and Chapter 14.
            </p>

            {proseLoading && (
              <p role="status" className="mt-[var(--space-md)] text-muted">
                Writing…
              </p>
            )}

            {proseError && (
              <div role="alert" className="mt-[var(--space-md)]">
                <p className="text-error">{proseError}</p>
                <button type="button" className="btn btn--quiet mt-[var(--space-sm)]" onClick={onRetry}>
                  Try again
                </button>
              </div>
            )}

            {prose && !proseLoading && (
              <>
                <h3 className="mt-[var(--space-lg)] text-[length:var(--text-md)]">Sentences</h3>
                <ol className="mt-[var(--space-2xs)] list-decimal space-y-[var(--space-2xs)] pl-[var(--space-md)]">
                  {prose.sentences.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
                <h3 className="mt-[var(--space-lg)] text-[length:var(--text-md)]">Paragraph</h3>
                <p className="mt-[var(--space-2xs)] leading-[1.65]">{prose.paragraph}</p>
                <p className="mt-[var(--space-sm)] text-[length:var(--text-sm)] text-muted">
                  Where you see <span className="font-mono">[cite]</span>, the book expects a citation from the
                  literature (p82, p84). The model has none and did not invent one. Fill those in yourself.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
