"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";

interface SearchResult {
  label: string;
  slug: string;
  type: "product" | "application";
}

const allItems: SearchResult[] = [
  ...products
    .filter((p) => !(p as { comingSoon?: boolean }).comingSoon)
    .map((p) => ({ label: p.name, slug: p.slug, type: "product" as const })),
  ...applications.map((a) => ({
    label: a.name,
    slug: a.slug,
    type: "application" as const,
  })),
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const results =
    query.length > 1
      ? allItems.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  function go(item: SearchResult) {
    setQuery("");
    setOpen(false);
    router.push(
      item.type === "product"
        ? `/products/${item.slug}`
        : `/applications/${item.slug}`
    );
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md mt-6 sm:mt-8">
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/80 backdrop-blur focus-within:border-orange-500 transition-colors">
        {/* Search icon */}
        <svg
          className="w-4 h-4 flex-shrink-0 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          placeholder='Search products &amp; applications (e.g. "XD", "bike lane")'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none min-w-0"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden z-50">
          {results.map((item) => (
            <button
              key={`${item.type}-${item.slug}`}
              onClick={() => go(item)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800 transition-colors group"
            >
              <span
                className="text-[10px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded flex-shrink-0"
                style={{
                  background:
                    item.type === "product"
                      ? "rgba(249,115,22,0.15)"
                      : "rgba(59,130,246,0.15)",
                  color:
                    item.type === "product" ? "#f97316" : "#60a5fa",
                }}
              >
                {item.type}
              </span>
              <span className="text-sm text-zinc-200 group-hover:text-white transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && query.length > 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl z-50 px-4 py-3">
          <p className="text-sm text-zinc-500">
            No results for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
