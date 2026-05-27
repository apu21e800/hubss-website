# HUBSS Content Automation — Architecture & Activation Guide

## What This Is

Three automated workflows that run Claude to generate and distribute HUBSS content. All require human approval before anything publishes — Claude drafts, Vernon decides.

---

## Architecture

```
GitHub Actions (schedule/trigger)
    └── Claude Code Action (anthropics/claude-code-action@beta)
            └── Reads repo content (products, blog posts)
            └── Generates content (blog MDX / social copy)
            └── Opens PR for Vernon's review
                    └── Vernon approves → content publishes

Platform posting (LinkedIn, Facebook, Instagram):
    └── Social generate workflow detects new blog posts
    └── Runs generate-social-post.mjs (calls Anthropic API)
    └── If platform tokens configured → posts directly
    └── If not → saves drafts/ → opens PR for Vernon to post manually
```

---

## Workflows

### 1. Blog Auto-Generation (`blog-auto-gen.yml`)
- **Trigger**: 1st and 15th of each month at 9am Pacific, OR manual
- **What it does**: Reads existing posts → picks a fresh topic → generates 600-900 word MDX → opens PR
- **Output**: PR titled `blog/auto-YYYY-MM-DD` for Vernon to review and merge
- **Cost**: ~$0.02/run (Claude Sonnet via OAuth token)

### 2. Social Cross-Post (`social-cross-post.yml`)  
- **Trigger**: Push to `main` that adds a file in `content/blog/` (not `drafts/`)
- **What it does**: Reads new blog post → generates LinkedIn/Instagram/Facebook variants → posts if tokens configured, otherwise saves draft PR
- **Cost**: ~$0.01/run for generation

---

## What Vernon Needs to Activate

### Step 1 — Add the Claude OAuth token (REQUIRED for everything)

1. Go to [claude.ai](https://claude.ai) → Settings → Claude Code → "Add to GitHub"
2. Authenticate the GitHub OAuth flow
3. Copy the `CLAUDE_CODE_OAUTH_TOKEN` value
4. In GitHub: repo → Settings → Secrets and variables → Actions → New secret
5. Name: `CLAUDE_CODE_OAUTH_TOKEN`, Value: the token from step 3

> This uses Vernon's Claude Pro Max subscription. No extra API cost beyond the subscription.

### Step 2 — Add Anthropic API key (REQUIRED for social post generation)

The social cross-post script calls the Anthropic API directly (not via Claude Code).

1. Go to [console.anthropic.com](https://console.anthropic.com) → API Keys
2. Create a key named `hubss-github-actions`
3. GitHub → Secrets → `ANTHROPIC_API_KEY`
4. Set a monthly spending limit at Anthropic (~$5/month is plenty)

### Step 3 — LinkedIn posting (OPTIONAL — manual drafts work without this)

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com)
2. Create an app → request "Share on LinkedIn" and "Sign In with LinkedIn" scopes
3. Get the OAuth token for the HUBSS company page
4. GitHub → Secrets:
   - `LINKEDIN_ACCESS_TOKEN`: OAuth access token
   - `LINKEDIN_ORG_ID`: Your LinkedIn Organization ID (numeric, from URL)

### Step 4 — Facebook/Instagram posting (OPTIONAL)

1. Go to [developers.facebook.com](https://developers.facebook.com) → Create App → Business type
2. Add "Pages API" and "Instagram Basic Display API" products
3. Get a Page Access Token with `pages_manage_posts` permission
4. GitHub → Secrets:
   - `FACEBOOK_PAGE_TOKEN`: Long-lived Page Access Token
   - `FACEBOOK_PAGE_ID`: Your Page ID
   - `INSTAGRAM_ACCESS_TOKEN`: Instagram Graph API token
   - `INSTAGRAM_USER_ID`: Your IG Business account ID

### Step 5 — Admin password for website API routes

The existing `/api/blog/generate` and `/api/social/generate` routes on the website use `ADMIN_PASSWORD`. This is already set in Vercel env vars. No action needed.

---

## How the Blog Draft Review Works

1. Workflow runs on schedule
2. Claude reads last 10 blog posts, picks a fresh topic
3. Generates MDX, commits to `blog/auto-YYYY-MM-DD` branch
4. Opens PR with draft content
5. Vernon reviews, edits if needed, merges
6. On merge → social cross-post workflow fires automatically

---

## Topic Rotation

Claude rotates through 5 topic types:
1. **Project case study** — Real Canadian municipality project spotlight
2. **Specifier how-to** — Technical guide for engineers/planners
3. **Seasonal maintenance** — Timely (spring/winter prep, inspection cycles)
4. **Product spotlight** — Deep dive on one HUB product
5. **Cross-product comparison** — When to use TPXD vs TP vs StreetBond etc.

The prompt reads existing blog posts to avoid repeating covered topics.

---

## Costs Summary

| Item | Frequency | Cost/run | Annual |
|------|-----------|----------|--------|
| Blog generation | 2×/month | ~$0.02 | ~$0.48 |
| Social generation | Per blog post | ~$0.01 | ~$0.24 |
| AI Chat (if enabled) | Per conversation | ~$0.001 | Varies |
| **Total automation** | | | **<$5/year** |

Claude Pro Max subscription (Vernon's personal) covers the GitHub Action runs via OAuth. The Anthropic API key is only for the social generation script and chatbot.

---

## Activation Gate (added on `feat/content-automation-pipeline`)

Both workflows now check an explicit `AUTOMATION_ENABLED` secret at the
start of every run. If the secret is not `'true'`, the job exits cleanly
without making any API calls or opening any PRs. This is deliberate —
the pipeline scaffolding lives on the branch in a fully inert state
until Vernon flips the gate.

### Activation checklist — secrets to add (in dependency order)

| Stage | Secret | Required for | What happens without it |
|---|---|---|---|
| **0. Master gate** | `AUTOMATION_ENABLED` = `true` | Anything to run on cron | Both workflows exit 0 immediately. No API calls. No PRs. |
| **1. Blog generation** | `CLAUDE_CODE_OAUTH_TOKEN` | Claude generates the MDX draft | Workflow fails at the Claude step (or skips if gate is closed). |
| **2. Social generation** | `ANTHROPIC_API_KEY` | Generating LinkedIn/IG/FB copy | Social workflow can't generate copy — exits at install step. |
| **3a. LinkedIn posting** | `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_ORG_ID` | Auto-post to LinkedIn page | Draft saved to `social-drafts/`, included in review PR. |
| **3b. Facebook posting** | `FACEBOOK_PAGE_TOKEN`, `FACEBOOK_PAGE_ID` | Auto-post to FB page | Draft saved, included in review PR. |
| **3c. Instagram posting** | `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID` | Auto-post to IG business | Draft saved, included in review PR. |
| **4. Sanity auto-publish** (optional, more aggressive) | `AUTO_PUBLISH_TO_SANITY` = `true` + `SITE_URL` + `ADMIN_PASSWORD` | Blog workflow publishes to Sanity AND dispatches the social workflow on the published content (skipping the human review step) | Default flow stays: PR → human review → merge → push fires social. |

**Manual one-shot test (no secrets needed):** dispatch either workflow with `force=true` in the workflow inputs. This bypasses the gate for that single run only — useful for confirming the wiring works before Vernon adds the master `AUTOMATION_ENABLED` secret.

### Cron schedule

```yaml
schedule:
  - cron: '0 17 1,15 * *'   # 1st + 15th of each month, 17:00 UTC = 9:00am PT
```

GitHub crons run in UTC. Pacific is UTC-8 (winter) / UTC-7 (summer). `17:00 UTC` = `9:00 PST` / `10:00 PDT`. If exact 9am-PT-year-round matters, switch to two crons — one for standard time, one for DST.

---

## Instagram posting code — reference

The `/api/social/post` endpoint that the cross-post workflow hits exists on `main` but its Instagram block was rewritten on the **`fix/instagram-login-api` branch** (commit `c842baa`) to use the new `graph.instagram.com` Instagram-Login API endpoint instead of the legacy Facebook Graph route that Meta is sunsetting.

That branch is **intentionally NOT merged into this pipeline scaffold**. Vernon is doing a live test of the IG posting flow on `fix/instagram-login-api` before promoting it. The activation order is:

1. Activate the pipeline scaffold (this branch) — workflows fire on cron, but IG posting still uses the legacy Graph endpoint via the version of `/api/social/post` that's on `main`.
2. Vernon completes his IG live test on `fix/instagram-login-api`.
3. Merge `fix/instagram-login-api` → `main`. Now the IG block uses the new endpoint.
4. No change needed to this pipeline — it calls `/api/social/post` regardless of which IG-block version is live.

To inspect or test the IG code while Vernon's flow runs: `git checkout fix/instagram-login-api` and look at `app/api/social/post/route.ts`.

---

## Wiring: blog publish → social cross-post

Two paths to the social-cross-post workflow depending on the AUTO_PUBLISH_TO_SANITY toggle:

**Default (gate closed):**
```
cron fires → blog-auto-gen runs Claude → MDX commit + PR opened →
Vernon reviews → Vernon merges → push to main hits content/blog/*.mdx
→ social-cross-post workflow triggers → social-drafts PR (or auto-post if tokens set)
```

**Aggressive (AUTO_PUBLISH_TO_SANITY=true):**
```
cron fires → blog-auto-gen runs Claude → MDX commit + PR opened →
"Publish to Sanity" step calls /api/blog/approve →
repository_dispatch fires with event_type=blog-published →
social-cross-post workflow triggers immediately on the slug
```

Both paths funnel through `/api/social/post` for IG + LinkedIn + FB — the same endpoint Vernon's manual scheduler uses.
