"use client";

import { useState } from "react";
import BlogCard from "@/components/blog/BlogCard";
import LunchLearnTile from "@/components/blog/LunchLearnTile";
import type { PostMeta } from "@/lib/blog";

/**
 * A card grid that shows the first `pageSize` posts and a "Load more (N
 * remaining)" button for the rest, the same control as /resources and the
 * /blog filter (QA D9, 30 Sep 2026). The section pages (components/blog/
 * TypeHub.tsx) use it only once a section passes forty posts; under that
 * they list everything, as they always have.
 */
export default function LoadMoreGrid({ posts, pageSize }: { posts: PostMeta[]; pageSize: number }) {
  const [visible, setVisible] = useState(pageSize);
  const shown = posts.slice(0, visible);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
        <LunchLearnTile count={shown.length} />
      </div>
      {posts.length > visible && (
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => setVisible((v) => v + pageSize)}
            className="px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:text-[var(--accent-text-lg)] hover:border-[#F97316]/30"
            style={{ background: "transparent", border: "1px solid var(--ink-12)", color: "var(--text-muted)", minHeight: 44 }}
          >
            Load more ({posts.length - visible} remaining)
          </button>
        </div>
      )}
    </>
  );
}
