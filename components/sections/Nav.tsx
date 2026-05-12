"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";

// ── Nav link config ──────────────────────────────────────────────────────────
const PLAIN_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ── Search data ──────────────────────────────────────────────────────────────
const PAGES = [
  { label: "Field Notes", href: "/blog", desc: "Field notes and industry insights" },
  { label: "About", href: "/about", desc: "Our story and team" },
  { label: "Contact", href: "/contact", desc: "Get in touch with our team" },
  { label: "Resources", href: "/resources", desc: "Spec sheets, SDS, install guides" },
  { label: "Lunch & Learn", href: "/lunch-learn", desc: "Book a free product presentation" },
  { label: "Gallery", href: "/gallery", desc: "Photo archive of our installations" },
];

const CATEGORIES = [
  { label: "Preformed Thermoplastics", href: "/products", desc: "TrafficPatternsXD, TrafficPatterns, PreMark, DuraTherm, DecoMark, AirMark" },
  { label: "Coatings", href: "/products", desc: "StreetBond, StreetBondSR, MMAX, DuraShield — coloured pavement coatings" },
  { label: "Stamped Asphalt & Concrete", href: "/products", desc: "StreetPrint — in-place decorative stamped asphalt" },
  { label: "Asphalt Repair", href: "/products", desc: "Fast Patch, Aquaphalt — permanent cold-mix pothole repair" },
];

// ── Search overlay ───────────────────────────────────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const q = query.toLowerCase().trim();
  const matchedProducts = q.length < 2 ? [] : products.filter(p => p.name.toLowerCase().includes(q) || p.shortDesc?.toLowerCase().includes(q));
  const matchedApps = q.length < 2 ? [] : applications.filter(a => a.name.toLowerCase().includes(q) || a.shortDesc?.toLowerCase().includes(q));
  const matchedPages = q.length < 2 ? [] : PAGES.filter(p => p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  const matchedCategories = q.length < 2 ? [] : CATEGORIES.filter(c => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  const hasResults = matchedProducts.length > 0 || matchedApps.length > 0 || matchedPages.length > 0 || matchedCategories.length > 0;
  const showEmpty = q.length >= 2 && !hasResults;

  const handleResultClick = (href: string) => { onClose(); router.push(href); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh]"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -12 }} transition={{ duration: 0.18 }}
        className="w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "rgba(15,20,32,0.98)", border: "1px solid rgba(249,115,22,0.4)", boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}>
          <svg className="flex-shrink-0" width="18" height="18" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, applications, pages…" className="flex-1 bg-transparent outline-none text-base"
            style={{ color: "#F5F0EB", caretColor: "#F97316" }} />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="flex-shrink-0 p-1 rounded-md hover:bg-white/10" style={{ color: "rgba(255,255,255,0.4)" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeWidth={2} strokeLinecap="round" /></svg>
            </button>
          )}
          <kbd className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)" }}>ESC</kbd>
        </div>

        {/* Results panel */}
        <div className="mt-2 rounded-2xl overflow-hidden" style={{ background: "rgba(10,14,23,0.98)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
          {/* Default quick links */}
          {q.length < 2 && (
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>Quick links</p>
              <div className="grid grid-cols-2 gap-1">
                {[{ label: "All Products", href: "/products" }, { label: "All Applications", href: "/applications" }, { label: "Project Gallery", href: "/gallery" }, { label: "Spec Sheets", href: "/resources" }, { label: "Lunch & Learn", href: "/lunch-learn" }, { label: "Contact Us", href: "/contact" }].map((item) => (
                  <button key={item.href} onClick={() => handleResultClick(item.href)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-white/5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <svg width="13" height="13" fill="none" stroke="rgba(249,115,22,0.6)" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {q.length >= 2 && hasResults && (
            <div>
              {matchedProducts.length > 0 && (
                <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>Products</p>
                  {matchedProducts.slice(0, 4).map((p) => (
                    <button key={p.slug} onClick={() => handleResultClick(`/products/${p.slug}`)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5">
                      <div><p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{p.name}</p>{p.shortDesc && <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.shortDesc}</p>}</div>
                    </button>
                  ))}
                </div>
              )}
              {matchedApps.length > 0 && (
                <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>Applications</p>
                  {matchedApps.slice(0, 4).map((a) => (
                    <button key={a.slug} onClick={() => handleResultClick(`/applications/${a.slug}`)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5">
                      <div><p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{a.name}</p>{a.shortDesc && <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{a.shortDesc}</p>}</div>
                    </button>
                  ))}
                </div>
              )}
              {matchedCategories.length > 0 && (
                <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>Product Categories</p>
                  {matchedCategories.map((c) => (
                    <button key={c.label} onClick={() => handleResultClick(c.href)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5">
                      <div><p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{c.label}</p><p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{c.desc}</p></div>
                    </button>
                  ))}
                </div>
              )}
              {matchedPages.length > 0 && (
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>Pages</p>
                  {matchedPages.map((p) => (
                    <button key={p.href} onClick={() => handleResultClick(p.href)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5">
                      <div><p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{p.label}</p><p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.desc}</p></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {showEmpty && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>No results for <span style={{ color: "#F5F0EB" }}>"{ query}"</span></p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Try a product name, application type, or page</p>
            </div>
          )}

          <div className="px-4 py-2.5 border-t flex items-center" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Type to search · <kbd className="font-mono">ESC</kbd> to close</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Product category data ────────────────────────────────────────────────────
const PRODUCT_CATEGORIES = [
  {
    label: "Preformed Thermoplastics",
    tag: "Heat-fused permanent markings",
    image: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"],
  },
  {
    label: "Coatings",
    tag: "Coloured pavement systems",
    image: "/images/products/streetbond/streetbond-01.png",
    slugs: ["streetbond", "streetbondsr", "mmax", "durashield"],
  },
  {
    label: "Stamped Asphalt",
    tag: "In-place decorative hardscape",
    image: "/images/products/streetprint/streetprint-01.jpg",
    slugs: ["streetprint"],
  },
  {
    label: "Asphalt Repair",
    tag: "Permanent pothole repair",
    image: "/images/products/streetprint/streetprint-40.jpg",
    slugs: ["fast-patch", "aquaphalt"],
  },
];

// ── Mega-menu micro-taglines per product (5–7 word noun phrases per Vernon) ──
const PRODUCT_TAGLINE: Record<string, string> = {
  "traffic-patterns-xd": "Aggregate-reinforced thermoplastic",
  "traffic-patterns":    "Preformed thermoplastic markings",
  "premark":             "Symbols, arrows, regulatory markings",
  "duratherm":           "Inlaid flush-mount thermoplastic",
  "decomark":            "Custom graphic thermoplastic",
  "airmark":             "Airfield thermoplastic markings",
  "streetbond":          "Coloured pavement coating",
  "streetbondsr":        "Solar-reflective coating",
  "mmax":                "MMA resin lane coating",
  "durashield":          "Pavement maintenance coating",
  "streetprint":         "Stamped asphalt patterns",
  "fast-patch":          "Permanent pothole repair",
  "chipfill":            "Cold-pour crack and joint repair",
  "aggrefill":           "Aggregate-filled pothole repair",
  "aquaphalt":           "Water-activated cold-mix repair",
};

// ── Application category groupings for mega menu ─────────────────────────────
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

// ── Curated Field Notes for mega menu ────────────────────────────────────────
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

// ── Mega menu — shared shell ─────────────────────────────────────────────────
// Wide container, generous padding, dark surface, accent top line.
function MegaShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1480px] mx-auto px-6 lg:px-10 py-10">
      {children}
    </div>
  );
}

// ── Full-width Products mega menu ────────────────────────────────────────────
function ProductsMegaMenu() {
  return (
    <MegaShell>
      <div className="grid grid-cols-12 gap-8">
        {/* Lead column */}
        <div className="col-span-12 lg:col-span-3">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#F97316" }}>
            Products
          </p>
          <h3 className="text-2xl font-bold leading-tight mb-3" style={{ color: "#F5F0EB" }}>
            Decorative pavement, engineered for Canadian streets.
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            13 specified systems for crosswalks, transit lanes, plazas, and decorative hardscape — installed coast to coast.
          </p>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}
          >
            Browse all products
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>

        {/* Category tiles — 4 cards with image headers */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCT_CATEGORIES.map((cat) => {
            const items = cat.slugs.flatMap((s) => {
              const p = products.find((x) => x.slug === s);
              return p ? [p] : [];
            });
            return (
              <div
                key={cat.label}
                className="rounded-xl overflow-hidden flex flex-col"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Image header — bumped from 92 to 124px + subject-bias crop (pavement in lower 2/3 of source) */}
                <Link href="/products" className="relative block group" style={{ height: 124 }}>
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: "center 65%" }}
                    sizes="(max-width:1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(to top, rgba(7,11,18,0.96) 0%, rgba(7,11,18,0.55) 55%, rgba(7,11,18,0.1) 100%)"
                  }} />
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "#F97316" }}>
                      {cat.tag}
                    </p>
                    <p className="text-sm font-bold leading-tight" style={{ color: "#F5F0EB" }}>{cat.label}</p>
                  </div>
                </Link>

                {/* Product list — name + 5-7 word tagline per Vernon */}
                <div className="flex-1 px-3 py-3 space-y-0.5">
                  {items.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="group flex items-start justify-between gap-2 px-2 py-2 rounded-md transition-colors hover:bg-white/5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight group-hover:text-orange-400 transition-colors" style={{ color: "#F5F0EB" }}>
                          {p.name}
                        </p>
                        {PRODUCT_TAGLINE[p.slug] && (
                          <p className="text-[11px] leading-snug mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                            {PRODUCT_TAGLINE[p.slug]}
                          </p>
                        )}
                      </div>
                      <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1.5" style={{ color: "#F97316" }}>
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

      {/* Bottom strip — secondary entry points */}
      <div className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/resources"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Spec sheets</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>TDS, install guides, SDS</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <Link href="/projects"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Project gallery</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>See products in the field</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <Link href="/lunch-learn"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Lunch &amp; Learn</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Free CPD session for your team</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </MegaShell>
  );
}

// ── Field Notes mega menu ────────────────────────────────────────────────────
function FieldNotesMegaMenu() {
  const [featured, ...rest] = FEATURED_POSTS;

  return (
    <MegaShell>
      <div className="grid grid-cols-12 gap-8">
        {/* Lead column */}
        <div className="col-span-12 lg:col-span-3">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#F97316" }}>
            Field Notes
          </p>
          <h3 className="text-2xl font-bold leading-tight mb-3" style={{ color: "#F5F0EB" }}>
            What we learn from the road.
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            Project profiles, case studies, technical guides, and white papers from 30+ years of decorative pavement work across Canada.
          </p>
          <div className="space-y-2.5">
            <Link href="/blog"
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-all"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}
            >
              <span className="text-xs font-bold">All field notes</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href="/projects"
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <span className="text-xs font-semibold">Project gallery</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href="/resources"
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <span className="text-xs font-semibold">Resources &amp; spec sheets</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>

        {/* Featured large card — taller for parity with Products/Applications mega heights */}
        <Link
          href={`/blog/${featured.slug}`}
          className="col-span-12 lg:col-span-5 group relative rounded-xl overflow-hidden block"
          style={{ minHeight: 360 }}
        >
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width:1024px) 100vw, 620px"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(7,11,18,0.96) 0%, rgba(7,11,18,0.55) 50%, rgba(7,11,18,0.1) 100%)"
          }} />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span
              className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase mb-3 px-2.5 py-1 rounded"
              style={{ color: "#F97316", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}
            >
              {featured.category}
            </span>
            <p className="text-lg lg:text-xl font-bold leading-tight" style={{ color: "#F5F0EB" }}>
              {featured.title}
            </p>
            <p className="text-sm mt-2 flex items-center gap-2 font-semibold" style={{ color: "#F97316" }}>
              Read field note
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </p>
          </div>
        </Link>

        {/* Recent posts grid — slightly larger thumbnails for parity */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 96, height: 96 }}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: "#F97316" }}>
                  {post.category}
                </p>
                <p className="text-sm font-semibold leading-snug group-hover:text-orange-400 transition-colors line-clamp-2" style={{ color: "#F5F0EB" }}>
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom strip — secondary entry points (matches Products + Applications mega for peer-parity visual weight) */}
      <div className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/blog"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>All field notes</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Project profiles, case studies, guides</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <Link href="/projects"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Project gallery</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Installations across Canada</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <Link href="/resources"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Resources</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Spec sheets, install guides, SDS</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </MegaShell>
  );
}

// ── Full-width Applications mega menu ────────────────────────────────────────
function ApplicationsMegaMenu() {
  return (
    <MegaShell>
      <div className="grid grid-cols-12 gap-8">
        {/* Lead column */}
        <div className="col-span-12 lg:col-span-3">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#F97316" }}>
            Applications
          </p>
          <h3 className="text-2xl font-bold leading-tight mb-3" style={{ color: "#F5F0EB" }}>
            Surfaces that do real work.
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            Crosswalks, transit lanes, parks, plazas, parking lots, airfields — every surface where decorative pavement and durable markings meet the brief.
          </p>
          <Link href="/applications"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}
          >
            Browse all applications
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>

        {/* Category groupings — 4 columns, no subtext */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7">
          {APPLICATION_GROUPS.map((group) => {
            const items = group.slugs.flatMap((s) => {
              const a = applications.find((x) => x.slug === s);
              return a ? [a] : [];
            });
            return (
              <div key={group.label}>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3 pb-2.5" style={{
                  color: "rgba(249,115,22,0.95)",
                  borderBottom: "1px solid rgba(249,115,22,0.18)"
                }}>
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {items.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/applications/${a.slug}`}
                      className="group flex items-center justify-between gap-2 px-2 py-2 rounded-md transition-colors hover:bg-white/5"
                    >
                      <span className="text-sm font-semibold group-hover:text-orange-400 transition-colors" style={{ color: "#F5F0EB" }}>
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

      {/* Bottom strip — secondary entry points */}
      <div className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/projects"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Project gallery</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Real installations, real outcomes</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <Link href="/blog"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Field notes</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Project profiles &amp; case studies</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <Link href="/contact"
          className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Request a quote</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Talk to your regional rep</p>
          </div>
          <svg width="14" height="14" fill="none" stroke="#F97316" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>
    </MegaShell>
  );
}

// ── Mobile overlay ───────────────────────────────────────────────────────────
// Mobile reuses the desktop PRODUCT_CATEGORIES + APPLICATION_GROUPS for consistency.
const MOBILE_PRODUCT_CATEGORIES = PRODUCT_CATEGORIES.map(({ label, slugs }) => ({ label, slugs }));

// Mobile expandable section — single source for Products/Apps/Field Notes
function MobileSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-3 text-[17px] font-semibold transition-colors"
        style={{ color: expanded ? "#F97316" : "#F5F0EB" }}
      >
        {label}
        <svg
          width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          style={{ opacity: 0.5, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileOverlay({ isOpen, onClose, onSearchOpen }: { isOpen: boolean; onClose: () => void; onSearchOpen: () => void }) {
  const [expandedSection, setExpandedSection] = useState<"products" | "applications" | "fieldnotes" | null>(null);

  // Lock body scroll while the full-screen menu is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] md:hidden"
          style={{ background: "#070b12" }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-y-auto"
            style={{ background: "#070b12" }}
          >
            {/* Top bar — sticky for long menus */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(7,11,18,0.96)", backdropFilter: "blur(12px)" }}
            >
              <Link href="/" onClick={onClose}>
                <Image src="/images/hub-official-logo.svg" alt="HUB Surface Systems" width={150} height={36} style={{ height: 32, width: "auto" }} unoptimized />
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex items-center justify-center rounded-full transition-colors"
                style={{
                  width: 40, height: 40,
                  color: "#F5F0EB",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-6">
              {/* Mobile search */}
              <button onClick={() => { onClose(); onSearchOpen(); }}
                className="w-full flex items-center gap-3 px-4 mb-6 text-left"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.4)", borderRadius: 12, height: 48 }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
                </svg>
                <span className="text-[15px]">Search products, applications…</span>
              </button>

              {/* Products expandable */}
              <MobileSection
                label="Products"
                expanded={expandedSection === "products"}
                onToggle={() => setExpandedSection(expandedSection === "products" ? null : "products")}
              >
                <div className="space-y-5">
                  {MOBILE_PRODUCT_CATEGORIES.map((cat) => (
                    <div key={cat.label}>
                      <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2.5 px-1" style={{ color: "rgba(249,115,22,0.95)" }}>{cat.label}</p>
                      <div className="grid grid-cols-2 gap-1">
                        {cat.slugs.map((slug) => {
                          const p = products.find((x) => x.slug === slug);
                          if (!p) return null;
                          return (
                            <Link key={slug} href={`/products/${slug}`}
                              className="px-3 py-2.5 text-[15px] rounded-lg hover:bg-white/5 transition-colors font-medium"
                              style={{ color: "#F5F0EB" }}
                              onClick={onClose}
                            >{p.name}</Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <Link href="/products"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-bold"
                    style={{ color: "#F97316" }}
                    onClick={onClose}
                  >View all products
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </div>
              </MobileSection>

              {/* Applications expandable */}
              <MobileSection
                label="Applications"
                expanded={expandedSection === "applications"}
                onToggle={() => setExpandedSection(expandedSection === "applications" ? null : "applications")}
              >
                <div className="space-y-5">
                  {APPLICATION_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2.5 px-1" style={{ color: "rgba(249,115,22,0.95)" }}>{group.label}</p>
                      <div className="grid grid-cols-2 gap-1">
                        {group.slugs.map((slug) => {
                          const a = applications.find((x) => x.slug === slug);
                          if (!a) return null;
                          return (
                            <Link key={slug} href={`/applications/${slug}`}
                              className="px-3 py-2.5 text-[15px] rounded-lg hover:bg-white/5 transition-colors font-medium"
                              style={{ color: "#F5F0EB" }}
                              onClick={onClose}
                            >{a.name}</Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <Link href="/applications"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-bold"
                    style={{ color: "#F97316" }}
                    onClick={onClose}
                  >View all applications
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </div>
              </MobileSection>

              {/* Field Notes expandable */}
              <MobileSection
                label="Field Notes"
                expanded={expandedSection === "fieldnotes"}
                onToggle={() => setExpandedSection(expandedSection === "fieldnotes" ? null : "fieldnotes")}
              >
                <div className="space-y-3">
                  {FEATURED_POSTS.slice(0, 3).map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                      onClick={onClose}
                    >
                      <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 64, height: 64 }}>
                        <Image src={post.image} alt={post.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: "#F97316" }}>{post.category}</p>
                        <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: "#F5F0EB" }}>{post.title}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/blog"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg"
                      style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff" }}
                      onClick={onClose}
                    >All field notes →</Link>
                    <Link href="/projects"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg"
                      style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
                      onClick={onClose}
                    >Project gallery →</Link>
                  </div>
                </div>
              </MobileSection>

              {/* Plain links */}
              <div className="mt-2 border-t pt-4 space-y-0.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {PLAIN_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center justify-between py-3.5 px-3 text-[17px] font-semibold rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: "#F5F0EB" }}
                    onClick={onClose}
                  >
                    {link.label}
                    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                ))}
                <Link href="/resources"
                  className="flex items-center justify-between py-3.5 px-3 text-[17px] font-semibold rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: "#F5F0EB" }}
                  onClick={onClose}
                >
                  Resources
                  <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>

            {/* Sticky bottom CTA */}
            <div
              className="sticky bottom-0 px-5 pt-4 pb-5 border-t"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(7,11,18,0.96)", backdropFilter: "blur(12px)" }}
            >
              <Link href="/lunch-learn"
                className="flex items-center justify-center gap-2 w-full px-4 rounded-xl text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", height: 52, boxShadow: "0 4px 20px rgba(249,115,22,0.35)" }}
                onClick={onClose}
              >
                Book a Lunch &amp; Learn
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <div className="mt-3 flex items-center justify-center gap-4 text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                <a href="tel:+14165409287" className="font-semibold hover:text-orange-400 transition-colors">East · 416-540-9287</a>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                <a href="tel:+16043098212" className="font-semibold hover:text-orange-400 transition-colors">West · 604-309-8212</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Nav ─────────────────────────────────────────────────────────────────
export default function Nav() {
  const [openPanel, setOpenPanel] = useState<"products" | "applications" | "fieldnotes" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

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

  // Scroll state — adds shadow + accent border on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
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
            : "1px solid rgba(255,255,255,0.07)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.55), 0 1px 0 rgba(249,115,22,0.08)"
            : "none",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseLeave={() => setOpenPanel(null)}
      >
        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">

          {/* Logo + integrated "Canadian" accent — small flag glyph + label, vertically centered with the logo wordmark */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <Image
              src="/images/hub-official-logo.svg"
              alt="HUB Surface Systems"
              width={160}
              height={38}
              style={{ height: 34, width: "auto" }}
              priority
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
                style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1 }}
              >
                Canadian
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">

            {/* Products mega menu trigger */}
            <button
              onMouseEnter={() => setOpenPanel("products")}
              onClick={() => setOpenPanel(openPanel === "products" ? null : "products")}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-orange-400 hover:bg-white/5"
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
              onMouseEnter={() => setOpenPanel("applications")}
              onClick={() => setOpenPanel(openPanel === "applications" ? null : "applications")}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-orange-400 hover:bg-white/5"
              style={{ color: openPanel === "applications" ? "#F97316" : "rgba(255,255,255,0.65)" }}
            >
              Applications
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ opacity: 0.5, transform: openPanel === "applications" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Field Notes dropdown trigger */}
            <button
              onMouseEnter={() => setOpenPanel("fieldnotes")}
              onClick={() => setOpenPanel(openPanel === "fieldnotes" ? null : "fieldnotes")}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-orange-400 hover:bg-white/5"
              style={{ color: openPanel === "fieldnotes" ? "#F97316" : "rgba(255,255,255,0.65)" }}
            >
              Field Notes
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ opacity: 0.5, transform: openPanel === "fieldnotes" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Plain links */}
            {PLAIN_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                onMouseEnter={() => setOpenPanel(null)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-orange-400 hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right — search + CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <span className="text-xs hidden lg:block">Search</span>
            </button>

            {/* Resources — ghost */}
            <a href="/resources"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:border-orange-500/50 hover:text-orange-400"
              style={{ border: "1px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.75)" }}
            >
              Resources
            </a>

            {/* Lunch & Learn — gradient */}
            <a href="/lunch-learn"
              className="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff" }}
            >
              Lunch &amp; Learn
            </a>
          </div>

          {/* Mobile — search + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={openSearch} aria-label="Open search" className="p-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} className="p-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Full-width mega menu panels */}
        <AnimatePresence>
          {openPanel && (
            <motion.div
              key={openPanel}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{
                background: "rgba(7,11,18,0.98)",
                borderTop: "1px solid rgba(255,255,255,0.07)",
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

        <MobileOverlay isOpen={mobileOpen} onClose={() => setMobileOpen(false)} onSearchOpen={openSearch} />
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </>
  );
}
