"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { applications } from "@/lib/applications";
import { applicationImages, resolveImage } from "@/lib/featured-images";

export default function ApplicationsGrid() {
  return (
    <section className="py-28 bg-asphalt-subtle" style={{ background: "var(--bg-slate)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="grad-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Applications
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            Every Surface, A Statement
          </h2>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          style={{ gridAutoRows: "200px" }}
        >
          {applications.map((app, i) => (
            <motion.div
              key={app.slug}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden group ${app.col ?? ""}`}
              style={{ borderRadius: "12px" }}
            >
              <Link href={`/applications/${app.slug}`} className="block w-full h-full">
                <Image
                  src={applicationImages[app.slug] ? resolveImage(applicationImages[app.slug]).src : app.imageUrl}
                  alt={applicationImages[app.slug] ? resolveImage(applicationImages[app.slug]).alt : app.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
      </div>
    </section>
  );
}
