# TrafficPatterns XD — "18 Years of Performance" email

**Upload to Constant Contact:** `hubss-tpxd-v2.html`
**Just to look at it:** `PREVIEW-selfcontained.html` — never upload that one.
**For Doug:** `COPY-NOTES-for-Doug.md` — every copy change against his original, with reasons.

---

## Images — read this first

Eight images. **Three load from the live site today with no action from anyone:**

| | URL | Status |
|---|---|---|
| Header wheel | `/images/hub-wheel-orange.png` | **live** |
| Footer lockup | `/images/hub-logo-white.png` | **live** |
| Moose | `/images/lunch-learn/moose-final.png` | **live** |

The header logo is the official lockup rasterised from `hub-official-logo.svg` at 3× on the
header's own charcoal — email clients don't render SVG, and baking the background avoids
Outlook's transparency bugs.

**The five photographs and the header logo still need a home.** They are not on the website — I hash-compared
them against all 1,732 images in the repo and none of them exist there. They are unique to
this email, so no already-live URL can serve them.

**Fastest path — put them in Constant Contact (recommended, ~5 minutes):**

The six files are in `UPLOAD-TO-CC/` and in `public/images/email/2026-08-tpxd/`.
Upload them into CC's image library, then in the code editor do six find-and-replaces:

| Find this exact string | Replace with |
|---|---|
| `https://hubss.com/images/email/2026-08-tpxd/hero-king-john.jpg` | CC's URL for `hero-king-john.jpg` |
| `https://hubss.com/images/email/2026-08-tpxd/step-1-lay.jpg` | CC's URL for `step-1-lay.jpg` |
| `https://hubss.com/images/email/2026-08-tpxd/step-2-bond.jpg` | CC's URL for `step-2-bond.jpg` |
| `https://hubss.com/images/email/2026-08-tpxd/step-3-stamp.jpg` | CC's URL for `step-3-stamp.jpg` |
| `https://hubss.com/images/email/2026-08-tpxd/winter-plow.jpg` | CC's URL for `winter-plow.jpg` |
| `https://hubss.com/images/email/2026-08-tpxd/logo-nav.png` | CC's URL for `logo-nav.png` |

Campaign images belong in the campaign tool. Doing it this way means the email never
depends on a website deploy again, and Doug can swap a photo himself.

**Alternative — host them on the site:** `git push origin email-to-main:main`. The branch is
built and contains these six images plus this folder. Then the HTML works untouched.

## What changed in this pass

- **Lunch & Learn is now the card from hubss.com/lunch-learn** — charcoal `#20201F` on `#151515`,
  orange→amber gradient edge (`--gradient-brand`, solid-orange fallback for Outlook), Moose in
  the orange ring, two-tone headline, check badges, four stat chips, gradient CTA, and the
  East/West phones on the card's own footer line. It absorbs the old contacts section.
- **Comparison table:** the red is gone. Traditional values are quiet grey; HUB values are
  bold ink. The orange header carries the column.
- **Headlines up:** hero 34→38px, section headings 26→30px (mobile 31/26). The three install
  steps are now 22px titles with 26px orange numerals — *Lay the pattern / Bond it to the road /
  Stamp it flush* — so the section reads at a skim.
- **Header logo aligned:** a blanket `table{margin:0 auto}` in the reset was centring every
  nested table. Scoped to the shell; all 12 content blocks now measure 32px from the edge.
- Phone numbers use non-breaking hyphens so they never split across a line on mobile.

## Uploading

1. Campaigns → Create → Email → **Custom code** ("Code your own").
2. Paste the entire contents of `hubss-tpxd-v2.html`.
3. Keep `[[trackingImage]]` near the top — CC needs it for open tracking.
4. Don't add an address or unsubscribe block; CC appends its own compliant footer.
5. Subject + preview text, send yourself a test, schedule.

37 KB against CC's 400 KB cap. None of the character sequences CC rejects (`[#`, `${`, `<@`).
Every hubss.com link returns 200; the social URLs match the site's own.

## Production details worth knowing

- **Renders correctly with images blocked.** Roughly a third of corporate readers see an
  email that way on first open. Every image now carries styled alt text — the header shows
  "HUB" in orange on the charcoal instead of the default blue-on-black, which was invisible.
- **Outlook line-height is locked** (`mso-line-height-rule:exactly`, 65 places). Without it
  the Word rendering engine inflates leading and the two-line headlines break apart.
- **Locked to light mode** (`color-scheme: light only`) so Apple Mail and Outlook.com don't
  auto-invert the charcoal blocks and white cards into mud.
- All layout tables are `role="presentation"`; every image has an explicit `width`.

## Subject lines

| # | Subject | Preview text |
|---|---------|--------------|
| A | 18 years of performance — invented in Canada | Installed on its first Canadian road in 2008. Still in service. |
| B | Paint fades. We don't. | 8× the service life of painted markings. The lifecycle case, side by side. |
| C | The lifecycle case for your next specification | Traditional markings vs. HUB — installed once, in service through multiple budget cycles. |

A is the original's own headline and the safest with this list.

## The brand system it's built on

From `CATALOGUE-CREATIVE-DIRECTOR-BRIEF.md` and `app/globals.css` — not invented:

| Token | Value | Used for |
|---|---|---|
| Orange | `#F97316` | Eyebrows, rules, HUB table column, CTA, card top rules |
| Burnt orange | `#C2410C` | Orange text on light — `#F97316` fails AA on white |
| Charcoal | `#20201F` | Official HUBSS grey — header, Lunch & Learn, footer |
| Navy | `#0F1620` | Site's `--bg-primary` — winter section |
| Ink / body / muted | `#1F1F1F` · `#4B5563` · `#737373` | Headlines and copy |
| Off-white / rule | `#F5F4F0` · `#E2E2E2` | Alternating sections, borders |
| Type | **Inter** 400–800 | Google Fonts link + system fallback (Outlook → Arial) |

House rules: eyebrows at `0.2em` tracking, uppercase, orange. Two-line headlines. Never a
year count — the brief records the site's "30+ years" as wrong against a 1999 founding.

The comparison table and the 8× callout mirror `components/sections/ComparisonTable.tsx`.
Product cards use the original email's orange-top-rule grammar with the approved catalogue
descriptions.
