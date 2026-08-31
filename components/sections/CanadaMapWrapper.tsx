"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CanadaMap = dynamic(() => import("@/components/sections/CanadaMap"), {
  ssr: false,
  loading: () => <div style={{ height: 680, background: "#101010" }} />,
});

/**
 * MOBILE DIET (front-page brief, Call 1): the map is the heaviest interactive
 * thing on the page — Leaflet, tiles, and an 84-project dataset — and on a
 * phone it rendered by default into a 1,039px block most visitors scroll
 * past. Now: desktop mounts it automatically (unchanged in practice — the
 * matchMedia check resolves during hydration, long before anyone scrolls
 * 6,000px down to it); phones get a one-tap invitation instead, and the map
 * mounts only for people who actually want it. Nothing is removed — it is
 * one tap away, and the tap is honest about what it opens.
 */
export default function CanadaMapWrapper() {
  const [wanted, setWanted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (isDesktop || wanted) return <CanadaMap />;

  return (
    <div className="mx-4 my-10">
      <button
        onClick={() => setWanted(true)}
        className="group w-full rounded-2xl px-6 py-10 text-left transition-colors hover:bg-white/5"
        style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}
      >
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#FB923C" }}>
          Installations across Canada
        </p>
        <p className="font-black leading-tight mb-2" style={{ color: "#F5F0EB", fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          84 projects, coast to coast.
        </p>
        <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>
          Every pin is a real installation — filter by system, browse by province.
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: "#FB923C" }}>
          Open the map
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  );
}
