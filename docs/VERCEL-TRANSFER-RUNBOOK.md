# Vercel Transfer Runbook — hubss-website → client-owned team

Goal: move the `hubss-website` Vercel project (and the `hubss.com` domain attached to it)
from the agency team (`based-agency`) to a Vercel team owned and billed by HUB Surface
Systems, with **zero downtime** and no DNS changes.

Current state (verify before starting):
- Project: `hubss-website` (`prj_b51aCXeI5eihTky167k0gToETRNg`) on team `based-agency`
- Domains on project: `hubss.com`, `www.hubss.com` (+ default `*.vercel.app` aliases)
- DNS: GoDaddy — A `76.76.21.21`, CNAME `www → cname.vercel-dns.com` (per DNS_MIGRATION.md)
- Git: auto-deploys from GitHub `apu21e800/hubss-website` (`main` → production)

Key fact that makes this safe: **DNS does not change.** `hubss.com` already points at
Vercel's edge; a project transfer moves the project between teams behind the same edge.
Traffic never re-routes.

---

## Phase 0 — Client account (Doug/HUB does this, ~15 min)

1. HUB creates a Vercel account with a company email (e.g. `info@hubss.com` or an IT alias
   they control — NOT a personal address that can leave the company).
2. Create a **Team** (Vercel → New Team). Name: `hub-surface-systems` (or similar).
3. Subscription: **Pro** ($20/user/mo at time of writing — confirm current pricing).
   Pro is required for commercial usage, team members, and chat support.
4. Invite `cleveland.stordy@gmail.com` (Vern) as a **Member** — this keeps agency access
   for maintenance after the handoff.

## Phase 1 — Pre-transfer snapshot (Vern, ~10 min)

- [ ] Screenshot / export the project's **Environment Variables** (Settings → Environment
      Variables). Expected set:
      `RESEND_API_KEY`, `CONTACT_EMAIL`, `ADMIN_USER`, `ADMIN_PASSWORD`,
      `ANTHROPIC_API_KEY` (admin AI tooling), `NEXT_PUBLIC_SHOW_CATALOGUE`
      (unset/false in production until the catalogue ships), Sanity vars if set
      (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
      `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`).
      Env vars transfer with the project, but the snapshot is the rollback parachute.
- [ ] Note the current production deployment ID + confirm it's READY (green).
- [ ] Confirm GoDaddy DNS records (A + CNAME) — screenshot. They will not be touched.

## Phase 2 — Transfer (Vern, ~5 min)

1. Vercel → `based-agency` team → `hubss-website` → **Settings → General →
   Transfer Project**.
2. Target: the new HUB team. Vercel validates that the target team can hold the project
   (Pro plan, member limits, etc.).
3. Accept the transfer from the HUB team side (the client account confirms).
4. What moves automatically: production + preview deployments, domains
   (`hubss.com`, `www`), env vars, framework config. What may need re-linking: the
   **GitHub integration authorization** (next phase).

## Phase 3 — Re-link GitHub (Vern, ~5 min)

The repo `apu21e800/hubss-website` stays under the agency GitHub account (code custody
stays with 21e8 unless separately negotiated). The HUB team's Vercel needs permission to
read it:

1. On the HUB team: Settings → Git → GitHub — install/authorize the Vercel GitHub App
   for `apu21e800/hubss-website` (the GitHub account owner — Vern — approves the app
   grant on the repo).
2. Confirm the project still shows "Connected to apu21e800/hubss-website".
3. Push an empty commit to a branch → verify a preview deployment builds on the new team.

## Phase 4 — Verify (both, ~10 min)

- [ ] `https://hubss.com` loads in incognito, TLS padlock valid (cert may silently
      reissue under the new team — allow up to a few minutes).
- [ ] Contact form submits → email arrives at `info@hubss.com`.
- [ ] `/admin` still returns the Basic Auth prompt (env vars survived).
- [ ] Push to `main` → production deployment builds and promotes on the HUB team.
- [ ] Vercel Analytics/Speed Insights still recording.

## Phase 5 — Billing + custody close-out

- [ ] Agency team (`based-agency`) no longer bills for this project.
- [ ] HUB team billing has a company card on file.
- [ ] Document in writing: HUB owns the Vercel project + domain; 21e8 retains repo
      custody + member access for maintenance (or schedule a repo transfer as its own
      task if HUB is to own the code too).
- [ ] GoDaddy: unchanged, still HUB's (confirm the GoDaddy account is client-owned;
      if it's agency-owned, that's a separate transfer with its own runbook).

## Rollback

A transfer is reversible: Transfer Project back to `based-agency` from the HUB team.
DNS never changed, so there is no DNS rollback scenario. If TLS fails to reissue after
15 minutes, contact Vercel support (Pro chat) before touching anything.

## Sequencing note

Do this transfer **after** V2 merges to `main` and is verified in production, not before —
one variable at a time.
