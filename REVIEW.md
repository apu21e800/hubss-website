# Review branch — hubss.com

This branch exists so Doug and Vern can comment on the live site without
touching production. It is `main` plus this file: what deploys here is
exactly what is on hubss.com right now.

## How to leave a comment

Open the preview URL for this branch. A small Vercel toolbar sits at the
bottom of the screen (it is on preview deployments only — `app/layout.tsx`
renders it when `VERCEL_ENV !== "production"`, so it never appears on
hubss.com). Switch it to comment mode, click anything on the page, and type.
The comment is pinned to that element, so there is no need to describe where
it is.

Comments land in the Vercel dashboard against this branch and can be read
back from there, so nothing gets lost in a text thread.

## What is worth a comment

Anything — but the three things we already know we are working on, so no
need to spend a comment on them:

1. **Too dark.** Agreed. A light theme and a "mixed" mode (dark shell, white
   reading sections) are being built on `design/light-dark`. Not ready to
   look at yet.
2. **Copy.** A line-by-line edit is queued — awkward phrasing, anything that
   reads like it was written by someone who does not lay pavement.
3. **Facts.** The product and application copy was rebuilt from the 2027
   print catalogue in September, so it should match the book. Where it does
   not, the book wins — flag it.

What is most useful from Doug specifically: anything factually wrong about
the products, the systems, or the work. That is the part nobody else can
check.

## Notes for whoever picks this up

- Do not merge this branch into `main`. It is a viewing surface; the fixes
  it generates get made on their own branches.
- To refresh it against production: `git fetch origin && git rebase
  origin/main` on this branch, then push. The preview URL stays the same.
- Product and application copy lives half in Sanity — read
  `docs/SANITY-COPY-SYNC.md` before changing any of it, or the change will
  look applied, build clean, and do nothing on the live page.
