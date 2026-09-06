// src/app/page.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TableInput from "@/components/TableInput";
import InterpretationDisplay from "@/components/InterpretationDisplay";
import Guide from "@/components/Guide";
import { telegraphic as summarize } from "@/lib/telegraphic";
import type { Prose, TableData, Telegraphic } from "@/types";

type TextSize = "normal" | "large" | "xlarge";
type Tab = "tool" | "guide";

export default function Home() {
  const [tab, setTab] = useState<Tab>("tool");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [draft, setDraft] = useState<TableData | null>(null);
  const [objective, setObjective] = useState("");
  const [objectiveMissing, setObjectiveMissing] = useState(false);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [telegraphic, setTelegraphic] = useState<Telegraphic | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [prose, setProse] = useState<Prose | null>(null);
  const [proseLoading, setProseLoading] = useState(false);
  const [proseError, setProseError] = useState<string | null>(null);
  const objectiveRef = useRef<HTMLTextAreaElement>(null);
  const objectiveSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("textSize");
      if (saved === "normal" || saved === "large" || saved === "xlarge") setTextSize(saved);
    } catch {
      // storage unavailable, keep default
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.size = textSize;
    try {
      localStorage.setItem("textSize", textSize);
    } catch {
      // storage unavailable
    }
  }, [textSize]);

  const onDraftChange = useCallback((d: TableData | null) => setDraft(d), []);

  const writeProse = async (data: TableData, t: Telegraphic) => {
    setProseLoading(true);
    setProseError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableData: data, objective, summary: t.summary, facts: t.facts, notes: t.notes }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Could not reach the writing service. Steps 1 and 2 above stand on their own.");
      }
      setProse((await res.json()) as Prose);
    } catch (err) {
      setProseError(err instanceof Error ? err.message : "Could not reach the writing service.");
    } finally {
      setProseLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!draft) return;
    if (!objective.trim()) {
      setObjectiveMissing(true);
      objectiveRef.current?.focus();
      return;
    }
    setObjectiveMissing(false);
    setTableData(draft);
    setTelegraphic(summarize(draft));
    setStep(1);
    setProse(null);
    setProseError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (step === 1) setStep(2);
    else if (step === 2 && tableData && telegraphic) {
      setStep(3);
      void writeProse(tableData, telegraphic);
    }
  };

  const reset = () => {
    setTableData(null);
    setTelegraphic(null);
    setProse(null);
    setProseError(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-10 focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-paper"
      >
        Skip to content
      </a>

      <header className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-[var(--space-lg)] gap-y-[var(--space-2xs)] px-[clamp(1rem,4vw,2rem)] pt-[var(--space-md)]">
        <button
          type="button"
          onClick={() => {
            setTab("tool");
            reset();
          }}
          className="font-display text-[length:var(--text-md)]"
        >
          Telegraphic Summary
        </button>
        <nav aria-label="Sections" className="flex items-baseline gap-[var(--space-md)] text-[length:var(--text-sm)]">
          <button type="button" className="link" aria-current={tab === "tool" ? "page" : undefined} onClick={() => setTab("tool")}>
            Worksheet
          </button>
          <button type="button" className="link" aria-current={tab === "guide" ? "page" : undefined} onClick={() => setTab("guide")}>
            Guide
          </button>
          <div role="group" aria-label="Text size" className="ml-[var(--space-sm)] flex items-baseline gap-[var(--space-2xs)]">
            {(["normal", "large", "xlarge"] as TextSize[]).map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setTextSize(s)}
                aria-pressed={textSize === s}
                aria-label={`${s === "normal" ? "Normal" : s === "large" ? "Large" : "Extra large"} text`}
                className={`link font-display ${i === 1 ? "text-[length:var(--text-md)]" : i === 2 ? "text-[length:var(--text-lg)]" : ""}`}
              >
                A
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)] pb-[var(--space-3xl)] pt-[var(--space-2xl)]">
        {tab === "guide" ? (
          <Guide />
        ) : !tableData || !telegraphic ? (
          <>
            <h1 className="max-w-[24ch] text-[length:var(--text-display)] [text-wrap:balance]">
              Read the table before you write about it.
            </h1>
            <p className="mt-[var(--space-md)] max-w-[var(--measure)] text-[length:var(--text-md)] text-muted [text-wrap:pretty]">
              Three steps from Bautista and Bondad, <cite>Technical Writing for Beginners</cite>, 1997, Chapter 11.
              Summarize each row from its letters. Group the rows that agree. Turn each group into a sentence.
            </p>

            {/* the method in one row, from Table 5 */}
            <ol className="mt-[var(--space-xl)] grid gap-[var(--space-md)] border-y border-rule py-[var(--space-md)] text-[length:var(--text-sm)] sm:grid-cols-3 sm:divide-x sm:divide-rule">
              <li className="sm:pr-[var(--space-md)]">
                <p className="text-muted">1. A row of the table</p>
                <p className="mt-[var(--space-2xs)] font-mono">
                  1500<span className="letters">a</span> · 1300<span className="letters">a</span> · 600
                  <span className="letters">b</span> · 650<span className="letters">b</span>
                </p>
              </li>
              <li className="sm:px-[var(--space-md)]">
                <p className="text-muted">2. Its telegraphic line</p>
                <p className="mt-[var(--space-2xs)]">
                  <span className="pattern">
                    <span className="tier">
                      <span className="chip chip--sm chip--top">A</span>
                      <span className="chip chip--sm chip--top">B</span>
                    </span>
                    <span className="sep">&gt;</span>
                    <span className="tier">
                      <span className="chip chip--sm">C</span>
                      <span className="chip chip--sm">D</span>
                    </span>
                  </span>
                </p>
              </li>
              <li className="sm:pl-[var(--space-md)]">
                <p className="text-muted">3. Its sentence</p>
                <p className="mt-[var(--space-2xs)] [text-wrap:pretty]">
                  “Fertilizer B proved to be a good substitute for A since the growth and yield of plants fertilized with A
                  and B were almost equal.”
                </p>
              </li>
            </ol>

            <div className="mt-[var(--space-2xl)]">
              <TableInput
                onChange={onDraftChange}
                onObjectiveSuggested={(o) => {
                  setObjective(o);
                  setObjectiveMissing(false);
                  window.setTimeout(() => objectiveSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                }}
              />
            </div>

            {draft && (
              <section ref={objectiveSectionRef} aria-labelledby="objective-heading" className="rise mt-[var(--space-2xl)] scroll-mt-[var(--space-md)]">
                <h2 id="objective-heading" className="text-[length:var(--text-lg)]">
                  State the objective
                </h2>
                <p className="mt-[var(--space-2xs)] max-w-[var(--measure)] text-muted [text-wrap:pretty]">
                  “The discussion should answer the objectives. All others are secondary.” Page 80. The sentences in
                  step 3 are written to answer this.
                </p>
                <textarea
                  ref={objectiveRef}
                  id="objective"
                  value={objective}
                  onChange={(e) => {
                    setObjective(e.target.value);
                    if (e.target.value.trim()) setObjectiveMissing(false);
                  }}
                  rows={2}
                  required
                  aria-required="true"
                  aria-invalid={objectiveMissing}
                  aria-describedby={objectiveMissing ? "objective-error" : undefined}
                  placeholder="What was the experiment trying to find out?"
                  className="field mt-[var(--space-sm)] max-w-[var(--measure)]"
                />
                {objectiveMissing && (
                  <p id="objective-error" role="alert" className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] text-error">
                    Write the objective first. Without it the method cannot decide what to say first.
                  </p>
                )}
                <div className="mt-[var(--space-md)]">
                  <button type="button" className="btn" onClick={handleSubmit}>
                    Start step 1: summarize each row
                  </button>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-sm)]">
              <div className="max-w-[var(--measure)]">
                <p className="text-[length:var(--text-sm)] text-muted">Objective</p>
                <h1 className="text-[length:var(--text-lg)] [text-wrap:balance]">{objective}</h1>
              </div>
              <button type="button" className="btn btn--quiet" onClick={reset}>
                Start over
              </button>
            </div>
            <div className="mt-[var(--space-xl)]">
              <InterpretationDisplay
                tableData={tableData}
                telegraphic={telegraphic}
                step={step}
                onNext={next}
                prose={prose}
                proseLoading={proseLoading}
                proseError={proseError}
                onRetry={() => void writeProse(tableData, telegraphic)}
              />
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-rule">
        <p className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)] py-[var(--space-lg)] font-mono text-[length:var(--text-xs)] leading-[1.7] text-muted">
          Method: Bautista, O.K., and N.D. Bondad. 1997. Technical writing for beginners. ECRC and Associates, Los
          Baños, Laguna. ISBN 971-91902-0-5. Ch. 11, Interpreting data, pp. 80–85; Ch. 14, Language usage, pp.
          106–113. Revised 2012 as Bautista, Rosario, and Bautista Jr., Technical writing for publication in journals
          and for presentation, UPLB/UPLBFI, ISBN 978-971-547-303-3. Steps 1 and 2 computed locally from the
          mean-separation letters. Step 3 written by a language model under the book’s rules. Sample tables: Table 5 of
          the book and four practice tables supplied with it.
        </p>
      </footer>
    </div>
  );
}
