# HUBSS CMS Guide

Sanity Studio for HUB Surface Systems — how to edit content, manage images, and keep the site current.

Studio URL: **https://9dbro2m1.sanity.studio/**

---

## 1. Architecture Overview

```
Content flow:

 Doug (editor) → Sanity Studio → Sanity CDN
                                      ↓
                              Next.js ISR fetch
                                      ↓
                         Vercel CDN (cached HTML)
                                      ↓
                              Visitor's browser

Cache invalidation:

  Sanity webhook → POST /api/revalidate → Next.js purges stale pages
```

**Two image stores — intentional hybrid:**

| Category | Where stored | Why |
|---|---|---|
| Hero slides (3 images) | Sanity CDN | Doug can swap them in Studio |
| Blog featured images | Sanity CDN | Doug can upload with posts |
| Lunch & Learn mascot | Sanity CDN | Doug can swap the moose art |
| PDF spec sheets | Sanity CDN | Doug can update without a developer |
| Product galleries | Vercel CDN (`/public/images/products/`) | 881 MB exceeds free tier |
| Application galleries | Vercel CDN (`/public/images/applications/`) | 1.3 GB exceeds free tier |
| Logos & icons | Vercel CDN (`/public/images/assets/`) | Static brand assets |

To move product/application galleries to Sanity: upgrade to Growth plan ($99/month, 50 GB).

---

## 2. How to Add a New Image Field to a Schema

### Step 1 — Add the field to the schema

Open the relevant file in `sanity/schemas/`. Use the `richImageField` helper from `_shared.ts`:

```ts
// sanity/schemas/product.ts
import { richImageField } from "./_shared";

// Inside the fields array:
richImageField("promoImage", "Promo Image"),
// Third arg = true makes alt text required:
richImageField("heroImage", "Hero Image", true),
```

The helper produces a Sanity `image` field with hotspot support, an `alt` text sub-field, and an optional `caption` sub-field.

### Step 2 — Add the field to the GROQ query

Open `lib/sanity.queries.ts` and add the field to the relevant query:

```ts
// Example — add promoImage to the product query:
export const productQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    name,
    slug,
    // ... existing fields ...
    promoImage {
      asset->{ url, metadata { dimensions } },
      alt,
      caption
    }
  }
`;
```

### Step 3 — Render it in a component

```tsx
import { resolveImageUrl } from "@/lib/sanity-image";

// product.promoImage may be a Sanity asset ref OR a legacy string URL
const src = resolveImageUrl(product.promoImage, { width: 800, quality: 80 });

<img
  src={src ?? "/images/placeholder.jpg"}
  alt={product.promoImage?.alt ?? product.name}
/>
```

---

## 3. How to Render Sanity Images in a Component

Always use `resolveImageUrl()` — it handles both Sanity asset refs and legacy `/images/...` strings without breaking.

```tsx
import { resolveImageUrl } from "@/lib/sanity-image";

// Basic usage
const src = resolveImageUrl(doc.heroImage);

// With resize and quality
const src = resolveImageUrl(doc.heroImage, {
  width: 1200,
  height: 630,
  quality: 80,
});

// In JSX with fallback
<img
  src={resolveImageUrl(doc.featuredImage, { width: 800 }) ?? "/images/og-default.jpg"}
  alt={doc.featuredImage?.alt ?? doc.title}
  width={800}
  height={450}
/>
```

For Next.js `<Image>` (preferred for LCP):

```tsx
import NextImage from "next/image";
import { resolveImageUrl } from "@/lib/sanity-image";

const src = resolveImageUrl(doc.heroImage, { width: 1920, quality: 85 });

{src && (
  <NextImage
    src={src}
    alt={doc.heroImage?.alt ?? ""}
    fill
    priority
    className="object-cover"
  />
)}
```

---

## 4. Doug's Guide: Editing Images in Studio

### Upload a new hero slide

1. Go to **Studio → Pages → Homepage**
2. Scroll to **Homepage — Hero**
3. Click **Hero slide 1 (primary)** → drag and drop your image or click to browse
4. Click the **hotspot icon** (crosshair) to pick the focal point — this ensures the right part of the image is visible on mobile
5. Fill in the **Alt text** field (e.g. "Stamped asphalt crosswalk in Vancouver")
6. Click **Publish**

### Swap a blog featured image

1. Go to **Studio → Blog Post / Field Note**
2. Open the post you want to update
3. Click **Featured Image** → upload your new image
4. Set the **Alt text**
5. Click **Publish**

### Update the Lunch & Learn mascot

1. Go to **Studio → Site Settings**
2. Scroll to **Lunch & Learn Images**
3. Click the image you want to replace → upload the new file
4. Click **Publish**

### Tips

- **Hotspot:** always set it. If you don't, Sanity centres the crop — which may cut off the important part on mobile.
- **Alt text:** required for accessibility (AODA compliance). Describe what's in the image, not how it looks.
- **File size:** keep images under 5 MB before upload. Sanity delivers optimised versions automatically.
- **Formats:** JPG for photos, PNG for graphics with transparency, WebP is fine too.

---

## 5. PDF / File Management

### Add a new spec sheet

1. Go to **Studio → Products → [product name]**
2. Scroll to **Product documents**
3. Click **Add item**
4. Fill in:
   - **Document label** — e.g. "StreetBond Technical Data Sheet"
   - **Type** — pick from the dropdown (spec, tds, brochure, etc.)
   - **PDF file (Sanity CDN)** — upload the PDF
5. Click **Publish**

### Replace an existing spec sheet

1. Open the product → **Product documents**
2. Find the document entry
3. Click the **PDF file** field → upload the replacement
4. Click **Publish**

### Fallback: legacy file paths

If a document still has a **File path (legacy)** value but no **PDF file**, the site serves it from `/public/docs/`. This is fine as a fallback but Doug should upload to Sanity CDN when convenient so the site doesn't depend on a Vercel deployment to update PDFs.

---

## 6. Storage Monitoring

Check your Sanity storage usage:

1. Go to **https://sanity.io/manage**
2. Select project **9dbro2m1** (HUBSS)
3. Click **Usage** in the left sidebar

You'll see:
- **Assets stored** (GB used / GB included)
- **API requests** (CDN and non-CDN)
- **Bandwidth**

Free tier includes **5 GB storage**, **500k API requests/month**. The initial upload (heroes + blog + lunch-learn + PDFs) uses approximately **120 MB — well under the 5 GB limit.**

---

## 7. When You Hit the Storage Limit

If you want to add product gallery images (881 MB) or application gallery images (1.3 GB) to Sanity:

**Upgrade to Sanity Growth — $99/month USD**
- 50 GB storage (vs 5 GB free)
- 1M API requests/month (vs 500k)
- Custom roles, custom domains

Steps:
1. Go to sanity.io/manage → project → Billing → Upgrade
2. Run the upload script to push product/application galleries:
   ```bash
   npx tsx scripts/upload-to-sanity.ts --docs-only   # already done
   # Future — would add --products-only and --applications-only flags
   ```
3. Update queries to prefer `heroImage.asset` over `heroImageUrl` strings

Until then, product and application galleries remain on Vercel CDN (`/public/images/`) and are still delivered fast via Vercel Edge Network.

---

## 8. ISR / Cache Invalidation

The site uses Next.js ISR (Incremental Static Regeneration). Pages are cached on Vercel's edge and rebuilt when:

1. **Sanity webhook fires** — Studio publishes a document → webhook POSTs to `/api/revalidate`
2. **Revalidate handler** purges the matching page(s)

### Webhook setup (one-time, already done)

The webhook is configured at sanity.io/manage → project → API → Webhooks:
- URL: `https://hubss.com/api/revalidate`
- Method: POST
- Secret: `SANITY_WEBHOOK_SECRET` env var

### What gets invalidated

| Document type | Pages revalidated |
|---|---|
| `page` (homepage) | `/` |
| `page` (about) | `/about` |
| `page` (contact) | `/contact` |
| `page` (lunch-learn) | `/lunch-learn` |
| `product` | `/products`, `/products/[slug]` |
| `application` | `/applications`, `/applications/[slug]` |
| `blogPost` | `/blog`, `/blog/[slug]` |
| `project` | `/projects` (map) |

If a page doesn't update after publishing: hard-refresh (Ctrl+Shift+R / Cmd+Shift+R) or check the revalidate webhook logs in Vercel → Functions.

---

## 9. Migration Patterns

### Adding a new content type (e.g. "Team Member")

1. Create `sanity/schemas/teamMember.ts` — define fields
2. Add to `sanity/schemas/index.ts` — `import teamMember from "./teamMember"` + add to `schemaTypes`
3. Add a GROQ query to `lib/sanity.queries.ts`
4. Create a data-fetching function in `lib/` (e.g. `lib/team.ts`)
5. Update the relevant page component to call the fetch function
6. Add the new doc type to the revalidation handler (`app/api/revalidate/route.ts`)

### Migrating more images from Vercel CDN to Sanity

Pattern: add `fileAsset` or `heroImage` Sanity field alongside the existing string URL field. Both `resolveImageUrl()` and components read whichever is populated — no breaking changes.

```ts
// resolveImageUrl() handles the fallback automatically:
// - If doc.heroImage is a Sanity ref → CDN URL
// - If doc.heroImage is null but doc.heroImageUrl is "/images/..." → returns the string
const src = resolveImageUrl(doc.heroImage ?? doc.heroImageUrl, { width: 1200 });
```

### Schema versioning

Sanity doesn't have schema migrations — just add new fields. Old documents without the new field return `undefined`, which `resolveImageUrl()` safely handles (returns `null`).

---

---

## 10. Studio UX Patterns

### Field groups (tabs)

Complex schemas use field groups to show organised tabs instead of one long scroll. In Studio you'll see tabs like **Content**, **Media**, **SEO** at the top of each document form.

To add a new tab to an existing schema:

```ts
// 1. Add the group to the `groups` array on the schema
groups: [
  { name: "content", title: "Content", default: true },
  { name: "media",   title: "Media" },
  { name: "newTab",  title: "My New Tab" },  // ← add here
],

// 2. Add `group: "newTab"` to each field that should appear in it
defineField({
  name: "myField",
  title: "My Field",
  type: "string",
  group: "newTab",   // ← assign here
}),
```

Fields without a `group` assignment appear at the top of the form regardless of which tab is active.

### Gallery images (galleryImageItem)

Gallery arrays use the `galleryImageItem` helper from `sanity/schemas/_shared.ts`. This gives every gallery image its own alt text and caption sub-fields, and enforces hotspot support.

```ts
import { galleryImageItem } from "./_shared";

defineField({
  name: "gallery",
  title: "Gallery images",
  type: "array",
  of: [galleryImageItem],  // ← use this instead of { type: "image" }
}),
```

The `galleryImageItem` object includes `hotspot: true`, a required `alt` text field, and an optional `caption` field.

### Image optimisation presets

Use `imagePresets` from `lib/sanity-image.ts` for common rendering contexts — they handle width, quality, format, and crop automatically:

```ts
import { imagePresets } from "@/lib/sanity-image";

// Hero — 1920px wide, q85, crop
<img src={imagePresets.hero(doc.heroImage) ?? "/images/placeholder.jpg"} />

// Card — 800px wide, q85, crop
<img src={imagePresets.card(doc.image) ?? fallback} />

// Thumbnail — 240px wide, q80, crop
<img src={imagePresets.thumb(doc.image) ?? fallback} />

// Open Graph / social sharing — 1200×630, q90
<meta property="og:image" content={imagePresets.og(doc.featuredImage) ?? ogDefault} />
```

All presets fall back gracefully to `null` for Sanity refs that fail, or pass-through for legacy string paths.

For custom sizes, use `resolveImageUrl()` directly — it now defaults to `auto("format")` + `quality(85)`:

```ts
import { resolveImageUrl } from "@/lib/sanity-image";

const src = resolveImageUrl(doc.heroImage, { width: 1200, height: 800 });
```

### Custom document previews

Each schema has a `preview` config that controls what's shown in the Studio document list. The pattern is:

```ts
preview: {
  select: {
    title: "fieldName",        // maps to preview.title
    subtitle: "anotherField",  // maps to preview.subtitle
    media: "imageField",       // maps to preview.media (thumbnail)
  },
  prepare: ({ title, subtitle, media }) => ({
    title,
    subtitle: subtitle?.slice(0, 60) ?? "No description",
    media,
  }),
},
```

The `prepare` function lets you format dates, truncate long strings, or compose multiple fields into a subtitle. For dates use `new Date(publishedAt).toLocaleDateString("en-CA")`.

---

*Last updated: 2026-05-17 — Vernon Stordy / Based Agency*
