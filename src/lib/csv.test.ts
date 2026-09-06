// src/lib/csv.test.ts
// Run: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { detectDelimiter, parseDelimited, parseTable } from "./csv.ts";

test("comma, tab, and semicolon are detected from the first line", () => {
  assert.equal(detectDelimiter("a,b,c\n1,2,3"), ",");
  assert.equal(detectDelimiter("a\tb\tc\n1\t2\t3"), "\t");
  assert.equal(detectDelimiter("a;b;c\n1;2;3"), ";");
  assert.equal(detectDelimiter('"x, y";b\n1;2'), ";");
});

test("quoted fields keep their commas and doubled quotes", () => {
  const rows = parseDelimited('Parameter,A,B\n"Yield, total (kg)",10a,8b\n"Say ""hi""",1,2');
  assert.deepEqual(rows, [
    ["Parameter", "A", "B"],
    ["Yield, total (kg)", "10a", "8b"],
    ['Say "hi"', "1", "2"],
  ]);
});

test("newlines inside quotes and CRLF line endings", () => {
  const rows = parseDelimited('P,A\r\n"two\nlines",5a\r\n');
  assert.deepEqual(rows, [
    ["P", "A"],
    ["two\nlines", "5a"],
  ]);
});

test("blank lines are dropped and short rows are padded", () => {
  const t = parseTable("Parameter,A,B,C\n\nHeight,200a,190a\nYield,1500a,1300a,600b\n");
  assert.ok(t);
  assert.deepEqual(t.headers, ["A", "B", "C"]);
  assert.deepEqual(t.rows, [
    ["Height", "200a", "190a", ""],
    ["Yield", "1500a", "1300a", "600b"],
  ]);
});

test("a table needs a header row and one data row", () => {
  assert.equal(parseTable("Parameter,A,B"), null);
  assert.equal(parseTable("only\n"), null);
  assert.equal(parseTable(""), null);
});

test("pasted from a spreadsheet: tabs, with a blank parameter header", () => {
  const t = parseTable("\tA\tB\nPlant height (cm)\t200a\t190a\nBranches (No.)\t18a\t15a");
  assert.ok(t);
  assert.deepEqual(t.headers, ["A", "B"]);
  assert.equal(t.rows.length, 2);
  assert.equal(t.rows[1][0], "Branches (No.)");
});
