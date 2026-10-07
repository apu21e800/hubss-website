"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/sections/Nav";
import PhotoImage from "@/components/ui/PhotoImage";
import PhotoLightbox from "@/components/ui/PhotoLightbox";

export type Category = "all" | "crosswalks" | "transit" | "community" | "parks" | "recreation" | "parking";

export interface GalleryImage {
  src: string;
  alt: string;
  category: Exclude<Category, "all">;
  location: string;
  tall?: boolean;
}

const CATEGORIES: { value: Category; label: string; count: (imgs: GalleryImage[]) => number }[] = [
  { value: "all", label: "All", count: (imgs) => imgs.length },
  { value: "crosswalks", label: "Crosswalks", count: (imgs) => imgs.filter(i => i.category === "crosswalks").length },
  { value: "transit", label: "Bike & Bus Lanes", count: (imgs) => imgs.filter(i => i.category === "transit").length },
  { value: "community", label: "Community Branding", count: (imgs) => imgs.filter(i => i.category === "community").length },
  { value: "parks", label: "Parks & Paths", count: (imgs) => imgs.filter(i => i.category === "parks").length },
  { value: "recreation", label: "Recreation", count: (imgs) => imgs.filter(i => i.category === "recreation").length },
  { value: "parking", label: "Parking & Driveways", count: (imgs) => imgs.filter(i => i.category === "parking").length },
];

// Vernon (Aug 2026): break up how many images load at once. The archive was
// rendering all photos in one 10,800px wall. Now: first PAGE, then +PAGE
// as you approach the end: auto-load is right HERE (only the footer sits
// below), while product/application galleries stay button-driven.
const PAGE = 24;
/** The first two rows at four across load eagerly (QA D7, 30 Sep 2026). */
const EAGER = 8;

/**
 * The archive's grid, filters and lightbox. The list itself, with its labels
 * resolved from the map's project records, is built on the server in
 * app/gallery/page.tsx (30 Sep 2026), so the map data never ships to the
 * browser for this page.
 */
export default function GalleryArchive({ images, footer }: { images: GalleryImage[]; footer: React.ReactNode }) {
  const [active, setActive] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // The grid used to be server-rendered at opacity 0 (framer-motion's
  // `initial`), so it was blank until hydration and invisible with
  // JavaScript off (QA E11, F6, 30 Sep 2026). The first paint is visible;
  // only a category change fades the new set in.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const filtered = active === "all" ? images : images.filter((img) => img.category === active);
  const displayed = filtered.slice(0, visible);
  const hasMore = displayed.length < filtered.length;

  // Auto-load the next page when the sentinel nears the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((v) => Math.min(v + PAGE, filtered.length));
        }
      },
      { rootMargin: "600px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // `visible` in the deps recreates the observer after every chunk: the
    // fresh observation re-checks immediately, so a sentinel that never left
    // the 600px margin (tall viewport, fast scroll) keeps cascading instead
    // of stalling after the first load.
  }, [hasMore, filtered.length, visible]);

  const openLightbox = useCallback((i: number) => setLightbox(i), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <main data-surface="paper" style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
      <Nav />

      {/* Photographs carry their own dark scrims (GalleryGrid pins them), so the page
              around them can go light without touching the tiles. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--accent-text-lg)" }}>
            Photo archive
          </p>
          {/* The standard landing H1, 48px at 1440, as Insights, Resources
              and the rest (QA D11, 30 Sep 2026); this one was 56px. */}
          <h1
            className="font-black mb-4"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Field documentation
          </h1>
          {/* Was "{IMAGES.length}+ installations": the "+" overstated a counted
              list, and some installations have two photos (Sep 2026). */}
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
            {images.length} photographs of HUB work across Canada.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2">
          {CATEGORIES.map((cat) => {
            const count = cat.count(images);
            const isActive = active === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => { setActive(cat.value); setLightbox(null); setVisible(PAGE); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 rounded-full transition-all whitespace-nowrap"
                style={{
                  background: isActive ? "#F97316" : "var(--ink-05)",
                  color: isActive ? "var(--on-accent)" : "var(--text-muted)",
                  border: "1px solid",
                  borderColor: isActive ? "#F97316" : "var(--ink-10)",
                  // 44px floor: these were 35px tall, and category filters are
                  // the first thing a phone user reaches for on this page.
                  minHeight: 44,
                }}
              >
                {cat.label}
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "var(--ink-20)" : "var(--border-color)",
                    color: isActive ? "var(--text-primary)" : "var(--ink-40)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tile entrance: collapses under reduced motion */}
        <style>{`
          @keyframes archive-tile-in {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .archive-tile { animation: none !important; opacity: 1 !important; }
          }
        `}</style>

        {/* Uniform app grid: stable pagination (new tiles append at the end,
            nothing reflows), 2-up on phones like a native photo app */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={mounted ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3"
          >
            {displayed.map((img, i) => (
              // A real button (QA D6, 30 Sep 2026): the tiles were divs with
              // no role or tabindex, so the lightbox could not be opened from
              // a keyboard. Its label is the tile's caption; the focus ring
              // is the site's orange.
              <button
                key={img.src + i}
                type="button"
                aria-label={`${img.alt}, ${img.location}`}
                className="archive-tile group relative block w-full overflow-hidden rounded-xl cursor-pointer text-left active:scale-[0.985] transition-transform duration-100 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                style={{
                  border: "1px solid var(--border-color)",
                  animation: "archive-tile-in 0.4s ease both",
                  animationDelay: `${(i % PAGE) % 12 * 30}ms`,
                }}
                onClick={() => openLightbox(i)}
              >
                {/* Warm grey under a photo that has not loaded yet (QA D7, 30
                    Sep 2026): --bg-card is white on paper, and lazy tiles
                    read as holes in the grid. */}
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "75%",
                    background: "var(--border-color)",
                  }}
                >
                  <PhotoImage
                    src={img.src}
                    alt={`${img.alt}, ${img.location}, decorative pavement by HUB Surface Systems`}
                    fill
                    loading={i < EAGER ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    quality={70}
                  />
                  {/* Hover overlay. Pinned dark: it is an 85% black scrim over
                      the photograph, so its caption needs light type no matter
                      what the page around it is doing: and this page is paper
                      now. "Click to expand" went on 30 Sep 2026 (QA D20): the
                      button's label says what it does. */}
                  <div
                    data-surface="dark"
                    className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }}
                  >
                    <p className="text-xs font-bold" style={{ color: "var(--accent-text-lg)" }}>{img.category.toUpperCase().replace("-", " ")}</p>
                    <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{img.alt}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-55)" }}>{img.location}</p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load more: sentinel auto-loads as it approaches; button as backup */}
        {hasMore && (
          <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-3">
            <p className="text-xs" style={{ color: "var(--text-secondary)" }} aria-live="polite">
              Showing {displayed.length} of {filtered.length}
            </p>
            <button
              onClick={() => setVisible((v) => Math.min(v + PAGE, filtered.length))}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ background: "#f97316", color: "var(--on-accent)" }}
            >
              Load more
            </button>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24" style={{ color: "var(--ink-30)" }}>
            <p>No photos in this category yet.</p>
          </div>
        )}
      </div>

      {/* The footer is rendered on the server and passed in: it reads Studio's
          Site Settings, which a client component can't (lib/site-settings.ts). */}
      {footer}

      {/* Lightbox: shared cinematic viewer */}
      <PhotoLightbox
        photos={filtered.map((img) => ({
          src: img.src,
          // Same descriptive string the tile carries. This used to be the bare
          // label ("High-Visibility Crosswalk"), so the fullscreen view, the
          // one a reader actually studies, was the least described surface
          // on the page.
          alt: `${img.alt}, ${img.location}, decorative pavement by HUB Surface Systems`,
          caption: `${img.alt} · ${img.location}`,
        }))}
        index={lightbox ?? -1}
        onClose={closeLightbox}
        onIndexChange={(i) => setLightbox(i)}
      />
    </main>
  );
}
