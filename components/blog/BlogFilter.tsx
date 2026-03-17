"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ChevronDown } from "lucide-react";
import BlogCard from "./BlogCard";
import type { PostMeta, PostCategory } from "@/lib/mdx";

const CATEGORIES: PostCategory[] = ["Blog", "Case Study", "Project Profile", "White Paper"];

interface Props {
  posts: PostMeta[];
  allProducts: string[];
}

export default function BlogFilter({ posts, allProducts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch]     = useState(() => searchParams.get("search") ?? "");
  const [category, setCategory] = useState<PostCategory | "all">(() => (searchParams.get("category") as PostCategory) ?? "all");
  const [product, setProduct]   = useState(() => searchParams.get("product") ?? "all");
  const [sort, setSort]         = useState<"newest" | "oldest" | "az">(() => (searchParams.get("sort") as "newest" | "oldest" | "az") ?? "newest");

  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const state = { search, category, product, sort, ...overrides };
      if (state.search)           params.set("search",   state.search);
      if (state.category !== "all") params.set("category", state.category);
      if (state.product !== "all")  params.set("product",  state.product);
      if (state.sort !== "newest")  params.set("sort",     state.sort);
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    },
    [search, category, product, sort, router]
  );

  useEffect(() => {
    const id = setTimeout(() => pushParams({ search }), 350);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  function setAndSync<T extends string>(setter: (v: T) => void, key: string, value: T) {
    setter(value);
    pushParams({ [key]: value });
  }

  const hasFilters = search !== "" || category !== "all" || product !== "all" || sort !== "newest";

  function clearFilters() {
    setSearch(""); setCategory("all"); setProduct("all"); setSort("newest");
    router.replace("/blog", { scroll: false });
  }

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (product !== "all")  result = result.filter((p) => p.products.includes(product));
    if (sort === "oldest") result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [posts, search, category, product, sort]);

  // Filter button — matches projects page style exactly
  const Btn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="text-xs font-semibold px-4 py-2 rounded transition-all"
      style={{
        background:   active ? "#f97316" : "var(--bg-card-surface)",
        color:        active ? "#fff"    : "var(--text-secondary)",
        border:       "1px solid",
        borderColor:  active ? "#f97316" : "var(--border-subtle)",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* ── Filter row ──────────────────────────────────── */}
      <div className="space-y-3 mb-10">
        {/* Category + product pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Btn label="All" active={category === "all" && product === "all"} onClick={() => { setAndSync(setCategory, "category", "all"); setAndSync(setProduct, "product", "all"); }} />

          <span className="text-xs px-2" style={{ color: "#444" }}>Type:</span>
          {CATEGORIES.map((cat) => (
            <Btn key={cat} label={cat} active={category === cat} onClick={() => setAndSync(setCategory, "category", cat)} />
          ))}

          <span className="text-xs px-2" style={{ color: "#444" }}>Product:</span>
          {allProducts.map((p) => (
            <Btn key={p} label={p} active={product === p} onClick={() => setAndSync(setProduct, "product", p)} />
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-7 py-2 rounded text-xs"
              style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
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
              style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A – Z</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 pointer-events-none" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
