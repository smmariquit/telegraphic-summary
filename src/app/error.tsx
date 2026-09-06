// src/app/error.tsx
// A page threw inside the shell. Report it, keep the header and footer, offer a retry.

"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="max-w-[var(--measure)]">
      <h1 className="text-[length:var(--text-xl)]">Something broke on this page</h1>
      <p className="text-muted mt-[var(--space-sm)] [text-wrap:pretty]">
        The error has been recorded{error.digest ? `, reference ${error.digest}` : ""}. Steps 1 and 2 never need the
        network, so a retry usually works.
      </p>
      <div className="mt-[var(--space-md)] flex gap-[var(--space-sm)]">
        <button type="button" className="btn" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="btn btn--quiet">
          Worksheet
        </Link>
      </div>
    </div>
  );
}
