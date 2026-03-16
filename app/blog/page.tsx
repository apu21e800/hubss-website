import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import BlogFilter from "@/components/blog/BlogFilter";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog | HUB Surface Systems",
  description:
    "Insights on decorative pavement, Vision Zero, Complete Streets, and Canadian municipal infrastructure from the HUB Surface Systems team.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  // Build the product list from what's actually in the posts (sorted by frequency)
  const productCounts = new Map<string, number>();
  for (const post of posts) {
    for (const p of post.products) {
      productCounts.set(p, (productCounts.get(p) ?? 0) + 1);
    }
  }
  const allProducts = [...productCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12">
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

        {/* Filter + grid — wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<BlogSkeleton />}>
          <BlogFilter posts={posts} allProducts={allProducts} />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}

function BlogSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-zinc-800" />
        ))}
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 rounded-lg bg-zinc-800" />
        <div className="h-10 w-52 rounded-lg bg-zinc-800" />
        <div className="h-10 w-44 rounded-lg bg-zinc-800" />
      </div>
      <div className="h-72 rounded-2xl bg-zinc-800 mt-8" />
      <div className="grid grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}
