"use client";

// HUBSS Catalogue 2026 — digital flipbook viewer.
// Mobile-first; portrait-first; touch swipe + arrow keys + on-screen buttons;
// tap-to-zoom + pinch-zoom; native share; sticky CTA to Lunch & Learn.
//
// Performance rules:
//   - Page 1 is priority-loaded via next/image.
//   - Only a 3-page window (current ±1) renders <Image>, so we never inflate
//     the DOM with 116 image nodes. Adjacent pages preload for instant swipe.
//   - WebP sources are ~99 KB each at 1200x1200, so total initial payload
//     for {p1 + chrome} sits comfortably under 1.5 MB.

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const LUNCH_LEARN_HREF =
  "/lunch-learn?utm_source=catalogue&utm_medium=flipbook&utm_campaign=web";

type Props = {
  pages: string[];
  /** URL of the downloadable web-sized PDF, e.g. /catalogue/HUBSS-Catalogue-2026.pdf */
  downloadHref?: string;
};

export default function Flipbook({ pages, downloadHref }: Props) {
  const total = pages.length;
  const [idx, setIdx] = useState(0);                          // current page (0-based)
  const [zoom, setZoom] = useState(false);                    // tap-zoom toggle
  const [origin, setOrigin] = useState("50% 50%");             // transform-origin for zoom
  const [chromeVisible, setChromeVisible] = useState(true);
  const [shareSupported, setShareSupported] = useState(false);
  const chromeTimer = useRef<number | null>(null);

  // ── Navigation helpers ──────────────────────────────────────────────────
  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setIdx(clamped);
      setZoom(false);
    },
    [total],
  );
  const prev = useCallback(() => goTo(idx - 1), [idx, goTo]);
  const next = useCallback(() => goTo(idx + 1), [idx, goTo]);

  // ── Detect native share once ────────────────────────────────────────────
  useEffect(() => {
    setShareSupported(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  // ── Keyboard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "Home") { e.preventDefault(); goTo(0); }
      else if (e.key === "End")  { e.preventDefault(); goTo(total - 1); }
      else if (e.key === "Escape" && zoom) { setZoom(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, goTo, total, zoom]);

  // ── Touch swipe (no library — direct touch math) ────────────────────────
  const touch = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (zoom) return;                                // let browser pinch in zoom mode
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current || zoom) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    const dt = Date.now() - touch.current.t;
    touch.current = null;
    // Horizontal swipe: dx must dominate vertical, traverse > 50px or be a flick
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 700) {
      if (dx < 0) next(); else prev();
    }
  };

  // ── Tap-to-zoom (single tap on image, anywhere) ─────────────────────────
  const onImageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
    setZoom((z) => !z);
  };

  // ── Auto-hide chrome after inactivity (mobile feel) ─────────────────────
  const wakeChrome = useCallback(() => {
    setChromeVisible(true);
    if (chromeTimer.current) window.clearTimeout(chromeTimer.current);
    chromeTimer.current = window.setTimeout(() => setChromeVisible(false), 3500);
  }, []);
  useEffect(() => {
    wakeChrome();
    return () => { if (chromeTimer.current) window.clearTimeout(chromeTimer.current); };
  }, [idx, wakeChrome]);

  // ── Native share ────────────────────────────────────────────────────────
  const onShare = async () => {
    try {
      await navigator.share({
        title: "HUBSS Catalogue 2026",
        text: "HUB Surface Systems — 2026 Catalogue of decorative pavement solutions.",
        url: typeof window !== "undefined" ? window.location.href : "https://hubss.com/catalogue",
      });
    } catch {
      // user cancelled or browser blocked — silent
    }
  };

  // ── Window of pages to actually render in DOM (current ±1) ─────────────
  const window3 = useMemo(() => {
    const s = new Set<number>();
    s.add(idx);
    if (idx > 0) s.add(idx - 1);
    if (idx < total - 1) s.add(idx + 1);
    return s;
  }, [idx, total]);

  return (
    <main
      className="relative h-dvh w-screen overflow-hidden bg-black text-white select-none"
      onMouseMove={wakeChrome}
      onTouchStart={wakeChrome}
    >
      {/* Page stage — letterboxes the 5x5 page on tall screens */}
      <div
        className="absolute inset-0 grid place-items-center"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="relative aspect-square w-full max-w-[min(100vw,calc(100dvh-128px))]
                     overflow-hidden cursor-zoom-in"
          onClick={onImageTap}
          style={{
            transform: zoom ? "scale(2)" : "scale(1)",
            transformOrigin: origin,
            transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: zoom ? "zoom-out" : "zoom-in",
            touchAction: zoom ? "pinch-zoom" : "pan-y",
          }}
        >
          {pages.map((src, i) => {
            const inWindow = window3.has(i);
            const isActive = i === idx;
            return (
              <div
                key={src}
                className="absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.22s ease",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                aria-hidden={!isActive}
              >
                {inWindow ? (
                  <Image
                    src={src}
                    alt={`HUBSS Catalogue 2026 — page ${i + 1} of ${total}`}
                    width={1200}
                    height={1200}
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top chrome — title + share + page counter */}
      <header
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between
                   px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-3"
        style={{
          opacity: chromeVisible ? 1 : 0,
          transition: "opacity 0.25s ease",
          background:
            chromeVisible
              ? "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)"
              : "transparent",
        }}
      >
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]
                     text-white/80 hover:text-white"
        >
          <span aria-hidden>←</span> Hubss.com
        </Link>
        <div className="pointer-events-none text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-orange-400">Catalogue 2026</p>
          <p className="text-[11px] text-white/70 tabular-nums">
            {idx + 1} / {total}
          </p>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {downloadHref && (
            <a
              href={downloadHref}
              download
              className="inline-flex items-center gap-1.5 rounded-full
                         border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] uppercase
                         tracking-[0.18em] text-white hover:bg-white/20"
              aria-label="Download the catalogue as a PDF"
            >
              <DownloadIcon /> PDF
            </a>
          )}
          {shareSupported ? (
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-1.5 rounded-full
                         border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] uppercase
                         tracking-[0.18em] text-white hover:bg-white/20"
              aria-label="Share this catalogue"
            >
              <ShareIcon /> Share
            </button>
          ) : downloadHref ? null : (
            <div className="w-[68px]" /> /* spacer so counter stays centered */
          )}
        </div>
      </header>

      {/* Bottom CTA — sticky, always tappable.
          Vernon v40: more breathing room — footer top padding ↑ from 3 → 5,
          bottom padding ↑, horizontal padding ↑ from 3 → 5, CTA pill more
          generous (px-6 py-3.5), gap between pill + icons ↑ from 2 → 3. The
          pill still left-anchors (v39) but feels considered, not cramped. */}
      <footer
        className="absolute inset-x-0 bottom-0 z-20 px-5
                   pb-[max(env(safe-area-inset-bottom),1rem)] pt-5"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-[640px] items-center justify-start gap-3">
          <Link
            href={LUNCH_LEARN_HREF}
            className="rounded-full bg-[#F97316] px-6 py-3.5 text-left text-[13px] font-semibold
                       text-white shadow-[0_4px_16px_rgba(249,115,22,0.32)]
                       hover:bg-[#ea6d12] active:translate-y-px"
          >
            Book a Free Lunch &amp; Learn
          </Link>
          <a
            href="tel:+16043098212"
            data-event="phone_click"
            aria-label="Call 604-309-8212"
            className="inline-grid h-12 w-12 place-items-center rounded-full border border-white/15
                       bg-white/10 text-white hover:bg-white/20"
          >
            <PhoneIcon />
          </a>
          <a
            href="mailto:info@hubss.com"
            data-event="email_click"
            aria-label="Email info@hubss.com"
            className="inline-grid h-12 w-12 place-items-center rounded-full border border-white/15
                       bg-white/10 text-white hover:bg-white/20"
          >
            <MailIcon />
          </a>
        </div>
      </footer>

      {/* Prev / Next arrows — show on hover-capable devices, also as fall-back
         on mobile when chrome is visible */}
      <button
        type="button"
        onClick={prev}
        disabled={idx === 0}
        className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15
                   bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60
                   disabled:opacity-30 sm:block"
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={next}
        disabled={idx === total - 1}
        className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15
                   bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60
                   disabled:opacity-30 sm:block"
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </main>
  );
}

// ── Inline SVG icons (no icon-library dep for these tiny chrome glyphs) ──
function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 16V4m0 0-4 4m4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07
               19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3
               a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91
               a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72
               A2 2 0 0 1 22 16.92Z"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
      <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
