"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Surface to whatever telemetry is wired up (Vercel logs, Sentry, etc.)
    console.error("[app/error] Unhandled error:", error);
  }, [error]);

  return (
    <main style={{ background: "#070b12", minHeight: "100vh" }}>
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.25rem",
        }}
      >
        <div style={{ maxWidth: 560, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#F97316",
              marginBottom: 16,
            }}
          >
            Something cracked
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#F5F0EB",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
            }}
          >
            We hit a pothole on this page.
          </h1>
          <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6, margin: "0 0 28px" }}>
            An unexpected error broke this view. Reload to try again — if it keeps happening, our team has been notified.
          </p>

          {error?.digest && (
            <p style={{ fontSize: 11, color: "#4B5563", fontFamily: "monospace", marginBottom: 24 }}>
              Reference: {error.digest}
            </p>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                padding: "12px 22px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
              }}
            >
              Reload page
            </button>
            <Link
              href="/"
              style={{
                padding: "12px 22px",
                borderRadius: 10,
                background: "transparent",
                color: "#F5F0EB",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
