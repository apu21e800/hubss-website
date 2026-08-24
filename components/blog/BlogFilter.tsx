"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, ChevronDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import type { PostMeta } from "@/lib/mdx";
import { FIELD_NOTE_TYPES } from "@/lib/field-notes-taxonomy";

interface Props {
  posts: PostMeta[];
  allProducts: string[];
}

/**
 * Field Notes filter.
 *
 * Vernon, Aug 2026: "we just want to improve the filter system." What was
 * wrong with the old one, in the order it mattered:
 *
 *   1. TYPE AND PRODUCT WERE THE SAME CONTROL. Five type pills and four
 *      product pills sat in one undifferentiated row, and picking either one
 *      silently reset the other — so "Guides" and "StreetBond" could never be
 *      asked together, which is the single most useful question on the page.
 *      Type is now the pill row; product is a labelled dropdown; they compose.
 *   2. ONLY FOUR PRODUCTS WERE REACHABLE. `allProducts.slice(0, 4)` truncated
 *      the list to whatever fit, so three systems could not be filtered at all.
 *      The dropdown carries every product, each with its live count.
 *   3. THE COUNT WAS HIDDEN UNTIL YOU FILTERED. A reader landing on 67 posts
 *      saw no number anywhere. It is now always on screen.
 *   4. THE ENTRANCE STAGGER SCALED WITH THE WHOLE LIST. `delay: index * 0.05`
 *      meant the 60th card waited three seconds after entering view; scrolling
 *      at any speed left rows visibly blank, which reads as "there are fewer
 *      posts than it says." The ramp is now capped at six cards.
 */
export default function BlogFilter({ posts, allProducts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch]     = useState(() => searchParams.get("search") ?? "");
  const [product, setProduct]   = useState(() => searchParams.get("product") ?? "all");
  const [category, setCategory] = useState(() => searchParams.get("category") ?? "all");
  const [sort, setSort]         = useState<"newest" | "oldest" | "az">(() => (searchParams.get("sort") as "newest" | "oldest" | "az") ?? "newest");

  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const state = { search, product, category, sort, ...overrides };
      if (state.search)              params.set("search",   state.search);
      if (state.product !== "all")   params.set("product",  state.product);
      if (state.category !== "all")  params.set("category", state.category);
      if (state.sort !== "newest")   params.set("sort",     state.sort);
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    },
    [search, product, category, sort, router]
  );

  useEffect(() => {
    const id = setTimeout(() => pushParams({ search }), 350);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFilters = search !== "" || product !== "all" || category !== "all" || sort !== "newest";

  function clearFilters() {
    setSearch(""); setProduct("all"); setCategory("all"); setSort("newest");
    router.replace("/blog", { scroll: false });
  }

  /** Type counts respect the active product, so the pills never promise rows
      that a combined filter would not return. */
  const byProduct = useMemo(
    () => (product === "all" ? posts : posts.filter((p) => p.products.includes(product))),
    [posts, product]
  );

  const productOptions = useMemo(
    () =>
      allProducts
        .map((name) => ({ name, count: posts.filter((p) => p.products.includes(name)).length }))
        .filter((p) => p.count > 0),
    [allProducts, posts]
  );

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    }
    if (product !== "all")  result = result.filter((p) => p.products.includes(product));
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (sort === "oldest")  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [posts, search, product, category, sort]);

  const activeType = FIELD_NOTE_TYPES.find((t) => t.label === category);

  const Pill = ({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="text-[13px] font-semibold px-3.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5"
      style={{
        background:  active ? "#f97316" : "var(--bg-card-neutral)",
        color:       active ? "#fff"    : "#9aa0a8",
        border:      "1px solid",
        borderColor: active ? "#f97316" : "rgba(255,255,255,0.09)",
        minHeight:   "40px",
      }}
    >
      {label}
      {count !== undefined && (
        <span
          className="text-[11px] font-bold tabular-nums px-1.5 rounded-full"
          style={{
            background: active ? "rgba(0,0,0,0.18)" : "var(--border-color)",
            color:      active ? "rgba(255,255,255,0.9)" : "#6f757d",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );

  const selectStyle = {
    background: "var(--bg-card-neutral)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#c8cdd3",
    minHeight: "44px",
  } as const;

  return (
    <>
      <div className="mb-8">
        {/* ── Type — the primary axis ─────────────────────────── */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:overflow-visible scrollbar-none"
          style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <Pill label="All" count={byProduct.length} active={category === "all"} onClick={() => { setCategory("all"); pushParams({ category: "all" }); }} />
          {FIELD_NOTE_TYPES.map((t) => {
            const n = byProduct.filter((p) => p.category === t.label).length;
            if (n === 0 && category !== t.label) return null;
            return (
              <Pill
                key={t.label}
                label={t.plural}
                count={n}
                active={category === t.label}
                onClick={() => { setCategory(t.label); pushParams({ category: t.label }); }}
              />
            );
          })}
        </div>

        {/* ── Search · product · sort ─────────────────────────── */}
        <div className="flex flex-wrap gap-2.5 mt-3">
          <div className="relative flex-1 min-w-[190px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#6f757d" }} />
            <input
              type="text"
              placeholder="Search field notes…"
              aria-label="Search field notes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 rounded-lg text-sm"
              style={{ ...selectStyle, color: "#ffffff" }}
            />
            {search && (
              <button
                onClick={() => { setSearch(""); pushParams({ search: "" }); }}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded"
                style={{ width: 32, height: 32, color: "#6f757d" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Product is its own axis, not another pill. Every system is here —
              the old row showed the top four and dropped the rest. */}
          <div className="relative">
            <select
              value={product}
              onChange={(e) => { setProduct(e.target.value); pushParams({ product: e.target.value }); }}
              aria-label="Filter by product system"
              className="appearance-none pl-3 pr-8 rounded-lg text-sm cursor-pointer w-full"
              style={selectStyle}
            >
              <option value="all">All systems</option>
              {productOptions.map((p) => (
                <option key={p.name} value={p.name}>{p.name} ({p.count})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#6f757d" }} />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as typeof sort); pushParams({ sort: e.target.value }); }}
              aria-label="Sort field notes"
              className="appearance-none pl-3 pr-8 rounded-lg text-sm cursor-pointer w-full"
              style={selectStyle}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A – Z</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#6f757d" }} />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold px-3.5 rounded-lg inline-flex items-center"
              style={{ color: "#f97316", minHeight: "44px" }}
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Always-on result line ───────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3.5">
          <p className="text-xs tabular-nums" style={{ color: "#6f757d" }} aria-live="polite">
            {filtered.length === posts.length
              ? `All ${posts.length} field notes`
              : `${filtered.length} of ${posts.length} field notes`}
          </p>

          {/* The type hubs are real indexed pages. Rather than advertising all
              five at the top of the page, the one you asked for is offered
              once you have asked for it. */}
          {activeType && (
            <Link
              href={`/blog/${activeType.slug}`}
              className="text-xs font-semibold inline-flex items-center gap-1 transition-colors hover:brightness-125"
              style={{ color: activeType.text }}
            >
              Open the {activeType.plural} page
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              // Ramp capped at six. The delay used to be index * 0.05 against
              // the whole list, so the sixtieth card sat invisible for three
              // seconds after scrolling into view.
              transition={{ duration: 0.35, delay: Math.min(index % 6, 5) * 0.04 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No field notes match those filters</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Try a different system, or clear the filters to see all {posts.length}.</p>
          <button
            onClick={clearFilters}
            className="text-sm font-semibold px-5 rounded-lg inline-flex items-center"
            style={{ background: "#f97316", color: "#fff", minHeight: "44px" }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
