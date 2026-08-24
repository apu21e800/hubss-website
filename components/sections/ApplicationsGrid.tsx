"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { applications as libApplications, type Application } from "@/lib/applications";
import { applicationImages, resolveImage } from "@/lib/featured-images";

// Per-card object-position overrides for portrait images where the subject isn't centered
const APP_POSITION: Record<string, string> = {
  "public-art": "center 80%",
};

const FEATURED_SLUGS = [
  "crosswalks",
  "commercial-spaces",
  "parks-paths",
  "bike-lanes",
  "bus-lanes",
  "community-branding",
  "public-art",
  "traffic-calming",
  "townhomes",
];

type Props = { applications?: Application[] };

export default function ApplicationsGrid({ applications: appsProp }: Props = {}) {
  const source = appsProp ?? libApplications;
  const featured = FEATURED_SLUGS.map(
    (slug) => source.find((a) => a.slug === slug)
  ).filter(Boolean) as Application[];

  return (
    <section className="py-28" style={{ background: "#101010" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="grad-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Applications
          </p>
          <h2
            className="font-black mb-4"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}
          >
            Every Surface,{" "}
            <span style={{
              background: "linear-gradient(90deg, #F97316 0%, #EAB308 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>A Statement.</span>
          </h2>
          <p className="text-base sm:text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Crosswalks, bike lanes, civic art, driveways — wherever people move, gather, or stop, the surface underneath is doing work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {featured.map((app, i) => (
            <motion.div
              key={app.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative overflow-hidden group"
              style={{ borderRadius: "12px", aspectRatio: "4/3" }}
            >
              <Link href={`/applications/${app.slug}`} className="block w-full h-full">
                <Image
                  src={applicationImages[app.slug] ? resolveImage(applicationImages[app.slug]).src : app.imageUrl}
                  alt={applicationImages[app.slug] ? resolveImage(applicationImages[app.slug]).alt : app.name}
                  fill
                  loading="lazy"
                  // Subject-foreground bias: pavement surface usually sits in the lower 2/3 of source frames.
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  style={{ objectPosition: APP_POSITION[app.slug] ?? "center 60%" }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Bottom 40% scrim for text legibility — image stays visible above */}
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: "44%",
                    background: "linear-gradient(to top, rgba(7,11,18,0.92) 0%, rgba(7,11,18,0.65) 55%, rgba(7,11,18,0) 100%)",
                  }}
                />

                {/* Hover: 2px gradient bottom border only — image foregrounded, no full overlay */}
                <span
                  className="absolute inset-x-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "linear-gradient(90deg, #F97316 0%, #EAB308 100%)" }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <h3 className="font-bold text-base group-hover:text-orange-400 transition-colors" style={{ color: "var(--text-primary)" }}>
                    {app.name}
                  </h3>
                  <p className="text-sm text-white/60 mt-0.5 line-clamp-2">
                    {app.shortDesc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="flex justify-center mt-4">
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-orange-500/60 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 hover:bg-white/[0.04] text-sm"
          >
            View All Applications
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
