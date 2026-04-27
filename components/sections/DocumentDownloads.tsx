"use client";

import { useState } from "react";
import { getDocsForProduct, docTypeLabel, type ProductDocument } from "@/lib/documents";
import PdfPreviewModal from "@/components/ui/PdfPreviewModal";

interface PreviewState {
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
  onPreview: (state: PreviewState) => void;
}) {
  const typeLabel = docTypeLabel[doc.type];
  const labelText = doc.lang
    ? `${doc.label} (${doc.lang.toUpperCase()})`
    : doc.label;
  const showBadge = labelText.toLowerCase() !== typeLabel.toLowerCase();

  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: isLast ? "none" : "1px solid #f3f4f6" }}
    >
      {/* PDF icon */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
        style={{ background: "rgba(249,115,22,0.08)" }}
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

      {/* Document name */}
      <span
        className="flex-1 text-sm font-medium text-gray-800 min-w-0 truncate"
      >
        {labelText}
      </span>

      {/* Type badge */}
      {showBadge && (
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border hidden sm:inline"
          style={{
            background: "rgba(249,115,22,0.06)",
            color: "#F97316",
            borderColor: "rgba(249,115,22,0.15)",
          }}
        >
          {typeLabel}
        </span>
      )}

      {/* Preview button */}
      <button
        onClick={() =>
          onPreview({ href: doc.href, label: labelText, typeLabel })
        }
        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all group"
        style={{ background: "rgba(249,115,22,0.06)", color: "#F97316", border: "1px solid rgba(249,115,22,0.15)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#f97316";
          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.06)";
          (e.currentTarget as HTMLButtonElement).style.color = "#F97316";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(249,115,22,0.15)";
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="hidden sm:inline">Preview</span>
      </button>

      {/* Download icon */}
      <a
        href={doc.href}
        download
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
        style={{ color: "#d1d5db", background: "rgba(0,0,0,0.03)", border: "1px solid #f3f4f6" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "#F97316";
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(249,115,22,0.06)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(249,115,22,0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "#d1d5db";
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,0,0,0.03)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "#f3f4f6";
        }}
        title="Download PDF"
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
  const [preview, setPreview] = useState<PreviewState | null>(null);

  if (docs.length === 0) return null;

  return (
    <>
      {preview && (
        <PdfPreviewModal
          href={preview.href}
          label={preview.label}
          typeLabel={preview.typeLabel}
          onClose={() => setPreview(null)}
        />
      )}

      <div className="mt-14 -mx-4 sm:mx-0">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <p
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
                  style={{ color: "#F97316" }}
                >
                  Specification Library
                </p>
                <h2 className="text-xl font-bold text-gray-900">Downloads</h2>
              </div>
              <div className="flex-1 h-px bg-gray-100 ml-4" />
              <span className="text-xs text-gray-400 shrink-0">
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
                  onPreview={setPreview}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
