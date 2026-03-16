"use client";

import { useState, useMemo } from "react";
import { FileText, Download, Search, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ResourceDocument } from "@/lib/resource-documents";

const APPLICATION_FILTERS = [
  { label: "All", value: "all" },
  { label: "Crosswalks", value: "crosswalks" },
  { label: "Bike & Bus Lanes", value: "bike-bus-lanes" },
  { label: "Parking Lots", value: "parking-lots" },
  { label: "Parks & Paths", value: "parks-paths" },
  { label: "Community Branding", value: "community-branding" },
  { label: "Airports", value: "airports" },
  { label: "Driveways", value: "driveways" },
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
  { label: "MMAX", value: "mmax" },
  { label: "DecoMark", value: "decomark" },
  { label: "DuraShield", value: "durashield" },
  { label: "PreMark", value: "premark" },
  { label: "DuraTherm", value: "duratherm" },
  { label: "AirMark", value: "airmark" },
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

export default function ResourcesClient({
  documents,
}: {
  documents: ResourceDocument[];
}) {
  const [search, setSearch] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("All");
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
      // Application pill
      if (applicationFilter !== "all") {
        if (!doc.applications.includes(applicationFilter)) return false;
      }
      // Product dropdown
      if (productFilter !== "all") {
        if (doc.product !== productFilter) return false;
      }
      // Type dropdown
      if (typeFilter !== "All") {
        if (doc.type !== typeFilter) return false;
      }
      return true;
    });
  }, [documents, search, applicationFilter, productFilter, typeFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const hasActiveFilters =
    search !== "" ||
    applicationFilter !== "all" ||
    productFilter !== "all" ||
    typeFilter !== "All";

  function clearAllFilters() {
    setSearch("");
    setApplicationFilter("all");
    setProductFilter("all");
    setTypeFilter("All");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      {/* ── Application Filter Pills ─────────────────────── */}
      <div id="documents" className="flex flex-wrap gap-2 mb-8 scroll-mt-24">
        {APPLICATION_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => {
              setApplicationFilter(filter.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              applicationFilter === filter.value
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-[0_0_16px_rgba(249,115,22,0.25)]"
                : "border-zinc-700 text-gray-400 hover:border-orange-400/50 hover:text-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* ── Search + Filter Bar ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[#f5f0eb] placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 transition-colors text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Product dropdown */}
        <div className="relative">
          <select
            value={productFilter}
            onChange={(e) => {
              setProductFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 rounded-lg bg-zinc-900 border border-zinc-800 text-[#f5f0eb] text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 transition-colors cursor-pointer"
          >
            {PRODUCTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Type dropdown */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 rounded-lg bg-zinc-900 border border-zinc-800 text-[#f5f0eb] text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 transition-colors cursor-pointer"
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Types" : t}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-400 hover:text-orange-300 transition-colors whitespace-nowrap py-3 px-2"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Results count ────────────────────────────────── */}
      <p className="text-sm text-gray-500 mb-6">
        {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* ── Document Grid ────────────────────────────────── */}
      {visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((doc) => (
              <div
                key={doc.id}
                className="group rounded-xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-between transition-all duration-300 hover:border-orange-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)] hover:-translate-y-0.5"
              >
                <div>
                  {/* Type badge */}
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md border mb-4 ${typeBadgeClasses(doc.type)}`}
                  >
                    {doc.type}
                  </span>

                  {/* Title */}
                  <h3 className="font-medium text-[#f5f0eb] leading-snug mb-2">
                    {doc.title}
                  </h3>

                  {/* Product pill */}
                  <span className="inline-block text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    {doc.productName}
                  </span>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{doc.fileSize}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span>{doc.updatedDate}</span>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-orange-400 transition-colors group/btn"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-8 py-3 rounded-lg text-sm font-medium border border-zinc-700 text-gray-300 hover:border-orange-400/50 hover:text-orange-400 transition-all duration-200"
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
          <h3 className="text-xl font-semibold text-[#f5f0eb] mb-2">
            No documents found
          </h3>
          <p className="text-gray-500 mb-6">
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
              className="px-6 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 text-gray-300 hover:border-orange-400/50 hover:text-orange-400 transition-all"
            >
              Can&apos;t find what you need? Contact us &rarr;
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
