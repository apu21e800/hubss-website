import type { Metadata } from "next";

/**
 * /connect — tradeshow booth QR landing.
 *
 * NOT linked from nav, NOT in sitemap, robots noindex/nofollow.
 * Only reachable by scanning the booth tabletop card.
 */
export const metadata: Metadata = {
  title: "Welcome — HUB Surface Systems",
  description:
    "Explore HUB Surface Systems — virtual catalogue, prize draw, and contact.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: undefined },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
