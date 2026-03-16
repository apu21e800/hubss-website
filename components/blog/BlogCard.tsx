import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/5 transition-all duration-300 hover:border-orange-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)]"
    >
      {post.featuredImage ? (
        <div className="aspect-[16/9] overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={600}
            height={338}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a]" />
      )}
      <div className="p-6">
        <p className="text-xs text-gray-500 mb-3 tracking-wide">
          {new Date(post.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {post.readTime}
        </p>
        <h3 className="font-bold text-lg leading-snug mb-2 text-[#f5f0eb] group-hover:text-orange-400 transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
