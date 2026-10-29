"use client";

import { LazyMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

/**
 * framer-motion's animation engine, loaded when it is first wanted rather
 * than in every page's first JavaScript (28 Oct 2026, the paid-traffic speed
 * pass: Google Ads and the MediaEdge display ads land on phones, and the
 * engine was 41 KB of every page's first 300 KB, there because the bar's
 * menus use it).
 *
 * Every animated element on the site is framer's `m` component (never
 * `motion`, which brings the whole engine back: `strict` below makes one an
 * error in development). `m` draws the
 * element and its starting style from the server's HTML as `motion` did; the
 * engine (lib/motion-features.ts) arrives and runs the animations as before.
 * No page animates anything on its first screen before a visitor acts (the
 * Lunch & Learn card that holds /lunch-learn's h1 paints without an
 * entrance), so the first screen is the same; what waits is the moving.
 *
 * The engine is fetched on the visitor's first touch, scroll, key, wheel or
 * mouse movement, which comes before any menu opens or section scrolls into
 * view, or three seconds after the page has loaded, whichever is first. A
 * component whose entrance can be on the first screen asks for it when it
 * mounts (wantMotion), so it never waits for the visitor.
 */
let ask: (() => void) | null = null;
const asked = new Promise<void>((resolve) => {
  ask = resolve;
});

/** Fetches the animation engine now, if it isn't already on its way. */
export function wantMotion() {
  if (!ask) return;
  ask();
  ask = null;
}

const loadFeatures = () => asked.then(() => import("@/lib/motion-features")).then((mod) => mod.default);

const FIRST_ACTS = ["pointerdown", "pointermove", "touchstart", "keydown", "wheel", "scroll"] as const;
const AFTER_LOAD_MS = 3000;

export default function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let timer: number | undefined;
    let idle: number | undefined;
    const go = () => {
      wantMotion();
      stop();
    };
    const stop = () => {
      for (const e of FIRST_ACTS) window.removeEventListener(e, go, true);
      window.removeEventListener("load", soon);
      if (timer !== undefined) window.clearTimeout(timer);
      if (idle !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    };
    const soon = () => {
      timer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 2000 });
        else go();
      }, AFTER_LOAD_MS);
    };
    for (const e of FIRST_ACTS) window.addEventListener(e, go, { capture: true, passive: true, once: true });
    if (document.readyState === "complete") soon();
    else window.addEventListener("load", soon, { once: true });
    return stop;
  }, []);
  // Strict (in development, an error for a `motion` element) everywhere but
  // the Studio, which shares this layout and draws its own `motion` elements.
  const pathname = usePathname() ?? "/";
  const studio = pathname === "/studio" || pathname.startsWith("/studio/");
  return (
    <LazyMotion features={loadFeatures} strict={!studio}>
      {children}
    </LazyMotion>
  );
}
