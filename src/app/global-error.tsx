// src/app/global-error.tsx
// Last resort when the root layout itself throws. Reports, then offers a reload.

"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "40rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>The page failed to load</h1>
        <p style={{ marginTop: "0.75rem" }}>
          The error has been recorded{error.digest ? ` (ref ${error.digest})` : ""}. Reload to try again.
        </p>
        <button type="button" onClick={reset} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Reload
        </button>
      </body>
    </html>
  );
}
