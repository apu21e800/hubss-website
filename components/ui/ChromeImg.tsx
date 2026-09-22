import type { ImgHTMLAttributes } from "react";
import { CHROME_FAMILIES, chromeImage } from "@/lib/chrome-images.mjs";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  /** Size family from lib/chrome-images.mjs — sets the crop and the srcset rungs. */
  family: keyof typeof CHROME_FAMILIES;
  /** The ORIGINAL source path, e.g. a product's imageUrl. */
  src: string;
  alt: string;
  /** The rendered CSS width, so the browser picks the right rung. */
  sizes: string;
};

/**
 * An image in the shared chrome — nav menus, mobile drawer, footer, Lunch &
 * Learn card — served as a plain <img srcset> over files that
 * scripts/gen-chrome-images.mjs baked at build time. It never goes through
 * /_next/image: in August 2026 the optimiser allowance ran out and every
 * optimised image on the site answered 402. See lib/chrome-images.mjs.
 *
 * Lazy and async by default, as next/image was. No "use client": the footer
 * renders it on the server, the nav in the browser.
 */
export default function ChromeImg({ family, src, ...rest }: Props) {
  const baked = chromeImage(family, src);
  // eslint-disable-next-line @next/next/no-img-element -- deliberate, see above
  return <img loading="lazy" decoding="async" {...rest} src={baked.src} srcSet={baked.srcSet} />;
}
