import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { TYPE_BY_LABEL } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route — takes precedence over /blog/[slug], which only ever
// generates real post slugs (see its generateStaticParams).
const TYPE = TYPE_BY_LABEL["Project Profile"];

export const metadata: Metadata = buildMetadata({
  title: "Project Profiles — Decorative Pavement Installations in Canada",
  description: "Field records of HUB Surface Systems installations coast to coast — decorative crosswalks, plazas, pathways, and branded surfaces, with the system used on each.",
  slug: "blog/project-profiles",
});

export default function Page() {
  return <TypeHub type={TYPE} />;
}
