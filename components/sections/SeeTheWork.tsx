"use client";

/**
 * "See the work", the hero's orange button: the interactive map.
 *
 * On a laptop it glides down to the map, as it always has. On a phone
 * (under 1024px, where the map is its phone layout) it cuts to it: the
 * screen fades to dark, the page jumps to the map's frame under the bar,
 * and the dark lifts once the map has drawn its tiles (or after 2.5 seconds
 * at most), with the strip of projects under it. Vern, 24 Oct 2026: the
 * glide was "a bit janky on mobile ... this is first impression stuff": it
 * scrolled seven thousand pixels past the whole homepage in under a second,
 * landed on the map's heading and three rows of filters, and showed a
 * black box until the tiles came. (For a few hours that night a phone got
 * a full-screen slideshow of the jobs instead; Vern: "at one point it took
 * us to the interactive map which was cool". The map it is.)
 *
 * The address gets #map as a step of its own, so Back returns to the top
 * of the homepage. CanadaMapWrapper mounts the map on the tap (it listens
 * for taps on links to #map); CanadaMap says "hubss:map-ready" when its
 * first frame of tiles is in.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { scrollWindowInstantly } from "@/lib/scroll";

/** Where the map is its phone layout (CanadaMapWrapper's lg:hidden card). */
export const WORK_PHONE = "(max-width: 1023px)";

/** The longest the dark waits for the map before lifting anyway. */
const MAX_WAIT_MS = 2500;
const FADE_IN_MS = 140;
const FADE_OUT_MS = 320;

declare global {
  interface Window { __hubssMapReady?: boolean }
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SeeTheWork({
  href,
  className,
  style,
  children,
}: {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  // The dark between the button and the map: "in" while it fades up and
  // holds, "out" while it lifts, null when gone.
  const [veil, setVeil] = useState<null | "in" | "out">(null);
  const [slow, setSlow] = useState(false);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const toMap = href === "#map";

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!toMap || !window.matchMedia(WORK_PHONE).matches) return; // a laptop glides, as before
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    const still = reduced();
    // A step of its own, so Back comes back here. Not Next's state object:
    // handed that, Next would not hear of the new address (Nav.tsx dropHash).
    if (window.location.hash !== "#map") window.history.pushState(null, "", window.location.pathname + window.location.search + "#map");
    setSlow(false);
    setVeil("in");

    const started = performance.now();
    let jumped = false;
    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      window.removeEventListener("hubss:map-ready", onReady);
      setVeil("out");
      later(() => { setVeil(null); busy.current = false; }, still ? 0 : FADE_OUT_MS);
    };
    const onReady = () => { if (jumped) lift(); };
    window.addEventListener("hubss:map-ready", onReady);

    // Under the dark: wait for the map's frame (the map's code may still
    // be loading), put it under the bar, then wait for its tiles.
    const jump = () => {
      const frame = document.querySelector<HTMLElement>("#map .cm-frame");
      if (!frame) {
        if (performance.now() - started < MAX_WAIT_MS) { requestAnimationFrame(jump); return; }
        const map = document.getElementById("map");
        if (map) scrollWindowInstantly(map.getBoundingClientRect().top + window.scrollY - topPad());
        jumped = true;
        lift();
        return;
      }
      scrollWindowInstantly(frame.getBoundingClientRect().top + window.scrollY - topPad());
      jumped = true;
      if (window.__hubssMapReady) { later(lift, 120); return; }
      later(() => setSlow(true), 450);
      later(lift, Math.max(0, MAX_WAIT_MS - (performance.now() - started)));
    };
    later(jump, still ? 0 : FADE_IN_MS);
  };

  return (
    <>
      <Link href={href} prefetch={false} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
      {veil &&
        createPortal(
          <div className={`stw-veil${veil === "in" ? " is-in" : ""}`} aria-live="polite">
            <span className={`stw-note${slow && veil === "in" ? " is-on" : ""}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              Opening the map
            </span>
          </div>,
          document.body,
        )}
    </>
  );
}

/** html's scroll-padding-top: the one anchor offset (app/globals.css). */
function topPad(): number {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
}

