"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchOverlay from "@/components/sections/SearchOverlay";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";


// ── Nav link config ────────────────────────────────────────────
const PLAIN_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ── Search data ────────────────────────────────────────────────────
const PAGES = [
  { label: "Field Notes", href: "/blog", desc: "Field notes and industry insights" },
  { label: "About", href: "/about", desc: "Our story and team" },
  { label: "Contact", href: "/contact", desc: "Get in touch with our team" },
  { label: "Resources", href: "/resources", desc: "Spec sheets, SDS, install guides" },
  { label: "Lunch & Learn", href: "/lunch-learn", desc: "Book a free product presentation" },
  { label: "Gallery", href: "/gallery", desc: "Photo archive of our installations" },
  { label: "Pattern Library", href: "/patterns", desc: "StreetPrint stamping templates — herringbone, brick, cobble, ashlar, borders" },
];

const CATEGORIES = [
  { label: "Preformed Thermoplastics", href: "/products", desc: "TrafficPatternsXD, TrafficPatterns, PreMark, DuraTherm, DecoMark, AirMark" },
  { label: "Coatings", href: "/products", desc: "StreetBond, StreetBondSR, MMAX, DuraShield — coloured pavement coatings" },
  { label: "Stamped Asphalt & Concrete", href: "/products", desc: "StreetPrint — in-place decorative stamped asphalt" },
  { label: "Asphalt Repair", href: "/products", desc: "ChipFill, AggreFill, Fast Patch — permanent cold-mix pothole repair" },
];

// ── Search overlay ───────────────────────────────────────────────

// ── Product category data ────────────────────────────────────────────
// The photo-card era of this menu carried icon/tag/image/pillarNote per
// category. Those fields died with the cards (see the note on
// ProductsMegaMenu); what remains is exactly what a directory needs: a
// label, the members, and at most one "see also" destination.
type ProductCategory = {
  label: string;
  slugs: string[];
  secondary?: { label: string; href: string; meta?: string };
};

const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    label: "Preformed Thermoplastics",
    slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"],
  },
  {
    label: "Coatings",
    slugs: ["streetbond", "streetbondsr", "mmax", "durashield"],
  },
  {
    label: "Stamped Asphalt",
    slugs: ["streetprint"],
    secondary: { label: "Pattern gallery", href: "/patterns", meta: "16 stamping templates" },
  },
  {
    label: "Asphalt Repair",
    slugs: ["chipfill", "aggrefill", "fast-patch"],
  },
];

// ── Mega-menu micro-taglines per product (5–7 word noun phrases per Vernon) ──
const PRODUCT_TAGLINE: Record<string, string> = {
  "traffic-patterns-xd": "Aggregate-reinforced thermoplastic",
  "traffic-patterns":    "Preformed thermoplastic markings",
  "premark":             "Arrows, stop bars, legends",
  "duratherm":           "Inlaid flush-mount thermoplastic",
  "decomark":            "Custom graphic thermoplastic",
  "airmark":             "Airfield thermoplastic markings",
  "streetbond":          "Coloured pavement coating",
  "streetbondsr":        "Solar-reflective coating",
  "mmax":                "MMA resin lane coating",
  "durashield":          "Pavement maintenance coating",
  "streetprint":         "Stamped asphalt patterns",
  "chipfill":            "Cold-pour crack and joint repair",
  "aggrefill":           "Aggregate-filled pothole repair",
  "fast-patch":          "Water-activated cold-mix repair",
};

// ── Application category groupings for mega menu ─────────────────────────
const APPLICATION_GROUPS = [
  {
    label: "Traffic & Safety",
    slugs: ["crosswalks", "bike-lanes", "bus-lanes", "pedestrian-safety", "traffic-calming", "regulatory-markings"],
  },
  {
    label: "Public & Civic",
    slugs: ["parks-paths", "public-spaces", "community-branding", "public-art", "playgrounds"],
  },
  {
    label: "Commercial",
    slugs: ["parking-lots", "commercial-spaces", "sport-courts", "splash-pads", "airports"],
  },
  {
    label: "Residential & Sustainability",
    slugs: ["private-driveways", "residential-driveways", "townhomes", "leed-urban-heat-island"],
  },
];

// ── Curated Field Notes for mega menu ────────────────────────────────────
// Hardcoded for client-component context; swap manually when featuring different posts.
const FEATURED_POSTS = [
  {
    slug: "best-crosswalks-canada",
    title: "Best crosswalks in Canada",
    category: "Field Notes",
    image: "/images/blog/best-crosswalks-canada/featured.jpg",
  },
  {
    slug: "ubc-musqueam-crosswalk",
    title: "UBC × Musqueam — cultural identity in the street surface",
    category: "Project Profile",
    image: "/images/blog/ubc-musqueam-crosswalk/featured.jpg",
  },
  {
    slug: "streetbondsr-solar-reflective-coatings",
    title: "StreetBondSR — cooler asphalt for hot cities",
    category: "Field Notes",
    image: "/images/blog/streetbondsr-solar-reflective-coatings/featured.jpg",
  },
  {
    slug: "transportation-infrastructure-guide",
    title: "Transportation infrastructure — the surface specifier's guide",
    category: "White Paper",
    image: "/images/blog/transportation-infrastructure-guide/featured.jpg",
  },
];

// ── Mega menu — shared shell ─────────────────────────────────────────
// Wide container, generous padding, dark surface, accent top line.
function MegaShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-8 lg:px-14 xl:px-20 2xl:px-28 pt-7 pb-10 max-h-[calc(100vh-72px)] overflow-y-auto overscroll-contain">
      {children}
    </div>
  );
}

// ── Lunch & Learn slot — the ONE in-menu CTA (Mega Menu 2.0) ─────────────
// Doug: the L&L call-to-action should "appear intelligently across the site
// without being overwhelming." This card is its home inside every mega menu:
// same position (bottom of the lead column), same quiet weight, every time.
// The old layout scattered L&L across bottom strips and duplicate rows — those
// are gone; one consistent slot reads as intentional instead of insistent.
function LLMenuCard() {
  return (
    <Link
      href="/lunch-learn"
      className="group flex items-center gap-3 mt-5 px-3.5 py-3 rounded-xl transition-colors hover:bg-white/5"
      style={{ background: "var(--bg-card-neutral)", border: "1px solid rgba(249,115,22,0.22)" }}
    >
      <span className="relative flex-shrink-0 w-10 h-10">
        <span className="absolute inset-0 rounded-full" style={{ background: "rgba(249,115,22,0.14)", border: "1.5px solid rgba(249,115,22,0.45)" }} />
        <Image
          src="/images/lunch-learn/moose.png"
          alt="Moose, the HUB site dog"
          width={160}
          height={200}
          sizes="48px"
          className="absolute bottom-0 left-1/2 w-auto"
          style={{ height: "122%", maxWidth: "none", transform: "translateX(-50%)" }}
        />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[12px] font-bold" style={{ color: "#F5F0EB" }}>Book a Lunch &amp; Learn</span>
        <span className="block text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Free spec session — lunch on us</span>
      </span>
      <svg width="13" height="13" fill="none" stroke="#FB923C" viewBox="0 0 24 24" className="flex-shrink-0 transition-transform group-hover:translate-x-0.5">
        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

// ── Full-width Products mega menu ────────────────────────────────────────
// DDB polish pass (May 25):
//   • Orange #F97316 fails WCAG AA at 9–11px on dark. Small-text accents
//     bumped to ACCENT (#FB923C, ≈5.1:1 on #0D0D0D) so eyebrows + sublabels
//     are actually legible. Reserved #F97316 for larger or graphical use.
//   • Stamped Asphalt rebalanced: pillarNote + secondary link give the
//     single-product category visual parity with the 6-product column.
//   • Asphalt Repair tile image swapped (was GEVEKO-branded bag).
//   • Product taglines lifted from 45% → 62% white for readability.
const ACCENT = "#FB923C";  // small-text accent (WCAG-safe on dark surfaces)
const BRAND  = "#F97316";  // brand orange — reserved for larger / button use
function ProductsMegaMenu() {
  return (
    <MegaShell>
      <div className="grid grid-cols-12 gap-10 xl:gap-14 lg:min-h-[420px]">
        {/* Lead column */}
        <div className="col-span-12 lg:col-span-3">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: ACCENT }}>
            Products
          </p>
          <h3 className="text-xl font-bold leading-tight mb-2" style={{ color: "#F5F0EB" }}>
            Decorative pavement, engineered for Canadian streets.
          </h3>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            14 specified systems for crosswalks, transit lanes, plazas, and decorative hardscape — installed coast to coast.
          </p>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border border-white/15 bg-white/[0.03] hover:border-orange-400/60 hover:text-orange-400 transition-colors"
            style={{ color: "#F5F0EB" }}
          >
            Browse all products
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <LLMenuCard />
        </div>

        {/* Category columns — Applications' grammar, verbatim: orange
            letterspaced header over a hairline rule, flat items, chevron on
            hover. This menu used to be four photo-topped cards; the photos put
            10px type over imagery (illegible), the tallest card set the height
            for all four (dead wells under the short ones), and the whole panel
            ran ~250px taller than its siblings. The one thing Products keeps
            that Applications doesn't need: a one-line tagline per item —
            "MMAX" tells a specifier nothing, "MMA resin lane coating" does.
            Application names describe themselves; product names are brands. */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-2 xl:grid-cols-4 gap-x-12 xl:gap-x-16 gap-y-8">
          {PRODUCT_CATEGORIES.map((cat) => {
            const items = cat.slugs.flatMap((sl) => {
              const p = products.find((x) => x.slug === sl);
              return p ? [p] : [];
            });
            return (
              <div key={cat.label}>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3 pb-2.5" style={{
                  color: ACCENT,
                  borderBottom: "1px solid rgba(249,115,22,0.18)"
                }}>
                  {cat.label}
                </p>
                <div className="space-y-1">
                  {items.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="group flex items-start justify-between gap-2 px-2.5 py-2 rounded-md transition-colors hover:bg-white/5"
                    >
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold leading-snug group-hover:text-orange-400 transition-colors" style={{ color: "#F5F0EB" }}>
                          {p.name}
                        </span>
                        {PRODUCT_TAGLINE[p.slug] && (
                          <span className="block text-[11px] leading-snug mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.62)" }}>
                            {PRODUCT_TAGLINE[p.slug]}
                          </span>
                        )}
                      </span>
                      <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1.5" style={{ color: ACCENT }}>
                        <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ))}

                  {/* "See also" — the one structural extra a column may carry.
                      Uneven column lengths are fine in a text directory (the
                      Applications columns run 6/5/5/4); what a lean column
                      gets is a real secondary destination, not filler. */}
                  {cat.secondary && (
                    <Link
                      href={cat.secondary.href}
                      className="group flex items-start justify-between gap-2 px-2.5 py-2.5 mt-2 rounded-md transition-colors hover:bg-white/5"
                      style={{ borderTop: "1px solid var(--border-color)" }}
                    >
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: ACCENT }}>
                          See also
                        </span>
                        <span className="block text-[14px] font-semibold leading-tight mt-0.5 group-hover:text-orange-400 transition-colors" style={{ color: "#F5F0EB" }}>
                          {cat.secondary.label}
                        </span>
                        {cat.secondary.meta && (
                          <span className="block text-[11px] leading-snug mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.62)" }}>
                            {cat.secondary.meta}
                          </span>
                        )}
                      </span>
                      <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1.5" style={{ color: ACCENT }}>
                        <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </MegaShell>
  );
}

// ── Field Notes mega menu — the cinematic one ────────────────────────
// Products and Applications are directories and behave like twins: same
// grammar, same 420px floor. Field Notes is the editorial surface, and per
// Vern it goes the other way entirely: a full-bleed magazine cover, not a
// panel of columns. The featured story's photograph runs edge to edge under
// a scrim; the masthead and cover line sit on the image like a title page;
// the right rail is a glass surface carrying the latest three, the type
// index, one PROMOTED house slot (the 2027 Catalogue tonight — a real
// destination, never a fake advertiser), and the standing Lunch & Learn
// card. Same 10px letterspaced ACCENT labels and hairline rules as its
// siblings — the outlier in structure stays in the family by grammar.
function FieldNotesMegaMenu() {
  const [featured, ...rest] = FEATURED_POSTS;

  return (
    <div className="w-full max-h-[calc(100vh-72px)] overflow-y-auto overscroll-contain">
      <div className="relative lg:min-h-[calc(100vh-72px)]">
        {/* The cover, full bleed */}
        <Image
          src={featured.image}
          alt={featured.title}
          fill
          className="object-cover"
          style={{ objectPosition: "center 42%" }}
          sizes="100vw"
        />
        {/* Scrims: one for the title block, one to seat the masthead */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(5,8,14,0.96) 0%, rgba(5,8,14,0.42) 48%, rgba(5,8,14,0.30) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(5,8,14,0.55) 0%, rgba(5,8,14,0.12) 45%, transparent 70%)"
        }} />

        <div className="relative grid grid-cols-12 lg:min-h-[calc(100vh-72px)]">
          {/* Cover story */}
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-between gap-10 p-7 lg:p-10">
            {/* Masthead */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: ACCENT }}>
                Field Notes
              </p>
              <p className="text-lg font-bold leading-tight" style={{ color: "#F5F0EB" }}>
                What we learn from the road.
              </p>
              {/* The catalogue's signature dash — eyebrow, name, orange rule. */}
              <span aria-hidden className="block mt-2.5 mb-4 rounded-full" style={{ width: 44, height: 3, background: "#F97316" }} />
              <Link href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border border-white/20 bg-black/25 backdrop-blur-sm hover:border-orange-400/60 hover:text-orange-400 transition-colors"
                style={{ color: "#F5F0EB" }}
              >
                Browse all field notes
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>

            {/* Cover line */}
            <Link href={`/blog/${featured.slug}`} className="group block max-w-2xl">
              <span
                className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase mb-3 px-2.5 py-1 rounded"
                style={{ color: ACCENT, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}
              >
                {featured.category}
              </span>
              <span className="block font-black leading-[1.04]" style={{
                color: "#F5F0EB",
                fontSize: "clamp(1.9rem, 3.6vw, 3.4rem)",
                letterSpacing: "-0.025em",
                textShadow: "0 2px 24px rgba(0,0,0,0.45)",
              }}>
                {featured.title}
              </span>
              <span className="mt-3 flex items-center gap-2 text-sm font-semibold" style={{ color: ACCENT }}>
                Read field note
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
          </div>

          {/* The rail — glass over the cover */}
          <div
            className="col-span-12 lg:col-span-4 flex flex-col p-6 lg:p-7"
            style={{
              background: "rgba(7,11,18,0.84)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3 pb-2.5" style={{
              color: ACCENT,
              borderBottom: "1px solid rgba(249,115,22,0.18)"
            }}>
              Latest from the road
            </p>
            <div className="space-y-1">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-3 px-2 py-2 rounded-md transition-colors hover:bg-white/5"
                >
                  <div className="relative flex-shrink-0 rounded-md overflow-hidden" style={{ width: 52, height: 52 }}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="72px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: ACCENT }}>
                      {post.category}
                    </p>
                    <p className="text-[13px] font-semibold leading-snug group-hover:text-orange-400 transition-colors line-clamp-2" style={{ color: "#F5F0EB" }}>
                      {post.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Browse by type — slugs mirror lib/field-notes-taxonomy.ts;
                hardcoded so the nav bundle doesn't carry the whole taxonomy
                (keyword maps and all) for five stable links. */}
            <div className="mt-4 pt-3.5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                Browse by type
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {[
                  { label: "Case Studies", href: "/blog/case-studies" },
                  { label: "Project Profiles", href: "/blog/project-profiles" },
                  { label: "Guides", href: "/blog/guides" },
                  { label: "White Papers", href: "/blog/white-papers" },
                  { label: "Posts", href: "/blog/posts" },
                ].map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="text-[12px] font-semibold transition-colors hover:text-orange-400"
                    style={{ color: "rgba(255,255,255,0.68)" }}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* The advertisement slot — a designed space, honestly labelled.
                House promotions only: tonight it runs the 2027 Catalogue,
                a real page (/catalogue). If a partner placement ever lands
                here, the PROMOTED label is already telling the truth. */}
            <Link
              href="/catalogue"
              className="group block mt-auto rounded-xl px-4 py-3.5 transition-colors hover:bg-white/5"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.10) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(249,115,22,0.35)",
              }}
            >
              <span className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Promoted
                </span>
                <svg width="12" height="12" fill="none" stroke={ACCENT} viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="block text-[14px] font-bold" style={{ color: "#F5F0EB" }}>
                The 2027 Catalogue
              </span>
              <span className="block text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.62)" }}>
                Every system, spec, and pattern — one book.
              </span>
            </Link>

            <div className="mt-3">
              <LLMenuCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Full-width Applications mega menu ────────────────────────────────────
function ApplicationsMegaMenu() {
  return (
    <MegaShell>
      <div className="grid grid-cols-12 gap-10 xl:gap-14 lg:min-h-[420px]">
        {/* Lead column */}
        <div className="col-span-12 lg:col-span-3">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: ACCENT }}>
            Applications
          </p>
          <h3 className="text-xl font-bold leading-tight mb-2" style={{ color: "#F5F0EB" }}>
            Surfaces that do real work.
          </h3>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            Crosswalks, transit lanes, parks, plazas, parking lots, airfields — every surface where decorative pavement and durable markings meet the brief.
          </p>
          <Link href="/applications"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border border-white/15 bg-white/[0.03] hover:border-orange-400/60 hover:text-orange-400 transition-colors"
            style={{ color: "#F5F0EB" }}
          >
            Browse all applications
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <LLMenuCard />
        </div>

        {/* Category groupings — 4 columns, no subtext */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-2 xl:grid-cols-4 gap-x-12 xl:gap-x-16 gap-y-8">
          {APPLICATION_GROUPS.map((group) => {
            const items = group.slugs.flatMap((s) => {
              const a = applications.find((x) => x.slug === s);
              return a ? [a] : [];
            });
            return (
              <div key={group.label}>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3 pb-2.5" style={{
                  color: ACCENT,
                  borderBottom: "1px solid rgba(249,115,22,0.18)"
                }}>
                  {group.label}
                </p>
                <div className="space-y-1">
                  {items.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/applications/${a.slug}`}
                      className="group flex items-center justify-between gap-2 px-2.5 py-2.5 rounded-md transition-colors hover:bg-white/5"
                    >
                      <span className="text-[14px] font-semibold group-hover:text-orange-400 transition-colors" style={{ color: "#F5F0EB" }}>
                        {a.name}
                      </span>
                      <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#F97316" }}>
                        <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </MegaShell>
  );
}

// ── Mobile overlay ───────────────────────────────────────────────────
// ── Mobile menu — application taglines (mirror PRODUCT_TAGLINE style) ────────
const APP_TAGLINE: Record<string, string> = {
  "crosswalks":              "High-visibility pedestrian crossings",
  "bike-lanes":              "Durable coloured cycling infrastructure",
  "bus-lanes":               "MMA resin transit priority lanes",
  "pedestrian-safety":       "Slip-resistant pedestrian zones",
  "traffic-calming":         "Surface-based speed reduction",
  "regulatory-markings":     "Symbols, arrows, zone legends",
  "parks-paths":             "Coloured pathway treatments",
  "public-spaces":           "Plazas, promenades, gathering areas",
  "community-branding":      "Custom civic identity surfaces",
  "public-art":              "Large-scale pavement murals",
  "playgrounds":             "Vibrant schoolyard surfaces",
  "parking-lots":            "Markings, coatings, rejuvenation",
  "commercial-spaces":       "Branded commercial hardscape",
  "sport-courts":            "Sport surface colour and markings",
  "splash-pads":             "Coloured water play surfaces",
  "airports":                "Airfield thermoplastic markings",
  "private-driveways":       "Stamped decorative driveways",
  "residential-driveways":   "Stamped asphalt driveway systems",
  "townhomes":               "Development entry and sidewalks",
  "leed-urban-heat-island":  "Solar-reflective LEED coatings",
};

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
      style={{ color: "#F97316" }}
    >
      {children}
    </p>
  );
}

// Thin divider between category groups
function MobileGroupDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-1 pt-5 pb-2">
      <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: "var(--fill-subtle)" }} />
    </div>
  );
}

// Individual product or application row: 56px thumb + name + tagline + arrow
function MobileNavRow({
  href,
  imageUrl,
  name,
  tagline,
  onClose,
}: {
  href: string;
  imageUrl: string;
  name: string;
  tagline?: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-4 px-1 py-[18px] rounded-xl active:scale-[0.98] active:opacity-75 transition-[transform,opacity] duration-100"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Thumbnail */}
      <div
        className="flex-shrink-0 rounded-lg overflow-hidden"
        style={{ width: 56, height: 56 }}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={56}
          height={56}
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 65%" }}
          sizes="56px"
        />
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-[500] leading-tight truncate" style={{ color: "#F5F0EB" }}>{name}</p>
        {tagline && (
          <p className="text-[13px] mt-0.5 leading-snug truncate" style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>{tagline}</p>
        )}
      </div>
      {/* Arrow */}
      <svg className="flex-shrink-0 w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      style={{ color: "#F97316" }}
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
          style={{
            background: "#0D0D0D",
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
                style={{ width: 48, height: 48, color: "rgba(255,255,255,0.45)" }}
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
                  color: "#F5F0EB",
                  background: "var(--fill-subtle)",
                  border: "1px solid rgba(255,255,255,0.1)",
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
                      return (
                        <MobileNavRow
                          key={slug}
                          href={`/products/${slug}`}
                          imageUrl={p.imageUrl}
                          name={p.name}
                          tagline={PRODUCT_TAGLINE[slug]}
                          onClose={onClose}
                        />
                      );
                    })}
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
                      return (
                        <MobileNavRow
                          key={slug}
                          href={`/applications/${slug}`}
                          imageUrl={a.imageUrl}
                          name={a.name}
                          tagline={APP_TAGLINE[slug]}
                          onClose={onClose}
                        />
                      );
                    })}
                  </div>
                ))}
              </motion.div>

              {/* ── Field Notes ───────────────────────────────────── */}
              <motion.div variants={menuSectionVariants} className="mt-2">
                <div className="flex items-center justify-between">
                  <MobileMenuLabel>Field Notes</MobileMenuLabel>
                  <MobileViewAll href="/blog" label="All" onClose={onClose} />
                </div>
                <div className="mt-1 space-y-2">
                  {FEATURED_POSTS.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={onClose}
                      className="flex gap-4 p-3 rounded-2xl active:scale-[0.98] active:opacity-75 transition-[transform,opacity] duration-100"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 64, height: 64 }}>
                        <Image src={post.image} alt={post.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                        <p className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: "#F97316" }}>{post.category}</p>
                        <p className="text-[14px] font-[500] leading-snug line-clamp-2" style={{ color: "#F5F0EB" }}>{post.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* ── Secondary links ───────────────────────────────── */}
              <motion.div variants={menuSectionVariants} className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
                {[
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "Resources", href: "/resources" },
                  { label: "Lunch & Learn", href: "/lunch-learn" },
                  { label: "Project Gallery", href: "/gallery" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-4 px-1 text-[16px] font-[500] active:opacity-60 transition-opacity"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {link.label}
                    <svg className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#F97316" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                West · 604-309-8212
              </a>
              <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.12)" }} />
              <a
                href="tel:+14165409287"
                className="flex items-center gap-1.5 text-[12px] font-semibold active:opacity-60 transition-opacity"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#F97316" }}>
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
                color: "#fff",
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
  const [openPanel, setOpenPanel] = useState<"products" | "applications" | "fieldnotes" | null>(null);
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
      const triggerRef = openPanel === "products" ? productsBtnRef : openPanel === "applications" ? applicationsBtnRef : null;
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
                borderLeft: "1px solid rgba(255,255,255,0.12)",
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
                <path fill="#fff" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
              </svg>
              <span
                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1 }}
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors hover:text-orange-400 hover:bg-white/5"
              style={{ color: openPanel === "products" ? "#F97316" : "rgba(255,255,255,0.65)" }}
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors hover:text-orange-400 hover:bg-white/5"
              style={{ color: openPanel === "applications" ? "#F97316" : "rgba(255,255,255,0.65)" }}
            >
              Applications
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ opacity: 0.5, transform: openPanel === "applications" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Field Notes — navigates to /blog on click, shows dropdown on hover/focus */}
            <Link
              href="/blog"
              onMouseEnter={() => setOpenPanel("fieldnotes")}
              onFocus={() => setOpenPanel("fieldnotes")}
              onClick={() => setOpenPanel(null)}
              aria-expanded={openPanel === "fieldnotes"}
              aria-haspopup="true"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors hover:text-orange-400 hover:bg-white/5"
              style={{ color: openPanel === "fieldnotes" ? "#F97316" : "rgba(255,255,255,0.65)" }}
            >
              Field Notes
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ opacity: 0.5, transform: openPanel === "fieldnotes" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Plain links */}
            {PLAIN_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                onMouseEnter={() => setOpenPanel(null)}
                onFocus={() => setOpenPanel(null)}
                // whitespace-nowrap: at ~1100px "Field Notes" broke across two
                // lines and pushed the whole nav row out of alignment. A nav
                // label is a single object; it should shrink the row, never
                // wrap inside it.
                className="px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors hover:text-orange-400 hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right — search + CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search — a glass that opens into a bar.

                The always-on field was correct about making search findable and
                wrong about what it cost: 232px of permanent chrome in a row that
                also has to hold three mega-menu triggers, two links and a
                primary CTA. Vernon: "just make it a magnifying glass that
                expands to a search bar on click I guess."

                So it rests as a 36px glass and opens on hover, focus, or tap —
                one width transition, no state, nothing to fall out of sync. The
                label and shortcut fade in slightly behind the width so the bar
                appears to fill rather than to stretch, which is the difference
                between an animation and a gesture. Clicking at any point in the
                sequence opens the palette.

                CSS-only on purpose: a nav control that owns React state is a
                nav control that can be left open by a route change. */}
            {/* The bar grows leftward OVER the row, not through it.

                Expanding in normal flow works, but it shoves everything to its
                left along for the ride — 200px of nav sliding sideways every
                time a cursor crosses the glass. A control that rearranges the
                page on hover is a twitch, not an affordance. So the wrapper
                holds a fixed 36px in the layout and the bar is anchored to its
                right edge, opening across the nav on its own layer. Nothing
                else on the row moves. */}
            <span className="hidden lg:block relative flex-shrink-0" style={{ width: 36, height: 36 }}>
            <button
              onClick={openSearch}
              aria-label="Search the site"
              aria-keyshortcuts="Meta+K Control+K"
              className="group/search absolute right-0 top-0 flex items-center rounded-lg overflow-hidden
                         w-9 hover:w-[232px] focus-visible:w-[232px]
                         transition-[width,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                         hover:bg-[var(--bg-card-neutral)] focus-visible:bg-[var(--bg-card-neutral)]"
              style={{
                height: 36,
                border: "1px solid transparent",
                // At rest this is a bare glyph with no border and no label, so
                // it has to carry its own affordance: --text-faint read as
                // decoration next to the outlined Resources button beside it.
                color: "var(--text-secondary)",
                zIndex: 20,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
            >
              {/* The glass holds the 36px square on its own so the icon never
                  shifts as the bar grows out from behind it. */}
              <span className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34 }}>
                <svg
                  className="transition-colors duration-200 group-hover/search:stroke-[#F97316] group-focus-visible/search:stroke-[#F97316]"
                  width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </span>

              <span
                className="flex items-center gap-2 flex-1 min-w-0 pr-2
                           opacity-0 group-hover/search:opacity-100 group-focus-visible/search:opacity-100
                           transition-opacity duration-200 delay-100"
              >
                <span className="text-[13px] flex-1 text-left whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                  Search the site
                </span>
                <kbd
                  className="flex-shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: "var(--fill-subtle)", border: "1px solid var(--border-color)", color: "var(--text-faint)" }}
                >
                  {shortcutLabel}
                </kbd>
              </span>
            </button>
            </span>

            {/* Icon-only below lg, where the field will not fit. */}
            <button
              onClick={openSearch}
              aria-label="Search the site"
              className="lg:hidden flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
              style={{ width: 36, height: 36, color: "rgba(255,255,255,0.55)" }}
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>

            {/* Resources — ghost */}
            <a href="/resources"
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all hover:border-orange-500/50 hover:text-orange-400"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)" }}
            >
              Resources
            </a>

            {/* Lunch & Learn — gradient */}
            <a href="/lunch-learn"
              className="px-3 py-1.5 rounded-lg text-[13px] font-bold whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff" }}
            >
              Lunch &amp; Learn
            </a>
          </div>

          {/* Mobile — search + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {/* 44x44 tap targets — the mobile sweep found these at 36x36,
                under both the iOS 44pt and Android 48dp minimums. */}
            <button onClick={openSearch} aria-label="Open search" className="flex items-center justify-center" style={{ width: 44, height: 44, color: "rgba(255,255,255,0.6)" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} className="flex items-center justify-center" style={{ width: 44, height: 44, color: "rgba(255,255,255,0.6)" }}>
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
              id={openPanel === "products" ? "products-mega-menu" : openPanel === "applications" ? "applications-mega-menu" : undefined}
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
              {openPanel === "fieldnotes" && <FieldNotesMegaMenu />}
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
