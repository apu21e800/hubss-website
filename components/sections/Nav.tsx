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
  // Social
  Linkedin, Instagram, Youtube, Facebook,
} from "lucide-react";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { SOCIAL_LINKS } from "@/lib/social-links";

// ─── Types ────────────────────────────────────────────────────────────────────

type Panel = "products" | "applications" | null;
type MobileExpanded = "products" | "applications" | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAIN_LINKS = [
  { label: "Projects",  href: "/projects" },
  { label: "About",     href: "/about" },
  { label: "Blog",      href: "/blog" },
  { label: "Contact",   href: "/contact" },
  { label: "Resources", href: "/resources" },
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

// ─── Mobile stagger variants ───────────────────────────────────────────────────

const mobileContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const mobileItemVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─── Social icons row ──────────────────────────────────────────────────────────

const MOBILE_SOCIALS = [
  { Icon: Linkedin,  href: SOCIAL_LINKS.linkedin,  label: "LinkedIn"  },
  { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { Icon: Youtube,   href: SOCIAL_LINKS.youtube,   label: "YouTube"   },
  { Icon: Facebook,  href: SOCIAL_LINKS.facebook,  label: "Facebook"  },
];

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
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "2px solid transparent",
          borderImage: "linear-gradient(90deg,#F97316,#EAB308) 1",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          pointerEvents: "auto",
          maxHeight: "80vh",
          overflowY: "auto",
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
                    <div className="text-sm font-medium group-hover:text-orange-400 transition-colors" style={{ color: "rgba(255,255,255,0.85)" }}>{p.name}</div>
                    <div className="text-xs group-hover:text-gray-300 transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>{p.shortDesc}</div>
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
                    className="flex items-start gap-2 p-2 rounded-lg transition-colors duration-150"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(249,115,22,0.10)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(249,115,22,0.1)" }}
                    >
                      <Icon size={12} stroke="#f97316" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>{label}</p>
                      <p className="text-[0.65rem]" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</p>
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
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "2px solid transparent",
          borderImage: "linear-gradient(90deg,#F97316,#EAB308) 1",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          pointerEvents: "auto",
          maxHeight: "80vh",
          overflowY: "auto",
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
                    <div className="text-sm font-medium group-hover:text-orange-400 transition-colors" style={{ color: "rgba(255,255,255,0.85)" }}>{app.name}</div>
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

                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
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

// ─── Mobile full-screen overlay ────────────────────────────────────────────────

function MobileOverlay({
  onClose,
  mobileExpanded,
  setMobileExpanded,
  pathname,
}: {
  onClose: () => void;
  mobileExpanded: MobileExpanded;
  setMobileExpanded: (v: MobileExpanded) => void;
  pathname: string;
}) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col lg:hidden"
      style={{
        zIndex: 10001,
        background: "#080d16",
        WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Zone 1: Top bar ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0"
        style={{
          height: 64,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo — same as main nav */}
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
          <Image
            src="/images/hub-wheel-orange.png"
            alt=""
            width={26}
            height={26}
            unoptimized
            aria-hidden="true"
          />
          <span style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "0.9rem",
            letterSpacing: "0.01em",
            lineHeight: 1,
          }}>
            HUB <span style={{ color: "#f97316" }}>Surface Systems</span>
          </span>
        </Link>

        {/* Close button — pill */}
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 8,
          }}
        >
          <X size={18} color="#ffffff" strokeWidth={2} />
        </button>
      </div>

      {/* ── Zone 2: Scrollable nav content ──────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"] }}
      >
        <motion.div
          variants={mobileContainerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Products accordion ─────────────────────────────────────── */}
          <motion.div variants={mobileItemVariants}>
            <button
              className="flex items-center justify-between w-full px-6 active:bg-white/[0.04] transition-colors"
              style={{
                minHeight: 64,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                borderLeft: `3px solid ${mobileExpanded === "products" ? "#F97316" : "transparent"}`,
              }}
              onClick={() => setMobileExpanded(mobileExpanded === "products" ? null : "products")}
              aria-expanded={mobileExpanded === "products"}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: mobileExpanded === "products" ? "#F97316" : "#ffffff",
                  fontFamily: "var(--font-geist), system-ui, sans-serif",
                  transition: "color 0.2s",
                }}
              >
                Products
              </span>
              <ChevronDown
                size={20}
                color={mobileExpanded === "products" ? "#F97316" : "rgba(255,255,255,0.4)"}
                style={{
                  transform: mobileExpanded === "products" ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease, color 0.2s",
                }}
              />
            </button>

            <AnimatePresence>
              {mobileExpanded === "products" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.16 } }}
                  style={{ overflow: "hidden", background: "rgba(249,115,22,0.02)" }}
                >
                  {products.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center active:bg-white/[0.05] transition-colors"
                      style={{
                        minHeight: 48,
                        paddingLeft: "2rem",
                        paddingRight: "1.5rem",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <span style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
                        {p.name}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="flex items-center"
                    style={{
                      minHeight: 48,
                      paddingLeft: "2rem",
                      paddingRight: "1.5rem",
                      color: "#F97316",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    View all products →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Applications accordion ─────────────────────────────────── */}
          <motion.div variants={mobileItemVariants}>
            <button
              className="flex items-center justify-between w-full px-6 active:bg-white/[0.04] transition-colors"
              style={{
                minHeight: 64,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                borderLeft: `3px solid ${mobileExpanded === "applications" ? "#F97316" : "transparent"}`,
              }}
              onClick={() => setMobileExpanded(mobileExpanded === "applications" ? null : "applications")}
              aria-expanded={mobileExpanded === "applications"}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: mobileExpanded === "applications" ? "#F97316" : "#ffffff",
                  fontFamily: "var(--font-geist), system-ui, sans-serif",
                  transition: "color 0.2s",
                }}
              >
                Applications
              </span>
              <ChevronDown
                size={20}
                color={mobileExpanded === "applications" ? "#F97316" : "rgba(255,255,255,0.4)"}
                style={{
                  transform: mobileExpanded === "applications" ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease, color 0.2s",
                }}
              />
            </button>

            <AnimatePresence>
              {mobileExpanded === "applications" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.16 } }}
                  style={{ overflow: "hidden", background: "rgba(249,115,22,0.02)" }}
                >
                  {applications.map((app) => (
                    <Link
                      key={app.slug}
                      href={`/applications/${app.slug}`}
                      onClick={onClose}
                      className="flex items-center active:bg-white/[0.05] transition-colors"
                      style={{
                        minHeight: 48,
                        paddingLeft: "2rem",
                        paddingRight: "1.5rem",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <span style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
                        {app.name}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/applications"
                    onClick={onClose}
                    className="flex items-center"
                    style={{
                      minHeight: 48,
                      paddingLeft: "2rem",
                      paddingRight: "1.5rem",
                      color: "#F97316",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    View all applications →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Plain nav links ─────────────────────────────────────────── */}
          {PLAIN_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <motion.div key={link.href} variants={mobileItemVariants}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center w-full active:bg-white/[0.04] transition-colors"
                  style={{
                    minHeight: 64,
                    paddingLeft: "1.5rem",
                    paddingRight: "1.5rem",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    borderLeft: `3px solid ${isActive ? "#F97316" : "transparent"}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: isActive ? "#F97316" : "#ffffff",
                      fontFamily: "var(--font-geist), system-ui, sans-serif",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}

          {/* ── Zone 4: Social links ──────────────────────────────────── */}
          <motion.div variants={mobileItemVariants}>
            <div
              className="flex items-center justify-center gap-7"
              style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
            >
              {MOBILE_SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
                >
                  <Icon size={22} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Spacer so content clears the bottom CTA */}
          <div style={{ height: 140 }} />

        </motion.div>
      </div>

      {/* ── Zone 3: Bottom CTA strip — always visible ────────────────── */}
      <div
        className="flex-shrink-0 absolute bottom-0 left-0 right-0"
        style={{ pointerEvents: "none" }}
      >
        {/* Gradient fade */}
        <div
          style={{
            height: 120,
            background: "linear-gradient(to top, #080d16 60%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Content */}
        <div
          style={{
            background: "#080d16",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingBottom: "env(safe-area-inset-bottom, 2rem)",
            marginBottom: "0.5rem",
            pointerEvents: "auto",
          }}
        >
          <Link
            href="/lunch-learn"
            onClick={onClose}
            className="block w-full text-center font-bold transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(90deg, #F97316 0%, #D97706 100%)",
              color: "#ffffff",
              borderRadius: 14,
              paddingTop: "1rem",
              paddingBottom: "1rem",
              fontSize: "1rem",
              letterSpacing: "0.01em",
              boxShadow: "0 4px 24px rgba(249,115,22,0.3)",
            }}
          >
            Book Lunch &amp; Learn
          </Link>
          <Link
            href="/resources"
            onClick={onClose}
            className="block w-full text-center font-semibold transition-all active:scale-[0.98] mt-3"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 14,
              paddingTop: "0.875rem",
              paddingBottom: "0.875rem",
              fontSize: "1rem",
              letterSpacing: "0.01em",
            }}
          >
            Download Spec Sheet
          </Link>
          <p
            className="text-center"
            style={{
              color: "rgba(255,255,255,0.32)",
              fontSize: "0.8125rem",
              marginTop: "0.75rem",
              paddingBottom: "0.5rem",
            }}
          >
            or call <span style={{ color: "rgba(255,255,255,0.5)" }}>1-877-391-0270</span>
          </p>
        </div>
      </div>
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

  // Measure actual nav height
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

  // Body scroll lock when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
        setMobileOpen(false);
        lastTriggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Timer helpers — 300ms grace period for diagonal mouse paths
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
          background:           "rgba(8,13,22,0.97)",
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
            </Link>

            {/* Desktop links — hidden on mobile */}
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

              {/* Bridge zone — invisible hitbox keeps panel open on diagonal mouse path */}
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

              {/* Desktop CTA */}
              <Link
                href="/lunch-learn"
                className="ml-3 text-[0.72rem] font-bold px-5 py-2 rounded-full transition-all duration-150 hover:brightness-110 whitespace-nowrap"
                style={{ background: "linear-gradient(90deg,#F97316,#d97706)", color: "#fff" }}
              >
                Book Lunch &amp; Learn
              </Link>
            </div>

            {/* Mobile hamburger — pill button, three-line → X morphs via CSS */}
            <button
              className="lg:hidden flex flex-col justify-center items-center gap-[5px]"
              style={{
                width: 44,
                height: 44,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 8,
                padding: "10px",
                flexShrink: 0,
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 1.5,
                  background: "#ffffff",
                  borderRadius: 2,
                  transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s",
                  transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 1.5,
                  background: "#ffffff",
                  borderRadius: 2,
                  transition: "opacity 0.2s",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 1.5,
                  background: "#ffffff",
                  borderRadius: 2,
                  transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s",
                  transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none",
                }}
              />
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay — outside nav to avoid stacking context issues */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileOverlay
            onClose={() => setMobileOpen(false)}
            mobileExpanded={mobileExpanded}
            setMobileExpanded={setMobileExpanded}
            pathname={pathname}
          />
        )}
      </AnimatePresence>

      {/* Desktop mega menu panels — rendered outside nav */}
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
