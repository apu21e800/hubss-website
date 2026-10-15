/**
 * The dates HUB's readers plan around (15 Oct 2026).
 *
 * Vern asked for posts that capture attention and a pipeline that stays full.
 * The research behind this (15 Oct 2026): councils, newsrooms and community
 * pages look for seasonal stories, and local news covers unveilings and
 * anniversaries with named partners (Kitchener's veterans crosswalk, November
 * 2025). Two streams use these dates:
 *
 *  - The blog planner (lib/insights-planner.ts): from 14 to 70 days ahead it
 *    proposes one article per moment that has none, at priority 1, so the
 *    Tuesday and Thursday drafter writes it in time to be read and published.
 *  - The weekly library post (lib/social-library.ts): in the week before a
 *    moment with a `libraryJob`, that documented job takes the week's turn.
 *
 * Neutral by design: a moment is a reason to be useful (visibility as the
 * evenings darken, what lasts through a winter, how to write the tender), not
 * a slogan. Community and memorial work is described in the partner's own
 * words (the drafter's ATTENTION rules, lib/field-note-drafter.ts).
 */

export type When = { month: number; day: number } | { month: number; weekday: number; nth: number };

export interface Moment {
  id: string;
  /** As it reads in a sentence: "Remembrance Day", "the clocks going back". */
  name: string;
  /** Every year: a fixed date, or the nth weekday of a month (weekday 0 is Sunday). */
  when: When;
  /** What a reader looks for then, and HUB's useful angle, in a line. */
  angle: string;
  /** Product and application slugs an article for it would draw on. */
  systems: string[];
  applications: string[];
  /** A documented job (lib/map-projects.ts id) the weekly library post features in the week before. */
  libraryJob?: string;
}

export const MOMENTS: readonly Moment[] = [
  {
    id: "clocks-back", name: "the clocks going back", when: { month: 11, weekday: 0, nth: 1 },
    angle: "Evenings get dark early and pedestrians are harder to see: what makes a crossing easy to see, from the published evidence and the Product Book.",
    systems: ["premark", "traffic-patterns"], applications: ["crosswalks", "pedestrian-safety"],
  },
  {
    id: "remembrance-day", name: "Remembrance Day", when: { month: 11, day: 11 },
    angle: "Memorial and commemorative crosswalks: working with a Legion and the city, and a material that outlasts paint on a route people use every day.",
    systems: ["traffic-patterns"], applications: ["community-branding", "crosswalks"], libraryJob: "kitchener-veterans",
  },
  {
    id: "plow-season", name: "the start of plow season", when: { month: 12, day: 1 },
    angle: "What a marking needs to come through plows, salt and freeze-thaw, shown by the Product Book's then-and-now photographs.",
    systems: ["traffic-patterns-xd", "premark"], applications: ["commercial-spaces", "crosswalks"],
  },
  {
    id: "budget-season", name: "municipal budget season", when: { month: 1, day: 15 },
    angle: "Repainting against a marking that lasts: what to weigh before the capital budget is set, from the Product Book's service life for each system.",
    systems: ["premark", "mmax", "traffic-patterns"], applications: ["crosswalks", "bus-lanes"],
  },
  {
    id: "tender-season", name: "tender season", when: { month: 2, day: 15 },
    angle: "Writing the specification for decorative or coloured pavement: a checklist for the tender, from the Product Book.",
    systems: ["traffic-patterns-xd", "streetprint", "mmax"], applications: ["crosswalks", "bus-lanes"],
  },
  {
    id: "june-crosswalk-booking", name: "spring booking for June community crosswalks", when: { month: 4, day: 15 },
    angle: "Community and cultural crosswalks installed for June (National Indigenous Peoples Day, Pride): approvals, lead times, materials and upkeep, in neutral terms.",
    systems: ["decomark", "traffic-patterns"], applications: ["community-branding", "public-art"],
  },
  {
    id: "earth-day", name: "Earth Day", when: { month: 4, day: 22 },
    angle: "Cooler surfaces for parks, playgrounds and paths: what the published studies of solar-reflective coatings show, with their limits.",
    systems: ["streetbondsr"], applications: ["playgrounds", "public-spaces"],
  },
  {
    id: "indigenous-peoples-day", name: "National Indigenous Peoples Day", when: { month: 6, day: 21 },
    angle: "Designs made with First Nations partners, described in their own words, and how they are looked after.",
    systems: ["decomark", "traffic-patterns"], applications: ["community-branding", "public-art"], libraryJob: "ubc-musqueam",
  },
  {
    id: "back-to-school", name: "back to school", when: { month: 9, day: 2 },
    angle: "School zones and school grounds: markings children and drivers can read, from the Product Book.",
    systems: ["premark", "traffic-patterns"], applications: ["pedestrian-safety", "playgrounds"], libraryJob: "victoria-high-school",
  },
  {
    id: "truth-and-reconciliation", name: "the National Day for Truth and Reconciliation", when: { month: 9, day: 30 },
    angle: "Designs made with First Nations partners, described in their own words, and how they are looked after.",
    systems: ["decomark"], applications: ["community-branding", "public-art"],
  },
];

const DAY = 86_400_000;

/** The moment's date in a given year, at 00:00 UTC. */
export function dateIn(when: When, year: number): Date {
  if ("day" in when) return new Date(Date.UTC(year, when.month - 1, when.day));
  const first = new Date(Date.UTC(year, when.month - 1, 1));
  const offset = (when.weekday - first.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, when.month - 1, 1 + offset + (when.nth - 1) * 7));
}

/** The moment's next date on or after `now`'s day (UTC). */
export function nextDate(m: Moment, now: Date): Date {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const thisYear = dateIn(m.when, now.getUTCFullYear());
  return thisYear.getTime() >= today ? thisYear : dateIn(m.when, now.getUTCFullYear() + 1);
}

/** Whole days from `now`'s day to the moment's next date. */
export const daysUntil = (m: Moment, now: Date) =>
  Math.round((nextDate(m, now).getTime() - Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) / DAY);

/** Moments whose next date is `from` to `to` days away, soonest first. */
export function momentsWithin(now: Date, from: number, to: number, moments: readonly Moment[] = MOMENTS): Moment[] {
  return moments
    .map((m) => ({ m, d: daysUntil(m, now) }))
    .filter(({ d }) => d >= from && d <= to)
    .sort((a, b) => a.d - b.d)
    .map(({ m }) => m);
}

/** "11 November 2026". */
export const longDate = (d: Date) =>
  d.toLocaleDateString("en-CA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The line a plan item for a moment carries in its brief. It begins the same
 * way for every year's date, so the planner can tell the moment already has
 * an article in the plan (momentPlanned).
 */
export function momentLine(m: Moment, now: Date): string {
  const date = nextDate(m, now);
  const by = new Date(date.getTime() - 7 * DAY);
  return `${momentKey(m, date)} ${m.angle} Publish it by ${longDate(by)}.`;
}

/** How a moment's line begins; factsBlock files these lines apart, as a planning note that supports no statement. */
export const TIMELY = "Timely: for ";

export const momentKey = (m: Moment, date: Date) => `${TIMELY}${m.name}, ${longDate(date)}.`;

/** True when a brief already carries this moment's line for its next date. */
export const momentPlanned = (m: Moment, now: Date, briefs: readonly (string | undefined)[]) =>
  briefs.some((b) => !!b && b.includes(momentKey(m, nextDate(m, now))));
