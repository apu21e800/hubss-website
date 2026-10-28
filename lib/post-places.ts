import { mapProjects } from "./map-projects";
import { provinceName } from "./provinces";

/**
 * Where each written-up map job is, by its post's slug: "Kitchener, Ontario".
 * The Projects cards print it beside the section where the date used to be
 * (27 Oct 2026: a project reads by its place). A post that covers more than
 * one place gets no place, because one town would be wrong for the others:
 * a post that two map jobs name (White Rock and Langley), and the posts
 * below, which one map job names but whose words cover other towns too.
 */
const MANY_PLACES = new Set([
  // Found 28 Oct 2026 by reading each post's text for the map's other towns
  // (the independent review of the Projects page): add a post here when it
  // is written about more than one place.
  "decorative-paving-solutions", // Victoria and Kelowna
  "laneway-project", // Vancouver and Toronto
  "safety-durability-transit-stations", // Waterloo and York Region
  "extending-transit-lane-lifespan", // Toronto, London, York Region, Richmond
  "multimodal-connectivity-york-region", // York Region, London, Waterloo and others
]);

const count = new Map<string, number>();
for (const p of mapProjects) if (p.post) count.set(p.post, (count.get(p.post) ?? 0) + 1);

export const POST_PLACES: Record<string, string> = Object.fromEntries(
  mapProjects
    .filter((p) => p.post && count.get(p.post) === 1 && !MANY_PLACES.has(p.post))
    .map((p) => [p.post as string, `${p.city}, ${provinceName(p.province)}`]),
);
