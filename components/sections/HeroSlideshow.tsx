import Link from "next/link";

// THIRD FIX: plain <img> avoids both the next/image fill+priority silent failure
// (async server component context) AND CSS background-image rendering failures on Vercel.
// fetchPriority="high" ensures the browser's HTML preload scanner picks this up first.
// || instead of ?? guards against empty-string heroImageSrc from Sanity.
import { heroAlt } from "@/lib/image-seo";
import { isSanityImage, sanitySized, sanitySrcSet } from "@/lib/photos";

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
  /** Alt text from Studio for that image. */
  heroImageAlt?: string;
  /** Art-directed framings of the same photograph, by media query (app/page.tsx). */
  heroSources?: { file: string; media: string }[];
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
  heroImageAlt,
  heroSources = [],
}: HeroSlideshowProps = {}) {
  const src = heroImageSrc || FALLBACK_HERO;
  // A Sanity photo is sized by Sanity's CDN (lib/photos.ts): a phone gets an
  // 828px WebP instead of the full-size original.
  const fromSanity = isSanityImage(src);

  return (
    <section
      /* full-bleed photography with overlaid type — dark in every theme */
      data-surface="dark"
      data-hero
      className="relative w-full overflow-hidden sm:min-h-[88vh]"
      style={{ background: "var(--bg-dark)" }}
      aria-label="Hero"
    >
      {/* ── The photograph. On a phone (below sm) it is a 5:4 picture in the
           flow, the scene close on the sign, and the headline
           sits under it: a 9:16 slice of this scene was all sign and no street
           (Vern, 26 Sep 2026: "too zoomed in, too cropped"). From sm up it is
           the full-bleed background it always was, type over the street. The
           gradients live inside this box so they cover exactly the picture. */}
      <div className="hero-photo relative aspect-[5/4] w-full sm:absolute sm:inset-0 sm:aspect-auto">
      {/* ── Background image — plain <img>, not next/image and not CSS background-image.
           Both prior approaches failed on Vercel. Plain img src is picked up by
           the browser HTML preload scanner immediately, before CSS/JS parsing. */}
      {/* A <picture>, so a wide screen or a phone can get its own framing of
          the photograph (heroSources: the sign in the middle of each) while
          everything else gets the Studio original. With no such files the
          <source>s are absent and this is the plain <img> it always was. */}
      <picture>
        {heroSources.map((v) => (
          <source key={v.file} media={v.media} srcSet={v.file} />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fromSanity ? sanitySized(src, 1920) : src}
          srcSet={fromSanity ? sanitySrcSet(src) : undefined}
          sizes={fromSanity ? "100vw" : undefined}
          alt={heroImageAlt || heroAlt(src)}
          // @ts-ignore fetchPriority is valid HTML but TS types lag
          fetchPriority="high"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // The HUB sign is the photograph's subject. Since 26 Sep 2026 the
            // files are cut from a master with the sign in the middle of
            // every framing (scripts/hero-cuts.mjs), so a centred crop keeps
            // it in the middle at every size; a phone gets the 9:16 cut and
            // a wide window the 2:1 cut through the <picture> above. (The
            // earlier single landscape file needed 65% across and 0% down to
            // keep the sign whole; that photograph is gone.)
            objectPosition: "50% 50%",
            zIndex: 1,
          }}
        />
      </picture>

      {/* ── Gradients — lightened per Doug review for brighter hero ───── */}
      {/* On a phone the picture is lighter (the type is not on it) and only
          its foot fades into the panel below; from sm up the full scrim. */}
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            // Lighter than it was (Vern, 26 Sep 2026: "it feels muted"):
            // the photograph carries its own colour now; the foot stays dark
            // for the type.
            "linear-gradient(180deg, rgba(13,17,23,0.24) 0%, rgba(13,17,23,0.12) 40%, rgba(13,17,23,0.42) 70%, rgba(13,17,23,0.86) 100%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,17,23,0.10) 0%, rgba(13,17,23,0) 25%, rgba(13,17,23,0) 72%, rgba(16,16,16,0.92) 100%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        style={{
          background:
            "linear-gradient(95deg, rgba(13,17,23,0.38) 0%, rgba(13,17,23,0.12) 42%, transparent 62%)",
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
      </div>

      {/* ── Content zone ────────────────────── */}
      {/* On a phone: a panel under the picture. From sm up: anchored low in
          the frame, over the street and the crosswalk, never over the
          letters, since 26 Sep 2026 the photograph is composed with the HUB
          sign in the upper middle of every framing. (Vertically centred, it
          put "Your Canvas." straight across the sign.) */}
      <div
        className="relative -mt-8 pb-10 pt-0 sm:absolute sm:inset-0 sm:mt-0 sm:flex sm:items-end sm:pt-16 sm:pb-[clamp(1.75rem,6vh,5rem)]"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">

            {/* Eyebrow — #FDBA74 (orange-300) reads clearly over the hero photo; shadow adds contrast */}
            {/* One line on a phone too: at 0.22em tracking the eyebrow wrapped
                and pushed the headline up into the sign. */}
            <p
              className="text-[11px] tracking-[0.16em] sm:text-sm sm:tracking-[0.22em] font-bold uppercase mb-3"
              style={{
                color: "var(--accent-soft-text)",
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
                color: "var(--ink-85)",
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
                  color: "var(--on-accent)",
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
                className="inline-flex items-center justify-center gap-2 px-7 rounded-lg font-semibold text-sm border transition-all hover:bg-[var(--ink-06)]"
                style={{
                  borderColor: "var(--ink-30)",
                  color: "var(--ink-80)",
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
