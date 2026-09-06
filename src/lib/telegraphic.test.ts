// src/lib/telegraphic.test.ts
// Run: node --test src/lib/telegraphic.test.ts
// Checks the core against Table 5 of the book (p81) and its summary (p82).

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCell, telegraphic } from "./telegraphic.ts";

const cucumber = {
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
};

test("parseCell splits value and letters", () => {
  assert.deepEqual(parseCell("45ab"), { raw: "45ab", value: 45, letters: "ab", ns: false });
  assert.deepEqual(parseCell("0.44 d"), { raw: "0.44 d", value: 0.44, letters: "d", ns: false });
  assert.equal(parseCell("NS").ns, true);
  assert.equal(parseCell("-").value, null);
  assert.equal(parseCell("1,500a").value, 1500);
});

test("Table 5: yield rows read A=B>C=D, growth rows read A=B=C=D or NS", () => {
  const t = telegraphic(cucumber);
  const by = Object.fromEntries(t.rows.map((r) => [r.parameter, r.pattern]));
  assert.equal(by["Plant height (cm)"], "A=B=C=D or NS");
  assert.equal(by["Branches (No.)"], "A=B=C=D or NS");
  assert.equal(by["Root dry weight (g)"], "A=B=C=D or NS");
  assert.equal(by["Total weight of fruits (g)"], "A=B>C=D");
  assert.equal(by["Fruits/plant (No.)"], "A=B>C=D");
  assert.equal(by["Mean weight of fruits (g)"], "A=B>C=D");
  // The printed table has D = 35a for shoot dry weight, so the letters say A=B=D>C.
  // The book's own summary says A=B>C=D. Book typo, kept as printed.
  assert.equal(by["Shoot dry weight (g)"], "A=B=D>C");

  const yieldGroup = t.groups.find((g) => g.pattern === "A=B>C=D");
  assert.deepEqual(yieldGroup?.parameters, [
    "Total weight of fruits (g)",
    "Fruits/plant (No.)",
    "Mean weight of fruits (g)",
  ]);

  // Plain-English facts for the model, one per group, derived from the letters.
  assert.equal(t.facts.length, t.groups.length);
  assert.equal(
    t.facts[2],
    "Total weight of fruits (g), Fruits/plant (No.), and Mean weight of fruits (g): A and B did not differ from one another; they were greater than C and D. C and D did not differ from one another.",
  );
  assert.equal(
    t.facts[1],
    "Shoot dry weight (g): A, B, and D did not differ from one another; they were greater than C.",
  );

  // Only rows that differ get highlights, and only the top tier (A and B).
  const yieldRow = 5;
  const cols = t.highlightedCells.filter((c) => c.row === yieldRow).map((c) => c.col);
  assert.deepEqual(cols, [0, 1]);
  assert.equal(t.highlightedCells.filter((c) => c.row === 0).length, 0);
});

test("overlapping letters are flagged, not guessed", () => {
  const t = telegraphic({
    headers: ["Control", "Inorganic", "VC+Nitroplus"],
    rows: [["Seed yield (t/ha)", "0.44d", "0.83ab", "0.91a"]],
  });
  assert.equal(t.rows[0].pattern, "Inorganic=VC+Nitroplus>Control");
  assert.equal(t.rows[0].overlapping, false);

  const chain = telegraphic({
    headers: ["A", "B", "C"],
    rows: [["x", "10a", "8ab", "6b"]],
  });
  assert.equal(chain.rows[0].overlapping, true);
  assert.equal(chain.rows[0].pattern, "A=B≥C");
  assert.match(chain.notes[0], /overlap/);

  // The peanut practice table: a, ab, abc, abcd, bcd, cd, d. Chaining would call all ten equal.
  const peanut = telegraphic({
    headers: ["Ctl", "Inorg", "VC", "VCB", "VCF", "VCN", "FM", "FMB", "FMF", "FMN"],
    rows: [
      [
        "Seed yield",
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
  });
  assert.equal(peanut.rows[0].pattern, "Inorg=VC=VCN=FMB≥VCB=VCF=FMF=FMN≥FM≥Ctl");
  assert.deepEqual(
    peanut.highlightedCells.map((c) => c.col),
    [1, 2, 5, 7],
  );
});

test("no letters and monotonic values read as a trend, not a difference", () => {
  const t = telegraphic({
    headers: ["0", "0.5", "1.0", "2.5", "5.0"],
    rows: [
      ["Body weight (g)", "2120a", "2090", "2062", "2000", "1948"],
      ["Feed intake (g)", "3950", "3930", "4020", "3910", "4000"],
    ],
  });
  assert.equal(t.rows[0].kind, "trend");
  assert.match(t.rows[0].pattern, /decreasing from 0 to 5\.0/);
  assert.equal(t.rows[1].kind, "same");
  assert.equal(t.highlightedCells.length, 0);
});

test("lower is better flips the order", () => {
  const t = telegraphic({
    headers: ["Unwashed", "Water", "Alum"],
    rows: [["Disease rating", "2.16a", "2.12b", "1.63c"]],
    lowerIsBetter: [true],
  });
  assert.equal(t.rows[0].pattern, "Alum>Water>Unwashed");
  assert.equal(t.highlightedCells[0].col, 2);
});
