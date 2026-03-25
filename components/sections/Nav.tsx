"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  // Nav chrome
  FileText, CalendarCheck, Phone,
  ChevronDown, X,
} from "lucide-react";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";

// ─── Types ────────────────────────────────────────────────────────────────────

type Panel = "products" | "applications" | null;
type MobileExpanded = "products" | "applications" | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAIN_LINKS = [
  { label: "Projects",  href: "/blog" },
  { label: "About",     href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact",   href: "/contact" },
];

const QUICK_ACTIONS = [
  {
    icon: FileText,
    label: "Download Spec Sheets",
    sub:   "PDFs for every product",
    href:  "/resources",
  },
  {
    icon: CalendarCheck,
    label: "Book Lunch & Learn",
    sub:   "Free for your team",
    href:  "/lunch-learn",
  },
  {
    icon: Phone,
    label: "Talk to a Specialist",
    sub:   "East: Milton · West: Ladysmith",
    href:  "/contact",
  },
];

const GRAD: React.CSSProperties = {
  background:           "linear-gradient(90deg,#F97316,#EAB308)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor:  "transparent",
  backgroundClip:       "text",
};

const GEIST: React.CSSProperties = {
  fontFamily: "var(--font-geist), system-ui, sans-serif",
};

// ─── Panel footer bar ─────────────────────────────────────────────────────────

function PanelFooter() {
  return (
    <div style={{ background: "var(--bg-dark)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 3rem" }}>
        <p className="text-xs text-center" style={{ color: "var(--text-hint)" }}>
          Engineered for Canadian infrastructure · TAC + FAA Compliant · Proud to work coast to coast
        </p>
      </div>
    </div>
  );
}

// ─── Products mega menu panel ──────────────────────────────────────────────────

function ProductsPanel({
  navHeight,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  navHeight: number;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      className="fixed left-0 right-0 bottom-0"
      style={{ top: navHeight, zIndex: 9999, pointerEvents: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.18, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeIn" } }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.55)", pointerEvents: "auto" }}
        onClick={onClose}
      />

      {/* Full-bleed panel */}
      <motion.div
        className="absolute top-0 left-0 overflow-hidden"
        style={{
          width: "100vw",
          background: "var(--bg-card)",
          borderTop: "2px solid transparent",
          borderImage: "linear-gradient(90deg,#F97316,#EAB308) 1",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          pointerEvents: "auto",
        }}
        initial={{ y: -10 }}
        animate={{ y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1], delay: 0.04 } }}
        exit={{ y: -8, transition: { duration: 0.14 } }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Inner content — max-width constrained, matching Applications panel */}
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 3rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 400px",
              gap: "3rem",
            }}
          >
            {/* ── LEFT: All systems list (2-column like Applications) ───── */}
            <div style={{ borderRight: "1px solid var(--border-faint)", paddingRight: "3rem" }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={GRAD}>
                Products
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                {products.map((p) => (
                  <Link key={p.slug} href={`/products/${p.slug}`} className="group py-2 block">
                    <div className="text-sm font-medium text-gray-200 group-hover:text-orange-400 transition-colors">{p.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{p.shortDesc}</div>
                  </Link>
                ))}
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 mt-4 font-medium"
              >
                View all products →
              </Link>
            </div>

            {/* ── RIGHT: Featured products + Quick Links ────────────────── */}
            <div style={{ borderTop: "2px solid #F97316", paddingTop: "1.25rem" }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={GRAD}>
                Featured Systems
              </p>

              {/* Compact featured cards */}
              <div className="space-y-2 mb-6">
                <Link href="/products/traffic-patterns-xd" className="group flex gap-2 p-2 rounded-lg border-l-2 border-orange-500 bg-white/[0.04] hover:bg-orange-500/10 transition-colors">
                  <div className="flex-shrink-0 w-[48px] h-[48px] rounded overflow-hidden bg-black/20">
                    <Image
                      src="/images/products/trafficpatterns-xd/trafficpatterns-xd-1.jpg"
                      alt="TrafficPatternsXD"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">TrafficPatternsXD™</div>
                    <div className="text-xs text-gray-400">150 mil · Canadian winters</div>
                  </div>
                </Link>

                <Link href="/products/streetbond" className="group flex gap-2 p-2 rounded-lg border-l-2 border-orange-500 bg-white/[0.04] hover:bg-orange-500/10 transition-colors">
                  <div className="flex-shrink-0 w-[48px] h-[48px] rounded overflow-hidden bg-black/20">
                    <Image
                      src="/images/products/streetbond/streetbond-multicolour-plaza-green-circles-01.jpg"
                      alt="StreetBond"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">StreetBond®</div>
                    <div className="text-xs text-gray-400">Permanent coating · LEED® compliant</div>
                  </div>
                </Link>

                <Link href="/products/streetprint" className="group flex gap-2 p-2 rounded-lg border-l-2 border-orange-500 bg-white/[0.04] hover:bg-orange-500/10 transition-colors">
                  <div className="flex-shrink-0 w-[48px] h-[48px] rounded overflow-hidden bg-black/20">
                    <Image
                      src="/images/applications/traffic-calming/roundabout-red-brick-planted-centre-01.jpg"
                      alt="StreetPrint"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">StreetPrint®</div>
                    <div className="text-xs text-gray-400">Stamped asphalt · Since 1993</div>
                  </div>
                </Link>
              </div>

              {/* Quick Links — matching Applications spacing */}
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={GRAD}>
                Quick Links
              </p>
              <div className="space-y-1.5">
                {QUICK_ACTIONS.map(({ icon: Icon, label, sub, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-start gap-2 p-2 rounded-lg transition-colors duration-150 hover:bg-[var(--bg-card-hover)]"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(249,115,22,0.1)" }}
                    >
                      <Icon size={12} stroke="#f97316" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-body)" }}>{label}</p>
                      <p className="text-[0.65rem]" style={{ color: "var(--text-faint)" }}>{sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PanelFooter />
      </motion.div>
    </motion.div>
  );
}

// ─── Applications mega menu panel ─────────────────────────────────────────────

function ApplicationsPanel({
  navHeight,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  navHeight: number;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const featuredApp = applications.find((a) => a.slug === "crosswalks") ?? applications[0];

  return (
    <motion.div
      className="fixed left-0 right-0 bottom-0"
      style={{ top: navHeight, zIndex: 9999, pointerEvents: "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.18, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeIn" } }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.55)", pointerEvents: "auto" }}
        onClick={onClose}
      />

      {/* Full-bleed panel */}
      <motion.div
        className="absolute top-0 left-0 overflow-hidden"
        style={{
          width: "100vw",
          background: "var(--bg-card)",
          borderTop: "2px solid transparent",
          borderImage: "linear-gradient(90deg,#F97316,#EAB308) 1",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          pointerEvents: "auto",
        }}
        initial={{ y: -10 }}
        animate={{ y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1], delay: 0.04 } }}
        exit={{ y: -8, transition: { duration: 0.14 } }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Inner content — max-width constrained */}
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 3rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 400px",
              gap: "3rem",
            }}
          >
            {/* ── LEFT: Application text list ────────────────────────── */}
            <div style={{ borderRight: "1px solid var(--border-faint)", paddingRight: "3rem" }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={GRAD}>
                Applications
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
                {applications.map((app) => (
                  <Link key={app.slug} href={`/applications/${app.slug}`} className="group py-2 block">
                    <div className="text-sm font-medium text-gray-200 group-hover:text-orange-400 transition-colors">{app.name}</div>
                  </Link>
                ))}
              </div>

              <Link
                href="/applications"
                className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 mt-4 font-medium"
              >
                View all applications →
              </Link>
            </div>

            {/* ── RIGHT: Featured application ────────────────────────── */}
            <div style={{ borderTop: "2px solid #F97316", paddingTop: "1.25rem" }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={GRAD}>
                Featured Application
              </p>

              <Link href={`/applications/${featuredApp.slug}`} className="block group">
                <div className="relative rounded-lg overflow-hidden mb-3" style={{ height: 200 }}>
                  <Image
                    src={featuredApp.imageUrl}
                    alt={featuredApp.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="400px"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 60%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white" style={GEIST}>
                      {featuredApp.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  {featuredApp.shortDesc.slice(0, 100)}…
                </p>

                {/* Why it matters stat */}
                <div
                  className="flex items-center gap-3 mb-4 px-3 py-2.5 rounded-lg"
                  style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.12)" }}
                >
                  <span className="text-xl font-black leading-none" style={{ color: "#f97316", fontFamily: "var(--font-geist), system-ui, sans-serif" }}>30–50%</span>
                  <span className="text-[0.7rem] leading-tight" style={{ color: "var(--text-secondary)" }}>
                    reduction in pedestrian collisions at marked crossings
                  </span>
                </div>

                <span
                  className="text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 group-hover:text-orange-300"
                  style={{ color: "#f97316" }}
                >
                  View all applications →
                </span>
              </Link>
            </div>
          </div>
        </div>

        <PanelFooter />
      </motion.div>
    </motion.div>
  );
}

// ─── Main Nav ─────────────────────────────────────────────────────────────────

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled]             = useState(false);
  const [activePanel, setActivePanel]       = useState<Panel>(null);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<MobileExpanded>(null);
  const [navHeight, setNavHeight]           = useState(64);

  const navRef         = useRef<HTMLElement>(null);
  const closeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  // Measure actual nav height (handles any padding/border changes)
  useEffect(() => {
    if (!navRef.current) return;
    const measure = () => {
      if (navRef.current) setNavHeight(navRef.current.clientHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(navRef.current);
    return () => ro.disconnect();
  }, []);

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setActivePanel(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  // Escape + cleanup
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePanel(null);
        lastTriggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Timer helpers — 300ms delay for cross-link mouse path tolerance
  const startCloseTimer = () => {
    closeTimerRef.current = setTimeout(() => setActivePanel(null), 300);
  };
  const cancelCloseTimer = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };
  const openPanel = (panel: Panel, trigger: HTMLElement) => {
    cancelCloseTimer();
    lastTriggerRef.current = trigger;
    setActivePanel(panel);
  };

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 transition-all duration-300"
        style={{
          zIndex: 10000,
          background:           "rgba(26,26,26,0.97)",
          backdropFilter:       scrolled || activePanel ? "blur(12px)" : "blur(8px)",
          WebkitBackdropFilter: scrolled || activePanel ? "blur(12px)" : "blur(8px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setActivePanel(null)}>
              <Image
                src="/images/hub-wheel-orange.png"
                alt=""
                width={28}
                height={28}
                unoptimized
                aria-hidden="true"
              />
              <span style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.01em",
                lineHeight: 1,
              }}>
                HUB <span style={{ color: "#f97316" }}>Surface Systems</span>
              </span>
              <Image src="/images/flags/canada-flag.svg" width={18} height={12} alt="Canada" unoptimized className="hidden lg:inline-block ml-1 align-middle" style={{ aspectRatio: '3/2', objectFit: 'cover', borderRadius: '1px' }} />
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-0.5">

              {/* Products trigger */}
              <Link
                href="/products"
                className="flex items-center gap-1 text-[0.78rem] font-medium px-3 py-2 relative transition-colors duration-150"
                style={{ color: activePanel === "products" || pathname.startsWith("/products") ? "var(--text-primary)" : "var(--text-muted)" }}
                onMouseEnter={(e) => openPanel("products", e.currentTarget)}
                onMouseLeave={startCloseTimer}
                aria-expanded={activePanel === "products"}
                aria-haspopup="true"
              >
                Products
                <ChevronDown
                  size={13}
                  className="transition-transform duration-200"
                  style={{ transform: activePanel === "products" ? "rotate(180deg)" : "rotate(0deg)" }}
                />
                <span
                  className="absolute bottom-0.5 left-3 right-3 h-px"
                  style={{
                    background: "linear-gradient(90deg,#f97316,#eab308)",
                    opacity: activePanel === "products" || pathname.startsWith("/products") ? 1 : 0,
                  }}
                />
              </Link>

              {/* Applications trigger */}
              <Link
                href="/applications"
                className="flex items-center gap-1 text-[0.78rem] font-medium px-3 py-2 relative transition-colors duration-150"
                style={{ color: activePanel === "applications" || pathname.startsWith("/applications") ? "var(--text-primary)" : "var(--text-muted)" }}
                onMouseEnter={(e) => openPanel("applications", e.currentTarget)}
                onMouseLeave={startCloseTimer}
                aria-expanded={activePanel === "applications"}
                aria-haspopup="true"
              >
                Applications
                <ChevronDown
                  size={13}
                  className="transition-transform duration-200"
                  style={{ transform: activePanel === "applications" ? "rotate(180deg)" : "rotate(0deg)" }}
                />
                <span
                  className="absolute bottom-0.5 left-3 right-3 h-px"
                  style={{
                    background: "linear-gradient(90deg,#f97316,#eab308)",
                    opacity: activePanel === "applications" || pathname.startsWith("/applications") ? 1 : 0,
                  }}
                />
              </Link>

              {/* Bridge zone — invisible 20px hitbox keeps panel open during diagonal mouse path */}
              {activePanel && (
                <div
                  className="absolute left-0 right-0 h-5"
                  style={{ top: "100%", zIndex: 9998 }}
                  onMouseEnter={cancelCloseTimer}
                  onMouseLeave={startCloseTimer}
                />
              )}

              {/* Plain links */}
              {PLAIN_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[0.78rem] font-medium px-3 py-2 relative group transition-colors duration-150"
                    style={{ color: active ? "var(--text-primary)" : "var(--text-muted)" }}
                  >
                    {link.label}
                    <span
                      className="absolute bottom-0.5 left-3 right-3 h-px transition-opacity duration-200 group-hover:opacity-60"
                      style={{ background: "linear-gradient(90deg,#f97316,#eab308)", opacity: active ? 1 : 0 }}
                    />
                  </Link>
                );
              })}

              {/* CTA */}
              <Link
                href="/lunch-learn"
                className="ml-3 text-[0.72rem] font-bold px-5 py-2 rounded-full transition-all duration-150 hover:brightness-110 whitespace-nowrap"
                style={{ background: "linear-gradient(90deg,#F97316,#d97706)", color: "#fff" }}
              >
                Book Lunch &amp; Learn
              </Link>
            </div>

            {/* Mobile hamburger — animated lines */}
            <button
              className="lg:hidden p-2 flex flex-col justify-center items-center gap-[5px] w-10 h-10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu — full-screen drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 bg-zinc-950/98 backdrop-blur-sm z-50 flex flex-col p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-white font-bold text-lg">HUB Surface Systems</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="flex flex-col flex-1">
              {/* Products accordion */}
              <div className="border-b border-zinc-800">
                <button
                  className="flex items-center justify-between w-full py-4 min-h-[56px] text-xl font-semibold text-white"
                  onClick={() => setMobileExpanded(mobileExpanded === "products" ? null : "products")}
                  aria-expanded={mobileExpanded === "products"}
                >
                  Products
                  <ChevronDown size={18} className={`transition-transform duration-200 ${mobileExpanded === "products" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileExpanded === "products" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, transition: { duration: 0.18 } }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.13 } }}
                      className="overflow-hidden pl-4 pb-4"
                    >
                      {products.map((p) => (
                        <Link key={p.slug} href={`/products/${p.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-base text-zinc-400 hover:text-white">
                          {p.name}
                        </Link>
                      ))}
                      <Link href="/products"
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm font-semibold text-orange-500">
                        View all products →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Applications accordion */}
              <div className="border-b border-zinc-800">
                <button
                  className="flex items-center justify-between w-full py-4 min-h-[56px] text-xl font-semibold text-white"
                  onClick={() => setMobileExpanded(mobileExpanded === "applications" ? null : "applications")}
                  aria-expanded={mobileExpanded === "applications"}
                >
                  Applications
                  <ChevronDown size={18} className={`transition-transform duration-200 ${mobileExpanded === "applications" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileExpanded === "applications" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, transition: { duration: 0.18 } }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.13 } }}
                      className="overflow-hidden pl-4 pb-4"
                    >
                      {applications.map((app) => (
                        <Link key={app.slug} href={`/applications/${app.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-base text-zinc-400 hover:text-white">
                          {app.name}
                        </Link>
                      ))}
                      <Link href="/applications"
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm font-semibold text-orange-500">
                        View all applications →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Plain links */}
              {PLAIN_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link key={link.href} href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 min-h-[56px] text-xl font-semibold border-b border-zinc-800 flex items-center"
                    style={{ color: active ? "#f97316" : "white" }}>
                    {link.label}
                  </Link>
                );
              })}
              </nav>

              <div className="mt-auto pt-6">
                <Link
                  href="/lunch-learn"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 text-center rounded-lg transition-colors"
                >
                  Book Lunch &amp; Learn
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mega menu panels — rendered outside nav to avoid stacking context issues */}
      <AnimatePresence mode="wait">
        {activePanel === "products" && (
          <ProductsPanel
            key="products"
            navHeight={navHeight}
            onClose={() => setActivePanel(null)}
            onMouseEnter={cancelCloseTimer}
            onMouseLeave={startCloseTimer}
          />
        )}
        {activePanel === "applications" && (
          <ApplicationsPanel
            key="applications"
            navHeight={navHeight}
            onClose={() => setActivePanel(null)}
            onMouseEnter={cancelCloseTimer}
            onMouseLeave={startCloseTimer}
          />
        )}
      </AnimatePresence>
    </>
  );
}
