import { initBotId } from "botid/client/core";

// Vercel BotID: an invisible check that a form was sent from a real browser
// on this site (6 Oct 2026, the spam Doug was getting; lib/form-screen.ts has
// the whole story). Every form on the site posts to /api/contact, and the
// route calls checkBotId() before it reads a word. This file runs once in the
// browser before the page is interactive; it adds the proof to those requests
// and touches nothing else.
initBotId({
  protect: [{ path: "/api/contact", method: "POST" }],
});
