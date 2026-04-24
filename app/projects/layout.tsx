import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Project Gallery — Canadian Pavement Installations",
  description:
    "Crosswalks, bus lanes, bike paths, stamped driveways, and community art installations across Canada. Browse real HUB Surface Systems projects filtered by product or application.",
  slug: "projects",
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
