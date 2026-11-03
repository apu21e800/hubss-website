/**
 * "Pin to top" on a blog post (3 Nov 2026; Vern: "Pin to top ... One pinned
 * post at a time: store pinnedAt automatically; the site uses the newest pin").
 *
 * The switch is Sanity's own. This input only watches it: switched on here,
 * it stamps `pinnedAt` with the moment; switched off, it clears it. The stamp
 * goes into the draft with the switch, so it travels through any way the
 * post goes live (Publish, or the daily run's scheduled publish). Only a
 * change made in this form counts: opening a post that is already pinned
 * writes nothing.
 *
 * The site reads both fields (lib/blog.ts, pinnedPost): of the pinned posts,
 * the one with the latest `pinnedAt` leads the homepage section and /blog.
 */
import { useEffect, useRef } from "react";
import { getPublishedId, useDocumentOperation, useFormValue, type BooleanInputProps } from "sanity";

export default function PinToTopInput(props: BooleanInputProps) {
  const id = useFormValue(["_id"]) as string | undefined;
  const pinnedAt = useFormValue(["pinnedAt"]) as string | undefined;
  const { patch } = useDocumentOperation(getPublishedId(id ?? ""), "blogPost");
  const on = props.value === true;
  // The value when the form opened; only a change after that writes.
  const last = useRef(on);

  useEffect(() => {
    if (last.current === on) return;
    last.current = on;
    if (!id) return;
    if (on && !pinnedAt) patch.execute([{ set: { pinnedAt: new Date().toISOString() } }]);
    if (!on && pinnedAt) patch.execute([{ unset: ["pinnedAt"] }]);
  }, [on, pinnedAt, id, patch]);

  return props.renderDefault(props);
}
