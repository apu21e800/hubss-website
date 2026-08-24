import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import JsonLd from "@/components/ui/JsonLd";
import BlogCard from "@/components/blog/BlogCard";
import { getPostsByType } from "@/lib/mdx";
import { FIELD_NOTE_TYPES, type FieldNoteTypeMeta } from "@/lib/field-notes-taxonomy";

/**
 * Field Notes type hub — /blog/case-studies, /blog/guides, and friends.
 *
 * WHY THESE PAGES EXIST: a library of 67 posts behind one /blog index gives
 * search engines exactly one page to rank for every content shape at once.
 * A specifier searching "decorative crosswalk case study" and a homeowner
 * searching "stamped asphalt driveway guide" want different pages, and until
 * now both landed on the same filtered grid whose state lives in a query
 * string crawlers do not index. Each hub is a real URL with its own H1,
 * description, and CollectionPage/ItemList schema listing every post in it —
 * the standard structure Google and AI answer engines read to understand that
 * a site has depth on a subject rather than one page mentioning it.
 */
export default function TypeHub({ type }: { type: FieldNoteTypeMeta }) {
  const posts = getPostsByType(type.label);
  const others = FIELD_NOTE_TYPES.filter((t) => t.slug !== type.slug);
  const hubUrl = `https://hubss.com/blog/${type.slug}`;

  // Distinct keyword lanes covered by this collection — shown as the
  // "what's covered" rail and fed to schema `about`, so the page declares
  // its subject matter instead of leaving it to be guessed from titles.
  const lanes = [...new Set(posts.flatMap((p) => p.keywords))].slice(0, 10);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${hubUrl}#collection`,
    name: `${type.plural} — HUB Surface Systems Field Notes`,
    description: type.blurb,
    url: hubUrl,
    inLanguage: "en-CA",
    isPartOf: { "@type": "Blog", "@id": "https://hubss.com/blog#blog", name: "HUB Surface Systems Field Notes" },
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
      { "@type": "ListItem", position: 2, name: "Field Notes", item: "https://hubss.com/blog" },
      { "@type": "ListItem", position: 3, name: type.plural, item: hubUrl },
    ],
  };

  const [lead, ...rest] = posts;

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[12px]">
          <Link href="/blog" className="inline-flex items-center transition-colors hover:text-orange-400" style={{ color: "rgba(255,255,255,0.5)", minHeight: 40 }}>
            Field Notes
          </Link>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
          <span style={{ color: "#F5F0EB" }}>{type.plural}</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl">
          <span
            className="inline-block text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-[0.18em] mb-4"
            style={{ background: type.tint, color: type.text, border: `1px solid ${type.border}` }}
          >
            {posts.length} {posts.length === 1 ? type.label : type.plural}
          </span>
          <h1
            className="font-black mb-4"
            style={{
              color: "#F5F0EB",
              fontSize: "clamp(2rem, 4vw, 3.4rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {type.plural}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
            {type.promise}
          </p>
        </div>

        {/* Coverage rail — the subjects this collection actually covers */}
        {lanes.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {lanes.map((l) => (
              <span
                key={l}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full capitalize"
                style={{ background: "var(--bg-card-neutral)", color: "#9CA3AF", border: "1px solid var(--border-color)" }}
              >
                {l}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Lead article — the newest of the type, given editorial weight */}
      {lead && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <Link
            href={`/blog/${lead.slug}`}
            className="group relative block rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border-color)", minHeight: 300 }}
          >
            {lead.featuredImage && (
              <Image
                src={lead.featuredImage}
                alt={lead.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(7,11,18,0.97) 0%, rgba(7,11,18,0.6) 45%, rgba(7,11,18,0.15) 100%)" }}
            />
            <div className="relative p-6 sm:p-10 flex flex-col justify-end" style={{ minHeight: 300 }}>
              <span
                className="self-start text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-[0.18em] mb-3"
                style={{ background: type.tint, color: type.text, border: `1px solid ${type.border}` }}
              >
                Latest {type.label}
              </span>
              <h2
                className="font-black mb-2 max-w-3xl"
                style={{ color: "#F5F0EB", fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
              >
                {lead.title}
              </h2>
              <p className="text-sm sm:text-[15px] leading-relaxed max-w-2xl mb-3" style={{ color: "rgba(255,255,255,0.72)" }}>
                {lead.excerpt.length > 190 ? lead.excerpt.slice(0, lead.excerpt.lastIndexOf(" ", 190)) + "…" : lead.excerpt}
              </p>
              <span className="text-[13px] font-bold inline-flex items-center gap-1.5" style={{ color: "#FB923C" }}>
                Read it
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* The rest of the collection */}
      {rest.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 text-center">
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Nothing filed under {type.plural} yet.</p>
        </div>
      )}

      {/* Cross-links — every hub reachable from every hub, so a crawler that
          finds one finds the whole library, and a reader who wanted proof
          instead of instruction is one click away from it. */}
      <div style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: "#FB923C" }}>
            Also in Field Notes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {others.map((t) => {
              const n = getPostsByType(t.label).length;
              if (n === 0) return null;
              return (
                <Link
                  key={t.slug}
                  href={`/blog/${t.slug}`}
                  className="group flex flex-col p-4 rounded-xl transition-colors hover:bg-white/5"
                  style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] mb-1.5" style={{ color: t.text }}>
                    {n} {n === 1 ? t.label : t.plural}
                  </span>
                  <span className="text-[13px] leading-snug" style={{ color: "rgba(255,255,255,0.68)" }}>
                    {t.blurb}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}
