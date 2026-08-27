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
 *
 * THE ORANGE RULE. HUB's orange is marking paint. On a road, paint marks the
 * one thing a driver must not miss — it is never applied to the whole surface,
 * and it is never decorative. The same discipline governs it here:
 *
 *   At rest this panel is monochrome. Orange appears ONLY where the visitor has
 *   acted — the caret they are typing with, the rule that tracks their query,
 *   the count that answers them, and the return key on the row they are about
 *   to open. Stop typing and all of it recedes.
 *
 * Four accents, each one tied to a live state, none larger than a few pixels.
 * That is the difference between an interface that uses a brand colour and one
 * that is merely tinted with it. The earlier draft had seven decorative hues;
 * the draft after that had none at all, which was correct about the noise and
 * wrong about the craft.
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

/**
 * Group labels are typography, not colour.
 *
 * The first pass gave each of the seven types its own tint — orange, amber,
 * blue-grey, mint, violet, sky, grey. Seven hues in a 400px panel is a legend,
 * not a hierarchy: the eye has to decode a colour key before it can read a
 * result, and none of the colours meant anything a reader could act on.
 *
 * One muted grey for every label. Colour in this panel now says exactly one
 * thing — "this row is selected" — which is the only thing in a keyboard
 * palette that actually needs to shout.
 */
const LABEL = "var(--text-faint)";

/** Wraps the matched run in <mark> without letting query text become markup. */
function Highlight({ text, term }: { text: string; term: string }) {
  if (!term || term.length < 2) return <>{text}</>;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      {/* Weight and brightness, not a highlighter. An orange block behind
          every match turned a list of eighteen results into a field of orange
          rectangles — the marks competed with each other and with the selected
          row, so nothing read as primary. Lifting the matched run to full
          brightness and semibold does the same job and disappears when you are
          not looking for it. */}
      <mark style={{ background: "transparent", color: "var(--text-primary)", fontWeight: 650 }}>
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
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-card-neutral)",
          border: "1px solid var(--border-color)",
          boxShadow: "0 32px 90px rgba(0,0,0,0.72)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input.

            This was a separate floating card sitting above a second card, with
            its own border and an orange ring around it. Command palettes are
            one surface — Raycast, Linear, Vercel, GitHub all do it the same
            way, and the reason is that a search field inside a modal does not
            need to announce itself as a field: it is the only thing you can
            type into, and the caret is already in it. Removing the box removes
            an orange accent and a border, and gives the text room to breathe. */}
        <div
          className="flex items-center gap-3.5 px-5 relative"
          style={{ minHeight: 68, borderBottom: "1px solid var(--border-color)" }}
        >
          <svg
            className="flex-shrink-0"
            width="19" height="19" fill="none"
            // The glyph warms the moment the query is live. Not a state badge —
            // just the interface acknowledging that it is listening.
            stroke={showResults ? "#F97316" : "var(--text-faint)"}
            style={{ transition: "stroke 220ms ease" }}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            data-palette-input
            role="combobox"
            aria-expanded={showResults}
            aria-autocomplete="list"
            aria-label="Search the site"
            aria-controls="search-results"
            placeholder="Search systems, applications, specs, field notes…"
            className="flex-1 bg-transparent outline-none"
            style={{
              color: "var(--text-primary)",
              // Accent 1: the caret. The smallest possible mark, on the exact
              // pixel the visitor is looking at, alive because it blinks.
              caretColor: "#F97316",
              fontSize: "1.125rem",
              letterSpacing: "-0.01em",
              paddingTop: 14,
              paddingBottom: 14,
            }}
          />
          {/* Accent 2: the live dot.

              A rule across the field was too much surface for what it had to
              say. The dot is also the catalogue's own mark — Vernon set an
              Orange Dot on the half title, a dot on every section opener, and a
              dot leading every row of the contents page. Bringing it here means
              the interface and the printed book are marking things the same
              way, which is what a design system is for.

              Present only while the query is live, and breathing rather than
              blinking so it reads as attention, not as an alarm. */}
          <span
            aria-hidden="true"
            className="flex-shrink-0"
            style={{
              width: 7, height: 7, borderRadius: "50%", background: "#F97316",
              opacity: showResults ? 1 : 0,
              transform: showResults ? "scale(1)" : "scale(0.4)",
              transition: "opacity 260ms ease, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              animation: showResults ? "palette-dot 2.4s ease-in-out infinite" : "none",
              boxShadow: "0 0 0 4px rgba(249,115,22,0.10)",
            }}
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
          {/* A hairline between the action and the hint — clearing the field
              and closing the panel are different things, and without a break
              the trailing edge read as one undifferentiated cluster of chrome.
              Hidden on phones: at 390px it pushed past the panel edge, and a
              touch user has no ESC key to press anyway. */}
          <span className="hidden sm:block flex-shrink-0" aria-hidden="true" style={{ width: 1, height: 18, background: "var(--border-color)" }} />
          <kbd className="hidden sm:block flex-shrink-0 px-2 py-0.5 rounded text-[11px] font-mono" style={{ background: "var(--fill-subtle)", color: "var(--text-faint)", border: "1px solid var(--border-color)" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div>
          {!showResults && (
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2.5" style={{ color: "var(--text-faint)" }}>Jump to</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-5">
                {QUICK.map((item) => (
                  <button
                    key={item.href} onClick={() => go(item.href)}
                    className="group flex items-center justify-between gap-2 px-3 rounded-lg text-left hover:bg-white/[0.06] transition-colors"
                    style={{ minHeight: 44 }}
                  >
                    <span className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-body)" }}>
                      {/* A two-pixel mark that appears under the cursor. The
                          jump links are destinations; the mark says which one
                          you are pointing at, in the site's own paint. */}
                      <span
                        aria-hidden="true"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ width: 3, height: 14, background: "#F97316", borderRadius: 2 }}
                      />
                      {item.label}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{item.hint}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2.5" style={{ color: "var(--text-faint)" }}>Try</p>
              <div className="flex flex-wrap gap-1.5">
                {TRY.map((t) => (
                  <button
                    key={t} onClick={() => { setQuery(t); inputRef.current?.focus(); }}
                    // Suggestion chips warm on hover — the one place in the
                    // empty state where the visitor has expressed intent.
                    className="text-xs font-medium px-3 py-2 rounded-full transition-colors hover:bg-white/[0.06] hover:border-orange-500/45 hover:text-white"
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
                    className="text-[10px] font-bold uppercase tracking-[0.18em] px-5 pt-4 pb-2 sticky top-0"
                    style={{ color: LABEL, background: "var(--bg-card-neutral)" }}
                  >
                    {/* Dot · label · count — the contents-page row from the
                        catalogue, at UI scale. Structural, so the dot is
                        neutral; the orange one is reserved for live state. */}
                    <span
                      aria-hidden="true"
                      className="inline-block align-middle"
                      style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", marginRight: 9, marginBottom: 2, opacity: 0.7 }}
                    />
                    {group.type}
                    <span style={{ color: "var(--text-faint)", marginLeft: 9, letterSpacing: 0, opacity: 0.75 }}>{group.hits.length}</span>
                  </p>
                  {/* Inset by the panel's own gutter so an active row is a
                      rounded block floating on the surface, not a stripe
                      running edge to edge. */}
                  <div className="px-2 pb-1">
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
                        className="w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-lg transition-colors"
                        // Selection is elevation, not colour. The orange left
                        // rule read as a status marker — the kind of thing that
                        // means "unread" or "error" — when all it means is
                        // "your cursor is here". Every palette worth copying
                        // says that with a raised, inset, rounded surface and
                        // nothing else; the row lifts off the panel and the eye
                        // finds it without being flagged down.
                        style={{ background: isActive ? "var(--bg-card-surface)" : "transparent" }}
                      >
                        {h.hex ? (
                          // A colourant result should show the colour at a size
                          // you can actually judge, with its hex, because that
                          // is the whole reason someone searched for it.
                          <span className="flex-shrink-0 rounded" style={{ width: 26, height: 26, background: h.hex, border: "1px solid rgba(255,255,255,0.22)" }} />
                        ) : (
                          // No bullet. Every row carried a neutral dot that
                          // marked nothing — with a dot now leading each group
                          // label it was dot soup, and the title is a stronger
                          // left edge than a 5px circle ever was.
                          null
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold truncate" style={{ color: isActive ? "#fff" : "var(--text-body)" }}>
                            <Highlight text={h.title} term={h.matched} />
                          </span>
                          {h.subtitle && (
                            <span className="block text-xs truncate" style={{ color: "var(--text-faint)" }}>
                              <Highlight text={h.subtitle} term={h.matched} />
                              {h.hex && <span style={{ fontFamily: "monospace", marginLeft: 8 }}>{h.hex.toUpperCase()}</span>}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          // Accent 3: the return key, on the one row Enter will
                          // open. This is the palette's actual next action, so
                          // it is the one row-level element that earns colour.
                          //
                          // Drawn rather than typed. The ↵ character renders at
                          // whatever weight and baseline the font happens to
                          // give it — at 10px that was a grey smudge nobody
                          // could read as "press Enter". An SVG is the same
                          // shape at every size on every machine, and pairing
                          // it with the word removes the last of the guessing.
                          <span
                            className="flex-shrink-0 inline-flex items-center gap-1.5 pl-2 pr-2.5 rounded-md"
                            style={{
                              height: 24,
                              color: "#F97316",
                              border: "1px solid rgba(249,115,22,0.42)",
                              background: "rgba(249,115,22,0.10)",
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M20 5v6a3 3 0 0 1-3 3H5" />
                              <path d="M9 10l-4 4 4 4" />
                            </svg>
                            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Open</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                  </div>
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
                    className="text-xs font-medium px-3 py-2 rounded-full transition-colors hover:bg-white/[0.06] hover:border-orange-500/45 hover:text-white"
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
              <span className="inline-flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 5v6a3 3 0 0 1-3 3H5" /><path d="M9 10l-4 4 4 4" />
                </svg>
                open
              </span>
              <span><kbd style={{ fontFamily: "monospace" }}>esc</kbd> close</span>
            </span>
            <span className="sm:hidden">Tap a result</span>
            {/* Accent 4: the count. It is the only number in the panel that
                answers the visitor directly, and it changes on every keystroke,
                so it is the one place a colour reads as responsiveness rather
                than decoration. At rest — no query — it stays grey, because at
                rest it is describing the index, not answering anyone. */}
            <span aria-live="polite" className="tabular-nums">
              {showResults ? (
                <>
                  <span style={{ color: "#F97316", fontWeight: 650 }}>{flat.length}</span>
                  {` result${flat.length === 1 ? "" : "s"}`}
                </>
              ) : (
                `${entries.length} pages indexed`
              )}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
