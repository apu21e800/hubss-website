import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import BlogFilter from "@/components/blog/BlogFilter";
import JsonLd from "@/components/ui/JsonLd";
import { getAllPosts } from "@/lib/mdx";
import { FIELD_NOTE_TYPES } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Field Notes — Case Studies, Guides & Pavement White Papers",
  description:
    "Canadian decorative pavement documented: project case studies, specification guides, white papers, and field records on crosswalks, transit lanes, and stamped asphalt.",
  slug: "blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  // Build the product list from what's actually in the posts (sorted by frequency)
  const productCounts = new Map<string, number>();
  for (const post of posts) {
    for (const p of post.products) {
      productCounts.set(p, (productCounts.get(p) ?? 0) + 1);
    }
  }
  const allProducts = [...productCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  const typeCounts = FIELD_NOTE_TYPES.map((t) => ({
    ...t,
    count: posts.filter((p) => p.category === t.label).length,
  })).filter((t) => t.count > 0);

  /**
   * Library-level schema. The index declares itself a Blog with a named
   * publisher and the full subject list the library covers, so a crawler
   * reading one post can place it inside a body of work rather than treating
   * it as a loose page. The type hubs each carry their own CollectionPage.
   */
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://hubss.com/blog#blog",
    name: "HUB Surface Systems Field Notes",
    description:
      "Case studies, specification guides, project profiles, and white papers on decorative pavement, thermoplastic markings, and coloured coatings in Canada.",
    url: "https://hubss.com/blog",
    inLanguage: "en-CA",
    publisher: { "@id": "https://hubss.com/#organization" },
    about: [...new Set(posts.flatMap((p) => p.keywords))]
      .slice(0, 20)
      .map((k) => ({ "@type": "Thing", name: k })),
    hasPart: typeCounts.map((t) => ({
      "@type": "CollectionPage",
      "@id": `https://hubss.com/blog/${t.slug}#collection`,
      name: t.plural,
      url: `https://hubss.com/blog/${t.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Field Notes", item: "https://hubss.com/blog" },
    ],
  };

  return (
    <main className="min-h-screen" style={{ background: "#151515" }}>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* Header — deliberately compact. The library is 67 pieces deep and the
            job of this page is to get a reader into one of them, so the masthead
            gives up height to let the first row of cards reach the fold. */}
        <div className="mb-7">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2.5" style={{ color: "#f97316" }}>
            Field Notes
          </p>
          <h1
            className="font-black mb-3"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(1.85rem, 3.2vw, 2.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "20ch",
            }}
          >
            Field Notes from the Front Lines of Canadian Pavement
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)", maxWidth: "62ch" }}>
            {posts.length} documented pieces on decorative pavement in Canada — the projects,
            the specifications, and the lifecycle math behind them.
          </p>
        </div>

        {/* The five type hubs used to sit here as a row of big count tiles.
            Vernon, Aug 2026: "we just want to improve the filter system, those
            big buttons you made are weird" — and he was right: the tiles said
            exactly what the filter pills immediately below them already said,
            so the page spent its entire first screen repeating itself before
            showing a single article. The hubs are still real indexed pages
            (nav, type badges, sitemap, and a text link from the filter once a
            type is chosen); they just no longer shout from the top of /blog. */}

        {/* Filter + grid — wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<BlogSkeleton />}>
          <BlogFilter posts={posts} allProducts={allProducts} />
        </Suspense>
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}

function BlogSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-zinc-800" />
        ))}
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 rounded-lg bg-zinc-800" />
        <div className="h-10 w-52 rounded-lg bg-zinc-800" />
        <div className="h-10 w-44 rounded-lg bg-zinc-800" />
      </div>
      <div className="h-72 rounded-2xl bg-zinc-800 mt-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}
