"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { familiesFor } from "@/lib/colours";
import { withColours, search, groupHits, type SearchHit } from "@/lib/search";

/**
 * Site search.
 *
 * Vernon, Aug 2026: "when user hits the search button it just does not work,
 * should search whole website and return intelligent results; current search
 * experience is underwhelming."
 *
 * The old overlay did return rows — but it was a filter with a list under it,
 * and it failed the three things that make a search feel like software rather
 * than a form:
 *
 *   NO KEYBOARD. There was no active row, so no arrow keys and no Enter. Every
 *   result required leaving the keyboard for the mouse, which is precisely the
 *   opposite of why someone opens a search box.
 *
 *   NO RANKING. Results rendered in source order, so "streetbond" led with
 *   TrafficPatterns. See lib/search.ts for the scorer that fixes it.
 *
 *   NO EXPLANATION. Nothing showed *why* a row matched, so a result that came
 *   from a keyword or a spec value looked like a mistake.
 *
 * This version is a proper command palette: ↑ ↓ to move, Enter to open, ESC to
 * close, the active row always scrolled into view, the matched term marked in
 * every row, and a live count. Rows are one line of title plus one line of
 * context so a screenful is eight results rather than three.
 */

const QUICK: { label: string; href: string; hint: string }[] = [
  { label: "All systems", href: "/products", hint: "14 products" },
  { label: "All applications", href: "/applications", hint: "20 uses" },
  { label: "Photo archive", href: "/gallery", hint: "Installations" },
  { label: "Specification library", href: "/resources", hint: "Spec sheets" },
  { label: "Field Notes", href: "/blog", hint: "67 pieces" },
  { label: "Lunch & Learn", href: "/lunch-learn", hint: "Book a session" },
];

const TRY = ["stamped asphalt", "rainbow crosswalk", "150 mil", "LEED heat island", "bike lane", "colour card"];

const TYPE_TINT: Record<string, string> = {
  Product: "#f97316",
  Application: "#f59e0b",
  "Field note": "#8b9bb4",
  Document: "#6ee7b7",
  Colour: "#c4b5fd",
  Pattern: "#93c5fd",
  Page: "#9aa0a8",
};

/** Wraps the matched run in <mark> without letting query text become markup. */
function Highlight({ text, term }: { text: string; term: string }) {
  if (!term || term.length < 2) return <>{text}</>;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: "rgba(249,115,22,0.22)", color: "inherit", borderRadius: 3, padding: "0 1px" }}>
        {text.slice(i, i + term.length)}
      </mark>
      {text.slice(i + term.length)}
    </>
  );
}

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Colour data is only reachable client-side, so the index is completed here.
  const entries = useMemo(() => {
    const seen = new Set<string>();
    const colours: { name: string; hex: string; product: string; href: string }[] = [];
    for (const [slug, label] of [
      ["streetbond", "StreetBond"],
      ["streetbondsr", "StreetBondSR"],
      ["durashield", "DuraShield"],
      ["traffic-patterns-xd", "TrafficPatternsXD"],
    ] as const) {
      for (const fam of familiesFor(slug)) {
        for (const c of fam.colours) {
          if (seen.has(c.name)) continue;
          seen.add(c.name);
          colours.push({ name: c.name, hex: c.hex, product: label, href: `/products/${slug}#colours` });
        }
      }
    }
    return withColours(colours);
  }, []);

  const hits = useMemo(() => search(query, entries), [query, entries]);
  const groups = useMemo(() => groupHits(hits), [hits]);
  /** Flat order matches what the eye sees, so ↑↓ walks the rendered list. */
  const flat = useMemo(() => groups.flatMap((g) => g.hits), [groups]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const go = useCallback(
    (href: string) => { onClose(); router.push(href); },
    [onClose, router]
  );

  // Keyboard: navigation first, then the focus trap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "ArrowDown" || (e.key === "n" && e.ctrlKey)) {
        e.preventDefault(); setActive((i) => (flat.length ? (i + 1) % flat.length : 0)); return;
      }
      if (e.key === "ArrowUp" || (e.key === "p" && e.ctrlKey)) {
        e.preventDefault(); setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0)); return;
      }
      if (e.key === "Enter") {
        const target = flat[active];
        if (target) { e.preventDefault(); go(target.href); }
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [flat, active, go, onClose]);

  // Keep the active row on screen when arrowing past the fold.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const showResults = query.trim().length >= 2;
  let index = -1;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[8vh] px-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog" aria-modal="true" aria-label="Site search"
        initial={{ opacity: 0, scale: 0.98, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.16 }}
        className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div
          className="flex items-center gap-3 px-4 rounded-2xl"
          style={{
            background: "var(--bg-card)", border: "1px solid rgba(249,115,22,0.45)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.7)", minHeight: 60,
          }}
        >
          <svg className="flex-shrink-0" width="19" height="19" fill="none" stroke="#f97316" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the site"
            aria-controls="search-results"
            placeholder="Search systems, applications, specs, field notes…"
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: "var(--text-primary)", caretColor: "#F97316" }}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className="flex-shrink-0 flex items-center justify-center rounded-md hover:bg-white/10"
              style={{ width: 32, height: 32, color: "var(--text-faint)" }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeWidth={2} strokeLinecap="round" /></svg>
            </button>
          )}
          {/* Hidden on phones — at 390px it pushed past the panel edge, and a
              touch user has no ESC key to press anyway. */}
          <kbd className="hidden sm:block flex-shrink-0 px-2 py-0.5 rounded text-[11px] font-mono" style={{ background: "var(--fill-subtle)", color: "var(--text-faint)", border: "1px solid var(--border-color)" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div
          className="mt-2 rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
        >
          {!showResults && (
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2.5" style={{ color: "var(--text-faint)" }}>Jump to</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-5">
                {QUICK.map((item) => (
                  <button
                    key={item.href} onClick={() => go(item.href)}
                    className="flex items-center justify-between gap-2 px-3 rounded-lg text-left hover:bg-white/[0.06] transition-colors"
                    style={{ minHeight: 44 }}
                  >
                    <span className="text-sm font-semibold" style={{ color: "var(--text-body)" }}>{item.label}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{item.hint}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2.5" style={{ color: "var(--text-faint)" }}>Try</p>
              <div className="flex flex-wrap gap-1.5">
                {TRY.map((t) => (
                  <button
                    key={t} onClick={() => { setQuery(t); inputRef.current?.focus(); }}
                    className="text-xs font-medium px-3 py-2 rounded-full transition-colors hover:bg-white/[0.08]"
                    style={{ background: "var(--fill-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showResults && flat.length > 0 && (
            <div id="search-results" ref={listRef} role="listbox" aria-label="Search results" className="max-h-[62vh] overflow-y-auto">
              {groups.map((group) => (
                <div key={group.type}>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em] px-4 pt-4 pb-1.5 sticky top-0"
                    style={{ color: TYPE_TINT[group.type] ?? "var(--text-faint)", background: "var(--bg-card-neutral)" }}
                  >
                    {group.type}
                    <span style={{ color: "var(--text-faint)", marginLeft: 8, letterSpacing: 0 }}>{group.hits.length}</span>
                  </p>
                  {group.hits.map((h: SearchHit) => {
                    index += 1;
                    const isActive = index === active;
                    const myIndex = index;
                    return (
                      <button
                        key={h.id}
                        role="option"
                        aria-selected={isActive}
                        data-active={isActive}
                        onMouseEnter={() => setActive(myIndex)}
                        onClick={() => go(h.href)}
                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors"
                        style={{ background: isActive ? "rgba(249,115,22,0.10)" : "transparent" }}
                      >
                        {h.hex ? (
                          <span className="flex-shrink-0 rounded" style={{ width: 22, height: 22, background: h.hex, border: "1px solid rgba(255,255,255,0.18)" }} />
                        ) : (
                          <span
                            className="flex-shrink-0 rounded-full"
                            style={{ width: 6, height: 6, background: isActive ? "#f97316" : "var(--border-color)" }}
                          />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold truncate" style={{ color: isActive ? "#fff" : "var(--text-body)" }}>
                            <Highlight text={h.title} term={h.matched} />
                          </span>
                          {h.subtitle && (
                            <span className="block text-xs truncate" style={{ color: "var(--text-faint)" }}>
                              <Highlight text={h.subtitle} term={h.matched} />
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <span className="flex-shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: "#f97316", border: "1px solid rgba(249,115,22,0.35)" }}>
                            ↵
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {showResults && flat.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                Nothing matches “{query.trim()}”
              </p>
              <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
                Try a system name, a spec value, or what you are building.
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {TRY.map((t) => (
                  <button
                    key={t} onClick={() => { setQuery(t); inputRef.current?.focus(); }}
                    className="text-xs font-medium px-3 py-2 rounded-full hover:bg-white/[0.08]"
                    style={{ background: "var(--fill-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer — states the keys, because a palette nobody knows is
              keyboard-driven is a palette nobody drives with the keyboard. */}
          <div
            className="px-4 py-2.5 flex items-center justify-between text-[11px]"
            style={{ borderTop: "1px solid var(--border-color)", color: "var(--text-faint)" }}
          >
            <span className="hidden sm:flex items-center gap-3">
              <span><kbd style={{ fontFamily: "monospace" }}>↑↓</kbd> move</span>
              <span><kbd style={{ fontFamily: "monospace" }}>↵</kbd> open</span>
              <span><kbd style={{ fontFamily: "monospace" }}>esc</kbd> close</span>
            </span>
            <span className="sm:hidden">Tap a result</span>
            <span aria-live="polite">
              {showResults ? `${flat.length} result${flat.length === 1 ? "" : "s"}` : `${entries.length} pages indexed`}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
