/**
 * The one rule for Sanity copy over code copy.
 *
 * Every page that shows Sanity text merges it through these helpers:
 * lib/products.server.ts (the homepage grid and /products/[slug]) and
 * lib/applications.server.ts (the homepage, /applications and
 * /applications/[slug]).
 *
 * The rule: Sanity wins only when it holds real content. A missing field,
 * null, an empty string, whitespace or an empty list all fall back to the code
 * value in lib/*.ts. That is `||`, not `??`, on purpose: with `??` a field
 * cleared in Studio rendered as a blank line on the live page.
 *
 * The code is the baseline and the fallback. Sanity can change the text of an
 * entry the code already has; it cannot add, remove or rename an entry.
 *
 * /products (the index) is code-only by design and reads no Sanity at all;
 * see the comment at the top of app/products/page.tsx.
 */

/** Sanity's text when it has any, else the code's. Sanity's text is trimmed. */
export function cmsText(sanity: string | null | undefined, code: string): string;
export function cmsText(sanity: string | null | undefined, code: string | undefined): string | undefined;
export function cmsText(sanity: string | null | undefined, code: string | undefined): string | undefined {
  const value = typeof sanity === "string" ? sanity.trim() : "";
  return value || code;
}

/** Sanity's list when it has at least one entry, else the code's. */
export function cmsList<T>(sanity: T[] | null | undefined, code: T[]): T[] {
  return Array.isArray(sanity) && sanity.length > 0 ? sanity : code;
}
