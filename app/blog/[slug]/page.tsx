import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import LunchLearnCard from "@/components/sections/LunchLearnCard";
import JsonLd from "@/components/ui/JsonLd";
import { LIVE_POSTS, getPost, getRelatedPosts, type Post } from "@/lib/blog";
import { TYPE_BY_LABEL, sectionFor, type InsightsSection } from "@/lib/field-notes-taxonomy";
import { PRODUCT_SLUGS, postFocus } from "@/components/blog/PostConversion";
import SystemsInPost from "@/components/blog/SystemsInPost";
import { buildMetadata } from "@/lib/seo";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ShareButtons from "@/components/blog/ShareButtons";
import PostBody from "@/components/blog/PostBody";
import PhotoImage from "@/components/ui/PhotoImage";
import { isSanityImage, sanityOgImage, sanitySized } from "@/lib/photos";
import { focalObjectPosition, formatPostDate } from "@/lib/blog-taxonomy";

/**
 * The posts this deployment built (lib/blog-index.json, from Sanity) are the
 * only posts. Any other slug is a real 404.
 *
 * Left at the default (true), an unknown slug was rendered on demand, and the
 * response was already committed as a 200 before notFound() ran. The root
 * app/loading.tsx puts every page behind a Suspense boundary, so the shell
 * streams first. Measured on production, Sep 2026: /blog/<anything> returned
 * 200 with the site-default title and robots "index, follow", which made every
 * dead link an indexable page. Set to false, Next answers an unknown slug from
 * the route table with a 404 before anything renders. /catalogue/[page]
 * already works this way.
 *
 * Nothing legitimate needs a slug the build didn't know about. A post that is
 * new in Studio starts a rebuild when it's published (app/api/revalidate), and
 * appears with that deployment. A Studio draft is never built.
 */
export const dynamicParams = false;

// LIVE_POSTS leaves out the archived posts (lib/field-notes-taxonomy.ts), whose
// addresses next.config.ts redirects to the posts that replaced them.
export async function generateStaticParams() {
  return LIVE_POSTS.map((p) => ({ slug: p.slug }));
}

/**
 * A featured photo narrower than this is not stretched across the hero (QA
 * rest#13): the White Rock Pier photo is 206 px wide and was blown up to
 * 1440, and seventeen more under 1200 px looked soft. Those get the inset
 * hero below.
 */
const FULL_BLEED_MIN_WIDTH = 1200;

/**
 * The reading column: 17 px type on a desktop (16 on a phone) and a measure
 * of about 70 characters. Everything that lines up with the article (the
 * share row, the Lunch & Learn card below lg, the systems rail and the
 * conversion block) takes the same pair, since `ch` is measured in the
 * element's own font size.
 *
 * 56ch, not 70ch (QA D24, 30 Sep 2026: "the body runs about 85–90 characters
 * per line at 1440"). `ch` is the width of Inter's zero, 10.7 px at 17 px,
 * and running text averages 8.3 px a character, so 70ch (751 px) set 90
 * characters a line. 56ch is 601 px, about 72 characters a line.
 */
const MEASURE: CSSProperties = { maxWidth: "56ch", fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)" };

/**
 * The hero photograph's alt: Studio's alt for the featured image when it says
 * something the title does not, else the title (QA D21, 30 Sep 2026: "the
 * hero img alt is the post title"). Checked against Sanity on 30 Sep 2026: 73
 * of 74 posts carry the title itself as the image's alt (the import copied it
 * across), so on those the two are the same string either way. A real
 * description of the photo is typed into the featured image's alt in Studio;
 * nothing here invents one.
 */
function heroAlt(post: Post): string {
  const alt = post.featuredImageAlt?.trim();
  const title = post.title.trim();
  return alt && alt.toLowerCase() !== title.toLowerCase() ? alt : title;
}

/**
 * The section label, title and meta line, the same over either hero.
 *
 * The label sits directly over the title (28 Sep 2026). At the top of the
 * photo it covered whatever the photo was of: on a phone it sat on the
 * TORONTO of the Toronto Premium Outlets sign. It is also the way into the
 * section, so the reader can reach the rest of that kind in one click. One
 * label only (Vern, 28 Sep 2026): the tag chips that sat beside it went with
 * the product chips on the cards. It keeps its solid dark backing: orange
 * straight onto a photograph fails contrast on a pale one (QA rest#19).
 */
function HeroTitle({ post, section }: { post: Post; section: InsightsSection }) {
  return (
    <>
      <Link
        href={`/blog/${section.slug}`}
        className="group -my-2 mb-2 inline-flex items-center"
        style={{ minHeight: 44, textDecoration: "none" }}
      >
        <span
          className="transition-colors group-hover:border-orange-400"
          style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", lineHeight: 1,
            textTransform: "uppercase", color: "#FB923C",
            background: "rgba(10,10,10,0.72)",
            border: "1px solid rgba(249,115,22,0.45)",
            padding: "7px 12px 6px", borderRadius: 4,
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
          }}
        >
          {section.singular}
        </span>
      </Link>
      <h1
        style={{
          fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)",
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          color: "var(--text-primary)",
          marginBottom: "1.25rem",
          maxWidth: "22em",
          textShadow: "0 2px 20px rgba(0,0,0,0.4)",
        }}
      >
        {post.title}
      </h1>
      {/* "Sep 8, 2026", as the cards print it (docs/STYLE.md). Each dot
          travels with the item after it, so a phone never ends a line on one. */}
      <div style={{ display: "flex", alignItems: "center", columnGap: 16, rowGap: 8, flexWrap: "wrap", fontSize: 13, color: "var(--ink-70)", lineHeight: 1 }}>
        {[formatPostDate(post.date), post.readTime, "HUB Surface Systems"].map((item, i) => (
          // The byline from sm up: every post is HUB's, and on a phone it
          // pushed the line to a second row.
          <span key={i} className={i === 2 ? "hidden sm:inline-flex" : "inline-flex"} style={{ alignItems: "center", gap: 16, whiteSpace: "nowrap", letterSpacing: i === 0 ? "0.02em" : undefined }}>
            {i > 0 && <span aria-hidden="true" style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(249,115,22,0.7)", display: "block", flexShrink: 0 }} />}
            {item}
          </span>
        ))}
      </div>
    </>
  );
}

type Props = { params: Promise<{ slug: string }> };

/**
 * The share card's 1200 x 630 crop, held on Studio's focal point when there
 * is one (Sanity's crop=focalpoint), so a link preview of the Toronto Premium
 * Outlets post shows the sign, as the hero does.
 */
function ogImage(src: string, hotspot: Post["featuredImageHotspot"]): string {
  const url = new URL(sanityOgImage(src));
  if (hotspot) {
    url.searchParams.set("crop", "focalpoint");
    url.searchParams.set("fp-x", hotspot.x.toFixed(3));
    url.searchParams.set("fp-y", hotspot.y.toFixed(3));
  }
  return url.toString();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    slug: `blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    image: post.featuredImage && isSanityImage(post.featuredImage) ? ogImage(post.featuredImage, post.featuredImageHotspot) : post.featuredImage,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const postUrl = `https://hubss.com/blog/${post.slug}`;
  const type = TYPE_BY_LABEL[post.category] ?? TYPE_BY_LABEL["Blog"];
  const section = sectionFor(post.category);
  // The system the post is about, or its subject: the "See StreetPrint"
  // button, the order of the systems rail and every Lunch & Learn topic.
  const { system, topic } = postFocus(post);

  /**
   * Article schema, typed by content kind (Aug 2026).
   *
   * Every post used to emit a bare `Article` with five properties. Search
   * engines and AI answer engines both read this graph to decide what a page
   * IS and whether it is worth citing — a TechArticle carrying keywords, a
   * word count, a declared section, and links to the products it discusses is
   * a far stronger candidate for a specification query than an untyped
   * Article that could be anything. `speakable` marks the passages an
   * assistant should read aloud when answering from this page.
   */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": type.schemaType,
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: section.plural,
    wordCount: post.wordCount,
    inLanguage: "en-CA",
    isAccessibleForFree: true,
    ...(post.keywords.length ? { keywords: post.keywords.join(", ") } : {}),
    ...(post.keywords.length
      ? { about: post.keywords.map((k) => ({ "@type": "Thing", name: k })) }
      : {}),
    // A mention is a pointer, not a product listing. These used to be typed
    // "Product", so Google checked every one for price, reviews or a rating,
    // which a blog post can't carry: 53 of the 67 invalid Product snippets in
    // Search Console (Sep 2026) were blog mentions. The product itself is
    // described once, on its own page; the url here links the two.
    ...(post.products.length
      ? {
          mentions: post.products
            .filter((n) => PRODUCT_SLUGS[n])
            .map((n) => ({
              "@type": "Thing",
              name: n,
              url: `https://hubss.com/products/${PRODUCT_SLUGS[n]}`,
            })),
        }
      : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".blog-prose > p:first-of-type"],
    },
    author: { "@type": "Organization", name: "HUB Surface Systems", url: "https://hubss.com" },
    publisher: {
      "@type": "Organization",
      name: "HUB Surface Systems",
      logo: { "@type": "ImageObject", url: "https://hubss.com/images/hub-official-logo.svg" },
    },
    isPartOf: { "@type": "Blog", "@id": "https://hubss.com/blog#blog", name: "HUB Surface Systems Insights" },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    url: postUrl,
    image: post.featuredImage
      ? (isSanityImage(post.featuredImage) ? sanitySized(post.featuredImage, 1200) : `https://hubss.com${post.featuredImage}`)
      : "https://hubss.com/images/og-default.jpg",
  };

  // Breadcrumb passes through the section, so the trail matches the site's
  // real shape and each section accumulates internal link equity.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Insights", item: "https://hubss.com/blog" },
      { "@type": "ListItem", position: 3, name: section.plural, item: `https://hubss.com/blog/${section.slug}` },
      { "@type": "ListItem", position: 4, name: post.title, item: postUrl },
    ],
  };

  const hero = post.featuredImage;
  const heroW = post.featuredImageWidth;
  const heroH = post.featuredImageHeight;
  const inset = !!hero && !!heroW && !!heroH && heroW < FULL_BLEED_MIN_WIDTH;
  const focus = focalObjectPosition(post.featuredImageHotspot, heroW, heroH);
  // The inset photo is shown at its own size or smaller, never enlarged:
  // at most 520 x 440 beside the title, the column's width on a phone.
  const insetScale = inset ? Math.min(1, 520 / heroW!, 440 / heroH!) : 1;
  const insetW = inset ? Math.round(heroW! * insetScale) : 0;

  return (
    // Paper under a dark hero, like the rest of the site (Vern, 28 Sep 2026):
    // data-surface="paper" re-scopes the colour tokens for everything below
    // the hero, which keeps the dark set through data-hero.
    <main data-surface="paper" className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Nav />

      {inset ? (
        /* ── Inset hero ──────────────────────────
           A photo under 1200 px wide, shown sharp at its own size beside the
           title, over a blurred wash of its own colours (Sanity's 20 px
           preview, stretched and blurred), rather than enlarged to the width
           of the screen. */
        // No minimum height below lg: on a phone the photo and the title set
        // it, so a small photo doesn't float above a gap.
        <header data-hero className="relative w-full overflow-hidden lg:min-h-[max(68vh,460px)]" style={{ background: "var(--bg-dark)" }}>
          <div className="absolute inset-0" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- a blurred wash, not a photo to optimise */}
            <img
              src={post.featuredImageLqip ?? sanitySized(hero!, 64, 50)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "blur(36px) saturate(1.15)", transform: "scale(1.3)" }}
            />
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,13,22,0.96) 0%, rgba(8,13,22,0.74) 40%, rgba(8,13,22,0.48) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(8,13,22,0.55) 0%, transparent 70%)" }} />

          {/* Photo first on a phone, then the title; side by side from lg,
              the title held to the foot of the hero as on a full-bleed one. */}
          <div
            className="relative max-w-7xl mx-auto px-6 pt-8 pb-12 sm:pt-12 sm:pb-14 flex flex-col justify-between gap-7 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-14"
            style={{ minHeight: "inherit" }}
          >
            <figure
              className="m-0 w-full lg:col-start-2 lg:row-start-1 lg:self-center lg:w-[var(--inset-w)]"
              style={{ maxWidth: insetW, "--inset-w": `${insetW}px` } as CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Sanity's CDN sizes it; see lib/photos.ts */}
              <img
                src={sanitySized(hero!, Math.min(heroW!, 1040))}
                srcSet={[insetW, insetW * 2]
                  .map((w) => Math.min(w, heroW!))
                  .filter((w, i, a) => a.indexOf(w) === i)
                  .map((w) => `${sanitySized(hero!, w)} ${w}w`)
                  .join(", ")}
                sizes={`(max-width: 1023px) min(calc(100vw - 48px), ${insetW}px), ${insetW}px`}
                alt={heroAlt(post)}
                width={heroW}
                height={heroH}
                fetchPriority="high"
                className="block h-auto w-full hero-pop"
                style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.16)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
              />
            </figure>
            <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
              <HeroTitle post={post} section={section} />
            </div>
          </div>
        </header>
      ) : (
        /* ── Full-bleed hero ───────────────────── */
        <header data-hero className="relative w-full overflow-hidden" style={{ height: "68vh", minHeight: 460 }}>
          {hero ? (
            // containerType: the focal point (Studio's hotspot) is placed
            // against this box's own size; see focalObjectPosition (QA rest#29).
            <div className="absolute inset-0" style={{ containerType: "size" }}>
              <PhotoImage
                src={hero}
                alt={heroAlt(post)}
                fill
                className="object-cover hero-pop"
                style={focus ? { objectPosition: focus } : undefined}
                priority
                sizes="100vw"
              />
            </div>
          ) : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-card) 100%)" }} />
          )}

          {/* Dark only where the title sits: the foot of the hero and the
              left edge. The old scrim was 75% black a third of the way up
              and 30% at the middle, which greyed the photograph (Doug, 28 Sep
              2026: colour, but not overkill). */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(8,13,22,0.94) 0%, rgba(8,13,22,0.62) 28%, rgba(8,13,22,0.16) 58%, rgba(8,13,22,0.06) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(90deg, rgba(8,13,22,0.5) 0%, transparent 58%)"
          }} />

          {/* Label, title and meta, anchored to the bottom */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-7xl mx-auto px-6 pb-12 sm:pb-14">
              <HeroTitle post={post} section={section} />
            </div>
          </div>
        </header>
      )}

      {/* ── Orange accent divider ────────────────────── */}
      <div style={{ height: 2, background: "linear-gradient(90deg, #F97316 0%, #EAB308 50%, transparent 100%)" }} />

      {/* ── Article + sidebar ───────────────────── */}
      {/* The sidebar column takes some of the room the shorter measure gives
          back: 360 px, from 320 (QA D24, 30 Sep 2026). */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10 lg:grid lg:gap-16" style={{ gridTemplateColumns: "minmax(0, 1fr) 360px" }}>
        {/* A container, so a wide table (PostBody) can take the column's full
            width (100cqw) past the text's measure before it has to scroll. */}
        <div className="min-w-0" style={{ containerType: "inline-size" }}>
          {/* data-blog-content is what TableOfContents looks for. It was missing
              until Sep 2026, so the sidebar's "On this page" never appeared.
              Plain `prose`, never prose-invert: the plugin's colours point at
              the tokens (app/globals.css), so the type reads dark on paper. */}
          <article
            data-blog-content
            className="blog-prose prose"
            style={MEASURE}
          >
            {/* The standfirst: the excerpt, set as a magazine sets one,
                larger than the body and upright (30 Sep 2026, editorial pass;
                it was italic behind an orange bar), then the body. */}
            {post.excerpt && (
              <p
                className="standfirst"
                style={{
                  fontSize: "clamp(1.15rem, 1.05rem + 0.35vw, 1.3rem)",
                  lineHeight: 1.55,
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  marginBottom: "2.25rem",
                  textWrap: "pretty",
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* The body, from Sanity. PostBody never renders a second h1: the
                title above is the page's only one (44 of the old posts restated
                it as a `# ` heading; the import dropped those, and a Heading 1
                typed in Studio comes out as an h2). */}
            <PostBody body={post.body} lunchLearnTopic={topic} />
          </article>

          {/* Sharing, after the last paragraph and out of the way. */}
          <div className="mt-12 pt-5" style={{ ...MEASURE, borderTop: "1px solid var(--border-color)" }}>
            <ShareButtons url={postUrl} title={post.title} />
          </div>

          {/* Below lg there is no sidebar: the Lunch & Learn comes straight
              after the article, never before it. */}
          <div className="mt-8 lg:hidden" style={MEASURE}>
            <LunchLearnCard topic={topic} from="insights" layout="row" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          {/* The "HUB Surface Systems · Insights" author card that sat here
              went on 28 Sep 2026 (Vern: "not sure we need this section on the
              blog posts"). The publisher is still in the post's schema.org
              markup; on the page the byline under the title says who wrote it.

              Contents and the Lunch & Learn stay in view while the article
              scrolls. The card replaced the Share block (X, Facebook,
              Instagram) on 28 Sep 2026: Vern, "the social callout is not that
              great here". It is held to the bottom of the sticky column and
              the contents scroll inside theirs if a post has many sections,
              so the card is never pushed off the screen. */}
          <div className="sticky flex flex-col gap-6" style={{ top: "6rem", maxHeight: "calc(100vh - 7.5rem)" }}>
            <div className="min-h-0 overflow-y-auto scrollbar-hide">
              <TableOfContents />
            </div>
            <div className="flex-shrink-0">
              <LunchLearnCard topic={topic} from="insights" />
            </div>
          </div>
        </aside>
      </div>

      {/* ── Systems rail ──────── */}
      {/* In the reading column's line and measure, so the page reads down one
          edge instead of stepping in to a centred box. The typed conversion
          block that followed it went on 30 Sep 2026: with the Lunch & Learn
          card beside the article and the band before the footer, it was the
          third ask for the same session on one page. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div style={MEASURE}>
          <SystemsInPost products={post.products} primary={system} />
        </div>
      </div>

      {/* ── Related posts ──────────────────────── */}
      <div style={{ borderTop: "1px solid var(--border-color)", background: "var(--bg-section-asphalt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <RelatedPosts posts={related} currentSlug={post.slug} />
        </div>
      </div>

      <LunchLearn compact topic={topic} from="insights" />
      <Footer />
    </main>
  );
}
