/**
 * Systems kept out of the blog and social mix for now.
 *
 * Doug, 13 Nov 2026, replying to the review email that listed two repair
 * articles: "Please leave the repair materials out of the mix for now." So
 * until he says otherwise nothing new is written or posted about the Asphalt
 * & Concrete Repair family:
 *  - the planner proposes no article about it (lib/insights-planner.ts: the
 *    model is told, and vetIdeas drops one that slips through);
 *  - the drafter passes over a plan item about it (lib/field-note-pipeline.ts:
 *    the pick and the count of what is left), unless a person asks for that
 *    item by its id;
 *  - the weekly library post skips its pages and any job done with it
 *    (lib/social-library.ts).
 * What this does not touch: the product pages, the flyers, the menus and the
 * specification library (what HUB sells is unchanged), an article a person
 * publishes in the Studio, and a job photos post (Doug's own choice).
 *
 * To lift it: empty HELD_SYSTEMS and take the rule out of CLAUDE.md
 * ("Repair materials are out of the mix"). No imports: the planner, the
 * pipeline and the tests all read it.
 */

/** Product slugs, as lib/products.ts has them. */
export const HELD_SYSTEMS: readonly string[] = ["chipfill", "aggrefill", "fast-patch"];

/** Said to the model and printed where an idea is dropped. */
export const HELD_RULE =
  "Nothing about asphalt or concrete repair for now (ChipFill, AggreFill, Fast Patch DPR; cracks, joints, potholes, patching, cold patch): HUB has asked to leave the repair materials out of the mix.";

/** True for a held system's slug, with or without Sanity's "product-" prefix. */
export function isHeldSystem(slug: string | null | undefined): boolean {
  return !!slug && HELD_SYSTEMS.includes(slug.trim().toLowerCase().replace(/^product-/, ""));
}

/** True when any of the slugs is a held system's. */
export function touchesHeld(slugs: Iterable<string | null | undefined>): boolean {
  for (const s of slugs) if (isHeldSystem(s)) return true;
  return false;
}

/**
 * The subject, where no system is named: a title or a search phrase about the
 * repair family's work. Narrow on purpose. "Repair" alone is not in it: a
 * crosswalk can be repaired, and upkeep is every system's subject.
 */
const HELD_WORDS =
  /\b(chip\s?fill|aggre\s?fill|fast\s?patch|pot[- ]?holes?|crack[- ]?(fill\w*|seal\w*|repairs?)|cracks? and joints?|cold[- ]patch\w*|hot[- ]mix patch\w*|(asphalt|concrete|pavement) (patch\w*|repairs?|repair (material|product)s?)|patching|repair (material|product)s?)\b/i;

/** True when the words are about the held family's work. */
export function aboutHeld(...words: (string | null | undefined)[]): boolean {
  return words.some((w) => !!w && HELD_WORDS.test(w));
}

/** Sanity's ids for the held systems' documents: what a plan item's `systems` refer to. */
export const HELD_REFS: readonly string[] = HELD_SYSTEMS.map((s) => `product-${s}`);

/**
 * The GROQ condition that keeps a held plan item out of a query, with
 * `$held` set to HELD_REFS. A plan item is held when one of its systems is.
 */
export const NOT_HELD_GROQ = "coalesce(count((systems[]._ref)[@ in $held]), 0) == 0";
