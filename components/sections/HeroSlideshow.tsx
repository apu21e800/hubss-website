import Image from "next/image";
import Link from "next/link";

const stats = [
  { stat: "30+",    label: "Years in Canada" },
  { stat: "1,000+", label: "Projects coast to coast" },
  { stat: "20yr",   label: "Proven service life" },
];

export default function HeroSlideshow() {
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ minHeight: "90vh", maxHeight: "1080px", background: "#080d15" }}
      aria-label="Hero"
    >
      {/* ── Background image ──────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Image
          src="/images/hero/hero-1.jpg"
          alt="Decorative crosswalk — HUB Surface Systems"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "58% 48%" }}
        />
      </div>

      {/* ── Cinematic gradient stack ────────────────────────────────── */}
      {/* Top vignette — dark nav area blends in */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,13,21,0.72) 0%, rgba(8,13,21,0.22) 22%, rgba(8,13,21,0.08) 42%, rgba(8,13,21,0.45) 68%, rgba(8,13,21,0.92) 88%, rgba(8,13,21,1.0) 100%)",
          zIndex: 2,
        }}
      />
      {/* Left text scrim */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(92deg, rgba(8,13,21,0.62) 0%, rgba(8,13,21,0.28) 38%, rgba(8,13,21,0.04) 58%, transparent 72%)",
          zIndex: 2,
        }}
      />
      {/* Orange atmospheric bloom — upper-left corner */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(249,115,22,0.12) 0%, transparent 100%)",
          zIndex: 2,
        }}
      />

      {/* ── Flex spacer — image visible above content ─────────────── */}
      <div className="flex-1" style={{ minHeight: "160px" }} />

      {/* ── Content zone — lower third ───────────────────────────── */}
      <div className="relative w-full" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14 lg:pb-20">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <p
              className="text-xs font-bold tracking-[0.22em] uppercase mb-4"
              style={{ color: "#F97316" }}
            >
              Municipal &amp; Civic
            </p>

            {/* H1 */}
            <h1
              className="font-black mb-5"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 6rem)",
                lineHeight: 0.91,
                letterSpacing: "-0.04em",
                color: "white",
                textShadow: "0 2px 32px rgba(0,0,0,0.55)",
              }}
            >
              The World Is{" "}
              <span
                style={{
                  background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your Canvas.
              </span>
            </h1>

            {/* Body */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
              style={{ color: "rgba(255,255,255,0.72)", fontWeight: 400 }}
            >
              Decorative crosswalks, roundabouts, and plazas that define community
              identity — and outlast paint by 20 years in Canada&apos;s harshest climates.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                  color: "#fff",
                  boxShadow: "0 6px 28px rgba(249,115,22,0.40)",
                }}
              >
                See Projects
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm border transition-all hover:bg-white/[0.06]"
                style={{
                  borderColor: "rgba(255,255,255,0.22)",
                  color: "rgba(255,255,255,0.80)",
                }}
              >
                Request Spec Sheet
              </Link>
            </div>

            {/* Trust signals */}
            <div>
              <div
                style={{
                  height: 1,
                  background: "linear-gradient(90deg, rgba(249,115,22,0.50) 0%, rgba(255,255,255,0.07) 50%, transparent 100%)",
                  marginBottom: "1.25rem",
                  maxWidth: "30rem",
                }}
              />
              <div className="flex flex-wrap gap-x-10 gap-y-3">
                {stats.map(({ stat, label }) => (
                  <div key={stat} className="flex items-center gap-3">
                    <span
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: 800,
                        color: "#F97316",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {stat}
                    </span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.48)",
                        fontWeight: 500,
                        lineHeight: 1.3,
                        maxWidth: "7rem",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
