"use client";

interface GuideProps {
  textSize: "normal" | "large" | "xlarge";
}

export default function Guide({ textSize }: GuideProps) {
  const textClasses = {
    normal: {
      body: "text-base",
      heading: "text-xl",
      subheading: "text-lg",
      small: "text-sm",
    },
    large: {
      body: "text-lg",
      heading: "text-2xl",
      subheading: "text-xl",
      small: "text-base",
    },
    xlarge: {
      body: "text-xl",
      heading: "text-3xl",
      subheading: "text-2xl",
      small: "text-lg",
    },
  };

  const t = textClasses[textSize];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <section aria-labelledby="intro-heading" className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 id="intro-heading" className={`${t.heading} font-bold text-gray-900 mb-4`}>
          📖 What is this tool?
        </h2>
        <p className={`${t.body} text-gray-700 leading-relaxed mb-4`}>
          This tool helps you <strong>understand your research data</strong> by finding 
          patterns and turning them into clear, written explanations. Instead of just 
          looking at numbers in a table, you get a story that explains what the data means.
        </p>
        <p className={`${t.body} text-gray-700 leading-relaxed`}>
          It uses a method called <strong>&quot;Telegraphic Summary&quot;</strong> — a technique 
          used in research writing where you first summarize data in a short, abbreviated 
          form (like notes), then expand it into full sentences.
        </p>
      </section>

      {/* How to Use */}
      <section aria-labelledby="howto-heading" className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 id="howto-heading" className={`${t.heading} font-bold text-gray-900 mb-4`}>
          🔧 How to Use This Tool
        </h2>
        <ol className={`${t.body} text-gray-700 space-y-4 list-decimal list-inside`}>
          <li>
            <strong>Enter your data table</strong> — You can type it manually, paste from 
            a spreadsheet, or try one of the sample datasets provided.
          </li>
          <li>
            <strong>Add context (optional)</strong> — Tell the tool what your experiment 
            was about. This helps it give better interpretations.
          </li>
          <li>
            <strong>Click &quot;Analyze Table&quot;</strong> — The tool will find patterns in 
            your data and highlight important values.
          </li>
          <li>
            <strong>Read the results</strong> — You&apos;ll see highlighted data, identified 
            patterns, and three levels of interpretation (from brief to detailed).
          </li>
        </ol>
      </section>

      {/* Types of Patterns */}
      <section aria-labelledby="patterns-heading" className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 id="patterns-heading" className={`${t.heading} font-bold text-gray-900 mb-6`}>
          🔍 Types of Patterns the Tool Can Find
        </h2>
        <p className={`${t.body} text-gray-700 mb-6`}>
          The tool looks for these kinds of interesting things in your data:
        </p>

        <div className="space-y-6">
          {/* Comparison */}
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className={`${t.subheading} font-semibold text-green-800 mb-2 flex items-center gap-2`}>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">Comparison</span>
            </h3>
            <p className={`${t.body} text-gray-700 mb-2`}>
              <strong>What it means:</strong> Some groups are different from others.
            </p>
            <p className={`${t.small} text-gray-600 italic`}>
              Example: &quot;Treatment A and B produced similar yields, but both were 
              much higher than Treatment C and D.&quot;
            </p>
            <p className={`${t.small} text-gray-500 mt-2`}>
              Often written as: A = B &gt; C = D (where = means &quot;similar&quot; and &gt; means &quot;greater than&quot;)
            </p>
          </div>

          {/* Trend */}
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className={`${t.subheading} font-semibold text-blue-800 mb-2 flex items-center gap-2`}>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">Trend</span>
            </h3>
            <p className={`${t.body} text-gray-700 mb-2`}>
              <strong>What it means:</strong> Values go up or down in a pattern as something else changes.
            </p>
            <p className={`${t.small} text-gray-600 italic`}>
              Example: &quot;As the dosage increased, the patient&apos;s blood pressure decreased steadily.&quot;
            </p>
          </div>

          {/* Correlation */}
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h3 className={`${t.subheading} font-semibold text-purple-800 mb-2 flex items-center gap-2`}>
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">Correlation</span>
            </h3>
            <p className={`${t.body} text-gray-700 mb-2`}>
              <strong>What it means:</strong> Two things seem to be connected — when one goes up, 
              the other goes up (or down).
            </p>
            <p className={`${t.small} text-gray-600 italic`}>
              Example: &quot;Plants with more leaves also had heavier fruits — they seem to be related.&quot;
            </p>
          </div>

          {/* Grouping */}
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h3 className={`${t.subheading} font-semibold text-amber-800 mb-2 flex items-center gap-2`}>
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-sm">Grouping</span>
            </h3>
            <p className={`${t.body} text-gray-700 mb-2`}>
              <strong>What it means:</strong> Some things naturally belong together based on their values.
            </p>
            <p className={`${t.small} text-gray-600 italic`}>
              Example: &quot;The growth measurements (height, branches, weight) all showed similar 
              patterns, while the yield measurements behaved differently.&quot;
            </p>
          </div>

          {/* Outlier */}
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h3 className={`${t.subheading} font-semibold text-red-800 mb-2 flex items-center gap-2`}>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">Outlier</span>
            </h3>
            <p className={`${t.body} text-gray-700 mb-2`}>
              <strong>What it means:</strong> Something unusual that doesn&apos;t fit the pattern.
            </p>
            <p className={`${t.small} text-gray-600 italic`}>
              Example: &quot;While most antibiotics worked against the bacteria, Penicillin 
              had no effect at all — this is unexpected.&quot;
            </p>
          </div>

          {/* Other */}
          <div className="border-l-4 border-gray-500 pl-4 py-2">
            <h3 className={`${t.subheading} font-semibold text-gray-800 mb-2 flex items-center gap-2`}>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">Other</span>
            </h3>
            <p className={`${t.body} text-gray-700 mb-2`}>
              <strong>What it means:</strong> Any other interesting observation that doesn&apos;t fit 
              the categories above.
            </p>
            <p className={`${t.small} text-gray-600 italic`}>
              Example: &quot;The online teaching method had the lowest completion rate, 
              which might affect the validity of its test scores.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Understanding Results */}
      <section aria-labelledby="results-heading" className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 id="results-heading" className={`${t.heading} font-bold text-gray-900 mb-6`}>
          📊 Understanding Your Results
        </h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className={`${t.subheading} font-semibold text-gray-800 mb-2`}>
              1. Highlighted Table
            </h3>
            <p className={`${t.body} text-gray-700`}>
              Your data table with important cells colored:
            </p>
            <ul className={`${t.small} text-gray-600 mt-2 space-y-1 ml-4`}>
              <li>🟢 <strong>Green</strong> = Highest or best values</li>
              <li>🔴 <strong>Red</strong> = Lowest values</li>
              <li>🟡 <strong>Yellow</strong> = Notable patterns</li>
              <li>🔵 <strong>Blue</strong> = Key comparisons</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className={`${t.subheading} font-semibold text-gray-800 mb-2`}>
              2. Identified Patterns
            </h3>
            <p className={`${t.body} text-gray-700`}>
              A list of all the interesting patterns found, with brief explanations 
              of what makes each one notable.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className={`${t.subheading} font-semibold text-gray-800 mb-2`}>
              3. Three Levels of Summary
            </h3>
            <ul className={`${t.body} text-gray-700 space-y-2 ml-4`}>
              <li>
                <strong>Telegraphic Summary</strong> — Very brief, uses abbreviations 
                (good for your own notes)
              </li>
              <li>
                <strong>Expanded Idea</strong> — The same information written as 
                complete sentences
              </li>
              <li>
                <strong>Full Interpretation</strong> — A paragraph that explains 
                what the data means and why it matters
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section aria-labelledby="tips-heading" className="bg-blue-50 rounded-lg p-6 md:p-8 border border-blue-200">
        <h2 id="tips-heading" className={`${t.heading} font-bold text-blue-900 mb-4`}>
          💡 Tips for Best Results
        </h2>
        <ul className={`${t.body} text-blue-800 space-y-3`}>
          <li>
            ✓ <strong>Add context</strong> — Tell the tool what your experiment was about 
            for better interpretations.
          </li>
          <li>
            ✓ <strong>Use clear labels</strong> — Make sure your row and column names 
            describe what they measure.
          </li>
          <li>
            ✓ <strong>Include units</strong> — Adding units (cm, g, %) in your parameter 
            names helps the tool understand your data.
          </li>
          <li>
            ✓ <strong>Review the output</strong> — The AI provides suggestions, but you 
            know your research best. Use it as a starting point.
          </li>
        </ul>
      </section>
    </div>
  );
}
