/**
 * Lines Studio still holds that the site no longer says (17 Oct 2026).
 *
 * Studio owns the page text (docs/SANITY-COPY-SYNC.md: the sync fills blanks
 * and never overwrites Doug's words). On 30 Sep and 7 Oct the sync wrote the
 * code's lines into Studio, so Studio holds them word for word. The copy
 * review of 17 Oct 2026 (Vern: "make sure every heading and body copy reads
 * well, as if it is not written by AI ... Doug picks up on that") rewrote the
 * lines below. Two things read this list:
 *
 *   - the pages, through `current()`: a Studio value that still equals a
 *     `from` prints as its `to`, so the site reads right the moment this
 *     deploys. Anything Doug has typed since is not on the list and wins.
 *   - scripts/studio-cleanup-2026-10-17.ts (change 4), which writes each `to`
 *     into Studio where it still holds the `from`, on Vern's PC. After that
 *     run nothing here matches again and the list is history.
 *
 * `path` is the Sanity field in dotted form, as a patch writes it.
 */
import { stegaClean } from "@sanity/client/stega";

export interface Superseded {
  doc: string;
  path: string;
  from: string;
  to: string;
}

export const SUPERSEDED: Superseded[] = [
  // ── Homepage sections (lib/homepage-copy.ts is the code fallback) ──────
  {
    doc: "page-homepage",
    path: "homepageSections.audiences[0].desc",
    from: "Crosswalks, transit corridors and plazas: built for Vision Zero programs, accessible, installed by certified crews coast to coast.",
    to: "Accessible crosswalks, transit corridors and plazas for Vision Zero programs, installed by certified crews across Canada.",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.systems.intro",
    from: "Stamped asphalt, preformed thermoplastic and coatings, chosen by what the surface has to take.",
    to: "Stamped asphalt, preformed thermoplastic and coatings. Which one depends on what the surface has to take.",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.applications.heading",
    from: "Every surface,",
    to: "The job decides",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.applications.headingAccent",
    from: "a statement.",
    to: "the system.",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.applications.intro",
    from: "Crosswalks, bike lanes, civic art, driveways: wherever people move, gather, or stop, the surface underneath is doing work.",
    to: "Crosswalks, bike lanes, civic art, driveways. Each asks something different of the surface, and each has a system for it.",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.insights.eyebrow",
    from: "Insights",
    to: "Projects",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.insights.intro",
    from: "Installation guides, project write-ups, and the specification detail behind them.",
    to: "Jobs by town, how each went in, and the spec behind it.",
  },
  // 26 Oct 2026 (Vern: Doug "did not seem impressed" with the heading): one
  // plain phrase in place of the two. The accent empties, so the page prints
  // the heading alone (FeaturedBlogPost renders the accent only when set).
  {
    doc: "page-homepage",
    path: "homepageSections.insights.heading",
    from: "How it goes in",
    to: "Recent work across Canada.",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.insights.headingAccent",
    from: "and how it holds up.",
    to: "",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.onTheGround.heading",
    from: "Follow the work.",
    to: "Follow the crews.",
  },
  {
    doc: "page-homepage",
    path: "homepageSections.onTheGround.intro",
    from: "Projects across Canada, documented as they happen.",
    to: "New jobs across Canada, posted as they go in.",
  },

  // ── About (lib/about-content.ts) ───────────────────────────────────────
  {
    doc: "page-about",
    path: "aboutHero.eyebrow",
    from: "Canadian-operated since 1999 · All 10 provinces",
    to: "Canadian-owned since 1999",
  },
  {
    doc: "page-about",
    path: "aboutHero.heading",
    from: "The people who made your city look like your city.",
    to: "Streets don’t have to be grey.",
  },
  {
    doc: "page-about",
    path: "aboutHero.subheading",
    from: "HUB Surface Systems builds streets that carry a community’s identity as well as its traffic.",
    to: "HUB installs stamped asphalt, preformed thermoplastic and pavement coatings across Canada, through installers it trains and certifies.",
  },
  {
    doc: "page-about",
    path: "aboutStory[0]",
    from: "HUB began with a simple belief: streets don’t have to be grey. We built the company around StreetPrint, the stamped asphalt system invented in Canada and installed here since 1992.",
    to: "HUB started in 1999 around one system: StreetPrint, the stamped asphalt invented in Canada and installed here since 1992.",
  },
  {
    doc: "page-about",
    path: "aboutStory[1]",
    from: "Since 1999 we have added a system for nearly every surface a Canadian city looks after, each one installed to spec by certified installers that HUB trains and authorizes.",
    to: "Since then we have added a system for nearly every surface a Canadian city looks after, each one installed to spec by certified installers HUB trains and authorizes.",
  },

  // ── Contact (app/contact/page.tsx) ─────────────────────────────────────
  {
    doc: "page-contact",
    path: "contactHero.heading",
    from: "Start a project",
    to: "Tell us about the job.",
  },
  {
    doc: "page-contact",
    path: "contactHero.subheading",
    from: "Tell us about your community, your timeline, and your vision. We'll tell you which surface system brings it to life.",
    to: "The site, the timing, what you want it to look like. We’ll say which system fits and put you in touch with the installer nearest you.",
  },

  // ── Lunch & Learn questions (lib/lunch-learn-content.ts) ───────────────
  // The session is 60 minutes (Doug, 26 Oct 2026, on the e-blasts: "60 mins,
  // across the board"; the printed book: "Got an hour?"). Studio holds the
  // 17 Oct answer, which said forty-five (the 17 Oct review's own "from",
  // "30–45 minutes of presentation, followed by open Q&A ...", is no longer
  // in Studio).
  {
    doc: "page-lunch-learn",
    path: "lunchLearnFaqs[0].a",
    from: "Forty-five minutes, then questions for as long as you want. We stick to the time we agree on.",
    to: "Sixty minutes, then questions for as long as you want. We stick to the time we agree on.",
  },
  {
    doc: "page-lunch-learn",
    path: "lunchLearnFaqs[1].a",
    from: "Nothing. Sessions are how we introduce our systems to the people who specify them: no invoice, no minimum order, and no follow-up pressure.",
    to: "Nothing. No invoice, no minimum order, no follow-up pressure. It is how we introduce the systems to the people who write the specs.",
  },
  {
    doc: "page-lunch-learn",
    path: "lunchLearnFaqs[3].a",
    from: "Both. In-person sessions are available coast to coast through our certified applicator network. Virtual sessions use Zoom or Teams. We mail sample kits before we connect.",
    to: "Both. In-person sessions are available across Canada through our certified installers. Virtual sessions use Zoom or Teams, and we mail the sample kit ahead.",
  },

  // ── Posts (lib/blog.ts and the build's menu and search files read these
  // through currentIn, currentBody and currentPlain: only in their own post)
  // The parking lot guide, 24 Oct 2026. Vern, on the homepage card: "don't
  // talk about re-striping. Choose totally different heading. No stripes".
  // The title also said "thermoplastic" alone, which docs/GLOSSARY.md keeps
  // for the hot-poured road paint. The address stays (labels change, URLs
  // stay); the body paths are the positions the cleanup script checks.
  {
    doc: "blogpost-parking-lot-line-painting-vs-thermoplastic",
    path: "title",
    from: "When the lot is restriped, put these markings in thermoplastic",
    to: "Which parking lot markings to put in preformed thermoplastic",
  },
  {
    doc: "blogpost-parking-lot-line-painting-vs-thermoplastic",
    path: "excerpt",
    from: "Which parking lot markings to put in preformed thermoplastic while the lot is closed for restriping, and the lots that show them holding. PreMark for symbols and stop bars, TrafficPatternsXD for crosswalks.",
    to: "PreMark for the symbols and stop bars, TrafficPatternsXD for the crosswalks, and the lots that show them holding.",
  },
  {
    doc: "blogpost-parking-lot-line-painting-vs-thermoplastic",
    path: "body[0].children[4].text",
    from: ", and the Product Portfolio Book prints them as a 14-year-old entrance feature, still performing every day. If your parking lot line painting is booked, the lot will be closed in sections anyway, and that is the window to decide which markings go down in preformed thermoplastic.",
    to: ", and the Product Portfolio Book prints them as a 14-year-old entrance feature, still performing every day. A lot's arrows, stop bars and accessible parking symbols can go down in preformed thermoplastic too.",
  },
  {
    doc: "blogpost-parking-lot-line-painting-vs-thermoplastic",
    path: "body[9].children[0].text",
    from: "Writing it into the parking lot line painting contract",
    to: "Writing it into the drawings and the tender",
  },
  {
    doc: "blogpost-parking-lot-line-painting-vs-thermoplastic",
    path: "body[10].children[0].text",
    from: "Before the restripe is booked, mark up the layout drawing:",
    to: "Before the work is booked, mark up the lot's layout drawing:",
  },
  // Its keywords (the page's JSON-LD and the hubs' lanes; code review, 24 Oct
  // 2026: "restriping" still shipped there).
  {
    doc: "blogpost-parking-lot-line-painting-vs-thermoplastic",
    path: "keywords[0]",
    from: "parking lot line painting",
    to: "parking lot pavement markings",
  },
  {
    doc: "blogpost-parking-lot-line-painting-vs-thermoplastic",
    path: "keywords[5]",
    from: "parking lot restriping",
    to: "parking lot layout",
  },
];

// The pages' lines are matched on their words alone; a post's only in that
// post, so a line in one article can never rewrite another.
const isPost = (s: Superseded) => s.doc.startsWith("blogpost-");
const byFrom = new Map(SUPERSEDED.filter((s) => !isPost(s)).map((s) => [s.from, s.to]));
const inDoc = new Map(SUPERSEDED.filter(isPost).map((s) => [`${s.doc}\n${s.from}`, s.to]));
const docId = (id: string) => id.replace(/^drafts\./, "");

/** current() for a post: its title, standfirst or a span of its body, matched only in that post. */
export function currentIn<T extends string | null | undefined>(doc: string, value: T): T | string {
  if (typeof value !== "string") return value;
  const clean = stegaClean(value);
  const id = docId(doc);
  return inDoc.get(`${id}\n${clean}`) ?? inDoc.get(`${id}\n${clean.trim()}`) ?? value;
}

/** A post's body with each superseded span printed as its replacement (the marks and links stay). */
export function currentBody<B>(doc: string, blocks: B[]): B[] {
  return blocks.map((b) => {
    const kids = (b as { children?: unknown }).children;
    if (!Array.isArray(kids)) return b;
    let changed = false;
    const next = kids.map((k) => {
      const text = (k as { text?: unknown } | null)?.text;
      if (typeof text !== "string") return k;
      const to = currentIn(doc, text);
      if (to === text) return k;
      changed = true;
      return { ...(k as object), text: to };
    });
    return changed ? ({ ...(b as object), children: next } as B) : b;
  });
}

/** A post's body as plain text (pt::text) with its superseded spans replaced: reading time, the product scan. */
export function currentPlain(doc: string, text: string): string {
  const id = docId(doc);
  let out = text;
  for (const s of SUPERSEDED) {
    if (s.doc === id && s.path.startsWith("body") && out.includes(s.from)) out = out.split(s.from).join(s.to);
  }
  return out;
}

/**
 * The line as the site says it now: a Studio value that is still one of the
 * superseded lines prints as its replacement; any other value is itself.
 * Studio's preview marks every string (lib/sanity.preview.ts), so the
 * comparison is on the clean text, and a replaced line is returned clean.
 */
export function current<T extends string | null | undefined>(value: T): T | string {
  if (typeof value !== "string") return value;
  const clean = stegaClean(value);
  return byFrom.get(clean) ?? byFrom.get(clean.trim()) ?? value;
}
