import type { PostMeta } from "@/lib/mdx";
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  posts: PostMeta[];
  currentSlug: string;
  count?: number;
}

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
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <h2 className="text-2xl font-bold text-[#f5f0eb] mb-8">
        Continue Reading
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
