import Link from "next/link";
import PhotoImage from "@/components/ui/PhotoImage";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import JsonLd from "@/components/ui/JsonLd";
import BlogCard from "@/components/blog/BlogCard";
import LunchLearnTile from "@/components/blog/LunchLearnTile";
import LoadMoreGrid from "@/components/blog/LoadMoreGrid";
import { getAllPosts } from "@/lib/blog";

/** Cards a section lists in full; past this, a "Load more" takes the rest. */
const SECTION_PAGE = 40;
import { INSIGHTS_SECTIONS, sectionFor, type InsightsSection } from "@/lib/field-notes-taxonomy";
import { clipExcerpt, focalObjectPosition } from "@/lib/blog-taxonomy";

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

  const [lead, ...rest] = posts;
  const leadFocus = lead ? focalObjectPosition(lead.featuredImageHotspot, lead.featuredImageWidth, lead.featuredImageHeight) : undefined;

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8">
        <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
          <Link href="/blog" className="inline-flex items-center transition-colors hover:text-[var(--accent-text)]" style={{ color: "var(--accent-text-lg)", minHeight: 44 }}>
            Insights
          </Link>
          <span aria-hidden="true" style={{ color: "var(--ink-30)" }}>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{section.plural}</span>
        </nav>

        {/* The standard landing H1 (48px at 1440) on the standard container,
            as /blog and the other landing pages (QA D11, 30 Sep 2026). */}
        <div className="max-w-3xl mb-7">
          <h1
            className="font-black mb-3"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {section.plural}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: "62ch" }}>
            {section.promise}
          </p>
        </div>

        <nav aria-label="Insights sections" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((t) => {
            const active = t.key === section.key;
            return (
              <Link
                key={t.key}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className="text-[13px] font-semibold px-3.5 rounded-full whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 transition-colors hover:border-orange-500/40"
                style={{
                  background: active ? "rgba(249,115,22,0.14)" : "var(--bg-card)",
                  color: active ? "var(--accent-text)" : "var(--text-body)",
                  border: "1px solid",
                  borderColor: active ? "rgba(249,115,22,0.38)" : "var(--ink-12)",
                  minHeight: 44,
                }}
              >
                {t.label}
                {/* From sm up, as on /blog: on a phone the four fit without them. */}
                <span
                  className="hidden sm:inline text-[11px] font-bold tabular-nums px-1.5 rounded-full"
                  style={{
                    background: active ? "rgba(249,115,22,0.18)" : "var(--ink-06)",
                    color: active ? "var(--accent-text)" : "var(--text-secondary)",
                  }}
                >
                  {t.count}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Lead article: the newest in the section, given editorial weight. A
          photograph with type over it, so it keeps the dark tokens. */}
      {lead && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <Link
            href={`/blog/${lead.slug}`}
            data-surface="dark"
            className="group relative block rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border-color)", minHeight: 340, background: "var(--bg-card)" }}
          >
            {lead.featuredImage && (
              <div className="absolute inset-0" style={{ containerType: "size" }}>
                <PhotoImage
                  src={lead.featuredImage}
                  alt={lead.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={leadFocus ? { objectPosition: leadFocus } : undefined}
                  sizes="(max-width: 1280px) 100vw, 1232px"
                  priority
                />
              </div>
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(7,11,18,0.97) 0%, rgba(7,11,18,0.62) 45%, rgba(7,11,18,0.12) 100%)" }}
            />
            <div className="relative p-6 sm:p-10 flex flex-col justify-end" style={{ minHeight: 340 }}>
              {/* On a solid dark backing: orange straight onto the photo fell
                  on grass and traffic lights and failed contrast (QA rest#19). */}
              <span
                className="self-start text-[10.5px] font-bold px-2.5 py-1 rounded uppercase tracking-[0.18em] mb-3"
                style={{ background: "rgba(10,10,10,0.86)", color: "#FB923C", border: "1px solid rgba(249,115,22,0.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
              >
                Latest {section.singular.toLowerCase()}
              </span>
              <h2
                className="font-black mb-2 max-w-3xl"
                style={{ color: "var(--text-primary)", fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)", lineHeight: 1.1, letterSpacing: "-0.02em", textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
              >
                {lead.title}
              </h2>
              <p className="text-sm sm:text-[15px] leading-relaxed max-w-2xl mb-3" style={{ color: "var(--ink-80)" }}>
                {clipExcerpt(lead.excerpt, 190)}
              </p>
              <span className="text-[13px] font-bold inline-flex items-center gap-1.5" style={{ color: "var(--accent-text)" }}>
                Read post
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* The whole section, as it always was, up to forty posts after the
          lead; past that, the first forty and a "Load more" (QA D9, 30 Sep
          2026). Projects stands at 38 today. */}
      {rest.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
          {rest.length > SECTION_PAGE ? (
            <LoadMoreGrid posts={rest} pageSize={SECTION_PAGE} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
              <LunchLearnTile count={rest.length} />
            </div>
          )}
        </div>
      )}

      {posts.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <p style={{ color: "var(--text-secondary)" }}>Nothing filed under {section.plural} yet.</p>
        </div>
      )}

      {/* The other sections, for the reader who reached the end of this one. */}
      {others.length > 0 && (
        <div style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: "var(--accent-text)" }}>
              Also in Insights
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {others.map((s) => (
                <Link
                  key={s.key}
                  href={`/blog/${s.slug}`}
                  className="group flex items-center justify-between gap-4 p-5 rounded-xl transition-colors hover:border-orange-500/40"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
                >
                  <span className="min-w-0">
                    <span className="block text-lg font-bold mb-1" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      {s.plural}
                    </span>
                    <span className="block text-[13.5px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                      {s.blurb}
                    </span>
                  </span>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-text)" viewBox="0 0 24 24" className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
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
