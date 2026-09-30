/**
 * About page copy: the defaults /about serves, and what `npm run sync:pages`
 * pushes into Sanity's page-about document. One source for both, so the page
 * and the sync can't drift (they did: the old sync held its own copy).
 *
 * Trimmed 30 Sep 2026 (Vern: "this page is loaded with text... Doug will call
 * us out for it. Don't overload users with text"): from about 770 words to
 * about 300. The story is two short paragraphs beside four photographs of
 * documented jobs; Why HUB is three cards; the partners are their logos and
 * systems. The mission quote, the story aside, the three values cards and the
 * partner paragraphs are gone from the page. Their Sanity fields are kept
 * (hidden in Studio), never read.
 *
 * Facts are the book's and CLAUDE.md's: since 1999, StreetPrint installed in
 * Canada since 1992, service life per system, certified applicators.
 *
 * Pure data: safe in server and client components, and importable by the sync
 * script under tsx.
 */

export interface AboutCard { title: string; desc: string }

export const ABOUT_HERO = {
  eyebrow: "Canadian-operated since 1999 · All 10 provinces",
  heading: "The people who made your city look like your city.",
  subheading: "HUB Surface Systems builds streets that carry a community’s identity as well as its traffic.",
};

export const ABOUT_STORY: string[] = [
  "HUB began with a simple belief: streets don’t have to be grey. We built the company around StreetPrint, the stamped asphalt system invented in Canada and installed here since 1992.",
  "Since 1999 we have added a system for nearly every surface a Canadian city looks after, each one installed to spec by certified applicators that HUB trains and authorizes.",
];

export const ABOUT_WHY_HUB: AboutCard[] = [
  {
    title: "Built for winter",
    desc: "StreetPrint and DuraTherm sit flush with the road, so a plow blade has nothing to catch. Asphalt-based systems flex through freeze-thaw.",
  },
  {
    title: "Service life, by system",
    desc: "StreetPrint 10–20 years, TrafficPatternsXD 10+, TrafficPatterns 8+, StreetBond 8+, PreMark 6–8.",
  },
  {
    title: "Safer crossings",
    desc: "High-contrast, retroreflective markings for crosswalks and bike lanes that support Vision Zero plans.",
  },
];

export const ABOUT_PARTNERS_INTRO =
  "HUB is an authorized distributor and applicator partner for the manufacturers behind its systems.";

/**
 * What Sanity's page-about held until 30 Sep 2026, word for word. A field
 * still exactly like this has not been touched in Studio, so the page serves
 * the copy above instead (the shim in app/about/page.tsx, the same arrangement
 * as /lunch-learn). Once `npm run sync:pages` has run, Sanity holds the copy
 * above and these are never matched again; an edit made in Studio always wins.
 */
export const ABOUT_SEED = {
  subheading:
    "Since 1999, HUB Surface Systems, a proudly Canadian company, has been connecting communities coast to coast with pavement technologies that carry identity as well as traffic.",
  story: [
    "HUB Surface Systems was founded on a simple belief: streets don't have to be grey. For decades, Canadian cities treated pavement as pure utility, functional and forgettable. We saw an opportunity to change that, and built the company around StreetPrint decorative stamped asphalt: the original stamped asphalt system, a Canadian invention installed here since 1992.",
    "Since 1999 we have grown the portfolio to address every surface challenge a Canadian municipality might face: high-traffic transit corridors in York Region and London, decorative community crosswalks at UBC, Indigenous recognition artwork in Sechelt, Vancouver and Burnaby.",
    "Today, HUB operates from two regional offices (East in Milton, Ontario, and West in Ladysmith, British Columbia), backed by a network of certified applicators trained and authorized by HUB to install each system to spec. That credentialed installer program is what turns a quality product into a quality outcome.",
  ],
  whyHubTitles: [
    "Flexibility vs concrete",
    "Vision Zero aligned",
    "High-visibility by design",
    "Service life, by system",
    "Built for winter maintenance",
  ],
  partnersIntro:
    "HUB is an authorized distributor and applicator partner for the manufacturers behind our core product systems, giving clients access to the broadest decorative pavement portfolio in Canada, with direct manufacturer technical support and specification backup.",
};
