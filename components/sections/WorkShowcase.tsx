"use client";

/**
 * "See the work" (the hero's orange button), and on a phone the work itself.
 *
 * On a laptop the button glides to the map, as it always has: the map is big
 * there, with its panel and its tour. On a phone (under 1024px, where the
 * map is the phone layout) it opens the highlights full screen instead, one
 * job to a screen: the photograph, the place, the system, a line of the
 * story and the write-up when there is one. Swipe or the arrows to move; the
 * last screen, and the pill at the foot of every one, open the map
 * (lib/work-showcase.ts says why).
 *
 * The address says #work while it is open, so the phone's Back closes it
 * rather than leaving the site, and Back from a write-up opened here comes
 * back to the same photograph. Opened from a fresh visit to /#work, closing
 * it rewrites the address instead of going back past the site.
 */
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { scrollWindowInstantly } from "@/lib/scroll";
import type { WorkSlide } from "@/lib/work-showcase";

/** Where the map is its phone layout (CanadaMapWrapper's lg:hidden card). */
export const WORK_PHONE = "(max-width: 1023px)";
const HASH = "#work";
const KEY = "hubss-work-slide";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function remember(i: number) {
  try { sessionStorage.setItem(KEY, String(i)); } catch { /* private mode */ }
}
function recall(): number {
  try { return Number(sessionStorage.getItem(KEY)) || 0; } catch { return 0; }
}

export default function SeeTheWork({
  href,
  className,
  style,
  slides,
  children,
}: {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  slides: WorkSlide[];
  children: React.ReactNode;
}) {
  // The slide it is open at, or null when closed.
  const [open, setOpen] = useState<number | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  // Only the map's own link opens the showcase: a link Studio points
  // somewhere else goes there on every screen.
  const showcase = slides.length > 0 && href === "#map";

  // Back from a write-up to /#work, or a link to it: open where it was.
  useEffect(() => {
    if (!showcase || window.location.hash !== HASH || !window.matchMedia(WORK_PHONE).matches) return;
    setOpen(Math.min(recall(), slides.length));
  }, [showcase, slides.length]);

  // The first photograph is on the phone before the tap: fetched once the
  // page is idle, at the size the slide will ask for.
  useEffect(() => {
    if (!showcase || !window.matchMedia(WORK_PHONE).matches) return;
    const first = slides[0].photo;
    const warm = () => {
      const img = new Image();
      img.decoding = "async";
      img.sizes = "100vw";
      img.srcset = first.srcSet;
      img.src = first.src;
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => (w.requestIdleCallback ? w.requestIdleCallback(warm, { timeout: 4000 }) : window.setTimeout(warm, 1500));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [showcase, slides]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!showcase || !window.matchMedia(WORK_PHONE).matches) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    remember(0);
    // An entry of its own, so Back closes it. Not Next's state object:
    // handed that, Next would not hear of the new address (Nav.tsx dropHash).
    window.history.pushState({ hubssWork: true }, "", window.location.pathname + window.location.search + HASH);
    setOpen(0);
  };

  return (
    <>
      <Link ref={linkRef} href={href} prefetch={false} className={className} style={style} onClick={onClick} data-work={showcase ? "showcase" : undefined}>
        {children}
      </Link>
      {open !== null && createPortal(<Showcase slides={slides} start={open} onGone={() => setOpen(null)} returnTo={linkRef} />, document.body)}
    </>
  );
}

function Showcase({ slides, start, onGone, returnTo }: { slides: WorkSlide[]; start: number; onGone: () => void; returnTo: React.RefObject<HTMLAnchorElement | null> }) {
  const total = slides.length + 1; // the photographs, then the map's card
  const [index, setIndex] = useState(start);
  const indexRef = useRef(start);
  const [shown, setShown] = useState(false);
  // Slides whose photo may load: the one in view and its neighbours, and
  // every one already seen.
  const [near, setNear] = useState(() => new Set([start - 1, start, start + 1, start + 2]));
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  const go = useCallback((i: number) => {
    const t = trackRef.current;
    if (!t) return;
    const to = Math.max(0, Math.min(total - 1, i));
    t.scrollTo({ left: to * t.clientWidth, behavior: reduced() ? "auto" : "smooth" });
  }, [total]);

  // Gone: fade out, then unmount. `then` runs under the fade (the map's jump).
  const finish = useCallback((then?: () => void) => {
    if (leaving.current) return;
    leaving.current = true;
    setShown(false);
    then?.();
    window.setTimeout(onGone, reduced() ? 0 : 200);
  }, [onGone]);

  // Close: Back, when this entry is one the showcase pushed (popstate then
  // finishes it); otherwise the address loses its #work.
  const close = useCallback(() => {
    if (window.location.hash === HASH && (window.history.state as { hubssWork?: boolean } | null)?.hubssWork) {
      window.history.back();
      return;
    }
    if (window.location.hash === HASH) window.history.replaceState(null, "", window.location.pathname + window.location.search);
    finish();
  }, [finish]);

  // The map: the page moves to it under the showcase, then the showcase
  // fades off it. CanadaMapWrapper has already mounted the map (a tap on a
  // link to #map does that). The #work entry becomes the map's, so Back
  // from the map goes to the top of the page.
  const toMap = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.history.replaceState(null, "", window.location.pathname + window.location.search + "#map");
    finish(() => {
      const map = document.getElementById("map");
      if (!map) return;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      scrollWindowInstantly(map.getBoundingClientRect().top + window.scrollY - pad);
      if (!map.hasAttribute("tabindex")) map.setAttribute("tabindex", "-1");
      map.focus({ preventScroll: true });
    });
  }, [finish]);

  // Open at the slide asked for, before the first paint.
  useLayoutEffect(() => {
    const t = trackRef.current;
    if (t) t.scrollLeft = start * t.clientWidth;
  }, [start]);

  // The page holds still behind it; focus moves in, and back out after, to
  // "See the work" (also when it was opened by Back, with nothing focused).
  // The map's code is fetched while the photographs are looked at, so "Open
  // the map" does not wait for it.
  useEffect(() => {
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const raf = requestAnimationFrame(() => setShown(true));
    const warm = window.setTimeout(() => { void import("@/components/sections/CanadaMap"); }, 2500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(warm);
      html.style.overflow = before;
      if (document.activeElement === document.body || rootRef.current?.contains(document.activeElement)) {
        returnTo.current?.focus({ preventScroll: true });
      }
    };
  }, [returnTo]);

  // Back (or Forward past it) finishes it.
  useEffect(() => {
    const onPop = () => { if (window.location.hash !== HASH) finish(); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [finish]);

  // Keys: arrows move, Escape closes, Tab stays inside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); go(indexRef.current + 1); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(indexRef.current - 1); return; }
      if (e.key !== "Tab" || !rootRef.current) return;
      const focusable = [...rootRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
        (el) => el.offsetParent !== null && !el.closest("[inert]"),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !rootRef.current.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !rootRef.current.contains(active))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, go]);

  // A turned phone keeps the same slide.
  useEffect(() => {
    const onResize = () => {
      const t = trackRef.current;
      if (t) t.scrollLeft = indexRef.current * t.clientWidth;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onScroll = () => {
    const t = trackRef.current;
    if (!t || !t.clientWidth) return;
    const i = Math.max(0, Math.min(total - 1, Math.round(t.scrollLeft / t.clientWidth)));
    if (i === indexRef.current) return;
    indexRef.current = i;
    setIndex(i);
    remember(i);
    setNear((s) => (s.has(i + 2) && s.has(i - 1) ? s : new Set([...s, i - 1, i, i + 1, i + 2])));
  };

  const atEnd = index === total - 1;

  return (
    <div
      ref={rootRef}
      className={`ws${shown ? " is-shown" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="The work: highlights from across Canada"
    >
      <div className="ws-top">
        <p className="ws-count" aria-live="polite">
          {atEnd ? "" : `${index + 1} of ${slides.length}`}
        </p>
        <button ref={closeRef} type="button" className="ws-btn" aria-label="Close" onClick={close}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div ref={trackRef} className="ws-track" onScroll={onScroll}>
        {slides.map((s, i) => (
          <article key={s.id} className="ws-slide" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}: ${s.title}`} inert={i !== index}>
            <div className="ws-photo">
              {near.has(i) && <SlidePhoto photo={s.photo} eager={i === start} />}
            </div>
            <div className="ws-text">
              <p className="ws-place">{s.place}</p>
              <h2 className="ws-title">{s.title}</h2>
              <p className="ws-excerpt">{s.excerpt}</p>
              <p className="ws-meta">{s.system} · {s.application}</p>
              {s.href && (
                <Link href={s.href} className="ws-link" prefetch={false}>
                  Read the write-up
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              )}
            </div>
          </article>
        ))}
        <article className="ws-slide ws-end" aria-roledescription="slide" aria-label="Find a job near you" inert={!atEnd}>
          <div className="ws-end-body">
            <p className="ws-place">Installations across Canada</p>
            <h2 className="ws-end-title">Find a job near you.</h2>
            <p className="ws-excerpt">Every pin is a HUB installation, with its own photos.</p>
            <div className="ws-end-actions">
              <a href="#map" className="btn-accent btn-block" onClick={toMap}>Open the map</a>
              <Link href="/blog/projects" className="ws-ghost" prefetch={false}>All projects</Link>
            </div>
          </div>
        </article>
      </div>

      <div className="ws-foot">
        <button type="button" className="ws-btn" aria-label="Previous" onClick={() => go(index - 1)} disabled={index === 0}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        {atEnd ? (
          <span className="ws-foot-gap" aria-hidden="true" />
        ) : (
          <a href="#map" className="ws-pill" onClick={toMap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            Open the map
          </a>
        )}
        <button type="button" className="ws-btn" aria-label="Next" onClick={() => go(index + 1)} disabled={atEnd}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** A slide's photograph: fades in once it has arrived, never half drawn. */
function SlidePhoto({ photo, eager }: { photo: WorkSlide["photo"]; eager: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth) setLoaded(true);
  }, []);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={photo.src}
      srcSet={photo.srcSet}
      sizes="100vw"
      alt={photo.alt}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      draggable={false}
      onLoad={() => setLoaded(true)}
      className={loaded ? "is-loaded" : undefined}
    />
  );
}
