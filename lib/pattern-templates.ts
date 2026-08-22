/**
 * StreetPrint stamping template library — the real dimensioned CAD sheets,
 * processed white-on-transparent for dark UI. Source of truth: Catalogue 2027
 * Figma file, pages p21–p24 (Templates — Field 01–03 + Borders).
 *
 * Files live in /public/images/patterns/<slug>.png (1600px wide, alpha).
 * To add a template: drop the processed sheet in that folder and add a row here.
 */

export interface PatternTemplate {
  slug: string;
  name: string;
  group: "field" | "border";
  note: string;
}

export const PATTERN_TEMPLATES: PatternTemplate[] = [
  // ── Field templates ──────────────────────────────────────────────
  { slug: "herringbone", name: "Standard Herringbone", group: "field", note: "The classic interlock — strongest visual texture per pass" },
  { slug: "diagonal-herringbone", name: "Diagonal Herringbone", group: "field", note: "45° set — dynamic movement across the surface" },
  { slug: "herringbone-stacked-border", name: "Herringbone + Stacked Border", group: "field", note: "Standard field with a stacked-brick frame" },
  { slug: "herringbone-tile-border", name: "Herringbone + Tile Border", group: "field", note: "Standard field with a square-tile frame" },
  { slug: "diagonal-herringbone-tile-border", name: "Diagonal Herringbone + Tile Border", group: "field", note: "Diagonal field, framed" },
  { slug: "offset-brick-vertical", name: "Offset Brick", group: "field", note: "Running bond — the street-brick standard" },
  { slug: "offset-brick-border", name: "Offset Brick + Border", group: "field", note: "Running bond with a soldier-course frame" },
  { slug: "ashlar-slate", name: "Ashlar Slate", group: "field", note: "Mixed-size cut stone — natural randomness" },
  { slug: "british-cobble", name: "British Cobble", group: "field", note: "Tight sett-stone texture" },
  { slug: "tiles-6in", name: "6″ Tiles", group: "field", note: "Fine square grid" },
  { slug: "tiles-8in", name: "8″ Tiles", group: "field", note: "Standard square grid" },
  { slug: "offset-tile-8in", name: "8″ Offset Tile", group: "field", note: "Square tile, running-bond offset" },
  // ── Border templates ─────────────────────────────────────────────
  { slug: "double-tile-border", name: "Double Tile Border", group: "border", note: "Two-course tile edging" },
  { slug: "flexible-tile-border", name: "Flexible Tile Border", group: "border", note: "Tile edging that follows curves" },
  { slug: "stacked-brick-border", name: "Stacked Brick Border", group: "border", note: "Soldier-course brick edging" },
  { slug: "flexible-stacked-brick-border", name: "Flexible Stacked Brick Border", group: "border", note: "Brick edging that follows curves" },
];

export const patternSrc = (t: PatternTemplate) => `/images/patterns/${t.slug}.png`;
export const fieldTemplates = PATTERN_TEMPLATES.filter((t) => t.group === "field");
export const borderTemplates = PATTERN_TEMPLATES.filter((t) => t.group === "border");
