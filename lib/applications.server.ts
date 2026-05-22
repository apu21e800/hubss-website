/**
 * Server-only merge layer for application content.
 *
 * Reads from Sanity (via lib/sanity.queries) and falls back to the static
 * lib/applications.ts baseline on a per-field basis. The merged result
 * matches the existing Application shape, so callers do not need to know
 * whether the data came from Sanity or the static lib.
 *
 * Fields merged from Sanity (when present): name, shortDesc, description,
 * seoTitle, seoDescription. Image/gallery and relatedProducts continue to
 * come from the static lib in phase 2.
 */
import { applications, type Application } from "@/lib/applications";
import { blocksToPlainText } from "@/lib/portable-text";
import {
  getAllSanityApplications,
  getApplicationBySlug,
} from "@/lib/sanity.queries";
import type { SanityApplication } from "@/types/sanity";

// The GROQ projection in sanity.queries.ts aliases slug.current to a string,
// so at runtime sanity.slug is a string even though SanityApplication types it as SanitySlug.
type SanityAppProjected = Omit<SanityApplication, "slug"> & { slug: string };

function merge(libApp: Application, sanityApp: SanityAppProjected | null | undefined): Application {
  if (!sanityApp) return libApp;
  const sanityDescription = blocksToPlainText(sanityApp.description);
  return {
    ...libApp,
    name: sanityApp.name?.trim() || libApp.name,
    shortDesc: sanityApp.shortDesc?.trim() || libApp.shortDesc,
    description: sanityDescription || libApp.description,
    seoTitle: sanityApp.seo?.title || libApp.seoTitle,
    seoDescription: sanityApp.seo?.description || libApp.seoDescription,
  };
}

/** Fetch one application, merging Sanity values over the lib baseline. */
export async function getMergedApplication(slug: string): Promise<Application | undefined> {
  const libApp = applications.find((a) => a.slug === slug);
  if (!libApp) return undefined;
  const sanityApp = (await getApplicationBySlug(slug).catch(() => null)) as SanityAppProjected | null;
  return merge(libApp, sanityApp);
}

/** Fetch all applications, merging Sanity values over the lib baseline. */
export async function getMergedApplications(): Promise<Application[]> {
  const sanityList = (await getAllSanityApplications().catch(() => [])) as SanityAppProjected[];
  const bySlug = new Map<string, SanityAppProjected>(sanityList.map((s) => [s.slug, s]));
  return applications.map((libApp) => merge(libApp, bySlug.get(libApp.slug)));
}
