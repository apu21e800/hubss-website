# The blog lives in Sanity

Since 24 Sep 2026 every Field Notes post is a **Blog / Field Notes** document
in Studio (hubss.com/studio). The site reads them from there (`lib/blog.ts`)
and renders the body with `components/blog/PostBody.tsx`. The .mdx files the
blog used to be are kept, unread, in `content/blog-archive/`.

## Publishing

| You do this in Studio | On hubss.com |
|---|---|
| Edit a live post, press **Publish** | Changed within seconds |
| Publish a **new** post | Live in about five minutes: the site rebuilds itself to add the page |
| Change a live post's **slug** | Same: a rebuild, about five minutes. Links to the old address break, so don't |
| **Unpublish** or delete a post | Gone from every list at once; its page is removed by a rebuild, about five minutes |
| Save without publishing | Nothing. A draft is never on the site |

Why a rebuild for new posts: `/blog/<slug>` only answers for posts the build
knew about, so a mistyped or invented address is a real 404 (Google indexed
those as pages when it was otherwise). The webhook (`app/api/revalidate`)
notices a post the running site didn't build and asks Vercel for a build
through a Deploy Hook (`VERCEL_DEPLOY_HOOK_URL`). Every list on the site uses
the same built list (`lib/blog-index.json`), so a new post's card and its page
appear together; no card ever links to a page that doesn't exist yet.

## What each field does

- **Type**: the badge, and which hub lists it (/blog/case-studies, /guides, …).
  Blank means the site guesses from the title.
- **Excerpt**: the card text, the italic lede, and Google's description unless
  **Search result overrides** says otherwise.
- **Body**: Heading 2 for each section (they become "On this page" in the
  sidebar and linkable anchors), Heading 3 inside a section. The title is
  printed above the body; don't repeat it. Photos need alt text. Tables: the
  first row is the heading row, `**double asterisks**` make a cell bold.
- **Featured photo**: the header, the card and the social share picture. HUB's
  own photos only.
- **Search phrases**: schema keywords, and posts sharing a phrase are offered
  to each other as related reading.
- **Systems this post is about**: they lead the "Systems in this piece" rail;
  any other HUB system named in the text is added after them automatically.
- **Read time**: leave blank; the site works it out at 225 words a minute.

## AI drafts (every Tuesday)

Studio's **Field Notes plan** is the list of posts HUB wants written. Every
Tuesday at 13:00 UTC (9:00 in Toronto) the drafter
(`app/api/cron/draft-field-note`, scheduled in `vercel.json`) takes the plan
item marked **Ready** with the highest priority and:

1. collects the facts it may use: the catalogue pages of the item's systems and
   applications, the company lines the site already prints, and the item's
   brief (`lib/field-note-facts.ts`);
2. has Claude write the post from those facts only, then has Claude check the
   draft against the same facts (`lib/field-note-drafter.ts`);
3. saves it in Blog / Field Notes as an **unpublished draft**, with a stand-in
   photo from the first system's page and the fact check in "Notes for the
   editor";
4. marks the plan item Drafted and emails `BLOG_DRAFT_NOTIFY`.

It never publishes. A draft's id starts with `drafts.`, which the site can't
read. Someone opens it in Studio, checks the notes, edits, sets the date and
presses Publish; the rebuild puts it live about five minutes later.

- **Run it now:** Vercel → hubss-website → Settings → Cron Jobs → Run.
- **A particular item:** `/api/cron/draft-field-note?idea=<its id>`, with the
  `Authorization: Bearer $CRON_SECRET` header.
- **Real projects:** the drafter only knows what the catalogue and the brief
  tell it. To write up an install, put the facts in the brief: where, when,
  which system, what the client needed.
- **Settings (Vercel, Production):** `CRON_SECRET`, `ANTHROPIC_API_KEY`,
  `SANITY_API_WRITE_TOKEN` (an Editor token), `BLOG_DRAFT_NOTIFY` (emails,
  comma-separated), `RESEND_API_KEY`; optionally `BLOG_DRAFT_MODEL`.
- **The first plan items** came from Semrush (Canada) on 24 Sep 2026:
  searches with real volume, low difficulty and buying intent that no post
  targets yet (`scripts/seed-field-notes-plan.ts`, `npm run plan:seed`).

## The import (done once, 24 Sep 2026)

`scripts/import-blog-to-sanity.ts` wrote the 74 posts, with ids kept for the 67
that a May 2026 migration had put in Sanity as unformatted text.

Before anything was written it was checked two ways: every body, converted and
rendered by PostBody, gave the same headings, paragraphs, lists, quotes,
tables, links, bold and italic as the MDX pages (1,909 blocks over 74 posts);
and the documents, read back through the site's own GROQ, gave the same order,
dates, read times, types, systems and search phrases as the old code. The one
number that moved is schema.org `wordCount`, which used to count markdown marks
("##", "|") as words.

```
npm run blog:dry                                   # the plan; writes nothing
npm run blog:import -- --only=<slug> --backup=<f>  # one post
npm run blog:import -- --backup=<f>                # all posts
npm run blog:check                                 # Sanity vs the files
```

After Studio edits start, `blog:check` will report those posts as different:
that's expected. Don't re-run the import then unless you mean to put the posts
back as they were on 24 Sep 2026; the backup file has the documents it replaced.

## Local development

`npm run dev` and `npm run build` write `lib/blog-index.json` from Sanity
first. If you run `next` directly, run `npm run gen:blog-index` before it.
