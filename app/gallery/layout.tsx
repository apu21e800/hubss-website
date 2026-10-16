import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Project Gallery · Canadian Pavement Installations",
  description: "Photos of HUB Surface Systems work across Canada: crosswalks, bike lanes, community art and decorative pavement, from more than 1,000 projects.",
  slug: "gallery",
  image: "/images/blog/best-crosswalks-canada/featured.jpg",
});

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
