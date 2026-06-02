import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = {
  ...buildMetadata({
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist. Browse our products, applications, or get in touch.",
    slug: "404",
  }),
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main style={{ background: "#070b12", minHeight: "100vh" }}>
      <Nav />
      <section
        style={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 1.25rem",
        }}
      >
        <div style={{ maxWidth: 640, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#F97316",
              marginBottom: 18,
            }}
          >
            404 · Off the road map
          </p>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              fontWeight: 900,
              color: "#F5F0EB",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 18px",
            }}
          >
            This page took a{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #F97316, #EAB308)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              detour.
            </span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#9CA3AF",
              lineHeight: 1.65,
              margin: "0 0 36px",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            The page you were looking for has moved or never existed. Try one of the routes below — or call your regional office.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <Link
              href="/"
              style={{
                padding: "12px 22px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
              }}
            >
              Back to home →
            </Link>
            <Link
              href="/products"
              style={{
                padding: "12px 22px",
                borderRadius: 10,
                background: "transparent",
                color: "#F5F0EB",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              Browse products
            </Link>
            <Link
              href="/contact"
              style={{
                padding: "12px 22px",
                borderRadius: 10,
                background: "transparent",
                color: "#F5F0EB",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              Contact us
            </Link>
          </div>

          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", fontSize: 13, color: "#6B7280" }}>
            <span>West Office · Cleve Stordy · 604-309-8212</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
            <span>East Office · Doug Bain · 416-540-9287</span>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
