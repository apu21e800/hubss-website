/**
 * Social copy for one published Field Note, one version per channel, written
 * by Claude in HUB's social voice. The post itself is the only source of
 * facts: it was reviewed and published by a person, so the social copy can't
 * say anything the page doesn't.
 */

import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.SOCIAL_DRAFT_MODEL || process.env.BLOG_DRAFT_MODEL || "claude-opus-4-5";

export interface SocialCopy {
  linkedin: string;
  facebook: string;
  instagram: string;
  x: string;
  /** For Threads, Bluesky and anything else short-form. */
  short: string;
}

const SYSTEM = `You write social posts for HUB Surface Systems, a Canadian decorative and functional pavement company, to bring readers to a new Insights article on hubss.com.

VOICE: relaxed, professional, leaders in the field. Confident and plain, never salesy. Canadian English. No hype words, no clickbait, no ALL CAPS. At most one emoji, and only on Facebook or Instagram.

FACTS: say only what the ARTICLE says. No new numbers, claims, places, clients or promises.

HOUSE STYLE (docs/STYLE.md): sentence case for headings ("Where the colour goes", not "Where The Colour Goes"). Product names exactly: TrafficPatternsXD, TrafficPatterns, PreMark, DuraTherm, DecoMark, AirMark, StreetBond, StreetBondSR, MMAX, DuraShield, StreetPrint, ChipFill, AggreFill, Fast Patch DPR. The company is HUB Surface Systems, then HUB; never "Hub". The printed book is the Idea Book, never "the catalogue". Places as city and province spelled out (Milton, Ontario). No em dashes, none at all: an aside goes between commas or in parentheses, a pivot gets a full stop or a colon, a list gets commas. En dash only inside a span (10–20 years, 2026–27). No counts as a selling point.

MACHINE TELLS (docs/STYLE.md, "Machine tells"): readers recognise machine-written copy on sight and it costs trust, so none of these appears in any post:
- Em dashes, anywhere, even one.
- The reversal: "It's not X, it's Y", "not just X", "more than a surface".
- Three of everything: three adjectives, three fragments, three parallel clauses, because three felt complete. Use two, or four, or one.
- Stacked fragments as a device ("Fast. Durable. Proven.").
- "Whether you're a ... or a ...", "From X to Y", "In today's ...", "In a world where ...", "Here's the thing", "Let's dive in", "Think of it as".
- A first line that asks a question, or a first line built as "X: Y" (a post's first line is its heading).
- Filler verbs and adjectives: seamless, robust, elevate, leverage, unlock, empower, harness, streamline, holistic, tailored, bespoke, cutting-edge, game-changing, world-class, best-in-class, premium (as praise), solutions (as filler), journey, landscape (as a metaphor), ensure, delve.
- A closing line that restates the post. The hedge that says nothing ("it's worth noting").
- Exclamation marks. "Discover", "Explore", "Learn more" as the ask; say what happens instead ("Read the article", "Book a Lunch & Learn").
The test: read it aloud. If a person on the phone would not say it, cut it.

EACH POST: one idea from the article that a specifier, planner or property manager would stop for, then the link, then ONE ask. The ask is always the same: the article ends with an offer of a 45-minute Lunch & Learn for their team (samples, specs, lunch included), so invite them to read it and book one. One link only: the exact URL given for that channel.

CHANNELS:
- linkedin: 500 to 1,100 characters. Short paragraphs. Lead with the practical point for people who specify pavement. Up to 3 hashtags at the very end.
- facebook: 250 to 600 characters. Conversational and community-minded. Up to 2 hashtags.
- instagram: 400 to 1,000 characters. Strong first line, line breaks between thoughts. Links aren't clickable on Instagram, so no URL: say "Link in bio". End with 8 to 12 relevant hashtags on their own line (industry and Canadian, e.g. #pavement #urbandesign #canada).
- x: at most 240 characters INCLUDING the URL (count a URL as 23 characters). One hashtag at most.
- short: at most 280 characters including the URL, for Threads and Bluesky. No hashtags.`;

const TOOL: Anthropic.Tool = {
  name: "save_social",
  description: "Save the social posts.",
  input_schema: {
    type: "object",
    properties: {
      linkedin: { type: "string" },
      facebook: { type: "string" },
      instagram: { type: "string" },
      x: { type: "string" },
      short: { type: "string" },
    },
    required: ["linkedin", "facebook", "instagram", "x", "short"],
  },
};

export async function writeSocialCopy(article: { title: string; excerpt: string; text: string; type: string }, links: Record<keyof SocialCopy, string>): Promise<SocialCopy> {
  const client = new Anthropic();
  const user = [
    `ARTICLE (${article.type}): ${article.title}`,
    article.excerpt,
    "",
    article.text.slice(0, 9000),
    "",
    "LINKS (use exactly these, one per channel; none for instagram):",
    ...Object.entries(links).filter(([k]) => k !== "instagram").map(([k, v]) => `- ${k}: ${v}`),
    "",
    "Save them with save_social.",
  ].join("\n");
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 3000,
    system: SYSTEM,
    tools: [TOOL],
    tool_choice: { type: "tool", name: TOOL.name },
    messages: [{ role: "user", content: user }],
  });
  const block = res.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
  if (!block) throw new Error(`Claude returned no social copy (stop reason: ${res.stop_reason})`);
  const copy = block.input as SocialCopy;
  for (const k of ["linkedin", "facebook", "instagram", "x", "short"] as const) {
    if (typeof copy[k] !== "string" || !copy[k].trim()) throw new Error(`The ${k} copy came back empty`);
  }
  return copy;
}
