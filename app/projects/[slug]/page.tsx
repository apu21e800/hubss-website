import { notFound, permanentRedirect } from "next/navigation";
import { projects } from "@/lib/projects";
import { retiredProjectHref } from "@/lib/field-notes-taxonomy";

/**
 * /projects/<slug>: retired 28 Sep 2026, when projects moved into Insights
 * (/blog/projects). Each of the pages lib/projects.ts used to build now sends
 * its visitor to the Insights write-up of the same job (RETIRED_PROJECT_PAGES
 * in lib/field-notes-taxonomy.ts). The pages had drifted from those posts:
 * wrong systems, a stand-in photo, figures no source supports.
 *
 * next.config.ts answers these addresses with a 308 at the edge; this page is
 * the fallback if that rule is ever removed, as app/projects/page.tsx is for
 * /projects. Keep the destinations the same.
 *
 * Rendered on request, never at build, and with no generateStaticParams:
 * nothing should reach it while the config rule stands, and a prerendered
 * redirect would count as a built page that answers 308 in
 * scripts/verify-site.mjs (check 2). Anything that isn't one of the projects
 * is a 404 (the config sends other old /projects addresses to /gallery first).
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (!projects.some((p) => p.slug === slug)) notFound();
  permanentRedirect(retiredProjectHref(slug));
}
