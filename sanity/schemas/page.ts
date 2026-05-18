import { defineField, defineType } from "sanity";
import { richImageField } from "./_shared";

/**
 * Page schema — structured fields per page type.
 * Each field maps 1:1 to visible copy on the page so editors know exactly what they're changing.
 *
 * Slugs are fixed identifiers: "homepage" | "about" | "contact" | "lunch-learn"
 */
export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      description: "Editor-only label — not shown on the public site.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Page identifier",
      type: "slug",
      options: { source: "title" },
      description: 'Fixed identifier — do not change after initial setup. Use "homepage", "about", "contact", or "lunch-learn".',
      validation: (r) => r.required(),
    }),

    // ── Homepage fields ─────────────────────────────────────────────────────

    defineField({
      name: "homepageHero",
      title: "Homepage — Hero",
      type: "object",
      description: "Full-screen hero at the top of the homepage.",
      fields: [
        defineField({ name: "eyebrow",    type: "string", title: "Eyebrow text",    description: 'e.g. "Redefining Hardscapes · Since 1999"' }),
        defineField({ name: "heading",    type: "string", title: "Heading line 1",  description: 'e.g. "The World Is"' }),
        defineField({ name: "subheading", type: "string", title: "Heading line 2 (gradient)", description: 'e.g. "Your Canvas."' }),
        defineField({ name: "tagline",    type: "string", title: "Tagline (below heading)", description: 'e.g. "Let\'s build your signature space."' }),
        defineField({ name: "cta1Label",  type: "string", title: "Primary CTA label",  description: 'e.g. "See the Work"' }),
        defineField({ name: "cta1Href",   type: "string", title: "Primary CTA link",   description: 'e.g. "#field-notes"' }),
        defineField({ name: "cta2Label",  type: "string", title: "Secondary CTA label", description: 'e.g. "See the Systems"' }),
        defineField({ name: "cta2Href",   type: "string", title: "Secondary CTA link",  description: 'e.g. "#systems"' }),
        richImageField("heroImage1", "Hero slide 1 (primary)"),
        richImageField("heroImage2", "Hero slide 2"),
        richImageField("heroImage3", "Hero slide 3"),
      ],
    }),

    // ── About page fields ───────────────────────────────────────────────────

    defineField({
      name: "aboutHero",
      title: "About — Hero",
      type: "object",
      description: "The large heading block at the top of the About page.",
      fields: [
        defineField({ name: "eyebrow",    type: "string", title: "Eyebrow text",    description: 'e.g. "Canadian-Operated Since 1999 · All 10 Provinces"' }),
        defineField({ name: "heading",    type: "string", title: "Hero heading",    description: 'e.g. "The people who made your city look like your city."' }),
        defineField({ name: "subheading", type: "text",   title: "Hero subheading", description: "Paragraph below the heading.", rows: 3 }),
        richImageField("heroImage", "Hero background image"),
      ],
    }),

    defineField({
      name: "aboutMission",
      title: "About — Mission quote",
      type: "string",
      description: 'The pull-quote in the Our Story section. e.g. "Every surface tells a story. We give communities the language to write it."',
    }),

    // ── Contact page fields ─────────────────────────────────────────────────

    defineField({
      name: "contactHero",
      title: "Contact — Hero",
      type: "object",
      description: "The heading block on the left side of the contact page.",
      fields: [
        defineField({ name: "eyebrow",    type: "string", title: "Eyebrow text",    description: 'e.g. "Get In Touch"' }),
        defineField({ name: "heading",    type: "string", title: "Page heading",    description: 'e.g. "Start a Project"' }),
        defineField({ name: "subheading", type: "text",   title: "Intro paragraph", description: "Sentence below the heading.", rows: 2 }),
      ],
    }),

    // ── Lunch & Learn page fields ───────────────────────────────────────────

    defineField({
      name: "lunchLearnHero",
      title: "Lunch & Learn — Hero",
      type: "object",
      description: "The hero section on the Lunch & Learn page.",
      fields: [
        defineField({ name: "eyebrow",         type: "string", title: "Eyebrow text",        description: 'e.g. "Free · No Obligation · Coast to Coast"' }),
        defineField({ name: "headingLine1",    type: "string", title: "Heading line 1",       description: 'e.g. "Lunch Is On Us."' }),
        defineField({ name: "headingLine2",    type: "string", title: "Heading line 2 (gradient)", description: 'e.g. "Your Next Spec Is Free."' }),
        defineField({ name: "subheading",      type: "text",   title: "Intro paragraph",      rows: 3, description: "Paragraph below the heading." }),
        defineField({ name: "ctaLabel",        type: "string", title: "Primary CTA label",    description: 'e.g. "Book Your Free Session"' }),
        defineField({ name: "formHeading",     type: "string", title: "Form section heading", description: 'e.g. "Claim Your Free Lunch & Learn"' }),
        defineField({ name: "formSubheading",  type: "string", title: "Form section subheading", description: 'e.g. "Tell us who you are and where you are — we handle the rest."' }),
        defineField({ name: "submitLabel",     type: "string", title: "Submit button label",  description: 'e.g. "Claim Your Free Lunch & Learn →"' }),
        richImageField("mascotImage", "Mascot / hero image (optional)"),
      ],
    }),

    // ── SEO (shared) ────────────────────────────────────────────────────────

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle",       type: "string", title: "Meta title" }),
        defineField({ name: "metaDescription", type: "text",   title: "Meta description", rows: 2 }),
        defineField({ name: "ogImage",         type: "image",  title: "OG image" }),
      ],
    }),
  ],

  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: `/${slug}` }),
  },
});
