/**
 * Tests for the library stream and the helpers every stream shares
 * (lib/social-library.ts): part of `npm run test:social`. No network.
 *
 * What they protect: the library posts come from checked material only
 * (documented map jobs with photos, Product Book spreads), never repeat, never
 * re-post a job whose article already went out, link to a real page with a
 * public photo, and go out once a week, giving way to a new field post; and
 * every log id is one Sanity accepts.
 */
import assert from "node:assert/strict";
import { mapProjects, TOUR_IDS } from "../lib/map-projects";
import { idFor, imageFor, libraryDue, libraryPick, libraryQueue, nextLibraryItem, SITE, weekStart } from "../lib/social-library";

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

const queue = libraryQueue();
const kind = (key: string) => key.split(":")[1];

console.log("The library queue");
check("has documented jobs, systems and applications", () => {
  for (const k of ["project", "system", "application"]) assert.ok(queue.some((i) => kind(i.key) === k), `no ${k} items`);
});
check("every key is unique", () => assert.equal(new Set(queue.map((i) => i.key)).size, queue.length));
check("jobs and Product Book spreads take turns: job, system, job, application", () =>
  assert.deepEqual(queue.slice(0, 4).map((i) => kind(i.key)), ["project", "system", "project", "application"]));
check("the map tour's jobs come first, in tour order", () => {
  const tourWithPhotos = TOUR_IDS.filter((id) => mapProjects.find((p) => p.id === id)?.images.length);
  const jobs = queue.filter((i) => kind(i.key) === "project").slice(0, tourWithPhotos.length).map((i) => i.key);
  assert.deepEqual(jobs, tourWithPhotos.map((id) => `lib:project:${id}`));
});
check("a job with a write-up links to it", () => {
  const withPost = queue.find((i) => i.path.startsWith("/blog/"));
  assert.ok(withPost);
  assert.match(withPost.linkTo, /article/);
});
check("only jobs with photos are in it", () => {
  const withPhotos = mapProjects.filter((p) => p.images.length).length;
  assert.equal(queue.filter((i) => kind(i.key) === "project").length, withPhotos);
});
check("every item links to a page on the site", () => {
  for (const i of queue) assert.match(i.path, /^\/(blog|product-book|products|applications)\/[a-z0-9-]+$/, i.key);
});
check("every photo is a public address (Sanity's CDN or hubss.com)", () => {
  for (const i of queue) if (i.image) assert.match(i.image, /^https:\/\/(cdn\.sanity\.io|hubss\.com)\//, i.key);
});
check("every job and system has a photo", () => {
  for (const i of queue) if (kind(i.key) !== "application") assert.ok(i.image, `${i.key} has no photo`);
});
check("the facts name the place and the system for a job", () => {
  const job = queue.find((i) => kind(i.key) === "project")!;
  assert.match(job.text, /^Job: /m);
  assert.match(job.text, /^Where: /m);
  assert.match(job.text, /^System: /m);
});
check("no em dash in what the writer is given", () => {
  for (const i of queue) assert.ok(!/—/.test(`${i.title} ${i.excerpt} ${i.linkTo}`), i.key);
});

console.log("Which one is next");
check("the first item when nothing is logged", () => assert.equal(nextLibraryItem(queue, new Set())?.key, queue[0].key));
check("skips what's already been posted", () => assert.equal(nextLibraryItem(queue, new Set([queue[0].key]))?.key, queue[1].key));
check("skips a job whose article already had its own social posts", () => {
  const job = queue.find((i) => i.post)!;
  const logged = new Set(queue.slice(0, queue.indexOf(job)).map((i) => i.key));
  logged.add(job.post!);
  assert.notEqual(nextLibraryItem(queue, logged)?.key, job.key);
});
check("the Look Listen Live job is skipped once its article's posts exist", () => {
  const lll = queue.find((i) => i.key === "lib:project:brantford-safety-village-look-listen-live");
  assert.ok(lll, "the Brantford job is on the map");
  const logged = new Set(queue.filter((i) => i !== lll).map((i) => i.key));
  logged.add("look-listen-live-rail-safety-marking-brantford");
  assert.equal(nextLibraryItem(queue, logged), undefined);
});
check("nothing left when everything is posted", () => assert.equal(nextLibraryItem(queue, new Set(queue.map((i) => i.key))), undefined));

console.log("Once a week, in the Monday run, unless Doug's photos take the turn");
const at = (iso: string) => new Date(iso);
check("the very first one goes out at once (shipped on a Wednesday)", () => assert.equal(libraryDue(at("2026-10-14T14:00:00Z"), undefined), true));
check("then not again that week", () => assert.equal(libraryDue(at("2026-10-15T14:00:00Z"), "2026-10-14T14:01:00Z"), false));
check("the next Monday: due", () => assert.equal(libraryDue(at("2026-10-19T14:00:00Z"), "2026-10-14T14:01:00Z"), true));
check("a second run that Monday: not due", () => assert.equal(libraryDue(at("2026-10-19T18:00:00Z"), "2026-10-19T14:01:00Z"), false));
check("Tuesday after a Monday post: not due", () => assert.equal(libraryDue(at("2026-10-20T14:00:00Z"), "2026-10-19T14:01:00Z"), false));
check("Tuesday after a missed Monday: catches up", () => assert.equal(libraryDue(at("2026-10-20T14:00:00Z"), "2026-10-12T14:01:00Z"), true));
check("and the week after, back on Monday", () => assert.equal(libraryDue(at("2026-10-26T14:00:00Z"), "2026-10-20T14:01:00Z"), true));
check("Sunday night still counts as the old week", () => assert.equal(libraryDue(at("2026-10-25T23:59:00Z"), "2026-10-20T14:01:00Z"), false));
check("a new field post takes the week's turn", () => assert.equal(libraryDue(at("2026-10-19T14:00:00Z"), "2026-10-14T14:01:00Z", true), false));
check("weeks start on Monday 00:00 UTC", () => {
  assert.equal(weekStart(at("2026-10-19T00:00:00Z")).toISOString(), "2026-10-19T00:00:00.000Z");
  assert.equal(weekStart(at("2026-10-25T23:59:00Z")).toISOString(), "2026-10-19T00:00:00.000Z");
  assert.equal(weekStart(at("2026-10-14T14:00:00Z")).toISOString(), "2026-10-12T00:00:00.000Z");
});
check("a date it can't read counts as never", () => assert.equal(libraryDue(at("2026-10-20T14:00:00Z"), "soon"), true));

/** Daily 14:00 UTC runs for `days` days from `from`; returns the days a library post went. */
function simulate(from: string, days: number, fieldOn: (d: Date) => boolean = () => false) {
  let last: string | undefined;
  const went: string[] = [];
  for (let i = 0; i < days; i++) {
    const now = new Date(Date.parse(from) + i * 86_400_000);
    const field = fieldOn(now);
    if (libraryDue(now, last, field)) { went.push(now.toISOString().slice(0, 10)); last = now.toISOString(); }
    else if (field) last = now.toISOString(); // the field post reached Buffer that day
  }
  return went;
}
check("four weeks of daily runs: four library posts, all on Mondays", () => {
  const went = simulate("2026-10-19T14:00:00Z", 28);
  assert.equal(went.length, 4);
  for (const d of went) assert.equal(new Date(`${d}T12:00:00Z`).getUTCDay(), 1, `${d} is a Monday`);
});
check("a field post on a Monday takes that week; the library comes back the Monday after", () => {
  const went = simulate("2026-10-19T14:00:00Z", 28, (d) => d.toISOString().startsWith("2026-10-26"));
  assert.deepEqual(went, ["2026-10-19", "2026-11-02", "2026-11-09"]);
});
check("a field post later in the week counts for that week only", () => {
  const went = simulate("2026-10-19T14:00:00Z", 14, (d) => d.toISOString().startsWith("2026-10-22"));
  assert.deepEqual(went, ["2026-10-19", "2026-10-26"]);
});

console.log("Log ids and photos");
check("an article's log id is unchanged", () => assert.equal(idFor("socialLog", "look-listen-live-rail-safety-marking-brantford"), "socialLog-look-listen-live-rail-safety-marking-brantford"));
check("library and field keys become ids Sanity accepts", () => {
  assert.equal(idFor("socialLog", "lib:project:white-rock-pier"), "socialLog-lib-project-white-rock-pier");
  assert.match(idFor("socialRetry", "field:3f2a9c1e-0b7d-4c55-9e1a-2b6f0d4c8a11"), /^socialRetry-field-[a-z0-9-]+$/);
});
const sanityPhoto = "https://cdn.sanity.io/images/9dbro2m1/production/ee15b49c5e06f7fbbf09aa2b131138d16bc64c63-1280x960.jpg";
const phonePhoto = "https://cdn.sanity.io/images/9dbro2m1/production/75fcea67cfed876cf82aa72b2aedeb2d02cd16b7-960x1280.jpg";
check("a landscape Sanity photo gets the 1200x630 share crop, as articles always have", () =>
  assert.equal(imageFor(sanityPhoto, "landscape"), `${sanityPhoto}?w=1200&h=630&fit=crop&fm=jpg&q=80`));
check("and a 4:5 crop for Instagram", () => assert.equal(imageFor(sanityPhoto, "portrait"), `${sanityPhoto}?w=1080&h=1350&fit=crop&fm=jpg&q=85`));
check("a portrait phone photo stays 4:5 on LinkedIn and Facebook too", () => assert.match(imageFor(phonePhoto, "landscape") ?? "", /w=1080&h=1350/));
check("with a hotspot the crop centres on it", () => {
  const url = imageFor(phonePhoto, "landscape", { x: 0.52, y: 0.8 }) ?? "";
  assert.match(url, /crop=focalpoint&fp-x=0\.520&fp-y=0\.800/);
  assert.match(url, /fm=jpg/);
});
check("a photo on hubss.com goes as it is", () => assert.equal(imageFor(`${SITE}/images/map/x.jpg`, "portrait"), `${SITE}/images/map/x.jpg`));
check("anything else isn't sent", () => {
  assert.equal(imageFor("/images/map/x.jpg", "landscape"), undefined);
  assert.equal(imageFor("https://example.com/x.jpg", "landscape"), undefined);
});

console.log("\nA moment's job takes the week (lib/insights-calendar.ts)");
const veterans = "lib:project:kitchener-veterans";
check("Kitchener's veterans crosswalk is in the queue", () => assert.ok(queue.some((i) => i.key === veterans)));
check("the Monday before Remembrance Day, it takes the week's turn", () => {
  assert.equal(libraryPick(queue, new Set(), new Date("2026-11-09T14:00:00Z"))?.key, veterans);
});
check("other weeks, the queue's next", () => {
  assert.equal(libraryPick(queue, new Set(), new Date("2026-10-19T14:00:00Z"))?.key, nextLibraryItem(queue, new Set())?.key);
  assert.equal(libraryPick(queue, new Set(), new Date("2026-11-12T14:00:00Z"))?.key, nextLibraryItem(queue, new Set())?.key);
});
check("not if it, or its article, has already been posted", () => {
  const monday = new Date("2026-11-09T14:00:00Z");
  assert.notEqual(libraryPick(queue, new Set([veterans]), monday)?.key, veterans);
  const post = queue.find((i) => i.key === veterans)?.post;
  if (post) assert.notEqual(libraryPick(queue, new Set([post]), monday)?.key, veterans);
});

console.log("\nThe first six library posts, in order:");
for (const i of queue.slice(0, 6)) console.log(`  ${i.key.padEnd(48)} -> ${i.path}`);

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll passed");
