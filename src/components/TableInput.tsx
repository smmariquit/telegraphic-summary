// src/components/TableInput.tsx

"use client";

import { useState } from "react";
import type { TableData } from "@/types";

interface TableInputProps {
  onTableSubmit: (data: TableData) => void;
  onObjectiveSuggested: (objective: string) => void;
}

interface SampleDataset {
  name: string;
  source: string;
  objective: string;
  data: TableData;
}

// Table 5 of the book (p81) plus the four handwritten practice tables that came with the scan.
const SAMPLE_DATASETS: SampleDataset[] = [
  {
    name: "Cucumber fertilizer trial",
    source: "Table 5, p81. Growth and yield of 'Pointsett' cucumber applied with different fertilizers.",
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
    source: "Practice table. Seed yield of peanut applied with soil additives, HSD letters.",
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
    source: "Practice table. Growth performance of broilers fed diets with levels of Acacia pod meal, 42 days.",
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
    source: "Practice table. Characteristics of rice wine from young (1 mo) and aged (6 mo) rice yeast, warm or cold rice.",
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
    source: "Practice table. Quality of mango washed with different agents and stored at 12 C for 10 days.",
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

export default function TableInput({ onTableSubmit, onObjectiveSuggested }: TableInputProps) {
  const [inputMode, setInputMode] = useState<"csv" | "manual">("manual");
  const [csvText, setCsvText] = useState("");
  const [headers, setHeaders] = useState<string[]>(["A", "B", "C", "D"]);
  const [rows, setRows] = useState<string[][]>([["", "", "", "", ""]]);
  const [lowerIsBetter, setLowerIsBetter] = useState<boolean[]>([false]);
  const [selectedSample, setSelectedSample] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSample = (index: number) => {
    const s = SAMPLE_DATASETS[index];
    setHeaders([...s.data.headers]);
    setRows(s.data.rows.map((r) => r.map(String)));
    setLowerIsBetter(s.data.rows.map((_, i) => s.data.lowerIsBetter?.[i] ?? false));
    setSelectedSample(index);
    setInputMode("manual");
    setError(null);
    onObjectiveSuggested(s.objective);
  };

  const parseCSV = (text: string): TableData | null => {
    const lines = text.trim().split("\n").filter((l) => l.trim());
    if (lines.length < 2) return null;
    const split = (line: string) => (line.includes("\t") ? line.split("\t") : line.split(",")).map((c) => c.trim());
    const head = split(lines[0]);
    return { headers: head.slice(1), rows: lines.slice(1).map(split) };
  };

  const submitCSV = () => {
    const parsed = parseCSV(csvText);
    if (!parsed) {
      setError("Need a header row and at least one data row, separated by commas or tabs.");
      return;
    }
    setError(null);
    onTableSubmit(parsed);
  };

  const submitManual = () => {
    const kept = rows.map((r, i) => ({ r, i })).filter(({ r }) => r.some((c) => c.trim() !== ""));
    if (kept.length === 0) {
      setError("Enter at least one row of data.");
      return;
    }
    setError(null);
    onTableSubmit({
      headers,
      rows: kept.map(({ r }) => r),
      lowerIsBetter: kept.map(({ i }) => lowerIsBetter[i] ?? false),
    });
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

  return (
    <section aria-labelledby="table-heading" className="mt-[var(--space-xl)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-[var(--space-md)] gap-y-[var(--space-2xs)]">
        <h2 id="table-heading" className="text-[length:var(--text-lg)]">
          The table
        </h2>
        <div role="group" aria-label="Input mode" className="flex gap-[var(--space-sm)] text-[length:var(--text-sm)]">
          <button
            type="button"
            className="link"
            aria-current={inputMode === "manual" ? "page" : undefined}
            onClick={() => setInputMode("manual")}
          >
            Type it in
          </button>
          <button
            type="button"
            className="link"
            aria-current={inputMode === "csv" ? "page" : undefined}
            onClick={() => setInputMode("csv")}
          >
            Paste CSV or TSV
          </button>
        </div>
      </div>
      <p className="mt-[var(--space-2xs)] max-w-[var(--measure)] text-muted">
        Rows are parameters, columns are treatments. Keep the mean-separation letters on the numbers,
        the way they appear in your table: <span className="font-mono">45ab</span>. Without letters the method
        cannot say which treatments differ.
      </p>

      {/* Samples, hairline list */}
      <div className="mt-[var(--space-md)]">
        <p className="text-[length:var(--text-sm)] text-muted">Or start from a table in the book:</p>
        <ul className="mt-[var(--space-2xs)] border-t border-rule">
          {SAMPLE_DATASETS.map((s, i) => (
            <li key={s.name} className="border-b border-rule">
              <button
                type="button"
                onClick={() => loadSample(i)}
                aria-pressed={selectedSample === i}
                className="grid w-full grid-cols-1 gap-x-[var(--space-md)] py-[var(--space-xs)] text-left transition-[background-color] duration-[var(--dur-short)] ease-[var(--ease-out)] hover:bg-paper-2 aria-pressed:bg-paper-2 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
              >
                <span className="font-display text-[length:var(--text-md)] leading-tight">{s.name}</span>
                <span className="text-[length:var(--text-sm)] text-muted">{s.source}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {inputMode === "csv" ? (
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
          <div className="mt-[var(--space-sm)] flex items-center gap-[var(--space-md)]">
            <button type="button" className="btn" onClick={submitCSV}>
              Summarize
            </button>
            {error && (
              <p role="alert" className="text-[length:var(--text-sm)] text-error">
                {error}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-[var(--space-md)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-rule-strong">
                  <th scope="col" className="py-[var(--space-2xs)] pr-[var(--space-xs)] text-left font-medium">
                    Parameter
                  </th>
                  {headers.map((h, i) => (
                    <th key={i} scope="col" className="min-w-[6rem] py-[var(--space-2xs)] px-[var(--space-3xs)]">
                      <div className="flex items-center gap-[var(--space-3xs)]">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => updateHeader(i, e.target.value)}
                          aria-label={`Treatment ${i + 1} name`}
                          className="field text-center font-medium"
                        />
                        {headers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColumn(i)}
                            aria-label={`Remove column ${h || i + 1}`}
                            className="link px-[var(--space-3xs)] text-[length:var(--text-sm)]"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="py-[var(--space-2xs)] pl-[var(--space-xs)] text-left text-[length:var(--text-xs)] font-normal text-muted">
                    Lower is better
                  </th>
                  <th scope="col" className="w-8">
                    <button type="button" onClick={addColumn} aria-label="Add column" className="link px-[var(--space-3xs)]">
                      +
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-rule">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-[var(--space-3xs)] px-[var(--space-3xs)]">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(ri, ci, e.target.value)}
                          aria-label={ci === 0 ? `Row ${ri + 1} parameter` : `Row ${ri + 1}, ${headers[ci - 1]}`}
                          placeholder={ci === 0 ? "Parameter" : "45ab"}
                          className={`field ${ci === 0 ? "font-medium" : "text-center font-mono text-[length:var(--text-sm)]"}`}
                        />
                      </td>
                    ))}
                    <td className="pl-[var(--space-xs)] text-center">
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
                        className="link px-[var(--space-3xs)] text-[length:var(--text-sm)]"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-[var(--space-sm)] flex flex-wrap items-center gap-[var(--space-md)]">
            <button type="button" className="btn btn--quiet" onClick={addRow}>
              Add row
            </button>
            <button type="button" className="btn" onClick={submitManual}>
              Summarize
            </button>
            {error && (
              <p role="alert" className="text-[length:var(--text-sm)] text-error">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
