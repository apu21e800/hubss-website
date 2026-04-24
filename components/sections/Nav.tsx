"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";

const PLAIN_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
];

const QUICK_ACTIONS = [
  { label: "Request Spec Sheet", href: "/contact" },
  { label: "Book Lunch & Learn", href: "/lunch-learn" },
];

// ── Static pages searchable in the overlay ──────────────────────────────────
const PAGES = [
  { label: "Projects", href: "/projects", desc: "Browse our project portfolio" },
  { label: "About", href: "/about", desc: "Our story and team" },
  { label: "Blog", href: "/blog", desc: "Field notes and industry insights" },
  { label: "Resources", href: "/resources", desc: "Spec sheets, SDS, install guides" },
  { label: "Contact", href: "/contact", desc: "Get in touch with our team" },
  { label: "Lunch & Learn", href: "/lunch-learn", desc: "Book a free product presentation" },
];

// ── Search overlay ───────────────────────────────────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const matchedProducts = q.length < 2 ? [] : products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDesc?.toLowerCase().includes(q)
  );

  const matchedApps = q.length < 2 ? [] : applications.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.shortDesc?.toLowerCase().includes(q)
  );

  const matchedPages = q.length < 2 ? [] : PAGES.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
  );

  const hasResults = matchedProducts.length > 0 || matchedApps.length > 0 || matchedPages.length > 0;
  const showEmpty = q.length >= 2 && !hasResults;

  // Default suggestions when no query
  const showDefaults = q.length < 2;

  const handleResultClick = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh]"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -12 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(15, 20, 32, 0.98)",
            border: "1px solid rgba(249,115,22,0.4)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,115,22,0.1)",
          }}
        >
          <svg className="flex-shrink-0" width="18" height="18" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth={2} />
            <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, applications, pages…"
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: "#F5F0EB", caretColor: "#F97316" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="flex-shrink-0 p-1 rounded-md transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          )}
          <kbd
            className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            ESC
          </kbd>
        </div>

        {/* Results panel */}
        <div
          className="mt-2 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10, 14, 23, 0.98)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Default state */}
          {showDefaults && (
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                Quick links
              </p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: "All Products", href: "/products" },
                  { label: "All Applications", href: "/applications" },
                  { label: "Project Gallery", href: "/projects" },
                  { label: "Spec Sheets", href: "/resources" },
                  { label: "Lunch & Learn", href: "/lunch-learn" },
                  { label: "Contact Us", href: "/contact" },
                ].map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleResultClick(item.href)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-white/5"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    <svg width="13" height="13" fill="none" stroke="rgba(249,115,22,0.6)" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!showDefaults && hasResults && (
            <div className="divide-y" style={{ divideColor: "rgba(255,255,255,0.05)" }}>
              {matchedProducts.length > 0 && (
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>
                    Products
                  </p>
                  <div className="space-y-0.5">
                    {matchedProducts.slice(0, 4).map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => handleResultClick(`/products/${p.slug}`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-white/5"
                      >
                        <svg width="14" height="14" fill="none" stroke="rgba(249,115,22,0.5)" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                          <path d="M3 9h18M9 21V9" strokeWidth={2} />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{p.name}</p>
                          {p.shortDesc && (
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.shortDesc}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedApps.length > 0 && (
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>
                    Applications
                  </p>
                  <div className="space-y-0.5">
                    {matchedApps.slice(0, 4).map((a) => (
                      <button
                        key={a.slug}
                        onClick={() => handleResultClick(`/applications/${a.slug}`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-white/5"
                      >
                        <svg width="14" height="14" fill="none" stroke="rgba(249,115,22,0.5)" viewBox="0 0 24 24">
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth={2} />
                          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2} />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{a.name}</p>
                          {a.shortDesc && (
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{a.shortDesc}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedPages.length > 0 && (
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>
                    Pages
                  </p>
                  <div className="space-y-0.5">
                    {matchedPages.map((p) => (
                      <button
                        key={p.href}
                        onClick={() => handleResultClick(p.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-white/5"
                      >
                        <svg width="14" height="14" fill="none" stroke="rgba(249,115,22,0.5)" viewBox="0 0 24 24">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2} strokeLinecap="round" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{p.label}</p>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {showEmpty && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                No results for <span style={{ color: "#F5F0EB" }}>"{query}"</span>
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                Try searching for a product name, application type, or page
              </p>
            </div>
          )}

          {/* Footer hint */}
          <div
            className="px-4 py-2.5 flex items-center gap-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
          >
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              Type to search · <kbd className="font-mono">↵</kbd> to select · <kbd className="font-mono">ESC</kbd> to close
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Mega menu panels ─────────────────────────────────────────────────────────
function ProductsPanel() {
  const featured = products.slice(0, 6);
  return (
    <div className="grid grid-cols-2 gap-1">
      {featured.map((product) => (
        <Link
          key={product.slug}
          href={`/products/${product.slug}`}
          className="p-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <p className="font-semibold text-sm">{product.name}</p>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.4)" }}>
            {product.shortDesc}
          </p>
        </Link>
      ))}
      <Link
        href="/products"
        className="col-span-2 mt-2 p-3 rounded-lg flex items-center justify-between transition-colors"
        style={{ background: "rgba(249,115,22,0.08)", color: "#F97316", border: "1px solid rgba(249,115,22,0.2)" }}
      >
        <span className="text-sm font-semibold">View all products</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

function ApplicationsPanel() {
  return (
    <div className="grid grid-cols-2 gap-1">
      {applications.slice(0, 10).map((app) => (
        <Link
          key={app.slug}
          href={`/applications/${app.slug}`}
          className="p-3 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <p className="font-semibold text-sm">{app.name}</p>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.4)" }}>
            {app.shortDesc}
          </p>
        </Link>
      ))}
      <Link
        href="/applications"
        className="col-span-2 mt-2 p-3 rounded-lg flex items-center justify-between transition-colors"
        style={{ background: "rgba(249,115,22,0.08)", color: "#F97316", border: "1px solid rgba(249,115,22,0.2)" }}
      >
        <span className="text-sm font-semibold">View all applications</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

// ── Mobile overlay ────────────────────────────────────────────────────────────
function MobileOverlay({
  isOpen,
  onClose,
  onSearchOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute top-0 left-0 right-0 bg-black p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Mobile search */}
            <button
              onClick={() => { onClose(); onSearchOpen(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-6 mt-2 text-left"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <span className="text-sm">Search products, applications…</span>
            </button>

            <nav className="space-y-4">
              <Link href="/products" className="block text-lg font-semibold" style={{ color: "#F5F0EB" }} onClick={onClose}>Products</Link>
              <Link href="/applications" className="block text-lg font-semibold" style={{ color: "#F5F0EB" }} onClick={onClose}>Applications</Link>
              {PLAIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-lg font-semibold"
                  style={{ color: "#F5F0EB" }}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t mt-8 pt-8 space-y-3" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="block px-4 py-3 rounded-lg text-sm font-semibold text-center transition-all"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff" }}
                  onClick={onClose}
                >
                  {action.label}
                </Link>
              ))}
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
  const productsRef = useRef<HTMLDivElement>(null);
  const applicationsRef = useRef<HTMLDivElement>(null);

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        productsRef.current &&
        !productsRef.current.contains(e.target as Node) &&
        applicationsRef.current &&
        !applicationsRef.current.contains(e.target as Node)
      ) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(7, 11, 18, 0.92)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/assets/logos/hubss-logos/hubss-logo-white.png"
              alt="HUB Surface Systems"
              width={140}
              height={44}
              style={{ height: 36, width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {PLAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-orange-400"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Products dropdown */}
            <div
              ref={productsRef}
              className="relative"
              onMouseEnter={() => setOpenPanel("products")}
              onMouseLeave={() => setOpenPanel(null)}
            >
              <button
                className="text-sm font-medium transition-colors hover:text-orange-400 flex items-center gap-1"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Products
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.5, marginTop: 1 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openPanel === "products" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-96 p-4 rounded-xl"
                    style={{
                      background: "rgba(10, 14, 23, 0.98)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    }}
                  >
                    <ProductsPanel />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Applications dropdown */}
            <div
              ref={applicationsRef}
              className="relative"
              onMouseEnter={() => setOpenPanel("applications")}
              onMouseLeave={() => setOpenPanel(null)}
            >
              <button
                className="text-sm font-medium transition-colors hover:text-orange-400 flex items-center gap-1"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Applications
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.5, marginTop: 1 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openPanel === "applications" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-96 p-4 rounded-xl"
                    style={{
                      background: "rgba(10, 14, 23, 0.98)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    }}
                  >
                    <ApplicationsPanel />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop right — search + CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.1)" }}
              title="Search (⌘K)"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <span className="text-xs hidden lg:block">Search</span>
              <kbd
                className="hidden lg:block text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10 }}
              >
                ⌘K
              </kbd>
            </button>

            <a
              href="/resources"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border hover:border-orange-500/50 hover:text-orange-400"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
            >
              Resources
            </a>
            <a
              href="/lunch-learn"
              className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "#fff",
              }}
            >
              Lunch &amp; Learn
            </a>
          </div>

          {/* Mobile — search icon + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={openSearch}
              className="p-2"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <MobileOverlay
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onSearchOpen={openSearch}
        />
      </nav>

      {/* Search overlay — rendered outside nav so it covers everything */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </>
  );
}
