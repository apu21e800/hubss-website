import { defineField, defineType } from "sanity";
import { ActivityIcon } from "@sanity/icons";

/**
 * Prize Draw audit log — every submission attempt (success or reject) lands
 * here. Lets Doug + Vernon spot abuse patterns from Studio without exposing
 * raw IP addresses or rejected entries inside the main "Prize Draw Entries"
 * list. Audit docs intentionally live in a separate sidebar group.
 */
export default defineType({
  name: "prizeDrawAudit",
  title: "Prize Draw Audit",
  type: "document",
  icon: ActivityIcon,
  // Audit docs are server-only — never edited by hand.
  liveEdit: false,

  fields: [
    defineField({
      name: "timestamp",
      title: "Timestamp",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Success",           value: "success" },
          { title: "Duplicate email",   value: "duplicate" },
          { title: "Rate-limited",      value: "rate_limited" },
          { title: "Bot timing",        value: "bot_timing" },
          { title: "Origin rejected",   value: "origin_rejected" },
          { title: "Validation failed", value: "validation_failed" },
          { title: "Nonce invalid",     value: "nonce_invalid" },
          { title: "Server error",      value: "server_error" },
        ],
      },
    }),
    defineField({
      name: "reason",
      title: "Reason",
      type: "string",
      readOnly: true,
      description: "Short internal note — not shown to the submitter.",
    }),
    defineField({
      name: "hashedIp",
      title: "Hashed IP",
      type: "string",
      readOnly: true,
      description: "SHA-256 of (CONNECT_IP_SALT + raw IP). Lets us count repeats without storing PII.",
    }),
    defineField({
      name: "userAgentPrefix",
      title: "User agent (first 100 chars)",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "rateLimitBackend",
      title: "Rate-limit backend used",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Vercel KV",      value: "kv" },
          { title: "Upstash Redis",  value: "upstash" },
          { title: "Sanity fallback", value: "sanity" },
          { title: "In-memory",      value: "memory" },
        ],
      },
    }),
  ],

  preview: {
    select: {
      title: "outcome",
      subtitle: "reason",
      timestamp: "timestamp",
    },
    prepare({ title, subtitle, timestamp }) {
      const when = timestamp
        ? new Date(timestamp).toLocaleString("en-CA", {
            timeZone: "America/Toronto",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          })
        : "—";
      const dot =
        title === "success"
          ? "✅"
          : title === "duplicate"
          ? "♻️"
          : title === "server_error"
          ? "🛑"
          : "🚫";
      return {
        title: `${dot} ${title ?? "(unknown)"}`,
        subtitle: `${when}  ·  ${subtitle ?? ""}`,
      };
    },
  },

  orderings: [
    {
      title: "Newest first",
      name: "timestampDesc",
      by: [{ field: "timestamp", direction: "desc" }],
    },
  ],
});
