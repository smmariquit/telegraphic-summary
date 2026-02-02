"use client";

import { useState } from "react";
import { TableData } from "@/types";

interface TableInputProps {
  onTableSubmit: (data: TableData) => void;
  textSize?: "normal" | "large" | "xlarge";
}

interface SampleDataset {
  name: string;
  description: string;
  context: string;
  data: TableData;
}

// Contextualized sample datasets
const SAMPLE_DATASETS: SampleDataset[] = [
  {
    name: "Cucumber Fertilizer Trial",
    description: "Growth and yield of 'Pointsett' cucumber with different fertilizers",
    context: "Comparing fertilizer formulations A, B, C, D on cucumber growth and yield to find a cost-effective alternative to the standard fertilizer A",
    data: {
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
    },
  },
  {
    name: "Antibiotic Efficacy Study",
    description: "Bacterial inhibition zones (mm) for different antibiotics against pathogens",
    context: "Testing the effectiveness of four antibiotics against common bacterial pathogens to guide clinical prescription recommendations",
    data: {
      headers: ["Amoxicillin", "Ciprofloxacin", "Tetracycline", "Penicillin"],
      rows: [
        ["E. coli", "15", "28", "12", "8"],
        ["S. aureus", "22", "25", "18", "24"],
        ["P. aeruginosa", "0", "30", "6", "0"],
        ["K. pneumoniae", "12", "26", "10", "5"],
        ["S. pneumoniae", "28", "20", "22", "30"],
      ],
    },
  },
  {
    name: "Student Performance Analysis",
    description: "Average test scores across teaching methods and subjects",
    context: "Evaluating the impact of different teaching methods (Traditional, Flipped Classroom, Hybrid, Online) on student performance across subjects",
    data: {
      headers: ["Traditional", "Flipped", "Hybrid", "Online"],
      rows: [
        ["Mathematics", "72", "78", "81", "68"],
        ["Science", "68", "82", "79", "71"],
        ["English", "75", "74", "77", "76"],
        ["History", "70", "69", "73", "72"],
        ["Student Satisfaction (%)", "65", "85", "80", "60"],
        ["Completion Rate (%)", "92", "88", "90", "75"],
      ],
    },
  },
];

export default function TableInput({ onTableSubmit, textSize = "normal" }: TableInputProps) {
  const [inputMode, setInputMode] = useState<"csv" | "manual">("manual");
  const [csvText, setCsvText] = useState("");
  const [headers, setHeaders] = useState<string[]>(["A", "B", "C", "D"]);
  const [rows, setRows] = useState<string[][]>([
    ["", "", "", "", ""],
  ]);
  const [numCols, setNumCols] = useState(4);
  const [selectedSample, setSelectedSample] = useState<number | null>(null);

  // Text size classes
  const textClasses = {
    normal: { body: "text-base", small: "text-sm", input: "text-sm" },
    large: { body: "text-lg", small: "text-base", input: "text-base" },
    xlarge: { body: "text-xl", small: "text-lg", input: "text-lg" },
  };
  const t = textClasses[textSize];

  const loadSampleData = (index: number) => {
    const sample = SAMPLE_DATASETS[index];
    setHeaders(sample.data.headers);
    setRows(sample.data.rows.map(row => row.map(String)));
    setNumCols(sample.data.headers.length);
    setSelectedSample(index);
  };

  const parseCSV = (text: string): TableData | null => {
    const lines = text.trim().split("\n").filter(line => line.trim());
    if (lines.length < 2) return null;

    const parseRow = (line: string) => {
      // Handle both comma and tab separation
      return line.includes("\t") 
        ? line.split("\t").map(cell => cell.trim())
        : line.split(",").map(cell => cell.trim());
    };

    const headerRow = parseRow(lines[0]);
    // First column might be "Parameter" or similar, rest are treatment headers
    const headers = headerRow.slice(1);
    
    const rows = lines.slice(1).map(line => parseRow(line));

    return { headers, rows };
  };

  const handleCSVSubmit = () => {
    const parsed = parseCSV(csvText);
    if (parsed) {
      onTableSubmit(parsed);
    } else {
      alert("Could not parse CSV. Please check the format.");
    }
  };

  const handleManualSubmit = () => {
    // Filter out empty rows
    const filteredRows = rows.filter(row => 
      row.some(cell => cell.trim() !== "")
    );
    
    if (filteredRows.length === 0) {
      alert("Please enter some data");
      return;
    }

    onTableSubmit({ headers, rows: filteredRows });
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, Array(numCols + 1).fill("")]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const addColumn = () => {
    setNumCols(numCols + 1);
    setHeaders([...headers, String.fromCharCode(65 + headers.length)]);
    setRows(rows.map(row => [...row, ""]));
  };

  const removeColumn = (index: number) => {
    if (headers.length > 1) {
      setNumCols(numCols - 1);
      setHeaders(headers.filter((_, i) => i !== index));
      setRows(rows.map(row => row.filter((_, i) => i !== index + 1))); // +1 because first col is parameter
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setInputMode("manual")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            inputMode === "manual"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setInputMode("csv")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            inputMode === "csv"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Paste CSV/TSV
        </button>
      </div>

      {/* Sample Data Selection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Load Sample Data:</p>
        <div className="grid md:grid-cols-3 gap-3">
          {SAMPLE_DATASETS.map((sample, index) => (
            <button
              key={index}
              onClick={() => loadSampleData(index)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedSample === index
                  ? "bg-green-100 border-green-400 ring-2 ring-green-400"
                  : "bg-white border-gray-200 hover:border-green-300 hover:bg-green-50"
              }`}
            >
              <p className="font-medium text-gray-900 text-sm">{sample.name}</p>
              <p className="text-xs text-gray-500 mt-1">{sample.description}</p>
            </button>
          ))}
        </div>
        {selectedSample !== null && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-800">Context:</p>
            <p className="text-sm text-blue-700">{SAMPLE_DATASETS[selectedSample].context}</p>
          </div>
        )}
      </div>

      {inputMode === "csv" ? (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Paste your table data. First row should be headers (treatment names), 
            first column should be parameter names. Supports comma or tab separation.
          </p>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`Parameter,A,B,C,D
Plant height (cm),200a,190a,180a,185a
Total yield (g),1500a,1300a,600b,650b`}
            className="w-full h-48 p-3 border rounded-lg font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleCSVSubmit}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Parse & Analyze
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Enter your data table. First column is for parameter names, other columns are treatments.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50 text-left text-sm font-medium text-gray-700">
                    Parameter
                  </th>
                  {headers.map((header, i) => (
                    <th key={i} className="border p-1 bg-gray-50">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={header}
                          onChange={(e) => updateHeader(i, e.target.value)}
                          className="w-full p-1 text-center font-medium text-sm text-gray-900 border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded"
                          placeholder={`Treatment ${i + 1}`}
                        />
                        {headers.length > 1 && (
                          <button
                            onClick={() => removeColumn(i)}
                            className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
                            title="Remove column"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="border p-2 bg-gray-50 w-10">
                    <button
                      onClick={addColumn}
                      className="text-blue-600 hover:text-blue-800 text-lg font-bold"
                      title="Add column"
                    >
                      +
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border p-1">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className={`w-full p-1 text-sm text-gray-900 border-0 focus:ring-1 focus:ring-blue-500 rounded ${
                            colIndex === 0 ? "font-medium" : "text-center"
                          }`}
                          placeholder={colIndex === 0 ? "Parameter name" : "Value"}
                        />
                      </td>
                    ))}
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Remove row"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={addRow}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              + Add Row
            </button>
            <button
              onClick={handleManualSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Analyze Table
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
