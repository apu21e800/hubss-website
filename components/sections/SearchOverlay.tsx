"use client";

import { useState, useRef, useEffect, useMemo, useCallback, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { familiesFor } from "@/lib/colours";
import { withColours, search, groupHits, thumbSrc, thumbSrcSet, type SearchEntry, type SearchHit } from "@/lib/search";

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
 *
 * PICTURES (2 Oct 2026). Vern: "search function is a bit dull too, could add
 * image thumbnails or something?!" Every row now leads with a square picture
 * of what it opens: the system, the application, the post, the job, the
 * sheet's first page, the template, the colour itself. They are baked at
 * build (lib/search.ts, scripts/gen-search-images.ts), so typing never waits
 * on Sanity or /_next/image; a row with no picture shows the HUB wheel on the
 * card colour. The start screen stays the list of places to jump to and
 * things to try (a grid of the fourteen systems as square tiles was tried the
 * same day and dropped: Vern, "not a fan of these squares"), and the grey
 * chip that repeated the typed letters ("se") back at the end of a row is gone.
 */

// "Vancouver" earns its place by teaching the one thing nobody would guess:
// the index knows where the work is. Fifty-nine installations across ten
// provinces are searchable by city and by province name, and a visitor only
// finds that out if something tells them.
const QUICK: { label: string; href: string; hint: string }[] = [
  { label: "All systems", href: "/products", hint: "Products" },
  { label: "All applications", href: "/applications", hint: "Uses" },
  { label: "Photo archive", href: "/gallery", hint: "Installations" },
  { label: "Specification library", href: "/resources", hint: "Spec sheets" },
  { label: "Insights", href: "/blog", hint: "Projects, guides and articles" },
  { label: "Lunch & Learn", href: "/lunch-learn", hint: "Book a session" },
];

const TRY = ["stamped asphalt", "rainbow crosswalk", "150 mil", "Vancouver", "LEED heat island", "bike lane", "colour card"];

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

/**
 * One line that ends on a whole word (2 Oct 2026, QA: at 390 the line stopped
 * mid-word, "Polymer-blend repair for potholes, spalls, and utility c…").
 *
 * `truncate` cuts wherever the box ends, and a one-line clamp is no better:
 * Chrome still shortens the last word to make room for its ellipsis ("Heat
 * fus…", "spalls, an…"). An ellipsis never splits an atomic inline, though,
 * so each word is set as an inline-block and the line ends on the last word
 * that fits, at every width: "Heat fused …". The spaces stay real text, so
 * the words still read as words to a screen reader and on copy.
 *
 * The words are written as one escaped HTML string per line, not as React
 * elements. Measured on the dev server, a React element per word added about
 * 25ms to the keystroke that first shows results (36 rows, two lines each);
 * the string costs about what plain text did. Every character of the text is
 * escaped, and the query only decides where the <mark> goes: it never becomes
 * markup.
 */
const ONE_LINE: CSSProperties = { display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
/**
 * Past this, no row is wide enough to show more of a line (at most about 120
 * characters of a subtitle fit the 768px panel), so the rest is not set. A
 * line cut here ends in its own ellipsis, so it never looks complete.
 */
const LINE_CHARS = 140;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Weight and brightness, not a highlighter. An orange block behind every match
 * turned a list of eighteen results into a field of orange rectangles: the
 * marks competed with each other and with the selected row, so nothing read as
 * primary. Lifting the matched run to full brightness and semibold does the
 * same job and disappears when you are not looking for it.
 */
const MARK = '<mark style="background:transparent;color:var(--text-primary);font-weight:650">';

/** One line's words as inline-blocks, the first occurrence of `term` marked. */
function wordsHtml(text: string, term: string): string {
  const shown = text.length > LINE_CHARS ? text.slice(0, text.lastIndexOf(" ", LINE_CHARS) + 1 || LINE_CHARS) : text;
  const at = term && term.length >= 2 ? shown.toLowerCase().indexOf(term.toLowerCase()) : -1;
  let html = "";
  let pos = 0;
  for (const part of shown.split(/(\s+)/)) {
    const start = pos;
    pos += part.length;
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      html += " ";
      continue;
    }
    // A query token has no spaces, so a match always sits inside one word.
    if (at >= start && at < pos) {
      const a = at - start;
      const b = a + term.length;
      html += `<span class="inline-block">${escapeHtml(part.slice(0, a))}${MARK}${escapeHtml(part.slice(a, b))}</mark>${escapeHtml(part.slice(b))}</span>`;
    } else {
      html += `<span class="inline-block">${escapeHtml(part)}</span>`;
    }
  }
  return shown.length < text.length ? `${html}<span class="inline-block">…</span>` : html;
}

function WordLine({ text, term, className, style, after }: {
  text: string;
  term: string;
  className?: string;
  style?: CSSProperties;
  after?: ReactNode;
}) {
  const html = useMemo(() => wordsHtml(text, term), [text, term]);
  return (
    <span className={className} style={{ ...ONE_LINE, ...style }}>
      {/* Escaped text only: see wordsHtml and escapeHtml above. */}
      <span dangerouslySetInnerHTML={{ __html: html }} />
      {after}
    </span>
  );
}

/** The committed 180px wheel, shown grey and faint as the "no picture" tile. */
const WHEEL = "/images/chrome/wheel/hub-wheel-orange-180.webp";

/**
 * Thumbnails already shown once. The next keystroke re-renders most rows; a
 * picture that has loaded before appears at once instead of fading in again.
 */
const SHOWN = new Set<string>();

/**
 * The square at the front of a row or a start-grid tile.
 *
 * The tile is the card colour from the first frame, so the row is laid out
 * before its picture arrives and nothing shifts. The baked thumbnail fades in
 * over it; with no thumbnail, or one that fails to load, the tile shows the
 * HUB wheel instead: grey and faint, because the orange is reserved for what
 * the visitor is doing. A colourant's tile is the colour itself.
 */
function Thumb({ entry, variant }: { entry: SearchEntry; variant: "row" | "tile" }) {
  const base = entry.hex ? undefined : entry.thumb;
  const [state, setState] = useState<"loading" | "shown" | "none">(
    !base ? "none" : SHOWN.has(base) ? "shown" : "loading",
  );
  return (
    <span
      aria-hidden="true"
      className={
        variant === "row"
          ? "relative block flex-shrink-0 overflow-hidden w-12 h-12 sm:w-14 sm:h-14"
          : "relative block w-full overflow-hidden"
      }
      style={{
        aspectRatio: "1 / 1",
        borderRadius: variant === "row" ? 9 : 11,
        background: entry.hex ?? "var(--bg-card)",
      }}
    >
      {state === "none" && !entry.hex && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={WHEEL}
          alt=""
          width={180}
          height={180}
          style={{ position: "absolute", left: "27%", top: "27%", width: "46%", height: "46%", filter: "grayscale(1)", opacity: 0.32 }}
        />
      )}
      {base && state !== "none" && (
        // A plain <img> from /public: never /_next/image (allowance spent, Aug 2026).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbSrc(base)}
          srcSet={thumbSrcSet(base)}
          sizes={variant === "row" ? "(min-width: 640px) 56px, 48px" : "(min-width: 640px) 100px, 110px"}
          alt=""
          width={128}
          height={128}
          // Lazy, though every row is near the screen: the browser then starts
          // the fetches after it has laid the rows out, so the keystroke that
          // shows results paints first and the pictures follow.
          loading="lazy"
          decoding="async"
          onLoad={() => {
            SHOWN.add(base);
            setState("shown");
          }}
          onError={() => setState("none")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: state === "shown" ? 1 : 0,
            // Runs only on the change from 0: a picture mounted as "shown" just appears.
            transition: "opacity 140ms ease",
          }}
        />
      )}
      {/* The hairline sits above the picture, so a pale photo or a white spec
          sheet still has an edge on the light theme. */}
      <span className="absolute inset-0 pointer-events-none" style={{ borderRadius: "inherit", boxShadow: "inset 0 0 0 1px var(--ink-10)" }} />
    </span>
  );
}

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  /** The query, and how many times it has been edited (see `chosen`). */
  const [typed, setTyped] = useState({ text: "", edit: 0 });
  const query = typed.text;
  const setQuery = useCallback((text: string) => setTyped((t) => ({ text, edit: t.edit + 1 })), []);
  /**
   * The chosen row, remembered with the edit it was chosen during. Every edit
   * starts from its default again, as it always has, but without an effect:
   * an effect that reset the index ran after the commit and, on a keystroke,
   * rendered every row a second time before the frame was painted (measured
   * 2 Oct 2026).
   */
  const [chosen, setChosen] = useState<{ edit: number; i: number }>({ edit: 0, i: -1 });
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

  const showResults = query.trim().length >= 2;
  /** What ↑↓ and Enter act on: the results. The start screen has no listbox. */
  const options: SearchEntry[] = showResults ? flat : [];

  // Results start on their first row; with no results nothing is chosen, so
  // Enter in an empty box opens nothing.
  const active = chosen.edit === typed.edit ? chosen.i : showResults ? 0 : -1;
  const setActive = useCallback((i: number) => setChosen({ edit: typed.edit, i }), [typed.edit]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const go = useCallback(
    (href: string, isFile?: boolean) => {
      // A spec sheet is a file, not a route. router.push("/docs/…pdf") asks the
      // App Router to resolve a page that does not exist — the visitor gets a
      // beat of nothing before the browser gives up and hard-loads it.
      //
      // It also opens in its own tab and leaves the palette standing, because a
      // specifier assembling a submittal pulls three or four sheets in a row.
      // Closing the search after each one would make them reopen it each time.
      if (isFile) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  // Keyboard: navigation first, then the focus trap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      const n = options.length;
      if (e.key === "ArrowDown" || (e.key === "n" && e.ctrlKey)) {
        e.preventDefault(); setActive(n ? (active + 1) % n : 0); return;
      }
      if (e.key === "ArrowUp" || (e.key === "p" && e.ctrlKey)) {
        // From "nothing chosen" (-1), up goes to the last item, as it does from the first.
        e.preventDefault(); setActive(n ? (active <= 0 ? n - 1 : active - 1) : 0); return;
      }
      if (e.key === "Enter") {
        const target = options[active];
        if (target) { e.preventDefault(); go(target.href, target.isFile); }
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
  }, [options, active, setActive, go, onClose]);

  // Keep the active row on screen when arrowing past the fold.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  /** A listbox is on screen: results. Not at the start, not when nothing matched. */
  const hasList = showResults && flat.length > 0;
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
        // 768px, was 672 (2 Oct 2026): the rows give their pictures 70px and
        // the one-line descriptions room to end on a word.
        className="w-full max-w-3xl rounded-2xl overflow-hidden"
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
            stroke={showResults ? "var(--accent-text-lg)" : "var(--text-faint)"}
            style={{ transition: "stroke 220ms ease" }}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth={2} /><path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            data-palette-input
            role="combobox"
            aria-expanded={hasList}
            aria-autocomplete="list"
            aria-label="Search the site"
            aria-controls="search-results"
            placeholder="Search systems, specs, insights"
            className="flex-1 bg-transparent outline-none"
            style={{
              color: "var(--text-primary)",
              // Accent 1: the caret. The smallest possible mark, on the exact
              // pixel the visitor is looking at, alive because it blinks.
              caretColor: "var(--accent-text-lg)",
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
              className="flex-shrink-0 flex items-center justify-center rounded-md hover:bg-[var(--ink-10)]"
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
            // The start screen: six places to jump to and seven things to try.
            // On 2 Oct 2026 it was briefly a grid of the fourteen systems as
            // square tiles; Vern: "I'm not a fan of these squares on the search
            // function, the rest of it is fine." So the rows keep their
            // thumbnails and the start screen is the quiet list again.
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2.5" style={{ color: "var(--text-faint)" }}>Jump to</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-5">
                {QUICK.map((item) => (
                  <button
                    key={item.href} onClick={() => go(item.href)}
                    className="group flex items-center justify-between gap-2 px-3 rounded-lg text-left hover:bg-[var(--ink-06)] transition-colors"
                    style={{ minHeight: 44 }}
                  >
                    <span className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-body)" }}>
                      {/* A two-pixel mark that appears under the cursor: the
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
                    className="text-xs font-medium px-3 py-2 rounded-full transition-colors hover:bg-[var(--ink-06)] hover:border-orange-500/45 hover:text-[var(--text-primary)]"
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
                    // zIndex: each row's content-visibility makes it a stacking
                    // context, which would otherwise paint over the stuck heading.
                    style={{ color: LABEL, background: "var(--bg-card-neutral)", zIndex: 1 }}
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
                        onClick={() => go(h.href, h.isFile)}
                        className="w-full text-left p-2 flex items-center gap-3 sm:gap-3.5 rounded-2xl transition-colors"
                        // Selection is elevation, not colour. The orange left
                        // rule read as a status marker — the kind of thing that
                        // means "unread" or "error" — when all it means is
                        // "your cursor is here". Every palette worth copying
                        // says that with a raised, inset, rounded surface and
                        // nothing else; the row lifts off the panel and the eye
                        // finds it without being flagged down.
                        style={{
                          background: isActive ? "var(--bg-card-surface)" : "transparent",
                          // Rows below the list's fold skip layout and paint
                          // until scrolled to (2 Oct 2026: the keystroke that
                          // shows results lays out the eight you can see, not
                          // thirty-six). 72px is a row's height, 64px on a phone.
                          contentVisibility: "auto",
                          containIntrinsicSize: "auto 72px",
                        }}
                      >
                        {/* The picture: 56px, 48px on a phone. A colourant's
                            tile is the colour itself, big enough to judge,
                            with its hex beside the name. */}
                        <Thumb entry={h} variant="row" />
                        <span className="min-w-0 flex-1">
                          <WordLine
                            text={h.title}
                            term={h.matched}
                            className="text-sm font-semibold"
                            style={{ color: isActive ? "var(--text-primary)" : "var(--text-body)" }}
                          />
                          {h.subtitle && (
                            <WordLine
                              text={h.subtitle}
                              term={h.matched}
                              className="text-xs mt-0.5"
                              style={{ color: "var(--text-faint)" }}
                              after={h.hex && <span className="inline-block" style={{ fontFamily: "monospace", marginLeft: 8 }}>{h.hex.toUpperCase()}</span>}
                            />
                          )}
                        </span>
                        {/* The trailing slot. One per row, never two.

                            Active row: the action, and it names the action
                            honestly — a document leaves the site and lands in a
                            new tab, so it says PDF with a download arrow rather
                            than promising to "open" something in place.

                            Inactive row: the badge, a province on a project or
                            PDF on a download. Both answer "what am I about to
                            get". Until 2 Oct 2026 a row that matched in its
                            keywords printed the matched term here in a grey
                            chip; for a short query that was just the query
                            again ("se", "se", "se" down the list in Vern's
                            screenshot). The group heading already says what
                            kind of thing each row is, and the picture now says
                            which one, so the chip went rather than becoming a
                            type label. */}
                        {isActive ? (
                          // Accent 3: the one row Enter will act on. This is the
                          // palette's actual next action, so it is the one
                          // row-level element that earns colour.
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
                              color: "var(--accent-text-lg)",
                              border: "1px solid rgba(249,115,22,0.42)",
                              background: "rgba(249,115,22,0.10)",
                            }}
                          >
                            {h.isFile ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 5v6a3 3 0 0 1-3 3H5" />
                                <path d="M9 10l-4 4 4 4" />
                              </svg>
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{h.isFile ? "PDF" : "Open"}</span>
                          </span>
                        ) : h.badge ? (
                          <span
                            className="flex-shrink-0 text-[10px] font-semibold tabular-nums"
                            style={{ color: "var(--text-faint)", letterSpacing: "0.06em" }}
                          >
                            {h.badge}
                          </span>
                        ) : null}
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
                    className="text-xs font-medium px-3 py-2 rounded-full transition-colors hover:bg-[var(--ink-06)] hover:border-orange-500/45 hover:text-[var(--text-primary)]"
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
                  <span style={{ color: "var(--accent-text-lg)", fontWeight: 650 }}>{flat.length}</span>
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
