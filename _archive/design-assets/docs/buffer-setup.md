# Buffer Setup Guide — HUBSS Social Scheduling

**For:** Cleve / HUBSS VA
**Stack:** Buffer Free Tier · LinkedIn Company Page · Instagram Business Account
**Feeds from:** Auto-generated `content/social-drafts/` files

---

## Overview

Every time a new blog post is pushed to the HUBSS website, a GitHub Action automatically calls Claude AI to generate three ready-to-post social drafts — one each for LinkedIn, Instagram, and X/Twitter. Your job is to review the draft file, make any edits, then paste each version into Buffer to schedule at the optimal send time.

This workflow takes about 5 minutes per post once you're set up.

---

## Step 1 — Create a Buffer Free Account

1. Go to [buffer.com](https://buffer.com) and sign up with your HUBSS email.
2. Buffer Free allows **3 connected channels** and **10 scheduled posts per channel** — enough for LinkedIn + Instagram + X.
3. Verify your email and log in to the Buffer dashboard.

---

## Step 2 — Connect HUBSS LinkedIn Page

1. In Buffer, click **"Connect a channel"** → select **LinkedIn**.
2. Choose **"LinkedIn Page"** (not personal profile) — you'll need admin access to the HUBSS LinkedIn Company Page.
3. Authenticate via LinkedIn OAuth when prompted.
4. Select the **HUB Surface Systems** page from the dropdown.
5. Click **"Connect"** — Buffer now has permission to schedule posts on behalf of the page.

**Troubleshooting:** If you don't see the HUBSS page in the dropdown, make sure your personal LinkedIn account is listed as a Page Admin at linkedin.com/company/hub-surface-systems/admin.

---

## Step 3 — Connect HUBSS Instagram

Instagram requires a **Business Account** linked to a Facebook Page to work with Buffer.

1. Confirm the HUBSS Instagram account is set to **Business** (Instagram Settings → Account → Switch to Professional Account → Business).
2. If not already done, link the Instagram account to your HUBSS Facebook Page (Facebook Business Suite → Settings → Instagram).
3. In Buffer, click **"Connect a channel"** → select **Instagram**.
4. Authenticate via Facebook — Buffer uses the Facebook connection to reach Instagram Business accounts.
5. Select the HUBSS Instagram account from the list.

> **Note:** Buffer Free schedules Instagram posts as **notifications** (you approve and post from your phone) unless you upgrade. For a one-person operation, this works fine — you get a push notification at the scheduled time with the caption and image pre-filled.

---

## Step 4 — Where to Find the Generated Drafts

Every time you push a new blog post (`content/blog/your-post.mdx`), the automation runs and creates a file at:

```
content/social-drafts/[post-slug]-[date].md
```

**Example:** Publishing `decorative-crosswalk-meridian.mdx` on May 14 creates:
```
content/social-drafts/decorative-crosswalk-meridian-2026-05-14.md
```

**How to access the file:**
- **Via GitHub:** Go to the repo on github.com → navigate to `content/social-drafts/` → click the new file → click the **Raw** button to see plain text.
- **Via VS Code / local clone:** The file appears in your local `content/social-drafts/` folder after a `git pull`.
- **The file is committed automatically** — the GitHub Action pushes it back to the repo within ~60 seconds of your blog push completing.

---

## Step 5 — Copy-Paste into Buffer for Scheduling

The draft file contains three sections clearly labeled:

```
## LinkedIn
[150-word professional post ending with "Read more → hubss.com/blog/slug"]

## Instagram
[3-line caption + 10 hashtags ending with "Link in bio"]

## X/Twitter
[≤240 character post with URL]
```

**For each platform:**

1. Open the draft file (GitHub or local).
2. Copy the content under the relevant `##` header.
3. In Buffer, click **"Create Post"** → select the channel.
4. Paste the copy into the post composer.
5. For Instagram: attach the blog's featured image (found at `/public/images/blog/[slug]/featured.jpg` in the repo, or the live URL `hubss.com/images/blog/[slug]/featured.jpg`).
6. Set the schedule time (see timing guide below).
7. Click **"Add to Queue"**.

> **Review before posting:** The AI draft is a strong starting point but always read it once. Check that product names (DecoMark, StreetBond, TrafficPatterns, etc.) are correct and the tone matches. Quick edits in the Buffer composer are fine.

---

## Optimal Posting Times — B2B Best Practices

These times are based on B2B engagement research for municipal/architecture audiences. All times are **Pacific Time (PT)**.

### LinkedIn (Company Page)

| Day | Best Window | Rationale |
|-----|-------------|-----------|
| Tuesday | 8:00 – 10:00 AM | Peak professional check-in before morning meetings |
| Wednesday | 8:00 – 10:00 AM | Midweek highest engagement for B2B content |
| Thursday | 8:00 – 10:00 AM | Second-strongest day; avoids Friday drop-off |

**Primary target:** Tuesday 9:00 AM PT for maximum reach.
**Post frequency:** 2–3× per week maximum — quality over volume for this audience.

### Instagram (Business Account)

| Day | Best Window | Rationale |
|-----|-------------|-----------|
| Monday | 11:00 AM – 1:00 PM | Start-of-week browse during lunch |
| Wednesday | 11:00 AM – 1:00 PM | Midweek peak for visual content |

**Primary target:** Wednesday 12:00 PM PT.
**Post frequency:** 1–2× per week — Instagram rewards consistency over volume.

### X / Twitter

Post within 1–2 hours of the LinkedIn post going live, leveraging the same content cycle. Twitter/X is lower priority for HUBSS's B2B audience but good for SEO indexing and niche industry follows.

---

## Buffer Queue Setup (Recommended)

Set up a standing posting schedule in Buffer so you just drop drafts into the queue and they auto-fill the next available slot:

1. In Buffer, go to **Settings → Posting Schedule** for each channel.
2. Add the time slots listed above.
3. When you "Add to Queue" a post, Buffer automatically slots it into the next scheduled time.

This removes the need to manually pick a time for every post.

---

## Monthly Rhythm

| Action | When |
|--------|------|
| Publish new blog post (push to main) | Whenever ready |
| Automation generates social draft | ~60 seconds after push |
| Review + load into Buffer queue | Same day or next morning |
| LinkedIn posts go live | Tue/Wed/Thu 8–10 AM |
| Instagram posts go live | Mon/Wed 11 AM–1 PM |

---

## Troubleshooting

**Draft file didn't appear after pushing a blog post?**
- Check the GitHub Actions tab in the repo: look for the "Generate Social Media Drafts" workflow run and see if it errored.
- Most common cause: `ANTHROPIC_API_KEY` secret is not set in the repo. See setup note below.

**Buffer says "reconnect your account"?**
- LinkedIn and Instagram OAuth tokens expire periodically. Click the reconnect prompt in Buffer → re-authenticate.

**Instagram posts require manual approval?**
- This is normal on Buffer Free for Instagram. You'll get a phone notification at the scheduled time. Open the notification, Buffer pre-fills the caption — tap Post.

---

## One-Time GitHub Secret Setup

The social post generator requires your Anthropic API key to call Claude. A repo admin needs to add it once:

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**.
2. Click **"New repository secret"**.
3. Name: `ANTHROPIC_API_KEY`
4. Value: your Anthropic API key (from console.anthropic.com → API Keys).
5. Click **"Add secret"**.

This is a one-time setup. The key is encrypted and never exposed in logs.
