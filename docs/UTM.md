# UTM tags: one list, so GA4 sorts the channels the same way every time

A link HUB sends out carries four tags. `utm_source` is where the reader was,
`utm_medium` is the kind of channel, `utm_campaign` names the push, and
`utm_content` tells one link in it from another. Google Ads carries none:
its clicks are auto-tagged (gclid), and lib/visit-source.ts records that.

| Channel | utm_source | utm_medium | utm_campaign | utm_content | Where it is set |
|---|---|---|---|---|---|
| E-blasts (Constant Contact) | `eblast` | `email` | the audience: `landscape-architects`, `commercial-specifiers`, `government-specifiers`, `engineers`, `pedestrian-safety` | the slot in the email | email/2026-11-eblasts/build_e2_6.py |
| Social posts from the daily run | `linkedin`, `facebook`, `instagram` | `social` | the item's campaign, or `archive` for the calendar | the article's slug | lib/social-pipeline.ts, lib/social-calendar.ts |
| Social posts written by hand in Buffer | the network | `social` | `insights` | | docs/buffer-setup.md |
| Printed product flyers | `hubss` | `pdf` for a click in the file, `qr` for the printed code | `product` | the product's slug | scripts/flyers/flyer-content.ts |
| MediaEdge display ads | `mediaedge` | `display` | as MediaEdge names it | | set in the ad platform, not here |
| Google Ads | none (gclid) | | | | auto-tagging |

Known drift (4 Nov 2026 audit, not changed yet): the flyers' `utm_source=hubss`
reads as a self-referral in GA4; `print` would say where the reader was. The
flyers are PDFs, so the change means rebuilding them (`npm run flyers` on
Vern's PC, then the previews), which is a job of its own. E-blast 1 was built
outside this repo: check its tags by hand against this table.

Never put UTM tags on a link from one hubss.com page to another: they overwrite
the visitor's real source (an ad, a search) with our own page names, and the
lead loses its origin. components/AnalyticsEvents.tsx reports those clicks as
`cta_click` instead.
