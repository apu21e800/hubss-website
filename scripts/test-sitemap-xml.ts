/**
 * scripts/test-sitemap-xml.ts — the sitemap's addresses are XML-safe.
 *
 * EARNED BY: on 3 Nov 2026 the live /sitemap.xml held 4,439 bare "&" (every
 * Sanity photo address carries ?w=…&q=…&auto=format&fit=max) and was not
 * well-formed XML: Semrush reported "Invalid sitemap.xml format", and an XML
 * parser stops at line 6. Next prints <loc> and <image:loc> as given, so the
 * route escapes them (lib/sitemap-xml.ts, xmlText / xmlSafeSitemap).
 *
 * Run: npx tsx scripts/test-sitemap-xml.ts
 */
import assert from "node:assert/strict";
import { xmlSafeSitemap, xmlText } from "../lib/sitemap-xml";

let passed = 0;
const ok = (name: string, fn: () => void) => { fn(); passed++; console.log(`  ok  ${name}`); };

ok("& < > \" ' are escaped", () => {
  assert.equal(xmlText("https://cdn.sanity.io/a.jpg?w=1920&q=75&auto=format&fit=max"),
    "https://cdn.sanity.io/a.jpg?w=1920&amp;q=75&amp;auto=format&amp;fit=max");
  assert.equal(xmlText(`<"it's">`), "&lt;&quot;it&apos;s&quot;&gt;");
});

ok("an address with nothing to escape is unchanged", () => {
  assert.equal(xmlText("https://hubss.com/products/premark"), "https://hubss.com/products/premark");
});

ok("escaping is not applied twice", () => {
  // The data is plain; only the route escapes, once.
  assert.equal(xmlText("a&b"), "a&amp;b");
  assert.notEqual(xmlText(xmlText("a&b")), "a&amp;b");
});

ok("xmlSafeSitemap escapes url and images and keeps the rest", () => {
  const out = xmlSafeSitemap([
    { url: "https://hubss.com/", lastModified: new Date(0), changeFrequency: "daily", priority: 1, images: ["https://cdn.sanity.io/x.jpg?w=1&q=2"] },
    { url: "https://hubss.com/contact", priority: 0.5 },
  ]);
  assert.equal(out[0].url, "https://hubss.com/");
  assert.deepEqual(out[0].images, ["https://cdn.sanity.io/x.jpg?w=1&amp;q=2"]);
  assert.equal(out[0].priority, 1);
  assert.equal(out[0].changeFrequency, "daily");
  assert.equal(out[1].images, undefined);
  assert.equal(out[1].url, "https://hubss.com/contact");
});

ok("the rendered XML parses once the addresses are escaped", () => {
  // The exact lines Next writes (resolve-route-data.js), with one escaped address.
  const image = xmlText("https://cdn.sanity.io/x.jpg?w=1920&q=75&auto=format&fit=max");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n<url>\n<loc>https://hubss.com</loc>\n<image:image>\n<image:loc>${image}</image:loc>\n</image:image>\n</url>\n</urlset>`;
  // A bare "&" followed by a name and no ";" is the token that broke the live file.
  assert.doesNotMatch(xml, /&(?!amp;|lt;|gt;|quot;|apos;|#)/);
  const raw = xml.replace("&amp;q=75", "&q=75");
  assert.match(raw, /&(?!amp;|lt;|gt;|quot;|apos;|#)/);
});

console.log(`sitemap xml: ${passed} checks passed`);
