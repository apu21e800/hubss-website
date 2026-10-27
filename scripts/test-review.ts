/**
 * `npm run test:review`: Doug reviews first (lib/review-first.ts) and his
 * review page (lib/review-page.ts, components/review/ReviewView.tsx). No
 * network: Sanity, Buffer and the email are never called here.
 *
 * What it protects: nothing queues in Buffer while review first is on; the
 * page's key is the server's alone (the same for one secret, another for
 * another, none without one) and is compared in constant time; only the
 * drafts 21e8 ticked, and never a live article, reach the page; social posts
 * are grouped by what they're about, waiting before lined up; Toronto's time;
 * and the page Doug reads names no machinery.
 */
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { isReviewKey, reviewFirst, reviewKey, reviewLink, reviewLinkRecordId } from "../lib/review-first";
import { socialAutoQueue, type BufferPost } from "../lib/buffer";
import { aboutLine, groupSocialPosts, networkName, reviewWhen, selectArticles, type RawReviewDraft, type RawSocialLog, type ReviewData } from "../lib/review-page";
import { reviewLinkEmail } from "../lib/review-link";
import ReviewView from "../components/review/ReviewView";
import { lintCopy } from "../lib/style-lint";

let failures = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${err instanceof Error ? err.message : err}`);
  }
}

/** Runs fn with these environment variables set (undefined removes one), then puts them back. */
function withEnv(vars: Record<string, string | undefined>, fn: () => void) {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(vars)) saved[k] = process.env[k];
  try {
    for (const [k, v] of Object.entries(vars)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

console.log("Review first (lib/review-first.ts)");
check("on unless REVIEW_FIRST says off", () => {
  withEnv({ REVIEW_FIRST: undefined }, () => assert.equal(reviewFirst(), true));
  withEnv({ REVIEW_FIRST: "" }, () => assert.equal(reviewFirst(), true));
  withEnv({ REVIEW_FIRST: "on" }, () => assert.equal(reviewFirst(), true));
  for (const v of ["off", "OFF", " no ", "false", "0"]) withEnv({ REVIEW_FIRST: v }, () => assert.equal(reviewFirst(), false, v));
});
check("nothing queues in Buffer while it is on, whatever SOCIAL_AUTO_QUEUE says", () => {
  withEnv({ REVIEW_FIRST: undefined, SOCIAL_AUTO_QUEUE: undefined }, () => assert.equal(socialAutoQueue(), false));
  withEnv({ REVIEW_FIRST: undefined, SOCIAL_AUTO_QUEUE: "on" }, () => assert.equal(socialAutoQueue(), false));
});
check("with it off, posts queue as from 19 Oct, unless SOCIAL_AUTO_QUEUE=off", () => {
  withEnv({ REVIEW_FIRST: "off", SOCIAL_AUTO_QUEUE: undefined }, () => assert.equal(socialAutoQueue(), true));
  withEnv({ REVIEW_FIRST: "off", SOCIAL_AUTO_QUEUE: "off" }, () => assert.equal(socialAutoQueue(), false));
});

console.log("The page's key");
check("the same for one secret, 32 address-safe characters", () => {
  const a = reviewKey("secret-one");
  assert.equal(a, reviewKey("secret-one"));
  assert.equal(a?.length, 32);
  assert.match(a!, /^[A-Za-z0-9_-]{32}$/);
  assert.notEqual(a, reviewKey("secret-two"));
});
check("none without a secret, and then no key passes", () => {
  withEnv({ REVIEW_SECRET: undefined, CRON_SECRET: undefined, SANITY_API_WRITE_TOKEN: undefined }, () => {
    assert.equal(reviewKey(), null);
    assert.equal(reviewLink(), null);
    assert.equal(isReviewKey(""), false);
    assert.equal(isReviewKey("anything"), false);
  });
});
check("REVIEW_SECRET first, then CRON_SECRET, then the Sanity token", () => {
  withEnv({ REVIEW_SECRET: "r", CRON_SECRET: "c", SANITY_API_WRITE_TOKEN: "s" }, () => assert.equal(reviewKey(), reviewKey("r")));
  withEnv({ REVIEW_SECRET: undefined, CRON_SECRET: "c", SANITY_API_WRITE_TOKEN: "s" }, () => assert.equal(reviewKey(), reviewKey("c")));
  withEnv({ REVIEW_SECRET: " ", CRON_SECRET: undefined, SANITY_API_WRITE_TOKEN: "s" }, () => assert.equal(reviewKey(), reviewKey("s")));
});
check("only the exact key passes", () => {
  const key = reviewKey("k")!;
  assert.equal(isReviewKey(key, "k"), true);
  assert.equal(isReviewKey(key.slice(0, -1) + (key.endsWith("A") ? "B" : "A"), "k"), false);
  assert.equal(isReviewKey(key + "x", "k"), false);
  assert.equal(isReviewKey(key.slice(1), "k"), false);
  assert.equal(isReviewKey(undefined, "k"), false);
  assert.equal(isReviewKey(["x"], "k"), false);
  assert.equal(isReviewKey(key, "another secret"), false);
});
check("the link is hubss.com's, and the sent record never carries the key", () => {
  const key = reviewKey("k")!;
  assert.equal(reviewLink("k"), `https://hubss.com/review/${key}`);
  const id = reviewLinkRecordId(key);
  assert.match(id, /^review\.link-[0-9a-f]{12}$/, "private (the dot) and short");
  assert.ok(!id.includes(key));
  assert.notEqual(reviewLinkRecordId(reviewKey("k2")!), id, "a new key is emailed again");
});

console.log("Which articles Doug sees (selectArticles)");
const drafts: RawReviewDraft[] = [
  { _id: "drafts.blogpost-plow", _updatedAt: "2026-10-27T13:05:00Z", title: "How crosswalk markings survive plow season", excerpt: "What a plow does.", category: "Guide", forReview: true, featured: { url: "https://cdn.sanity.io/images/9dbro2m1/production/abc-1600x1000.jpg", alt: "", width: 1600, height: 1000 }, body: [] },
  { _id: "drafts.blogpost-osoyoos", _updatedAt: "2026-10-20T10:00:00Z", title: "Osoyoos lakeside path", category: "Project Profile", forReview: true, scheduled: true, scheduledFor: "2026-10-29T14:00:00.000Z" },
  { _id: "drafts.blogpost-unticked", title: "Not read yet", forReview: false },
  { _id: "drafts.blogpost-edit-of-live", title: "An edit to a live post", forReview: true },
  { _id: "blogpost-published", title: "Already live", forReview: true },
  { _id: "drafts.blogpost-untitled", title: "  ", forReview: true },
];
const picked = selectArticles(drafts, ["blogpost-edit-of-live", "blogpost-published"]);
check("only ticked, never-published drafts with a title", () =>
  assert.deepEqual(picked.map((a) => a.id), ["drafts.blogpost-osoyoos", "drafts.blogpost-plow"]));
check("a scheduled one first, with its time; the rest wait for the OK", () => {
  assert.equal(picked[0].goesLive, "2026-10-29T14:00:00.000Z");
  assert.equal(picked[1].goesLive, undefined);
});
check("the type as the site prints it, and a photo's alt falls back to the title", () => {
  assert.equal(picked[0].kind, "Project");
  assert.equal(picked[1].kind, "Guide");
  assert.equal(picked[1].photo?.alt, "How crosswalk markings survive plow season");
  assert.equal(picked[0].photo, undefined);
});

console.log("How the social posts are grouped (groupSocialPosts)");
const logs: RawSocialLog[] = [
  { slug: "lib:project:victoria-high-school", title: "Victoria High School, Victoria", source: "From the library", createdAt: "2026-10-26T14:00:10Z", postIds: ["p-li", "p-fb", "p-ig"] },
  { slug: "plow-season", title: "How crosswalk markings survive plow season", source: "Article", createdAt: "2026-10-28T14:00:10Z", postIds: ["a-ig", "a-li"] },
];
const post = (id: string, channelService: string, status: BufferPost["status"], extra: Partial<BufferPost> = {}): BufferPost => ({
  id, status, channelService, channelId: `ch-${channelService}`, text: `Text for ${id}`, createdAt: "2026-10-26T14:00:20Z", ...extra,
});
const posts: BufferPost[] = [
  post("p-ig", "instagram", "scheduled", { dueAt: "2026-10-29T15:00:00Z", assets: [{ thumbnail: "https://buffer-media.example/t.jpg", source: "https://cdn.sanity.io/images/9dbro2m1/production/x.jpg?w=1080", image: { altText: "Victoria High School crosswalk" } }] }),
  post("p-fb", "facebook", "scheduled", { dueAt: "2026-10-28T15:00:00Z", assets: [{ thumbnail: "https://buffer-media.example/t2.jpg", source: "https://elsewhere.example/x.jpg" }] }),
  post("p-li", "linkedin", "sent"),
  post("a-ig", "instagram", "draft", { createdAt: "2026-10-28T14:00:30Z" }),
  post("a-li", "linkedin", "needs_approval", { createdAt: "2026-10-28T14:00:31Z" }),
  post("hand-made", "linkedin", "draft", { createdAt: "2026-10-27T09:00:00Z" }),
  post("failed", "facebook", "error"),
  post("blank", "facebook", "draft", { text: "   " }),
];
const groups = groupSocialPosts(posts, logs);
check("one group per record, then posts made by hand; sent, failed and empty ones left out", () =>
  assert.deepEqual(groups.map((g) => [g.key, g.posts.map((p) => p.id)]), [
    ["plow-season", ["a-li", "a-ig"]],
    ["other", ["hand-made"]],
    ["lib:project:victoria-high-school", ["p-fb", "p-ig"]],
  ]));
check("waiting before lined up, LinkedIn, Facebook, Instagram in that order", () => {
  assert.deepEqual(groups[0].posts.map((p) => p.network), ["LinkedIn", "Instagram"]);
  assert.equal(groups[0].posts[0].state, "waiting", "needs_approval waits too");
  assert.equal(groups[2].posts[0].state, "lined up");
  assert.equal(groups[2].posts[0].dueAt, "2026-10-28T15:00:00Z");
});
check("each group says what it's about", () => {
  assert.equal(groups[0].about, "For the article");
  assert.equal(groups[0].title, "How crosswalk markings survive plow season");
  assert.equal(groups[1].about, "Other social posts");
  assert.equal(groups[2].about, "From HUB's projects and the Product Portfolio Book");
  assert.equal(aboutLine("From the field"), "From the job photos");
});
check("the photo HUB sent when it's HUB's, else Buffer's thumbnail; the alt text kept", () => {
  const ig = groups[2].posts.find((p) => p.network === "Instagram")!;
  assert.equal(ig.photo?.url, "https://cdn.sanity.io/images/9dbro2m1/production/x.jpg?w=1080");
  assert.equal(ig.photo?.alt, "Victoria High School crosswalk");
  const fb = groups[2].posts.find((p) => p.network === "Facebook")!;
  assert.equal(fb.photo?.url, "https://buffer-media.example/t2.jpg");
});
check("network names", () => {
  assert.equal(networkName("twitter"), "X");
  assert.equal(networkName("googlebusiness"), "Google Business Profile");
  assert.equal(networkName("newthing"), "Newthing");
});

console.log("Times as Doug reads them (reviewWhen)");
check("summer time, Toronto", () => assert.equal(reviewWhen("2026-10-29T14:00:00.000Z"), "Thursday 29 October, 10:00 a.m."));
check("after the clocks go back", () => assert.equal(reviewWhen("2026-11-03T16:00:00.000Z"), "Tuesday 3 November, 11:00 a.m."));
check("afternoon", () => assert.equal(reviewWhen("2026-11-03T19:30:00.000Z"), "Tuesday 3 November, 2:30 p.m."));
check("nothing for a bad date", () => assert.equal(reviewWhen("not a date"), ""));

console.log("The page Doug reads (ReviewView)");
const data: ReviewData = { articles: picked, social: groups, socialAsOf: "2026-10-28T15:00:00Z" };
const html = renderToStaticMarkup(createElement(ReviewView, { data, now: new Date("2026-10-28T15:05:00Z") }));
const words = html.replace(/<[^>]+>/g, " ").replace(/&#x27;|&apos;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ");
check("shows the articles, the posts and their states", () => {
  assert.match(words, /How crosswalk markings survive plow season/);
  assert.match(words, /Goes live Thursday 29 October, 10:00 a\.m\./);
  assert.match(words, /Waiting for your OK/);
  assert.match(words, /Goes out Wednesday 28 October, 11:00 a\.m\./);
  assert.match(words, /Waiting for your OK: 1 article and 3 social posts\./);
  assert.match(words, /Reply to Vern with OK/);
});
check("names no machinery", () => {
  const banned = /\b(AI|A\.I\.|Claude|Anthropic|automat\w*|Buffer|Studio|Sanity|cron|queue\w*|drafter|by itself|bot|generated)\b/i;
  const hit = words.match(banned);
  assert.equal(hit, null, `the page says "${hit?.[0]}"`);
});
check("keeps the house style", () => {
  const issues = lintCopy(words).filter((i) => !/Title Case/i.test(i.message));
  assert.deepEqual(issues.map((i) => i.message), []);
  assert.ok(!/[—–]{1}\s/.test(words.replace(/\d–\d/g, "")), "no dashes");
});
check("a web address in a post prints as text, never a link", () => {
  const withLink = groupSocialPosts([post("u", "linkedin", "draft", { text: "Read it: https://hubss.com/blog/x?utm_source=linkedin&utm_medium=social" })], []);
  const out = renderToStaticMarkup(createElement(ReviewView, { data: { articles: [], social: withLink }, now: new Date() }));
  assert.ok(out.includes("https://hubss.com/blog/x?utm_source=linkedin&amp;utm_medium=social"));
  assert.ok(!/href="https:\/\/hubss\.com\/blog\/x/.test(out));
});
check("says so when nothing could be read, rather than \"nothing waiting\"", () => {
  const out = renderToStaticMarkup(createElement(ReviewView, { data: { articles: [], social: [], articlesError: true, socialError: true }, now: new Date() }));
  assert.match(out, /The articles couldn(&#x27;|')t be loaded just now/);
  assert.match(out, /The social posts couldn(&#x27;|')t be loaded just now/);
  assert.match(out, /Part of this page couldn(&#x27;|')t be loaded just now/);
  assert.doesNotMatch(out, /Nothing is waiting for your OK/, "an error never reads as nothing waiting");
});

console.log("The email with the link (lib/review-link.ts)");
check("to Vern: the link, what the page shows, the switch and the way to change the link", () => {
  const { subject, text } = reviewLinkEmail("https://hubss.com/review/abc");
  assert.equal(subject, "Doug's review page is ready");
  assert.match(text, /^Doug's review page: https:\/\/hubss\.com\/review\/abc$/m);
  assert.match(text, /Ready for Doug's review/);
  assert.match(text, /REVIEW_FIRST=off/);
  assert.match(text, /REVIEW_SECRET/);
  assert.ok(!text.includes("—"), "no em dash");
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nall passed");
