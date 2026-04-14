import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";

export const metadata = buildMetadata({
  title: "Book a Free Lunch & Learn",
  description: "Complimentary lunch and product briefing for municipalities, engineering firms, and contractors. Live demonstrations, Canadian case studies, and free continuing education credits.",
  slug: "lunch-learn",
});

export default function LunchLearnPage() {
  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />

      {/* Hero — moose sits at the very bottom, paws overlapping the LunchLearn section below */}
      <div className="relative overflow-visible pb-36 sm:pb-40" style={{ zIndex: 2 }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-0 relative">
          <div className="flex flex-col gap-8">
            {/* Text */}
            <div className="pb-4">
              <p
                className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: "#f97316" }}
              >
                Free Professional Development
              </p>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight"
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
                className="text-base sm:text-lg leading-relaxed max-w-2xl"
                style={{ color: "var(--text-secondary)" }}
              >
                We bring lunch to your office and walk your team through everything
                you need to know about modern pavement marking systems — real Canadian
                case studies, lifecycle cost analysis, and practical specs you can drop
                straight into your next RFP. Free continuing education credits for engineers.
              </p>
            </div>
          </div>
        </div>

        {/* Floor line — sits exactly at the section fold */}
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: 2,
            background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.2) 30%, rgba(249,115,22,0.12) 70%, transparent 100%)",
          }}
        />

        {/* Moose — paws resting on the fold line, positioned right */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            bottom: "-8px",
            right: "clamp(16px, 12vw, 220px)",
            width: "clamp(180px, 28vw, 340px)",
          }}
        >
          <Image
            src="/images/assets/mascot/moose-1.png"
            alt="HUB Surface Systems Moose mascot — book a free Lunch and Learn session"
            width={340}
            height={340}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 20px rgba(249,115,22,0.35)) drop-shadow(0 12px 28px rgba(0,0,0,0.6))",
              display: "block",
            }}
            unoptimized
          />
        </div>
      </div>

      <div className="pt-20">
        <LunchLearn hideMoose />
      </div>
      <Footer />
    </main>
  );
}
