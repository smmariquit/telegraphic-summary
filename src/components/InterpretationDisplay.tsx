// src/components/InterpretationDisplay.tsx
//
// The three stages of the method, Chapter 11 p80-82, revealed one at a time.
// Each stage carries the page of the book it comes from.

"use client";

import { useEffect, useRef } from "react";
import type { Prose, RowSummary, TableData, Telegraphic } from "@/types";
import HighlightedTable from "./HighlightedTable";
import Pattern from "./Pattern";
import BookFigure from "./BookFigure";

interface Props {
  tableData: TableData;
  telegraphic: Telegraphic;
  step: 1 | 2 | 3;
  onNext: () => void;
  prose: Prose | null;
  proseLoading: boolean;
  proseError: string | null;
  onRetry: () => void;
}

function Stage({
  n,
  title,
  lede,
  focus,
  aside,
  busy,
  children,
}: {
  n: string;
  title: string;
  lede: string;
  focus: boolean;
  aside: React.ReactNode;
  busy?: boolean;
  children: React.ReactNode;
}) {
  const id = `stage-${n.replace(".", "-")}`;
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (focus && n !== "1.0") ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focus, n]);
  return (
    <section
      ref={ref}
      className="stage rise scroll-mt-[var(--space-md)]"
      aria-labelledby={id}
      aria-current={focus ? "step" : undefined}
      aria-busy={busy}
    >
      <div className="grid gap-[var(--space-sm)] sm:grid-cols-[minmax(0,5rem)_minmax(0,1fr)]">
        <p className="stage__num" aria-hidden="true">
          {n}
        </p>
        <div className="grid min-w-0 gap-[var(--space-lg)] lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
          <div className="min-w-0">
            <h2 id={id} className="text-[length:var(--text-xl)] [text-wrap:balance]">
              {title}
            </h2>
            <p className="text-muted mt-[var(--space-2xs)] max-w-[var(--measure)] [text-wrap:pretty]">{lede}</p>
            {children}
          </div>
          <aside
            className="min-w-0 space-y-[var(--space-sm)] text-[length:var(--text-sm)] lg:pt-[var(--space-2xs)]"
            aria-label="From the book"
          >
            {aside}
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function InterpretationDisplay({
  tableData,
  telegraphic,
  step,
  onNext,
  prose,
  proseLoading,
  proseError,
  onRetry,
}: Props) {
  const { rows, groups, highlightedCells, notes, facts } = telegraphic;
  const collapsed = groups.length < rows.length;
  const rowFor = (pattern: string) => rows.find((r) => r.pattern === pattern)!;
  const factFor = (row: RowSummary) => facts[groups.findIndex((g) => g.pattern === row.pattern)] ?? "";

  return (
    <div className="space-y-[var(--space-2xl)]">
      <Stage
        n="1.0"
        title="Summarize each row"
        lede="Treatments that share a letter are equal. Treatments that share none are ordered by value. The reading comes from the letters, not from the size of the numbers."
        focus={step === 1}
        aside={
          <>
            <blockquote className="quote">
              “Look for the most striking aspect of the figure or table and state it, keeping in mind the objective of
              the experiment.”
              <cite>Bautista and Bondad, 1997, p. 80</cite>
            </blockquote>
            <BookFigure fig="p80" size="thumb" caption="Where the row lines begin." />
          </>
        }
      >
        <div className="mt-[var(--space-md)]">
          <HighlightedTable tableData={tableData} rows={rows} highlightedCells={highlightedCells} factFor={factFor} />
        </div>
        {notes.length > 0 && (
          <ul className="note mt-[var(--space-md)] max-w-[var(--measure)] space-y-[var(--space-2xs)] text-[length:var(--text-sm)]">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
        {step === 1 && (
          <div className="mt-[var(--space-lg)]">
            <button type="button" className="btn" onClick={onNext}>
              Next, step 2: group the rows
            </button>
          </div>
        )}
      </Stage>

      {step >= 2 && (
        <Stage
          n="2.0"
          title="Group the rows"
          lede={
            collapsed
              ? `${rows.length} rows read as ${groups.length} ${groups.length === 1 ? "line" : "lines"}. Rows that read the same collapse into one. These lines are the telegraphic summary.`
              : "Every row reads differently, so nothing collapses. These lines are the telegraphic summary."
          }
          focus={step === 2}
          aside={
            <>
              <blockquote className="quote">
                “The preceding could be further summarized to:”
                <cite>Bautista and Bondad, 1997, p. 82</cite>
              </blockquote>
              <BookFigure fig="p82" size="thumb" caption="Table 5 collapsed to A=B=C=D and A=B>[C=D]." />
            </>
          }
        >
          <ol className="divide-rule border-rule mt-[var(--space-md)] divide-y border-y">
            {groups.map((g, i) => (
              <li
                key={g.pattern}
                className="grid gap-x-[var(--space-lg)] gap-y-[var(--space-2xs)] py-[var(--space-sm)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                <div className="min-w-0">
                  <p className="text-muted text-[length:var(--text-xs)]">
                    {g.parameters.length === 1 ? "1 row" : `${g.parameters.length} rows`}
                  </p>
                  <p className="[text-wrap:pretty]">{g.parameters.join(", ")}</p>
                </div>
                <div className="min-w-0">
                  <Pattern row={rowFor(g.pattern)} headers={tableData.headers} />
                  <p className="text-muted mt-[var(--space-2xs)] max-w-[var(--measure)] text-[length:var(--text-sm)] [text-wrap:pretty]">
                    {facts[i]?.replace(/^[^:]*:\s*/, "")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {step === 2 && (
            <div className="mt-[var(--space-lg)]">
              <button type="button" className="btn" onClick={onNext}>
                Next, step 3: write the sentences
              </button>
              <p className="text-muted mt-[var(--space-2xs)] text-[length:var(--text-sm)]">
                A language model writes them, held to the readings above.
              </p>
            </div>
          )}
        </Stage>
      )}

      {step >= 3 && (
        <Stage
          n="3.0"
          title="Translate into sentences"
          lede="One sentence per line of the summary, the one that answers the objective first. Then the sentences expanded into a paragraph."
          focus={step === 3}
          busy={proseLoading}
          aside={
            <>
              <blockquote className="quote">
                “Translated into meaningful sentences … Each of the two sentences can be expanded into paragraphs by
                giving explanations, clarifications, and citing literature.”
                <cite>Bautista and Bondad, 1997, p. 82</cite>
              </blockquote>
              <blockquote className="quote">
                “Look for trends or patterns and state them. Avoid citing data one by one as they appear in a table.”
                <cite>Bautista and Bondad, 1997, p. 82</cite>
              </blockquote>
              <BookFigure
                fig="p83"
                size="thumb"
                caption="Use statistical analysis as a guide. Insignificant means no effect."
              />
            </>
          }
        >
          <div className="max-w-[var(--measure)]">
            {proseLoading && (
              <div
                role="status"
                aria-label="Writing sentences"
                className="mt-[var(--space-lg)] space-y-[var(--space-sm)]"
              >
                {groups.map((g) => (
                  <div key={g.pattern} className="space-y-[var(--space-2xs)]">
                    <div className="skeleton w-full" />
                    <div className="skeleton w-3/4" />
                  </div>
                ))}
                <p className="text-muted text-[length:var(--text-sm)]">Writing…</p>
              </div>
            )}

            {proseError && !proseLoading && (
              <div role="alert" className="mt-[var(--space-md)]">
                <p className="text-error">{proseError}</p>
                <button type="button" className="btn btn--quiet mt-[var(--space-sm)]" onClick={onRetry}>
                  Try again
                </button>
              </div>
            )}

            {prose && !proseLoading && (
              <div className="rise">
                <h3 className="mt-[var(--space-lg)] text-[length:var(--text-md)]">Sentences</h3>
                <ol className="divide-rule border-rule mt-[var(--space-xs)] divide-y border-y">
                  {prose.sentences.map((s, i) => (
                    <li
                      key={i}
                      className="grid gap-x-[var(--space-md)] gap-y-[var(--space-2xs)] py-[var(--space-sm)] sm:grid-cols-[minmax(0,2rem)_minmax(0,1fr)]"
                    >
                      <span className="stage__num text-[length:var(--text-md)]" aria-hidden="true">
                        {i + 1}
                      </span>
                      <p className="[text-wrap:pretty]">{s}</p>
                    </li>
                  ))}
                </ol>
                <h3 className="mt-[var(--space-lg)] text-[length:var(--text-md)]">Paragraph</h3>
                <p className="mt-[var(--space-xs)] leading-[1.7] [text-wrap:pretty]">{prose.paragraph}</p>
                <p className="text-muted mt-[var(--space-sm)] text-[length:var(--text-sm)] [text-wrap:pretty]">
                  <span className="font-mono">[cite]</span> marks where the book expects a source from the literature
                  (p. 82, p. 84). The model has none and did not invent one. Fill those in yourself.
                </p>
              </div>
            )}
          </div>
        </Stage>
      )}
    </div>
  );
}
