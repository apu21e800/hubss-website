# HUBSS-website Organization Plan

*Generated 2026-05-28. Audit of the `hubss-website` repo root + proposals for a
cleaner structure that does not break production.*

> **Branch:** `chore/hubss-organization` (off `origin/main`).
> **Not merged.** This plan + the smallest safe execution are pushed for Vernon
> to review and decide on before any merge to `main`.

---

## TL;DR

- **Executed (this branch):** added `scratch/` convention to `.gitignore` so
  ad-hoc Playwright/MCP screenshots stop polluting the repo root. Wrote this
  plan.
- **Proposed but NOT executed (needs Vernon's eye):** root-level `.md` curation,
  `_archive/` consolidation, dead-code sweep, scripts/ cleanup.
- **Out of scope:** anything tracked that Next.js or Vercel imports. The build
  must keep passing after every commit on this branch.

---

## Current-state inventory (root)

### Always-on infrastructure — KEEP AT ROOT
```
.claude/          Claude Code config
.github/          GitHub Actions workflows
.gitignore
.prettierrc
.vercel/          Vercel CLI local
.next/            Next.js build output (gitignored)
node_modules/     npm deps (gitignored)
app/              Next.js App Router
components/       React components
lib/              data + utilities
public/           static assets (Vercel serves these)
sanity/           Sanity schemas
sanity.config.ts
scripts/          build + migration scripts
catalog-print-build/   ReportLab catalogue pipeline + Figma plugin
content/          legacy MDX blog (Sanity is now source of truth)
types/            shared TS types
middleware.ts     /catalogue feature gate
next.config.ts
next-env.d.ts
package.json
package-lock.json
postcss.config.mjs
eslint.config.mjs
tsconfig.json
vercel.json
README.md
CLAUDE.md         project intelligence
```

### Root-level `.md` clutter — PROPOSE archive
Origin/main has 14 root-level `.md` files (excluding README.md + CLAUDE.md).
Many are historical audits / migration guides that are NOT live runbooks:

| File | Recommendation |
|---|---|
| `README.md` | KEEP at root (standard) |
| `CLAUDE.md` | KEEP at root (standard) |
| `SECURITY.md` | KEEP at root (GitHub recognises this path) |
| `AI_INTEGRATION.md` | → `docs/archive/` (historical, AI feature shipped) |
| `BUG-LIST.md` | → `docs/archive/` (stale punch list) |
| `CMS_GUIDE.md` | → `docs/` (active client-facing reference) |
| `COWORK_INTEGRATIONS.md` | → `docs/archive/` (one-off) |
| `DNS_MIGRATION.md` | → `docs/archive/` (one-shot DNS cutover) |
| `HERMES.md` | → `docs/archive/` (legacy concept) |
| `IMAGE-AUDIT.md` | → `docs/archive/` (audit snapshot) |
| `LAUNCH_CHECKLIST.md` | → `docs/archive/` (pre-launch) |
| `PRODUCT-CLAIMS-AUDIT.md` | → `docs/archive/` (audit snapshot) |
| `PROJECT-IMAGE-AUDIT.md` | → `docs/archive/` (audit snapshot) |
| `SEO_MIGRATION.md` | → `docs/archive/` (one-shot migration) |

> **Heads-up:** the `feat/phase2-applications-to-sanity` branch (Vernon's WIP)
> has many of these `.md` files marked deleted. If Vernon's intent is to drop
> them entirely, this archive-move PR is moot — merge his deletes instead.
> Not executing on this branch to avoid conflicting with WIP.

### Root-level untracked screenshots — EXECUTING the move
The main checkout has 28 ad-hoc `.jpeg` files at root from Playwright/MCP
runs (`aggrefill-after.jpeg`, `flipbook-catalogue-v3.jpeg`,
`polish-catalogue-chrome.jpeg`, `v43-flipbook-mobile.jpeg`, etc.).
**All untracked** — they were never committed.

Action: add `scratch/` convention to `.gitignore`. Then in the working tree,
move these files into `scratch/screenshots/`. The .gitignore commit lives on
this branch. The actual `mv` happens in the working tree and is not committed
(scratch is gitignored).

---

## `_archive/` directory — PROPOSE (Vernon's eye)

`_archive/design-assets/catalog-print-build/output/` had **5.7 GB of stale
catalogue PDF intermediates** before today's cleanup. After the 2026-05-28
Recycle Bin pass that recovers ~4.5 GB, the remaining `_archive/` content is:

| Path | Size (approx) | Recommendation |
|---|---|---|
| `_archive/design-assets/catalog-print-build/output/` | ~1.2 GB (kept v29, v30, LookBook FINAL) | Keep as-is; Vernon decides if v29/v30 still needed |
| `_archive/design-assets/catalog-print-build/assets/` | 411 MB | Source artwork — reproducible from `public/`. Vernon decides if needed for figma plugin re-runs |
| `_archive/design-assets/catalog-print-build/figma-plugin/` | 115 MB | Likely duplicates LIVE `catalog-print-build/figma-plugin/`. Vernon spot-check before removal |
| `_archive/design-assets/catalog-print-build/figma_refs/` | 32 MB | Figma reference exports — keep |
| `_archive/design-assets/catalog-print-build/src/` | 652 KB | Old Python build scripts — superseded by live `catalog-print-build/src/` |
| `_archive/design-assets/apshalt patterns/` | 1.6 MB | Typo: "apshalt". Probably safe to keep as-is or rename |
| `_archive/screenshots/` | 6.5 MB | Old session screenshots — fine to leave |
| `_archive/planning-docs/` | 120 KB | Old planning — fine to leave |

---

## Scripts dir — quick proposal (not executed)

`scripts/` has a mix of LIVE and ONE-OFF migration scripts. Worth a single
cleanup pass when Vernon has bandwidth:

| Type | Examples |
|---|---|
| **LIVE** (used by package.json or Sanity sync) | `migrate-to-sanity.ts`, `sync-applications-to-sanity.ts`, `sync-products-to-sanity.ts`, `sync-pages-to-sanity.ts`, `upload-to-sanity.ts`, `compress-images.mjs`, `audit-images.mjs` |
| **ONE-OFF** (run-once Sanity migrations) | `sanity-strip-legacy-fields.mjs`, `sanity-wire-references.mjs`, `sanity-gallery-upload.mjs`, `run-upload.mjs` |
| **GENERATORS** (occasional dev tools) | `generate-asphalt-texture.js`, `generate-og.js` |

Recommendation: leave alone. Vernon should rename the one-offs with a
`migrations/` subdir if/when he wants the clarity, but they don't break
anything in place.

---

## Public dir — quick note (not executed)

`public/catalogue/` currently contains FOUR rendered versions: `v30/`, `v34/`,
`v41/`, `v42/`, `v43/` (each ~28 MB of webps). Only `v43/` is referenced by
the live Flipbook + Nav banner. The older versions could be moved to a
git-archived branch and recovered from there if needed, but **not while Vernon
is actively iterating** — leaving in place.

---

## Hard "do not touch" list

These were excluded from any proposal:
- Anything under `app/`, `components/`, `lib/`, `sanity/` (compiled into the
  Next.js build).
- Anything under `public/` referenced by an `<Image src=…/>` tag or a route.
- `catalog-print-build/src/*.py` (live print pipeline) + `figma-plugin/code.js`
  (Vernon's Figma source).
- `middleware.ts`, `next.config.ts`, `package*.json`, `*config.*` files.
- Anything tracked in `git ls-files` that the running app actually imports.
- Git history, branches, worktrees. `.git/`, `.github/`, `.vercel/`, `.claude/`.

---

## Production safety mantra

> Every commit on `chore/hubss-organization` must pass `npm run build`.
> If a move would block the build, leave it on the proposed-moves list above
> rather than executing.

This branch contains ONE executed change: a `.gitignore` line for `scratch/`.
That cannot break the build.

---

## What Vernon does next

1. Review this plan.
2. If he wants the `.md` curation: cherry-pick a separate PR off this branch
   that does the `docs/archive/` moves, and merge it into his phase2 work
   (which deletes them) however he prefers.
3. If he wants `_archive/` consolidation: he greenlights specific items and
   I do them on this branch.
4. Merge or close `chore/hubss-organization` based on his preference.

---

*End of plan.*
