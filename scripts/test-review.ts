/**
 * `npm run test:review`: Doug reviews first (lib/review-first.ts) and the
 * review page (lib/review-page.ts, components/review/ReviewView.tsx). No
 * network: Sanity, Buffer and the email are never called here.
 *
 * What it protects: nothing queues in Buffer while review first is on; the
 * two keys are the server's alone, one can't be made from the other, and any
 * other text (non-ASCII included) is simply not a key; Doug sees only what
 * 21e8 put on his page (and what is already set to go), never an unread draft
 * or post; Vern sees everything with the checks; social posts are grouped by
 * what they're about; a scheduled article shows the run that will really
 * publish it; Toronto's time; Doug's page names no machinery and has no
 * buttons; and the email with the links.
 */
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { agencyLink, isReviewKey, reviewAudience, reviewFirst, reviewKey, reviewLink, reviewLinkRecordId, reviewTickId } from "../lib/review-first";
import { socialAutoQueue, type BufferPost } from "../lib/buffer";
import {
  aboutLine,
  anchorFor,
  DUE_GRACE_MS,
  groupSocialPosts,
  groupTitle,
  networkName,
  publishRun,
  reviewWhen,
  RUN_HOUR_UTC,
  selectArticles,
  styleIsClean,
  type RawReviewDraft,
  type RawSocialLog,
  type ReviewData,
} from "../lib/review-page";
import { DUE_GRACE_MS as PUBLISH_GRACE_MS, RUN_HOUR_UTC as PUBLISH_HOUR } from "../lib/project-posts";
import { reviewLinkEmails } from "../lib/review-link";
import ReviewView from "../components/review/ReviewView";
import { lintCopy } from "../lib/style-lint";
import { readFileSync } from "node:fs";
import {
  clearDougNotice,
  DOUG_EMAIL_FROM,
  DOUGS_ADDRESS,
  dougArticleEmail,
  dougDigestEmail,
  dougsAddresses,
  MAILED_TYPE,
  mailedRecordId,
  notifyDoug,
  notifyMissedReviews,
  ASK_MAX_AGE_MS,
  replyToAddress,
  takeAsk,
  sendsHere,
  shortExcerpt,
  staleReviewFlags,
} from "../lib/review-notify";
import type { Mail } from "../lib/editor-mail";
import { ASK_KEY, ASK_PREFIX, ASK_TYPE, newAskKey } from "../lib/review-ask";
import type { SanityClient } from "@sanity/client";
import { anchorFor as anchorForStudio } from "../lib/review-anchor";
import { jobPhotosLine } from "../sanity/job-photos-line";

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
check("social posts queue whether Doug reviews articles or not, unless SOCIAL_AUTO_QUEUE=off (6 Nov 2026)", () => {
  withEnv({ REVIEW_FIRST: undefined, SOCIAL_AUTO_QUEUE: undefined }, () => assert.equal(socialAutoQueue(), true));
  withEnv({ REVIEW_FIRST: "off", SOCIAL_AUTO_QUEUE: undefined }, () => assert.equal(socialAutoQueue(), true));
  withEnv({ REVIEW_FIRST: undefined, SOCIAL_AUTO_QUEUE: "off" }, () => assert.equal(socialAutoQueue(), false));
  withEnv({ REVIEW_FIRST: "off", SOCIAL_AUTO_QUEUE: "off" }, () => assert.equal(socialAutoQueue(), false));
});

console.log("The two keys");
check("the same for one secret, 32 address-safe characters, Doug's and Vern's different", () => {
  const a = reviewKey("secret-one");
  assert.equal(a, reviewKey("secret-one"));
  assert.equal(a?.length, 32);
  assert.match(a!, /^[A-Za-z0-9_-]{32}$/);
  assert.notEqual(a, reviewKey("secret-two"));
  assert.notEqual(reviewKey("secret-one", "agency"), a);
  assert.match(reviewKey("secret-one", "agency")!, /^[A-Za-z0-9_-]{32}$/);
});
check("each key opens its own page; nothing else opens either", () => {
  const dougs = reviewKey("k")!;
  const verns = reviewKey("k", "agency")!;
  assert.equal(reviewAudience(dougs, "k"), "client");
  assert.equal(reviewAudience(verns, "k"), "agency");
  assert.equal(isReviewKey(dougs, "k"), true);
  assert.equal(isReviewKey(verns, "k"), false, "isReviewKey is Doug's only");
  assert.equal(reviewAudience(dougs.slice(0, -1) + (dougs.endsWith("A") ? "B" : "A"), "k"), null);
  assert.equal(reviewAudience(dougs + "x", "k"), null);
  assert.equal(reviewAudience(dougs.slice(1), "k"), null);
  assert.equal(reviewAudience(undefined, "k"), null);
  assert.equal(reviewAudience(["x"], "k"), null);
  assert.equal(reviewAudience(dougs, "another secret"), null);
});
check("a key of 32 characters with one that isn't ASCII is no key, and never throws", () => {
  // The review of #104: string length matched, byte length didn't, and timingSafeEqual threw.
  const odd = "é" + reviewKey("k")!.slice(1);
  assert.equal(odd.length, 32);
  assert.doesNotThrow(() => reviewAudience(odd, "k"));
  assert.equal(reviewAudience(odd, "k"), null);
});
check("none without a secret, and then no key passes", () => {
  withEnv({ REVIEW_SECRET: undefined, CRON_SECRET: undefined, SANITY_API_WRITE_TOKEN: undefined }, () => {
    assert.equal(reviewKey(), null);
    assert.equal(reviewLink(), null);
    assert.equal(agencyLink(), null);
    assert.equal(reviewAudience(""), null);
    assert.equal(reviewAudience("anything"), null);
  });
});
check("REVIEW_SECRET first, then CRON_SECRET, then the Sanity token", () => {
  withEnv({ REVIEW_SECRET: "r", CRON_SECRET: "c", SANITY_API_WRITE_TOKEN: "s" }, () => assert.equal(reviewKey(), reviewKey("r")));
  withEnv({ REVIEW_SECRET: undefined, CRON_SECRET: "c", SANITY_API_WRITE_TOKEN: "s" }, () => assert.equal(reviewKey(), reviewKey("c")));
  withEnv({ REVIEW_SECRET: " ", CRON_SECRET: undefined, SANITY_API_WRITE_TOKEN: "s" }, () => assert.equal(reviewKey(), reviewKey("s")));
});
check("the links are hubss.com's; the private records carry no key and no group name", () => {
  assert.equal(reviewLink("k"), `https://hubss.com/review/${reviewKey("k")}`);
  assert.equal(agencyLink("k"), `https://hubss.com/review/${reviewKey("k", "agency")}`);
  const id = reviewLinkRecordId(reviewKey("k")!);
  assert.match(id, /^review\.link-[0-9a-f]{12}$/, "private (the dot) and short");
  assert.notEqual(reviewLinkRecordId(reviewKey("k2")!), id, "new keys are emailed again");
  assert.match(reviewTickId("lib:project:victoria-high-school"), /^review\.ok-[0-9a-f]{16}$/);
  assert.notEqual(reviewTickId("a"), reviewTickId("b"));
});

console.log("When an article goes live (publishRun)");
check("the review page and the publisher agree on the run's hour and grace", () => {
  assert.equal(RUN_HOUR_UTC, PUBLISH_HOUR);
  assert.equal(DUE_GRACE_MS, PUBLISH_GRACE_MS);
});
const now = new Date("2026-10-29T15:00:00Z"); // Thursday, after the morning run
check("a time to come, on the run's hour: that run", () => assert.equal(publishRun("2026-10-30T14:00:00.000Z", now), "2026-10-30T14:00:00.000Z"));
check("a time already past: the next run, not the past day", () => assert.equal(publishRun("2026-10-28T14:00:00.000Z", now), "2026-10-30T14:00:00.000Z"));
check("before today's run, a past time goes at today's run", () => assert.equal(publishRun("2026-10-28T14:00:00.000Z", new Date("2026-10-29T09:00:00Z")), "2026-10-29T14:00:00.000Z"));
check("a time after the run's hour waits for the next day's run", () => assert.equal(publishRun("2026-10-30T19:00:00.000Z", now), "2026-10-31T14:00:00.000Z"));
check("a time just after the hour, inside the grace, goes at that run", () => assert.equal(publishRun("2026-10-30T14:05:00.000Z", now), "2026-10-30T14:00:00.000Z"));
check("nothing for a bad date", () => assert.equal(publishRun("not a date", now), undefined));

console.log("Which articles each link shows (selectArticles)");
const drafts: RawReviewDraft[] = [
  { _id: "drafts.blogpost-plow", _updatedAt: "2026-10-27T13:05:00Z", title: "How crosswalk markings survive plow season", excerpt: "What a plow does.", category: "Guide", forReview: true, editorNotes: "FACT CHECK: clean.", featured: { url: "https://cdn.sanity.io/images/9dbro2m1/production/abc-1600x1000.jpg", alt: "", width: 1600, height: 1000 }, body: [] },
  { _id: "drafts.blogpost-osoyoos", _updatedAt: "2026-10-20T10:00:00Z", title: "Osoyoos lakeside path", category: "Project Profile", scheduled: true, scheduledFor: "2026-10-28T14:00:00.000Z" },
  { _id: "drafts.blogpost-unticked", _updatedAt: "2026-10-26T10:00:00Z", title: "Not read yet", forReview: false, editorNotes: "FACT CHECK: 1 statement(s) to check." },
  { _id: "drafts.blogpost-edit-of-live", title: "An edit to a live post", forReview: true },
  { _id: "blogpost-published", title: "Already live", forReview: true },
  { _id: "drafts.blogpost-untitled", title: "  ", forReview: true },
];
const live = ["blogpost-edit-of-live", "blogpost-published"];
const dougs = selectArticles(drafts, live, { audience: "client", now });
const verns = selectArticles(drafts, live, { audience: "agency", now });
check("Doug: only what 21e8 put on his page, and what is already set to go", () =>
  assert.deepEqual(dougs.map((a) => a.id), ["drafts.blogpost-osoyoos", "drafts.blogpost-plow"]));
check("Vern: every new draft, the ones on Doug's page first", () =>
  assert.deepEqual(verns.map((a) => [a.id, a.onDougsPage]), [["drafts.blogpost-osoyoos", true], ["drafts.blogpost-plow", true], ["drafts.blogpost-unticked", false]]));
check("never an edit of a live post, a published post or an untitled draft", () => {
  for (const id of ["drafts.blogpost-edit-of-live", "blogpost-published", "drafts.blogpost-untitled"]) assert.ok(!verns.some((a) => a.id === id), id);
});
check("a scheduled one shows the run that will publish it, not a past time", () => assert.equal(dougs[0].goesLive, "2026-10-30T14:00:00.000Z"));
check("the checks' notes are Vern's only", () => {
  assert.equal(dougs.find((a) => a.id === "drafts.blogpost-plow")?.notes, undefined);
  assert.equal(verns.find((a) => a.id === "drafts.blogpost-plow")?.notes, "FACT CHECK: clean.");
});
check("the type as the site prints it, and a photo's alt falls back to the title", () => {
  assert.equal(dougs[0].kind, "Project");
  assert.equal(dougs[1].kind, "Guide");
  assert.equal(dougs[1].photo?.alt, "How crosswalk markings survive plow season");
  assert.equal(dougs[0].photo, undefined);
});

console.log("Which social posts each link shows (groupSocialPosts)");
const logs: RawSocialLog[] = [
  { slug: "lib:project:victoria-high-school", title: "Victoria High School, Victoria", source: "From the library", createdAt: "2026-10-26T14:00:10Z", styleCheck: "STYLE CHECK: clean, no em dashes or other breaks from the house style.", postIds: ["p-li", "p-fb", "p-ig"] },
  { slug: "plow-season", title: "How crosswalk markings survive plow season", source: "Article", createdAt: "2026-10-28T14:00:10Z", styleCheck: "STYLE CHECK: clean. 21e8 rewrote 1 sentence(s).", postIds: ["a-ig", "a-li"] },
  { slug: "field:abc", title: "StreetPrint in [address], Oakville", source: "From the field", createdAt: "2026-10-28T14:01:10Z", styleCheck: "STYLE CHECK: 1 line(s) still break the house style or show a phone number, email or street address that isn't HUB's. Fix them in Buffer before approving:\n- Job post, Where: A street address.", postIds: ["f-li"] },
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
  post("f-li", "linkedin", "draft", { createdAt: "2026-10-28T14:01:30Z" }),
  post("hand-made", "linkedin", "draft", { createdAt: "2026-10-27T09:00:00Z" }),
  post("failed", "facebook", "error"),
  post("blank", "facebook", "draft", { text: "   " }),
];
const ticked = new Set(["plow-season"]);
const dougsPosts = groupSocialPosts(posts, logs, { audience: "client", ticks: ticked });
const vernsPosts = groupSocialPosts(posts, logs, { audience: "agency", ticks: ticked });
check("Doug: the waiting posts 21e8 put on his page, and what is already lined up; nothing unread", () =>
  assert.deepEqual(dougsPosts.map((g) => [g.key, g.posts.map((p) => p.id)]), [
    ["plow-season", ["a-li", "a-ig"]],
    ["lib:project:victoria-high-school", ["p-fb", "p-ig"]],
  ]));
check("Vern: every waiting or lined-up post, each by hand on its own; sent, failed and empty ones left out", () =>
  assert.deepEqual(vernsPosts.map((g) => [g.key, g.onDougsPage, g.posts.map((p) => p.id)]), [
    ["field:abc", false, ["f-li"]],
    ["plow-season", true, ["a-li", "a-ig"]],
    ["post:hand-made", false, ["hand-made"]],
    ["lib:project:victoria-high-school", false, ["p-fb", "p-ig"]],
  ]));
check("the style check is Vern's, with whether it was clean", () => {
  const field = vernsPosts.find((g) => g.key === "field:abc")!;
  assert.equal(field.styleClean, false);
  assert.match(field.styleCheck ?? "", /^STYLE CHECK: 1 line/);
  assert.equal(vernsPosts.find((g) => g.key === "plow-season")?.styleClean, true);
  assert.equal(dougsPosts.find((g) => g.key === "plow-season")?.styleCheck, undefined);
  assert.equal(styleIsClean("STYLE CHECK: clean."), true);
  assert.equal(styleIsClean("STYLE CHECK: 2 sentence(s) still have an em dash"), false);
  assert.equal(styleIsClean(null), false);
});
check("waiting before lined up, LinkedIn, Facebook, Instagram in that order", () => {
  assert.deepEqual(dougsPosts[0].posts.map((p) => p.network), ["LinkedIn", "Instagram"]);
  assert.equal(dougsPosts[0].posts[0].state, "waiting", "needs_approval waits too");
  assert.equal(dougsPosts[1].posts[0].state, "lined up");
  assert.equal(dougsPosts[1].posts[0].dueAt, "2026-10-28T15:00:00Z");
});
check("each group says what it's about; a masked job title reads as the system's job", () => {
  assert.equal(dougsPosts[0].about, "For the article");
  assert.equal(dougsPosts[0].title, "How crosswalk markings survive plow season");
  assert.equal(dougsPosts[1].about, "From HUB's projects and the Product Portfolio Book");
  assert.equal(vernsPosts[0].title, "StreetPrint job");
  assert.equal(groupTitle("StreetBond in Osoyoos, British Columbia"), "StreetBond in Osoyoos, British Columbia");
  assert.equal(groupTitle("[address] job"), "A job");
  assert.equal(aboutLine("From the field"), "From the job photos");
});
check("the photo HUB sent when it's HUB's, else Buffer's thumbnail; the alt text kept", () => {
  const ig = dougsPosts[1].posts.find((p) => p.network === "Instagram")!;
  assert.equal(ig.photo?.url, "https://cdn.sanity.io/images/9dbro2m1/production/x.jpg?w=1080");
  assert.equal(ig.photo?.alt, "Victoria High School crosswalk");
  const fb = dougsPosts[1].posts.find((p) => p.network === "Facebook")!;
  assert.equal(fb.photo?.url, "https://buffer-media.example/t2.jpg");
});
check("network names, and the cards' anchors", () => {
  assert.equal(networkName("twitter"), "X");
  assert.equal(networkName("googlebusiness"), "Google Business Profile");
  assert.equal(networkName("newthing"), "Newthing");
  assert.equal(anchorFor("social", "lib:project:victoria-high-school"), "social-lib-project-victoria-high-school");
  assert.equal(anchorFor("article", "drafts.blogpost-plow"), "article-drafts-blogpost-plow");
});

console.log("Times as Doug reads them (reviewWhen)");
check("summer time, Toronto", () => assert.equal(reviewWhen("2026-10-29T14:00:00.000Z"), "Thursday 29 October, 10:00 a.m."));
check("after the clocks go back", () => assert.equal(reviewWhen("2026-11-03T16:00:00.000Z"), "Tuesday 3 November, 11:00 a.m."));
check("afternoon", () => assert.equal(reviewWhen("2026-11-03T19:30:00.000Z"), "Tuesday 3 November, 2:30 p.m."));
check("nothing for a bad date", () => assert.equal(reviewWhen("not a date"), ""));

console.log("The page each reads (ReviewView)");
const words = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ");
const dougsData: ReviewData = { audience: "client", articles: dougs, social: dougsPosts, socialAsOf: "2026-10-28T15:00:00Z" };
const dougsHtml = renderToStaticMarkup(createElement(ReviewView, { data: dougsData, now: new Date("2026-10-28T15:05:00Z") }));
const dougsWords = words(dougsHtml);
check("Doug's: the articles, the posts and their states", () => {
  assert.match(dougsWords, /How crosswalk markings survive plow season/);
  assert.match(dougsWords, /Goes live Friday 30 October, 10:00 a\.m\./);
  assert.match(dougsWords, /Waiting for your OK/);
  assert.match(dougsWords, /Goes out Wednesday 28 October, 11:00 a\.m\./);
  assert.match(dougsWords, /Waiting for your OK: 1 article and 2 social posts\./);
  assert.match(dougsWords, /As they stood at 11:00 a\.m\. /);
  assert.doesNotMatch(dougsWords, /a\.m\.\./, "one full stop after a.m.");
  assert.match(dougsWords, /Reply to Vern with OK/);
});
check("Doug's names no machinery", () => {
  const banned = /\b(AI|A\.I\.|Claude|Anthropic|automat\w*|Buffer|Studio|Sanity|cron|queue\w*|drafter|by itself|bot|generated|21e8 only|style check|fact check)\b/i;
  const hit = dougsWords.match(banned);
  assert.equal(hit, null, `Doug's page says "${hit?.[0]}"`);
});
check("Doug's has no buttons, no forms and no other link", () => {
  assert.ok(!/<form|<button/.test(dougsHtml));
  assert.ok(!/Put on Doug|Take off Doug|Doug's link/.test(dougsWords));
});
check("Doug's keeps the house style", () => {
  const issues = lintCopy(dougsWords).filter((i) => !/Title Case/i.test(i.message));
  assert.deepEqual(issues.map((i) => i.message), []);
  assert.ok(!/[—–]\s/.test(dougsWords.replace(/\d–\d/g, "")), "no dashes");
});
const vernsData: ReviewData = { audience: "agency", articles: verns, social: vernsPosts, dougsLink: "https://hubss.com/review/DOUGSKEY", socialAsOf: "2026-10-28T15:00:00Z" };
const pressed: FormData[] = [];
const vernsHtml = renderToStaticMarkup(createElement(ReviewView, { data: vernsData, now: new Date("2026-10-28T15:05:00Z"), actionKey: "VERNSKEY", action: async (fd: FormData) => { pressed.push(fd); } }));
const vernsWords = words(vernsHtml);
check("Vern's: Doug's link, what is and isn't on his page, a button on each item waiting", () => {
  assert.match(vernsWords, /Doug's link, to send him once: https:\/\/hubss\.com\/review\/DOUGSKEY/);
  assert.match(vernsWords, /On Doug's page, waiting for his OK: 1 article and 2 social posts\. Not on his page yet: 3 items\./);
  assert.match(vernsWords, /Not on Doug's page yet/);
  assert.equal((vernsHtml.match(/Put on Doug&#x27;s page|Put on Doug's page/g) ?? []).length - 1, 3, "three items to put on (the intro names the button once)");
  assert.equal((vernsHtml.match(/Take off Doug(&#x27;|')s page/g) ?? []).length, 2);
  assert.match(vernsWords, /The style check found something\. Fix it in Buffer before Doug sees it\./);
  assert.match(vernsWords, /The checks' notes/);
  assert.ok(vernsHtml.includes('name="key" value="VERNSKEY"'), "the buttons send Vern's key");
  assert.ok(!vernsHtml.includes("DOUGSKEY\" "), "Doug's key is never a form value");
});
check("a web address in a post prints as text, never a link", () => {
  const withLink = groupSocialPosts([post("u", "linkedin", "draft", { text: "Read it: https://hubss.com/blog/x?utm_source=linkedin&utm_medium=social" })], [], { audience: "agency", ticks: new Set(["post:u"]) });
  const out = renderToStaticMarkup(createElement(ReviewView, { data: { audience: "client", articles: [], social: withLink }, now: new Date() }));
  assert.ok(out.includes("https://hubss.com/blog/x?utm_source=linkedin&amp;utm_medium=social"));
  assert.ok(!/href="https:\/\/hubss\.com\/blog\/x/.test(out));
});
check("says so when nothing could be read, rather than \"nothing waiting\"", () => {
  const out = renderToStaticMarkup(createElement(ReviewView, { data: { audience: "client", articles: [], social: [], articlesError: true, socialError: true }, now: new Date() }));
  assert.match(out, /The articles couldn(&#x27;|')t be loaded just now/);
  assert.match(out, /The social posts couldn(&#x27;|')t be loaded just now/);
  assert.match(out, /Part of this page couldn(&#x27;|')t be loaded just now/);
  assert.doesNotMatch(out, /Nothing is waiting for your OK/, "an error never reads as nothing waiting");
});

console.log("The emails with the links (lib/review-link.ts)");
const mails = reviewLinkEmails({ dougs: "https://hubss.com/review/DOUGSKEY", agency: "https://hubss.com/review/VERNSKEY" });
check("Doug's link comes alone, with a note ready to paste, safe to pass on whole", () => {
  assert.equal(mails.dougs.subject, "Doug's review link, to send him");
  assert.ok(mails.dougs.text.includes("https://hubss.com/review/DOUGSKEY"));
  assert.ok(!mails.dougs.text.includes("VERNSKEY"), "never Vern's link");
  assert.match(mails.dougs.text, /^Hi Doug,$/m);
  const banned = /\b(AI|Claude|automat\w*|Buffer|Studio|queue\w*|REVIEW_\w+|Vercel|21e8 only|style check|fact check|by itself)\b/i;
  assert.equal(mails.dougs.text.match(banned), null, `Doug's email says "${mails.dougs.text.match(banned)?.[0]}"`);
});
check("Vern's link comes in its own email, marked not to forward, with the switch and REVIEW_SECRET", () => {
  assert.match(mails.agency.subject, /don't forward/);
  assert.ok(mails.agency.text.includes("https://hubss.com/review/VERNSKEY"));
  assert.ok(!mails.agency.text.includes("DOUGSKEY"), "Doug's link isn't repeated there");
  assert.match(mails.agency.text, /Put on Doug's page/);
  assert.match(mails.agency.text, /REVIEW_FIRST=off/);
  assert.match(mails.agency.text, /REVIEW_SECRET/);
});
check("no em dash in either", () => {
  assert.ok(!mails.dougs.text.includes("\u2014") && !mails.agency.text.includes("\u2014"));
});
check("when the keys changed, both say the old links are dead", () => {
  const again = reviewLinkEmails({ dougs: "d", agency: "a" }, true);
  assert.match(again.dougs.subject, /the old one no longer opens/);
  assert.match(again.agency.text, /the old ones now show a 404/);
});

console.log("Doug's email when an article is sent to him (lib/review-notify.ts, 12 Nov 2026)");
const link = `https://hubss.com/review/DOUGSKEY#${anchorFor("article", "drafts.blogpost-milton-crosswalk")}`;
const first = dougArticleEmail({ title: "A school crosswalk in Milton", excerpt: "The town wanted the crossing seen from the corner.", link });
check("says what it is in the subject, with the article's title", () => {
  assert.equal(first.subject, "Ready for your OK: A school crosswalk in Milton");
});
check("has the title, the opening line and the link to his page, at the article's card", () => {
  for (const out of [first.text, first.html]) {
    assert.ok(out.includes("A school crosswalk in Milton"));
    assert.ok(out.includes("The town wanted the crossing seen from the corner."));
    assert.ok(out.includes(link));
  }
  assert.ok(link.endsWith("#article-drafts-blogpost-milton-crosswalk"), "the card's own anchor");
  assert.match(first.html, /Read the article<\/a>/);
  assert.match(first.text, /^Hi Doug,$/m);
  assert.match(first.text, /Reply to this email with OK/);
});
check("names no machinery and keeps the house style", () => {
  const banned = /\b(AI|A\.I\.|Claude|Anthropic|automat\w*|Buffer|Studio|Sanity|cron|queue\w*|drafter|by itself|bot|generated|21e8|style check|fact check|REVIEW_\w+|Vercel)\b/i;
  for (const out of [first.subject, first.text, words(first.html)]) assert.equal(out.match(banned), null, `says "${out.match(banned)?.[0]}"`);
  assert.deepEqual(lintCopy(first.text.replace(link, "")).map((i) => i.message), []);
  assert.ok(!/[\u2014\u2013]/.test(first.text + first.html), "no dashes");
});
check("a second round says he has seen it before", () => {
  const again = dougArticleEmail({ title: "A school crosswalk in Milton", link }, 2);
  assert.equal(again.subject, "Ready again for your OK: A school crosswalk in Milton");
  assert.match(again.text, /you have seen before/);
  assert.ok(!again.text.includes("undefined") && !again.html.includes("undefined"), "no excerpt, no gap");
});
check("several at once: one email that lists them, each title to its card", () => {
  const page = "https://hubss.com/review/DOUGSKEY";
  const three = dougDigestEmail(
    ["Plow season", "Traffic calming", "Cold patch"].map((t, i) => ({ title: t, link: `${page}#article-drafts-p${i}` })),
    page
  );
  assert.equal(three.subject, "Three articles ready for your OK");
  assert.match(three.text, /^Three articles for hubss\.com are ready for you to read:$/m);
  assert.match(three.text, /^- Plow season$/m);
  assert.match(three.text, new RegExp(`Read them here: ${page}$`, "m"));
  assert.ok(three.html.includes(`href="${page}#article-drafts-p2"`));
  assert.match(three.html, /Read the articles<\/a>/);
  const banned = /\b(AI|Claude|automat\w*|Buffer|Studio|Sanity|cron|queue\w*|drafter|by itself|bot|generated|21e8|style check|fact check)\b/i;
  assert.equal(three.text.match(banned), null);
  assert.deepEqual(lintCopy(three.text.replace(new RegExp(page, "g"), "")).map((i) => i.message), []);
  assert.equal(dougDigestEmail([{ title: "a", link: page }, { title: "b", link: page }], page).subject, "Two articles ready for your OK");
});
check("a title or excerpt with markup is printed as text", () => {
  const odd = dougArticleEmail({ title: "Paths & <b>parks</b>", excerpt: "\"Quoted\" & fine", link });
  assert.ok(odd.html.includes("Paths &amp; &lt;b&gt;parks&lt;/b&gt;"));
  assert.ok(!odd.html.includes("<b>parks"));
  assert.ok(odd.html.includes("&quot;Quoted&quot; &amp; fine"));
});
check("a long excerpt is cut at a word", () => {
  const long = "Stamped asphalt crossings ".repeat(20).trim();
  const cut = shortExcerpt(long);
  assert.ok(cut.length <= 243 && cut.endsWith("..."), cut);
  assert.ok(!/\s\.\.\.$/.test(cut));
  assert.equal(shortExcerpt("Short and sweet."), "Short and sweet.");
});
check("comes from Vern at hubss.com, goes to Doug, and his reply goes to Vern", () => {
  assert.match(DOUG_EMAIL_FROM, /^Vern via hubss\.com <noreply@hubss\.com>$/);
  assert.equal(DOUGS_ADDRESS, "doug.bain@hubss.com");
  assert.deepEqual(dougsAddresses({}), ["doug.bain@hubss.com"]);
  assert.deepEqual(dougsAddresses({ REVIEW_EMAIL_TO: "off" }), []);
  assert.deepEqual(dougsAddresses({ REVIEW_EMAIL_TO: "a@hubss.com, not an address, b@hubss.com" }), ["a@hubss.com", "b@hubss.com"]);
  assert.equal(replyToAddress({ BLOG_DRAFT_NOTIFY: "vern@example.com, other@example.com" }), "vern@example.com");
  assert.equal(replyToAddress({ REVIEW_REPLY_TO: "reply@example.com", BLOG_DRAFT_NOTIFY: "vern@example.com" }), "reply@example.com");
  assert.equal(replyToAddress({}), undefined);
});
check("only the production site sends (a preview's key would open nothing)", () => {
  assert.equal(sendsHere({ VERCEL_ENV: "production" }), true);
  assert.equal(sendsHere({ VERCEL_ENV: "preview" }), false);
  assert.equal(sendsHere({ NEXT_PUBLIC_VERCEL_ENV: "production" }), true);
  assert.equal(sendsHere({}), false);
});
check("one private record per article, the same from its draft or its published id", () => {
  const id = mailedRecordId("blogpost-milton-crosswalk");
  assert.equal(mailedRecordId("drafts.blogpost-milton-crosswalk"), id);
  assert.match(id, /^review\.mailed-[0-9a-f]{16}$/, "dotted: the public API never returns it");
  assert.notEqual(mailedRecordId("blogpost-another"), id);
  assert.ok(!id.includes("milton"));
});
check("the Studio reads the same record type and lands on the same card", () => {
  const input = readFileSync(new URL("../sanity/components/ForReviewInput.tsx", import.meta.url), "utf8");
  assert.ok(input.includes(`const MAILED_TYPE = "${MAILED_TYPE}";`), "ForReviewInput's MAILED_TYPE");
  assert.equal(anchorForStudio("article", "drafts.x-y"), anchorFor("article", "drafts.x-y"));
});
check("old switches on live articles are found, and only those", () => {
  assert.deepEqual(staleReviewFlags(["drafts.a", "b", "drafts.c", "d"], ["a", "b"]), ["drafts.a", "b"]);
  assert.deepEqual(staleReviewFlags([], ["a"]), []);
});

console.log("The job photos card (sanity/job-photos-line.ts)");
check("says which way a job goes, before and after Publish", () => {
  assert.match(jobPhotosLine({ published: false, story: false, article: null, hasArticle: false }), /^Publish it and its photos go out in HUB's social posts/);
  assert.match(jobPhotosLine({ published: true, story: false, article: null, hasArticle: false }), /^Its photos go out in HUB's social posts/);
  assert.match(jobPhotosLine({ published: false, story: true, article: null, hasArticle: false }), /once you publish it\. It goes to Doug to read before it goes live/);
  assert.match(jobPhotosLine({ published: true, story: true, article: null, hasArticle: false }), /in the next few days/);
});
check("and how far its article has got", () => {
  const a = (o: Partial<{ live: boolean; draft: boolean; withDoug: boolean }>) => ({ title: "Milton crosswalk", live: false, draft: false, withDoug: false, ...o });
  assert.match(jobPhotosLine({ published: true, story: true, article: a({ draft: true }), hasArticle: true }), /"Milton crosswalk"\. 21e8 is reading it/);
  assert.match(jobPhotosLine({ published: true, story: true, article: a({ draft: true, withDoug: true }), hasArticle: true }), /on Doug's review page, waiting for his OK/);
  assert.match(jobPhotosLine({ published: true, story: true, article: a({ live: true }), hasArticle: true }), /which is on the site\.$/);
  assert.match(jobPhotosLine({ published: true, story: true, article: a({}), hasArticle: true }), /no longer in Blog posts/);
});
check("in the house style", () => {
  const lines = [false, true].flatMap((published) => [false, true].map((story) => jobPhotosLine({ published, story, article: null, hasArticle: false })));
  for (const t of lines) assert.deepEqual(lintCopy(t).map((i) => i.message), [], t);
});

// ── notifyDoug against a stand-in Sanity: one email per round, whatever happens ──

type Doc = Record<string, unknown> & { _id: string; _type: string; _rev?: string };

/** Just enough of a Sanity client for lib/review-notify.ts: its two queries, create and patch. */
function fakeSanity(docs: Doc[]) {
  const store = new Map<string, Doc>(docs.map((d) => [d._id, { ...d, _rev: "r0" }]));
  let rev = 0;
  const pick = (d: Doc | undefined, keys: string[]) => (d ? Object.fromEntries(keys.filter((k) => k in d).map((k) => [k, d[k]])) : null);
  const all = () => [...store.values()];
  const client = {
    store,
    /** Stand in for Sanity failing to answer the article's reads. */
    failReads: false,
    async fetch(query: string, params: Record<string, string> = {}) {
      if (query.includes('"article": *[_id == $draft]')) {
        if (client.failReads) throw new Error("Sanity didn't answer");
        return {
          article: pick(store.get(params.draft), ["_id", "_type", "title", "excerpt", "forReview"]),
          live: store.has(params.published),
          record: pick(store.get(params.record), ["_id", "_rev", "round", "state", "cleared", "at"]),
        };
      }
      if (query.includes("articleId, on, at, used")) {
        return pick(store.get(params.id), ["_id", "_type", "_rev", "articleId", "on", "at", "used"]);
      }
      if (query.includes('"ticked":')) {
        const posts = all().filter((d) => d._type === "blogPost");
        return {
          ticked: posts.filter((d) => d._id.startsWith("drafts.") && d.forReview === true).map((d) => ({ _id: d._id, title: d.title })),
          open: all()
            .filter((d) => d._type === params.type && d.state === "sent" && d.cleared !== true)
            .map((d) => ({ _id: d._id, ticked: store.get(`drafts.${d.articleId}`)?.forReview === true, live: store.has(String(d.articleId)) })),
          flagged: posts.filter((d) => d.forReview === true).map((d) => d._id),
          live: posts.filter((d) => !d._id.startsWith("drafts.")).map((d) => d._id),
        };
      }
      throw new Error(`the stand-in doesn't know this query: ${query.slice(0, 60)}`);
    },
    async create(doc: Doc) {
      if (store.has(doc._id)) throw new Error("Document already exists");
      store.set(doc._id, { ...doc, _rev: `r${++rev}` });
      return store.get(doc._id);
    },
    patch(id: string) {
      let ifRev: string | undefined;
      const sets: Record<string, unknown>[] = [];
      const unsets: string[] = [];
      const builder = {
        ifRevisionId(r: string) { ifRev = r; return builder; },
        set(o: Record<string, unknown>) { sets.push(o); return builder; },
        unset(keys: string[]) { unsets.push(...keys); return builder; },
        async commit() {
          const doc = store.get(id);
          if (!doc) throw new Error(`no document ${id}`);
          if (ifRev && doc._rev !== ifRev) throw new Error("revision mismatch");
          const next: Doc = { ...doc, ...Object.assign({}, ...sets), _rev: `r${++rev}` };
          for (const k of unsets) delete next[k];
          store.set(id, next);
          return next;
        },
      };
      return builder;
    },
  };
  return client;
}

const sanity = (c: ReturnType<typeof fakeSanity>) => c as unknown as SanityClient;
const PRODUCTION = { VERCEL_ENV: "production", REVIEW_SECRET: "a-test-secret", REVIEW_FIRST: undefined, REVIEW_EMAIL_TO: undefined, REVIEW_REPLY_TO: undefined, BLOG_DRAFT_NOTIFY: "vern@example.com", NEXT_PUBLIC_VERCEL_ENV: undefined };

/** Runs an async fn with these environment variables set, then puts them back. */
async function withEnvAsync(vars: Record<string, string | undefined>, fn: () => Promise<void>) {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(vars)) saved[k] = process.env[k];
  try {
    for (const [k, v] of Object.entries(vars)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    await fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

async function checkAsync(name: string, fn: () => Promise<void>) {
  try {
    await withEnvAsync(PRODUCTION, fn);
    console.log(`  ok    ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${err instanceof Error ? err.message : err}`);
  }
}

const article = (id: string, o: Record<string, unknown> = {}): Doc => ({ _id: id, _type: "blogPost", title: "A school crosswalk in Milton", excerpt: "The town wanted it seen.", forReview: true, ...o });
function mailbox(ok = true) {
  const sent: Mail[] = [];
  return { sent, send: async (m: Mail) => { sent.push(m); return ok ? m.to : []; } };
}

async function storeTests() {
  console.log("notifyDoug against a stand-in Sanity (one email per round)");
  await checkAsync("sends once, to Doug, with Vern on the reply and the copy, and records it", async () => {
    const db = fakeSanity([article("drafts.blogpost-a")]);
    const box = mailbox();
    assert.equal(await notifyDoug(sanity(db), "blogpost-a", { send: box.send }), "sent");
    assert.equal(box.sent.length, 1);
    const [m] = box.sent;
    assert.deepEqual(m.to, ["doug.bain@hubss.com"]);
    assert.equal(m.replyTo, "vern@example.com");
    assert.deepEqual(m.bcc, ["vern@example.com"]);
    assert.equal(m.from, DOUG_EMAIL_FROM);
    assert.equal(m.subject, "Ready for your OK: A school crosswalk in Milton");
    assert.ok(m.text.includes(`${reviewLink()}#article-drafts-blogpost-a`), "his page, at the card");
    const record = db.store.get(mailedRecordId("blogpost-a"));
    assert.equal(record?.state, "sent");
    assert.equal(record?.articleId, "blogpost-a");
    assert.equal(record?._type, MAILED_TYPE);
  });
  await checkAsync("a second press, or the morning run, sends nothing more", async () => {
    const db = fakeSanity([article("drafts.blogpost-a")]);
    const box = mailbox();
    await notifyDoug(sanity(db), "blogpost-a", { send: box.send });
    assert.equal(await notifyDoug(sanity(db), "drafts.blogpost-a", { send: box.send }), "already sent");
    const run = await notifyMissedReviews(sanity(db), new Date(), box.send);
    assert.deepEqual(run.sent, []);
    assert.equal(box.sent.length, 1);
  });
  await checkAsync("two presses at once send one email", async () => {
    const db = fakeSanity([article("drafts.blogpost-a")]);
    const box = mailbox();
    const outcomes = await Promise.all([notifyDoug(sanity(db), "blogpost-a", { send: box.send }), notifyDoug(sanity(db), "blogpost-a", { send: box.send })]);
    assert.deepEqual([...outcomes].sort(), ["busy", "sent"]);
    assert.equal(box.sent.length, 1);
  });
  await checkAsync("nothing for an article that isn't sent, is live, or isn't there", async () => {
    const box = mailbox();
    assert.equal(await notifyDoug(sanity(fakeSanity([article("drafts.b", { forReview: false })])), "b", { send: box.send }), "not ticked");
    assert.equal(await notifyDoug(sanity(fakeSanity([article("drafts.c"), article("c")])), "c", { send: box.send }), "already on the site");
    assert.equal(await notifyDoug(sanity(fakeSanity([])), "d", { send: box.send }), "not found");
    assert.equal(box.sent.length, 0);
  });
  await checkAsync("nothing from a preview, with the email off, or once Doug no longer reviews", async () => {
    const box = mailbox();
    const db = fakeSanity([article("drafts.e")]);
    await withEnvAsync({ VERCEL_ENV: "preview" }, async () => assert.equal(await notifyDoug(sanity(db), "e", { send: box.send }), "elsewhere"));
    await withEnvAsync({ REVIEW_EMAIL_TO: "off" }, async () => assert.equal(await notifyDoug(sanity(db), "e", { send: box.send }), "off"));
    await withEnvAsync({ REVIEW_FIRST: "off" }, async () => assert.equal(await notifyDoug(sanity(db), "e", { send: box.send }), "off"));
    assert.equal(box.sent.length, 0);
    assert.equal(db.store.has(mailedRecordId("e")), false, "no record, so production sends it later");
  });
  await checkAsync("an email the mail service refused is sent on the next try, as the first", async () => {
    const db = fakeSanity([article("drafts.f")]);
    assert.equal(await notifyDoug(sanity(db), "f", { send: mailbox(false).send }), "not sent");
    assert.equal(db.store.get(mailedRecordId("f"))?.state, "failed");
    const box = mailbox();
    const run = await notifyMissedReviews(sanity(db), new Date(), box.send);
    assert.deepEqual(run.sent, ["A school crosswalk in Milton"]);
    assert.match(box.sent[0].subject, /^Ready for your OK:/);
  });
  await checkAsync("taken back and sent again: a second round, said so", async () => {
    const db = fakeSanity([article("drafts.g")]);
    const box = mailbox();
    await notifyDoug(sanity(db), "g", { send: box.send });
    db.store.set("drafts.g", { ...db.store.get("drafts.g")!, forReview: false });
    assert.equal(await clearDougNotice(sanity(db), "g"), "cleared");
    db.store.set("drafts.g", { ...db.store.get("drafts.g")!, forReview: true });
    assert.equal(await notifyDoug(sanity(db), "g", { send: box.send }), "sent");
    assert.equal(box.sent.length, 2);
    assert.match(box.sent[1].subject, /^Ready again for your OK:/);
  });
  await checkAsync("a send that died half way is taken again after ten minutes, not before", async () => {
    const now = new Date("2026-11-12T20:00:00Z");
    const claim = (minutesAgo: number): Doc => ({ _id: mailedRecordId("h"), _type: MAILED_TYPE, articleId: "h", round: 1, state: "sending", at: new Date(now.getTime() - minutesAgo * 60_000).toISOString() });
    const box = mailbox();
    assert.equal(await notifyDoug(sanity(fakeSanity([article("drafts.h"), claim(2)])), "h", { now, send: box.send }), "busy");
    assert.equal(await notifyDoug(sanity(fakeSanity([article("drafts.h"), claim(11)])), "h", { now, send: box.send }), "sent");
    assert.equal(box.sent.length, 1);
  });
  await checkAsync("taken back while its email was on its way: sending it again is a new round", async () => {
    for (const viaClear of [true, false]) {
      const db = fakeSanity([article("drafts.p")]);
      const sent: Mail[] = [];
      const send = async (m: Mail) => {
        sent.push(m);
        if (sent.length === 1) {
          // The editor presses Take it back while the first email is going out.
          db.store.set("drafts.p", { ...db.store.get("drafts.p")!, forReview: false });
          if (viaClear) assert.equal(await clearDougNotice(sanity(db), "p"), "cleared");
        }
        return m.to;
      };
      assert.equal(await notifyDoug(sanity(db), "p", { send }), "sent");
      assert.equal(db.store.get(mailedRecordId("p"))?.cleared, true, viaClear ? "cleared while sending" : "cleared when it finished");
      db.store.set("drafts.p", { ...db.store.get("drafts.p")!, forReview: true });
      assert.equal(await notifyDoug(sanity(db), "p", { send }), "sent");
      assert.match(sent[1].subject, /^Ready again for your OK:/);
    }
  });
  await checkAsync("if Sanity can't be read after the email went, the round is still marked sent", async () => {
    const db = fakeSanity([article("drafts.q")]);
    const send = async (m: Mail) => { db.failReads = true; return m.to; };
    assert.equal(await notifyDoug(sanity(db), "q", { send }), "sent");
    db.failReads = false;
    assert.equal(db.store.get(mailedRecordId("q"))?.state, "sent");
    const box = mailbox();
    assert.equal(await notifyDoug(sanity(db), "q", { send: box.send }), "already sent");
    assert.equal(box.sent.length, 0, "never a second email for the same round");
  });
  await checkAsync("the site acts only on an editor's ask, once, while it is fresh", async () => {
    const now = new Date("2026-11-12T20:00:00Z");
    const key = newAskKey();
    assert.match(key, ASK_KEY);
    assert.notEqual(newAskKey(), key);
    const askDoc = (k: string, o: Record<string, unknown> = {}): Doc => ({ _id: `${ASK_PREFIX}${k}`, _type: ASK_TYPE, articleId: "blogpost-a", on: true, at: new Date(now.getTime() - 5_000).toISOString(), ...o });
    const db = fakeSanity([askDoc(key)]);
    assert.deepEqual(await takeAsk(sanity(db), key, now), { id: `${ASK_PREFIX}${key}`, articleId: "blogpost-a", on: true });
    assert.equal(await takeAsk(sanity(db), key, now), null, "used once");
    assert.equal(await takeAsk(sanity(db), "f".repeat(40), now), null, "a key nobody made");
    assert.equal(await takeAsk(sanity(db), "not-a-key", now), null, "a key of another shape");
    assert.equal(await takeAsk(sanity(db), undefined, now), null);
    const old = "a".repeat(40);
    const stale = fakeSanity([askDoc(old, { at: new Date(now.getTime() - ASK_MAX_AGE_MS - 1000).toISOString() })]);
    assert.equal(await takeAsk(sanity(stale), old, now), null, "older than five minutes");
    const odd = "b".repeat(40);
    for (const o of [{ articleId: "../etc" }, { on: "yes" }, { _type: "blogPost" }, { at: "soon" }]) {
      assert.equal(await takeAsk(sanity(fakeSanity([askDoc(odd, o)])), odd, now), null, JSON.stringify(o));
    }
  });
  await checkAsync("the morning run with several waiting sends one email that lists them", async () => {
    const db = fakeSanity([article("drafts.m", { title: "Plow season" }), article("drafts.n", { title: "Traffic calming" }), article("drafts.o", { title: "Cold patch" })]);
    const box = mailbox();
    const run = await notifyMissedReviews(sanity(db), new Date(), box.send);
    assert.equal(box.sent.length, 1);
    assert.equal(box.sent[0].subject, "Three articles ready for your OK");
    assert.deepEqual([...run.sent].sort(), ["Cold patch", "Plow season", "Traffic calming"]);
    for (const id of ["m", "n", "o"]) assert.equal(db.store.get(mailedRecordId(id))?.state, "sent");
    assert.equal(await notifyDoug(sanity(db), "m", { send: box.send }), "already sent", "and none of them again");
  });
  await checkAsync("the morning run: emails what was missed, clears what went live, switches off old ones", async () => {
    const db = fakeSanity([
      article("drafts.i"),
      article("j", { forReview: true }),
      article("k"),
      { _id: mailedRecordId("k"), _type: MAILED_TYPE, articleId: "k", round: 1, state: "sent" },
    ]);
    const box = mailbox();
    const run = await notifyMissedReviews(sanity(db), new Date(), box.send);
    assert.deepEqual(run.sent, ["A school crosswalk in Milton"]);
    assert.equal(box.sent.length, 1, "only the new one");
    assert.equal(run.cleared, 1, "the live article's record");
    assert.equal(db.store.get(mailedRecordId("k"))?.cleared, true);
    assert.equal(run.tidied, 2, "the switch on the two live articles");
    assert.equal("forReview" in db.store.get("j")!, false);
    assert.equal(db.store.get("drafts.i")?.forReview, true, "a new article keeps it");
  });
}

void storeTests().then(() => {
  if (failures) {
    console.log(`\n${failures} failed`);
    process.exit(1);
  }
  console.log("\nall passed");
});
