/**
 * Server-only merge layer for application content.
 *
 * Used by the homepage, /applications and /applications/[slug]. Reads Sanity
 * (via lib/sanity.queries) and falls back to the lib/applications.ts baseline
 * field by field, with the rule in lib/cms-merge.ts: a blank Sanity value falls
 * back to the code. The merged result has the Application shape, so callers do
 * not need to know where a value came from.
 *
 * Fields that can come from Sanity: name, shortDesc, description, seoTitle,
 * seoDescription. Images, gallery and relatedProducts come from
 * lib/applications.ts only.
 */
import { applications, type Application } from "@/lib/applications";
import { blocksToPlainText } from "@/lib/portable-text";
import { cmsText } from "@/lib/cms-merge";
import {
  getAllSanityApplications,
  getApplicationBySlug,
} from "@/lib/sanity.queries";
import type { SanityApplication } from "@/types/sanity";

// The GROQ projection in sanity.queries.ts aliases slug.current to a string,
// so at runtime sanity.slug is a string even though SanityApplication types it as SanitySlug.
type SanityAppProjected = Omit<SanityApplication, "slug"> & { slug: string };

function merge(code: Application, sanityApp: SanityAppProjected | null | undefined): Application {
  if (!sanityApp) return code;
  return {
    ...code,
    name: cmsText(sanityApp.name, code.name),
    shortDesc: cmsText(sanityApp.shortDesc, code.shortDesc),
    description: cmsText(blocksToPlainText(sanityApp.description), code.description),
    seoTitle: cmsText(sanityApp.seo?.title, code.seoTitle),
    seoDescription: cmsText(sanityApp.seo?.description, code.seoDescription),
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
