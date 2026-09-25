"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { products } from "@/lib/products";
import { ideaBook } from "@/lib/catalogue";
import { applications } from "@/lib/applications";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import ThemeToggle from "@/components/ui/ThemeToggle";
// The menus draw no photographs since 25 Sep 2026 (Doug's round: one job per
// panel, names first). The two header logos are SVGs on next/image marked
// `unoptimized`; nothing here goes through /_next/image.

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
// Insights is a plain link (Doug's round, 25 Sep 2026): its dropdown was a
// full-bleed magazine cover of a Walmart Supercentre sign carrying eighty-odd
// words and four calls to action. The library has its own front page.
const PLAIN_LINKS = [
  { label: "Insights", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// The search palette's data lives in lib/search.ts. A stale copy of it used
// to sit here, unread, and was the last place on the site still calling the
// repair family "cold-mix" (ChipFill is heat-activated) — gone, 25 Sep 2026.

// ── Product category data ────────────────────────────────────────────
// PRODUCT_CATEGORIES lives in lib/product-categories.ts, shared with the
// /products index so the menu and the page can never name a family twice.
//
// MENU PRINCIPLES (Doug's round, 25 Sep 2026): one job per panel — show where
// you can go, grouped clearly. Names first; the family heading already says
// what its members are, so the per-product taglines went ("MMA resin lane
// coating" under MMAX was the one real loss; the Coatings heading and the
// product page carry it). One "View all" per panel. No promotions, no
// repeated calls to action (the header already carries Lunch & Learn), no
// article teaser. Same family names as /products, the product pages and the
// Idea Book. Each desktop panel under 60 words; the phone drawer under 120.

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

// ── Mega menu — shared shell ─────────────────────────────────────────
// Wide container, generous padding, dark surface, accent top line.
function MegaShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-8 lg:px-14 xl:px-20 2xl:px-28 pt-7 pb-8 max-h-[calc(100vh-72px)] overflow-y-auto overscroll-contain">
      {children}
    </div>
  );
}

const ACCENT = "var(--accent-text)";  // small-text accent (WCAG-safe on dark surfaces)

// ── Directory column — one family or group: heading, names ────────────
function MenuColumn({ label, items }: { label: string; items: { href: string; name: string }[] }) {
  return (
    <div>
      <p
        className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3 pb-2.5"
        style={{ color: ACCENT, borderBottom: "1px solid rgba(249,115,22,0.18)" }}
      >
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="group flex items-center justify-between gap-2 px-2.5 py-2 rounded-md transition-colors hover:bg-[var(--ink-05)]"
            >
              <span className="text-[14px] font-semibold leading-snug group-hover:text-[var(--accent-text)] transition-colors" style={{ color: "var(--text-primary)" }}>
                {it.name}
              </span>
              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: ACCENT }} aria-hidden="true">
                <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── The one "View all" per panel ──────────────────────────────────────
function MenuViewAll({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-7 pt-4" style={{ borderTop: "1px solid var(--ink-08)" }}>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-bold transition-colors hover:bg-[var(--ink-05)] hover:text-[var(--accent-text)]"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

// ── Products panel — four families, names only ────────────────────────
function ProductsMegaMenu() {
  return (
    <MegaShell>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-12 xl:gap-x-16 gap-y-8">
        {PRODUCT_CATEGORIES.map((cat) => {
          const items = cat.slugs.flatMap((sl) => {
            const p = products.find((x) => x.slug === sl);
            return p ? [{ href: `/products/${p.slug}`, name: p.name }] : [];
          });
          // The one structural extra a column may carry: a real secondary
          // destination (the pattern gallery under Stamped Asphalt).
          if (cat.secondary) items.push({ href: cat.secondary.href, name: cat.secondary.label });
          return <MenuColumn key={cat.label} label={cat.label} items={items} />;
        })}
      </div>
      <MenuViewAll href="/products" label="View all products" />
    </MegaShell>
  );
}

// ── Applications panel — four groups, names only ──────────────────────
function ApplicationsMegaMenu() {
  return (
    <MegaShell>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-12 xl:gap-x-16 gap-y-8">
        {APPLICATION_GROUPS.map((group) => {
          const items = group.slugs.flatMap((sl) => {
            const a = applications.find((x) => x.slug === sl);
            return a ? [{ href: `/applications/${a.slug}`, name: a.name }] : [];
          });
          return <MenuColumn key={group.label} label={group.label} items={items} />;
        })}
      </div>
      <MenuViewAll href="/applications" label="View all applications" />
    </MegaShell>
  );
}

// ── Mobile overlay ───────────────────────────────────────────────────
// Names only, grouped the same way as the desktop panels, no thumbnails and
// no taglines: the drawer is the phone's site map, and it used to run to
// 262 words and thirty-four photographs (Doug's round, 25 Sep 2026).

// Stagger variants — used on the content wrapper so child sections animate in sequence
const menuContainerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};
const menuSectionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

// Section label — uppercase orange/neutral heading used above product + app groups
function MobileMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="px-1 pt-6 pb-3 text-[10px] font-bold tracking-[0.22em] uppercase select-none"
      style={{ color: "var(--accent-text-lg)" }}
    >
      {children}
    </p>
  );
}

// Thin divider between category groups
function MobileGroupDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-1 pt-5 pb-2">
      <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--ink-50)" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: "var(--fill-subtle)" }} />
    </div>
  );
}

// One destination in the drawer: name, chevron, a full-width tap target.
function MobileNavRow({ href, name, onClose }: { href: string; name: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center justify-between gap-4 px-1 py-3 rounded-lg active:opacity-60 transition-opacity"
      style={{ borderBottom: "1px solid var(--ink-05)" }}
    >
      <span className="text-[15px] font-[500] leading-tight" style={{ color: "var(--text-primary)" }}>{name}</span>
      <svg className="flex-shrink-0 w-4 h-4" style={{ color: "var(--ink-20)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}

// "View all X →" footer link inside a section
function MobileViewAll({ href, label, onClose }: { href: string; label: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="inline-flex items-center gap-2 mt-3 px-1 py-2 text-[13px] font-bold active:opacity-60 transition-opacity"
      style={{ color: "var(--accent-text-lg)" }}
    >
      {label}
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ── Premium full-screen mobile menu ─────────────────────────────────────
function MobileOverlay({ isOpen, onClose, onSearchOpen }: { isOpen: boolean; onClose: () => void; onSearchOpen: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

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
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] md:hidden flex flex-col outline-none"
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
            <Link href="/" onClick={onClose} prefetch={false} className="flex items-center active:opacity-70 transition-opacity">
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="px-4 pb-8"
            >

              {/* ── Products ──────────────────────────────────────── */}
              <motion.div variants={menuSectionVariants}>
                <div className="flex items-center justify-between">
                  <MobileMenuLabel>Products</MobileMenuLabel>
                  <MobileViewAll href="/products" label="All" onClose={onClose} />
                </div>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <div key={cat.label}>
                    <MobileGroupDivider label={cat.label} />
                    {cat.slugs.map((slug) => {
                      const p = products.find((x) => x.slug === slug);
                      if (!p) return null;
                      return <MobileNavRow key={slug} href={`/products/${slug}`} name={p.name} onClose={onClose} />;
                    })}
                    {cat.secondary && (
                      <MobileNavRow href={cat.secondary.href} name={cat.secondary.label} onClose={onClose} />
                    )}
                  </div>
                ))}
              </motion.div>

              {/* ── Applications ──────────────────────────────────── */}
              <motion.div variants={menuSectionVariants} className="mt-2">
                <div className="flex items-center justify-between">
                  <MobileMenuLabel>Applications</MobileMenuLabel>
                  <MobileViewAll href="/applications" label="All" onClose={onClose} />
                </div>
                {APPLICATION_GROUPS.map((group) => (
                  <div key={group.label}>
                    <MobileGroupDivider label={group.label} />
                    {group.slugs.map((slug) => {
                      const a = applications.find((x) => x.slug === slug);
                      if (!a) return null;
                      return <MobileNavRow key={slug} href={`/applications/${slug}`} name={a.name} onClose={onClose} />;
                    })}
                  </div>
                ))}
              </motion.div>

              {/* ── Everything else, as a plain list ──────────────── */}
              <motion.div variants={menuSectionVariants} className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
                {[
                  { label: "Insights", href: "/blog" },
                  { label: ideaBook.short, href: ideaBook.href },
                  { label: "Resources", href: "/resources" },
                  { label: "Project Gallery", href: "/gallery" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "Lunch & Learn", href: "/lunch-learn" },
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
                    <svg className="w-4 h-4" style={{ color: "var(--ink-20)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </motion.div>

            </motion.div>
          </div>

          {/* ── Sticky bottom CTA ─────────────────────────────────────── */}
          <div
            className="flex-shrink-0 px-4 pt-3 pb-4"
            style={{
              borderTop: "1px solid var(--border-color)",
              background: "rgba(7,11,18,0.96)",
              backdropFilter: "blur(20px)",
              paddingBottom: "max(16px, env(safe-area-inset-bottom))",
            }}
          >
            {/* Regional phones */}
            <div className="flex items-center justify-center gap-5 mb-3">
              <a
                href="tel:+16043098212"
                className="flex items-center gap-1.5 text-[12px] font-semibold active:opacity-60 transition-opacity"
                style={{ color: "var(--ink-55)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--accent-text-lg)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                West · 604-309-8212
              </a>
              <div style={{ width: 1, height: 12, background: "var(--ink-12)" }} />
              <a
                href="tel:+14165409287"
                className="flex items-center gap-1.5 text-[12px] font-semibold active:opacity-60 transition-opacity"
                style={{ color: "var(--ink-55)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--accent-text-lg)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                East · 416-540-9287
              </a>
            </div>

            {/* Primary CTA */}
            <Link
              href="/lunch-learn"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full rounded-2xl text-[15px] font-bold active:scale-[0.97] active:opacity-90 transition-[transform,opacity] duration-100"
              style={{
                height: 52,
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "var(--on-accent)",
                boxShadow: "0 4px 24px rgba(249,115,22,0.38)",
              }}
            >
              Book a Lunch &amp; Learn
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Nav ─────────────────────────────────────────────────────────
export default function Nav() {
  const [openPanel, setOpenPanel] = useState<"products" | "applications" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const productsBtnRef = useRef<HTMLButtonElement>(null);
  const applicationsBtnRef = useRef<HTMLButtonElement>(null);
  // Set right before a trigger's onClick opens its panel (Enter/Space or a
  // real mouse click — never by onFocus/onMouseEnter alone) so the effect
  // below knows to move focus INTO the panel. Without this, the panel's own
  // links were unreachable by Tab: the panel renders after the whole link
  // row in the DOM, so tabbing forward from "Products" lands on
  // "Applications" next, not inside the products panel — the open panel and
  // the tab sequence pointed two different directions.
  const focusPanelOnOpen = useRef(false);

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
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const triggerRef = openPanel === "products" ? productsBtnRef : applicationsBtnRef;
      setOpenPanel(null);
      triggerRef?.current?.focus();
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
    const id = openPanel === "products" ? "products-mega-menu" : "applications-mega-menu";
    const t = setTimeout(() => {
      const panel = document.getElementById(id);
      const first = panel?.querySelector<HTMLElement>('a[href], button:not([disabled])');
      first?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [openPanel]);

  // Close the mega menu once keyboard focus leaves the nav entirely (e.g.
  // Tab past "Lunch & Learn" into page content) so it doesn't stay open —
  // pushed open in normal flow, not overlaid — above content the user has
  // already tabbed past. Mirrors the existing onMouseLeave behaviour below.
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

  return (
    <>
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
        onMouseLeave={() => setOpenPanel(null)}
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

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">

            {/* Products mega menu trigger */}
            <button
              ref={productsBtnRef}
              onMouseEnter={() => setOpenPanel("products")}
              // Deliberately no onFocus-opens-panel here (unlike the plain
              // links below): this button's onClick TOGGLES based on the
              // current openPanel, so if focus alone had already set it to
              // "products", the very next Enter/Space press would read as
              // "already open, so close" and the panel would never actually
              // catch a keyboard user's Enter as "open". Tab lands on the
              // button inert; Enter/Space is what opens it — and immediately
              // hands focus into the panel's first link.
              onClick={() => {
                const next = openPanel === "products" ? null : "products";
                if (next) focusPanelOnOpen.current = true;
                setOpenPanel(next);
              }}
              aria-expanded={openPanel === "products"}
              aria-haspopup="true"
              aria-controls="products-mega-menu"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors hover:text-[var(--accent-text)] hover:bg-[var(--ink-05)]"
              style={{ color: openPanel === "products" ? "var(--accent-text-lg)" : "var(--ink-65)" }}
            >
              Products
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ opacity: 0.5, transform: openPanel === "products" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Applications mega menu trigger */}
            <button
              ref={applicationsBtnRef}
              onMouseEnter={() => setOpenPanel("applications")}
              // Deliberately no onFocus-opens-panel here — see the identical
              // comment on the Products trigger above. This button's onClick
              // TOGGLES based on the current openPanel, so onFocus setting it
              // first would make Enter/Space always read as "close".
              onClick={() => {
                const next = openPanel === "applications" ? null : "applications";
                if (next) focusPanelOnOpen.current = true;
                setOpenPanel(next);
              }}
              aria-expanded={openPanel === "applications"}
              aria-haspopup="true"
              aria-controls="applications-mega-menu"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors hover:text-[var(--accent-text)] hover:bg-[var(--ink-05)]"
              style={{ color: openPanel === "applications" ? "var(--accent-text-lg)" : "var(--ink-65)" }}
            >
              Applications
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ opacity: 0.5, transform: openPanel === "applications" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Plain links */}
            {PLAIN_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                onMouseEnter={() => setOpenPanel(null)}
                onFocus={() => setOpenPanel(null)}
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
          <div className="hidden md:flex items-center gap-2">
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
              title={`Search — ${shortcutLabel}`}
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
          <div className="md:hidden flex items-center gap-2">
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

        {/* Full-width mega menu panels */}
        <AnimatePresence>
          {openPanel && (
            <motion.div
              key={openPanel}
              id={openPanel === "products" ? "products-mega-menu" : "applications-mega-menu"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{
                background: "rgba(7,11,18,0.98)",
                borderTop: "1px solid var(--border-color)",
                borderBottom: "1px solid rgba(249,115,22,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              {openPanel === "products" && <ProductsMegaMenu />}
              {openPanel === "applications" && <ApplicationsMegaMenu />}
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* Mobile overlay — rendered outside <nav> so its z-index is not capped by the nav stacking context */}
      <MobileOverlay isOpen={mobileOpen} onClose={() => setMobileOpen(false)} onSearchOpen={openSearch} />

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </>
  );
}
