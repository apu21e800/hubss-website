"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { projectImages, resolveImage } from "@/lib/featured-images";

export default function RecentProjects() {
  const featured = projects[0];
  const secondary = projects.slice(1, 3);

  return (
    <section className="py-24" style={{ background: "var(--bg-dark)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Portfolio
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              Projects That Changed How Cities Look
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:block text-sm font-semibold px-6 py-3 rounded transition-colors hover:border-gray-500"
            style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
          >
            Browse All Projects
          </Link>
        </div>

        {/* Featured project */}
        <Link href={`/projects/${featured.slug}`} className="block mb-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden rounded-xl cursor-pointer hover:shadow-[0_4px_24px_rgba(249,115,22,0.1)] transition-shadow duration-300"
            style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="relative md:col-span-3 h-64 md:h-auto min-h-[320px] overflow-hidden">
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
            <div className="md:col-span-2 p-10 flex flex-col justify-center">
              <div className="flex gap-2 mb-5">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}
                >
                  {featured.product}
                </span>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "var(--bg-card-surface)", color: "var(--text-muted)" }}
                >
                  {featured.application}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3 leading-tight" style={{ color: "var(--text-primary)" }}>
                {featured.title}
              </h3>
              <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                {featured.excerpt}
              </p>
              <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                {featured.city}, {featured.province}
              </p>
              <span
                className="text-sm font-semibold flex items-center gap-2 self-start group-hover:text-orange-300 transition-colors"
                style={{ color: "#f97316" }}
              >
                View Project
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Two secondary projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {secondary.map((project, i) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-xl transition-all duration-200 cursor-pointer hover:shadow-[0_4px_20px_rgba(249,115,22,0.08)]"
                style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-7">
                  <div className="flex gap-2 mb-4">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}
                    >
                      {project.product}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 leading-tight" style={{ color: "var(--text-primary)" }}>
                    {project.title}
                  </h3>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    {project.city}, {project.province}
                  </p>
                  <span
                    className="text-sm font-semibold flex items-center gap-2 group-hover:text-orange-300 transition-colors"
                    style={{ color: "#f97316" }}
                  >
                    View Project
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/projects"
            className="text-sm font-semibold px-6 py-3 rounded"
            style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
          >
            Browse All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
