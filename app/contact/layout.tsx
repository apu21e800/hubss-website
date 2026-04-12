import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact HUB Surface Systems",
  description: "Request a quote for decorative pavement, thermoplastic crosswalks, or traffic safety markings. Two offices — Milton ON and Ladysmith BC — serving municipalities and contractors across all 10 provinces.",
  slug: "contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
