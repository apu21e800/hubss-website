/**
 * Generates lib/blog-index.json — a lightweight search manifest of all blog
 * posts (title, slug, excerpt). Runs automatically before `next build` via
 * the npm "prebuild" hook; run manually with `npm run gen:blog-index`.
 */
import * as fs from "fs";
import * as path from "path";

const dir = path.join(process.cwd(), "content", "blog");
const out = [];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const raw = fs.readFileSync(path.join(dir, f), "utf8");
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const get = (k) => fm[1].match(new RegExp(`^${k}:\\s*"?([^"\\r\\n]+)"?`, "m"))?.[1]?.trim();
  out.push({
    slug: f.replace(/\.mdx$/, ""),
    title: get("title") ?? f.replace(/\.mdx$/, ""),
    excerpt: (get("excerpt") ?? "").slice(0, 140),
  });
}
out.sort((a, b) => a.title.localeCompare(b.title));
fs.writeFileSync(path.join(process.cwd(), "lib", "blog-index.json"), JSON.stringify(out, null, 1));
console.log(`blog-index: ${out.length} posts`);
