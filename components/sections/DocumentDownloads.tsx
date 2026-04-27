"use client";

import { useState } from "react";
import { getDocsForProduct, docTypeLabel, type ProductDocument } from "@/lib/documents";
import PdfPreviewModal from "@/components/ui/PdfPreviewModal";

interface SelectedDoc {
  href: string;
  label: string;
  typeLabel: string;
}

function DocRow({
  doc,
  isLast,
  onPreview,
}: {
  doc: ProductDocument;
  isLast: boolean;
  onPreview: (doc: ProductDocument) => void;
}) {
  const tLabel = docTypeLabel[doc.type];
  const labelText = doc.lang ? `${doc.label} (${doc.lang.toUpperCase()})` : doc.label;
  const showBadge = labelText.toLowerCase() !== tLabel.toLowerCase();

  return (
    <div
      className="flex items-center gap-3 py-3 group"
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* PDF icon */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
        style={{ background: "rgba(249,115,22,0.08)" }}
      >
        <svg className="w-4 h-4" style={{ color: "#F97316" }} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {/* Document name — click to preview */}
      <button
        className="flex-1 text-left text-sm font-medium truncate min-w-0 transition-colors"
        style={{ color: "#e5e7eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        onClick={() => onPreview(doc)}
      >
        {labelText}
      </button>

      {/* Type badge */}
      {showBadge && (
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border hidden sm:inline"
          style={{ background: "rgba(249,115,22,0.06)", color: "#F97316", borderColor: "rgba(249,115,22,0.15)" }}
        >
          {tLabel}
        </span>
      )}

      {/* Preview button */}
      <button
        onClick={() => onPreview(doc)}
        className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all"
        style={{
          background: "rgba(249,115,22,0.08)",
          color: "#F97316",
          border: "1px solid rgba(249,115,22,0.18)",
          cursor: "pointer",
        }}
        aria-label={`Preview ${labelText}`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="hidden sm:inline">Preview</span>
      </button>

      {/* Download link */}
      <a
        href={doc.href}
        download
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded transition-all"
        style={{ color: "rgba(255,255,255,0.35)" }}
        aria-label={`Download ${labelText}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F97316")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)")}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </a>
    </div>
  );
}

export default function DocumentDownloads({ slug }: { slug: string }) {
  const docs = getDocsForProduct(slug);
  const [selected, setSelected] = useState<SelectedDoc | null>(null);

  if (docs.length === 0) return null;

  const handlePreview = (doc: ProductDocument) => {
    setSelected({
      href: doc.href,
      label: doc.lang ? `${doc.label} (${doc.lang.toUpperCase()})` : doc.label,
      typeLabel: docTypeLabel[doc.type],
    });
  };

  return (
    <>
      <div
        className="mt-14 rounded-2xl overflow-hidden"
        style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Orange top accent */}
        <div className="h-0.5" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />

        <div className="px-6 sm:px-8 py-7">
          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#F97316" }}>
                Specification Library
              </p>
              <h2 className="text-lg font-bold" style={{ color: "#F5F0EB" }}>Downloads</h2>
            </div>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs" style={{ color: "#6B7280" }}>
              {docs.length} file{docs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Doc rows */}
          <div>
            {docs.map((doc, idx) => (
              <DocRow
                key={`${doc.type}-${doc.href}`}
                doc={doc}
                isLast={idx === docs.length - 1}
                onPreview={handlePreview}
              />
            ))}
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {selected && (
        <PdfPreviewModal
          href={selected.href}
          label={selected.label}
          typeLabel={selected.typeLabel}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
