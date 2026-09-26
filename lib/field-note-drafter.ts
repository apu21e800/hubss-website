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
 */

import Anthropic from "@anthropic-ai/sdk";

/** Override with BLOG_DRAFT_MODEL; the default is the model the repo already used. */
const MODEL = process.env.BLOG_DRAFT_MODEL || "claude-opus-4-5";

export interface Draft {
  title: string;
  slug: string;
  excerpt: string;
  searchPhrases: string[];
  body: string;
  factsUsed: string[];
}

export interface FactCheck {
  verdict: "clean" | "needs edits";
  unsupported: { quote: string; reason: string }[];
}

export interface DraftBrief {
  title: string;
  searchPhrase?: string | null;
  type?: string | null;
}

const VOICE = `You write Insights articles for HUB Surface Systems (hubss.com): articles for the people who specify, approve and pay for decorative and functional pavement in Canada: municipal engineers, planners, landscape architects, transit agencies, developers and property managers.

VOICE: relaxed, professional, leaders in the field. Write like a senior specifier explaining something to a peer: plain, confident, concrete, useful. Canadian English (colour, centre, metre, curb). No hype words (revolutionary, game-changing, cutting-edge, unparalleled, world-class), no exclamation marks, no questions to the reader as headings, no "In today's world" openings.

THE FACTS RULE, which beats everything else:
- Every statement about HUB, its systems, specifications, numbers (thickness, service life, skid resistance, cure or open-to-traffic times, years, counts), standards, places, projects and clients must come from the FACTS you are given. If the FACTS don't say it, don't write it.
- Never invent projects, clients, cities, quotes, testimonials, prices, awards, statistics or survey results. Don't name a city, agency or client unless the FACTS name it.
- General context that isn't about HUB (what Vision Zero or Complete Streets are, why contrast helps pedestrians, what freeze-thaw does to paint) is fine in plain words, without numbers.
- If the topic needs a fact you don't have, write around it honestly ("ask HUB for the specification for your site") rather than guessing.

SHAPE: 900 to 1,300 words of markdown. Open with one or two short paragraphs, no heading, that name the problem the reader has. Then four to six sections with "## " headings a reader can scan, and "### " inside a section if it helps. Use a bullet or numbered list where it helps (specification checklists, steps), and a small markdown table when you compare options. No "# " title line, no images, no HTML. End with a short section on how to specify it or take the next step: HUB's spec sheets and Lunch & Learn sessions, from the FACTS, without a hard sell.

LINKS: link the first mention of each HUB system to its page, and link one to three of the RELATED POSTS where they genuinely help, with the URLs given. No other links.

SEARCH: use the target search phrase naturally in the title, in the first paragraph and in one heading. Don't stuff it.

HOUSE STYLE (docs/STYLE.md): sentence case for headings ("Where the colour goes", not "Where The Colour Goes"). Product names exactly: TrafficPatternsXD, TrafficPatterns, PreMark, DuraTherm, DecoMark, AirMark, StreetBond, StreetBondSR, MMAX, DuraShield, StreetPrint, ChipFill, AggreFill, Fast Patch DPR. The company is HUB Surface Systems, then HUB; never "Hub". The printed book is the Idea Book, never "the catalogue". Places as city and province spelled out (Milton, Ontario). No em dashes, none at all: an aside goes between commas or in parentheses, a pivot gets a full stop or a colon, a list gets commas. En dash only inside a span (10–20 years, 2026–27). No counts as a selling point.

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

const SAVE_DRAFT: Anthropic.Tool = {
  name: "save_draft",
  description: "Save the finished Insights draft.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "The headline, under 70 characters, with the target search phrase in it." },
      slug: { type: "string", description: "The URL slug: lowercase words joined by hyphens, under 60 characters." },
      excerpt: { type: "string", description: "Two sentences, under 220 characters: what the reader will get." },
      searchPhrases: { type: "array", items: { type: "string" }, description: "Three to five search phrases this post should win, the target phrase first." },
      body: { type: "string", description: "The article in markdown, as described. No title line." },
      factsUsed: { type: "array", items: { type: "string" }, description: "Each FACT the body relies on, quoted from the FACTS." },
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

async function toolCall<T>(client: Anthropic, system: string, user: string, tool: Anthropic.Tool, maxTokens: number): Promise<T> {
  const res = await client.messages.create({
    model: MODEL,
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
  const system = `You fact-check Insights articles for HUB Surface Systems before a human editor publishes them. You are strict and literal. You compare the DRAFT with the FACTS and list every statement in the draft about HUB, its systems, specifications, numbers, standards, places, projects or clients that the FACTS do not support, including numbers that differ, capabilities the FACTS don't claim, and any named city, agency, project or client not in the FACTS. General context that isn't about HUB and has no numbers (what Vision Zero is, why contrast helps) is fine; don't list it. Links are fine. If everything is supported, the verdict is "clean" and the list is empty.`;
  const user = `FACTS:\n${facts}\n\nDRAFT:\n# ${draft.title}\n\n${draft.excerpt}\n\n${draft.body}\n\nReport with the report tool.`;
  const result = await toolCall<FactCheck>(client, system, user, REPORT, 3000);
  return { verdict: result.unsupported?.length ? "needs edits" : "clean", unsupported: result.unsupported ?? [] };
}
