import Link from "next/link";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";

/**
 * The Idea Book's one callout on the homepage: a strip, not a section.
 *
 * Doug (25 Sep 2026): no Idea Book promotion in the menus, one call to action
 * on the homepage, where it makes the most sense. Doug again (26 Sep): "a
 * smart booklet callout, weaved in well, not a big section devoted to it".
 * So the band of 26 Sep (cover, headline, button, four spreads) became this:
 * one row between the applications and the articles, the cover at thumbnail
 * size, the book's name, one line, one link. The whole row is the link. The
 * spreads themselves live in the reader and its contents page.
 *
 * The cover is one of the book's own rasters, a plain <img> that never routes
 * through /_next/image (lib/catalogue.ts); the 800px page is about 70 KB and
 * shows at 64px, so it is lazy and needs no srcset.
 */
export default function IdeaBookBand() {
  if (!showCatalogue() || !catalogueReady) return null;
  const coverWidth = catalogue.widths[0];
  const href = `${ideaBook.href}?utm_source=home&utm_medium=callout&utm_campaign=idea-book`;

  return (
    <section
      aria-label={ideaBook.title}
      data-surface="paper"
      style={{
        background: "var(--bg-dark)",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <Link href={href} className="group flex items-center gap-4 sm:gap-6">
          <img
            src={cataloguePageUrl(1, coverWidth)}
            alt={`${ideaBook.title} cover`}
            width={coverWidth}
            height={Math.round(coverWidth / catalogue.aspect)}
            loading="lazy"
            decoding="async"
            className="h-16 w-16 flex-shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-[72px] sm:w-[72px]"
            style={{ border: "1px solid var(--ink-12)", boxShadow: "0 10px 24px rgba(0,0,0,0.28)" }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent-text-lg)" }}>
              {ideaBook.title}
            </p>
            <p
              className="mt-1 text-[15px] font-bold leading-snug sm:text-[17px]"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
            >
              Every system and every application, in one book.
            </p>
            <p className="mt-0.5 hidden text-[12px] sm:block" style={{ color: "var(--text-secondary)" }}>
              Read it here, save it to your phone, or have the printed copy mailed.
            </p>
          </div>
          <span
            className="inline-flex flex-shrink-0 items-center gap-1.5 text-[13px] font-bold transition-transform group-hover:translate-x-0.5"
            style={{ color: "var(--accent-text)" }}
          >
            <span className="hidden sm:inline">Open the {ideaBook.short}</span>
            <span className="sm:hidden">Open</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
