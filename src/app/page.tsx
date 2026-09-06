// src/app/page.tsx
//
// The worksheet: choose a table, state the objective, start step 1.
// Results live at /t/<sample> or /t/custom?d=..., so they can be linked.

"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TableInput from "@/components/TableInput";
import Photo from "@/components/Photo";
import { encodeTable } from "@/lib/samples";
import type { TableData } from "@/types";

export default function Home() {
  const router = useRouter();
  const [draft, setDraft] = useState<TableData | null>(null);
  const [sampleId, setSampleId] = useState<string | null>(null);
  const [objective, setObjective] = useState("");
  const [objectiveMissing, setObjectiveMissing] = useState(false);
  const objectiveRef = useRef<HTMLTextAreaElement>(null);
  const objectiveSectionRef = useRef<HTMLElement>(null);

  const onDraftChange = useCallback((d: TableData | null, id: string | null) => {
    setDraft(d);
    setSampleId(id);
  }, []);

  const start = () => {
    if (!draft) return;
    if (!objective.trim()) {
      setObjectiveMissing(true);
      objectiveRef.current?.focus();
      return;
    }
    const q = new URLSearchParams({ step: "1", o: objective.trim() });
    if (sampleId) {
      router.push(`/t/${sampleId}?${q}`);
    } else {
      q.set("d", encodeTable(draft));
      router.push(`/t/custom?${q}`);
    }
  };

  return (
    <>
      <h1 className="max-w-[24ch] text-[length:var(--text-display)] [text-wrap:balance]">
        Read the table before you write about it.
      </h1>
      <p className="text-muted mt-[var(--space-md)] max-w-[var(--measure)] text-[length:var(--text-md)] [text-wrap:pretty]">
        Three steps from Bautista and Bondad, <cite>Technical Writing for Beginners</cite>, 1997, Chapter 11. Summarize
        each row from its letters. Group the rows that agree. Turn each group into a sentence.
      </p>

      {/* the worked example: cucumber, and what the book says about it */}
      <div className="mt-[var(--space-xl)] grid gap-[var(--space-lg)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Photo
          photo="cucumber"
          caption="The book’s worked example is a cucumber fertilizer trial: four formulations, eight measurements, one question."
          priority
        />
        <div>
          <blockquote className="quote">
            “Look for the most striking aspect of the figure or table and state it, keeping in mind the objective of the
            experiment.”
            <cite>Bautista and Bondad, 1997, p. 80</cite>
          </blockquote>
          <blockquote className="quote">
            “Look for trends or patterns and state them. Avoid citing data one by one as they appear in a table. Do not
            enumerate all the information contained in a table but explain the general points.”
            <cite>Bautista and Bondad, 1997, p. 82</cite>
          </blockquote>
        </div>
      </div>

      {/* the method in one row, from Table 5 */}
      <ol className="border-rule sm:divide-rule mt-[var(--space-xl)] grid gap-[var(--space-md)] border-y py-[var(--space-md)] text-[length:var(--text-sm)] sm:grid-cols-3 sm:divide-x">
        <li className="sm:pr-[var(--space-md)]">
          <p className="text-muted">1. A row of the table</p>
          <p className="mt-[var(--space-2xs)] font-mono text-[length:var(--text-md)]">
            1500<span className="letters">a</span> · 1300<span className="letters">a</span> · 600
            <span className="letters">b</span> · 650<span className="letters">b</span>
          </p>
          <p className="text-muted mt-[var(--space-2xs)]">
            a and a: no difference. a and b: different. From Table 5, total weight of fruits.
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
            window.setTimeout(
              () => objectiveSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
              50,
            );
          }}
        />
      </div>

      {draft && (
        <section
          ref={objectiveSectionRef}
          aria-labelledby="objective-heading"
          className="rise mt-[var(--space-2xl)] scroll-mt-[var(--space-md)]"
        >
          <h2 id="objective-heading" className="text-[length:var(--text-lg)]">
            State the objective
          </h2>
          <p className="text-muted mt-[var(--space-2xs)] max-w-[var(--measure)] [text-wrap:pretty]">
            “The discussion should answer the objectives. All others are secondary.” Page 80. The sentences in step 3
            are written to answer this.
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
            <p
              id="objective-error"
              role="alert"
              className="text-error mt-[var(--space-2xs)] text-[length:var(--text-sm)]"
            >
              Write the objective first. Without it the method cannot decide what to say first.
            </p>
          )}
          <div className="mt-[var(--space-md)]">
            <button type="button" className="btn" onClick={start}>
              Start step 1: summarize each row
            </button>
          </div>
        </section>
      )}
    </>
  );
}
