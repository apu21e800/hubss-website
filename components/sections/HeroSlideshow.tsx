import Image from "next/image";
import Link from "next/link";

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

      {/* ── Gradients — lightened per Doug review for brighter hero ───── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,17,23,0.38) 0%, rgba(13,17,23,0.28) 40%, rgba(13,17,23,0.5) 70%, rgba(13,17,23,0.86) 100%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(95deg, rgba(13,17,23,0.48) 0%, rgba(13,17,23,0.18) 42%, transparent 62%)",
          zIndex: 2,
        }}
      />
      {/* Orange atmospheric bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(249,115,22,0.14) 0%, transparent 55%)",
          zIndex: 2,
        }}
      />

      {/* ── Centered content zone ────────────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ zIndex: 10, paddingTop: "4rem" }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">

            {/* Eyebrow — Vernon-confirmed: 1999 is the authoritative founding year site-wide */}
            <p
              className="text-xs font-bold tracking-[0.22em] uppercase mb-4"
              style={{ color: "#F97316" }}
            >
              Redefining Hardscapes · Since 1999
            </p>

            {/* H1 */}
            <h1
              className="font-black mb-6"
              style={{
                fontSize: "clamp(3rem, 7.5vw, 6.5rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: "white",
                textShadow: "0 2px 32px rgba(0,0,0,0.5)",
              }}
            >
              Let&rsquo;s build your{" "}
              <span
                style={{
                  background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                signature space.
              </span>
            </h1>

            {/* Body */}
            <p
              className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
              style={{ color: "rgba(255,255,255,0.82)", fontWeight: 400 }}
            >
              Ours make a statement... Yours!
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                  color: "#fff",
                  boxShadow: "0 6px 28px rgba(249,115,22,0.42)",
                }}
              >
                See the Work
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm border transition-all hover:bg-white/[0.06]"
                style={{
                  borderColor: "rgba(255,255,255,0.28)",
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                See the Systems
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
