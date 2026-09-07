import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Project Gallery — Canadian Pavement Installations",
  description: "Browse HUB Surface Systems' photo archive — crosswalk, bike lane, community art, and decorative pavement installations documented across Canada, from a portfolio of more than 1,000 projects coast to coast.",
  slug: "gallery",
  image: "/images/blog/best-crosswalks-canada/featured.jpg",
});

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
