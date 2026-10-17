"use client";

/**
 * A 2px orange line under the bar while the next page loads (17 Oct 2026).
 *
 * The root loading.tsx used to replace the whole screen, bar included, with
 * a black "LOADING" spinner on every click whose destination was not yet
 * prefetched (interaction review: 160 to 370 ms of black between pages).
 * Now the page you are on stays until the next one is ready, and this line
 * says something is happening.
 *
 * The App Router has no navigation events, so the line starts on a click of
 * an in-site link (same origin, no modifier keys, not a hash on this page,
 * not a download) and ends when the pathname or search changes, or after a
 * safety timeout. A click that opens a menu or a lightbox is not a link, so
 * it never shows for those.
 */
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type State = "idle" | "loading" | "done";

export default function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A route change ends the line: it runs to the edge, fades, then resets.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    setState((s) => (s === "loading" ? "done" : s));
    finish.current = setTimeout(() => setState("idle"), 600);
    return () => { if (finish.current) clearTimeout(finish.current); };
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      let url: URL;
      try { url = new URL(a.href, location.href); } catch { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // a hash on this page
      if (/\.(pdf|jpg|jpeg|png|webp|zip)$/i.test(url.pathname)) return;
      if (finish.current) clearTimeout(finish.current);
      setState("loading");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), 8000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div aria-hidden="true" className="nav-progress" data-state={state} />
  );
}
