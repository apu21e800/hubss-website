"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";


interface FormState {
  name: string;
  email: string;
  company: string;
  city: string;
  phone: string;
}

interface SubmitState {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

export default function LunchLearn({ hideMoose: _hideMoose }: { hideMoose?: boolean } = {}) {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    city: "",
    phone: "",
  });

  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState({ status: "loading" });

    try {
      const response = await fetch("/api/lunch-learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      setSubmitState({
        status: "success",
        message: "Thank you! We'll be in touch soon to schedule your Lunch & Learn session.",
      });
      setFormData({ name: "", email: "", company: "", city: "", phone: "" });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: "Something went wrong. Please try again or contact us directly.",
      });
    }
  };

  const contactImg = { src: "/images/products/streetbond/streetbond-112.jpg", alt: "HUB Surface Systems Lunch and Learn — decorative pavement products presentation" };
  const mooseImg = { src: "/images/lunch-learn/moose-final.png", alt: "HUB Surface Systems mascot moose" };

  return (
    <section className="bg-dot-grid-blue relative overflow-hidden py-20 lg:py-28">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content + Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
                Education &amp; Engagement
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-5"
                style={{
                  background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Lunch &amp; Learn at Your Location
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#9CA3AF" }}>
                Bring the team together. We'll deliver a personalized session covering product selection, installation best practices, and ROI — with lunch included.
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-4 mb-10">
              {[
                "30–45 minute presentation tailored to your projects",
                "Live Q&A with HUB technical team",
                "Sample materials and specification sheets",
                "Lunch &amp; refreshments included",
              ].map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "#f97316" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: "#F5F0EB" }}>{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F5F0EB",
                  }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F5F0EB",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="company"
                  placeholder="Company or organization"
                  value={formData.company}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F5F0EB",
                  }}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F5F0EB",
                  }}
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#F5F0EB",
                }}
              />

              <button
                type="submit"
                disabled={submitState.status === "loading"}
                className="w-full px-6 py-3.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
                }}
              >
                {submitState.status === "loading" ? "Sending..." : "Request Lunch & Learn"}
              </button>

              {submitState.status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg"
                  style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}
                >
                  <p style={{ color: "#86efac" }}>{submitState.message}</p>
                </motion.div>
              )}

              {submitState.status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  <p style={{ color: "#fca5a5" }}>{submitState.message}</p>
                </motion.div>
              )}
            </motion.form>
          </motion.div>

          {/* Right: Moose mascot + product image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex items-end justify-center"
          >
            {/* Product image background card */}
            <div
              className="relative rounded-2xl overflow-hidden w-full"
              style={{
                aspectRatio: "4/5",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              <Image
                src={contactImg.src}
                alt={contactImg.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Orange overlay at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{ background: "linear-gradient(to top, rgba(249,115,22,0.4), transparent)" }}
              />
            </div>

            {/* Moose mascot — bottom right, peeking up */}
            <div
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{ width: "55%", transform: "translateX(8%) translateY(4%)" }}
            >
              <Image
                src={mooseImg.src}
                alt={mooseImg.alt}
                width={320}
                height={400}
                className="w-full h-auto drop-shadow-2xl"
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Decorative glow */}
            <div
              className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
