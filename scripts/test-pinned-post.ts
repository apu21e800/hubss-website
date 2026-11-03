/**
 * `npm run test:pin`: Studio's "Pin to top" (3 Nov 2026). pinnedPost picks
 * the post pinned last and ignores unpinned posts.
 */
import assert from "node:assert/strict";
import { pinnedPost } from "../lib/pinned-post";

const post = (slug: string, date: string, pin?: { at?: string }) => ({
  slug,
  date,
  ...(pin ? { pinned: true as const, pinnedAt: pin.at } : {}),
});

// Nothing pinned: no pin, and the pages lead as before.
assert.equal(pinnedPost([post("a", "2026-10-30"), post("b", "2026-10-14")]), undefined);

// One pin, anywhere in the list.
assert.equal(pinnedPost([post("a", "2026-10-30"), post("b", "2026-01-01", { at: "2026-11-03T12:00:00Z" })])?.slug, "b");

// Two pins: the one pinned last wins, whatever the post's own date.
assert.equal(
  pinnedPost([
    post("old-pin", "2026-10-30", { at: "2026-11-01T12:00:00Z" }),
    post("new-pin", "2026-01-01", { at: "2026-11-03T12:00:00Z" }),
  ])?.slug,
  "new-pin"
);

// A pin with no stamp ranks below any stamped one; two unstamped: the newer post.
assert.equal(pinnedPost([post("bare", "2026-10-30", {}), post("stamped", "2026-01-01", { at: "2026-11-03T12:00:00Z" })])?.slug, "stamped");
assert.equal(pinnedPost([post("older", "2026-01-01", {}), post("newer", "2026-10-30", {})])?.slug, "newer");

console.log("pinned post: 5 checks passed");
