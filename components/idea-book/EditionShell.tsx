"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { leaveIdeaBook } from "@/app/product-book/links";

/**
 * The chrome around the Product Book edition (components/idea-book/Leaves.tsx):
 * a bar with the book's name, a progress line, the contents, and the link to
 * the current spread as printed; arrow keys to turn leaves; the address
 * following the leaf in view, so any leaf can be shared.
 *
 * The leaves themselves are server-rendered children, so the book's text is
 * in the HTML for a reader with scripts off and for search.
 *
 * Reading is plain scrolling (no snapping since 16 Oct 2026: it felt jumpy);
 * ← and →, the turn buttons and Contents land a leaf exactly at the top.
 */

export interface ContentsEntry {
  id: string;
  title: string;
  pages: string;
  section: string;
}

export default function EditionShell({
  title,
  volume,
  contents,
  sections,
  printedHref,
  pagesHref,
  total,
  children,
}: {
  title: string;
  volume: string;
  contents: ContentsEntry[];
  sections: { key: string; title: string }[];
  /** The page-by-page reader, so a page number opens the spread as printed... */
  printedHref: string;
  /** ...and its own address for page one, which has no /1 route. */
  pagesHref: string;
  total: number;
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  // Scripts are running: the leaves may fade in as they arrive (edition.css
  // keys the entrance on this, so a reader with scripts off sees every leaf).
  const [live, setLive] = useState(false);
  const scroller = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const leaves = useCallback(() => Array.from(scroller.current?.querySelectorAll<HTMLElement>(".ib-leaf") ?? []), []);

  const goTo = useCallback(
    (index: number) => {
      const all = leaves();
      const target = all[Math.max(0, Math.min(all.length - 1, index))];
      target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    },
    [leaves]
  );

  // Which leaf is in view: the one covering the most of the SCREEN (its
  // visible height over the scroller's), not the one with the largest share
  // of itself visible. By share, a short leaf peeping in beat a tall one
  // filling the screen, and the bar's title and progress flickered as the
  // reader scrolled (Vern, 16 Oct 2026: "the scroll functions seem jumpy").
  // Writes the address (replaceState: no history entry per leaf) and the
  // progress.
  //
  // A leaf's photograph and heading arrive as soon as a fair slice of it is
  // on screen (ENTER_PX), not when it becomes the leaf in view: they used to
  // stay blank until then and appear all at once, mid-scroll.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const all = leaves();
    const ENTER_PX = 120;
    const cover = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const seen = e.isIntersecting ? e.intersectionRect.height : 0;
          cover.set(e.target, seen);
          if (seen >= Math.min(ENTER_PX, e.boundingClientRect.height * 0.5)) e.target.classList.add("ib-in");
        }
        let best: Element | null = null;
        let most = 0;
        for (const [el, px] of cover) if (px > most) { best = el; most = px; }
        if (!best) return;
        const index = Number((best as HTMLElement).dataset.leaf ?? 0);
        setCurrent(index);
        const id = best.id;
        if (id && window.location.hash !== `#${id}`) {
          window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${index === 0 ? "" : `#${id}`}`);
        }
      },
      // Fine steps, so the visible heights stay current while scrolling.
      { root, threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    all.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [leaves]);

  // Arriving with #leaf: scroll there once the leaves have their height. Then
  // the book has the keyboard: Page Down, Space and the arrows scroll it
  // without a click first (the document itself does not scroll).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el && el.classList.contains("ib-leaf")) el.scrollIntoView({ block: "start" });
    scroller.current?.focus({ preventScroll: true });
    setLive(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (open) {
        if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
        return;
      }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
      else if (e.key === "Home") { e.preventDefault(); goTo(0); }
      else if (e.key === "End") { e.preventDefault(); goTo(total - 1); }
      else if (e.key === "Escape") { e.preventDefault(); leaveIdeaBook(); }
      else if (e.key.toLowerCase() === "c") { setOpen(true); }
      else if (!scroller.current?.contains(t)) {
        // Focus is on the bar (after a button, say): scroll the book anyway.
        const root = scroller.current;
        if (!root) return;
        const page = root.clientHeight * 0.85;
        const by =
          e.key === "ArrowDown" ? 80 : e.key === "ArrowUp" ? -80
          : e.key === "PageDown" || (e.key === " " && !e.shiftKey) ? page
          : e.key === "PageUp" || (e.key === " " && e.shiftKey) ? -page : 0;
        if (!by) return;
        e.preventDefault();
        root.scrollBy({ top: by, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, open, total]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  const here = contents[current] ?? contents[0];
  const progress = total > 1 ? (current / (total - 1)) * 100 : 0;

  return (
    <div className={`ib${live ? " ib-live" : ""}`} data-surface="paper">
      <header className="ib-bar">
        <div className="ib-bar-inner">
          <Link href="/" className="ib-bar-brand" aria-label="HUB Surface Systems, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hub-official-logo.svg" alt="" width={112} height={28} />
          </Link>
          <p className="ib-bar-title">
            <span className="ib-bar-book">{title}</span>
            <span className="ib-bar-here" aria-live="polite">{here?.title}</span>
          </p>
          <div className="ib-bar-actions">
            <button type="button" className="ib-bar-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
              Contents
            </button>
            {here && (
              <Link href={printedPageHref(printedHref, pagesHref, here.pages)} className="ib-bar-btn ib-bar-pages" title="Open these pages as printed">
                <span className="ib-bar-pages-label">{"Printed"}</span>{here.pages}
              </Link>
            )}
            <button type="button" className="ib-bar-close" onClick={() => leaveIdeaBook()} aria-label="Close the Product Book">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        </div>
        <div className="ib-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current + 1} aria-label="Place in the book">
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="ib-scroll" ref={scroller} tabIndex={-1}>
        {children}
      </main>

      <nav className="ib-turn" aria-label="Turn the leaves">
        <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className="ib-turn-n">{current + 1} / {total}</span>
        <button type="button" onClick={() => goTo(current + 1)} disabled={current >= total - 1} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </nav>

      <dialog ref={dialog} className="ib-contents" onClose={() => setOpen(false)} aria-label="Contents">
        <div className="ib-contents-inner">
          <div className="ib-contents-head">
            <p className="ib-eyebrow">{title}</p>
            <button type="button" className="ib-bar-close" onClick={() => setOpen(false)} aria-label="Close the contents">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          {sections.map((s) => {
            const entries = contents.filter((c) => c.section === s.key);
            if (!entries.length) return null;
            return (
              <div key={s.key} className="ib-contents-section">
                <h2 className="ib-label">{s.title}</h2>
                <ol>
                  {entries.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        aria-current={here?.id === c.id ? "true" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(false);
                          const el = document.getElementById(c.id);
                          el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
                        }}
                      >
                        <span className="ib-contents-name">{c.title}</span>
                        <span className="ib-contents-page-n">{c.pages}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
          <p className="ib-fine">{volume} · ← and → turn the leaves · C opens the contents</p>
        </div>
      </dialog>
    </div>
  );
}

/** The printed reader's address for a spread: page one is the reader's own home, not /1. */
function printedPageHref(printedHref: string, pagesHref: string, pages: string): string {
  const first = pages.split("–")[0];
  return first === "1" ? pagesHref : `${printedHref}/${first}`;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
