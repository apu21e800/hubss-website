import type { Metadata } from "next";

const BASE_URL = "https://hubss.com";
const SITE_NAME = "HUB Surface Systems";
const DEFAULT_OG_IMAGE = "/images/hero/hero-1.jpg";

// Keyword-rich title suffix for better SERP context
const TITLE_SUFFIX = "HUBSS";

// Clamp helpers — avoid truncation in SERPs
const clampTitle = (str: string, max = 60) =>
  str.length > max ? str.slice(0, str.lastIndexOf(" ", max - 3)) + "…" : str;
const clampDesc = (str: string, max = 155) =>
  str.length > max ? str.slice(0, str.lastIndexOf(" ", max - 3)) + "…" : str;

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
  const fullTitle = `${title} | ${TITLE_SUFFIX}`;
  const clampedTitle = clampTitle(fullTitle);
  const clampedDesc = clampDesc(description);

  return {
    title: clampedTitle,
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
