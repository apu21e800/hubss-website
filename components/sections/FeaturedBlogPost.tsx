import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

// Fallback images from confirmed project paths in lib/projects.ts
const FALLBACK_IMAGES = [
  "/images/applications/crosswalks/crosswalks-01.jpg",
  "/images/applications/parks-paths/parks-paths-01.jpg",
  "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
];

export default function FeaturedBlogPost() {
  const posts = getAllPosts();

  // Pin the residential driveways post as hero; fall back to most recent
  const hero =
    posts.find((p) => p.slug === "residential-driveways-stamped-asphalt-upgrade") ??
    posts[0];

  // Next three posts for the secondary row
  const secondary = posts
    .filter((p) => p.slug !== hero?.slug)
    .slice(0, 3);

  if (!hero) return null;

  const heroImg = hero.featuredImage ?? FALLBACK_IMAGES[0];
  const heroDate = new Date(hero.date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <section id="field-notes" className="py-28 lg:py-32" style={{ background: "var(--bg-section-asphalt)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ────────────────────────────────── */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Field Notes
            </p>
            <h2
              className="font-black"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                textWrap: "balance",
              }}
            >
              Proven in the Field.<br className="hidden sm:block" /> Built to Last.
            </h2>
            <p
              className="text-base mt-2 max-w-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Real project data, case studies, and spec-ready content for engineers and project managers.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all border hover:border-orange-500/40 hover:text-white"
            style={{
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            All Articles
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* ── Hero featured article ──────────────────────────────────────── */}
        <Link href={`/blog/${hero.slug}`} className="block group mb-4">
          <div
            className="grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden rounded-2xl border transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(249,115,22,0.12)] group-hover:border-orange-500/25"
            style={{
              background: "var(--bg-card-neutral)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Image — 3/5 on desktop */}
            <div className="relative md:col-span-3 h-72 md:h-auto min-h-[380px] overflow-hidden">
              <Image
                src={heroImg}
                alt={hero.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              {/* Gradient overlay for readability */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, transparent 60%, rgba(8,13,22,0.6) 100%)",
                }}
              />
              {/* Stat credibility pill */}
              <div
                className="absolute bottom-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm"
                style={{
                  background: "rgba(249,115,22,0.9)",
                  color: "#fff",
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Real Installation · Verified Data
              </div>
            </div>

            {/* Content — 2/5 on desktop */}
            <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center">
              {/* Category + read time */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(249,115,22,0.12)",
                    color: "#f97316",
                  }}
                >
                  {hero.category}
                </span>
                {hero.readTime && (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {hero.readTime}
                  </span>
                )}
              </div>

              <h3
                className="text-2xl font-bold mb-3 leading-tight group-hover:text-orange-100 transition-colors duration-200"
                style={{ color: "var(--text-primary)" }}
              >
                {hero.title}
              </h3>

              <p
                className="text-[15px] leading-relaxed mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {hero.excerpt}
              </p>

              <p className="text-xs mb-7" style={{ color: "var(--text-muted)" }}>
                {heroDate}
              </p>

              {/* Tagged products */}
              {hero.products.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-7">
                  {hero.products.map((p) => (
                    <span
                      key={p}
                      className="text-xs px-2.5 py-1 rounded-md font-medium"
                      style={{
                        background: "var(--fill-subtle)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}

              <span
                className="text-sm font-semibold flex items-center gap-2 self-start group-hover:text-orange-300 transition-colors"
                style={{ color: "#f97316" }}
              >
                Read Case Study
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* ── Secondary articles row ─────────────────────────────────────────────── */}
        {secondary.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {secondary.map((post, i) => {
              const img = post.featuredImage ?? FALLBACK_IMAGES[(i + 1) % FALLBACK_IMAGES.length];
              const date = new Date(post.date).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
              });
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)] hover:border-orange-500/25"
                  style={{
                    background: "var(--bg-card-neutral)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {/* Thumbnail — full width, 16:9 */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={img}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex flex-col p-6 flex-1">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase mb-3"
                      style={{ color: "#f97316" }}
                    >
                      {post.category}
                    </span>
                    <h4
                      className="text-base font-bold leading-snug mb-3 group-hover:text-orange-100 transition-colors line-clamp-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {post.title}
                    </h4>
                    <p className="text-xs mt-auto" style={{ color: "var(--text-muted)" }}>
                      {date}
                      {post.readTime ? ` · ${post.readTime}` : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile — all articles link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="text-sm font-semibold px-6 py-3 rounded-lg inline-block border transition-all hover:border-orange-500/40 hover:text-white"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            All Field Notes
          </Link>
        </div>

      </div>
    </section>
  );
}
