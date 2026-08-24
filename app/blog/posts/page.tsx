import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { TYPE_BY_LABEL } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route — takes precedence over /blog/[slug], which only ever
// generates real post slugs (see its generateStaticParams).
const TYPE = TYPE_BY_LABEL["Blog"];

export const metadata: Metadata = buildMetadata({
  title: "Field Notes Posts — Decorative Pavement Industry Insight",
  description: "Shorter reads on where decorative pavement is heading in Canada: material context, industry shifts, and the thinking behind the systems HUB specifies.",
  slug: "blog/posts",
});

export default function Page() {
  return <TypeHub type={TYPE} />;
}
