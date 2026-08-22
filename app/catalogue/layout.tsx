// Catalogue (flipbook) — minimal black-stage layout so the 5×5 pages pop on
// any device. Doesn't replace the site's root layout (analytics, chat, etc.
// still mount), but suppresses any page chrome that the global StickyBar
// could collide with.
import type { Metadata } from "next";
import { promises as fs } from "node:fs";
import path from "node:path";

// Resolve the cover image from the newest rendered version on disk so OG
// metadata follows the same auto-detected version as the viewer itself.
async function resolveCoverImage(): Promise<string> {
  try {
    const root = path.join(process.cwd(), "public", "catalogue");
    const dirs = await fs.readdir(root, { withFileTypes: true });
    const versions = dirs
      .filter((d) => d.isDirectory() && /^v\d+$/.test(d.name))
      .map((d) => ({ name: d.name, n: parseInt(d.name.slice(1), 10) }))
      .sort((a, b) => b.n - a.n);
    for (const v of versions) {
      const candidate = path.join(root, v.name, "page-001.webp");
      try { await fs.access(candidate); return `/catalogue/${v.name}/page-001.webp`; }
      catch { /* try older */ }
    }
  } catch { /* fall through */ }
  return "/catalogue/cover.webp";
}

import { showCatalogue } from "@/lib/feature-flags";

export async function generateMetadata(): Promise<Metadata> {
  // When the flag is off, advertise nothing — the page returns 404
  // anyway, and a 404 with rich OG metadata is a bad smell.
  if (!showCatalogue()) {
    return { robots: { index: false, follow: false } };
  }
  const cover = await resolveCoverImage();
  return {
    title: "Catalogue 2026 — HUB Surface Systems",
    description:
      "Digital edition of the HUB Surface Systems 2026 Catalogue. 116 pages of decorative pavement solutions for Canadian municipalities, developers, and contractors.",
    openGraph: {
      title: "HUBSS Catalogue 2026",
      description:
        "Browse the HUB Surface Systems 2026 Catalogue — 116 pages of decorative pavement solutions.",
      images: [{ url: cover, width: 1200, height: 1200 }],
    },
  };
}

export default function CatalogueLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-black" data-catalogue-route>
      {children}
    </div>
  );
}
