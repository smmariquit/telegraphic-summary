// src/components/Shell.tsx
//
// Header, text-size control, and footer around every page.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type TextSize = "normal" | "large" | "xlarge";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Read the stored size once, on the client. The server renders "normal";
  // the buttons below suppress the one-attribute hydration difference.
  const [textSize, setTextSize] = useState<TextSize>(() => {
    if (typeof window === "undefined") return "normal";
    try {
      const saved = localStorage.getItem("textSize");
      if (saved === "normal" || saved === "large" || saved === "xlarge") return saved;
    } catch {
      // storage unavailable
    }
    return "normal";
  });

  useEffect(() => {
    document.documentElement.dataset.size = textSize;
    try {
      localStorage.setItem("textSize", textSize);
    } catch {
      // storage unavailable
    }
  }, [textSize]);

  const onGuide = pathname.startsWith("/guide");

  return (
    <div className="bg-paper text-ink min-h-screen">
      <a
        href="#main"
        className="focus:bg-ink focus:text-paper sr-only focus:not-sr-only focus:absolute focus:top-[var(--space-sm)] focus:left-[var(--space-sm)] focus:z-10 focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)]"
      >
        Skip to content
      </a>

      <header className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-[var(--space-lg)] gap-y-[var(--space-2xs)] px-[clamp(1rem,4vw,2rem)] pt-[var(--space-md)] print:hidden">
        <Link href="/" className="font-display text-[length:var(--text-md)]">
          Telegraphic Summary
        </Link>
        <nav aria-label="Sections" className="flex items-baseline gap-[var(--space-md)] text-[length:var(--text-sm)]">
          <Link href="/" className="link" aria-current={!onGuide ? "page" : undefined}>
            Worksheet
          </Link>
          <Link href="/guide" className="link" aria-current={onGuide ? "page" : undefined}>
            Guide
          </Link>
          <div
            role="group"
            aria-label="Text size"
            className="ml-[var(--space-sm)] flex items-baseline gap-[var(--space-2xs)]"
          >
            {(["normal", "large", "xlarge"] as TextSize[]).map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setTextSize(s)}
                aria-pressed={textSize === s}
                suppressHydrationWarning
                aria-label={`${s === "normal" ? "Normal" : s === "large" ? "Large" : "Extra large"} text`}
                className={`link font-display ${i === 1 ? "text-[length:var(--text-md)]" : i === 2 ? "text-[length:var(--text-lg)]" : ""}`}
              >
                A
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main
        id="main"
        className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)] pt-[var(--space-2xl)] pb-[var(--space-3xl)]"
      >
        {children}
      </main>

      <footer className="border-rule border-t">
        <p className="text-muted mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)] py-[var(--space-lg)] font-mono text-[length:var(--text-xs)] leading-[1.7]">
          Method: Bautista, O.K., and N.D. Bondad. 1997. Technical writing for beginners. ECRC and Associates, Los
          Baños, Laguna. ISBN 971-91902-0-5. Ch. 11, Interpreting data, pp. 80–85; Ch. 14, Language usage, pp. 106–113.
          Revised 2012 as Bautista, Rosario, and Bautista Jr., Technical writing for publication in journals and for
          presentation, UPLB/UPLBFI, ISBN 978-971-547-303-3. Steps 1 and 2 computed locally from the mean-separation
          letters. Step 3 written by a language model under the book’s rules. Sample tables: Table 5 of the book and
          four practice tables supplied with it. Photographs from Wikimedia Commons, credited where shown.
        </p>
      </footer>
    </div>
  );
}
