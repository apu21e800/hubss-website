import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { TYPE_BY_LABEL } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route — takes precedence over /blog/[slug], which only ever
// generates real post slugs (see its generateStaticParams).
const TYPE = TYPE_BY_LABEL["White Paper"];

export const metadata: Metadata = buildMetadata({
  title: "White Papers — Technical Guides for Public Works & Engineering",
  description: "Long-form technical documents on resilient transit corridors, material systems, installation standards, and surface-program cost modelling in Canadian conditions.",
  slug: "blog/white-papers",
});

export default function Page() {
  return <TypeHub type={TYPE} />;
}
