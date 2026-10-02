import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";
import { fieldTemplates, borderTemplates, patternSrc, type PatternTemplate } from "@/lib/pattern-templates";

export const metadata: Metadata = buildMetadata({
  title: "StreetPrint Pattern Library · Stamping Templates",
  // Under 155 characters since 30 Sep 2026 (QA E1 flagged 176).
  description:
    "Sixteen dimensioned StreetPrint stamping templates: herringbone, offset brick, ashlar slate, cobble, tiles and border courses, as pressed into asphalt.",
  slug: "patterns",
});

/**
 * SectionHead — the catalogue's page-heading archetype (Templates spreads,
 * p21–p24): a small brand dot beside a wide-tracked eyebrow, the display
 * title, then a hairline brand rule across the measure.
 */
function SectionHead({
  eyebrow,
  title,
  count,
  children,
}: {
  eyebrow: string;
  title: string;
  count?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="inline-block rounded-full flex-shrink-0"
          style={{ width: 5, height: 5, background: "#F97316" }}
          aria-hidden="true"
        />
        <p
          className="text-[0.7rem] font-semibold uppercase"
          style={{ letterSpacing: "0.2em", color: "var(--text-secondary)" }}
        >
          {eyebrow}
        </p>
        {count && (
          <span
            className="text-[0.7rem] font-semibold uppercase ml-auto"
            style={{ letterSpacing: "0.14em", color: "var(--text-muted)" }}
          >
            {count}
          </span>
        )}
      </div>

      <h2
        className="font-black"
        style={{
          color: "var(--text-primary)",
          fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          textWrap: "balance",
        }}
      >
        {title}
      </h2>

      <div
        className="mt-5 mb-6"
        style={{ height: 1, background: "var(--ink-14)" }}
        aria-hidden="true"
      />

      {children}
    </div>
  );
}

function TemplateCard({ t, wide = false }: { t: PatternTemplate; wide?: boolean }) {
  return (
    <div
      id={t.slug}
      className="rounded-xl overflow-hidden scroll-mt-24"
      style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--ink-08)" }}
    >
      <div className="p-4 sm:p-5">
        {/* pattern-sheet: the drawings are white line-art for the dark
            ground; on the paper surface below the hero the class prints
            them in charcoal, as the StreetPrint page already did, so the
            dimensions read (QA B27, B28, 30 Sep 2026). */}
        <Image
          src={patternSrc(t)}
          alt={`${t.name}, StreetPrint stamping template, dimensioned drawing`}
          width={1600}
          height={1238}
          className="w-full h-auto pattern-sheet"
          sizes={wide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      </div>
      <div className="px-5 pb-4 pt-1" style={{ borderTop: "1px solid var(--ink-06)" }}>
        <p className="font-semibold text-sm pt-3" style={{ color: "var(--text-primary)" }}>{t.name}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{t.note}</p>
      </div>
    </div>
  );
}

export default function PatternsPage() {
  return (
    <main>
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-36 pb-12" style={{ background: "var(--bg-dark)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="inline-block rounded-full flex-shrink-0"
              style={{ width: 6, height: 6, background: "#F97316" }}
              aria-hidden="true"
            />
            <p
              className="text-[0.72rem] font-semibold uppercase"
              style={{ letterSpacing: "0.22em", color: "var(--text-secondary)" }}
            >
              StreetPrint templates
            </p>
          </div>
          <h1
            className="font-black"
            style={{ color: "var(--text-primary)", fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.02, letterSpacing: "-0.035em" }}
          >
            The pattern library.
          </h1>
          <div
            className="mt-6 mb-6"
            style={{ height: 1, background: "var(--ink-16)" }}
            aria-hidden="true"
          />
          <p className="text-base sm:text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Sixteen stamping templates, shown as installed, dimensioned to the inch. Flexible
            templates press the pattern into warm asphalt; StreetBond colour locks it in. Every
            field pattern combines with every border course, plus fully custom designs.
          </p>
        </div>
      </section>

      {/* Under the dark hero the library sits on paper, as the product and
          application pages do (QA B27: white lines on near-black cards here,
          charcoal on paper on the StreetPrint page, for the same drawings). */}
      <div data-surface="paper">
      {/* ── Field templates ─────────────────────────────────── */}
      <section className="py-16" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Field templates"
            title="The pattern across the surface."
            count={`${fieldTemplates.length} patterns`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fieldTemplates.map((t) => <TemplateCard key={t.slug} t={t} />)}
          </div>
        </div>
      </section>

      {/* ── Border templates ────────────────────────────────── */}
      <section className="pb-16" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Border templates"
            title="Tile and brick borders."
            count={`${borderTemplates.length} patterns`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {borderTemplates.map((t) => <TemplateCard key={t.slug} t={t} wide />)}
          </div>

          {/* CTA */}
          <div
            className="mt-12 rounded-xl p-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:justify-between"
            style={{ background: "var(--bg-card)", border: "1px solid var(--ink-08)" }}
          >
            <div>
              <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                Custom patterns, cut to order.
              </p>
              <p className="text-sm mt-1 max-w-xl" style={{ color: "var(--text-secondary)" }}>
                Logos, cultural art, wayfinding, one-off geometry: if it can be drawn, it can be
                pressed into the street. See the system behind the patterns, or talk to a specialist.
              </p>
            </div>
            {/* On phones the two buttons stack, full width: side by side each
                label wrapped to two lines (QA, 28 Sep 2026). */}
            <div className="flex flex-col gap-3 flex-shrink-0 sm:flex-row">
              <Link
                href="/products/streetprint"
                className="px-5 py-2.5 rounded-lg text-sm font-bold transition-colors inline-flex items-center justify-center whitespace-nowrap min-h-[44px]"
                style={{ background: "var(--bg-card-surface)", color: "var(--text-primary)", border: "1px solid var(--ink-10)" }}
              >
                StreetPrint system
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-lg text-sm font-bold inline-flex items-center justify-center whitespace-nowrap min-h-[44px]"
                style={{ background: "linear-gradient(90deg, #F97316, #EAB308)", color: "#101010" }}
              >
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>

      <Footer />
    </main>
  );
}
