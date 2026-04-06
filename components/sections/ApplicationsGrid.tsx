"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { applications } from "@/lib/applications";
import { applicationImages, resolveImage } from "@/lib/featured-images";

const FEATURED_SLUGS = [
  "crosswalks",
  "commercial-spaces",
  "parks-paths",
  "bike-lanes",
  "bus-lanes",
  "community-branding",
  "traffic-calming",
  "townhomes",
  "residential-driveways",
];

export default function ApplicationsGrid() {
  const featured = FEATURED_SLUGS.map(
    (slug) => applications.find((a) => a.slug === slug)
  ).filter(Boolean) as typeof applications;

  return (
    <section className="py-28" style={{ background: "#080d16" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="grad-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Applications
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Every Surface, A Statement
          </h2>
          <p className="text-base max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Crosswalks, bike lanes, civic art, driveways — wherever people move, gather, or stop, the surface underneath is doing work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {featured.map((app, i) => (
            <motion.div
              key={app.slug}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative overflow-hidden group"
              style={{ borderRadius: "12px", aspectRatio: "4/3" }}
            >
              <Link href={`/applications/${app.slug}`} className="block w-full h-full">
                <Image
                  src={applicationImages[app.slug] ? resolveImage(applicationImages[app.slug]).src : app.imageUrl}
                  alt={applicationImages[app.slug] ? resolveImage(applicationImages[app.slug]).alt : app.name}
                  fill
                  loading="eager"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Permanent dark gradient — bottom 60% */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 40%, transparent 70%)",
                  }}
                />

                {/* Hover: overlay lightens (reduces darkness) */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)",
                  }}
                />

                {/* 2px gradient bottom border on hover */}
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(90deg, #F97316 0%, #EAB308 100%)" }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                    {app.name}
                  </h3>
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
