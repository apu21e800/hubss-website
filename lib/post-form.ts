/**
 * How every form on the site sends (contact, Lunch & Learn, printed Idea
 * Book). Browser code only.
 *
 * Normally through Vercel BotID: instrumentation-client.ts wraps fetch so a
 * request to /api/contact carries proof it came from a real browser. But some
 * browsers can't run that check: a content blocker or a strict office network
 * stops its script, and then BotID's fetch fails at once, or waits for a
 * challenge that never comes (the review of 6 Oct 2026 reproduced both).
 * HUB's customers include city IT departments, so that is not hypothetical.
 *
 * So: give the checked send 15 seconds, longer than the route ever takes,
 * and if it throws or runs out, send again without the check. The route
 * screens those like any other submission (app/api/contact/route.ts, the
 * "unchecked" gate). If that fails too, the form shows its own error, which
 * gives the email address and phone numbers.
 */

const CHECKED_SEND_MS = 15_000;

type Fetch = typeof fetch;

/** The browser's own fetch, saved before BotID wrapped it (instrumentation-client.ts). */
function unwrappedFetch(): Fetch {
  const w = window as unknown as { __hubssFetch?: Fetch };
  return w.__hubssFetch ?? window.fetch.bind(window);
}

export async function postForm(body: Record<string, unknown>): Promise<Response> {
  const payload = JSON.stringify(body);
  const init = (signal?: AbortSignal): RequestInit => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    signal,
  });

  const checked = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      fetch("/api/contact", init(checked.signal)),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("bot check timed out")), CHECKED_SEND_MS);
      }),
    ]);
  } catch {
    // Cancel the checked send first: if BotID's challenge arrives later, its
    // request goes out already aborted, so Doug never gets the message twice.
    checked.abort();
    return unwrappedFetch()("/api/contact", init());
  } finally {
    clearTimeout(timer);
  }
}
