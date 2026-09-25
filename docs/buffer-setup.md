# Social through Buffer

**What happens:** every day at 14:00 UTC the site checks for Insights articles that
went live since the last run (`app/api/cron/social-drafts`,
`lib/social-pipeline.ts`). For each one, Claude writes a post per network from
the article (nothing it doesn't say), and each becomes a **draft** in that
channel's Buffer queue with the post's photo and a tracked link. An email goes
to `BLOG_DRAFT_NOTIFY`. Nothing is posted until someone approves and schedules
it in Buffer.

Every link carries UTM tags (`utm_source` = network, `utm_medium=social`,
`utm_campaign=insights`, `utm_content` = the post's slug), and every post
makes one ask: read the article and book a Lunch & Learn, which is the offer at
the end of every post. GA4 then shows which posts and networks bring bookings.

Posts dated before 25 Sep 2026 (the imported library) never get drafts; any
later post gets them the first day it's live, however long it sat in Studio.
At most two posts are drafted per day, oldest first, so a burst of publishing
trickles in.

## Networks

| Buffer channel | What it gets |
|---|---|
| LinkedIn (the HUB page) | 500–1,100 characters for specifiers, photo, link |
| Facebook (the HUB page) | 250–600 characters, photo, link |
| Instagram (professional account) | caption with "Link in bio" and hashtags, 4:5 photo |
| X | under 240 characters with the link |
| Threads, Bluesky, Mastodon | the short version |
| YouTube | skipped: Buffer posts Shorts only, and a post has no video |
| Google Business Profile | skipped for now; the next network to add |

A post without a featured photo gets no Instagram draft (Instagram needs one).

## Setup (Vern, once)

1. **Buffer account** at buffer.com, in HUB's name. Plan: **Team** if Doug
   approves posts too (approval workflows are Team-only; $10 per channel per
   month billed yearly), otherwise **Essentials** ($5 per channel).
2. **Connect the channels** in Buffer: the HUB LinkedIn page (you need to be an
   admin of the page), the Facebook page with the Instagram professional
   account linked to it (@hub_surface_systems; confirm HUB controls it), and X.
3. **API key:** publish.buffer.com/settings/api → create a key. Don't paste it
   into chat: Claude Code puts it in Vercel as `BUFFER_API_KEY` (Production).
4. That's it: the next daily run picks up any new post. To try it at once:
   Vercel → hubss-website → Settings → Cron Jobs → social-drafts → Run.

## Checking what happened

- The email lists what was drafted and anything skipped, with the reason.
- In Sanity, each post that got drafts has a `socialLog-<slug>` document (not
  shown in Studio's lists) with the Buffer post ids. Deleting it makes the next
  run draft that post again.
- Vercel → Logs, filter `[social]`.

The old `/admin/social` composer and its `content/social-queue` files were
removed on 24 Sep 2026: they saved to files, which Vercel can't write, so
nothing ever went out from production.
