"use client";

import { TableData, HighlightedCell } from "@/types";
import { useState } from "react";

interface HighlightedTableProps {
  tableData: TableData;
  highlightedCells: HighlightedCell[];
  textSize?: "normal" | "large" | "xlarge";
}

const HIGHLIGHT_COLORS = {
  high: "bg-green-200 border-green-400",
  low: "bg-red-200 border-red-400",
  notable: "bg-yellow-200 border-yellow-400",
  comparison: "bg-blue-200 border-blue-400",
};

const HIGHLIGHT_LABELS = {
  high: "Highest/Best",
  low: "Lowest",
  notable: "Notable Pattern",
  comparison: "Key Comparison",
};

export default function HighlightedTable({
  tableData,
  highlightedCells,
  textSize = "normal",
}: HighlightedTableProps) {
  const [hoveredCell, setHoveredCell] = useState<HighlightedCell | null>(null);

  // Text size classes
  const textClasses = {
    normal: { body: "text-base", heading: "text-lg", small: "text-sm", cell: "text-sm p-2 md:p-3" },
    large: { body: "text-lg", heading: "text-xl", small: "text-base", cell: "text-base p-3 md:p-4" },
    xlarge: { body: "text-xl", heading: "text-2xl", small: "text-lg", cell: "text-lg p-4 md:p-5" },
  };
  const t = textClasses[textSize];

  const getCellHighlight = (rowIndex: number, colIndex: number): HighlightedCell | undefined => {
    return highlightedCells.find(
      (cell) => cell.row === rowIndex && cell.col === colIndex
    );
  };

  const { headers, rows } = tableData;

  // Get unique highlight types for legend
  const usedColors = [...new Set(highlightedCells.map((c) => c.color))];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h3 className={`${t.heading} font-semibold text-gray-800 mb-4`}>
        Highlighted Data Table
      </h3>

      {/* Legend */}
      {usedColors.length > 0 && (
        <div className="flex flex-wrap gap-3 md:gap-4 mb-4 p-3 bg-gray-50 rounded-lg" role="legend" aria-label="Color legend">
          <span className={`${t.small} font-medium text-gray-600`}>Legend:</span>
          {usedColors.map((color) => (
            <div key={color} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded border-2 ${HIGHLIGHT_COLORS[color]}`}
                aria-hidden="true"
              />
              <span className={`${t.small} text-gray-700`}>{HIGHLIGHT_LABELS[color]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tooltip - fixed height to prevent layout shift */}
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg min-h-[52px]" aria-live="polite">
        {hoveredCell ? (
          <p className={`${t.body} text-gray-800`}>
            <span className="font-medium">Why highlighted:</span>{" "}
            {hoveredCell.reason}
          </p>
        ) : (
          <p className={`${t.small} text-gray-400 italic`}>Hover over highlighted cells (★) to see why they were selected.</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300" role="table">
          <thead>
            <tr className="bg-gray-100">
              <th scope="col" className={`border border-gray-300 ${t.cell} text-left font-semibold text-gray-700`}>
                Parameter
              </th>
              {headers.map((header, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`border border-gray-300 ${t.cell} text-center font-semibold text-gray-700`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const highlight = getCellHighlight(rowIndex, colIndex - 1);
                  const isFirstCol = colIndex === 0;

                  return (
                    <td
                      key={colIndex}
                      className={`border border-gray-300 ${t.cell} text-gray-900 ${
                        isFirstCol
                          ? "font-medium bg-gray-50"
                          : "text-center"
                      } ${
                        highlight
                          ? `${HIGHLIGHT_COLORS[highlight.color]} border-2 cursor-help`
                          : ""
                      }`}
                      onMouseEnter={() => highlight && setHoveredCell(highlight)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onFocus={() => highlight && setHoveredCell(highlight)}
                      onBlur={() => setHoveredCell(null)}
                      tabIndex={highlight ? 0 : undefined}
                      role={highlight ? "button" : undefined}
                      aria-label={highlight ? `${cell} - ${highlight.reason}` : undefined}
                    >
                      {cell}
                      {highlight && (
                        <span className="ml-1 text-xs opacity-70" aria-hidden="true">★</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
