import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getPost, getAllPosts } from "@/lib/mdx";
import type { Platform } from "@/lib/social";

const ADMIN_PW = process.env.ADMIN_PASSWORD;

function auth(req: NextRequest) {
  return req.headers.get("x-admin-password") === ADMIN_PW;
}

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  linkedin: `LinkedIn post (professional tone, 1200-2000 chars). Use line breaks for readability. Include 3-5 relevant hashtags at the end. Open with a hook that speaks to municipal engineers, urban planners, or contractors. Reference Canadian context where natural.`,
  facebook: `Facebook post (engaging, 300-800 chars). Conversational and community-focused. Include 1-2 relevant hashtags. Use emoji sparingly (1-2 max). Encourage engagement with a question or CTA.`,
  instagram: `Instagram caption (visual-first, 500-1500 chars). Start with a strong opening line. Use line breaks between thoughts. Include 15-20 relevant hashtags at the end (separated by a line break). Include a CTA like "Link in bio" if referencing the blog.`,
  x: `X/Twitter post (under 270 chars to leave room for a link). Punchy, direct, newsworthy angle. Include 1-2 hashtags inline. No emoji unless it adds clarity.`,
};

export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { blogSlug, topic, platforms, tone } = body as {
      blogSlug?: string;
      topic?: string;
      platforms?: Platform[];
      tone?: string;
    };

    const targetPlatforms: Platform[] = platforms || ["linkedin", "facebook", "instagram", "x"];
    const toneGuide = tone === "casual" ? "casual and friendly" : tone === "engaging" ? "engaging and energetic" : "professional and authoritative";

    // Build context from blog post or topic
    let context = "";
    let blogTitle = "";
    let blogUrl = "";

    if (blogSlug) {
      try {
        const post = getPost(blogSlug);
        blogTitle = post.title;
        blogUrl = `https://hubss.com/blog/${blogSlug}`;
        // Use first 3000 chars of content to stay within reasonable prompt size
        const truncatedContent = post.content.substring(0, 3000);
        context = `Blog post title: "${post.title}"
Blog URL: ${blogUrl}
Excerpt: ${post.excerpt}
Content (truncated):
${truncatedContent}`;
      } catch {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }
    } else if (topic) {
      context = `Topic: ${topic}

Generate social media content about this topic for HUB Surface Systems (HUBSS), a Canadian leader in decorative and functional pavement solutions. Products include stamped asphalt (StreetPrint), preformed thermoplastics (TrafficPatterns, TrafficPatternsXD), MMA coatings (MMAX), decorative markings (DecoMark, DuraTherm), protective coatings (DuraShield, StreetBond), preformed markings (PreMark), and airport markings (AirMark).`;
    } else {
      // Auto-select a recent blog post
      const posts = getAllPosts();
      if (posts.length === 0) {
        return NextResponse.json({ error: "No blog posts available" }, { status: 404 });
      }
      const post = getPost(posts[0].slug);
      blogTitle = post.title;
      blogUrl = `https://hubss.com/blog/${post.slug}`;
      context = `Blog post title: "${post.title}"
Blog URL: ${blogUrl}
Excerpt: ${post.excerpt}
Content (truncated):
${post.content.substring(0, 3000)}`;
    }

    const platformInstructions = targetPlatforms
      .map((p) => `### ${p.toUpperCase()}\n${PLATFORM_INSTRUCTIONS[p]}`)
      .join("\n\n");

    const systemPrompt = `You are a social media manager for HUB Surface Systems (HUBSS), a Canadian company that is the leader in decorative and functional pavement solutions. They serve municipalities, developers, and contractors across Canada.

Brand voice: ${toneGuide}. Technical credibility meets civic pride. Reference Canadian municipalities, Vision Zero, Complete Streets, and AODA compliance naturally.

Company social handles:
- LinkedIn: HUB Surface Systems
- X/Twitter: @HUB_SS
- Instagram: @hub_surface_systems
- Facebook: HUB Surface Systems

Website: https://hubss.com

IMPORTANT: Generate ONLY the post text for each platform. No meta-commentary, no explanations. Each platform's content should be unique — not just the same text reformatted.${blogUrl ? `\n\nAlways include the blog URL (${blogUrl}) where appropriate.` : ""}`;

    const userPrompt = `Generate social media posts for the following platforms based on this content:

${context}

---

Generate one post per platform. Output as JSON with platform names as keys:

${platformInstructions}

Respond with ONLY a JSON object like:
{
  "linkedin": "post text here...",
  "facebook": "post text here...",
  "instagram": "post text here...",
  "x": "post text here..."
}

Only include the platforms requested: ${targetPlatforms.join(", ")}`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Extract text from response
    const responseText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    // Parse JSON from response (handle markdown code blocks)
    let generated: Record<string, string>;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      generated = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json({
      generated,
      blogSlug: blogSlug || undefined,
      blogTitle: blogTitle || undefined,
      blogUrl: blogUrl || undefined,
    });
  } catch (err) {
    console.error("Social generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
