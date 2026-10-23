/**
 * Documents nobody deletes, unpublishes or copies from Studio (23 Oct 2026,
 * after Square One's Studio). The four pages and Site Settings are one of
 * each, and the site reads them by id. A "Sent to Buffer" record is how the
 * daily social run knows an item is done (lib/social-pipeline.ts reads every
 * socialLog slug), so deleting one has the run post that item to social a
 * second time. Edits are unchanged: the pages and Site Settings are Doug's
 * to edit, and "Sent to Buffer" is read only (sanity/schemas/socialLog.ts).
 * `npm run test:studio` checks it.
 */
export const LOCKED_TYPES: ReadonlySet<string> = new Set(["page", "siteSettings", "socialLog"]);
// "unpublishVersion" is the same Unpublish, set to happen with a release.
export const LOCKED_ACTIONS: ReadonlySet<string> = new Set(["delete", "unpublish", "unpublishVersion", "duplicate"]);

/** The document actions Studio offers for a type, less the locked ones. */
export function withoutLockedActions<T extends { action?: string }>(actions: T[], schemaType: string): T[] {
  return LOCKED_TYPES.has(schemaType) ? actions.filter((a) => !LOCKED_ACTIONS.has(a.action ?? "")) : actions;
}
