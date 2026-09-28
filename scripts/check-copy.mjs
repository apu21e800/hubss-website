#!/usr/bin/env node
/**
 * scripts/check-copy.mjs: the house style's two automatic checks outside Studio.
 *
 *   npm run check:copy    the last build (.next) has no em dash a reader can see.
 *                         Needs `npm run build` first; starts no server.
 *   npm run test:copy     lib/style-lint.ts still flags every bad sample and
 *                         none of the good ones. Run it after changing a rule.
 *
 * `npm run verify` runs the same page scan (scripts/verify-site.mjs imports
 * scanBuiltPages from here), so there is one implementation of the rule.
 *
 * WHY: Doug reads every page and does not want a single em dash on the site
 * (docs/STYLE.md "Machine tells"). On 27 Sep 2026 they were removed by hand
 * from the code and from Sanity; Studio now warns as copy is typed
 * (sanity/schemas/_shared.ts), and this catches whatever still reaches a page
 * (a fallback in code, a field Studio doesn't lint, a component's own text).
 *
 * What counts as seen: the text of the page (the <title> included), and the
 * alt, title, aria-label, aria-description and placeholder attributes, and
 * the description, title and image-alt meta tags. Not scripts (JSON-LD and
 * React's page data are inside them), styles or HTML comments.
 *
 * The .rsc files are left out. They are the same page data the HTML carries
 * inside its scripts: the props of client components, whether or not they are
 * ever shown, with no markup to tell visible text from a prop. Scanning them
 * would either repeat the HTML's hits or report text nobody sees.
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const EM = String.fromCharCode(0x2014);
const BAR = String.fromCharCode(0x2015); // horizontal bar: an em dash in most fonts
const EN = String.fromCharCode(0x2013);
const HAS_DASH = new RegExp(`[${EM}${BAR}]|&mdash;|&#8212;|&#x2014;`, "i");

const SEEN_ATTRS = new Set(["alt", "title", "aria-label", "aria-description", "placeholder"]);
const SEEN_META = /(?:^|:)(?:description|title|image:alt)$/i;

const decode = (s) =>
  s
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&mdash;|&#8212;|&#x2014;/gi, EM)
    .replace(/&amp;/g, "&");

/** 60 characters around each em dash in `text`, whitespace collapsed. */
function snippets(text) {
  const flat = decode(text).replace(/\s+/g, " ");
  const out = [];
  for (const m of flat.matchAll(new RegExp(`[${EM}${BAR}]`, "g"))) {
    const from = Math.max(0, m.index - 30);
    const to = Math.min(flat.length, m.index + 30);
    out.push(`${from > 0 ? "…" : ""}${flat.slice(from, to).trim()}${to < flat.length ? "…" : ""}`);
  }
  return out;
}

/** Every em dash a reader can see in one prerendered page: [{ where, snippet }]. */
export function dashesInHtml(html) {
  const page = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  const hits = [];
  for (const tag of page.matchAll(/<([a-zA-Z][\w:-]*)((?:\s+[^\s=>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g)) {
    const attrs = {};
    for (const a of tag[2].matchAll(/([^\s=>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? "";
    }
    const tagName = tag[1].toLowerCase();
    if (tagName === "link" || tagName === "base") continue; // their titles are never shown
    const isMeta = tagName === "meta";
    for (const [name, value] of Object.entries(attrs)) {
      if (!HAS_DASH.test(value)) continue;
      const metaName = attrs.name || attrs.property || "";
      if (SEEN_ATTRS.has(name) || (isMeta && name === "content" && SEEN_META.test(metaName))) {
        const where = isMeta ? `meta ${metaName}` : name;
        for (const snippet of snippets(value)) hits.push({ where, snippet });
      }
    }
  }
  const text = page.replace(/<[^>]*>/g, " ");
  for (const snippet of snippets(text)) hits.push({ where: "text", snippet });
  return hits;
}

/** "about.html" -> "/about", "blog/x.html" -> "/blog/x", "index.html" -> "/". */
function routeOf(rel) {
  const r = "/" + rel.split(path.sep).join("/").replace(/\.html$/, "");
  return r === "/index" ? "/" : r.replace(/\/index$/, "");
}

/**
 * Scan every prerendered page of the last build. Returns null when there is
 * no build, else { scanned, hits: [{ route, where, snippet }] }.
 */
export function scanBuiltPages(root = process.cwd()) {
  const dir = path.join(root, ".next", "server", "app");
  if (!fs.existsSync(dir)) return null;
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".html")) files.push(p);
    }
  })(dir);
  const hits = [];
  for (const f of files.sort()) {
    const route = routeOf(path.relative(dir, f));
    const seen = new Set();
    for (const h of dashesInHtml(fs.readFileSync(f, "utf8"))) {
      const key = `${h.where}|${h.snippet}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({ route, ...h });
    }
  }
  return { scanned: files.length, hits };
}

/** One line per hit, the way verify prints items: route, where, 60 characters. */
export const formatHit = (h) => `${h.route}  ${h.where === "text" ? "" : `${h.where}: `}"${h.snippet}"`;

// ── npm run test:copy ────────────────────────────────────────────────────────

async function selfTest() {
  let lint;
  try {
    lint = await import("../lib/style-lint.ts");
  } catch (e) {
    console.error(`  Could not load lib/style-lint.ts (${e.message}). Run it through tsx: npm run test:copy`);
    process.exit(2);
  }
  const { lintCopy, lintHeading, flagSentences, keepsFacts, PRODUCT_NAMES } = lint;
  const failures = [];
  let passed = 0;
  const rulesOf = (issues) => issues.map((i) => i.rule);
  const expect = (label, ok, got) => (ok ? passed++ : failures.push(`${label}\n        got: ${JSON.stringify(got)}`));

  // Copy that must pass untouched: the neighbours of each rule.
  const GOOD = [
    `StreetPrint lasts 10${EN}20 years; the 2026${EN}27 Idea Book lists it.`,
    "Landscape architects specify StreetBond for park paths.",
    "MMAX comes in 8 standard and 15 premium colours.",
    "DecoMark is available in standard and premium options.",
    "The crossings at Toronto Premium Outlets have been in service for fourteen years.",
    "Choose from a catalogue of four patterns, or design your own.",
    "The HUB Idea Book · Volume 5 has every system.",
    "Apply above -10°C and keep traffic off for 45 minutes.",
    "It is installed as a seamless, flexible asphalt surface with no joints for weeds.",
    "Seamless: zero joints",
    "Dark pavement absorbs solar energy, elevating ambient temperatures in urban cores.",
    "Elevated slip risk during rain and freeze-thaw cycles.",
    "This is not a minor consideration. These surfaces carry traffic every day.",
    "They are not the same job.",
    "It matters more than a building lobby mural because it is in the public right-of-way.",
    "The coating has cured for more than a decade without lifting.",
    "Read the spec sheet at https://hubss.com/docs/streetbond--tds.pdf before you order.",
    "Email doug.bain@hubss.com for samples.",
    "| System | Service life |\n| --- | --- |\n| StreetBond | 8+ years |",
    "- First item\n- Second item",
    "A snowplow-safe, heat-activated repair that stays flush.",
    "Book a Lunch & Learn",
    "Open the Idea Book",
  ];
  for (const g of GOOD) expect(`good copy flagged: ${g}`, lintCopy(g).length === 0, rulesOf(lintCopy(g)));

  // Copy that must be flagged, with the rule it breaks.
  const BAD = [
    ["em-dash", `The crosswalk ${EM} a TrafficPatternsXD install ${EM} lasts.`],
    ["em-dash", `Colour${EM}and safety.`],
    ["em-dash", `Built to last${BAR}for decades.`],
    ["double-hyphen", "The surface -- flush with the road -- stays put."],
    ["double-hyphen", "The surface--flush with the road--stays put."],
    ["double-hyphen", "Open to traffic in 45--60 minutes."],
    ["spaced-dash", `Heat-applied markings ${EN} and they last.`],
    ["spaced-dash", `A range of 10 ${EN} 20 years.`],
    ["spaced-dash", "Fast to install - and it lasts."],
    ["reversal", "StreetPrint isn't a coating applied on top of asphalt. It's stamped in."],
    ["reversal", "That is not a sales step; it is the part of the specification that counts."],
    ["reversal", "It's not paint, it's a preformed thermoplastic."],
    ["reversal", "These aren't renderings. They're installed surfaces."],
    ["reversal", "The impacts are not just aesthetic."],
    ["reversal", "The paint cycle isn't just a maintenance task."],
    ["reversal", "The crosswalks became not only safer but also a gateway."],
    ["reversal", "Not a sales pitch. An education."],
    ["reversal", "A crosswalk is more than a surface."],
    ["reversal", "Streets are more than just functional spaces."],
    ["fragments", "Fast. Durable. Proven."],
    ["fragments", "It comes in one piece. Still flat. Still tight. No weeds."],
    ["filler", "A seamless experience for every visitor."],
    ["filler", "Crews work seamlessly with the city."],
    ["filler", "A robust system for busy streets."],
    ["filler", "We leverage decades of experience."],
    ["filler", "Colour that elevates any streetscape."],
    ["filler", "The city elevated both the safety and the look of the corridor."],
    ["filler", "Unlocking the potential of laneways."],
    ["filler", "Cutting-edge thermoplastic technology."],
    ["filler", "A world-class installation team."],
    ["filler", "HUB offers decorative pavement solutions."],
    ["filler", "Premium quality at a fair price."],
    ["filler", "It reads as premium."],
    ["filler", "Navigating the changing regulatory landscape."],
    ["filler", "Primer ensures adhesion."],
    ["filler", "Let's build your signature space."],
    ["filler", "Project support tailored to your community."],
    ["filler", "Let us delve into the numbers."],
    ["stock-phrase", "Whether you're a planner or a contractor, it fits."],
    ["stock-phrase", "In today's cities, colour matters."],
    ["stock-phrase", "Think of it as visual language."],
    ["stock-phrase", "It's worth noting that the coating cures fast."],
    ["button", "Learn more"],
    ["button", "Explore the gallery"],
    ["exclamation", "Classic design never goes out of style!"],
    ["emoji", `Now booking Lunch & Learns ${String.fromCodePoint(0x1f6a7)}`],
    ["idea-book", "Every system is in the catalogue."],
    ["idea-book", "See HUB's 2027 catalogue for the colours."],
    ["insights", "Read more Field Notes on hubss.com."],
  ];
  for (const [rule, text] of BAD) {
    const got = rulesOf(lintCopy(text));
    expect(`"${text}" should break ${rule}`, got.includes(rule), got);
  }

  // Every message says what to do and has no em dash of its own.
  for (const [, text] of BAD) {
    for (const i of lintCopy(text)) {
      expect(`message has a dash: ${i.message}`, !i.message.includes(EM), i.message);
      expect(`excerpt missing or too long: ${i.excerpt}`, i.excerpt.length > 0 && i.excerpt.length <= 90, i.excerpt);
    }
  }

  // Headings.
  const GOOD_HEADINGS = [
    "Where the colour goes",
    "Open the Idea Book",
    "Book a Lunch & Learn",
    "Why York Region chose TrafficPatternsXD",
    "StreetBond vs. MMAX",
    "Fourteen years at Toronto Premium Outlets",
    "Specifying StreetPrint on King Street West",
    "Working with the Musqueam Indian Band",
    "UBC and the Musqueam crosswalk",
    "Crosswalks for Oakville and Burlington",
    "Asphalt & Concrete Repair",
    "Canadian-operated since 1999 · All 10 provinces",
    "Get in touch",
    "Plan it. Specify it. Install it.",
    "FAQ",
  ];
  for (const h of GOOD_HEADINGS) expect(`good heading flagged: ${h}`, lintHeading(h).length === 0, lintHeading(h).map((i) => i.message));
  const BAD_HEADINGS = [
    "Where The Colour Goes",
    "How It Works",
    "Book Your Free Session",
    "Claim Your Free Lunch & Learn",
    "Everything You Need to Know",
    "Your Whole Team. One Session.",
    "Redefining Hardscapes · Since 1999",
    "Why Choose TrafficPatterns For Your Crosswalk",
    "StreetPrint Driveways For Homeowners",
    "Challenge: Reinforcing Heritage in a Changing Urban Landscape",
    "Fourteen Years Of Service at Toronto Premium Outlets",
  ];
  for (const h of BAD_HEADINGS) expect(`Title Case missed: ${h}`, rulesOf(lintHeading(h)).includes("title-case"), lintHeading(h));

  // The drafters' rewrite: sentences, not fragments of them.
  const body = [
    "## Where The Colour Goes",
    "",
    `StreetBond adds colour ${EM} and it lasts. The texture isn't painted on. It's stamped in. Crews finish in a day.`,
    "",
    "| Option | Note |",
    "| --- | --- |",
    "| Paint | Needs a seamless repaint every year |",
    "",
    "- A list item that is fine.",
    "- A robust list item.",
  ].join("\n");
  const flagged = flagSentences(body, { headings: "markdown" });
  const texts = flagged.map((f) => f.text);
  expect("heading flagged without its ## marks", texts.includes("Where The Colour Goes"), texts);
  expect("em dash sentence flagged whole", texts.includes(`StreetBond adds colour ${EM} and it lasts.`), texts);
  expect("two-sentence reversal flagged as one unit", texts.includes("The texture isn't painted on. It's stamped in."), texts);
  expect("table cell flagged alone", texts.includes("Needs a seamless repaint every year"), texts);
  expect("list item flagged without its marker", texts.includes("A robust list item."), texts);
  expect("clean sentences left alone", !texts.some((t) => t.includes("Crews finish") || t.includes("fine")), texts);
  expect("every flagged text is verbatim", flagged.every((f) => body.slice(f.index, f.index + f.text.length) === f.text), flagged);
  const title = flagSentences("Stamped Asphalt Driveways That Last", { headings: "whole" });
  expect("a title is one unit", title.length === 1 && title[0].text === "Stamped Asphalt Driveways That Last", title);
  const fb = flagSentences(`Book your team a session ${String.fromCodePoint(0x1f6a7)}`, { ignore: ["emoji"] });
  expect("ignored rules are ignored", fb.length === 0, fb);

  // A rewrite must keep the facts.
  expect("keepsFacts: same facts", keepsFacts(`Lasts 10${EN}20 years ${EM} StreetPrint.`, `StreetPrint lasts 10 to 20 years.`), null);
  expect("keepsFacts: lost a number", !keepsFacts("Cures in 45 minutes.", "Cures fast."), null);
  expect("keepsFacts: lost a link", !keepsFacts("See [StreetBond](https://hubss.com/products/streetbond).", "See StreetBond."), null);
  expect("keepsFacts: lost a product", !keepsFacts("Use MMAX here.", "Use a coating here."), null);
  expect("keepsFacts: empty rewrite", !keepsFacts("Anything.", "  "), null);
  expect("product names are the house list", PRODUCT_NAMES.length === 14 && PRODUCT_NAMES.includes("Fast Patch DPR"), PRODUCT_NAMES);

  console.log(`\n  style lint: ${passed} passed, ${failures.length} failed\n`);
  for (const f of failures) console.log(`  FAIL  ${f}`);
  process.exit(failures.length ? 1 : 0);
}

// ── npm run check:copy ───────────────────────────────────────────────────────

function cli() {
  const res = scanBuiltPages();
  if (!res) {
    console.error("\n  No build output in .next/server/app: run npm run build first.\n");
    process.exit(2);
  }
  console.log(`\n  em dashes a reader can see: ${res.hits.length} on ${new Set(res.hits.map((h) => h.route)).size} of ${res.scanned} pages\n`);
  for (const h of res.hits) console.log(`  ${formatHit(h)}`);
  if (res.hits.length) console.log("");
  process.exit(res.hits.length ? 1 : 0);
}

// Run only when called as a script, not when verify-site.mjs imports it.
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (process.argv.includes("--test")) await selfTest();
  else cli();
}
