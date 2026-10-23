/**
 * `npm run test:studio` (with test-edit-on-the-page.ts): what Doug reads in
 * Studio names no machinery (Vern, 19 Oct 2026: "let's not let Doug know it's
 * that easy to publish"; CLAUDE.md, under Project posts). 23 Oct 2026, after
 * the Square One review found "the AI writer" in the Blog ideas list's title
 * and the Tuesday and Thursday drafts' notes still began "Drafted by Claude".
 * No network.
 *
 * - Every string and every piece of text in the Studio's own code (sanity/
 *   and sanity.config.ts): list titles, field titles and descriptions,
 *   validation messages, option labels, the Edit on the page button.
 * - The notes the blog drafter and the Projects job write into a draft, built
 *   here from stand-in drafts, a failed rewrite included, and the style
 *   report "Sent to Buffer" shows.
 * - The locks: no Delete, Unpublish or Duplicate on the pages, Site Settings
 *   or a "Sent to Buffer" record (sanity/document-locks.ts).
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { buildDraftDocument, type Idea, type Linked } from "../lib/field-note-pipeline";
import { styleReport, type Draft, type FactCheck, type StylePass } from "../lib/field-note-drafter";
import { buildProjectDocument, type ProjectSource } from "../lib/project-posts";
import { LOCKED_ACTIONS, LOCKED_TYPES, withoutLockedActions } from "../sanity/document-locks";

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

/** Words that tell Doug how the work is done. "Automatically" stays allowed: Studio uses it for its own form ("disappears automatically"). */
const MACHINERY: [RegExp, string][] = [
  [/\bAI\b/, "AI"],
  [/\bClaude\b/i, "Claude"],
  [/\bAnthropic\b/i, "Anthropic"],
  [/\bdrafters?\b/i, "the drafter"],
  [/\bmachine tells?\b/i, "machine tell"],
  [/\bby (itself|themselves)\b/i, "by itself"],
  [/\bautomat(ed|ion|ic)\b/i, "automation"],
  [/\b(LLM|GPT|chatbot|robot)s?\b/i, "a machine"],
];
const named = (text: string) => MACHINERY.filter(([re]) => re.test(text)).map(([, what]) => what);

// ── The Studio's own code ───────────────────────────────────────────────────
function studioFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) return studioFiles(p);
    return /\.(ts|tsx)$/.test(name) ? [p] : [];
  });
}

/** Every string literal, template text and JSX text in a file, with its line. Comments are not text Doug sees. */
function textsIn(file: string): { line: number; text: string }[] {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out: { line: number; text: string }[] = [];
  const add = (node: ts.Node, text: string) => {
    if (text.trim()) out.push({ line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1, text });
  };
  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node, node.text);
    else if (ts.isTemplateExpression(node)) add(node, [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(" "));
    else if (ts.isJsxText(node)) add(node, node.text);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

console.log("What Studio shows (sanity/, sanity.config.ts)");
const files = [...studioFiles(path.join(ROOT, "sanity")), path.join(ROOT, "sanity.config.ts")];
check(`the scan reads the Studio's files (${files.length})`, () => assert.ok(files.length >= 12, "too few files: the scan is looking in the wrong place"));
check("the scan finds the list titles and field descriptions it is meant to read", () => {
  const all = files.flatMap((f) => textsIn(f).map((t) => t.text));
  assert.ok(all.some((t) => t.startsWith("Blog ideas · ")), "no Blog ideas list title found");
  assert.ok(all.some((t) => t.startsWith("Never shown on the site.")), "no Notes for the editor description found");
});
for (const file of files) {
  const rel = path.relative(ROOT, file);
  check(`${rel} names no machinery`, () => {
    const hits = textsIn(file).flatMap(({ line, text }) => named(text).map((what) => `${rel}:${line} says ${what}: "${text.trim().slice(0, 110)}"`));
    assert.deepEqual(hits, []);
  });
}

// ── The notes written into a draft ──────────────────────────────────────────
console.log("The notes in a draft (Notes for the editor) and on a Sent to Buffer record");
const xd: Linked = { _id: "product-traffic-patterns-xd", name: "TrafficPatternsXD", slug: "traffic-patterns-xd", hero: { asset: "image-xdhero-2400x1600-jpg", alt: "A crosswalk" } };
const lots: Linked = { _id: "application-parking-lots", name: "Parking Lots", slug: "parking-lots", hero: { asset: "image-lotshero-2400x1600-jpg", alt: "A parking lot" } };
const idea: Idea = { _id: "storyIdea-test", title: "Crossings in a retail parking lot", searchPhrase: "parking lot crosswalk", type: "Guide", brief: null, systems: [xd], applications: [lots] };
const draft: Draft = {
  title: "Fairview Park's crossings carry a retail lot's trucks",
  slug: "fairview-park-crossings",
  excerpt: "What went into the crossings at Fairview Park in Kitchener.",
  searchPhrases: ["parking lot crosswalk"],
  body: "Fairview Park's lot in Kitchener, Ontario takes delivery trucks every day.\n\n## What went in\n\nTrafficPatternsXD crossings.",
  factsUsed: ["Where: Kitchener, Ontario"],
};
const clean: FactCheck = { verdict: "clean", unsupported: [] };
const flagged: FactCheck = { verdict: "needs edits", unsupported: [{ quote: "every day", reason: "the record doesn't say how often" }] };
const styles: [string, StylePass][] = [
  ["a clean style check", { text: {}, flagged: 0, left: [] }],
  ["sentences rewritten", { text: {}, flagged: 3, left: [] }],
  ["sentences left, after a rewrite that failed", { text: {}, flagged: 2, left: [{ label: "Body", sentence: "Fast. Durable. Proven.", problems: ["Short fragments in a row."] }], error: "Claude ran out of room writing save_rewrites" }],
];
const source: ProjectSource = {
  _id: "fieldPost-test",
  place: "Kitchener, Ontario",
  note: "TrafficPatternsXD crossings in the Fairview Park lot.",
  writeUp: "The lot takes delivery trucks.",
  date: "2026-09-14",
  system: { _id: "product-traffic-patterns-xd", name: "TrafficPatternsXD", slug: "traffic-patterns-xd" },
  application: { _id: "application-parking-lots", name: "Parking Lots", slug: "parking-lots" },
  photos: [{ asset: "image-aaa-2400x1800-jpg", alt: "The crossings" }],
};
for (const [what, style] of styles) {
  for (const [checkName, factCheck] of [["clean", clean], ["flagged", flagged]] as const) {
    check(`a blog draft's notes, ${what}, fact check ${checkName}`, () => assert.deepEqual(named(buildDraftDocument(idea, draft, factCheck, "x", style).editorNotes), []));
    check(`a Projects draft's notes, ${what}, fact check ${checkName}`, () =>
      assert.deepEqual(named(buildProjectDocument(source, draft, factCheck, "x", "2026-10-26T14:00:00.000Z", style).editorNotes), []));
  }
  check(`the style report on a Sent to Buffer record, ${what}`, () => assert.deepEqual(named(styleReport(style, "in Buffer before approving").join("\n")), []));
}
check("the notes say who wrote the draft", () => assert.match(buildDraftDocument(idea, draft, clean, "x").editorNotes, /^Written by 21e8 on \d{4}-\d{2}-\d{2} from the Blog idea "Crossings in a retail parking lot"\./));
check("a failed rewrite's error stays out of the notes", () => {
  const notes = styleReport(styles[2][1], "before publishing").join("\n");
  assert.doesNotMatch(notes, /ran out of room|save_rewrites/);
  assert.match(notes, /The rewrite didn't run this time\./);
});

// ── The locks ───────────────────────────────────────────────────────────────
console.log("What can't be deleted (sanity/document-locks.ts)");
const actions = ["publish", "unpublish", "unpublishVersion", "delete", "duplicate", "discardChanges", "restore", "schedule"].map((action) => ({ action }));
for (const type of ["page", "siteSettings", "socialLog"]) {
  check(`${type}: no Delete, Unpublish or Duplicate; Publish and the rest stay`, () =>
    assert.deepEqual(withoutLockedActions(actions, type).map((a) => a.action), ["publish", "discardChanges", "restore", "schedule"]));
}
for (const type of ["blogPost", "storyIdea", "fieldPost", "product", "application"]) {
  check(`${type}: every action stays`, () => assert.deepEqual(withoutLockedActions(actions, type), actions));
}
check("the lists are what this file tests", () => {
  assert.deepEqual([...LOCKED_TYPES].sort(), ["page", "siteSettings", "socialLog"]);
  assert.deepEqual([...LOCKED_ACTIONS].sort(), ["delete", "duplicate", "unpublish", "unpublishVersion"]);
});
check("sanity.config.ts applies the locks", () => {
  const config = readFileSync(path.join(ROOT, "sanity.config.ts"), "utf8");
  assert.match(config, /import \{ withoutLockedActions \} from "\.\/sanity\/document-locks"/);
  assert.match(config, /withoutLockedActions\(prev, context\.schemaType\)/);
});

console.log(failures ? `\n${failures} failing` : "\nall passing");
process.exit(failures ? 1 : 0);
