import Link from "next/link";

// THIRD FIX: plain <img> avoids both the next/image fill+priority silent failure
// (async server component context) AND CSS background-image rendering failures on Vercel.
// fetchPriority="high" ensures the browser's HTML preload scanner picks this up first.
// || instead of ?? guards against empty-string heroImageSrc from Sanity.
const FALLBACK_HERO = "/images/hero/hero-1.jpg";

interface HeroSlideshowProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  tagline?: string;
  cta1Label?: string;
  cta1Href?: string;
  cta2Label?: string;
  cta2Href?: string;
  /** Sanity-supplied hero image URL. Falls back to local /public/images/hero/hero-1.jpg. */
  heroImageSrc?: string;
}

export default function HeroSlideshow({
  eyebrow    = "Redefining Hardscapes · Since 1999",
  heading    = "The World Is",
  subheading = "Your Canvas.",
  tagline    = "Let's build your signature space.",
  cta1Label  = "See the Work",
  cta1Href   = "#field-notes",
  cta2Label  = "See the Systems",
  cta2Href   = "#systems",
  heroImageSrc,
}: HeroSlideshowProps = {}) {
  const src = heroImageSrc || FALLBACK_HERO;

  return (
    <section
      data-hero
      className="relative w-full overflow-hidden"
      style={{ minHeight: "88vh", background: "#0d1117" }}
      aria-label="Hero"
    >
      {/* ── Background image — plain <img>, not next/image and not CSS background-image.
           Both prior approaches failed on Vercel. Plain img src is picked up by
           the browser HTML preload scanner immediately, before CSS/JS parsing. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        // @ts-ignore fetchPriority is valid HTML but TS types lag
        fetchPriority="high"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 55%",
          zIndex: 1,
        }}
      />

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

      {/* ── Centered content zone ────────────────────── */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ zIndex: 10, paddingTop: "4rem" }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">

            {/* Eyebrow — #FDBA74 (orange-300) reads clearly over the hero photo; shadow adds contrast */}
            <p
              className="text-sm font-bold tracking-[0.22em] uppercase mb-3"
              style={{
                color: "#FDBA74",
                textShadow: "0 1px 12px rgba(0,0,0,0.75)",
              }}
            >
              {eyebrow}
            </p>

            {/* H1 — clamp raised: 5vw→7vw, 4.5rem→5.75rem cap for more presence on desktop */}
            <h1
              className="font-black mb-4"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.75rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: "white",
                textShadow: "0 2px 32px rgba(0,0,0,0.5)",
              }}
            >
              {heading}
              <br />
              <span
                style={{
                  background: "linear-gradient(92deg, #F97316 0%, #FACC15 55%, #FDE047 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 24px rgba(249,115,22,0.18))",
                }}
              >
                {subheading}
              </span>
            </h1>

            {/* H2 — supporting tagline — readable subhead under bold H1 */}
            <h2
              className="font-semibold mb-8"
              style={{
                fontSize: "clamp(1.25rem, 2vw, 1.625rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                color: "rgba(255,255,255,0.85)",
                textShadow: "0 1px 12px rgba(0,0,0,0.5)",
              }}
            >
              {tagline}
            </h2>

            {/* CTAs — min-h 44px ensures tap targets meet iOS guidelines */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={cta1Href}
                className="inline-flex items-center justify-center gap-2 px-7 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                  color: "#fff",
                  boxShadow: "0 6px 28px rgba(249,115,22,0.42)",
                  minHeight: "44px",
                }}
              >
                {cta1Label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={cta2Href}
                className="inline-flex items-center justify-center gap-2 px-7 rounded-lg font-semibold text-sm border transition-all hover:bg-white/[0.06]"
                style={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "rgba(255,255,255,0.8)",
                  minHeight: "44px",
                }}
              >
                {cta2Label}
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
