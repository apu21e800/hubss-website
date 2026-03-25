// lib/social.ts
// Social media automation — types, queue management, platform helpers
export { SOCIAL_LINKS } from './social-links';

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ── Types ─────────────────────────────────────────────────────

export type Platform = "linkedin" | "facebook" | "instagram" | "x";

export type PostStatus = "draft" | "scheduled" | "posted" | "failed";

export interface SocialPost {
  id: string;
  platforms: Platform[];
  status: PostStatus;
  content: {
    text: string;
    linkedin?: string;   // platform-specific override
    facebook?: string;
    instagram?: string;
    x?: string;
  };
  media?: {
    url: string;         // path to image in /public/images/
    alt: string;
  };
  blogSlug?: string;     // source blog post if generated from one
  scheduledFor?: string; // ISO date string
  postedAt?: string;     // ISO date string
  postUrls?: Partial<Record<Platform, string>>; // URLs of published posts
  error?: string;
  createdAt: string;     // ISO date string
  updatedAt: string;     // ISO date string
}

export interface GenerateRequest {
  blogSlug?: string;
  topic?: string;
  platforms: Platform[];
  tone?: "professional" | "engaging" | "casual";
}

export interface PostResult {
  platform: Platform;
  success: boolean;
  url?: string;
  error?: string;
}

// ── Constants ─────────────────────────────────────────────────

export const PLATFORM_CONFIG: Record<Platform, { name: string; maxLength: number; color: string; icon: string }> = {
  linkedin:  { name: "LinkedIn",  maxLength: 3000,  color: "#0A66C2", icon: "Linkedin" },
  facebook:  { name: "Facebook",  maxLength: 63206, color: "#1877F2", icon: "Facebook" },
  instagram: { name: "Instagram", maxLength: 2200,  color: "#E4405F", icon: "Instagram" },
  x:         { name: "X",         maxLength: 280,   color: "#000000", icon: "Twitter" },
};

export const ALL_PLATFORMS: Platform[] = ["linkedin", "facebook", "instagram", "x"];

// ── Queue Directory ───────────────────────────────────────────

const queueDir = path.join(process.cwd(), "content/social-queue");

function ensureQueueDir() {
  if (!fs.existsSync(queueDir)) {
    fs.mkdirSync(queueDir, { recursive: true });
  }
}

// ── Queue CRUD ────────────────────────────────────────────────

/** Generate a short unique ID */
function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

/** Convert SocialPost to frontmatter + body JSON file */
function serializePost(post: SocialPost): string {
  const { content, ...meta } = post;
  const frontmatter: Record<string, unknown> = {
    ...meta,
    platforms: meta.platforms.join(","),
  };
  // Store the main text as body, overrides in frontmatter
  const body = content.text;
  const overrides: Record<string, string> = {};
  if (content.linkedin) overrides.linkedin = content.linkedin;
  if (content.facebook) overrides.facebook = content.facebook;
  if (content.instagram) overrides.instagram = content.instagram;
  if (content.x) overrides.x = content.x;
  if (Object.keys(overrides).length > 0) {
    frontmatter.contentOverrides = JSON.stringify(overrides);
  }
  if (meta.media) {
    frontmatter.mediaUrl = meta.media.url;
    frontmatter.mediaAlt = meta.media.alt;
  }
  if (meta.postUrls) {
    frontmatter.postUrls = JSON.stringify(meta.postUrls);
  }
  delete (frontmatter as Record<string, unknown>).media;

  return matter.stringify(body, frontmatter);
}

/** Parse a queue file back into a SocialPost */
function deserializePost(raw: string, filename: string): SocialPost {
  const { data, content: body } = matter(raw);

  const contentObj: SocialPost["content"] = { text: body.trim() };
  if (data.contentOverrides) {
    try {
      const overrides = JSON.parse(data.contentOverrides);
      if (overrides.linkedin) contentObj.linkedin = overrides.linkedin;
      if (overrides.facebook) contentObj.facebook = overrides.facebook;
      if (overrides.instagram) contentObj.instagram = overrides.instagram;
      if (overrides.x) contentObj.x = overrides.x;
    } catch { /* ignore parse errors */ }
  }

  const post: SocialPost = {
    id: data.id || filename.replace(".md", ""),
    platforms: (data.platforms || "").split(",").filter(Boolean) as Platform[],
    status: data.status || "draft",
    content: contentObj,
    blogSlug: data.blogSlug || undefined,
    scheduledFor: data.scheduledFor || undefined,
    postedAt: data.postedAt || undefined,
    error: data.error || undefined,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  if (data.mediaUrl) {
    post.media = { url: data.mediaUrl, alt: data.mediaAlt || "" };
  }

  if (data.postUrls) {
    try {
      post.postUrls = JSON.parse(data.postUrls);
    } catch { /* ignore */ }
  }

  return post;
}

/** Get all posts in the queue, sorted by scheduledFor (soonest first) then createdAt */
export function getAllQueuedPosts(): SocialPost[] {
  ensureQueueDir();
  const files = fs.readdirSync(queueDir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(queueDir, file), "utf-8");
      return deserializePost(raw, file);
    })
    .sort((a, b) => {
      // scheduled first, then by date
      if (a.scheduledFor && b.scheduledFor) {
        return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
      }
      if (a.scheduledFor) return -1;
      if (b.scheduledFor) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/** Get a single post by ID */
export function getQueuedPost(id: string): SocialPost | null {
  ensureQueueDir();
  const filepath = path.join(queueDir, `${id}.md`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf-8");
  return deserializePost(raw, `${id}.md`);
}

/** Create a new post in the queue */
export function createQueuedPost(post: Omit<SocialPost, "id" | "createdAt" | "updatedAt">): SocialPost {
  ensureQueueDir();
  const id = generateId();
  const now = new Date().toISOString();
  const fullPost: SocialPost = {
    ...post,
    id,
    createdAt: now,
    updatedAt: now,
  };
  const filepath = path.join(queueDir, `${id}.md`);
  fs.writeFileSync(filepath, serializePost(fullPost), "utf-8");
  return fullPost;
}

/** Update an existing post */
export function updateQueuedPost(id: string, updates: Partial<SocialPost>): SocialPost | null {
  const existing = getQueuedPost(id);
  if (!existing) return null;

  const updated: SocialPost = {
    ...existing,
    ...updates,
    id, // preserve ID
    updatedAt: new Date().toISOString(),
    content: updates.content || existing.content,
  };

  const filepath = path.join(queueDir, `${id}.md`);
  fs.writeFileSync(filepath, serializePost(updated), "utf-8");
  return updated;
}

/** Delete a post from the queue */
export function deleteQueuedPost(id: string): boolean {
  const filepath = path.join(queueDir, `${id}.md`);
  if (!fs.existsSync(filepath)) return false;
  fs.unlinkSync(filepath);
  return true;
}

/** Get posts that are due to be published (scheduled time has passed) */
export function getDuePosts(): SocialPost[] {
  const now = new Date();
  return getAllQueuedPosts().filter(
    (p) =>
      p.status === "scheduled" &&
      p.scheduledFor &&
      new Date(p.scheduledFor) <= now
  );
}

// ── Platform text helpers ─────────────────────────────────────

/** Get the platform-specific text for a post, falling back to main text */
export function getTextForPlatform(post: SocialPost, platform: Platform): string {
  const override = post.content[platform];
  if (override) return override;
  return post.content.text;
}

/** Truncate text to platform max length, adding ellipsis if needed */
export function truncateForPlatform(text: string, platform: Platform): string {
  const max = PLATFORM_CONFIG[platform].maxLength;
  if (text.length <= max) return text;
  return text.substring(0, max - 3) + "...";
}

/** Check if a post's text is valid for all its target platforms */
export function validatePost(post: SocialPost): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const platform of post.platforms) {
    const text = getTextForPlatform(post, platform);
    const max = PLATFORM_CONFIG[platform].maxLength;
    if (text.length > max) {
      errors.push(`${PLATFORM_CONFIG[platform].name}: ${text.length}/${max} characters (too long)`);
    }
    if (!text.trim()) {
      errors.push(`${PLATFORM_CONFIG[platform].name}: empty content`);
    }
  }
  return { valid: errors.length === 0, errors };
}
