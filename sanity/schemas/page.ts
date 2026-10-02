import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";
import { copyStyle, headingStyle, richImageField } from "./_shared";

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
      description: "Editor-only label, not shown on the public site. Used to identify this document in the Studio list.",
      validation: (r) => r.required().error("Internal title is required"),
    }),
    defineField({
      name: "slug",
      title: "Page identifier (read only, do not change)",
      type: "slug",
      group: "identity",
      readOnly: true,
      options: { source: "title" },
      description: 'This is fixed. Do not change it. It tells the website which page these settings belong to.',
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
      title: "Homepage · Hero",
      type: "object",
      group: "homepage",
      description: "Full-screen hero at the top of the homepage. This is the first thing visitors see.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow text",
          description: 'Small label above the main heading (e.g. "Redefining Hardscapes · Since 1999").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading line 1",
          description: 'First line of the large hero heading (e.g. "The World Is").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "subheading",
          type: "string",
          title: "Heading line 2 (gradient accent)",
          description: 'Second line rendered with the orange gradient (e.g. "Your Canvas.").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "tagline",
          type: "string",
          title: "Tagline",
          description: 'Short line below the heading (e.g. "Let\'s build your signature space.").',
          validation: (r) => copyStyle(r),
        }),
        defineField({
          name: "cta1Label",
          type: "string",
          title: "Primary CTA label",
          description: 'Text on the main call-to-action button (e.g. "See the Work").',
          validation: (r) => headingStyle(r),
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
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "cta2Href",
          type: "string",
          title: "Secondary CTA link",
          description: 'URL or anchor the secondary button points to (e.g. "#systems" or "/products").',
        }),
        richImageField("heroImage1", "Hero photo (shown on the homepage)"),
        richImageField("heroImage2", "Hero slide 2 (not shown on the site yet)"),
        richImageField("heroImage3", "Hero slide 3 (not shown on the site yet)"),
      ],
    }),

    // ── About page fields ───────────────────────────────────────────────────

    defineField({
      name: "aboutHero",
      title: "About · Hero",
      type: "object",
      group: "about",
      description: "The large heading block at the top of the About page.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow text",
          description: 'Small label above the heading (e.g. "Canadian-Operated Since 1999 · All 10 Provinces").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Hero heading",
          description: 'The main About page headline (e.g. "The people who made your city look like your city.").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "subheading",
          type: "text",
          title: "Hero subheading",
          rows: 3,
          description: "One sentence below the heading, 20 words at most (since 30 Sep 2026 the About page keeps its words few).",
          validation: (r) => [r.max(400).warning("Keep the subheading under 400 characters"), copyStyle(r)],
        }),
        richImageField("heroImage", "Hero background photo (behind the About page title)"),
      ],
    }),

    defineField({
      name: "aboutMission",
      title: "About · Mission quote",
      type: "string",
      group: "about",
      description: "Not shown on the About page since 30 Sep 2026 (the page was trimmed). Kept, hidden, in case it comes back.",
      hidden: true,
      validation: (r) => [r.max(200).warning("Mission quote should be under 200 characters"), copyStyle(r)],
    }),
    defineField({
      name: "aboutStory",
      title: "About · Our Story paragraphs",
      type: "array",
      group: "about",
      description: "'How we got here': two short paragraphs beside the four project photos. Keep each under 40 words.",
      of: [defineArrayMember({ type: "text", rows: 4, validation: (r) => copyStyle(r) })],
    }),
    defineField({
      name: "aboutStoryAside",
      title: "About · Story aside paragraph",
      type: "text",
      rows: 3,
      group: "about",
      description: "Not shown on the About page since 30 Sep 2026 (the page was trimmed). Kept, hidden, in case it comes back.",
      hidden: true,
      validation: (r) => copyStyle(r),
    }),
    defineField({
      name: "aboutValues",
      title: "About · Values cards",
      type: "array",
      group: "about",
      description: "Not shown on the About page since 30 Sep 2026 (the page was trimmed). Kept, hidden, in case it comes back.",
      hidden: true,
      of: [{
        type: "object",
        fields: [
          defineField({ name: "heading", type: "string", title: "Heading", validation: (r) => [r.required(), headingStyle(r)] }),
          defineField({ name: "body", type: "text", title: "Body", rows: 4, validation: (r) => [r.required(), copyStyle(r)] }),
        ],
        preview: { select: { title: "heading", subtitle: "body" } },
      }],
    }),
    defineField({
      name: "aboutWhyHub",
      title: "About · Why HUB differentiators",
      type: "array",
      group: "about",
      description: "The 'Why HUB' cards: a short title and one sentence each. Three by default.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", type: "string", title: "Title", validation: (r) => [r.required(), headingStyle(r)] }),
          defineField({ name: "desc", type: "text", title: "Description", rows: 3, validation: (r) => [r.required(), copyStyle(r)] }),
        ],
        preview: { select: { title: "title", subtitle: "desc" } },
      }],
    }),
    defineField({
      name: "aboutPartnersIntro",
      title: "About · Manufacturer Partners intro",
      type: "text",
      rows: 4,
      group: "about",
      description: "One sentence below the 'Who stands behind the systems' heading.",
      validation: (r) => copyStyle(r),
    }),
    defineField({
      name: "aboutPartners",
      title: "About · Manufacturer Partner descriptions",
      type: "array",
      group: "about",
      description: "Not shown on the About page since 30 Sep 2026: the partner cards show the logo and the systems only. Kept, hidden, in case it comes back.",
      hidden: true,
      of: [{
        type: "object",
        fields: [
          defineField({ name: "key", type: "string", title: "Partner key (e.g. gaf, ennis-flint)", validation: (r) => r.required() }),
          defineField({ name: "desc", type: "text", title: "Description", rows: 4, validation: (r) => [r.required(), copyStyle(r)] }),
        ],
        preview: { select: { title: "key", subtitle: "desc" } },
      }],
    }),

    // ── Contact page fields ─────────────────────────────────────────────────

    defineField({
      name: "contactHero",
      title: "Contact · Hero",
      type: "object",
      group: "contact",
      description: "The heading block on the left side of the contact page.",
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow text",
          description: 'Small label above the heading (e.g. "Get In Touch").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Page heading",
          description: 'The main Contact page headline (e.g. "Start a Project").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "subheading",
          type: "text",
          title: "Intro paragraph",
          rows: 2,
          description: "1–2 sentences below the heading that invite visitors to reach out.",
          validation: (r) => [r.max(250).warning("Keep the intro under 250 characters"), copyStyle(r)],
        }),
      ],
    }),

    // ── Lunch & Learn page fields ───────────────────────────────────────────

    // 2 Oct 2026: /lunch-learn (app/lunch-learn/page.tsx) reads two fields from
    // this group, lunchLearnFaqs and lunchLearnSectionHeadings.faqHeading, and
    // `npm run sync:pages` writes those two. The rest is hidden in Studio and
    // kept, as the trimmed About fields are: the hero (not read since Aug 2026,
    // when the boardroom card took the top of the page), the "What You Walk
    // Away With" cards (not rendered since 30 Sep 2026), the persona cards
    // (made way for the session topic tiles, which are code) and the five
    // other headings.
    defineField({
      name: "lunchLearnHero",
      title: "Lunch & Learn · Hero",
      type: "object",
      group: "lunchLearn",
      description: "Not read since Aug 2026: the top of /lunch-learn is the booking card, whose copy is code. Kept, hidden, in case it comes back.",
      hidden: true,
      fields: [
        defineField({
          name: "eyebrow",
          type: "string",
          title: "Eyebrow text",
          description: 'Small label above the heading (e.g. "Free · No Obligation · Coast to Coast").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "headingLine1",
          type: "string",
          title: "Heading line 1",
          description: 'First line of the hero heading (e.g. "Lunch Is On Us.").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "headingLine2",
          type: "string",
          title: "Heading line 2 (gradient accent)",
          description: 'Second line rendered with the orange gradient (e.g. "Your Next Spec Is Free.").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "subheading",
          type: "text",
          title: "Intro paragraph",
          rows: 3,
          description: "2–3 sentences below the heading describing the offer.",
          validation: (r) => [r.max(400).warning("Keep the intro under 400 characters"), copyStyle(r)],
        }),
        defineField({
          name: "ctaLabel",
          type: "string",
          title: "Primary CTA label",
          description: 'Text on the scroll-to-form button (e.g. "Book Your Free Session").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "formHeading",
          type: "string",
          title: "Form section heading",
          description: 'Heading above the registration form (e.g. "Claim Your Free Lunch & Learn").',
          validation: (r) => headingStyle(r),
        }),
        defineField({
          name: "formSubheading",
          type: "string",
          title: "Form section subheading",
          description: 'Short line below the form heading (e.g. "Tell us who you are and where you are. We handle the rest.").',
          validation: (r) => copyStyle(r),
        }),
        defineField({
          name: "submitLabel",
          type: "string",
          title: "Submit button label",
          description: 'Text on the form submit button (e.g. "Claim Your Free Lunch & Learn →").',
          validation: (r) => headingStyle(r),
        }),
        richImageField("mascotImage", "Mascot / hero image (optional)"),
      ],
    }),
    defineField({
      name: "lunchLearnWhatYouGet",
      title: "Lunch & Learn · 'What You Walk Away With' cards",
      type: "array",
      group: "lunchLearn",
      description: "Not shown on /lunch-learn since 30 Sep 2026 (the page was cleaned up). Kept, hidden, in case it comes back.",
      hidden: true,
      of: [{
        type: "object",
        fields: [
          defineField({ name: "num", type: "string", title: "Number (e.g. 01)", validation: (r) => r.required() }),
          defineField({ name: "title", type: "string", title: "Card title", validation: (r) => [r.required(), headingStyle(r)] }),
          defineField({ name: "desc", type: "text", title: "Description", rows: 3, validation: (r) => [r.required(), copyStyle(r)] }),
        ],
        preview: { select: { title: "title", subtitle: "desc" } },
      }],
    }),
    defineField({
      name: "lunchLearnPersonas",
      title: "Lunch & Learn · Persona cards",
      type: "array",
      group: "lunchLearn",
      description: "Not shown on /lunch-learn since 2 Oct 2026: the session topic tiles stand where the audience cards did. Kept, hidden, in case it comes back.",
      hidden: true,
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", type: "string", title: "Audience title", validation: (r) => [r.required(), headingStyle(r)] }),
          defineField({ name: "desc", type: "text", title: "Description", rows: 3, validation: (r) => [r.required(), copyStyle(r)] }),
          defineField({ name: "badge", type: "string", title: "Badge text", validation: (r) => [r.required(), headingStyle(r)] }),
        ],
        preview: { select: { title: "title", subtitle: "badge" } },
      }],
    }),
    defineField({
      name: "lunchLearnFaqs",
      title: "Lunch & Learn · Common questions",
      type: "array",
      group: "lunchLearn",
      description: "The questions and answers under the booking card on /lunch-learn. The page's FAQ schema is built from this list, so Google reads what a visitor reads. No CE credit claims: HUB does not offer them.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "q", type: "string", title: "Question", validation: (r) => [r.required(), headingStyle(r)] }),
          defineField({ name: "a", type: "text", title: "Answer", rows: 4, validation: (r) => [r.required(), copyStyle(r)] }),
        ],
        preview: { select: { title: "q", subtitle: "a" } },
      }],
    }),
    defineField({
      name: "lunchLearnSectionHeadings",
      title: "Lunch & Learn · Section headings",
      type: "object",
      group: "lunchLearn",
      description: "Only the questions' heading is shown (since 2 Oct 2026); the other five are kept, hidden.",
      fields: [
        defineField({ name: "whatYouGetEyebrow", type: "string", title: "What You Get · eyebrow", hidden: true, validation: (r) => headingStyle(r) }),
        defineField({ name: "whatYouGetHeading", type: "string", title: "What You Get · heading", hidden: true, validation: (r) => headingStyle(r) }),
        defineField({ name: "personasEyebrow",   type: "string", title: "Personas · eyebrow", hidden: true, validation: (r) => headingStyle(r) }),
        defineField({ name: "personasHeading",   type: "string", title: "Personas · heading", hidden: true, validation: (r) => headingStyle(r) }),
        defineField({ name: "faqEyebrow",        type: "string", title: "FAQ · eyebrow", hidden: true, validation: (r) => headingStyle(r) }),
        defineField({ name: "faqHeading",        type: "string", title: "Common questions · heading", description: "The heading over the questions on /lunch-learn.", validation: (r) => headingStyle(r) }),
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
          validation: (r) => [r.max(60).warning("Meta title should be under 60 characters for best display in search results"), copyStyle(r)],
        }),
        defineField({
          name: "metaDescription",
          type: "text",
          title: "Meta description",
          rows: 2,
          description: "Appears in search result snippets. Ideal: 140–160 characters.",
          validation: (r) => [r.max(160).warning("Meta description should be under 160 characters"), copyStyle(r)],
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
