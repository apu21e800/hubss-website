import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

// buildMetadata gives every page a canonical and "index, follow". On the 404
// page both contradicted the noindex Next adds, and the canonical claimed a
// /404 URL that doesn't exist. A missing page should name no canonical and ask
// not to be indexed.
//
// 30 Sep 2026 (QA F21: "the 404 carries two robots metas and og:url
// https://hubss.com/404"): Next writes its own `noindex` on every not-found
// render, so a robots entry here printed a second one. robots is null (Next's
// stands alone) and the share card names no URL, since /404 is not one.
const notFoundMeta = buildMetadata({
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist. Browse our products, applications, or get in touch.",
  slug: "404",
});
export const metadata: Metadata = {
  ...notFoundMeta,
  openGraph: { ...notFoundMeta.openGraph, url: undefined },
  alternates: { canonical: null },
  robots: null,
};

export default function NotFound() {
  return (
    <main style={{ background: "var(--bg-deepest)", minHeight: "100vh" }}>
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
              color: "var(--accent-text-lg)",
              marginBottom: 18,
            }}
          >
            404 · Off the road map
          </p>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              fontWeight: 900,
              color: "var(--text-primary)",
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
              color: "var(--text-muted)",
              lineHeight: 1.65,
              margin: "0 0 36px",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            The page you were looking for has moved or never existed. Try one of the routes below, or call your regional office.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <Link
              href="/"
              style={{
                padding: "12px 22px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "var(--on-accent)",
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
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid var(--ink-18)",
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
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid var(--ink-18)",
              }}
            >
              Contact us
            </Link>
          </div>

          {/* One line with a dot between from md up; stacked, with no dot,
              below it. Wrapped, the West line kept a trailing dot (QA, 28 Sep
              2026). */}
          <div className="flex flex-col items-center gap-1.5 md:flex-row md:justify-center md:gap-6" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            <span>West Office · Cleve Stordy · 604-309-8212</span>
            <span className="hidden md:inline" aria-hidden="true" style={{ color: "var(--ink-15)" }}>·</span>
            <span>East Office · Doug Bain · 416-540-9287</span>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
