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
  { label: "Field Notes", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const MOBILE_QUICK_ACTIONS = [
  { label: "Resources", href: "/resources" },
  { label: "Book Lunch & Learn", href: "/lunch-learn" },
];

// ── Search data ──────────────────────────────────────────────────────────────
const PAGES = [
  { label: "Field Notes", href: "/blog", desc: "Field notes and industry insights" },
  { label: "About", href: "/about", desc: "Our story and team" },
  { label: "Contact", href: "/contact", desc: "Get in touch with our team" },
  { label: "Resources", href: "/resources", desc: "Spec sheets, SDS, install guides" },
  { label: "Lunch & Learn", href: "/lunch-learn", desc: "Book a free product presentation" },
  { label: "Projects", href: "/projects", desc: "Browse our project portfolio" },
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
            <button onClick={() => setQuery("")} className="flex-shrink-0 p-1 rounded-md hover:bg-white/10" style={{ color: "rgba(255,255,255,0.4)" }}>
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
                {[{ label: "All Products", href: "/products" }, { label: "All Applications", href: "/applications" }, { label: "Project Gallery", href: "/projects" }, { label: "Spec Sheets", href: "/resources" }, { label: "Lunch & Learn", href: "/lunch-learn" }, { label: "Contact Us", href: "/contact" }].map((item) => (
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
    slugs: ["traffic-patterns-xd", "traffic-patterns", "decomark", "duratherm", "premark", "airmark"],
  },
  {
    label: "Coatings",
    slugs: ["streetbond", "streetbondsr", "mmax", "durashield"],
  },
  {
    label: "Stamped Asphalt & Concrete",
    slugs: ["streetprint"],
  },
  {
    label: "Asphalt Repair",
    slugs: ["fast-patch", "aquaphalt"],
  },
];

// ── Full-width Products mega menu ────────────────────────────────────────────
function ProductsMegaMenu() {
  const bySlug = (slugs: string[]) =>
    slugs.flatMap((s) => { const p = products.find((x) => x.slug === s); return p ? [p] : []; });

  const thermoplastics = bySlug(PRODUCT_CATEGORIES[0].slugs);
  const coatings       = bySlug(PRODUCT_CATEGORIES[1].slugs);
  const stamped        = bySlug(PRODUCT_CATEGORIES[2].slugs);
  const repair         = bySlug(PRODUCT_CATEGORIES[3].slugs);

  const ProductLink = ({ p }: { p: (typeof products)[0] }) => (
    <Link
      href={`/products/${p.slug}`}
      className="group flex items-start gap-2 px-2.5 py-2 rounded-lg transition-colors hover:bg-white/5"
    >
      <div className="mt-0.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "rgba(249,115,22,0.5)", marginTop: 7 }} />
      <div>
        <p className="text-sm font-semibold leading-tight group-hover:text-orange-400 transition-colors" style={{ color: "#F5F0EB" }}>{p.name}</p>
        {p.shortDesc && (
          <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>{p.shortDesc}</p>
        )}
      </div>
    </Link>
  );

  const CatLabel = ({ label }: { label: string }) => (
    <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2.5 px-2.5" style={{ color: "rgba(249,115,22,0.9)" }}>
      {label}
    </p>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-0">

        {/* Col 1 — Preformed Thermoplastics (widest, 2 cols of products) */}
        <div className="flex-[2] pr-6 border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <CatLabel label="Preformed Thermoplastics" />
          <div className="grid grid-cols-2 gap-x-1 gap-y-0">
            {thermoplastics.map((p) => <ProductLink key={p.slug} p={p} />)}
          </div>
        </div>

        {/* Col 2 — Coatings */}
        <div className="flex-[1.2] px-6 border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <CatLabel label="Coatings" />
          <div className="space-y-0">
            {coatings.map((p) => <ProductLink key={p.slug} p={p} />)}
          </div>
        </div>

        {/* Col 3 — Stamped + Repair stacked */}
        <div className="flex-[1] px-6 border-r space-y-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div>
            <CatLabel label="Stamped Asphalt & Concrete" />
            {stamped.map((p) => <ProductLink key={p.slug} p={p} />)}
          </div>
          <div>
            <CatLabel label="Asphalt Repair" />
            {repair.map((p) => <ProductLink key={p.slug} p={p} />)}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-56 pl-6 flex flex-col gap-3 flex-shrink-0">
          {/* Featured image */}
          <Link href="/projects" className="group relative rounded-xl overflow-hidden block" style={{ height: 130 }}>
            <Image
              src="/images/blog/best-crosswalks-canada/featured.jpg"
              alt="HUB Surface Systems projects"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="224px"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,11,18,0.92) 0%, rgba(7,11,18,0.2) 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: "#F97316" }}>Featured</p>
              <p className="text-xs font-semibold leading-snug text-white">Award-winning crosswalks across Canada</p>
            </div>
          </Link>

          {/* Quick links */}
          <div className="space-y-1.5">
            <Link href="/products"
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xs font-semibold">All Products</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href="/resources"
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xs font-semibold">Spec Sheets</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>

          <Link href="/lunch-learn"
            className="block w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold mt-auto"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff" }}
          >
            Book Lunch &amp; Learn
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Full-width Applications mega menu ────────────────────────────────────────
function ApplicationsMegaMenu() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        {/* All applications */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2.5 px-2.5" style={{ color: "rgba(249,115,22,0.9)" }}>All Applications</p>
          <div className="grid grid-cols-4 gap-x-1 gap-y-0">
            {applications.map((app) => (
              <Link key={app.slug} href={`/applications/${app.slug}`}
                className="group flex items-start gap-2 px-2.5 py-2 rounded-lg transition-colors hover:bg-white/5"
              >
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "rgba(249,115,22,0.5)", marginTop: 7 }} />
                <div>
                  <p className="text-sm font-semibold leading-tight group-hover:text-orange-400 transition-colors" style={{ color: "#F5F0EB" }}>{app.name}</p>
                  {app.shortDesc && (
                    <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>{app.shortDesc}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-56 pl-6 flex-shrink-0 flex flex-col gap-3">
          {/* Featured image */}
          <Link href="/projects" className="group relative rounded-xl overflow-hidden block" style={{ height: 130 }}>
            <Image
              src="/images/blog/decorative-crosswalk-meridian/featured.jpg"
              alt="HUB application projects"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="224px"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,11,18,0.92) 0%, rgba(7,11,18,0.2) 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: "#F97316" }}>Projects</p>
              <p className="text-xs font-semibold leading-snug text-white">See our work across Canada</p>
            </div>
          </Link>

          <div className="space-y-1.5">
            <Link href="/applications"
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xs font-semibold">All Applications</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href="/projects"
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xs font-semibold">Project Gallery</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>

          <Link href="/contact"
            className="block w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold mt-auto"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff" }}
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Mobile overlay ───────────────────────────────────────────────────────────
const MOBILE_PRODUCT_CATEGORIES = [
  { label: "Preformed Thermoplastics", slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"] },
  { label: "Coatings", slugs: ["streetbond", "streetbondsr", "mmax", "durashield"] },
  { label: "Stamped Asphalt & Concrete", slugs: ["streetprint"] },
  { label: "Asphalt Repair", slugs: ["fast-patch", "aquaphalt"] },
];

const MOBILE_APP_LINKS = [
  { label: "Crosswalks", href: "/applications/crosswalks" },
  { label: "Bike Lanes", href: "/applications/bike-lanes" },
  { label: "Bus Lanes", href: "/applications/bus-lanes" },
  { label: "Parking Lots", href: "/applications/parking-lots" },
  { label: "Parks & Paths", href: "/applications/parks-paths" },
  { label: "Community Branding", href: "/applications/community-branding" },
];

function MobileOverlay({ isOpen, onClose, onSearchOpen }: { isOpen: boolean; onClose: () => void; onSearchOpen: () => void }) {
  const [expandedSection, setExpandedSection] = useState<"products" | "applications" | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute top-0 left-0 right-0 overflow-y-auto"
            style={{ background: "#070b12", borderBottom: "1px solid rgba(255,255,255,0.08)", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <Link href="/" onClick={onClose}>
                <Image src="/images/hub-official-logo.svg" alt="HUB Surface Systems" width={140} height={33} style={{ height: 30, width: "auto" }} unoptimized />
              </Link>
              <button onClick={onClose} className="p-2 rounded-lg" style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-4 space-y-1">
              {/* Mobile search */}
              <button onClick={() => { onClose(); onSearchOpen(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 text-left"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.4)" }}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
                </svg>
                <span className="text-sm">Search products, applications…</span>
              </button>

              {/* Products expandable */}
              <div>
                <button
                  className="w-full flex items-center justify-between py-3 px-3 rounded-xl text-base font-semibold transition-colors hover:bg-white/5"
                  style={{ color: expandedSection === "products" ? "#F97316" : "#F5F0EB" }}
                  onClick={() => setExpandedSection(expandedSection === "products" ? null : "products")}
                >
                  Products
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{ opacity: 0.4, transform: expandedSection === "products" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedSection === "products" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-3 pb-2 pt-1 space-y-3">
                        {MOBILE_PRODUCT_CATEGORIES.map((cat) => (
                          <div key={cat.label}>
                            <p className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 mb-1" style={{ color: "rgba(249,115,22,0.6)" }}>{cat.label}</p>
                            <div className="grid grid-cols-2 gap-x-1">
                              {cat.slugs.map((slug) => {
                                const p = products.find((x) => x.slug === slug);
                                if (!p) return null;
                                return (
                                  <Link key={slug} href={`/products/${slug}`}
                                    className="px-2 py-1.5 text-sm rounded-lg hover:bg-white/5 transition-colors"
                                    style={{ color: "rgba(255,255,255,0.72)" }}
                                    onClick={onClose}
                                  >{p.name}</Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        <Link href="/products"
                          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold"
                          style={{ color: "#F97316" }}
                          onClick={onClose}
                        >View all products →</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Applications expandable */}
              <div>
                <button
                  className="w-full flex items-center justify-between py-3 px-3 rounded-xl text-base font-semibold transition-colors hover:bg-white/5"
                  style={{ color: expandedSection === "applications" ? "#F97316" : "#F5F0EB" }}
                  onClick={() => setExpandedSection(expandedSection === "applications" ? null : "applications")}
                >
                  Applications
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{ opacity: 0.4, transform: expandedSection === "applications" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedSection === "applications" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-3 pb-2 pt-1">
                        <div className="grid grid-cols-2 gap-x-1">
                          {MOBILE_APP_LINKS.map((app) => (
                            <Link key={app.href} href={app.href}
                              className="px-2 py-1.5 text-sm rounded-lg hover:bg-white/5 transition-colors"
                              style={{ color: "rgba(255,255,255,0.72)" }}
                              onClick={onClose}
                            >{app.label}</Link>
                          ))}
                        </div>
                        <Link href="/applications"
                          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold mt-1"
                          style={{ color: "#F97316" }}
                          onClick={onClose}
                        >View all applications →</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Plain links */}
              {PLAIN_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="flex items-center justify-between py-3 px-3 text-base font-semibold rounded-xl hover:bg-white/5 transition-colors"
                  style={{ color: "#F5F0EB" }}
                  onClick={onClose}
                >
                  {link.label}
                  <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              ))}
            </div>

            {/* Bottom CTAs */}
            <div className="px-4 pb-6 pt-2 border-t space-y-2.5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <Link href="/resources"
                className="block px-4 py-3 rounded-xl text-sm font-semibold text-center transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.8)" }}
                onClick={onClose}
              >
                Resources
              </Link>
              <Link href="/lunch-learn"
                className="block px-4 py-3 rounded-xl text-sm font-bold text-center"
                style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff" }}
                onClick={onClose}
              >
                Book Lunch &amp; Learn
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Nav ─────────────────────────────────────────────────────────────────
export default function Nav() {
  const [openPanel, setOpenPanel] = useState<"products" | "applications" | null>(null);
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

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/hub-official-logo.svg"
              alt="HUB Surface Systems"
              width={160}
              height={38}
              style={{ height: 34, width: "auto" }}
              priority
              unoptimized
            />
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
              style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.1)" }}
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
            <button onClick={openSearch} className="p-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" style={{ color: "rgba(255,255,255,0.6)" }}>
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
