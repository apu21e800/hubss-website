import type { Metadata } from "next";

const BASE_URL = "https://hubss.com";
const SITE_NAME = "HUB Surface Systems";
const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

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

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
