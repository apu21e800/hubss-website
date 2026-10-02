import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import BlogFilter from "@/components/blog/BlogFilter";
import BlogCard, { StoryLead, pickLead } from "@/components/blog/BlogCard";
import RuleLabel from "@/components/blog/RuleLabel";
import JsonLd from "@/components/ui/JsonLd";
import { getAllPosts } from "@/lib/blog";
import { INSIGHTS_SECTIONS } from "@/lib/field-notes-taxonomy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights · Projects, Guides & Articles on Canadian Pavement",
  description:
    "Canadian decorative pavement, documented: installations written up, specification guides and articles on crosswalks, transit lanes and stamped asphalt.",
  slug: "blog",
});

export default async function BlogPage() {
  const posts = await getAllPosts();

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

  const sections = INSIGHTS_SECTIONS.filter((s) => posts.some((p) => (s.types as string[]).includes(p.category)));

  // The front page: the lead story, then the next four newest. The library
  // below continues after them (BlogFilter's frontSlugs).
  const lead = pickLead(posts);
  const latest = posts.filter((p) => p.slug !== lead?.slug).slice(0, 4);
  const frontSlugs = [...(lead ? [lead.slug] : []), ...latest.map((p) => p.slug)];

  /**
   * Library-level schema. The index declares itself a Blog with a named
   * publisher and the full subject list the library covers, so a crawler
   * reading one post can place it inside a body of work rather than treating
   * it as a loose page. The section pages each carry their own CollectionPage.
   */
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://hubss.com/blog#blog",
    name: "HUB Surface Systems Insights",
    description:
      "Projects, specification guides and articles on decorative pavement, thermoplastic markings and coloured coatings in Canada.",
    url: "https://hubss.com/blog",
    inLanguage: "en-CA",
    publisher: { "@id": "https://hubss.com/#organization" },
    about: [...new Set(posts.flatMap((p) => p.keywords))]
      .slice(0, 20)
      .map((k) => ({ "@type": "Thing", name: k })),
    hasPart: sections.map((s) => ({
      "@type": "CollectionPage",
      "@id": `https://hubss.com/blog/${s.slug}#collection`,
      name: s.plural,
      url: `https://hubss.com/blog/${s.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Insights", item: "https://hubss.com/blog" },
    ],
  };

  return (
    <main data-surface="paper" className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Nav />

      {/* Insights reads as a magazine — paper all the way down to the Lunch &
          Learn band, which keeps the shell (Vern, 21 Sep). 30 Sep 2026: and
          now it is laid out like one. A masthead, a front page (the lead
          story at editorial size, then the next four), then the library. */}
      {/* The standard container (lg:px-8) and the standard landing H1, 48px at
          1440 (QA D11, 30 Sep 2026, re-applied 2 Oct 2026 on the editorial
          front page): this page sat at x=104 with a 44px H1 while About,
          Gallery and Contact sat at x=112 with 56px. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* Masthead: the title, and its one line beside it from lg. The
            "Insights" eyebrow over it went: the title already says it. */}
        <header className="mb-10 grid gap-y-4 sm:mb-12 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <h1
            className="font-display font-black text-balance lg:col-span-8"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              maxWidth: "24ch",
            }}
          >
            Insights from the front lines of Canadian pavement
          </h1>
          <p className="text-base leading-relaxed lg:col-span-4 lg:pb-1.5" style={{ color: "var(--text-secondary)", maxWidth: "44ch" }}>
            Decorative pavement in Canada, documented: the projects, the specifications
            and the lifecycle math behind them.
          </p>
        </header>

        {/* The five type hubs used to sit here as a row of big count tiles.
            Vernon, Aug 2026: "we just want to improve the filter system, those
            big buttons you made are weird" — and he was right: the tiles said
            exactly what the filter pills immediately below them already said,
            so the page spent its entire first screen repeating itself before
            showing a single article. The hubs are still real indexed pages
            (nav, type badges, sitemap, and a text link from the filter once a
            type is chosen); they just no longer shout from the top of /blog. */}

        {/* ── Front page. Server-rendered, so the lead photograph is in the
            first HTML and is the page's largest paint. */}
        {lead && (
          <section aria-label="Latest from Insights" className="mb-16 sm:mb-24">
            <StoryLead post={lead} />
            {latest.length > 0 && (
              <>
                <RuleLabel className="mt-12 mb-7 sm:mt-16">Latest</RuleLabel>
                <div className="grid grid-cols-1 gap-y-7 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
                  {latest.map((post) => (
                    <BlogCard key={post.slug} post={post} size="small" />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Filter + grid — wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<BlogSkeleton />}>
          <BlogFilter posts={posts} allProducts={allProducts} frontSlugs={frontSlugs} />
        </Suspense>
      </div>

      <LunchLearn compact from="insights" />
      <Footer />
    </main>
  );
}

function BlogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-32 rounded bg-[var(--ink-06)]" />
      <div className="mt-4 flex gap-6 pb-3" style={{ borderBottom: "1px solid var(--ink-10)" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 w-20 rounded bg-[var(--ink-06)]" />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/2] rounded-xl bg-[var(--ink-06)]" />
            <div className="mt-4 h-3 w-28 rounded bg-[var(--ink-06)]" />
            <div className="mt-3 h-5 w-4/5 rounded bg-[var(--ink-06)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
