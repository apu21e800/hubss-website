"use client";

import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { telHref } from "@/lib/site-settings";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { animate, motion, AnimatePresence, MotionConfig, useReducedMotion, type Variants } from "framer-motion";
import { products } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { lunchLearnHref } from "@/lib/lunch-learn";
import { scrollWindowInstantly } from "@/lib/scroll";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ChromeImg from "@/components/ui/ChromeImg";
import { CHROME_PANELS } from "@/lib/chrome-images.mjs";
import { BLOG_NAME } from "@/lib/field-notes-taxonomy";
import { altBesideTitle } from "@/lib/blog-taxonomy";
import {
  ProductsPanel, ApplicationsPanel, ProjectsPanel, warmPanels, warmFeature,
  MooseAvatar, GalleryCard, InsightImg, PHOTO_GROUND, kindOf,
  RESOURCES, APPLICATION_GROUPS, INSIGHTS, NAV_SECTIONS, showIdeaBook, ideaBook, ideaBookCover, ideaBookCoverSet,
  productFamily, applicationGroup, type MenuItem, type NavSection,
} from "@/components/sections/MegaMenus";
// Nothing the menus draw goes through /_next/image. Family and group photos
// and Moose are ChromeImg (baked at build time); Insights photos are Sanity
// CDN addresses (or, for the fallback cover, baked chrome files) written at
// build time into lib/nav-insights.json; the Product Book cover is the book's own
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

// Every Link inside the three panels and the phone drawer carries
// prefetch={false} (QA F5, 30 Sep 2026): the nav is on every page, and an
// open panel or drawer prefetched forty-odd routes' payloads at once. The
// bar's own links (About, Contact) keep the default prefetch.

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

// Resources: the spec sheets, data sheets and guides. A button in the bar
// until 14 Oct 2026; since then (Doug: "Remove 'Resources' button on main
// nav, add to products dropdown") an entry in the Products menu, on a laptop
// in the panel's foot row and on a phone as a row under the families. The
// line is the Resources page's own description, shortened.
const PANEL_IDS: Record<Panel, string> = {
  products: "products-mega-menu",
  applications: "applications-mega-menu",
  insights: "insights-mega-menu",
};

// ── Where the visitor is ──────────────────────────────────────────────
// The bar and the drawer mark the current section (QA A4, B10, C8, D12,
// 30 Sep 2026: nothing in the header said which page was open). Products
// covers the product pages, the pattern gallery and, since 14 Oct 2026,
// Resources (Doug: out of the bar, into the Products menu); Insights covers /blog.
type NavKey = Panel | "about" | "contact" | "lunch-learn" | "gallery";
const NAV_ROOT: Record<NavKey, string> = {
  products: "/products",
  applications: "/applications",
  insights: "/blog",
  about: "/about",
  contact: "/contact",
  "lunch-learn": "/lunch-learn",
  gallery: "/gallery",
};
function navSection(pathname: string): NavKey | null {
  if (pathname.startsWith("/patterns") || pathname === RESOURCES.href) return "products";
  for (const key of Object.keys(NAV_ROOT) as NavKey[]) {
    const root = NAV_ROOT[key];
    if (pathname === root || pathname.startsWith(root + "/")) return key;
  }
  return null;
}
// aria-current="page" only on the item that IS the open page; a section's
// trigger on one of its inner pages is marked visually, not as the page.
const currentPage = (pathname: string, href: string) => (pathname === href ? ("page" as const) : undefined);

// The mark itself: the label at --text-primary (set by the caller) with a
// 2px rule under it in the brand orange, or in the button's own text colour
// on the orange Lunch & Learn button, where orange on orange would vanish.
function NavLabel({ children, active, rule = "#F97316" }: { children: React.ReactNode; active: boolean; rule?: string }) {
  return (
    <span className="relative inline-block">
      {children}
      {active && <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full" style={{ background: rule }} />}
    </span>
  );
}

// "Canadian" beside the logo, the flag and the word: in the bar, and in the
// phone menu's header, which is the bar drawn again. Not from 1024 to 1279,
// where the full bar runs out of room (phone QA, 23 Oct 2026: Lunch & Learn
// ended 3px from the edge). role="img": an aria-label on a plain span is
// ignored by assistive tech (QA F17, 30 Sep 2026); as an image the flag and
// its word read as one thing, "Canadian".
function CanadianMark() {
  return (
    <span
      className="hidden sm:inline-flex lg:hidden xl:inline-flex items-center gap-1.5 pl-3"
      style={{ borderLeft: "1px solid var(--ink-12)", height: 22 }}
      role="img"
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
      <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--ink-55)", lineHeight: 1 }}>
        Canadian
      </span>
    </span>
  );
}

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
// it is (PRODUCT_MENU_LINES, the Product Book's own words), because "MMAX" tells
// a specifier nothing and a panel of bare names read as a directory listing
// (Vern, 28 Sep: "we stripped the last version a bit too much"). Application
// names describe themselves and carry no line. Every panel ends the same way:
// one "View all" and one quiet Lunch & Learn card, in the same place each time
// (Vern, 28 Sep: add the Lunch & Learn button back to both directories). Same
// family names as /products, the product pages and the Product Book.
// The groups, the lines and the three desktop panels themselves live in
// components/sections/MegaMenus.tsx since 24 Oct 2026; this file keeps the
// bar, the open state and the phone menu.

const ACCENT = "var(--accent-text)";  // small-text accent (WCAG-safe on dark surfaces)

// ── Photographs and the ruled tile ───────────────────────────────────
// A family's or group's picture is its CHROME_PANELS entry (lib/chrome-images.mjs),
// keyed by the label the menu prints, so the baker and the menu read one list.
// A family with no photo gets a ruled tile instead: the hatching an engineer
// draws through asphalt or concrete cut in section, and one fact about the
// family in type. Asphalt & Concrete Repair had it from 28 Sep 2026 until
// 30 Sep, when it got a CHROME_PANELS photo (Vern: "still missing an
// image"); the tile stays as the fallback for any family without one.
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

// The drawer's small row picture for a family with no panel photo. Since
// 30 Sep 2026 Asphalt & Concrete Repair has a panel photo (CHROME_PANELS), so
// this entry is only its fallback. It was AggreFill's product photo, aggrefill-02.jpg:
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

// "All →" beside a drawer section's label, 44px tall
function MobileViewAll({ href, label, onClose, current }: { href: string; label: string; onClose: () => void; current?: "page" }) {
  return (
    <Link prefetch={false}
      href={href}
      onClick={onClose}
      aria-current={current}
      className="inline-flex min-h-[44px] items-center gap-2 px-1 text-[14.5px] font-bold active:opacity-60 transition-opacity"
      style={{ color: "var(--accent-text-lg)" }}
    >
      {label}
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// A row in the drawer's Insights section (2 Oct 2026): one section, its
// picture at the size the family rows use, its name, a chevron. Until then
// the drawer opened Insights with the cover story, two post rows, the three
// sections as chips and the Product Book; now it is the three rows and "All"
// (Vern: the Insights menu "still feels busy, too much text maybe").
function MobileSectionRow({ section: s, pathname, onClose }: { section: NavSection; pathname: string; onClose: () => void }) {
  const current = pathname === s.href;
  return (
    <Link prefetch={false}
      href={s.href}
      onClick={onClose}
      aria-current={currentPage(pathname, s.href)}
      className="flex items-center gap-3.5 py-3 active:opacity-70 transition-opacity"
      style={{ borderBottom: "1px solid var(--ink-06)" }}
    >
      {s.photo ? (
        <InsightImg
          image={s.photo.row}
          sizes="96px"
          className="h-12 w-24 flex-shrink-0 rounded-lg object-cover"
          style={{ border: "1px solid var(--ink-10)" }}
        />
      ) : (
        <RuledTile compact />
      )}
      <span className="min-w-0 flex-1 text-[16px] font-semibold leading-tight" style={{ color: current ? "var(--text-primary)" : "var(--ink-85)" }}>
        <NavLabel active={current}>{s.label}</NavLabel>
      </span>
      <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ink-30)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}

// Resources in the drawer's Products section (14 Oct 2026): a row like the
// families', with a document mark for its picture, its name and its line.
function MobileResourcesRow({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const current = pathname === RESOURCES.href;
  return (
    <Link prefetch={false}
      href={RESOURCES.href}
      onClick={onClose}
      aria-current={currentPage(pathname, RESOURCES.href)}
      className="flex items-center gap-3.5 py-3 active:opacity-70 transition-opacity"
      style={{ borderBottom: "1px solid var(--ink-06)" }}
    >
      <span className="grid h-12 w-24 flex-shrink-0 place-items-center rounded-lg" style={{ background: `${HATCH}, var(--bg-card)`, border: "1px solid var(--ink-10)", color: ACCENT }} aria-hidden="true">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" strokeWidth={1.75} strokeLinejoin="round" />
          <path d="M14 3v5h5M9 13h6M9 17h4" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          <NavLabel active={current}>{RESOURCES.label}</NavLabel>
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug" style={{ color: "var(--ink-50)" }}>{RESOURCES.line}</span>
      </span>
      <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ink-30)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}

// ── The logo ─────────────────────────────────────────────────────────
// Vern, 23 Oct 2026: "sometimes the logo click does not work". On the
// homepage it had nowhere to go: a link to the page you are on leaves Next
// where it is, so a tap from far down did nothing. There the logo goes back
// to the top (and drops a #map from the address, so a reload starts at the
// top too). Elsewhere it navigates as before; its prefetch stays off (it
// pulled the homepage's 1.2MB hero onto every page), and the homepage is
// fetched the moment a finger or pointer reaches the logo instead, so the
// tap does not wait on the network.
let homeWarmed = false;
function useWarmHome() {
  const router = useRouter();
  return useCallback(() => {
    if (homeWarmed) return;
    homeWarmed = true;
    router.prefetch("/");
  }, [router]);
}
function toTopOfHome(reduce: boolean | null) {
  dropHash();
  if (reduce) scrollWindowInstantly(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
// The address loses its #map, and Next is told: replaceState with null (Next
// copies its own state in). Handed Next's own state object, the call looks
// like Next's and the router is not told, so it still thought it was at
// /#map and the next "See the work" went nowhere (review, 24 Oct 2026).
function dropHash() {
  if (window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

// ── Phone menu ───────────────────────────────────────────────────────
// Rebuilt 24 Oct 2026 (Vern: "the mobile menu experience ... was good at one
// time but it has fallen into chaos. Zoop it up."). Until then it was one
// long scroll: every family and group as a photo row that dropped open,
// Projects' three rows, four links, and, pinned under all of it, both office
// numbers and a Lunch & Learn card, a fifth of a 390px screen and more than a
// quarter of a 360px one.
//
// The first screen is the site in big type: Products, Applications and
// Projects; the Product Book, Gallery, About and Contact; and the two offices
// to call. A section opens in place, under its own name, like an accordion
// (Vern, the same night, on the live site: "mobile menu should work more
// like accordion, vs side animation"; it slid to a second screen for a few
// hours): its "All" link, then its families or groups, each with its
// photograph and its names two to a row. One section is open at a time, and
// the name you tapped holds still while the others close round it. The
// header is the bar itself, the same logo in the same place, so opening
// reads as the bar dropping open, and the bar's three lines turn into the
// cross that closes it. One thing is pinned: Lunch & Learn. Every link and
// button is at least 44px tall (QA pa#38).

type MenuSection = "products" | "applications" | "insights";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;     // --ease-out
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;  // --ease-in-out

// What each section holds, in its own names: the families
// (lib/product-categories.ts), the groups (APPLICATION_GROUPS above) and the
// three sections of the blog (lib/field-notes-taxonomy.ts; Projects' own
// "Canadian installations, written up").
const ROOT_SECTIONS: { level: MenuSection; label: string; line: string; href: string; all: string }[] = [
  { level: "products", label: "Products", line: "Thermoplastics, coatings, stamped asphalt, repair", href: "/products", all: "All products" },
  { level: "applications", label: "Applications", line: "Streets, parks, commercial and residential", href: "/applications", all: "All applications" },
  { level: "insights", label: BLOG_NAME, line: "Installations, guides and articles", href: "/blog", all: `All ${BLOG_NAME.toLowerCase()}` },
];

// The sheet under the header wipes down out of the bar, and back up into it.
// Three states: `hidden`, where it mounts (one value, so its first frame is
// already clipped: a keyframe list there painted the whole menu for a frame
// before the wipe); `open`, whose clip is dropped once it lands
// (transitionEnd), so nothing clips the list while it scrolls; and `closed`,
// on the way out, which starts from a full clip again since "none" cannot be
// tweened. With reduced motion it fades instead.
const SHEET_WIPE: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  open: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.46, ease: EASE_OUT }, transitionEnd: { clipPath: "none" } },
  closed: { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"], transition: { duration: 0.3, ease: EASE_IN_OUT } },
};
const SHEET_FADE: Variants = {
  hidden: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.15 } },
  closed: { opacity: 0, transition: { duration: 0.15 } },
};

// A section opening and closing. The height eases out over 340ms as it
// opens, the contents fading in a beat behind it so the rows never show
// half-drawn; closing is a little quicker and eases both ways. The page
// keeps the tapped name in place over the same 300ms (toggle, below).
const OPEN_MS = 0.34;
const CLOSE_MS = 0.3;
const PANEL: Variants = {
  shut: { height: 0, opacity: 0, transition: { height: { duration: CLOSE_MS, ease: EASE_IN_OUT }, opacity: { duration: 0.14 } } },
  open: { height: "auto", opacity: 1, transition: { height: { duration: OPEN_MS, ease: EASE_OUT }, opacity: { duration: 0.22, delay: 0.06 } } },
};
const PANEL_STILL: Variants = {
  shut: { height: 0, opacity: 0, transition: { duration: 0 } },
  open: { height: "auto", opacity: 1, transition: { duration: 0 } },
};

function Chevron({ back = false, className = "w-4 h-4", style }: { back?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={`flex-shrink-0 ${className}`} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={back ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function PhoneGlyph({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

// The bar's three lines (its 24px icon: 16px lines at 6, 12 and 18, 2px,
// round ends) turning into the cross, and back on the way out.
function BurgerCross() {
  const t = { duration: 0.32, ease: EASE_OUT };
  const line = "absolute left-[3px] h-[2px] w-[18px] rounded-full bg-current";
  return (
    <span aria-hidden="true" className="relative block h-6 w-6">
      <motion.span className={`${line} top-[5px]`} variants={{ hidden: { y: 0, rotate: 0 }, closed: { y: 0, rotate: 0 }, open: { y: 6, rotate: 45 } }} transition={t} />
      <motion.span className={`${line} top-[11px]`} variants={{ hidden: { opacity: 1, scaleX: 1 }, closed: { opacity: 1, scaleX: 1 }, open: { opacity: 0, scaleX: 0.3 } }} transition={t} />
      <motion.span className={`${line} top-[17px]`} variants={{ hidden: { y: 0, rotate: 0 }, closed: { y: 0, rotate: 0 }, open: { y: -6, rotate: -45 } }} transition={t} />
    </span>
  );
}

// The first screen's rows rise in one after another as it opens.
function RiseIn({ index, on, className, children }: { index: number; on: boolean; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={on ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.03, duration: 0.34, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

// One family or group in an open section: its photograph, its name in the
// accent and the family's note, then its members two to a row (a name is
// one or two words; a row each, with its line, made Products 1,100px long).
function MenuGroup({ label, note, items, pathname, onClose }: { label: string; note?: string; items: MenuItem[]; pathname: string; onClose: () => void }) {
  const id = `menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const names = items.filter((it) => !it.gallery);
  return (
    <section aria-labelledby={id} className="pt-5">
      <div className="flex items-center gap-3.5 pb-2">
        <GroupPicture label={label} compact />
        <div className="min-w-0">
          <h3 id={id} className="uppercase" style={{ color: ACCENT, fontFamily: "var(--font-inter), Inter, system-ui, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", lineHeight: 1.3 }}>
            {label}
          </h3>
          {note && <p className="mt-1 text-[13px] leading-snug" style={{ color: "var(--ink-50)" }}>{note}</p>}
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-4">
        {names.map((it) => {
          const here = pathname === it.href;
          return (
            <li key={it.href} style={{ borderTop: "1px solid var(--ink-06)" }}>
              <Link prefetch={false}
                href={it.href}
                onClick={onClose}
                aria-current={currentPage(pathname, it.href)}
                className="menu-name flex min-h-[48px] items-center py-2 text-[15.5px] font-semibold leading-tight"
                style={{ color: here ? "var(--text-primary)" : "var(--ink-90)" }}
              >
                <NavLabel active={here}>{it.name}</NavLabel>
              </Link>
            </li>
          );
        })}
      </ul>
      {items.filter((it) => it.gallery).map((it) => (
        <div key={it.href} className="pt-2">
          <GalleryCard item={it} compact current={currentPage(pathname, it.href)} onClick={onClose} />
        </div>
      ))}
    </section>
  );
}

// Projects opens with its cover story: the photo, its section and its
// title, as the laptop panel does.
function MenuCover({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const c = INSIGHTS.cover;
  if (!c) return null;
  const href = `/blog/${c.slug}`;
  return (
    <Link prefetch={false} href={href} onClick={onClose} aria-current={currentPage(pathname, href)} className="mt-4 block transition-opacity active:opacity-70">
      <span className="relative block aspect-[16/9] w-full overflow-hidden rounded-xl" style={{ background: PHOTO_GROUND, border: "1px solid var(--ink-10)" }}>
        <InsightImg
          image={c.image}
          alt={altBesideTitle(c.alt, c.title)}
          sizes="(min-width: 704px) 640px, calc(100vw - 32px)"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
      <span className="mt-3 block text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>{kindOf(c.type)}</span>
      <span className="font-display mt-1.5 block text-[21px] font-bold leading-[1.15] tracking-[-0.02em] text-balance" style={{ color: "var(--text-primary)" }}>
        {c.title}
      </span>
    </Link>
  );
}

// What an open section holds, under its "All" link.
function SectionPanel({ section, pathname, onClose }: { section: (typeof ROOT_SECTIONS)[number]; pathname: string; onClose: () => void }) {
  return (
    <div className="pb-6">
      <div className="-mt-1">
        <MobileViewAll href={section.href} label={section.all} onClose={onClose} current={currentPage(pathname, section.href)} />
      </div>
      {section.level === "products" && (
        <>
          {PRODUCT_CATEGORIES.map((cat) => (
            <MenuGroup key={cat.label} label={cat.label} note={cat.menuNote} items={productFamily(cat)} pathname={pathname} onClose={onClose} />
          ))}
          <div className="mt-5" style={{ borderTop: "1px solid var(--ink-06)" }}>
            <MobileResourcesRow pathname={pathname} onClose={onClose} />
          </div>
        </>
      )}
      {section.level === "applications" &&
        APPLICATION_GROUPS.map((group) => (
          <MenuGroup key={group.label} label={group.label} items={applicationGroup(group)} pathname={pathname} onClose={onClose} />
        ))}
      {section.level === "insights" && (
        <>
          <MenuCover pathname={pathname} onClose={onClose} />
          <div className="mt-5" style={{ borderTop: "1px solid var(--ink-06)" }}>
            {NAV_SECTIONS.map((s) => (
              <MobileSectionRow key={s.key} section={s} pathname={pathname} onClose={onClose} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MobileOverlay({ isOpen, scrolled, onClose, onSearchOpen }: { isOpen: boolean; scrolled: boolean; onClose: () => void; onSearchOpen: () => void }) {
  const { offices } = useSiteSettings();
  const overlayRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Partial<Record<MenuSection, HTMLDivElement | null>>>({});
  const reduce = useReducedMotion();
  const pathname = usePathname() ?? "";

  // The open section, if any. Closed again every time the menu closes.
  const [openSection, setOpenSection] = useState<MenuSection | null>(null);
  const lastToggle = useRef(0);
  const scrollAnim = useRef<{ stop: () => void } | null>(null);
  useEffect(() => {
    if (!isOpen) setOpenSection(null);
  }, [isOpen]);
  useEffect(() => () => scrollAnim.current?.stop(), []);

  // The list's scroller: the body, or the whole drawer on a phone on its
  // side, where the drawer scrolls as one (app/globals.css, .drawer).
  const scroller = () => {
    const body = bodyRef.current;
    if (body && body.scrollHeight > body.clientHeight + 1) return body;
    const all = overlayRef.current;
    return all && all.scrollHeight > all.clientHeight + 1 ? all : body;
  };

  // Open one section, closing any other. A section closing ABOVE the one
  // tapped takes its height out from over it, so the list scrolls back by
  // that much over the same 300ms with the same easing: the name you
  // tapped holds still and the new section opens under your finger. Two
  // taps in 350ms count once (a double tap closed what the first opened).
  const toggle = (next: MenuSection) => {
    const now = performance.now();
    if (now - lastToggle.current < 350) return;
    lastToggle.current = now;
    const opening = openSection === next ? null : next;
    const closing = openSection;
    const sc = scroller();
    if (sc && opening && closing && closing !== opening) {
      const order = ROOT_SECTIONS.map((r) => r.level);
      const above = order.indexOf(closing) < order.indexOf(opening);
      const h = panelRefs.current[closing]?.offsetHeight ?? 0;
      if (above && h > 0 && sc.scrollTop > 0) {
        scrollAnim.current?.stop();
        const from = sc.scrollTop;
        const to = Math.max(0, from - h);
        if (reduce) sc.scrollTop = to;
        else scrollAnim.current = animate(from, to, { duration: CLOSE_MS, ease: EASE_IN_OUT, onUpdate: (v) => { sc.scrollTop = v; } });
      }
    }
    setOpenSection(opening);
  };

  // Where closing the menu puts the page: back where it was, unless the logo
  // was tapped on the homepage, which closes it at the top.
  const restoreTo = useRef<number | null>(null);
  const warmHome = useWarmHome();

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
      // At once: html's scroll-behavior: smooth (app/globals.css) made this
      // glide from the top back down after every close (phone QA, 23 Oct 2026).
      scrollWindowInstantly(restoreTo.current ?? scrollY);
      restoreTo.current = null;
    };
  }, [isOpen]);

  // ESC to close, and Tab stays inside the menu (phone QA, 23 Oct 2026: past
  // its last link focus walked into the page behind it), as the search does.
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !overlayRef.current) return;
      const f = [...overlayRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')]
        .filter((el) => el.getClientRects().length > 0 && !el.closest("[inert]"));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      const at = document.activeElement;
      if (e.shiftKey && (at === first || at === overlayRef.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Move focus into dialog on open; return focus on close
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => overlayRef.current?.focus({ preventScroll: true }), 60);
    return () => {
      clearTimeout(t);
      // preventScroll: the button sits in the sticky bar, inside html's
      // 84px scroll-padding-top, so a plain focus() scrolled the page up to
      // centre it, 428px on a 390x844 phone, every close (independent
      // review, 24 Oct 2026).
      prev?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  // The session topic: the family or group the open page belongs to (on
  // /products/streetprint, Stamped Asphalt), else the section open.
  const here =
    PRODUCT_CATEGORIES.find((cat) => productFamily(cat).some((it) => it.href === pathname))?.label ??
    APPLICATION_GROUPS.find((g) => applicationGroup(g).some((it) => it.href === pathname))?.label ??
    null;
  const llTopic = here ?? (openSection === "applications" ? "your application" : "HUB systems");
  // The current section, marked as the bar marks it (QA A4, 30 Sep 2026).
  const section = navSection(pathname);
  const rise = !reduce;

  const plainLinks = [
    // The book was reachable from the desktop panels only; a phone had no
    // row for it (phone review, 17 Oct 2026).
    // Its name on the row and its volume under it: "Product Portfolio Book ·
    // Volume 5" on one line left "5" alone on a 390px phone.
    ...(showIdeaBook() ? [{ label: ideaBook.short, sub: ideaBook.volume, href: ideaBook.href, book: true }] : []),
    { label: "Gallery", sub: undefined, href: "/gallery", book: false },
    { label: "About", sub: undefined, href: "/about", book: false },
    { label: "Contact", sub: undefined, href: "/contact", book: false },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          initial="hidden"
          animate="open"
          exit="closed"
          // drawer: under 500px tall (a phone on its side) the whole drawer
          // scrolls as one, the header staying put (app/globals.css).
          className="drawer fixed inset-0 z-[60] lg:hidden flex flex-col outline-none"
          // Dark, like the <nav> it belongs to. The drawer renders outside
          // that <nav>, so on a paper page it inherited paper tokens: a cream
          // body under hardcoded dark header and footer strips, with the close
          // X in --text-primary at 1.02:1 and the phone links at 1.04:1.
          data-surface="dark"
          style={{ height: "100dvh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header: the bar, as it is on the page ─────────────────── */}
          <div
            className="drawer-head flex-shrink-0"
            style={{
              background: "rgba(7,11,18,0.96)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: scrolled ? "1px solid rgba(249,115,22,0.18)" : "1px solid var(--border-color)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
              {/* prefetch={false}: this Link is the site logo, always visible.
                  Its default viewport-prefetch of "/" was fetching the homepage
                  hero image (~1.2MB) on every other route on first paint. */}
              <Link
                href="/"
                prefetch={false}
                onTouchStart={warmHome}
                onPointerEnter={warmHome}
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    dropHash();
                    restoreTo.current = 0;
                  }
                  onClose();
                }}
                className="flex-shrink-0 flex min-h-[44px] items-center gap-3"
              >
                <Image
                  src="/images/hub-official-logo.svg"
                  alt="HUB Surface Systems"
                  width={160}
                  height={38}
                  style={{ height: 34, width: "auto" }}
                  unoptimized
                />
                <CanadianMark />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { onClose(); onSearchOpen(); }}
                  aria-label="Open search"
                  className="flex items-center justify-center transition-opacity active:opacity-60"
                  style={{ width: 44, height: 44, color: "var(--ink-60)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </button>
                <motion.button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 44, height: 44 }}
                  variants={{ hidden: { color: "rgba(255,255,255,0.6)" }, closed: { color: "rgba(255,255,255,0.6)" }, open: { color: "rgba(255,255,255,0.96)" } }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                >
                  <BurgerCross />
                </motion.button>
              </div>
            </div>
          </div>

          {/* ── The sheet: the sections and the pinned Lunch & Learn ───── */}
          <motion.div
            className="drawer-sheet flex min-h-0 flex-1 flex-col"
            style={{ background: "var(--bg-deepest)" }}
            variants={reduce ? SHEET_FADE : SHEET_WIPE}
          >
            <div ref={bodyRef} className="drawer-body flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
              <div className="px-4 sm:px-6 pb-10 pt-3 max-w-2xl mx-auto">
                {/* ── The three sections, each opening in place ──────── */}
                {ROOT_SECTIONS.map((s, i) => {
                  const active = section === s.level;
                  const isOpenRow = openSection === s.level;
                  const panelId = `menu-panel-${s.level}`;
                  return (
                    <RiseIn key={s.level} index={i} on={rise}>
                      <div style={{ borderBottom: "1px solid var(--ink-06)" }}>
                        <button
                          id={`menu-row-${s.level}`}
                          type="button"
                          onClick={() => toggle(s.level)}
                          aria-expanded={isOpenRow}
                          aria-controls={panelId}
                          className="menu-row flex w-full items-center justify-between gap-4 py-3.5 text-left"
                        >
                          <span className="min-w-0">
                            <span
                              className="font-display block"
                              style={{ color: active || isOpenRow ? "var(--text-primary)" : "var(--ink-90)", fontSize: 30, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em" }}
                            >
                              <NavLabel active={active}>{s.label}</NavLabel>
                            </span>
                            <span className="mt-1.5 block text-[13.5px] leading-snug text-balance" style={{ color: "var(--ink-50)" }}>{s.line}</span>
                          </span>
                          {/* The chevron turns down as the section opens. */}
                          <motion.span
                            aria-hidden="true"
                            className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full"
                            style={{ color: isOpenRow ? "var(--accent-text-lg)" : "var(--ink-30)", background: isOpenRow ? "rgba(249,115,22,0.12)" : "transparent" }}
                            animate={{ rotate: isOpenRow ? 90 : 0 }}
                            transition={reduce ? { duration: 0 } : { duration: OPEN_MS, ease: EASE_OUT }}
                          >
                            <Chevron className="w-5 h-5" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpenRow && (
                            <motion.div
                              key={panelId}
                              id={panelId}
                              role="region"
                              aria-labelledby={`menu-row-${s.level}`}
                              ref={(el) => { panelRefs.current[s.level] = el; }}
                              variants={reduce ? PANEL_STILL : PANEL}
                              initial="shut"
                              animate="open"
                              exit="shut"
                              style={{ overflow: "hidden" }}
                            >
                              <SectionPanel section={s} pathname={pathname} onClose={onClose} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </RiseIn>
                  );
                })}

                {/* ── The book and the plain pages ─────────── */}
                <div className="mt-4">
                  {plainLinks.map((link, i) => {
                    const active = (!!section && NAV_ROOT[section] === link.href) || pathname === link.href;
                    return (
                      <RiseIn key={link.href} index={ROOT_SECTIONS.length + i} on={rise}>
                        <Link prefetch={false}
                          href={link.href}
                          onClick={onClose}
                          aria-current={currentPage(pathname, link.href)}
                          className="flex min-h-[52px] items-center justify-between gap-4 py-2 transition-opacity active:opacity-60"
                          style={{ borderBottom: "1px solid var(--ink-06)" }}
                        >
                          <span className="min-w-0">
                            <span className="block text-[18px] font-semibold leading-tight" style={{ color: active ? "var(--text-primary)" : "var(--ink-85)", letterSpacing: "-0.01em" }}>
                              <NavLabel active={active}>{link.label}</NavLabel>
                            </span>
                            {link.sub && <span className="mt-0.5 block text-[13px] leading-snug" style={{ color: "var(--ink-50)" }}>{link.sub}</span>}
                          </span>
                          <span className="flex items-center gap-3">
                            {link.book && ideaBookCover && (
                              // eslint-disable-next-line @next/next/no-img-element -- the book's own raster, lib/catalogue.ts
                              <img
                                src={ideaBookCover}
                                srcSet={ideaBookCoverSet}
                                sizes="32px"
                                alt=""
                                width={240}
                                height={240}
                                loading="lazy"
                                decoding="async"
                                className="h-8 w-8 rounded-[2px] object-cover"
                                style={{ border: "1px solid var(--ink-12)", boxShadow: "0 6px 12px -6px rgba(0,0,0,0.7)" }}
                              />
                            )}
                            <Chevron style={{ color: "var(--ink-25)" }} />
                          </span>
                        </Link>
                      </RiseIn>
                    );
                  })}
                </div>

                {/* ── The two offices ─────────────────────── */}
                {/* The phones from Studio's Site Settings (lib/site-settings.ts). */}
                <RiseIn index={ROOT_SECTIONS.length + plainLinks.length} on={rise} className="mt-9">
                  <div className="pb-2 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent-text-lg)" }}>
                    Call an office
                  </div>
                  {([["West", offices.west], ["East", offices.east]] as const).map(([name, office]) => (
                    <a
                      key={name}
                      href={telHref(office.phone)}
                      className="flex min-h-[60px] items-center gap-3.5 py-2 transition-opacity active:opacity-60"
                      style={{ borderTop: "1px solid var(--ink-06)" }}
                    >
                      <span
                        aria-hidden="true"
                        className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full"
                        style={{ background: "rgba(249,115,22,0.12)", color: "var(--accent-text-lg)" }}
                      >
                        <PhoneGlyph />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[16px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                          {name} · {office.phone}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug" style={{ color: "var(--ink-50)" }}>{office.place}</span>
                      </span>
                    </a>
                  ))}
                </RiseIn>
              </div>
            </div>

            {/* ── Pinned: Lunch & Learn, the menu's one call to action ──── */}
            <div
              className="drawer-foot flex-shrink-0 px-4 sm:px-6 pt-3"
              style={{
                borderTop: "1px solid var(--ink-08)",
                background: "var(--bg-deepest)",
                paddingBottom: "max(12px, env(safe-area-inset-bottom))",
              }}
            >
              <Link prefetch={false}
                href={lunchLearnHref(llTopic, "menu")}
                onClick={onClose}
                className="menu-cta mx-auto flex w-full max-w-2xl items-center gap-3 rounded-2xl py-1.5 pl-2 pr-4"
                style={{ background: "var(--accent-gradient)", color: "var(--on-accent)", minHeight: 52 }}
              >
                <MooseAvatar size={38} onAccent />
                <span className="min-w-0 flex-1 text-[16px] font-bold leading-tight">Book a Lunch &amp; Learn</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
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
    if (panel !== "insights") warmFeature(panel);
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
  // Leaving the bar closes the panel after a beat, so a pointer that slips
  // off the edge and back does not lose it; coming back in cancels.
  const leaveTimer = useRef<number | null>(null);
  const leaveNav = useCallback(() => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => { leaveTimer.current = null; closePanels(); }, 120);
  }, [closePanels]);
  const enterNav = useCallback(() => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  }, []);
  useEffect(() => () => { if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current); }, []);

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
      // preventScroll: the trigger is in the sticky bar (see the phone menu's
      // focus restore).
      trigger.current?.focus({ preventScroll: true });
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
      // Not over another full-screen layer (the photo viewer, the work, a
      // map sheet, the phone menu): the search would open under or over it
      // and one Escape would close both (review, 24 Oct 2026).
      const covered = [...document.querySelectorAll('[aria-modal="true"]')].some((d) => d.getAttribute("aria-label") !== "Site search");
      if (covered) return;
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
    { panel: "insights", label: BLOG_NAME },
  ];

  // The current section, for the bar and the drawer (navSection above).
  const pathname = usePathname() ?? "";
  const section = navSection(pathname);
  const warmHome = useWarmHome();
  const reduceMotion = useReducedMotion();

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
        onMouseLeave={leaveNav}
        onMouseEnter={enterNav}
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
          <Link
            href="/"
            prefetch={false}
            onTouchStart={warmHome}
            onPointerEnter={warmHome}
            onFocus={warmHome}
            onClick={(e) => {
              if (pathname !== "/") return;
              e.preventDefault();
              closePanels();
              toTopOfHome(reduceMotion);
            }}
            className="flex-shrink-0 flex min-h-[44px] items-center gap-3 group"
          >
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
            <CanadianMark />
          </Link>

          {/* Desktop links, from lg (1024px). Below that the bar is the
              phone's: search and the drawer. Until 28 Sep 2026 the switch
              was at md, where the full bar measured 998px in a 768px window
              and pushed search, Resources and Lunch & Learn off the screen;
              a touch tablet is better served by the drawer anyway. */}
          <div
            className="hidden lg:flex items-center gap-0.5"
            // The first time the pointer or the keyboard reaches the links,
            // fetch the panels' photographs (MegaMenus warmPanels).
            onMouseEnter={warmPanels}
            onFocus={warmPanels}
          >

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
                // No aria-haspopup: the panel is a disclosure, not a menu
                // (desktop QA, 23 Oct 2026).
                // Only while the panel is mounted: closed, the id it named
                // did not exist in the document (QA F17, 30 Sep 2026).
                aria-controls={openPanel === panel ? PANEL_IDS[panel] : undefined}
                aria-current={currentPage(pathname, NAV_ROOT[panel])}
                // The resting colour rides in a variable: an inline `color`
                // beat the hover class, so a bar item never turned orange
                // under the pointer (interaction review, 17 Oct 2026).
                // No chip under the pointer and no orange on the open
                // trigger (creative director, 24 Oct 2026: "a component
                // library's default"): hover and open turn the label cream,
                // and the open panel's trigger wears the same 2px rule the
                // current section does, the panel's tab.
                className="nav-item flex items-center gap-1 px-3 py-2 text-[15.5px] font-medium whitespace-nowrap transition-colors"
                style={{ "--nav-c": openPanel === panel || section === panel ? "var(--text-primary)" : "var(--ink-85)" } as React.CSSProperties}
              >
                <NavLabel active={section === panel || openPanel === panel}>{label}</NavLabel>
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
                className="nav-item px-3 py-2 text-[15.5px] font-medium whitespace-nowrap transition-colors"
                style={{ "--nav-c": section && NAV_ROOT[section] === link.href ? "var(--text-primary)" : "var(--ink-85)" } as React.CSSProperties}
                aria-current={currentPage(pathname, link.href)}
              >
                <NavLabel active={!!section && NAV_ROOT[section] === link.href}>{link.label}</NavLabel>
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

            {/* Resources was a ghost button here until 14 Oct 2026; it is in
                the Products menu now (RESOURCES above). */}

            {/* Lunch & Learn, the gradient button; .btn-accent for its hover and ring.
                On /lunch-learn it is marked like the rest of the bar, with
                the rule in its own text colour (QA A4, 30 Sep 2026). */}
            {/* A Link like the rest of the bar (desktop QA, 23 Oct 2026: the
                plain <a> reloaded the whole page). */}
            <Link href="/lunch-learn"
              prefetch={false}
              className="btn-accent btn-sm"
              aria-current={currentPage(pathname, "/lunch-learn")}
            >
              <NavLabel active={section === "lunch-learn"} rule="var(--on-accent)">Lunch &amp; Learn</NavLabel>
            </Link>
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.16, ease: [0.65, 0, 0.35, 1] } }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden lg:block"
              style={{
                // Opaque: at 98.5% the hero headline under it showed through.
                background: "rgb(7,11,18)",
                borderTop: "1px solid var(--ink-08)",
                borderBottom: "1px solid var(--ink-10)",
                boxShadow: "0 28px 60px rgba(0,0,0,0.55)",
              }}
            >
              <div id={PANEL_IDS[openPanel]}>
                {openPanel === "products" && <ProductsPanel />}
                {openPanel === "applications" && <ApplicationsPanel />}
                {openPanel === "insights" && <ProjectsPanel />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* Dims the page under an open panel so the panel reads as a layer.
          pointer-events: none, so moving onto the page still leaves the nav
          and closes the panel, and nothing under it stops being clickable.
          Darker and softened under every panel (17 Oct 2026; until then
          only under Projects, and the hero's headline under the Products and
          Applications panels' edge read as menu copy, while the blur snapped
          on and off between panels). */}
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
              background: "rgba(5,8,14,0.66)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile overlay — rendered outside <nav> so its z-index is not capped by the nav stacking context */}
      <MobileOverlay isOpen={mobileOpen} scrolled={scrolled} onClose={() => setMobileOpen(false)} onSearchOpen={openSearch} />

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
