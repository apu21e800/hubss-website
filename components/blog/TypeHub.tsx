import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import JsonLd from "@/components/ui/JsonLd";
import BlogCard, { StoryLead, pickLead } from "@/components/blog/BlogCard";
import LunchLearnTile from "@/components/blog/LunchLearnTile";
import RuleLabel from "@/components/blog/RuleLabel";
import { getAllPosts } from "@/lib/blog";
import { INSIGHTS_SECTIONS, sectionFor, type InsightsSection } from "@/lib/field-notes-taxonomy";

/**
 * An Insights section page: /blog/projects, /blog/guides, /blog/articles.
 *
 * WHY THESE PAGES EXIST: a library behind one /blog index gives search
 * engines exactly one page to rank for every content shape at once. A
 * specifier searching "decorative crosswalk case study" and a homeowner
 * searching "stamped asphalt driveway guide" want different pages, and the
 * filtered grid's state lives in a query string crawlers do not index. Each
 * section is a real URL with its own H1, description, and
 * CollectionPage/ItemList schema listing every post in it.
 *
 * 28 Sep 2026: five type hubs became three sections (lib/field-notes-taxonomy.ts),
 * and the page moved onto the same paper as /blog, so opening a section no
 * longer feels like leaving Insights (QA rest#23). The row of keyword pills
 * under the heading is gone (rest#10): they looked like filters and did
 * nothing, and on a phone they filled the first screen. The keywords still go
 * to search engines, in the CollectionPage's `about`.
 *
 * 30 Sep 2026 (Vern: "editorial, blogs should follow suit"): laid out like
 * /blog. The section's one line (its blurb) under the title instead of the
 * paragraph (its promise, kept in the taxonomy); the sections as tabs on a
 * hairline; the lead story at editorial size beside its headline, where it
 * was a dark photograph with the type over it; then the editorial cards.
 */
export default async function TypeHub({ section }: { section: InsightsSection }) {
  const all = await getAllPosts();
  const inSection = (key: string) => all.filter((p) => sectionFor(p.category).key === key);
  const posts = inSection(section.key);
  const others = INSIGHTS_SECTIONS.filter((s) => s.key !== section.key && inSection(s.key).length > 0);
  const hubUrl = `https://hubss.com/blog/${section.slug}`;

  // The subjects this collection covers, for schema `about` only.
  const lanes = [...new Set(posts.flatMap((p) => p.keywords))].slice(0, 10);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${hubUrl}#collection`,
    name: `${section.plural} · HUB Surface Systems Insights`,
    description: section.blurb,
    url: hubUrl,
    inLanguage: "en-CA",
    isPartOf: { "@type": "Blog", "@id": "https://hubss.com/blog#blog", name: "HUB Surface Systems Insights" },
    about: lanes.map((l) => ({ "@type": "Thing", name: l })),
    publisher: { "@id": "https://hubss.com/#organization" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://hubss.com/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Insights", item: "https://hubss.com/blog" },
      { "@type": "ListItem", position: 3, name: section.plural, item: hubUrl },
    ],
  };

  const lead = pickLead(posts);
  const rest = posts.filter((p) => p.slug !== lead?.slug);

  // The same row of sections /blog filters by, as links: every section is one
  // click from every other, for readers and for crawlers.
  const tabs = [
    { key: "all", label: "All", href: "/blog", count: all.length },
    ...INSIGHTS_SECTIONS.map((s) => ({ key: s.key, label: s.plural, href: `/blog/${s.slug}`, count: inSection(s.key).length })),
  ].filter((t) => t.count > 0);

  return (
    <main data-surface="paper" className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-10">
        <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
          <Link href="/blog" className="inline-flex items-center transition-colors hover:text-[var(--accent-text)]" style={{ color: "var(--accent-text-lg)", minHeight: 44 }}>
            Insights
          </Link>
          <span aria-hidden="true" style={{ color: "var(--ink-30)" }}>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{section.plural}</span>
        </nav>

        {/* The standard landing H1 (48px at 1440) on the standard container
            (lg:px-8), as /blog and the other landing pages (QA D11, 30 Sep
            2026, re-applied 2 Oct 2026 on the editorial layout). */}
        <header className="mb-8 grid gap-y-3 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <h1
            className="font-display font-black lg:col-span-7"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
            }}
          >
            {section.plural}
          </h1>
          <p className="text-base leading-relaxed lg:col-span-5 lg:pb-1.5" style={{ color: "var(--text-secondary)", maxWidth: "44ch" }}>
            {section.blurb}
          </p>
        </header>

        {/* The same sections /blog filters by, as links on one hairline:
            every section is one click from every other, for readers and for
            crawlers. The brand gradient sits under the one you are in. */}
        <nav aria-label="Insights sections" className="flex items-end gap-6 overflow-x-auto scrollbar-hide" style={{ borderBottom: "1px solid var(--ink-10)" }}>
          {tabs.map((t) => {
            const active = t.key === section.key;
            return (
              <Link
                key={t.key}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className="relative -mb-px inline-flex min-h-[48px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap text-[15px] transition-colors hover:text-[var(--text-primary)]"
                style={{ color: active ? "var(--text-primary)" : "var(--text-muted)", fontWeight: active ? 700 : 600 }}
              >
                {t.label}
                {/* From sm up, as on /blog: on a phone the four fit without them. */}
                <span className="hidden text-[11px] font-semibold tabular-nums sm:inline" style={{ color: "var(--text-muted)" }}>
                  {t.count}
                </span>
                {active && (
                  <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-[2px] rounded-full" style={{ background: "var(--gradient-brand)" }} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* The lead story: the newest in the section with a photograph big
          enough to carry it, beside its headline and deck. */}
      {lead && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <StoryLead post={lead} />
        </div>
      )}

      {rest.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <RuleLabel as="h2" className="mb-8">
            {`More ${section.plural.toLowerCase()}`}
          </RuleLabel>
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
            <LunchLearnTile count={rest.length} />
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <p style={{ color: "var(--text-secondary)" }}>Nothing filed under {section.plural} yet.</p>
        </div>
      )}

      {/* The other sections, for the reader who reached the end of this one:
          a name and its line on a hairline, no boxes. */}
      {others.length > 0 && (
        <div style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <RuleLabel className="mb-2">Also in Insights</RuleLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 lg:gap-x-12">
              {others.map((s) => (
                <Link
                  key={s.key}
                  href={`/blog/${s.slug}`}
                  className="group flex items-center justify-between gap-6 py-5"
                  style={{ borderBottom: "1px solid var(--ink-10)" }}
                >
                  <span className="min-w-0">
                    <span
                      className="font-display block text-[22px] font-bold transition-colors group-hover:text-[var(--accent-text)]"
                      style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                    >
                      {s.plural}
                    </span>
                    <span className="mt-1 block text-[14px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                      {s.blurb}
                    </span>
                  </span>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-text)" viewBox="0 0 24 24" className="flex-shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <LunchLearn compact from="insights" />
      <Footer />
    </main>
  );
}
