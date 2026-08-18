"use client";
import { useEffect } from "react";
import { X, Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import { previewFor } from "@/lib/pdf-previews";

interface PdfPreviewModalProps {
  href: string;
  label: string;
  typeLabel?: string;
  productLabel?: string;
  onClose: () => void;
}

export default function PdfPreviewModal({
  href,
  label,
  typeLabel,
  productLabel,
  onClose,
}: PdfPreviewModalProps) {
  // Pre-rendered page images render on every browser. An inline PDF does not:
  // Android Chrome and in-app webviews show a blank panel instead.
  const preview = previewFor(href);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 sm:p-8"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal panel */}
      <div
        className="relative flex flex-col w-full max-w-5xl rounded-xl overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid rgba(255,255,255,0.1)",
          height: "calc(100dvh - 2rem)",
          maxHeight: "900px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Orange top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{ background: "linear-gradient(90deg, #f97316 0%, rgba(249,115,22,0.3) 60%, transparent 100%)" }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* PDF icon */}
          <span
            className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: "rgba(249,115,22,0.12)" }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: "#F97316" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          {/* Title */}
          <div className="flex-1 min-w-0">
            {productLabel && (
              <p
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5"
                style={{ color: "#F97316" }}
              >
                {productLabel}
              </p>
            )}
            <h3
              className="text-sm font-semibold truncate"
              style={{ color: "#F5F0EB" }}
            >
              {label}
            </h3>
          </div>

          {/* Type badge */}
          {typeLabel && (
            <span
              className="hidden sm:inline text-[10px] font-semibold px-2 py-1 rounded flex-shrink-0"
              style={{
                background: "rgba(249,115,22,0.10)",
                color: "#F97316",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
            >
              {typeLabel}
            </span>
          )}

          {/* Download button */}
          <a
            href={href}
            download
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg flex-shrink-0 transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:brightness-125"
            style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body — pre-rendered pages where we have them, native PDF otherwise */}
        {preview ? (
          <div
            className="flex-1 overflow-y-auto"
            style={{ background: "rgba(0,0,0,0.35)", minHeight: 0 }}
          >
            <div className="flex flex-col items-center gap-4 px-4 py-5">
              {preview.pages.map((pg, i) => (
                <Image
                  key={pg.src}
                  src={pg.src}
                  alt={`${label} — page ${i + 1} of ${preview.total}`}
                  width={pg.w}
                  height={pg.h}
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, 760px"
                  className="w-full h-auto rounded-md"
                  style={{ maxWidth: "760px", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              ))}
              {preview.total > preview.pages.length && (
                <p className="text-xs text-center px-4" style={{ color: "#6B7280" }}>
                  Showing {preview.pages.length} of {preview.total} pages — download for the full document.
                </p>
              )}
            </div>
          </div>
        ) : (
          <iframe
            src={`${href}#toolbar=1&navpanes=0&scrollbar=1`}
            className="flex-1 w-full"
            style={{ border: "none", minHeight: 0 }}
            title={label}
          />
        )}

        {/* Fallback footer */}
        <div
          className="flex items-center justify-center gap-1 px-5 py-2.5 flex-shrink-0 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "#6B7280",
          }}
        >
          {preview ? "Want the full document?" : "PDF not rendering?"}&nbsp;
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-orange-400"
            style={{ color: "#F97316" }}
          >
            {preview ? "Open full PDF" : "Open in new tab"} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
