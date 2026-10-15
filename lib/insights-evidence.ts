/**
 * Outside evidence the Insights drafter may cite (15 Oct 2026).
 *
 * Vern wanted articles that "capture real attention". The research behind
 * this (two research passes, 15 Oct 2026): B2B buyers trust research and data
 * above anything else a supplier publishes, and say so; AI answers (Google AI
 * Overviews, ChatGPT, Copilot) cite pages that state checkable facts; and the
 * honest version stands out because vendor posts stretch studies. So an
 * article may quote a published study, but only one listed here, as written,
 * with who did it, how big it was and its limits, and a link to the source.
 *
 * Every entry was read against its source on 15 Oct 2026. `limits` is part
 * of the fact: the drafter is told to give it in the same paragraph. Metric
 * first (the site writes for Canada), the source's own units in brackets.
 *
 * factsBlock (lib/field-note-facts.ts) adds the entries that share a system
 * or an application with the plan item; the planner (lib/insights-planner.ts)
 * sees their titles, so it can propose a guide on what the research says.
 * To add one: read the source, write the finding as it states it, the limits
 * as plainly, and tag only what it really measured.
 */

export interface Evidence {
  id: string;
  title: string;
  /** What the source found, with its figures, as it states them. */
  finding: string;
  /** Who did it, for whom, and how big it was. */
  who: string;
  /** What it can't show. Always given with the finding. */
  limits: string;
  strength: "strong" | "moderate" | "weak";
  source: { name: string; url: string };
  /** HUB systems (product slugs) and applications (application slugs) it bears on. */
  systems: string[];
  applications: string[];
}

export const EVIDENCE: readonly Evidence[] = [
  {
    id: "fhwa-crosswalk-visibility",
    title: "High-visibility crosswalks and pedestrian injury crashes",
    finding:
      "The US Federal Highway Administration lists crosswalk visibility enhancements among its Proven Safety Countermeasures: high-visibility crosswalks (bar pairs, continental or ladder markings) can reduce pedestrian injury crashes by up to 40 per cent. It recommends inlay or thermoplastic markings over paint or brick where markings need to stay highly reflective.",
    who: "US Federal Highway Administration (FHWA), Proven Safety Countermeasures.",
    limits:
      "The figure is for high-visibility markings (bar pairs, continental, ladder), not for decorative or patterned crosswalks: never apply it to a decorative design. US guidance.",
    strength: "strong",
    source: { name: "FHWA, Crosswalk Visibility Enhancements", url: "https://highways.dot.gov/safety/proven-safety-countermeasures/crosswalk-visibility-enhancements" },
    systems: ["premark", "traffic-patterns", "traffic-patterns-xd"],
    applications: ["crosswalks", "pedestrian-safety"],
  },
  {
    id: "sfmta-red-transit-lanes",
    title: "Red transit-only lanes in San Francisco",
    finding:
      "San Francisco evaluated red transit-only lanes on three downtown corridors (3rd Street, Geary Street and O'Farrell Street). On 3rd Street the red colour cut transit-lane violations by 48 to 55 per cent depending on the time of day (51 per cent on average). Collisions on the three corridors fell 16 per cent, from 120 in 2013 to 101 in 2015, and police-reported injury collisions fell 24 per cent while citywide injury collisions were unchanged. The ratio of transit travel time to traffic travel time fell on all three corridors.",
    who: "San Francisco Municipal Transportation Agency (SFMTA), Red Transit Lane Evaluation Report, 2017, for the California Traffic Control Devices Committee.",
    limits:
      "One city and three corridors, before and after, with no matched comparison corridors; violations were counted before and after only on 3rd Street. The lanes were red paint, so it speaks to coloured lanes, not to any one material.",
    strength: "moderate",
    source: { name: "SFMTA, Red Transit Lane Evaluation Report (2017)", url: "https://dot.ca.gov/-/media/dot-media/programs/safety-programs/documents/ctcdc/final-reports/2017-ctcdc-item-12-18-red-transit-lane-evaluation-report-sfmta-a11y.pdf" },
    systems: ["mmax"],
    applications: ["bus-lanes"],
  },
  {
    id: "bloomberg-asphalt-art",
    title: "Asphalt art and road safety",
    finding:
      "A before-and-after study of 17 asphalt art sites in five US states found the crash rate involving pedestrians or cyclists fell 50 per cent, injury crashes 37 per cent and all crashes 17 per cent (averages of each site's rates). Video at five intersections showed 25 per cent fewer conflicts between pedestrians and vehicles and, at crossings without signals, 27 per cent more drivers yielding to pedestrians right away.",
    who: "Asphalt Art Safety Study, commissioned by Bloomberg Philanthropies and prepared by Sam Schwartz, April 2022.",
    limits:
      "No comparison sites, and the authors say it can't show cause. Most sites had few crashes, one Atlanta site had 38 per cent of them, some after periods fell during the pandemic, and it isn't peer-reviewed. Bloomberg Philanthropies also funds asphalt art projects. Say this whenever the figures are used.",
    strength: "weak",
    source: { name: "Bloomberg Philanthropies Asphalt Art Safety Study (2022)", url: "https://www.samschwartz.com/s/Asphalt-Art-Safety-Study.pdf" },
    systems: ["decomark", "streetbond"],
    applications: ["public-art", "community-branding", "traffic-calming"],
  },
  {
    id: "phoenix-cool-pavement",
    title: "Cool pavement in Phoenix",
    finding:
      "In Phoenix's first-year study (2021), cool-pavement coating ran 5.8 to 6.7°C (10.5 to 12°F) cooler than ordinary asphalt at noon and in the afternoon, and night-time air at head height was 0.3°C (0.5°F) cooler. The heat a pedestrian felt at midday was 3.1°C (5.5°F) higher, from reflected sun, about the same as walking on a concrete sidewalk. Reflectivity fell from 33–38 per cent to 19–30 per cent over ten months; untreated asphalt is about 12 per cent.",
    who: "City of Phoenix Cool Pavement Program, studied by Arizona State University (2021; a 2024 follow-up measured surfaces up to 6.7°C (12°F) cooler).",
    limits:
      "One desert city and a different coating from HUB's. The pedestrian-heat finding cuts the other way: give it whenever the surface figures are used.",
    strength: "moderate",
    source: { name: "City of Phoenix, Cool Pavement Program", url: "https://www.phoenix.gov/administration/departments/streets/initiatives/pavement-maintenance/cool-pavement-program.html" },
    systems: ["streetbondsr"],
    applications: [],
  },
  {
    id: "pacoima-cool-pavement",
    title: "Solar-reflective coatings in Pacoima, Los Angeles",
    finding:
      "In Pacoima, Los Angeles, solar-reflective pavement coatings made by GAF covered about 65,000 square metres (more than 700,000 square feet) of streets, basketball courts, playgrounds and parking lots. A peer-reviewed study measured surfaces up to 5.6°C (10°F) cooler, and air up to 1.2°C (2.1°F) cooler on sunny days, 0.3°C (0.5°F) on summer nights and up to 1.9°C (3.5°F) during an extreme heat event.",
    who: "Altostratus Inc. (Haider Taha), published in IOP Environmental Research Communications; the project and results were announced by GAF and Climate Resolve, 2024.",
    limits:
      "GAF makes the coatings and announced the results. The source doesn't name the product, so never say it was StreetBond or StreetBondSR. One neighbourhood, in Los Angeles' climate.",
    strength: "moderate",
    source: { name: "GAF, peer-reviewed study of cool pavement coatings (2024)", url: "https://www.gaf.com/en-us/about-us/news-press-releases/2024/peer-reviewed-study-demonstrates-effectiveness-of-cool-pavement-coatings" },
    systems: ["streetbondsr", "streetbond"],
    applications: ["playgrounds", "public-spaces", "parking-lots"],
  },
];

/** The entries that bear on a plan item: any shared system or application. */
export function evidenceFor(productSlugs: readonly string[], applicationSlugs: readonly string[]): Evidence[] {
  const p = new Set(productSlugs);
  const a = new Set(applicationSlugs);
  return EVIDENCE.filter((e) => e.systems.some((s) => p.has(s)) || e.applications.some((s) => a.has(s)));
}

/** One entry as the drafter sees it in its FACTS. */
export function evidenceLines(e: Evidence): string {
  return [
    `### ${e.title} (evidence: ${e.strength})`,
    `Finding: ${e.finding}`,
    `Who: ${e.who}`,
    `Limits (give these with the finding): ${e.limits}`,
    `Source to link: ${e.source.name} ${e.source.url}`,
  ].join("\n");
}
