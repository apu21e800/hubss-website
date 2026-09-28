import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { SECTION_BY_KEY } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route: takes precedence over /blog/[slug], which only ever generates
// real post slugs (see its generateStaticParams). Lists the Case Study and
// Project Profile types (lib/field-notes-taxonomy.ts); /blog/case-studies,
// /blog/project-profiles and /projects redirect here (next.config.ts).
const SECTION = SECTION_BY_KEY.projects;

export const metadata: Metadata = buildMetadata({
  title: "Projects · Decorative Pavement Installations Across Canada",
  description:
    "HUB Surface Systems installations written up: decorative crosswalks, transit lanes, plazas, pathways and branded surfaces, with the system used on each. The case studies add the brief, the specification and the installation.",
  slug: "blog/projects",
});

export default function Page() {
  return <TypeHub section={SECTION} />;
}
