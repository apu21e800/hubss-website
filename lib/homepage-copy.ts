/**
 * The homepage's section copy: the three audience cards under the hero and
 * the eyebrow, heading and intro of each section below. Editable in Studio
 * (Website Pages → Homepage → Homepage sections) since 7 Oct 2026; until then
 * every line was typed into its component.
 *
 * These are the words the site printed on 7 Oct 2026, word for word. They are
 * the fallback on the site-wide rule (lib/cms-merge.ts: a blank Studio field
 * shows the code's), and what `npm run sync:pages` puts into Studio's blank
 * fields so Doug starts from what's live. The sync never overwrites a field
 * Studio already has: once he edits a line, Studio's line is the one.
 *
 * A heading is two parts, `heading` and `headingAccent` (the second phrase:
 * the gradient one on Applications, the one that moves to its own line on a
 * phone elsewhere). They travel together: when Studio has a heading, Studio's
 * accent is used as it is, even blank, so a new heading never gets the old
 * accent glued to it.
 *
 * Pure data: safe in server and client components.
 */

import { stegaClean } from "@sanity/client/stega";

export interface SectionCopy {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  intro: string;
}

export interface AudienceCard {
  label: string;
  desc: string;
}

export interface HomepageCopy {
  /** Under the hero, left to right. Their links stay in the code (components/sections/PersonaEntryPoints.tsx). */
  audiences: AudienceCard[];
  systems: SectionCopy;
  applications: SectionCopy;
  /** The one-row Product Portfolio Book callout: the line and the line under it (the book's name stays lib/catalogue.ts). */
  ideaBook: Pick<SectionCopy, "heading" | "intro">;
  insights: SectionCopy;
  onTheGround: SectionCopy;
}

export const HOMEPAGE_COPY: HomepageCopy = {
  audiences: [
    {
      label: "Municipalities",
      desc: "Crosswalks, transit corridors and plazas: built for Vision Zero programs, accessible, installed by certified crews coast to coast.",
    },
    {
      label: "Designers & specifiers",
      desc: "Stamped patterns, PMS-matched colour and snowplow-safe systems, with spec sheets and spec language for the tender.",
    },
    {
      label: "Contractors",
      desc: "HUB trains and certifies its installers across Canada.",
    },
  ],
  systems: {
    eyebrow: "The systems",
    // Ten, as the Product Portfolio Book counts them (Vern, 16 Oct 2026:
    // "yes 10 systems"): the six cards and the four named under them. The
    // second phrase is Doug's (17 Oct 2026: "change to 'Ten systems endless
    // job types' or something to that effect"), in the site's own word for
    // the same thing (Vern, the same day: "endless applications I think");
    // Studio holds the live line (scripts/studio-cleanup-2026-10-17.ts),
    // this is the fallback.
    heading: "Ten systems,",
    headingAccent: "endless applications.",
    intro:
      "Stamped asphalt, preformed thermoplastic and coatings, chosen by what the surface has to take.",
  },
  applications: {
    eyebrow: "Applications",
    heading: "Every surface,",
    headingAccent: "a statement.",
    intro:
      "Crosswalks, bike lanes, civic art, driveways: wherever people move, gather, or stop, the surface underneath is doing work.",
  },
  ideaBook: {
    heading: "Every system and every application, in one book.",
    intro: "Read it here, save it to your phone, or have the printed copy mailed.",
  },
  insights: {
    eyebrow: "Projects",
    heading: "How it goes in",
    headingAccent: "and how it holds up.",
    intro: "Installation guides, project write-ups, and the specification detail behind them.",
  },
  onTheGround: {
    eyebrow: "On the ground",
    heading: "Follow the work.",
    headingAccent: "",
    intro: "Projects across Canada, documented as they happen.",
  },
};

type Loose<T> = { [K in keyof T]?: T[K] | null };

/** The homepage sections as Studio holds them (page-homepage.homepageSections). */
export interface SanityHomepageSections {
  audiences?: (Loose<AudienceCard> | null)[] | null;
  systems?: Loose<SectionCopy> | null;
  applications?: Loose<SectionCopy> | null;
  ideaBook?: Loose<Pick<SectionCopy, "heading" | "intro">> | null;
  insights?: Loose<SectionCopy> | null;
  onTheGround?: Loose<SectionCopy> | null;
}

const has = (s: string | null | undefined): s is string => typeof s === "string" && stegaClean(s).trim() !== "";

/** Studio's text when it has any, else the code's. */
const txt = (s: string | null | undefined, code: string): string => (has(s) ? s.trim() : code);

function section(sanity: Loose<SectionCopy> | null | undefined, code: SectionCopy): SectionCopy {
  const studioHeading = has(sanity?.heading);
  return {
    eyebrow: txt(sanity?.eyebrow, code.eyebrow),
    heading: txt(sanity?.heading, code.heading),
    headingAccent: studioHeading ? (sanity?.headingAccent ?? "").trim() : code.headingAccent,
    intro: txt(sanity?.intro, code.intro),
  };
}

/** Studio over the code, field by field (see the header for the heading rule). */
export function mergeHomepageCopy(sanity: SanityHomepageSections | null | undefined): HomepageCopy {
  const c = HOMEPAGE_COPY;
  return {
    audiences: c.audiences.map((card, i) => {
      const s = sanity?.audiences?.[i];
      return { label: txt(s?.label, card.label), desc: txt(s?.desc, card.desc) };
    }),
    systems: section(sanity?.systems, c.systems),
    applications: section(sanity?.applications, c.applications),
    ideaBook: {
      heading: txt(sanity?.ideaBook?.heading, c.ideaBook.heading),
      intro: txt(sanity?.ideaBook?.intro, c.ideaBook.intro),
    },
    insights: section(sanity?.insights, c.insights),
    onTheGround: section(sanity?.onTheGround, c.onTheGround),
  };
}
