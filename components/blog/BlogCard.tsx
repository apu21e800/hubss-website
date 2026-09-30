import Link from "next/link";
import PhotoImage from "@/components/ui/PhotoImage";
import type { PostMeta } from "@/lib/blog";
import { isSanityImage } from "@/lib/photos";
import { sectionFor } from "@/lib/field-notes-taxonomy";
import { clipExcerpt, focalObjectPosition, formatPostDate } from "@/lib/blog-taxonomy";

/**
 * How Insights shows a post, everywhere a post is listed: the /blog front
 * page and library, the section pages, and "Continue reading" under a post.
 *
 * 30 Sep 2026 (Vern: "it's supposed to have an editorial feel, text
 * effective, not text heavy. smart. editorial, blogs should follow suit"):
 * the boxed card with a pill, an excerpt, "Read post" and a read time became
 * what a magazine prints. A photograph, one kicker line (the section and the
 * date) and the headline. No box: the photograph is the object and the page
 * is the ground. The excerpt survives only as the lead story's deck
 * (StoryLead). On a phone a listed post is a row, thumbnail beside headline,
 * so the library scans in a few thumb-lengths instead of seventy photographs.
 */

const FALLBACKS = [
  "/images/applications/crosswalks/crosswalks-01.jpg",
  "/images/applications/traffic-calming/traffic-calming-01.jpg",
  "/images/applications/bus-lanes/bus-lanes-01.jpg",
  "/images/products/streetbond/streetbond-01.png",
  "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
];

function getFallback(slug: string) {
  const hash = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACKS[hash % FALLBACKS.length];
}

/** The photo, its focal point, and whether Sanity's CDN sizes it. */
function photoFor(post: PostMeta) {
  const src = post.featuredImage ?? getFallback(post.slug);
  return {
    src,
    // Sanity photos are sized by Sanity's CDN (PhotoImage); any other
    // outside URL is shown as it is.
    external: src.startsWith("http") && !isSanityImage(src),
    focus: post.featuredImage
      ? focalObjectPosition(post.featuredImageHotspot, post.featuredImageWidth, post.featuredImageHeight)
      : undefined,
  };
}

/**
 * The kicker: the section (in the section's own colour, the way into it on
 * every surface) and the date, "Sep 8, 2026" as docs/STYLE.md prints dates.
 */
export function StoryKicker({ post, className = "" }: { post: PostMeta; className?: string }) {
  const section = sectionFor(post.category);
  return (
    <span className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-bold uppercase tracking-[0.18em] ${className}`}>
      <span style={{ color: section.text }}>{section.singular}</span>
      <span aria-hidden="true" className="h-[3px] w-[3px] rounded-full" style={{ background: "var(--ink-30)" }} />
      <span className="tabular-nums tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
        {formatPostDate(post.date)}
      </span>
    </span>
  );
}

/**
 * A listed post. `size="small"` is the front page's row of four, a step down
 * in type; the default is the library's three across.
 * priority: the first row of a list, which may be the page's largest paint.
 */
export default function BlogCard({
  post,
  priority = false,
  size = "default",
}: {
  post: PostMeta;
  priority?: boolean;
  size?: "default" | "small";
}) {
  const photo = photoFor(post);
  const small = size === "small";
  return (
    <Link href={`/blog/${post.slug}`} className="group flex items-start gap-4 sm:block">
      {/* container-type lets the focal point (lib/blog-taxonomy.ts) measure
          this frame. A 4:3 thumbnail on a phone, 3:2 from sm up. */}
      <span
        className="relative block aspect-[4/3] w-28 flex-shrink-0 overflow-hidden rounded-lg sm:aspect-[3/2] sm:w-auto sm:rounded-xl"
        style={{ containerType: "size", background: "var(--ink-05)" }}
      >
        <PhotoImage
          src={photo.src}
          alt=""
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={photo.focus ? { objectPosition: photo.focus } : undefined}
          sizes={small ? "(max-width: 640px) 112px, (max-width: 1024px) 50vw, 300px" : "(max-width: 640px) 112px, (max-width: 1024px) 50vw, 410px"}
          unoptimized={photo.external}
          priority={priority}
        />
      </span>
      <span className="block min-w-0 sm:mt-4">
        <StoryKicker post={post} />
        {/* Weight, leading and tracking inline: globals.css sets every
            heading's (800, 1.15, -0.025em) over Tailwind's utilities. */}
        <h3
          className={`font-display mt-2 text-balance transition-colors duration-200 group-hover:text-[var(--accent-text)] ${
            small ? "text-[16px] sm:text-[17px]" : "text-[16px] sm:text-[19px]"
          }`}
          style={{ color: "var(--text-primary)", fontWeight: 700, lineHeight: 1.26, letterSpacing: "-0.012em" }}
        >
          {post.title}
        </h3>
      </span>
    </Link>
  );
}

/**
 * The lead story: the photograph at editorial size beside its kicker,
 * headline and deck (the excerpt, cut to one or two lines). The /blog front
 * page and each section page open with one.
 */
export function StoryLead({ post, headingLevel = "h2" }: { post: PostMeta; headingLevel?: "h2" | "h3" }) {
  const photo = photoFor(post);
  const Heading = headingLevel;
  return (
    <Link href={`/blog/${post.slug}`} className="group grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
      <span
        className="relative block aspect-[3/2] overflow-hidden rounded-2xl lg:col-span-7"
        style={{ containerType: "size", background: "var(--ink-05)" }}
      >
        <PhotoImage
          src={photo.src}
          alt=""
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          style={photo.focus ? { objectPosition: photo.focus } : undefined}
          sizes="(max-width: 1024px) 100vw, 720px"
          unoptimized={photo.external}
          priority
        />
      </span>
      <span className="block lg:col-span-5">
        <StoryKicker post={post} />
        <Heading
          className="font-display mt-3 text-balance transition-colors duration-200 group-hover:text-[var(--accent-text)]"
          style={{ color: "var(--text-primary)", fontSize: "clamp(1.6rem, 1.1rem + 1.5vw, 2.4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.025em" }}
        >
          {post.title}
        </Heading>
        {post.excerpt && (
          <span className="mt-4 block text-[16px] leading-relaxed text-pretty" style={{ color: "var(--text-secondary)", maxWidth: "46ch" }}>
            {clipExcerpt(post.excerpt, 150)}
          </span>
        )}
        {/* The brand's one gradient moment on the page: a short rule that
            grows when the story is hovered. */}
        <span
          aria-hidden="true"
          className="mt-6 block h-[2px] w-10 rounded-full transition-[width] duration-500 ease-out group-hover:w-20"
          style={{ background: "var(--gradient-brand)" }}
        />
      </span>
    </Link>
  );
}

/**
 * The lead is the newest post with a photograph big enough to carry it at
 * this size (QA rest#13: a small photo stretched looks soft), else the newest.
 */
export function pickLead<T extends PostMeta>(posts: T[]): T | undefined {
  return (
    posts.find((p) => p.featuredImage && (p.featuredImageWidth ?? 0) >= 1600 && (p.featuredImageHeight ?? 0) >= 1000) ??
    posts[0]
  );
}
