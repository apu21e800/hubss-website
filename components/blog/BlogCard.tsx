import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

const FALLBACKS = [
  "/images/applications/public-spaces/concordia-multicolour-crosswalk-01.jpg",
  "/images/applications/traffic-calming/roundabout-red-brick-planted-centre-01.jpg",
  "/images/applications/bus-bike-lanes/red-bus-lane-brt-transit-station-01.jpg",
  "/images/products/streetbond/streetbond-multicolour-plaza-green-circles-01.jpg",
  "/images/applications/commercial-spaces/tim-hortons-red-brick-crosswalk-01.jpg",
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
      className="group flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      style={{
        background: "#1C1F23",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
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
          style={{ background: "linear-gradient(to top, rgba(28,31,35,0.9), transparent)" }}
        />
        {/* Orange accent border on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.4)" }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Product badges + date */}
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {post.products.slice(0, 2).map((p) => (
              <span
                key={p}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
              >
                {p}
              </span>
            ))}
          </div>
          <span className="text-[10px] flex-shrink-0" style={{ color: "#6B7280" }}>
            {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>

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

        {/* CTA */}
        <span className="text-xs font-semibold flex items-center gap-1 mt-auto" style={{ color: "#f97316" }}>
          Read Post &rarr;
        </span>
      </div>
    </Link>
  );
}
