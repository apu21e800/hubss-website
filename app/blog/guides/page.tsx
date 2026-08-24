import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { TYPE_BY_LABEL } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route — takes precedence over /blog/[slug], which only ever
// generates real post slugs (see its generateStaticParams).
const TYPE = TYPE_BY_LABEL["Guide"];

export const metadata: Metadata = buildMetadata({
  title: "Specification Guides — Choosing & Defending a Surface System",
  description: "Decision support for engineers, landscape architects, and procurement: comparisons, lifecycle cost math, spec language, and freeze-thaw failure modes to design around.",
  slug: "blog/guides",
});

export default function Page() {
  return <TypeHub type={TYPE} />;
}
