/**
 * The facts the AI drafter may state about HUB, and nothing else.
 *
 * Everything here is copy HUB has already approved: the 2026-27 print
 * catalogue (lib/product-catalogue.ts, lib/application-catalogue.ts, which Doug
 * signed off), the product and application pages written from it, the company
 * lines the site already prints, and the published Field Notes. The drafter is
 * told to state nothing about HUB, its systems, numbers, places or clients that
 * isn't in this block or in the editor's brief; the fact check then compares
 * the draft with the same block (lib/field-note-drafter.ts).
 */

import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { PRODUCT_CATALOGUE, SYSTEMS_INDEX } from "@/lib/product-catalogue";
import { APPLICATION_CATALOGUE } from "@/lib/application-catalogue";
import type { PostMeta } from "@/lib/blog";

const SITE = "https://hubss.com";

/**
 * About the company, in the words the site and the catalogue already use
 * (CLAUDE.md, "Client"). "Over 30 years" is true of StreetPrint, never of HUB.
 */
export const COMPANY_FACTS = [
  "HUB Surface Systems is a Canadian leader in decorative and functional pavement solutions: stamped asphalt, preformed thermoplastics and specialty coatings, for municipalities, developers and contractors across Canada.",
  "Canadian-owned since 1999. The 2027 catalogue: 27 years, 1,000+ projects, coast to coast.",
  "StreetPrint, HUB's stamped asphalt system, is a Canadian invention installed since 1992. (Over 30 years is true of StreetPrint, never of the company.)",
  "Two regional offices: Milton, Ontario (East) and Ladysmith, British Columbia (West).",
  `Spec sheets and product documents are on ${SITE}/resources. HUB runs Lunch & Learn sessions for design teams: ${SITE}/lunch-learn. Enquiries: ${SITE}/contact.`,
];

/** Plain text of a description that may carry light markdown. */
const plain = (s: string | undefined) => (s ?? "").replace(/[*_#>`]/g, "").replace(/\s+/g, " ").trim();

export function productFacts(slug: string): string | null {
  const p = products.find((x) => x.slug === slug);
  if (!p) return null;
  const c = PRODUCT_CATALOGUE[slug];
  const lines = [`### ${p.name} (page: ${SITE}/products/${slug})`];
  if (SYSTEMS_INDEX[slug]) lines.push(`Catalogue index line: ${SYSTEMS_INDEX[slug]}`);
  if (c) {
    lines.push(`Catalogue, page ${c.page}: "${c.title}" ${c.subhead} ${c.description}`);
    lines.push(`Catalogue specs: ${c.specs.map((s) => `${s.label}: ${s.value}`).join("; ")}`);
    lines.push(`Where it goes (catalogue): ${c.uses.join(", ")}`);
    if (c.alsoNeed) lines.push(`${c.alsoNeed.heading}: ${c.alsoNeed.items.join(", ")}`);
  }
  lines.push(`Website summary: ${plain(p.shortDesc)}`);
  if (p.description) lines.push(`Website description: ${plain(p.description).slice(0, 1200)}`);
  if (p.specs?.length) lines.push(`Website specs: ${p.specs.map((s) => `${s.label}: ${s.value}`).join("; ")}`);
  return lines.join("\n");
}

export function applicationFacts(slug: string): string | null {
  const a = applications.find((x) => x.slug === slug);
  if (!a) return null;
  const c = APPLICATION_CATALOGUE[slug];
  const lines = [`### ${a.name} (page: ${SITE}/applications/${slug})`];
  if (c) {
    lines.push(`Catalogue, page ${c.page}: "${c.title}" ${c.statement} ${c.body}`);
    if (c.specify.length) {
      const names = (s: string) => products.find((p) => p.slug === s)?.name ?? s;
      lines.push(`Catalogue "Specify": ${c.specify.map((s) => `${names(s.slug)}: ${s.note}`).join("; ")}`);
    }
  }
  lines.push(`Website summary: ${plain(a.shortDesc)}`);
  if (a.description) lines.push(`Website description: ${plain(a.description).slice(0, 1200)}`);
  return lines.join("\n");
}

/** Published posts to link to, best matches first. */
export function relatedPostLines(posts: PostMeta[], systemNames: string[], limit = 6): string[] {
  const want = new Set(systemNames);
  return posts
    .map((p) => ({ p, score: p.products.filter((x) => want.has(x)).length }))
    .filter((x) => x.score > 0 || want.size === 0)
    .sort((a, b) => b.score - a.score || +new Date(b.p.date) - +new Date(a.p.date))
    .slice(0, limit)
    .map(({ p }) => `- "${p.title}" ${SITE}/blog/${p.slug}: ${p.excerpt}`);
}

/** The whole FACTS block for one plan item. */
export function factsBlock(opts: { productSlugs: string[]; applicationSlugs: string[]; brief?: string | null }): string {
  const sections = [
    "## About HUB Surface Systems",
    COMPANY_FACTS.map((f) => `- ${f}`).join("\n"),
  ];
  const prods = opts.productSlugs.map(productFacts).filter(Boolean) as string[];
  if (prods.length) sections.push("## Systems (from the approved 2026-27 catalogue and the website)", prods.join("\n\n"));
  const apps = opts.applicationSlugs.map(applicationFacts).filter(Boolean) as string[];
  if (apps.length) sections.push("## Applications (from the approved catalogue and the website)", apps.join("\n\n"));
  if (opts.brief?.trim()) sections.push("## From HUB's editor (the brief; treat as true)", opts.brief.trim());
  return sections.join("\n\n");
}
