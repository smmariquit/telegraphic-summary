// src/components/TableInput.tsx
//
// Step one of the worksheet: choose a table. Pick one from the book, type one
// in, or paste one. Reports the current draft upward; the page owns the
// objective and the Summarize button so the order is table, objective, go.

"use client";

import { useEffect, useState } from "react";
import type { TableData } from "@/types";

interface TableInputProps {
  onChange: (draft: TableData | null) => void;
  onObjectiveSuggested: (objective: string) => void;
}

interface SampleDataset {
  name: string;
  source: string;
  objective: string;
  data: TableData;
}

// Table 5 of the book (p81) plus the four handwritten practice tables that came with the scan.
export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    name: "Cucumber fertilizer trial",
    source: "Table 5, p81. The book’s own worked example.",
    objective:
      "Look for a substitute for the costlier and more-difficult-to-prepare standard fertilizer A among formulations B, C, and D.",
    data: {
      headers: ["A", "B", "C", "D"],
      rows: [
        ["Plant height (cm)", "200a", "190a", "180a", "185a"],
        ["Branches (No.)", "18a", "15a", "17a", "15a"],
        ["Shoot dry weight (g)", "50a", "45ab", "30c", "35a"],
        ["Root dry weight (g)", "2a", "2a", "1a", "1a"],
        ["Shoot root ratio", "3a", "2a", "2a", "1a"],
        ["Total weight of fruits (g)", "1500a", "1300a", "600b", "650b"],
        ["Fruits/plant (No.)", "6a", "5a", "3b", "3b"],
        ["Mean weight of fruits (g)", "250a", "255a", "230b", "220b"],
      ],
    },
  },
  {
    name: "Peanut soil additives",
    source: "Practice table. One row, ten treatments, overlapping letters.",
    objective: "Find a soil additive that matches inorganic fertilizer in peanut seed yield.",
    data: {
      headers: [
        "Control",
        "Inorganic fertilizer",
        "Vermicompost",
        "VC + BioGroe",
        "VC + Formula 4",
        "VC + Nitroplus",
        "Farmyard manure",
        "FM + BioGroe",
        "FM + Formula 4",
        "FM + Nitroplus",
      ],
      rows: [
        ["Seed yield (t/ha)", "0.44d", "0.83ab", "0.76abc", "0.58bcd", "0.62bcd", "0.91a", "0.52cd", "0.68abcd", "0.65bcd", "0.57bcd"],
      ],
    },
  },
  {
    name: "Broiler Acacia pod meal",
    source: "Practice table. No letters, only a trend.",
    objective: "Determine how much Acacia pod meal can replace conventional feed without reducing broiler growth.",
    data: {
      headers: ["0", "0.5", "1.0", "2.5", "5.0"],
      rows: [
        ["Body weight (g)", "2120a", "2090", "2062", "2000", "1948"],
        ["Body weight gain (g)", "1986", "1955", "1927", "1865", "1814"],
        ["Feed intake (g), NS", "3950", "3930", "4020", "3910", "4000"],
        ["Feed efficiency, NS", "1.99", "2.01", "2.09", "2.10", "2.21"],
      ],
    },
  },
  {
    name: "Rice wine yeast",
    source: "Practice table. Two factors read as four treatments.",
    objective: "Compare young and aged rice yeast, at warm and cold rice temperature, for rice wine quality.",
    data: {
      headers: ["Aged, warm", "Aged, cold", "Young, warm", "Young, cold"],
      rows: [
        ["Taste", "1.56a", "2.06a", "2.50a", "3.13b"],
        ["Appearance", "1.56a", "1.04a", "1.94a", "2.13a"],
        ["Color", "2.69c", "2.44b", "1.50a", "1.88ab"],
        ["General acceptability", "1.94a", "2.15b", "1.98a", "2.38b"],
      ],
    },
  },
  {
    name: "Mango wash treatments",
    source: "Practice table. One row where lower is better.",
    objective: "Find a wash treatment that lowers disease and keeps fruit quality during storage.",
    data: {
      headers: ["Unwashed", "Water alone", "0.5% alum", "Detergent solution", "1.5% Chlorox"],
      rows: [
        ["Disease rating", "2.16a", "2.12b", "1.63c", "1.25e", "1.46d"],
        ["Quality rating", "5.20a", "5.01b", "8.05c", "7.21e", "6.92d"],
      ],
      lowerIsBetter: [true, false],
    },
  },
];

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
    if (mode === "pick") {
      onChange(null);
      return;
    }
    if (mode === "csv") {
      onChange(parseCSV(csvText));
      return;
    }
    const kept = rows.map((r, i) => ({ r, i })).filter(({ r }) => r.some((c) => c.trim() !== ""));
    onChange(
      kept.length
        ? { headers, rows: kept.map(({ r }) => r), lowerIsBetter: kept.map(({ i }) => lowerIsBetter[i] ?? false) }
        : null,
    );
  }, [mode, csvText, headers, rows, lowerIsBetter, onChange]);

  const loadSample = (index: number) => {
    const s = SAMPLE_DATASETS[index];
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

  const updateHeader = (i: number, v: string) => setHeaders(headers.map((h, k) => (k === i ? v : h)));
  const updateCell = (ri: number, ci: number, v: string) =>
    setRows(rows.map((r, k) => (k === ri ? r.map((c, j) => (j === ci ? v : c)) : r)));
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
        <p className="mt-[var(--space-2xs)] max-w-[var(--measure)] text-muted [text-wrap:pretty]">
          Start with the book’s own example, or one of the practice tables. Each shows one thing the method has to handle.
        </p>
        <ul className="mt-[var(--space-md)] border-t border-rule">
          {SAMPLE_DATASETS.map((s, i) => (
            <li key={s.name} className="border-b border-rule">
              <button
                type="button"
                onClick={() => loadSample(i)}
                className="grid w-full grid-cols-1 gap-x-[var(--space-md)] py-[var(--space-sm)] text-left transition-[background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-paper-2 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
              >
                <span className="font-display text-[length:var(--text-md)] leading-tight">{s.name}</span>
                <span className="text-[length:var(--text-sm)] text-muted">{s.source}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-[var(--space-md)] text-[length:var(--text-sm)] text-muted">
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
          {selectedSample !== null ? SAMPLE_DATASETS[selectedSample].name : "Your table"}
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
        <p className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] text-muted">{SAMPLE_DATASETS[selectedSample].source}</p>
      )}

      {mode === "csv" ? (
        <div className="mt-[var(--space-md)]">
          <label htmlFor="csv" className="block text-[length:var(--text-sm)] text-muted">
            First row: a blank or “Parameter” cell, then treatment names. Following rows: parameter, then values.
          </label>
          <textarea
            id="csv"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={8}
            className="field mt-[var(--space-2xs)] font-mono text-[length:var(--text-sm)]"
            placeholder={"Parameter,A,B,C,D\nPlant height (cm),200a,190a,180a,185a\nTotal yield (g),1500a,1300a,600b,650b"}
          />
        </div>
      ) : (
        <div className="mt-[var(--space-md)]">
          <div className="sheet overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th scope="col" className="min-w-[13rem] text-left">
                    <span className="block px-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-sm)] text-muted">
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
                    <span className="block px-[var(--space-xs)] py-[var(--space-2xs)] text-center text-[length:var(--text-xs)] leading-tight text-muted">
                      lower is better
                    </span>
                  </th>
                  <th scope="col" className="w-[2.5rem]">
                    <button type="button" onClick={addColumn} aria-label="Add column" title="Add column" className="ghost w-full">
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
                        onChange={(e) => setLowerIsBetter(lowerIsBetter.map((v, k) => (k === ri ? e.target.checked : v)))}
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
            <p className="text-[length:var(--text-xs)] text-muted">Tab moves across cells. Letters stay on the numbers: 45ab.</p>
          </div>
        </div>
      )}
    </section>
  );
}

function parseCSV(text: string): TableData | null {
  const lines = text.trim().split("\n").filter((l) => l.trim());
  if (lines.length < 2) return null;
  const split = (line: string) => (line.includes("\t") ? line.split("\t") : line.split(",")).map((c) => c.trim());
  const head = split(lines[0]);
  return { headers: head.slice(1), rows: lines.slice(1).map(split) };
}
