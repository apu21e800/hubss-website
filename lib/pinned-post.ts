/** What pinnedPost reads of a post (lib/blog.ts PostMeta has all three). */
export interface PinFields {
  pinned?: boolean;
  /** ISO time the switch went on (sanity/components/PinToTopInput.tsx). */
  pinnedAt?: string;
  /** YYYY-MM-DD. */
  date: string;
}

/**
 * The pinned post (3 Nov 2026): Studio's "Pin to top". One shows at a time:
 * of the pinned posts, the one pinned last (`pinnedAt`, stamped when the
 * switch goes on); a pin with no stamp (set outside the form) ranks below
 * any stamped one, newest post first. Undefined when nothing is pinned, and
 * the pages then lead as before. The homepage blog section and /blog put it
 * first, with a "Pinned" label, and leave it out of the rest of the list.
 */
export function pinnedPost<T extends PinFields>(posts: T[]): T | undefined {
  const stamp = (p: T) => (p.pinnedAt ? Date.parse(p.pinnedAt) || 0 : 0);
  let best: T | undefined;
  for (const p of posts) {
    if (!p.pinned) continue;
    if (!best || stamp(p) > stamp(best) || (stamp(p) === stamp(best) && p.date > best.date)) best = p;
  }
  return best;
}
