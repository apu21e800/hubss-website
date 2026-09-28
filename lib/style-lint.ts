/**
 * lib/style-lint.ts: the house style's machine tells (docs/STYLE.md), as code.
 *
 * One set of rules for every place copy is written, so they can't drift:
 *  - Studio shows a yellow warning under any field that breaks them
 *    (sanity/schemas/_shared.ts). A warning never stops anyone publishing.
 *  - The AI drafters (lib/field-note-drafter.ts, lib/social-drafter.ts) lint
 *    what Claude wrote, ask it once to rewrite the sentences that fail, and
 *    put whatever still fails in front of the editor.
 *  - `npm run test:copy` (scripts/check-copy.mjs) pins the rules down with
 *    good and bad samples. Change a rule, run it.
 *
 * Pure and dependency-free on purpose: Studio bundles this file into the
 * browser. For the same reason no regex here uses lookbehind, which older
 * Safari can't parse (a SyntaxError there would take the whole Studio down).
 *
 * The rules prefer no false alarm to catching everything: a warning Doug
 * learns to ignore is worse than none. Each one catches a named tell and
 * leaves its legitimate neighbour alone: the en dash in 10–20, "landscape
 * architects", "premium colours" (MMAX's colour range), "a catalogue of four
 * patterns". The dashes it hunts are written as \u escapes, so this file
 * never contains one.
 */

/** The product names, spelled exactly (docs/STYLE.md "Names, exactly"). */
export const PRODUCT_NAMES = [
  "TrafficPatternsXD",
  "TrafficPatterns",
  "PreMark",
  "DuraTherm",
  "DecoMark",
  "AirMark",
  "StreetBond",
  "StreetBondSR",
  "MMAX",
  "DuraShield",
  "StreetPrint",
  "ChipFill",
  "AggreFill",
  "Fast Patch DPR",
] as const;

/**
 * Names a sentence-case heading still capitalises: HUB's own names, the
 * product families, programs, and the places HUB works (every city on the
 * homepage map, the provinces, the big regions). Acronyms (UBC, AODA),
 * camelCase brands and street names ("King Street") are recognised without
 * being listed. Add a name here if Studio calls a heading Title Case only
 * because of it.
 */
export const PROPER_NAMES: readonly string[] = [
  ...PRODUCT_NAMES,
  // HUB, its sections and families
  "HUB Surface Systems", "HUB", "Idea Book", "Insights", "Lunch & Learn", "Resources",
  "Preformed Thermoplastics", "Stamped Asphalt", "Asphalt & Concrete Repair", "Coatings",
  "Bus & Bike Lanes", "Parks & Paths", "Ennis-Flint", "Integrated Paving Concepts",
  // programs, standards, days
  "Vision Zero", "Complete Streets", "Every Child Matters", "Truth and Reconciliation",
  "Pride", "Canada Day", "Remembrance Day", "Earth Day",
  // peoples
  "Indigenous", "First Nations", "First Nation", "Métis", "Inuit", "Coast Salish", "Musqueam",
  "Squamish Nation", "Anishinaabe", "Haudenosaunee",
  // Canada and its provinces
  "Canada", "Canadian", "Canadians", "Ontario", "Quebec", "Québec", "British Columbia", "Alberta",
  "Saskatchewan", "Manitoba", "Nova Scotia", "New Brunswick", "Prince Edward Island",
  "Newfoundland and Labrador", "Newfoundland", "Labrador", "Yukon", "Northwest Territories", "Nunavut",
  "Atlantic Canada", "Western Canada", "Eastern Canada", "Northern Ontario", "Southern Ontario",
  "Lower Mainland", "Vancouver Island", "Okanagan", "Prairies", "Maritimes", "Greater Toronto Area",
  "Metro Vancouver", "York Region", "Peel Region", "Durham Region", "Halton Region", "Halton Hills",
  "Niagara", "Muskoka", "Simcoe",
  // cities (the homepage map's, and the big ones)
  "Toronto", "Vancouver", "Montreal", "Montréal", "Ottawa", "Calgary", "Edmonton", "Winnipeg",
  "Halifax", "Victoria", "Quebec City", "Québec City", "Hamilton", "Kitchener", "Waterloo", "London",
  "Windsor", "Mississauga", "Brampton", "Markham", "Vaughan", "Richmond Hill", "Oakville", "Burlington",
  "Milton", "Oshawa", "Whitby", "Ajax", "Pickering", "Barrie", "Guelph", "Kingston", "Collingwood",
  "Georgina", "St. Catharines", "Sudbury", "Thunder Bay", "Surrey", "Burnaby", "Richmond", "Coquitlam",
  "Langley", "Langley City", "White Rock", "Delta", "Pitt Meadows", "Maple Ridge", "Abbotsford",
  "Chilliwack", "Kelowna", "Kamloops", "Nanaimo", "Ladysmith", "Squamish", "Whistler", "Sechelt",
  "Bowen Island", "North Vancouver", "West Vancouver", "New Westminster", "Port Moody", "Lethbridge",
  "Red Deer", "Regina", "Saskatoon", "Moncton", "Fredericton", "Saint John", "St. John's",
  "Charlottetown", "Laval", "Gatineau", "Sherbrooke",
  // transit and places people name in HUB's work
  "TransLink", "Metrolinx", "SkyTrain", "GO Transit", "Viva", "Toronto Premium Outlets",
  // offices, languages, months, days
  "East", "West", "North", "South", "English", "French",
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
  "November", "December", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export type StyleRule =
  | "em-dash"
  | "double-hyphen"
  | "spaced-dash"
  | "reversal"
  | "fragments"
  | "filler"
  | "stock-phrase"
  | "button"
  | "exclamation"
  | "emoji"
  | "idea-book"
  | "insights"
  | "title-case";

export interface StyleIssue {
  rule: StyleRule;
  /** What to do, in plain words. */
  message: string;
  /** The words around the problem, as written, for a person to find it. */
  excerpt: string;
  /** Where the problem starts in the text, and how long it is. */
  index: number;
  length: number;
}

// ── helpers ─────────────────────────────────────────────────────────────────

const EM = "\u2014";
const BAR = "\u2015"; // horizontal bar: looks like an em dash in most fonts
const EN = "\u2013";

/** Blank out what isn't prose (addresses, emails, markdown link targets, code) without moving anything. */
function mask(text: string): string {
  const blank = (s: string) => s.replace(/[^\n]/g, " ");
  return text
    .replace(/`[^`\n]*`/g, blank)
    .replace(/\]\([^)\s]*\)/g, (m) => "]" + blank(m.slice(1)))
    .replace(/\b(?:https?:\/\/|www\.|mailto:)[^\s<>"')\]]+/gi, blank)
    .replace(/\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g, blank);
}

/** About 60 characters of the text around [index, index + length), cut at word edges. */
function excerptAt(text: string, index: number, length: number): string {
  const pad = 28;
  let start = Math.max(0, index - pad);
  let end = Math.min(text.length, index + length + pad);
  if (start > 0) {
    const sp = text.indexOf(" ", start);
    if (sp !== -1 && sp < index) start = sp + 1;
  }
  if (end < text.length) {
    const sp = text.lastIndexOf(" ", end);
    if (sp > index + length) end = sp;
  }
  const body = text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${body}${end < text.length ? "…" : ""}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Hit {
  /** Offset of the problem inside the match (after any context the regex had to consume). */
  at?: number;
  length?: number;
  message: string;
}

interface Check {
  rule: StyleRule;
  re: RegExp;
  /** A message, or a function that can also veto the match (return null). */
  hit: string | ((m: RegExpExecArray, text: string) => Hit | string | null);
}

const DASH_ADVICE = "use a comma, a colon or a full stop instead";
const RANGE_ADVICE = "for a range, use an en dash with no spaces, like 10–20";

// A word character or closing punctuation that can sit right before a dash
// used as a dash. Deliberately not "<" or "!", so "<!--" is left alone.
const BEFORE = "[\\p{L}\\p{N}.,;:)\\]'\"’”%]";
const AFTER = "[\\p{L}\\p{N}(\\['\"‘“$]";

const QUANTITY =
  "decade|year|month|week|day|hour|minute|second|dozen|hundred|thousand|million|billion|few|couple|" +
  "third|quarter|half|metre|meter|kilometre|kilometer|mile|foot|inch|centimetre|millimetre|litre|" +
  "tonne|kilogram|pound|degree|percent|single|little|bit|lot|handful|fraction|tenth";

const FILLER: [RegExp, (word: string) => string][] = [
  [/\bseamless(?:ly)?\b/giu, (w) => `“${cap(w)}” is filler: say what joins up, or cut it.`],
  [/\brobust(?:ly|ness)?\b/giu, (w) => `“${cap(w)}” is filler: say how it holds up (the spec or the service life).`],
  [/\belevat(?:e|es|ing)\b/giu, (w) => `“${cap(w)}” is filler: say raise or improve, or say what changes.`],
  [/\belevated\s+(?:the|both|its|their|our|your|his|her|every|any)\b/giu, () => `“Elevated” is filler here: say raised or improved, or say what changed.`],
  [/\bleverag(?:e|es|ed|ing)\b/giu, (w) => `“${cap(w)}” is filler: say use.`],
  [/\bunlock(?:s|ed|ing)?\b/giu, (w) => `“${cap(w)}” is filler: say what it makes possible.`],
  [/\bempower(?:s|ed|ing|ment)?\b/giu, (w) => `“${cap(w)}” is filler: say what it lets people do.`],
  [/\bharness(?:es|ed|ing)\b|\bharness\s+(?:the|its|their|our|your|this|that)\b/giu, () => `“Harness” is filler: say use.`],
  [/\bstreamlin(?:e|es|ed|ing)\b/giu, (w) => `“${cap(w)}” is filler: say what gets simpler or faster.`],
  [/\bholistic(?:ally)?\b/giu, (w) => `“${cap(w)}” is filler: say what it covers, or cut it.`],
  [/\btailored\b|\btailor-made\b/giu, (w) => `“${cap(w)}” is filler: say made for, or say who it is for.`],
  [/\bbespoke\b/giu, () => `“Bespoke” is filler: say custom.`],
  [
    /\bcutting[\s-]edge\b|\bgame[\s-]chang(?:ing|ers?)\b|\bworld[\s-]class\b|\bbest[\s-]in[\s-]class\b|\brevolutionary\b|\brevolutioni[sz](?:e|es|ed|ing)\b|\bunparalleled\b/giu,
    (w) => `“${cap(w)}” is hype: say the fact that makes it good.`,
  ],
  // Praise only: "premium colours" and "standard and premium options" are MMAX's
  // and DecoMark's colour range, and "Toronto Premium Outlets" is a place.
  [
    /\bpremium\s+(?:products?|quality|looks?|finish|aesthetics?|appearance|feel|experience|hardscapes?|positioning|solutions?|choice|brand|results?|curb appeal|kerb appeal)\b|\b(?:reads|looks|feels)\s+(?:as\s+|like\s+)?premium\b/giu,
    () => `“Premium” as praise is filler: say what makes it better.`,
  ],
  [/\bsolutions\b/giu, () => `“Solutions” is filler: name the thing (the coating, the markings, the system).`],
  [/\bjourneys?\b/giu, (w) => `“${cap(w)}” is filler: say what actually happens.`],
  // As a figure of speech only: "landscape architects" are the readers.
  [
    /\b(?:changing|evolving|shifting|competitive|regulatory|digital|business|market|industry|funding|policy|political|economic|today['’]s|current)\s+(?:[a-z]+\s+)?landscapes?\b|\blandscape\s+of\b/giu,
    () => `“Landscape” as a figure of speech is filler: say the market, the field or the rules, whichever you mean.`,
  ],
  [/\bensur(?:e|es|ed|ing)\b/giu, (w) => `“${cap(w)}” is on the list of words we don't use: say make sure, or say what happens.`],
  [/\bdelv(?:e|es|ed|ing)\b/giu, (w) => `“${cap(w)}” is filler: say look at.`],
  [
    /\bsignature\s+(?!(?:on|of|in|at|by|from|to|and|or|is|was|are|were|line|block|field|page|required)\b)[a-z]/giu,
    () => `“Signature” as praise is filler: cut it, or say what makes it theirs.`,
  ],
];

const CHECKS: Check[] = [
  // ── dashes ────────────────────────────────────────────────────────────────
  {
    rule: "em-dash",
    re: new RegExp(`[${EM}${BAR}]|&mdash;|&#8212;|&#x2014;`, "gi"),
    hit: `Em dash: ${DASH_ADVICE}.`,
  },
  {
    rule: "double-hyphen",
    re: new RegExp(`(${BEFORE}[ \\t\\u00A0]?)(-{2,3})(?=[ \\t\\u00A0]?${AFTER})`, "gu"),
    hit: (m, text) => {
      const end = m.index + m[0].length;
      const range = /\d$/.test(m[1].trim()) && /^\s?\d/.test(text.slice(end, end + 2));
      return {
        at: m[1].length,
        length: m[2].length,
        message: range ? `Two hyphens in a range: ${RANGE_ADVICE}.` : `Two hyphens used as a dash: ${DASH_ADVICE}.`,
      };
    },
  },
  {
    // An en dash with a space on either side is being used as a dash. Closed
    // up between numbers (10–20, 2026–27) it's a range, and fine.
    rule: "spaced-dash",
    re: new RegExp(`[ \\t\\u00A0]${EN}|${EN}[ \\t\\u00A0]`, "g"),
    hit: (m, text) => {
      const at = m[0].indexOf(EN);
      const pos = m.index + at;
      const range = /\d\s*$/.test(text.slice(Math.max(0, pos - 3), pos)) && /^\s*\d/.test(text.slice(pos + 1, pos + 4));
      return {
        at,
        length: 1,
        message: range ? `En dash with spaces in a range: close it up, like 10–20.` : `En dash used as a dash: ${DASH_ADVICE}.`,
      };
    },
  },
  {
    // " - " between words: a hyphen standing in for a dash. Not a list bullet
    // (that starts a line) and not a minus sign (-10°C has no space after).
    rule: "spaced-dash",
    re: new RegExp(`(${BEFORE}[ \\t\\u00A0])-(?=[ \\t\\u00A0]${AFTER})`, "gu"),
    hit: (m, text) => {
      const pos = m.index + m[1].length;
      const range = /\d\s$/.test(m[1]) && /^\s\d/.test(text.slice(pos + 1, pos + 3));
      return {
        at: m[1].length,
        length: 1,
        message: range ? `Hyphen with spaces in a range: ${RANGE_ADVICE}.` : `Hyphen used as a dash: ${DASH_ADVICE}.`,
      };
    },
  },

  // ── the reversal: "it's not X, it's Y", "not just X", "more than a surface" ─
  {
    rule: "reversal",
    re: /(?:\bnot|n['’]t)\s+(?:just|merely|simply)\b/giu,
    hit: `“Not just …” sets up what it isn't: say what it is, plainly.`,
  },
  {
    rule: "reversal",
    re: /\bnot\s+only\b[^.!?\n]{1,150}?\b(?:but|also)\b/giu,
    hit: `“Not only … but …”: make it two plain statements, or keep the stronger one.`,
  },
  {
    // "It isn't X. It's Y.", "That is not a sales step; it is ...",
    // "These aren't renderings. They're installed surfaces."
    rule: "reversal",
    re: /(?:\b(?:is|are|was|were)\s+not\b|\b(?:isn|aren|wasn|weren)['’]t\b|['’](?:s|re)\s+not\b)[^.!?;:\n]{1,120}?[.;:,!?]\s+(?:it|this|that|they|these|those)(?:['’](?:s|re)|\s+(?:is|are|was|were))(?!\s+not\b)\s/giu,
    hit: `“It isn't X, it's Y”: say what it is, without first saying what it isn't.`,
  },
  {
    // "Not a sales pitch. An education."
    rule: "reversal",
    re: /\bnot\s+an?\s+[^.!?;\n]{1,60}?[.;]\s+an?\s+\p{L}/giu,
    hit: `“Not a … A …”: say what it is, without first saying what it isn't.`,
  },
  {
    rule: "reversal",
    re: new RegExp(
      `\\bmore\\s+than\\s+just\\b|(?:^|[.!?]\\s+|\\n)more\\s+than\\s+an?\\s+\\p{L}|` +
        `(?:\\b(?:is|are|was|were|be|been|becomes?|became|gets?|got)|['’](?:s|re))(?:\\s+\\p{L}+){0,2}?\\s+more\\s+than\\s+an?\\s+(?!(?:${QUANTITY})s?\\b)\\p{L}`,
      "giu"
    ),
    hit: `“More than a …” sets up what it isn't: say what it is, plainly.`,
  },

  // ── stacked fragments: "Fast. Durable. Proven." ────────────────────────────
  {
    rule: "fragments",
    re: /(^|[.!?]\s+|\n)((?:\p{Lu}[\p{L}'’-]*(?:[ \t]+[\p{L}'’-]+){0,2}[.!?][ \t]+){2,}\p{Lu}[\p{L}'’-]*(?:[ \t]+[\p{L}'’-]+){0,2}[.!?])(?=\s|$)/gu,
    hit: (m) => ({
      at: m[1].length,
      length: m[2].length,
      message: `Short fragments in a row (“Fast. Durable. Proven.”) read as machine-written: write one plain sentence.`,
    }),
  },

  // ── stock phrases, buttons, punctuation, emoji ────────────────────────────
  {
    rule: "stock-phrase",
    re: /\bwhether\s+you['’]re\b|\bin\s+today['’]s\b|\bin\s+a\s+world\s+where\b|\bhere['’]s\s+the\s+thing\b|\blet['’]s\s+dive\b|\bdive\s+in(?:to)?\b|\bthink\s+of\s+it\s+as\b|\b(?:it['’]s|it\s+is)\s+worth\s+noting\b|\bworth\s+noting\s+that\b/giu,
    hit: (m) => `Stock phrase (“${cap(m[0].toLowerCase())}”): cut it and say the point directly.`,
  },
  {
    // A button or link label that says "Discover", "Explore" or "Learn more".
    rule: "button",
    re: /^\s*(?:discover|explore|learn\s+more)\b(?:\s+\S+){0,3}\s*$/iu,
    hit: `Button words: say what happens, like “Book a Lunch & Learn” or “Open the Idea Book”.`,
  },
  {
    rule: "exclamation",
    re: /!(?!\[)/g,
    hit: `Exclamation mark: end the sentence with a full stop.`,
  },
  {
    rule: "emoji",
    re: /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/gu,
    hit: `Emoji: take it out.`,
  },

  // ── names ─────────────────────────────────────────────────────────────────
  {
    // The printed book, not the word: "a catalogue of four patterns" is fine.
    rule: "idea-book",
    re: /\b(?:the|our|this|its|their|your|HUB['’]s|HUB)\s+(?:(?:new|latest|current|full|print|printed|product|annual|20\d\d(?:[\u2013-]\d\d)?)\s+)?catalog(?:ue)?s?\b/giu,
    hit: `The printed book is the Idea Book: say “the Idea Book”, not “the catalogue”.`,
  },
  {
    rule: "insights",
    re: /\bfield[\s-]notes?\b/giu,
    hit: `The blog is called Insights now: say “Insights” (or “article”), not “Field Notes”.`,
  },
];

// Filler words, with their exceptions.
for (const [re, say] of FILLER) {
  CHECKS.push({
    rule: "filler",
    re,
    hit: (m, text) => {
      const word = m[0].split(/\s+/)[0];
      const after = text.slice(m.index + m[0].length, m.index + m[0].length + 40);
      // Stamped asphalt IS seamless (no joints for weeds or a plow blade): that's the literal sense.
      if (/^seamless$/i.test(m[0]) && (/^\s*:/.test(after) || /^(?:[\s,]+[\p{L}-]+){0,3}?[\s,]+(?:surface|asphalt|pavement|finish|joints?|slab|layer|coating|sheet)\b/iu.test(after))) return null;
      // "elevating ambient temperatures" is literal.
      if (/^elevat/i.test(m[0]) && /^\s+(?:ambient\s+)?temperatures?\b/i.test(after)) return null;
      return { length: /^signature/i.test(m[0]) ? "signature".length : m[0].length, message: say(word) };
    },
  });
}

/**
 * Everything in `text` that breaks the house style, in reading order.
 * Plain text or markdown; link addresses and emails are ignored.
 */
export function lintCopy(text: string): StyleIssue[] {
  if (!text || !text.trim()) return [];
  const prose = mask(text);
  const issues: StyleIssue[] = [];
  const seen = new Set<string>();
  for (const check of CHECKS) {
    check.re.lastIndex = 0;
    const re = check.re.global ? check.re : new RegExp(check.re.source, check.re.flags + "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(prose))) {
      if (m[0] === "") { re.lastIndex++; continue; }
      const res = typeof check.hit === "string" ? check.hit : check.hit(m, prose);
      if (res === null) continue;
      const hit: Hit = typeof res === "string" ? { message: res } : res;
      const index = m.index + (hit.at ?? 0);
      const length = hit.length ?? m[0].length - (hit.at ?? 0);
      const key = `${check.rule}:${index}`;
      if (seen.has(key)) continue;
      seen.add(key);
      issues.push({ rule: check.rule, message: hit.message, excerpt: excerptAt(text, index, length), index, length });
    }
  }
  // One warning per problem: "isn't just a task. It's ..." is one reversal, not two.
  const out: StyleIssue[] = [];
  for (const i of issues.sort((a, b) => a.index - b.index || b.length - a.length)) {
    if (out.some((o) => o.rule === i.rule && i.index < o.index + o.length && o.index < i.index + i.length)) continue;
    out.push(i);
  }
  return out;
}

// ── headings ────────────────────────────────────────────────────────────────

// Words that are never part of a name: if one of them is capitalised, the
// heading is in Title Case whatever else it contains.
const COMMON = new Set(
  (
    "a an the and or but nor of for to in on at by with from into onto over under about after before between through " +
    "without within vs versus your our their its it is are was were be been being am do does did done has have had " +
    "how why what when where who whom which that this these those not no yes you we us they them he she my me more " +
    "most less least best better good great new right all every each any some one two three first last next get gets " +
    "make makes go goes work works matter matters need needs know choose pick use uses can will should must may might " +
    "could would here there now then just only also so than too very really up down out off if as like"
  ).split(" ")
);

const PLACE_WORDS = new Set(
  (
    "Street St Avenue Ave Road Rd Drive Dr Boulevard Blvd Way Lane Crescent Court Place Square Park Parkway Highway Hwy " +
    "Trail Bridge Station Village Island Hospital University College School Centre Center Mall Plaza Market Region " +
    "County Nation Terminal Airport Stadium Arena Hall Library District Commons Pier Harbour Beach Bay Lake River Creek " +
    "Mountain Valley Hill Hills Heights Point Ridge Quay Wharf Promenade Esplanade Circle Row"
  ).split(" ")
);

const PROPER_SINGLE = new Set(PROPER_NAMES.filter((n) => !/\s/.test(n)));
const PROPER_MULTI = PROPER_NAMES.filter((n) => /\s/.test(n))
  .map((n) => n.split(/\s+/))
  .sort((a, b) => b.length - a.length);

type Kind = "cap" | "proper" | "lower" | "join" | "start";

/** Markdown heading marks, emphasis and link syntax off a heading. */
function plainHeading(text: string): string {
  return text
    .replace(/^\s*#{1,6}\s+/, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]+/g, "");
}

/**
 * Title Case in a heading, a title, a button or an eyebrow: three or more
 * capitalised words that aren't names ("Where The Colour Goes", "Book Your
 * Free Session"). Sentence case is the house style: capitals on the first
 * word and on names only. A heading that ends in a name it can't know
 * ("Fourteen years at Toronto Premium Outlets") is let through: the only
 * capitals after its first word sit in one run after a lowercase word.
 * Title Case in post titles and subheads is waiting on Doug, so this warns
 * and never rewrites.
 */
export function lintHeading(text: string): StyleIssue[] {
  if (!text || !text.trim()) return [];
  const plain = plainHeading(text);
  const raw = plain.split(/\s+/).filter(Boolean);
  const kinds: Kind[] = [];
  const cores: string[] = [];
  const proper = new Array<boolean>(raw.length).fill(false);

  const coreOf = (w: string) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").replace(/['’]s$/u, "");
  raw.forEach((w) => cores.push(coreOf(w)));

  // Listed names of more than one word ("Idea Book", "Lunch & Learn", "King Street" is below).
  for (const words of PROPER_MULTI) {
    for (let i = 0; i + words.length <= raw.length; i++) {
      let ok = true;
      for (let j = 0; j < words.length && ok; j++) ok = cores[i + j] === coreOf(words[j]) || raw[i + j] === words[j];
      if (ok) for (let j = 0; j < words.length; j++) proper[i + j] = true;
    }
  }
  // Street and place names: "King Street", "Spencer Smith Park", "Bowen Island".
  for (let i = 1; i < raw.length; i++) {
    if (PLACE_WORDS.has(cores[i]) && /^\p{Lu}/u.test(cores[i - 1]) && !COMMON.has(cores[i - 1].toLowerCase())) {
      proper[i] = true;
      proper[i - 1] = true;
    }
  }

  let sentenceStart = false;
  raw.forEach((w, i) => {
    const core = cores[i];
    let kind: Kind;
    if (!/[\p{L}\p{N}]/u.test(w)) kind = "join"; // "&", "·", "|"
    else if (
      proper[i] ||
      PROPER_SINGLE.has(core) ||
      /^\p{Lu}{2,}[\p{Lu}\p{N}]*s?$/u.test(core) || // acronyms: UBC, AODA, BRTs
      /\p{Ll}\p{Lu}/u.test(core) || // camelCase: StreetBond, iPhone
      /\p{N}/u.test(core) ||
      core === "I" ||
      PROPER_SINGLE.has(core.split("-")[0]) // "Canadian-operated"
    ) kind = "proper";
    else if (i > 0 && sentenceStart) kind = "start"; // first word of a second sentence
    else if (/^\p{Lu}/u.test(core)) kind = "cap";
    else kind = "lower";
    kinds.push(kind);
    sentenceStart = /[.!?]["'’”)]*$/.test(w) && !/^(?:St|No|vs|e\.g|i\.e)\.$/i.test(w);
  });

  const counted = kinds.map((k, i) => (k === "cap" ? i : -1)).filter((i) => i >= 0);
  if (counted.length < 3) return [];

  // The exemption: after the first word, every capital sits in one run of
  // capitalised words that follows a lowercase word, and none of them is a
  // common word. That run is a name.
  const rest = counted.filter((i) => i > 0);
  if (rest.length) {
    let start = rest[0];
    while (start > 0 && (kinds[start - 1] === "cap" || kinds[start - 1] === "proper" || kinds[start - 1] === "join")) start--;
    const end = rest[rest.length - 1];
    let contiguous = true;
    for (let i = rest[0]; i <= end; i++) if (kinds[i] === "lower" || kinds[i] === "start") contiguous = false;
    const afterLower = start > 0 && kinds[start - 1] === "lower";
    const noCommon = rest.every((i) => !COMMON.has(cores[i].toLowerCase()));
    if (contiguous && afterLower && noCommon) return [];
  }

  const words = counted.map((i) => `“${cores[i]}”`).slice(0, 4).join(", ");
  return [
    {
      rule: "title-case",
      message: `Title Case (${words}): headings are sentence case, with capitals only on the first word and on names, like “Where the colour goes”.`,
      excerpt: excerptAt(text, 0, text.length),
      index: 0,
      length: text.length,
    },
  ];
}

// ── for the drafters: which sentences to rewrite ────────────────────────────

export interface FlaggedSentence {
  /** The sentence (or two, for a reversal that spans them) exactly as written, markdown included. */
  text: string;
  /** Where it sits in the text it came from. */
  index: number;
  issues: StyleIssue[];
}

export interface FlagOptions {
  /**
   * "whole": the text is a heading (a title). "markdown": lines starting
   * with # are headings (a markdown body). "none": no heading checks.
   */
  headings?: "whole" | "markdown" | "none";
  /** Rules this copy is allowed to break (a Facebook post may carry one emoji). */
  ignore?: StyleRule[];
}

const ABBREVIATION = /(?:\b(?:e\.g|i\.e|etc|vs|approx|St|Mr|Mrs|Ms|Dr|No|Inc|Ltd|Co|a\.m|p\.m)\.)["'’”)\]]*$/i;

/** [start, end) of each sentence in text[from, to). */
function sentenceSpans(text: string, from: number, to: number): [number, number][] {
  const out: [number, number][] = [];
  const end = /[.!?]+["'’”)\]]*(?=\s|$)/g;
  const part = text.slice(from, to);
  let start = 0;
  let m: RegExpExecArray | null;
  while ((m = end.exec(part))) {
    const stop = m.index + m[0].length;
    if (ABBREVIATION.test(part.slice(start, stop))) continue;
    out.push([from + start, from + stop]);
    start = stop;
  }
  if (part.slice(start).trim()) out.push([from + start, to]);
  return out
    .map(([s, e]): [number, number] => {
      while (s < e && /\s/.test(text[s])) s++;
      while (e > s && /\s/.test(text[e - 1])) e--;
      return [s, e];
    })
    .filter(([s, e]) => e > s);
}

/**
 * The sentences in `text` that break the house style, each with what's wrong,
 * ready to hand to a rewrite. A table row's cells, list items and headings
 * are sentences of their own; markdown marks at the start of a line stay out.
 */
export function flagSentences(text: string, options: FlagOptions = {}): FlaggedSentence[] {
  const headings = options.headings ?? "none";
  const ignore = new Set(options.ignore ?? []);
  const keep = (i: StyleIssue) => !ignore.has(i.rule);
  const issues = lintCopy(text).filter(keep);

  // Segments: lines, or table cells, without their leading markdown marks.
  const segments: [number, number, boolean][] = [];
  let lineStart = 0;
  for (const line of text.split("\n")) {
    const lineEnd = lineStart + line.length;
    const heading = headings === "whole" || (headings === "markdown" && /^\s*#{1,6}\s/.test(line));
    if (/^\s*\|/.test(line)) {
      let cell = lineStart;
      for (let i = lineStart; i <= lineEnd; i++) {
        if (i === lineEnd || text[i] === "|") {
          if (i > cell) segments.push([cell, i, false]);
          cell = i + 1;
        }
      }
    } else {
      const marks = /^\s*(?:#{1,6}\s+|[-*+]\s+|\d+[.)]\s+|>\s+)?/.exec(line)?.[0].length ?? 0;
      segments.push([lineStart + marks, lineEnd, heading]);
    }
    lineStart = lineEnd + 1;
  }
  if (headings === "whole") {
    for (const i of lintHeading(text).filter(keep)) issues.push(i);
  } else if (headings === "markdown") {
    for (const [s, e, isHeading] of segments) {
      if (!isHeading) continue;
      for (const i of lintHeading(text.slice(s, e)).filter(keep)) issues.push({ ...i, index: s, length: e - s });
    }
  }

  // Each issue's sentence(s), merged where they overlap.
  const units: { start: number; end: number; issues: StyleIssue[] }[] = [];
  for (const issue of issues.sort((a, b) => a.index - b.index)) {
    const seg = segments.find(([s, e]) => issue.index >= s && issue.index < Math.max(e, s + 1)) ?? [0, text.length, false];
    const spans = sentenceSpans(text, seg[0], seg[1]);
    const last = issue.index + Math.max(1, issue.length) - 1;
    const touching = spans.filter(([s, e]) => e > issue.index && s <= last);
    const start = touching.length ? touching[0][0] : seg[0];
    const end = touching.length ? touching[touching.length - 1][1] : seg[1];
    const open = units.find((u) => start < u.end && end > u.start);
    if (open) {
      open.start = Math.min(open.start, start);
      open.end = Math.max(open.end, end);
      open.issues.push(issue);
    } else units.push({ start, end, issues: [issue] });
  }
  return units
    .sort((a, b) => a.start - b.start)
    .map((u) => ({ text: text.slice(u.start, u.end), index: u.start, issues: u.issues }));
}

/**
 * Whether a rewritten sentence kept its facts: the same numbers, the same
 * links and the same product names. A rewrite that loses one is thrown away
 * and the original stays, flagged, for a person to fix.
 */
export function keepsFacts(before: string, after: string): boolean {
  if (!after.trim()) return false;
  const numbers = (s: string) => (s.match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => n.replace(/,/g, "")).sort().join("|");
  const links = (s: string) => (s.match(/\]\([^)\s]+\)|https?:\/\/[^\s)\]>"]+/g) ?? []).map((l) => l.replace(/^\]\(|\)$/g, "")).sort().join("|");
  const names = (s: string) => PRODUCT_NAMES.filter((n) => s.includes(n)).join("|");
  return numbers(before) === numbers(after) && links(before) === links(after) && names(before) === names(after);
}

/** "Em dash: use a comma, a colon or a full stop instead. (“…words around it…”)" */
export function describeIssue(issue: StyleIssue): string {
  return issue.rule === "title-case" ? issue.message : `${issue.message} (“${issue.excerpt}”)`;
}
