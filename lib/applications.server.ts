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
 * seoDescription, and the hero photo and gallery (with imageUrl and the /public
 * folders as the fallback). relatedProducts comes from lib/applications.ts only.
 */
import { applications, type Application } from "@/lib/applications";
import { blocksToPlainText } from "@/lib/portable-text";
import { cmsText } from "@/lib/cms-merge";
import { toPhoto, toPhotos, type Photo, type SanityPhotoProjected } from "@/lib/photos";
import {
  getAllSanityApplications,
  getApplicationBySlug,
} from "@/lib/sanity.queries";
import type { SanityApplication, SanityBlock } from "@/types/sanity";

// The GROQ projection in sanity.queries.ts aliases slug.current to a string,
// so at runtime sanity.slug is a string even though SanityApplication types it as SanitySlug.
// heroImage and gallery arrive projected to URLs and alt text (lib/photos.ts).
type SanityAppProjected = Omit<SanityApplication, "slug" | "heroImage" | "gallery"> & {
  slug: string;
  heroImage?: SanityPhotoProjected | null;
  gallery?: SanityPhotoProjected[] | null;
};

export type MergedApplication = Application & {
  /** The Sanity description as rich text, when Sanity has one. `description`
   *  stays plain text for JSON-LD and meta tags; the page renders these blocks. */
  descriptionBlocks?: SanityBlock[];
  /** The hero photo from Sanity, when it has one. Else the page uses imageUrl. */
  heroPhoto?: Photo;
  /** The gallery from Sanity, when it has any photos. Else the page reads the /public folder. */
  galleryPhotos?: Photo[];
};

function merge(code: Application, sanityApp: SanityAppProjected | null | undefined): MergedApplication {
  if (!sanityApp) return code;
  const sanityDescription = blocksToPlainText(sanityApp.description);
  const sanityGallery = toPhotos(sanityApp.gallery, `${code.name} surface systems by HUB, Canadian installation`);
  return {
    ...code,
    name: cmsText(sanityApp.name, code.name),
    shortDesc: cmsText(sanityApp.shortDesc, code.shortDesc),
    description: cmsText(sanityDescription, code.description),
    descriptionBlocks: sanityDescription.trim() ? sanityApp.description : undefined,
    heroPhoto: toPhoto(sanityApp.heroImage, code.name) ?? undefined,
    galleryPhotos: sanityGallery.length ? sanityGallery : undefined,
    seoTitle: cmsText(sanityApp.seo?.title, code.seoTitle),
    seoDescription: cmsText(sanityApp.seo?.description, code.seoDescription),
  };
}

/** Fetch one application, merging Sanity values over the lib baseline. */
export async function getMergedApplication(slug: string): Promise<MergedApplication | undefined> {
  const libApp = applications.find((a) => a.slug === slug);
  if (!libApp) return undefined;
  const sanityApp = (await getApplicationBySlug(slug)) as SanityAppProjected | null;
  return merge(libApp, sanityApp);
}

/** Fetch all applications, merging Sanity values over the lib baseline. */
export async function getMergedApplications(): Promise<MergedApplication[]> {
  const sanityList = (await getAllSanityApplications()) as unknown as SanityAppProjected[];
  const bySlug = new Map<string, SanityAppProjected>(sanityList.map((s) => [s.slug, s]));
  return applications.map((libApp) => merge(libApp, bySlug.get(libApp.slug)));
}
