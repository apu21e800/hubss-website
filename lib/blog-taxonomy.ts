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
