"use client";

import Image from "next/image";
import Link from "next/link";

// Residential driveway — stamped asphalt with visible home/garage context
const HERO_IMAGE = "/images/applications/residential-driveways/residential-driveways-08.jpg";

export default function ResidentialDriveways() {
  return (
    <section style={{ backgroundColor: "#0f1420" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[540px]">

          {/* ── Left — content ─────────────────────────────────────────── */}
          <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 lg:py-24">

            {/* NEW APPLICATION badge */}
            <div className="mb-6">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-[0.14em] uppercase"
                style={{
                  background: "rgba(249,115,22,0.12)",
                  color: "#f97316",
                  border: "1px solid rgba(249,115,22,0.28)",
                }}
              >
                New Application
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] mb-5"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              Your Driveway.
              <br />
              <span style={{ color: "#f97316" }}>City&#8209;Grade Materials.</span>
            </h2>

            <p
              className="text-base leading-relaxed mb-8 max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              The same StreetPrint patterns used on Toronto&apos;s streetscapes, now available for
              residential driveways. 20&#8209;year durability. 1&#8209;2 day installation.
            </p>

            {/* Benefit bullets */}
            <ul className="space-y-3.5 mb-10">
              {[
                "Custom patterns — cobblestone, brick, herringbone, and more",
                "Engineered for Canadian freeze‑thaw cycles",
                "Same materials used on public streets — residential quality isn’t a downgrade",
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
                      stroke="#f97316"
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

            <Link
              href="/applications/residential-driveways"
              className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-150 hover:brightness-110 self-start"
              style={{
                background: "linear-gradient(90deg, #F97316, #d97706)",
                color: "#fff",
              }}
            >
              See Driveway Options
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* ── Right — hero image ──────────────────────────────────────── */}
          <div className="relative min-h-[360px] lg:min-h-0 overflow-hidden">
            <Image
              src={HERO_IMAGE}
              alt="Residential StreetPrint driveway — aerial view, circular stamp pattern, home with double garage"
              fill
              priority
              className="object-cover object-top"
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
      </div>
    </section>
  );
}
