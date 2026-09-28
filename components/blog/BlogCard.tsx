import Link from "next/link";
import PhotoImage from "@/components/ui/PhotoImage";
import type { PostMeta } from "@/lib/blog";
import { isSanityImage } from "@/lib/photos";
import { sectionFor } from "@/lib/field-notes-taxonomy";
import { clipExcerpt, focalObjectPosition, formatPostDate } from "@/lib/blog-taxonomy";

const FALLBACKS = [
  "/images/applications/crosswalks/crosswalks-01.jpg",
  "/images/applications/traffic-calming/traffic-calming-01.jpg",
  "/images/applications/bus-lanes/bus-lanes-01.jpg",
  "/images/products/streetbond/streetbond-01.png",
  "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
];

function getFallback(slug: string) {
  const hash = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACKS[hash % FALLBACKS.length];
}

/** priority: the first row of a list, which is the page's largest paint (LCP). */
export default function BlogCard({ post, priority = false }: { post: PostMeta; priority?: boolean }) {
  const imgSrc = post.featuredImage ?? getFallback(post.slug);
  // Sanity photos are sized by Sanity's CDN (PhotoImage); any other outside
  // URL is shown as it is.
  const isExternal = imgSrc.startsWith("http") && !isSanityImage(imgSrc);
  // Label palette comes from the taxonomy so every surface that shows a
  // section (card, section page, post hero) agrees.
  const section = sectionFor(post.category);
  const focus = post.featuredImage
    ? focalObjectPosition(post.featuredImageHotspot, post.featuredImageWidth, post.featuredImageHeight)
    : undefined;

  return (
    <Link
      href={`/blog/${post.slug}`}
      // The card had no border at all — just a fill a few percent off the page,
      // which on a neutral ground left it reading as a smudge rather than an
      // object. The hairline is what makes it a card; the orange glow on hover
      // is the same accent the featured rail uses, so the whole library
      // responds to the cursor in one language.
      // The border colour is a class, not an inline style: inline, it beat the
      // hover class and the orange edge never showed.
      className="group flex h-full flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-orange-500/40 hover:shadow-[0_8px_28px_rgba(249,115,22,0.14)]"
    >
      {/* container-type lets the focal point (lib/blog-taxonomy.ts) measure
          this frame. The dark fade that sat along the bottom of every photo
          went with the move to paper (28 Sep 2026): it was there to melt the
          photo into a charcoal card, and on a white one it read as a smudge. */}
      <div className="relative h-52 overflow-hidden flex-shrink-0" style={{ containerType: "size", background: "var(--bg-card-surface)" }}>
        <PhotoImage
          src={imgSrc}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={focus ? { objectPosition: focus } : undefined}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 410px"
          unoptimized={isExternal}
          priority={priority}
        />
        {/* Orange accent border on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.4)" }}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* One label, the section, and the date. The two product chips that
            sat under it went on 28 Sep 2026 (Vern: "extra tags on cards might
            be a bit overkill"): the post names its systems, and the filter
            above the grid finds them. */}
        <div className="flex items-center justify-between mb-2.5 gap-2">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider flex-shrink-0"
            style={{ background: section.tint, color: section.text, border: `1px solid ${section.border}` }}
          >
            {section.singular}
          </span>
          <span className="text-[11px] flex-shrink-0 tabular-nums" style={{ color: "var(--text-muted)" }}>
            {formatPostDate(post.date)}
          </span>
        </div>

        <h3
          className="font-bold text-[15px] leading-snug mb-2 transition-colors duration-200 group-hover:text-[var(--accent-text)]"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          {post.title}
        </h3>

        <p className="text-[13px] leading-relaxed flex-1 mb-4" style={{ color: "var(--text-secondary)" }}>
          {clipExcerpt(post.excerpt, 120)}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--accent-text-lg)" }}>
            Read post &rarr;
          </span>
          {post.readTime && (
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{post.readTime}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
