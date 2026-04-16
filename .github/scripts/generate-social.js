#!/usr/bin/env node
/**
 * .github/scripts/generate-social.js
 *
 * Reads an MDX blog post, extracts content, and generates social media copy
 * for LinkedIn, Instagram, and Twitter/X.
 *
 * - Uses @anthropic-ai/sdk when ANTHROPIC_API_KEY is set in the environment.
 * - Falls back to structured templates when the API key is absent (local dev,
 *   forks without secrets, etc.).
 *
 * Usage:
 *   node .github/scripts/generate-social.js content/blog/my-post.mdx
 *
 * Output:
 *   Writes content/blog/my-post.social.json  (JSON: { title, slug, linkedin, instagram, twitter })
 *   Also prints the JSON to stdout for CI step-summary consumption.
 */

const fs   = require("fs");
const path = require("path");

// ── 1. Parse arguments ────────────────────────────────────────────────────────

const [, , filePath] = process.argv;

if (!filePath) {
  console.error("Usage: node generate-social.js <path-to-mdx-file>");
  process.exit(1);
}

const resolved = path.resolve(filePath);

if (!fs.existsSync(resolved)) {
  console.error(`File not found: ${resolved}`);
  process.exit(1);
}

// ── 2. Parse frontmatter + body with gray-matter ──────────────────────────────

// gray-matter is a production dependency of the project — always available.
const matter = require("gray-matter");

const raw          = fs.readFileSync(resolved, "utf8");
const { data: fm, content: rawBody } = matter(raw);

const title   = fm.title   || "";
const date    = fm.date    ? String(fm.date).slice(0, 10) : "";
const excerpt = fm.excerpt || fm.description || "";
const slug    = path.basename(resolved, ".mdx");

// ── 3. Strip MDX / JSX / Markdown syntax from body ───────────────────────────

function extractPlainText(body, wordLimit = 200) {
  let text = body;

  // Remove import/export lines
  text = text.replace(/^(import|export)\s+.*$/gm, "");

  // Remove JSX comment blocks {/* ... */}
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // Remove JSX expressions { ... }
  text = text.replace(/\{[^}]*\}/g, "");

  // Remove self-closing component tags  <ComponentName ... />
  text = text.replace(/<[A-Z][A-Za-z0-9]*[^>]*\/>/g, "");

  // Remove component block tags  <ComponentName ...>...</ComponentName>
  text = text.replace(/<[A-Z][A-Za-z0-9]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, "");

  // Remove remaining HTML tags
  text = text.replace(/<\/?[a-zA-Z][^>]*>/g, "");

  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, "");

  // Remove inline code
  text = text.replace(/`[^`]*`/g, "");

  // Remove Markdown images
  text = text.replace(/!\[.*?\]\(.*?\)/g, "");

  // Replace Markdown links with their label text
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

  // Remove Markdown heading markers
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}\s*$/gm, "");

  // Collapse whitespace
  text = text.replace(/\r?\n/g, " ").replace(/\s{2,}/g, " ").trim();

  return text.split(" ").filter(Boolean).slice(0, wordLimit).join(" ");
}

const bodyContent = extractPlainText(rawBody, 200);

// ── 4. Instagram hashtag set (fixed per brand brief) ─────────────────────────

const INSTAGRAM_HASHTAGS = [
  "#hubss",
  "#decorativepavement",
  "#stampedAsphalt",
  "#urbandesign",
  "#municipalinfrastructure",
  "#streetdesign",
  "#canadianinfrastructure",
  "#hardscape",
  "#civicdesign",
  "#completestreets",
].join(" ");

// ── 5. Template fallback (no API key) ────────────────────────────────────────

function templateFallback({ title, excerpt, slug }) {
  const cta = `https://hubss.com/blog/${slug}`;

  const linkedin = [
    `${title}`,
    "",
    excerpt || "HUB Surface Systems delivers decorative hardscape solutions that transform municipal infrastructure into civic landmarks.",
    "",
    "From stamped asphalt crosswalks to branded transit corridors, our systems are engineered for the demands of Canadian infrastructure — built to last, designed to inspire.",
    "",
    "Whether you're specifying for a complete streets project, a school zone, or a high-volume transit node, HUBSS brings technical authority and aesthetic precision to every surface.",
    "",
    `Read the full case study → ${cta}`,
    "",
    "#HUBSS #DecorativeHardscape #MunicipalInfrastructure",
  ].join("\n");

  const instagram = [
    `${title} 🛣️`,
    "",
    excerpt || "Transforming municipal surfaces into civic landmarks — one intersection at a time.",
    "",
    `Link in bio → ${cta}`,
    "",
    INSTAGRAM_HASHTAGS,
  ].join("\n");

  const twitter = `${title} — ${(excerpt || "Decorative hardscape solutions for Canadian municipalities.").slice(0, 120)} ${cta}`.slice(0, 240);

  return { linkedin, instagram, twitter };
}

// ── 6. Claude API generation ──────────────────────────────────────────────────

async function generateWithClaude({ title, excerpt, bodyContent, slug }) {
  // @anthropic-ai/sdk is a production dependency — always available
  const Anthropic = require("@anthropic-ai/sdk");
  const client    = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });
  const cta       = `https://hubss.com/blog/${slug}`;

  const prompt = `You are a senior content strategist for HUB Surface Systems (HUBSS), a Canadian decorative hardscape company specialising in stamped asphalt, decorative crosswalks, and civic surface design.

Brand voice: Technical authority meets civic pride. Write for an audience of municipal engineers, landscape architects, and urban planners. Be specific, confident, and never generic. Avoid filler phrases like "transforming communities" unless backed by a specific outcome.

Blog post details:
- Title: ${title}
- Excerpt: ${excerpt}
- Opening content: ${bodyContent}
- Direct URL: ${cta}

Generate THREE social media variants:

1. LINKEDIN
   - 200–280 words
   - Professional tone suited to municipal decision-makers and infrastructure specifiers
   - Open with a concrete observation or insight (not a question)
   - Include one specific technical detail or project outcome from the content
   - End with: "Read more → ${cta}"
   - Include 2–3 relevant professional hashtags at the end (e.g. #MunicipalInfrastructure #CompleteStreets #UrbanDesign)

2. INSTAGRAM
   - Exactly 90 words of caption text (not counting hashtags)
   - More visual and evocative — paint a picture of the physical space
   - End caption with: "Link in bio"
   - On a new line after the caption, add exactly these 10 hashtags:
     ${INSTAGRAM_HASHTAGS}

3. TWITTER
   - Under 240 characters total (including the URL)
   - Punchy, declarative — lead with the most compelling fact or outcome
   - Include the URL: ${cta}

Return ONLY valid JSON. No markdown fences, no preamble, no commentary:
{
  "linkedin": "...",
  "instagram": "...",
  "twitter": "..."
}`;

  const message = await client.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 1200,
    messages:   [{ role: "user", content: prompt }],
  });

  const raw = message.content?.[0]?.text ?? "";

  // Strip accidental markdown fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned);
}

// ── 7. Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📄 Processing: ${filePath}`);
  console.log(`   Title:   ${title || "(no title found)"}`);
  console.log(`   Excerpt: ${(excerpt || "(none)").slice(0, 80)}…`);
  console.log(`   Body:    ${bodyContent.slice(0, 80)}…`);

  let social;

  if (process.env.ANTHROPIC_API_KEY) {
    console.log("   🤖 ANTHROPIC_API_KEY detected — calling Claude API…");
    try {
      social = await generateWithClaude({ title, excerpt, bodyContent, slug });
      console.log("   ✅ Claude generation successful.");
    } catch (err) {
      console.error(`   ⚠️  Claude API error: ${err.message}`);
      console.error("   ↩️  Falling back to template generation.");
      social = templateFallback({ title, excerpt, slug });
    }
  } else {
    console.log("   ℹ️  No ANTHROPIC_API_KEY — using template fallback.");
    social = templateFallback({ title, excerpt, slug });
  }

  // Build output payload
  const output = {
    title,
    slug,
    date,
    generatedAt: new Date().toISOString(),
    source:      filePath,
    linkedin:    social.linkedin,
    instagram:   social.instagram,
    twitter:     social.twitter,
  };

  // Write companion .social.json alongside the MDX file
  const outPath = resolved.replace(/\.mdx$/, ".social.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");

  console.log(`   💾 Saved: ${outPath}`);

  // Also print to stdout (picked up by workflow summary step)
  process.stdout.write("\n" + JSON.stringify(output, null, 2) + "\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  // Exit 0 so the workflow step never fails the build
  process.exit(0);
});
