"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * A link that fetches its page ahead only once the visitor reaches for it: a
 * pointer over it, a finger on it, or the keyboard's focus. Until then it
 * fetches nothing.
 *
 * Why (13 Nov 2026, measured on hubss.com): a plain Link fetches its page as
 * soon as it is within 200px of the screen, and the page's first photographs
 * come with it. The home page's three entry cards sit just under the first
 * screen. On a phone the first flick of the page brought 414 KB for pages the
 * visitor had not opened, 356 KB of it the three card photographs of
 * /products. A tablet (228 KB) and a laptop (149 KB) fetched theirs as the
 * page opened.
 *
 * Use it for links that sit near a first screen and lead to a page with
 * photographs at its top. Next's own guide calls this hover-triggered
 * prefetch (node_modules/next/dist/docs/01-app/02-guides/prefetching.md);
 * `null` hands the link back to the default once there is intent.
 */
export default function IntentLink({
  onMouseEnter,
  onTouchStart,
  onFocus,
  ...rest
}: Omit<ComponentProps<typeof Link>, "prefetch">) {
  const [reached, setReached] = useState(false);
  return (
    <Link
      {...rest}
      prefetch={reached ? null : false}
      onMouseEnter={(e) => {
        setReached(true);
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        setReached(true);
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        setReached(true);
        onFocus?.(e);
      }}
    />
  );
}
