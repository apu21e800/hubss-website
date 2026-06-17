# HUBSS Website — Relocation & Auth Notes

_Last updated: 2026-06-17_

## TL;DR
The `hubss-website` repo was relocated from a messy nested **C:** path to a clean **D:** location,
and GitHub credentials were moved out of plaintext into the Windows Credential Manager.
Nothing destructive was done — the old C: copy is intentionally kept as a backstop.

## Locations
| Role | Path |
|---|---|
| **Active working copy (use this)** | `D:\STUDIO-01\02-HUBSS\hubss-website` |
| Old copy (backstop — do not delete yet) | `C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website` |
| GitHub remote (source of truth) | `https://github.com/apu21e800/hubss-website.git` |
| Vercel project | `https://vercel.com/based-agency/hubss-website` |

> Going forward, do all HUBSS work in the **D:** copy so the two don't drift.
> C: is only the safety net until the machine is back from warranty repair and D: is proven.

## What the D: copy is
- Source only — copied via robocopy excluding `node_modules`, `.next`, the old `.git`, and `.claude/worktrees` (the ~45 GB of bloat was left behind).
- Fresh `git init`, connected to `origin`, branch `feat/phase2-applications-to-sanity`, fetched from GitHub.
- Working tree verified **clean** (exact mirror of GitHub `c1c9434`).
- `.git` is ~3.9 GB — this is the real branch history (binary assets baked into past commits), not worktree bloat.

## Git auth (secure)
- Credential helper = **`manager`** (Windows Credential Manager). No more plaintext.
- Old plaintext file `C:\Users\cleve\.git-credentials` was **deleted**.
- The PAT is **not** embedded in any remote URL — the credential helper supplies it.
- Old PAT was revoked on GitHub; new PAT is stored only in Credential Manager.
- To re-auth on a fresh machine: set `git config --global credential.helper manager`, then a `git fetch`/`git push` will prompt and store the credential.

## Build verification
- Vercel builds from **GitHub**, not the local folder — relocating C:→D: required no Vercel changes.
- Production (`hubss.com` / `www.hubss.com`) deploys from **`main`** only. `main` was never pushed.
- Pushing `feat/phase2…` produced a **preview** build (commit `c1c9434`) that went **READY** — confirms the relocated source compiles. Production was untouched.

## Open / optional cleanup (not urgent)
- ~60 disposable `claude/*` session branches still live only on C: (and were never pushed). If any matter, `git push origin --all` from C: before eventually deleting it; otherwise they go when C: is wiped.
- A few no-upstream / unpushed branches on C: (`sync/v50-flyers-to-staging`, `staging`, `staging-merge`, `chore/hubss-reorg-overnight`, etc.) — same: push from C: if wanted before deleting.
- `_archive/design-assets/catalog-print-build/figma-plugin/code.print.js` is **65.65 MB** (over GitHub's recommended 50 MB). Candidate for pruning or Git LFS. `_archive/` is non-website storage.
- When ready to reclaim ~45 GB: push anything wanted from C:, then delete `C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website` (operator runs the `Remove-Item`).

## Hard rules in effect during this work
- Never push `main` / never touch the deployed site. ✅
- Never move or delete files directly — copy, verify, hand operator the `Remove-Item`. ✅ (no deletion done)
- Keep increments small; assume a crash can happen anytime. ✅
