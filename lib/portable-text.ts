import type { SanityBlock } from "@/types/sanity";

/**
 * Flatten Sanity portable text blocks to a plain string.
 * Joins spans within a block with no separator, and joins blocks with two newlines.
 * Returns "" for empty/null/undefined input.
 *
 * Used to render Sanity-authored description fields back into the existing
 * plain-string render path so that wiring Sanity-first does not alter the
 * rendered HTML structure.
 */
export function blocksToPlainText(blocks: SanityBlock[] | undefined | null): string {
  if (!blocks?.length) return "";
  return blocks
    .map((b) => (b.children ?? []).map((c) => c.text).join(""))
    .filter((s) => s.length > 0)
    .join("\n\n");
}
