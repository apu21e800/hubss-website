/**
 * `npm run test:redirects`: every old spec-sheet address in
 * lib/legacy-doc-redirects.ts lands on a PDF that is really in /public/docs,
 * and the addresses Search Console showed the most clicks for are covered.
 * Since 20 Oct 2026 also the old addresses the client's SEO brief found Google
 * crawling into a 404 (LANDS, below): each lands on a page in one hop, checked
 * against next.config.ts's own redirects in order. No network. Reads the
 * files the build writes first (lib/document-sizes.json, lib/blog-index.json).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { applications } from "../lib/applications";
import { CURRENT_DOCS, KNOWN, legacyDocRedirects, literal, TO_PAGE } from "../lib/legacy-doc-redirects";
import { products } from "../lib/products";

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

const PUBLIC = path.join(process.cwd(), "public");
const redirects = legacyDocRedirects();

check("every destination is a file in /public/docs, or a system's page that exists", () => {
  for (const r of redirects) {
    if (r.destination.startsWith("/products/")) {
      assert.ok(products.some((p) => `/products/${p.slug}` === r.destination), `${r.source} -> ${r.destination}`);
      continue;
    }
    const file = path.join(PUBLIC, decodeURIComponent(r.destination));
    assert.ok(fs.existsSync(file), `${r.source} -> ${r.destination}`);
  }
});
check("an old sheet sent to its system's page has no copy here (a file added later takes over)", () => {
  const firstPage = redirects.findIndex((r) => !r.destination.startsWith("/docs/"));
  assert.ok(firstPage > 0, "system-page rules exist");
  assert.ok(redirects.slice(firstPage).every((r) => !r.destination.startsWith("/docs/")), "they all come after the file rules");
  for (const from of Object.keys(TO_PAGE)) {
    const name = from.slice(from.lastIndexOf("/") + 1);
    assert.ok(!CURRENT_DOCS.some((d) => d.endsWith(`/${name}`)), `${name} is in /public/docs: drop it from TO_PAGE`);
  }
});
check("the StreetBond safety data sheets land on the StreetBond page until HUB sends current ones", () => {
  const sds = redirects.filter((r) => /SDS-StreetBond/.test(r.source));
  assert.equal(sds.length, 3);
  for (const r of sds) assert.equal(r.destination, "/products/streetbond");
});
check("every hand-matched old address points at a current PDF", () => {
  for (const [from, to] of Object.entries(KNOWN)) assert.ok(CURRENT_DOCS.includes(to), `${from} -> ${to}`);
});
check("no source is listed twice", () => {
  const sources = redirects.map((r) => r.source);
  assert.equal(new Set(sources).size, sources.length);
});

// The old addresses with the most Google clicks, Jun 2025 to Oct 2026.
const TOP = [
  "/wp-content/uploads/2023/03/MMAX-Product-Data.pdf",
  "/wp-content/uploads/2023/03/SB150-AL-Pavement-Coating-Part-A-B-TDS.pdf",
  "/wp-content/uploads/2023/03/TrafficPatternsXD-Specification-Branded.pdf",
  "/wp-content/uploads/2023/03/DuraShield-Pavement-Coating-Part-A-B-Color-Solar-Gray-TDS.pdf",
  "/wp-content/uploads/2023/03/StreetBond-SB150-Over-Concrete-Specification.pdf",
  "/wp-content/uploads/2023/03/SB120-Pavement-Coating-Part-A-B.pdf",
  "/wp-content/uploads/2023/03/TrafficPaint-for-Airfields.pdf",
  "/wp-content/uploads/2023/03/StreetBond-Pro-220-TDS.pdf",
  "/wp-content/uploads/2024/09/Application_Instructions_MMAX_Corundum_Area_Markings.pdf",
  "/wp-content/uploads/2023/03/StreetBond-QS-Concrete-TDS-1.pdf",
  "/wp-content/uploads/2023/03/StreetBond-Concrete-Primer-WB-TDS.pdf",
];

/** Does a redirect source (literal, or with the :year/:month params) match this path? */
function matches(source: string, p: string): boolean {
  const m = /^\/wp-content\/uploads\/\d{4}\/\d{2}\/(.+)$/.exec(p);
  const generic = m ? `/wp-content/uploads/:year(\\d{4})/:month(\\d{2})/${literal(m[1])}` : null;
  return source === literal(p) || source === generic;
}

check("the old sheets Google sent people to most are covered", () => {
  for (const p of TOP) {
    const hit = redirects.find((r) => matches(r.source, p));
    assert.ok(hit, `${p} has no rule`);
  }
});

// ── The old addresses Google still crawled into a 404 (20 Oct 2026) ──────────
// From the client's SEO brief (Search Console, Not found): each old address
// and the page it must land on, in ONE hop. Checked against next.config.ts's
// own redirects(), first match wins, as Next and Vercel serve them, so a rule
// added above one of these, a landing page that starts redirecting, or a
// landing page that goes away fails here. The /blog/ ones are the posts the
// old pages were sent to until 22 Sep 2026; each lands where its old page
// does today.
const LANDS: Record<string, string> = {
  "/blog/surface-solutions-school-playgrounds": "/applications/playgrounds",
  "/blog/decorative-asphalt-communities": "/applications/community-branding",
  "/blog/asphalt-coatings-parks-plazas": "/applications/parks-paths",
  "/blog/streetbondsr-cooler-asphalt": "/applications/leed-urban-heat-island",
  "/blog/enhancing-transit-hubs-gta-vancouver": "/applications/public-spaces",
  "/blog/rutland-centennial-park-kelowna": "/applications/parks-paths",
  "/blog/societe-transport-saguenay": "/applications/crosswalks",
  "/blog/bikeway-intersection": "/applications/bike-lanes",
  "/blog/decorative-asphalt-renewal": "/applications/playgrounds",
  "/blog/asphalt-coatings-playgrounds": "/blog/playgrounds-recreation",
  "/blog/west-vancouver-rainbow-crosswalk": "/applications/crosswalks",
  "/blog/ackerys-alley-orpheum-laneway": "/applications/public-art",
  "/blog/stamped-asphalt-2-years-wear": "/applications/crosswalks",
  "/blog/ralphs-farm-market-parking-lot": "/applications/parking-lots",
  "/blog/squamish-nation-rainbow-crosswalk": "/applications/crosswalks",
  "/blog/melfort-waterpark-splash-pad": "/applications/splash-pads",
  "/blog/victoria-harbour-walkway": "/blog/pedestrian-channelization-public-spaces",
  "/blog/sports-court-asphalt-paving": "/applications/sport-courts",
  "/blog/rainbow-crosswalk-sechelt": "/applications/crosswalks",
  "/blog/white-rock-stamped-pathway": "/applications/parks-paths",
  "/blog/checkerboard-crosswalk-coquitlam": "/applications/crosswalks",
  "/blog/first-nations-crosswalk-granville": "/applications/crosswalks",
  "/blog/lickman-interchange-roundabout": "/applications/traffic-calming",
  "/blog/stamped-asphalt-viva-next": "/blog/multimodal-connectivity-york-region",
  "/blog/decorative-paving-townhomes": "/blog/community-branding-case-study",
  "/blog/decorative-paving-public-art-joyce": "/applications/public-art",
  "/blog/residential-decorative-paving": "/applications/townhomes",
  "/blog/laneway-revitalization-vancouver": "/blog/laneway-project",
  "/blog/residential-decorative-driveways": "/applications/residential-driveways",
  "/blog/decorative-paving-playgrounds": "/applications/playgrounds",
  "/blog/parking-lot-wayfinding": "/applications/parking-lots",
  "/blog/durable-coatings-asphalt": "/applications/leed-urban-heat-island",
  "/blog/stamped-asphalt-decorative-crosswalks": "/applications/crosswalks",
  "/blog/enhanced-parking-lot-surfaces": "/applications/parking-lots",
  "/tag/streetprint": "/products/streetprint",
  "/tag/trafficpatternsxd": "/products/traffic-patterns-xd",
  // The feeds (the brief counts 17), by shape. One under a prefix that has its
  // own fallback keeps landing there.
  "/feed": "/blog",
  "/feed/atom": "/blog",
  "/comments/feed": "/blog",
  "/squamish-nation-rainbow-crosswalk/feed": "/blog",
  "/tag/streetprint/feed": "/blog",
  "/blog/feed": "/blog",
  "/stamped-asphalt/decorative-asphalt-crosswalks/feed": "/products/streetprint",
  "/projects/best-crosswalks-canada/feed": "/gallery",
  "/wp-content/uploads/2014/04/TrafficPatternsXD_CrossSectionDetail.pdf": "/docs/TrafficPatternsXD/TrafficPatternsXD-CrossSection-Detail.pdf",
};

type Rule = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

/** A destination with the matched params filled in, as Next fills them. */
function fill(destination: string, params: Record<string, unknown>): string {
  return destination.replace(/:(\w+)[*+?]?/g, (whole, key: string) => {
    const v = params[key];
    if (Array.isArray(v)) return v.join("/");
    return typeof v === "string" ? v : whole;
  });
}

/** Does this site build a page (or hold a file) at this path? */
function isPage(p: string, posts: Set<string>): boolean {
  if (p.startsWith("/docs/")) return fs.existsSync(path.join(PUBLIC, decodeURIComponent(p)));
  if (fs.existsSync(path.join(process.cwd(), "app", ...p.split("/").filter(Boolean), "page.tsx"))) return true;
  const [, section, slug, ...rest] = p.split("/");
  if (!slug || rest.length) return false;
  if (section === "blog") return posts.has(slug);
  if (section === "applications") return applications.some((a) => a.slug === slug);
  if (section === "products") return products.some((x) => x.slug === slug);
  return false;
}

/** The posts this build publishes, and next.config.ts's redirects for a request to hubss.com. */
async function loadRules(): Promise<{ rules: Rule[]; posts: Set<string> }> {
  const index = path.join(process.cwd(), "lib", "blog-index.json");
  if (!fs.existsSync(index)) throw new Error("lib/blog-index.json is missing: run `npm run gen:blog-index` (npm run build does it first)");
  const posts = new Set((JSON.parse(fs.readFileSync(index, "utf8")) as { slug: string }[]).map((p) => p.slug));
  const config: NextConfig = (await import("../next.config")).default;
  // The www rule (`has: host`) is not for a request to hubss.com.
  const rules = ((await config.redirects?.()) ?? []).filter((r) => !r.has && !r.missing);
  return { rules, posts };
}

async function main() {
  let rules: Rule[] = [];
  let posts = new Set<string>();
  try {
    ({ rules, posts } = await loadRules());
    console.log(`  ok    next.config.ts's redirects load (${rules.length} for hubss.com, ${posts.size} posts)`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  next.config.ts's redirects load\n        ${err instanceof Error ? err.message : err}`);
  }
  const matchers = rules.map((rule) => ({ rule, match: getPathMatch(rule.source, { strict: true, removeUnnamedParams: true }) }));
  /** The rule Next applies to this path (the first that matches), and where it sends it. */
  const firstMatch = (p: string) => {
    for (const { rule, match } of matchers) {
      const params = match(p);
      if (params) return { rule, to: fill(rule.destination, params) };
    }
    return null;
  };

  if (rules.length) {
    check("the old addresses Google crawled into a 404 land on a page, in one hop", () => {
      const bad: string[] = [];
      for (const [from, to] of Object.entries(LANDS)) {
        const slug = from.startsWith("/blog/") ? from.slice("/blog/".length) : null;
        const hit = firstMatch(from);
        if (slug && posts.has(slug)) {
          // A post published on the slug since: the post wins, nothing redirects it.
          if (hit) bad.push(`${from} is a live post, but ${hit.rule.source} redirects it to ${hit.to}`);
          continue;
        }
        if (!hit) { bad.push(`${from} has no rule`); continue; }
        if (hit.to !== to) { bad.push(`${from} -> ${hit.to} (by ${hit.rule.source}), expected ${to}`); continue; }
        const again = firstMatch(to);
        if (again) { bad.push(`${from} -> ${to} -> ${again.to}: a second hop`); continue; }
        if (!isPage(to, posts)) bad.push(`${from} -> ${to}: no such page`);
      }
      assert.deepEqual(bad, []);
    });
    check("the feed rule takes only addresses that end in /feed, and no page here does", () => {
      const feed = matchers.find((m) => m.rule.source === "/:path*/feed");
      assert.ok(feed, "the /:path*/feed rule is gone");
      for (const p of ["/comments/feed", "/a/b/c/feed"]) assert.ok(feed.match(p), `${p} should match`);
      for (const p of ["/feedback", "/blog/feeds", "/products/streetprint", "/feed/atom"]) assert.ok(!feed.match(p), `${p} should not match`);
      const pages = [
        ...[...posts].map((s) => `/blog/${s}`),
        ...applications.map((a) => `/applications/${a.slug}`),
        ...products.map((x) => `/products/${x.slug}`),
      ];
      (function walk(dir: string, route: string) {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          if (!e.isDirectory()) continue;
          const seg = `${route}/${e.name}`;
          pages.push(seg);
          walk(path.join(dir, e.name), seg);
        }
      })(path.join(process.cwd(), "app"), "");
      assert.deepEqual(pages.filter((p) => /\/feed$/i.test(p)), []);
    });
  }

  console.log(`\n${redirects.length} redirects for ${CURRENT_DOCS.length} current PDFs and ${Object.keys(KNOWN).length} renamed ones; ${Object.keys(LANDS).length} old addresses followed through ${rules.length} rules`);
  if (failures) {
    console.log(`\n${failures} failed`);
    process.exit(1);
  }
  console.log("\nAll passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
