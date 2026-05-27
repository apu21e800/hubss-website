#!/usr/bin/env node
/**
 * generate-social-post.mjs
 *
 * Reads blog post(s) from content/blog/, generates platform-specific social copy
 * via Claude, attempts to post to each platform (gated behind env vars), and saves
 * draft files for any platform that couldn't post automatically.
 *
 * Usage:
 *   node .github/scripts/generate-social-post.mjs "slug1,slug2"
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(process.cwd());
const DRAFTS_DIR = join(ROOT, "social-drafts");

const slugs = (process.argv[2] || "").split(",").map((s) => s.trim()).filter(Boolean);

if (slugs.length === 0) {
  console.error("No slugs provided. Usage: node generate-social-post.mjs slug1,slug2");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---------- Platform posting functions (gated behind env vars) ----------

async function postToLinkedIn(text) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORG_ID;
  if (!token || !orgId) return { success: false, reason: "LINKEDIN_ACCESS_TOKEN or LINKEDIN_ORG_ID not configured" };

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: `urn:li:organization:${orgId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, reason: `LinkedIn API ${res.status}: ${err}` };
  }
  const data = await res.json();
  return { success: true, url: `https://www.linkedin.com/feed/update/${data.id}` };
}

async function postToFacebook(text, pageUrl) {
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!token || !pageId) return { success: false, reason: "FACEBOOK_PAGE_TOKEN or FACEBOOK_PAGE_ID not configured" };

  const message = pageUrl ? `${text}\n\n${pageUrl}` : text;
  const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, access_token: token }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, reason: `Facebook API ${res.status}: ${err}` };
  }
  return { success: true };
}

async function postToInstagram(caption) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return { success: false, reason: "INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID not configured" };

  // Instagram requires an image. Without a media URL, we can't post directly.
  // Log a note for Vernon to post manually with an image.
  return {
    success: false,
    reason: "Instagram posting requires an image URL. Save the caption from the draft file and post via Instagram Business Manager with your chosen image.",
  };
}

// ---------- Claude generation ----------

async function generateSocialVariants(slug, blogContent, blogUrl) {
  const today = new Date().toISOString().slice(0, 10);

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: `You generate social media posts for HUB Surface Systems, a Canadian decorative pavement company (hubss.com). Brand voice: technical authority, civic pride, Canadian English. Target audience: municipal engineers, planners, contractors, and community advocates.`,
    messages: [
      {
        role: "user",
        content: `Generate social media posts for this blog post published on ${today}:

Blog URL: ${blogUrl}

---
${blogContent.slice(0, 3000)}
---

Generate exactly this JSON structure (no markdown, just raw JSON):
{
  "linkedin": "Professional post, 1000-1500 chars, line breaks for readability, 3-5 hashtags at end, open with a hook for engineers/planners",
  "facebook": "Community-focused post, 300-600 chars, 1-2 hashtags, warm and engaging, include the blog URL naturally",
  "instagram": "Visual-first caption, 300-800 chars, 10-15 relevant hashtags on a new line at end, strong opening line, include 'Link in bio' CTA"
}`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  // Strip any markdown code fences if present
  const jsonStr = raw.replace(/^```json?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(jsonStr);
}

// ---------- Main ----------

async function processSlug(slug) {
  const filePath = join(ROOT, "content", "blog", `${slug}.mdx`);
  if (!existsSync(filePath)) {
    console.error(`Blog file not found: ${filePath}`);
    return;
  }

  const blogContent = readFileSync(filePath, "utf8");
  const blogUrl = `https://hubss.com/blog/${slug}`;

  console.log(`\n📝 Generating social variants for: ${slug}`);

  let variants;
  try {
    variants = await generateSocialVariants(slug, blogContent, blogUrl);
  } catch (err) {
    console.error(`Failed to generate social copy: ${err.message}`);
    return;
  }

  const results = {};
  const drafts = {};

  // LinkedIn
  console.log("  → LinkedIn...");
  const liResult = await postToLinkedIn(variants.linkedin);
  results.linkedin = liResult;
  if (!liResult.success) {
    console.log(`     ⚠ ${liResult.reason}`);
    drafts.linkedin = variants.linkedin;
  } else {
    console.log(`     ✓ Posted: ${liResult.url}`);
  }

  // Facebook
  console.log("  → Facebook...");
  const fbResult = await postToFacebook(variants.facebook, blogUrl);
  results.facebook = fbResult;
  if (!fbResult.success) {
    console.log(`     ⚠ ${fbResult.reason}`);
    drafts.facebook = variants.facebook;
  } else {
    console.log("     ✓ Posted to Facebook Page");
  }

  // Instagram (always draft — requires image)
  const igResult = await postToInstagram(variants.instagram);
  results.instagram = igResult;
  drafts.instagram = variants.instagram;
  console.log(`  → Instagram: ${igResult.reason}`);

  // Save draft file if any platforms need manual posting
  if (Object.keys(drafts).length > 0) {
    mkdirSync(DRAFTS_DIR, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const draftPath = join(DRAFTS_DIR, `${date}-${slug}.md`);

    const content = [
      `# Social Drafts — ${slug}`,
      `Generated: ${new Date().toISOString()}`,
      `Blog URL: ${blogUrl}`,
      "",
      "---",
      "",
      ...(drafts.linkedin
        ? [
            "## LinkedIn",
            "",
            drafts.linkedin,
            "",
            `> Status: ${results.linkedin.reason || "Not posted"}`,
            "",
            "---",
            "",
          ]
        : []),
      ...(drafts.facebook
        ? [
            "## Facebook",
            "",
            drafts.facebook,
            "",
            `> Status: ${results.facebook.reason || "Not posted"}`,
            "",
            "---",
            "",
          ]
        : []),
      ...(drafts.instagram
        ? [
            "## Instagram",
            "> Note: Post this manually via Instagram Business Manager with an image.",
            "",
            drafts.instagram,
            "",
            "---",
          ]
        : []),
    ].join("\n");

    writeFileSync(draftPath, content, "utf8");
    console.log(`\n  📄 Draft saved to: ${draftPath}`);
  }

  return results;
}

// Run for all slugs
(async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is required for social post generation.");
    console.error("Add it to GitHub Secrets. See .github/AUTOMATIONS.md for instructions.");
    process.exit(1);
  }

  for (const slug of slugs) {
    await processSlug(slug);
  }

  console.log("\n✅ Social post generation complete.");
})();
