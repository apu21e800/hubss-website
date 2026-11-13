/**
 * `npm run test:studio`: Doug's guide (lib/office-guide.ts) reads as the
 * Studio must (scripts/test-studio-words.ts): no machinery named, the house
 * style kept (lib/style-lint.ts), every label it bolds one the Studio (or
 * Doug's email) prints,
 * and the private record for his review link (lib/review-link-record.ts)
 * has a dotted id, so the public API never returns it. No network.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OFFICE_GUIDE, guideText, labelRuns, GUIDE_PATH } from "../lib/office-guide";
import { DOUGS_LINK_ID, DOUGS_LINK_TYPE } from "../lib/review-link-record";
import { lintCopy, lintHeading } from "../lib/style-lint";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

/** The same words scripts/test-studio-words.ts keeps out of the Studio. */
const MACHINERY: [RegExp, string][] = [
  [/\bAI\b/, "AI"],
  [/\bClaude\b/i, "Claude"],
  [/\bAnthropic\b/i, "Anthropic"],
  [/\bdrafters?\b/i, "the drafter"],
  [/\bmachine tells?\b/i, "machine tell"],
  [/\bby (itself|themselves)\b/i, "by itself"],
  [/\bautomat(ed|ion|ic)\b/i, "automation"],
  [/\b(LLM|GPT|chatbot|robot)s?\b/i, "a machine"],
  [/\bcron\b/i, "cron"],
  [/\bBuffer\b/, "Buffer"],
];

console.log("Doug's guide (lib/office-guide.ts)");
const lines = guideText();
check("the guide is filled in", () => {
  assert.ok(OFFICE_GUIDE.steps.length >= 5, `${OFFICE_GUIDE.steps.length} steps`);
  assert.ok(OFFICE_GUIDE.lead.length > 20 && OFFICE_GUIDE.foot.length > 20, "no lead or foot");
  for (const s of OFFICE_GUIDE.steps) assert.ok(s.steps.length >= 2 && s.next.length >= 1, `${s.id}: too thin`);
});
check("every step has its own anchor", () => {
  const ids = OFFICE_GUIDE.steps.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, "a repeated id");
  for (const id of ids) assert.match(id, /^[a-z][a-z-]*$/, id);
});
check("no machinery is named", () => {
  const hits = lines.flatMap((t) => MACHINERY.filter(([re]) => re.test(t)).map(([, what]) => `${what}: "${t.slice(0, 80)}"`));
  assert.deepEqual(hits, []);
});
check("the house style holds on every line", () => {
  const issues = lines.flatMap((t) => lintCopy(t).map((i) => `${i.message}: "${t.slice(0, 80)}"`));
  assert.deepEqual(issues, []);
});
check("the titles are sentence case", () => {
  const heads = [OFFICE_GUIDE.title, ...OFFICE_GUIDE.steps.map((s) => s.title)];
  const issues = heads.flatMap((t) => lintHeading(t).map((i) => `${i.message}: "${t}"`));
  assert.deepEqual(issues, []);
});
check("no em dash, no exclamation mark", () => {
  for (const t of lines) {
    assert.doesNotMatch(t, /—|--/, t);
    assert.doesNotMatch(t, /!/, t);
  }
});
check("every bold label is one the Studio or Doug's email prints", () => {
  const studio = [
    readFileSync(path.join(ROOT, "sanity/structure.ts"), "utf8"),
    readFileSync(path.join(ROOT, "sanity/schemas/blogPost.ts"), "utf8"),
    readFileSync(path.join(ROOT, "sanity/schemas/fieldPost.ts"), "utf8"),
    readFileSync(path.join(ROOT, "sanity/components/EditOnThePage.tsx"), "utf8"),
    readFileSync(path.join(ROOT, "sanity/components/GuidePane.tsx"), "utf8"),
    readFileSync(path.join(ROOT, "sanity/components/ForReviewInput.tsx"), "utf8"),
    readFileSync(path.join(ROOT, "sanity/components/JobPhotosInput.tsx"), "utf8"),
    // Doug's email ("Read the article"), which the review step starts from.
    readFileSync(path.join(ROOT, "lib/review-notify.ts"), "utf8"),
  ].join("\n");
  // Studio's own buttons, which no file of ours prints.
  const own = new Set(["+", "Publish"]);
  const labels = OFFICE_GUIDE.steps.flatMap((s) => [...s.steps, ...s.next]).flatMap((t) => labelRuns(t).filter((r) => r.bold).map((r) => r.text));
  const missing = labels.filter((l) => !own.has(l) && !studio.includes(`"${l}"`) && !studio.includes(`${l}<`) && !studio.includes(`${l}\n`) && !studio.includes(l));
  assert.deepEqual(missing, []);
});
check("the review record is private and the guide's page is under /studio", () => {
  assert.ok(DOUGS_LINK_ID.includes("."), "a dotted id keeps the record out of the public API");
  assert.doesNotMatch(DOUGS_LINK_TYPE, /\./);
  assert.ok(GUIDE_PATH.startsWith("/studio/"), GUIDE_PATH);
});

console.log(failures ? `\n${failures} failed` : "\nall passed");
process.exit(failures ? 1 : 0);
