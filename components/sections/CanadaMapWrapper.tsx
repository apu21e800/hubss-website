"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
// Just the number, from its own generated file — importing it from
// lib/map-projects.ts would drag the whole dataset into the phone bundle.
import mapCount from "@/lib/map-count.json";

const CanadaMap = dynamic(() => import("@/components/sections/CanadaMap"), {
  ssr: false,
  loading: () => <div style={{ height: 680, background: "var(--bg-dark)" }} />,
});

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
  const [isDesktop, setIsDesktop] = useState(false);
  const [near, setNear] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
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

  if ((isDesktop && near) || wanted) return <CanadaMap />;

  // Desktop, not yet near: reserve the space so nothing below it jumps when
  // the map arrives.
  if (isDesktop) {
    return <div ref={sentinelRef} style={{ height: 680, background: "var(--bg-dark)" }} aria-hidden="true" />;
  }

  return (
    <div ref={sentinelRef} className="mx-4 my-10">
      <button
        onClick={() => setWanted(true)}
        className="group w-full rounded-2xl px-6 py-10 text-left transition-colors hover:bg-[var(--ink-05)]"
        style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}
      >
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "var(--accent-text)" }}>
          Installations across Canada
        </p>
        {/* This line used to read "84 projects, coast to coast." There were 59,
            and the map's own header — forty pixels further down the same
            scroll — said so. The number is now the length of the dataset, so
            the two cannot disagree again. */}
        <p className="font-black leading-tight mb-2" style={{ color: "var(--text-primary)", fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          {mapCount.count} projects, coast to coast.
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--ink-65)" }}>
          Every pin is a real installation — filter by system, browse by province.
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: "var(--accent-text)" }}>
          Open the map
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  );
}
