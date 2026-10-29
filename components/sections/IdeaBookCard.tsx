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
 * The picture is two of the book's pages, the cover laid over an inside page
 * (27 Oct 2026, evening; Vern: "maybe the book graphic could be two of the
 * booklet pages (cover & another one stacked on top of and beside each
 * other)", and the callout "a bit less vertical height"). The inside page is
 * p.129, the Bear Creek Park waterpark (StreetBond), the book's most colourful
 * spread and one of the jobs on the map. Both are the book's own rasters,
 * plain <img>s that never route through /_next/image (lib/catalogue.ts); each
 * offers its 240px thumbnail to a 1x or 2x screen. On a pointer that hovers,
 * the two pages fan apart a little when the card is pointed at.
 */
const INSIDE_PAGE = 129;

export default function IdeaBookCard({ copy = HOMEPAGE_COPY.ideaBook }: { copy?: HomepageCopy["ideaBook"] }) {
  if (!showCatalogue() || !catalogueReady) return null;
  const width = catalogue.widths[0];
  const height = Math.round(width / catalogue.aspect);
  const coverSet = [catalogue.coverThumb ? `${catalogue.coverThumb} 240w` : null, `${cataloguePageUrl(1, width)} ${width}w`].filter(Boolean).join(", ");
  // The inside page's 240px thumbnail too (scripts/gen-catalogue-pages.mjs,
  // PAGE_THUMBS): 11 KB where the 800px raster was 82 KB for a 110px page.
  const insideSet = `${cataloguePageUrl(INSIDE_PAGE, 240)} 240w, ${cataloguePageUrl(INSIDE_PAGE, width)} ${width}w`;

  return (
    // No background of its own and not positioned: it would paint over the
    // Lunch & Learn card's shadow above it and cut it in a line (the light
    // theme showed one). The card itself is positioned, so it sits over that
    // shadow, and its own shadow ends inside the padding below, before the
    // light topics section (with 32px of padding it fell there as a smudge).
    <section aria-labelledby="ll-book" data-surface="shell" className="pt-2 pb-16 sm:pb-20 lg:pt-4 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="ll-book relative overflow-hidden rounded-3xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 18px 50px rgba(0,0,0,0.3)" }}
        >
          <div className="grid grid-cols-1 items-center gap-5 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-7">
            <div className="flex justify-center lg:col-span-2 lg:justify-start">
              {/* The stack: the inside page behind, up and to the right, the
                  cover over it. The box is the two pages' footprint, so the
                  grid measures it; the turns are small enough to stay in it. */}
              <div className="ll-book-stack relative h-[124px] w-[166px] sm:h-[134px] sm:w-[180px] lg:h-[146px] lg:w-[196px]">
                <img
                  src={cataloguePageUrl(INSIDE_PAGE, width)}
                  srcSet={insideSet}
                  sizes="(min-width: 1024px) 118px, (min-width: 640px) 108px, 100px"
                  alt="An inside page of the book: StreetBond at the Bear Creek Park waterpark, Surrey, British Columbia"
                  width={width}
                  height={height}
                  loading="lazy"
                  decoding="async"
                  className="ll-book-page absolute right-0 top-0 block h-auto w-[100px] rounded-[4px] sm:w-[108px] lg:w-[118px]"
                  style={{ border: "1px solid var(--ink-12)", boxShadow: "0 10px 24px rgba(0,0,0,0.38)" }}
                />
                <img
                  src={cataloguePageUrl(1, width)}
                  srcSet={coverSet}
                  sizes="(min-width: 1024px) 124px, (min-width: 640px) 114px, 106px"
                  alt={`${ideaBook.title} cover`}
                  width={width}
                  height={height}
                  loading="lazy"
                  decoding="async"
                  className="ll-book-cover absolute bottom-0 left-0 block h-auto w-[106px] rounded-[4px] sm:w-[114px] lg:w-[124px]"
                  style={{ border: "1px solid var(--ink-12)", boxShadow: "0 16px 36px rgba(0,0,0,0.5)" }}
                />
              </div>
            </div>

            <div className="min-w-0 text-center lg:col-span-7 lg:text-left">
              {/* The volume only from sm up, as the homepage strip does: on a
                  phone the eyebrow wrapped at the dot. */}
              <p className="eyebrow">
                {ideaBook.short}
                <span className="hidden sm:inline">{DOT}{ideaBook.volume}</span>
              </p>
              <h2 id="ll-book" className="h2-sub mt-2.5 text-balance" style={{ color: "var(--text-primary)" }}>
                {copy.heading}
              </h2>
              <p className="mx-auto mt-2.5 max-w-xl text-base leading-relaxed lg:mx-0" style={{ color: "var(--ink-70)" }}>
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
