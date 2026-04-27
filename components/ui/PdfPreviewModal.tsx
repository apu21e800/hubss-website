"use client";

import { useEffect } from "react";

interface Props {
  href: string;
  label: string;
  typeLabel: string;
  productLabel?: string;
  onClose: () => void;
}

export default function PdfPreviewModal({ href, label, typeLabel, productLabel, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const displayLabel = label;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div
        className="relative flex flex-col mx-auto w-full"
        style={{
          maxWidth: 960,
          height: "100dvh",
          background: "#0d1117",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header bar */}
        <div
          className="flex items-center gap-3 px-4 sm:px-6 py-4 flex-shrink-0"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "#141b2d",
          }}
        >
          {/* PDF icon */}
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(249,115,22,0.12)" }}
          >
            <svg className="w-4 h-4" style={{ color: "#F97316" }} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Labels */}
          <div className="flex-1 min-w-0">
            {productLabel && (
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-0.5" style={{ color: "#F97316" }}>
                {productLabel}
              </p>
            )}
            <p className="text-sm font-semibold truncate" style={{ color: "#F5F0EB" }}>
              {displayLabel}
            </p>
          </div>

          {/* Type badge */}
          <span
            className="hidden sm:inline flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{
              background: "rgba(249,115,22,0.1)",
              color: "#F97316",
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          >
            {typeLabel}
          </span>

          {/* Download button */}
          <a
            href={href}
            download
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: "linear-gradient(135deg, #F97316, #ea6c10)",
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 2px 10px rgba(249,115,22,0.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#9CA3AF",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            aria-label="Close preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* PDF iframe */}
        <div className="flex-1 min-h-0">
          <iframe
            src={`${href}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full"
            style={{ border: "none", display: "block" }}
            title={displayLabel}
          />
        </div>

        {/* Bottom fallback bar */}
        <div
          className="flex-shrink-0 flex items-center justify-center gap-3 px-4 py-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "#0d1117",
          }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            PDF not rendering?
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold transition-colors hover:text-white"
            style={{ color: "#F97316" }}
          >
            Open in new tab →
          </a>
        </div>
      </div>
    </div>
  );
}
