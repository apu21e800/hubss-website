import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { SECTION_BY_KEY } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route: takes precedence over /blog/[slug], which only ever generates
// real post slugs (see its generateStaticParams). Lists the Guide and White
// Paper types (lib/field-notes-taxonomy.ts); /blog/white-papers redirects here
// (next.config.ts).
const SECTION = SECTION_BY_KEY.guides;

export const metadata: Metadata = buildMetadata({
  title: "Specification Guides · Choosing & Defending a Surface System",
  description:
    "Decision support for engineers, landscape architects and procurement: comparisons, lifecycle cost math, spec language and the freeze-thaw failure modes to design around, with the long technical papers for public works teams.",
  slug: "blog/guides",
});

export default function Page() {
  return <TypeHub section={SECTION} />;
}
