import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearnFunnel from "@/components/sections/LunchLearnFunnel";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Lunch & Learn — Free CPD Session for Engineers & Specifiers",
  description: "Book a free Lunch & Learn with HUB Surface Systems. We bring the food, the specs, and 30 years of decorative pavement expertise to your office. CPD-eligible for engineers.",
  slug: "lunch-learn",
});

export default function LunchLearnPage() {
  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <Nav />
      <LunchLearnFunnel />
      <Footer />
    </main>
  );
}
