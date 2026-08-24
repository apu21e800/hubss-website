import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { TYPE_BY_LABEL } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route — takes precedence over /blog/[slug], which only ever
// generates real post slugs (see its generateStaticParams).
const TYPE = TYPE_BY_LABEL["Case Study"];

export const metadata: Metadata = buildMetadata({
  title: "Pavement Case Studies — Canadian Municipal & Commercial Projects",
  description: "Documented decorative pavement projects across Canada: the brief, the specification, the installation, and how each surface has performed since. Written for specifiers.",
  slug: "blog/case-studies",
});

export default function Page() {
  return <TypeHub type={TYPE} />;
}
