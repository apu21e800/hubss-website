import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import PhotoImage from "@/components/ui/PhotoImage";
import Link from "next/link";
import { getMergedApplications, type MergedApplication } from "@/lib/applications.server";
import { applicationCatalogueFor } from "@/lib/application-catalogue";
import { APPLICATION_GROUPS, groupId } from "@/lib/application-groups";
import { products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { applicationImages, resolveImage } from "@/lib/featured-images";
import { heroObjectPosition } from "@/lib/hero-framing";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";
import { getSanityPageContent } from "@/lib/sanity.queries";
import { mergeHomepageCopy } from "@/lib/homepage-copy";
import { dotted } from "@/lib/separators";

/* ─────────────────────────────────────────────────────────────────────────────
   /applications: every kind of job, grouped the way the Applications menu
   groups them (lib/application-groups.ts).

   27 Oct 2026 (Vern: "Applications (parent page) does not jive with the rest
   of the website (plus all that text on image looks bad)"): rebuilt in the
   /products page's language. The header with the groups as chips, then one
   band per group, alternating paper and cream, and a card per application
   with the photograph on top and the words under it: the name, the line,
   the systems the Product Portfolio Book specifies for that job, "View
   application". Until then it was nineteen photographs with the name and a
   four-line description laid over a dark scrim.

   COPY. The name and the line are the merged application (Studio first,
   lib/applications.ts the fallback), as before. "Specify" is the book's own
   list for the job (lib/application-catalogue.ts, the printed SPECIFY strip);
   the four jobs with no printed strip (regulatory markings, parks and paths,
   airports, LEED and urban heat island) list the first systems their page
   relates. Product names come from lib/products.ts, never typed here, joined
   with dotted() (lib/separators.ts) so a dot never opens a line. Each group's
   sentence under its heading is `intro` in lib/application-groups.ts.

   PHOTOS. Each card shows the application's own hero (Studio, else
   lib/featured-images.ts), framed by its focal point, so no photo repeats
   between two cards (QA pa#4) and nothing goes through /_next/image
   (QA pa#40).
   ───────────────────────────────────────────────────────────────────────────── */

// Sanity is the CMS for this page's copy, so the page re-reads it hourly,
// matching the product pages.
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Pavement Marking Applications",
  // Under 155 characters since 30 Sep 2026 (QA E1 flagged 173).
  description: "Crosswalks, bus lanes, bike lanes, airports, public art and community branding: HUB surface systems matched to Canadian municipal and commercial work.",
  slug: "applications",
});

const productName = new Map(products.map((p) => [p.slug, p.name]));

/** The systems a card names: the book's SPECIFY strip, else the page's first related systems. At most four. */
function specifyFor(app: MergedApplication): string[] {
  const book = applicationCatalogueFor(app.slug)?.specify?.map((s) => s.slug) ?? [];
  const slugs = book.length ? book : app.relatedProducts.slice(0, 3);
  return slugs.map((s) => productName.get(s)).filter((n): n is string => Boolean(n)).slice(0, 4);
}

function photoFor(app: MergedApplication) {
  const featured = applicationImages[app.slug] ? resolveImage(applicationImages[app.slug]) : null;
  return app.heroPhoto ?? { src: featured?.src ?? app.imageUrl, alt: featured?.alt ?? app.name };
}

const SIZES = {
  three: "(min-width: 1280px) 389px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)",
  two: "(min-width: 1280px) 596px, (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)",
};

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/**
 * A card in five rows of the list's grid, shared through subgrid as on
 * /products: photo, name, line, Specify, link. Every part is always rendered,
 * so the dividers, the Specify labels and the links line up across a row
 * whatever the line above them runs to.
 */
const CARD_ROWS = "row-span-5 grid grid-rows-subgrid gap-0";

function ApplicationCard({ app, sizes, wide, eager }: { app: MergedApplication; sizes: string; wide: boolean; eager: boolean }) {
  const photo = photoFor(app);
  const systems = specifyFor(app);
  return (
    <Link href={`/applications/${app.slug}`} className={`card group bg-[var(--bg-card)] ${CARD_ROWS}`}>
      <div className={`relative overflow-hidden ${wide ? "aspect-[16/10]" : "aspect-[4/3]"}`} style={{ background: "var(--bg-card-surface)" }}>
        <PhotoImage
          src={photo.src}
          alt={photo.alt}
          fill
          // A /public fallback is served as the file itself, never through
          // the optimiser that ran out in Aug 2026.
          unoptimized={!photo.src.startsWith("https://")}
          priority={eager}
          className="card-photo object-cover"
          style={{ objectPosition: heroObjectPosition(photo, "center") }}
          sizes={sizes}
        />
      </div>
      <h3 className="px-5 pt-5 text-xl sm:px-6 sm:pt-6" style={{ color: "var(--text-primary)" }}>
        {app.name}
      </h3>
      <p className="mt-2 px-5 text-[15px] sm:px-6" style={{ color: "var(--text-secondary)", lineHeight: 1.45 }}>
        {app.shortDesc}
      </p>
      <div className="px-5 sm:px-6">
        {systems.length > 0 && (
          <dl className="mt-5 border-t pt-4" style={{ borderColor: "var(--ink-08)" }}>
            <dt className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-faint)" }}>
              Specify
            </dt>
            <dd className="mt-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {dotted(systems)}
            </dd>
          </dl>
        )}
      </div>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <span className="link-arrow link-arrow-sm mt-auto pt-5">
          View application
          {arrow}
        </span>
      </div>
    </Link>
  );
}

/**
 * The Product Portfolio Book, in the slot a group of five leaves empty: the
 * homepage strip's words (Studio first), the cover, and the way in.
 */
function BookTile({ heading, intro }: { heading: string; intro: string }) {
  const width = catalogue.widths[0];
  const cover = catalogue.coverThumb ?? cataloguePageUrl(1, width);
  return (
    <Link href={ideaBook.href} className={`card group bg-[var(--bg-card)] ${CARD_ROWS}`}>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden" style={{ background: "var(--bg-card-surface)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={`${ideaBook.title} cover`}
          width={240}
          height={Math.round(240 / catalogue.aspect)}
          loading="lazy"
          decoding="async"
          className="h-[78%] w-auto rounded-[4px] transition-transform duration-500 group-hover:-rotate-2"
          style={{ border: "1px solid var(--ink-12)", boxShadow: "0 14px 32px rgba(0,0,0,0.28)" }}
        />
      </div>
      <h3 className="px-5 pt-5 text-xl sm:px-6 sm:pt-6" style={{ color: "var(--text-primary)" }}>
        {heading}
      </h3>
      <p className="mt-2 px-5 text-[15px] sm:px-6" style={{ color: "var(--text-secondary)", lineHeight: 1.45 }}>
        {intro}
      </p>
      <div className="px-5 sm:px-6">
        <dl className="mt-5 border-t pt-4" style={{ borderColor: "var(--ink-08)" }}>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-faint)" }}>
            {ideaBook.short}
          </dt>
          <dd className="mt-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {ideaBook.volume}
          </dd>
        </dl>
      </div>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <span className="link-arrow link-arrow-sm mt-auto pt-5">
          Open the {ideaBook.short}
          {arrow}
        </span>
      </div>
    </Link>
  );
}

export default async function ApplicationsPage() {
  const [applications, homePage] = await Promise.all([getMergedApplications(), getSanityPageContent("homepage")]);
  const bySlug = new Map(applications.map((a) => [a.slug, a]));
  const bookOn = showCatalogue() && catalogueReady;
  const bookCopy = mergeHomepageCopy(homePage?.homepageSections).ideaBook;

  const groups = APPLICATION_GROUPS.map((group) => ({
    group,
    id: groupId(group.label),
    apps: group.slugs.map((s) => bySlug.get(s)).filter((a): a is MergedApplication => Boolean(a)),
  })).filter((g) => g.apps.length > 0);

  return (
    <main data-surface="paper" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />

      {/* ── Header: the /products header, word for word in shape ──────── */}
      <header className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Applications</p>
          <h1 className="h1-page mb-4" style={{ color: "var(--text-primary)" }}>
            Pick the job.
          </h1>
          <p className="max-w-2xl text-lg" style={{ color: "var(--text-secondary)" }}>
            A crosswalk, a bus lane and a splash pad each ask something different of the surface.
            Each page names the systems that hold up there, how each goes in, and the certified
            HUB installer who puts it down.
          </p>
        </div>

        <nav aria-label="Application groups" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {groups.map(({ group, id }) => (
              <li key={id}>
                <a href={`#${id}`} className="chip">
                  {group.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* On phones the two links stack, each a 44 px tap target, as on /products. */}
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-0 text-sm font-semibold sm:mt-6 sm:gap-y-3">
          <Link href="/resources" className="link-arrow">
            Spec sheets for every system
            {arrow}
          </Link>
          {bookOn && (
            <Link href={ideaBook.href} className="link-arrow">
              Open the {ideaBook.short}
              {arrow}
            </Link>
          )}
        </div>
      </header>

      {/* ── Groups ─────────────────────────────────────────────────────── */}
      {groups.map(({ group, id, apps }, i) => {
        // A pair gets two wide cards; a group that would leave a gap in its
        // last row of three gets the book in it (Commercial & Sustainability).
        const pair = apps.length === 2;
        const withBook = bookOn && !pair && apps.length % 3 === 2;
        return (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-heading`}
            style={{
              background: i % 2 === 0 ? "var(--bg-section-asphalt)" : "var(--bg-primary)",
              borderTop: "1px solid var(--ink-05)",
            }}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 section-padding">
              <div className="mb-10 max-w-3xl">
                <h2 id={`${id}-heading`} className="h2-section" style={{ color: "var(--text-primary)" }}>
                  {group.label}
                </h2>
                <p className="mt-4 text-base sm:text-lg max-w-prose" style={{ color: "var(--text-secondary)" }}>
                  {group.intro}
                </p>
              </div>

              <ul className={pair ? "grid gap-6 sm:grid-cols-2" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
                {apps.map((app, j) => (
                  <li key={app.slug} className={CARD_ROWS}>
                    <ApplicationCard app={app} sizes={pair ? SIZES.two : SIZES.three} wide={pair} eager={i === 0 && j < 3} />
                  </li>
                ))}
                {withBook && (
                  <li className={CARD_ROWS}>
                    <BookTile heading={bookCopy.heading} intro={bookCopy.intro} />
                  </li>
                )}
              </ul>
            </div>
          </section>
        );
      })}

      <LunchLearn compact from="applications" />
      <Footer />
    </main>
  );
}
