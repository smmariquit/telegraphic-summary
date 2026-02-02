# Telegraphic Summary Tool
## User Guide

**A simple tool to help researchers understand and interpret their data tables.**

---

## Table of Contents

1. [What is This Tool?](#what-is-this-tool)
2. [What is a Telegraphic Summary?](#what-is-a-telegraphic-summary)
3. [How to Use the Tool](#how-to-use-the-tool)
4. [Understanding the Sample Data](#understanding-the-sample-data)
5. [Types of Patterns the Tool Can Find](#types-of-patterns-the-tool-can-find)
6. [Reading Your Results](#reading-your-results)
7. [Accessibility Features](#accessibility-features)
8. [Tips for Best Results](#tips-for-best-results)
9. [Acknowledgments](#acknowledgments)

---

## What is This Tool?

This tool helps you **make sense of research data** presented in tables. Instead of staring at rows and columns of numbers, the tool:

- **Highlights** the most important or interesting values
- **Finds patterns** in your data (like which treatments work best)
- **Writes interpretations** that explain what the data actually means

Think of it as having a research assistant who reads your table and says, "Here's what I noticed, and here's what it might mean."

---

## What is a Telegraphic Summary?

A **telegraphic summary** is a technique used in scientific writing. The name comes from the old telegraph system, where messages had to be very short and abbreviated (because you paid per word!).

In research, a telegraphic summary works like this:

1. **First, abbreviate**: Write your findings in a very short form, like notes to yourself
   - Example: "Yield: A=B>C=D" (meaning treatments A and B gave similar yields, both higher than C and D)

2. **Then, expand**: Turn those notes into complete sentences
   - Example: "Treatments A and B produced similar fruit yields, both significantly higher than treatments C and D."

3. **Finally, interpret**: Explain what this means for your research
   - Example: "This suggests that the organic fertilizers (A and B) are more effective for fruit production than the synthetic alternatives (C and D), possibly due to better nutrient availability over time."

This tool automates all three steps for you!

---

## How to Use the Tool

### Step 1: Open the Tool
Go to the website where the tool is hosted. You will see two tabs at the top:
- **📊 Analysis Tool** - Where you enter and analyze your data
- **📖 Guide** - Help and documentation (like this guide, but shorter)

### Step 2: Adjust Text Size (Optional)
If you find the text too small to read comfortably, look for the **text size buttons** (marked A, A, A) at the top of the page. Click the larger "A" buttons to increase the text size.

### Step 3: Choose Your Data Source
You have three options:

**Option A: Use Sample Data**
- Look for the "Load Sample Data" section
- Click on one of the three sample datasets to try the tool
- This is great for learning how the tool works

**Option B: Enter Data Manually**
- Click on "Manual Entry"
- Type your data directly into the table
- Use the "+" buttons to add more rows or columns
- Use the "✕" buttons to remove rows or columns

**Option C: Paste from a Spreadsheet**
- Click on "Paste CSV/TSV"
- Copy your data from Excel or Google Sheets
- Paste it into the text box
- The tool will automatically organize it into a table

### Step 4: Add Context (Recommended)
Before clicking "Analyze Table," you can add information about your experiment in the "Research Context" box. For example:
- What were you trying to find out?
- What do the column headers (A, B, C, D) represent?
- What is the goal of your research?

This helps the tool give you better, more relevant interpretations.

### Step 5: Click "Analyze Table"
The tool will process your data using artificial intelligence. This usually takes 5-15 seconds.

### Step 6: Review Your Results
You will see:
1. Your table with important cells highlighted in different colors
2. A list of patterns found in your data
3. Three versions of the summary (short → medium → detailed)

---

## Understanding the Sample Data

The tool includes three sample datasets to help you practice. Here's what each one means:

### Sample 1: Cucumber Fertilizer Trial

**What it's about:** Scientists grew 'Pointsett' cucumber plants using four different fertilizers (labeled A, B, C, and D) to see which one produces the best growth and fruit yield.

| Measurement | What it means | Units |
|-------------|---------------|-------|
| Plant height | How tall the plants grew | Centimeters (cm) |
| Branches (No.) | How many branches each plant developed | Count |
| Shoot dry weight | Weight of the above-ground parts after drying | Grams (g) |
| Root dry weight | Weight of the roots after drying | Grams (g) |
| Shoot root ratio | Comparison of shoot to root size | Ratio (no units) |
| Total weight of fruits | Combined weight of all fruits from one plant | Grams (g) |
| Fruits/plant | How many fruits each plant produced | Count |
| Mean weight of fruits | Average weight of a single fruit | Grams (g) |

**The letters after numbers (like "200a" or "600b"):** These are statistical groupings. Values with the same letter are not significantly different from each other. Different letters mean the difference is statistically significant.

---

### Sample 2: Antibiotic Efficacy Study

**What it's about:** Scientists tested four antibiotics against five types of harmful bacteria to see which antibiotic works best against each type.

| Measurement | What it means | Units |
|-------------|---------------|-------|
| E. coli | A common bacteria that can cause food poisoning | — |
| S. aureus | Bacteria that causes skin infections ("staph") | — |
| P. aeruginosa | Bacteria that infects wounds and lungs | — |
| K. pneumoniae | Bacteria that causes pneumonia | — |
| S. pneumoniae | Another pneumonia-causing bacteria | — |

**The numbers (like "28" or "0"):** These are **inhibition zones** measured in millimeters (mm). This is the area around the antibiotic where bacteria cannot grow.
- **Higher numbers = better** (the antibiotic kills more bacteria)
- **0 = no effect** (the bacteria is resistant to that antibiotic)

---

### Sample 3: Student Performance Analysis

**What it's about:** Educators compared four teaching methods to see how students performed in different subjects and how satisfied they were.

| Measurement | What it means | Units |
|-------------|---------------|-------|
| Mathematics | Test scores in math | Points (out of 100) |
| Science | Test scores in science | Points (out of 100) |
| English | Test scores in English | Points (out of 100) |
| History | Test scores in history | Points (out of 100) |
| Student Satisfaction | How happy students were with the method | Percentage (%) |
| Completion Rate | How many students finished the course | Percentage (%) |

**The teaching methods:**
- **Traditional**: Teacher lectures, students listen and take notes
- **Flipped**: Students watch videos at home, do practice in class
- **Hybrid**: Mix of traditional and online learning
- **Online**: Entirely through internet-based platforms

---

## Types of Patterns the Tool Can Find

The tool looks for six types of interesting patterns in your data:

### 1. Comparison 🟢
**What it means:** Some groups are clearly different from others.

*Example:* "Fertilizers A and B produced similar yields, but both were much better than C and D."

*How it's written:* A = B > C = D (where "=" means similar, ">" means greater than)

---

### 2. Trend 🔵
**What it means:** Values go up or down in an orderly pattern.

*Example:* "As the antibiotic dose increased, the infection cleared up faster."

---

### 3. Correlation 🟣
**What it means:** Two things seem connected — when one goes up, the other also goes up (or down).

*Example:* "Students who were more satisfied also had higher test scores."

---

### 4. Grouping 🟡
**What it means:** Some measurements naturally belong together.

*Example:* "All the growth measurements (height, weight, branches) showed similar patterns, while the fruit measurements behaved differently."

---

### 5. Outlier 🔴
**What it means:** Something unusual that doesn't fit the expected pattern.

*Example:* "All antibiotics worked against the bacteria except Penicillin, which had no effect at all."

---

### 6. Other ⚪
**What it means:** Any interesting observation that doesn't fit the categories above.

*Example:* "Online learning had the lowest completion rate, which might affect how we interpret its test scores."

---

## Reading Your Results

After clicking "Analyze Table," you'll see several sections:

### Highlighted Table
Your original table, but with important cells colored:
- 🟢 **Green** = Highest or best values
- 🔴 **Red** = Lowest values
- 🟡 **Yellow** = Notable or interesting patterns
- 🔵 **Blue** = Key values being compared

**Tip:** Hover your mouse over any highlighted cell (marked with a ★) to see why it was highlighted.

### Identified Patterns
A list of all the interesting things the tool found in your data. Each pattern shows:
- What aspect of the data it relates to
- The pattern itself (sometimes in abbreviated form)
- An explanation of what it means

### Three Levels of Summary

1. **Telegraphic Summary** — Very brief, uses abbreviations. Good for your personal notes.

2. **Expanded Idea** — The same information written as complete sentences. Good for drafting your paper.

3. **Full Interpretation** — A paragraph that explains what the data means and why it matters. Good for your Discussion section.

---

## Accessibility Features

This tool was designed to be easy to use for everyone, including users with visual impairments, motor difficulties, or those who prefer using mobile devices.

### Adjustable Text Size

For users who find the default text too small (especially helpful for senior researchers or those with visual impairments):

1. **Find the text size buttons** at the top-right corner of the page — you'll see three "A" letters of different sizes
2. **Click the larger "A"** to increase all text on the page
3. **Three size options are available:**
   - **A** (small) — Normal size, good for younger users or large screens
   - **A** (medium) — 25% larger, comfortable for extended reading
   - **A** (large) — 50% larger, best for users who need larger text
4. **Your preference is automatically saved** — when you return to the tool, it will remember your choice

### Keyboard Navigation

For users who cannot use a mouse or prefer keyboard controls:

| Key | Action |
|-----|--------|
| **Tab** | Move to the next clickable item (button, link, input field) |
| **Shift + Tab** | Move to the previous clickable item |
| **Enter** | Click the currently selected item |
| **Arrow keys** | Navigate within tables and dropdown menus |

**Skip Link:** When you first press Tab on the page, a "Skip to main content" link will appear. Press Enter to jump past the navigation and go directly to the main tool area. This is especially useful for screen reader users.

### Screen Reader Friendly

The tool is compatible with screen readers like JAWS, NVDA, and VoiceOver:

- **All buttons and icons have text descriptions** — screen readers will announce what each button does
- **Tables are properly labeled** — row and column headers are correctly marked so screen readers can announce which cell you're in
- **Live announcements** — when the analysis is loading or complete, your screen reader will announce the status
- **Highlighted cells include explanations** — the reason each cell is highlighted is available to screen readers, not just visible on hover

### High Contrast Support

- The tool respects your system's high contrast settings
- Highlighted cells use distinct colors that remain visible in most color vision deficiency modes
- Text always maintains sufficient contrast against backgrounds

---

## Mobile Accessibility

The tool is fully functional on smartphones and tablets. Here's how to use it on a mobile device:

### Using on a Phone or Tablet

**Screen Layout:**
- On smaller screens, the layout automatically adjusts to be single-column
- Buttons become larger and easier to tap
- Tables scroll horizontally if they're too wide for your screen (swipe left/right)

**Entering Data:**
- Tap any cell in the table to edit it
- Use your phone's keyboard to type values
- The "+" buttons for adding rows and columns are large enough for easy tapping
- To delete a column, tap the "✕" button above that column

**Analyzing Your Data:**
- The "Analyze Table" button is full-width on mobile, making it easy to tap
- Results appear below the table — scroll down to see them
- Highlighted cells show a ★ symbol; tap and hold to see why they're highlighted

**Reading Results:**
- All three levels of interpretation (telegraphic, expanded, full) are displayed vertically
- Swipe up to scroll through the results
- Pattern badges are large enough to read on small screens

### Tips for Mobile Users

📱 **Rotate your phone** — For wide tables, turning your phone sideways (landscape mode) shows more columns at once

📱 **Pinch to zoom** — If text is too small, you can pinch-zoom on most mobile browsers. However, using the built-in text size buttons is recommended for a better experience

📱 **Use the sample data** — Entering data manually on a phone can be tedious. Consider:
  - Loading one of the sample datasets to test the tool
  - Preparing your data on a computer and emailing the CSV to yourself
  - Using the "Paste CSV" option if you copy data from another app

📱 **Bookmark the page** — Add the tool to your home screen for quick access:
  - **iPhone:** Tap Share → "Add to Home Screen"
  - **Android:** Tap Menu (⋮) → "Add to Home Screen"

### Supported Devices

The tool has been tested on:
- ✅ iPhone (Safari, Chrome)
- ✅ iPad (Safari, Chrome)
- ✅ Android phones (Chrome, Firefox, Samsung Internet)
- ✅ Android tablets (Chrome)
- ✅ Windows tablets (Edge, Chrome)

---

## Tips for Best Results

✅ **Add context** — Tell the tool what your experiment was about. This helps it give better interpretations.

✅ **Use clear labels** — Make sure your row and column names clearly describe what they measure.

✅ **Include units** — Add units like (cm), (g), or (%) to your parameter names when possible.

✅ **Review the output** — The AI gives suggestions based on patterns it sees. You know your research best, so use the output as a starting point, not the final word.

✅ **Try the sample data first** — If you're new to the tool, practice with the sample datasets before using your own data.

---

## Acknowledgments

### Book Reference

The concept of **telegraphic summary** and the methodology for interpreting research data used in this tool are based on the techniques described in the book on technical writing for research by:

- **Ofelia K. Bautista**
- **Nestor R. Bondad**  
- **Roberto E. Bautista**

Their work on scientific writing has been invaluable in helping researchers present their findings clearly and meaningfully.

### About This Tool

This tool was created to make the telegraphic summary technique more accessible to researchers, students, and educators. It uses artificial intelligence to analyze data tables and generate interpretations, but the underlying methodology follows established practices in scientific writing.

---

## Need Help?

If you encounter any problems or have suggestions for improving the tool, please contact the developer.

---

*Last updated: February 2026*
