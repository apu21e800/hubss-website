/**
 * Social drafts for new Field Notes: a published post → one draft per
 * connected Buffer channel → an email to the editors. Nothing is posted:
 * Vern or Doug approves and schedules each draft in Buffer.
 *
 * Run daily by app/api/cron/social-drafts (vercel.json). A post qualifies once
 * it is live (in this deployment's built list, lib/blog.ts), is dated on or
 * after SOCIAL_SINCE, and has no socialLog yet. The 74 posts imported on
 * 24 Sep 2026 are all dated earlier, so the library doesn't flood Buffer on
 * the first run. There is no "recent" window on purpose: an AI draft can sit
 * in Studio for weeks before someone publishes it, and it should still get
 * its social drafts the day it goes live.
 *
 * Every link carries UTM tags (utm_source = the network, utm_medium=social,
 * utm_campaign=field-notes, utm_content = the post's slug), so GA4 shows which
 * posts and networks bring Lunch & Learn bookings.
 */

import { Resend } from "resend";
import { sanityWriteClient } from "@/lib/sanity.write";
import { getAllPosts, getPost } from "@/lib/blog";
import { bufferChannels, createBufferDraft, type BufferChannel } from "@/lib/buffer";
import { writeSocialCopy, type SocialCopy } from "@/lib/social-drafter";
import { isSanityImage, sanityOgImage } from "@/lib/photos";

/** Posts published before this never get social drafts (the imported library). */
export const SOCIAL_SINCE = "2026-09-25";
const MAX_POSTS_PER_RUN = 2;

/** Which copy each Buffer service gets, and what it needs. */
const SERVICES: Record<string, { copy: keyof SocialCopy; utm: string; image?: "portrait" | "landscape"; needsImage?: boolean; metadata?: Record<string, unknown> }> = {
  linkedin: { copy: "linkedin", utm: "linkedin", image: "landscape" },
  facebook: { copy: "facebook", utm: "facebook", image: "landscape", metadata: { facebook: { type: "post" } } },
  instagram: { copy: "instagram", utm: "instagram", image: "portrait", needsImage: true, metadata: { instagram: { type: "post", shouldShareToFeed: true } } },
  twitter: { copy: "x", utm: "x", image: "landscape" },
  x: { copy: "x", utm: "x", image: "landscape" },
  threads: { copy: "short", utm: "threads", image: "landscape" },
  bluesky: { copy: "short", utm: "bluesky", image: "landscape" },
  mastodon: { copy: "short", utm: "mastodon", image: "landscape" },
};

const utmLink = (slug: string, source: string) =>
  // utm_campaign was "field-notes" until 25 Sep 2026; renamed with the site's
  // Insights label before the first post went out, so GA4 has one campaign.
  `https://hubss.com/blog/${slug}?utm_source=${source}&utm_medium=social&utm_campaign=insights&utm_content=${encodeURIComponent(slug)}`;

/** Instagram wants 4:5 portrait; everything else gets the 1200×630 share crop. */
function imageFor(src: string | undefined, shape: "portrait" | "landscape" | undefined): string | undefined {
  if (!src || !shape || !isSanityImage(src)) return undefined;
  if (shape === "landscape") return sanityOgImage(src);
  const url = new URL(src);
  url.searchParams.set("w", "1080");
  url.searchParams.set("h", "1350");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("fm", "jpg");
  url.searchParams.set("q", "85");
  return url.toString();
}

export interface SocialResult {
  slug: string;
  title: string;
  drafted: { service: string; channel: string }[];
  skipped: { service: string; channel: string; why: string }[];
}

export async function draftSocialForNewPosts(now = new Date()): Promise<{ posts: SocialResult[]; waiting: number }> {
  const client = sanityWriteClient();
  const logged = new Set<string>(await client.fetch(`*[_type == "socialLog"].slug`));
  // Oldest first, so a backlog goes out in the order it was published.
  const due = (await getAllPosts()).filter((p) => p.date >= SOCIAL_SINCE && !logged.has(p.slug)).reverse();
  if (!due.length) return { posts: [], waiting: 0 };

  const channels = await bufferChannels();
  const results: SocialResult[] = [];
  for (const meta of due.slice(0, MAX_POSTS_PER_RUN)) {
    const post = await getPost(meta.slug);
    if (!post) continue;
    const links = {
      linkedin: utmLink(post.slug, "linkedin"),
      facebook: utmLink(post.slug, "facebook"),
      instagram: utmLink(post.slug, "instagram"),
      x: utmLink(post.slug, "x"),
      short: utmLink(post.slug, "threads"),
    };
    const copy = await writeSocialCopy({ title: post.title, excerpt: post.excerpt, text: post.text, type: post.category }, links);

    const result: SocialResult = { slug: post.slug, title: post.title, drafted: [], skipped: [] };
    const drafts: { _key: string; service: string; channel: string; bufferPostId: string }[] = [];
    for (const ch of channels) {
      const service = ch.service.toLowerCase();
      const rule = SERVICES[service];
      const label = ch.displayName || ch.name;
      if (!rule) { result.skipped.push({ service, channel: label, why: "not a network this pipeline writes for (YouTube needs a video)" }); continue; }
      let text = copy[rule.copy];
      // The short copy was written with the Threads link; give each network its own.
      if (rule.copy === "short") text = text.replace(links.short, utmLink(post.slug, rule.utm));
      const imageUrl = imageFor(post.featuredImage, rule.image);
      if (rule.needsImage && !imageUrl) { result.skipped.push({ service, channel: label, why: "Instagram needs a photo and the post has none" }); continue; }
      try {
        const id = await createBufferDraft({ channelId: ch.id, text, imageUrl, imageAlt: post.featuredImageAlt ?? post.title, metadata: rule.metadata });
        drafts.push({ _key: ch.id, service, channel: label, bufferPostId: id });
        result.drafted.push({ service, channel: label });
      } catch (err) {
        result.skipped.push({ service, channel: label, why: err instanceof Error ? err.message : String(err) });
      }
    }

    // Logged even if some channels failed, so a post is never drafted twice;
    // what failed is in the log and in the email.
    await client.createIfNotExists({
      _id: `socialLog-${post.slug}`,
      _type: "socialLog",
      slug: post.slug,
      title: post.title,
      createdAt: now.toISOString(),
      drafts,
      skipped: result.skipped.map((s, i) => ({ _key: `s${i}`, ...s })),
    });
    console.log(`[social] ${post.slug}: ${result.drafted.length} Buffer draft(s), ${result.skipped.length} skipped`);
    await notify(result);
    results.push(result);
  }
  return { posts: results, waiting: Math.max(0, due.length - MAX_POSTS_PER_RUN) };
}

function channelList(xs: { service: string; channel: string }[]) {
  return xs.map((x) => `${x.channel} (${x.service})`).join(", ");
}

async function notify(r: SocialResult) {
  const to = (process.env.BLOG_DRAFT_NOTIFY ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length || !process.env.RESEND_API_KEY) return;
  const text = [
    `Social drafts for the new Insights article "${r.title}" are waiting in Buffer. Nothing posts until you approve and schedule them.`,
    "",
    r.drafted.length ? `Drafted: ${channelList(r.drafted)}` : "Nothing was drafted.",
    ...(r.skipped.length ? ["", "Skipped:", ...r.skipped.map((s) => `- ${s.channel} (${s.service}): ${s.why}`)] : []),
    "",
    "Review them: https://publish.buffer.com/drafts",
  ].join("\n");
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "HUB Surface Systems <noreply@hubss.com>",
    to,
    subject: `Social drafts ready in Buffer: ${r.title}`,
    text,
  });
  if (error) console.error("[social] email failed:", error);
}
