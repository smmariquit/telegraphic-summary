// src/components/Guide.tsx
//
// The method, page by page, with photographs of the pages it comes from.

"use client";

import Photo, { Credit } from "./Photo";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

function Rule({ children, page }: { children: React.ReactNode; page: string }) {
  return (
    <li className="[text-wrap:pretty]">
      {children} <span className="figure__cite">({page})</span>
    </li>
  );
}

export default function Guide() {
  return (
    <article className="space-y-[var(--space-2xl)] leading-[1.65]">
      <section
        aria-labelledby="g-what"
        className="grid gap-[var(--space-lg)] lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]"
      >
        <div className="max-w-[var(--measure)]">
          <h2 id="g-what" className="text-[length:var(--text-xl)]">
            The book
          </h2>
          <p className="mt-[var(--space-sm)] [text-wrap:pretty]">
            <cite>Technical Writing for Beginners</cite> by Ofelia K. Bautista and Nestor D. Bondad, ECRC and
            Associates, Los Baños, 1997. A short guide for agricultural researchers at UPLB on turning a thesis into a
            journal paper. The telegraphic summary is its method for reading a data table before writing about it.
            Chapter 11, “Interpreting Data”, pages 80 to 85.
          </p>
          <blockquote className="quote mt-[var(--space-md)]">
            “One approach that could be useful is to 1) summarize the results that the table or figures show, 2) list
            down what are the information that can be synthesized, and 3) then decide which idea to present first.”
            <cite>Bautista and Bondad, 1997, p. 80</cite>
          </blockquote>
        </div>
        <Photo photo="cucumber" caption="Cucumber, the crop in the book’s worked example." />
      </section>

      <section aria-labelledby="g-step1">
        <div className="max-w-[var(--measure)]">
          <h2 id="g-step1" className="text-[length:var(--text-xl)]">
            Step 1. One line per row
          </h2>
          <p className="mt-[var(--space-sm)] [text-wrap:pretty]">
            Table 5 compares fertilizer formulations A, B, C, and D on cucumber. Each number carries a mean-separation
            letter from the statistical test. Numbers that share a letter are not different; numbers with no letter in
            common are. Each row becomes one line:
          </p>
          <pre className="mt-[var(--space-sm)] overflow-x-auto font-mono text-[length:var(--text-sm)]">
            {`Plant height           A=B=C=D or NS
No. of branches        A=B=C=D or NS
Shoot dry weight       A=B>C=D
Root dry weight        A=B=C=D or NS
Total weight of fruits A=B>C=D
Mean weight of fruits  A=B>C=D`}
          </pre>
          <p className="text-muted mt-[var(--space-sm)] text-[length:var(--text-sm)] [text-wrap:pretty]">
            The printed table gives shoot dry weight D as 35a, so by the letters that row reads A=B=D&gt;C. The book’s
            own line says A=B&gt;C=D. The tool follows the letters as printed and notes the difference.
          </p>
        </div>
      </section>

      <section aria-labelledby="g-step2">
        <div className="max-w-[var(--measure)]">
          <h2 id="g-step2" className="text-[length:var(--text-xl)]">
            Step 2. Collapse the lines
          </h2>
          <p className="mt-[var(--space-sm)] [text-wrap:pretty]">Rows with the same line become one group:</p>
          <pre className="mt-[var(--space-sm)] overflow-x-auto font-mono text-[length:var(--text-sm)]">
            {`{ height, branches, root dry wt, shoot root ratio, shoot dry wt }  A=B=C=D
{ total wt of fruits, no. of fruits, mean wt of fruits }           A=B>[C=D]`}
          </pre>
          <blockquote className="quote mt-[var(--space-md)]">
            “If the objective was to look for a substitute for the costlier and more-difficult-to-prepare standard which
            is A, the information that could now be observed from the summarized data are: 1) A = B in all respects and
            2) C and D have lower shoot dry weight and yield than A or B in terms of total weight of fruits, mean weight
            of fruits, and number of fruits but similar in other respects.”
            <cite>Bautista and Bondad, 1997, p. 82</cite>
          </blockquote>
        </div>
      </section>

      <section aria-labelledby="g-step3" className="max-w-[var(--measure)]">
        <h2 id="g-step3" className="text-[length:var(--text-xl)]">
          Step 3. Sentences, then paragraphs
        </h2>
        <blockquote className="quote mt-[var(--space-sm)]">
          “Translated into meaningful sentences, ‘Fertilizer B proved to be a good substitute for A since the growth and
          yield of plants fertilized with A and B were almost equal’ and ‘While plants fertilized with C and D did not
          differ visually from A or B, as shown by similar height and number of branches, the C and D plants had lower
          yield due to lower fruit weight and number’. Each of the two sentences can be expanded into paragraphs by
          giving explanations, clarifications, and citing literature that would contribute to the idea.”
          <cite>Bautista and Bondad, 1997, p. 82</cite>
        </blockquote>
      </section>

      <section
        aria-labelledby="g-rules"
        className="grid gap-[var(--space-lg)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        <div className="max-w-[var(--measure)]">
          <h2 id="g-rules" className="text-[length:var(--text-xl)]">
            Rules the tool holds the writing to
          </h2>
          <ul className="mt-[var(--space-sm)] list-disc space-y-[var(--space-2xs)] pl-[var(--space-md)]">
            <Rule page="p. 80">
              The objective is required. The discussion answers the objective; all else is secondary.
            </Rule>
            <Rule page="p. 82">
              State trends and patterns. Do not cite the data one by one as they appear in the table.
            </Rule>
            <Rule page="p. 83">
              Treatments that share a letter had no effect on each other. A numerical gap without significance is due to
              factors other than the treatment and is not discussed as a difference.
            </Rule>
            <Rule page="p. 83">
              A row with no significant difference but a consistent trend may have the trend mentioned, with a possible
              reason for the lack of significance.
            </Rule>
            <Rule page="p. 84">
              State the effect, not the statistic. “Significant” and “insignificant” used sparingly, if at all.
            </Rule>
            <Rule page="p. 85">
              Interpret, do not restate. “Growth increased”, not “height and diameter increased”.
            </Rule>
            <Rule page="pp. 106 to 113">
              Formal, brief, clear language. No “The data shows”. No emotional words. No wordy phrases from the book’s
              list.
            </Rule>
          </ul>
        </div>
        <div className="space-y-[var(--space-md)]">
          <blockquote className="quote">
            “State the effects rather than the statistical significance. Instead of saying ‘Phosphorus application
            resulted in a significantly higher leaf P concentration’, say ‘Phosphorus application resulted in higher
            leaf P concentration.’ Use the words significant and insignificant sparingly.”
            <cite>Bautista and Bondad, 1997, p. 84</cite>
          </blockquote>
          <blockquote className="quote">
            “Interpret the data. Do not merely state what is contained in the table. Instead of ‘There was an increase
            in tree height and trunk diameter as the weed-free area increased’, say ‘Growth increased as the size of the
            weed-free area increased.’”
            <cite>Bautista and Bondad, 1997, p. 85</cite>
          </blockquote>
        </div>
      </section>

      <section aria-labelledby="g-tool" className="max-w-[var(--measure)]">
        <h2 id="g-tool" className="text-[length:var(--text-xl)]">
          What the tool does, and what it leaves to you
        </h2>
        <p className="mt-[var(--space-sm)] [text-wrap:pretty]">
          Steps 1 and 2 are arithmetic on the letters, so the tool does them without a language model. Step 3 needs
          prose, so a language model writes the sentences and the paragraph. It is given the objective, the table, the
          finished summary read in plain words, and the rules above. It does not decide which treatments differ. Where
          the book expects a citation it writes <span className="font-mono">[cite]</span> instead of inventing one.
        </p>
        <h3 className="mt-[var(--space-lg)] text-[length:var(--text-md)]">Cases the book does not settle</h3>
        <ul className="mt-[var(--space-2xs)] list-disc space-y-[var(--space-2xs)] pl-[var(--space-md)]">
          <li className="[text-wrap:pretty]">
            Letters that overlap (a, ab, b). The tool writes each letter group as one “=” group and joins groups with
            “≥” when they still share a letter, “&gt;” when they share none. The row is marked. The book uses only “=”
            and “&gt;”. Confirm the reading with your adviser.
          </li>
          <li>Tables without letters. The tool can only report a consistent trend, if there is one.</li>
          <li>Two-factor tables. The tool reads each column as one treatment. Interactions (p. 84) are up to you.</li>
          <li>
            Columns where a smaller number is the better result, such as a disease rating. Tick “lower is better” for
            that row so the order is right.
          </li>
        </ul>
      </section>

      <section aria-labelledby="g-refs" className="max-w-[var(--measure)]">
        <h2 id="g-refs" className="text-[length:var(--text-xl)]">
          References
        </h2>
        <ul className="mt-[var(--space-sm)] space-y-[var(--space-sm)] text-[length:var(--text-sm)]">
          <li className="[text-wrap:pretty]">
            Bautista, O.K., and N.D. Bondad. 1997. Technical writing for beginners. ECRC and Associates, Los Baños,
            Laguna. 145 pp. ISBN 971-91902-0-5. Chapter 11, Interpreting data, pp. 80–85. Chapter 14, Language usage,
            pp. 106–113. Chapter 9, Tabular data, statistical notation, p. 38.
          </li>
          <li className="[text-wrap:pretty]">
            Bautista, O.K., T.L. Rosario, and R.K. Bautista Jr. 2012. Technical writing for publication in journals and
            for presentation. UPLB and UPLBFI, College, Laguna. ISBN 978-971-547-303-3. Revision of the 1997 book; the
            method is Chapter 17, pp. 143 ff.
          </li>
          <li className="[text-wrap:pretty]">
            Gomez, K.A., and A.A. Gomez. 1984. Statistical procedures for agricultural research. 2nd ed. John Wiley and
            Sons, New York. The mean-separation tests (DMRT, LSD, HSD) behind the letters; cited by the book on p. 67
            and p. 69.
          </li>
        </ul>
        <h3 className="mt-[var(--space-lg)] text-[length:var(--text-md)]">Photographs</h3>
        <ul className="mt-[var(--space-2xs)] space-y-[var(--space-3xs)] text-[length:var(--text-sm)]">
          {(Object.keys(PHOTOS) as PhotoKey[]).map((k) => (
            <li key={k}>
              {PHOTOS[k].title}. <Credit photo={k} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
