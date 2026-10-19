# Social through Buffer

**What happens:** every day at 14:00 UTC the site checks for Insights articles that
went live since the last run (`app/api/cron/social-drafts`,
`lib/social-pipeline.ts`). For each one, Claude writes a post per network from
the article (nothing it doesn't say), and each becomes a **draft** in that
channel's Buffer queue with the post's photo and a tracked link. An email goes
to `BLOG_DRAFT_NOTIFY`. Nothing is posted until someone approves and schedules
it in Buffer.

**The one switch (19 Oct 2026):** with `SOCIAL_AUTO_QUEUE=on` in Vercel
(Production; a redeploy after setting it), the posts go into each channel's
**queue** instead of its drafts, and Buffer posts them at the next free slots
unless someone deletes them there first. The emails then say "queued" and
link to the queue. Anything else, or the variable unset, means drafts for
approval, as before. A post whose copy the style pass couldn't fully fix (an
em dash left, a machine tell) waits as a draft even with the switch on, and
its email says so. Only Vern turns it (`lib/buffer.ts`, `socialAutoQueue`).

**Job photos with a story (19 Oct 2026):** a Job photos post whose **The
story** field is filled in is not drafted by the field stream below. It becomes
a scheduled Projects article instead (`lib/project-posts.ts`,
docs/DOUG-PROJECT-POSTS.md), and the article's posts carry the job the day
after it is live, so a job goes out once. The same daily run publishes the
scheduled drafts first, then drafts social, then writes the next article with
the time it has left.

## Three streams, one queue (since 14 Oct 2026)

Vern, 14 Oct: "automate as much as the social media as possible ... I don't
want to write the blogs and do the social media". The same daily run drafts
from three sources, in this order, and every draft waits for approval:

| Stream | What it drafts from | How often | Links to | `utm_campaign` |
|---|---|---|---|---|
| Articles | a newly published Insights article | up to 2 a day, the day after Publish | the article | `insights` |
| From the field | a published Studio **Job photos** post (Studio → Job photos for social; `sanity/schemas/fieldPost.ts`): photos of a finished job, where, the system, a line of facts | 1 a day | the system's page | `field` |
| From the library | one thing HUB has already published and checked (`lib/social-library.ts`): a documented job from the homepage map (the tour's jobs first), or a system or application spread from the Product Portfolio Book, taking turns | 1 a week, Mondays (the very first one at once); a new field post takes the week's turn | the job's article, its Product Portfolio Book page, or the system or application page | `library` |

- The posts say only what their source says (lib/social-drafter.ts
  `SocialSource`); field and library posts never say "read the article" unless
  the link is one, and library posts are never called new.
- A map job whose article already had its own social posts is skipped by the
  library, so nothing goes out twice. About 100 library items: two years at
  one a week.
- Three posts a week on each channel (14 Oct 2026): the two articles (the
  drafter writes on Tuesdays and Thursdays) and one job post, Doug's field
  post when there is a new one, else the library's.
- A draft nobody wants: delete it in Buffer. Its log stays, so it isn't
  drafted again.
- Field posts aren't on the website yet; their photos live in Studio and the
  posts. A field post could later become a map pin or gallery photos too.
- The library's photos are the page's Studio hero when it has one, else the
  site's own hero or map photo (sent as it is, not cropped).

## Buffer's posting schedule

Each channel's schedule (Buffer → the channel → ⚙️) is Tuesdays, Wednesdays
and Thursdays at 11:00 AM, timezone Toronto (Tuesdays and Thursdays set by
Vern on 14 Oct 2026; Wednesday added for three posts a week). "Add to Queue" puts an
approved draft in the next free slot; a channel with no times can't queue.

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

Buffer's facts below were checked against Buffer's own pages on 9 Oct 2026.

1. **Buffer account** at buffer.com, signed up by Vern with his hubss.com
   address (done 13 Oct 2026: vernon@hubss.com, Free plan). Only the
   account's owner can make an API key.
   **Plan: start on Free.** The API is on every plan, Free included (one key),
   with up to 3 channels and unlimited drafts, so the whole pipeline runs at
   $0. Upgrade when there's a reason: **Essentials** (billed per channel) for a
   fourth channel such as X, **Team** for approval workflows and a login for
   Doug.
2. **Connect the channels** in Buffer: the HUB LinkedIn page (Vern must be an
   admin of the page), the Facebook page, and the Instagram professional
   account (@hub_surface_systems). On Free those three are the limit; X and
   YouTube come with an upgrade.
3. **API key:** publish.buffer.com/settings/api → Personal Access → New Key.
   Name it "hubss.com social drafts", leave the permissions as they are, and
   set the expiry to **1 year**, the longest Buffer offers (the default is
   30 days). Buffer shows the key once. Don't paste it into chat: it goes into
   Vercel as `BUFFER_API_KEY` (Production, sensitive) through Vercel's form,
   then a redeploy.
4. That's it: the next daily run picks up any new post. To try it at once
   (with Vern's yes): Vercel → hubss-website → Settings → Cron Jobs →
   social-drafts → Run.
5. **Every year:** the key expires. When it does, the job emails the editors
   (below); make a new key the same way and replace it in Vercel. A calendar
   reminder a couple of weeks before the expiry date saves the missed day.

## Whose account (the agency recommendation, 13 Oct 2026)

HUB's. The login is a hubss.com address, and HUB pays when there is a bill;
21e8 runs it. If HUB would rather not have another vendor bill, 21e8 can pay
and invoice it at cost, but the account stays HUB's, so nothing has to move
if that ever changes.

Keep this Buffer HUB-only. The API key reaches every channel on the login and
the job drafts into all of them, so a Square One or EasyMenus channel
connected here would get HUB's posts. Other clients get their own Buffer.

## When something goes wrong (since 9 Oct 2026)

Nothing fails silently, no article is drafted twice, and no article is used
up by a bad run (`lib/social-outcome.ts` and `lib/social-pipeline.ts`, tested
by `npm run test:social`). Every case below emails the editors with the
reason and what to do:

- **The run stops** (Buffer refuses the key, no channel the job can draft
  for, a setting missing in Vercel, Anthropic or Sanity refusing their key, or
  BUFFER_API_KEY gone after the job has run before): "Social drafts didn't
  run". It repeats each day until fixed; the articles wait and are drafted on
  the first good run.
- **Every channel refused an article** (or every one is disconnected): no
  drafts, "Social drafts not made yet", and the next daily run writes that
  article again, for up to 14 days from its first failed try (a hidden
  `socialRetry-<slug>` document keeps the date). It waits behind articles not
  tried yet, so it can't hold up new ones. After 14 days, "Social drafts given
  up": make the posts by hand if you still want them.
- **Some channels drafted, some refused:** the article is done, and the email
  lists what was skipped and why. Make the missing post by hand in Buffer from
  one of the others.
- **No channel could ever take it** (Instagram only, and the article has no
  photo): "No social drafts for", and the article is done.

How "never twice" works: before anything goes to Buffer, the job creates the
article's log in Sanity, and Sanity refuses a second one with the same id. A
second run at the same moment skips the article, and a log Sanity won't take
stops the run before Buffer gets anything. When nothing could be drafted, the
job deletes that log again so the article comes back the next day. Every
Buffer and Sanity call gives up after 20 seconds, and the job starts no
article after two minutes, so it always finishes, and reports, inside
Vercel's five-minute limit.

## Checking what happened

- The email lists what was drafted and anything skipped, with the reason.
- Studio → Sent to Buffer (read only; "Social drafts" until 15 Oct 2026): one entry per article that got drafts
  (`socialLog-<slug>`), with the channels, the Buffer post ids, anything
  skipped and the style check. Deleting one (from Vern's PC) makes the next
  run draft that article again.
- Vercel → Logs, filter `[social]`.

The old `/admin/social` composer and its `content/social-queue` files were
removed on 24 Sep 2026: they saved to files, which Vercel can't write, so
nothing ever went out from production.
