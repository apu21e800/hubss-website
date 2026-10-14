/**
 * Keeps the Insights plan stocked (14 Oct 2026). Vern: "a blog or two a week,
 * help me automate the blog and social media creation as best possible". The
 * drafter (lib/field-note-pipeline.ts) writes an article every Tuesday and
 * Thursday from Studio's Insights plan; when fewer than PLAN_MIN Ideas and
 * Ready items are left, Claude proposes new ones and they go in at the bottom
 * of the plan as Ideas (priority 3). Anyone can reorder, edit or set one to
 * "Not doing" in Studio before its turn comes; the drafter's email names the
 * next one.
 *
 * Two kinds, both written only from what HUB has already checked:
 *  - Guides: what a specifier searches for, answered from the Idea Book pages
 *    of the systems named (the drafter reads them, lib/field-note-facts.ts).
 *    The brief is a list of questions and holds no facts, so the drafter,
 *    which treats a brief as true, is never handed a claim.
 *  - Project roundups: three to six documented jobs from the homepage map
 *    that have no article of their own, on one theme. Their brief is built
 *    here from the jobs' records, word for word, never by the model.
 *
 * vetIdeas is pure: `npm run test:planner`.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { SanityClient } from "@sanity/client";
import { PRODUCT_CATALOGUE } from "@/lib/product-catalogue";
import { APPLICATION_CATALOGUE } from "@/lib/application-catalogue";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { mapProjects, type MapProject } from "@/lib/map-projects";
import { PROVINCES } from "@/lib/social-library";

/** Top up when fewer than this many Ideas and Ready items are left: three weeks at two a week. */
export const PLAN_MIN = 6;
/** ... back up to this many. */
export const PLAN_FILL = 10;

const MODEL = process.env.BLOG_DRAFT_MODEL || "claude-opus-4-5";
/** Inside the drafter's 300 s (app/api/cron/draft-field-note). */
const TIMEOUT_MS = 80_000;

/** What the model proposes. */
export interface RawIdea {
  kind: "guide" | "roundup";
  title: string;
  searchPhrase: string;
  systems?: string[];
  applications?: string[];
  questions?: string[];
  jobIds?: string[];
}

type Ref = { _type: "reference"; _ref: string; _key: string };

/** A plan item, as written to Sanity (sanity/schemas/storyIdea.ts). */
export interface PlanDoc {
  _id: string;
  _type: "storyIdea";
  title: string;
  status: "idea";
  priority: 3;
  searchPhrase: string;
  type: "Guide" | "Project Profile";
  systems: Ref[];
  applications: Ref[];
  brief: string;
}

/** Something already written or planned: its title and the phrases it chases. */
export interface Existing {
  title: string;
  phrases: string[];
}

/** A documented job a roundup may feature. */
export interface PlannerJob {
  id: string;
  title: string;
  place: string;
  system: string;
  systemSlug: string;
  application: string;
  applicationSlug?: string;
  year?: string;
  excerpt: string;
  ideaBookPage?: number;
}

const productSlug = (name: string) => products.find((p) => p.name === name)?.slug;
const applicationSlug = (name: string) => applications.find((a) => a.name === name)?.slug;

/** Map jobs with no article of their own: the roundups' material. */
export function roundupJobs(projects: readonly MapProject[] = mapProjects): PlannerJob[] {
  return projects.flatMap((p) => {
    const systemSlug = productSlug(p.product);
    if (p.post || !systemSlug || !p.excerpt) return [];
    return [{
      id: p.id,
      title: p.title,
      place: `${p.city}, ${PROVINCES[p.province] ?? p.province}`,
      system: p.product,
      systemSlug,
      application: p.application,
      applicationSlug: applicationSlug(p.application),
      year: p.year,
      excerpt: p.excerpt,
      ideaBookPage: p.ideaBookPage,
    }];
  });
}

const STOP = new Set([
  "a", "an", "the", "and", "or", "for", "of", "to", "in", "on", "at", "with", "vs", "versus", "what", "how", "why", "when",
  "your", "you", "is", "are", "it", "its", "that", "this", "from", "by", "as", "be", "do", "does", "can", "which", "who",
  "into", "than", "more", "most", "about", "without", "between", "one", "time", "way",
]);
const stem = (w: string) => (w.length > 4 ? w.replace(/(ings|ing|es|s)$/, "") : w);

/** The content words of a title or phrase, roughly stemmed. */
export function words(s: string): Set<string> {
  return new Set(
    s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ").split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
      .map(stem)
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared / (a.size + b.size - shared);
}

const phraseKey = (s: string) => [...words(s)].sort().join(" ");

/** The existing article or plan item an idea repeats, if any. */
export function repeats(idea: { title: string; searchPhrase: string }, existing: readonly Existing[]): string | undefined {
  const t = words(idea.title);
  const p = phraseKey(idea.searchPhrase);
  for (const e of existing) {
    if (jaccard(t, words(e.title)) >= 0.6) return e.title;
    if (p && e.phrases.some((ph) => phraseKey(ph) === p)) return e.title;
  }
  return undefined;
}

/** No em dashes (house style); spaces tidied. */
const tidy = (s: string) => s.replace(/\s*[—–]\s*/g, ", ").replace(/\s+/g, " ").trim();

function cleanSlug(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "");
}

const ref = (prefix: "product" | "application", slug: string): Ref => ({ _type: "reference", _ref: `${prefix}-${slug}`, _key: slug });

/** A question the brief may carry: a real question, with no figures to treat as fact. */
const goodQuestion = (q: string) => q.length >= 12 && q.length <= 200 && q.endsWith("?") && !/\d/.test(q);

function jobLine(j: PlannerJob): string {
  return [
    `- ${j.title}, ${j.place}.`,
    `System: ${j.system}.`,
    `Application: ${j.application}.`,
    j.year ? `Installed: ${j.year}.` : "",
    tidy(j.excerpt),
    j.ideaBookPage ? `(Shown in the HUB Idea Book, page ${j.ideaBookPage}.)` : "",
  ].filter(Boolean).join(" ");
}

/**
 * The model's ideas, checked and turned into plan items: known systems and
 * applications only, no repeat of an article or plan item (or of each other),
 * guides with at least two real questions, roundups with three to six known
 * jobs. At most `max`, in the order proposed.
 */
export function vetIdeas(
  raw: readonly RawIdea[],
  ctx: { existing: readonly Existing[]; jobs: readonly PlannerJob[]; max: number }
): { docs: PlanDoc[]; dropped: { title: string; why: string }[] } {
  const jobs = new Map(ctx.jobs.map((j) => [j.id, j]));
  const seen: Existing[] = [...ctx.existing];
  const ids = new Set<string>();
  const docs: PlanDoc[] = [];
  const dropped: { title: string; why: string }[] = [];

  for (const r of raw) {
    if (docs.length >= ctx.max) break;
    const title = tidy(r.title ?? "").slice(0, 110);
    const searchPhrase = tidy(r.searchPhrase ?? "").toLowerCase().slice(0, 80);
    const drop = (why: string) => dropped.push({ title: title || "(untitled)", why });
    if (!title || !searchPhrase) { drop("no title or search phrase"); continue; }
    const same = repeats({ title, searchPhrase }, seen);
    if (same) { drop(`too close to "${same}"`); continue; }
    const _id = `storyIdea-auto-${cleanSlug(title)}`;
    if (ids.has(_id)) { drop("same id as another idea"); continue; }

    let doc: PlanDoc;
    if (r.kind === "roundup") {
      const picked = [...new Set(r.jobIds ?? [])].map((id) => jobs.get(id)).filter((j): j is PlannerJob => !!j).slice(0, 6);
      if (picked.length < 3) { drop("a roundup needs three documented jobs"); continue; }
      const systemSlugs = [...new Set(picked.map((j) => j.systemSlug))];
      const appSlugs = [...new Set(picked.map((j) => j.applicationSlug).filter((s): s is string => !!s))];
      doc = {
        _id, _type: "storyIdea", title, status: "idea", priority: 3, searchPhrase, type: "Project Profile",
        systems: systemSlugs.map((s) => ref("product", s)),
        applications: appSlugs.map((s) => ref("application", s)),
        brief: [
          "Documented HUB jobs to feature, a short section each. These records are everything known about them: use them as written and add nothing about these jobs.",
          ...picked.map(jobLine),
          "Then tell the reader what to know before specifying the same work for their own site, from the Idea Book pages.",
        ].join("\n"),
      };
    } else {
      const systems = [...new Set(r.systems ?? [])].filter((s) => PRODUCT_CATALOGUE[s]).slice(0, 3);
      const apps = [...new Set(r.applications ?? [])].filter((s) => APPLICATION_CATALOGUE[s]).slice(0, 3);
      const questions = (r.questions ?? []).map(tidy).filter(goodQuestion).slice(0, 6);
      if (!systems.length) { drop("no HUB system from the Idea Book"); continue; }
      if (questions.length < 2) { drop("fewer than two questions to answer"); continue; }
      doc = {
        _id, _type: "storyIdea", title, status: "idea", priority: 3, searchPhrase, type: "Guide",
        systems: systems.map((s) => ref("product", s)),
        applications: apps.map((s) => ref("application", s)),
        brief: ["Answer these questions for a specifier, from the Idea Book pages of the systems named:", ...questions.map((q) => `- ${q}`)].join("\n"),
      };
    }
    ids.add(_id);
    seen.push({ title, phrases: [searchPhrase] });
    docs.push(doc);
  }
  return { docs, dropped };
}

const PROPOSE: Anthropic.Tool = {
  name: "propose_ideas",
  description: "Propose new Insights articles for HUB's plan.",
  input_schema: {
    type: "object",
    properties: {
      ideas: {
        type: "array",
        items: {
          type: "object",
          properties: {
            kind: { type: "string", enum: ["guide", "roundup"] },
            title: { type: "string", description: "Working title, sentence case, no em dash." },
            searchPhrase: { type: "string", description: "What the reader types into Google, two to five words, lower case." },
            systems: { type: "array", items: { type: "string" }, description: "Guides: one to three SYSTEMS slugs." },
            applications: { type: "array", items: { type: "string" }, description: "Guides: zero to three APPLICATIONS slugs." },
            questions: { type: "array", items: { type: "string" }, description: "Guides: three to six questions the article answers. Questions only: no facts, figures, places or claims." },
            jobIds: { type: "array", items: { type: "string" }, description: "Roundups: three to six JOBS ids that share the theme." },
          },
          required: ["kind", "title", "searchPhrase"],
        },
      },
    },
    required: ["ideas"],
  },
};

const SYSTEM = `You plan Insights articles for HUB Surface Systems (hubss.com), a Canadian company that supplies and installs decorative and functional pavement systems. The readers specify, approve and pay for pavement in Canada: municipal engineers, planners, landscape architects, transit agencies, developers and property managers. The articles are found through search and bring them to HUB's spec sheets and Lunch & Learn sessions.

Propose articles of two kinds:
- guide: a question these readers type into Google, answered from the Idea Book pages of one to three HUB systems (SYSTEMS). Comparisons, choosing between options, how to specify, how long it lasts and how to look after it. Give three to six questions the article answers. Questions only: no facts, figures, places, clients or claims in them, since the writer treats the plan as true.
- roundup: three to six documented jobs from JOBS that share one theme a reader would search for (one application, one system, one kind of place or one region). Use only JOBS ids.

Rules:
- Nothing that EXISTING already covers: the same question or search intent counts as covered, whatever the words.
- Search phrases are what a real person types: plain, two to five words, lower case, no brand names unless people search the brand.
- Working titles in sentence case and Canadian English, no em dash, no exclamation mark, no hype.
- About half guides and half roundups, if JOBS allow.`;

/** Asks Claude for ideas. Throws when Claude can't be reached; the caller logs it. */
export async function proposeIdeas(ctx: { existing: readonly Existing[]; jobs: readonly PlannerJob[]; count: number }): Promise<RawIdea[]> {
  const client = new Anthropic({ timeout: TIMEOUT_MS, maxRetries: 0 });
  const systems = Object.entries(PRODUCT_CATALOGUE).map(([slug, e]) => {
    const name = products.find((p) => p.slug === slug)?.name ?? slug;
    return `- ${slug}: ${name}. ${e.subhead} Where it goes: ${e.uses.join(", ")}.`;
  });
  const apps = Object.entries(APPLICATION_CATALOGUE).map(([slug, e]) => {
    const name = applications.find((a) => a.slug === slug)?.name ?? slug;
    return `- ${slug}: ${name}. ${e.statement}`;
  });
  const user = [
    `Propose ${ctx.count} new articles.`,
    "",
    "SYSTEMS (slug: name. what it is. where it goes):",
    ...systems,
    "",
    "APPLICATIONS (slug: name. the Idea Book's line):",
    ...apps,
    "",
    "JOBS (documented, with no article yet; id | job | place | system | application | year):",
    ...ctx.jobs.map((j) => `- ${j.id} | ${j.title} | ${j.place} | ${j.system} | ${j.application} | ${j.year ?? ""}`),
    "",
    "EXISTING (articles and plan items; don't repeat them):",
    ...ctx.existing.map((e) => `- ${e.title}${e.phrases.length ? ` [${e.phrases.slice(0, 3).join("; ")}]` : ""}`),
  ].join("\n");
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    tools: [PROPOSE],
    tool_choice: { type: "tool", name: PROPOSE.name },
    messages: [{ role: "user", content: user }],
  });
  const block = res.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === PROPOSE.name);
  if (!block) throw new Error(`Claude returned no ideas (stop reason: ${res.stop_reason})`);
  const ideas = (block.input as { ideas?: unknown }).ideas;
  return Array.isArray(ideas) ? (ideas as RawIdea[]) : [];
}

/**
 * Tops the plan up when it's low. Returns what it added (titles), or null when
 * the plan didn't need it. Each item is created only if its id is new, so a
 * second run at the same moment adds nothing twice.
 */
export async function topUpPlan(
  client: SanityClient,
  posts: readonly { title: string; keywords?: string[] }[]
): Promise<{ added: string[]; dropped: { title: string; why: string }[] } | null> {
  const plan = await client.fetch<{ title?: string; status?: string; searchPhrase?: string }[]>(
    `*[_type == "storyIdea" && !(_id in path("drafts.**"))]{ title, status, searchPhrase }`
  );
  const left = plan.filter((p) => p.status === "idea" || p.status === "ready").length;
  if (left >= PLAN_MIN) return null;
  const max = PLAN_FILL - left;
  const existing: Existing[] = [
    ...posts.map((p) => ({ title: p.title, phrases: p.keywords ?? [] })),
    ...plan.filter((p) => p.title).map((p) => ({ title: p.title!, phrases: p.searchPhrase ? [p.searchPhrase] : [] })),
  ];
  const jobs = roundupJobs();
  const raw = await proposeIdeas({ existing, jobs, count: max + 2 });
  const { docs, dropped } = vetIdeas(raw, { existing, jobs, max });
  for (const doc of docs) await client.createIfNotExists(doc);
  console.log(`[planner] ${left} left; added ${docs.length}: ${docs.map((d) => `"${d.title}"`).join(", ") || "none"}${dropped.length ? `; dropped ${dropped.map((d) => `"${d.title}" (${d.why})`).join(", ")}` : ""}`);
  return { added: docs.map((d) => d.title), dropped };
}
