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

console.log("The email with the links (lib/review-link.ts)");
check("to Vern: both links, what each is for, the switch and how to keep them steady", () => {
  const { subject, text } = reviewLinkEmail({ dougs: "https://hubss.com/review/abc", agency: "https://hubss.com/review/xyz" });
  assert.equal(subject, "Doug's review page is ready");
  assert.match(text, /^Doug's link \(send him this once; he keeps it\): https:\/\/hubss\.com\/review\/abc$/m);
  assert.match(text, /^Your link \(keep it to yourself\): https:\/\/hubss\.com\/review\/xyz$/m);
  assert.match(text, /Put on Doug's page/);
  assert.match(text, /REVIEW_FIRST=off/);
  assert.match(text, /REVIEW_SECRET/);
  assert.ok(!text.includes("—"), "no em dash");
});
check("when the keys changed, it says the old links are dead", () => {
  const { subject, text } = reviewLinkEmail({ dougs: "d", agency: "a" }, true);
  assert.match(subject, /New review links/);
  assert.match(text, /the old ones now show a 404/);
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nall passed");
