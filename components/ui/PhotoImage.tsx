"use client";

import Image, { type ImageProps } from "next/image";
import { isSanityImage, sanityLoader } from "@/lib/photos";

/**
 * next/image for any photo, from Sanity or /public.
 *
 * A Sanity photo gets the Sanity CDN loader, so its srcset is built from
 * cdn.sanity.io URLs and /_next/image is never called. A /public photo renders
 * exactly as a plain next/image did.
 *
 * It's a client component because a loader is a function, and a server
 * component can't pass a function to next/image. Server pages pass plain
 * props; this attaches the loader.
 */
export default function PhotoImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  return <Image {...props} loader={isSanityImage(src) ? sanityLoader : props.loader} />;
}
