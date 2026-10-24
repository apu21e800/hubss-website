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
    `StreetPrint lasts 10${EN}20 years; the 2026${EN}27 Product Portfolio Book lists it.`,
    "Landscape architects specify StreetBond for park paths.",
    "MMAX comes in 8 standard and 15 premium colours.",
    "DecoMark is available in standard and premium options.",
    "The crossings at Toronto Premium Outlets have been in service for fourteen years.",
    "Choose from a catalogue of four patterns, or design your own.",
    "The Product Portfolio Book · Volume 5 has every system.",
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
    "Open the Product Portfolio Book",
    "Preformed thermoplastic is heat-applied and bonds to the surface; TrafficPatternsXD is stamped into the asphalt.",
    "DuraTherm is inlaid into the stamped asphalt, so a plow blade passes over it.",
    "A service life of 8+ years, and easily refreshed.",
    "Toronto's Pedestrian Crossing Protection Device Justification Policy sets out when a crossing is marked.",
    "The crosswalk supports the city's Vision Zero plan.",
    "Skid resistance: 60 BPN, ASTM E303.",
    "Speed tables and raised crosswalks slow drivers at the school.",
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
    ["product-book", "Every system is in the catalogue."],
    ["product-book", "See HUB's 2027 catalogue for the colours."],
    ["product-book", "Every system is in the HUB Idea Book."],
    ["product-book", "Every system is in the HUB Product Book."],
    ["insights", "Read more Field Notes on hubss.com."],
    ["glossary", "Pre-formed thermo-plastic sheets are laid on the road."],
    ["glossary", "TrafficPatterns is heat-fused into asphalt or concrete so it becomes part of the road."],
    ["glossary", "The thermoplastic fuses permanently to the road surface."],
    ["glossary", "A life cycle of 8+ years, easily refreshed."],
    ["glossary", "Installed by certified applicators that HUB trains."],
    ["glossary", "Crosswalks, transit corridors and plazas: Vision Zero aligned and accessible."],
    ["glossary", "It maintains ASTM-rated retroreflectivity through plow cycles."],
    ["glossary", "Specified for crosswalks, speed bumps and traffic calming."],
    ["glossary", "A decorative pedestrian crossing in Vaughan."],
    ["glossary", "An ADA-compliant pedestrian and wheelchair friendly surface."],
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
    "Open the Product Portfolio Book",
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

  // Contact details (24 Oct 2026): HUB's own lines pass, anyone else's is held.
  const { contactIssues, stripContact, hasContactAnyCase, HUB_PHONES } = lint;
  const contact = (t, opts) => lintCopy(t, opts).filter((i) => i.rule === "contact").map((i) => t.slice(i.index, i.index + i.length));
  const HUB_OWN = [
    "Call 604-309-8212 or 416-540-9287, or email info@hubss.com or doug.bain@hubss.com.",
    "(604) 309-8212, or [email us](mailto:cleve.stordy@hubss.com).",
    "Call 1-416-540-9287 to book.",
    "We stamped the crosswalk at 152 Street and 72 Avenue in Surrey.",
    "In 2023 Fraser Highway crews added a crosswalk.",
    "Between 300-1200 vehicles a day use it.",
    "Public art \u00b7 2024 Commercial Drive, Vancouver.",
    "We stamped the 3 Main Street crossings in a week.",
    "Highway 401 and King Street West, Toronto.",
    "XDG-10-100 is 8\u2019W x 14\u2019L; 1,000+ projects coast to coast since 1999.",
    "The photo: https://cdn.sanity.io/images/9dbro2m1/production/02ae81c199eb25441a4f4786353255f2c47cb1d5-1184x864.jpg",
  ];
  for (const t of HUB_OWN) expect(`contact rule flagged: ${t}`, contact(t).length === 0, contact(t));
  const NOT_HUBS = [
    ["The owner, at 604-555-0199, asked for brick.", "604-555-0199"],
    ["Call (416) 555 0199 for photos.", "(416) 555 0199"],
    ["Write to jane.doe@example.com for photos.", "jane.doe@example.com"],
    ["[Email her](mailto:jane@shaw.ca) for the photos.", "jane@shaw.ca"],
    ["The driveway at 1234 Main Street in Milton.", "1234 Main Street"],
    ["A home at 12345 72 Avenue in Surrey.", "12345 72 Avenue"],
    ["A lane off 4421 W 10th Ave.", "4421 W 10th Ave."],
    ["A farm at 8125 Fifth Line, Milton.", "8125 Fifth Line"],
    ["The driveway at 2041 Main Street.", "2041 Main Street."],
    ["The owner lives at 5 Oak Street.", "5 Oak Street."],
    ["The postal code is L9T 2X5.", "L9T 2X5"],
  ];
  for (const [t, found] of NOT_HUBS) expect(`contact rule missed: ${t}`, contact(t).length === 1 && contact(t)[0] === found, contact(t));
  expect("contact: false leaves the rule out", contact("The owner, at 604-555-0199.", { contact: false }).length === 0, null);
  expect("flagSentences reads the contact rule", flagSentences("A good job. The owner, at 604-555-0199, asked for brick.").length === 1, null);
  expect("stripContact takes the address out", stripContact("Stamped driveway at 1234 Main Street in Milton") === "Stamped driveway at in Milton", stripContact("Stamped driveway at 1234 Main Street in Milton"));
  expect("a slug with an address", hasContactAnyCase("stamped-driveway-1234-main-street-milton"), null);
  expect("a slug with a phone number", hasContactAnyCase("call-604-555-0199"), null);
  for (const slug of ["kitchener-veterans-crosswalk-2024", "streetbond-osoyoos-british-columbia", "osoyoos-lakeside-park-path"])
    expect(`a clean slug read as an address: ${slug}`, !hasContactAnyCase(slug), null);
  // A slug is read as typed: a year or a one-digit number before a street name counts there,
  // but not a count after "the".
  for (const slug of ["2024-commercial-drive-vancouver", "3-main-street-milton"])
    expect(`a slug's house number missed: ${slug}`, hasContactAnyCase(slug), null);
  expect("a slug's count read as an address: the-3-main-street-crossings", !hasContactAnyCase("the-3-main-street-crossings"), null);
  expect("contact messages have no dash", contactIssues("604-555-0199, jane@shaw.ca, 1234 Main Street").every((i) => !i.message.includes(EM)), null);
  // HUB's lines are Site Settings' own (lib/site-settings.ts); a change there must reach the rule.
  const { DEFAULT_SITE_SETTINGS } = await import("../lib/site-settings.ts");
  const officePhones = [DEFAULT_SITE_SETTINGS.offices.west.phone, DEFAULT_SITE_SETTINGS.offices.east.phone].sort();
  expect("HUB_PHONES are Site Settings' office lines", JSON.stringify([...HUB_PHONES].sort()) === JSON.stringify(officePhones), { HUB_PHONES, officePhones });
  for (const o of Object.values(DEFAULT_SITE_SETTINGS.offices))
    expect(`office email flagged: ${o.email}`, contact(`Email ${o.email} or call ${o.phone}.`).length === 0, contact(`Email ${o.email} or call ${o.phone}.`));

  // Words a person typed (24 Oct 2026 review): any case, any house number,
  // the forms people type. Claude's prose keeps the stricter rule above.
  const { maskContact } = lint;
  const typedHits = (t, opts = { typed: true }) => contactIssues(t, opts).map((i) => t.slice(i.index, i.index + i.length));
  const TYPED_MISSES = [
    ["the smiths at 1234 main st", "1234 main st"],
    ["2041 Main Street, Milton, Ontario", "2041 Main Street"],
    ["Back to the Patels, 1987 Oak Street", "1987 Oak Street"],
    ["5678 Highway 7, Markham", "5678 Highway 7"],
    ["RR 2, Caledon", "RR 2"],
    ["PO Box 123, Milton", "PO Box 123"],
    ["1234 rue Sainte-Catherine, Montr\u00e9al", "1234 rue Sainte-Catherine"],
    ["call 555-0123 for the gate code", "555-0123"],
    ["100 Bay Street, Toronto", "100 Bay Street"],
  ];
  for (const [t, found] of TYPED_MISSES) expect(`typed rule missed: ${t}`, typedHits(t).length === 1 && typedHits(t)[0] === found, typedHits(t));
  expect("a Where starting with a house number", typedHits("1234 Lakeshore, Toronto", { place: true })[0] === "1234 Lakeshore", typedHits("1234 Lakeshore, Toronto", { place: true }));
  expect("a street named without its type, in a story", typedHits("Done on 1234 Lakeshore, Toronto")[0] === "1234 Lakeshore", typedHits("Done on 1234 Lakeshore, Toronto"));
  expect("a two-digit Where is an address only in the Where field", typedHits("Done on 22 Elm, Milton").length === 0 && typedHits("22 Elm, Milton", { place: true })[0] === "22 Elm", typedHits("Done on 22 Elm, Milton"));
  const TYPED_CLEAN = [
    "We stamped the crosswalk at 152 Street and 72 Avenue in Surrey.",
    "The crossing on 200 Street near 64 Avenue.",
    "Highway 401 and King Street West, Toronto.",
    "Call 604-309-8212 or 416-540-9287.",
    "(604) 309-8212, 604 309 8212, 604.309.8212, 1-416-540-9287, +1 416 540 9287",
    "Read it on https://medium.com/@hubss/the-post",
    "XDG-10-100 is 8 ft wide; 1,000+ projects coast to coast since 1999.",
    "Two coats over 480 square metres, done in two days.",
    "Brantford, Ontario",
    "Crews marked 30 intersections along the Highway in a week.",
    "The 35 km Spirit Trail runs along the shore.",
  ];
  for (const t of TYPED_CLEAN) expect(`typed rule flagged: ${t}`, typedHits(t).length === 0, typedHits(t));
  expect("a Where with no number is clean", typedHits("Children's Safety Village of Brant, Brantford, Ontario", { place: true }).length === 0, null);
  const { products } = await import("../lib/products.ts");
  for (const pr of products)
    for (const t of [pr.shortDesc, pr.description])
      if (t) expect(`typed rule flagged ${pr.name}'s copy`, typedHits(t).length === 0, typedHits(t));
  for (const [t] of NOT_HUBS) expect(`default rule changed: ${t}`, contact(t).length === 1, contact(t));
  expect("the default rule still skips a year", contact("In 2023 Fraser Highway crews added a crosswalk.").length === 0, null);
  expect(
    "the mask names the kind, never the detail",
    maskContact("Call the owner on 905-555-0123 or jane@shaw.ca at 1234 main st", { typed: true }) === "Call the owner on [phone number] or [email] at [address]",
    maskContact("Call the owner on 905-555-0123 or jane@shaw.ca at 1234 main st", { typed: true })
  );
  expect("a lowercase slug with an address", hasContactAnyCase("the-smiths-1234-main-st"), null);
  // Job notes as they are typed (scripts/lib/contact-notes.ts): none of the
  // plain ones held, every detail found (the re-review of 24 Oct 2026).
  const { CLEAN_NOTES, CLEAN_WHERES, TYPED_DETAILS } = await import("./lib/contact-notes.ts");
  for (const t of CLEAN_NOTES) expect(`a plain job note held: ${t}`, typedHits(t).length === 0, typedHits(t));
  for (const t of CLEAN_WHERES) expect(`a public place's Where held: ${t}`, typedHits(t, { place: true }).length === 0, typedHits(t, { place: true }));
  for (const [t, found, o] of TYPED_DETAILS) {
    const got = typedHits(t, { typed: true, ...(o ?? {}) });
    expect(`a typed detail missed: ${t}`, got.length === 1 && got[0] === found, got);
  }
  expect("no phone number no phone can have, and no toll-free line", contact("PO 4500123456, or call 1-800-555-0199.").length === 0, contact("PO 4500123456, or call 1-800-555-0199."));
  expect("a typed slug strips its address", stripContact("Driveway at 1234 main st in Milton") === "Driveway at in Milton", stripContact("Driveway at 1234 main st in Milton"));

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
