"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ChevronDown } from "lucide-react";
import BlogCard from "./BlogCard";
import type { PostMeta } from "@/lib/mdx";

interface Props {
  posts: PostMeta[];
  allProducts: string[];
}

export default function BlogFilter({ posts, allProducts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch]     = useState(() => searchParams.get("search") ?? "");
  const [product, setProduct]   = useState(() => searchParams.get("product") ?? "all");
  const [sort, setSort]         = useState<"newest" | "oldest" | "az">(() => (searchParams.get("sort") as "newest" | "oldest" | "az") ?? "newest");

  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const state = { search, product, sort, ...overrides };
      if (state.search)            params.set("search",   state.search);
      if (state.product !== "all") params.set("product",  state.product);
      if (state.sort !== "newest") params.set("sort",     state.sort);
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    },
    [search, product, sort, router]
  );

  useEffect(() => {
    const id = setTimeout(() => pushParams({ search }), 350);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  function setAndSync<T extends string>(setter: (v: T) => void, key: string, value: T) {
    setter(value);
    pushParams({ [key]: value });
  }

  const hasFilters = search !== "" || product !== "all" || sort !== "newest";

  function clearFilters() {
    setSearch(""); setProduct("all"); setSort("newest");
    router.replace("/blog", { scroll: false });
  }

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    if (product !== "all")  result = result.filter((p) => p.products.includes(product));
    if (sort === "oldest") result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [posts, search, product, sort]);

  // Filter button — matches projects page style exactly
  const Btn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="text-xs font-semibold px-4 py-2 rounded transition-all"
      style={{
        background:   active ? "#f97316" : "#1a1e28",
        color:        active ? "#fff"    : "#8b8b8b",
        border:       "1px solid",
        borderColor:  active ? "#f97316" : "rgba(255,255,255,0.07)",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* ── Filter row ──────────────────────────────────── */}
      <div className="space-y-3 mb-10">
        {/* Category + product pills — horizontal scroll on mobile, wraps on larger screens */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible scrollbar-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <Btn label="All" active={product === "all"} onClick={() => setAndSync(setProduct, "product", "all")} />

          <span className="text-xs px-2" style={{ color: "#444" }}>Product:</span>
          {allProducts.map((p) => (
            <Btn key={p} label={p} active={product === p} onClick={() => setAndSync(setProduct, "product", p)} />
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#5a5a5a" }} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-7 py-2 rounded text-xs"
              style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)", color: "#ffffff" }}
            />
            {search && (
              <button onClick={() => { setSearch(""); pushParams({ search: "" }); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setAndSync(setSort, "sort", e.target.value as typeof sort)}
              className="appearance-none pl-3 pr-7 py-2 rounded text-xs cursor-pointer"
              style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)", color: "#8b8b8b" }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A – Z</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: "#5a5a5a" }} />
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs px-3 py-2 rounded" style={{ color: "#f97316" }}>
              Clear
            </button>
          )}
        </div>

        {hasFilters && (
          <p className="text-xs" style={{ color: "#555" }}>
            {filtered.length} post{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ── Grid ──────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No posts match your filters</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Try adjusting your search or filters.</p>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold px-5 py-2.5 rounded"
            style={{ background: "#f97316", color: "#fff" }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
