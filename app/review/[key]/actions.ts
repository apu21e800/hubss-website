"use server";

/**
 * The one thing the review page can change (lib/review-first.ts): Vern's
 * button that puts an item on Doug's page or takes it off. Only with Vern's
 * key (sent in the form; Doug's page has no buttons, and his key is refused
 * here). It publishes nothing and posts nothing:
 *  - an article: `forReview` on its unpublished draft, the same field as
 *    "Send to Doug" in Studio, and Doug's email with it (lib/review-notify.ts);
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
import { clearDougNotice, notifyDoug } from "@/lib/review-notify";

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
      // Doug's email, as "Send to Doug" in the Studio sends it (lib/review-notify.ts).
      // A failure here is the morning run's to retry; the button's work is done.
      try {
        if (on) await notifyDoug(client, id);
        else await clearDougNotice(client, id);
      } catch (err) {
        console.error(`[review] Doug's email for ${id}: ${err instanceof Error ? err.message : err}`);
      }
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
  // again (revalidatePath; a redirect to the same page with only a new #card
  // is a scroll to the router, which would keep the old page), and a press
  // made before scripts load ends as a plain GET of the page.
  revalidatePath(`/review/${key as string}`);
  redirect(`/review/${key as string}#${anchorFor(kind === "social" ? "social" : "article", id)}`);
}
