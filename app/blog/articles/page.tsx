import type { Metadata } from "next";
import TypeHub from "@/components/blog/TypeHub";
import { SECTION_BY_KEY } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

// Static route: takes precedence over /blog/[slug], which only ever generates
// real post slugs (see its generateStaticParams). Lists the stored "Blog"
// type; /blog/posts, its address until 28 Sep 2026, redirects here
// (next.config.ts).
const SECTION = SECTION_BY_KEY.articles;

export const metadata: Metadata = buildMetadata({
  title: "Articles · Decorative Pavement Industry Insight",
  description:
    "Shorter reads on where decorative pavement is heading in Canada: material context, industry shifts and the thinking behind HUB's systems.",
  slug: "blog/articles",
});

export default function Page() {
  return <TypeHub section={SECTION} />;
}
