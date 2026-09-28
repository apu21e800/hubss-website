/**
 * The rules that describe a Field Notes post from its words: which HUB systems
 * it names, what type it is when nobody said, how long it takes to read.
 *
 * Pure functions, shared by the site (lib/blog.ts) and the import that moved
 * the posts into Sanity (scripts/import-blog-to-sanity.ts), so both reach the
 * same answer. Moved here from lib/mdx.ts in Sep 2026.
 */

import type { FieldNoteType } from "./field-notes-taxonomy";

const PRODUCT_PATTERNS: [string, RegExp][] = [
  ["TrafficPatternsXD", /TrafficPatternsXD|TrafficPatterns ?XD/i],
  ["TrafficPatterns",   /TrafficPatterns(?!XD)/i],
  ["StreetBond",        /StreetBond/i],
  ["StreetPrint",       /StreetPrint/i],
  ["MMAX",              /\bMMAX\b/i],
  ["DecoMark",          /DecoMark/i],
  ["DuraTherm",         /DuraTherm/i],
  ["DuraShield",        /DuraShield/i],
  ["PreMark",           /PreMark/i],
  ["AirMark",           /AirMark/i],
];

const GUIDE_TITLE_SIGNALS = [
  /^why /i, /^how /i, /^what /i, /^when /i, /^understanding/i,
  /\bguide\b/i, /\bvs\.? /i, /\boutperforms\b/i, /\bchoosing\b/i,
  /\bspecify/i, /\bcomparison\b/i,
];

/** A type for a post that has none: read from its title. */
export function inferCategory(slug: string, title: string): FieldNoteType {
  if (/white.paper/i.test(title) || slug.startsWith("white-paper")) return "White Paper";
  if (/case study/i.test(title)) return "Case Study";
  if (GUIDE_TITLE_SIGNALS.some((re) => re.test(title))) return "Guide";
  return "Project Profile";
}

/**
 * Every HUB system a post names anywhere: title, excerpt, text, link
 * addresses and photo descriptions. This drives the "Systems in this piece"
 * rail and the schema `mentions`, so it needs to be complete: a case study
 * that names MMAX four times in its body but not in its excerpt used to link
 * to nothing.
 */
export function scanProducts(...texts: string[]): string[] {
  const haystack = texts.join(" ");
  return PRODUCT_PATTERNS.filter(([, re]) => re.test(haystack)).map(([name]) => name);
}

/** Words in plain text. */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Words in a markdown body, counted the way lib/mdx.ts counted them before the
 * move: authoring comments, image syntax and HTML tags removed, markdown marks
 * such as "##" and "|" still counted. The import uses it only to fill in the
 * read time of the two posts that didn't state one, so their cards don't change.
 */
export function countMarkdownWords(body: string): number {
  const clean = body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<[^>]+>/g, " ");
  return countWords(clean);
}

/** "5 min read", at 225 words a minute. */
export function readTimeFor(words: number): string {
  return `${Math.max(1, Math.round(words / 225))} min read`;
}

/**
 * An excerpt cut to fit a card. It ends on a full stop when a sentence ends
 * in the second half of the space; otherwise on a word, with its trailing
 * punctuation dropped before the ellipsis, so a card never shows
 * "installation.…".
 */
export function clipExcerpt(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const head = t.slice(0, max + 1);
  const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("? "), head.lastIndexOf(": "));
  if (sentenceEnd >= max * 0.55 && head[sentenceEnd] === ".") return t.slice(0, sentenceEnd + 1);
  const cut = head.lastIndexOf(" ", max);
  // Nor on a figure cut from its unit ("after a $4\u2026") or a small word that
  // leads nowhere ("that\u2026", "of the\u2026").
  const words = t.slice(0, cut > 0 ? cut : max).split(" ");
  while (words.length > 4 && (/\d/.test(words[words.length - 1]) || CLIP_STOPS.has(words[words.length - 1].toLowerCase().replace(/[^a-z]/g, "")))) {
    words.pop();
  }
  return `${words.join(" ").replace(/[\s.,;:!?\u2013\u2014-]+$/, "")}\u2026`;
}

const CLIP_STOPS = new Set([
  "a", "an", "the", "and", "or", "but", "nor", "so", "if", "of", "to", "in", "on", "at", "by", "for", "from",
  "with", "into", "up", "than", "after", "before", "while", "when", "where", "how", "what", "that", "which",
  "who", "is", "are", "was", "were", "be", "been", "has", "have", "can", "will", "it", "its", "this", "their",
  "our", "your", "as", "more", "most",
]);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * A post's date as the site prints dates: "Sep 8, 2026" (docs/STYLE.md).
 * Built by hand from the YYYY-MM-DD string rather than with toLocaleDateString:
 * the cards render in the browser too, where a Toronto clock read
 * "2026-09-08" as midnight UTC and printed Sep 7, and browsers disagree on
 * whether en-CA's short September is "Sep" or "Sept.".
 */
export function formatPostDate(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd);
  if (!m) return ymd;
  return `${MONTHS[Number(m[2]) - 1] ?? m[2]} ${Number(m[3])}, ${m[1]}`;
}

// The system a post is ABOUT, read from its title and address. Longer names
// first, so StreetBondSR is not read as StreetBond.
const NAMED_SYSTEMS: [string, RegExp][] = [
  ["TrafficPatternsXD", /trafficpatterns ?xd/i],
  ["TrafficPatterns", /trafficpatterns(?! ?xd)/i],
  ["StreetBondSR", /streetbond ?sr/i],
  ["StreetBond", /streetbond(?! ?sr)/i],
  ["StreetPrint", /streetprint/i],
  ["MMAX", /\bmmax\b/i],
  ["DecoMark", /decomark/i],
  ["DuraTherm", /duratherm/i],
  ["DuraShield", /durashield/i],
  ["PreMark", /premark/i],
  ["AirMark", /airmark/i],
];

// A subject that names one system. Used only when the post names that system
// somewhere: "stamped-asphalt-parking-lot" is a TrafficPatternsXD job.
const SUBJECT_SYSTEMS: [string, RegExp][] = [
  ["StreetPrint", /\bstamped (asphalt|blacktop)\b|\bimprinted asphalt\b/i],
  ["StreetBondSR", /\bsolar.reflective\b|\bheat island\b/i],
  ["StreetBond", /\b(splash pads?|waterparks?|playgrounds?)\b/i],
];

function earliest(text: string, table: [string, RegExp][], allowed?: string[]): string | undefined {
  let best: { name: string; at: number } | undefined;
  for (const [name, re] of table) {
    if (allowed && !allowed.includes(name)) continue;
    const m = re.exec(text);
    if (m && (!best || m.index < best.at)) best = { name, at: m.index };
  }
  return best?.name;
}

/**
 * The HUB system a post is about: a system its title names, then one its
 * address names, then the system its subject implies (stamped asphalt is
 * StreetPrint), then the first system Studio lists for it ("Systems this post
 * is about"), then the only system its text names, if it names just one. The
 * conversion block's "See <system>" and the Lunch & Learn topic both use it.
 * Until Sep 2026 it was the first system listed or named anywhere, so the
 * StreetPrint installation post said "See StreetBond" (QA rest#9), and a post
 * that names six systems in passing was "about" whichever came first.
 */
export function primarySystem(title: string, slug: string, products: string[], declared: string[] = products): string | undefined {
  const address = slug.replace(/-/g, " ");
  return (
    earliest(title, NAMED_SYSTEMS) ??
    earliest(slug, NAMED_SYSTEMS) ??
    earliest(title, SUBJECT_SYSTEMS, products) ??
    earliest(address, SUBJECT_SYSTEMS, products) ??
    declared[0] ??
    (products.length === 1 ? products[0] : undefined)
  );
}

/** Sanity's focal point: the centre (x, y) and extent of what matters, as fractions. */
export interface Hotspot {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

const unit = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The object-position that keeps a photo's hotspot in frame under
 * object-fit: cover, at any frame size (QA rest#29).
 *
 * A percentage does not centre the focal point: `object-position: 37% 45%`
 * lines up the photo's 37% point with the frame's 37% point, so a phone crop
 * still cut the G off GEARY WORKS. This centres it instead, clamped so no edge
 * of the photo comes inside the frame. With rw the photo's rendered width
 * (the larger of the frame's width and the frame's height times the photo's
 * ratio), the photo's left edge sits at
 *   clamp(frame width - rw, frame width / 2 - x * rw, 0)
 * and the same down the height. cqw and cqh are the frame's own width and
 * height, so the element that holds the photo needs `container-type: size`.
 * Without a hotspot (or its dimensions) it returns undefined and the photo
 * stays centred, as before.
 */
export function focalObjectPosition(h: Hotspot | null | undefined, width?: number | null, height?: number | null): string | undefined {
  if (!h || !width || !height || !Number.isFinite(h.x) || !Number.isFinite(h.y)) return undefined;
  const r = Number((width / height).toFixed(4));
  const fx = Number(unit(h.x).toFixed(4));
  const fy = Number(unit(h.y).toFixed(4));
  const rw = `max(100cqw, ${r} * 100cqh)`;
  const rh = `max(100cqh, 100cqw / ${r})`;
  return `clamp(100cqw - ${rw}, 50cqw - ${fx} * ${rw}, 0px) clamp(100cqh - ${rh}, 50cqh - ${fy} * ${rh}, 0px)`;
}
