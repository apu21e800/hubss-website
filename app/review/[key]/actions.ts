"use server";

/**
 * The one thing the review page can change (lib/review-first.ts): Vern's
 * button that puts an item on Doug's page or takes it off. Only with Vern's
 * key (sent in the form; Doug's page has no buttons, and his key is refused
 * here). It publishes nothing and posts nothing:
 *  - an article: `forReview` on its unpublished draft, the same field as the
 *    "Ready for Doug's review" tick in Studio;
 *  - a group of social posts: a private record (reviewTickId), never the
 *    Sent to Buffer record itself, which stays the pipeline's.
 * Every other id is refused before Sanity is asked. Next checks that the
 * request comes from this site's own page (server actions refuse another
 * origin), and the log line names the item, never the key.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sanityWriteClient } from "@/lib/sanity.write";
import { reviewAudience, reviewTickId } from "@/lib/review-first";
import { anchorFor } from "@/lib/review-page";

/** An unpublished draft's id, as Sanity makes them for a blog post. */
const ARTICLE_ID = /^drafts\.[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/;
/** A Sent to Buffer record's key (an article slug, lib:..., field:...) or post:<Buffer id>. */
const GROUP_KEY = /^[A-Za-z0-9][A-Za-z0-9:._-]{0,199}$/;

export async function setOnDougsPage(formData: FormData): Promise<void> {
  const key = formData.get("key");
  if (reviewAudience(key) !== "agency") {
    console.warn("[review] a button press without Vern's key was refused");
    return;
  }
  const kind = formData.get("kind");
  const id = String(formData.get("id") ?? "");
  const on = formData.get("on") === "1";
  const client = sanityWriteClient();
  if (kind === "article" && ARTICLE_ID.test(id)) {
    const doc = await client.getDocument(id);
    if (doc?._type === "blogPost") {
      await client.patch(id).set({ forReview: on }).commit();
      console.log(`[review] ${id} ${on ? "put on" : "taken off"} Doug's page`);
    }
  } else if (kind === "social" && GROUP_KEY.test(id)) {
    const tickId = reviewTickId(id);
    if (on) await client.createIfNotExists({ _id: tickId, _type: "reviewTick", groupKey: id, at: new Date().toISOString() });
    else await client.delete(tickId);
    console.log(`[review] social posts for ${id} ${on ? "put on" : "taken off"} Doug's page`);
  } else {
    console.warn("[review] a button press for an item the page doesn't have was refused");
  }
  // Back to the card, which now says where it stands: the page is drawn
  // again from Sanity (revalidatePath; a redirect to the same page with only
  // a new #card is a scroll to the router, which would keep the old page),
  // and without scripts the redirect turns the POST into a plain GET.
  revalidatePath(`/review/${key as string}`);
  redirect(`/review/${key as string}#${anchorFor(kind === "social" ? "social" : "article", id)}`);
}
