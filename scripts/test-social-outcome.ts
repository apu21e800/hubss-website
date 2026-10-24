/**
 * Tests for the daily social job's decisions (lib/social-outcome.ts):
 * `npm run test:social`. No network: Buffer, Sanity and the email are never
 * called here.
 *
 * What they protect: an article is only done with (its socialLog kept) when a
 * draft reached Buffer, when it never could, or after GIVE_UP_DAYS of
 * refusals, so a bad run (an expired key, a disconnected channel, a refusal)
 * doesn't use the article up and a stuck one can't retry for ever; and every
 * failure email names the right key and says what to do.
 */
import assert from "node:assert/strict";
import { BufferApiError } from "../lib/buffer";
import {
  daysSince,
  decideOutcome,
  failureHint,
  GIVE_UP_DAYS,
  isConflict,
  NO_CHANNELS,
  unusableReason,
  type SkipKind,
} from "../lib/social-outcome";
import { typedSocialWords } from "../lib/social-pipeline";
import { contactLeft } from "../lib/field-note-drafter";

let failures = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${err instanceof Error ? err.message : err}`);
  }
}

const skips = (...kinds: SkipKind[]) => kinds.map((kind) => ({ kind }));
const RECENT = 1;
const OLD = GIVE_UP_DAYS + 1;

console.log("Done with the article (its log is kept)");
check("one draft made, the others refused", () => assert.equal(decideOutcome(1, skips("retry", "retry"), null), "drafted"));
check("drafts on every channel", () => assert.equal(decideOutcome(3, [], null), "drafted"));
check("drafts after weeks of failures are still just drafted", () => assert.equal(decideOutcome(2, [], OLD), "drafted"));
check("nothing could ever be drafted (YouTube, Instagram with no photo)", () => assert.equal(decideOutcome(0, skips("lasting", "lasting"), null), "nothing-possible"));
check(`failing for more than ${GIVE_UP_DAYS} days since the first try: gave up`, () => assert.equal(decideOutcome(0, skips("retry", "retry"), OLD), "gave-up"));

console.log("Not done: the claim is dropped, the next daily run tries again");
check("every channel refused (a bad key, a schema change)", () => assert.equal(decideOutcome(0, skips("retry", "retry", "retry"), null), "retry"));
check("YouTube skipped and the rest refused", () => assert.equal(decideOutcome(0, skips("lasting", "retry"), null), "retry"));
check("every channel disconnected", () => assert.equal(decideOutcome(0, skips("retry"), RECENT), "retry"));
check(`on day ${GIVE_UP_DAYS} of failing it still retries`, () => assert.equal(decideOutcome(0, skips("retry"), GIVE_UP_DAYS), "retry"));
// The review case (9 Oct): an article first tried weeks after it went live
// (Buffer switched on late, or a long outage) is never given up on its first
// failure. The clock is the first failure, not the article's date.
check("a first failure is always a retry, however old the article", () => assert.equal(decideOutcome(0, skips("retry"), null), "retry"));

console.log("Days since a date");
const now = new Date("2026-10-21T14:00:00Z");
check("a date alone", () => assert.equal(Math.floor(daysSince("2026-10-07", now)), 14));
check("a full timestamp", () => assert.equal(Math.floor(daysSince("2026-10-07T04:49:22.814Z", now)), 14));
check("a date that can't be read counts as now", () => assert.equal(daysSince("soon", now), 0));
check("a date in the future counts as now", () => assert.equal(daysSince("2026-11-01", now), 0));

console.log("Another run has the article (Sanity refused the claim)");
check("409 from Sanity", () => assert.equal(isConflict(Object.assign(new Error("Conflict"), { statusCode: 409 })), true));
check("the 'already exists' wording", () => assert.equal(isConflict(new Error('Document by ID "socialLog-x" already exists')), true));
check("any other refusal is not a conflict", () => assert.equal(isConflict(Object.assign(new Error("Forbidden"), { statusCode: 403 })), false));

console.log("Channels Buffer can't post to");
check("a disconnected channel says to reconnect it", () => assert.match(unusableReason({ isDisconnected: true }) ?? "", /reconnect/));
check("a locked channel says why", () => assert.match(unusableReason({ isLocked: true }) ?? "", /plan/));
check("a healthy channel is usable", () => assert.equal(unusableReason({ isDisconnected: false, isLocked: false }), null));
check("fields Buffer didn't send count as healthy", () => assert.equal(unusableReason({}), null));

console.log("What the failure email tells the editors to do");
const BUFFER_KEY = /publish\.buffer\.com\/settings\/api/;
check("Buffer's real 401 (a bad key): make a new key", () =>
  assert.match(failureHint(new BufferApiError("Buffer API 401: Access token is not valid (UNAUTHENTICATED)", 401)), BUFFER_KEY));
check("401 in a channel's reason: make a new key", () => assert.match(failureHint(new Error("Buffer API 401: Unauthorized")), BUFFER_KEY));
check("UNAUTHENTICATED code on a 200: make a new key", () => assert.match(failureHint(new BufferApiError("Buffer API 200: Invalid token (UNAUTHENTICATED)", 200)), BUFFER_KEY));
check("a plain string works too", () => assert.match(failureHint("Buffer API 403: Forbidden"), BUFFER_KEY));
check("no usable channel: connect them", () => assert.match(failureHint(new Error(`${NO_CHANNELS} (connected: youtube).`)), /Connect HUB's channels/));
check("a disconnected channel: reconnect it", () => assert.match(failureHint(new Error("disconnected in Buffer: reconnect it there")), /Reconnect/));
check("a locked channel: the plan", () => assert.match(failureHint(new Error("locked by Buffer: the account has more channels than its plan allows")), /upgrade/));
check("rate limit: nothing to do", () => assert.match(failureHint(new BufferApiError("Buffer rate limit; retry after 60 s", 429)), /next daily run/));
check("one missing setting is named", () => assert.match(failureHint(new Error("Not configured: ANTHROPIC_API_KEY")), /^ANTHROPIC_API_KEY is missing in Vercel/));
check("two missing settings are named", () =>
  assert.match(failureHint(new Error("Not configured: ANTHROPIC_API_KEY, SANITY_API_WRITE_TOKEN")), /^ANTHROPIC_API_KEY and SANITY_API_WRITE_TOKEN are missing/));
check("the Buffer key gone from Vercel", () => assert.match(failureHint(new Error("BUFFER_API_KEY is not set")), /^BUFFER_API_KEY is missing in Vercel/));
check("Buffer not answering: nothing to do", () => assert.match(failureHint(new BufferApiError("Buffer API unreachable: The operation was aborted due to timeout", 0)), /didn't answer/));
check("anything else: the error and the logs", () => assert.match(failureHint(new Error("socket hang up")), /Logs/));
check("a refused draft that isn't about the key: the logs", () => assert.match(failureHint(new Error("Buffer refused the draft: Text is too long")), /Logs/));

// The other keys the job uses, with the errors their clients really throw
// (captured 9 Oct 2026 with a fake key each): never blamed on Buffer.
const anthropic401 = Object.assign(
  new Error('401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":null}'),
  { status: 401 }
);
const sanityWrite401 = Object.assign(new Error("Unauthorized - Session not found"), { statusCode: 401 });
const sanityRead401 = new Error('Sanity query "all posts" failed: Unauthorized - Session not found');
check("Anthropic's 401: its own key", () => {
  const hint = failureHint(anthropic401);
  assert.match(hint, /ANTHROPIC_API_KEY/);
  assert.doesNotMatch(hint, BUFFER_KEY);
});
check("Sanity's 401 on the job's write: the write token", () => {
  const hint = failureHint(sanityWrite401);
  assert.match(hint, /SANITY_API_WRITE_TOKEN/);
  assert.doesNotMatch(hint, BUFFER_KEY);
});
check("Sanity's 401 on the site's read: the read token", () => {
  const hint = failureHint(sanityRead401);
  assert.match(hint, /SANITY_API_READ_TOKEN/);
  assert.doesNotMatch(hint, /WRITE/);
});

console.log("A customer's details keep the posts as drafts (24 Oct 2026)");
const fieldPost = (place: string, alt?: string) => ({
  stream: "From the field" as const,
  title: `StreetBond in ${place}`,
  imageAlt: alt,
  source: { text: `Where: ${place}.\nSystem: StreetBond.\nWhat the crew says: Two coats over the driveway.` },
});
check("a job post's place is read as typed", () => {
  const lines = contactLeft(typedSocialWords(fieldPost("the smiths, 1234 main st, Milton")));
  assert.deepEqual(lines.map((l) => l.label), ["Photo description", "Job post, Where", "Job post"]);
});
check("a Where with a house number and no street type holds them too", () =>
  assert.deepEqual(contactLeft(typedSocialWords(fieldPost("1234 Lakeshore, Toronto", "A red driveway"))).map((l) => l.label), ["Job post, Where"]));
check("a photo's alt text with a phone number holds the posts", () =>
  assert.equal(contactLeft(typedSocialWords(fieldPost("Milton, Ontario", "Call 905-555-0123 for a quote"))).length, 1));
check("a clean job post holds nothing", () => assert.deepEqual(contactLeft(typedSocialWords(fieldPost("Milton, Ontario", "A red StreetBond driveway"))), []));
check("an article's own words aren't read again, only its photo's description", () => {
  const words = typedSocialWords({ stream: "Article", title: "A cooler path in Osoyoos", imageAlt: "The path in Sandstone", source: { text: "At 407 Elgin Street in Brantford." } });
  assert.deepEqual(words.map((w) => w.label), ["Photo description"]);
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll passed");
