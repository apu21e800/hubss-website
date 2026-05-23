// Catalogue (flipbook) — minimal black-stage layout so the 5×5 pages pop on
// any device. Doesn't replace the site's root layout (analytics, chat, etc.
// still mount), but suppresses any page chrome that the global StickyBar
// could collide with.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue 2026 — Preview",
  description:
    "Digital preview of the HUB Surface Systems 2026 Catalogue. Swipe through 116 pages of decorative pavement solutions for Canadian municipalities and developers.",
  robots: { index: false, follow: false },           // preview-only, not indexed
  openGraph: {
    title: "HUBSS Catalogue 2026 — Preview",
    description:
      "Preview the HUB Surface Systems 2026 Catalogue — 116 pages of decorative pavement solutions.",
    images: [{ url: "/catalogue/v30/page-001.webp", width: 1200, height: 1200 }],
  },
};

export default function CatalogueLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-black" data-catalogue-route>
      {children}
    </div>
  );
}
