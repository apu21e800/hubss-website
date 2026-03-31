import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export default function FeaturedBlogPost() {
  const posts = getAllPosts();
  // Pin the residential driveways upgrade post; fall back to the latest post
  const post =
    posts.find((p) => p.slug === "residential-driveways-stamped-asphalt-upgrade") ??
    posts[0];

  if (!post) return null;

  const formattedDate = new Date(post.date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-24" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              From the Blog
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Insights on Surface Design
            </h2>
            <p className="text-base mt-2 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Real projects, technical depth, and honest comparisons.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:block text-sm font-semibold px-6 py-3 rounded transition-colors hover:border-gray-500"
            style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
          >
            All Articles
          </Link>
        </div>

        {/* Featured card */}
        <Link href={`/blog/${post.slug}`} className="block group">
          <div
            className="grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden rounded-xl border transition-shadow duration-300 group-hover:shadow-[0_4px_24px_rgba(249,115,22,0.1)]"
            style={{ background: "var(--bg-card-surface)", borderColor: "var(--border-color)" }}
          >
            {/* Image — 3/5 width on desktop */}
            {post.featuredImage && (
              <div className="relative md:col-span-3 h-64 md:h-auto min-h-[340px] overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            )}

            {/* Content — 2/5 width on desktop */}
            <div
              className={`${post.featuredImage ? "md:col-span-2" : "md:col-span-5"} p-10 flex flex-col justify-center`}
            >
              {/* Category + read time */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}
                >
                  {post.category}
                </span>
                {post.readTime && (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {post.readTime}
                  </span>
                )}
              </div>

              <h3
                className="text-2xl font-bold mb-3 leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {post.title}
              </h3>
              <p
                className="text-[15px] leading-relaxed mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                {post.excerpt}
              </p>

              {/* Date */}
              <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                {formattedDate}
              </p>

              {/* Products */}
              {post.products.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.products.map((p) => (
                    <span
                      key={p}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        background: "var(--bg-secondary)",
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
                Read Article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/blog"
            className="text-sm font-semibold px-6 py-3 rounded"
            style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
          >
            All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
