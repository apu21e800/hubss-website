"use client";

/**
 * The catalogue reader.
 *
 * ONE PAGE AT A TIME. The previous viewer showed a two-page spread on desktop,
 * which sounds like a book and reads like a compromise: the pair is letterboxed
 * into whatever is left of a 16:9 window, so each 6x6in page ends up smaller
 * than it would be alone, and the spread arithmetic (cover alone on the right,
 * odd-even pairs after) is a source of off-by-one bugs nobody can see. This
 * book is square and its pages are designed to be read singly. So: one page,
 * as large as the window allows, on every device.
 *
 * NO PAPER. No curl, no shadow down a fake gutter, no page-flip. Those effects
 * are the reason "flipbook" widgets feel like 2009. A page turn here is a
 * 120ms cross-fade between two images that are already decoded.
 *
 * NEVER A SPINNER. Two pages either side of the current one are mounted and
 * loading at all times, so a turn has nothing to wait for. The outgoing page
 * stays mounted through the fade, so there is no white flash between them.
 *
 * NOT A TRAP. There is a visible close control, Escape leaves, and page turns
 * use replaceState rather than pushState: the URL is always shareable but the
 * back button exits the catalogue in one press instead of walking back through
 * 144 history entries.
 */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cataloguePageSrcSet, cataloguePageUrl, type CatalogueDownload } from "@/lib/catalogue";
import type { CataloguePage } from "@/lib/catalogue-pages";

// Loaded only when someone asks for the book, so the reader's bundle stays
// the reader.
const PrintedCopyForm = dynamic(() => import("@/components/catalogue/PrintedCopyForm"), { ssr: false });

const MAX_SCALE = 3.2;
const TAP_ZOOM = 2.2;
const FADE_MS = 120;
/** Pages kept mounted either side of the current one. */
const PRELOAD = 2;
/**
 * Space reserved for the chrome, in px. Asymmetric on purpose: the header is a
 * single row of pills, the footer carries a scrubber, a CTA and the page jump.
 * A symmetric 64/64 put the scrubber over the bottom 40px of every page, which
 * reads as the artwork being clipped even though it is only overlapped.
 */
const CHROME_TOP = 56;
const CHROME_BOTTOM = 96;
const CHROME = CHROME_TOP + CHROME_BOTTOM;

type Props = {
  pages: CataloguePage[];
  widths: number[];
  aspect: number;
  edition: string;
  start: number;
  download: CatalogueDownload | null;
  exitHref: string;
  requestHref: string;
  lunchLearnHref: string;
};

type View = { s: number; x: number; y: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function CatalogueViewer({
  pages,
  widths,
  aspect,
  edition,
  start,
  download,
  exitHref,
  requestHref,
  lunchLearnHref,
}: Props) {
  const total = pages.length;
  const maxWidth = widths[widths.length - 1];

  const [idx, setIdx] = useState(clamp(start - 1, 0, total - 1));
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [chrome, setChrome] = useState(true);
  const [stageW, setStageW] = useState<number | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [jump, setJump] = useState("");
  const [askingForPrint, setAskingForPrint] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const chromeTimer = useRef<number | null>(null);
  const zoomed = view.s > 1.01;

  // --- page addressing ---------------------------------------------------
  // replaceState, not a router push: a router push re-runs the server
  // component for a page turn, and pushState would bury the way out under 144
  // history entries.
  const goTo = useCallback(
    (next: number) => {
      const n = clamp(next, 0, total - 1);
      setIdx(n);
      setView({ s: 1, x: 0, y: 0 });
      if (typeof window !== "undefined") {
        const url = n === 0 ? "/catalogue" : `/catalogue/${n + 1}`;
        window.history.replaceState(null, "", url + window.location.search);
      }
    },
    [total],
  );
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);
  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);

  // --- how big the page is drawn, and therefore which raster to fetch ----
  useEffect(() => {
    const measure = () => {
      const h = window.innerHeight - CHROME;
      const w = window.innerWidth;
      setStageW(Math.max(200, Math.min(w, h * aspect)));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [aspect]);

  // `sizes` is the whole width-selection mechanism: the browser multiplies it
  // by the device pixel ratio and picks from srcset. Zooming widens it, which
  // is a relevant mutation, so the largest raster is fetched on demand rather
  // than up front.
  //
  // Before JS measures anything, the server has to guess. "100vw" was the old
  // guess and it is wrong by a lot: the stage is letterboxed to
  // min(100vw, viewport height - chrome), so on a 1440x900 desktop it is 772px
  // wide, and a 100vw hint had the browser fetch a raster nearly twice the size
  // it would draw. The CSS expression below is the stage's actual rule, so the
  // first paint asks for the right file; a browser that cannot parse math in
  // `sizes` falls back to the full width, which is the old behaviour.
  const baseSizes =
    stageW === null ? `min(100vw, calc(100dvh - ${CHROME}px))` : `${Math.round(stageW)}px`;
  // Only the page being looked at is worth the widest raster. Applying the
  // zoomed hint to the whole mounted window fetched 2000px versions of four
  // neighbours as well - about 930 KB of pages nobody was looking at, every
  // time someone scrolled to zoom.
  const sizesFor = (active: boolean) => (active && zoomed ? `${maxWidth}px` : baseSizes);

  useEffect(() => setCanShare(typeof navigator !== "undefined" && "share" in navigator), []);

  // --- zoom about a point ------------------------------------------------
  const zoomAbout = useCallback((nextScale: number, clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = clientX - (r.left + r.width / 2);
    const cy = clientY - (r.top + r.height / 2);
    setView((v) => {
      const s = clamp(nextScale, 1, MAX_SCALE);
      if (s <= 1.001) return { s: 1, x: 0, y: 0 };
      const x = cx - (cx - v.x) * (s / v.s);
      const y = cy - (cy - v.y) * (s / v.s);
      const mx = (r.width * (s - 1)) / 2;
      const my = (r.height * (s - 1)) / 2;
      return { s, x: clamp(x, -mx, mx), y: clamp(y, -my, my) };
    });
  }, []);

  const panBy = useCallback((dx: number, dy: number, from: View) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = (r.width * (from.s - 1)) / 2;
    const my = (r.height * (from.s - 1)) / 2;
    setView({ s: from.s, x: clamp(from.x + dx, -mx, mx), y: clamp(from.y + dy, -my, my) });
  }, []);

  // Wheel has to be a non-passive native listener; React's onWheel is
  // registered passive in some builds and preventDefault() is then a no-op.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // A trackpad pinch arrives as ctrl+wheel with much larger deltas.
      const k = e.ctrlKey ? 0.01 : 0.0022;
      setView((v) => {
        const target = v.s * Math.exp(-e.deltaY * k);
        const s = clamp(target, 1, MAX_SCALE);
        const r = el.getBoundingClientRect();
        const cx = e.clientX - (r.left + r.width / 2);
        const cy = e.clientY - (r.top + r.height / 2);
        if (s <= 1.001) return { s: 1, x: 0, y: 0 };
        const x = cx - (cx - v.x) * (s / v.s);
        const y = cy - (cy - v.y) * (s / v.s);
        const mx = (r.width * (s - 1)) / 2;
        const my = (r.height * (s - 1)) / 2;
        return { s, x: clamp(x, -mx, mx), y: clamp(y, -my, my) };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // --- pointers: tap, swipe, drag-pan, two-finger pinch ------------------
  // One handler set for mouse, pen and touch. Native pinch-zoom is not usable
  // here (the stage is a fixed full-viewport element, so the visual viewport
  // zooms the chrome along with the page and the reader ends up fighting it),
  // so touch-action is off and the pinch is computed from pointer distance.
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; view: View } | null>(null);
  const drag = useRef<{ x: number; y: number; view: View; moved: number; t: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), view };
      drag.current = null;
    } else if (pts.current.size === 1) {
      drag.current = { x: e.clientX, y: e.clientY, view, moved: 0, t: Date.now() };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pts.current.size >= 2 && pinch.current) {
      const [a, b] = [...pts.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current.dist > 0) {
        const ratio = dist / pinch.current.dist;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const el = stageRef.current;
        if (el) {
          const r = el.getBoundingClientRect();
          const cx = mid.x - (r.left + r.width / 2);
          const cy = mid.y - (r.top + r.height / 2);
          const base = pinch.current.view;
          const s = clamp(base.s * ratio, 1, MAX_SCALE);
          if (s <= 1.001) setView({ s: 1, x: 0, y: 0 });
          else {
            const x = cx - (cx - base.x) * (s / base.s);
            const y = cy - (cy - base.y) * (s / base.s);
            const mx = (r.width * (s - 1)) / 2;
            const my = (r.height * (s - 1)) / 2;
            setView({ s, x: clamp(x, -mx, mx), y: clamp(y, -my, my) });
          }
        }
      }
      return;
    }

    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.moved = Math.max(d.moved, Math.hypot(dx, dy));
    if (d.view.s > 1.01) panBy(dx, dy, d.view);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pts.current.delete(e.pointerId);
    if (pts.current.size < 2) pinch.current = null;
    const d = drag.current;
    if (!d || pts.current.size > 0) {
      if (pts.current.size === 0) drag.current = null;
      return;
    }
    drag.current = null;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const dt = Date.now() - d.t;

    if (d.view.s <= 1.01) {
      // Horizontal flick turns the page; a still finger toggles zoom.
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 800) {
        if (dx < 0) next();
        else prev();
        return;
      }
      if (d.moved < 10) {
        zoomAbout(TAP_ZOOM, e.clientX, e.clientY);
        return;
      }
    } else if (d.moved < 10) {
      setView({ s: 1, x: 0, y: 0 });
    }
  };

  // --- keyboard ----------------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
      // Space must not turn the page while someone is filling in a form.
      if (askingForPrint && e.key !== "Escape") return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(total - 1);
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomAbout(view.s * 1.4, window.innerWidth / 2, window.innerHeight / 2);
          break;
        case "-":
          e.preventDefault();
          zoomAbout(view.s / 1.4, window.innerWidth / 2, window.innerHeight / 2);
          break;
        case "Escape":
          // Escape unwinds one layer at a time: the form, then the zoom, then
          // the catalogue. Never all three at once, and never nothing.
          if (askingForPrint) {
            e.preventDefault();
            setAskingForPrint(false);
          } else if (zoomed) {
            e.preventDefault();
            setView({ s: 1, x: 0, y: 0 });
          } else {
            window.location.href = exitHref;
          }
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, total, zoomAbout, view.s, zoomed, exitHref, askingForPrint]);

  // --- chrome auto-hide --------------------------------------------------
  const wake = useCallback(() => {
    setChrome(true);
    if (chromeTimer.current) window.clearTimeout(chromeTimer.current);
    chromeTimer.current = window.setTimeout(() => setChrome(false), 4000);
  }, []);
  useEffect(() => {
    wake();
    return () => {
      if (chromeTimer.current) window.clearTimeout(chromeTimer.current);
    };
  }, [idx, wake]);

  // --- which pages are mounted ------------------------------------------
  const mounted = useMemo(() => {
    const s = new Set<number>();
    for (let d = -PRELOAD; d <= PRELOAD; d++) {
      const i = idx + d;
      if (i >= 0 && i < total) s.add(i);
    }
    return s;
  }, [idx, total]);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://hubss.com/catalogue";
    try {
      await navigator.share({
        title: `HUB Surface Systems Catalogue ${edition}`,
        text: "Decorative Pavement Solutions - the HUB Surface Systems catalogue.",
        url,
      });
    } catch {
      /* dismissed */
    }
  };

  const submitJump = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(jump);
    if (Number.isInteger(n) && n >= 1 && n <= total) goTo(n - 1);
    setJump("");
  };

  return (
    <main
      data-surface="dark"
      className="relative h-dvh w-screen select-none overflow-hidden bg-black"
      style={{ color: "var(--text-primary)" }}
      onMouseMove={wake}
      onPointerDown={wake}
    >
      {/* Stage. The outer element is never transformed, so its rect stays the
          reference frame for every zoom and pan calculation. */}
      <div
        className="absolute inset-x-0 grid place-items-center"
        style={{ top: CHROME_TOP, bottom: CHROME_BOTTOM }}
      >
        <div
          ref={stageRef}
          className="relative overflow-hidden"
          style={{
            width: stageW === null ? "min(100vw, 100%)" : stageW,
            aspectRatio: String(aspect),
            touchAction: "none",
            cursor: zoomed ? "grab" : "zoom-in",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`,
              transition: drag.current || pinch.current ? "none" : "transform 220ms cubic-bezier(0.22,1,0.36,1)",
              willChange: "transform",
            }}
          >
            {pages.map((p, i) => {
              if (!mounted.has(i)) return null;
              const active = i === idx;
              return (
                <img
                  key={p.n}
                  src={cataloguePageUrl(p.n, widths[0])}
                  srcSet={cataloguePageSrcSet(p.n)}
                  sizes={sizesFor(active)}
                  alt={p.alt}
                  width={maxWidth}
                  height={Math.round(maxWidth / aspect)}
                  draggable={false}
                  fetchPriority={active ? "high" : "low"}
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{
                    opacity: active ? 1 : 0,
                    transition: `opacity ${FADE_MS}ms linear`,
                    pointerEvents: "none",
                  }}
                  aria-hidden={!active}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Top chrome */}
      <header
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-3 pb-3 pt-[max(env(safe-area-inset-top),0.75rem)] sm:px-5"
        style={{
          opacity: chrome ? 1 : 0,
          transition: "opacity 250ms ease",
          background: chrome ? "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 100%)" : "transparent",
        }}
      >
        <Link
          href={exitHref}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.82)" }}
          aria-label="Close the catalogue"
        >
          <CloseIcon />
          <span className="hidden sm:inline">Close</span>
        </Link>

        <div className="pointer-events-none min-w-0 text-center">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "#fb923c" }}>
            Catalogue {edition}
          </p>
          <p className="text-[11px] tabular-nums" style={{ color: "rgba(255,255,255,0.62)" }}>
            Page {idx + 1} of {total}
          </p>
        </div>

        <div className="pointer-events-auto flex flex-shrink-0 items-center gap-2">
          {/* A real link, so it can be opened in a new tab or shared, that
              prefers the in-place overlay on a plain click - nobody should
              have to leave page 78 to ask for the book. */}
          <a
            href={requestHref}
            className={pill}
            title="Have a printed copy mailed to you"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              setAskingForPrint(true);
            }}
          >
            <MailIcon />
            <span className="hidden md:inline">Printed copy</span>
          </a>
          {download && (
            <a href={download.href} download className={pill} title={`Download the PDF (${download.label})`}>
              <DownloadIcon />
              <span className="hidden sm:inline">PDF</span>
            </a>
          )}
          {canShare && (
            <button type="button" onClick={onShare} className={pill} aria-label="Share this page">
              <ShareIcon />
            </button>
          )}
        </div>
      </header>

      {/* Page arrows. Kept off touch-only viewports, where the swipe is the
          gesture and a 44px target either side of the page would sit on top of
          the artwork. */}
      <button
        type="button"
        onClick={prev}
        disabled={idx === 0}
        aria-label="Previous page"
        className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-3 transition disabled:opacity-25 sm:block"
        style={{ background: "rgba(0,0,0,0.42)", color: "#fff", backdropFilter: "blur(6px)", opacity: chrome ? undefined : 0.25 }}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={next}
        disabled={idx === total - 1}
        aria-label="Next page"
        className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-3 transition disabled:opacity-25 sm:block"
        style={{ background: "rgba(0,0,0,0.42)", color: "#fff", backdropFilter: "blur(6px)", opacity: chrome ? undefined : 0.25 }}
      >
        <ChevronRight />
      </button>

      {/* Bottom chrome: scrubber, jump-to-page, and the one CTA */}
      <footer
        className="absolute inset-x-0 bottom-0 z-20 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-8 sm:px-5"
        style={{ opacity: chrome ? 1 : 0, transition: "opacity 250ms ease", pointerEvents: chrome ? "auto" : "none" }}
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-2.5">
          <input
            type="range"
            min={1}
            max={total}
            value={idx + 1}
            onChange={(e) => goTo(Number(e.target.value) - 1)}
            aria-label={`Jump to a page. Currently page ${idx + 1} of ${total}.`}
            className="catalogue-scrub w-full"
          />
          <div className="flex items-center justify-between gap-3">
            <Link
              href={lunchLearnHref}
              className="rounded-full px-5 py-3 text-[13px] font-semibold text-white transition-colors"
              style={{ background: "#F97316", boxShadow: "0 4px 16px rgba(249,115,22,0.30)" }}
            >
              Book a Lunch &amp; Learn
            </Link>
            <form onSubmit={submitJump} className="hidden items-center gap-2 sm:flex">
              <label htmlFor="catalogue-jump" className="text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                Go to page
              </label>
              <input
                id="catalogue-jump"
                type="number"
                min={1}
                max={total}
                value={jump}
                onChange={(e) => setJump(e.target.value)}
                placeholder={String(idx + 1)}
                className="w-16 rounded-lg px-2 py-1.5 text-center text-[13px] tabular-nums outline-none"
                style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.16)" }}
              />
            </form>
          </div>
        </div>
      </footer>

      {askingForPrint && (
        <div
          className="absolute inset-0 z-30 overflow-y-auto overscroll-contain"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setAskingForPrint(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Request a printed catalogue"
            className="mx-auto my-8 w-[min(680px,calc(100vw-2rem))] rounded-2xl p-6 sm:p-8"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--accent-text)" }}>
                  Catalogue {edition}
                </p>
                <h2 className="mt-1.5 text-xl font-bold sm:text-2xl" style={{ color: "var(--text-primary)" }}>
                  Have the printed book mailed to you
                </h2>
                <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {total} pages, perfect bound, with the material samples that go with it.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAskingForPrint(false)}
                aria-label="Close"
                className="rounded-full p-2 transition-colors hover:bg-[var(--ink-10)]"
                style={{ color: "var(--text-muted)" }}
              >
                <CloseIcon />
              </button>
            </div>
            <PrintedCopyForm compact />
          </div>
        </div>
      )}

      <style>{`
        .catalogue-scrub {
          -webkit-appearance: none;
          appearance: none;
          height: 22px;
          background: transparent;
          cursor: pointer;
        }
        .catalogue-scrub::-webkit-slider-runnable-track {
          height: 3px;
          border-radius: 3px;
          background: rgba(255,255,255,0.22);
        }
        .catalogue-scrub::-moz-range-track {
          height: 3px;
          border-radius: 3px;
          background: rgba(255,255,255,0.22);
        }
        .catalogue-scrub::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          margin-top: -5.5px;
          border-radius: 50%;
          background: #F97316;
          border: 2px solid rgba(0,0,0,0.5);
        }
        .catalogue-scrub::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #F97316;
          border: 2px solid rgba(0,0,0,0.5);
        }
        .catalogue-scrub:focus-visible::-webkit-slider-thumb { outline: 2px solid #fff; outline-offset: 2px; }
      `}</style>
    </main>
  );
}

const pill =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors " +
  "bg-white/10 text-white hover:bg-white/20 border border-white/15";

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 16V4m0 0-4 4m4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m21 7-9 6L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
