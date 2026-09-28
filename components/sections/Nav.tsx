"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, MotionConfig, useReducedMotion, type Variants } from "framer-motion";
import { products } from "@/lib/products";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";
import { applications } from "@/lib/applications";
import { PRODUCT_CATEGORIES, PRODUCT_MENU_LINES } from "@/lib/product-categories";
import { lunchLearnHref } from "@/lib/lunch-learn";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ChromeImg from "@/components/ui/ChromeImg";
import { CHROME_MARKS, CHROME_PANELS } from "@/lib/chrome-images.mjs";
import navInsights from "@/lib/nav-insights.json";
// Nothing the menus draw goes through /_next/image. Family and group photos
// and Moose are ChromeImg (baked at build time); Insights photos are Sanity
// CDN addresses (or, for the fallback cover, baked chrome files) written at
// build time into lib/nav-insights.json; the Idea Book cover is the book's own
// raster. The two header logos are SVGs on next/image marked `unoptimized`.

/**
 * The search palette loads when somebody opens it, not before.
 *
 * Nav is on every page, so a static import put the whole palette — and, behind
 * it, the entire search index: every product, application, document, pattern,
 * field note and now all fifty-nine installations — into the first JavaScript
 * payload of every route on the site. It was being parsed on the homepage by
 * visitors who never pressed a key.
 *
 * Nothing about the behaviour changes. The palette is only ever mounted inside
 * `{searchOpen && …}`, so the chunk is requested on the click or the ⌘K that
 * was already going to mount it, and the index can now afford to be as complete
 * as it ought to be.
 *
 * ssr:false because it renders nothing until opened and reaches for `document`
 * and `window` as soon as it does.
 */
const SearchOverlay = dynamic(() => import("@/components/sections/SearchOverlay"), { ssr: false });

// ── Nav link config ────────────────────────────────────────────
// Insights has its panel back (Vern, 28 Sep 2026: "it had an editorial feel
// to it, that part was working, just needed improvement"). What Doug objected
// to on 25 Sep, a full-bleed, viewport-high magazine cover of a Walmart sign
// carrying eighty-odd words and four calls to action, is what went: the
// cover is now one photo in a column, and the panel keeps one "View all".
const PLAIN_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

type Panel = "products" | "applications" | "insights";
const PANEL_IDS: Record<Panel, string> = {
  products: "products-mega-menu",
  applications: "applications-mega-menu",
  insights: "insights-mega-menu",
};

// The search palette's data lives in lib/search.ts. A stale copy of it used
// to sit here, unread, and was the last place on the site still calling the
// repair family "cold-mix" (ChipFill is heat-activated) — gone, 25 Sep 2026.

// ── Product category data ────────────────────────────────────────────
// PRODUCT_CATEGORIES lives in lib/product-categories.ts, shared with the
// /products index so the menu and the page can never name a family twice.
//
// MENU PRINCIPLES (Doug's round, 25 Sep 2026; balanced 26 and 28 Sep): show
// where you can go, grouped clearly, names first. Each family or group opens
// with one photograph; each product name carries one short line saying what
// it is (PRODUCT_MENU_LINES, the Idea Book's own words), because "MMAX" tells
// a specifier nothing and a panel of bare names read as a directory listing
// (Vern, 28 Sep: "we stripped the last version a bit too much"). Application
// names describe themselves and carry no line. Every panel ends the same way:
// one "View all" and one quiet Lunch & Learn card, in the same place each time
// (Vern, 28 Sep: add the Lunch & Learn button back to both directories). Same
// family names as /products, the product pages and the Idea Book.

// ── Application groupings ─────────────────────────────────────────────
// Four groups a specifier would recognise, each named for the place, not the
// buyer. The old fourth group, "Residential & Sustainability", put LEED &
// Urban Heat Island next to driveways; the heat-island credit is earned on
// parking lots and commercial hardscape, so it sits with them. Two driveway
// pages remain (private, residential) — merging them is Doug's call; if they
// merge, add the redirect in next.config.ts.
const APPLICATION_GROUPS = [
  {
    label: "Streets & Safety",
    slugs: ["crosswalks", "bike-lanes", "bus-lanes", "pedestrian-safety", "traffic-calming", "regulatory-markings"],
  },
  {
    label: "Parks & Public Spaces",
    slugs: ["parks-paths", "public-spaces", "playgrounds", "splash-pads", "public-art", "community-branding"],
  },
  {
    label: "Commercial & Sustainability",
    slugs: ["parking-lots", "commercial-spaces", "sport-courts", "airports", "leed-urban-heat-island"],
  },
  {
    label: "Residential",
    slugs: ["private-driveways", "residential-driveways", "townhomes"],
  },
];

// ── Insights data ─────────────────────────────────────────────────────
// The cover story and the newest posts, written at build time from Sanity by
// scripts/gen-nav-insights.ts (the checked-in copy is the fallback when
// Sanity can't be reached). Photos are Sanity CDN URLs already sized for the
// menu. It replaces the hand-picked FEATURED_POSTS (lib/nav-featured-posts.mjs),
// whose titles and types had drifted from the posts they named.
// Since 28 Sep 2026 each post also carries its excerpt (the cover story's
// deck) and its read time as the post page prints it, and the file carries
// the three sections with their one line (lib/field-notes-taxonomy.ts) and
// the number of posts each lists. Optional here so a copy written before
// that still renders.
interface NavImage { src: string; srcSet: string }
interface NavPost {
  slug: string; title: string; type: string; publishedAt: string; date: string;
  excerpt?: string; readTime?: string; thumb: NavImage;
}
interface NavSection { key: string; label: string; href: string; blurb: string; count: number }
interface NavInsights {
  cover: (NavPost & { image: NavImage }) | null;
  latest: NavPost[];
  sections?: NavSection[];
  total?: number;
}
const INSIGHTS = navInsights as NavInsights;

// Insights' three sections under their new names (28 Sep 2026). A post's
// stored type (lib/field-notes-taxonomy.ts) prints as the section it lives in.
const INSIGHT_KIND: Record<string, string> = {
  "Case Study": "Project",
  "Project Profile": "Project",
  Guide: "Guide",
  "White Paper": "Guide",
  Blog: "Article",
};
const kindOf = (type: string) => INSIGHT_KIND[type] ?? "Article";
const INSIGHT_SECTIONS = [
  { label: "Projects", href: "/blog/projects" },
  { label: "Guides", href: "/blog/guides" },
  { label: "Articles", href: "/blog/articles" },
];
// The sections as the build wrote them, with their lines and counts; the
// bare names above when the file has none (no line, no count is printed).
const NAV_SECTIONS: NavSection[] = INSIGHTS.sections?.length
  ? INSIGHTS.sections
  : INSIGHT_SECTIONS.map((s) => ({ key: s.href, label: s.label, href: s.href, blurb: "", count: 0 }));

// The Idea Book, as a publication in the Insights panel and the drawer: its
// cover, its name, one line, a link to the reader. It sits there as the thing
// it is, next to the articles, never as a promotion (Doug, 25 Sep: no
// catalogue buttons in the menus). Hidden with the other Idea Book surfaces
// when NEXT_PUBLIC_SHOW_CATALOGUE is off (lib/feature-flags.ts).
const IDEA_BOOK_LINE = "Every system and every application, in one book.";
const ideaBookCover = catalogue.coverThumb ?? null;
// The 240px thumbnail, and the 800px first page for a 2x screen (the page the
// homepage band shows); plain files under /catalogue, never /_next/image.
const ideaBookCoverSet = ideaBookCover
  ? `${ideaBookCover} 240w, ${cataloguePageUrl(1, catalogue.widths[0])} ${catalogue.widths[0]}w`
  : undefined;
const showIdeaBook = () => showCatalogue() && catalogueReady && ideaBookCover !== null;

// Lunch & Learn, in the words the site already uses (LunchLearnCard: "A free
// 45-minute working session ... Lunch is on us.").
const LL_LINE = "A free 45-minute session. Lunch is on us.";

// ── Mega menu — shared shell ─────────────────────────────────────────
// Same container as the bar above it, so the panel's left edge lines up with
// the logo and its right edge with the Lunch & Learn button.
function MegaShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-[calc(100vh-72px)] overflow-y-auto overscroll-contain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-6">{children}</div>
    </div>
  );
}

const ACCENT = "var(--accent-text)";  // small-text accent (WCAG-safe on dark surfaces)

// The letterspaced label every column and section opens with.
function MenuLabel({ children, rule = true, className = "" }: { children: React.ReactNode; rule?: boolean; className?: string }) {
  return (
    <div
      className={`text-[10.5px] font-bold tracking-[0.2em] uppercase ${rule ? "pb-3 mb-2" : ""} ${className}`}
      style={{ color: ACCENT, borderBottom: rule ? "1px solid rgba(249,115,22,0.18)" : undefined }}
    >
      {children}
    </div>
  );
}

// ── Photographs and the ruled tile ───────────────────────────────────
// A family's or group's picture is its CHROME_PANELS entry (lib/chrome-images.mjs),
// keyed by the label the menu prints, so the baker and the menu read one list.
// A family with no photo that meets the rules gets a ruled tile instead: the
// hatching an engineer draws through asphalt or concrete cut in section, and
// one fact about the family in type. That is Asphalt & Concrete Repair since
// 28 Sep 2026 (its only photo carried a third party's copyright, QA pa#7).
const TILE_LINES: Record<string, string> = {
  // lib/product-categories.ts intro: "... for asphalt and concrete, deployable year-round."
  "Asphalt & Concrete Repair": "For asphalt and concrete, year-round",
};
const HATCH = "repeating-linear-gradient(-45deg, var(--ink-06) 0 1px, transparent 1px 9px)";

function RuledTile({ line, compact = false }: { line?: string; compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${compact ? "h-12 w-24 flex-shrink-0 rounded-lg" : "aspect-[2/1] max-xl:aspect-[5/2] w-full rounded-xl"}`}
      style={{ background: `${HATCH}, var(--bg-card)`, border: "1px solid var(--ink-10)" }}
    >
      <div className={`absolute ${compact ? "left-2.5 bottom-2.5" : "left-4 right-4 bottom-4"}`}>
        <span className="block rounded-full" style={{ width: compact ? 18 : 28, height: 3, background: "#F97316" }} />
        {!compact && line && (
          <div className="font-display mt-2.5 text-[15px] font-bold leading-snug text-balance" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            {line}
          </div>
        )}
      </div>
    </div>
  );
}

// The drawer's small row picture for a family with no panel photo. Asphalt &
// Concrete Repair (28 Sep 2026: on the phone the striped tile read as a
// missing picture) shows AggreFill's product photo, aggrefill-02.jpg:
// the product's own hero on its page (lib/products.ts), with no supplier
// packaging and no third-party credit in the file, unlike
// fastpatch-repaired.jpg. At 96 x 48 its 476px source is plenty; the 2:1
// panel column on desktop is not, so the Products menu keeps the ruled tile.
// It is the "row" size the drawer already bakes for every product
// (lib/chrome-images.mjs), so no new file is made.
const DRAWER_PHOTOS: Record<string, string> = {
  "Asphalt & Concrete Repair": "/images/products/aggrefill/aggrefill-02.jpg",
};

function GroupPicture({ label, compact = false }: { label: string; compact?: boolean }) {
  const photo = (CHROME_PANELS as Record<string, { src: string } | undefined>)[label];
  if (!photo && compact && DRAWER_PHOTOS[label]) {
    return (
      <ChromeImg
        family="row"
        src={DRAWER_PHOTOS[label]}
        alt=""
        sizes="96px"
        width={96}
        height={48}
        className="h-12 w-24 flex-shrink-0 rounded-lg object-cover"
        style={{ border: "1px solid var(--ink-10)" }}
      />
    );
  }
  if (!photo) return <RuledTile line={TILE_LINES[label]} compact={compact} />;
  return compact ? (
    <ChromeImg
      family="panel"
      src={photo.src}
      alt=""
      sizes="96px"
      width={96}
      height={48}
      className="h-12 w-24 flex-shrink-0 rounded-lg object-cover"
      style={{ border: "1px solid var(--ink-10)" }}
    />
  ) : (
    <ChromeImg
      family="panel"
      src={photo.src}
      alt=""
      sizes="(min-width: 1280px) 290px, 22vw"
      width={640}
      height={320}
      // 5:2 below xl, where the descriptors wrap: a 1024x768 screen then
      // shows the whole panel without scrolling.
      className="aspect-[2/1] max-xl:aspect-[5/2] w-full rounded-xl object-cover"
      style={{ border: "1px solid var(--ink-10)" }}
    />
  );
}

type MenuItem = { href: string; name: string; line?: string };

function productFamily(cat: (typeof PRODUCT_CATEGORIES)[number]): MenuItem[] {
  const items: MenuItem[] = cat.slugs.flatMap((sl) => {
    const p = products.find((x) => x.slug === sl);
    return p ? [{ href: `/products/${p.slug}`, name: p.name, line: PRODUCT_MENU_LINES[p.slug] }] : [];
  });
  // The one structural extra a column may carry: a real secondary
  // destination (the pattern gallery under Stamped Asphalt).
  if (cat.secondary) items.push({ href: cat.secondary.href, name: cat.secondary.label, line: cat.secondary.menuLine });
  return items;
}

function applicationGroup(group: (typeof APPLICATION_GROUPS)[number]): MenuItem[] {
  return group.slugs.flatMap((sl) => {
    const a = applications.find((x) => x.slug === sl);
    return a ? [{ href: `/applications/${a.slug}`, name: a.name }] : [];
  });
}

// ── Directory column: one family or group, its picture, label, names ──
// The rows hang 10px outside the column (-mx-2.5) so their text lines up
// with the picture and the label while the hover fill still has room.
// The four columns share three rows (subgrid): when a label wraps, as
// "Commercial & Sustainability" does at 1024px, every label row grows with
// it and the text sits on its rule, so the four lists still start level.
function MenuColumn({ label, items }: { label: string; items: MenuItem[] }) {
  return (
    <div className="row-span-3 grid grid-rows-subgrid">
      <div className="mb-4">
        <GroupPicture label={label} />
      </div>
      <MenuLabel className="flex items-end">{label}</MenuLabel>
      <ul>
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              // data-tap: a 44px floor on touch screens (app/globals.css), for
              // the tablets wide enough to get these panels.
              data-tap="44"
              className={`group -mx-2.5 flex ${it.line ? "items-start" : "items-center"} justify-between gap-3 px-2.5 py-2 rounded-lg transition-colors hover:bg-[var(--ink-05)]`}
            >
              <span className="min-w-0">
                <span className="block text-[14.5px] font-semibold leading-snug group-hover:text-[var(--accent-text)] transition-colors" style={{ color: "var(--text-primary)" }}>
                  {it.name}
                </span>
                {it.line && (
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-pretty" style={{ color: "var(--ink-58)" }}>
                    {it.line}
                  </span>
                )}
              </span>
              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                className={`${it.line ? "mt-[5px]" : ""} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`} style={{ color: ACCENT }} aria-hidden="true">
                <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Lunch & Learn: the one card per panel ────────────────────────────
// Vern, 28 Sep 2026: "add the Lunch & Learn button back to the Product and
// Applications mega menu." It lives in each panel's footer, the same place
// every time, and stays quieter than the photographs: a small Moose, one
// line, an outlined button (the bar above already carries the orange one).
// The link carries a topic into the booking form (lib/lunch-learn.ts), so
// Doug's request email says which menu the visitor booked from.
function MooseAvatar({ size = 40 }: { size?: number }) {
  return (
    <span aria-hidden="true" className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full" style={{ background: "rgba(249,115,22,0.14)", border: "1.5px solid rgba(249,115,22,0.45)" }} />
      {/* 122% of the ring, bottom-aligned: Moose looks out over the edge. */}
      <ChromeImg
        family="moose"
        src={CHROME_MARKS.moose}
        alt=""
        width={160}
        height={160}
        sizes={`${Math.round(size * 1.22)}px`}
        className="absolute bottom-0 left-1/2 w-auto"
        style={{ height: "122%", maxWidth: "none", transform: "translateX(-50%)" }}
      />
    </span>
  );
}

function LunchLearnSlot({ topic }: { topic: string }) {
  return (
    <div
      className="flex items-center gap-3.5 rounded-xl py-2.5 pl-3.5 pr-2.5"
      style={{ background: "var(--ink-03)", border: "1px solid var(--ink-08)" }}
    >
      <MooseAvatar size={38} />
      <div className="min-w-0">
        <div className="text-[13px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>Lunch &amp; Learn</div>
        <div className="mt-0.5 text-[12px] leading-snug" style={{ color: "var(--ink-60)" }}>{LL_LINE}</div>
      </div>
      <Link
        href={lunchLearnHref(topic, "menu")}
        className="ml-2 inline-flex min-h-[44px] flex-shrink-0 items-center gap-2 rounded-lg px-4 text-[13px] font-bold whitespace-nowrap transition-colors hover:bg-[rgba(249,115,22,0.12)]"
        style={{ color: ACCENT, border: "1px solid rgba(249,115,22,0.45)" }}
      >
        Book a session
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

// ── Every panel's footer: the one "View all", and Lunch & Learn ──────
function MenuFooter({ href, label, topic }: { href: string; label: string; topic: string }) {
  return (
    <div className="mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-4" style={{ borderTop: "1px solid var(--ink-08)" }}>
      <Link
        href={href}
        className="group -ml-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-[13.5px] font-bold transition-colors hover:bg-[var(--ink-05)] hover:text-[var(--accent-text)]"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <LunchLearnSlot topic={topic} />
    </div>
  );
}

// ── Products panel: four families, each with its products and lines ──
function ProductsMegaMenu() {
  return (
    <MegaShell>
      <div className="grid grid-cols-4 gap-x-8 xl:gap-x-12">
        {PRODUCT_CATEGORIES.map((cat) => (
          <MenuColumn key={cat.label} label={cat.label} items={productFamily(cat)} />
        ))}
      </div>
      {/* The topic is the whole range: which family a visitor last hovered
          on the way down to this card says little about what they want. */}
      <MenuFooter href="/products" label="View all products" topic="HUB systems" />
    </MegaShell>
  );
}

// ── Applications panel: four groups, picture, label, names ───────────
function ApplicationsMegaMenu() {
  return (
    <MegaShell>
      <div className="grid grid-cols-4 gap-x-8 xl:gap-x-12">
        {APPLICATION_GROUPS.map((group) => (
          <MenuColumn key={group.label} label={group.label} items={applicationGroup(group)} />
        ))}
      </div>
      <MenuFooter href="/applications" label="View all applications" topic="your application" />
    </MegaShell>
  );
}

// A Sanity CDN photo from lib/nav-insights.json: plain <img srcset>, sized at
// build time, never /_next/image.
function InsightImg({ image, sizes, className, style }: { image: NavImage; sizes: string; className?: string; style?: React.CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element -- deliberate, see lib/chrome-images.mjs
  return <img src={image.src} srcSet={image.srcSet} sizes={sizes} alt="" loading="lazy" decoding="async" className={className} style={style} />;
}

// ── Insights panel: the section front ─────────────────────────────────
// Products and Applications are directories; Insights is laid out like the
// section front of a magazine (Vern, 28 Sep 2026: "needs to look more pro
// editorial"). A masthead; the cover story large, with its kicker (section,
// date, read time), headline and deck; the latest pieces as a ruled list;
// the three sections as big type with their line and their count; the Idea
// Book on the shelf as the printed publication it is; and one quiet band for
// "All Insights" and Lunch & Learn. Column rules and hairlines instead of
// cards, one photograph, orange only where it means something (the cover's
// section, a hover). Every word sits on a photo-free ground, and every title,
// date, count and line comes from Sanity or the taxonomy via
// lib/nav-insights.json.
//
// It is taller than its siblings, about two thirds of the screen, and the
// page behind it is dimmed and softened further (the scrim below), so
// nothing on the page competes with it. Opening, closing, hover intent and
// the keyboard are the shared ones in Nav().
const HAIRLINE = "1px solid var(--ink-10)";
const RULE = "1px solid var(--ink-16)";

// The small letterspaced label a column opens with, over its hairline.
function FrontLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pb-2.5 text-[10.5px] font-bold uppercase tracking-[0.22em]"
      style={{ color: "var(--ink-50)", borderBottom: RULE }}
    >
      {children}
    </div>
  );
}

// "Project · Sep 8, 2026 · 3 min read": the section in capitals, the rest
// as it reads.
function Kicker({ post, accent = false, className = "" }: { post: NavPost; accent?: boolean; className?: string }) {
  const dot = <span aria-hidden="true" className="mx-2" style={{ color: "var(--ink-30)" }}>·</span>;
  return (
    <span className={`flex flex-wrap items-baseline text-[12px] leading-none ${className}`} style={{ color: "var(--ink-50)" }}>
      <span className="text-[10.5px] font-bold uppercase tracking-[0.2em]" style={{ color: accent ? ACCENT : "var(--ink-70)" }}>
        {kindOf(post.type)}
      </span>
      {dot}
      <span>{post.date}</span>
      {post.readTime && (
        <>
          {dot}
          <span>{post.readTime}</span>
        </>
      )}
    </span>
  );
}

// Headline links underline on hover, in the brand orange, the way a
// newspaper's do; colour alone was the widget's convention.
const HEADLINE_HOVER =
  "decoration-[rgba(249,115,22,0.7)] decoration-2 underline-offset-[5px] group-hover:underline group-focus-visible:underline";

function InsightsMegaMenu() {
  const { cover, latest } = INSIGHTS;
  const book = showIdeaBook() && ideaBookCover !== null;
  const total = INSIGHTS.total ?? 0;
  return (
    <div className="max-h-[calc(100vh-72px)] overflow-y-auto overscroll-contain">
      {/* About two thirds of the screen: 612px of a 900px one, 560px of 800. */}
      <div className="flex flex-col" style={{ minHeight: "clamp(560px, 68vh, 720px)" }}>
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
          {/* Masthead: the name and the library's own lede (from /blog). */}
          <div className="flex items-baseline gap-5 pt-6 pb-4 [@media(max-height:860px)]:pt-5" style={{ borderBottom: RULE }}>
            <div
              className="font-display text-[34px] font-black leading-none"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.035em" }}
            >
              Insights
            </div>
            <div className="text-[14px]" style={{ color: "var(--ink-55)" }}>
              Decorative pavement in Canada, documented.
            </div>
          </div>

          <div className="grid flex-1 grid-cols-12 pt-6 pb-6 [@media(max-height:860px)]:pt-5 [@media(max-height:860px)]:pb-5">
            {/* The cover story: the photograph takes whatever height the
                column has, so the panel keeps its proportion on any screen. */}
            {cover && (
              <div className="col-span-5 flex flex-col pr-8 xl:pr-10">
                <Link href={`/blog/${cover.slug}`} className="group flex flex-1 flex-col">
                  <span className="relative block min-h-[180px] flex-1 overflow-hidden" style={{ background: "var(--ink-05)" }}>
                    <InsightImg
                      image={cover.image}
                      sizes="(min-width: 1280px) 470px, 36vw"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </span>
                  <Kicker post={cover} accent className="mt-5" />
                  <span
                    className={`font-display mt-3 block text-[29px] font-bold leading-[1.1] text-balance ${HEADLINE_HOVER}`}
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.025em" }}
                  >
                    {cover.title}
                  </span>
                  {cover.excerpt && (
                    <span className="mt-2.5 text-[15px] leading-[1.5] line-clamp-3 text-pretty" style={{ color: "var(--ink-62)" }}>
                      {cover.excerpt}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* The latest, newest first, ruled like a contents list. */}
            <div className={`${cover ? "col-span-4" : "col-span-9"} flex flex-col px-8 xl:px-10`} style={{ borderLeft: HAIRLINE }}>
              <FrontLabel>Latest</FrontLabel>
              <ul className="flex flex-1 flex-col">
                {latest.map((post, i) => (
                  <li key={post.slug} className="flex flex-1 flex-col" style={{ borderTop: i > 0 ? HAIRLINE : undefined }}>
                    <Link href={`/blog/${post.slug}`} className="group block flex-1 py-3">
                      <Kicker post={post} />
                      <span
                        className={`mt-1.5 text-[16px] font-semibold leading-[1.3] line-clamp-3 text-pretty ${HEADLINE_HOVER}`}
                        style={{ color: "var(--text-primary)" }}
                      >
                        {post.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* The sections, then the Idea Book on the shelf. */}
            <div className="col-span-3 flex flex-col pl-8 xl:pl-10" style={{ borderLeft: HAIRLINE }}>
              <FrontLabel>Sections</FrontLabel>
              <ul>
                {NAV_SECTIONS.map((s, i) => (
                  <li key={s.key} style={{ borderTop: i > 0 ? HAIRLINE : undefined }}>
                    <Link href={s.href} className="group block py-2.5">
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          className="font-display text-[23px] font-bold leading-none transition-colors group-hover:text-[var(--accent-text)]"
                          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                        >
                          {s.label}
                        </span>
                        {s.count > 0 && (
                          <span className="text-[12px] tabular-nums whitespace-nowrap" style={{ color: "var(--ink-50)" }}>
                            {s.count} {s.count === 1 ? "post" : "posts"}
                          </span>
                        )}
                      </span>
                      {s.blurb && (
                        <span className="mt-1.5 block text-[12.5px] leading-snug text-pretty" style={{ color: "var(--ink-58)" }}>
                          {s.blurb}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {book && ideaBookCover && (
                <Link href={ideaBook.href} className="group mt-auto flex items-center gap-4 pt-4" style={{ borderTop: HAIRLINE }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- the book's own raster, lib/catalogue.ts */}
                  <img
                    src={ideaBookCover}
                    srcSet={ideaBookCoverSet}
                    sizes="(min-height: 880px) 104px, 80px"
                    alt=""
                    width={240}
                    height={240}
                    loading="lazy"
                    decoding="async"
                    className="h-20 w-20 flex-shrink-0 rounded-[2px] object-cover transition-transform duration-300 group-hover:-translate-y-1 [@media(min-height:880px)]:h-[104px] [@media(min-height:880px)]:w-[104px]"
                    style={{
                      border: "1px solid var(--ink-12)",
                      boxShadow: "0 22px 40px -12px rgba(0,0,0,0.75), 0 8px 16px -6px rgba(0,0,0,0.5)",
                    }}
                  />
                  <span className="min-w-0">
                    <span className="block text-[10.5px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--ink-50)" }}>In print</span>
                    <span className="mt-1.5 block text-[14px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{ideaBook.title}</span>
                    {/* From xl: under it the column is too narrow for the line
                        and its arrow, and the title is already the link. */}
                    <span className="mt-1.5 hidden items-center gap-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors group-hover:text-[var(--accent-text)] xl:inline-flex" style={{ color: "var(--ink-70)" }}>
                      Open the {ideaBook.short}
                      <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* The quiet band: everything, and the one offer. */}
        <div className="flex-shrink-0" style={{ borderTop: HAIRLINE, background: "var(--ink-02)" }}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-2 sm:px-6 lg:px-8 [@media(max-height:860px)]:py-1">
            <Link
              href="/blog"
              className="group -ml-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-[13.5px] font-bold transition-colors hover:text-[var(--accent-text)]"
              style={{ color: "var(--text-primary)" }}
            >
              All Insights
              {total > 0 && (
                <span className="font-medium" style={{ color: "var(--ink-50)" }}>
                  <span aria-hidden="true" className="mr-2" style={{ color: "var(--ink-30)" }}>·</span>
                  {total} posts
                </span>
              )}
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <MooseAvatar size={30} />
              <span className="text-[13px] leading-snug" style={{ color: "var(--ink-60)" }}>
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>Lunch &amp; Learn</span>
                <span aria-hidden="true" className="mx-2" style={{ color: "var(--ink-30)" }}>·</span>
                {LL_LINE}
              </span>
              <Link
                href={lunchLearnHref("HUB systems", "menu")}
                className="ml-1 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold whitespace-nowrap transition-colors hover:bg-[rgba(249,115,22,0.1)]"
                style={{ color: ACCENT }}
              >
                Book a session
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile overlay ───────────────────────────────────────────────────
// The phone's site map, the desktop panels adapted: each family or group is a
// row with its photograph that drops its members open (products with their
// one line), then Insights with its newest pieces and the Idea Book, then the
// rest. Lunch & Learn and the two offices stay pinned to the bottom. Every
// link and button is at least 44px tall (QA pa#38: the office numbers were 20).

// Stagger variants — used on the content wrapper so child sections animate in sequence
const menuContainerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};
const menuSectionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

// Section header: the orange label and its 44px "All" link on one line
function MobileSectionHead({ label, href, onClose }: { label: string; href: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between pt-5 pb-1">
      <div
        className="px-1 text-[10px] font-bold tracking-[0.22em] uppercase select-none"
        style={{ color: "var(--accent-text-lg)" }}
      >
        {label}
      </div>
      <MobileViewAll href={href} label="All" onClose={onClose} />
    </div>
  );
}

// One family or group in the drawer: a row you can open. Picture, name, the
// family's note, a chevron; its members drop down underneath. Closed by
// default, so the drawer is eight rows of pictures instead of thirty-two
// names (Vern, 26 Sep 2026: the plain list was "the other extreme").
function MobileFamily({
  label, note, items, open, onToggle, onClose,
}: {
  label: string;
  note?: string;
  items: MenuItem[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const id = `drawer-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div style={{ borderBottom: "1px solid var(--ink-05)" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center gap-3.5 px-1 py-3 text-left active:opacity-70 transition-opacity"
      >
        <GroupPicture label={label} compact />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{label}</span>
          {note && <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: "var(--ink-50)" }}>{note}</span>}
        </span>
        <svg
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: "var(--ink-30)", transform: open ? "rotate(90deg)" : "none" }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 18l6-6-6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="members"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="pb-2 pl-[110px]">
              {items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={onClose}
                    className="flex min-h-[48px] items-center justify-between gap-4 py-2 pr-1 active:opacity-60 transition-opacity"
                  >
                    <span className="min-w-0">
                      <span className="block text-[15px] leading-tight" style={{ color: "var(--ink-85)" }}>{it.name}</span>
                      {it.line && <span className="mt-1 block text-[12.5px] leading-snug text-pretty" style={{ color: "var(--ink-50)" }}>{it.line}</span>}
                    </span>
                    <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--ink-20)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// "All →" beside a drawer section's label, 44px tall
function MobileViewAll({ href, label, onClose }: { href: string; label: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="inline-flex min-h-[44px] items-center gap-2 px-1 text-[13px] font-bold active:opacity-60 transition-opacity"
      style={{ color: "var(--accent-text-lg)" }}
    >
      {label}
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// A row in the drawer's Insights section: thumbnail, kind, title.
function MobilePostRow({ post, onClose }: { post: NavPost; onClose: () => void }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      onClick={onClose}
      className="flex items-center gap-3.5 px-1 py-3 active:opacity-70 transition-opacity"
      style={{ borderBottom: "1px solid var(--ink-05)" }}
    >
      <InsightImg
        image={post.thumb}
        sizes="56px"
        className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
        style={{ border: "1px solid var(--ink-10)" }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--accent-text-lg)" }}>{kindOf(post.type)}</span>
        <span className="mt-1 block text-[14.5px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>{post.title}</span>
      </span>
    </Link>
  );
}

// The drawer's Insights opens with the cover story, as the desktop panel
// does: its photograph the width of the drawer, its kicker and headline.
function MobileCoverStory({ post, onClose }: { post: NavPost & { image: NavImage }; onClose: () => void }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      onClick={onClose}
      className="block px-1 pt-2 pb-4 active:opacity-70 transition-opacity"
      style={{ borderBottom: "1px solid var(--ink-05)" }}
    >
      <span className="block overflow-hidden rounded-lg" style={{ border: "1px solid var(--ink-10)" }}>
        <InsightImg
          image={post.image}
          sizes="(min-width: 672px) 640px, calc(100vw - 40px)"
          className="block aspect-[16/9] w-full object-cover"
        />
      </span>
      <Kicker post={post} accent className="mt-3.5" />
      <span
        className="font-display mt-2 block text-[19px] font-bold leading-[1.22] text-balance"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
      >
        {post.title}
      </span>
    </Link>
  );
}

// ── Premium full-screen mobile menu ─────────────────────────────────────
function MobileOverlay({ isOpen, onClose, onSearchOpen }: { isOpen: boolean; onClose: () => void; onSearchOpen: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Which family or group is dropped open; one at a time, none on open.
  const [openFamily, setOpenFamily] = useState<string | null>(null);
  useEffect(() => { if (!isOpen) setOpenFamily(null); }, [isOpen]);

  // iOS-safe scroll lock: fixes body at scroll position, restores on close
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Move focus into dialog on open; return focus on close
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => overlayRef.current?.focus(), 60);
    return () => {
      clearTimeout(t);
      prev?.focus();
    };
  }, [isOpen]);

  // The cover story with its photograph, then the next two as rows; the
  // desktop panel lists four.
  const mobileCover = INSIGHTS.cover;
  const posts = INSIGHTS.latest.slice(0, mobileCover ? 2 : 3);
  const book = showIdeaBook();
  // The session topic follows the family or group the visitor has open.
  const llTopic = openFamily ?? "HUB systems";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] lg:hidden flex flex-col outline-none"
          // Dark, like the <nav> it belongs to. The drawer renders outside
          // that <nav>, so on a paper page it inherited paper tokens: a cream
          // body under hardcoded dark header and footer strips, with the close
          // X in --text-primary at 1.02:1 and the phone links at 1.04:1.
          data-surface="dark"
          style={{
            background: "var(--bg-deepest)",
            height: "100dvh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ────────────────────────────────────────────── */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-5"
            style={{
              height: 64,
              borderBottom: "1px solid var(--border-color)",
              background: "rgba(7,11,18,0.92)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* prefetch={false}: this Link is the site logo, always visible.
                Its default viewport-prefetch of "/" was fetching the homepage
                hero image (~1.2MB) on every other route on first paint — pure
                waste, since that image never renders here. Trades a touch of
                nav-to-home snappiness for a lot of unused bytes on every
                other page. */}
            <Link href="/" onClick={onClose} prefetch={false} className="flex min-h-[44px] items-center active:opacity-70 transition-opacity">
              {/* Not the LCP hero — each route has its own priority hero
                  image; this is a small header logo. */}
              <Image
                src="/images/hub-official-logo.svg"
                alt="HUB Surface Systems"
                width={150} height={36}
                style={{ height: 30, width: "auto" }}
                unoptimized
              />
            </Link>

            <div className="flex items-center gap-1">
              {/* Search shortcut */}
              <button
                onClick={() => { onClose(); onSearchOpen(); }}
                aria-label="Open search"
                className="flex items-center justify-center rounded-xl active:opacity-60 transition-opacity"
                style={{ width: 48, height: 48, color: "var(--ink-45)" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" strokeWidth={1.75} />
                  <path d="M21 21l-4.35-4.35" strokeWidth={1.75} strokeLinecap="round" />
                </svg>
              </button>

              {/* Close — 48×48 tap target, prominent X */}
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="flex items-center justify-center rounded-xl active:opacity-60 transition-opacity"
                style={{
                  width: 48, height: 48,
                  color: "var(--text-primary)",
                  background: "var(--fill-subtle)",
                  border: "1px solid var(--ink-10)",
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Scrollable body ───────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
            <motion.div
              variants={menuContainerVariants}
              initial="hidden"
              animate="show"
              className="px-4 pb-8 max-w-2xl mx-auto"
            >

              {/* ── Products ──────────────────────────────────────── */}
              <motion.div variants={menuSectionVariants}>
                <MobileSectionHead label="Products" href="/products" onClose={onClose} />
                {PRODUCT_CATEGORIES.map((cat) => (
                  <MobileFamily
                    key={cat.label}
                    label={cat.label}
                    note={cat.menuNote}
                    items={productFamily(cat)}
                    open={openFamily === cat.label}
                    onToggle={() => setOpenFamily(openFamily === cat.label ? null : cat.label)}
                    onClose={onClose}
                  />
                ))}
              </motion.div>

              {/* ── Applications ──────────────────────────────────── */}
              <motion.div variants={menuSectionVariants} className="mt-2">
                <MobileSectionHead label="Applications" href="/applications" onClose={onClose} />
                {APPLICATION_GROUPS.map((group) => (
                  <MobileFamily
                    key={group.label}
                    label={group.label}
                    items={applicationGroup(group)}
                    open={openFamily === group.label}
                    onToggle={() => setOpenFamily(openFamily === group.label ? null : group.label)}
                    onClose={onClose}
                  />
                ))}
              </motion.div>

              {/* ── Insights ──────────────────────────────────────── */}
              <motion.div variants={menuSectionVariants} className="mt-2">
                <MobileSectionHead label="Insights" href="/blog" onClose={onClose} />
                {mobileCover && <MobileCoverStory post={mobileCover} onClose={onClose} />}
                {posts.map((post) => (
                  <MobilePostRow key={post.slug} post={post} onClose={onClose} />
                ))}
                <div className="flex flex-wrap gap-2 px-1 pt-4 pb-1" role="group" aria-label="Insights by type">
                  {INSIGHT_SECTIONS.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={onClose}
                      className="inline-flex min-h-[44px] items-center rounded-full px-4 text-[14px] font-semibold active:opacity-60 transition-opacity"
                      style={{ color: "var(--ink-80)", border: "1px solid var(--ink-15)" }}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
                {book && ideaBookCover && (
                  <Link
                    href={ideaBook.href}
                    onClick={onClose}
                    className="mt-3 flex items-center gap-3.5 px-1 py-3 active:opacity-70 transition-opacity"
                    style={{ borderTop: "1px solid var(--ink-05)", borderBottom: "1px solid var(--ink-05)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- the book's own raster, lib/catalogue.ts */}
                    <img
                      src={ideaBookCover}
                      alt=""
                      width={240}
                      height={240}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 flex-shrink-0 rounded-[3px] object-cover"
                      style={{ border: "1px solid var(--ink-12)", boxShadow: "0 8px 18px rgba(0,0,0,0.45)" }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{ideaBook.title}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug" style={{ color: "var(--ink-50)" }}>{IDEA_BOOK_LINE}</span>
                    </span>
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ink-30)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                )}
              </motion.div>

              {/* ── Everything else, as a plain list ──────────────── */}
              <motion.div variants={menuSectionVariants} className="mt-8 pt-2" style={{ borderTop: "1px solid var(--border-color)" }}>
                {[
                  { label: "Resources", href: "/resources" },
                  { label: "Gallery", href: "/gallery" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-4 px-1 text-[16px] font-[500] active:opacity-60 transition-opacity"
                    style={{
                      color: "var(--ink-70)",
                      borderBottom: "1px solid var(--ink-05)",
                    }}
                  >
                    {link.label}
                    <svg className="w-4 h-4" style={{ color: "var(--ink-20)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </motion.div>

            </motion.div>
          </div>

          {/* ── Pinned: the offices and Lunch & Learn ─────────────────── */}
          <div
            className="flex-shrink-0 px-4 pt-1.5"
            style={{
              borderTop: "1px solid var(--border-color)",
              background: "rgba(7,11,18,0.96)",
              backdropFilter: "blur(20px)",
              paddingBottom: "max(14px, env(safe-area-inset-bottom))",
            }}
          >
            {/* Regional phones: 44px tall targets (QA pa#38: they were 20). */}
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {[
                { label: "West · 604-309-8212", href: "tel:+16043098212" },
                { label: "East · 416-540-9287", href: "tel:+14165409287" },
              ].map((office, i) => (
                <span key={office.href} className="flex items-center">
                  {i > 0 && <span aria-hidden="true" className="mx-1" style={{ width: 1, height: 14, background: "var(--ink-12)" }} />}
                  <a
                    href={office.href}
                    className="inline-flex min-h-[44px] items-center gap-1.5 px-3 text-[12.5px] font-semibold active:opacity-60 transition-opacity"
                    style={{ color: "var(--ink-60)" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--accent-text-lg)" }} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {office.label}
                  </a>
                </span>
              ))}
            </div>

            {/* Lunch & Learn: the card the desktop panels carry, with the
                button in the brand orange here, where it is the drawer's one
                call to action. */}
            <div
              className="mt-1 flex items-center gap-3 rounded-2xl py-2.5 pl-3 pr-2.5 max-w-2xl mx-auto"
              style={{ background: "var(--ink-04)", border: "1px solid var(--ink-10)" }}
            >
              <MooseAvatar size={40} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>Lunch &amp; Learn</div>
                <div className="mt-0.5 text-[12px] leading-snug" style={{ color: "var(--ink-60)" }}>{LL_LINE}</div>
              </div>
              <Link
                href={lunchLearnHref(llTopic, "menu")}
                onClick={onClose}
                aria-label="Book a Lunch & Learn"
                className="inline-flex min-h-[44px] flex-shrink-0 items-center gap-1.5 rounded-xl px-4 text-[14px] font-bold active:scale-[0.97] active:opacity-90 transition-[transform,opacity] duration-100"
                style={{
                  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                  color: "var(--on-accent)",
                  boxShadow: "0 4px 18px rgba(249,115,22,0.32)",
                }}
              >
                Book
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Nav ─────────────────────────────────────────────────────────
export default function Nav() {
  const [openPanel, setOpenPanel] = useState<Panel | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const productsBtnRef = useRef<HTMLButtonElement>(null);
  const applicationsBtnRef = useRef<HTMLButtonElement>(null);
  const insightsBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRefs: Record<Panel, React.RefObject<HTMLButtonElement | null>> = {
    products: productsBtnRef,
    applications: applicationsBtnRef,
    insights: insightsBtnRef,
  };
  // Set right before a trigger's onClick opens its panel (Enter/Space or a
  // real mouse click — never by onFocus/onMouseEnter alone) so the effect
  // below knows to move focus INTO the panel. Without this, the panel's own
  // links were unreachable by Tab: the panel renders after the whole link
  // row in the DOM, so tabbing forward from "Products" lands on
  // "Applications" next, not inside the products panel — the open panel and
  // the tab sequence pointed two different directions.
  const focusPanelOnOpen = useRef(false);
  // How the open panel was opened. A click on a trigger whose panel the
  // pointer has just opened by hovering keeps it open: before, hover opened
  // it and the click that followed closed it again, which read as broken,
  // and Insights (a plain link until 28 Sep 2026) would have done it to
  // everyone who clicked it out of habit.
  const openedByHover = useRef(false);
  // Hover intent: a pointer crossing the bar on its way somewhere else
  // should not flash a panel open. Once one is open, moving along the
  // triggers switches at once.
  const hoverTimer = useRef<number | null>(null);
  const cancelHover = () => {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  useEffect(() => {
    const timer = hoverTimer;
    return () => { if (timer.current !== null) window.clearTimeout(timer.current); };
  }, []);

  const hoverOpen = (panel: Panel) => {
    cancelHover();
    if (openPanel === panel) return;
    if (openPanel) {
      openedByHover.current = true;
      setOpenPanel(panel);
      return;
    }
    hoverTimer.current = window.setTimeout(() => {
      openedByHover.current = true;
      setOpenPanel(panel);
    }, 90);
  };

  const clickTrigger = (panel: Panel) => {
    cancelHover();
    if (openPanel === panel && openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    const next = openPanel === panel ? null : panel;
    if (next) focusPanelOnOpen.current = true;
    openedByHover.current = false;
    setOpenPanel(next);
  };

  const closePanels = useCallback(() => {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setOpenPanel(null);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape closes an open mega menu and returns focus to its trigger — before
  // this, a keyboard user who opened "Products" with Enter had no way to
  // dismiss it short of Shift+Tabbing all the way back to the button and
  // pressing it again, or tabbing forward through the whole menu into page
  // content while the panel stayed open behind them.
  useEffect(() => {
    if (!openPanel) return;
    const trigger = { products: productsBtnRef, applications: applicationsBtnRef, insights: insightsBtnRef }[openPanel];
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenPanel(null);
      trigger.current?.focus();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openPanel]);

  // After an explicit activation (not a hover/focus preview) opens a panel,
  // move focus to its first link so Tab continues on into the panel's own
  // content instead of jumping to the next top-level trigger.
  useEffect(() => {
    if (!openPanel || !focusPanelOnOpen.current) return;
    focusPanelOnOpen.current = false;
    const t = setTimeout(() => {
      const panel = document.getElementById(PANEL_IDS[openPanel]);
      const first = panel?.querySelector<HTMLElement>('a[href], button:not([disabled])');
      first?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [openPanel]);

  // Close the mega menu once keyboard focus leaves the nav entirely (e.g.
  // Tab past "Lunch & Learn" into page content) so it doesn't stay open
  // over content the user has already tabbed past. Mirrors the existing
  // onMouseLeave behaviour below.
  const handleNavBlur = useCallback((e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpenPanel(null);
    }
  }, []);

  // Scroll state — adds shadow + accent border on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  /**
   * Cmd/Ctrl-K, and "/" as the documentation-site convention.
   *
   * There was no hotkey at all. A palette you can only reach by finding and
   * clicking a small control in the corner is a menu, not a palette — the
   * whole point is that it is one keystroke away from anywhere on the site.
   *
   * "/" only fires when the visitor is not already typing into something,
   * because otherwise it would eat the character out of the contact form.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing =
        !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /**
   * Print the key the visitor actually has. Resolved after mount so the
   * server-rendered markup and the first client render agree — deciding this
   * during render would hydrate-mismatch on every Mac.
   */
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");
  useEffect(() => {
    const mac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
    setShortcutLabel(mac ? "⌘K" : "Ctrl K");
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // The three panel triggers share one look and one behaviour.
  const triggers: { panel: Panel; label: string }[] = [
    { panel: "products", label: "Products" },
    { panel: "applications", label: "Applications" },
    { panel: "insights", label: "Insights" },
  ];

  return (
    // reducedMotion="user": with the system setting on, the panels, the
    // drawer and its sections appear without sliding (opacity only).
    <MotionConfig reducedMotion="user">
      <nav
        ref={navRef}
        /* The bar is charcoal in every theme — the orange-on-charcoal wordmark
           is the brand's, not the page's. Its background is hardcoded, so its
           TOKENS have to be pinned dark too: without this the light theme gave
           it near-black links on near-black glass, a contrast ratio of 1.08. */
        data-surface="dark"
        className="sticky top-0 z-50"
        style={{
          background: "rgba(7,11,18,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid rgba(249,115,22,0.18)"
            : "1px solid var(--border-color)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.55), 0 1px 0 rgba(249,115,22,0.08)"
            : "none",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseLeave={closePanels}
        onBlur={handleNavBlur}
      >
        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">

          {/* Logo + integrated "Canadian" accent — small flag glyph + label, vertically centered with the logo wordmark */}
          {/* prefetch={false}: default viewport-prefetch of "/" was pulling
              the homepage's ~1.2MB hero image on every other route's first
              paint (React/Next eagerly resolve fetchPriority="high" <img> in
              prefetched RSC data). Nothing on this route shows that image,
              so it was pure waste. */}
          <Link href="/" prefetch={false} className="flex-shrink-0 flex items-center gap-3 group">
            {/* Not the LCP hero — every route has its own dedicated priority
                hero image further down; this is just the header logo. */}
            <Image
              src="/images/hub-official-logo.svg"
              alt="HUB Surface Systems"
              width={160}
              height={38}
              style={{ height: 34, width: "auto" }}
              unoptimized
            />
            <span
              className="hidden sm:inline-flex items-center gap-1.5 pl-3"
              style={{
                borderLeft: "1px solid var(--ink-12)",
                height: 22,
              }}
              aria-label="Canadian"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 9600 4800"
                width={16}
                height={8}
                aria-hidden="true"
                style={{ display: "block", flexShrink: 0, borderRadius: 1 }}
              >
                <path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z" />
                <path fill="var(--text-primary)" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
              </svg>
              <span
                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: "var(--ink-55)", lineHeight: 1 }}
              >
                Canadian
              </span>
            </span>
          </Link>

          {/* Desktop links, from lg (1024px). Below that the bar is the
              phone's: search and the drawer. Until 28 Sep 2026 the switch
              was at md, where the full bar measured 998px in a 768px window
              and pushed search, Resources and Lunch & Learn off the screen;
              a touch tablet is better served by the drawer anyway. */}
          <div className="hidden lg:flex items-center gap-0.5">

            {/* Mega menu triggers: Products, Applications, Insights.
                Deliberately no onFocus-opens-panel here (unlike the plain
                links below): the onClick TOGGLES based on the current
                openPanel, so if focus alone had already set it, the very
                next Enter/Space press would read as "already open, so close"
                and the panel would never catch a keyboard user's Enter as
                "open". Tab lands on the button inert; Enter/Space is what
                opens it, and immediately hands focus into the panel's first
                link. */}
            {triggers.map(({ panel, label }) => (
              <button
                key={panel}
                ref={triggerRefs[panel]}
                type="button"
                onMouseEnter={() => hoverOpen(panel)}
                onClick={() => clickTrigger(panel)}
                aria-expanded={openPanel === panel}
                aria-haspopup="true"
                aria-controls={PANEL_IDS[panel]}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors hover:text-[var(--accent-text)] hover:bg-[var(--ink-05)]"
                style={{ color: openPanel === panel ? "var(--accent-text-lg)" : "var(--ink-65)" }}
              >
                {label}
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                  style={{ opacity: 0.5, transform: openPanel === panel ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ))}

            {/* Plain links */}
            {PLAIN_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                onMouseEnter={closePanels}
                onFocus={closePanels}
                // whitespace-nowrap: at ~1100px "Field Notes" (now "Insights") broke across two
                // lines and pushed the whole nav row out of alignment. A nav
                // label is a single object; it should shrink the row, never
                // wrap inside it.
                className="px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors hover:text-[var(--accent-text)] hover:bg-[var(--ink-05)]"
                style={{ color: "var(--ink-65)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right — search + CTAs */}
          <div className="hidden lg:flex items-center gap-2" onMouseEnter={closePanels}>
            {/* Search — a magnifying glass, nothing else.

                History, so nobody resurrects the corpses: this was a permanent
                232px field (cost: chrome competing with the primary CTA), then
                a glass that grew into a bar on hover (cost: a costume change
                nobody asked for — Vernon: "there's a hover effect that extends
                the search bar, just remove that, it's useless"). He's right.
                The palette is the search experience; this button's whole job
                is to open it. One glyph, orange on hover, ⌘K in the tooltip. */}
            {/* Theme switch — Dark · Mixed · Light. A review-build control while
                Doug and Vern settle how light the site should be; see
                components/ui/ThemeToggle.tsx for what each mode means. Desktop
                only: a third control in the mobile bar pushes the hamburger off
                a 390px screen, so phones get it in the menu instead. */}
            <div className="hidden lg:flex items-center mr-1">
              <ThemeToggle compact />
            </div>
            <button
              onClick={openSearch}
              aria-label="Search the site"
              aria-keyshortcuts="Meta+K Control+K"
              title={`Search · ${shortcutLabel}`}
              className="hidden lg:flex items-center justify-center flex-shrink-0 rounded-lg transition-colors hover:bg-[var(--ink-05)]"
              style={{ width: 36, height: 36, color: "var(--text-secondary)" }}
            >
              <svg
                className="transition-colors duration-200 hover:stroke-[#F97316]"
                width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>

            {/* Icon-only below lg, where the field will not fit. */}
            <button
              onClick={openSearch}
              aria-label="Search the site"
              className="lg:hidden flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ink-05)]"
              style={{ width: 36, height: 36, color: "var(--ink-55)" }}
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>

            {/* Resources — ghost */}
            <a href="/resources"
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all hover:border-orange-500/50 hover:text-[var(--accent-text)]"
              style={{ border: "1px solid var(--ink-20)", color: "var(--ink-75)" }}
            >
              Resources
            </a>

            {/* Lunch & Learn — gradient */}
            <a href="/lunch-learn"
              className="px-3 py-1.5 rounded-lg text-[13px] font-bold whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)" }}
            >
              Lunch &amp; Learn
            </a>
          </div>

          {/* Mobile — search + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            {/* 44x44 tap targets — the mobile sweep found these at 36x36,
                under both the iOS 44pt and Android 48dp minimums. */}
            <button onClick={openSearch} aria-label="Open search" className="flex items-center justify-center" style={{ width: 44, height: 44, color: "var(--ink-60)" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} className="flex items-center justify-center" style={{ width: 44, height: 44, color: "var(--ink-60)" }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* The mega menu panel. It hangs below the bar (absolute, top-full)
            over the page instead of pushing the page down: in normal flow,
            opening a panel shifted everything under it by the panel's height
            (about 580px). One container for all three, so moving from one
            trigger to the next swaps the content in place with no second
            fade. */}
        <AnimatePresence>
          {openPanel && (
            <motion.div
              key="mega"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden lg:block"
              style={{
                // Opaque: at 98.5% the hero headline under it showed through.
                background: "rgb(7,11,18)",
                borderTop: "1px solid var(--ink-08)",
                borderBottom: "1px solid rgba(249,115,22,0.14)",
                boxShadow: "0 28px 60px rgba(0,0,0,0.55)",
              }}
            >
              <div id={PANEL_IDS[openPanel]}>
                {openPanel === "products" && <ProductsMegaMenu />}
                {openPanel === "applications" && <ApplicationsMegaMenu />}
                {openPanel === "insights" && <InsightsMegaMenu />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* Dims the page under an open panel so the panel reads as a layer.
          pointer-events: none, so moving onto the page still leaves the nav
          and closes the panel, and nothing under it stops being clickable.
          Under Insights it is darker and softened (28 Sep 2026): that panel
          ends two thirds of the way down, and the page's own headline under
          its edge read as part of the menu. Products and Applications keep
          the lighter one. */}
      <AnimatePresence>
        {openPanel && (
          <motion.div
            key="mega-scrim"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 hidden lg:block pointer-events-none"
            style={{
              background: openPanel === "insights" ? "rgba(5,8,14,0.74)" : "rgba(5,8,14,0.45)",
              backdropFilter: openPanel === "insights" ? "blur(6px)" : "none",
              WebkitBackdropFilter: openPanel === "insights" ? "blur(6px)" : "none",
              transition: "background-color 0.2s ease",
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile overlay — rendered outside <nav> so its z-index is not capped by the nav stacking context */}
      <MobileOverlay isOpen={mobileOpen} onClose={() => setMobileOpen(false)} onSearchOpen={openSearch} />

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
