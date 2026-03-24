"use client";

import { useState } from "react";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";

// Note: metadata must be in a server component — defined in layout or a parallel route.
// Page-level metadata for client components requires moving meta to a parent layout.

const projectTypes = [
  "Crosswalk / Pedestrian Safety",
  "Bus & Bike Lane Markings",
  "Decorative Pavement / StreetPrint",
  "Regulatory / Road Markings",
  "Community / Public Art",
  "Parking Lot",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", projectType: "", message: ""
  });

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* Asphalt background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/images/hero/hero-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "rgba(8,8,8,0.88)" }}
      />
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left */}
          <div className="pt-4">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>Get In Touch</p>
            <h1 className="text-5xl font-bold mb-8 leading-tight" style={{ color: "var(--text-primary)" }}>
              Start a Project
            </h1>
            <p className="text-[16px] leading-relaxed mb-12" style={{ color: "var(--text-body)" }}>
              Tell us about your community, your timeline, and your vision. We&apos;ll tell you which surface system brings it to life.
            </p>
            <div className="space-y-8">
              {[
                { region: "East Office", city: "Milton, Ontario", email: "doug.bain@hubss.com", phone: "416-540-9287" },
                { region: "West Office", city: "Ladysmith, BC", email: "cleve.stordy@hubss.com", phone: "604-309-8212" },
              ].map((office) => (
                <div key={office.region}>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#f97316" }}>{office.region}</p>
                  <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>{office.city}</p>
                  <a href={`mailto:${office.email}`} className="text-sm block mb-1 transition-colors hover:text-[#f97316]" style={{ color: "#d1d5db" }}>{office.email}</a>
                  <a href={`tel:${office.phone.replace(/-/g, "")}`} className="text-sm transition-colors hover:text-[#f97316]" style={{ color: "#d1d5db" }}>{office.phone}</a>
                </div>
              ))}

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6 pt-6" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <a
                  href="https://www.linkedin.com/company/hub-surface-systems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/hubsurfacesystems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-xl p-10" style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)" }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(249,115,22,0.15)" }}>
                  <svg className="w-7 h-7" style={{ color: "#f97316" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: "#d1d5db" }}>We&apos;ll be in touch within one business day.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError("");
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...form, formType: "contact", website: "" }),
                    });
                    const data = await res.json();
                    if (!res.ok || data.error) {
                      setError(data.error ?? "Something went wrong. Please try again.");
                    } else {
                      setSubmitted(true);
                    }
                  } catch {
                    setError("Network error. Please check your connection and try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "Jane Smith" },
                    { label: "Company", key: "company", type: "text", placeholder: "City of Toronto" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm mb-2" style={{ color: "#d1d5db" }}>{f.label}</label>
                      <input
                        type={f.type}
                        required
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 min-h-[44px]"
                        style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                      />
                    </div>
                  ))}
                </div>
                {[
                  { label: "Email", key: "email", type: "email", placeholder: "jane@city.ca" },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "416-555-0100" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm mb-2" style={{ color: "#d1d5db" }}>{f.label}</label>
                    <input
                      type={f.type}
                      required={f.key === "email"}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 min-h-[44px]"
                      style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm mb-2" style={{ color: "#d1d5db" }}>Project Type</label>
                  <select
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 min-h-[44px]"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                  >
                    <option value="">Select project type...</option>
                    {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "#d1d5db" }}>Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none focus:ring-1 focus:ring-orange-500"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                  />
                </div>
                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold py-4 rounded-lg text-sm transition-all disabled:opacity-60"
                  style={{ background: "#f97316", color: "#fff" }}
                >
                  {loading ? "Sending..." : "Send Us Your Project"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <LunchLearn />
      <Footer />
    </main>
  );
}
