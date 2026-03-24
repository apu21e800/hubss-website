import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Start a Project",
  description: "Tell us about your community, timeline, and vision. Two regional offices serving all 10 Canadian provinces — Milton ON and Ladysmith BC. Response within one business day.",
  slug: "contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
