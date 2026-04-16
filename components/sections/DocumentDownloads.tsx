// components/sections/DocumentDownloads.tsx
import { getDocsForProduct, docTypeLabel, type ProductDocument } from "@/lib/documents";

function DocRow({ doc, isLast }: { doc: ProductDocument; isLast: boolean }) {
  const typeLabel = docTypeLabel[doc.type];
  const labelText = doc.lang ? `${doc.label} (${doc.lang.toUpperCase()})` : doc.label;
  // Only show the type badge when it adds information the label doesn't already convey
  const showBadge = labelText.toLowerCase() !== typeLabel.toLowerCase();

  return (
    <a
      href={doc.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 py-3 group transition-colors hover:bg-orange-50/50 rounded-lg px-3 -mx-3"
      style={{ borderBottom: isLast ? "none" : "1px solid #f3f4f6" }}
    >
      {/* PDF icon */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
        style={{ background: "rgba(249,115,22,0.08)" }}
      >
        <svg className="w-4 h-4" style={{ color: "#F97316" }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      </span>

      {/* Document name */}
      <span className="flex-1 text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors min-w-0 truncate">
        {labelText}
      </span>

      {/* Type badge — only when it adds info beyond the label */}
      {showBadge && (
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border hidden sm:inline"
          style={{ background: "rgba(249,115,22,0.06)", color: "#F97316", borderColor: "rgba(249,115,22,0.15)" }}
        >
          {typeLabel}
        </span>
      )}

      {/* Download icon */}
      <svg
        className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-y-0.5 text-gray-300 group-hover:text-[#F97316]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  );
}

export default function DocumentDownloads({ slug }: { slug: string }) {
  const docs = getDocsForProduct(slug);
  if (docs.length === 0) return null;

  return (
    <div className="mt-14 -mx-4 sm:mx-0">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#F97316" }}>
                Specification Library
              </p>
              <h2 className="text-xl font-bold text-gray-900">Downloads</h2>
            </div>
            <div className="flex-1 h-px bg-gray-100 ml-4" />
            <span className="text-xs text-gray-400 shrink-0">{docs.length} file{docs.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Doc rows */}
          <div>
            {docs.map((doc, idx) => (
              <DocRow key={`${doc.type}-${doc.href}`} doc={doc} isLast={idx === docs.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
