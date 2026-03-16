import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog | HUB Surface Systems",
  description:
    "Insights on decorative pavement, Vision Zero, Complete Streets, and Canadian municipal infrastructure from the HUB Surface Systems team.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* ── Header ─────────────────────────────────── */}
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-orange-500">
            Insights
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#f5f0eb]">
            Blog
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl">
            Industry perspectives on decorative pavement, pedestrian safety, and
            municipal infrastructure across Canada.
          </p>
        </div>

        {/* ── Featured post hero ─────────────────────── */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative block w-full rounded-2xl overflow-hidden mb-12 aspect-[21/9] min-h-[320px]"
          >
            {featured.featuredImage ? (
              <Image
                src={featured.featuredImage}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
            <div className="absolute inset-0 flex items-end p-8 md:p-12">
              <div className="max-w-2xl">
                <p className="text-xs text-gray-400 mb-3 tracking-wide">
                  {new Date(featured.date).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {featured.readTime}
                </p>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
                  {featured.title}
                </h2>
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-lg">
                  {featured.excerpt}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* ── Post grid ──────────────────────────────── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
