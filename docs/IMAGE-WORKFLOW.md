# HUBSS Images — how to update them, start to finish

For Vern. This is the whole loop: where images live, how you add and remove them,
and the exact prompts to send Claude Code.

---

## The one rule (since Sep 2026)

**The galleries live in Sanity Studio.** Open hubss.com/studio, pick a product
or an application, and go to the Media tab. Publish, and the page updates within
seconds.

| You want to… | In Studio you… |
|---|---|
| Add a photo | Drag it into **Gallery images**, write its alt text, Publish |
| Remove a photo | Open its menu (⋯) → Remove, Publish |
| Reorder | Drag it up or down. The first photo is shown large. Publish |
| Change the hero (the wide photo behind the title) | Replace **Hero image** on the same tab, Publish |
| Change the homepage or About hero | Pages → Homepage (or About) → the hero photo, Publish |

Every photo needs alt text before Studio will publish it. Describe what's in
the picture: that's what screen readers read out and what Google Images ranks.

Photos are served by Sanity's image CDN, resized for each screen, and never go
through Vercel's image optimizer (lib/photos.ts).

### The folders are now the backup

A page whose Sanity gallery is empty shows its `/public/images` folder, exactly
as before, so a mistake in Studio can never leave a page without photos. Adding
a file to a folder no longer changes a page that has a Sanity gallery: add it
in Studio instead.

The folders are also where the galleries came from. `npm run photos:sync`
copied each page's photos, order, alt text and captions into Sanity on
24 Sep 2026 (`scripts/sync-photos-to-sanity.ts`); `npm run photos:check`
compares Sanity with the folders. Don't re-run the sync without a reason: it
makes Sanity match the folders again, which would undo gallery edits made in
Studio.

---

## The folders (the fallback)

Open: `...\Web_Projects\hubss-website\public\images\`

```
public/images/
├── products/
│   ├── streetbond/          ← StreetBond page gallery
│   ├── streetprint/         ← StreetPrint page gallery
│   ├── traffic-patterns-xd/
│   ├── decomark/ mmax/ duratherm/ durashield/ premark/ airmark/ …
│   │
│   └── (one folder per product — the folder name matches the web address:
│        /products/streetbond  →  products/streetbond/)
│
├── applications/
│   ├── crosswalks/          ← Crosswalks page gallery
│   ├── bike-lanes/ bus-lanes/ parks-paths/ playgrounds/ …
│   └── (one folder per application, same naming rule)
│
├── blog/<post-slug>/        ← the blog's photos before Sep 2026; posts now use Studio uploads,
│                              but lib/map-projects.ts pins still point here
├── patterns/                ← StreetPrint template drawings
├── hero/                    ← homepage hero slides
├── projects/  about/  partners/  logos/  lunch-learn/  instagram/
└── assets/                  ← old junk drawer. Don't add here; we're retiring it.

public/docs/<ProductLine>/   ← PDFs (spec sheets, colour cards)
```

Two folders are shared on purpose: **Pedestrian Safety** shows the `crosswalks`
folder, and **Public Art** shows `community-branding`. Same photo pool, two pages.

A full map with file counts and sizes lives in the repo at
`docs/ASSET-INVENTORY.md` — regenerate it any time with `npm run assets:inventory`.

---

## Rules the site follows automatically

- **Included:** `.jpg` `.jpeg` `.png` `.webp`
- **Ignored:** anything with `logo` in the name, anything starting with `_`, and `.svg`
- **The hero photo never appears twice** — it's removed from its own gallery automatically
- **Order:** natural filename order, so `crosswalks-2` comes before `crosswalks-10`

Naming: lowercase, hyphens, no spaces. `richmond-hill-crosswalk-01.jpg`, not
`Richmond Hill Crosswalk (1).JPG`.

**Names matter more than they used to** — the alt text search engines and screen
readers read is now built from the filename. `vaughan-woodbridge-crosswalk.jpg`
becomes *"Crosswalks surface systems by HUB — Vaughan Woodbridge Crosswalk."*
A file called `IMG_4471.jpg` gives you nothing. Name the good ones properly.

---

## Size and format

Before dropping in big camera files:

- **Long edge ≤ 2400px**, JPEG quality ~85 — that's the repo standard
- A good photo lands around **300–800 KB**. Multi-megabyte files slow the site and
  bloat the repo permanently (git never forgets a file).

Don't do this by hand. Prompt below does it for you.

---

## The prompts

### Add or replace photos
Drop your files into the right folder, then:

```
I've added/removed images under public/images/. Please:
1. Show me a summary of what changed (git status), grouped by folder.
2. Optimize any new image over 800 KB: resize the long edge to max 2400px,
   JPEG quality 85 (mozjpeg), strip EXIF orientation by baking the rotation in.
   Report before/after sizes.
3. Flag any filename that's not lowercase-hyphenated or that looks like a camera
   default (IMG_, DSC_, screenshot). Suggest better names — don't rename without asking.
4. Run: npm run assets:inventory
5. Commit with a clear message and push to v2.
```

### Just ship what I changed
```
Commit and push my image changes on v2. One commit, clear message.
```

### Bulk-import a pile of photos
```
I have a folder of photos at <PATH>. Please:
1. Show me what's there — count, total size, any duplicates (by file hash).
2. Ask me which product or application folder each batch belongs in.
3. Copy them in with the naming convention <folder>-NN.jpg, optimize per the
   rules above, then run npm run assets:inventory and show me the diff.
Do not delete anything from the source folder.
```

### Check the site before pushing
```
Run npm run build, then npm run start, and open /products/streetbond and
/applications/crosswalks. Tell me the photo count on each and flag any
broken images.
```

---

## Your curation loop

1. **See what's there** — open the folder, or read `docs/ASSET-INVENTORY.md`
2. **Delete the weak ones** — straight from the folder. That's the edit.
3. **Add the good ones** — named properly
4. **Prompt Claude Code** to optimize + push
5. **Check the page** two minutes later

That's it. You curate with a file browser, which is the right tool for judging
photos — big thumbnails, fast deleting, no interface in your way.

---

## What's still in code (and why)

| Thing | Where | Why |
|---|---|---|
| Hero image per product/application | `lib/products.ts`, `lib/applications.ts` | The hero is a deliberate choice, not "first file alphabetically" |
| Page copy, names, specs | Sanity (Studio) + those same files | Words live in the CMS |
| Pattern template drawings | `lib/pattern-templates.ts` | Each has a proper name and caption |

Want a hero changed? Tell me the product and the filename — one line, done.

---

## Two things to know about Sanity

1. **Sanity wins over code for words.** Product descriptions, page copy, the
   resources list — if it's in the Studio, the Studio's version is what ships.
   That's correct behaviour, but it means a code edit can look like it did
   nothing. When copy won't change, check the Studio first.
2. **Sanity does not manage the photos.** Galleries are folders. Only the words
   are in the CMS. That split is deliberate: photos are files, and files belong
   in folders.
