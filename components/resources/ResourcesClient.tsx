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

// Badge styles — monochrome, typography-differentiated
function typeBadgeStyle(type: string): React.CSSProperties {
  const isHighlighted = ["Spec Sheet", "Data Sheet", "Brochure", "Safety Data Sheet"].includes(type);
  return {
    color: isHighlighted ? "#f97316" : "rgba(255,255,255,0.4)",
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

function DocCard({ doc }: { doc: ResourceDocument }) {
  return (
    <div
      className="group rounded-xl p-5 flex flex-col justify-between transition-all duration-200"
      style={{
        background: "#1e1e1e",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(249,115,22,0.22)";
        (e.currentTarget as HTMLDivElement).style.background = "#272727";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLDivElement).style.background = "#1e1e1e";
      }}
    >
      <div>
        <span
          className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-4"
          style={typeBadgeStyle(doc.type)}
        >
          {doc.type}
        </span>
        <h3 className="font-semibold leading-snug mb-2" style={{ color: "#F5F0EB" }}>{doc.title}</h3>
        <span
          className="inline-block text-xs px-2 py-0.5 rounded-full"
          style={{ color: "#c96a18", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.12)" }}
        >
          {doc.productName}
        </span>
      </div>
      <div
        className="flex items-center justify-between mt-5 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3 text-xs" style={{ color: "#6B7280" }}>
          <span>{doc.fileSize}</span>
          <span className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          <span>{doc.updatedDate}</span>
        </div>
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-200"
          style={{ background: "rgba(255,255,255,0.08)", color: "#9CA3AF" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#f97316";
            (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLAnchorElement).style.color = "#9CA3AF";
          }}
        >
          <Download className="w-3.5 h-3.5" />
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
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          doc.title.toLowerCase().includes(q) ||
          doc.productName.toLowerCase().includes(q) ||
          doc.type.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (activeTab === "By Product" && productFilter !== "all") {
        if (doc.product !== productFilter) return false;
      }
      if (activeTab === "By Product" && productFilter === "streetbond" && subcategoryFilter !== "all") {
        if (doc.subcategory !== subcategoryFilter) return false;
      }
      if (activeTab === "By Document Type" && docTypeFilter !== "All") {
        if (doc.type !== docTypeFilter) return false;
      }
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
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{
                background: activeTab === tab ? "#F97316" : "rgba(255,255,255,0.05)",
                color: activeTab === tab ? "#ffffff" : "#9CA3AF",
                border: activeTab === tab ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search + Filter Bar ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B7280" }} />
          <input
            type="text"
            placeholder="Search documents..."
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
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-zinc-300 transition-colors"
              style={{ color: "#6B7280" }}
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
              className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 rounded-lg text-sm cursor-pointer outline-none focus:ring-1 focus:ring-[#F97316]/40"
              style={selectStyle}
            >
              {PRODUCTS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#6B7280" }} />
          </div>
        )}

        {activeTab !== "By Document Type" && (
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 rounded-lg text-sm cursor-pointer outline-none focus:ring-1 focus:ring-[#F97316]/40"
              style={selectStyle}
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#6B7280" }} />
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm transition-colors whitespace-nowrap py-3 px-2 hover:text-orange-400"
            style={{ color: "#F97316" }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Document Type Pills ──────────────────────────── */}
      {activeTab === "By Document Type" && (
        <div className="flex flex-wrap gap-2 mb-6">
          {DOCUMENT_TYPE_FILTERS.map((dt) => (
            <button
              key={dt.value}
              onClick={() => {
                setDocTypeFilter(dt.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                docTypeFilter === dt.value
                  ? { background: "#F97316", color: "#fff", border: "1px solid transparent" }
                  : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.08)" }
              }
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
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={
                subcategoryFilter === sc.value
                  ? { background: "#F97316", color: "#fff", border: "1px solid transparent" }
                  : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {sc.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Results count ────────────────────────────────── */}
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
        {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* ── Document Grid ────────────────────────────────── */}
      {visible.length > 0 ? (
        <>
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
                        <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: "#F97316" }}>
                          {productName}
                        </h3>
                        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                        <span className="text-xs" style={{ color: "#6B7280" }}>{docs.length} doc{docs.length !== 1 ? "s" : ""}</span>
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
          <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: "rgba(255,255,255,0.15)" }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#F5F0EB" }}>
            No documents found
          </h3>
          <p className="mb-6" style={{ color: "#6B7280" }}>
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
