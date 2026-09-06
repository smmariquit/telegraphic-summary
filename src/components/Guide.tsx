// src/components/Guide.tsx

"use client";

export default function Guide() {
  return (
    <article className="max-w-[var(--measure)] space-y-[var(--space-xl)] leading-[1.65]">
      <section aria-labelledby="g-what">
        <h2 id="g-what" className="text-[length:var(--text-xl)]">
          What a telegraphic summary is
        </h2>
        <p className="mt-[var(--space-sm)]">
          The term comes from Chapter 11, “Interpreting Data”, of <cite>Technical Writing for Beginners</cite> by
          Ofelia K. Bautista and Nestor D. Bondad (1997). Before writing the results of an experiment, the researcher
          writes each row of a table as a short comparison of treatments, then collapses rows that say the same thing,
          then turns the collapsed lines into sentences. The book’s own procedure, page 80:
        </p>
        <blockquote className="mt-[var(--space-sm)] border-l-2 border-rule-strong pl-[var(--space-sm)] text-muted">
          One approach that could be useful is to 1) summarize the results that the table or figures show, 2) list down
          what are the information that can be synthesized, and 3) then decide which idea to present first.
        </blockquote>
      </section>

      <section aria-labelledby="g-example">
        <h2 id="g-example" className="text-[length:var(--text-xl)]">
          The book’s example
        </h2>
        <p className="mt-[var(--space-sm)]">
          Table 5 compares fertilizer formulations A, B, C, and D on cucumber. The objective was a substitute for the
          costly standard, A. Each row becomes one line:
        </p>
        <pre className="mt-[var(--space-sm)] overflow-x-auto font-mono text-[length:var(--text-sm)]">
{`Plant height          A=B=C=D or NS
No. of branches       A=B=C=D or NS
Shoot dry weight      A=B>C=D
Root dry weight       A=B=C=D or NS
Total weight of fruits A=B>C=D
Mean weight of fruits  A=B>C=D`}
        </pre>
        <p className="mt-[var(--space-sm)]">Then the lines collapse (page 82):</p>
        <pre className="mt-[var(--space-sm)] overflow-x-auto font-mono text-[length:var(--text-sm)]">
{`{ height, branches, root dry wt, shoot root ratio, shoot dry wt }  A=B=C=D
{ total wt of fruits, no. of fruits, mean wt of fruits }           A=B>[C=D]`}
        </pre>
        <p className="mt-[var(--space-sm)]">
          And the two collapsed lines become two sentences: “Fertilizer B proved to be a good substitute for A since
          the growth and yield of plants fertilized with A and B were almost equal,” and “While plants fertilized with
          C and D did not differ visually from A or B, as shown by similar height and number of branches, the C and D
          plants had lower yield due to lower fruit weight and number.” Each sentence is then expanded into a paragraph
          with explanations and literature.
        </p>
      </section>

      <section aria-labelledby="g-tool">
        <h2 id="g-tool" className="text-[length:var(--text-xl)]">
          What this tool does, and what it leaves to you
        </h2>
        <p className="mt-[var(--space-sm)]">
          Steps 1 and 2 are arithmetic on the mean-separation letters, so the tool does them without a language model.
          Treatments that share a letter are written as equal. Treatments that share none are ordered by value. Rows with
          the same line collapse into one group. The best statistical group of each row that differs is marked in the
          table.
        </p>
        <p className="mt-[var(--space-sm)]">
          Step 3 needs prose, so a language model writes the sentences and the paragraph. It is given the objective, the
          table, and the finished summary, and a fixed set of rules from the book. It does not decide which treatments
          differ. Where the book expects a citation, it writes <span className="font-mono">[cite]</span> instead of
          inventing one.
        </p>
        <h3 className="mt-[var(--space-lg)] text-[length:var(--text-md)]">Rules the tool enforces</h3>
        <ul className="mt-[var(--space-2xs)] list-disc space-y-[var(--space-2xs)] pl-[var(--space-md)]">
          <li>The objective is required. The discussion answers the objective; all else is secondary (p80).</li>
          <li>State trends and patterns. Do not cite the data one by one (p82).</li>
          <li>
            Treatments that share a letter had no effect on each other. A numerical gap without significance is not
            discussed as a difference (p83).
          </li>
          <li>
            A row with no significant difference but a consistent trend may have the trend mentioned, with a possible
            reason for the lack of significance (p83).
          </li>
          <li>State the effect, not the statistic. “Significant” and “insignificant” used sparingly, if at all (p84).</li>
          <li>Interpret, do not restate. “Growth increased”, not “height and diameter increased” (p85).</li>
          <li>Formal, brief, clear language. No “The data shows”. No emotional words. No wordy phrases (Chapter 14).</li>
        </ul>
        <h3 className="mt-[var(--space-lg)] text-[length:var(--text-md)]">Cases the book does not settle</h3>
        <ul className="mt-[var(--space-2xs)] list-disc space-y-[var(--space-2xs)] pl-[var(--space-md)]">
          <li>
            Letters that overlap (a, ab, b). The tool writes each letter group as one “=” group and joins groups with
            “≥” when they still share a letter, “&gt;” when they share none. The row is marked with ?. The book uses
            only “=” and “&gt;”. Confirm the reading with your adviser.
          </li>
          <li>Tables without letters. The tool can only report a consistent trend, if there is one.</li>
          <li>Two-factor tables. The tool reads each column as one treatment. Interactions (p84) are up to you.</li>
          <li>
            Columns where a smaller number is the better result, such as a disease rating. Tick “lower is better” for
            that row so the order is right.
          </li>
        </ul>
      </section>

      <section aria-labelledby="g-source">
        <h2 id="g-source" className="text-[length:var(--text-xl)]">
          Source
        </h2>
        <p className="mt-[var(--space-sm)]">
          Bautista, O.K., and N.D. Bondad. 1997. Technical writing for beginners. ECRC and Associates, Los Baños,
          Laguna. ISBN 971-91902-0-5. Chapter 11, Interpreting data, pages 80 to 85. Chapter 14, Language usage, pages
          106 to 113.
        </p>
        <p className="mt-[var(--space-sm)]">
          Revised in 2012 as Bautista, O.K., T.L. Rosario, and R.K. Bautista Jr., Technical writing for publication in
          journals and for presentation, UPLB and UPLBFI, ISBN 978-971-547-303-3, where the method sits in Chapter 17.
        </p>
      </section>
    </article>
  );
}
