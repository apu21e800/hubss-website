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
  /**
   * The posts the front page above already shows (the lead and the row of
   * four). The unfiltered library starts after them; any filter searches
   * every post again.
   */
  frontSlugs?: string[];
}

/** Cards per "Show more": four rows of three. */
const PAGE = 12;

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
 *
 * 30 Sep 2026 (Vern: "editorial, blogs should follow suit"): the pills are a
 * magazine's section tabs, type on a hairline with the brand gradient under
 * the one you are in; the grid is the editorial cards (BlogCard); and the
 * library shows twelve at a time with "Show more", where it used to lay all
 * seventy-odd cards down a 12,000px page.
 */
export default function BlogFilter({ posts, allProducts, frontSlugs = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch]     = useState(() => searchParams.get("search") ?? "");
  const [product, setProduct]   = useState(() => searchParams.get("product") ?? "all");
  const [section, setSection]   = useState<InsightsSectionKey | "all">(() => sectionFromParams(searchParams));
  const [sort, setSort]         = useState<"newest" | "oldest" | "az">(() => (searchParams.get("sort") as "newest" | "oldest" | "az") ?? "newest");

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

  // Unfiltered, the library continues from the front page instead of
  // repeating it; any filter or sort lists every match.
  const list = useMemo(
    () => (hasFilters || frontSlugs.length === 0 ? filtered : filtered.filter((p) => !frontSlugs.includes(p.slug))),
    [filtered, hasFilters, frontSlugs]
  );

  // Twelve at a time; a new question starts again at twelve.
  const [visible, setVisible] = useState(PAGE);
  useEffect(() => { setVisible(PAGE); }, [search, product, section, sort]);
  const shown = list.slice(0, visible);
  const more = list.length - shown.length;

  const activeSection = section === "all" ? undefined : SECTION_BY_KEY[section];

  // A section tab: the name, its count from sm up, and the brand gradient
  // under the one you are in, sitting on the row's hairline. The active tab
  // is told by weight and the rule, not by a coloured fill (Vern, 21 Sep: the
  // solid orange pill was "too loud").
  const Tab = ({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="relative inline-flex min-h-[48px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap text-[15px] transition-colors hover:text-[var(--text-primary)]"
      style={{ color: active ? "var(--text-primary)" : "var(--text-muted)", fontWeight: active ? 700 : 600 }}
    >
      {label}
      {count !== undefined && (
        <span className="hidden text-[11px] font-semibold tabular-nums sm:inline" style={{ color: "var(--text-muted)" }}>
          {count}
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-[2px] rounded-full transition-opacity"
        style={{ background: "var(--gradient-brand)", opacity: active ? 1 : 0 }}
      />
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
    <section aria-labelledby="library-heading">
      <div className="mb-8">
        {/* Type inline, as in RuleLabel: globals.css sets every heading's
            family, weight and tracking over Tailwind's utilities. */}
        <h2
          id="library-heading"
          className="mb-1 text-[10.5px] uppercase"
          style={{ color: "var(--accent-text)", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.2em", lineHeight: 1.5 }}
        >
          Browse Insights
        </h2>

        {/* ── Sections, then search · system · sort, on one hairline  */}
        <div className="flex flex-col gap-x-8 gap-y-3 lg:flex-row lg:items-end lg:justify-between" style={{ borderBottom: "1px solid var(--ink-10)" }}>
          <div
            role="group"
            aria-label="Sections"
            className="-mb-px flex items-end gap-6 overflow-x-auto scrollbar-none"
            style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            <Tab label="All" count={byProduct.length} active={section === "all"} onClick={() => { setSection("all"); pushParams({ section: "all" }); }} />
            {INSIGHTS_SECTIONS.map((s) => {
              const n = byProduct.filter((p) => inSection(p, s.key)).length;
              if (n === 0 && section !== s.key) return null;
              return (
                <Tab
                  key={s.key}
                  label={s.plural}
                  count={n}
                  active={section === s.key}
                  onClick={() => { setSection(s.key); pushParams({ section: s.key }); }}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pb-3">
            <div className="relative min-w-[190px] flex-1 lg:w-60 lg:flex-none">
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

            {/* Product is its own axis, not another tab. Every system is here —
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
                className="text-sm font-semibold px-3 rounded-lg inline-flex items-center"
                style={{ color: "var(--accent-text-lg)", minHeight: "44px" }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Always-on result line  */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
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

      {/* ── Grid: rows on a phone, three across from lg  */}
      {list.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
            {shown.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                // Ramp capped at six. The delay used to be index * 0.05 against
                // the whole list, so the sixtieth card sat invisible for three
                // seconds after scrolling into view.
                transition={{ duration: 0.35, delay: Math.min(index % 6, 5) * 0.04 }}
              >
                <BlogCard post={post} priority={index < 3 && frontSlugs.length === 0} />
              </motion.div>
            ))}
            {/* Once the whole list is out, the Lunch & Learn fills the last
                row's gap, if it has one; with a system chosen, a session on
                that system. */}
            {more === 0 && <LunchLearnTile count={list.length} topic={product !== "all" ? product : undefined} />}
          </div>

          {more > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE)}
                className="group inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-[14px] font-bold transition-colors hover:border-orange-500/50 hover:text-[var(--accent-text)]"
                style={{ color: "var(--text-primary)", border: "1px solid var(--ink-15)", background: "var(--bg-card)" }}
              >
                Show more
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
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
    </section>
  );
}
