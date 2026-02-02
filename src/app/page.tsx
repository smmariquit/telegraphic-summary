"use client";

import { useState, useEffect } from "react";
import TableInput from "@/components/TableInput";
import HighlightedTable from "@/components/HighlightedTable";
import InterpretationDisplay from "@/components/InterpretationDisplay";
import Guide from "@/components/Guide";
import { TableData, AnalysisResult } from "@/types";

type TextSize = "normal" | "large" | "xlarge";
type ActiveTab = "tool" | "guide";

export default function Home() {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [activeTab, setActiveTab] = useState<ActiveTab>("tool");

  // Load text size preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("textSize");
    if (saved && (saved === "normal" || saved === "large" || saved === "xlarge")) {
      setTextSize(saved as TextSize);
    }
  }, []);

  // Save text size preference
  const handleTextSizeChange = (size: TextSize) => {
    setTextSize(size);
    localStorage.setItem("textSize", size);
  };

  // Text size classes
  const textClasses = {
    normal: {
      body: "text-base",
      heading: "text-2xl md:text-4xl",
      subheading: "text-xl md:text-2xl",
      small: "text-sm",
      label: "text-sm",
    },
    large: {
      body: "text-lg",
      heading: "text-3xl md:text-5xl",
      subheading: "text-2xl md:text-3xl",
      small: "text-base",
      label: "text-base",
    },
    xlarge: {
      body: "text-xl",
      heading: "text-4xl md:text-6xl",
      subheading: "text-3xl md:text-4xl",
      small: "text-lg",
      label: "text-lg",
    },
  };

  const t = textClasses[textSize];

  const handleTableSubmit = async (data: TableData) => {
    setTableData(data);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableData: data, context }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(
        "Failed to analyze the table. Please check your API key and try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTableData(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 md:py-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Text Size Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div 
              className="flex items-center gap-2 bg-white/10 rounded-lg p-2"
              role="group"
              aria-label="Text size controls"
            >
              <span className={`${t.small} text-white/80 hidden sm:inline`}>Text Size:</span>
              <button
                onClick={() => handleTextSizeChange("normal")}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  textSize === "normal"
                    ? "bg-white text-blue-700"
                    : "text-white hover:bg-white/20"
                }`}
                aria-pressed={textSize === "normal"}
                aria-label="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => handleTextSizeChange("large")}
                className={`px-3 py-1 rounded font-medium text-lg transition-colors ${
                  textSize === "large"
                    ? "bg-white text-blue-700"
                    : "text-white hover:bg-white/20"
                }`}
                aria-pressed={textSize === "large"}
                aria-label="Large text size"
              >
                A
              </button>
              <button
                onClick={() => handleTextSizeChange("xlarge")}
                className={`px-3 py-1 rounded font-medium text-xl transition-colors ${
                  textSize === "xlarge"
                    ? "bg-white text-blue-700"
                    : "text-white hover:bg-white/20"
                }`}
                aria-pressed={textSize === "xlarge"}
                aria-label="Extra large text size"
              >
                A
              </button>
            </div>
          </div>

          <h1 className={`${t.heading} font-bold mb-3`}>Telegraphic Summary Tool</h1>
          <p className={`${t.body} text-blue-100 max-w-2xl`}>
            Transform your research data tables into insightful interpretations 
            using the telegraphic summary method from technical writing.
          </p>

          {/* Tab Navigation */}
          <nav className="mt-6" role="tablist" aria-label="Main navigation">
            <div className="flex gap-2">
              <button
                role="tab"
                aria-selected={activeTab === "tool"}
                aria-controls="tool-panel"
                id="tool-tab"
                onClick={() => setActiveTab("tool")}
                className={`px-4 md:px-6 py-2 md:py-3 ${t.body} font-medium rounded-t-lg transition-colors ${
                  activeTab === "tool"
                    ? "bg-gray-50 text-blue-700"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                📊 Analysis Tool
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "guide"}
                aria-controls="guide-panel"
                id="guide-tab"
                onClick={() => setActiveTab("guide")}
                className={`px-4 md:px-6 py-2 md:py-3 ${t.body} font-medium rounded-t-lg transition-colors ${
                  activeTab === "guide"
                    ? "bg-gray-50 text-blue-700"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                📖 Guide
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Tool Panel */}
        {activeTab === "tool" && (
          <div
            role="tabpanel"
            id="tool-panel"
            aria-labelledby="tool-tab"
          >
            {/* Context Input */}
            {!analysisResult && (
              <div className="mb-6">
                <label 
                  htmlFor="context-input"
                  className={`block ${t.label} font-medium text-gray-700 mb-2`}
                >
                  Research Context (Optional)
                </label>
                <textarea
                  id="context-input"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Describe your experiment objectives, e.g., 'Comparing fertilizer formulations A, B, C, D on cucumber growth and yield to find a cost-effective alternative to A'"
                  className={`w-full p-3 border rounded-lg ${t.body} text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  rows={2}
                />
              </div>
            )}

            {/* Main Content */}
            {!tableData ? (
              <>
                <TableInput onTableSubmit={handleTableSubmit} textSize={textSize} />

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 rounded-lg p-4 md:p-6 border border-blue-100">
                  <h2 className={`font-semibold text-blue-900 mb-3 ${t.subheading}`}>
                    📚 What is a Telegraphic Summary?
                  </h2>
                  <p className={`text-blue-800 ${t.body} mb-4`}>
                    A telegraphic summary is a research technique for condensing data 
                    into abbreviated patterns and insights, then systematically expanding 
                    them into meaningful interpretations. It helps researchers identify 
                    trends, correlations, outliers, and relationships in their data.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <h3 className={`font-medium text-blue-900 mb-2 ${t.body}`}>Step 1: Identify Patterns</h3>
                      <p className={`text-blue-700 ${t.small}`}>
                        Find meaningful patterns: trends, comparisons, correlations, 
                        outliers, or groupings in your data
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <h3 className={`font-medium text-blue-900 mb-2 ${t.body}`}>Step 2: Synthesize</h3>
                      <p className={`text-blue-700 ${t.small}`}>
                        Combine related patterns to find the main story your data tells
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <h3 className={`font-medium text-blue-900 mb-2 ${t.body}`}>Step 3: Interpret</h3>
                      <p className={`text-blue-700 ${t.small}`}>
                        Expand into sentences that explain what the data means, not just 
                        what it shows
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6 md:space-y-8">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className={`${t.subheading} font-bold text-gray-800`}>Analysis Results</h2>
                  <button
                    onClick={handleReset}
                    className={`px-4 py-2 ${t.body} text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors`}
                  >
                    ← New Analysis
                  </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center" role="status" aria-live="polite">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" aria-hidden="true"></div>
                    <p className={`text-gray-600 ${t.body}`}>
                      Analyzing your data with AI...
                    </p>
                    <p className={`${t.small} text-gray-400 mt-2`}>
                      Identifying patterns and generating interpretations
                    </p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6" role="alert">
                    <p className={`text-red-800 font-medium ${t.body}`}>⚠️ {error}</p>
                    <button
                      onClick={() => tableData && handleTableSubmit(tableData)}
                      className={`mt-3 px-4 py-2 ${t.body} bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors`}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Results */}
                {analysisResult && (
                  <>
                    <HighlightedTable
                      tableData={tableData}
                      highlightedCells={analysisResult.highlightedCells}
                      textSize={textSize}
                    />
                    <InterpretationDisplay
                      patterns={analysisResult.patterns}
                      telegraphicSummary={analysisResult.telegraphicSummary}
                      expandedIdea={analysisResult.expandedIdea}
                      fullInterpretation={analysisResult.fullInterpretation}
                      textSize={textSize}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Guide Panel */}
        {activeTab === "guide" && (
          <div
            role="tabpanel"
            id="guide-panel"
            aria-labelledby="guide-tab"
          >
            <Guide textSize={textSize} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-gray-100 border-t">
        <div className={`max-w-5xl mx-auto px-4 md:px-6 text-center ${t.small} text-gray-500`}>
          <p>
            Based on the telegraphic summary method from technical writing for research.
          </p>
        </div>
      </footer>
    </div>
  );
}
