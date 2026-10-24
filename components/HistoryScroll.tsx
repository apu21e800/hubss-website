"use client";

import { useEffect } from "react";

/**
 * Back and Forward put the page back where it was in one step.
 *
 * html's scroll-behavior is smooth (app/globals.css: the glide to #map), and
 * Chrome restores a history entry's place after Next has drawn the page, at
 * that speed: the page you went back to opened at the other page's depth and
 * slid to its own for a third of a second (24 Oct 2026; hubss.com did it
 * too). From the popstate, for a second, scrolling is instant, which covers
 * the restore; an anchor tapped in that second jumps instead of gliding.
 */
export default function HistoryScroll() {
  useEffect(() => {
    const html = document.documentElement;
    let timer = 0;
    const onPop = () => {
      html.style.scrollBehavior = "auto";
      window.clearTimeout(timer);
      timer = window.setTimeout(() => html.style.removeProperty("scroll-behavior"), 1000);
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
