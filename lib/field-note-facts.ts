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
 *
 * Since 20 Oct 2026 the block also carries the documented jobs on the
 * homepage map (lib/map-projects.ts) that share the plan item's systems or
 * applications. Vern's standard for an article (the SHAPE rules in
 * lib/field-note-drafter.ts): it starts at a real place, and the project map
 * already holds them (Toronto Premium Outlets, Fairview Park, the Toronto lot
 * crossing) where the first drafts had none.
 */

import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { PRODUCT_CATALOGUE, SYSTEMS_INDEX } from "@/lib/product-catalogue";
import { APPLICATION_CATALOGUE } from "@/lib/application-catalogue";
import type { PostMeta } from "@/lib/blog";
import { evidenceFor, evidenceLines } from "@/lib/insights-evidence";
import { TIMELY } from "@/lib/insights-calendar";
import { mapProjects, TOUR_IDS, type MapProject } from "@/lib/map-projects";
import { PROVINCES } from "@/lib/social-library";

const SITE = "https://hubss.com";

/**
 * About the company, in the words the site and the catalogue already use
 * (CLAUDE.md, "Client"). "Over 30 years" is true of StreetPrint, never of HUB.
 */
export const COMPANY_FACTS = [
  "HUB Surface Systems is a Canadian leader in decorative and functional pavement solutions: stamped asphalt, preformed thermoplastics and specialty coatings, for municipalities, developers and contractors across Canada.",
  "Canadian-owned since 1999. The HUB Product Portfolio Book (Volume 5, the 2026-27 print edition; the site never calls it a catalogue): 27 years, 1,000+ projects, coast to coast.",
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
  if (SYSTEMS_INDEX[slug]) lines.push(`Product Portfolio Book index line: ${SYSTEMS_INDEX[slug]}`);
  if (c) {
    lines.push(`Product Portfolio Book, page ${c.page}: "${c.title}" ${c.subhead} ${c.description}`);
    lines.push(`Product Portfolio Book specs: ${c.specs.map((s) => `${s.label}: ${s.value}`).join("; ")}`);
    lines.push(`Where it goes (Product Portfolio Book): ${c.uses.join(", ")}`);
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
    lines.push(`Product Portfolio Book, page ${c.page}: "${c.title}" ${c.statement} ${c.body}`);
    if (c.specify.length) {
      const names = (s: string) => products.find((p) => p.slug === s)?.name ?? s;
      lines.push(`Product Portfolio Book "Specify": ${c.specify.map((s) => `${names(s.slug)}: ${s.note}`).join("; ")}`);
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

// ── documented jobs ─────────────────────────────────────────────────────────

/** At most this many jobs go into one article's facts. */
export const DOCUMENTED_JOBS_MAX = 8;

/** The heading the jobs go under in the FACTS; the drafter's SHAPE rules refer to it. */
export const DOCUMENTED_JOBS_HEADING =
  "## Documented jobs (real places from the project map; say only what these lines say; when one fits, the article leads with it and its photo is the article's photo)";

/** Lower case, no accents: so "Montréal" in a brief finds Montréal's jobs. */
const fold = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

/** "Kitchener, Ontario": the place as the articles write it, province spelled out. */
export const jobPlace = (j: Pick<MapProject, "city" | "province">) => `${j.city}, ${PROVINCES[j.province] ?? j.province}`;

/**
 * The project map's documented jobs for an article: the entries whose system
 * (`product`, or one of its `systems`) is one of the products, or whose
 * application is one of the applications. The map writes names
 * ("TrafficPatternsXD", "Parking Lots"); lib/products.ts and
 * lib/applications.ts turn the slugs into them.
 *
 * Order, best first: a job the brief itself names (a roundup's records, or an
 * editor who asks for one job), then a job that matches on a system AND an
 * application (a parking lot guide meets its parking lots before every other
 * crosswalk of the same system: the cap would otherwise cut them), then jobs
 * with a write-up (`post`), then the tour's (TOUR_IDS, the strongest
 * photographs), then jobs with a year, then the rest; the map's own order
 * (west to east) last. At most DOCUMENTED_JOBS_MAX.
 */
export function documentedJobs(
  productSlugs: readonly string[],
  applicationSlugs: readonly string[],
  brief?: string | null,
  projects: readonly MapProject[] = mapProjects
): MapProject[] {
  const systems = new Set(productSlugs.map((s) => products.find((p) => p.slug === s)?.name).filter((n): n is string => !!n));
  const apps = new Set(applicationSlugs.map((s) => applications.find((a) => a.slug === s)?.name).filter((n): n is string => !!n));
  const tour = new Set(TOUR_IDS);
  const text = fold(brief ?? "");
  const named = (j: MapProject) => !!text && text.includes(fold(j.title)) && text.includes(fold(j.city));
  const bySystem = (j: MapProject) => [j.product, ...(j.systems ?? [])].some((n) => systems.has(n));
  const byApp = (j: MapProject) => apps.has(j.application);
  // A published write-up first (`slug`, set only once the post is live): since
  // 28 Oct 2026 every job names a write-up (`post`), most of them drafts.
  const tier = (j: MapProject) => (j.slug ? 0 : tour.has(j.id) ? 1 : j.year ? 2 : 3);
  return projects
    .map((j, i) => ({ j, i, named: named(j), fit: (bySystem(j) ? 1 : 0) + (byApp(j) ? 1 : 0) }))
    .filter((x) => x.named || x.fit > 0)
    .sort((a, b) =>
      Number(b.named) - Number(a.named) ||
      b.fit - a.fit ||
      tier(a.j) - tier(b.j) ||
      Number(tour.has(b.j.id)) - Number(tour.has(a.j.id)) ||
      Number(!!b.j.year) - Number(!!a.j.year) ||
      a.i - b.i
    )
    .slice(0, DOCUMENTED_JOBS_MAX)
    .map((x) => x.j);
}

/** The map's words as written; only an em dash, which the house style never prints, becomes a comma. */
const asWritten = (s: string) => s.replace(/\s*\u2014\s*/g, ", ").trim();

/**
 * One documented job as a fact paragraph. The write-up is linked only when
 * its post is published (`slug`, set from lib/blog-index.json); otherwise the
 * Product Portfolio Book page that shows the job, when there is one.
 */
export function jobFacts(j: MapProject): string {
  const link = j.slug ? `Write-up: /blog/${j.slug}` : j.ideaBookPage ? `Shown in the Product Portfolio Book: /product-book/${j.ideaBookPage}` : "";
  return [
    `### ${j.title} (id: ${j.id})`,
    `Where: ${jobPlace(j)}${j.approximate ? " (approximate: the town is known, not the site)" : ""}`,
    j.year ? `Installed: ${j.year}` : "",
    `System: ${j.product}${j.systems?.length ? `, with ${j.systems.join(" and ")}` : ""}`,
    `Application: ${j.application}`,
    `The job: ${asWritten(j.excerpt)}`,
    j.problem ? `The problem: ${asWritten(j.problem)}` : "",
    j.solution ? `What went in: ${asWritten(j.solution)}` : "",
    link,
    `Photo: ${j.images.length ? "yes" : "no"}`,
  ].filter(Boolean).join("\n");
}

/**
 * The first line of a guide's brief written by the planner (lib/insights-planner.ts):
 * what follows are questions to answer, never facts, so factsBlock files them
 * apart from the editor's brief and both the writer and the fact check are
 * told they support nothing.
 */
export const QUESTIONS_BRIEF = "Questions to answer (not facts):";

/**
 * The whole FACTS block for one plan item. `jobs: false` leaves out the
 * project map's documented jobs: a project profile (lib/project-posts.ts) is
 * about the one job its post records, and leads with that job and its photos.
 */
export function factsBlock(opts: { productSlugs: string[]; applicationSlugs: string[]; brief?: string | null; jobs?: boolean }): string {
  const sections = [
    "## About HUB Surface Systems",
    COMPANY_FACTS.map((f) => `- ${f}`).join("\n"),
  ];
  const prods = opts.productSlugs.map(productFacts).filter(Boolean) as string[];
  if (prods.length) sections.push("## Systems (from the approved 2026-27 Product Portfolio Book and the website)", prods.join("\n\n"));
  const apps = opts.applicationSlugs.map(applicationFacts).filter(Boolean) as string[];
  if (apps.length) sections.push("## Applications (from the approved Product Portfolio Book and the website)", apps.join("\n\n"));
  // The same call as the pipeline's leadJobFor (lib/field-note-pipeline.ts),
  // so the job a draft leads with is always one of these.
  const jobs = opts.jobs === false ? [] : documentedJobs(opts.productSlugs, opts.applicationSlugs, opts.brief);
  if (jobs.length) sections.push(DOCUMENTED_JOBS_HEADING, jobs.map(jobFacts).join("\n\n"));
  // Published studies on the same systems or applications (lib/insights-evidence.ts):
  // the only figures not about HUB that the article may use.
  const evidence = evidenceFor(opts.productSlugs, opts.applicationSlugs);
  if (evidence.length) {
    sections.push(
      "## Outside evidence (published studies, checked against their sources: use only these, as written; say who did it and how big it was, give its limits in the same paragraph, and link the source once)",
      evidence.map(evidenceLines).join("\n\n")
    );
  }
  // A moment's line (lib/insights-calendar.ts, momentLine) is the planner's
  // note on why now and from what angle: filed on its own, so neither the
  // writer nor the fact check takes its words as facts, even in a roundup's
  // brief, which is otherwise treated as true.
  const lines = (opts.brief ?? "").split("\n");
  const timing = lines.filter((l) => l.trim().startsWith(TIMELY)).map((l) => l.trim());
  const brief = lines.filter((l) => !l.trim().startsWith(TIMELY)).join("\n").trim();
  if (brief.startsWith(QUESTIONS_BRIEF)) {
    sections.push(
      "## Questions the article should answer (from the planner: these are NOT facts and support no statement; answer them only from the sections above)",
      brief.slice(QUESTIONS_BRIEF.length).trim()
    );
  } else if (brief) {
    sections.push("## From HUB's editor (the brief; treat as true)", brief);
  }
  if (timing.length) {
    sections.push("## Timing (the planner's note: why this article now, and the angle to take; it supports no statement)", timing.join("\n"));
  }
  return sections.join("\n\n");
}
