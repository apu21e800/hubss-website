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
