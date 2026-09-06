// src/lib/prose.test.ts
// Run: npm test
// The prompt and parser for step 3, checked without calling the model.

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPrompt, LIMITS, parseProse, SYSTEM, validateBody } from "./prose.ts";
import { telegraphic } from "./telegraphic.ts";

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
const objective = "Look for a substitute for the costlier standard fertilizer A among formulations B, C, and D.";

test("the prompt hands the model the facts, the objective, and an exact sentence count", () => {
  const t = telegraphic(cucumber);
  const p = buildPrompt({ tableData: cucumber, objective, summary: t.summary, facts: t.facts, notes: t.notes });
  assert.match(p, /OBJECTIVE OF THE EXPERIMENT:\n.*fertilizer A/);
  assert.match(p, /exactly 3 sentences/);
  for (const f of t.facts) assert.ok(p.includes(f), `fact missing: ${f}`);
  assert.ok(p.includes("do not add, reverse, or split any"));
  assert.ok(p.includes("[cite]"));
});

test("the system prompt carries the book's rules with page numbers", () => {
  for (const page of ["p80", "p82", "p83", "p84", "p85", "p106", "p113"]) {
    assert.ok(SYSTEM.includes(page), `missing ${page}`);
  }
  assert.ok(SYSTEM.includes('"the data shows"'));
  assert.ok(SYSTEM.includes("Do not invent mechanisms, causes, or citations"));
});

test("parseProse accepts fenced JSON and rejects the wrong shape", () => {
  // Recorded from the live service on 2026-09-06 for Table 5.
  const recorded = `\`\`\`json
{"sentences": ["Fertilizer B proved to be a good substitute for A since the growth and yield of plants fertilized with A and B were almost equal.", "Fertilizer C did not perform as well as A, B, and D in terms of shoot dry weight.", "Fertilizers C and D yielded lower total weight of fruits, fruits per plant, and mean weight of fruits compared to A and B."], "paragraph": "Fertilizer B proved to be a good substitute for A since the growth and yield of plants fertilized with A and B were almost equal. This indicates that B can be a viable alternative [cite]."}
\`\`\``;
  const prose = parseProse(recorded);
  assert.ok(prose);
  assert.equal(prose.sentences.length, 3);
  assert.match(prose.paragraph, /\[cite\]/);

  assert.equal(parseProse("not json"), null);
  assert.equal(parseProse('{"sentences": "one", "paragraph": "x"}'), null);
  assert.equal(parseProse('{"sentences": [], "paragraph": "x"}'), null);
  assert.equal(parseProse(null), null);
});

test("validateBody caps size and requires the three inputs", () => {
  const t = telegraphic(cucumber);
  const ok = { tableData: cucumber, objective, summary: t.summary, facts: t.facts, notes: t.notes };
  assert.equal(validateBody(ok), null);
  assert.match(validateBody({ ...ok, objective: " " }) ?? "", /Objective/);
  assert.match(validateBody({ ...ok, summary: "" }) ?? "", /summary/);
  assert.match(validateBody({ ...ok, objective: "x".repeat(LIMITS.objectiveChars + 1) }) ?? "", /Objective over/);
  const wide = { ...cucumber, headers: Array(LIMITS.columns + 1).fill("T") };
  assert.match(validateBody({ ...ok, tableData: wide }) ?? "", /too large/);
  const tall = { ...cucumber, rows: Array(LIMITS.rows + 1).fill(cucumber.rows[0]) };
  assert.match(validateBody({ ...ok, tableData: tall }) ?? "", /too large/);
  assert.match(validateBody(null) ?? "", /JSON/);
});
