import type { Metadata } from "next";

/**
 * Sanity Studio must never be indexed (QA F2, 30 Sep 2026): /studio answered
 * 200 with the site's default robots "index, follow" and a canonical to the
 * homepage. The page is a client component and cannot export metadata, so
 * this layout carries it; next.config.ts sends the matching X-Robots-Tag
 * header for /studio and everything under it. Nothing else about the Studio
 * changes: the layout renders its children as they are.
 */
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
