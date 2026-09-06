// src/components/CopyButton.tsx

"use client";

import { useEffect, useState } from "react";

interface Props {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copy" }: Props) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 1600);
    return () => window.clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("failed");
    }
  };

  return (
    <button type="button" className="btn btn--quiet btn--sm print:hidden" onClick={copy} aria-live="polite">
      {state === "done" ? "Copied" : state === "failed" ? "Could not copy" : label}
    </button>
  );
}
