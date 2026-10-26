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
  "HUB Surface Systems", "HUB", "Product Portfolio Book", "Projects", "Insights", "Lunch & Learn", "Resources",
  "Preformed Thermoplastics", "Stamped Asphalt", "Asphalt & Concrete Repair", "Coatings",
  "Bus & Bike Lanes", "Parks & Paths", "Ennis-Flint", "Integrated Paving Concepts",
  // programs, standards, days
  "Vision Zero", "Complete Streets", "Every Child Matters", "Truth and Reconciliation",
  "Pride", "Canada Day", "Remembrance Day", "Earth Day",
  // rail safety (the Look Listen Live post, 14 Oct 2026)
  "Look Listen Live", "Operation Lifesaver", "CN", "Children's Safety Village of Brant",
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
  "Brantford", "Brant",
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
  | "product-book"
  | "insights"
  | "glossary"
  | "contact"
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
  // The 26 Oct 2026 blog review: the words ten reviewers cut most across 76
  // posts (scripts/copy-review-2026-10-26.json). The singular "solution" as a
  // product ("a wayfinding solution"); "a solution of" (chemistry) is not it.
  [/\b(?:a|an|the|this|our|your|one|ideal|perfect|complete|proven|durable|total)\s+(?:[\p{L}-]+\s+){0,2}?solution\b(?!\s+of\b)/giu, () => `“Solution” is filler: name the thing (the coating, the markings, the system).`],
  [/\bhigh[\s-]performance\b/giu, () => `“High-performance” is filler: say the figure (the BPN, the service life) or cut it.`],
  [/\bground[\s-]plane\b/giu, () => `“Ground plane” is jargon: say the pavement, the road or the surface.`],
  [/\baesthetics?\b(?!\s+(?:guideline|standard|review|committee|polic))/giu, (w) => `“${cap(w)}” is filler: say the look, the colour or the pattern, whichever you mean.`],
  [/\btransform(?:s|ed|ing|ation|ations)?\b/giu, (w) => `“${cap(w)}” is filler: say what changed.`],
  [/\benduring\b|\blong[\s-]lasting\b/giu, (w) => `“${cap(w)}” is a claim with no figure: give the service life, or cut it.`],
  [/\bvibrant(?:ly)?\b/giu, (w) => `“${cap(w)}” is filler: name the colours.`],
  [/\benhanc(?:e|es|ed|ing|ement|ements)\b/giu, (w) => `“${cap(w)}” is filler: say improve, or say what is better.`],
  [/\bengineered\s+(?:for|to)\b/giu, () => `“Engineered for” is filler: say what it does.`],
  [/\bideal\s+for\b/giu, () => `“Ideal for” is filler: say for, or say why it suits.`],
  [/\bdeliver(?:s|ed|ing)?\s+(?:a\s+|an\s+|the\s+)?(?:premium|superior|outstanding|exceptional|lasting|enduring|durable|high|strong|real|measurable|proven)?\s*(?:performance|results?|value|impact|quality|durability)\b/giu, () => `“Delivers performance” is filler: say what it does, with the figure.`],
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
    hit: `Button words: say what happens, like “Book a Lunch & Learn” or “Open the Product Portfolio Book”.`,
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
    // Its old names too: the Idea Book became the Product Book on 14 Oct 2026
    // and the Product Portfolio Book on 17 Oct 2026 (Doug's words). "Product
    // Book" on its own is the old name; "Product Portfolio Book" never matches it.
    rule: "product-book",
    re: /\b(?:the|our|this|its|their|your|HUB['’]s|HUB)\s+(?:(?:new|latest|current|full|print|printed|product|annual|20\d\d(?:[\u2013-]\d\d)?)\s+)?catalog(?:ue)?s?\b|\bIdea\s+Book\b|\bProduct\s+Book\b/giu,
    hit: `The printed book is the Product Portfolio Book: say “the Product Portfolio Book”, not “the Product Book”, “the catalogue” or “the Idea Book”.`,
  },
  {
    rule: "insights",
    re: /\bfield[\s-]notes?\b/giu,
    hit: `The blog is called Projects now: say “Projects” (or “article”), not “Field Notes”.`,
  },

  // ── glossary (docs/GLOSSARY.md, 17 Oct 2026) ──────────────────────────────
  // The words the makers and the printed book use, and the ones that are
  // wrong about how a system goes in or what it is. Warnings, like the rest.
  {
    rule: "glossary",
    re: /\bpre-formed\b|\bthermo-plastics?\b|\bpreformed\s+thermo\s+plastics?\b/giu,
    hit: `Spell it “preformed thermoplastic”: one word each, no hyphen.`,
  },
  {
    // Surface-applied material bonds to the pavement; nothing fuses into the road.
    rule: "glossary",
    re: /\b(?:heat-)?fus(?:e|es|ed|ing)\s+(?:permanently\s+)?into\b|\bfus(?:e|es|ed|ing)\s+permanently\b|\bbecomes?\s+part\s+of\s+the\s+road(?:way)?\b|\bfus(?:e|es|ed|ing)\s+(?:permanently\s+)?to\s+the\s+(?:road|roadway|pavement)\s+surface\b/giu,
    hit: `Say how it goes in: “heat-applied, it bonds to the surface” (TrafficPatterns, DecoMark, PreMark), “stamped into the asphalt” (TrafficPatternsXD) or “inlaid” (DuraTherm). Nothing fuses into the road.`,
  },
  {
    rule: "glossary",
    re: /\blife[\s-]?cycle\b|\blifespans?\b/giu,
    hit: `One term for how long it lasts: “service life”.`,
  },
  {
    rule: "glossary",
    re: /\bapplicators?\b/giu,
    hit: `HUB’s word is “installer” (certified installer); “applicator” is the makers’ word.`,
  },
  {
    rule: "glossary",
    re: /\bVision\s+Zero[\s-]+(?:aligned|compliant|certified|standards?)\b/giu,
    hit: `Vision Zero is a program, not a standard: say “supports Vision Zero”, or say what the project did.`,
  },
  {
    rule: "glossary",
    re: /\bASTM[\s-](?:rated|certified|approved)\b/giu,
    hit: `“ASTM-rated” names no standard: give the test and the number (60 BPN, ASTM E303), or say what the surface does.`,
  },
  {
    rule: "glossary",
    re: /\bspeed\s+bumps?\b/giu,
    hit: `On a road it is a speed table or a speed hump; a speed bump is a parking-lot device.`,
  },
  {
    rule: "glossary",
    re: /\bpedestrian\s+crossings?\b(?!\s+(?:protection|control|device|guard|manual|policy|signal|treatment))/giu,
    hit: `The Canadian word for the marking is “crosswalk”; keep “pedestrian crossing” for a manual’s or a policy’s own name.`,
  },
  {
    rule: "glossary",
    re: /\b(?:ADA|wheelchair)[\s-]+(?:compliant|friendly)\b/giu,
    hit: `ADA is the American law: say “accessible” and name the Canadian standard the project met (CSA B651, AODA in Ontario).`,
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

// ── contact details ─────────────────────────────────────────────────────────
// HUB's own lines only. A Job photos post's story, note or captions can carry
// a customer's phone number or house address, and a Projects article and its
// social posts go out by themselves: one of these holds them for a person to
// read (24 Oct 2026, Square One's rule of 20 Oct). Two readings:
//  - Claude's prose (the default): a house number with a capitalised street
//    name ("1234 Main Street", "12345 72 Avenue"); a year or a one-digit
//    count before a street name counts only after "at", "on", "lives".
//  - Words a person typed (`typed`: a job post, a photo's alt text or
//    caption, a slug, a draft on its day): any case, any house number, rural
//    routes, PO boxes, French addresses, "5678 Highway 7", a street named
//    without its type ("at 1234 Yonge,") and seven-digit local numbers,
//    because those go on the page as typed and a miss costs more than a
//    false hold (the review of 24 Oct 2026).
// In both, a job's counts and sizes are not addresses ("3 bus lane
// segments", "a 4 lane road", "the 3 Main Street crossings", "In 2023 Fraser
// Highway", "800-1200 square feet": the re-review of the same day held 15 of
// 18 plain job notes; scripts/lib/contact-notes.ts keeps the notes it is
// measured on), nor a numbered crossing ("152 Street and 72 Avenue", a Surrey
// intersection), a highway's number ("Highway 401 and King Street"), a
// toll-free line or a number no phone can have. Names are not caught.

/**
 * HUB's published office lines, as lib/site-settings.ts has them
 * (DEFAULT_SITE_SETTINGS; `npm run test:copy` fails if the two disagree).
 * Copied, not imported: this file stays dependency-free for Studio.
 */
export const HUB_PHONES: readonly string[] = ["604-309-8212", "416-540-9287"];
/** HUB's own email domain: the offices' addresses and info@. */
export const HUB_EMAIL_DOMAIN = "hubss.com";

const digitsOf = (s: string) => s.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
const HUB_DIGITS = new Set(HUB_PHONES.map(digitsOf));
/** Toll-free area codes: a business's public line, never a person's own. */
const TOLL_FREE = new Set(["800", "833", "844", "855", "866", "877", "888"]);
/** Ten digits a phone can have: the area code and the exchange start with 2 to 9 (a purchase order "4500123456" can't). */
const dialable = (d: string) => /^[2-9]\d\d[2-9]\d{6}$/.test(d);
const PHONE_SEP = "\\s*[\\s.\\-\\u2010-\\u2015/]?\\s*";
// No lookbehind (older Safari, see the header): the character before the
// number is group 1 and is stepped over.
const PHONE_IN_COPY = new RegExp(
  `(^|[^\\d\\-\\u2010-\\u2015])((?:\\+?1${PHONE_SEP})?(?:\\(\\s*\\d{3}\\s*\\)|\\d{3})${PHONE_SEP}\\d{3}${PHONE_SEP}\\d{4})(?!\\d)`,
  "g"
);
// A local number with no area code ("555-0123"), typed words only: in prose
// "300-1200 vehicles" would read as one. Never inside a longer number.
const LOCAL_PHONE = new RegExp("(^|[^\\d\\-\\u2010-\\u2015.])(\\d{3}[\\s.\\-\\u2010-\\u2015]\\d{4})(?![\\d\\-\\u2010-\\u2015])", "g");
/** After seven digits: a quantity ("800-1200 square feet"), not a phone. */
const QUANTITY_AFTER =
  /^\s*(?:sq\b|square|sf\b|sqft|ft\b|feet|foot|m\b|m2|metres?|meters?|km\b|mm\b|cm\b|lf\b|linear|lineal|kg\b|lbs?\b|tonnes?|tons?\b|litres?|liters?|gallons?|units?\b|vehicles?|cars?\b|trucks?|buses|people|pedestrians|cyclists|riders|students|visitors|pieces|tiles|bags|pallets|panels|percent|dollars?|%)/i;
/** Before seven digits: a range ("between 300-1200"). */
const RANGE_BEFORE = /(?:\b(?:between|from|about|around|approx|approximately|roughly|some|over|under|nearly)\.?|[~$])\s*$/i;
const EMAIL_IN_COPY = /[^\s<>()"',;:[\]]+@[^\s<>()"',;:[\]]+\.[a-z]{2,}/gi;
const POSTCODE_IN_COPY = /\b[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d\b/gi;
const STREET_TYPES =
  "Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Crescent|Cres|Court|Ct|Crt|Place|Pl|Boulevard|Blvd|Way|Lane|Ln|Highway|Hwy|Terrace|Trail|Parkway|Pkwy|Circle|Close|Gate|Row|Line|Sideroad";
/** Street names people type that prose rarely puts after a number. */
const TYPED_STREET_TYPES = `${STREET_TYPES}|Bay|Hill|Heights|Broadway|Square|Mews|Grove|Landing|Ridge`;
const streetRule = (types: string, flags: string) =>
  new RegExp(
    `\\b(?:\\d{1,5}[-\\u2010-\\u2013])?\\d{1,6}[A-Z]?\\s+(?:[A-Z][\\w'\\u2019.-]*|\\d{1,3}(?:st|nd|rd|th)?)(?:\\s+[A-Z0-9][\\w'\\u2019.-]*){0,2}\\s+(?:${types})\\b\\.?`,
    flags
  );
const STREET_IN_COPY = streetRule(STREET_TYPES, "g");
const STREET_ANY_CASE = streetRule(TYPED_STREET_TYPES, "gi");
/** Typed words only: "5678 Highway 7", "12345 Regional Road 25", "2345 Concession 6", "1234 Fire Route 52" (three digits at least: "2 Highway 7 crossings" is a count). */
const ROUTE_ADDRESS = /\b(\d{3,6})\s+(?:Highway|Hwy\.?|Regional\s+R(?:oa)?d\.?|County\s+R(?:oa)?d\.?|Line|Side\s?road|Concession|Conc\.|Fire\s+Route)\s+\d{1,4}\b/gi;
/**
 * Typed words only: a rural route before a comma, the end, a town or a site
 * ("RR 2, Caledon", "RR 2 Moffat", "RR 3 Site 30 C12"); "on RR 25 at Derry
 * Road" is Halton's road (ROAD_BEFORE, RURAL_AFTER).
 */
const RURAL_ROUTE = /\b(?:R\.?\s?R\.?\s*#?\s*\d{1,3}|Rural\s+Route\s*#?\s*\d{1,3})\b/gi;
const RURAL_AFTER = /^(?:\s*(?:[,;\n]|\.?\s*$)|\s+(?:[Ss]ite\b|[A-Z][a-z]))/;
/** Typed words only: a post office box ("PO Box 123"), or "Box 14" opening the words or a part of them ("junction box 2" is not one). */
const PO_BOX = /\b(?:P\.?\s?O\.?\s*Box|Post\s+Office\s+Box)\s*#?\s*\d{1,6}\b/gi;
const BARE_BOX = new RegExp("(^|[,;\\n]\\s*)(Box\\s*#?\\s*\\d{1,6})\\b", "g");
/** Any case, for a word in a case-sensitive rule. */
const anyCase = (w: string) => w.replace(/[a-z]/g, (c) => `[${c}${c.toUpperCase()}]`);
const FR_NAME = "[A-Za-z0-9\\u00c0-\\u00ff][\\w\\u00c0-\\u00ff'\\u2019-]*";
const FR_LINK = `(?:${anyCase("du")}|${anyCase("des")}|${anyCase("de")}(?:\\s+${anyCase("la")})?|[dD]['\\u2019]|${anyCase("la")}|${anyCase("le")}|${anyCase("les")})`;
const EACUTE = "(?:\\u00e9|\\u00c9|[eE])";
/** Typed words only: a French address. */
// "rue", "chemin", "rang" and "montee" are never English: any case after
// them ("1234 rue sainte-catherine"). "boulevard", "route", "promenade",
// "impasse" and "allee" are English words too ("3 boulevard sections", "2
// route options"): after a one- or two-digit number, a capital, a number or
// "du", "de", "des" must follow them ("1234 boulevard rene-levesque" is an
// address).
// "avenue" and "place" only with "du", "de", "des" after them: "72 Avenue in
// Surrey" is a numbered street, "3 place settings" a count.
const FRENCH_ADDRESS = new RegExp(
  `\\b(\\d{1,6})\\s*,?\\s+(?:(?:${anyCase("rue")}|${anyCase("chemin")}|${anyCase("rang")}|${anyCase("mont")}${EACUTE}${anyCase("e")})((?:\\s+${FR_NAME}){1,3})` +
    `|(?:${anyCase("boul")}(?:${anyCase("evard")}|\\.)?|${anyCase("route")}|${anyCase("promenade")}|${anyCase("impasse")}|${anyCase("all")}${EACUTE}${anyCase("e")})(\\s+${FR_LINK})?\\s+(${FR_NAME})(?:\\s+${FR_NAME}){0,2}` +
    `|(?:${anyCase("avenue")}|${anyCase("av")}\\.|${anyCase("place")})\\s+${FR_LINK}\\s+${FR_NAME}(?:\\s+${FR_NAME}){0,2})`,
  "g"
);
/**
 * Typed words only: a street named without its type ("Herringbone, 1234
 * Lakeshore", "at 1234 Yonge, Toronto", "Where: 1234 Kingsway", "at 12
 * Lakeshore,"): one or two capitalised words, after a comma, a colon, "at",
 * "on", "to", "from", "of" or "near" (or nothing), and before a comma, "in"
 * or the end. Three digits at least, but one or two after "at"; a year only
 * after "at" or "on" ("Kitchener, 2021 Remembrance Day.").
 */
const NAMED_ROAD = new RegExp(
  "(^|[,;:\\n]\\s*|\\b(?:[Aa]t|[Oo]n|[Tt]o|[Ff]rom|[Oo]f|[Nn]ear)\\s+)(\\d{1,5})\\s+([A-Z][a-z\\u00e0-\\u00ff'\\u2019]+(?:[\\s-][A-Z][a-z\\u00e0-\\u00ff'\\u2019]+)?)(?=\\s*(?:[,;\\n]|\\.(?:\\s|$)|$|\\s+in\\s))",
  "g"
);
/**
 * The same, typed in lowercase, only after "at" and only one word, never a
 * plural ("at 1234 lakeshore, toronto", "at 12 lakeshore,"; "at 3 schools,"
 * is a count, "at 10 am," a time).
 */
const LOWER_NAMED_ROAD = new RegExp(
  "(\\b[Aa]t\\s+)(\\d{1,5})\\s+([a-z][a-z\\u00e0-\\u00ff'\\u2019]+)(?=\\s*(?:[,;\\n]|\\.(?:\\s|$)|$|\\s+in\\s))",
  "g"
);
/** The Where field only: a house number at its start ("1234 Lakeshore, Toronto"). */
const LEADING_NUMBER = new RegExp("^\\s*(\\d{1,6}[A-Za-z]?\\s+([A-Za-z\\u00c0-\\u00ff][\\w'\\u2019.-]*))");

const PHONE_SAY = `A phone number that isn't one of HUB's office lines (${HUB_PHONES.join(", ")}): take it out.`;
const EMAIL_SAY = `An email address that isn't HUB's (@${HUB_EMAIL_DOMAIN}): take it out.`;
const ADDRESS_SAY = "A street address or postal code: take it out, unless it's a public place or the owner has agreed to it being on the site.";

/** What a contact issue is, in a word: what the masks and the notes say in its place. */
export function contactKind(issue: Pick<StyleIssue, "message">): "phone number" | "email" | "address" {
  return issue.message === PHONE_SAY ? "phone number" : issue.message === EMAIL_SAY ? "email" : "address";
}

export interface ContactOptions {
  /** Words a person typed: any case, any house number, the extra forms above. */
  typed?: boolean;
  /** The Where field of a job post: a house number at its start counts too. */
  place?: boolean;
}

/** Phone numbers, emails, street addresses and postal codes that aren't HUB's own, in reading order, one per detail. */
export function contactIssues(text: string, opts: ContactOptions = {}): StyleIssue[] {
  if (!text || !text.trim()) return [];
  const typed = opts.typed === true || opts.place === true;
  const found: StyleIssue[] = [];
  const add = (index: number, length: number, message: string) =>
    found.push({ rule: "contact", message, excerpt: excerptAt(text, index, length), index, length });
  // Web addresses blanked, same length: a photo's file name on Sanity's CDN
  // ("...a3fe670359-1200x900.jpg") reads as a phone number otherwise, and a
  // medium.com/@name link as an email. mailto: links stay readable.
  const plain = text.replace(/\b(?:https?:\/\/|www\.)[^\s<>"')\]]+/gi, (m) => " ".repeat(m.length));
  const before = (at: number) => plain.slice(Math.max(0, at - 24), at);
  const full: [number, number][] = [];
  for (const m of plain.matchAll(PHONE_IN_COPY)) {
    const at = (m.index ?? 0) + m[1].length;
    full.push([at, at + m[2].length]);
    const d = digitsOf(m[2]);
    if (!HUB_DIGITS.has(d) && dialable(d) && !TOLL_FREE.has(d.slice(0, 3))) add(at, m[2].length, PHONE_SAY);
  }
  if (typed) {
    // Never the last seven digits of a full number, HUB's own included, and
    // never a range or a quantity.
    for (const m of plain.matchAll(LOCAL_PHONE)) {
      const at = (m.index ?? 0) + m[1].length;
      const end = at + m[2].length;
      if (full.some(([a, b]) => at < b && a < end) || !/^[2-9]/.test(m[2])) continue;
      if (QUANTITY_AFTER.test(plain.slice(end, end + 16)) || RANGE_BEFORE.test(before(at))) continue;
      add(at, m[2].length, PHONE_SAY);
    }
  }
  for (const m of plain.matchAll(EMAIL_IN_COPY)) {
    const domain = (m[0].split("@").pop() ?? "").toLowerCase();
    if (domain !== HUB_EMAIL_DOMAIN && !domain.endsWith(`.${HUB_EMAIL_DOMAIN}`)) add(m.index ?? 0, m[0].length, EMAIL_SAY);
  }
  for (const m of plain.matchAll(POSTCODE_IN_COPY)) add(m.index ?? 0, m[0].length, ADDRESS_SAY);
  for (const m of plain.matchAll(typed ? STREET_ANY_CASE : STREET_IN_COPY)) {
    const at = m.index ?? 0;
    const end = at + m[0].length;
    if (isAddress(m[0], before(at), plain.slice(end, end + 40), typed)) add(at, m[0].length, ADDRESS_SAY);
  }
  if (typed) {
    for (const m of plain.matchAll(ROUTE_ADDRESS)) {
      const at = m.index ?? 0;
      if (!(YEAR.test(m[1]) && YEAR_BEFORE.test(before(at)))) add(at, m[0].length, ADDRESS_SAY);
    }
    for (const m of plain.matchAll(RURAL_ROUTE)) {
      const at = m.index ?? 0;
      const end = at + m[0].length;
      if (RURAL_AFTER.test(plain.slice(end, end + 12)) && !ROAD_BEFORE.test(before(at))) add(at, m[0].length, ADDRESS_SAY);
    }
    for (const m of plain.matchAll(PO_BOX)) add(m.index ?? 0, m[0].length, ADDRESS_SAY);
    for (const m of plain.matchAll(BARE_BOX)) add((m.index ?? 0) + m[1].length, m[2].length, ADDRESS_SAY);
    for (const m of plain.matchAll(FRENCH_ADDRESS)) {
      // "1 rue pietonne" is a pedestrian street; "12 rue de la Paix" an address.
      if (m[2] !== undefined && m[1].length === 1 && !CAPITAL.test(m[2].trim().charAt(0))) continue;
      // "3 boulevard sections", "2 route options": counts.
      if (m[4] !== undefined && m[3] === undefined && m[1].length < 3 && !/^[0-9]/.test(m[4]) && !CAPITAL.test(m[4].charAt(0))) continue;
      add(m.index ?? 0, m[0].length, ADDRESS_SAY);
    }
    for (const re of [NAMED_ROAD, LOWER_NAMED_ROAD]) {
      for (const m of plain.matchAll(re)) {
        const at = (m.index ?? 0) + m[1].length;
        if (re === LOWER_NAMED_ROAD && /s$/.test(m[3])) continue;
        if (namedRoad(m[2], m[3], m[1]) && !NOT_A_NAME.has(m[3].toLowerCase())) add(at, m[0].length - m[1].length, ADDRESS_SAY);
      }
    }
  }
  if (opts.place) {
    const m = LEADING_NUMBER.exec(plain);
    const word = (m?.[2] ?? "").toLowerCase().replace(/[.,]+$/, "");
    // "100 Mile House", "401 and Keele", "152 Street and 72 Avenue", "407 ETR" are places, not house numbers.
    if (m && !UNITS.has(word) && !NOT_A_NAME.has(word) && !NUMBERED_STREET.has(word) && !/^[A-Z]{2,}$/.test(m[2].replace(/[.,]+$/, ""))) {
      add(m[0].length - m[1].length, m[1].length, ADDRESS_SAY);
    }
  }
  // One issue per detail: a postcode inside an address, or a local number
  // inside a full one, is the same detail.
  const out: StyleIssue[] = [];
  for (const i of found.sort((a, b) => a.index - b.index || b.length - a.length)) {
    if (out.some((o) => i.index < o.index + o.length && o.index < i.index + i.length)) continue;
    out.push(i);
  }
  return out;
}

const CIVIC = new RegExp("^(?:\\d{1,5}[-\\u2010-\\u2013])?(\\d+)[A-Za-z]?\\s+(\\S+)");
const YEAR = /^(?:19|20)\d\d$/;
/** The words a numbered street is named by ("152 Street", "72 Avenue", "No. 3 Road", "15 Sideroad"). */
const NUMBERED_STREET = new Set(["street", "st", "avenue", "ave", "road", "rd", "line", "sideroad", "concession", "highway", "hwy"]);
/** Words no street name has: a joining word or a verb means it's a sentence ("2 crosswalks took place"). */
const NOT_A_NAME = new Set([
  "and", "or", "near", "at", "to", "from", "of", "by", "with", "between", "past", "off", "on", "the", "for", "in", "into", "over", "under", "a", "an", "per", "each", "every", "along", "across",
  "are", "is", "was", "were", "be", "been", "took", "take", "very", "so", "too", "also", "then", "done", "did", "has", "have", "had", "will", "can", "got", "we", "they", "it", "its", "this", "that", "these", "those", "not",
]);
/** A distance, a size, a time or a count of coats, not a house number: "35 km Spirit Trail", "480 square metres", "3 day road closure", "16 Mile Creek Trail". */
const UNITS = new Set([
  "km", "m", "metre", "metres", "meter", "meters", "kilometre", "kilometres", "kilometer", "kilometers", "ft", "feet", "foot", "inch", "inches", "mm", "cm", "mi", "mile", "miles", "sq", "square",
  "year", "years", "month", "months", "week", "weeks", "day", "days", "hr", "hrs", "hour", "hours", "min", "minute", "minutes", "storey", "storeys", "story",
  "colour", "colours", "color", "colors", "coat", "coats", "series", "x", "kg", "lb", "lbs",
  "degree", "degrees", "celsius", "fahrenheit", "psi", "mph", "kph", "rpm", "mil", "mils", "micron", "microns", "percent", "kpa", "mpa", "ppm",
  "ml", "oz", "litre", "litres", "liter", "liters", "tonne", "tonnes", "gallon", "gallons",
]);
/** What a job puts on a road, never a street's name: "3 bus lane segments", "12 stop line markings", "a 2 way street". */
const ROAD_WORDS = new Set([
  "bus", "buses", "bike", "bikes", "bicycle", "cycle", "cycling", "crosswalk", "crosswalks", "basketball", "tennis", "pickleball", "volleyball", "stop", "yield", "turn", "merge",
  "traffic", "parking", "loading", "hov", "lane", "lanes", "line", "lines", "solid", "dashed", "dotted", "broken", "mural", "murals", "marking", "markings", "zone", "zones",
  "stall", "stalls", "pad", "pads", "rink", "way", "shared",
]);
/**
 * What a crew counts on a street, after it: a one- or two-digit number before
 * the street is then a count ("the 3 Main Street crossings", "2 King Street
 * West crosswalks", "2 dog park gate posts"). A listed noun, never any word
 * ending in s ("45 Maple Crescent looks sharp" is a house: the third review
 * of 24 Oct 2026), and plural only where one of them can be a single home's
 * job ("the 12 Oak Street job" is an address, "our 2 Bay Street jobs" a count).
 */
const COUNT_NOUNS = new Set([
  "crosswalk", "crosswalks", "crossing", "crossings", "segment", "segments", "section", "sections", "marking", "markings", "mural", "murals",
  "line", "lines", "lane", "lanes", "bar", "bars", "arrow", "arrows", "chevron", "chevrons", "symbol", "symbols", "logo", "logos",
  "intersection", "intersections", "corner", "corners", "island", "islands", "median", "medians", "roundabout", "roundabouts", "ramp", "ramps",
  "stall", "stalls", "leg", "legs", "approaches", "stops", "zones", "lots", "blocks", "sites", "locations", "jobs", "projects", "installs",
  "installations", "gates", "posts", "pads", "rows", "strips", "panels", "templates", "entrances", "spaces", "bays",
]);
/** Before a house number, never a count: "at 45 Maple Crescent", "the smiths, 45 park road". */
const ADDRESS_BEFORE = /(?:\b(?:at|on|lives?|home|house|address)\s*[:#]?|[,;:])\s*$/i;
/** Before a year, not a house number: "In 2023 Fraser Highway", "Summer 2022 King Street". Not "by" or "from": "drive by 2041 Main Street", "photos from 1987 Oak Street". */
const YEAR_BEFORE =
  /\b(?:in|since|until|till|during|circa|early|late|mid|summer|fall|autumn|winter|spring|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?,?\s*$/i;
/** Before a road's number, not a house: "on RR 25", "along RR 2". */
const ROAD_BEFORE = /\b(?:on|along|off|near|onto|via|to|from|at|crossing)\s*$/i;
const NEXT_WORD = new RegExp("^\\s+([a-z][a-z'\\u2019]*)\\b");
const CAPITAL = new RegExp("[A-Z\\u00c0-\\u00de]");
const DIRECTION = /^\s+(?:n|s|e|w|ne|nw|se|sw|north|south|east|west)\b\.?/i;
const STREET_TYPE_WORD = new RegExp(`^(?:${TYPED_STREET_TYPES})$`, "i");
/** Not a road's name after a number: "100 Mile House", "Phase 2", "1200 Fast Patch", "152 Street". */
const NOT_A_ROAD = new Set([
  "phase", "volume", "grade", "section", "lot", "ward", "exit", "series", "unit", "suite", "route", "model", "type", "class", "page", "part", "step", "canada",
  "am", "pm", "noon", "midnight", "oclock", "sharp", "below", "above",
  "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
]);

/**
 * A street match that is an address. Never a numbered crossing ("152 Street
 * and 72 Avenue": the word after the number names a numbered street), a
 * highway's number ("Highway 401 and King Street"), a distance or a size
 * ("35 km Spirit Trail", "3 day road closure"), what a job puts on the road
 * ("3 bus lane segments"), a count after "the" ("the 3 Main Street
 * crossings") or before what it counts ("on 2 King Street West crosswalks"),
 * or a phrase with a joining word in it. In prose, also never a year ("2024
 * Boundary Road Pump Station") or a one-digit count, unless the words before
 * it say address ("at 2041 Main Street", "lives at 5 Oak Street"). Typed
 * words drop that last exception, but a year after "in", "since" or a month
 * is still a year ("In 2023 Fraser Highway").
 */
function isAddress(match: string, before: string, after: string, typed = false): boolean {
  const m = CIVIC.exec(match);
  const civic = m?.[1] ?? "";
  const first = (m?.[2] ?? "").toLowerCase().replace(/[.,]+$/, "");
  if (NUMBERED_STREET.has(first) || UNITS.has(first)) return false;
  // The words between the number and the street type. A count is one or
  // two digits: "1234 Town Line Road" is a farm, "12 stop line markings" a job.
  const parts = match.trim().split(/\s+/);
  const name = parts.slice(1, -1).map((w) => w.replace(/[.,]+$/, "").toLowerCase());
  const count = civic.length <= 2;
  if (name.some((w) => NOT_A_NAME.has(w) || (count && ROAD_WORDS.has(w)))) return false;
  if (/\b(?:highway|hwy\.?|route|road|rd\.?|line|concession|exit)\s*#?\s*$/i.test(before)) return false;
  // A count goes on to what it counts (COUNT_NOUNS), never after "at", "on"
  // or a comma: "Their 12 Oak Street driveway" and "at 45 Maple Crescent"
  // are houses.
  const next = NEXT_WORD.exec(after.replace(DIRECTION, ""))?.[1];
  if (count && next && COUNT_NOUNS.has(next) && !ADDRESS_BEFORE.test(before)) return false;
  const year = YEAR.test(civic);
  if (typed) return !(year && YEAR_BEFORE.test(before));
  const addressWord = /\b(?:at|on|is|address|lives?|home|house|unit|suite)\s*[:#]?\s*$/i.test(before);
  return !((civic.length === 1 || year) && !addressWord);
}

/** A NAMED_ROAD match that is an address: not a year away from "at" or "on", a unit, a street type, a product, a month. */
function namedRoad(civic: string, words: string, lead: string): boolean {
  if (civic.length < 3 && !/\b[Aa]t\s/.test(lead)) return false;
  if (YEAR.test(civic) && !/\b[Aa]t|\b[Oo]n/.test(lead)) return false;
  const first = words.split(/[\s-]/)[0].toLowerCase();
  if (UNITS.has(first) || NOT_A_ROAD.has(first) || NUMBERED_STREET.has(first)) return false;
  if (STREET_TYPE_WORD.test(first)) return false;
  return !PRODUCT_NAMES.some((p) => p.toLowerCase().startsWith(first));
}

/**
 * Whether words written without their capitals (a slug, a search phrase)
 * carry a phone number, email or street address that isn't HUB's: the
 * typed reading, with hyphens and underscores read as spaces.
 */
export function hasContactAnyCase(text: string): boolean {
  const words = text.replace(/[-_/]+/g, " ");
  return contactIssues(text, { typed: true }).length > 0 || contactIssues(words, { typed: true }).length > 0;
}

/**
 * The text with every phone number, email and address that isn't HUB's
 * taken out, read as typed: what a slug is made from, so a held article's
 * address can't reach its URL while a person fixes the title.
 */
export function stripContact(text: string): string {
  let out = "";
  let from = 0;
  for (const i of contactIssues(text, { typed: true })) {
    out += text.slice(from, i.index);
    from = i.index + i.length;
  }
  return (out + text.slice(from)).replace(/\s{2,}/g, " ").trim();
}

/**
 * The text with each contact detail replaced by what it is ("[phone
 * number]", "[email]", "[address]"). Masks only what the rule sees, so
 * nothing that goes into Sanity quotes a person's own words with it: the
 * notes and the Sent to Buffer records name the field and the kind instead
 * (styleReport). `typed` as contactIssues takes it.
 */
export function maskContact(text: string, opts: ContactOptions = {}): string {
  let out = "";
  let from = 0;
  for (const i of contactIssues(text, opts)) {
    out += `${text.slice(from, i.index)}[${contactKind(i)}]`;
    from = i.index + i.length;
  }
  return out + text.slice(from);
}

/**
 * Everything in `text` that breaks the house style, in reading order.
 * Plain text or markdown; link addresses and emails are left out of the
 * style rules (the contact rule reads them). `contact: false` leaves the
 * contact rule out: Studio runs it only where words arrive unreviewed (blog
 * posts and Job photos, sanity/schemas/_shared.ts), not on the pages and
 * products the office writes, where a public place's address is fine.
 * `typed` and `place` read it as contactIssues does.
 */
export function lintCopy(text: string, opts: { contact?: boolean } & ContactOptions = {}): StyleIssue[] {
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
  if (opts.contact !== false) issues.push(...contactIssues(text, { typed: opts.typed, place: opts.place }));
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

  // Listed names of more than one word ("Product Portfolio Book", "Lunch & Learn", "King Street" is below).
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
  /** false leaves the contact rule out, as lintCopy's option does. */
  contact?: boolean;
  /** Read the contact rule as for words a person typed (contactIssues). */
  typed?: boolean;
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
  const issues = lintCopy(text, { contact: options.contact, typed: options.typed }).filter(keep);

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
