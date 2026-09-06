// src/app/t/[id]/page.tsx
//
// A table read through the three steps. /t/cucumber?step=2 is a link a
// teacher can hand out. Custom tables travel in ?d=.

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import InterpretationDisplay from "@/components/InterpretationDisplay";
import { decodeTable, sampleById } from "@/lib/samples";
import { telegraphic as summarize } from "@/lib/telegraphic";
import type { Prose, TableData } from "@/types";

function Results() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();

  const sample = id === "custom" ? null : sampleById(id);
  const tableData: TableData | null = useMemo(() => {
    if (sample) return sample.data;
    const d = params.get("d");
    return d ? decodeTable(d) : null;
  }, [sample, params]);
  const objective = params.get("o")?.trim() || sample?.objective || "";
  const stepParam = Number(params.get("step") ?? 1);
  const step: 1 | 2 | 3 = stepParam >= 3 ? 3 : stepParam === 2 ? 2 : 1;

  const telegraphic = useMemo(() => (tableData ? summarize(tableData) : null), [tableData]);

  const [prose, setProse] = useState<Prose | null>(null);
  const [proseLoading, setProseLoading] = useState(false);
  const [proseError, setProseError] = useState<string | null>(null);

  const writeProse = async () => {
    if (!tableData || !telegraphic) return;
    setProseLoading(true);
    setProseError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableData,
          objective,
          summary: telegraphic.summary,
          facts: telegraphic.facts,
          notes: telegraphic.notes,
        }),
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

  // Reaching step 3 (by button or by link) writes once.
  useEffect(() => {
    if (step === 3 && !prose && !proseLoading && !proseError) void writeProse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, tableData]);

  const go = (s: 1 | 2 | 3) => {
    const q = new URLSearchParams(params.toString());
    q.set("step", String(s));
    router.push(`/t/${id}?${q}`, { scroll: false });
  };

  if (!tableData || !telegraphic) {
    return (
      <div className="max-w-[var(--measure)]">
        <h1 className="text-[length:var(--text-xl)]">No table here</h1>
        <p className="text-muted mt-[var(--space-sm)]">
          This link does not carry a readable table.{" "}
          <Link href="/" className="link">
            Start from the worksheet.
          </Link>
        </p>
      </div>
    );
  }

  if (!objective) {
    return (
      <div className="max-w-[var(--measure)]">
        <h1 className="text-[length:var(--text-xl)]">No objective</h1>
        <p className="text-muted mt-[var(--space-sm)]">
          The method needs the objective of the experiment first (p. 80).{" "}
          <Link href="/" className="link">
            Set it on the worksheet.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-sm)]">
        <div className="max-w-[var(--measure)]">
          <p className="text-muted text-[length:var(--text-sm)]">{sample ? sample.name : "Your table"} · Objective</p>
          <h1 className="text-[length:var(--text-lg)] [text-wrap:balance]">{objective}</h1>
        </div>
        <div className="flex gap-[var(--space-sm)] print:hidden">
          <button type="button" className="btn btn--quiet" onClick={() => window.print()}>
            Print
          </button>
          <Link href="/" className="btn btn--quiet">
            Start over
          </Link>
        </div>
      </div>
      <div className="mt-[var(--space-xl)]">
        <InterpretationDisplay
          tableData={tableData}
          telegraphic={telegraphic}
          step={step}
          onNext={() => go(step === 1 ? 2 : 3)}
          prose={prose}
          proseLoading={proseLoading}
          proseError={proseError}
          onRetry={() => void writeProse()}
        />
      </div>
    </>
  );
}

export default function TablePage() {
  return (
    <Suspense fallback={null}>
      <Results />
    </Suspense>
  );
}
