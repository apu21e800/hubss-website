/**
 * Site search — the index and the scorer.
 *
 * WHAT WAS WRONG. The old search was a filter, not a search. Every candidate
 * ran through `tokens.every(t => haystack.includes(t))` and whatever survived
 * was rendered in source order. Three consequences, all of which a visitor
 * feels immediately:
 *
 *   1. NO RANKING. Typing "streetbond" put TrafficPatterns above StreetBond,
 *      because TrafficPatterns happens to be declared first in lib/products.ts
 *      and both contain the string. The single most confident thing a search
 *      can do — put the exact match first — it could not do at all.
 *   2. NO TOLERANCE. Substring matching means "crosswlak" returns nothing,
 *      "colour" and "color" are different words, and a plural can miss its
 *      singular. Municipal specifiers type fast into a box on a phone.
 *   3. A THIN INDEX. Products matched on name + shortDesc; the description,
 *      the spec values and the catalogue positioning were never searched. So
 *      "150 mil", "Mohs", "45 minute cure" and "LEED heat island" — the exact
 *      phrases an engineer arrives with — found nothing.
 *
 * WHAT THIS DOES. Builds one flat index over everything the site knows about,
 * then scores each entry per query token against weighted fields, so an exact
 * title hit beats a prefix, which beats a word-boundary hit, which beats a
 * body-text mention. Fuzzy matching is deliberately narrow: it only applies to
 * title words, only for tokens of five characters or more, and only at edit
 * distance one — enough to catch a slipped key, not enough to start inventing
 * relationships between unrelated words.
 *
 * The index is built once at module scope. It is a few hundred entries over
 * static imports, so this costs nothing at runtime and needs no network call.
 */

import { products } from "./products";
import { applications } from "./applications";
import { resourceDocuments } from "./resource-documents";
import { PATTERN_TEMPLATES } from "./pattern-templates";
import { PRODUCT_KEYWORDS, APPLICATION_KEYWORDS } from "./search-keywords";
import { PRODUCT_CATALOGUE } from "./product-catalogue";
import blogIndex from "./blog-index.json";
import { curatedType, curatedKeywords } from "./field-notes-taxonomy";

export type SearchType =
  | "Product"
  | "Application"
  | "Field note"
  | "Document"
  | "Colour"
  | "Pattern"
  | "Page";

export interface SearchEntry {
  id: string;
  type: SearchType;
  title: string;
  subtitle: string;
  href: string;
  /** Extra terms that should match but are not shown. */
  keywords: string;
  /** Everything else worth matching, at the lowest weight. */
  body: string;
  /** Nudge for entities that are destinations rather than reading material. */
  boost: number;
  /** Colour swatch, where the entry is a colourant. */
  hex?: string;
}

export interface SearchHit extends SearchEntry {
  score: number;
  /** The token that produced the strongest match, for highlighting. */
  matched: string;
}

// ── Static pages ──────────────────────────────────────────────────────────────
const PAGES: Omit<SearchEntry, "boost">[] = [
  { id: "p-products", type: "Page", title: "All systems", subtitle: "Every HUB product, grouped by family", href: "/products", keywords: "products range catalogue systems materials", body: "" },
  { id: "p-apps", type: "Page", title: "All applications", subtitle: "Where HUB systems are specified", href: "/applications", keywords: "applications uses where sectors", body: "" },
  { id: "p-gallery", type: "Page", title: "Photo archive", subtitle: "Documented installations across Canada", href: "/gallery", keywords: "gallery photos images archive installations portfolio work", body: "" },
  { id: "p-blog", type: "Page", title: "Field Notes", subtitle: "Case studies, guides, white papers and project profiles", href: "/blog", keywords: "blog articles library research writing notes", body: "" },
  { id: "p-guides", type: "Page", title: "Guides", subtitle: "How to choose, specify, and defend a surface decision", href: "/blog/guides", keywords: "guides how to specify comparison decision", body: "" },
  { id: "p-cases", type: "Page", title: "Case studies", subtitle: "Named projects with the brief and the measured outcome", href: "/blog/case-studies", keywords: "case studies projects outcomes results evidence", body: "" },
  { id: "p-white", type: "Page", title: "White papers", subtitle: "Long-form technical documents for public works teams", href: "/blog/white-papers", keywords: "white papers technical research engineering", body: "" },
  { id: "p-profiles", type: "Page", title: "Project profiles", subtitle: "Short-form records of installations across the country", href: "/blog/project-profiles", keywords: "projects profiles installations portfolio", body: "" },
  { id: "p-resources", type: "Page", title: "Specification library", subtitle: "Spec sheets, data sheets, colour cards and submittals", href: "/resources", keywords: "resources downloads documents spec sheets pdf submittal data sheet", body: "" },
  { id: "p-ll", type: "Page", title: "Lunch & Learn", subtitle: "Free spec session for engineers, planners and architects", href: "/lunch-learn", keywords: "lunch learn session training presentation cpd book booking teach", body: "" },
  { id: "p-patterns", type: "Page", title: "Pattern library", subtitle: "Stamped asphalt patterns and border templates", href: "/patterns", keywords: "patterns templates stamps brick cobblestone herringbone", body: "" },
  { id: "p-about", type: "Page", title: "About HUB", subtitle: "Thirty years of Canadian decorative pavement", href: "/about", keywords: "about company history team offices who we are", body: "" },
  { id: "p-contact", type: "Page", title: "Contact", subtitle: "Milton, Ontario and Ladysmith, British Columbia", href: "/contact", keywords: "contact email phone offices rep quote enquiry sales", body: "" },
];

// ── Index ─────────────────────────────────────────────────────────────────────
function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const p of products) {
    if (p.comingSoon) continue;
    const cat = PRODUCT_CATALOGUE[p.slug];
    out.push({
      id: `product-${p.slug}`,
      type: "Product",
      title: p.name,
      // The catalogue's positioning line, where the print book has one — it is
      // a better one-line answer to "what is this" than shortDesc.
      subtitle: cat?.title ? `${cat.title} ${cat.subhead}` : p.shortDesc,
      href: `/products/${p.slug}`,
      keywords: [
        ...(PRODUCT_KEYWORDS[p.slug] ?? []),
        ...(cat?.uses ?? []),
        ...(cat ? [cat.title, cat.subhead] : []),
      ].join(" "),
      // Spec values are what an engineer actually types: "150 mil", "60 BPN",
      // "Mohs", "+3°C". None of it was searchable before.
      body: [
        p.description,
        p.shortDesc,
        ...p.specs.map((s) => `${s.label} ${s.value}`),
        ...(cat ? [cat.description, ...cat.specs.map((s) => `${s.label} ${s.value}`)] : []),
      ].join(" "),
      boost: 30,
    });
  }

  for (const a of applications) {
    out.push({
      id: `app-${a.slug}`,
      type: "Application",
      title: a.name,
      subtitle: a.shortDesc,
      href: `/applications/${a.slug}`,
      keywords: (APPLICATION_KEYWORDS[a.slug] ?? []).join(" "),
      body: a.description,
      boost: 28,
    });
  }

  type BlogRow = { slug: string; title: string; excerpt: string };
  for (const b of blogIndex as BlogRow[]) {
    // blog-index.json carries only slug/title/excerpt, so the type and the SEO
    // keyword lane come from the curated taxonomy. Without them "case study",
    // "white paper" and "rainbow crosswalk" match nothing in the library.
    out.push({
      id: `post-${b.slug}`,
      type: "Field note",
      title: b.title,
      subtitle: b.excerpt,
      href: `/blog/${b.slug}`,
      keywords: [curatedType(b.slug) ?? "", ...curatedKeywords(b.slug)].join(" "),
      body: b.excerpt,
      boost: 0,
    });
  }

  for (const d of resourceDocuments) {
    out.push({
      id: `doc-${d.title}`,
      type: "Document",
      title: d.title,
      subtitle: `${d.productName} · ${d.type}`,
      href: "/resources",
      keywords: `${d.productName} ${d.type} pdf download spec sheet submittal`,
      body: "",
      boost: 8,
    });
  }

  for (const t of PATTERN_TEMPLATES) {
    out.push({
      id: `pattern-${t.name}`,
      type: "Pattern",
      title: t.name,
      subtitle: t.note,
      href: "/patterns",
      keywords: "pattern template stamp streetprint stamped asphalt border",
      body: "",
      boost: 4,
    });
  }

  for (const p of PAGES) out.push({ ...p, boost: 40 });

  return out;
}

let INDEX: SearchEntry[] | null = null;
function index(): SearchEntry[] {
  if (!INDEX) INDEX = buildIndex();
  return INDEX;
}

/** Colour entries are supplied by the caller — the colour data is client-side. */
export function withColours(
  colours: { name: string; hex: string; product: string; href: string }[]
): SearchEntry[] {
  return [
    ...index(),
    ...colours.map((c) => ({
      id: `colour-${c.name}`,
      type: "Colour" as const,
      title: c.name,
      subtitle: `${c.product} colourant`,
      href: c.href,
      keywords: "colour color swatch palette pantone chip shade",
      body: "",
      boost: 2,
      hex: c.hex,
    })),
  ];
}

// ── Scoring ───────────────────────────────────────────────────────────────────

const norm = (s: string) =>
  s.toLowerCase().replace(/[‐-―]/g, "-").replace(/[^a-z0-9+.\-\s]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Damerau-Levenshtein, bailing out as soon as it exceeds `max`.
 *
 * Damerau rather than plain Levenshtein because the overwhelmingly common
 * typing error is a transposition — "crosswlak" for "crosswalk" — and plain
 * Levenshtein charges two edits for it, which puts it out of reach of any
 * threshold tight enough to be safe.
 */
function within(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  const rows: number[][] = [Array.from({ length: b.length + 1 }, (_, i) => i)];
  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(rows[i - 1][j] + 1, cur[j - 1] + 1, rows[i - 1][j - 1] + cost);
      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, rows[i - 2][j - 2] + 1);
      }
      cur[j] = v;
      if (v < best) best = v;
    }
    if (best > max) return false;
    rows.push(cur);
  }
  return rows[a.length][b.length] <= max;
}

/** How wrong a token is allowed to be before we stop guessing. */
const slack = (t: string) => (t.length >= 8 ? 2 : t.length >= 5 ? 1 : 0);

/**
 * Score one token against one entry. Highest-value evidence wins outright
 * rather than accumulating, so a title hit is never out-voted by a body that
 * happens to repeat the word five times.
 */
function scoreToken(token: string, e: SearchEntry): number {
  const title = norm(e.title);
  const sub = norm(e.subtitle);
  const kw = norm(e.keywords);
  const body = norm(e.body);
  const words = title.split(" ");

  if (title === token) return 1000;
  if (title.startsWith(token)) return 620;
  if (words.some((w) => w === token)) return 480;
  if (words.some((w) => w.startsWith(token))) return 360;
  if (title.includes(token)) return 260;

  // Typo tolerance, title only. Narrow on purpose: a slipped key, not a guess.
  const s = slack(token);
  if (s > 0 && words.some((w) => w.length >= 4 && within(w, token, s))) return 210;

  if (kw.split(" ").some((w) => w === token)) return 190;
  if (kw.includes(token)) return 150;
  // Domain vocabulary lives in the keyword lane, not in titles — "thermoplastic",
  // "retroreflective", "methacrylate". Those are exactly the words a visitor
  // mistypes, so the fuzzy pass has to reach them too.
  if (s > 0 && kw.split(" ").some((w) => w.length >= 5 && within(w, token, s))) return 130;
  if (sub.split(" ").some((w) => w === token)) return 120;
  if (sub.includes(token)) return 90;
  if (body.includes(token)) return 55;

  // Singular/plural, cheaply. "crosswalks" should find "crosswalk".
  const stem = token.endsWith("s") ? token.slice(0, -1) : token + "s";
  if (stem.length > 3) {
    if (words.some((w) => w === stem)) return 300;
    if (title.includes(stem)) return 180;
    if (kw.includes(stem)) return 120;
    if (body.includes(stem)) return 40;
  }
  return 0;
}

export function search(query: string, entries: SearchEntry[], limit = 120): SearchHit[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const tokens = q.split(" ").filter(Boolean);

  const hits: SearchHit[] = [];
  for (const e of entries) {
    let total = 0;
    let best = 0;
    let matched = tokens[0];
    let missed = false;
    for (const t of tokens) {
      const s = scoreToken(t, e);
      if (s === 0) { missed = true; break; }   // every token must land somewhere
      total += s;
      if (s > best) { best = s; matched = t; }
    }
    if (missed) continue;

    // The whole phrase appearing intact is the strongest signal there is.
    if (tokens.length > 1 && norm(`${e.title} ${e.subtitle} ${e.keywords}`).includes(q)) total += 400;

    hits.push({ ...e, score: total / tokens.length + e.boost, matched });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.title.length - b.title.length)
    .slice(0, limit);
}

const ORDER: SearchType[] = ["Product", "Application", "Page", "Field note", "Document", "Pattern", "Colour"];

/**
 * Per-type caps.
 *
 * Without these a broad query drowns the palette. "crosswalk" scores 22 field
 * notes above every product except one, so the panel showed a single system and
 * a wall of articles — when the four systems that actually build a crosswalk
 * are the most useful thing on the screen. Capping per type guarantees each
 * kind of answer a seat before depth in any one of them.
 */
const CAP: Record<SearchType, number> = {
  Product: 5,
  Application: 5,
  Page: 3,
  "Field note": 8,
  Document: 4,
  Pattern: 3,
  Colour: 4,
};

/** Group ranked hits by type, preserving global rank inside each group. */
export function groupHits(hits: SearchHit[]): { type: SearchType; hits: SearchHit[] }[] {
  const map = new Map<SearchType, SearchHit[]>();
  for (const h of hits) {
    if (!map.has(h.type)) map.set(h.type, []);
    map.get(h.type)!.push(h);
  }
  return ORDER.filter((t) => map.has(t)).map((t) => ({ type: t, hits: map.get(t)!.slice(0, CAP[t]) }));
}
