import Link from "next/link";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";

/**
 * The Idea Book's one call to action on the homepage.
 *
 * Doug (25 Sep 2026): no Idea Book promotion in the menus, one call to action
 * on the homepage. It sits between the applications and the articles, where a
 * visitor has just seen what the systems can do and wants more ideas: the
 * cover, one line, one button. Nothing else — the band is its own surface, so
 * the orange stays on the button.
 *
 * The cover is a plain <img> from the book's own rasters, which never route
 * through /_next/image (lib/catalogue.ts). The 800px page is 71 KB and shows
 * at about 180px, so it is lazy and needs no srcset.
 */
export default function IdeaBookBand() {
  if (!showCatalogue() || !catalogueReady) return null;
  const coverWidth = catalogue.widths[0];
  const href = `${ideaBook.href}?utm_source=home&utm_medium=band&utm_campaign=idea-book`;

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
      </div>
    </section>
  );
}
