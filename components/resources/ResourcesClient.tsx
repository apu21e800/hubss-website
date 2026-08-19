"use client";

import { useState, useMemo, useEffect } from "react";
import { FileText, Download, Eye, Search, X, ChevronDown, Star, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ResourceDocument } from "@/lib/resource-documents";
import PdfPreviewModal from "@/components/ui/PdfPreviewModal";

const TABS = ["By Product", "By Document Type"] as const;
type TabType = (typeof TABS)[number];

// Display-order for type chips: most-relevant types first, then alphabetical.
const TYPE_PRIORITY = [
  "Catalogue",
  "Flyer",
  "Spec Sheet",
  "Data Sheet",
  "Brochure",
  "Safety Data Sheet",
  "Colour Guide",
  "Design Manual",
  "Installation Guide",
  "Guide",
  "Certificate",
  "Other",
];

const PRODUCTS = [
  { label: "All Products", value: "all" },
  { label: "TrafficPatterns", value: "traffic-patterns" },
  { label: "TrafficPatternsXD", value: "traffic-patterns-xd" },
  { label: "StreetPrint", value: "streetprint" },
  { label: "StreetBond", value: "streetbond" },
  { label: "StreetBondSR", value: "streetbond-sr" },
  { label: "MMAX", value: "mmax" },
  { label: "DecoMark", value: "decomark" },
  { label: "DuraShield", value: "durashield" },
  { label: "PreMark", value: "premark" },
  { label: "DuraTherm", value: "duratherm" },
  { label: "AirMark", value: "airmark" },
  { label: "ChipFill", value: "chipfill" },
  { label: "AggreFill", value: "aggrefill" },
  { label: "Fast Patch DPR", value: "fast-patch" },
];

const STREETBOND_SUBCATEGORIES = [
  { label: "All StreetBond", value: "all" },
  { label: "StreetBond", value: "StreetBond" },
  { label: "SB120", value: "SB120" },
  { label: "SB150", value: "SB150" },
  { label: "Concrete Primer", value: "Concrete Primer" },
  { label: "Pro 220", value: "Pro 220" },
  { label: "Pro 250", value: "Pro 250" },
];

// Badge styles — monochrome, typography-differentiated
function typeBadgeStyle(type: string): React.CSSProperties {
  const isHighlighted = ["Spec Sheet", "Data Sheet", "Brochure", "Safety Data Sheet", "Flyer", "Catalogue"].includes(type);
  return {
    color: isHighlighted ? "#f97316" : "rgba(255,255,255,0.55)",
    background: "transparent",
    border: "none",
    padding: 0,
    fontWeight: 700,
    letterSpacing: "0.15em",
  };
}

const PAGE_SIZE = 12;

const selectStyle: React.CSSProperties = {
  background: "#242424",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e5e7eb",
};

interface PreviewState {
  href: string;
  label: string;
  typeLabel: string;
  productLabel: string;
}

function DocCard({
  doc,
  onPreview,
}: {
  doc: ResourceDocument;
  onPreview: (state: PreviewState) => void;
}) {
  const isFlyer = doc.documentType === "flyer";
  const isCatalogue = doc.documentType === "catalogue";
  const hasThumb = (isFlyer || isCatalogue) && !!doc.previewImageUrl;
  const productLink =
    isFlyer && doc.product && doc.product !== "all"
      ? `/products/${doc.product}`
      : null;

  /**
   * The whole card opens the document. Previously only the small "Preview"
   * button did, which is a ~90px target on a ~350px card — on a phone that's
   * most of the card doing nothing when you tap it.
   *
   * Deliberately NOT role="button" + tabIndex. This card contains real buttons
   * and links, and wrapping those in another button control is the
   * `nested-interactive` accessibility violation — it would break the zero
   * critical violations the site currently holds, and screen readers would
   * announce the whole card as one control. Keyboard and assistive-tech users
   * already have the real <button> inside; this is a pointer affordance layered
   * on top of it, which is exactly what it should be.
   */
  const openDocument = () => {
    // Don't hijack the click when someone is selecting the title text.
    if (typeof window !== "undefined" && window.getSelection()?.toString()) return;
    if (isCatalogue) {
      window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    onPreview({
      href: doc.fileUrl,
      label: doc.title,
      typeLabel: doc.type,
      productLabel: doc.productName,
    });
  };

  // Inner links and buttons keep their own behaviour — without this, tapping
  // Download would also fire the card and open the preview behind the download.
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      onClick={openDocument}
      className="group rounded-xl flex flex-col justify-between overflow-hidden transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-12px_rgba(249,115,22,0.35)] cursor-pointer"
      style={{
        background: "var(--bg-card-neutral)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(249,115,22,0.28)";
        (e.currentTarget as HTMLDivElement).style.background = "#242424";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card-neutral)";
      }}
    >
      {/* Flyer thumbnail strip */}
      {hasThumb && doc.previewImageUrl && (
        <div
          className="relative w-full h-32 overflow-hidden"
          style={{ background: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Image
            src={doc.previewImageUrl}
            alt={`${doc.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-4"
            style={typeBadgeStyle(doc.type)}
          >
            {doc.type}
          </span>
          <h3 className="font-semibold leading-snug mb-2" style={{ color: "#F5F0EB" }}>
            {doc.title}
          </h3>
          {productLink && (
            <Link
              href={productLink}
              onClick={stop}
              className="inline-block text-xs mb-2 transition-colors hover:text-orange-400"
              style={{ color: "#9CA3AF" }}
            >
              View product page &rarr;
            </Link>
          )}
          <div className="mt-1">
            <span
              className="inline-block text-xs px-2 py-0.5 rounded-full"
              style={{
                color: "#e87527",
                background: "rgba(249,115,22,0.07)",
                border: "1px solid rgba(249,115,22,0.12)",
              }}
            >
              {doc.productName}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-2 mt-5 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* File meta */}
          <div className="flex items-center gap-1.5 text-xs flex-1 min-w-0" style={{ color: "#868C98" }}>
            <span>{doc.fileSize}</span>
            <span
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
            <span className="truncate">{doc.updatedDate}</span>
          </div>

          {/* Preview button — catalogue opens flipbook in a new tab; everything else uses the PDF modal */}
          {isCatalogue ? (
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-200 flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.08)", color: "#9CA3AF" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(249,115,22,0.12)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#f97316";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#9CA3AF";
              }}
              title="Open the 2026 catalogue flipbook"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Flipbook</span>
            </a>
          ) : (
            <button
              onClick={(e) => {
                stop(e);
                onPreview({
                  href: doc.fileUrl,
                  label: doc.title,
                  typeLabel: doc.type,
                  productLabel: doc.productName,
                });
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-200 flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.08)", color: "#9CA3AF" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.12)";
                (e.currentTarget as HTMLButtonElement).style.color = "#f97316";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF";
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          )}

          {/* Download / open button. Catalogue gets a "View" link (no PDF download); everything else downloads. */}
          {isCatalogue ? (
            <Link
              href={doc.fileUrl}
              onClick={stop}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 flex-shrink-0"
              style={{
                background: "rgba(249,115,22,0.10)",
                color: "#f97316",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#f97316";
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(249,115,22,0.10)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#f97316";
              }}
              title="Open catalogue"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <a
              href={doc.fileUrl}
              download
              onClick={stop}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 flex-shrink-0"
              style={{
                background: "rgba(249,115,22,0.10)",
                color: "#f97316",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#f97316";
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(249,115,22,0.10)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#f97316";
              }}
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResourcesClient({
  documents,
}: {
  documents: ResourceDocument[];
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("By Product");
  const [productFilter, setProductFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  // selectedTypes: empty Set = no type filter (shows all). Multi-select on
  // both tabs — chips on "By Document Type", multi-tag pill row on "By Product".
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  // Debounce search input so heavy filtering doesn't churn on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 180);
    return () => clearTimeout(t);
  }, [search]);

  // Derive the type-chip list from the actual documents — fixes the bug where
  // the previous hardcoded list contained "Case Study" / "White Paper" types
  // that no document has, so tapping those returned zero results. Counts
  // live next to each chip so users see what's available before tapping.
  const typeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of documents) {
      // Guard: a document with no type used to insert an `undefined` key here,
      // which then reached `a.localeCompare(b)` below and threw.
      const t = typeof d.type === "string" && d.type ? d.type : "Other";
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    const entries = Array.from(counts.entries());
    entries.sort(([a], [b]) => {
      const ai = TYPE_PRIORITY.indexOf(a);
      const bi = TYPE_PRIORITY.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return String(a).localeCompare(String(b));
    });
    return entries.map(([value, count]) => ({ value, count }));
  }, [documents]);

  function toggleType(value: string) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        // Build one haystack with ?? "" guards. These fields are typed as
        // required, but they arrive from Sanity via an unchecked fetch cast, so
        // TypeScript can't actually promise they're there — and when `type` was
        // missing, `doc.type.toLowerCase()` threw on the first keystroke and the
        // error boundary replaced the whole page. Searching more fields is also
        // just better: file name and product slug are things people type.
        const haystack = [
          doc.title,
          doc.productName,
          doc.type,
          doc.product,
          doc.subcategory,
          doc.documentType,
          doc.fileUrl,
        ]
          .filter((v): v is string => typeof v === "string")
          .join(" ")
          .toLowerCase();
        // Every whitespace-separated word must appear somewhere, so
        // "streetbond colour" finds the colour card rather than nothing.
        if (!q.split(/\s+/).filter(Boolean).every((t) => haystack.includes(t))) {
          return false;
        }
      }
      if (featuredOnly && doc.featured !== true) return false;
      if (newOnly && doc.isNew !== true) return false;
      if (activeTab === "By Product" && productFilter !== "all") {
        if (doc.product !== productFilter) return false;
      }
      if (
        activeTab === "By Product" &&
        productFilter === "streetbond" &&
        subcategoryFilter !== "all"
      ) {
        if (doc.subcategory !== subcategoryFilter) return false;
      }
      // Multi-select type filter (applies on both tabs). Empty selection = no
      // type constraint.
      if (selectedTypes.size > 0 && !selectedTypes.has(doc.type)) return false;
      return true;
    });
  }, [documents, debouncedSearch, activeTab, productFilter, subcategoryFilter, selectedTypes, featuredOnly, newOnly]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const hasActiveFilters =
    search !== "" ||
    featuredOnly ||
    newOnly ||
    selectedTypes.size > 0 ||
    (activeTab === "By Product" && productFilter !== "all") ||
    (activeTab === "By Product" && subcategoryFilter !== "all");

  function clearAllFilters() {
    setSearch("");
    setProductFilter("all");
    setSubcategoryFilter("all");
    setSelectedTypes(new Set());
    setFeaturedOnly(false);
    setNewOnly(false);
    setVisibleCount(PAGE_SIZE);
  }

  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    // Keep type + featured selections across tab changes — they're orthogonal
    // to product grouping and users expect their filters to stick.
    setProductFilter("all");
    setSubcategoryFilter("all");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      {/* PDF Preview Modal */}
      {preview && (
        <PdfPreviewModal
          href={preview.href}
          label={preview.label}
          typeLabel={preview.typeLabel}
          productLabel={preview.productLabel}
          onClose={() => setPreview(null)}
        />
      )}

      {/* ── Tab Navigation ───────────────────────────────── */}
      <div id="documents" className="scroll-mt-24 mb-8">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{
                background: activeTab === tab ? "#F97316" : "rgba(255,255,255,0.05)",
                color: activeTab === tab ? "#ffffff" : "#9CA3AF",
                border:
                  activeTab === tab
                    ? "1px solid transparent"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search + Filter Bar ────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#868C98" }}
          />
          <input
            type="text"
            placeholder="Search documents..."
            aria-label="Search documents"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-sm transition-colors outline-none focus:ring-1 focus:ring-[#F97316]/40"
            style={selectStyle}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-zinc-300 transition-colors"
              style={{ color: "#868C98" }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {activeTab === "By Product" && (
          <div className="relative">
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setSubcategoryFilter("all");
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Filter by product"
              className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 rounded-lg text-sm cursor-pointer outline-none focus:ring-1 focus:ring-[#F97316]/40"
              style={selectStyle}
            >
              {PRODUCTS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#868C98" }}
            />
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm transition-colors whitespace-nowrap py-3 px-3 min-h-[44px] hover:text-orange-400"
            style={{ color: "#F97316" }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Filter Chip Row — Surfacing chips + Document-Type (multi-select) ───
            Always visible on both tabs. Counts come from the live document
            set so users see what tapping a chip will actually surface.
            "New Documents" surfaces the Catalogue + 2026 Product Flyers. */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => {
            setNewOnly((v) => !v);
            setVisibleCount(PAGE_SIZE);
          }}
          aria-pressed={newOnly}
          className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full text-sm font-medium transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
          style={
            newOnly
              ? { background: "#F97316", color: "#fff", border: "1px solid transparent" }
              : {
                  background: "rgba(249,115,22,0.08)",
                  color: "#FB923C",
                  border: "1px solid rgba(249,115,22,0.22)",
                }
          }
        >
          <Sparkles
            className="w-3.5 h-3.5"
            fill={newOnly ? "currentColor" : "none"}
            strokeWidth={2}
          />
          <span>New Documents</span>
        </button>
        <button
          onClick={() => {
            setFeaturedOnly((v) => !v);
            setVisibleCount(PAGE_SIZE);
          }}
          aria-pressed={featuredOnly}
          className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full text-sm font-medium transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
          style={
            featuredOnly
              ? { background: "#F97316", color: "#fff", border: "1px solid transparent" }
              : {
                  background: "rgba(255,255,255,0.04)",
                  color: "#9CA3AF",
                  border: "1px solid rgba(255,255,255,0.08)",
                }
          }
        >
          <Star
            className="w-3.5 h-3.5"
            fill={featuredOnly ? "currentColor" : "none"}
            strokeWidth={2}
          />
          <span>Featured</span>
        </button>

        {/* Type chips — multi-select. Tap to add, tap again to remove. */}
        {typeOptions.map((opt) => {
          const active = selectedTypes.has(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggleType(opt.value)}
              aria-pressed={active}
              className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full text-sm font-medium transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
              style={
                active
                  ? { background: "#F97316", color: "#fff", border: "1px solid transparent" }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#D1D5DB",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              <span>{opt.value}</span>
              <span
                className="inline-flex items-center justify-center text-[10px] font-bold rounded-full min-w-[20px] px-1.5 py-0.5"
                style={{
                  background: active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "#9CA3AF",
                }}
              >
                {opt.count}
              </span>
            </button>
          );
        })}

        {selectedTypes.size > 0 && (
          <button
            onClick={() => {
              setSelectedTypes(new Set());
              setVisibleCount(PAGE_SIZE);
            }}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors px-2 min-h-[44px]"
          >
            clear types
          </button>
        )}
      </div>

      {/* ── StreetBond Subcategory Pills ─────────────────── */}
      {activeTab === "By Product" && productFilter === "streetbond" && (
        <div className="flex flex-wrap gap-2 mb-6">
          {STREETBOND_SUBCATEGORIES.map((sc) => (
            <button
              key={sc.value}
              onClick={() => {
                setSubcategoryFilter(sc.value);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-pressed={subcategoryFilter === sc.value}
              className="inline-flex items-center px-3.5 min-h-[36px] rounded-full text-xs font-medium transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
              style={
                subcategoryFilter === sc.value
                  ? { background: "#F97316", color: "#fff", border: "1px solid transparent" }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#D1D5DB",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {sc.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Results count ──────────────────────────────── */}
      <p className="text-sm mb-6" style={{ color: "#868C98" }}>
        {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* ── Document Grid ──────────────────────────────── */}
      {visible.length > 0 ? (
        <>
          {activeTab === "By Product" &&
          productFilter === "all" &&
          selectedTypes.size === 0 &&
          !featuredOnly &&
          !search ? (
            (() => {
              const grouped: Record<string, ResourceDocument[]> = {};
              for (const doc of visible) {
                if (!grouped[doc.productName]) grouped[doc.productName] = [];
                grouped[doc.productName].push(doc);
              }
              return (
                <div className="space-y-12">
                  {Object.entries(grouped).map(([productName, docs]) => (
                    <div key={productName}>
                      <div className="flex items-center gap-4 mb-6">
                        <h3
                          className="text-sm font-bold tracking-widest uppercase"
                          style={{ color: "#F97316" }}
                        >
                          {productName}
                        </h3>
                        <div
                          className="flex-1 h-px"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        />
                        <span className="text-xs" style={{ color: "#868C98" }}>
                          {docs.length} doc{docs.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {docs.map((doc) => (
                          <DocCard
                            key={doc.id}
                            doc={doc}
                            onPreview={setPreview}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((doc) => (
                <DocCard key={doc.id} doc={doc} onPreview={setPreview} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:text-[#F97316] hover:border-[#F97316]/30"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#9CA3AF",
                }}
              >
                Load more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <FileText
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "rgba(255,255,255,0.15)" }}
          />
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#F5F0EB" }}
          >
            No documents found
          </h3>
          <p className="mb-6" style={{ color: "#868C98" }}>
            Try adjusting your filters or search terms
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
              style={{ background: "#F97316", color: "#fff" }}
            >
              Clear all filters
            </button>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:text-white hover:border-white/20"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#9CA3AF" }}
            >
              Can&apos;t find what you need? Contact us &rarr;
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
