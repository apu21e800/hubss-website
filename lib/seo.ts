import type { Metadata } from "next";

const BASE_URL = "https://hubss.com";
const SITE_NAME = "HUB Surface Systems";
const DEFAULT_OG_IMAGE = "/images/hero/hero-1.jpg";

// Keyword-rich title suffix for better SERP context
const TITLE_SUFFIX = "HUB Surface Systems";

/**
 * Titles: fit the brand suffix, or drop it. Never cut words, never ship "…".
 *
 * The previous helpers were labelled "avoid truncation in SERPs" and did the
 * opposite: they appended " | HUB Surface Systems" and THEN sliced at 65
 * characters, so twelve of the twenty pages shipped a title with the brand
 * name eaten mid-word —
 *
 *     Decorative Pavement & Road Marking Solutions | HUB Surface…
 *     Pavement Case Studies — Canadian Municipal & Commercial…
 *
 * — and the same string went into og:title and twitter:title, where nothing
 * truncates and it simply reads as unfinished on every share.
 *
 * Two corrections. A search engine truncates for display on its own, with its
 * own ellipsis, from the full title; baking one into the markup only removes
 * words it might have shown. And when something has to go, the suffix goes:
 * the brand is already in the domain, in og:site_name and in the JSON-LD, so a
 * complete page title without it beats a clipped one with half of it.
 *
 * A title long enough to overflow on its own is left whole. Google will show
 * what fits; the markup stays clean, and the share card stays complete.
 */
/**
 * 70, not 65. Google renders roughly 600px of title — about 60 characters —
 * and cuts the rest, and what sits at the end is the brand. So the budget is
 * not "what Google shows", it is "how long a title tag may get before the
 * suffix stops being worth carrying". At 65 the homepage came to 66 and lost
 * its brand over one character, which is the wrong trade for the one page
 * where the brand matters most. At 70 the short-titled pages keep it and the
 * long editorial ones stand on their own, which is what they should do.
 */
const TITLE_BUDGET = 70;

const composeTitle = (title: string, suffix: string) => {
  // "About HUB Surface Systems" does not need "| HUB Surface Systems" after
  // it. Three pages name the company in their own title.
  if (title.toLowerCase().includes(suffix.toLowerCase())) return title;
  const withSuffix = `${title} | ${suffix}`;
  return withSuffix.length <= TITLE_BUDGET ? withSuffix : title;
};

interface SeoOptions {
  title: string;
  description: string;
  slug?: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
}

export function buildMetadata({
  title,
  description,
  slug = "",
  type = "website",
  image = DEFAULT_OG_IMAGE,
  publishedTime,
}: SeoOptions): Metadata {
  const url = slug ? `${BASE_URL}/${slug}` : BASE_URL;
  const imageUrl = `${BASE_URL}${image}`;
  const clampedTitle = composeTitle(title, TITLE_SUFFIX);
  // Descriptions go through whole for the same reason: the old 155-character
  // slice appended an ellipsis that Google would have added itself, and put it
  // into og:description too, where the card shows the lot.
  const clampedDesc = description;

  return {
    title: { absolute: clampedTitle },
    description: clampedDesc,
    openGraph: {
      title: clampedTitle,
      description: clampedDesc,
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: clampedTitle,
      description: clampedDesc,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
