import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

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

export default function BlogCard({ post }: { post: PostMeta }) {
  const imgSrc = post.featuredImage ?? getFallback(post.slug);
  const isExternal = imgSrc.startsWith("http");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 bg-[#1e1e1e] hover:bg-[#252525]"
    >
      {/* Image with gradient overlay */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={isExternal}
        />
        {/* Dark gradient at bottom of image */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(30,30,30,0.9), transparent)" }}
        />
        {/* Orange accent border on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.4)" }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category badge + date */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider flex-shrink-0"
            style={
              post.category === "Case Study"
                ? { background: "rgba(249,115,22,0.18)", color: "#f97316" }
                : post.category === "White Paper"
                ? { background: "rgba(99,102,241,0.15)", color: "#818cf8" }
                : post.category === "Project Profile"
                ? { background: "rgba(16,185,129,0.15)", color: "#34d399" }
                : { background: "rgba(255,255,255,0.07)", color: "#9CA3AF" }
            }
          >
            {post.category}
          </span>
          <span className="text-[10px] flex-shrink-0" style={{ color: "#9CA3AF" }}>
            {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Product badges */}
        {post.products.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {post.products.slice(0, 2).map((p) => (
              <span
                key={p}
                className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: "rgba(249,115,22,0.10)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3
          className="font-bold text-sm leading-snug mb-2 transition-colors duration-200 group-hover:text-orange-400"
          style={{ color: "#F5F0EB" }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "#9CA3AF" }}>
          {post.excerpt.length > 110
            ? post.excerpt.slice(0, post.excerpt.lastIndexOf(" ", 110)) + "..."
            : post.excerpt}
        </p>

        {/* CTA + read time */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#f97316" }}>
            Read Post &rarr;
          </span>
          {post.readTime && (
            <span className="text-[10px]" style={{ color: "#6B7280" }}>{post.readTime}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
