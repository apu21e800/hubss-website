#!/usr/bin/env node
/**
 * .github/scripts/notion-sync.js
 *
 * SCAFFOLD — Not yet active.
 *
 * Intended purpose:
 *   Sync HUBSS blog post metadata (title, slug, date, excerpt, tags) and the
 *   generated social copy from content/blog/*.social.json into a Notion
 *   database, giving the content team a single place to review, edit, and
 *   approve social drafts before scheduling.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PREREQUISITES
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. Create a Notion integration at https://www.notion.so/profile/integrations
 *    - Grant it access to your target database page.
 *    - Copy the "Internal Integration Token".
 *
 * 2. Add GitHub Secrets (Settings → Secrets and variables → Actions):
 *    - NOTION_API_KEY       ← the integration token  (secret.NOTION_API_KEY)
 *    - NOTION_DATABASE_ID   ← the 32-char database ID from the Notion URL
 *
 * 3. Add @notionhq/client to package.json:
 *    npm install --save-dev @notionhq/client
 *
 * 4. Wire up the workflow step in .github/workflows/social-post.yml:
 *
 *    - name: Sync to Notion
 *      if: env.NOTION_API_KEY != ''
 *      env:
 *        NOTION_API_KEY:     ${{ secrets.NOTION_API_KEY }}
 *        NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
 *        CHANGED_FILES:      ${{ steps.changed.outputs.files }}
 *      run: node .github/scripts/notion-sync.js
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * INTENDED DATABASE SCHEMA
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Property name       | Notion type   | Source
 * ────────────────────|───────────────|──────────────────────────────────────
 * Name                | Title         | post.title
 * Slug                | Rich text     | post.slug
 * Date                | Date          | post.date
 * Excerpt             | Rich text     | post.excerpt
 * LinkedIn Draft      | Rich text     | social.linkedin
 * Instagram Draft     | Rich text     | social.instagram
 * Twitter Draft       | Rich text     | social.twitter
 * Status              | Select        | "Draft" (default)
 * Blog URL            | URL           | https://hubss.com/blog/{slug}
 * Generated At        | Date          | social.generatedAt
 *
 * ─────────────────────────────────────────────────────────────────────────────

// ── Configuration (populated from environment) ──────────────────────────────

// const NOTION_API_KEY     = process.env.NOTION_API_KEY;
// const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// ── Dependencies ─────────────────────────────────────────────────────────────

// const { Client } = require("@notionhq/client");
// const fs         = require("fs");
// const path       = require("path");

// ── Notion client ─────────────────────────────────────────────────────────────

// const notion = new Client({ auth: NOTION_API_KEY });

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Create or update a page in the Notion database for a given post.
 * Uses "Slug" as the unique key — updates the existing row if found,
 * creates a new one if not.
 */
// async function upsertPost(social) {
//   // Check for existing page with this slug
//   const existing = await notion.databases.query({
//     database_id: NOTION_DATABASE_ID,
//     filter: {
//       property: "Slug",
//       rich_text: { equals: social.slug },
//     },
//   });
//
//   const properties = {
//     Name:             { title:     [{ text: { content: social.title } }] },
//     Slug:             { rich_text: [{ text: { content: social.slug  } }] },
//     Date:             { date:      { start: social.date || new Date().toISOString().slice(0, 10) } },
//     Excerpt:          { rich_text: [{ text: { content: social.excerpt || "" } }] },
//     "LinkedIn Draft": { rich_text: [{ text: { content: social.linkedin  } }] },
//     "Instagram Draft":{ rich_text: [{ text: { content: social.instagram } }] },
//     "Twitter Draft":  { rich_text: [{ text: { content: social.twitter   } }] },
//     "Blog URL":       { url:       `https://hubss.com/blog/${social.slug}` },
//     "Generated At":   { date:      { start: social.generatedAt } },
//     Status:           { select:    { name: "Draft" } },
//   };
//
//   if (existing.results.length > 0) {
//     await notion.pages.update({
//       page_id: existing.results[0].id,
//       properties,
//     });
//     console.log(`  🔄 Updated Notion row for: ${social.slug}`);
//   } else {
//     await notion.pages.create({
//       parent: { database_id: NOTION_DATABASE_ID },
//       properties,
//     });
//     console.log(`  ➕ Created Notion row for: ${social.slug}`);
//   }
// }

// ── Main ──────────────────────────────────────────────────────────────────────

// async function main() {
//   const files = (process.env.CHANGED_FILES || "")
//     .split("|")
//     .map(f => f.trim())
//     .filter(f => f.endsWith(".mdx"));
//
//   for (const file of files) {
//     const socialPath = file.replace(/\.mdx$/, ".social.json");
//     if (!fs.existsSync(socialPath)) {
//       console.warn(`  ⚠️  No .social.json found for ${file} — skipping Notion sync.`);
//       continue;
//     }
//     const social = JSON.parse(fs.readFileSync(socialPath, "utf8"));
//     await upsertPost(social);
//   }
// }
//
// main().catch(err => {
//   console.error("Notion sync error:", err.message);
//   process.exit(0); // non-fatal
// });

 * ─────────────────────────────────────────────────────────────────────────────
 */

console.log("notion-sync.js: scaffold only — see comments above to activate.");
process.exit(0);
