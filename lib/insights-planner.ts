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
 *  - Guides: what a specifier searches for, answered from the Product Portfolio Book pages
 *    of the systems named (the drafter reads them, lib/field-note-facts.ts).
 *    The brief is questions only, under QUESTIONS_BRIEF, which factsBlock
 *    files apart from the facts: the writer and the fact check are told the
 *    questions support nothing. vetIdeas also drops a question that names a
 *    place, client or anything but HUB's systems, or that assumes its own
 *    answer ("why does X outlast", "the only", "best").
 *  - Project roundups: three to six documented jobs from the homepage map
 *    that have no article of their own and aren't in another roundup, on one
 *    theme. Their brief is built here from the jobs' records, as written,
 *    never by the model.
 *
 * Timed for the calendar (15 Oct 2026): from 14 to 70 days before a moment in
 * lib/insights-calendar.ts (the clocks going back, Remembrance Day, plow
 * season, budget and tender season...), the planner proposes one article for
 * it, even when the plan isn't low. It goes in at priority 1 with the
 * moment's line in its brief (momentLine), so the drafter writes it next and
 * it can be read and published in time. The planner also sees the published
 * studies the writer may cite (lib/insights-evidence.ts), so a guide can be
 * about what the research says.
 *
 * Vern's standard for an article (20 Oct 2026, lib/field-note-drafter.ts
 * SHAPE) reaches the plan too: no "A vs B" title or question, ever (a choice
 * between materials is what to specify where, by job), and paint is never
 * the subject. vetIdeas drops what breaks it. A guide whose systems have a
 * documented job on the project map asks the writer to lead with one
 * (LEAD_JOB_QUESTION).
 *
 * vetIdeas is pure: `npm run test:planner`.
 */

import { GLOSSARY_FOR_TITLES } from "@/lib/glossary";
import Anthropic from "@anthropic-ai/sdk";
import type { SanityClient } from "@sanity/client";
import { PRODUCT_CATALOGUE } from "@/lib/product-catalogue";
import { APPLICATION_CATALOGUE } from "@/lib/application-catalogue";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { mapProjects, type MapProject } from "@/lib/map-projects";
import { PROVINCES } from "@/lib/social-library";
import { documentedJobs, QUESTIONS_BRIEF } from "@/lib/field-note-facts";
import { EVIDENCE } from "@/lib/insights-evidence";
import { longDate, MOMENTS, momentLine, momentPlanned, momentsWithin, nextDate, type Moment } from "@/lib/insights-calendar";

/** Top up when fewer than this many Ideas and Ready items are left: three weeks at two a week. */
export const PLAN_MIN = 6;
/** ... back up to this many. */
export const PLAN_FILL = 10;
/** A moment gets its article proposed from this many days ahead ... */
export const MOMENT_FROM = 14;
/** ... to this many: the drafter's turn, a person's read and a week's lead before the date. */
export const MOMENT_TO = 70;

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
  /** The MOMENTS id the article is timed for, if any. */
  moment?: string;
}

type Ref = { _type: "reference"; _ref: string; _key: string };

/** A plan item, as written to Sanity (sanity/schemas/storyIdea.ts). */
export interface PlanDoc {
  _id: string;
  _type: "storyIdea";
  title: string;
  status: "idea";
  /** 1 for an article timed for a moment (drafted next), else 3 (the bottom of the plan). */
  priority: 1 | 3;
  searchPhrase: string;
  type: "Guide" | "Project Profile";
  systems: Ref[];
  applications: Ref[];
  brief: string;
}

/** Something already written or planned: its title, the phrases it chases and, for a plan item, its brief. */
export interface Existing {
  title: string;
  phrases: string[];
  brief?: string;
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

/** How a job opens its line in a roundup's brief; also how a used job is recognised. */
const jobKey = (j: PlannerJob) => `- ${j.title}, ${j.place}.`;

/** Jobs already featured in a plan item's brief (a roundup planned, drafted or published). */
export function usedJobIds(jobs: readonly PlannerJob[], existing: readonly Existing[]): Set<string> {
  const briefs = existing.map((e) => e.brief).filter((b): b is string => !!b);
  return new Set(jobs.filter((j) => briefs.some((b) => b.includes(jobKey(j)))).map((j) => j.id));
}

const STOP = new Set([
  "a", "an", "the", "and", "or", "for", "of", "to", "in", "on", "at", "with", "vs", "versus", "what", "how", "why", "when",
  "your", "you", "is", "are", "it", "its", "that", "this", "from", "by", "as", "be", "do", "does", "can", "which", "who",
  "into", "than", "more", "most", "about", "without", "between", "one", "time", "way",
]);

/** A rough stem, so lane and lanes, marking and markings, surface and surfaces meet. */
function stem(w: string): string {
  if (w.length > 5) w = w.replace(/ings?$/, "");
  if (w.length > 3 && /[^s]s$/.test(w)) w = w.slice(0, -1);
  return w;
}

/** The content words of a title or phrase, roughly stemmed. */
export function words(s: string): Set<string> {
  return new Set(
    s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").split(/\s+/)
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

/** No em or en dash as a dash (house style); spaces tidied. For the model's words only. */
const tidy = (s: string) => s.replace(/\s*[—–]\s*/g, ", ").replace(/\s+/g, " ").trim();

function cleanSlug(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "");
}

const ref = (prefix: "product" | "application", slug: string): Ref => ({ _type: "reference", _ref: `${prefix}-${slug}`, _key: slug });

/** Words that make a question assume its answer, or a title make a claim. */
const LOADED = /\b(why (does|do|did|is|are|was|were|has|have|can)|only|best|worst|most|least|better|worse|cheaper|cheapest|longer|longest|faster|fastest|stronger|strongest|safer|safest|outlasts?|outlasting|superior|unique|guaranteed?|always|never|proven)\b/i;

/** "A vs B": never in a title or a question (Vern, 20 Oct 2026). A choice is what to specify where. */
export const VS = /\b(vs|versus)\b/i;

/**
 * The line a guide's questions end with when the project map holds a
 * documented job of one of its systems: the writer leads with one
 * (lib/field-note-drafter.ts SHAPE) and its photo is the article's.
 */
export const LEAD_JOB_QUESTION = "Which documented job in the facts shows this on a real site, so the article can lead with it?";

/** Names a guide may use: HUB's systems and a few general terms that aren't about any client or place. */
const NAMES = [
  ...products.map((p) => p.name), "HUB", "Product Portfolio Book", "Canada", "Canadian", "AODA", "LEED", "Vision Zero", "Complete Streets",
  // The calendar's days (lib/insights-calendar.ts): names of days, not of a place or client.
  ...MOMENTS.map((m) => m.name.replace(/^the /, "")).filter((n) => /^[A-Z]/.test(n)),
].sort((a, b) => b.length - a.length);

/** True when every capitalised word after the first is one of NAMES: no place, client or agency. */
export function namesOnlyKnown(s: string): boolean {
  let rest = s;
  for (const n of NAMES) rest = rest.split(n).join(" ");
  return !rest.trim().split(/\s+/).slice(1).some((w) => /^[A-Z]/.test(w) && w !== "I");
}

/** A question a guide's brief may carry: a real question that names nothing, assumes nothing and sets nothing against anything. */
export const goodQuestion = (q: string) =>
  q.length >= 12 && q.length <= 200 && q.endsWith("?") && !/\d/.test(q) && !LOADED.test(q) && !VS.test(q) && namesOnlyKnown(q);

function jobLine(j: PlannerJob): string {
  return [
    `${jobKey(j)}`,
    `System: ${j.system}.`,
    `Application: ${j.application}.`,
    j.year ? `Installed: ${j.year}.` : "",
    // As written: only an em dash, which the house style never prints, becomes a comma.
    j.excerpt.replace(/\s*—\s*/g, ", "),
    j.ideaBookPage ? `(Shown in the HUB Product Portfolio Book, page ${j.ideaBookPage}.)` : "",
  ].filter(Boolean).join(" ");
}

/**
 * The model's ideas, checked and turned into plan items: known systems and
 * applications only, no repeat of an article or plan item (or of each other),
 * guides with at least two questions that pass goodQuestion and a title that
 * claims nothing, roundups with three to six known jobs that no other plan
 * item features. At most `max`, in the order proposed.
 */
export function vetIdeas(
  raw: readonly RawIdea[],
  ctx: {
    existing: readonly Existing[];
    jobs: readonly PlannerJob[];
    max: number;
    /** Moments due an article (topUpPlan: MOMENT_FROM to MOMENT_TO days ahead, none planned yet). */
    moments?: readonly Moment[];
    now?: Date;
    /** The plan isn't low: keep only articles timed for a due moment. */
    onlyMoments?: boolean;
  }
): { docs: PlanDoc[]; dropped: { title: string; why: string }[] } {
  const jobs = new Map(ctx.jobs.map((j) => [j.id, j]));
  const now = ctx.now ?? new Date();
  const due = new Map((ctx.moments ?? []).map((m) => [m.id, m]));
  const used = usedJobIds(ctx.jobs, ctx.existing);
  const seen: Existing[] = [...ctx.existing];
  const ids = new Set<string>();
  const docs: PlanDoc[] = [];
  const dropped: { title: string; why: string }[] = [];

  // Articles for a due moment first, so the cap never cuts one; otherwise as proposed.
  const timed = (r: RawIdea) => (r.moment && due.has(r.moment) ? 0 : 1);
  const ordered = [...raw].sort((a, b) => timed(a) - timed(b));
  for (const r of ordered) {
    if (docs.length >= ctx.max) break;
    const title = tidy(r.title ?? "").slice(0, 110);
    const searchPhrase = tidy(r.searchPhrase ?? "").toLowerCase().slice(0, 80);
    const drop = (why: string) => dropped.push({ title: title || "(untitled)", why });
    if (!title || !searchPhrase) { drop("no title or search phrase"); continue; }
    if (/\d/.test(title) || /\d/.test(searchPhrase)) { drop("a figure in the title or search phrase"); continue; }
    if (VS.test(title)) { drop("a \"vs\" title (a choice is what to specify where)"); continue; }
    if (LOADED.test(title)) { drop("the title makes a claim"); continue; }
    const same = repeats({ title, searchPhrase }, seen);
    if (same) { drop(`too close to "${same}"`); continue; }
    const _id = `storyIdea-auto-${cleanSlug(title)}`;
    if (ids.has(_id)) { drop("same id as another idea"); continue; }
    // One article per due moment; the plan's later ideas for it are ordinary ones.
    const moment = r.moment ? due.get(r.moment) : undefined;
    if (ctx.onlyMoments && !moment) { drop("the plan isn't low, and this isn't for an upcoming moment"); continue; }

    let doc: PlanDoc;
    if (r.kind === "roundup") {
      const picked = [...new Set(r.jobIds ?? [])]
        .map((id) => jobs.get(id))
        .filter((j): j is PlannerJob => !!j && !used.has(j.id))
        .slice(0, 6);
      if (picked.length < 3) { drop("a roundup needs three documented jobs no other plan item features"); continue; }
      const systemSlugs = [...new Set(picked.map((j) => j.systemSlug))];
      const appSlugs = [...new Set(picked.map((j) => j.applicationSlug).filter((s): s is string => !!s))];
      doc = {
        _id, _type: "storyIdea", title, status: "idea", priority: moment ? 1 : 3, searchPhrase, type: "Project Profile",
        systems: systemSlugs.map((s) => ref("product", s)),
        applications: appSlugs.map((s) => ref("application", s)),
        brief: [
          "Documented HUB jobs to feature, a short section each. These records are everything known about them: use them as written and add nothing about these jobs.",
          ...picked.map(jobLine),
          "Then tell the reader what to know before specifying the same work for their own site, from the Product Portfolio Book pages.",
          ...(moment ? [momentLine(moment, now)] : []),
        ].join("\n"),
      };
      for (const j of picked) used.add(j.id);
    } else {
      if (!namesOnlyKnown(title)) { drop("the title names a place, client or agency"); continue; }
      const systems = [...new Set(r.systems ?? [])].filter((s) => PRODUCT_CATALOGUE[s]).slice(0, 3);
      const apps = [...new Set(r.applications ?? [])].filter((s) => APPLICATION_CATALOGUE[s]).slice(0, 3);
      const questions = (r.questions ?? []).map(tidy).filter(goodQuestion).slice(0, 6);
      if (!systems.length) { drop("no HUB system from the Product Portfolio Book"); continue; }
      if (questions.length < 2) { drop("fewer than two questions that name and assume nothing"); continue; }
      // A job of the guide's own systems, not one that only shares the
      // application: a guide to repair products doesn't lead with a crosswalk.
      const lead = documentedJobs(systems, []).length ? [LEAD_JOB_QUESTION] : [];
      doc = {
        _id, _type: "storyIdea", title, status: "idea", priority: moment ? 1 : 3, searchPhrase, type: "Guide",
        systems: systems.map((s) => ref("product", s)),
        applications: apps.map((s) => ref("application", s)),
        brief: [QUESTIONS_BRIEF, ...[...questions, ...lead].map((q) => `- ${q}`), ...(moment ? [momentLine(moment, now)] : [])].join("\n"),
      };
    }
    if (moment) due.delete(moment.id);
    ids.add(_id);
    seen.push({ title, phrases: [searchPhrase], brief: doc.brief });
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
            title: { type: "string", description: "Working title, sentence case, no em dash, no figures, no claim, no \"vs\" (a choice is what to specify where, by job)." },
            searchPhrase: { type: "string", description: "What the reader types into Google, two to five words, lower case." },
            systems: { type: "array", items: { type: "string" }, description: "Guides: one to three SYSTEMS slugs." },
            applications: { type: "array", items: { type: "string" }, description: "Guides: zero to three APPLICATIONS slugs." },
            questions: { type: "array", items: { type: "string" }, description: "Guides: three to six neutral questions the article answers. None sets one material against another: no \"vs\", and paint is never the subject." },
            jobIds: { type: "array", items: { type: "string" }, description: "Roundups: three to six JOBS ids that share the theme." },
            moment: { type: "string", description: "The MOMENTS id this article is timed for; leave it out for an ordinary article." },
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
- guide: a question these readers type into Google, answered from the Product Portfolio Book pages of one to three HUB systems (SYSTEMS). What to specify where, how to specify it, how long it lasts and how to look after it. Give three to six neutral questions the article answers. A question names no place, client, agency or brand other than HUB's systems, holds no figures, and doesn't assume its answer: "How does an inlaid crosswalk hold up to plows?", never "Why does TrafficPatterns outlast paint?" or "What makes X the only...". Paint is never an article's subject: no "vs paint", "beyond paint" or "why paint fails" ideas (Vern, 20 Oct 2026). No "A vs B" in a title or a question, ever: a choice between materials is framed as what to specify where, by job ("Where a parking lot needs preformed thermoplastic, and where a pavement coating does the job"), never as a contest.
- roundup: three to six documented jobs from JOBS that share one theme a reader would search for (one application, one system, one kind of place or one region). Use only JOBS ids, and each job in one roundup at most.

Angles that earn a busy reader's attention (research, 15 Oct 2026), within those two kinds:
- A guide on what the published research says about a treatment, when EVIDENCE has a study on it: give it the systems and applications the study bears on, so the writer gets it, and neutral questions ("What has research found about coloured bus lanes and collisions?").
- A roundup that shows time in service, or one region, or community identity (designs made with a Nation, a Legion or a business association), when JOBS allow.
- An article timed for one of the MOMENTS (below).

MOMENTS: for each moment listed, propose exactly one article timed for it (set moment to its id), a guide or a roundup, built on the systems and applications it names and its angle. Its title may name the day (Remembrance Day) but no date or figure. The plan puts it first.

${GLOSSARY_FOR_TITLES}

Rules:
- Nothing that EXISTING already covers: the same question or search intent counts as covered, whatever the words.
- Search phrases are what a real person types: plain, two to five words, lower case, no brand names unless people search the brand.
- Working titles in sentence case and Canadian English, no em dash, no figures, no exclamation mark, no hype, no claim (best, only, longest), no "vs".
- About half guides and half roundups, if JOBS allow.`;

/** Asks Claude for ideas. Throws when Claude can't be reached; the caller logs it. */
export async function proposeIdeas(ctx: {
  existing: readonly Existing[];
  jobs: readonly PlannerJob[];
  count: number;
  moments?: readonly Moment[];
  now?: Date;
  /** The plan isn't low: propose only the moments' articles. */
  onlyMoments?: boolean;
}): Promise<RawIdea[]> {
  const client = new Anthropic({ timeout: TIMEOUT_MS, maxRetries: 0 });
  const systems = Object.entries(PRODUCT_CATALOGUE).map(([slug, e]) => {
    const name = products.find((p) => p.slug === slug)?.name ?? slug;
    return `- ${slug}: ${name}. ${e.subhead} Where it goes: ${e.uses.join(", ")}.`;
  });
  const apps = Object.entries(APPLICATION_CATALOGUE).map(([slug, e]) => {
    const name = applications.find((a) => a.slug === slug)?.name ?? slug;
    return `- ${slug}: ${name}. ${e.statement}`;
  });
  const now = ctx.now ?? new Date();
  const moments = ctx.moments ?? [];
  const user = [
    ctx.onlyMoments
      ? `Propose one article for each of the ${moments.length} MOMENTS, and nothing else.`
      : `Propose ${ctx.count} new articles${moments.length ? `, ${moments.length} of them timed for the MOMENTS` : ""}.`,
    "",
    "MOMENTS (id | moment | date | angle | systems | applications):",
    ...(moments.length
      ? moments.map((m) => `- ${m.id} | ${m.name} | ${longDate(nextDate(m, now))} | ${m.angle} | ${m.systems.join(", ")} | ${m.applications.join(", ")}`)
      : ["(none due)"]),
    "",
    "EVIDENCE (published studies the writer may cite; id | what | systems | applications):",
    ...EVIDENCE.map((e) => `- ${e.id} | ${e.title} | ${e.systems.join(", ") || "-"} | ${e.applications.join(", ") || "-"}`),
    "",
    "SYSTEMS (slug: name. what it is. where it goes):",
    ...systems,
    "",
    "APPLICATIONS (slug: name. the Product Portfolio Book's line):",
    ...apps,
    "",
    "JOBS (documented, with no article or roundup yet; id | job | place | system | application | year):",
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

const isConflict = (err: unknown) => (err as { statusCode?: number })?.statusCode === 409;

/**
 * Tops the plan up when it's low. Returns what it added (titles), or null when
 * the plan didn't need it. An item whose id (from its title) is already taken
 * is skipped, so the same title is never added twice. The cron never runs two
 * of these at once; a run by hand at the same moment could add a second batch,
 * which anyone can set to "Not doing".
 */
export async function topUpPlan(
  client: SanityClient,
  posts: readonly { title: string; keywords?: string[] }[],
  now: Date = new Date()
): Promise<{ added: string[]; dropped: { title: string; why: string }[] } | null> {
  const plan = await client.fetch<{ title?: string; status?: string; searchPhrase?: string; brief?: string }[]>(
    `*[_type == "storyIdea" && !(_id in path("drafts.**"))]{ title, status, searchPhrase, brief }`
  );
  const left = plan.filter((p) => p.status === "idea" || p.status === "ready").length;
  // Moments coming up with no article in the plan yet (any status: one written
  // or published for this date counts).
  const moments = momentsWithin(now, MOMENT_FROM, MOMENT_TO).filter((m) => !momentPlanned(m, now, plan.map((p) => p.brief)));
  const onlyMoments = left >= PLAN_MIN;
  if (onlyMoments && !moments.length) return null;
  const max = onlyMoments ? moments.length : Math.max(PLAN_FILL - left, moments.length);
  const existing: Existing[] = [
    ...posts.map((p) => ({ title: p.title, phrases: p.keywords ?? [] })),
    ...plan.filter((p) => p.title).map((p) => ({ title: p.title!, phrases: p.searchPhrase ? [p.searchPhrase] : [], brief: p.brief })),
  ];
  const all = roundupJobs();
  const used = usedJobIds(all, existing);
  const jobs = all.filter((j) => !used.has(j.id));
  const raw = await proposeIdeas({ existing, jobs, count: max + 2, moments, now, onlyMoments });
  const { docs, dropped } = vetIdeas(raw, { existing, jobs: all, max, moments, now, onlyMoments });
  const added: string[] = [];
  for (const doc of docs) {
    try {
      await client.create(doc);
      added.push(doc.title);
    } catch (err) {
      if (!isConflict(err)) throw err;
      dropped.push({ title: doc.title, why: "already in the plan under that title" });
    }
  }
  console.log(`[planner] ${left} left${moments.length ? `; moments due: ${moments.map((m) => m.id).join(", ")}` : ""}; added ${added.length}: ${added.map((t) => `"${t}"`).join(", ") || "none"}${dropped.length ? `; dropped ${dropped.map((d) => `"${d.title}" (${d.why})`).join(", ")}` : ""}`);
  return { added, dropped };
}
