import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

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

  return (
    <div className="group overflow-hidden rounded" style={{ background: "#2d2d2d" }}>
      <div className="relative h-52 overflow-hidden">
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={isExternal}
        />
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.products.slice(0, 2).map((p) => (
            <span
              key={p}
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
            >
              {p}
            </span>
          ))}
          {post.category && (
            <span
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}
            >
              {post.category}
            </span>
          )}
        </div>
        <h3 className="font-bold text-base leading-snug mb-2" style={{ color: "#f5f0eb" }}>
          {post.title}
        </h3>
        <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>
          {new Date(post.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {post.readTime}
        </p>
        <p className="text-xs leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
          {post.excerpt.length > 120
            ? post.excerpt.slice(0, post.excerpt.lastIndexOf(" ", 120)) + "..."
            : post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: "#f97316" }}
        >
          Read Post &rarr;
        </Link>
      </div>
    </div>
  );
}
