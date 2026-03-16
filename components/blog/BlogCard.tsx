import Image from "next/image";
import Link from "next/link";
import type { PostMeta, PostCategory } from "@/lib/mdx";

const CATEGORY_STYLES: Record<PostCategory, string> = {
  "Blog":            "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Case Study":      "bg-teal-500/15 text-teal-400 border-teal-500/20",
  "Project Profile": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "White Paper":     "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

// Unsplash fallback images cycled by slug hash
const FALLBACKS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=70",
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=70",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=70",
];

function getFallback(slug: string) {
  const hash = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACKS[hash % FALLBACKS.length];
}

export default function BlogCard({ post }: { post: PostMeta }) {
  const imgSrc = post.featuredImage ?? getFallback(post.slug);
  const isExternal = imgSrc.startsWith("http");
  const categoryStyle = post.category ? CATEGORY_STYLES[post.category] : CATEGORY_STYLES["Blog"];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/5 transition-all duration-300 hover:border-orange-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)]"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden relative">
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={isExternal}
        />
        {/* Category badge — top left */}
        {post.category && (
          <span className={`absolute top-3 left-3 text-[10px] font-semibold tracking-wide uppercase px-2 py-1 rounded-md border backdrop-blur-sm ${categoryStyle}`}>
            {post.category}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-gray-500 mb-3 tracking-wide">
          {new Date(post.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {post.readTime}
        </p>
        <h3 className="font-bold text-base leading-snug mb-2 text-[#f5f0eb] group-hover:text-orange-400 transition-colors duration-300 flex-1">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-400 line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Product tags */}
        {post.products && post.products.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {post.products.slice(0, 3).map((p) => (
              <span
                key={p}
                className="text-[10px] text-orange-400/70 bg-orange-500/8 px-2 py-0.5 rounded-full border border-orange-500/10"
              >
                {p}
              </span>
            ))}
            {post.products.length > 3 && (
              <span className="text-[10px] text-gray-600">+{post.products.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
