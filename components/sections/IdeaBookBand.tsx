import Link from "next/link";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
import { APPLICATION_CATALOGUE } from "@/lib/application-catalogue";
import { applications } from "@/lib/applications";
import { showCatalogue } from "@/lib/feature-flags";

/**
 * The Idea Book on the homepage: the cover, one line, one button, and four of
 * its spreads.
 *
 * Doug (25 Sep 2026): no Idea Book promotion in the menus, one call to action
 * on the homepage. It sits between the applications and the articles, where a
 * visitor has just seen what the systems can do and wants more ideas.
 *
 * Vern (26 Sep 2026): a band that only announces the book is a section
 * "shoved in"; keep the pattern, but let the book show itself. So under the
 * cover row sit four spreads from the book, the photograph page of each,
 * opening the reader at that spread. They are content, not calls to action:
 * the button is still the one ask.
 *
 * Every picture here is one of the book's own rasters, a plain <img> that
 * never routes through /_next/image (lib/catalogue.ts). The 800px page is
 * about 70 KB; all five are lazy.
 */

// Four spreads, one from each corner of the book: a street, a lane, a piece
// of public art, a driveway. `page` is the spread's text page (where the
// reader opens); the facing page, page + 1, is its photograph.
const SPREADS = ["crosswalks", "bike-lanes", "public-art", "private-driveways"] as const;

export default function IdeaBookBand() {
  if (!showCatalogue() || !catalogueReady) return null;
  const coverWidth = catalogue.widths[0];
  const utm = "utm_source=home&utm_campaign=idea-book";
  const href = `${ideaBook.href}?${utm}&utm_medium=band`;

  const spreads = SPREADS.flatMap((slug) => {
    const entry = APPLICATION_CATALOGUE[slug];
    const app = applications.find((a) => a.slug === slug);
    if (!entry || !app) return [];
    return [{ slug, name: app.name, page: entry.page, photoPage: entry.page + 1 }];
  });

  return (
    <section
      aria-labelledby="idea-book-band-heading"
      data-surface="paper"
      style={{
        background: "var(--bg-dark)",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left lg:gap-12">
          <Link href={href} className="flex-shrink-0" aria-label={`Open ${ideaBook.title}`} tabIndex={-1}>
            <img
              src={cataloguePageUrl(1, coverWidth)}
              alt={`${ideaBook.title} cover`}
              width={coverWidth}
              height={Math.round(coverWidth / catalogue.aspect)}
              loading="lazy"
              decoding="async"
              className="h-40 w-40 rounded-xl object-cover sm:h-44 sm:w-44 lg:h-48 lg:w-48"
              style={{ border: "1px solid var(--ink-12)", boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}
            />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--accent-text-lg)" }}>
              {ideaBook.title}
            </p>
            <h2
              id="idea-book-band-heading"
              className="font-black"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxWidth: "26ch",
              }}
            >
              Every system and every application, in one book.
            </h2>
          </div>

          <Link
            href={href}
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold whitespace-nowrap transition-transform hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
              color: "var(--on-accent)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.30)",
            }}
          >
            Open the {ideaBook.short}
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Four spreads. A swipe row on phones, a row of four from lg. */}
        {spreads.length > 0 && (
          <ul
            className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto -mx-4 px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-12 lg:grid-cols-4"
            style={{ scrollbarWidth: "none" }}
            aria-label={`Spreads from ${ideaBook.title}`}
          >
            {spreads.map((s) => (
              <li key={s.slug} className="w-[64vw] max-w-[300px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none">
                <Link
                  href={`${ideaBook.href}/${s.page}?${utm}&utm_medium=spread&utm_content=${s.slug}`}
                  className="group block"
                  aria-label={`${s.name}, page ${s.page} of the ${ideaBook.short}`}
                >
                  <span
                    className="block overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ border: "1px solid var(--ink-12)", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
                  >
                    <img
                      src={cataloguePageUrl(s.photoPage, coverWidth)}
                      alt={`${s.name}, as printed in ${ideaBook.title}`}
                      width={coverWidth}
                      height={coverWidth}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
                    <span className="text-[14px] font-semibold transition-colors group-hover:text-[var(--accent-text)]" style={{ color: "var(--text-primary)" }}>
                      {s.name}
                    </span>
                    <span className="text-[12px] tabular-nums" style={{ color: "var(--ink-50)" }}>p. {s.page}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
