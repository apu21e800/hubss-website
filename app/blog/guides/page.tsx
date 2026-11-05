import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { SECTION_BY_KEY } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route: takes precedence over /blog/[slug], which only ever generates
// real post slugs (see its generateStaticParams). Lists the Guide, White
// Paper and Blog types (lib/field-notes-taxonomy.ts); /blog/white-papers,
// /blog/posts and /blog/articles redirect here (next.config.ts).
const SECTION = SECTION_BY_KEY.guides;

export const metadata: Metadata = buildMetadata({
  title: "Specification Guides · Choosing & Defending a Surface System",
  // Under 155 characters (4 Nov 2026): the 203-character line lost its end
  // in Google's snippet.
  description:
    "Guides for engineers, landscape architects and procurement: comparing systems, cost over the service life, spec language and freeze-thaw failure modes.",
  slug: "blog/guides",
});

export default function Page() {
  return <TypeHub section={SECTION} />;
}
