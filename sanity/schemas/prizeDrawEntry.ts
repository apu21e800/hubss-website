import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

/**
 * Prize Draw entry — captured from /connect (booth QR landing).
 * One document per submission. Doug picks the winner manually after the show.
 */
export default defineType({
  name: "prizeDrawEntry",
  title: "Prize Draw Entry",
  type: "document",
  icon: StarIcon,
  // Read-only in Studio — entries are created by the public API only.
  // Doug can still mark winners by editing the `isWinner` flag.
  liveEdit: false,

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "company",
      title: "Company / Organization",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: "Optional — what they do at their company.",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description: "Optional.",
    }),
    defineField({
      name: "optInMarketing",
      title: "Opted in to marketing",
      type: "boolean",
      description: "CASL: true only if the entrant explicitly checked the marketing opt-in box.",
      initialValue: false,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      description: "Server-set timestamp on creation.",
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Which booth or campaign this entry came from (e.g. 'tradeshow-2026').",
      initialValue: "booth-connect",
    }),
    defineField({
      name: "isWinner",
      title: "Winner",
      type: "boolean",
      description: "Mark when the prize draw winner is selected.",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "company",
      submittedAt: "submittedAt",
      isWinner: "isWinner",
    },
    prepare({ title, subtitle, submittedAt, isWinner }) {
      const when = submittedAt
        ? new Date(submittedAt).toLocaleString("en-CA", {
            timeZone: "America/Toronto",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : "—";
      return {
        title: `${isWinner ? "🏆 " : ""}${title ?? "Unnamed"}`,
        subtitle: `${subtitle ?? "No company"} · ${when}`,
      };
    },
  },

  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
