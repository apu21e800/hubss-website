"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import BlogCard from "./BlogCard";
import type { PostMeta, PostCategory } from "@/lib/mdx";

const CATEGORIES: PostCategory[] = ["Blog", "Case Study", "Project Profile", "White Paper"];

const CATEGORY_PILL: Record<PostCategory, string> = {
  "Blog":            "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Case Study":      "bg-teal-500/15 text-teal-400 border-teal-500/20",
  "Project Profile": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "White Paper":     "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

const CATEGORY_ACTIVE: Record<PostCategory, string> = {
  "Blog":            "bg-orange-500 text-white border-orange-500",
  "Case Study":      "bg-teal-500 text-white border-teal-500",
  "Project Profile": "bg-purple-500 text-white border-purple-500",
  "White Paper":     "bg-blue-500 text-white border-blue-500",
};

const FALLBACKS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&q=80",
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1400&q=80",
];

interface Props {
  posts: PostMeta[];
  allProducts: string[];
}

export default function BlogFilter({ posts, allProducts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [category, setCategory] = useState<PostCategory | "all">(
    () => (searchParams.get("category") as PostCategory) ?? "all"
  );
  const [product, setProduct] = useState(() => searchParams.get("product") ?? "all");
  const [sort, setSort] = useState<"newest" | "oldest" | "az">(
    () => (searchParams.get("sort") as "newest" | "oldest" | "az") ?? "newest"
  );

  // Sync state → URL (debounced for search)
  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const state = { search, category, product, sort, ...overrides };
      if (state.search) params.set("search", state.search);
      if (state.category !== "all") params.set("category", state.category);
      if (state.product !== "all") params.set("product", state.product);
      if (state.sort !== "newest") params.set("sort", state.sort);
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    },
    [search, category, product, sort, router]
  );

  // Debounce search param sync
  useEffect(() => {
    const id = setTimeout(() => pushParams({ search }), 350);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  function setAndSync<T extends string>(
    setter: (v: T) => void,
    key: string,
    value: T
  ) {
    setter(value);
    pushParams({ [key]: value });
  }

  const hasFilters = search !== "" || category !== "all" || product !== "all" || sort !== "newest";

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setProduct("all");
    setSort("newest");
    router.replace("/blog", { scroll: false });
  }

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...posts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }
    if (product !== "all") {
      result = result.filter((p) => p.products.includes(product));
    }
    if (sort === "oldest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    // "newest" is already default sort from getAllPosts

    return result;
  }, [posts, search, category, product, sort]);

  const isFiltering = hasFilters;
  const featured = !isFiltering && filtered.length > 0 ? filtered[0] : null;
  const grid = !isFiltering ? filtered.slice(1) : filtered;

  return (
    <>
      {/* ── Filter Bar ────────────────────────────────────── */}
      <div className="mb-10 space-y-4">
        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAndSync(setCategory, "category", "all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              category === "all"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                : "border-zinc-700 text-gray-400 hover:border-zinc-600 hover:text-gray-200"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setAndSync(setCategory, "category", cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                category === cat
                  ? CATEGORY_ACTIVE[cat]
                  : `${CATEGORY_PILL[cat]} hover:opacity-80`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search + dropdowns row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-[#f5f0eb] placeholder-gray-600 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-colors"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); pushParams({ search: "" }); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Product dropdown */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            <select
              value={product}
              onChange={(e) => setAndSync(setProduct, "product", e.target.value)}
              className="appearance-none w-full sm:w-52 pl-8 pr-8 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-[#f5f0eb] focus:outline-none focus:border-orange-500/40 transition-colors cursor-pointer"
            >
              <option value="all">All Products</option>
              {allProducts.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setAndSync(setSort, "sort", e.target.value as typeof sort)}
              className="appearance-none w-full sm:w-44 px-3 pr-8 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-[#f5f0eb] focus:outline-none focus:border-orange-500/40 transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A – Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors whitespace-nowrap py-2.5 px-1"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results count when filtering */}
        {isFiltering && (
          <p className="text-sm text-gray-600">
            {filtered.length} post{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* ── Featured hero (only when not filtering) ───────── */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group relative block w-full rounded-2xl overflow-hidden mb-12 aspect-[21/9] min-h-[300px]"
        >
          <Image
            src={featured.featuredImage ?? FALLBACKS[0]}
            alt={featured.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            priority
            sizes="100vw"
            unoptimized={!featured.featuredImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          {/* Category badge */}
          {featured.category && (
            <div className="absolute top-5 left-5">
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md border backdrop-blur-sm ${CATEGORY_PILL[featured.category]}`}>
                {featured.category}
              </span>
            </div>
          )}
          <div className="absolute inset-0 flex items-end p-8 md:p-12">
            <div className="max-w-2xl">
              <p className="text-xs text-gray-400 mb-3 tracking-wide">
                {new Date(featured.date).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
                {" · "}
                {featured.readTime}
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-orange-100 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-lg">
                {featured.excerpt}
              </p>
              {featured.products.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {featured.products.slice(0, 3).map((p) => (
                    <span key={p} className="text-[10px] text-orange-300/70 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/15">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* ── Grid ──────────────────────────────────────────── */}
      {grid.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grid.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* ── Empty State ──────────────────────────────────── */
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Search className="w-5 h-5 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-[#f5f0eb] mb-2">No posts match your filters</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or selecting a different category.</p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
          >
            Clear all filters
          </button>
        </div>
      ) : null}
    </>
  );
}
