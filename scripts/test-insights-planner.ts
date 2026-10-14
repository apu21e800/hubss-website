/**
 * Tests for the Insights plan top-up (lib/insights-planner.ts): `npm run
 * test:planner`. No network.
 *
 * What they protect: a new plan item names only systems and applications HUB
 * has Idea Book pages for, never repeats an article or plan item, carries no
 * claim the drafter could take as fact (a guide's brief is questions only; a
 * roundup's brief is the jobs' own records, word for word), and the plan is
 * topped up by no more than it asks for.
 */
import assert from "node:assert/strict";
import { mapProjects } from "../lib/map-projects";
import { PRODUCT_CATALOGUE } from "../lib/product-catalogue";
import { applications } from "../lib/applications";
import { repeats, roundupJobs, vetIdeas, words, type Existing, type RawIdea } from "../lib/insights-planner";

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

const jobs = roundupJobs();
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
  for (const j of jobs) assert.ok(!mapProjects.find((p) => p.id === j.id)?.post, j.id);
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
  const lines = docs[0].brief.split("\n").slice(1);
  assert.deepEqual(lines, ["- What does a plow do to paint?", "- How is an inlaid crosswalk specified?"]);
});
check("fewer than two good questions: dropped", () => {
  const { docs, dropped } = vet([guide({ questions: ["What does a plow do to paint?", "It lasts 10 years."] })]);
  assert.equal(docs.length, 0);
  assert.match(dropped[0].why, /questions/);
});
check("a system without an Idea Book page, or made up, is left out", () => {
  const { docs } = vet([guide({ systems: ["traffic-patterns", "airmark", "magic-paint"] })]);
  assert.deepEqual(docs[0].systems.map((s) => s._ref), ["product-traffic-patterns"]);
  const none = vet([guide({ systems: ["magic-paint"] })]);
  assert.equal(none.docs.length, 0);
});
check("an application without an Idea Book spread is left out", () => {
  const { docs } = vet([guide({ applications: ["crosswalks", "moon-bases"] })]);
  assert.deepEqual(docs[0].applications.map((a) => a._ref), ["application-crosswalks"]);
});
check("a roundup only names the site's own systems and applications", () => {
  const appSlugs = new Set(applications.map((a) => a.slug));
  for (const j of jobs) {
    if (j.applicationSlug) assert.ok(appSlugs.has(j.applicationSlug), j.applicationSlug);
    assert.ok(PRODUCT_CATALOGUE[j.systemSlug], `${j.id}: ${j.systemSlug} has an Idea Book page`);
  }
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
check("words ignores case, punctuation and small words", () => {
  assert.deepEqual([...words("The Crosswalks, and the PLOW!")].sort(), ["crosswalk", "plow"]);
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

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll passed");
