"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, ChevronDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import LunchLearnTile from "./LunchLearnTile";
import type { PostMeta } from "@/lib/blog";
import { INSIGHTS_SECTIONS, SECTION_BY_KEY, TYPE_BY_LABEL, sectionFor, type FieldNoteType, type InsightsSectionKey } from "@/lib/field-notes-taxonomy";

interface Props {
  posts: PostMeta[];
  allProducts: string[];
}

/** Cards shown before the first "Load more": eight rows of three. */
const PAGE = 24;

/**
 * The section in the address. ?section=projects since 28 Sep 2026; links from
 * before then carry a stored type (?category=Case Study), which still lands
 * on the section that lists it.
 */
function sectionFromParams(params: URLSearchParams): InsightsSectionKey | "all" {
  const s = params.get("section");
  if (s && s in SECTION_BY_KEY) return s as InsightsSectionKey;
  const legacy = params.get("category");
  if (legacy && TYPE_BY_LABEL[legacy as FieldNoteType]) return sectionFor(legacy).key;
  return "all";
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
 *
 * 28 Sep 2026: the five type pills became the three sections (Projects,
 * Guides, Articles; lib/field-notes-taxonomy.ts), and the count line says
 * "posts", so it can't be read as the Articles section's count (QA rest#39).
 */
export default function BlogFilter({ posts, allProducts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch]     = useState(() => searchParams.get("search") ?? "");
  const [product, setProduct]   = useState(() => searchParams.get("product") ?? "all");
  const [section, setSection]   = useState<InsightsSectionKey | "all">(() => sectionFromParams(searchParams));
  const [sort, setSort]         = useState<"newest" | "oldest" | "az">(() => (searchParams.get("sort") as "newest" | "oldest" | "az") ?? "newest");
  // The first PAGE cards, then "Load more" (QA D9, 30 Sep 2026: all 73 posts
  // rendered on one 35,000px page). The same control as /resources; the
  // count starts over whenever a filter changes.
  const [visible, setVisible]   = useState(PAGE);
  useEffect(() => { setVisible(PAGE); }, [search, product, section, sort]);

  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const state = { search, product, section, sort, ...overrides };
      if (state.search)              params.set("search",   state.search);
      if (state.product !== "all")   params.set("product",  state.product);
      if (state.section !== "all")   params.set("section",  state.section);
      if (state.sort !== "newest")   params.set("sort",     state.sort);
      const qs = params.toString();
      router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    },
    [search, product, section, sort, router]
  );

  useEffect(() => {
    const id = setTimeout(() => pushParams({ search }), 350);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFilters = search !== "" || product !== "all" || section !== "all" || sort !== "newest";

  function clearFilters() {
    setSearch(""); setProduct("all"); setSection("all"); setSort("newest");
    router.replace("/blog", { scroll: false });
  }

  const inSection = (p: PostMeta, key: InsightsSectionKey) => sectionFor(p.category).key === key;

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
    if (section !== "all")  result = result.filter((p) => inSection(p, section));
    if (sort === "oldest")  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [posts, search, product, section, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeSection = section === "all" ? undefined : SECTION_BY_KEY[section];

  const Pill = ({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="text-[13px] font-semibold px-3.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5"
      /* Active used to be a solid #F97316 fill with white type. On charcoal
         that reads as an accent; on paper it is the loudest thing on the page
         by some distance — Vern, 21 Sep: "too loud". Softened to the same
         treatment the category chips on the cards below already use, and which
         nobody has complained about: an orange wash with orange type. Still
         unmistakably the selected one, because it is the only coloured chip in
         a row of neutral ones — the signal is hue, not volume.

         The wash is an alpha, so it tints whatever surface it lands on and
         works unchanged in all three themes; --accent-text carries #FB923C on
         dark and #B83E0B on paper. */
      style={{
        background:  active ? "rgba(249,115,22,0.14)" : "var(--bg-card)",
        color:       active ? "var(--accent-text)" : "var(--text-body)",
        border:      "1px solid",
        borderColor: active ? "rgba(249,115,22,0.38)" : "var(--ink-12)",
        minHeight:   "44px",
      }}
    >
      {label}
      {/* The counts from sm up: without them the four pills fit a phone's
          width, where the line under the filters gives the total. */}
      {count !== undefined && (
        <span
          className="hidden sm:inline text-[11px] font-bold tabular-nums px-1.5 rounded-full"
          style={{
            background: active ? "rgba(249,115,22,0.18)" : "var(--ink-06)",
            color:      active ? "var(--accent-text)" : "var(--text-secondary)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );

  // The text was #c8cdd3, a grey picked for charcoal: on paper "All systems"
  // and "Newest first" were near invisible. The tokens read on both.
  const selectStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--ink-12)",
    color: "var(--text-body)",
    minHeight: "44px",
  } as const;

  return (
    <>
      <div className="mb-8">
        {/* ── Type — the primary axis  */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:overflow-visible scrollbar-none"
          style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <Pill label="All" count={byProduct.length} active={section === "all"} onClick={() => { setSection("all"); pushParams({ section: "all" }); }} />
          {INSIGHTS_SECTIONS.map((s) => {
            const n = byProduct.filter((p) => inSection(p, s.key)).length;
            if (n === 0 && section !== s.key) return null;
            return (
              <Pill
                key={s.key}
                label={s.plural}
                count={n}
                active={section === s.key}
                onClick={() => { setSection(s.key); pushParams({ section: s.key }); }}
              />
            );
          })}
        </div>

        {/* ── Search · product · sort  */}
        <div className="flex flex-wrap gap-2.5 mt-3">
          <div className="relative flex-1 min-w-[190px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-hint)" }} />
            <input
              type="text"
              placeholder="Search Insights…"
              aria-label="Search Insights"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-11 rounded-lg text-sm"
              style={{ ...selectStyle, color: "var(--text-primary)" }}
            />
            {search && (
              <button
                onClick={() => { setSearch(""); pushParams({ search: "" }); }}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center rounded"
                style={{ width: 44, height: 44, color: "var(--text-hint)" }}
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
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--text-hint)" }} />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as typeof sort); pushParams({ sort: e.target.value }); }}
              aria-label="Sort Insights"
              className="appearance-none pl-3 pr-8 rounded-lg text-sm cursor-pointer w-full"
              style={selectStyle}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A–Z</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--text-hint)" }} />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold px-3.5 rounded-lg inline-flex items-center"
              style={{ color: "var(--accent-text-lg)", minHeight: "44px" }}
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Always-on result line  */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3.5">
          <p className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }} aria-live="polite">
            {filtered.length === posts.length
              ? `All ${posts.length} posts`
              : `${filtered.length} of ${posts.length} posts`}
          </p>

          {/* The section pages are real indexed pages. Rather than advertising
              all three at the top of the page, the one you asked for is
              offered once you have asked for it. */}
          {activeSection && (
            <Link
              href={`/blog/${activeSection.slug}`}
              className="text-xs font-semibold inline-flex items-center gap-1 transition-colors hover:brightness-125"
              style={{ color: "var(--accent-text)", minHeight: 44 }}
            >
              Open the {activeSection.plural} page
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Grid  */}
      {filtered.length > 0 ? (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, visible).map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              // Ramp capped at six. The delay used to be index * 0.05 against
              // the whole list, so the sixtieth card sat invisible for three
              // seconds after scrolling into view.
              transition={{ duration: 0.35, delay: Math.min(index % 6, 5) * 0.04 }}
              className="h-full"
            >
              <BlogCard post={post} priority={index < 3} />
            </motion.div>
          ))}
          {/* Fills the last row, if it has a gap, with the Lunch & Learn;
              with a system chosen, a session on that system. */}
          <LunchLearnTile count={Math.min(visible, filtered.length)} topic={product !== "all" ? product : undefined} />
        </div>
        {filtered.length > visible && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:text-[var(--accent-text-lg)] hover:border-[#F97316]/30"
              style={{ background: "transparent", border: "1px solid var(--ink-12)", color: "var(--text-muted)", minHeight: 44 }}
            >
              Load more ({filtered.length - visible} remaining)
            </button>
          </div>
        )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No posts match those filters</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Try a different system, or clear the filters to see all {posts.length}.</p>
          <button
            onClick={clearFilters}
            className="text-sm font-semibold px-5 rounded-lg inline-flex items-center"
            style={{ background: "#f97316", color: "var(--on-accent)", minHeight: "44px" }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
