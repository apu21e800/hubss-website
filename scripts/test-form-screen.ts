/**
 * Tests for the forms' spam screen (lib/form-screen.ts): `npm run test:forms`.
 *
 * The rules only decide when Claude can't answer, but when they do decide
 * they must not hide a customer, so most cases here are genuine enquiries.
 * The spam cases are the ones that reached Doug (Sep and Oct 2026), with the
 * senders' details replaced. No network: the model is never called here.
 */
import assert from "node:assert/strict";
import { describeSubmission, externalLinks, pitchPhrase, screenByRules, type ScreenInput } from "../lib/form-screen";

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

const contact = (message: string, extra: Partial<ScreenInput> = {}): ScreenInput => ({
  formType: "contact",
  name: "Test Person",
  email: "test@example.ca",
  message,
  ...extra,
});

// The two that reached Doug in full, names and addresses replaced.
const SEO_PITCH = `Re: SEO Report

Hello Good Morning,

I was checking your website and see you have a good design and it looks great, but it's not ranking on Google and other major search engines.

With your permission I would like to send you a SEO report with prices showing you a few things to greatly improve these search results for you.`;

const PHISHING = `Looking to pull project, installer and specification data for municipal surface work into one reporting platform. With certified installers across all 10 provinces and spec language written for tenders, there is plenty of data to organise, and the page describing the project is at https://files.example.online/folders/btp/hubss`;

console.log("rules");
check("the SEO pitch is spam", () => assert.equal(screenByRules(contact(SEO_PITCH, { company: "Seo Tech" })).verdict, "spam"));
check("the phishing link is spam", () => assert.equal(screenByRules(contact(PHISHING)).verdict, "spam"));
check("a bare domain with a path is a link", () =>
  assert.deepEqual(externalLinks("see files.example.online/folders/btp for the page"), ["files.example.online/folders/btp"]));
check("an email address is not a link", () => assert.deepEqual(externalLinks("write to jane@city.ca or doug.bain@hubss.com"), []));
check("hubss.com links are not outside links", () =>
  assert.deepEqual(externalLinks("I saw https://hubss.com/products/streetprint and www.hubss.com/idea-book."), []));
check("a sentence-ending link drops its full stop", () =>
  assert.deepEqual(externalLinks("Drawings are at https://example.ca/tender/42."), ["https://example.ca/tender/42"]));
check("units and ranges are not links", () => assert.deepEqual(externalLinks("about 1.5m/s, 10–20 years, and/or 3.5 m wide"), []));

const GENUINE: [string, ScreenInput][] = [
  ["a municipal crosswalk enquiry", contact("We're looking at TrafficPatterns for six crosswalks near two schools next spring. Can you send pricing and the spec sheet?", { company: "Town of Milton", projectType: "Crosswalk / Pedestrian Safety" })],
  ["a homeowner's driveway question", contact("hi how much for a stamped asphalt driveway about 60 sq m in Nanaimo? thanks")],
  ["a short message with no company", contact("Need a quote for StreetBond on a plaza, call me.")],
  ["a French enquiry", contact("Bonjour, nous aimerions recevoir de la documentation sur StreetPrint pour un projet municipal à Gatineau.")],
  ["a contractor who wants to install", contact("We are a paving contractor in Saskatoon and want to become a certified StreetPrint installer. Who do we talk to?")],
  ["a Lunch & Learn booking with no message", { formType: "lunch-learn", name: "A. Planner", company: "WSP", email: "a.planner@example.com", topic: "Crosswalks", format: "In-person" }],
  ["an Idea Book request", { formType: "catalogue-print", name: "L. Architect", company: "PFS Studio", email: "la@example.com", hasAddress: true }],
  ["a reply about our own site's photo", contact("The photo of the Granville crosswalk on your site, is that TrafficPatternsXD? We want the same for Main St.")],
];
for (const [name, input] of GENUINE) {
  check(`${name} is delivered`, () => {
    const v = screenByRules(input);
    assert.equal(v.verdict, "genuine", v.reason);
  });
}
check("a tender link is caught by the rules (the model is the judge when it answers)", () =>
  assert.equal(screenByRules(contact("Tender docs: https://bidsandtenders.example.ca/Module/Tenders/123")).verdict, "spam"));
check("no pitch phrase in a plain enquiry", () => assert.equal(pitchPhrase("Can you quote 400 m2 of DuraShield on our lot?"), null));

console.log("what leaves the site");
check("the model sees the email's domain only, and no phone or address", () => {
  const text = describeSubmission({
    formType: "catalogue-print",
    name: "L. Architect",
    email: "private.person@example.com",
    hasPhone: true,
    hasAddress: true,
    message: "Two copies please.",
  });
  assert.ok(text.includes("Email domain: example.com"), text);
  assert.ok(!text.includes("private.person"), "full email leaked");
  assert.ok(text.includes("Phone number given: yes"), text);
  assert.ok(text.includes("Mailing address given: yes"), text);
});
check("a very long message is cut for the model", () => {
  const text = describeSubmission(contact("x".repeat(9000)));
  assert.ok(text.length < 4600, `length ${text.length}`);
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nall passed");
