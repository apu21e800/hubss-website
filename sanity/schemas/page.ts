import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";
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
  icon: HomeIcon,

  groups: [
    { name: "identity",    title: "Identity",      default: true },
    { name: "homepage",    title: "Homepage" },
    { name: "about",       title: "About" },
    { name: "contact",     title: "Contact" },
    { name: "lunchLearn",  title: "Lunch & Learn" },
    { name: "seo",         title: "SEO" },
  ],

  fields: [
    // ── Identity ────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      group: "identity",
      description: "Editor-only label — not shown on the public site. Used to identify this document in the Studio list.",
      validation: (r) => r.required().error("Internal title is required"),
    }),
    defineField({
      name: "slug",
      title: "Page identifier",
      type: "slug",
      group: "identity",
      options: { source: "title" },
      description: 'Fixed identifier that determines which page these fields appear on. Use exactly: "homepage", "about", "contact", or "lunch-learn". Do not change after initial setup.',
      validation: (r) =>
        r
          .required()
          .error("Page identifier is required")
          .custom((slug) => {
            if (!slug?.current) return true;
            const valid = ["homepage", "about", "contact", "lunch-learn"];
            return valid.includes(slug.current)
              ? true
              : `Page identifier must be one of: ${valid.join(", ")}`;
          }),
    }),

    // ── Homepage fields ─────────────────────────────────────────────────────

    defineField({
      name: "homepageHero",
      title: "Homepage — Hero",
      type: "object",
      group: "homepage",
      description: "Full-screen hero at the top of the homepage. This is the first thing visitors see — make it count.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow text",
          description: 'Small label above the main heading (e.g. "Redefining Hardscapes · Since 1999").',
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading line 1",
          description: 'First line of the large hero heading (e.g. "The World Is").',
        }),
        defineField({
          name: "subheading",
          type: "string",
          title: "Heading line 2 (gradient accent)",
          description: 'Second line rendered with the orange gradient (e.g. "Your Canvas.").',
        }),
        defineField({
          name: "tagline",
          type: "string",
          title: "Tagline",
          description: 'Short line below the heading (e.g. "Let\'s build your signature space.").',
        }),
        defineField({
          name: "cta1Label",
          type: "string",
          title: "Primary CTA label",
          description: 'Text on the main call-to-action button (e.g. "See the Work").',
        }),
        defineField({
          name: "cta1Href",
          type: "string",
          title: "Primary CTA link",
          description: 'URL or anchor the primary button points to (e.g. "#field-notes" or "/projects").',
        }),
        defineField({
          name: "cta2Label",
          type: "string",
          title: "Secondary CTA label",
          description: 'Text on the secondary button (e.g. "See the Systems").',
        }),
        defineField({
          name: "cta2Href",
          type: "string",
          title: "Secondary CTA link",
          description: 'URL or anchor the secondary button points to (e.g. "#systems" or "/products").',
        }),
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
      group: "about",
      description: "The large heading block at the top of the About page.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow text",
          description: 'Small label above the heading (e.g. "Canadian-Operated Since 1999 · All 10 Provinces").',
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Hero heading",
          description: 'The main About page headline (e.g. "The people who made your city look like your city.").',
        }),
        defineField({
          name: "subheading",
          type: "text",
          title: "Hero subheading",
          rows: 3,
          description: "Paragraph below the heading — 2–3 sentences about HUB's story or mission.",
          validation: (r) => r.max(400).warning("Keep the subheading under 400 characters"),
        }),
        richImageField("heroImage", "Hero background image"),
      ],
    }),

    defineField({
      name: "aboutMission",
      title: "About — Mission quote",
      type: "string",
      group: "about",
      description: 'The pull-quote displayed in the Our Story section — make it memorable (e.g. "Every surface tells a story. We give communities the language to write it.").',
      validation: (r) => r.max(200).warning("Mission quote should be under 200 characters"),
    }),

    // ── Contact page fields ─────────────────────────────────────────────────

    defineField({
      name: "contactHero",
      title: "Contact — Hero",
      type: "object",
      group: "contact",
      description: "The heading block on the left side of the contact page.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow text",
          description: 'Small label above the heading (e.g. "Get In Touch").',
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Page heading",
          description: 'The main Contact page headline (e.g. "Start a Project").',
        }),
        defineField({
          name: "subheading",
          type: "text",
          title: "Intro paragraph",
          rows: 2,
          description: "1–2 sentences below the heading that invite visitors to reach out.",
          validation: (r) => r.max(250).warning("Keep the intro under 250 characters"),
        }),
      ],
    }),

    // ── Lunch & Learn page fields ───────────────────────────────────────────

    defineField({
      name: "lunchLearnHero",
      title: "Lunch & Learn — Hero",
      type: "object",
      group: "lunchLearn",
      description: "The hero section on the Lunch & Learn landing page.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow text",
          description: 'Small label above the heading (e.g. "Free · No Obligation · Coast to Coast").',
        }),
        defineField({
          name: "headingLine1",
          type: "string",
          title: "Heading line 1",
          description: 'First line of the hero heading (e.g. "Lunch Is On Us.").',
        }),
        defineField({
          name: "headingLine2",
          type: "string",
          title: "Heading line 2 (gradient accent)",
          description: 'Second line rendered with the orange gradient (e.g. "Your Next Spec Is Free.").',
        }),
        defineField({
          name: "subheading",
          type: "text",
          title: "Intro paragraph",
          rows: 3,
          description: "2–3 sentences below the heading describing the offer.",
          validation: (r) => r.max(400).warning("Keep the intro under 400 characters"),
        }),
        defineField({
          name: "ctaLabel",
          type: "string",
          title: "Primary CTA label",
          description: 'Text on the scroll-to-form button (e.g. "Book Your Free Session").',
        }),
        defineField({
          name: "formHeading",
          type: "string",
          title: "Form section heading",
          description: 'Heading above the registration form (e.g. "Claim Your Free Lunch & Learn").',
        }),
        defineField({
          name: "formSubheading",
          type: "string",
          title: "Form section subheading",
          description: 'Short line below the form heading (e.g. "Tell us who you are and where you are — we handle the rest.").',
        }),
        defineField({
          name: "submitLabel",
          type: "string",
          title: "Submit button label",
          description: 'Text on the form submit button (e.g. "Claim Your Free Lunch & Learn →").',
        }),
        richImageField("mascotImage", "Mascot / hero image (optional)"),
      ],
    }),

    // ── SEO (shared) ────────────────────────────────────────────────────────

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      description: "Search engine metadata for this page. Appears in Google results and social sharing previews.",
      fields: [
        defineField({
          name: "metaTitle",
          type: "string",
          title: "Meta title",
          description: "Appears in browser tabs and search results. Ideal: 50–60 characters.",
          validation: (r) => r.max(60).warning("Meta title should be under 60 characters for best display in search results"),
        }),
        defineField({
          name: "metaDescription",
          type: "text",
          title: "Meta description",
          rows: 2,
          description: "Appears in search result snippets. Ideal: 140–160 characters.",
          validation: (r) => r.max(160).warning("Meta description should be under 160 characters"),
        }),
        defineField({
          name: "ogImage",
          type: "image",
          title: "Social sharing image (OG image)",
          description: "Image shown when this page is shared on social media. Ideal size: 1200×630 px. Leave blank to use the site default.",
        }),
      ],
    }),
  ],

  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug}` : "No slug set" }),
  },
});
