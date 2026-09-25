import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import PrintedCopyForm from "@/components/catalogue/PrintedCopyForm";
import { buildMetadata } from "@/lib/seo";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";

export const metadata = buildMetadata({
  title: `Request a Printed ${ideaBook.short}`,
  description: `Have ${ideaBook.title} mailed to your office - every HUB Surface Systems decorative pavement system, application and specification, in the book our specifiers keep on the shelf.`,
  slug: "request-idea-book",
});

export default function RequestIdeaBookPage() {
  const cover = catalogueReady ? cataloguePageUrl(1, catalogue.widths[1] ?? catalogue.widths[0]) : null;

  return (
    <main className="min-h-screen" data-surface="paper">
      <Nav />

      <section className="mx-auto max-w-6xl px-6 pt-32 pb-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent-text)" }}>
              {ideaBook.short} · {ideaBook.volume}
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl" style={{ color: "var(--text-primary)" }}>
              Request a printed {ideaBook.short}
            </h1>
            <p className="mb-8 max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
              Tell us where to send it. The printed edition is what our specifiers keep on the shelf - every system,
              every application, and the specification language that goes with them.
            </p>

            <PrintedCopyForm />
          </div>

          <aside className="lg:pt-14">
            {cover && (
              <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border-color)", background: "var(--bg-card-neutral)" }}>
                {/* A plain img: the book's rasters are already the exact sizes
                    they are shown at and must not route through /_next/image. */}
                <img
                  src={cover}
                  alt={`${ideaBook.title} cover`}
                  width={catalogue.widths[1] ?? catalogue.widths[0]}
                  height={Math.round((catalogue.widths[1] ?? catalogue.widths[0]) / catalogue.aspect)}
                  className="h-auto w-full"
                />
              </div>
            )}
            <div className="mt-5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <p className="mb-3">
                <strong style={{ color: "var(--text-primary)" }}>{ideaBook.title}.</strong> Decorative pavement
                solutions, coast to coast.
              </p>
              {catalogueReady && (
                <p className="mb-2">
                  <Link href={ideaBook.href} className="font-semibold underline" style={{ color: "var(--accent-text)" }}>
                    Read it online now
                  </Link>{" "}
                  while you wait for the post.
                </p>
              )}
              {catalogue.download && (
                <p>
                  <a href={catalogue.download.href} download={ideaBook.fileName} className="font-semibold underline" style={{ color: "var(--accent-text)" }}>
                    Download the PDF
                  </a>{" "}
                  <span style={{ color: "var(--text-hint)" }}>({catalogue.download.label})</span>
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
