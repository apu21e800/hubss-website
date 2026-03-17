"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Layers, Shield, PenTool, Paintbrush, Zap, Palette,
  ShieldCheck, Flame, Milestone, PlaneLanding,
  ArrowLeftRight, Bus, Home, Sparkles, TriangleAlert,
  TreePine, Building2, SquareParking, Plane,
  FileText, CalendarCheck, Phone,
  ChevronDown, Menu, X, type LucideIcon,
} from "lucide-react";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";

// ─── Types ────────────────────────────────────────────────────────────────────

type Panel = "products" | "applications" | null;
type MobileExpanded = "products" | "applications" | null;

// ─── Icon maps ────────────────────────────────────────────────────────────────

const PRODUCT_ICONS: Record<string, LucideIcon> = {
  "traffic-patterns":    Layers,
  "traffic-patterns-xd": Shield,
  "streetprint":         PenTool,
  "streetbond":          Paintbrush,
  "mmax":                Zap,
  "decomark":            Palette,
  "durashield":          ShieldCheck,
  "duratherm":           Flame,
  "premark":             Milestone,
  "airmark":             PlaneLanding,
};

const APP_ICONS: Record<string, LucideIcon> = {
  "crosswalks":          ArrowLeftRight,
  "bus-bike-lanes":      Bus,
  "driveways":           Home,
  "public-art":          Sparkles,
  "regulatory-markings": TriangleAlert,
  "parks-paths":         TreePine,
  "community-branding":  Building2,
  "parking-lots":        SquareParking,
  "airports":            Plane,
};

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
          Engineered for Canadian infrastructure · TAC + FAA Compliant · Proud to work coast to coast 🍁
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
  const featured = products.find((p) => p.slug === "traffic-patterns-xd") ?? products[0];

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
          borderTop: "1px solid var(--border-subtle)",
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
              gridTemplateColumns: "380px 1fr 280px",
              gap: "2.5rem",
            }}
          >
            {/* ── LEFT: Featured product spotlight ──────────────────── */}
            <div style={{ borderRight: "1px solid var(--border-faint)", paddingRight: "2.5rem" }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={GRAD}>
                Featured System
              </p>

              <div className="flex gap-4 items-start">
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold mb-1.5" style={{ ...GEIST, color: "var(--text-primary)" }}>
                    {featured.name}
                  </h3>
                  <p className="text-sm font-medium mb-3" style={{ color: "#f97316" }}>
                    {featured.shortDesc}
                  </p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
                    {featured.description.slice(0, 130)}…
                  </p>
                  <Link
                    href={`/products/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:text-orange-300"
                    style={{ color: "#f97316" }}
                  >
                    Explore <span className="text-base leading-none">→</span>
                  </Link>
                </div>

                {/* Product image */}
                <div
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 130, height: 100 }}
                >
                  <Image
                    src={featured.imageUrl}
                    alt={featured.name}
                    width={130}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* ── MIDDLE: All systems list ───────────────────────────── */}
            <div style={{ borderRight: "1px solid var(--border-faint)", paddingRight: "2.5rem" }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={GRAD}>
                All Systems
              </p>

              <div>
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded-md transition-all duration-150 hover:bg-[var(--bg-card-hover)]"
                    style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="flex-shrink-0 rounded-full"
                      style={{ width: 6, height: 6, background: "#f97316", opacity: 0.7 }}
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className="block text-sm font-medium transition-colors duration-150 group-hover:text-orange-400"
                        style={{ color: "#d1d5db" /* mid-gray, keep as-is */ }}
                      >
                        {p.name}
                      </span>
                      <span className="block text-[0.68rem] truncate" style={{ color: "var(--text-faint)" }}>
                        {p.shortDesc}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold transition-colors duration-150 hover:text-orange-300"
                style={{ color: "#f97316" }}
              >
                View all products →
              </Link>
            </div>

            {/* ── RIGHT: Quick links ─────────────────────────────────── */}
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={GRAD}>
                Quick Links
              </p>

              <div className="space-y-2">
                {QUICK_ACTIONS.map(({ icon: Icon, label, sub, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-start gap-3 p-3 rounded-lg transition-colors duration-150 hover:bg-[var(--bg-card-hover)]"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(249,115,22,0.1)" }}
                    >
                      <Icon size={14} stroke="#f97316" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-body)" }}>{label}</p>
                      <p className="text-[0.68rem]" style={{ color: "var(--text-faint)" }}>{sub}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="mt-6 text-xs text-center leading-relaxed" style={{ color: "var(--text-hint)" }}>
                500+ Projects · 10 Provinces · Since 1994
              </p>
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
          borderTop: "1px solid var(--border-subtle)",
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
            {/* ── LEFT: Application tiles grid ──────────────────────── */}
            <div style={{ borderRight: "1px solid var(--border-faint)", paddingRight: "3rem" }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-5" style={GRAD}>
                Applications
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                {applications.map((app) => {
                  const Icon = APP_ICONS[app.slug];
                  return (
                    <Link
                      key={app.slug}
                      href={`/applications/${app.slug}`}
                      className="group relative flex flex-col items-start gap-1.5 p-3 rounded-lg transition-all duration-150 hover:bg-[var(--bg-card-hover)]"
                    >
                      {/* Gradient top border on hover */}
                      <div
                        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        style={{ background: "linear-gradient(90deg,#F97316,#EAB308)" }}
                      />
                      <div
                        className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0"
                        style={{
                          background: "rgba(249,115,22,0.08)",
                          border: "1px solid rgba(249,115,22,0.1)",
                        }}
                      >
                        {Icon && <Icon size={13} stroke="#f97316" strokeWidth={2} />}
                      </div>
                      <span
                        className="text-xs font-medium leading-tight transition-colors duration-150 group-hover:text-white"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {app.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/applications"
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold transition-colors duration-150 hover:text-orange-300"
                style={{ color: "#f97316" }}
              >
                View all applications →
              </Link>
            </div>

            {/* ── RIGHT: Featured application ────────────────────────── */}
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={GRAD}>
                Featured Application
              </p>

              <Link href={`/applications/${featuredApp.slug}`} className="block group">
                <div className="relative rounded-lg overflow-hidden mb-3" style={{ height: 200 }}>
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                    alt="Crosswalks"
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
                    <h3 className="text-xl font-bold" style={{ ...GEIST, color: "var(--text-primary)" }}>
                      {featuredApp.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  {featuredApp.desc.slice(0, 100)}…
                </p>

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

  // Timer helpers
  const startCloseTimer = () => {
    closeTimerRef.current = setTimeout(() => setActivePanel(null), 200);
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
        {/* Gradient bottom rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, #F97316 0%, #EAB308 100%)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Wordmark */}
            <Link href="/" className="flex items-center" onClick={() => setActivePanel(null)}>
              <span style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em", ...GEIST }}>
                HUB
              </span>
              <span style={{ ...GRAD, ...GEIST, fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
                SS
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5">

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

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2"
              style={{ color: "var(--text-primary)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
              className="md:hidden px-4 pb-5 flex flex-col"
              style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}
            >
              {/* Products accordion */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-2 py-2.5 text-sm font-medium"
                  style={{ color: pathname.startsWith("/products") ? "#f97316" : "var(--text-secondary)" }}
                  onClick={() => setMobileExpanded(mobileExpanded === "products" ? null : "products")}
                  aria-expanded={mobileExpanded === "products"}
                >
                  Products
                  <ChevronDown
                    size={15}
                    className="transition-transform duration-200"
                    style={{ transform: mobileExpanded === "products" ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <AnimatePresence>
                  {mobileExpanded === "products" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, transition: { duration: 0.18 } }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.13 } }}
                      className="overflow-hidden pl-3"
                    >
                      {products.map((p) => (
                        <Link key={p.slug} href={`/products/${p.slug}`}
                          className="block px-2 py-2 text-sm" style={{ color: "var(--text-muted)" }}>
                          {p.name}
                        </Link>
                      ))}
                      <Link href="/products" className="block px-2 py-2 text-xs font-semibold" style={{ color: "#f97316" }}>
                        View all products →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Applications accordion */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-2 py-2.5 text-sm font-medium"
                  style={{ color: pathname.startsWith("/applications") ? "#f97316" : "var(--text-secondary)" }}
                  onClick={() => setMobileExpanded(mobileExpanded === "applications" ? null : "applications")}
                  aria-expanded={mobileExpanded === "applications"}
                >
                  Applications
                  <ChevronDown
                    size={15}
                    className="transition-transform duration-200"
                    style={{ transform: mobileExpanded === "applications" ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <AnimatePresence>
                  {mobileExpanded === "applications" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, transition: { duration: 0.18 } }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.13 } }}
                      className="overflow-hidden pl-3"
                    >
                      {applications.map((app) => (
                        <Link key={app.slug} href={`/applications/${app.slug}`}
                          className="block px-2 py-2 text-sm" style={{ color: "var(--text-muted)" }}>
                          {app.name}
                        </Link>
                      ))}
                      <Link href="/applications" className="block px-2 py-2 text-xs font-semibold" style={{ color: "#f97316" }}>
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
                    className="block px-2 py-2.5 text-sm font-medium"
                    style={{ color: active ? "#f97316" : "var(--text-secondary)" }}>
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/lunch-learn"
                className="mt-3 block text-sm font-bold px-5 py-3 rounded-full text-center"
                style={{ background: "linear-gradient(90deg,#F97316,#d97706)", color: "#fff" }}
              >
                Book Lunch &amp; Learn
              </Link>
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
