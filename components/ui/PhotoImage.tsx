"use client";

import Image, { type ImageProps } from "next/image";
import { isSanityImage, sanityLoader } from "@/lib/photos";
import { withFilename } from "@/lib/image-filename";

/**
 * next/image for any photo, from Sanity or /public.
 *
 * A Sanity photo gets the Sanity CDN loader, so its srcset is built from
 * cdn.sanity.io URLs and /_next/image is never called. A /public photo renders
 * exactly as a plain next/image did.
 *
 * A Sanity photo's URLs carry its descriptive filename (lib/sanity-image.ts):
 * `filename`, the photo's own words where the caller has them (a card whose
 * alt is empty beside its headline, a gallery tile whose alt counts "photo 3
 * of 36"), else the alt. The loader keeps the name on every size.
 *
 * It's a client component because a loader is a function, and a server
 * component can't pass a function to next/image. Server pages pass plain
 * props; this attaches the loader.
 */
export default function PhotoImage({ filename, ...props }: ImageProps & { filename?: string | null }) {
  const src = typeof props.src === "string" ? props.src : "";
  if (!isSanityImage(src)) return <Image {...props} />;
  return <Image {...props} src={withFilename(src, filename ?? props.alt)} loader={sanityLoader} />;
}
