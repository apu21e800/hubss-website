import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Book a Free Lunch & Learn",
  description: "Complimentary lunch and product briefing for municipalities, engineering firms, and contractors. Live demonstrations, Canadian case studies, and free CPD/PDH credits.",
  slug: "lunch-learn",
});

export default function LunchLearnPage() {
  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
          style={{ color: "#f97316" }}
        >
          Free Professional Development
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold mb-5 leading-tight max-w-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          Lunch Is On Us.
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #F97316, #EAB308)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Knowledge Is Free.
          </span>
        </h1>
        <p
          className="text-lg leading-relaxed max-w-2xl"
          style={{ color: "var(--text-secondary)" }}
        >
          We bring lunch to your office and walk your team through everything
          you need to know about modern pavement marking systems — real Canadian
          case studies, lifecycle cost analysis, and practical specs you can drop
          straight into your next RFP. Free CPD/PDH credits for engineers.
        </p>
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}
