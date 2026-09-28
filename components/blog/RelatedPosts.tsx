import type { PostMeta } from "@/lib/blog";
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  posts: PostMeta[];
  currentSlug: string;
  count?: number;
}

/**
 * "Continue reading": three cards under a post. The page used to print an
 * orange "CONTINUE READING" eyebrow straight over this heading (QA rest#22);
 * the heading is the one kept. It no longer adds its own page margins, which
 * doubled the page's and pushed the heading in from the edge of the grid.
 */
export default function RelatedPosts({
  posts,
  currentSlug,
  count = 3,
}: RelatedPostsProps) {
  const related = posts
    .filter((p) => p.slug !== currentSlug)
    .slice(0, count);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="continue-reading">
      <h2 id="continue-reading" className="font-bold mb-6" style={{ color: "var(--text-primary)", fontSize: "clamp(1.35rem, 2vw, 1.6rem)", letterSpacing: "-0.02em" }}>
        Continue reading
      </h2>
      {/* Rows are always full: three across from lg; two across below it,
          where a third card would sit alone, so it waits for lg. */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${related.length === 3 ? "lg:grid-cols-3" : ""}`}>
        {related.map((post, i) => (
          <div key={post.slug} className={i === 2 ? "sm:hidden lg:block" : undefined}>
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}
