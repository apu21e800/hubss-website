"use client";

import { useState, useMemo } from "react";
import type { ResourceDocument } from "@/lib/resource-documents";
import { docTypeLabel } from "@/lib/documents";

// ─── Icon ────────────────────────────────────────────────────────────────────
function PdfIcon() {
  return (
    <svg className="w-4 h-4" style={{ color: "#F97316" }} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
type SortKey = "product" | "type" | "label";

interface Props {
  documents: ResourceDocument[];
}

// ─── Single doc row ───────────────────────────────────────────────────────────
function DocRow({ doc }: { doc: ResourceDocument }) {
  const displayLabel = doc.lang
    ? `${doc.label} (${doc.lang.toUpperCase()})`
    : doc.label;

  return (
    <a
      href={doc.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-all"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(249,115,22,0.07)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(249,115,22,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* PDF icon */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
        style={{ background: "rgba(249,115,22,0.1)" }}
      >
        <PdfIcon />
      </span>

      {/* Label */}
      <span
        className="flex-1 text-sm font-medium truncate min-w-0"
        style={{ color: "#e5e7eb" }}
      >
        {displayLabel}
      </span>

      {/* Type badge */}
      <span
        className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded hidden sm:inline"
        style={{
          background: "rgba(249,115,22,0.08)",
          color: "#F97316",
          border: "1px solid rgba(249,115,22,0.18)",
        }}
      >
        {doc.typeLabel}
      </span>

      {/* Download arrow */}
      <svg
        className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-y-0.5"
        style={{ color: "rgba(255,255,255,0.25)" }}
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function ResourcesClient({ documents }: Props) {
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("product");

  // Unique product labels
  const products = useMemo(() => {
    const seen = new Map<string, string>();
    for (const d of documents) seen.set(d.productSlug, d.productLabel);
    return Array.from(seen.entries()).map(([slug, label]) => ({ slug, label }));
  }, [documents]);

  // Unique doc types present
  const types = useMemo(() => {
    const seen = new Set<string>();
    for (const d of documents) seen.add(d.type);
    return Array.from(seen).map((t) => ({
      value: t,
      label: docTypeLabel[t as keyof typeof docTypeLabel] ?? t,
    }));
  }, [documents]);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let result = documents;
    if (productFilter !== "all")
      result = result.filter((d) => d.productSlug === productFilter);
    if (typeFilter !== "all")
      result = result.filter((d) => d.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.label.toLowerCase().includes(q) ||
          d.productLabel.toLowerCase().includes(q) ||
          d.typeLabel.toLowerCase().includes(q)
      );
    }
    if (sort === "product")
      result = [...result].sort((a, b) =>
        a.productLabel.localeCompare(b.productLabel) ||
        a.label.localeCompare(b.label)
      );
    else if (sort === "type")
      result = [...result].sort((a, b) =>
        a.typeLabel.localeCompare(b.typeLabel) ||
        a.label.localeCompare(b.label)
      );
    else
      result = [...result].sort((a, b) => a.label.localeCompare(b.label));
    return result;
  }, [documents, productFilter, typeFilter, search, sort]);

  // Group by product when sorted by product
  const grouped = useMemo(() => {
    if (sort !== "product") return null;
    const map = new Map<string, { label: string; docs: ResourceDocument[] }>();
    for (const doc of filtered) {
      if (!map.has(doc.productSlug))
        map.set(doc.productSlug, { label: doc.productLabel, docs: [] });
      map.get(doc.productSlug)!.docs.push(doc);
    }
    return Array.from(map.values());
  }, [filtered, sort]);

  const chipStyle = (active: boolean): React.CSSProperties => ({
    background: active ? "#F97316" : "rgba(255,255,255,0.05)",
    color: active ? "#fff" : "#9ca3af",
    border: `1px solid ${active ? "#F97316" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "all 0.15s",
  });

  return (
    <div>
      {/* ── Controls ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search + Sort row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#F5F0EB",
            }}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg px-4 py-2.5 text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#9ca3af",
              minWidth: 160,
            }}
          >
            <option value="product">Sort by Product</option>
            <option value="type">Sort by Type</option>
            <option value="label">Sort by Name</option>
          </select>
        </div>

        {/* Product filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            style={chipStyle(productFilter === "all")}
            onClick={() => setProductFilter("all")}
          >
            All Products
          </button>
          {products.map((p) => (
            <button
              key={p.slug}
              style={chipStyle(productFilter === p.slug)}
              onClick={() => setProductFilter(p.slug)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Type filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            style={chipStyle(typeFilter === "all")}
            onClick={() => setTypeFilter("all")}
          >
            All Types
          </button>
          {types.map((t) => (
            <button
              key={t.value}
              style={chipStyle(typeFilter === t.value)}
              onClick={() => setTypeFilter(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ─────────────────────────────────── */}
      <p className="text-xs mb-6" style={{ color: "#6B7280" }}>
        {filtered.length} document{filtered.length !== 1 ? "s" : ""}
        {search || productFilter !== "all" || typeFilter !== "all" ? " matching filters" : " total"}
      </p>

      {/* ── Document list ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="text-sm" style={{ color: "#6B7280" }}>No documents match your search.</p>
      ) : grouped ? (
        <div className="space-y-10">
          {grouped.map((group) => (
            <div key={group.label}>
              {/* Product heading */}
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: "#F97316" }}>
                  {group.label}
                </h3>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                <span className="text-xs" style={{ color: "#6B7280" }}>
                  {group.docs.length} file{group.docs.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.docs.map((doc) => (
                  <DocRow key={`${doc.productSlug}-${doc.href}`} doc={doc} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((doc) => (
            <DocRow key={`${doc.productSlug}-${doc.href}`} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
