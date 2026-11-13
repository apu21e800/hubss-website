"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * A link that fetches its page ahead only once the visitor reaches for it: a
 * pointer over it, a finger on it, or the keyboard's focus. Until then it
 * fetches nothing.
 *
 * Why (13 Nov 2026, measured on hubss.com with a 390x844 phone at 3x): a
 * plain Link fetches its page as soon as it is within 200px of the screen,
 * and the page's first photographs come with it. The home page's three entry
 * cards sit just under the first screen. The /products card brought 13 KB of
 * page and 355 KB of its three card photographs: on an 844px-tall phone it
 * sat 4px outside that distance, so they came with the first scroll; on any
 * taller phone it sat inside, so they came before the visitor had moved.
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
