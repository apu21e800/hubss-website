import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Reach HUB Surface Systems for project inquiries, spec sheets, and Lunch & Learn bookings. Two regional offices serving all of Canada — East: Milton, ON · West: Ladysmith, BC.",
  slug: "contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
