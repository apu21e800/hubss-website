# Cross-posting: one photo, several galleries

> Companion to `docs/IMAGE-WORKFLOW.md`. That doc explains the main rule — the
> folder IS the gallery. This one covers the single honest exception.

A photo of an AirMark taxiway marking is genuinely an **AirMark** photo *and* an
**Airports** photo — but a file can only live in one folder.

`lib/gallery-crossposts.mjs` is where that gets said out loud. It maps a gallery
to image paths that live in *other* folders. Cross-posts render after the
gallery's own images, are de-duplicated, and a path pointing at a deleted file
is dropped with a build warning instead of shipping a broken image.

```js
"images/applications/airports": [
  "/images/products/airmark/airmark-01.jpg",   // stays in the airmark folder
  ...
]
```

**Replace the file once and every gallery it appears in updates.** There is
still exactly one copy on disk.

## Why this file exists

Four application pages have **no folder of their own**: `pedestrian-safety`,
`private-driveways`, `public-art`, `regulatory-markings`. Before cross-posts,
each one silently fell back to a *neighbour's* folder — so
`/applications/private-driveways` served the identical 44 photos as
`/applications/residential-driveways`, and `/applications/pedestrian-safety`
was a pixel-for-pixel clone of `/applications/crosswalks`. Three pairs of live
pages were photographic duplicates of each other.

All 259 cross-post entries were **recovered from the curation that already
existed in Sanity**, and every path resolves to a file already on disk. Nothing
was invented; the editorial judgement was already made, and is now written down
where a folder-driven build can't lose it.

The proof it's complete: the sync script's "extra" column counts images Sanity
held that the folder model couldn't express. It went from **112 to 0**.

## Adding a cross-post

Find the gallery key in `lib/gallery-crossposts.mjs`, add the image's real
path. That's it — the file stays in exactly one folder.

## Retiring one

Create `public/images/applications/<slug>/`, drop photos in, and delete that
slug's block from `lib/gallery-crossposts.mjs`. The folder always wins.

`public-art` is the one page that genuinely needs new photography — its 14
images are the community-branding set, in Sanity as well as on disk. It has no
pictures of its own anywhere.
