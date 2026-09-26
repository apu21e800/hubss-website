"use client";

/**
 * The catalogue reader.
 *
 * SPREADS, BECAUSE THE BOOK IS DESIGNED IN SPREADS. An earlier version of this
 * showed one page at a time and argued for it in the commit message. That was
 * wrong, and the book says so: pages 14 and 15 are a single colour chart split
 * across the gutter ("Thirty-seven colours / STANDARD - 20" continuing into
 * "PREMIUM - 17"), and 26|27 does the same for StreetBond. Showing those one
 * page at a time cuts a table in half. The pairing is even-left - cover alone,
 * then 2|3, 4|5 ... 142|143, back cover alone - which is ordinary verso|recto
 * binding, confirmed against the artwork rather than assumed.
 *
 * ONE PAGE ON A PHONE, THOUGH. Two 6x6in pages side by side on a 390px screen
 * is 195px each; the caption type in this book is 8pt. That is not a compromise
 * in the layout, it is the only legible option, and the reader already handles
 * a single page well.
 *
 * A PAGE TURN, ON A DESKTOP. Since Doug's round (phase 3, Sep 2026) a turn
 * between two spreads is a leaf turning on the gutter: the page you're leaving
 * on the front, the page arriving on the back, 700 ms, CSS 3D, no library, no
 * WebGL. Everything else - a phone's single pages, a zoomed spread, the cover,
 * anyone who asked for reduced motion - keeps the 160 ms cross-fade with a
 * 10 px drift, which says which way you went without being an effect.
 *
 * NEVER A SPINNER. The neighbouring spreads stay mounted and loading, so a turn
 * has nothing to wait for, and the outgoing spread stays mounted through the
 * fade so there is no white flash between them.
 *
 * NOT A TRAP. Visible close, Escape unwinds one layer at a time, and turns use
 * replaceState rather than pushState: the URL is always shareable but the back
 * button leaves in one press instead of walking back through 73 history entries.
 */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cataloguePageSrcSet, cataloguePageUrl, ideaBook, type CatalogueDownload } from "@/lib/catalogue";
import type { CataloguePage } from "@/lib/catalogue-pages";
import type { IdeaBookContentsSection, IdeaBookLinks } from "@/lib/idea-book-links";

// Loaded only when someone asks for the book, so the reader's bundle stays
// the reader.
const PrintedCopyForm = dynamic(() => import("@/components/catalogue/PrintedCopyForm"), { ssr: false });

const MAX_SCALE = 3.2;
const TAP_ZOOM = 2.2;
const FADE_MS = 160;
/** The leaf's turn, gutter to gutter. */
const TURN_MS = 700;
/** Spreads kept mounted either side of the current one. */
const PRELOAD = 1;
/**
 * Space reserved for the chrome before it has been measured. Once the header
 * and footer are on screen their real heights are used instead: the constants
 * used to be the only source, and in landscape on a phone the footer came out
 * 21px taller than its constant and sat on the bottom of the page.
 */
const CHROME_TOP = 56;
const CHROME_BOTTOM = 112;
const CHROME_TOP_SM = 56;
const CHROME_BOTTOM_SM = 170;
/**
 * Below this the stage shows one page. At 900px a spread gives each page ~450px
 * of width, which is where this book's smallest captions stop being readable.
 * It needs the height too: a phone on its side can be 932px wide and 430 tall,
 * and a spread there would be two postage stamps.
 */
const SPREAD_MIN_WIDTH = 900;
const SPREAD_MIN_HEIGHT = 600;
/** A phone on its side: short enough that every pixel of chrome costs page. */
const SHORT_MAX_HEIGHT = 500;
/**
 * Phones read the 800px pages unzoomed and fetch the 2000px page only when
 * someone zooms. A 390px-wide phone at 3x would otherwise pick the 1400px set
 * for a page whose 8pt captions nobody can read without zooming anyway: 19 MB
 * of book instead of 9.6 MB. A media query, not a measurement, so the right
 * file is chosen while the HTML is still arriving. Tablets are taller than
 * 1000px on either side and keep the full srcset.
 */
const PHONE_MQ = "(max-width: 899px) and (max-height: 1000px), (max-height: 499px)";

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
  /** Page number → what that spread shows (lib/idea-book-links.ts). */
  links: IdeaBookLinks;
  contents: IdeaBookContentsSection[];
};

type View = { s: number; x: number; y: number };

/** A turn in progress: which spreads, which way, and whether the leaf has started to move. */
type Turn = { from: number; to: number; dir: 1 | -1; started: boolean };

/**
 * GA4, through the gtag the root layout's <GoogleAnalytics> installs. Every
 * event carries the page so a report can say which spreads people reach.
 * Quiet when analytics is blocked: the reader never waits on it.
 */
function track(name: string, params: Record<string, string | number | undefined>) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, { event_category: "idea_book", ...params });
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * What the stage shows at once. Verso|recto: the cover is a right-hand page on
 * its own, then every even page opens a spread with the odd page after it, and
 * a final even page (the back cover) ends up alone.
 */
function buildSpreads(total: number): number[][] {
  const out: number[][] = [[1]];
  for (let n = 2; n + 1 <= total; n += 2) out.push([n, n + 1]);
  if (total % 2 === 0 && total > 1) out.push([total]);
  return out;
}

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
  links,
  contents,
}: Props) {
  const total = pages.length;
  const maxWidth = widths[widths.length - 1];
  const [turn, setTurn] = useState<Turn | null>(null);
  const [showContents, setShowContents] = useState(false);
  const reducedMotion = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { reducedMotion.current = mq.matches; };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const [spreadMode, setSpreadMode] = useState(false);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [chrome, setChrome] = useState(true);
  const [stageW, setStageW] = useState<number | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [jump, setJump] = useState("");
  const [askingForPrint, setAskingForPrint] = useState(false);
  const [dir, setDir] = useState(1);
  const [chromeTop, setChromeTop] = useState(CHROME_TOP);
  const [chromeBottom, setChromeBottom] = useState(CHROME_BOTTOM);
  const [compact, setCompact] = useState(false);
  const [short, setShort] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  /** Chrome that stays put: a phone either way up, where it lives beside the
   *  page rather than over it. */
  const compactRef = useRef(false);
  const chromeTimer = useRef<number | null>(null);
  const zoomed = view.s > 1.01;

  // Rebuilding the list on a breakpoint change is what lets the same component
  // be a spread reader and a single-page reader without two code paths.
  const views = useMemo(
    () => (spreadMode ? buildSpreads(total) : Array.from({ length: total }, (_, i) => [i + 1])),
    [spreadMode, total],
  );

  const viewOf = useCallback(
    (page: number) => {
      const i = views.findIndex((v) => v.includes(page));
      return i < 0 ? 0 : i;
    },
    [views],
  );

  // The page the reader wants in front of them. Held in a ref, not derived
  // from `vi`, because `vi` means different things in single-page and spread
  // mode — this is what survives the switch between them.
  const pageRef = useRef(start);
  const [vi, setVi] = useState(() => {
    // First render is always single-page (the breakpoint is measured in an
    // effect), so the initial index is simply the page number.
    const i = start - 1;
    return i < 0 ? 0 : i;
  });
  // Re-seat on the same page whenever the layout flips, so a resize — or the
  // first measurement after mount — never throws the reader back to the cover.
  useEffect(() => {
    setVi(viewOf(pageRef.current));
  }, [viewOf]);

  const goTo = useCallback(
    (nextVi: number, direction = 1) => {
      const n = clamp(nextVi, 0, views.length - 1);
      setDir(direction);
      const group = views[n] ?? [1];
      if (!group.includes(pageRef.current)) pageRef.current = group[0];
      setView({ s: 1, x: 0, y: 0 });
      const first = views[n]?.[0] ?? 1;
      if (typeof window !== "undefined") {
        const url = first === 1 ? ideaBook.href : `${ideaBook.href}/${first}`;
        window.history.replaceState(null, "", url + window.location.search);
      }
      // A leaf turns only between two full spreads, one step apart, on a
      // desktop, unzoomed, for someone who hasn't asked for reduced motion.
      // The cover and the back cover sit alone on the stage, so a turn to or
      // from them cross-fades as before.
      setVi((cur) => {
        const step = n - cur;
        const canTurn =
          spreadMode && !reducedMotion.current && Math.abs(step) === 1 &&
          (views[cur]?.length ?? 0) === 2 && (views[n]?.length ?? 0) === 2;
        if (canTurn) {
          setTurn({ from: cur, to: n, dir: step > 0 ? 1 : -1, started: false });
          return cur;
        }
        return n;
      });
    },
    [views, spreadMode],
  );

  // The leaf is mounted flat, then told to turn on the next frame so the CSS
  // transition has something to move from; when it lands the real spread takes
  // over and the leaf goes.
  useEffect(() => {
    if (!turn || turn.started) return;
    // Two frames, not one: a state change inside the first animation frame is
    // flushed before the browser paints the flat leaf, and a transition with
    // no painted starting state is a jump.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setTurn((t) => (t ? { ...t, started: true } : t)));
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [turn]);
  useEffect(() => {
    if (!turn?.started) return;
    const t = window.setTimeout(() => {
      setVi(turn.to);
      setTurn(null);
    }, TURN_MS + 30);
    return () => window.clearTimeout(t);
  }, [turn]);
  const goToPage = useCallback(
    (page: number) => {
      const direction = page >= (pageRef.current ?? 1) ? 1 : -1;
      pageRef.current = page;
      goTo(viewOf(page), direction);
    },
    [goTo, viewOf],
  );
  const prev = useCallback(() => { if (!turn) goTo(vi - 1, -1); }, [goTo, vi, turn]);
  const next = useCallback(() => { if (!turn) goTo(vi + 1, 1); }, [goTo, vi, turn]);

  // GA4: the book was opened, and each spread reached (settled for a moment,
  // so a scrub through the pages counts once).
  const shownFirst = views[vi]?.[0] ?? 1;
  useEffect(() => { track("idea_book_open", { page: start }); }, [start]);
  useEffect(() => {
    const t = window.setTimeout(() => track("idea_book_page", { page: shownFirst }), 800);
    return () => window.clearTimeout(t);
  }, [shownFirst]);

  // --- layout ------------------------------------------------------------
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const vh = window.innerHeight;
      const wide = w >= SPREAD_MIN_WIDTH && vh >= SPREAD_MIN_HEIGHT;
      const low = vh < SHORT_MAX_HEIGHT && w > vh;
      const small = w < 640 && !low;
      // The chrome's real height, once it exists. The stage sits between the
      // two bars, so they can never cover the page whatever the screen does.
      const top = headerRef.current?.offsetHeight || (small ? CHROME_TOP_SM : CHROME_TOP);
      const bottom = footerRef.current?.offsetHeight || (small ? CHROME_BOTTOM_SM : CHROME_BOTTOM);
      setSpreadMode(wide);
      setCompact(small);
      setShort(low);
      compactRef.current = small || low;
      setChromeTop(top);
      setChromeBottom(bottom);
      const h = vh - top - bottom;
      const ratio = wide ? aspect * 2 : aspect;
      setStageW(Math.max(160, Math.min(w, h * ratio)));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    // The bars change height when the layout flips (a phone turned on its
    // side drops a row), which a resize event alone doesn't cover.
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measure()) : null;
    if (headerRef.current) ro?.observe(headerRef.current);
    if (footerRef.current) ro?.observe(footerRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      ro?.disconnect();
    };
  }, [aspect]);

  const stageRatio = spreadMode ? aspect * 2 : aspect;
  // One page is half the stage in spread mode. The browser multiplies by the
  // device pixel ratio and picks from srcset; zooming widens the hint so the
  // largest raster is fetched on demand rather than up front.
  const pageCss = stageW === null ? null : stageW / (spreadMode ? 2 : 1);
  // Before the stage is measured, a media-query guess at the same answer, so
  // the first paint doesn't fetch one width and the measurement another.
  const baseSizes = pageCss === null ? "(max-width: 899px) and (orientation: portrait) 100vw, (max-width: 899px) calc(100vh - 110px), 50vw" : `${Math.round(pageCss)}px`;
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

  // Wheel must be a non-passive native listener; React's onWheel is registered
  // passive in some builds and preventDefault() is then a no-op.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
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
  // One handler set for mouse, pen and touch. Native pinch is not usable on a
  // fixed full-viewport element, so touch-action is off and the pinch is
  // computed from pointer distance.
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; view: View } | null>(null);
  const drag = useRef<{ x: number; y: number; view: View; moved: number; t: number; touch: boolean } | null>(null);
  const lastTap = useRef<{ t: number; x: number; y: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), view };
      drag.current = null;
    } else if (pts.current.size === 1) {
      drag.current = { x: e.clientX, y: e.clientY, view, moved: 0, t: Date.now(), touch: e.pointerType !== "mouse" };
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
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 800) {
        if (dx < 0) next();
        else prev();
        return;
      }
      if (d.moved < 10) {
        // On a mouse, a click zooms — the chrome is revealed by moving the
        // pointer, so a click has nothing else to do. On touch there is no
        // hover, so a single tap is the only way to bring the controls back:
        // tap toggles the chrome, and a double tap zooms. Making a single tap
        // zoom on a phone meant every attempt to reach the controls magnified
        // the page instead.
        if (!d.touch) {
          zoomAbout(TAP_ZOOM, e.clientX, e.clientY);
          return;
        }
        const now = Date.now();
        const l = lastTap.current;
        const isDouble = l && now - l.t < 320 && Math.hypot(e.clientX - l.x, e.clientY - l.y) < 28;
        lastTap.current = { t: now, x: e.clientX, y: e.clientY };
        if (isDouble) {
          lastTap.current = null;
          zoomAbout(TAP_ZOOM, e.clientX, e.clientY);
        } else if (!compactRef.current) {
          if (chrome) {
            setChrome(false);
            if (chromeTimer.current) window.clearTimeout(chromeTimer.current);
          } else {
            wake();
          }
        }
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
      if ((askingForPrint || showContents) && e.key !== "Escape") return;
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
          goTo(0, -1);
          break;
        case "End":
          e.preventDefault();
          goTo(views.length - 1, 1);
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
          if (showContents) {
            e.preventDefault();
            setShowContents(false);
          } else if (askingForPrint) {
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
  }, [next, prev, goTo, views.length, zoomAbout, view.s, zoomed, exitHref, askingForPrint, showContents]);

  // --- chrome auto-hide --------------------------------------------------
  const wake = useCallback(() => {
    setChrome(true);
    if (chromeTimer.current) window.clearTimeout(chromeTimer.current);
    // A square page on a tall phone leaves black above and below it whatever
    // we do. The controls live in that space rather than on top of the
    // artwork, so there is nothing to auto-hide and hiding them would only
    // make them hard to find again.
    if (compactRef.current) return;
    chromeTimer.current = window.setTimeout(() => setChrome(false), 4000);
  }, []);
  useEffect(() => {
    wake();
    return () => {
      if (chromeTimer.current) window.clearTimeout(chromeTimer.current);
    };
  }, [vi, wake]);

  const mounted = useMemo(() => {
    const s = new Set<number>();
    for (let d = -PRELOAD; d <= PRELOAD; d++) {
      const i = vi + d;
      if (i >= 0 && i < views.length) s.add(i);
    }
    return s;
  }, [vi, views.length]);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://hubss.com${ideaBook.href}`;
    try {
      await navigator.share({
        title: ideaBook.title,
        text: "Decorative Pavement Solutions - the HUB Surface Systems Idea Book.",
        url,
      });
    } catch {
      /* dismissed */
    }
  };

  const submitJump = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(jump);
    if (Number.isInteger(n) && n >= 1 && n <= total) goToPage(n);
    setJump("");
  };

  // On a phone the controls sit in the black beside a square page rather than
  // over the artwork, so there is nothing to auto-hide.
  const visible = chrome || compact || short;
  const shown = views[vi] ?? [1];
  const label = shown.length === 2 ? `Pages ${shown[0]}–${shown[1]} of ${total}` : `Page ${shown[0]} of ${total}`;

  return (
    <main
      data-surface="dark"
      className="relative h-dvh w-screen select-none overflow-hidden bg-black"
      style={{ color: "var(--text-primary)" }}
      onMouseMove={wake}
    >
      {/* Stage. The outer element is never transformed, so its rect stays the
          reference frame for every zoom and pan calculation. */}
      <div
        className="absolute inset-x-0 grid place-items-center"
        style={{ top: chromeTop, bottom: chromeBottom }}
      >
        <div
          ref={stageRef}
          className="relative overflow-hidden"
          style={{
            width: stageW === null ? "min(100vw, 100%)" : stageW,
            aspectRatio: String(stageRatio),
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
            {turn && (() => {
              // Forward: the base shows the left page staying and the far
              // right page arriving; the leaf carries the right page away
              // on its front and brings the next left page on its back.
              // Backward is the mirror.
              const a = views[turn.from]; const b = views[turn.to];
              const baseLeft = turn.dir > 0 ? a[0] : b[0];
              const baseRight = turn.dir > 0 ? b[1] : a[1];
              const front = turn.dir > 0 ? a[1] : a[0];
              const back = turn.dir > 0 ? b[0] : b[1];
              const page = (n: number, side: "left" | "right") => (
                <img
                  src={cataloguePageUrl(n, widths[0])}
                  srcSet={cataloguePageSrcSet(n)}
                  sizes={baseSizes}
                  alt=""
                  width={maxWidth}
                  height={Math.round(maxWidth / aspect)}
                  draggable={false}
                  className={`h-full w-auto max-w-none object-contain ${side === "left" ? "ml-auto" : "mr-auto"}`}
                />
              );
              const angle = turn.started ? (turn.dir > 0 ? -180 : 180) : 0;
              return (
                <div className="absolute inset-0" style={{ perspective: "2600px" }} aria-hidden>
                  <div className="absolute inset-y-0 left-0 flex w-1/2">{page(baseLeft, "left")}</div>
                  <div className="absolute inset-y-0 right-0 flex w-1/2">{page(baseRight, "right")}</div>
                  {/* The gutter's shadow on the page being uncovered. */}
                  <div
                    className="absolute inset-y-0 w-1/2"
                    style={{
                      left: turn.dir > 0 ? "50%" : 0,
                      background: turn.dir > 0
                        ? "linear-gradient(to right, rgba(0,0,0,0.38), rgba(0,0,0,0) 35%)"
                        : "linear-gradient(to left, rgba(0,0,0,0.38), rgba(0,0,0,0) 35%)",
                      opacity: turn.started ? 0 : 1,
                      transition: `opacity ${TURN_MS}ms ease-in`,
                    }}
                  />
                  <div
                    className="absolute inset-y-0 w-1/2"
                    style={{
                      left: turn.dir > 0 ? "50%" : 0,
                      transformOrigin: turn.dir > 0 ? "left center" : "right center",
                      transformStyle: "preserve-3d",
                      transform: `rotateY(${angle}deg)`,
                      transition: `transform ${TURN_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1)`,
                      willChange: "transform",
                    }}
                  >
                    <div className="absolute inset-0 flex" style={{ backfaceVisibility: "hidden" }}>
                      {page(front, turn.dir > 0 ? "right" : "left")}
                      <div className="absolute inset-0" style={{
                        background: turn.dir > 0
                          ? "linear-gradient(to right, rgba(0,0,0,0.28), rgba(0,0,0,0) 40%)"
                          : "linear-gradient(to left, rgba(0,0,0,0.28), rgba(0,0,0,0) 40%)",
                        opacity: turn.started ? 1 : 0,
                        transition: `opacity ${TURN_MS / 2}ms ease-in`,
                      }} />
                    </div>
                    <div className="absolute inset-0 flex" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      {page(back, turn.dir > 0 ? "left" : "right")}
                      <div className="absolute inset-0" style={{
                        background: turn.dir > 0
                          ? "linear-gradient(to left, rgba(0,0,0,0.30), rgba(0,0,0,0) 40%)"
                          : "linear-gradient(to right, rgba(0,0,0,0.30), rgba(0,0,0,0) 40%)",
                        opacity: turn.started ? 0 : 1,
                        transition: `opacity ${TURN_MS}ms ease-out`,
                      }} />
                    </div>
                  </div>
                </div>
              );
            })()}
            {views.map((group, i) => {
              if (!mounted.has(i)) return null;
              const active = i === vi && !turn;
              return (
                <div
                  key={`v${i}-${group.join("-")}`}
                  className="absolute inset-0 flex items-stretch justify-center"
                  style={{
                    opacity: active ? 1 : 0,
                    // The whole spread moves as one object, because it is one.
                    transform: active ? "translateX(0)" : `translateX(${dir > 0 ? 10 : -10}px)`,
                    transition: `opacity ${FADE_MS}ms linear, transform ${FADE_MS}ms cubic-bezier(0.22,1,0.36,1)`,
                    pointerEvents: "none",
                  }}
                  aria-hidden={!active}
                >
                  {group.map((n) => (
                    // display: contents, so the <img> lays out exactly as it
                    // did before it had a <picture> around it.
                    <picture key={n} style={{ display: "contents" }}>
                      <source media={PHONE_MQ} srcSet={cataloguePageUrl(n, active && zoomed ? maxWidth : widths[0])} />
                      <img
                        src={cataloguePageUrl(n, widths[0])}
                        srcSet={cataloguePageSrcSet(n)}
                        sizes={sizesFor(active)}
                        alt={pages[n - 1]?.alt ?? `${ideaBook.short}, page ${n}`}
                        width={maxWidth}
                        height={Math.round(maxWidth / aspect)}
                        draggable={false}
                        fetchPriority={active ? "high" : "low"}
                        className="h-full w-auto max-w-none object-contain"
                      />
                    </picture>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top chrome.
          A real bar, not four controls floating at the corners of a black
          void. Everything sits inside one blurred strip with the content
          constrained to the same width as the stage, so the chrome reads as
          belonging to the book rather than to the browser window. */}
      <header
        ref={headerRef}
        className="absolute inset-x-0 top-0 z-20"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 220ms ease",
          background: "rgba(10,10,10,0.72)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className={`mx-auto flex items-center justify-between gap-3 px-3 sm:px-5 ${
            short ? "pb-1.5 pt-[max(env(safe-area-inset-top),0.35rem)]" : "pb-2.5 pt-[max(env(safe-area-inset-top),0.6rem)]"
          }`}
          style={{ maxWidth: stageW ? Math.max(stageW, 720) : undefined }}
        >
          <Link
            href={exitHref}
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.78)" }}
            aria-label="Close the Idea Book"
          >
            <CloseIcon />
            <span className="hidden sm:inline">Close</span>
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#fb923c" }}>
              {ideaBook.short} · {ideaBook.volume}
            </p>
            <p className="truncate text-[11px] tabular-nums" style={{ color: "rgba(255,255,255,0.58)" }} aria-live="polite">
              {label}
            </p>
          </div>

          {/* On a phone these live in the bottom bar instead — within reach of
              a thumb, and grouped with the other controls rather than
              stranded in the far corner of the screen. */}
          <div className={`${short ? "hidden" : "hidden sm:flex"} flex-shrink-0 items-center gap-2`}>
            <Actions
              requestHref={requestHref}
              onRequest={() => setAskingForPrint(true)}
              onContents={() => setShowContents(true)}
              download={download}
              canShare={canShare}
              onShare={onShare}
            />
          </div>
          <span className={`w-8 flex-shrink-0 ${short ? "" : "sm:hidden"}`} aria-hidden="true" />
        </div>
      </header>

      <button
        type="button"
        onClick={prev}
        disabled={vi === 0}
        aria-label="Previous"
        className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-3 transition disabled:opacity-25 sm:block"
        style={{ background: "rgba(0,0,0,0.42)", color: "#fff", backdropFilter: "blur(6px)", opacity: visible ? undefined : 0.25 }}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={next}
        disabled={vi === views.length - 1}
        aria-label="Next"
        className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-3 transition disabled:opacity-25 sm:block"
        style={{ background: "rgba(0,0,0,0.42)", color: "#fff", backdropFilter: "blur(6px)", opacity: visible ? undefined : 0.25 }}
      >
        <ChevronRight />
      </button>

      {/* Bottom chrome.
          One grouped control bar rather than a CTA pinned to one corner and a
          number field pinned to the other with a bare hairline between them.
          The scrubber runs over pages, not spreads — "page 96" is something a
          reader wants; "spread 49" is not. */}
      <footer
        ref={footerRef}
        className={`absolute inset-x-0 bottom-0 z-20 px-3 sm:px-5 ${
          short ? "pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1.5" : "pb-[max(env(safe-area-inset-bottom),0.6rem)] pt-4"
        }`}
        style={{ opacity: visible ? 1 : 0, transition: "opacity 220ms ease", pointerEvents: visible ? "auto" : "none" }}
      >
        <div
          className={`mx-auto rounded-2xl px-3 sm:px-4 ${short ? "py-1.5" : "py-2.5"}`}
          style={{
            maxWidth: stageW ? Math.max(stageW, 720) : undefined,
            background: "rgba(18,18,18,0.82)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
          }}
        >
          {/* Hotspots: what these pages show, as chips to the product and
              application pages (lib/idea-book-links.ts). A chip for the
              spread rather than a rectangle over the photograph: exact,
              tappable at any size, and readable by a screen reader. */}
          {(() => {
            const seen = new Set<string>();
            const here = shown.flatMap((n) => links[n] ?? []).filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true)));
            if (here.length === 0) return null;
            return (
              <div className={`flex flex-wrap items-center gap-x-2 gap-y-1.5 ${short ? "mb-1" : "mb-2.5"}`}>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.42)" }}>
                  On {shown.length === 2 ? "these pages" : "this page"}
                </span>
                {here.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => track("idea_book_hotspot", { page: shown[0], target: l.href })}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors hover:bg-white/20"
                    style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.14)" }}
                  >
                    {l.label}
                    <span aria-hidden style={{ color: "#fb923c" }}>→</span>
                  </Link>
                ))}
              </div>
            );
          })()}
          <div className="flex items-center gap-3">
            <span className="hidden w-8 flex-shrink-0 text-right text-[11px] tabular-nums sm:block" style={{ color: "rgba(255,255,255,0.40)" }}>
              1
            </span>
            <input
              type="range"
              min={1}
              max={total}
              value={shown[0]}
              onChange={(e) => goToPage(Number(e.target.value))}
              aria-label={`Jump to a page. Currently ${label}.`}
              className="catalogue-scrub min-w-0 flex-1"
            />
            <span className="hidden w-8 flex-shrink-0 text-[11px] tabular-nums sm:block" style={{ color: "rgba(255,255,255,0.40)" }}>
              {total}
            </span>
            {/* On a phone on its side the controls share one row with the
                scrubber: the page gets the height a second row would take. */}
            {short && (
              <div className="flex flex-shrink-0 items-center gap-2">
                <Actions
                  requestHref={requestHref}
                  onRequest={() => setAskingForPrint(true)}
                  onContents={() => setShowContents(true)}
                  download={download}
                  canShare={canShare}
                  onShare={onShare}
                />
              </div>
            )}
            <form onSubmit={submitJump} className={`${short ? "hidden" : "hidden md:flex"} flex-shrink-0 items-center gap-2`}>
              <label htmlFor="catalogue-jump" className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.42)" }}>
                Go to
              </label>
              <input
                id="catalogue-jump"
                type="number"
                min={1}
                max={total}
                value={jump}
                onChange={(e) => setJump(e.target.value)}
                placeholder={String(shown[0])}
                className="w-14 rounded-lg px-2 py-1.5 text-center text-[13px] tabular-nums outline-none"
                style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.14)" }}
              />
            </form>
          </div>

          <div className="mt-2.5 flex items-center gap-2 border-t pt-2.5 sm:hidden" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <Actions
              requestHref={requestHref}
              onRequest={() => setAskingForPrint(true)}
              onContents={() => setShowContents(true)}
              download={download}
              canShare={canShare}
              onShare={onShare}
              stretch
            />
          </div>

          <div className={`mt-2.5 items-center justify-between gap-3 border-t pt-2.5 ${short ? "hidden" : "flex"}`} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {/* Secondary to "Request a copy" above, on purpose: two solid
                orange buttons on one screen means neither is the primary. */}
            <Link
              href={lunchLearnHref}
              className="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors sm:flex-none"
              style={{ color: "#fdba74", border: "1px solid rgba(249,115,22,0.42)", background: "rgba(249,115,22,0.10)" }}
            >
              Book a free Lunch &amp; Learn
            </Link>
            <p className="hidden text-[11px] sm:block" style={{ color: "rgba(255,255,255,0.38)" }}>
              Swipe or use <kbd style={kbd}>&larr;</kbd> <kbd style={kbd}>&rarr;</kbd> to turn &nbsp;·&nbsp; scroll or double-tap to zoom
            </p>
          </div>
        </div>
      </footer>

      {showContents && (
        <div
          className="absolute inset-0 z-30 overflow-y-auto overscroll-contain"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowContents(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contents"
            className="mx-auto my-8 w-[min(720px,calc(100vw-2rem))] rounded-2xl p-6 sm:p-8"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--accent-text)" }}>
                  {ideaBook.short} · {ideaBook.volume}
                </p>
                <h2 className="mt-1.5 text-xl font-bold sm:text-2xl" style={{ color: "var(--text-primary)" }}>
                  Contents
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowContents(false)}
                aria-label="Close"
                className="rounded-full p-2 transition-colors hover:bg-[var(--ink-10)]"
                style={{ color: "var(--text-muted)" }}
              >
                <CloseIcon />
              </button>
            </div>
            <p className="mb-5 text-[13px]" style={{ color: "var(--text-secondary)" }}>
              Tap a title to turn to it, or open its full page on the site.{" "}
              <Link href={`${ideaBook.href}/contents`} className="font-semibold underline" style={{ color: "var(--accent-text)" }}>
                Contents as a page
              </Link>
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {contents.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                    {section.title}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => (
                      <li key={item.href} className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => { setShowContents(false); goToPage(item.page); }}
                          className="flex min-w-0 flex-1 items-baseline gap-3 rounded-md px-2 py-1.5 text-left text-[14px] font-semibold transition-colors hover:bg-[var(--ink-05)]"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <span className="w-7 flex-shrink-0 text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>{item.page}</span>
                          <span className="truncate">{item.label}</span>
                        </button>
                        <Link
                          href={item.href}
                          onClick={() => track("idea_book_hotspot", { page: item.page, target: item.href })}
                          className="flex-shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--ink-05)]"
                          style={{ color: "var(--accent-text)" }}
                          aria-label={`${item.label} on the site`}
                        >
                          Page →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
            aria-label="Request a printed copy of the Idea Book"
            className="mx-auto my-8 w-[min(680px,calc(100vw-2rem))] rounded-2xl p-6 sm:p-8"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--accent-text)" }}>
                  {ideaBook.short} · {ideaBook.volume} · {edition}
                </p>
                <h2 className="mt-1.5 text-xl font-bold sm:text-2xl" style={{ color: "var(--text-primary)" }}>
                  Have the printed book mailed to you
                </h2>
                <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Perfect bound, with the material samples that go with it.
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

function Actions({
  requestHref,
  onRequest,
  onContents,
  download,
  canShare,
  onShare,
  stretch = false,
}: {
  requestHref: string;
  onRequest: () => void;
  onContents: () => void;
  download: CatalogueDownload | null;
  canShare: boolean;
  onShare: () => void;
  stretch?: boolean;
}) {
  return (
    <>
      <button type="button" onClick={onContents} className={btnGhost} aria-label="Contents" title="Contents">
        <ListIcon />
        <span className="hidden md:inline">Contents</span>
      </button>
      {/* The lead action for this page, so it looks like one. It was a grey
          pill among grey pills and disappeared into the chrome. */}
      <a
        href={requestHref}
        className={`${btnPrimary}${stretch ? " flex-1 justify-center" : ""}`}
        title="Have the printed book mailed to you"
        onClick={(e) => {
          track("idea_book_request", {});
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onRequest();
        }}
      >
        <MailIcon />
        <span className={stretch ? "" : "hidden sm:inline"}>Request a copy</span>
      </a>
      {download && (
        <a href={download.href} download={ideaBook.fileName} onClick={() => track("idea_book_pdf", {})} className={btnGhost} title={`Download the PDF (${download.label})`} aria-label={`Download the PDF, ${download.label}`}>
          <DownloadIcon />
          <span className="hidden md:inline">PDF</span>
        </a>
      )}
      {canShare && (
        <button type="button" onClick={onShare} className={btnGhost} aria-label="Share this page">
          <ShareIcon />
        </button>
      )}
    </>
  );
}

/** The one action this page is actually for. */
const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[12px] font-semibold transition-colors " +
  "bg-[#F97316] text-white hover:bg-[#ea6d12] shadow-[0_2px_10px_rgba(249,115,22,0.35)]";
/** Everything else. */
const btnGhost =
  "inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[12px] font-semibold transition-colors " +
  "bg-white/10 text-white hover:bg-white/20 border border-white/15";
const kbd = {
  display: "inline-block",
  padding: "1px 5px",
  borderRadius: 4,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  fontSize: 10,
} as const;

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
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
