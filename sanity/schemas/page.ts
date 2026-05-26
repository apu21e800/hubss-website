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
      title: "Page identifier (read only — do not change)",
      type: "slug",
      group: "identity",
      readOnly: true,
      options: { source: "title" },
      description: 'This is fixed — do not change it. It tells the website which page these settings belong to.',
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
    defineField({
      name: "aboutStory",
      title: "About — Our Story paragraphs",
      type: "array",
      group: "about",
      description: "The 3-paragraph 'Our Story' body in the left column of the Story section.",
      of: [{ type: "text", rows: 4 }],
    }),
    defineField({
      name: "aboutStoryAside",
      title: "About — Story aside paragraph",
      type: "text",
      rows: 3,
      group: "about",
      description: "The short paragraph below the mission quote (e.g. 'York Region. City of Toronto. City of Vancouver. UBC. ...').",
    }),
    defineField({
      name: "aboutValues",
      title: "About — Values cards",
      type: "array",
      group: "about",
      description: "The three 'What We Stand For' cards (heading + body).",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "heading", type: "string", title: "Heading", validation: (r) => r.required() }),
          defineField({ name: "body", type: "text", title: "Body", rows: 4, validation: (r) => r.required() }),
        ],
        preview: { select: { title: "heading", subtitle: "body" } },
      }],
    }),
    defineField({
      name: "aboutWhyHub",
      title: "About — Why HUB differentiators",
      type: "array",
      group: "about",
      description: "The 'Why HUB' grid cards (title + description). Six entries by default.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", type: "string", title: "Title", validation: (r) => r.required() }),
          defineField({ name: "desc", type: "text", title: "Description", rows: 3, validation: (r) => r.required() }),
        ],
        preview: { select: { title: "title", subtitle: "desc" } },
      }],
    }),
    defineField({
      name: "aboutPartnersIntro",
      title: "About — Manufacturer Partners intro",
      type: "text",
      rows: 4,
      group: "about",
      description: "The intro paragraph below the 'Backed by Industry Leaders' heading.",
    }),
    defineField({
      name: "aboutPartners",
      title: "About — Manufacturer Partner descriptions",
      type: "array",
      group: "about",
      description: "Per-partner description text. Keep partner keys ('gaf', 'ennis-flint') stable — the matching logo/products array stays in code.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "key", type: "string", title: "Partner key (e.g. gaf, ennis-flint)", validation: (r) => r.required() }),
          defineField({ name: "desc", type: "text", title: "Description", rows: 4, validation: (r) => r.required() }),
        ],
        preview: { select: { title: "key", subtitle: "desc" } },
      }],
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
    defineField({
      name: "lunchLearnWhatYouGet",
      title: "Lunch & Learn — 'What You Walk Away With' cards",
      type: "array",
      group: "lunchLearn",
      description: "Three numbered cards in the 'What You Walk Away With' section.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "num", type: "string", title: "Number (e.g. 01)", validation: (r) => r.required() }),
          defineField({ name: "title", type: "string", title: "Card title", validation: (r) => r.required() }),
          defineField({ name: "desc", type: "text", title: "Description", rows: 3, validation: (r) => r.required() }),
        ],
        preview: { select: { title: "title", subtitle: "desc" } },
      }],
    }),
    defineField({
      name: "lunchLearnPersonas",
      title: "Lunch & Learn — Persona cards",
      type: "array",
      group: "lunchLearn",
      description: "The 'Perfect For' / 'Who It's Built For' audience cards (title + desc + badge).",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", type: "string", title: "Audience title", validation: (r) => r.required() }),
          defineField({ name: "desc", type: "text", title: "Description", rows: 3, validation: (r) => r.required() }),
          defineField({ name: "badge", type: "string", title: "Badge text", validation: (r) => r.required() }),
        ],
        preview: { select: { title: "title", subtitle: "badge" } },
      }],
    }),
    defineField({
      name: "lunchLearnFaqs",
      title: "Lunch & Learn — FAQ accordion items",
      type: "array",
      group: "lunchLearn",
      description: "Frequently-asked questions shown in the FAQ accordion.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "q", type: "string", title: "Question", validation: (r) => r.required() }),
          defineField({ name: "a", type: "text", title: "Answer", rows: 4, validation: (r) => r.required() }),
        ],
        preview: { select: { title: "q", subtitle: "a" } },
      }],
    }),
    defineField({
      name: "lunchLearnSectionHeadings",
      title: "Lunch & Learn — Section eyebrows & headings",
      type: "object",
      group: "lunchLearn",
      description: "Short marketing eyebrows + headings for the three mid-page sections.",
      fields: [
        defineField({ name: "whatYouGetEyebrow", type: "string", title: "What You Get — eyebrow" }),
        defineField({ name: "whatYouGetHeading", type: "string", title: "What You Get — heading" }),
        defineField({ name: "personasEyebrow",   type: "string", title: "Personas — eyebrow" }),
        defineField({ name: "personasHeading",   type: "string", title: "Personas — heading" }),
        defineField({ name: "faqEyebrow",        type: "string", title: "FAQ — eyebrow" }),
        defineField({ name: "faqHeading",        type: "string", title: "FAQ — heading" }),
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
