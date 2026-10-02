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
 *
 * SEPT 2026 — four things this still got wrong.
 *
 *   PLACES WERE NOT IN IT. "Oakville" returned nothing. So did "Saskatoon",
 *   "New Westminster" and "British Columbia", on a site whose central claim is
 *   fifty-nine installations across ten provinces. The work was pinned on the
 *   map and unreachable from the search box. All fifty-nine are entries now,
 *   searchable by project, by city, by province code and by province name.
 *
 *   ACCENTS BROKE NAMES. The normaliser deleted any character outside
 *   [a-z0-9+.-], so "Montréal" became "montr al". Nobody could find the three
 *   Montréal installations by typing either spelling.
 *
 *   DOCUMENTS POINTED AT THE LIBRARY, NOT THE DOCUMENT. Every one of the
 *   eighty-two spec sheets linked to /resources: search found you the right
 *   sheet and then made you find it again. fileUrl was on the record all along.
 *
 *   A MATCH COULD NOT EXPLAIN ITSELF. Scoring knew which lane a token landed
 *   in and threw it away, so a row that matched on a hidden keyword rendered
 *   with nothing marked and looked like a bug. The lane is returned now.
 */

import { products } from "./products";
import { applications } from "./applications";
import { resourceDocuments } from "./resource-documents";
import { catalogue, ideaBook } from "./catalogue";
import { PATTERN_TEMPLATES, patternSrc } from "./pattern-templates";
import { PRODUCT_KEYWORDS, APPLICATION_KEYWORDS } from "./search-keywords";
import { PRODUCT_CATALOGUE } from "./product-catalogue";
import { mapProjects } from "./map-projects";
import blogIndex from "./blog-index.json";
import { ARCHIVED_POSTS, SECTION_BY_KEY, isArchivedPost, sectionFor } from "./field-notes-taxonomy";

export type SearchType =
  | "Product"
  | "Application"
  | "Project"
  | "Insight"
  | "Document"
  | "Colour"
  | "Pattern"
  | "Page";

/** Which lane a token landed in. Decides whether the match is visible in the row. */
export type MatchLane = "title" | "subtitle" | "keywords" | "body";

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
  /**
   * Short tag for the row's trailing slot — "PDF" on a document, a province on
   * a project. Says what pressing Enter will actually do, which matters most
   * where it leaves the page flow entirely.
   */
  badge?: string;
  /** True when the href is a file rather than a route, so the click is a download. */
  isFile?: boolean;
  /**
   * The baked square thumbnail, as a base path: `${thumb}-128.webp` and
   * `${thumb}-256.webp` (thumbBase below). Absent where there is no picture
   * to show; the row then shows the wheel tile.
   */
  thumb?: string;
}

// ── Thumbnails ────────────────────────────────────────────────────────────────
/**
 * 2 Oct 2026, Vern: "search function is a bit dull too, could add image
 * thumbnails or something?!"
 *
 * Every row with a picture gets a square thumbnail that
 * scripts/gen-search-images.ts bakes at build into
 * /images/search/thumbs/<kind>/<id>-<size>.webp: the product card photo, the
 * application hero, the post's featured image, the project's first photo, a
 * spec sheet's first page, the stamping template. Not /_next/image (the
 * optimisation allowance ran out in Aug 2026) and nothing from Sanity while
 * someone types: post and project photos are fetched once, at build.
 *
 * The path is worked out, not looked up. The index below says which entries
 * have a picture and the generator bakes exactly those (it imports this
 * function), so the palette carries no manifest in its bundle. A file that is
 * missing anyway (a photo that would not decode, a dev server that never ran
 * the generator) fails to load and its row keeps the wheel tile.
 */
export const THUMB_ROOT = "/images/search/thumbs";
/** 128 covers a 56px row at 2x; 256 covers the start grid's ~100px tiles at 2x. */
export const THUMB_SIZES = [128, 256] as const;
export type ThumbKind = "product" | "application" | "post" | "project" | "document" | "pattern" | "page";

/** A file-safe name: "/docs/StreetBond/StreetBond%20Pro%20220%20%5BMMA%5D/x.pdf" -> "streetbond-streetbond-pro-220-mma-x". */
function thumbName(id: string): string {
  let s = id;
  try {
    s = decodeURIComponent(id);
  } catch {
    // a stray % in a name; use it as written
  }
  return s
    .replace(/^\/(docs|resources)\//, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function thumbBase(kind: ThumbKind, id: string): string {
  return `${THUMB_ROOT}/${kind}/${thumbName(id)}`;
}

/** The smaller copy, for `src`. */
export const thumbSrc = (base: string) => `${base}-${THUMB_SIZES[0]}.webp`;
/** Both copies, for `srcSet`. */
export const thumbSrcSet = (base: string) => THUMB_SIZES.map((w) => `${base}-${w}.webp ${w}w`).join(", ");

/**
 * A spec sheet has a picture when scripts/gen-pdf-previews.py rendered its
 * first page, and that script walks /public/docs. The flyers in
 * /public/resources have no rendered page, so they keep the wheel.
 */
export const documentHasThumb = (fileUrl: string) => fileUrl.startsWith("/docs/") && /\.pdf($|\?)/i.test(fileUrl);

/**
 * The two static pages with a picture that is unmistakably theirs: the Idea
 * Book's cover and a stamping template. "All systems", "Contact" and the rest
 * are sections of the site, and the HUB wheel is the honest picture for them.
 */
export const PAGE_THUMBS: Record<string, { src: string; treat: "photo" | "pattern" }> = {
  ...(catalogue.dir ? { "p-idea-book": { src: `${catalogue.dir}/p001-800.webp`, treat: "photo" as const } } : {}),
  "p-patterns": { src: patternSrc(PATTERN_TEMPLATES[0]), treat: "pattern" },
};

export interface SearchHit extends SearchEntry {
  score: number;
  /** The token that produced the strongest match, for highlighting. */
  matched: string;
  /**
   * Where that token landed. A hit in `keywords` or `body` is invisible in the
   * rendered row — the reason "Townhomes" answers "streetbond" is real, but it
   * is in a lane the visitor cannot see, so the row has to say so itself.
   */
  where: MatchLane;
}

/**
 * Province codes spelled out, for the keyword lane only.
 *
 * The dataset stores "BC". A visitor types "British Columbia", or "Ontario",
 * or "Quebec" without the accent. All three should find the eleven projects
 * out west, and none of them did.
 */
const PROVINCE_NAMES: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  ON: "Ontario",
  PE: "Prince Edward Island PEI",
  QC: "Quebec Québec",
  SK: "Saskatchewan",
};

// ── Static pages ──────────────────────────────────────────────────────────────
const PAGES: Omit<SearchEntry, "boost">[] = [
  { id: "p-products", type: "Page", title: "All systems", subtitle: "Every HUB product, grouped by family", href: "/products", keywords: "products range catalogue systems materials", body: "" },
  // The book, by the name Doug gave it. "catalogue" stays in the keywords so
  // anyone who knew it by the old name still lands on it.
  { id: "p-idea-book", type: "Page", title: ideaBook.title, subtitle: "Every system and application, read in your browser", href: ideaBook.href, keywords: "idea book catalogue brochure volume 5 book read flipbook printed copy", body: "" },
  { id: "p-apps", type: "Page", title: "All applications", subtitle: "Where HUB systems are specified", href: "/applications", keywords: "applications uses where sectors", body: "" },
  { id: "p-gallery", type: "Page", title: "Photo archive", subtitle: "Documented installations across Canada", href: "/gallery", keywords: "gallery photos images archive installations portfolio work", body: "" },
  // Insights and its three sections (28 Sep 2026: five types became Projects,
  // Guides and Articles, lib/field-notes-taxonomy.ts). The old type names stay
  // in the keywords, so "case study" or "white paper" still lands somewhere.
  { id: "p-blog", type: "Page", title: "Insights", subtitle: "Projects, guides and articles on Canadian pavement", href: "/blog", keywords: "blog articles posts library research writing notes field notes insights", body: "" },
  { id: "p-projects", type: "Page", title: "Projects", subtitle: SECTION_BY_KEY.projects.blurb, href: `/blog/${SECTION_BY_KEY.projects.slug}`, keywords: "projects case studies case study project profiles installations portfolio outcomes evidence", body: "" },
  { id: "p-guides", type: "Page", title: "Guides", subtitle: SECTION_BY_KEY.guides.blurb, href: `/blog/${SECTION_BY_KEY.guides.slug}`, keywords: "guides how to specify comparison decision white papers white paper technical research engineering", body: "" },
  { id: "p-articles", type: "Page", title: "Articles", subtitle: SECTION_BY_KEY.articles.blurb, href: `/blog/${SECTION_BY_KEY.articles.slug}`, keywords: "articles industry notes news blog", body: "" },
  { id: "p-resources", type: "Page", title: "Specification library", subtitle: "Spec sheets, data sheets, colour cards and submittals", href: "/resources", keywords: "resources downloads documents spec sheets pdf submittal data sheet", body: "" },
  { id: "p-ll", type: "Page", title: "Lunch & Learn", subtitle: "Free spec session for engineers, planners and architects", href: "/lunch-learn", keywords: "lunch learn session training presentation cpd book booking teach", body: "" },
  { id: "p-patterns", type: "Page", title: "Pattern library", subtitle: "Stamped asphalt patterns and border templates", href: "/patterns", keywords: "patterns templates stamps brick cobblestone herringbone", body: "" },
  { id: "p-about", type: "Page", title: "About HUB", subtitle: "Canadian decorative pavement since 1999", href: "/about", keywords: "about company history team offices who we are", body: "" },
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
      // The /products card photo (lib/product-card-images.mjs), cropped square.
      thumb: thumbBase("product", p.slug),
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
      // The photo the /applications card falls back to (lib/featured-images.ts).
      thumb: thumbBase("application", a.slug),
    });
  }

  type BlogRow = { slug: string; title: string; excerpt: string; type: string; keywords: string[] };
  for (const b of blogIndex as BlogRow[]) {
    // An archived post (lib/field-notes-taxonomy.ts) redirects to its
    // replacement and is offered nowhere, search included.
    if (isArchivedPost(b.slug)) continue;
    // The type and the search phrases come with each post from Sanity
    // (scripts/gen-blog-index.ts). Without them "case study", "white paper"
    // and "rainbow crosswalk" match nothing in the library. The section's
    // label ("Project") goes in beside the stored type.
    out.push({
      id: `post-${b.slug}`,
      type: "Insight",
      title: b.title,
      subtitle: b.excerpt,
      href: `/blog/${b.slug}`,
      keywords: [b.type, sectionFor(b.type).singular, ...b.keywords].join(" "),
      body: b.excerpt,
      boost: 0,
      // The featured image from Sanity, baked at build. Every live post had
      // one on 2 Oct 2026; a post without one would show the wheel.
      thumb: thumbBase("post", b.slug),
    });
  }

  // Every documented installation. Before this, a place query — "Oakville",
  // "Saskatoon", "New Westminster" — returned nothing at all, on a site whose
  // central claim is fifty-nine installations across ten provinces. The work
  // was on the map and nowhere a search box could reach it.
  //
  // Product and application go in the BODY lane, not keywords, on purpose: a
  // project should be unmissable when you search for the place or the job, and
  // should sit quietly below the systems when you search for a material.
  for (const p of mapProjects) {
    out.push({
      id: `project-${p.id}`,
      type: "Project",
      title: p.title,
      subtitle: `${p.city}, ${p.province}${p.year ? ` · ${p.year}` : ""} · ${p.product}`,
      // A project with a write-up goes to the write-up. The rest go to the map,
      // which is where they are actually documented — inventing a page for them
      // would be worse than sending someone to the thing that exists.
      href: p.slug ? `/blog/${isArchivedPost(p.slug) ? ARCHIVED_POSTS[p.slug] : p.slug}` : "/#map",
      keywords: `${p.city} ${p.province} ${PROVINCE_NAMES[p.province] ?? ""} installation project reference`,
      body: `${p.excerpt} ${p.product} ${p.application}`,
      boost: 20,
      badge: p.province,
      // The pin's first photo, which is of this job (lib/map-projects.ts).
      thumb: p.images.length ? thumbBase("project", p.id) : undefined,
    });
  }

  for (const d of resourceDocuments) {
    // The href was /resources for every document — search found the right
    // sheet, then dropped you on a library of eighty-two to find it again.
    // fileUrl has been on the record all along.
    // The Idea Book has its own Page entry above; listing its document row
    // too would show the same book twice for "idea book".
    if (d.documentType === "catalogue") continue;
    const isPdf = /\.pdf($|\?)/i.test(d.fileUrl);
    out.push({
      id: `doc-${d.title}`,
      type: "Document",
      title: d.title,
      subtitle: `${d.productName} · ${d.type}`,
      href: d.fileUrl,
      keywords: `${d.productName} ${d.type} pdf download spec sheet submittal`,
      body: "",
      boost: 8,
      badge: isPdf ? "PDF" : undefined,
      isFile: isPdf,
      // The sheet's own first page (lib/pdf-previews.json).
      thumb: documentHasThumb(d.fileUrl) ? thumbBase("document", d.fileUrl) : undefined,
    });
  }

  for (const t of PATTERN_TEMPLATES) {
    out.push({
      id: `pattern-${t.name}`,
      type: "Pattern",
      title: t.name,
      subtitle: t.note,
      // /patterns renders id={t.slug} on every template, so the anchor lands on
      // the pattern rather than the top of a page of sixty.
      href: `/patterns#${t.slug}`,
      keywords: "pattern template stamp streetprint stamped asphalt border",
      body: "",
      boost: 4,
      thumb: thumbBase("pattern", t.slug),
    });
  }

  for (const p of PAGES) out.push({ ...p, boost: 40, thumb: PAGE_THUMBS[p.id] ? thumbBase("page", p.id) : undefined });

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
  const all: SearchEntry[] = [
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
  // Normalise now, while the palette opens, so the first keystroke that
  // searches is not the one that pays for it (see Normed below).
  for (const e of all) normed(e);
  return all;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

/**
 * Accents are folded before anything else. The old normaliser lowercased and
 * then deleted every character outside [a-z0-9+.-], which turned "Montréal"
 * into "montr al" and "Québec City" into "qu bec city" — so the three Montréal
 * installations and the Québec City one could not be found by anybody typing
 * the name the ordinary way, with or without the accent. Decomposing first and
 * dropping the combining marks makes both spellings the same string.
 */
const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[‐-―]/g, "-")
    .replace(/[^a-z0-9+.\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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
interface TokenMatch {
  s: number;
  lane: MatchLane;
}
const NONE: TokenMatch = { s: 0, lane: "body" };

/**
 * Each entry's fields, normalised once (2 Oct 2026).
 *
 * scoreToken used to run norm() over the title, subtitle, keywords and body of
 * every entry, for every token, on every keystroke: 395 entries, a product's
 * body a few kilobytes of description and specs. Nothing about an entry
 * changes after the palette builds its index, so the work is now done once and
 * kept. The thumbnails that answer Vern's "search function is a bit dull too"
 * add pictures to every row; this pays for them, so typing is no slower.
 */
interface Normed {
  title: string;
  words: string[];
  sub: string;
  subWords: string[];
  kw: string;
  kwWords: string[];
  body: string;
  /** Title, subtitle and keywords together, for the whole-phrase bonus. */
  phrase: string;
}
const NORMED = new WeakMap<SearchEntry, Normed>();
function normed(e: SearchEntry): Normed {
  let n = NORMED.get(e);
  if (!n) {
    const title = norm(e.title);
    const sub = norm(e.subtitle);
    const kw = norm(e.keywords);
    n = {
      title,
      words: title.split(" "),
      sub,
      subWords: sub.split(" "),
      kw,
      kwWords: kw.split(" "),
      body: norm(e.body),
      phrase: norm(`${e.title} ${e.subtitle} ${e.keywords}`),
    };
    NORMED.set(e, n);
  }
  return n;
}

function scoreToken(token: string, e: SearchEntry): TokenMatch {
  const { title, words, sub, subWords, kw, kwWords, body } = normed(e);

  if (title === token) return { s: 1000, lane: "title" };
  if (title.startsWith(token)) return { s: 620, lane: "title" };
  if (words.some((w) => w === token)) return { s: 480, lane: "title" };
  if (words.some((w) => w.startsWith(token))) return { s: 360, lane: "title" };
  if (title.includes(token)) return { s: 260, lane: "title" };

  // Typo tolerance, title only. Narrow on purpose: a slipped key, not a guess.
  const s = slack(token);
  if (s > 0 && words.some((w) => w.length >= 4 && within(w, token, s))) return { s: 210, lane: "title" };

  if (kwWords.some((w) => w === token)) return { s: 190, lane: "keywords" };
  if (kw.includes(token)) return { s: 150, lane: "keywords" };
  // Domain vocabulary lives in the keyword lane, not in titles — "thermoplastic",
  // "retroreflective", "methacrylate". Those are exactly the words a visitor
  // mistypes, so the fuzzy pass has to reach them too.
  if (s > 0 && kwWords.some((w) => w.length >= 5 && within(w, token, s))) return { s: 130, lane: "keywords" };
  if (subWords.some((w) => w === token)) return { s: 120, lane: "subtitle" };
  if (sub.includes(token)) return { s: 90, lane: "subtitle" };
  if (body.includes(token)) return { s: 55, lane: "body" };

  // Singular/plural, cheaply. "crosswalks" should find "crosswalk".
  const stem = token.endsWith("s") ? token.slice(0, -1) : token + "s";
  if (stem.length > 3) {
    if (words.some((w) => w === stem)) return { s: 300, lane: "title" };
    if (title.includes(stem)) return { s: 180, lane: "title" };
    if (kw.includes(stem)) return { s: 120, lane: "keywords" };
    if (body.includes(stem)) return { s: 40, lane: "body" };
  }
  return NONE;
}

/**
 * `limit` bounds the sorted array, not the panel — groupHits() does the
 * capping, and it can render at most thirty-eight rows however many hits it is
 * handed. It has to sit well above that, because the slice happens BEFORE the
 * grouping and takes the tail off the whole result set at once.
 *
 * At 120 it silently started doing exactly that. Adding fifty-nine
 * installations pushed "streetbond" past the ceiling — every StreetBond
 * project matched its own subtitle at 140 and every StreetBond colourant at
 * 122, and the five applications that matched in body text at 83 fell off the
 * end. The panel lost its APPLICATION group entirely: no error, no empty
 * state, just five correct answers that stopped appearing. 400 leaves room for
 * the index to grow again without the same quiet failure.
 */
export function search(query: string, entries: SearchEntry[], limit = 400): SearchHit[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const tokens = q.split(" ").filter(Boolean);

  const hits: SearchHit[] = [];
  for (const e of entries) {
    let total = 0;
    let best = 0;
    let matched = tokens[0];
    let where: MatchLane = "body";
    let missed = false;
    for (const t of tokens) {
      const m = scoreToken(t, e);
      if (m.s === 0) { missed = true; break; }   // every token must land somewhere
      total += m.s;
      if (m.s > best) { best = m.s; matched = t; where = m.lane; }
    }
    if (missed) continue;

    // The whole phrase appearing intact is the strongest signal there is.
    if (tokens.length > 1 && normed(e).phrase.includes(q)) total += 400;

    hits.push({ ...e, score: total / tokens.length + e.boost, matched, where });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.title.length - b.title.length)
    .slice(0, limit);
}

const ORDER: SearchType[] = ["Product", "Application", "Project", "Page", "Insight", "Document", "Pattern", "Colour"];

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
  Project: 5,
  Page: 3,
  Insight: 8,
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
