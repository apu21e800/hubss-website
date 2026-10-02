"use client";

/**
 * PhotoLightbox — the site's shared cinematic image viewer (Aug 2026).
 *
 * Replaces yet-another-react-lightbox in the product/application galleries.
 * Vernon: "there's a weird shadow across the header" (YARL's full-width
 * caption toolbar), "fix orange arrows left and right, same with the x".
 *
 * Design rules:
 *   • No full-width chrome bars — the photo owns the frame. The counter sits
 *     in a top-left pill; the caption sits under the photo, never on it.
 *   • Prev/Next/Close are solid 48px circular brand-orange buttons with
 *     white glyphs — visible, tappable, consistent.
 *   • Esc / ← / → keys, swipe on touch, backdrop click closes, body scroll
 *     locked while open, adjacent frames preloaded.
 *
 * 30 Sep 2026 (QA C9, D2, B30, C10, C20):
 *   • The counter and the caption are drawn in fixed white on the backdrop.
 *     They used the theme's text tokens, which on a paper page are near-black
 *     on the near-black backdrop ("2 / 106" could not be read).
 *   • Keyboard focus moves to the Close button on open and returns to the
 *     tile on close; Tab stays inside the dialog.
 *   • The frame is sized from the photo's own aspect ratio, so the caption
 *     sits directly below the picture (it used to cover its bottom-left).
 *   • On a phone the photo runs edge to edge and the arrows sit below it on
 *     the backdrop; they used to overlap a 278px-wide photo.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import PhotoImage from "@/components/ui/PhotoImage";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxPhoto {
  src: string;
  alt: string;
  caption?: string;
}

// Fixed colours: the backdrop is near-black in every theme, so nothing here
// may follow a token that flips to ink on paper.
const WHITE = "rgba(255,255,255,0.9)";
const WHITE_DIM = "rgba(255,255,255,0.55)";

const BTN: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
  color: "#FFFFFF",
  boxShadow: "0 4px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

// display comes from the classes (the side arrows are `hidden sm:flex`), so
// it must not be in the inline style, which would win over `hidden`.
const BTN_CLASS =
  "items-center justify-center transition-all hover:brightness-110 active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** Phones (under Tailwind's sm) lay the arrows below the photo. */
const NARROW = 640;
/** Vertical room kept for the pills, caption and (on phones) the arrows. */
const ROOM_WIDE = 150;
const ROOM_NARROW = 250;

/** Aspect ratios already measured, so a revisited photo opens at its size. */
const RATIOS = new Map<string, number>();

function readViewport() {
  if (typeof window === "undefined") return { w: 1280, h: 800 };
  return { w: window.innerWidth, h: window.innerHeight };
}

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [vp, setVp] = useState(readViewport);

  const prev = useCallback(() => {
    onIndexChange((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onIndexChange]);
  const next = useCallback(() => {
    onIndexChange((index + 1) % photos.length);
  }, [index, photos.length, onIndexChange]);

  // Keyboard: Esc closes, arrows navigate, Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])")
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, prev, next]);

  // Focus in on open (the Close button), back to the opener on close.
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      openerRef.current?.focus?.({ preventScroll: true });
      openerRef.current = null;
    };
  }, [open]);

  // Body scroll lock while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  // The frame is sized in JS from the viewport and the photo's ratio.
  useEffect(() => {
    if (!open) return;
    const onResize = () => setVp(readViewport());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  if (!open) {
    return null;
  }
  const photo = photos[index];
  const preload = [photos[(index + 1) % photos.length], photos[(index - 1 + photos.length) % photos.length]];
  const narrow = vp.w < NARROW;
  const maxW = narrow ? vp.w : Math.min(vp.w - 160, 1152);
  const maxH = Math.max(160, vp.h - (narrow ? ROOM_NARROW : ROOM_WIDE));

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo ${index + 1} of ${photos.length}: ${photo.alt}`}
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
        {/* Counter — top-left pill, fixed white on the backdrop */}
        <div
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide select-none tabular-nums"
          style={{ background: "rgba(255,255,255,0.1)", color: WHITE, border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(8px)" }}
        >
          {index + 1} <span style={{ color: WHITE_DIM }}>/ {photos.length}</span>
        </div>

        {/* Close — orange circle, top-right; takes focus on open */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close (Esc)"
          className={`absolute top-4 right-4 sm:top-5 sm:right-5 z-10 flex ${BTN_CLASS}`}
          style={BTN}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth={2.5} strokeLinecap="round" />
          </svg>
        </button>

        {/* Prev / Next on the backdrop beside the frame, from sm up */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
            className={`absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden sm:flex ${BTN_CLASS}`}
            style={BTN}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Frame: the photo, then its caption, then (phones) the arrows */}
        <Frame key={photo.src} photo={photo} maxW={maxW} maxH={maxH} narrow={narrow}>
          {photos.length > 1 && (
            <div className="flex sm:hidden items-center justify-center gap-5 pt-4" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={prev} aria-label="Previous photo" className={`flex ${BTN_CLASS}`} style={BTN}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" onClick={next} aria-label="Next photo" className={`flex ${BTN_CLASS}`} style={BTN}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </Frame>

        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
            className={`absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden sm:flex ${BTN_CLASS}`}
            style={BTN}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Adjacent-frame preload (hidden) */}
        <div aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
          {preload.map((p) => (
            <PhotoImage key={p.src} src={p.src} alt="" width={16} height={16} sizes="16px" />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * One photo with its caption under it. The box is the photo's own shape,
 * as large as the viewport allows: width = min(maxW, maxH × ratio). The
 * ratio comes from the loaded image (4:3 until it has loaded, the common
 * shape here), and is remembered per source for the next visit.
 */
function Frame({
  photo,
  maxW,
  maxH,
  narrow,
  children,
}: {
  photo: LightboxPhoto;
  maxW: number;
  maxH: number;
  narrow: boolean;
  children?: React.ReactNode;
}) {
  const [ratio, setRatio] = useState(() => RATIOS.get(photo.src) ?? 4 / 3);
  const w = Math.round(Math.min(maxW, maxH * ratio));
  const h = Math.round(w / ratio);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.975 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col"
      style={{ width: w, maxWidth: "100%" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative" style={{ width: w, height: h, maxWidth: "100%" }}>
        <PhotoImage
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-contain"
          style={{ filter: narrow ? undefined : "drop-shadow(0 24px 60px rgba(0,0,0,0.6))" }}
          sizes="92vw"
          quality={85}
          priority
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              const r = img.naturalWidth / img.naturalHeight;
              RATIOS.set(photo.src, r);
              if (Math.abs(r - ratio) > 0.01) setRatio(r);
            }
          }}
        />
      </div>

      {/* Caption, the frame's full width, under the picture. Fixed white: the
          backdrop is dark in every theme. */}
      <div className={`pt-3 ${narrow ? "px-4" : ""}`}>
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "#FB923C" }}>
          HUB Surface Systems
        </p>
        <p className="text-[13px] sm:text-sm font-semibold leading-snug" style={{ color: WHITE }}>
          {photo.caption ?? photo.alt}
        </p>
      </div>

      {children}
    </motion.div>
  );
}
