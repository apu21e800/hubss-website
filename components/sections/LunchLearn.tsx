"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const COVERS = [
  "Why preformed thermoplastic markings last 10x longer than paint",
  "Real Canadian case studies: before/after durability comparisons",
  "Budget planning: upfront costs vs lifecycle savings",
];

const TAKEAWAYS = [
  "Practical specs you can use in your next RFP",
  "Direct answers to your toughest pavement marking questions",
];


const inputStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  color: "#111827",
};

const labelStyle = { color: "var(--text-hint)" as string, fontSize: "0.8125rem", fontWeight: 600 };

export default function LunchLearn() {
  const [form, setForm] = useState({
    name: "", org: "", email: "", phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, formType: "lunch-learn", website: "" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="lunch-learn"
      className="relative overflow-hidden"
      style={{ background: "#0f1420", zIndex: 0 }}
    >
      {/* Orange/amber warm glow — emanates from bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom right, rgba(249,115,22,0.12) 0%, rgba(234,179,8,0.06) 30%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 pt-16" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT — content ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Eyebrow + CPD Badge */}
            <div className="flex items-center gap-3 mb-4">
              <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase">
                Free Professional Development
              </p>
              <span
                className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full"
                style={{
                  background: "linear-gradient(90deg, rgba(249,115,22,0.15), rgba(234,179,8,0.15))",
                  color: "#f97316",
                  border: "1px solid rgba(249,115,22,0.3)",
                }}
              >
                Continuing Education
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
              Earn Continuing Education Credits Over Lunch
            </h2>

            {/* Subhead */}
            <p className="text-lg mb-10 leading-relaxed" style={{ color: "#cbd5e1" }}>
              We bring the presentation — and the food. HUB Lunch &amp; Learn sessions are accredited continuing education sessions for landscape architects, traffic engineers, and public works professionals. Virtual or in-person, coast to coast.
            </p>

            {/* What we'll cover */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#f97316" }}>
                What we&apos;ll cover
              </p>
              <ul className="space-y-3">
                {COVERS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-sm font-bold flex-shrink-0" style={{ color: "#f97316" }}>✓</span>
                    <span className="text-base leading-relaxed" style={{ color: "#cbd5e1" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* You'll leave with */}
            <div className="mb-8 pb-8">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#f97316" }}>
                You&apos;ll leave with
              </p>
              <ul className="space-y-3">
                {TAKEAWAYS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-sm font-bold flex-shrink-0" style={{ color: "#f97316" }}>✓</span>
                    <span className="text-base leading-relaxed" style={{ color: "#cbd5e1" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Format options — In Person vs Virtual */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1 border border-zinc-700 rounded-xl p-5 bg-zinc-900/60">
                <div className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">In Person</div>
                <p className="text-base text-zinc-400 leading-relaxed">We bring lunch and present at your office. Perfect for municipalities, engineering firms, and landscape architects.</p>
              </div>
              <div className="flex-1 border border-zinc-700 rounded-xl p-5 bg-zinc-900/60">
                <div className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">Virtual</div>
                <p className="text-base text-zinc-400 leading-relaxed">Join online from anywhere. We&apos;ll send a SkipTheDishes gift card so you can eat along with us.</p>
              </div>
            </div>

          </motion.div>

          {/* ── RIGHT — form card ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "#ffffff" }}
          >
            {submitted ? (
              <div className="text-center py-16 px-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(249,115,22,0.12)" }}
                >
                  <svg className="w-7 h-7" style={{ color: "#f97316" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#111827" }}>You&apos;re on the list!</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  We&apos;ll be in touch within one business day to confirm your session.
                </p>
              </div>
            ) : (
              <>
                {/* Card header */}
                <div className="px-8 pt-8 pb-6" style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <h3 className="text-xl font-bold" style={{ color: "#111827" }}>
                    Schedule Your Free Lunch &amp; Learn
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    We&apos;ll confirm within one business day.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                  {/* Full Name + Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Full Name</label>
                      <input
                        type="text" required placeholder="Jane Smith"
                        value={form.name} onChange={(e) => set("name", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all min-h-[48px] text-base"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Organization</label>
                      <input
                        type="text" required placeholder="City of Vancouver"
                        value={form.org} onChange={(e) => set("org", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all min-h-[48px] text-base"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Email</label>
                      <input
                        type="email" required placeholder="jane@city.ca"
                        value={form.email} onChange={(e) => set("email", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all min-h-[48px] text-base"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Phone</label>
                      <input
                        type="tel" placeholder="604-555-0100"
                        value={form.phone} onChange={(e) => set("phone", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all min-h-[48px] text-base"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Topics of interest */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-hint)" }}>Topics of Interest</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'StreetPrint Patterns',
                        'Colour Systems',
                        'Installation & Application',
                        'Maintenance & Longevity',
                        'Specification & Budgeting',
                        'Municipal Case Studies',
                      ].map((topic) => (
                        <label key={topic} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="topics"
                            value={topic}
                            className="w-4 h-4 accent-orange-500 rounded"
                          />
                          <span className="text-sm text-zinc-500 group-hover:text-zinc-700 transition-colors">{topic}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button
                    type="submit" disabled={loading}
                    className="w-full font-bold py-4 rounded-xl text-base mt-2 transition-all disabled:opacity-60 hover:brightness-110 min-h-[48px]"
                    style={{ background: "linear-gradient(90deg, #f97316, #f59e0b)", color: "#fff" }}
                  >
                    {loading ? "Sending…" : "Reserve Your Session →"}
                  </button>

                  <p className="text-center text-zinc-500 text-sm mt-2">
                    Have a different question?{' '}
                    <Link href="/contact" className="text-orange-500 hover:text-orange-400 underline underline-offset-4 transition-colors">
                      Send us a message
                    </Link>
                  </p>
                </form>
              </>
            )}
          </motion.div>

        </div>
      </div>


      {/* Moose — standing on the CTA bar's top border */}
      <div
        className="absolute z-10 hidden sm:block pointer-events-none"
        style={{ bottom: 64, right: 40, width: 216, height: 216 }}
      >
        <Image
          src="/images/lunch-learn/moose.png"
          alt="HUB Surface Systems Moose mascot"
          width={216}
          height={216}
          style={{
            filter: "drop-shadow(0 0 32px rgba(249,115,22,0.25)) drop-shadow(0 8px 24px rgba(0,0,0,0.45))",
            display: "block",
          }}
          unoptimized
        />
      </div>

      {/* ── Bottom CTA bar ──────────────────────────────────── */}
      <div style={{ background: "#0f1420", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            Book your session at{" "}
            <a href="/lunch-learn" className="font-semibold transition-colors hover:text-white" style={{ color: "#f97316" }}>hubss.com/lunch-learn</a>
            {" "}— or fill out the form above.
          </p>
        </div>
      </div>
    </section>
  );
}
