import { initBotId } from "botid/client/core";

// Vercel BotID: an invisible check that a form was sent from a real browser
// on this site (6 Oct 2026, the spam Doug was getting; lib/form-screen.ts has
// the whole story). Every form on the site posts to /api/contact through
// lib/post-form.ts, and the route asks BotID about each one before reading it.
//
// initBotId wraps window.fetch and XMLHttpRequest on every page (Studio
// included) but only acts on POSTs to /api/contact. The unwrapped fetch is
// kept first, so a form can still send if BotID's script can't load
// (lib/post-form.ts).
(window as unknown as { __hubssFetch?: typeof fetch }).__hubssFetch = window.fetch.bind(window);

initBotId({
  protect: [{ path: "/api/contact", method: "POST" }],
});
