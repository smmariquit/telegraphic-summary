"use client";

import { PatternInsight } from "@/types";

interface InterpretationDisplayProps {
  patterns: PatternInsight[];
  telegraphicSummary: string;
  expandedIdea: string;
  fullInterpretation: string;
  textSize?: "normal" | "large" | "xlarge";
}

const PATTERN_TYPE_STYLES = {
  trend: { bg: "bg-blue-100", text: "text-blue-700", label: "Trend" },
  comparison: { bg: "bg-green-100", text: "text-green-700", label: "Comparison" },
  outlier: { bg: "bg-red-100", text: "text-red-700", label: "Outlier" },
  correlation: { bg: "bg-purple-100", text: "text-purple-700", label: "Correlation" },
  grouping: { bg: "bg-amber-100", text: "text-amber-700", label: "Grouping" },
  other: { bg: "bg-gray-100", text: "text-gray-700", label: "Other" },
};

export default function InterpretationDisplay({
  patterns,
  telegraphicSummary,
  expandedIdea,
  fullInterpretation,
  textSize = "normal",
}: InterpretationDisplayProps) {
  // Text size classes
  const textClasses = {
    normal: { body: "text-base", heading: "text-lg", small: "text-sm", mono: "text-lg" },
    large: { body: "text-lg", heading: "text-xl", small: "text-base", mono: "text-xl" },
    xlarge: { body: "text-xl", heading: "text-2xl", small: "text-lg", mono: "text-2xl" },
  };
  const t = textClasses[textSize];

  return (
    <div className="space-y-6">
      {/* Identified Patterns */}
      <section className="bg-white rounded-lg shadow-md p-4 md:p-6" aria-labelledby="patterns-heading">
        <h3 id="patterns-heading" className={`${t.heading} font-semibold text-gray-800 mb-4 flex items-center gap-2`}>
          <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold" aria-hidden="true">
            1
          </span>
          Identified Patterns
        </h3>
        <p className={`${t.small} text-gray-600 mb-4`}>
          Key patterns and relationships discovered in your data.
        </p>
        
        <div className="space-y-3">
          {patterns.map((pattern, index) => {
            const style = PATTERN_TYPE_STYLES[pattern.type] || PATTERN_TYPE_STYLES.other;
            return (
              <article key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`font-medium text-gray-800 ${t.body}`}>{pattern.parameter}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className={`font-mono ${t.mono} text-gray-900 mb-1 break-words`}>{pattern.pattern}</p>
                    <p className={`${t.small} text-gray-600`}>{pattern.insight}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Telegraphic Summary */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-4 md:p-6 border-l-4 border-blue-500" aria-labelledby="telegraphic-heading">
        <h3 id="telegraphic-heading" className={`${t.heading} font-semibold text-gray-800 mb-3 flex items-center gap-2`}>
          <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold" aria-hidden="true">
            2
          </span>
          Telegraphic Summary
        </h3>
        <p className={`${t.small} text-gray-600 mb-2`}>
          Dense, abbreviated summary using notation:
        </p>
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <p className={`font-mono text-gray-800 ${t.body} break-words`}>{telegraphicSummary}</p>
        </div>
      </section>

      {/* Expanded Idea */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-4 md:p-6 border-l-4 border-green-500" aria-labelledby="expanded-heading">
        <h3 id="expanded-heading" className={`${t.heading} font-semibold text-gray-800 mb-3 flex items-center gap-2`}>
          <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold" aria-hidden="true">
            3
          </span>
          Expanded Idea
        </h3>
        <p className={`${t.small} text-gray-600 mb-2`}>
          The telegraphic summary translated into complete sentences:
        </p>
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <p className={`text-gray-800 leading-relaxed ${t.body}`}>{expandedIdea}</p>
        </div>
      </section>

      {/* Full Interpretation */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-md p-4 md:p-6 border-l-4 border-amber-500" aria-labelledby="interpretation-heading">
        <h3 id="interpretation-heading" className={`${t.heading} font-semibold text-gray-800 mb-3 flex items-center gap-2`}>
          <span className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold" aria-hidden="true">
            4
          </span>
          Full Interpretation
        </h3>
        <p className={`${t.small} text-gray-600 mb-2`}>
          Complete interpretation with implications and context:
        </p>
        <div className="bg-white p-4 rounded-lg border border-amber-200">
          <p className={`text-gray-800 leading-relaxed ${t.body}`}>{fullInterpretation}</p>
        </div>
      </section>
    </div>
  );
}
