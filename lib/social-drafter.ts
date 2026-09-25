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

HOUSE STYLE (docs/STYLE.md): sentence case for headings ("Where the colour goes", not "Where The Colour Goes"). Product names exactly: TrafficPatternsXD, TrafficPatterns, PreMark, DuraTherm, DecoMark, AirMark, StreetBond, StreetBondSR, MMAX, DuraShield, StreetPrint, ChipFill, AggreFill, Fast Patch DPR. The company is HUB Surface Systems, then HUB; never "Hub". The printed book is the Idea Book, never "the catalogue". Places as city and province spelled out (Milton, Ontario). Spaced em dash for an aside, en dash for spans (10–20 years). No counts as a selling point.

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
