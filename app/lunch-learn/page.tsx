import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";

export const metadata = buildMetadata({
  title: "Book a Free Lunch & Learn",
  description: "Complimentary lunch and product briefing for municipalities, engineering firms, and contractors. Live demonstrations, Canadian case studies, and free CPD/PDH credits.",
  slug: "lunch-learn",
});

export default function LunchLearnPage() {
  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />

      {/* Hero — moose sits at the very bottom, paws overlapping the section below */}
      <div className="relative overflow-hidden" style={{ paddingBottom: 0, zIndex: 2 }}>
        {/* Subtle orange tint */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.07) 0%, transparent 55%)" }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-0 relative">
          <div className="flex flex-col md:flex-row gap-12 items-end">
            {/* Text */}
            <div className="flex-1 pb-10">
              <p
                className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: "#f97316" }}
              >
                Free Professional Development
              </p>
              <h1
                className="text-5xl md:text-6xl font-bold mb-5 leading-tight"
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

            {/* Moose mascot — overlaps into LunchLearn section below */}
            <div
              className="hidden md:block"
              style={{
                flexShrink: 0,
                marginBottom: "-100px",
                zIndex: 20,
                position: "relative",
                pointerEvents: "none"
              }}
            >
              {/* TODO: Replace emoji with <Image src="/images/mascots/moose.png" /> once real PNG is added */}
              <div
                className="text-[140px] select-none leading-none"
                style={{
                  filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
                }}
              >
                🦌
              </div>
            </div>
          </div>
        </div>
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}
