import { NextRequest, NextResponse } from "next/server";
import {
  getQueuedPost,
  updateQueuedPost,
  getTextForPlatform,
  truncateForPlatform,
  validatePost,
  PLATFORM_CONFIG,
  type Platform,
  type PostResult,
  type SocialPost,
} from "@/lib/social";

const ADMIN_PW = process.env.ADMIN_PASSWORD;

function auth(req: NextRequest) {
  return req.headers.get("x-admin-password") === ADMIN_PW;
}

// Platform posting functions — each returns a PostResult
// These are stubs until OAuth tokens are configured per platform

async function postToLinkedIn(text: string, _media?: SocialPost["media"]): Promise<PostResult> {
  if (!process.env.LINKEDIN_ACCESS_TOKEN) {
    return { platform: "linkedin", success: false, error: "LINKEDIN_ACCESS_TOKEN not configured. Add your LinkedIn OAuth token to .env.local" };
  }
  try {
    // LinkedIn API v2 — POST to /ugcPosts
    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:organization:${process.env.LINKEDIN_ORG_ID}`,
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
      return { platform: "linkedin", success: false, error: `LinkedIn API error: ${res.status} ${err}` };
    }
    const data = await res.json();
    return { platform: "linkedin", success: true, url: `https://www.linkedin.com/feed/update/${data.id}` };
  } catch (err) {
    return { platform: "linkedin", success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

async function postToFacebook(text: string, _media?: SocialPost["media"]): Promise<PostResult> {
  if (!process.env.FACEBOOK_PAGE_TOKEN) {
    return { platform: "facebook", success: false, error: "FACEBOOK_PAGE_TOKEN not configured. Add your Facebook Page Access Token to .env.local" };
  }
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        access_token: process.env.FACEBOOK_PAGE_TOKEN,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { platform: "facebook", success: false, error: `Facebook API error: ${res.status} ${err}` };
    }
    const data = await res.json();
    return { platform: "facebook", success: true, url: `https://www.facebook.com/${data.id}` };
  } catch (err) {
    return { platform: "facebook", success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

async function postToInstagram(text: string, media?: SocialPost["media"]): Promise<PostResult> {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    return { platform: "instagram", success: false, error: "INSTAGRAM_ACCESS_TOKEN not configured. Add your Instagram Business Account token to .env.local" };
  }
  if (!media?.url) {
    return { platform: "instagram", success: false, error: "Instagram requires an image. Add media to this post." };
  }
  try {
    const igUserId = process.env.INSTAGRAM_USER_ID;
    const imageUrl = media.url.startsWith("http") ? media.url : `https://hubss.com${media.url}`;
    // Step 1: Create media container
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: text,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      }),
    });
    if (!containerRes.ok) {
      const err = await containerRes.text();
      return { platform: "instagram", success: false, error: `Instagram container error: ${containerRes.status} ${err}` };
    }
    const container = await containerRes.json();
    // Step 2: Publish
    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      }),
    });
    if (!publishRes.ok) {
      const err = await publishRes.text();
      return { platform: "instagram", success: false, error: `Instagram publish error: ${publishRes.status} ${err}` };
    }
    const pub = await publishRes.json();
    return { platform: "instagram", success: true, url: `https://www.instagram.com/p/${pub.id}` };
  } catch (err) {
    return { platform: "instagram", success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

async function postToX(text: string, _media?: SocialPost["media"]): Promise<PostResult> {
  if (!process.env.X_BEARER_TOKEN) {
    return { platform: "x", success: false, error: "X_BEARER_TOKEN not configured. Add your X/Twitter OAuth 2.0 token to .env.local" };
  }
  try {
    const res = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.X_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { platform: "x", success: false, error: `X API error: ${res.status} ${err}` };
    }
    const data = await res.json();
    return { platform: "x", success: true, url: `https://x.com/HUB_SS/status/${data.data.id}` };
  } catch (err) {
    return { platform: "x", success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

const PLATFORM_POSTERS: Record<Platform, (text: string, media?: SocialPost["media"]) => Promise<PostResult>> = {
  linkedin: postToLinkedIn,
  facebook: postToFacebook,
  instagram: postToInstagram,
  x: postToX,
};

export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { postId, platforms } = await req.json() as { postId: string; platforms?: Platform[] };

    const post = getQueuedPost(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { valid, errors } = validatePost(post);
    if (!valid) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const targetPlatforms = platforms || post.platforms;
    const results: PostResult[] = [];

    for (const platform of targetPlatforms) {
      const text = truncateForPlatform(getTextForPlatform(post, platform), platform);
      const result = await PLATFORM_POSTERS[platform](text, post.media);
      results.push(result);
    }

    // Update post status
    const allSucceeded = results.every((r) => r.success);
    const anySucceeded = results.some((r) => r.success);
    const postUrls: Partial<Record<Platform, string>> = {};
    const errorMsgs: string[] = [];

    for (const r of results) {
      if (r.success && r.url) postUrls[r.platform] = r.url;
      if (!r.success && r.error) errorMsgs.push(`${PLATFORM_CONFIG[r.platform].name}: ${r.error}`);
    }

    updateQueuedPost(postId, {
      status: allSucceeded ? "posted" : anySucceeded ? "posted" : "failed",
      postedAt: anySucceeded ? new Date().toISOString() : undefined,
      postUrls: { ...post.postUrls, ...postUrls },
      error: errorMsgs.length > 0 ? errorMsgs.join("; ") : undefined,
    });

    return NextResponse.json({ results, allSucceeded });
  } catch (err) {
    console.error("Social post error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Post failed" },
      { status: 500 }
    );
  }
}
