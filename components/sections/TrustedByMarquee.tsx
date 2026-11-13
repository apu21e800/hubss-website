// Trusted-by logos / municipality names — standalone social-proof marquee.
// Extracted from the original WhyHubss section so it can run on the homepage
// without the stats / numbered claims block that Doug asked us to drop.

// One list for both "who uses HUB" marquees: this one and the Lunch & Learn
// page's, which imports it (LunchLearnFunnel.tsx). Each used to keep its own
// copy, and the Lunch & Learn one had grown four names this one never had.
// It lives here, not in the client component, so this server component can
// read it as plain data.
export const TRUSTED_BY = [
  "City of Toronto",
  "York Region",
  "City of Vancouver",
  "University of British Columbia",
  "City of Ottawa",
  "City of Brampton",
  "City of Mississauga",
  "TransLink",
  "City of Surrey",
  "City of Edmonton",
  "City of Burnaby",
  "City of Richmond Hill",
];

/**
 * Who uses HUB, as a still line of names (13 Nov 2026). It was a ticker that
 * ran by itself from the moment the page opened; nothing on the site moves
 * now until the visitor does something. The names are a list for a screen
 * reader and one flowing line for the eye, a dot between them (.proof-names
 * in app/globals.css draws the dots and drops one that would start a line).
 * The file keeps its name: the Lunch & Learn page imports the list from it.
 */
export default function TrustedByMarquee() {
  return (
    <section
      data-surface="paper"
      className="proof-band"
      aria-label="Trusted by Canadian municipalities and institutions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="proof-row">
          <p className="eyebrow eyebrow-muted">Trusted by</p>
          {/* A row to swipe on a phone, so it can take the keyboard's focus too. */}
          <ul className="proof-names" tabIndex={0} aria-label="Trusted by">
            {TRUSTED_BY.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
