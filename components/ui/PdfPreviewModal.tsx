"use client";
import { useEffect, useRef } from "react";
import { X, Download, ExternalLink } from "lucide-react";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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

  // Move focus into the dialog on open and back to whatever opened it (the
  // doc card's "Preview" button) on close. Previously focus wasn't managed
  // at all: opening the modal left focus sitting on a "Preview" button that
  // was now visually buried behind the overlay, and closing it dropped focus
  // to <body> — the keyboard-equivalent of the modal not existing.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      previouslyFocused?.focus();
    };
  }, []);

  // Trap Tab/Shift+Tab inside the dialog. The page behind it is still in the
  // DOM and not inert, so without this, tabbing past the last link (or
  // shift-tabbing before the first) walked focus into the resources grid
  // sitting invisibly underneath the overlay. The PDF <iframe> is deliberately
  // NOT one of the trapped stops (see tabIndex={-1} below): once focus moves
  // into the browser's native PDF plugin, further Tab/Escape presses are
  // consumed by the plugin itself and never reach this document's listeners
  // — an unfixable browser-level keyboard trap. Skipping the iframe in the
  // Tab sequence avoids that trap entirely; the footer's "Open in new tab"
  // link is the keyboard-reachable equivalent.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Preview — ${label}`}
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
            ref={closeBtnRef}
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:brightness-125"
            style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PDF iframe — excluded from the Tab sequence (tabIndex=-1). Once
            keyboard focus enters the browser's native PDF plugin, Tab and
            Escape are consumed by the plugin and never reach this page's
            key handlers, so it can never be Tab'd into or out of; mouse
            users can still click into it and use its native controls as
            normal. "Open in new tab" below is the keyboard equivalent. */}
        <iframe
          src={`${href}#toolbar=1&navpanes=0&scrollbar=1`}
          className="flex-1 w-full"
          style={{ border: "none", minHeight: 0 }}
          title={label}
          tabIndex={-1}
        />

        {/* Fallback footer */}
        <div
          className="flex items-center justify-center gap-1 px-5 py-2.5 flex-shrink-0 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "#868C98",
          }}
        >
          PDF not rendering?&nbsp;
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-orange-400"
            style={{ color: "#F97316" }}
          >
            Open in new tab <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
