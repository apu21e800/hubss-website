"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
// Just the number, from its own generated file — importing it from
// lib/map-projects.ts would drag the whole dataset into the phone bundle.

/**
 * The space the map takes once mounted, measured on 17 Oct 2026: the frame
 * (.cm-frame, clamp(560px, 76vh, 860px)) plus 294px of heading and padding,
 * at 1280, 1440, 1536 and 1920 wide. The placeholders below are this exact
 * height, and CanadaMap's section has it as a min-height, so the page never
 * grows or shrinks when the map arrives. Until then the placeholder was
 * clamp(760px, 96vh, 1060px), about 100px short: a visitor who clicked
 * "See the work" landed on the map and watched the page jump under them.
 */
export const MAP_SECTION_HEIGHT = "calc(clamp(560px, 76vh, 860px) + clamp(326px, 326px + (100vw - 1024px) * 0.045, 343px))";
// 23 Oct 2026 (desktop QA, CLS 0.72 on the homepage): the heading grew with
// the 20 Oct type scale, so the 294px above was 32px short at 1024, 44 at
// 1280 and 49 from 1440 (measured: section 910, 946, 1027 against 878, 902,
// 978). The second clamp follows .h2-section's growth to its 56px cap. The
// section's min-height in CanadaMap.tsx is the same expression.

const CanadaMap = dynamic(() => import("@/components/sections/CanadaMap"), {
  ssr: false,
  loading: () => <div style={{ height: MAP_SECTION_HEIGHT, background: "var(--bg-dark)" }} />,
});

/** The basemap's two hosts: the style from one, its sprites, glyphs and tiles from the other. */
const MAP_HOSTS = ["https://basemaps.cartocdn.com", "https://tiles.basemaps.cartocdn.com"];
let mapWarmed = false;
/**
 * The map's cost, paid before the tap lands: the component's chunk (which
 * carries maplibre since 24 Oct 2026) and the connections to the basemap's
 * two hosts, each a DNS lookup and a TLS handshake that cost a second on a
 * cellular link before the style could even be asked for (performance
 * review, 24 Oct 2026). "See the work" calls this when a finger or pointer
 * reaches it; the wrapper calls it when a finger lands on any link to #map.
 * Once per page.
 */
export function warmMap() {
  if (mapWarmed || typeof window === "undefined") return;
  mapWarmed = true;
  for (const href of MAP_HOSTS) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
  void import("@/components/sections/CanadaMap");
}

/**
 * Decides when the map is allowed to cost anything.
 *
 * MOBILE DIET (front-page brief, Call 1): the map is the heaviest interactive
 * thing on the page — MapLibre, a basemap style, sprite sheets, glyph ranges
 * and tiles — and on a phone it rendered by default into a block most visitors
 * scroll past. Phones therefore get a one-tap invitation, and the map mounts
 * only for people who want it. Nothing is removed; it is one tap away, and the
 * tap is honest about what it opens.
 *
 * DESKTOP, corrected September 2026: the old comment claimed mounting on
 * desktop was "unchanged in practice — the matchMedia check resolves during
 * hydration, long before anyone scrolls 6,000px down to it". That was exactly
 * backwards. Measured in a real browser at 1440×900: the canvas existed 2s
 * after load and 26 requests to basemaps.cartocdn.com had already gone out,
 * for a section roughly 7,500px down the page. Every desktop visitor paid for
 * the map whether or not they ever saw it.
 *
 * So desktop now waits for the section to come within a screen of the viewport
 * — IntersectionObserver with a generous rootMargin, which means the map is
 * already built by the time it is scrolled into view, and never built at all
 * for the visitor who stops at the Lunch & Learn block. Browsers without
 * IntersectionObserver mount immediately, which is the old behaviour.
 */
export default function CanadaMapWrapper() {
  const [wanted, setWanted] = useState(false);
  // The card was tapped: the map opens on its frame (CanadaMap revealOnMount).
  const [tapped, setTapped] = useState(false);
  const [near, setNear] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // "See the work" and a search result send the visitor to #map. On a phone
  // that used to land on the "Open the map" card, a second tap short of the
  // map itself (phone review, 17 Oct 2026): arriving at #map opens it.
  // Next's <Link> goes to a hash on the same page with pushState, which fires
  // no hashchange, so "See the work" (and a map result in search, opened on
  // the homepage) still left a phone on the card (24 Oct 2026): a tap on any
  // link to this page's #map counts as arriving.
  useEffect(() => {
    const onHash = () => { if (window.location.hash === "#map") setWanted(true); };
    const toMap = (e: Event) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement)) return false;
      const url = new URL(a.href, window.location.href);
      return url.hash === "#map" && url.pathname === window.location.pathname;
    };
    const onClick = (e: MouseEvent) => { if (toMap(e)) setWanted(true); };
    // The finger lands a tenth of a second or so before the click: the
    // map's code and its hosts' connections start then (warmMap).
    const onDown = (e: PointerEvent) => { if (toMap(e)) warmMap(); };
    onHash();
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerdown", onDown, true);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerdown", onDown, true);
    };
  }, []);

  useEffect(() => {
    if (near) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      // One full viewport of warning: the tiles are in flight before the
      // section's top edge appears, so it is never seen half-built.
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  if (near || wanted) return <CanadaMap revealOnMount={tapped} />;

  // Both placeholders come from the server and CSS picks one: a laptop gets
  // the reserved space (so nothing below jumps when the map arrives), a
  // phone the card. Until 17 Oct 2026 a matchMedia state chose after
  // hydration, so every desktop load painted the phone card first and the
  // page grew 668px a second later. The sentinel is the desktop block; on a
  // phone it is display:none and never intersects, so the map waits for the
  // card's tap or #map.
  return (
    <>
      <div ref={sentinelRef} className="hidden lg:block" style={{ height: MAP_SECTION_HEIGHT, background: "var(--bg-dark)" }} aria-hidden="true" />
      <div className="mx-4 my-10 lg:hidden">
      <button
        onPointerDown={warmMap}
        onClick={() => { setTapped(true); setWanted(true); }}
        className="group w-full rounded-xl px-6 py-10 text-left transition-colors hover:bg-[var(--ink-05)]"
        style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}
      >
        <p className="eyebrow mb-2">
          Installations across Canada
        </p>
        {/* The map's own header, word for word, so the card and the map
            never disagree (this card once said "84 projects" while the map's
            header said 59). No count: docs/STYLE.md, no counts as a selling
            point. lib/map-count.json is still written every build. */}
        <p className="font-black leading-tight mb-2" style={{ color: "var(--text-primary)", fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          Find a job near you.
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--ink-65)" }}>
          Every pin is a HUB installation, with its own photos.
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: "var(--accent-text)" }}>
          Open the map
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      </div>
    </>
  );
}
