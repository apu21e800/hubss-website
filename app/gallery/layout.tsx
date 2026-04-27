import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Project Gallery — 500+ Canadian Pavement Installations",
  description: "Browse HUB Surface Systems' photo archive — 500+ crosswalk, bike lane, community art, and decorative pavement installations documented across Canada.",
  slug: "gallery",
  image: "/images/blog/best-crosswalks-canada/featured.jpg",
});

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
