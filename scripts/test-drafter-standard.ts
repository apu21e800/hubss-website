/**
 * Tests for the article standard of 20 Oct 2026 (Vern, after the drafter's
 * first pieces: "need significant improvement ... written to a higher
 * standard"): `npm run test:drafter`. No network: Claude and Sanity are
 * never called.
 *
 * What they protect: the drafter's facts carry the project map's documented
 * jobs for the plan item's systems and applications, best first and at most
 * eight, each as the map records it; the job a draft leads with gives the
 * article its photo, from Sanity's CDN, framed as its gallery copy is framed
 * by hand in Studio, and anything else keeps the stand-in, the first system's
 * hero (the application's only when the item names no system); the writer's
 * rules carry the standard (no em dash, no "vs", the new lengths); and the
 * stamped asphalt link script changes link text, adds no link, and leaves
 * stamped-asphalt-parking-lot alone.
 */
import assert from "node:assert/strict";
import { mapProjects, TOUR_IDS, type MapProject } from "../lib/map-projects";
import { DOCUMENTED_JOBS_HEADING, DOCUMENTED_JOBS_MAX, documentedJobs, factsBlock, jobFacts } from "../lib/field-note-facts";
import { assetRefFromCdnUrl, buildDraftDocument, leadJobFor, pickFraming, type Idea, type Linked } from "../lib/field-note-pipeline";
import { SAVE_DRAFT, VOICE, type Draft, type FactCheck } from "../lib/field-note-drafter";
import { GLOSSARY_FOR_WRITERS } from "../lib/glossary";
import { lintCopy } from "../lib/style-lint";
import { fixLinks, planPost, SLUGS, type Block, type MarkDef } from "./stamped-asphalt-links";

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

const EM = "\u2014";
const job = (id: string): MapProject => {
  const j = mapProjects.find((p) => p.id === id);
  if (!j) throw new Error(`no map job ${id}`);
  return j;
};
/** The brief's order: a published write-up, then the tour's, then a year, then the rest. */
const tier = (j: MapProject) => (j.slug ? 0 : TOUR_IDS.includes(j.id) ? 1 : j.year ? 2 : 3);
const inOrder = (xs: number[]) => xs.every((x, i) => i === 0 || xs[i - 1] <= x);

console.log("Documented jobs (lib/field-note-facts.ts)");
const xd = documentedJobs(["traffic-patterns-xd"], []);
const lots = documentedJobs([], ["parking-lots"]);
check("for TrafficPatternsXD: jobs of that system, at most eight", () => {
  assert.ok(xd.length > 0 && xd.length <= DOCUMENTED_JOBS_MAX, `${xd.length}`);
  for (const j of xd) assert.ok([j.product, ...(j.systems ?? [])].includes("TrafficPatternsXD"), j.id);
});
check("for parking lots: the map's parking lot jobs, found by the map's name for them", () => {
  for (const j of lots) assert.equal(j.application, "Parking Lots", j.id);
  for (const id of ["halton-hills-toronto-premium-outlets", "kitchener-cadillac-fairview", "toronto-lot-crossing", "toronto-fleet-lot"]) {
    assert.ok(lots.some((j) => j.id === id), id);
  }
});
check("jobs with a write-up first, then the tour's, then those with a year", () => {
  for (const list of [xd, lots]) assert.ok(inOrder(list.map(tier)), list.map((j) => j.id).join(", "));
  assert.ok(lots[0].slug && !lots[lots.length - 1].slug, "published write-ups first");
});
check("a job that matches a system and an application comes before one that matches only one", () => {
  const both = documentedJobs(["traffic-patterns-xd", "streetbond"], ["parking-lots"]);
  assert.deepEqual(both.slice(0, 3).map((j) => j.id).sort(), ["halton-hills-toronto-premium-outlets", "kitchener-cadillac-fairview", "toronto-lot-crossing"]);
  assert.equal(both.length, DOCUMENTED_JOBS_MAX);
});
check("the jobs a brief names come first: a roundup's own records", () => {
  const brief = "Documented HUB jobs to feature, a short section each.\n- Every Child Matters crosswalk, Victoria Park, Kitchener, Ontario. System: TrafficPatterns.";
  assert.equal(documentedJobs(["traffic-patterns"], ["community-branding"], brief)[0].id, "kitchener-every-child-matters");
});
check("nothing for a system the map has no job of", () => {
  assert.deepEqual(documentedJobs(["durashield"], []), []);
  assert.deepEqual(documentedJobs([], []), []);
});
check("each job as the map records it: id, place, system, application, its own words, photo", () => {
  const fairview = job("kitchener-cadillac-fairview");
  const f = jobFacts(fairview);
  assert.match(f, /^### Fairview Park parking lot \(id: kitchener-cadillac-fairview\)$/m);
  assert.match(f, /^Where: Kitchener, Ontario$/m);
  assert.match(f, /^System: TrafficPatternsXD$/m);
  assert.match(f, /^Application: Parking Lots$/m);
  for (const words of [fairview.excerpt, fairview.problem!, fairview.solution!]) assert.ok(f.includes(words), words);
  assert.match(f, /^Photo: yes$/m);
  assert.match(jobFacts(job("white-rock-pier")), /^Photo: no$/m);
  assert.match(jobFacts(job("halton-hills-toronto-premium-outlets")), /^System: TrafficPatternsXD, with StreetPrint$/m);
  assert.match(jobFacts(job("burlington-spencer-smith")), /^Installed: 2017$/m);
  assert.match(jobFacts(job("toronto-lot-crossing")), /^Where: Toronto, Ontario \(approximate: the town is known, not the site\)$/m);
});
check("the write-up is linked only when its post is published; else the Product Portfolio Book page", () => {
  const tpo = job("halton-hills-toronto-premium-outlets");
  assert.match(jobFacts({ ...tpo, slug: "toronto-premium-outlets-14-years" }), /^Write-up: \/blog\/toronto-premium-outlets-14-years$/m);
  const unpublished = jobFacts({ ...tpo, slug: undefined });
  assert.doesNotMatch(unpublished, /Write-up/);
  assert.match(unpublished, /^Shown in the Product Portfolio Book: \/product-book\/86$/m);
  assert.doesNotMatch(jobFacts({ ...job("kitchener-cadillac-fairview"), slug: undefined }), /Write-up|product-book/, "no write-up and no book page: no link");
});
check("no job's facts carry an em dash", () => {
  for (const p of mapProjects) assert.ok(!jobFacts(p).includes(EM), p.id);
});
check("factsBlock files them under their own heading; a project profile goes without", () => {
  assert.equal(DOCUMENTED_JOBS_HEADING, "## Documented jobs (real places from the project map; say only what these lines say; when one fits, the article leads with it and its photo is the article's photo)");
  const f = factsBlock({ productSlugs: ["traffic-patterns-xd"], applicationSlugs: ["parking-lots"] });
  assert.ok(f.includes(DOCUMENTED_JOBS_HEADING));
  assert.ok(f.includes("(id: kitchener-cadillac-fairview)"));
  assert.ok(!factsBlock({ productSlugs: ["traffic-patterns-xd"], applicationSlugs: ["parking-lots"], jobs: false }).includes("## Documented jobs"));
});

console.log("\nThe lead job's photo (lib/field-note-pipeline.ts)");
const fairview = job("kitchener-cadillac-fairview");
const FAIRVIEW_REF = "image-bc7b3b9680acca7d096c734224ebd47b3e53881d-1200x900-jpg";
check("assetRefFromCdnUrl: a map photo on Sanity's CDN gives its asset id", () => {
  assert.equal(fairview.images[0], "https://cdn.sanity.io/images/9dbro2m1/production/bc7b3b9680acca7d096c734224ebd47b3e53881d-1200x900.jpg");
  assert.equal(assetRefFromCdnUrl(fairview.images[0]), FAIRVIEW_REF);
  assert.equal(assetRefFromCdnUrl(`${fairview.images[0]}?w=640&auto=format`), FAIRVIEW_REF, "a query string is ignored");
});
check("assetRefFromCdnUrl: a /images/map file, another project's photo, or nothing: null", () => {
  const audi = job("vaughan-audi");
  assert.equal(audi.images[0], "/images/map/vaughan-audi.jpg");
  assert.equal(assetRefFromCdnUrl(audi.images[0]), null);
  assert.equal(assetRefFromCdnUrl(fairview.images[0].replace("/9dbro2m1/", "/abc123/")), null);
  assert.equal(assetRefFromCdnUrl(""), null);
  assert.equal(assetRefFromCdnUrl(undefined), null);
});
check("every CDN photo on the map gives an asset id", () => {
  for (const p of mapProjects) {
    for (const src of p.images.filter((s) => s.startsWith("https://cdn.sanity.io/"))) {
      assert.match(assetRefFromCdnUrl(src) ?? "", /^image-[0-9a-f]{40}-\d+x\d+-[a-z]+$/, `${p.id}: ${src}`);
    }
  }
});

const lotsPage: Linked = { _id: "application-parking-lots", name: "Parking Lots", slug: "parking-lots", hero: { asset: "image-lotshero-2400x1600-jpg", alt: "A parking lot" } };
const xdPage: Linked = { _id: "product-traffic-patterns-xd", name: "TrafficPatternsXD", slug: "traffic-patterns-xd", hero: { asset: "image-xdhero-2400x1600-jpg", alt: "A crosswalk" } };
const idea: Idea = { _id: "storyIdea-test", title: "Crossings in a retail parking lot", searchPhrase: "parking lot crosswalk", type: "Guide", brief: null, systems: [xdPage], applications: [lotsPage] };
const draft: Draft = {
  title: "Fairview Park's crossings carry a retail lot's trucks",
  slug: "fairview-park-crossings",
  excerpt: "What went into the crossings at Fairview Park in Kitchener. What to specify for a lot like it.",
  searchPhrases: ["parking lot crosswalk"],
  body: "Fairview Park's lot in Kitchener, Ontario takes delivery trucks every day.\n\n## What went in\n\n[TrafficPatternsXD](/products/traffic-patterns-xd) crossings.",
  factsUsed: ["Where: Kitchener, Ontario"],
};
const clean: FactCheck = { verdict: "clean", unsupported: [] };
type Featured = { asset: { _ref: string }; alt: string; hotspot?: unknown; crop?: unknown } | undefined;
const featured = (doc: { featuredImage?: unknown }) => doc.featuredImage as Featured;

check("a draft that leads with a documented job takes that job's photo, with a plain alt", () => {
  const doc = buildDraftDocument(idea, { ...draft, leadJob: "kitchener-cadillac-fairview" }, clean, "x");
  assert.equal(featured(doc)?.asset._ref, FAIRVIEW_REF);
  assert.equal(featured(doc)?.alt, "Fairview Park parking lot, Kitchener, Ontario");
  assert.equal(featured(doc)?.hotspot, undefined);
  assert.match(doc.editorNotes, /PHOTO: the Fairview Park parking lot photo from the project map, the job the article leads with\./);
  assert.match(doc.editorNotes, /set the focal point on the TrafficPatternsXD in Studio/);
});
check("the map's own alt text wins when it has one", () => {
  const withAlt = { ...fairview, alt: "Brick-pattern crossings in the Fairview Park lot" };
  const i = mapProjects.indexOf(fairview);
  mapProjects[i] = withAlt;
  try {
    assert.equal(featured(buildDraftDocument(idea, { ...draft, leadJob: fairview.id }, clean, "x"))?.alt, "Brick-pattern crossings in the Fairview Park lot");
  } finally {
    mapProjects[i] = fairview;
  }
});
check("its focal point and crop are the ones set on its gallery copy in Studio", () => {
  const hotspot = { _type: "sanity.imageHotspot", x: 0.42, y: 0.71, width: 0.3, height: 0.3 };
  const crop = { _type: "sanity.imageCrop", top: 0, bottom: 0.1, left: 0, right: 0 };
  const doc = buildDraftDocument(idea, { ...draft, leadJob: "kitchener-cadillac-fairview" }, clean, "x", undefined, { hotspot, crop });
  assert.deepEqual(featured(doc)?.hotspot, hotspot);
  assert.deepEqual(featured(doc)?.crop, crop);
  assert.match(doc.editorNotes, /Its focal point is the one set on its gallery copy in Studio\./);
  assert.doesNotMatch(doc.editorNotes, /set the focal point/);
});
check("pickFraming: the gallery copy framed by hand", () => {
  assert.equal(pickFraming([]), null);
  assert.equal(pickFraming([{ hotspot: null, crop: null }]), null);
  const hotspot = { x: 0.5, y: 0.5 };
  assert.deepEqual(pickFraming([{ hotspot: null, crop: null }, { hotspot, crop: null }]), { hotspot, crop: null });
});
check("no lead job: the stand-in is the system's hero, not the application's", () => {
  const doc = buildDraftDocument(idea, draft, clean, "x");
  assert.equal(featured(doc)?.asset._ref, "image-xdhero-2400x1600-jpg");
  assert.equal(featured(doc)?.alt, "A crosswalk");
  assert.match(doc.editorNotes, /PHOTO: a stand-in, the TrafficPatternsXD page's hero photo\. If the post describes a particular project, swap in a photo of it\./);
});
const noHero: Linked = { _id: "product-durashield", name: "DuraShield", slug: "durashield", hero: { asset: null, alt: null } };
check("the stand-in's order: the first system with a hero; the application's only when the item names no system", () => {
  const ref = (i: Idea) => featured(buildDraftDocument(i, draft, clean, "x"))?.asset._ref;
  assert.equal(ref({ ...idea, systems: [xdPage, { ...noHero, hero: { asset: "image-second-2400x1600-jpg" } }] }), "image-xdhero-2400x1600-jpg", "the first system's");
  assert.equal(ref({ ...idea, systems: [noHero, xdPage] }), "image-xdhero-2400x1600-jpg", "a system with no hero is passed over");
  assert.equal(ref({ ...idea, systems: [] }), "image-lotshero-2400x1600-jpg", "no system: the application's");
  assert.equal(ref({ ...idea, systems: null }), "image-lotshero-2400x1600-jpg", "no system: the application's");
  assert.equal(ref({ ...idea, systems: [], applications: [] }), undefined, "neither: none");
});
check("an item with systems never takes the application's hero: with no system photo, none, and the notes ask for one", () => {
  const doc = buildDraftDocument({ ...idea, systems: [noHero] }, draft, clean, "x");
  assert.equal(featured(doc), undefined);
  assert.match(doc.editorNotes, /PHOTO: none\. Add a featured photo of HUB's own work before publishing\./);
});
check("the asphalt patch item, as the plan holds it on 20 Oct 2026: Fast Patch DPR's hero, never the Parking Lots walkway", () => {
  const system = (slug: string, name: string, asset: string): Linked => ({ _id: `product-${slug}`, name, slug, hero: { asset, alt: null } });
  const patch: Idea = {
    _id: "storyIdea-asphalt-patch",
    title: "Asphalt patch: cold patch, hot mix or a permanent repair product",
    status: "ready",
    type: "Guide",
    brief: null,
    systems: [
      system("fast-patch", "Fast Patch DPR", "image-e58314023b6dbcf9a565b90b8221063b41781da2-1480x912-jpg"),
      system("aggrefill", "AggreFill", "image-6969d130a52c712e5273a50680d12a01a42202b3-476x451-jpg"),
      system("chipfill", "ChipFill", "image-bc9a68667e03c408935905752c35a129c5447917-640x358-jpg"),
    ],
    applications: [{ _id: "application-parking-lots", name: "Parking Lots", slug: "parking-lots", hero: { asset: "image-8678e35b0c180d24b6c3741cce73c61e7f1d22fb-2400x1800-jpg", alt: null } }],
  };
  const doc = buildDraftDocument(patch, draft, clean, "x");
  assert.equal(featured(doc)?.asset._ref, "image-e58314023b6dbcf9a565b90b8221063b41781da2-1480x912-jpg");
  assert.match(doc.editorNotes, /PHOTO: a stand-in, the Fast Patch DPR page's hero photo\./);
});
check("a lead job whose photo is a /images/map file: the stand-in, and the notes say where the job's photo is", () => {
  const commercial: Linked = { _id: "application-commercial-spaces", name: "Commercial Spaces", slug: "commercial-spaces", hero: { asset: "image-comhero-2400x1600-jpg", alt: "A storefront" } };
  const audiIdea: Idea = { ...idea, applications: [commercial] };
  assert.equal(leadJobFor(audiIdea, "vaughan-audi")?.ref, null, "listed, but its photo is not in Sanity");
  const doc = buildDraftDocument(audiIdea, { ...draft, leadJob: "vaughan-audi" }, clean, "x");
  assert.equal(featured(doc)?.asset._ref, "image-xdhero-2400x1600-jpg");
  assert.match(doc.editorNotes, /PHOTO: a stand-in, the TrafficPatternsXD page's hero photo\. The article leads with the Audi Vaughan entrance job, whose photo is not in Studio yet \(https:\/\/hubss\.com\/images\/map\/vaughan-audi\.jpg\): upload it and use it instead\./);
});
check("a lead job its facts didn't list, or one made up: the stand-in", () => {
  for (const leadJob of ["made-up-job", "whitehorse-kwanlin-dun", " ", ""]) {
    const doc = buildDraftDocument(idea, { ...draft, leadJob }, clean, "x");
    assert.equal(featured(doc)?.asset._ref, "image-xdhero-2400x1600-jpg", JSON.stringify(leadJob));
  }
});
check("the notes keep the house style", () => {
  const cases: [Idea, string | undefined][] = [[idea, "kitchener-cadillac-fairview"], [idea, undefined], [{ ...idea, systems: [noHero] }, undefined]];
  for (const [i, leadJob] of cases) {
    assert.deepEqual(lintCopy(buildDraftDocument(i, { ...draft, leadJob }, clean, "x").editorNotes).map((x) => x.message), [], `${i.systems?.[0]?.name} ${leadJob}`);
  }
});

console.log("\nThe writer's rules (lib/field-note-drafter.ts, lib/glossary.ts)");
check("VOICE has no em dash", () => assert.ok(!VOICE.includes(EM)));
check("VOICE's SHAPE is the standard", () => {
  for (const rule of [
    "550 to 850 words of markdown for a guide; 350 to 600 for news or a project with a thin record",
    "named with its town and province, or at the decision on their desk",
    "Proof before explanation in every section",
    "One thing to keep, not three: a short checklist, a three-row table, or the questions to put to a supplier",
    "one passing mention at most",
    "No \"vs\" in any title or heading",
    "what to specify where, by job",
    "a sentence a person would say: under 70 characters",
    "The close is two or three lines",
  ]) assert.ok(VOICE.includes(rule), rule);
  assert.ok(!VOICE.includes("900 to 1,300"), "the old length is gone");
});
check("VOICE keeps the facts rule, links, house style, glossary and machine tells", () => {
  for (const part of ["THE FACTS RULE, which beats everything else", "LINKS: link the first mention of each HUB system", "HOUSE STYLE (docs/STYLE.md)", "GLOSSARY (docs/GLOSSARY.md)", "MACHINE TELLS", "Community and memorial work", "A contested topic"]) {
    assert.ok(VOICE.includes(part), part);
  }
});
check("SAVE_DRAFT says no \"vs\", and leadJob is offered but not required", () => {
  assert.match(SAVE_DRAFT.description ?? "", /No "vs"/);
  const props = SAVE_DRAFT.input_schema.properties as Record<string, { description?: string }>;
  assert.match(props.title.description ?? "", /No "vs"/);
  assert.match(props.leadJob.description ?? "", /documented job/);
  assert.ok(!(SAVE_DRAFT.input_schema.required ?? []).includes("leadJob"));
});
check("the glossary links the first stamped asphalt to /products/streetprint, and keeps its old lines", () => {
  assert.match(GLOSSARY_FOR_WRITERS, /the first mention of stamped asphalt that means StreetPrint links to \/products\/streetprint with "stamped asphalt" in the link text/);
  assert.ok(GLOSSARY_FOR_WRITERS.includes("TrafficPatternsXD is stamped into asphalt but is not stamped asphalt"));
  assert.match(GLOSSARY_FOR_WRITERS, /"Stamped asphalt" is the plain name for what StreetPrint is/);
  assert.ok(GLOSSARY_FOR_WRITERS.includes("StreetPrint is stamped asphalt: a pattern pressed into heated asphalt"));
  assert.ok(GLOSSARY_FOR_WRITERS.includes("Paint is not the subject"));
  assert.ok(!GLOSSARY_FOR_WRITERS.includes(EM));
});

console.log("\nStamped asphalt links (scripts/stamped-asphalt-links.ts)");
const span = (_key: string, text: string, marks: string[] = []) => ({ _type: "span" as const, _key, text, marks });
const linkTo = (_key: string, href = "https://hubss.com/products/streetprint"): MarkDef => ({ _type: "link", _key, href });
const block = (_key: string, children: ReturnType<typeof span>[], markDefs: MarkDef[] = [], style = "normal"): Block => ({ _type: "block", _key, style, children, markDefs });
const texts = (b: Block | null | undefined) => (b?.children ?? []).map((c) => (c as { text: string }).text);
check("\"see StreetPrint\" becomes \"see StreetPrint stamped asphalt\"; nothing else in the block changes", () => {
  const b = block("b1", [span("s1", "Or "), span("s2", "see StreetPrint", ["l1"]), span("s3", " for the specification.")], [linkTo("l1")]);
  const r = fixLinks(b);
  assert.deepEqual(texts(r.block), ["Or ", "see StreetPrint stamped asphalt", " for the specification."]);
  assert.deepEqual(r.block?.markDefs, b.markDefs);
  assert.deepEqual(texts(b), ["Or ", "see StreetPrint", " for the specification."], "the original is not changed in place");
});
check("a link that already says stamped asphalt is left alone, whatever form its address takes", () => {
  for (const href of ["/products/streetprint", "https://hubss.com/products/streetprint/", "https://www.hubss.com/products/streetprint#specs"]) {
    const r = fixLinks(block("b2", [span("s1", "StreetPrint stamped asphalt", ["l1"])], [linkTo("l1", href)]));
    assert.equal(r.block, null, href);
    assert.equal(r.kept.length, 1, href);
  }
});
check("a bare StreetPrint link the sentence follows with \"stamped asphalt\" takes those words in, so nothing is said twice", () => {
  const r = fixLinks(block("b3", [span("s1", "StreetPrint", ["l1"]), span("s2", " stamped asphalt keeps its pattern.")], [linkTo("l1")]));
  assert.deepEqual(texts(r.block), ["StreetPrint stamped asphalt", " keeps its pattern."]);
});
check("a link to another page is not touched", () => {
  assert.equal(fixLinks(block("b4", [span("s1", "StreetPrint", ["l1"])], [linkTo("l1", "https://hubss.com/products/streetbond")])).block, null);
});
check("a post's links are fixed and counted", () => {
  const plan = planPost([block("p", [span("s1", "Or "), span("s2", "see StreetPrint", ["l1"])], [linkTo("l1")]), block("q", [span("s3", "No link here.")])]);
  assert.equal(plan.links, 1);
  assert.deepEqual(plan.blocks.map((b) => b._key), ["p"]);
  assert.deepEqual(texts(plan.blocks[0]), ["Or ", "see StreetPrint stamped asphalt"]);
});
check("a post with no link to /products/streetprint is left as it is: no link is added, even on a mention of stamped asphalt", () => {
  for (const text of ["TrafficPatternsXD stamped asphalt parking lots are engineered for trucks.", "We used StreetPrint stamped asphalt on the lane.", "StreetPrint is the original."]) {
    const plan = planPost([block("h", [span("s0", "Stamped asphalt parking lots")], [], "h2"), block("p", [span("s1", text)])]);
    assert.deepEqual(plan.blocks, [], text);
    assert.deepEqual(plan.changes, [], text);
    assert.equal(plan.links, 0, text);
  }
});
check("stamped-asphalt-parking-lot is left alone: its stamped asphalt is TrafficPatternsXD's, and it has no StreetPrint link", () => {
  assert.ok(!(SLUGS as readonly string[]).includes("stamped-asphalt-parking-lot"));
  assert.deepEqual([...SLUGS], ["how-stamped-asphalt-is-installed", "residential-driveways-stamped-asphalt", "residential-driveways-stamped-asphalt-upgrade", "stamped-asphalt-vs-concrete"]);
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll passed");
