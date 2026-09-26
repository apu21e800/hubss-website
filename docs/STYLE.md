# House style: hubss.com

One page. For everyone who writes a word that reaches the site: the pages, the
Idea Book transcriptions, Studio, the AI drafter and social prompts
(`lib/field-note-drafter.ts`, `lib/social-drafter.ts`), and the emails the
site sends. Written for Doug's round, 25 Sep 2026: an English reader notices
inconsistency before anything else.

## Voice

A senior specifier explaining something to a peer: plain, confident,
concrete, useful. Say the fact, then stop. Nothing shouts. One idea per
sentence; one job per section. Written by a person who has stood on the
pavement: the sentences vary in length, the verbs do the work, and a
paragraph ends when the point is made, not with a line that sums it up.

## Machine tells (Vern, 26 Sep 2026)

Readers now recognise machine-written copy on sight, and it costs trust.
None of the following appears on the site, in Studio, in the drafter's
output or in the emails:

- Em dashes. None, anywhere, not even one. An aside goes between commas or
  in parentheses; a pivot gets a full stop or a colon; a list gets commas.
  The en dash stays only inside a range (10–20 years, 2026–27).
- The reversal: "It's not X, it's Y", "not just X", "more than a surface".
- Three of everything: three adjectives, three fragments, three parallel
  clauses, because three felt complete.
- Stacked fragments as a device: "Fast. Durable. Proven."
- "Whether you're a … or a …", "From X to Y", "In today's …", "In a world
  where …", "Here's the thing", "Let's dive in", "Think of it as".
- Headings that ask a question, headings built as "X: Y", and a page where
  every heading is a two-beat couplet.
- Filler verbs and adjectives: seamless, robust, elevate, leverage, unlock,
  empower, harness, streamline, holistic, tailored, bespoke, cutting-edge,
  game-changing, world-class, best-in-class, premium (as praise), solutions
  (as filler), journey, landscape (as metaphor), ensure, delve.
- The summing-up line at the end of a paragraph that restates the
  paragraph. The hedge that says nothing ("it's worth noting").
- Exclamation marks. Emoji. "Discover", "Explore", "Learn more" as buttons.

The test: read it aloud. If a person on the phone would not say it, cut it.

## Spelling and grammar

- Canadian English: colour, centre, metre, kilometre, curb, aluminum,
  program, catalogue (the word, when it ever needs writing; the book is the
  Idea Book), licence (noun) / license (verb).
- Sentence case for headings, buttons, labels and eyebrows: "Open the Idea
  Book", "Where MMAX goes", "Specification library". Capitals only for proper
  nouns and product names. The CSS may set an eyebrow in small caps; the
  source text is still sentence case.
- No exclamation marks. No questions as headings. No "actually", "just".
- Ampersand only inside a name (Lunch & Learn, Asphalt & Concrete Repair,
  Parks & Paths); "and" in a sentence.

## Names, exactly

- **HUB Surface Systems**; HUB on second mention. Never "Hub", never "HUBSS"
  in prose (it is the domain and the code).
- Products: TrafficPatternsXD, TrafficPatterns, PreMark, DuraTherm, DecoMark,
  AirMark, StreetBond, StreetBondSR, MMAX, DuraShield, StreetPrint, ChipFill,
  AggreFill, Fast Patch DPR. One spelling each, no ® on the page.
- Families, the same in the menu, on /products, on the product page and in
  the book: Preformed Thermoplastics, Coatings, Stamped Asphalt, Asphalt &
  Concrete Repair.
- Sections: Insights (the library; its pieces are articles, case studies,
  guides, white papers, project profiles), the Idea Book ("The HUB Idea Book ·
  Volume 5" in full), Resources (the specification library), Lunch & Learn.
- Places: city and province, province spelled out in prose: Milton,
  Ontario; Ladysmith, British Columbia. Abbreviate (ON, BC) only in an
  address block or a table.
- Offices: East and West.

## Numbers

- Figures for measurements, money, times and spans: 0.33, 45–60 minutes,
  +3°C, 10–20 years, 125 mil (where the spec sheet says mil). Metric first.
- The company's numbers are the book's and only these: since 1999, 27 years,
  1,000+ projects, 10 provinces, coast to coast. Service life is per system
  (StreetPrint 10–20 years, TrafficPatternsXD 10+, TrafficPatterns 8+,
  StreetBond 8+, PreMark 6–8). There is no site-wide "20-year" claim and no
  "500+" anything.
- No counts as a selling point: no "14 systems", "16 templates", "144 pages",
  "74 articles". A count inside a control is fine ("Show all 29").
- LEED is v5.
- Years and editions: 2026–27 (en dash).

## Dashes and punctuation

- No em dashes (see Machine tells). En dash, no spaces, for spans: 10–20
  years, 2026–27. Hyphen for compounds: freeze-thaw, heat-activated,
  snowplow-safe.
- Middle dot to join a label and its qualifier: "Idea Book · Volume 5",
  "West · 604-309-8212".
- Dates as the site prints them: Sep 25, 2026.
- One space after a full stop. Straight quotes in code, curly on the page.

## Words we don't use

revolutionary, game-changing, cutting-edge, unparalleled, world-class,
best-in-class, seamless, robust, leverage, elevate, signature (as praise),
premium (as praise), solutions (as filler), "beautiful that", "specialists"
as a boast, and any credential HUB doesn't hold (no CE, AIBC, RAIC, PEO or
CPD credit claims).

## Structure

- One primary call to action per surface, and the verb says what happens:
  "Book a Lunch & Learn", "Open the Idea Book", "View all products", "Request
  a copy". Never "Explore", "Discover", "Learn more".
- An eyebrow only when it adds a fact the heading doesn't (the family above a
  product name). Never the heading again in other words.
- A descriptor under a name only where the name is opaque and the descriptor
  earns its place. The menus carry names.
- The approved book copy (lib/product-catalogue.ts, lib/application-catalogue.ts,
  and the Sanity fields synced from them) is Doug's. Propose edits to him;
  don't cut it.
