# Telegraphic Summary, user guide

The tool reads a research data table the way Bautista and Bondad teach it in *Technical Writing for Beginners* (1997), Chapter 11, "Interpreting Data", pages 80 to 85. Paste a table with mean-separation letters, state the objective of the experiment, and the tool produces the telegraphic summary and a first draft of the sentences.

## The method, from the book

Page 80:

> One approach that could be useful is to 1) summarize the results that the table or figures show, 2) list down what are the information that can be synthesized, and 3) then decide which idea to present first.

Step 1. Each row of the table becomes one line. Treatments that share a mean-separation letter are written as equal. Treatments that share none are written in order of value. For Table 5 of the book (cucumber, fertilizers A to D):

```
Plant height           A=B=C=D or NS
No. of branches        A=B=C=D or NS
Shoot dry weight       A=B>C=D
Root dry weight        A=B=C=D or NS
Total weight of fruits A=B>C=D
Mean weight of fruits  A=B>C=D
```

Step 2. Rows with the same line collapse into one (page 82):

```
{ height, branches, root dry wt, shoot root ratio, shoot dry wt }  A=B=C=D
{ total wt of fruits, no. of fruits, mean wt of fruits }           A=B>[C=D]
```

Step 3. Each collapsed line becomes a sentence that answers the objective. The book's objective was a substitute for the costly standard A. Its sentences: "Fertilizer B proved to be a good substitute for A since the growth and yield of plants fertilized with A and B were almost equal" and "While plants fertilized with C and D did not differ visually from A or B, as shown by similar height and number of branches, the C and D plants had lower yield due to lower fruit weight and number." Each sentence is then expanded into a paragraph with explanations and literature.

## Using the tool

1. Write the objective. It is required. The book: "the discussion should answer the objectives. All others are secondary."
2. Enter the table. Type it in, or paste comma- or tab-separated text. Rows are parameters, columns are treatments. Keep the letters on the numbers: `45ab`, `0.44 d`, `1500a`. If a smaller number is the better result for a row, such as a disease rating, tick "lower is better" for that row.
3. Press Summarize.

Or load one of the five tables under "start from a table in the book": Table 5, and four practice tables that came with the book (peanut soil additives, broiler feed, rice wine yeast, mango wash treatments).

## Reading the result

**1.0 Summarize each row.** The table, with the best statistical group of each row marked, and the telegraphic line for each row. Rows where all treatments share a letter get no mark. Numbers alone never earn a mark. Page 83: "Any numerical difference is due to factors other than the treatment."

**2.0 Group the rows.** The collapsed lines. This is the telegraphic summary.

**3.0 Translate into sentences.** One sentence per collapsed line, the one that answers the objective first, then a paragraph. A language model writes this part. It receives the objective, the table, the finished summary, and rules from Chapters 11 and 14 of the book. It does not decide which treatments differ. Where the book expects a citation it writes `[cite]`; fill those in from the literature.

## Rules the tool holds the writing to

- The discussion answers the objective (p80).
- State trends and patterns. Do not cite the data one by one as they appear in the table (p82).
- Treatments that share a letter had no effect on each other. Do not discuss them as different (p83).
- A row with no significant difference but a consistent trend may have the trend mentioned, and a possible reason for the lack of significance (p83).
- State the effect, not the statistic. Use "significant" and "insignificant" sparingly, if at all (p84).
- Interpret, do not restate. "Growth increased as the size of the weed-free area increased" (p85).
- Formal, brief, clear. No "The data shows", no "In comparison", no emotional words, no contractions, no wordy phrases from the list on pages 108 to 113 (Chapter 14).
- The plant changes, not the treatment. "Lighted plants had lower dry weight" (p113).

## Cases the book does not settle

The tool flags these instead of guessing.

- Letters that overlap (`a`, `ab`, `b`). Each letter group is written as one `=` group. Groups that still share a letter are joined with `≥`, groups that share none with `>`. The row is marked with `?`. The book uses only `=` and `>`. Confirm the reading with your adviser.
- Tables without letters. Only a consistent trend can be reported, and only as a trend.
- Two-factor tables. Each column is read as one treatment. Interactions (p84) are not handled.
- Which direction is better. `>` in the book is numeric. Tick "lower is better" where needed.

## Text size

Three "A" buttons in the top right set normal, large, or extra large text. The choice is remembered on this device.

## Source

Bautista, O.K., and N.D. Bondad. 1997. Technical writing for beginners. ECRC and Associates, Los Baños, Laguna. ISBN 971-91902-0-5.

Revised as Bautista, O.K., T.L. Rosario, and R.K. Bautista Jr. 2012. Technical writing for publication in journals and for presentation. UPLB and UPLBFI, College, Laguna. ISBN 978-971-547-303-3. The method is Chapter 17 there.
