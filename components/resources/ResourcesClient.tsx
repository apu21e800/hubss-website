"use client";

import { useState, useMemo } from "react";
import { FileText, Download, Search, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ResourceDocument } from "@/lib/resource-documents";

const TABS = ["By Product", "By Document Type"] as const;
type TabType = (typeof TABS)[number];

const DOCUMENT_TYPE_FILTERS = [
  { label: "All", value: "All" },
  { label: "Case Study", value: "Case Study" },
  { label: "White Paper", value: "White Paper" },
  { label: "Technical Data Sheet", value: "Data Sheet" },
  { label: "Installation Guide", value: "Installation Guide" },
];

const DOCUMENT_TYPES = [
  "All",
  "Spec Sheet",
  "Data Sheet",
  "Brochure",
  "Installation Guide",
  "Design Manual",
  "Colour Guide",
  "Safety Data Sheet",
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

// Badge colors by document type
function typeBadgeClasses(type: string): string {
  switch (type) {
    case "Spec Sheet":
      return "bg-blue-500/15 text-blue-400 border-blue-500/20";
    case "Data Sheet":
      return "bg-blue-500/15 text-blue-400 border-blue-500/20";
    case "Safety Data Sheet":
      return "bg-red-500/15 text-red-400 border-red-500/20";
    case "Brochure":
      return "bg-orange-500/15 text-orange-400 border-orange-500/20";
    case "Installation Guide":
      return "bg-teal-500/15 text-teal-400 border-teal-500/20";
    case "Design Manual":
      return "bg-purple-500/15 text-purple-400 border-purple-500/20";
    case "Colour Guide":
      return "bg-pink-500/15 text-pink-400 border-pink-500/20";
    case "Certificate":
      return "bg-green-500/15 text-green-400 border-green-500/20";
    case "Guide":
      return "bg-teal-500/15 text-teal-400 border-teal-500/20";
    default:
      return "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
  }
}

const PAGE_SIZE = 12;

function DocCard({ doc }: { doc: ResourceDocument }) {
  return (
    <div className="group rounded-xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-between transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800">
      <div>
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md border mb-4 ${typeBadgeClasses(doc.type)}`}>
          {doc.type}
        </span>
        <h3 className="font-semibold text-white leading-snug mb-2">{doc.title}</h3>
        <span className="inline-block text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
          {doc.productName}
        </span>
      </div>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-700">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>{doc.fileSize}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span>{doc.updatedDate}</span>
        </div>
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-orange-400 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </a>
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
  const [activeTab, setActiveTab] = useState<TabType>("By Product");
  const [productFilter, setProductFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("All");
  const [docTypeFilter, setDocTypeFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          doc.title.toLowerCase().includes(q) ||
          doc.productName.toLowerCase().includes(q) ||
          doc.type.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      // Product filter (only when "By Product" tab is active)
      if (activeTab === "By Product" && productFilter !== "all") {
        if (doc.product !== productFilter) return false;
      }
      // StreetBond subcategory filter
      if (activeTab === "By Product" && productFilter === "streetbond" && subcategoryFilter !== "all") {
        if (doc.subcategory !== subcategoryFilter) return false;
      }
      // Document type tab filter
      if (activeTab === "By Document Type" && docTypeFilter !== "All") {
        if (doc.type !== docTypeFilter) return false;
      }
      // Type dropdown (always active)
      if (activeTab !== "By Document Type" && typeFilter !== "All") {
        if (doc.type !== typeFilter) return false;
      }
      return true;
    });
  }, [documents, search, activeTab, productFilter, subcategoryFilter, typeFilter, docTypeFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const hasActiveFilters =
    search !== "" ||
    (activeTab === "By Product" && productFilter !== "all") ||
    (activeTab === "By Product" && subcategoryFilter !== "all") ||
    (activeTab === "By Document Type" && docTypeFilter !== "All") ||
    (activeTab !== "By Document Type" && typeFilter !== "All");

  function clearAllFilters() {
    setSearch("");
    setProductFilter("all");
    setSubcategoryFilter("all");
    setTypeFilter("All");
    setDocTypeFilter("All");
    setVisibleCount(PAGE_SIZE);
  }

  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    setProductFilter("all");
    setSubcategoryFilter("all");
    setTypeFilter("All");
    setDocTypeFilter("All");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      {/* ── Tab Navigation ─────────────────────────────────── */}
      <div id="documents" className="scroll-mt-24 mb-8">
        <div className="flex gap-8 border-b border-zinc-700">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-white border-b-2 border-orange-500 -mb-px"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search + Filter Bar ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Product dropdown — show when "By Product" tab is active */}
        {activeTab === "By Product" && (
          <div className="relative">
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setSubcategoryFilter("all");
                setVisibleCount(PAGE_SIZE);
              }}
              className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors cursor-pointer"
            >
              {PRODUCTS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        )}

        {/* Type dropdown — show when NOT on "By Document Type" tab */}
        {activeTab !== "By Document Type" && (
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors cursor-pointer"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        )}

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-500 hover:text-orange-600 transition-colors whitespace-nowrap py-3 px-2"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Document Type Pills — show when "By Document Type" tab is active ── */}
      {activeTab === "By Document Type" && (
        <div className="flex flex-wrap gap-2 mb-6">
          {DOCUMENT_TYPE_FILTERS.map((dt) => (
            <button
              key={dt.value}
              onClick={() => {
                setDocTypeFilter(dt.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                docTypeFilter === dt.value
                  ? "bg-orange-500 text-white border-transparent"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-orange-400 hover:text-orange-400"
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>
      )}

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
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                subcategoryFilter === sc.value
                  ? "bg-orange-500 text-white border-transparent"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-orange-400 hover:text-orange-400"
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Results count ────────────────────────────────── */}
      <p className="text-sm text-zinc-400 mb-6">
        {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* ── Document Grid ────────────────────────────────── */}
      {visible.length > 0 ? (
        <>
          {/* Group by product when By Product tab + no product selected + no type filter */}
          {activeTab === "By Product" && productFilter === "all" && typeFilter === "All" && !search ? (
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
                          className="text-sm font-bold tracking-widest uppercase grad-text"
                        >
                          {productName}
                        </h3>
                        <div className="flex-1 h-px bg-zinc-800" />
                        <span className="text-xs text-zinc-500">{docs.length} doc{docs.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {docs.map((doc) => (
                          <DocCard key={doc.id} doc={doc} />
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
                <DocCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-8 py-3 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-orange-400 transition-all duration-200"
              >
                Load more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        /* ── Empty State ──────────────────────────────────── */
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            No documents found
          </h3>
          <p className="text-gray-300 mb-6">
            Try adjusting your filters or search terms
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
            >
              Clear all filters
            </button>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-lg text-sm font-medium border border-[var(--border-color)] text-gray-300 hover:border-orange-400/50 hover:text-orange-400 transition-all"
            >
              Can&apos;t find what you need? Contact us &rarr;
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
