# TrafficPatterns XD — "18 Canadian Winters" email (Aug 2026)

CC-ready rebuild of the 18-year TrafficPatterns XD email. One file, no external CSS,
bulletproof table layout, tested at 600px desktop and 390px mobile.

## Files

- `hubss-tpxd-18years.html` — the complete email. Paste as-is into Constant Contact.
- Photos are hosted on the live site at `https://hubss.com/images/email/2026-08-tpxd/`
  (committed in `public/images/email/2026-08-tpxd/` on `v2`). The header/footer logo
  reuses the existing `https://hubss.com/images/hub-logo-white.png`.

## Upload to Constant Contact

1. Campaigns → Create → Email → choose **Custom code** ("Code your own").
2. Paste the entire contents of `hubss-tpxd-18years.html`.
3. Keep the `[[trackingImage]]` tag near the top of `<body>` — CC requires it for
   open tracking. It is already in the file; do not delete it.
4. Do **not** add an address/unsubscribe block — CC appends its compliant footer
   (211 McLaren Rd + Unsubscribe/Update Profile) automatically below the design.
5. Set subject + preview text (options below), send yourself a test, then schedule.

## Subject line options

| # | Subject | Preview text |
|---|---------|--------------|
| A | 18 Canadian winters. Still holding the line. | Invented here in 2008. Plow-tested every winter since. |
| B | Paint quits after two winters. We don't. | 8+ year service life, one-time application — the math your 2027 budget will like. |
| C | Before you write the 2027 line item, read this. | Traditional markings vs. HUB, side by side. Plus: lunch is on us. |

A = brand/anniversary play (matches the hero). B = punchiest, best for cold lists.
C = budget-season hook for municipal spec writers.

## What changed vs. the original (creative sweep)

- One idea per section, one primary CTA (Book Your Lunch & Learn → /lunch-learn).
- Intro paragraph cut from 90 cheerful words to 40 confident ones.
- Steps renamed Lay / Bond / Stamp with big numerals; same photos, tighter captions.
- Comparison table reframed for budget season ("For the 2027 budget cycle") — data unchanged.
- Fixed the duplicated "YOU'LL LEAVE WITH" heading (third block is now "Pick your format").
- New stat band (18 yrs / 8+ yr life / −40°C to +40°C) pulled from existing claims.
- Pug upgraded to the hard-hat version from the site's mascot library.
- Regional contacts (Doug / Cleve) added above the footer for direct replies.

## Swapping a photo later

Replace the file in `public/images/email/2026-08-tpxd/` (same filename), push `v2`,
done — the email pulls it live. Photos are pre-optimized (~230 KB each, 1200px wide).
