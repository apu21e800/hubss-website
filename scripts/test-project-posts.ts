/**
 * Tests for the project-post workflow's decisions (lib/project-posts.ts):
 * `npm run test:project-posts`. No network: Claude, Sanity and the email are
 * never called here.
 *
 * What they protect: an article from a job photos post is scheduled for a
 * weekday two days out, on a day no other article has, and the time printed
 * for Doug is Toronto's; the draft carries the post's photos, its link to the
 * post and the hold instruction; the live document it becomes is dated the
 * moment it goes and no longer scheduled; the facts the drafter gets are the
 * post's own words; and a scheduled draft counts as due at the run that
 * starts on its minute.
 */
import assert from "node:assert/strict";
import { contactLeft, withLeft } from "../lib/field-note-drafter";
import {
  buildProjectDocument,
  contactProblemsForLive,
  jobName,
  jobPostText,
  jobRecord,
  PROFILE_INSTRUCTIONS,
  PROJECT_TYPE,
  readyToGo,
  scheduleSlot,
  slugSource,
  toPublished,
  torontoWhen,
  type ProjectSource,
} from "../lib/project-posts";
import type { Draft, FactCheck } from "../lib/field-note-drafter";
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

console.log("When an article goes live (scheduleSlot)");
// Monday 19 Oct 2026, during the 14:00 UTC run.
const monday = new Date("2026-10-19T14:00:30Z");
check("two days out, on the run's hour", () => assert.equal(scheduleSlot(monday), "2026-10-21T14:00:00.000Z"));
check("a Thursday post skips the weekend to Monday", () => assert.equal(scheduleSlot(new Date("2026-10-22T14:00:10Z")), "2026-10-26T14:00:00.000Z"));
check("a Friday post goes Monday", () => assert.equal(scheduleSlot(new Date("2026-10-23T14:00:10Z")), "2026-10-26T14:00:00.000Z"));
check("a Saturday post goes Monday", () => assert.equal(scheduleSlot(new Date("2026-10-24T09:00:00Z")), "2026-10-26T14:00:00.000Z"));
check("a day another draft has is skipped", () =>
  assert.equal(scheduleSlot(monday, ["2026-10-21T14:00:00.000Z"]), "2026-10-22T14:00:00.000Z"));
check("two taken days, then the weekend: the Monday after", () =>
  assert.equal(scheduleSlot(monday, ["2026-10-21T14:00:00.000Z", "2026-10-22T14:00:00.000Z", "2026-10-23T14:00:00.000Z"]), "2026-10-26T14:00:00.000Z"));
check("a run late in the day still lands on the run's hour", () => assert.equal(scheduleSlot(new Date("2026-10-19T23:30:00Z")), "2026-10-21T14:00:00.000Z"));

console.log("The time as Doug reads it (torontoWhen)");
check("summer time: 14:00 UTC is 10:00 Toronto", () => assert.equal(torontoWhen("2026-10-21T14:00:00.000Z"), "Wednesday 21 October at 10:00 Toronto time"));
check("after the clocks go back: 09:00", () => assert.equal(torontoWhen("2026-11-04T14:00:00.000Z"), "Wednesday 4 November at 09:00 Toronto time"));

const source: ProjectSource = {
  _id: "fieldPost-abc",
  place: "Osoyoos, British Columbia",
  note: "StreetBondSR in Sandstone over the park's main path, 480 square metres, done in two days.",
  writeUp: "The town wanted the asphalt path through the lakeside park cooler underfoot in July.\nCertified installer: Okanagan Pavement Finishes.\nTwo coats, lines re-marked the same week.",
  date: "2026-09-14",
  system: { _id: "product-streetbondsr", name: "StreetBondSR", slug: "streetbondsr" },
  application: { _id: "application-parks-paths", name: "Parks & Paths", slug: "parks-paths" },
  photos: [
    { asset: "image-aaa-2400x1800-jpg", alt: "The finished path in Sandstone", caption: "The main path, the week it was done", hotspot: { _type: "sanity.imageHotspot", x: 0.4, y: 0.6, width: 1, height: 1 } },
    { asset: "image-bbb-2400x1800-jpg", alt: "Lines re-marked on the new surface" },
    { asset: "image-ccc-2400x1800-jpg", alt: "" },
    { asset: null, alt: "a photo with no file" },
  ],
};

console.log("The facts the drafter gets (jobRecord)");
const record = jobRecord(source);
check("names the job", () => assert.equal(jobName(source), "StreetBondSR in Osoyoos, British Columbia"));
check("has the place, the date, the system and the kind of job", () => {
  assert.match(record, /Where: Osoyoos, British Columbia/);
  assert.match(record, /When it was done: 14 September 2026/);
  assert.match(record, /System: StreetBondSR/);
  assert.match(record, /Kind of job: Parks & Paths/);
});
check("carries the crew's note and the story word for word", () => {
  assert.match(record, /480 square metres/);
  assert.match(record, /Okanagan Pavement Finishes/);
});
check("counts only photos with a file, and lists what they show", () => {
  assert.match(record, /Photographs: 3 of the finished job/);
  assert.match(record, /The main path, the week it was done; Lines re-marked on the new surface/);
});
check("tells the drafter the job is the whole truth about the job", () => assert.match(record, /say nothing about this job that is not here/));
check("the profile instructions forbid padding and invention", () => {
  assert.match(PROFILE_INSTRUCTIONS, /never add a client, a date, a size, a colour, a cost or a reason/);
  assert.match(PROFILE_INSTRUCTIONS, /450 to 750 words/);
});

console.log("The scheduled draft (buildProjectDocument)");
const draft: Draft = {
  title: "A cooler path through Osoyoos's lakeside park",
  slug: "osoyoos-lakeside-park-path",
  excerpt: "The town's main park path got StreetBondSR in Sandstone in September. What went in, and why.",
  searchPhrases: ["cool pavement coating", "StreetBondSR", "cool pavement coating"],
  body: "The path runs along the lake.\n\n## What went in\n\nTwo coats of [StreetBondSR](https://hubss.com/products/streetbondsr).\n\n![a photo the drafter made up](https://example.com/x.jpg)\n\n## Specifying it\n\nAsk HUB for the spec sheet.",
  factsUsed: ["Where: Osoyoos, British Columbia", "Two coats, lines re-marked the same week."],
};
const clean: FactCheck = { verdict: "clean", unsupported: [] };
const slot = "2026-10-21T14:00:00.000Z";
const doc = buildProjectDocument(source, draft, clean, "osoyoos-lakeside-park-path", slot, undefined, new Date("2026-10-19T14:01:00Z"));
check("is an unpublished draft, scheduled, filed under Projects", () => {
  assert.equal(doc._id, "drafts.blogpost-osoyoos-lakeside-park-path");
  assert.equal(doc.scheduled, true);
  assert.equal(doc.scheduledFor, slot);
  assert.equal(doc.publishedAt, "2026-10-19T14:01:00.000Z", "dated the day it was written, not the slot (a hand publish before the day must not print a future date)");
  assert.equal(doc.category, PROJECT_TYPE);
  assert.equal(doc.category, "Project Profile");
});
check("links back to the job photos post, weakly", () => assert.deepEqual(doc.fieldPost, { _type: "reference", _ref: "fieldPost-abc", _weak: true }));
check("the post's first photo is the featured photo, focal point and caption kept", () => {
  assert.equal(doc.featuredImage?.asset._ref, "image-aaa-2400x1800-jpg");
  assert.equal(doc.featuredImage?.alt, "The finished path in Sandstone");
  assert.equal(doc.featuredImage?.caption, "The main path, the week it was done");
  assert.equal((doc.featuredImage?.hotspot as { x: number }).x, 0.4);
  assert.equal("_key" in (doc.featuredImage ?? {}), false, "a featured image is not an array item");
});
check("the other photos close the article under their own heading", () => {
  const body = doc.body as { _type: string; style?: string; children?: { text: string }[]; asset?: { _ref: string }; alt?: string }[];
  const h2 = body.find((b) => b._type === "block" && b.style === "h2" && b.children?.[0]?.text === "The job in photographs");
  assert.ok(h2, "no photos heading");
  const images = body.filter((b) => b._type === "image");
  assert.deepEqual(images.map((b) => b.asset?._ref), ["image-bbb-2400x1800-jpg", "image-ccc-2400x1800-jpg"]);
  assert.equal(images[1].alt, "StreetBondSR in Osoyoos, British Columbia, photo 3 of 3", "a photo without alt text gets a plain one");
  assert.ok(body.indexOf(h2!) < body.indexOf(images[0]), "the heading comes before the photos");
});
check("the drafter's own image is dropped", () => {
  const body = doc.body as { _type: string; asset?: { _ref: string } }[];
  assert.ok(!body.some((b) => b._type === "image" && !b.asset?._ref.startsWith("image-")), "an image without a Sanity asset got in");
  assert.equal(body.filter((b) => b._type === "image").length, 2);
});
check("the system and the application are the post's", () => {
  assert.equal(doc.relatedProducts?.[0]._ref, "product-streetbondsr");
  assert.equal(doc.relatedApplications?.[0]._ref, "application-parks-paths");
});
check("search phrases, once each", () => assert.deepEqual(doc.keywords, ["cool pavement coating", "StreetBondSR"]));
check("the notes say when it goes live and how to hold it", () => {
  assert.match(doc.editorNotes, /SCHEDULED for Wednesday 21 October at 10:00 Toronto time/);
  assert.doesNotMatch(doc.editorNotes, /Claude|by itself|turn.*off/, "the notes Doug can read name no machinery");
  assert.match(doc.editorNotes, /FACT CHECK: every statement matches/);
  assert.match(doc.editorNotes, /the other 2 close the article/);
});
check("the notes keep the house style", () => assert.deepEqual(lintCopy(doc.editorNotes).map((i) => i.message), []));
check("a post with one photo has no photos heading", () => {
  const one = buildProjectDocument({ ...source, photos: source.photos!.slice(0, 1) }, draft, clean, "x", slot);
  assert.ok(!(one.body as { style?: string }[]).some((b) => b.style === "h2" && (b as { children?: { text: string }[] }).children?.[0]?.text === "The job in photographs"));
  assert.ok(one.featuredImage);
});
check("unsupported statements are listed for the editor, and the draft is held", () => {
  const flagged = buildProjectDocument(source, draft, { verdict: "needs edits", unsupported: [{ quote: "480 square metres a day", reason: "the note says two days" }] }, "x", slot);
  assert.match(flagged.editorNotes, /FACT CHECK: 1 statement\(s\)/);
  assert.match(flagged.editorNotes, /"480 square metres a day": the note says two days/);
  assert.equal(flagged.scheduled, false, "an unchecked claim must not go live by itself");
  assert.equal(flagged.scheduledFor, slot, "the time is kept for when it is switched on");
  assert.match(flagged.editorNotes, /^[\s\S]*HELD: a check below found something/);
  assert.doesNotMatch(flagged.editorNotes, /SCHEDULED for/);
});
check("an em dash the style pass couldn't fix holds the draft too", () => {
  const style = { text: {}, flagged: 2, left: [{ label: "Body", sentence: "The path — now cooler.", problems: ["Em dash."] }] };
  const held = buildProjectDocument(source, draft, clean, "x", slot, style);
  assert.equal(held.scheduled, false);
  assert.match(held.editorNotes, /STYLE CHECK: 1 sentence\(s\)/);
  const fixed = buildProjectDocument(source, draft, clean, "x", slot, { text: {}, flagged: 2, left: [] });
  assert.equal(fixed.scheduled, true, "rewritten sentences are fine");
});
check("readyToGo wants both checks clean", () => {
  assert.equal(readyToGo(clean), true);
  assert.equal(readyToGo(clean, { text: {}, flagged: 0, left: [] }), true);
  assert.equal(readyToGo({ verdict: "needs edits", unsupported: [{ quote: "x", reason: "y" }] }), false);
});

console.log("The live document (toPublished)");
const now = new Date("2026-10-21T14:00:12Z");
const live = toPublished({ ...doc, _rev: "r1", _createdAt: "2026-10-19T14:01:00Z", _updatedAt: "2026-10-19T14:01:00Z" }, now);
check("takes the published id", () => assert.equal(live._id, "blogpost-osoyoos-lakeside-park-path"));
check("is dated the moment it goes, as Studio's Publish would date it", () => assert.equal(live.publishedAt, now.toISOString()));
check("is no longer scheduled", () => {
  assert.equal(live.scheduled, false);
  assert.equal("scheduledFor" in live, false);
});
check("drops the revision fields", () => {
  assert.equal("_rev" in live, false);
  assert.equal("_createdAt" in live, false);
  assert.equal("_updatedAt" in live, false);
});
check("keeps the words, the photos and the link to the post", () => {
  assert.equal(live.title, doc.title);
  assert.deepEqual(live.body, doc.body);
  assert.deepEqual(live.featuredImage, doc.featuredImage);
  assert.deepEqual(live.fieldPost, doc.fieldPost);
});
check("says in the notes that it went on schedule", () => assert.match(live.editorNotes, /^Published on schedule, Wednesday 21 October at 10:00 Toronto time \(21e8\)\./));
check("a scheduled edit to a live post keeps the post's date", () => {
  const edit = toPublished({ ...doc, _rev: "r2" }, now, "2024-06-03T13:00:00.000Z");
  assert.equal(edit.publishedAt, "2024-06-03T13:00:00.000Z");
  assert.equal(edit.scheduled, false);
  assert.match(edit.editorNotes, /^Edit published on schedule/);
});

console.log("A customer's details hold the article (24 Oct 2026)");
const withDetails: ProjectSource = {
  ...source,
  place: "1234 Main Street, Milton, Ontario",
  photos: [{ asset: "image-aaa-2400x1800-jpg", alt: "", caption: "Call the owner on 905-555-0123 for a visit" }],
};
const detailLines = contactLeft(jobPostText(withDetails));
check("the job post's place and captions are read", () => {
  assert.deepEqual(detailLines.map((l) => l.label), ["Job post, Where", "Job post, photo 1 caption"]);
  assert.ok(detailLines.every((l) => l.contact === true));
});
check("a job post with none adds nothing", () => assert.deepEqual(contactLeft(jobPostText(source)), []));
const detailStyle = withLeft({ text: {}, flagged: 0, left: [] }, detailLines);
const held = buildProjectDocument(withDetails, draft, clean, "milton-driveway", slot, detailStyle, new Date("2026-10-19T14:01:00Z"));
check("held, however clean the draft and the fact check", () => {
  assert.equal(readyToGo(clean, detailStyle), false);
  assert.equal(held.scheduled, false);
});
check("the notes say what to take out", () => {
  assert.match(held.editorNotes, /^HELD/m);
  assert.match(held.editorNotes, /phone number, email or street address that isn't HUB's/);
  assert.match(held.editorNotes, /- Job post, Where: A street address or postal code/);
  assert.match(held.editorNotes, /- Job post, photo 1 caption: A phone number/);
});
check("the slug never carries an address or a phone number", () => {
  assert.equal(slugSource({ title: "A stamped driveway at 1234 Main Street in Milton", slug: "stamped-driveway-at-1234-main-street-milton" }), "A stamped driveway at in Milton");
  assert.equal(slugSource({ title: "A stamped driveway in Milton", slug: "stamped-driveway-1234-main-street-milton" }), "A stamped driveway in Milton");
  assert.equal(slugSource({ title: "Call 905-555-0123 about the driveway", slug: "" }), "Call about the driveway");
  assert.equal(slugSource(draft), "osoyoos-lakeside-park-path");
});
check("a search phrase with a contact detail is dropped", () => {
  const d = buildProjectDocument(source, { ...draft, searchPhrases: ["stamped driveway milton", "1234 main street milton", "905-555-0123"] }, clean, "x", slot);
  assert.deepEqual(d.keywords, ["stamped driveway milton"]);
});
check("the drafter is told to leave them out", () => assert.match(PROFILE_INSTRUCTIONS, /Never print a phone number, an email or a street address from THE JOB/));

console.log("Read as typed, masked, and checked again on its day (24 Oct 2026 review)");
const lowercase: ProjectSource = { ...source, photos: [{ asset: "image-aaa-2400x1800-jpg", alt: "the smiths' driveway", caption: "at 1234 main st, the week it was done" }] };
check("a lower-case address in a caption holds the article", () => {
  const lines = contactLeft(jobPostText(lowercase));
  assert.deepEqual(lines.map((l) => l.label), ["Job post, photo 1 caption"]);
  assert.equal(readyToGo(clean, withLeft({ text: {}, flagged: 0, left: [] }, lines)), false);
});
check("a Where that starts with a house number holds it", () =>
  assert.deepEqual(contactLeft(jobPostText({ ...source, place: "1234 Lakeshore, Toronto" })).map((l) => l.label), ["Job post, Where"]));
check("the notes never quote the job post, masked or not", () => {
  // A mask covers only what the rule sees ("at 1234 Lakeshore for Jane"): the
  // notes name the field and the kind (the re-review of 24 Oct 2026).
  for (const d of ["1234 Main Street", "905-555-0123", "Milton", "Call the owner", "for a visit", "[address]", "[phone number]"]) assert.equal(held.editorNotes.includes(d), false, d);
  assert.match(held.editorNotes, /from the StreetBondSR job photos post \(Studio/);
  assert.match(held.editorNotes, /BASED ON: the job post and the StreetBondSR page's approved facts \(not listed here/);
});
check("nor the fact check's quotes, when the job shows a customer's details", () => {
  const flagged: FactCheck = { verdict: "needs edits", unsupported: [{ quote: "The owner, Jane, picked the colour.", reason: "Jane is not in the job's record." }] };
  const notes = buildProjectDocument(withDetails, draft, flagged, "milton-driveway", slot, detailStyle, new Date("2026-10-19T14:01:00Z")).editorNotes;
  assert.equal(notes.includes("Jane"), false);
  assert.match(notes, /FACT CHECK: 1 statement\(s\)[^\n]*\n- Not quoted here: the job post or the draft shows a customer's details\. 21e8 has the list\./);
  // A job with no details keeps its quotes and its facts.
  const plain = buildProjectDocument(source, draft, flagged, "osoyoos-lakeside-park-path", slot, undefined, new Date("2026-10-19T14:01:00Z")).editorNotes;
  assert.match(plain, /- "The owner, Jane, picked the colour\.": Jane is not in the job's record\./);
  assert.match(plain, /^BASED ON:$/m);
});
check("the drafter is told not to name a homeowner", () => assert.match(PROFILE_INSTRUCTIONS, /Never name a private homeowner or a family/));
check("a clean scheduled draft shows nothing on its day", () => assert.deepEqual(contactProblemsForLive(doc), []));
check("a phone number added to the body is found on its day", () => {
  const edited = { ...doc, body: [...doc.body, { _type: "block", _key: "x", style: "normal", markDefs: [], children: [{ _type: "span", _key: "xs", text: "Thanks to the owner, 905-555-0123.", marks: [] }] }] };
  assert.deepEqual(contactProblemsForLive(edited), ["the body"]);
});
check("what a person types into the body later is read as typed too", () => {
  // The re-review of 24 Oct 2026: read as prose, these went live.
  for (const text of ["We did the drive at 1234 main st.", "Back to the Patels, 1987 Oak Street.", "Call 555-0123 for the gate."]) {
    const edited = { ...doc, body: [...doc.body, { _type: "block", _key: "x", style: "normal", markDefs: [], children: [{ _type: "span", _key: "xs", text, marks: [] }] }] };
    assert.deepEqual(contactProblemsForLive(edited), ["the body"], text);
  }
});
check("a new draft is read as it will be on its day: never scheduled to be held", () => {
  const typedIn: Draft = { ...draft, body: `${draft.body}\n\nThanks to the Patels, 1987 Oak Street.` };
  const d = buildProjectDocument(source, typedIn, clean, "osoyoos-lakeside-park-path", slot, { text: {}, flagged: 0, left: [] }, new Date("2026-10-19T14:01:00Z"));
  assert.equal(d.scheduled, false);
  assert.match(d.editorNotes, /^HELD/m);
  assert.match(d.editorNotes, /IN THE ARTICLE: a phone number, email or street address that isn't HUB's, in the body\./);
  assert.equal(d.editorNotes.includes("Patels"), false);
});
check("a photo with no alt text is never named after a Where with an address", () => {
  const noAlt: ProjectSource = { ...withDetails, photos: [{ asset: "image-aaa-2400x1800-jpg", alt: "" }, { asset: "image-bbb-2400x1800-jpg" }] };
  const d = buildProjectDocument(noAlt, draft, clean, "milton-driveway", slot, withLeft({ text: {}, flagged: 0, left: [] }, contactLeft(jobPostText(noAlt))), new Date("2026-10-19T14:01:00Z"));
  assert.equal(d.featuredImage?.alt, "StreetBondSR job");
  assert.ok(JSON.stringify(d.body).includes("StreetBondSR job, photo 2 of 2"));
  assert.equal(JSON.stringify(d).includes("1234 Main Street"), false);
});
check("a caption left with an address is found, read as typed", () => {
  const body = doc.body.map((b) => (b._type === "image" ? { ...b, caption: "the smiths at 1234 main st" } : b));
  assert.deepEqual(contactProblemsForLive({ ...doc, body }), ["a photo's caption"]);
});
check("so are the featured photo, the keywords and the URL", () => {
  const found = contactProblemsForLive({
    ...doc,
    featuredImage: { ...doc.featuredImage, alt: "Driveway at 1234 Main Street" },
    keywords: ["905-555-0123"],
    slug: { current: "driveway-1234-main-st" },
  });
  assert.deepEqual(found, ["the featured photo's alt text", "the keywords", "the URL"]);
});

console.log(failures ? `\n${failures} failing` : "\nall passing");
process.exit(failures ? 1 : 0);
