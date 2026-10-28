"use client";

/**
 * The bar steps aside (28 Oct 2026; Vern: "we might also consider hiding the
 * top nav bar in some interactions, it can feel a bit overwhelming at times").
 *
 * It slides up out of the way while the visitor reads down a page and comes
 * back the moment they scroll up. Only the visitor's own scrolling moves it: a
 * wheel or a trackpad, a finger, a scroll key, the scrollbar. When the page
 * moves by itself (a button that takes them to a form, the browser showing
 * the field a form still needs, the keyboard's focus, a contents link) the bar
 * stays as it is, so whatever the page moved to is never left under a bar
 * that arrives after it (the review, 28 Oct 2026: the Lunch & Learn topic
 * tiles and the contact form's check both landed under it). It is always
 * there at the top of a page, after a page change, and whenever it holds the
 * keyboard, the pointer, an open menu, the phone menu or search (`locked`).
 * Inside something that wants the whole screen, marked `data-nav-tuck` (the
 * homepage map's frame), a press tucks it at once; so does following a link
 * to a place lower down the same page, so the place lands near the top
 * instead of under a bar about to leave (and a link to a place higher up
 * brings it back first, so the place lands under it).
 *
 * html[data-nav="tucked"] tells the rest of the page: --nav-offset
 * (app/globals.css) is the bar's height while it shows and 0 while it is
 * tucked, so the anchor offset (html's scroll-padding-top) and the sticky
 * sidebars (`.follow-nav`) follow it. --nav-h is the bar's measured height.
 */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Always shown this close to the top of a page (when the visitor scrolls there). */
const TOP = 96;
/** Travel in one direction before the bar moves, so a jitter does nothing. */
const DELTA = 10;
/** After a page change, Back or an in-page link, the browser's own scrolling is not the visitor's. */
const QUIET_MS = 700;
/** How long a wheel turn, a drag or a scroll key counts as the visitor scrolling, */
const INPUT_MS = 500;
/** and how long the page may pause and still be moving under them (a flick's glide). */
const GLIDE_MS = 160;

/** Keys that scroll the page, unless the focus is somewhere they do something else. */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
const KEYS_OWNED_BY =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="listbox"], [role="combobox"], [role="menu"], [role="menubar"], [role="tablist"], [role="radiogroup"], [role="spinbutton"], [role="grid"], [role="tree"]';
const SPACE_OWNED_BY = 'button, summary, [role="button"], [role="checkbox"], [role="switch"], [role="tab"], [role="menuitem"], [role="option"]';

export function useTuckAway(locked: boolean, barRef: React.RefObject<HTMLElement | null>): boolean {
  const routeKey = usePathname() ?? "";
  const [tucked, setTucked] = useState(false);
  const tuckedRef = useRef(false);
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  const set = (next: boolean) => {
    if (tuckedRef.current === next) return;
    tuckedRef.current = next;
    setTucked(next);
    // Synchronously, so a scroll the browser is about to make (an in-page
    // link) reads the new anchor offset.
    document.documentElement.dataset.nav = next ? "tucked" : "shown";
  };

  // The bar's height, for --nav-offset.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const write = () => document.documentElement.style.setProperty("--nav-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    write();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(write) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [barRef]);

  useEffect(() => {
    let last = Math.max(0, window.scrollY);
    let quietUntil = performance.now() + QUIET_MS;
    let raf = 0;
    // Chrome fires popstate for a jump to a #place on the same page too; the
    // bar tucked for that jump must stay tucked.
    let anchorJumpAt = -Infinity;
    // The visitor is scrolling the page until this moment (a wheel, a drag of
    // the finger, a scroll key), or while they hold the page's scrollbar.
    let theirsUntil = 0;
    let holdingScrollbar = false;
    // A finger on the screen: the page moving under it is theirs. Not the
    // finger's own moves: a phone starts the scroll before it tells the page
    // the finger moved, and may tell it only now and then while it scrolls.
    let fingerDown = false;
    let fingerScrolled = false;
    const theirs = (ms = INPUT_MS) => { theirsUntil = Math.max(theirsUntil, performance.now() + ms); };
    // Anything else they do (a press, a tap, Enter or Tab) is not scrolling,
    // so whatever scrolling follows it is the page's.
    const notTheirs = () => { theirsUntil = 0; holdingScrollbar = false; };

    const frame = () => {
      raf = 0;
      // Clamped to the page, so a phone's bounce at either end is no turn.
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.min(Math.max(0, window.scrollY), max);
      const now = performance.now();
      const byThem = holdingScrollbar || fingerDown || now < theirsUntil;
      if (fingerDown && y !== last) fingerScrolled = true;
      // Still moving: a flick's glide is theirs as long as it keeps going.
      if (byThem) theirs(GLIDE_MS);
      if (lockedRef.current) { set(false); last = y; return; }
      // The browser's own scrolling (a page change, Back, an in-page jump)
      // leaves the bar as it is and only moves the turning point.
      if (now < quietUntil) { last = y; return; }
      if (y <= 0 || (y <= TOP && byThem)) { set(false); last = y; return; }
      // The page moved by itself: the bar stays where it is.
      if (!byThem) { last = y; return; }
      const dy = y - last;
      if (tuckedRef.current) {
        if (dy > 0) last = y;
        else if (dy < -DELTA) { set(false); last = y; }
      } else {
        if (dy < 0) last = y;
        else if (dy > DELTA) { set(true); last = y; }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onPop = () => {
      if (performance.now() - anchorJumpAt < 600) return;
      quietUntil = performance.now() + QUIET_MS;
      set(false);
    };

    const onWheel = () => theirs();
    const onTouchStart = () => { notTheirs(); fingerDown = true; fingerScrolled = false; };
    // A tap scrolls nothing (what its click then does is the page's); a
    // drag's glide goes on after the finger lifts.
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length) return;
      fingerDown = false;
      if (fingerScrolled) theirs(GLIDE_MS);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const at = e.target as Element | null;
      const scrolls =
        SCROLL_KEYS.has(e.key) && !e.altKey && !e.ctrlKey && !e.metaKey &&
        !at?.closest?.(KEYS_OWNED_BY) && !(e.key === " " && at?.closest?.(SPACE_OWNED_BY));
      if (scrolls) theirs(); else notTheirs();
    };

    const onPointerDown = (e: PointerEvent) => {
      // The page's own scrollbar reports the press on <html>.
      if (e.target === document.documentElement) { holdingScrollbar = true; theirs(); return; }
      notTheirs();
      // A press inside something that wants the whole screen.
      if (lockedRef.current || window.scrollY <= TOP) return;
      if ((e.target as Element | null)?.closest?.("[data-nav-tuck]")) set(true);
    };
    const onPointerUp = () => { if (holdingScrollbar) { holdingScrollbar = false; theirs(GLIDE_MS); } };
    // In case the scrollbar kept the release to itself.
    const onPointerMove = (e: PointerEvent) => { if (holdingScrollbar && e.buttons === 0) holdingScrollbar = false; };

    // A link to a place on this page.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || barRef.current?.contains(a)) return;
      let url: URL;
      try { url = new URL(a.href, location.href); } catch { return; }
      if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      let target: Element | null = null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY;
      // Down the page: the bar goes first, so the place lands near the top.
      // Up the page: the bar comes back first, so the place lands under it.
      anchorJumpAt = performance.now();
      quietUntil = anchorJumpAt + QUIET_MS;
      notTheirs();
      set(top > window.scrollY + TOP);
    };

    const passive = { passive: true } as const;
    const capture = { capture: true, passive: true } as const;
    window.addEventListener("scroll", onScroll, passive);
    window.addEventListener("popstate", onPop);
    window.addEventListener("wheel", onWheel, passive);
    window.addEventListener("touchstart", onTouchStart, passive);
    window.addEventListener("touchend", onTouchEnd, passive);
    window.addEventListener("touchcancel", onTouchEnd, passive);
    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, capture);
    window.addEventListener("pointerup", onPointerUp, passive);
    window.addEventListener("pointermove", onPointerMove, passive);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, capture);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("click", onClick, true);
      if (raf) cancelAnimationFrame(raf);
    };
    // barRef is stable; set only touches refs and the state setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A new page starts with the bar showing.
  useEffect(() => {
    set(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  // Anything that locks the bar brings it back now.
  useEffect(() => {
    if (locked) set(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);

  // Pages without the bar (the Product Portfolio Book reader, Studio) get
  // the default offset back.
  useEffect(() => () => { delete document.documentElement.dataset.nav; }, []);

  return tucked && !locked;
}
