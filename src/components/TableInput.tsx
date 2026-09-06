// src/components/TableInput.tsx
//
// Step one of the worksheet: choose a table. Pick one from the book, type one
// in, or paste one. Reports the current draft upward; the page owns the
// objective and the Summarize button so the order is table, objective, go.

"use client";

import { useEffect, useState } from "react";
import type { TableData } from "@/types";
import Photo from "./Photo";
import { SAMPLES } from "@/lib/samples";
import { parseTable } from "@/lib/csv";

interface TableInputProps {
  onChange: (draft: TableData | null, sampleId: string | null) => void;
  onObjectiveSuggested: (objective: string) => void;
}

type Mode = "pick" | "manual" | "csv";

export default function TableInput({ onChange, onObjectiveSuggested }: TableInputProps) {
  const [mode, setMode] = useState<Mode>("pick");
  const [csvText, setCsvText] = useState("");
  const [headers, setHeaders] = useState<string[]>(["A", "B", "C", "D"]);
  const [rows, setRows] = useState<string[][]>([["", "", "", "", ""]]);
  const [lowerIsBetter, setLowerIsBetter] = useState<boolean[]>([false]);
  const [selectedSample, setSelectedSample] = useState<number | null>(null);

  // Report the draft upward whenever it changes.
  useEffect(() => {
    const sid = selectedSample === null ? null : SAMPLES[selectedSample].id;
    if (mode === "pick") {
      onChange(null, null);
      return;
    }
    if (mode === "csv") {
      onChange(parseTable(csvText), null);
      return;
    }
    const kept = rows.map((r, i) => ({ r, i })).filter(({ r }) => r.some((c) => c.trim() !== ""));
    onChange(
      kept.length
        ? { headers, rows: kept.map(({ r }) => r), lowerIsBetter: kept.map(({ i }) => lowerIsBetter[i] ?? false) }
        : null,
      sid,
    );
  }, [mode, csvText, headers, rows, lowerIsBetter, selectedSample, onChange]);

  const loadSample = (index: number) => {
    const s = SAMPLES[index];
    setHeaders([...s.data.headers]);
    setRows(s.data.rows.map((r) => r.map(String)));
    setLowerIsBetter(s.data.rows.map((_, i) => s.data.lowerIsBetter?.[i] ?? false));
    setSelectedSample(index);
    setMode("manual");
    onObjectiveSuggested(s.objective);
  };

  const startBlank = () => {
    setHeaders(["A", "B", "C", "D"]);
    setRows([["", "", "", "", ""]]);
    setLowerIsBetter([false]);
    setSelectedSample(null);
    setMode("manual");
  };

  const edited = () => setSelectedSample(null);
  const updateHeader = (i: number, v: string) => {
    edited();
    setHeaders(headers.map((h, k) => (k === i ? v : h)));
  };
  const updateCell = (ri: number, ci: number, v: string) => {
    edited();
    setRows(rows.map((r, k) => (k === ri ? r.map((c, j) => (j === ci ? v : c)) : r)));
  };
  const addRow = () => {
    setRows([...rows, Array(headers.length + 1).fill("")]);
    setLowerIsBetter([...lowerIsBetter, false]);
  };
  const removeRow = (i: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, k) => k !== i));
    setLowerIsBetter(lowerIsBetter.filter((_, k) => k !== i));
  };
  const addColumn = () => {
    setHeaders([...headers, String.fromCharCode(65 + headers.length)]);
    setRows(rows.map((r) => [...r, ""]));
  };
  const removeColumn = (i: number) => {
    if (headers.length === 1) return;
    setHeaders(headers.filter((_, k) => k !== i));
    setRows(rows.map((r) => r.filter((_, k) => k !== i + 1)));
  };

  if (mode === "pick") {
    return (
      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-[length:var(--text-lg)]">
          Choose a table
        </h2>
        <p className="text-muted mt-[var(--space-2xs)] max-w-[var(--measure)] [text-wrap:pretty]">
          Start with the book’s own example, or one of the practice tables. Each shows one thing the method has to
          handle.
        </p>
        <ul className="border-rule mt-[var(--space-md)] border-t">
          {SAMPLES.map((s, i) => (
            <li key={s.name} className="border-rule border-b">
              <button
                type="button"
                onClick={() => loadSample(i)}
                className="hover:bg-paper-2 grid w-full grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-[var(--space-md)] gap-y-[var(--space-3xs)] py-[var(--space-xs)] text-left transition-[background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] sm:grid-cols-[6rem_minmax(0,14rem)_minmax(0,1fr)]"
              >
                <Photo photo={s.photo} size="thumb" />
                <span className="font-display text-[length:var(--text-md)] leading-tight">{s.name}</span>
                <span className="text-muted col-start-2 text-[length:var(--text-sm)] sm:col-start-3">{s.source}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="text-muted mt-[var(--space-md)] text-[length:var(--text-sm)]">
          Or bring your own:{" "}
          <button type="button" className="link" onClick={startBlank}>
            type it in
          </button>{" "}
          or{" "}
          <button type="button" className="link" onClick={() => setMode("csv")}>
            paste CSV or TSV
          </button>
          . Keep the letters on the numbers, as in <span className="font-mono">45ab</span>.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="table-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-x-[var(--space-md)] gap-y-[var(--space-2xs)]">
        <h2 id="table-heading" className="text-[length:var(--text-lg)]">
          {selectedSample !== null ? SAMPLES[selectedSample].name : "Your table"}
        </h2>
        <div className="flex gap-[var(--space-sm)] text-[length:var(--text-sm)]">
          {mode === "manual" ? (
            <button type="button" className="link" onClick={() => setMode("csv")}>
              Paste CSV instead
            </button>
          ) : (
            <button type="button" className="link" onClick={startBlank}>
              Type it in instead
            </button>
          )}
          <button
            type="button"
            className="link"
            onClick={() => {
              setMode("pick");
              setSelectedSample(null);
            }}
          >
            Choose a different table
          </button>
        </div>
      </div>
      {selectedSample !== null && (
        <p className="text-muted mt-[var(--space-2xs)] text-[length:var(--text-sm)]">
          {SAMPLES[selectedSample].source}
        </p>
      )}

      {mode === "csv" ? (
        <div className="mt-[var(--space-md)]">
          <label htmlFor="csv" className="text-muted block text-[length:var(--text-sm)]">
            First row: a blank or “Parameter” cell, then treatment names. Following rows: parameter, then values.
            Commas, tabs, or semicolons. Quote a name that contains a comma.
          </label>
          <textarea
            id="csv"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={8}
            className="field mt-[var(--space-2xs)] font-mono text-[length:var(--text-sm)]"
            placeholder={
              "Parameter,A,B,C,D\nPlant height (cm),200a,190a,180a,185a\nTotal yield (g),1500a,1300a,600b,650b"
            }
          />
        </div>
      ) : (
        <div className="mt-[var(--space-md)]">
          <div className="sheet overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th scope="col" className="min-w-[13rem] text-left">
                    <span className="text-muted block px-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-sm)]">
                      Parameter
                    </span>
                  </th>
                  {headers.map((h, i) => (
                    <th key={i} scope="col" className="min-w-[6.5rem]">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => updateHeader(i, e.target.value)}
                          aria-label={`Treatment ${i + 1} name`}
                          className="cell cell--head"
                        />
                        {headers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColumn(i)}
                            aria-label={`Remove column ${h || i + 1}`}
                            title="Remove column"
                            className="ghost"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="w-[5.5rem]">
                    <span className="text-muted block px-[var(--space-xs)] py-[var(--space-2xs)] text-center text-[length:var(--text-xs)] leading-tight">
                      lower is better
                    </span>
                  </th>
                  <th scope="col" className="w-[2.5rem]">
                    <button
                      type="button"
                      onClick={addColumn}
                      aria-label="Add column"
                      title="Add column"
                      className="ghost w-full"
                    >
                      +
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(ri, ci, e.target.value)}
                          aria-label={ci === 0 ? `Row ${ri + 1} parameter` : `Row ${ri + 1}, ${headers[ci - 1]}`}
                          placeholder={ci === 0 ? "Parameter" : "45ab"}
                          className={`cell ${ci === 0 ? "" : "cell--num"}`}
                        />
                      </td>
                    ))}
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={lowerIsBetter[ri] ?? false}
                        onChange={(e) =>
                          setLowerIsBetter(lowerIsBetter.map((v, k) => (k === ri ? e.target.checked : v)))
                        }
                        aria-label={`Row ${ri + 1}: a lower value is the better result`}
                        className="h-4 w-4 accent-[var(--color-accent)]"
                      />
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(ri)}
                        aria-label={`Remove row ${ri + 1}`}
                        title="Remove row"
                        className="ghost"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-[var(--space-sm)] flex items-center gap-[var(--space-md)]">
            <button type="button" className="btn btn--quiet" onClick={addRow}>
              Add row
            </button>
            <p className="text-muted text-[length:var(--text-xs)]">Tab moves across cells.</p>
          </div>

          <aside
            className="note mt-[var(--space-md)] max-w-[var(--measure)] text-[length:var(--text-sm)]"
            aria-label="What the letters mean"
          >
            <p className="font-medium">What the letters mean</p>
            <p className="mt-[var(--space-3xs)] [text-wrap:pretty]">
              The letters after the numbers come from the statistical test in the paper (DMRT, HSD, or LSD). Treatments
              that share a letter are not different. Treatments with no letter in common are.
            </p>
            <p className="mt-[var(--space-2xs)] font-mono">
              1500<span className="letters">a</span>&nbsp; 1300<span className="letters">a</span>&nbsp; 600
              <span className="letters">b</span>&nbsp; 650<span className="letters">b</span>
            </p>
            <p className="text-muted mt-[var(--space-3xs)] [text-wrap:pretty]">
              A and B share <span className="letters">a</span>, so they are equal. C and D share{" "}
              <span className="letters">b</span>, so they are equal. A and C share nothing, so A is higher.{" "}
              <span className="font-mono">45ab</span> belongs to both groups. Book p. 38 and p. 83.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
