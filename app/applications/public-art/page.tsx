/**
 * /applications/public-art renders the shared application template, like the
 * other nineteen application pages.
 *
 * Until 28 Sep 2026 this route was a hand-built page outside the template
 * (QA pa#5): its hero was a plain brick street repeated as the first gallery
 * photo, it ignored the Idea Book spread and Studio, used its own labels and
 * button styles, and listed "featured projects" with no photos or links, one
 * of them with no record anywhere in the repo. The old page is in git history
 * (commit 08d4b65 and earlier).
 *
 * The folder stays because Next.js routes a static folder before [slug]
 * (DEDICATED_PAGES in ../[slug]/page.tsx keeps [slug] from generating the same
 * path twice); it hands the slug to the template.
 */
import type { Metadata } from "next";
import ApplicationPage, { generateMetadata as templateMetadata } from "../[slug]/page";

export const revalidate = 3600;

const params = Promise.resolve({ slug: "public-art" });

export async function generateMetadata(): Promise<Metadata> {
  return templateMetadata({ params });
}

export default function PublicArtPage() {
  return <ApplicationPage params={params} />;
}
