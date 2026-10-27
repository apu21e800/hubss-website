import Link from "next/link";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";
import { HOMEPAGE_COPY, type HomepageCopy } from "@/lib/homepage-copy";
import { DOT } from "@/lib/separators";

/**
 * The Product Portfolio Book's call to action on /lunch-learn, right under
 * the Lunch & Learn card (27 Oct 2026; Vern: "Doug will want a large CTA, I'd
 * say under the L&L card to the Product Portfolio book"). The MediaEdge
 * display ads of November 2026 land on /lunch-learn: a specifier who isn't
 * ready to book a session can still take the book, printed (the request form,
 * which counts as a lead) or online.
 *
 * The homepage keeps its one-line strip (IdeaBookBand: Doug, 26 Sep 2026, "a
 * smart booklet callout, weaved in well, not a big section devoted to it");
 * this is the large version, for this page. The words are that strip's
 * (Studio's homepage sections, else lib/homepage-copy.ts), so the book is
 * described one way across the site. No "free" for the book, ever.
 *
 * The cover is the book's own 800px raster, a plain <img> that never routes
 * through /_next/image (lib/catalogue.ts). Two paper edges behind it give it
 * the printed book's page block.
 */
export default function IdeaBookCard({ copy = HOMEPAGE_COPY.ideaBook }: { copy?: HomepageCopy["ideaBook"] }) {
  if (!showCatalogue() || !catalogueReady) return null;
  const width = catalogue.widths[0];
  const height = Math.round(width / catalogue.aspect);

  return (
    // No background of its own and not positioned: it would paint over the
    // Lunch & Learn card's shadow above it and cut it in a line (the light
    // theme showed one). The card itself is positioned, so it sits over that
    // shadow, and its own shadow (68px deep) ends inside the padding below,
    // before the light topics section (with 32px it fell there as a smudge).
    <section aria-labelledby="ll-book" data-surface="shell" className="pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 18px 50px rgba(0,0,0,0.3)" }}
        >
          <div className="grid grid-cols-1 items-center gap-7 p-7 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-10">
            <div className="flex justify-center lg:col-span-3 lg:justify-start">
              <div className="relative w-[148px] sm:w-[172px] lg:w-[196px]">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[6px]"
                  style={{ transform: "translate(8px, 8px)", background: "#e9e3d6", border: "1px solid rgba(0,0,0,0.28)" }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[6px]"
                  style={{ transform: "translate(4px, 4px)", background: "#f6f2ea", border: "1px solid rgba(0,0,0,0.22)" }}
                />
                <img
                  src={cataloguePageUrl(1, width)}
                  alt={`${ideaBook.title} cover`}
                  width={width}
                  height={height}
                  loading="lazy"
                  decoding="async"
                  className="relative block h-auto w-full rounded-[6px]"
                  style={{ border: "1px solid var(--ink-12)", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}
                />
              </div>
            </div>

            <div className="min-w-0 text-center lg:col-span-6 lg:text-left">
              {/* The volume only from sm up, as the homepage strip does: on a
                  phone the eyebrow wrapped at the dot. */}
              <p className="eyebrow">
                {ideaBook.short}
                <span className="hidden sm:inline">{DOT}{ideaBook.volume}</span>
              </p>
              <h2 id="ll-book" className="h2-sub mt-3 text-balance" style={{ color: "var(--text-primary)" }}>
                {copy.heading}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed lg:mx-0" style={{ color: "var(--ink-70)" }}>
                {copy.intro}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:col-span-3 lg:flex-col">
              <Link href={ideaBook.requestHref} className="btn-accent">
                Request a printed copy
              </Link>
              <Link href={ideaBook.href} className="btn-ghost">
                Read it online
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
