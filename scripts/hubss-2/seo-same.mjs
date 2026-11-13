// HUBSS 2.0: what search reads must not move. For each page, the served HTML of two
// sites is compared on its title, description, canonical, robots, share tags, h1,
// structured data, image addresses with their alt text, and the addresses it links to.
//   node scripts/hubss-2/seo-same.mjs https://hubss.com http://localhost:4311 [paths...]
const [a, b, ...extra] = process.argv.slice(2);
const PAGES = extra.length ? extra : ["/", "/products", "/products/traffic-patterns-xd", "/products/streetprint", "/products/streetbond", "/applications", "/applications/crosswalks", "/applications/bike-lanes", "/blog", "/blog/projects", "/blog/guides", "/blog/railway-lands-crosswalks-toronto", "/about", "/contact", "/lunch-learn", "/resources", "/gallery", "/patterns", "/product-book", "/request-product-book", "/privacy"];
const strip = (s) => s.replace(/<!--.*?-->/gs, "");
const text = (s) => strip(s).replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const host = (s, base) => s.split(base).join("").replace(/https?:\/\/(www\.)?hubss\.com/g, "").replace(/http:\/\/localhost:\d+/g, "");
function read(html, base) {
  const meta = (re) => (html.match(re)?.[1] ?? "").trim();
  const all = (re) => [...html.matchAll(re)].map((m) => m[1]);
  const body = html.slice(html.indexOf("<body"));
  return {
    title: meta(/<title[^>]*>(.*?)<\/title>/s),
    description: meta(/<meta name="description" content="([^"]*)"/),
    canonical: host(meta(/<link rel="canonical" href="([^"]*)"/), base),
    robots: meta(/<meta name="robots" content="([^"]*)"/),
    ogTitle: meta(/<meta property="og:title" content="([^"]*)"/),
    ogDescription: meta(/<meta property="og:description" content="([^"]*)"/),
    ogImage: host(meta(/<meta property="og:image" content="([^"]*)"/), base).replace(/\?.*$/, ""),
    h1: all(/<h1[^>]*>(.*?)<\/h1>/gs).map(text).join(" | "),
    jsonld: all(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs).map((j) => host(j, base)).sort().join("\n"),
    images: [...new Set([...body.matchAll(/<img\b[^>]*>/g)].map((m) => { const src = (m[0].match(/\ssrc="([^"]*)"/)?.[1] ?? "").replace(/&amp;/g, "&"); const alt = m[0].match(/\salt="([^"]*)"/)?.[1] ?? ""; const u = src.includes("/_next/image") ? decodeURIComponent(src.match(/url=([^&]+)/)?.[1] ?? src) : src.replace(/\?.*$/, ""); return `${host(u, base)} :: ${alt}`; }))].sort().join("\n"),
    links: [...new Set([...body.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].map((m) => host(m[1].replace(/&amp;/g, "&"), base)))].sort().join("\n"),
  };
}
let diffs = 0;
for (const path of PAGES) {
  const [A, B] = await Promise.all([a, b].map(async (base) => read(await (await fetch(base + path, { headers: { "user-agent": "Mozilla/5.0 (compatible; hubss-2-seo-same)" } })).text(), base)));
  const out = [];
  for (const k of Object.keys(A)) {
    if (A[k] === B[k]) continue;
    if (k === "images" || k === "links" || k === "jsonld") { const x = new Set(A[k].split("\n")), y = new Set(B[k].split("\n")); const gone = [...x].filter((v) => !y.has(v)), come = [...y].filter((v) => !x.has(v)); out.push(`${k}: ${gone.length} only on the first, ${come.length} only on the second${gone.length ? " | first: " + gone.slice(0, 2).join(" ; ").slice(0, 200) : ""}${come.length ? " | second: " + come.slice(0, 2).join(" ; ").slice(0, 200) : ""}`); }
    else out.push(`${k}: "${A[k].slice(0, 90)}" -> "${B[k].slice(0, 90)}"`);
  }
  if (out.length) { diffs += out.length; console.log(path); out.forEach((o) => console.log("    ", o)); }
}
console.log(diffs ? `${diffs} differences on ${PAGES.length} pages` : `the same on both: title, description, canonical, robots, share tags, h1, structured data, images with alt text and links, ${PAGES.length} pages`);
