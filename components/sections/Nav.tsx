"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

interface PopoverState {
  open: boolean;
  position: { top: number; left: number };
}

function ProductsPanel() {
  const featured = products.slice(0, 6);
  return (
    <div className="grid grid-cols-2 gap-4">
      {featured.map((product) => (
        <Link
          key={product.slug}
          href={`/products/${product.slug}`}
          className="p-3 rounded-lg transition-colors hover:bg-zinc-900"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <p className="font-semibold text-sm">{product.name}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {product.shortDesc}
          </p>
        </Link>
      ))}
    </div>
  );
}

function ApplicationsPanel() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {applications.slice(0, 10).map((app) => (
        <Link
          key={app.slug}
          href={`/applications/${app.slug}`}
          className="p-3 rounded-lg transition-colors hover:bg-zinc-900"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <p className="font-semibold text-sm">{app.name}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {app.shortDesc}
          </p>
        </Link>
      ))}
    </div>
  );
}

function MobileOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <nav className="space-y-4 mt-8">
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
                  style={{
                    background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                    color: "#fff",
                  }}
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

export default function Nav() {
  const [openPanel, setOpenPanel] = useState<"products" | "applications" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const applicationsRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(7, 11, 18, 0.92)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/assets/logos/hubss-logos/hubss-logo_white.svg"
            alt="HUB Surface Systems"
            width={140}
            height={44}
            style={{ height: 36, width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
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
              className="text-sm font-medium transition-colors hover:text-orange-400"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Products
            </button>
            <AnimatePresence>
              {openPanel === "products" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-96 p-6 rounded-xl"
                  style={{
                    background: "rgba(15, 20, 32, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
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
              className="text-sm font-medium transition-colors hover:text-orange-400"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Applications
            </button>
            <AnimatePresence>
              {openPanel === "applications" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-96 p-6 rounded-xl"
                  style={{
                    background: "rgba(15, 20, 32, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <ApplicationsPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/resources"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border hover:border-orange-500/50 hover:text-orange-400"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
          >
            Resources
          </a>
          <a
            href="/lunch-learn"
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
              color: "#fff",
            }}
          >
            Lunch &amp; Learn
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <MobileOverlay isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
}
