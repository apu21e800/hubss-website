"use client";

import Image from "next/image";
import Link from "next/link";

// Residential driveway: stamped asphalt with the home in frame. Since 28 Sep
// 2026 a photo that is not in this page's own gallery above it (QA pa#2: the
// old one was gallery photo 12), chosen by the photo edit (4032 px wide).
const HERO_IMAGE = "/images/callouts/residential-driveway-1600.webp"; // residential-driveways-29.jpg at 1600 px, outside the gallery folder so it never joins the gallery; served as is, no optimiser

// The page grid, as a breakout grid (QA, 28 Sep 2026: at 1440 the text began
// at x=144 and the photo stopped 80 px short of the window, matching neither
// the page's 112 to 1328 column nor full bleed). From lg up the middle two
// tracks are the halves of the standard container (max-w-7xl less px-8: two
// 38rem halves) and the outer tracks are the margins, at least 2rem. The text
// fills the left half, so it starts on the container's left edge; the photo
// runs from the middle to the right edge of the window. No 100vw, so a
// desktop scrollbar cannot shift it off the grid.
const GRID =
  "grid grid-cols-1 min-h-[540px] lg:grid-cols-[minmax(2rem,1fr)_minmax(0,38rem)_minmax(0,38rem)_minmax(2rem,1fr)]";

export default function ResidentialDriveways() {
  return (
    <section style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className={GRID}>

          {/* ── Left: content, on the container's left edge ────────────── */}
          <div className="flex flex-col justify-center px-4 sm:px-6 lg:col-start-2 lg:col-end-3 lg:pl-0 lg:pr-16 py-16 lg:py-24">

            {/* The "New application" badge went on 28 Sep 2026: the page is
                not new to anyone reading it (QA pa#2). */}
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: "var(--accent-text-lg)" }}>
              For homeowners
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] mb-5"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              Your driveway, in{" "}
              <span style={{ color: "var(--accent-text-lg)" }}>city&#8209;grade StreetPrint.</span>
            </h2>

            <p
              className="text-base leading-relaxed mb-8 max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              The StreetPrint patterns specified for city streetscapes, stamped into your
              driveway. A 10–20 year service life, flush with nothing for a plow to catch.
            </p>

            {/* Benefit bullets */}
            <ul className="space-y-3.5 mb-10">
              {[
                "Brick, cobblestone, slate, herringbone, and custom pattern options",
                "Specified for Canadian freeze‑thaw cycles and winter maintenance",
                "The same materials specified for public streets, with no downgrade for homes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(249,115,22,0.15)" }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent-text-lg)"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* The button used to link to this same page, so pressing it
                reloaded it (QA pa#2). A homeowner here wants a price. */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-bold px-6 rounded-lg text-sm transition-[filter] duration-150 hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)", minHeight: 44 }}
              >
                Ask for a quote
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/products/streetprint" className="inline-flex items-center text-sm font-semibold hover:underline underline-offset-2" style={{ color: "var(--text-primary)", minHeight: 44 }}>
                About StreetPrint
              </Link>
            </div>
          </div>

          {/* ── Right: hero image, to the window's right edge ──────────── */}
          <div className="relative min-h-[360px] lg:min-h-0 overflow-hidden lg:col-start-3 lg:col-end-5">
            {/* Not marked priority: this section renders at the very
                bottom of /applications/residential-driveways (right before
                LunchLearn + Footer), well below the fold. The route's real
                LCP hero is the banner image at the top of the page. */}
            <Image
              src={HERO_IMAGE}
              alt="Residential StreetPrint stamped asphalt driveway in front of a home"
              fill
              unoptimized
              className="object-cover"
              style={{ objectPosition: "50% 30%" }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle orange left-edge glow where image meets content panel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(249,115,22,0.13) 0%, transparent 35%)",
              }}
            />
            {/* Bottom fade on mobile */}
            <div
              className="absolute inset-0 lg:hidden pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(15,20,32,0.65) 0%, transparent 50%)",
              }}
            />
          </div>
      </div>
    </section>
  );
}
