/**
 * Tests for the Insights plan top-up (lib/insights-planner.ts): `npm run
 * test:planner`. No network.
 *
 * What they protect: a new plan item names only systems and applications HUB
 * has Product Book pages for, never repeats an article or plan item, carries no
 * claim the drafter could take as fact (a guide's brief is questions only; a
 * roundup's brief is the jobs' own records, word for word), sets nothing
 * "vs" anything (20 Oct 2026), and the plan is topped up by no more than it
 * asks for.
 */
import assert from "node:assert/strict";
import { mapProjects } from "../lib/map-projects";
import { PRODUCT_CATALOGUE } from "../lib/product-catalogue";
import { applications } from "../lib/applications";
import { goodQuestion, LEAD_JOB_QUESTION, repeats, roundupJobs, vetIdeas, words, type Existing, type RawIdea } from "../lib/insights-planner";
import { factsBlock, QUESTIONS_BRIEF } from "../lib/field-note-facts";
import { dateIn, MOMENTS, momentKey, momentPlanned, momentsWithin, nextDate } from "../lib/insights-calendar";
import { EVIDENCE, evidenceFor } from "../lib/insights-evidence";

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

// A roundup's material is the map's jobs with no write-up of their own.
// Since 28 Oct 2026 every job names one (the 40 write-ups in content/drafts),
// so the vetting below runs on the map's jobs with their write-ups set aside,
// and the filter is checked on its own.
const jobs = roundupJobs(mapProjects.map((p) => ({ ...p, post: undefined, slug: undefined })));
const existing: Existing[] = [
  { title: "Bike boxes: what they are, and how the green stays green", phrases: ["bike box"] },
  { title: "Parking lot line painting vs thermoplastic markings", phrases: ["parking lot line painting"] },
];
const guide = (over: Partial<RawIdea> = {}): RawIdea => ({
  kind: "guide",
  title: "Choosing a crosswalk surface that survives the plow",
  searchPhrase: "Crosswalk Plow Damage",
  systems: ["traffic-patterns-xd", "traffic-patterns"],
  applications: ["crosswalks"],
  questions: [
    "What does a snow plow do to a painted crosswalk?",
    "How does an inlaid thermoplastic crosswalk hold up to plows?",
    "What should a specification say about plow season?",
  ],
  ...over,
});
const vet = (raw: RawIdea[], max = 10) => vetIdeas(raw, { existing, jobs, max });

console.log("The jobs a roundup may use");
check("only documented jobs with no article of their own", () => {
  assert.ok(jobs.length > 10, `${jobs.length} jobs`);
  const written = mapProjects.filter((p) => p.post);
  assert.ok(written.length > 0);
  assert.equal(roundupJobs(written).length, 0, "a job with a write-up is never a roundup's");
});
check("places spelled out, systems known", () => {
  for (const j of jobs) {
    assert.doesNotMatch(j.place, /, [A-Z]{2}$/, j.id);
    assert.ok(j.systemSlug, j.id);
  }
});

console.log("Guides");
check("a good guide becomes a plan Idea at the bottom of the plan", () => {
  const { docs } = vet([guide()]);
  assert.equal(docs.length, 1);
  const d = docs[0];
  assert.equal(d._type, "storyIdea");
  assert.equal(d.status, "idea");
  assert.equal(d.priority, 3);
  assert.equal(d.type, "Guide");
  assert.match(d._id, /^storyIdea-auto-[a-z0-9-]+$/);
  assert.equal(d.searchPhrase, "crosswalk plow damage");
  assert.deepEqual(d.systems.map((s) => s._ref), ["product-traffic-patterns-xd", "product-traffic-patterns"]);
  assert.deepEqual(d.applications.map((a) => a._ref), ["application-crosswalks"]);
});
check("its brief is the questions, and nothing the drafter could take as fact", () => {
  const { docs } = vet([guide({ questions: ["Paint lasts 1 year, so why use it?", "Thermoplastic is the best choice.", "What does a plow do to paint?", "How is an inlaid crosswalk specified?"] })]);
  const [first, ...lines] = docs[0].brief.split("\n");
  assert.equal(first, QUESTIONS_BRIEF);
  // The last line asks for a documented job to lead with: the map has TrafficPatternsXD jobs.
  assert.deepEqual(lines, ["- What does a plow do to paint?", "- How is an inlaid crosswalk specified?", `- ${LEAD_JOB_QUESTION}`]);
});
check("a guide asks for a documented job to lead with only when the map has one of its systems", () => {
  const withJobs = vet([guide()]).docs[0].brief;
  assert.ok(withJobs.includes(LEAD_JOB_QUESTION), "TrafficPatternsXD is on the map");
  const none = vet([guide({ title: "Recoating a worn asphalt parking lot", searchPhrase: "asphalt maintenance coating", systems: ["durashield"], applications: ["parking-lots"] })]).docs[0].brief;
  assert.ok(!none.includes(LEAD_JOB_QUESTION), "no DuraShield job on the map: a parking lot job of another system doesn't count");
  assert.ok(goodQuestion(LEAD_JOB_QUESTION), "the line passes the planner's own question rules");
});
check("no \"vs\" in a title or a question (Vern, 20 Oct 2026)", () => {
  for (const title of ["Thermoplastic vs coatings for crosswalks", "Stamped asphalt versus pavers on a driveway", "Crosswalk surfaces vs. winter"]) {
    const { docs, dropped } = vet([guide({ title, searchPhrase: "crosswalk surface choice" })]);
    assert.equal(docs.length, 0, title);
    assert.match(dropped[0].why, /"vs"/);
  }
  assert.equal(goodQuestion("How do thermoplastic vs coated crosswalks wear in winter?"), false);
  assert.equal(goodQuestion("How does preformed thermoplastic compare versus a pavement coating?"), false);
  assert.equal(goodQuestion("Where does a parking lot need preformed thermoplastic?"), true);
  const roundup = vet([{ kind: "roundup", title: "Community crosswalks vs plain ones", searchPhrase: "community crosswalk art", jobIds: jobs.slice(0, 3).map((j) => j.id) }]);
  assert.equal(roundup.docs.length, 0, "a roundup's title too");
});
check("a question that names a place or client, or assumes its answer, is dropped", () => {
  for (const q of [
    "Why did York Region choose TrafficPatterns for its Viva rapidway crossings?",
    "Why does TrafficPatternsXD outlast paint on Toronto's busiest crosswalks?",
    "What makes TrafficPatternsXD the only crosswalk system that survives a snowplow?",
    "How did the City of Kelowna specify its crosswalks?",
    "Which system is best for a school zone?",
  ]) assert.equal(goodQuestion(q), false, q);
  for (const q of [
    "How does an inlaid thermoplastic crosswalk hold up to plows?",
    "What should a TrafficPatternsXD specification cover in Canada?",
    "How does AODA guidance shape a crosswalk's contrast?",
  ]) assert.equal(goodQuestion(q), true, q);
});
check("the drafter and the fact check get the questions apart from the facts", () => {
  const { docs } = vet([guide()]);
  const facts = factsBlock({ productSlugs: ["traffic-patterns"], applicationSlugs: [], brief: docs[0].brief });
  assert.match(facts, /NOT facts and support no statement/);
  assert.doesNotMatch(facts, /treat as true/);
  assert.ok(!facts.includes(QUESTIONS_BRIEF), "the marker line itself isn't repeated");
  const editor = factsBlock({ productSlugs: [], applicationSlugs: [], brief: "Installed in Milton, Ontario in 2024." });
  assert.match(editor, /the brief; treat as true/);
});
check("fewer than two good questions: dropped", () => {
  const { docs, dropped } = vet([guide({ questions: ["What does a plow do to paint?", "It lasts 10 years."] })]);
  assert.equal(docs.length, 0);
  assert.match(dropped[0].why, /questions/);
});
check("a system without a Product Book page, or made up, is left out", () => {
  const { docs } = vet([guide({ systems: ["traffic-patterns", "airmark", "magic-paint"] })]);
  assert.deepEqual(docs[0].systems.map((s) => s._ref), ["product-traffic-patterns"]);
  const none = vet([guide({ systems: ["magic-paint"] })]);
  assert.equal(none.docs.length, 0);
});
check("an application without a Product Book spread is left out", () => {
  const { docs } = vet([guide({ applications: ["crosswalks", "moon-bases"] })]);
  assert.deepEqual(docs[0].applications.map((a) => a._ref), ["application-crosswalks"]);
});
check("a roundup only names the site's own systems and applications", () => {
  const appSlugs = new Set(applications.map((a) => a.slug));
  for (const j of jobs) {
    if (j.applicationSlug) assert.ok(appSlugs.has(j.applicationSlug), j.applicationSlug);
    assert.ok(PRODUCT_CATALOGUE[j.systemSlug], `${j.id}: ${j.systemSlug} has a Product Book page`);
  }
});

check("a title with a figure, a claim, or (for a guide) a place: dropped", () => {
  assert.equal(vet([guide({ title: "Five crosswalk surfaces compared", searchPhrase: "crosswalk surfaces" })]).docs.length, 1);
  assert.equal(vet([guide({ title: "The 5 crosswalk surfaces compared" })]).docs.length, 0);
  assert.equal(vet([guide({ title: "Why thermoplastic outlasts paint" })]).docs.length, 0);
  assert.equal(vet([guide({ title: "The best crosswalk surface for winter" })]).docs.length, 0);
  assert.equal(vet([guide({ title: "Crosswalk surfaces for Toronto winters" })]).docs.length, 0);
});

console.log("Roundups");
const three = jobs.filter((j) => j.application === "Community Branding").slice(0, 3);
check("there are enough jobs to group", () => assert.equal(three.length, 3));
check("a roundup's brief is the jobs' own records, word for word", () => {
  const { docs } = vet([{ kind: "roundup", title: "Community crosswalks that tell a town's story", searchPhrase: "community crosswalk art", jobIds: three.map((j) => j.id) }]);
  assert.equal(docs.length, 1);
  const d = docs[0];
  assert.equal(d.type, "Project Profile");
  for (const j of three) {
    assert.ok(d.brief.includes(j.excerpt), `${j.id}'s record`);
    assert.ok(d.brief.includes(`${j.title}, ${j.place}.`), `${j.id}'s place`);
  }
  assert.match(d.brief, /add nothing about these jobs/);
  assert.ok(!/—/.test(d.brief), "no em dash");
  assert.deepEqual([...new Set(d.systems.map((s) => s._ref))].length, d.systems.length);
});
check("a job that isn't documented, or already has an article, is left out", () => {
  const withPost = mapProjects.find((p) => p.post)!;
  const { docs, dropped } = vet([{ kind: "roundup", title: "Three crosswalks", searchPhrase: "crosswalk examples", jobIds: [three[0].id, three[1].id, withPost.id, "made-up-job"] }]);
  assert.equal(docs.length, 0);
  assert.match(dropped[0].why, /three documented jobs/);
});
check("every job's record goes into a brief as written", () => {
  for (let i = 0; i + 3 <= jobs.length; i += 3) {
    const group = jobs.slice(i, i + 3);
    const { docs } = vetIdeas([{ kind: "roundup", title: `Roundup ${String.fromCharCode(97 + i / 3)} of documented jobs`, searchPhrase: `roundup ${String.fromCharCode(97 + i / 3)}`, jobIds: group.map((j) => j.id) }], { existing: [], jobs, max: 1 });
    for (const j of group) assert.ok(docs[0]?.brief.includes(j.excerpt), `${j.id}: ${j.excerpt}`);
  }
});
check("a job already in another roundup isn't featured again", () => {
  const first = vet([{ kind: "roundup", title: "Community crosswalks that tell a town's story", searchPhrase: "community crosswalk art", jobIds: three.map((j) => j.id) }]).docs[0];
  const again = vetIdeas([{ kind: "roundup", title: "Crosswalk art by the water", searchPhrase: "waterfront crosswalk art", jobIds: three.map((j) => j.id) }], { existing: [...existing, { title: first.title, phrases: [first.searchPhrase], brief: first.brief }], jobs, max: 5 });
  assert.equal(again.docs.length, 0);
  const sameBatch = vet([
    { kind: "roundup", title: "Community crosswalks that tell a town's story", searchPhrase: "community crosswalk art", jobIds: three.map((j) => j.id) },
    { kind: "roundup", title: "Crosswalk art by the water", searchPhrase: "waterfront crosswalk art", jobIds: three.map((j) => j.id) },
  ]);
  assert.equal(sameBatch.docs.length, 1);
});
check("six jobs at most", () => {
  const many = jobs.slice(0, 9).map((j) => j.id);
  const { docs } = vet([{ kind: "roundup", title: "Nine jobs on one page", searchPhrase: "decorative pavement projects canada", jobIds: many }]);
  assert.equal(docs[0].brief.split("\n").filter((l) => l.startsWith("- ")).length, 6);
});

console.log("No repeats");
check("the same search phrase as a plan item: dropped", () => {
  const { docs, dropped } = vet([guide({ title: "Keeping a green bike box green", searchPhrase: "Bike box" })]);
  assert.equal(docs.length, 0);
  assert.match(dropped[0].why, /Bike boxes/);
});
check("a title that says the same thing in a different order: dropped", () => {
  assert.ok(repeats({ title: "Thermoplastic markings vs line painting for parking lots", searchPhrase: "parking lot markings" }, existing));
});
check("a different question about the same system: kept", () => {
  assert.equal(repeats({ title: "How a bike lane gets its colour back after winter", searchPhrase: "bike lane colour" }, existing), undefined);
});
check("two of the new ideas can't repeat each other", () => {
  const { docs, dropped } = vet([guide(), guide({ title: "Choosing a crosswalk surface that survives plows" })]);
  assert.equal(docs.length, 1);
  assert.equal(dropped.length, 1);
});
check("words ignores case, punctuation, accents, plurals and small words", () => {
  assert.deepEqual([...words("The Crosswalks, and the PLOW!")].sort(), ["crosswalk", "plow"]);
  assert.deepEqual([...words("coloured bike lanes")], [...words("coloured bike lane")]);
  assert.deepEqual([...words("transit station surfaces")], [...words("transit station surface")]);
  assert.deepEqual([...words("pavement markings")], [...words("pavement marking")]);
  assert.deepEqual([...words("Montréal")], ["montreal"]);
});
check("a plural of an article's search phrase counts as the same", () => {
  assert.ok(repeats({ title: "Coloured lanes for cyclists", searchPhrase: "coloured bike lanes" }, [{ title: "Coloured bike lanes that stay coloured", phrases: ["coloured bike lane"] }]));
});

console.log("House style and limits");
check("no em dash in a title", () => {
  const { docs } = vet([guide({ title: "Crosswalks in winter — what survives the plow" })]);
  assert.equal(docs[0].title, "Crosswalks in winter, what survives the plow");
});
check("no more than it was asked for", () => {
  const raw = [guide(), guide({ title: "How long an inlaid crosswalk lasts", searchPhrase: "inlaid crosswalk lifespan" }), guide({ title: "Specifying a coloured bus lane", searchPhrase: "red bus lane specification", systems: ["mmax"] })];
  assert.equal(vet(raw, 2).docs.length, 2);
});
check("no title or no search phrase: dropped", () => {
  assert.equal(vet([guide({ title: "" }), guide({ searchPhrase: " " })]).docs.length, 0);
});

console.log("\nThe calendar (lib/insights-calendar.ts)");
const OCT15 = new Date("2026-10-15T14:00:00Z");
const moment = (id: string) => {
  const m = MOMENTS.find((x) => x.id === id);
  if (!m) throw new Error(`no moment ${id}`);
  return m;
};
const day = (d: Date) => d.toISOString().slice(0, 10);
check("the clocks go back on the first Sunday of November", () => {
  assert.equal(day(nextDate(moment("clocks-back"), OCT15)), "2026-11-01");
  assert.equal(day(dateIn(moment("clocks-back").when, 2027)), "2027-11-07");
});
check("a date that has passed this year is next year's", () => {
  assert.equal(day(nextDate(moment("earth-day"), OCT15)), "2027-04-22");
  assert.equal(day(nextDate(moment("remembrance-day"), new Date("2026-11-11T20:00:00Z"))), "2026-11-11");
  assert.equal(day(nextDate(moment("remembrance-day"), new Date("2026-11-12T01:00:00Z"))), "2027-11-11");
});
check("from 15 Oct 2026 the moments due an article are the clocks, Remembrance Day and plow season", () => {
  assert.deepEqual(momentsWithin(OCT15, 14, 70).map((m) => m.id), ["clocks-back", "remembrance-day", "plow-season"]);
});
check("every moment names known systems and applications, and a library job that is on the map", () => {
  for (const m of MOMENTS) {
    assert.ok(m.systems.length, `${m.id}: no system`);
    for (const s of m.systems) assert.ok(PRODUCT_CATALOGUE[s], `${m.id}: ${s}`);
    for (const a of m.applications) assert.ok(applications.some((x) => x.slug === a), `${m.id}: ${a}`);
    if (m.libraryJob) assert.ok(mapProjects.some((p) => p.id === m.libraryJob), `${m.id}: ${m.libraryJob}`);
    assert.ok(!/[\u2014]/.test(m.angle + m.name), `${m.id}: an em dash`);
  }
});

console.log("\nArticles timed for a moment");
const due = momentsWithin(OCT15, 14, 70);
const vetT = (raw: RawIdea[], over: Partial<Parameters<typeof vetIdeas>[1]> = {}) =>
  vetIdeas(raw, { existing, jobs, max: 10, moments: due, now: OCT15, ...over });
const memorial = guide({ title: "Memorial crosswalks before Remembrance Day", searchPhrase: "memorial crosswalk", moment: "remembrance-day", systems: ["traffic-patterns"], applications: ["community-branding"] });
check("go in at priority 1, with the moment's line after the questions", () => {
  const { docs, dropped } = vetT([memorial]);
  assert.equal(docs.length, 1, JSON.stringify(dropped));
  assert.equal(docs[0].priority, 1);
  assert.ok(docs[0].brief.startsWith(QUESTIONS_BRIEF), "a guide's brief still starts with its questions");
  const rd = moment("remembrance-day");
  assert.ok(docs[0].brief.includes(momentKey(rd, nextDate(rd, OCT15))));
  assert.ok(momentPlanned(rd, OCT15, [docs[0].brief]), "the next run sees it planned");
  assert.ok(!momentPlanned(rd, new Date("2027-10-01T00:00:00Z"), [docs[0].brief]), "next year's date is a new moment");
});
check("a roundup can be timed too, and its moment line is never filed as a fact", () => {
  const ids = jobs.slice(0, 3).map((j) => j.id);
  const { docs } = vetT([{ kind: "roundup", title: "Crossings that came through the winter", searchPhrase: "crosswalk winter durability", jobIds: ids, moment: "plow-season" }]);
  assert.equal(docs.length, 1);
  assert.equal(docs[0].priority, 1);
  const line = docs[0].brief.split("\n").pop()!;
  assert.ok(line.startsWith("Timely: for the start of plow season"));
  const facts = factsBlock({ productSlugs: ["traffic-patterns-xd"], applicationSlugs: [], brief: docs[0].brief });
  const [asTrue, timing] = [facts.split("## From HUB's editor")[1]?.split("## Timing")[0] ?? "", facts.split("## Timing")[1] ?? ""];
  assert.ok(!asTrue.includes("Timely:"), "not in the brief treated as true");
  assert.ok(timing.includes(line), "filed under Timing");
});
check("an ordinary idea stays at priority 3, with no moment line", () => {
  const { docs } = vetT([guide()]);
  assert.equal(docs[0].priority, 3);
  assert.ok(!docs[0].brief.includes("Timely:"));
});
check("a second idea for the same moment, or one for a moment not due, is an ordinary idea", () => {
  const { docs } = vetT([
    memorial,
    guide({ title: "Commemorative crosswalks with veterans groups", searchPhrase: "commemorative crosswalk", moment: "remembrance-day" }),
    guide({ title: "Cooler playground surfaces in summer", searchPhrase: "cool playground surface", moment: "earth-day", systems: ["streetbondsr"] }),
  ]);
  assert.deepEqual(docs.map((d) => d.priority), [1, 3, 3]);
});
check("when the plan isn't low, only articles for a due moment go in", () => {
  const { docs, dropped } = vetT([guide(), memorial], { onlyMoments: true });
  assert.deepEqual(docs.map((d) => d.title), ["Memorial crosswalks before Remembrance Day"]);
  assert.equal(dropped.length, 1);
});
check("the cap never cuts an article for a due moment", () => {
  const { docs } = vetT([guide(), guide({ title: "How long an inlaid crosswalk lasts", searchPhrase: "inlaid crosswalk lifespan" }), memorial], { max: 1 });
  assert.deepEqual(docs.map((d) => d.title), ["Memorial crosswalks before Remembrance Day"]);
});

console.log("\nOutside evidence (lib/insights-evidence.ts)");
check("every study has a source, its limits, and tags HUB has pages for", () => {
  for (const e of EVIDENCE) {
    assert.match(e.source.url, /^https:\/\//, e.id);
    assert.ok(e.limits.length > 40, `${e.id}: limits`);
    for (const s of e.systems) assert.ok(PRODUCT_CATALOGUE[s], `${e.id}: ${s}`);
    for (const a of e.applications) assert.ok(applications.some((x) => x.slug === a), `${e.id}: ${a}`);
    assert.ok(!/[\u2014]/.test(e.finding + e.limits + e.who), `${e.id}: an em dash`);
  }
});
check("a bus-lane article gets the San Francisco red-lane study, a driveway article none", () => {
  assert.ok(evidenceFor(["mmax"], ["bus-lanes"]).some((e) => e.id === "sfmta-red-transit-lanes"));
  assert.equal(evidenceFor(["chipfill"], ["residential-driveways"]).length, 0);
});
check("the writer's facts carry the study with its limits and source, only when it applies", () => {
  const f = factsBlock({ productSlugs: ["mmax"], applicationSlugs: ["bus-lanes"] });
  assert.ok(f.includes("## Outside evidence"));
  assert.ok(f.includes("Limits (give these with the finding)"));
  assert.ok(f.includes("https://dot.ca.gov/"));
  assert.ok(!factsBlock({ productSlugs: ["chipfill"], applicationSlugs: ["residential-driveways"] }).includes("## Outside evidence"));
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll passed");
