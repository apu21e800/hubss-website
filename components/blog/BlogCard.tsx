import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

// Local fallback images cycled by slug hash
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
      className="group overflow-hidden rounded cursor-pointer hover:shadow-lg transition-shadow duration-300 block"
      style={{ background: "var(--bg-card-surface)" }}
    >
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
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
            >
              {post.category}
            </span>
          )}
        </div>
        <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-orange-400 transition-colors" style={{ color: "var(--text-primary)" }}>
          {post.title}
        </h3>
        <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
          {new Date(post.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {post.readTime}
        </p>
        <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
          {post.excerpt.length > 120
            ? post.excerpt.slice(0, post.excerpt.lastIndexOf(" ", 120)) + "..."
            : post.excerpt}
        </p>
        <span
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: "#f97316" }}
        >
          Read Post &rarr;
        </span>
      </div>
    </Link>
  );
}
