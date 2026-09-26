import Link from "next/link";
import PhotoImage from "@/components/ui/PhotoImage";
import { getAllPosts } from "@/lib/blog";
import { badgeFor } from "@/lib/field-notes-taxonomy";

// Fallback images from confirmed project paths in lib/projects.ts
const FALLBACK_IMAGES = [
  "/images/applications/crosswalks/crosswalks-01.jpg",
  "/images/applications/parks-paths/parks-paths-01.jpg",
  "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
];

export default async function FeaturedBlogPost() {
  const posts = await getAllPosts();

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
    <section
      /* Insights — reading. The id stays "field-notes": the homepage hero's
         first button points at it, and that href lives in Sanity (page-homepage). */
      data-surface="paper" id="field-notes" className="py-28 lg:py-32" style={{ background: "var(--bg-section-asphalt)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ────────────────────────────────── */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Insights
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
              How it goes in.<br className="hidden sm:block" /> And how it holds up.
            </h2>
            <p
              className="text-base mt-2 max-w-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Installation guides, project write-ups, and the specification detail behind them.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all border hover:border-orange-500/40 hover:text-[var(--text-primary)]"
            style={{
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            All articles
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
              <PhotoImage
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
              {/* No badge here. There was one — an orange tick reading "Real
                  Installation · Verified Data" — and Doug's note on it was
                  exactly right: it asserts credibility instead of saying
                  anything. Nothing on the site verifies data, the photo is
                  plainly a real driveway, and a reader who needs to be told
                  a photograph is real has already stopped believing it. If a
                  badge goes back on this card it has to carry a fact the
                  photo does not — a place, a year, a system. */}
            </div>

            {/* Content — 2/5 on desktop */}
            <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center">
              {/* Category + read time */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(249,115,22,0.12)",
                    color: "var(--accent-text-lg)",
                  }}
                >
                  {badgeFor(hero.category)}
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
                className="text-sm font-semibold flex items-center gap-2 self-start group-hover:text-[var(--accent-soft-text)] transition-colors"
                style={{ color: "var(--accent-text-lg)" }}
              >
                Read the {badgeFor(hero.category).toLowerCase()}
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
                    <PhotoImage
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
                      style={{ color: "var(--accent-text-lg)" }}
                    >
                      {badgeFor(post.category)}
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
            className="text-sm font-semibold px-6 py-3 rounded-lg inline-block border transition-all hover:border-orange-500/40 hover:text-[var(--text-primary)]"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            All Insights
          </Link>
        </div>

      </div>
    </section>
  );
}
