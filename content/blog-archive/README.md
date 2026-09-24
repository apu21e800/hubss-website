# Blog archive: not read by the site

These 74 posts were the Field Notes blog until 24 Sep 2026, when the blog moved
into Sanity. The site now reads every post from Studio (lib/blog.ts), so
**editing a file here changes nothing on hubss.com.** To change a post, open it
in Studio (hubss.com/studio → Blog / Field Notes) and press Publish.

The files stay for two reasons:

- `npm run blog:check` compares every post in Sanity with its file here and
  reports any difference. Once Studio edits begin, differences are expected;
  the check exists to prove the import, not to police edits.
- `npm run blog:import` rebuilt from these files would restore the posts as
  they were on the day of the move (it needs `--backup=` and overwrites the
  Studio copies, so don't run it after Studio edits unless that's the point).

How the import works, and how posts are published now: docs/BLOG-IN-SANITY.md.
