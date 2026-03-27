// components/sections/DocumentDownloads.tsx
import { getDocsForProduct, docTypeLabel, type ProductDocument } from "@/lib/documents";

function DocRow({ doc, isLast }: { doc: ProductDocument; isLast: boolean }) {
  const label = doc.lang ? `${doc.label} (${doc.lang.toUpperCase()})` : doc.label;

  return (
    <a
      href={doc.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-4 py-3.5 group transition-colors hover:bg-orange-50/60 rounded-lg px-3 -mx-3"
      style={{ borderBottom: isLast ? "none" : "1px solid #f0f0f0" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded shrink-0 border"
          style={{ background: "rgba(249,115,22,0.08)", color: "#F97316", borderColor: "rgba(249,115,22,0.2)" }}
        >
          {docTypeLabel[doc.type]}
        </span>
        <span className="text-sm truncate text-gray-800 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      </div>
      <svg
        className="w-4 h-4 shrink-0 transition-transform group-hover:translate-y-0.5 text-gray-400 group-hover:text-[#F97316]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </a>
  );
}

export default function DocumentDownloads({ slug }: { slug: string }) {
  const docs = getDocsForProduct(slug);
  if (docs.length === 0) return null;

  return (
    <div className="mt-14 -mx-4 sm:mx-0">
      {/* White-grid section wrapper */}
      <div className="bg-grid rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#F97316" }}>
                Specification Library
              </p>
              <h2 className="text-xl font-bold text-gray-900">
                Downloads
              </h2>
            </div>
            <div className="flex-1 h-px bg-gray-200 ml-4" />
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
