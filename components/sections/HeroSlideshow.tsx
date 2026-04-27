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
      className="relative w-full overflow-hidden"
      style={{ minHeight: "90vh", maxHeight: "1000px", background: "#0d1117" }}
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
          style={{ objectPosition: "50% 55%" }}
        />
      </div>

      {/* ── Gradients ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,17,23,0.65) 0%, rgba(13,17,23,0.58) 30%, rgba(13,17,23,0.78) 65%, rgba(13,17,23,0.97) 100%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(95deg, rgba(13,17,23,0.55) 0%, rgba(13,17,23,0.22) 44%, transparent 64%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(249,115,22,0.14) 0%, transparent 55%)",
          zIndex: 2,
        }}
      />

      {/* ── Content zone ───────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 lg:pb-14">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "#F97316" }}
            >
              Municipal &amp; Civic
            </p>

            {/* H1 */}
            <h1
              className="font-black mb-5"
              style={{
                fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                color: "white",
                textShadow: "0 2px 28px rgba(0,0,0,0.45)",
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
              className="text-base sm:text-lg leading-relaxed mb-7 max-w-xl"
              style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}
            >
              Decorative crosswalks, roundabouts, and plazas that define community
              identity — and outlast paint by 20 years in Canada&apos;s harshest climates.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-9">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                  color: "#fff",
                  boxShadow: "0 6px 24px rgba(249,115,22,0.38)",
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
                  borderColor: "rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Request Spec Sheet
              </Link>
            </div>

            {/* ── Trust signals ─────────────────────────────────── */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(249,115,22,0.45) 0%, rgba(255,255,255,0.08) 55%, transparent 100%)",
                marginBottom: "1.35rem",
                maxWidth: "32rem",
              }}
            />
            <div className="flex flex-wrap gap-x-9 gap-y-4">
              {stats.map(({ stat, label }) => (
                <div key={stat} className="flex items-center gap-3">
                  <span
                    style={{
                      fontSize: "1.55rem",
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
                      color: "rgba(255,255,255,0.50)",
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
    </section>
  );
}
