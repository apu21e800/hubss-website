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
  // The type chip is on every row since 30 Sep 2026. It used to show only
  // when the name differed from the type, so a five-row list had chips on
  // one or two rows and the column read as arbitrary (QA B14: "Brochure" with
  // no chip beside "Brochure (FR)" with one).
  const showBadge = true;

  return (
    <div
      className="flex items-center gap-3 py-2.5"
      style={{ borderBottom: isLast ? "none" : "1px solid var(--border-color)" }}
    >
      {/* PDF icon */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
        style={{ background: "rgba(249,115,22,0.10)" }}
      >
        <svg className="w-4 h-4" style={{ color: "var(--accent-text-lg)" }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      </span>

      {/* Document name. Wraps rather than truncates: at 390 px about thirty
          names ended mid-word ("Asphalt Texturing Sp…"), and a specifier
          cannot pick the sheet they need from half its name (QA, 27 Sep 2026). */}
      <span className="flex-1 text-sm font-medium min-w-0 break-words leading-snug" style={{ color: "var(--text-body)" }}>
        {labelText}
      </span>

      {/* Type badge — desktop only */}
      {showBadge && (
        <span
          className="flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded border hidden sm:inline"
          style={{ background: "rgba(249,115,22,0.08)", color: "var(--accent-text-lg)", borderColor: "rgba(249,115,22,0.18)" }}
        >
          {typeLabel}
        </span>
      )}

      {/* Preview button */}
      {/* The same row as /resources draws (uniformity pass, 17 Oct 2026):
          Preview a grey ghost button, the download square orange, both with
          a hover. Here Preview was orange and the download grey, and
          neither changed under the pointer. */}
      <button
        onClick={() => onPreview({ href: doc.href, label: labelText, typeLabel })}
        className="btn-ghost btn-sm flex-shrink-0 text-xs"
        aria-label={`Preview ${labelText}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="hidden sm:inline">Preview</span>
      </button>

      {/* Download button */}
      <a
        href={doc.href}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="doc-download flex-shrink-0 flex items-center justify-center rounded-lg"
        style={{ minWidth: "44px", minHeight: "44px" }}
        title={`Download ${labelText}`}
        aria-label={`Download ${labelText}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div id="spec-sheets" className="mt-14">
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--ink-10)",
          }}
        >
          {/* Narrower padding on phones leaves the names room for two lines. */}
          <div className="px-4 py-6 sm:px-8 sm:py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <p className="eyebrow mb-1">
                  Documents
                </p>
                {/* "Spec sheets": the name buyers use, and the one the button
                    above and the menu use (copy review, 17 Oct 2026: six
                    names for the same PDFs). */}
                <h2 className="h2-sub" style={{ color: "var(--text-primary)" }}>
                  Spec sheets
                </h2>
              </div>
              <div className="flex-1 h-px ml-4" style={{ background: "var(--fill-subtle)" }} />
              <span className="text-xs shrink-0" style={{ color: "var(--ink-55)" }}>
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
