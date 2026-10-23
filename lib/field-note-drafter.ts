/**
 * The AI half of the Field Notes pipeline: write a draft, then check it.
 *
 * Two calls to Claude. The first writes the post from the FACTS block
 * (lib/field-note-facts.ts) and the plan item. The second is a separate fact
 * check: it compares the draft with the same FACTS and lists every statement
 * about HUB, its systems, numbers, places or clients that the FACTS don't
 * support. Those go into the draft's "Notes for the editor" in Studio, so the
 * person who presses Publish knows exactly what to check. The pipeline never
 * publishes (lib/field-note-pipeline.ts).
 *
 * Between the two, a style pass (styleRewrite, shared with the social
 * drafter): lib/style-lint.ts finds any sentence with an em dash or another
 * machine tell, one short call asks Claude to rewrite just those sentences,
 * and whatever still fails is listed in the notes too. Doug does not want a
 * single em dash on the site, and the prompt alone has never been enough.
 *
 * The SHAPE rules are Vern's standard of 20 Oct 2026, written after he read
 * the first drafts ("need significant improvement ... don't talk constantly
 * about the products being better than line paint ... written to a higher
 * standard"): shorter, a real place first (a documented job from the project
 * map, lib/field-note-facts.ts), proof before explanation, one thing to keep,
 * paint never the subject, no "vs". The draft names the job it leads with
 * (`leadJob`) and the pipeline makes that job's photo the featured photo.
 */

import Anthropic from "@anthropic-ai/sdk";
import { flagSentences, keepsFacts, PRODUCT_NAMES, type FlagOptions, type StyleRule } from "@/lib/style-lint";
import { GLOSSARY_FOR_WRITERS } from "@/lib/glossary";

/** Override with BLOG_DRAFT_MODEL; the default is the model the repo already used. */
const MODEL = process.env.BLOG_DRAFT_MODEL || "claude-opus-4-5";

export interface Draft {
  title: string;
  slug: string;
  excerpt: string;
  searchPhrases: string[];
  body: string;
  factsUsed: string[];
  /** The id of the documented job (lib/map-projects.ts) the article leads with; empty or absent when it opens at the reader's decision. */
  leadJob?: string;
}

export interface FactCheck {
  verdict: "clean" | "needs edits";
  unsupported: { quote: string; reason: string }[];
}

export interface DraftBrief {
  title: string;
  searchPhrase?: string | null;
  type?: string | null;
  /**
   * Instructions for this piece that beat VOICE's SHAPE: a project profile
   * written from one job's record (lib/project-posts.ts) is shorter than a
   * guide and must not pad a short record out.
   */
  instructions?: string | null;
}

export const VOICE = `You write Insights articles for HUB Surface Systems (hubss.com): articles for the people who specify, approve and pay for decorative and functional pavement in Canada: municipal engineers, planners, landscape architects, transit agencies, developers and property managers.

VOICE: relaxed, professional, leaders in the field. Write like a senior specifier explaining something to a peer: plain, confident, concrete, useful. Canadian English (colour, centre, metre, curb). No hype words (revolutionary, game-changing, cutting-edge, unparalleled, world-class), no exclamation marks, no questions to the reader as headings, no "In today's world" openings.

THE FACTS RULE, which beats everything else:
- Every statement about HUB, its systems, specifications, numbers (thickness, service life, skid resistance, cure or open-to-traffic times, years, counts), standards, places, projects and clients must come from the FACTS you are given. If the FACTS don't say it, don't write it.
- Never invent projects, clients, cities, quotes, testimonials, prices, awards, statistics or survey results. Don't name a city, agency or client unless the FACTS name it.
- General context that isn't about HUB (what Vision Zero or Complete Streets are, why contrast helps pedestrians, what freeze-thaw does to paint) is fine in plain words, without numbers.
- A figure that isn't about HUB may come only from the OUTSIDE EVIDENCE in the FACTS. Quote it as written, say who did the study and how big it was, give its limits in the same paragraph, and link the source once. A finding applies only to what was measured: high-visibility crosswalk findings are about bar, continental and ladder markings, never a decorative design; a study of one coating says nothing about another.
- If the topic needs a fact you don't have, write around it honestly ("ask HUB for the specification for your site") rather than guessing.

SHAPE (Vern's standard, 20 Oct 2026: "written to a higher standard"; what a reader should feel is that a person who has stood on these jobs wrote it, in an hour, for one colleague):
- Length: 550 to 850 words of markdown for a guide; 350 to 600 for news or a project with a thin record. Never pad: the piece ends when the point is made.
- The first paragraph, two or three plain sentences under no heading, puts the reader somewhere real: at a documented job from the FACTS, named with its town and province, or at the decision on their desk. When a documented job fits, the article leads with it and its photo becomes the article's photo: give its id as leadJob. A job fits when it shows what the article is about, the same system at work or the same kind of job; one that only shares the setting (a decorative crossing in a guide to patching potholes, because both are in a parking lot) doesn't. When none fits, open at the decision and leave leadJob empty.
- Then two to four sections under "## " headings a reader can scan (a roundup of jobs: one short section each; "### " inside a section only if it helps). Proof before explanation in every section: it opens with a documented job, the years in service, a spec line from the Product Portfolio Book or a published study from the OUTSIDE EVIDENCE (with its limits), and only then explains.
- One thing to keep, not three: a short checklist, a three-row table, or the questions to put to a supplier.
- Paint is never the subject: one passing mention at most in the whole piece, and never as the villain.
- No "vs" in any title or heading, ever. A choice between materials is written as what to specify where, by job, not as a contest.
- The title is a sentence a person would say: under 70 characters, with the search phrase in it or in the first paragraph. No question, no praise word, no "X: Y" couplet if it can be avoided. Good: "Toronto Premium Outlets, fourteen winters on one set of crossings". Bad: "Parking lot line painting vs thermoplastic markings".
- The close is two or three lines on the next step: the spec sheet on /resources, a Lunch & Learn (/lunch-learn) or the contact page (/contact). No hard sell.
- Markdown only: no "# " title line, no images, no HTML. A list or a small table only where it helps.

ATTENTION (Vern, 15 Oct 2026: articles that capture real attention; the headline, the first paragraph, proof first and the thing to keep are in SHAPE above). From research on B2B buyers and on headline tests:
- The headline names the thing and the place or the problem in plain words: what changed, where, for whom. A time span or a figure only when the FACTS give it.
- After the place, the first paragraph says why it matters to the reader.
- Community and memorial work (a Nation's design, a Legion's crosswalk, a business association's logo): name the partner only as the FACTS name them, in their spelling, and give the meaning only as they state it.
- A contested topic (removals, vandalism, a council vote) gets plain facts with no adjectives, then the reader's practical question: approval, repair or upkeep.

LINKS: link the first mention of each HUB system to its page, link one to three of the RELATED POSTS where they genuinely help, and link the source of each piece of OUTSIDE EVIDENCE you use, once, with the URLs given. No other links.

SEARCH: the target search phrase goes in the title when the title still reads as a sentence a person would say, otherwise in the first paragraph; once in a heading only where it reads naturally. A phrase with "vs" in it never goes in a title or heading. Don't stuff it.

HOUSE STYLE (docs/STYLE.md): sentence case for headings ("Where the colour goes", not "Where The Colour Goes"). Product names exactly: ${PRODUCT_NAMES.join(", ")}. The company is HUB Surface Systems, then HUB; never "Hub". The printed book is the Product Portfolio Book, never "the catalogue" and never by its old name, "the Idea Book" (a brief may still use it). Places as city and province spelled out (Milton, Ontario). No em dashes, none at all: an aside goes between commas or in parentheses, a pivot gets a full stop or a colon, a list gets commas. En dash only inside a span (10–20 years, 2026–27). No counts as a selling point.

${GLOSSARY_FOR_WRITERS}

MACHINE TELLS (docs/STYLE.md, "Machine tells"): readers recognise machine-written copy on sight and it costs trust, so none of these appears in the draft:
- Em dashes, anywhere, even one.
- The reversal: "It's not X, it's Y", "not just X", "more than a surface".
- Three of everything: three adjectives, three fragments, three parallel clauses, because three felt complete. Use two, or four, or one.
- Stacked fragments as a device ("Fast. Durable. Proven.").
- "Whether you're a ... or a ...", "From X to Y", "In today's ...", "In a world where ...", "Here's the thing", "Let's dive in", "Think of it as".
- Headings that ask a question, headings built as "X: Y", and an article where every heading is a two-beat couplet.
- Filler verbs and adjectives: seamless, robust, elevate, leverage, unlock, empower, harness, streamline, holistic, tailored, bespoke, cutting-edge, game-changing, world-class, best-in-class, premium (as praise), solutions (as filler), journey, landscape (as a metaphor), ensure, delve.
- A line at the end of a paragraph that restates the paragraph. A paragraph ends when the point is made. The hedge that says nothing ("it's worth noting").
- Exclamation marks. Emoji. "Discover", "Explore", "Learn more" as calls to action; say what happens instead ("Book a Lunch & Learn").
The test: read it aloud. If a person on the phone would not say it, cut it.`;

export const SAVE_DRAFT: Anthropic.Tool = {
  name: "save_draft",
  description: "Save the finished Insights draft, written to SHAPE. No \"vs\" in its title or in any heading: a choice between materials is what to specify where, by job.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "The headline: a sentence a person would say, under 70 characters, with the target search phrase in it or in the first paragraph. No \"vs\", no question, no praise word, no \"X: Y\" couplet if it can be avoided." },
      slug: { type: "string", description: "The URL slug: lowercase words joined by hyphens, under 60 characters." },
      excerpt: { type: "string", description: "Two sentences, under 220 characters: what the reader gets. No hype." },
      searchPhrases: { type: "array", items: { type: "string" }, description: "Three to five search phrases this post should win, the target phrase first." },
      body: { type: "string", description: "The article in markdown, to SHAPE: 550 to 850 words for a guide, 350 to 600 for news or a project with a thin record, unless FOR THIS PIECE says otherwise. No title line." },
      factsUsed: { type: "array", items: { type: "string" }, description: "Each FACT the body relies on, quoted from the FACTS." },
      leadJob: { type: "string", description: "The id of the documented job the article leads with, exactly as the FACTS give it (\"id: ...\"): its photo becomes the article's photo. Empty when the article opens at the reader's decision instead." },
    },
    required: ["title", "slug", "excerpt", "searchPhrases", "body", "factsUsed"],
  },
};

const REPORT: Anthropic.Tool = {
  name: "report",
  description: "Report the fact check.",
  input_schema: {
    type: "object",
    properties: {
      verdict: { type: "string", enum: ["clean", "needs edits"] },
      unsupported: {
        type: "array",
        items: {
          type: "object",
          properties: {
            quote: { type: "string", description: "The statement, word for word from the draft." },
            reason: { type: "string", description: "One line: what the FACTS say instead, or that they say nothing about it." },
          },
          required: ["quote", "reason"],
        },
      },
    },
    required: ["verdict", "unsupported"],
  },
};

async function toolCall<T>(client: Anthropic, system: string, user: string, tool: Anthropic.Tool, maxTokens: number, model = MODEL): Promise<T> {
  const res = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    tools: [tool],
    tool_choice: { type: "tool", name: tool.name },
    messages: [{ role: "user", content: user }],
  });
  const block = res.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === tool.name);
  if (!block) throw new Error(`Claude returned no ${tool.name} call (stop reason: ${res.stop_reason})`);
  if (res.stop_reason === "max_tokens") throw new Error(`Claude ran out of room writing ${tool.name}`);
  return block.input as T;
}

export async function writeDraft(brief: DraftBrief, facts: string, relatedPosts: string[]): Promise<Draft> {
  const client = new Anthropic();
  const user = [
    `Write an Insights article.`,
    ``,
    `WORKING TITLE: ${brief.title}`,
    brief.type ? `TYPE: ${brief.type}` : "",
    brief.searchPhrase ? `TARGET SEARCH PHRASE: ${brief.searchPhrase}` : "",
    brief.instructions ? `\nFOR THIS PIECE (these beat the SHAPE rules above):\n${brief.instructions}` : "",
    ``,
    `FACTS:`,
    facts,
    ``,
    `RELATED POSTS (published on hubss.com; link where useful):`,
    relatedPosts.length ? relatedPosts.join("\n") : "(none)",
    ``,
    `Save it with save_draft.`,
  ].filter((l) => l !== "").join("\n");
  const draft = await toolCall<Draft>(client, VOICE, user, SAVE_DRAFT, 8000);
  if (!draft.body?.trim() || !draft.title?.trim()) throw new Error("The draft came back empty");
  return draft;
}

export async function checkDraft(draft: Draft, facts: string): Promise<FactCheck> {
  const client = new Anthropic();
  const system = `You fact-check Insights articles for HUB Surface Systems before a human editor publishes them. You are strict and literal. You compare the DRAFT with the FACTS and list every statement in the draft about HUB, its systems, specifications, numbers, standards, places, projects or clients that the FACTS do not support, including numbers that differ, capabilities the FACTS don't claim, and any named city, agency, project or client not in the FACTS. General context that isn't about HUB and has no numbers (what Vision Zero is, why contrast helps) is fine; don't list it. A figure from the FACTS' outside evidence is supported only when it is quoted as written, the same paragraph gives that study's limits, and it is applied only to what the study measured (a crosswalk-visibility finding used for a decorative design, or a study of one coating used for another, is unsupported): list any that fall short. Links are fine. If everything is supported, the verdict is "clean" and the list is empty.`;
  const user = `FACTS:\n${facts}\n\nDRAFT:\n# ${draft.title}\n\n${draft.excerpt}\n\n${draft.body}\n\nReport with the report tool.`;
  const result = await toolCall<FactCheck>(client, system, user, REPORT, 3000);
  return { verdict: result.unsupported?.length ? "needs edits" : "clean", unsupported: result.unsupported ?? [] };
}

// ── the style pass ──────────────────────────────────────────────────────────

/** One piece of copy for the style pass: a field of a draft, or one network's post. */
export interface CopyPiece {
  key: string;
  /** How the prompt and the editor's notes name it: "Title", "Body", "LinkedIn". */
  label: string;
  text: string;
  /** "whole": the text is a title; "markdown": its # lines are headings; "none": no headings. */
  headings: FlagOptions["headings"];
  /** Rules this piece may break (a Facebook post may carry one emoji). */
  ignore?: StyleRule[];
}

export interface StylePass {
  /** The copy after the rewrite, by key. */
  text: Record<string, string>;
  /** How many sentences broke the house style as Claude first wrote them. */
  flagged: number;
  /** The sentences that still do, for a person to fix. */
  left: { label: string; sentence: string; problems: string[] }[];
  /** Why the rewrite didn't happen, when it didn't. */
  error?: string;
}

const REWRITE: Anthropic.Tool = {
  name: "save_rewrites",
  description: "Save the rewritten sentences.",
  input_schema: {
    type: "object",
    properties: {
      rewrites: {
        type: "array",
        items: {
          type: "object",
          properties: {
            n: { type: "integer", description: "The sentence's number, as given." },
            rewrite: { type: "string", description: "The rewritten sentence, and nothing else." },
          },
          required: ["n", "rewrite"],
        },
      },
    },
    required: ["rewrites"],
  },
};

const EDITOR = `You are now the copy editor, not the writer. You get sentences from a draft that break the house style, each with its problem. Rewrite each one so the problem is gone, and change nothing else:
- Keep every fact: the same numbers, product names, places, names and links, and the same markdown (bold, italic, links).
- Change only what the problem needs; keep the rest of the wording.
- One rewrite per number: no new points, and don't merge it with the text around it. Two sentences under one number may come back as one or two.
- A title or heading stays short, in sentence case (capitals on the first word and on names only), and keeps its search phrase.
- No dash between clauses, of any kind: use a comma, a colon, a full stop or parentheses.
- Don't make it longer than it is.`;

/** The rewrite as the original sat in the text: no quotes or markdown marks Claude added round it. */
function asWritten(rewrite: string, original: string): string {
  let out = rewrite.trim();
  if (/^["\u201C][\s\S]*["\u201D]$/.test(out) && !/^["\u201C]/.test(original)) out = out.slice(1, -1).trim();
  if (!/^#/.test(original)) out = out.replace(/^#{1,6}\s+/, "");
  if (!/^[-*+]\s/.test(original)) out = out.replace(/^[-*+]\s+/, "");
  return out;
}

/**
 * The style pass, shared by the Insights and social drafters: lint the copy
 * (lib/style-lint.ts), ask Claude ONCE to rewrite only the sentences that
 * break the house style, keeping every fact, then lint again. A rewrite is
 * used only if it kept the sentence's numbers, links and product names and
 * didn't grow (maxGrowth); otherwise the original stays and is reported. If
 * the call fails, the copy is kept as written and everything flagged is
 * reported: a style problem never costs a draft.
 */
export async function styleRewrite(pieces: CopyPiece[], opts: { model: string; system: string; maxGrowth?: number }): Promise<StylePass> {
  const text: Record<string, string> = Object.fromEntries(pieces.map((p) => [p.key, p.text]));
  const flag = (p: CopyPiece) => flagSentences(text[p.key] ?? "", { headings: p.headings, ignore: p.ignore });
  const problems = (issues: { message: string }[]) => [...new Set(issues.map((i) => i.message))];
  const items = pieces.flatMap((piece) => flag(piece).map((f) => ({ piece, f })));
  if (!items.length) return { text, flagged: 0, left: [] };

  let error: string | undefined;
  try {
    const list = items.map(({ piece, f }, i) => `${i + 1}. [${piece.label}] ${f.text}\n   Problem: ${problems(f.issues).join(" ")}`);
    const user = `Rewrite these ${items.length} sentence(s), then save them with save_rewrites.\n\n${list.join("\n\n")}`;
    const res = await toolCall<{ rewrites?: { n: number; rewrite: string }[] }>(
      new Anthropic(), `${opts.system}\n\n${EDITOR}`, user, REWRITE, 4000, opts.model
    );
    const growth = opts.maxGrowth ?? 1.3;
    for (const r of res.rewrites ?? []) {
      const item = items[r.n - 1];
      if (!item || typeof r.rewrite !== "string") continue;
      const before = item.f.text;
      const after = asWritten(r.rewrite, before);
      if (after === before || !keepsFacts(before, after) || after.length > before.length * growth + 10) continue;
      const current = text[item.piece.key];
      if (current.includes(before)) text[item.piece.key] = current.split(before).join(after);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }
  const left = pieces.flatMap((p) => flag(p).map((f) => ({ label: p.label, sentence: f.text, problems: problems(f.issues) })));
  return { text, flagged: items.length, left, ...(error ? { error } : {}) };
}

/**
 * The style pass for the editor to read: one line when it's clean, else the
 * sentences to fix. `fix` says where: "before publishing", "in Buffer".
 */
export function styleReport(style: StylePass, fix: string): string[] {
  if (!style.left.length) {
    return [style.flagged
      ? `STYLE CHECK: clean. 21e8 rewrote ${style.flagged} sentence(s) that had an em dash or another break from the house style.`
      : "STYLE CHECK: clean, no em dashes or other breaks from the house style."];
  }
  // The error itself goes to the run's log, never to what Doug reads (23 Oct 2026).
  const why = style.error ? " The rewrite didn't run this time." : "";
  return [
    `STYLE CHECK: ${style.left.length} sentence(s) still have an em dash or another break from the house style.${why} Fix them ${fix}:`,
    ...style.left.map((l) => `- ${l.label}: "${l.sentence}" ${l.problems.join(" ")}`),
  ];
}

/** An Insights draft through the style pass: title (sentence case too), excerpt and body. */
export async function polishDraft(draft: Draft): Promise<{ draft: Draft; style: StylePass }> {
  const style = await styleRewrite(
    [
      { key: "title", label: "Title", text: draft.title, headings: "whole" },
      { key: "excerpt", label: "Excerpt", text: draft.excerpt, headings: "none" },
      { key: "body", label: "Body", text: draft.body, headings: "markdown" },
    ],
    { model: MODEL, system: VOICE }
  );
  return { draft: { ...draft, title: style.text.title, excerpt: style.text.excerpt, body: style.text.body }, style };
}
