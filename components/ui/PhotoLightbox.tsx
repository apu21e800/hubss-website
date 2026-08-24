"use client";

/**
 * PhotoLightbox — the site's shared cinematic image viewer (Aug 2026).
 *
 * Replaces yet-another-react-lightbox in the product/application galleries.
 * Vernon: "there's a weird shadow across the header" (YARL's full-width
 * caption toolbar), "fix orange arrows left and right, same with the x".
 *
 * Design rules:
 *   • No full-width chrome bars — the photo owns the frame. The caption sits
 *     in a bottom-left gradient scrim, the counter in a top-left pill.
 *   • Prev/Next/Close are solid 48px circular brand-orange buttons with
 *     white glyphs — visible, tappable, consistent.
 *   • Esc / ← / → keys, swipe on touch, backdrop click closes, body scroll
 *     locked while open, adjacent frames preloaded.
 */

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxPhoto {
  src: string;
  alt: string;
  caption?: string;
}

const BTN: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
  color: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function PhotoLightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: {
  photos: LightboxPhoto[];
  index: number; // -1 = closed
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const open = index >= 0 && index < photos.length;
  const touchX = useRef<number | null>(null);

  const prev = useCallback(() => {
    onIndexChange((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onIndexChange]);
  const next = useCallback(() => {
    onIndexChange((index + 1) % photos.length);
  }, [index, photos.length, onIndexChange]);

  // Keyboard: Esc closes, arrows navigate
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, prev, next]);

  // Body scroll lock while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  if (!open) {
    return null;
  }
  const photo = photos[index];
  const preload = [photos[(index + 1) % photos.length], photos[(index - 1 + photos.length) % photos.length]];

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={photo.alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "rgba(4,6,10,0.96)", backdropFilter: "blur(18px)" }}
        onClick={onClose}
        onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 48) (dx > 0 ? prev() : next());
        }}
      >
        {/* Counter — top-left pill */}
        <div
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide select-none"
          style={{ background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
        >
          {index + 1} <span style={{ color: "rgba(255,255,255,0.4)" }}>/ {photos.length}</span>
        </div>

        {/* Close — orange circle, top-right */}
        <button
          onClick={onClose}
          aria-label="Close (Esc)"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 transition-all hover:brightness-110 active:scale-90"
          style={BTN}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth={2.5} strokeLinecap="round" />
          </svg>
        </button>

        {/* Prev */}
        {photos.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 transition-all hover:brightness-110 active:scale-90"
            style={BTN}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Frame */}
        <motion.div
          key={photo.src}
          initial={{ opacity: 0, scale: 0.975 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-6xl mx-14 sm:mx-20"
          style={{ height: "min(82vh, 900px)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-contain"
            style={{ filter: "drop-shadow(0 24px 60px rgba(0,0,0,0.6))" }}
            sizes="92vw"
            quality={85}
            priority
          />
        </motion.div>

        {/* Caption — compact self-sized card, cinema-subtitle position. Never
            a full-width bar: it hugs its own text, so it reads clean over any
            photo aspect (the old toolbar-across-dead-space is what Vernon
            flagged as "a weird shadow"). */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-10 max-w-[86%] sm:max-w-md rounded-xl px-4 py-2.5 pointer-events-none"
          style={{ background: "rgba(7,10,16,0.72)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "#FB923C" }}>
            HUB Surface Systems
          </p>
          <p className="text-[13px] sm:text-sm font-semibold leading-snug" style={{ color: "#F5F0EB" }}>
            {photo.caption ?? photo.alt}
          </p>
        </div>

        {/* Next */}
        {photos.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 transition-all hover:brightness-110 active:scale-90"
            style={BTN}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Adjacent-frame preload (hidden) */}
        <div aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
          {preload.map((p) => (
            <Image key={p.src} src={p.src} alt="" width={16} height={16} sizes="16px" />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
