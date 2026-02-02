import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { TableData, AnalysisResult } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { tableData, context } = await request.json() as { 
      tableData: TableData; 
      context?: string;
    };

    if (!tableData || !tableData.headers || !tableData.rows) {
      return NextResponse.json(
        { error: "Invalid table data provided" },
        { status: 400 }
      );
    }

    // Format table for GPT
    const tableString = formatTableForGPT(tableData);

    // Step 1: Ask GPT to identify cells to highlight and patterns (specific task, not a wrapper)
    const highlightPrompt = `You are analyzing a research data table to identify the most striking and interesting data points and patterns.

TABLE DATA:
${tableString}

${context ? `CONTEXT: ${context}` : ""}

Analyze this table and identify:
1. Which specific cells contain the most striking/interesting values (highest, lowest, unexpected values, outliers)
2. What meaningful PATTERNS exist in the data. Be creative and thorough - patterns can include:
   - Comparisons between groups (e.g., "A = B > C = D" or "Treatment X outperforms others")
   - Trends (e.g., "Values increase with concentration", "Inverse relationship between X and Y")
   - Groupings (e.g., "Parameters cluster into two groups")
   - Outliers (e.g., "Column C shows anomalous behavior")
   - Correlations (e.g., "High X correlates with high Y")
   - Any other interesting observation

Respond ONLY with valid JSON in this exact format:
{
  "highlightedCells": [
    {"row": 0, "col": 1, "reason": "highest value", "color": "high"},
    {"row": 0, "col": 3, "reason": "anomalous - lower than expected", "color": "notable"}
  ],
  "patterns": [
    {"parameter": "Overall yield", "pattern": "A = B > C = D", "insight": "Treatments A and B produce similar yields, both significantly higher than C and D", "type": "comparison"},
    {"parameter": "Growth metrics", "pattern": "No significant differences", "insight": "All treatments produce similar vegetative growth", "type": "grouping"},
    {"parameter": "Fruit characteristics", "pattern": "Inverse relationship with plant count", "insight": "Fewer fruits but larger individual size in treatments A and B", "type": "correlation"}
  ]
}

Colors: "high" (best/highest), "low" (lowest), "notable" (interesting patterns), "comparison" (key comparisons).
Types: "trend", "comparison", "outlier", "correlation", "grouping", "other".
Row and col are 0-indexed. Row 0 is the first data row (not headers). Col 0 is the first data column (not row labels).

Be insightful - don't just list every row. Find the MEANINGFUL patterns that tell a story.`;

    const highlightResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a research data analyst expert. You respond only with valid JSON, no markdown formatting.",
        },
        { role: "user", content: highlightPrompt },
      ],
      temperature: 0.3,
    });

    let analysisData;
    try {
      const content = highlightResponse.choices[0].message.content || "{}";
      // Remove potential markdown code blocks
      const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
      analysisData = JSON.parse(cleanedContent);
    } catch {
      console.error("Failed to parse highlight response:", highlightResponse.choices[0].message.content);
      analysisData = { highlightedCells: [], patterns: [] };
    }

    // Step 2: Ask GPT to generate the interpretation based on the analysis
    const interpretationPrompt = `Based on this research data table and the identified patterns, generate a telegraphic summary and interpretation.

TABLE DATA:
${tableString}

IDENTIFIED PATTERNS:
${JSON.stringify(analysisData.patterns, null, 2)}

${context ? `CONTEXT: ${context}` : ""}

Generate three levels of interpretation following research writing best practices:

1. TELEGRAPHIC SUMMARY: A very concise, abbreviated summary capturing the key patterns. Use shorthand notation where appropriate (like "Yield: A=B>C=D") but also plain language for other patterns (like "Growth: NS; Fruit size ∝ 1/count"). This should be dense and technical.

2. EXPANDED IDEA: Transform the telegraphic summary into 1-2 complete sentences that a researcher would write. State the main finding clearly.

3. FULL INTERPRETATION: Write 2-3 sentences that interpret what the data means. Don't just state facts - explain the implications, suggest reasons, and connect to the research objective. What is the story the data tells?

Respond ONLY with valid JSON:
{
  "telegraphicSummary": "...",
  "expandedIdea": "...",
  "fullInterpretation": "..."
}`;

    const interpretationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a research paper writing expert. You respond only with valid JSON, no markdown formatting.",
        },
        { role: "user", content: interpretationPrompt },
      ],
      temperature: 0.5,
    });

    let interpretationData;
    try {
      const content = interpretationResponse.choices[0].message.content || "{}";
      const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
      interpretationData = JSON.parse(cleanedContent);
    } catch {
      console.error("Failed to parse interpretation response");
      interpretationData = {
        telegraphicSummary: "Analysis complete - see highlighted cells",
        expandedIdea: "The data shows varying results across treatments.",
        fullInterpretation: "Further analysis is needed to draw conclusions.",
      };
    }

    const result: AnalysisResult = {
      highlightedCells: analysisData.highlightedCells || [],
      patterns: analysisData.patterns || [],
      telegraphicSummary: interpretationData.telegraphicSummary,
      expandedIdea: interpretationData.expandedIdea,
      fullInterpretation: interpretationData.fullInterpretation,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze table data" },
      { status: 500 }
    );
  }
}

function formatTableForGPT(tableData: TableData): string {
  const { headers, rows } = tableData;
  
  // Create header row
  let table = "| Parameter | " + headers.join(" | ") + " |\n";
  table += "|" + "----|".repeat(headers.length + 1) + "\n";
  
  // Add data rows
  rows.forEach((row) => {
    table += "| " + row.join(" | ") + " |\n";
  });
  
  return table;
}
