// src/lib/samples.ts
//
// Table 5 of the book (p81) plus the four handwritten practice tables that
// came with the scan. Each has a slug so it can live at /t/<slug>.

import type { TableData } from "@/types";
import type { PhotoKey } from "./photos";

export interface Sample {
  id: string;
  name: string;
  photo: PhotoKey;
  source: string;
  objective: string;
  data: TableData;
}

export const SAMPLES: Sample[] = [
  {
    id: "cucumber",
    name: "Cucumber fertilizer trial",
    photo: "cucumber",
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
    id: "peanut",
    name: "Peanut soil additives",
    photo: "peanut",
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
        [
          "Seed yield (t/ha)",
          "0.44d",
          "0.83ab",
          "0.76abc",
          "0.58bcd",
          "0.62bcd",
          "0.91a",
          "0.52cd",
          "0.68abcd",
          "0.65bcd",
          "0.57bcd",
        ],
      ],
    },
  },
  {
    id: "broiler",
    name: "Broiler Acacia pod meal",
    photo: "broiler",
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
    id: "ricewine",
    name: "Rice wine yeast",
    photo: "ricewine",
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
    id: "mango",
    name: "Mango wash treatments",
    photo: "mango",
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

export const sampleById = (id: string) => SAMPLES.find((s) => s.id === id) ?? null;

/** A custom table travels in the URL as base64url JSON. Small tables only; the API caps size anyway. */
export function encodeTable(t: TableData): string {
  const json = JSON.stringify(t);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeTable(s: string): TableData | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const t = JSON.parse(new TextDecoder().decode(bytes)) as TableData;
    if (!Array.isArray(t.headers) || !Array.isArray(t.rows)) return null;
    return t;
  } catch {
    return null;
  }
}
