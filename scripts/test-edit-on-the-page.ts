/**
 * `npm run test:studio`: Studio's "Edit on the page" button and the article
 * preview it opens (21 Oct 2026). No network, no Studio login.
 *
 * - sanity/studio-pages.ts: the page each document is edited on, and the
 *   intent link the button sends, which must be the one Studio's own
 *   "Used on N pages" links send in the installed Sanity (checked against
 *   its code, so an upgrade that changes it fails here, not in Doug's hands).
 * - sanity.config.ts uses the same tool name, registers the button and keeps a
 *   "Used on N pages" list for every type that has a page.
 * - lib/blog.ts reads an article the build doesn't know only in draft mode,
 *   and lib/blog-taxonomy.ts dates an undated draft for the preview.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import {
  EDIT_ON_THE_PAGE_TOOL,
  PAGE_ROUTES,
  TYPES_WITH_A_PAGE,
  documentPage,
  editOnThePageIntent,
  publishedId,
} from "../sanity/studio-pages";
import { datedForPreview } from "../lib/blog-taxonomy";
import { toMeta, type RawPost } from "../lib/blog";
import { vercelStegaCombine } from "@vercel/stega";

let failures = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${err instanceof Error ? err.message : String(err)}`);
  }
}

const root = process.cwd(); // npm run test:studio runs from the repo root
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

console.log("Edit on the page");

check("an article opens at its own address", () => {
  assert.deepEqual(documentPage("blogPost", { slug: "asphalt-crack-filler-cracks-joints-potholes", title: "Fill the cracks" }), {
    title: "Fill the cracks",
    href: "/blog/asphalt-crack-filler-cracks-joints-potholes",
  });
});

check("products, applications and the four pages open at theirs", () => {
  assert.equal(documentPage("product", { slug: "streetprint", name: "StreetPrint" })?.href, "/products/streetprint");
  assert.equal(documentPage("application", { slug: "crosswalks", name: "Crosswalks" })?.href, "/applications/crosswalks");
  assert.equal(documentPage("page", { slug: "homepage" })?.href, "/");
  assert.equal(documentPage("page", { slug: "about" })?.href, "/about");
  assert.equal(documentPage("page", { slug: "contact" })?.href, "/contact");
  assert.equal(documentPage("page", { slug: "lunch-learn" })?.href, "/lunch-learn");
  assert.deepEqual(Object.keys(PAGE_ROUTES).sort(), ["about", "contact", "homepage", "lunch-learn"]);
});

check("no slug, an unknown page or a type without a page: no page", () => {
  assert.equal(documentPage("blogPost", { title: "New article" }), null);
  assert.equal(documentPage("blogPost", { slug: "   " }), null);
  assert.equal(documentPage("page", { slug: "not-a-page" }), null);
  assert.equal(documentPage("fieldPost", { slug: "x" }), null);
  assert.equal(documentPage("storyIdea", { slug: "x" }), null);
  assert.equal(documentPage("blogPost", null), null);
});

check("titles fall back when the name or title is empty", () => {
  assert.equal(documentPage("blogPost", { slug: "a", title: "" })?.title, "Article");
  assert.equal(documentPage("product", { slug: "a", name: null })?.title, "Product page");
  assert.equal(documentPage("application", { slug: "a" })?.title, "Application page");
});

check("the intent carries the published id, the type, the tool and the page", () => {
  assert.equal(publishedId("drafts.blogpost-x"), "blogpost-x");
  assert.equal(publishedId("versions.r123.blogpost-x"), "blogpost-x");
  assert.equal(publishedId("blogpost-x"), "blogpost-x");
  assert.deepEqual(editOnThePageIntent("drafts.blogpost-x", "blogPost", "/blog/x"), {
    intent: "edit",
    params: { id: "blogpost-x", type: "blogPost", mode: "presentation", presentation: "edit-on-the-page", preview: "/blog/x" },
  });
});

check("the installed Sanity's own 'Used on N pages' links send the same intent", () => {
  const require = createRequire(path.join(root, "package.json"));
  const sanityDir = path.dirname(require.resolve("sanity/package.json"));
  const chunk = readFileSync(path.join(sanityDir, "lib/_chunks-es/presentation.js"), "utf8");
  assert.match(chunk, /EDIT_INTENT_MODE = "presentation"/, "Presentation's edit mode is no longer \"presentation\"");
  const item = chunk.slice(chunk.indexOf("function LocationItem("), chunk.indexOf("function areUrlsMatching("));
  assert.ok(item.length > 0, "Sanity's LocationItem is gone: check how its links open the tool now");
  for (const part of [/intent: "edit"/, /mode: "presentation"/, /presentation: toolName/, /preview: node\.href/, /id: documentId/, /type: documentType/]) {
    assert.match(item, part, `Sanity's location link no longer has ${part}`);
  }
});

check("sanity.config.ts: one tool name, the button registered, a list for every type with a page", () => {
  const config = read("sanity.config.ts");
  assert.match(config, /presentationTool\(\{\s*name: EDIT_ON_THE_PAGE_TOOL,/);
  assert.match(config, /components: \{ input: EditOnThePageInput \}/);
  assert.match(config, /title: BLOG_NAME, href: "\/blog"/, "the blog's location should carry its current name");
  assert.doesNotMatch(config, /title: "Insights"/, "the blog is called Projects now (lib/field-notes-taxonomy.ts)");
  for (const type of TYPES_WITH_A_PAGE) {
    assert.match(config, new RegExp(`\\n  ${type}: defineLocations\\(`), `no "Used on N pages" list for ${type}`);
    assert.match(config, new RegExp(`documentPage\\("${type}", doc\\)`), `${type}'s list doesn't start at its own page`);
  }
  assert.equal(EDIT_ON_THE_PAGE_TOOL, "edit-on-the-page", "saved links to /studio/edit-on-the-page would break");
});

check("an article the build doesn't know is read only in draft mode", () => {
  const blog = read("lib/blog.ts");
  const getPost = blog.slice(blog.indexOf("export async function getPost("), blog.indexOf("export async function getPostsByType("));
  assert.match(getPost, /if \(BUILT\.has\(slug\)\) return fetchPost\(slug\);/);
  assert.match(getPost, /if \(isArchivedPost\(slug\) \|\| !\(await isPreview\(\)\)\) return null;/);
  const page = read("app/blog/[slug]/page.tsx");
  assert.match(page, /export const dynamicParams = false;/, "visitors' unknown slugs must stay a 404 before rendering");
});

check("an undated draft is dated now for the preview; a dated one keeps its date", () => {
  const now = new Date("2026-10-21T01:23:45.000Z");
  assert.equal(datedForPreview({ publishedAt: null }, now).publishedAt, "2026-10-21T01:23:45.000Z");
  const undated: { publishedAt?: string | null } = {};
  assert.equal(datedForPreview(undated, now).publishedAt, "2026-10-21T01:23:45.000Z");
  const dated = { publishedAt: "2026-10-07T04:49:22.814Z", title: "x" };
  assert.equal(datedForPreview(dated, now), dated);
});

check("a post's reading time in Edit on the page is the public page's: the preview's markers are not words", () => {
  const mark = (s: string) => vercelStegaCombine(s, { origin: "sanity.io", href: "/studio/intent/edit/id=blogpost-x;type=blogPost;path=body" });
  const body = Array.from({ length: 333 }, (_, i) => `word${i}`).join(" ");
  const plain: RawPost = { _id: "blogpost-x", title: "Rail safety marking", slug: "x", publishedAt: "2026-10-01T12:00:00Z", text: body, tableText: ["Width", "Colour"] };
  const marked: RawPost = { ...plain, text: body.split(". ").map(mark).join(". "), tableText: plain.tableText!.map((c) => mark(c!)) };
  const a = toMeta(plain)!;
  const b = toMeta(marked)!;
  assert.equal(a.wordCount, 335);
  assert.equal(b.wordCount, a.wordCount, `the preview counted ${b.wordCount} words against ${a.wordCount}`);
  assert.equal(b.readTime, a.readTime);
});

console.log("\nOnly what HUB's plan includes");

check("Releases, scheduled drafts and publishing, Tasks and comments are off: each led only to an upgrade screen", () => {
  const config = read("sanity.config.ts");
  for (const feature of ["releases", "scheduledDrafts", "scheduledPublishing", "tasks"]) {
    assert.match(config, new RegExp(`\\n  ${feature}: \\{ enabled: false \\},`), `${feature} is on again`);
  }
  assert.match(config, /document: \{\s*\/\/ Not on HUB's plan \(above\)\.\s*comments: \{ enabled: false \},/, "comments are on again");
});

if (failures) {
  console.log(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll Edit on the page checks passed");
