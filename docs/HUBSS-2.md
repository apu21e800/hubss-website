# HUBSS 2.0

The record for the `feat/hubss-2` branch: what it is, what was decided, what is
done, what is next. A new chat reads this first, then CLAUDE.md. Started 13 Nov
2026.

## What it is

hubss.com raised to 21e8.studio grade, on a branch that is not live. 2.0 is the
upgrade Vernon will offer HUB. Until he does, it lives only on this branch's
Vercel preview, which asks for a key (see "The preview").

Vernon's brief, 12 Nov 2026: cut the fat; improve the editorial and find the
brand voice; handle images better; improve the blog and social; redo the mega
menus; make the phone experience first-rate. Keep the booklet, the map and Lunch
& Learn ("don't mess with the map"). Keep the blue, add more of HUB's signature
grey, choose tastefully. "Think about design details."

Vernon, 13 Nov 2026, while the slice was being built. These three steer
everything below:

- "The goal is to gain fidelity on top of the original website, just don't
  break what might be working, also don't want to totally shock the client,
  even feel free to do a more tame version." So 2.0 is the same site at higher
  fidelity. Layout and look stay. Where a bolder step is worth showing, it is
  shown as an option beside the tame one, never instead of it.
- Keep search in mind (Google and the AI assistants): 2.0 must not cost a
  ranking. Titles, h1s, descriptions, structured data, redirects, image names
  and captions are not touched.
- "We should feel free to funnel some of these upgrades to the live site."
  Pieces that are safe for hubss.com today go to main as their own small PRs.
  Anything HUB would notice as a new look waits for Vernon's eye first: Doug is
  the senior owner.

## Hands off

- The map: its look and how it works stay exactly as they are. The section is
  pinned to the pre-2.0 colours and type (`data-surface="classic"`, below).
- The Product Portfolio Book reader and Lunch & Learn work as they do today.
  The reader is pinned classic too. The Lunch & Learn card took the flat orange
  and the grade token and nothing else.
- Doug's settled rounds: the names, the page-turn reader, the hero's book
  callout, "Ten systems, endless applications.", 60 minutes.
- HUB's words: product facts (the book wins), Studio text, published articles.
  A Studio-held line that should change goes into `lib/copy-superseded.ts` on
  this branch and into "For approval" below. Studio is not written.
- Addresses, titles, h1 keywords, redirects, structured data, image names and
  captions.
- The ten ad pages and /lunch-learn keep their first-screen rules (CLAUDE.md,
  Conversion Goals).
- No page gets heavier on a phone than it is today (`scripts/hubss-2/weigh.mjs`).
- Sanity is read only. Nothing goes to Buffer, Resend or Apollo.

## Decisions

### Colour: three colours, three jobs (`app/globals.css`, top)

| Colour | Job | Where |
|---|---|---|
| Grey | The structure | HUB Charcoal `#20201F` is the ground of the bar, the menus, the footer and the dark bands. Its lighter steps are the cards and hairlines on it. On paper the family goes warm: stone and paper. |
| Blue | The cinema | The grade over a photo hero (`--grade`), the night band (`data-surface="night"`: the home page's applications), the map. Never a button or a label. |
| Orange | The action | Buttons, links, the current item, focus. One flat orange, `#F97316`. |

What changed from main:

- The dark ladder moved up one step, so Charcoal is the ground itself. It was
  `#151515` with Charcoal as the card colour; the bar and menus were a navy
  black, `rgb(7,11,18)`.
- The words on an orange fill are Charcoal: 5.8:1. White on it was 2.8:1, under
  the 4.5:1 that AA asks of text this size. This is the one change a visitor
  sees on every screen. It is one token, `--on-accent`.
- The yellow is out. The orange ran to amber in buttons and to yellow in three
  headings and a dozen rules. Yellow is Thermo-Design's.
- The small orange capitals over headings are grey and smaller (`.eyebrow`:
  12px, 0.16em), and the four on the home page that said the heading again are
  not printed (docs/STYLE.md, Structure).
- The greys for text on dark are warm, like the ground (they were Tailwind's
  blue-greys), and each clears 4.5:1 on the lightest dark surface. Before:
  `--text-secondary` 4.26:1 and `--text-hint` 3.93:1.
- The theme lists were written out five times and kept in step by hand. They
  are written once each (dark, light); the night band and the classic dark
  start from the dark list and change what differs.

The raw values, and only here: `--charcoal` and its steps, `--stone`,
`--paper`, `--night`, `--grade`, `--orange`. Components read the roles
(`--bg-*`, `--text-*`, `--border-*`, `--accent*`).

Contrast, measured (13 Nov 2026):

| Pair | Ratio |
|---|---|
| Charcoal on orange (button label) | 5.82 |
| Cream `#F5F0EB` on Charcoal | 14.4 |
| `--text-secondary` `#B4B3AE` on Charcoal / on `#333331` | 7.8 / 6.0 |
| `--text-muted` `#A8A7A2` on `#333331` | about 5.3 |
| Orange words `#FB923C` on Charcoal | 7.2 |
| Orange words `#B83E0B` on paper | 5.3 |

Still to do in the rollout: 39 files outside the slice carry hex colours of
their own (the map's 47 stay). The 36-step `--ink-NN` ladder is kept for now;
the rollout replaces it with a handful of named steps.

### Type: one scale, in one place (`app/globals.css`, "The type scale")

`--fs-display`, `--fs-h1-hero`, `--fs-h1-page`, `--fs-h2`, `--fs-h3`,
`--fs-title`, `--fs-lead`, `--fs-body`, `--fs-ui`, `--fs-small`, `--fs-label`.
Each is one fluid size from 320 to 1920. A page sets a heading with a class
(`.h1-hero`, `.h1-page`, `.h1-long`, `.h2-section`, `.h2-sub`), never a text-*
utility or a px value.

Measured with `scripts/hubss-2/type-census.mjs` (every heading's size and line
count at 320, 360, 390, 768, 1024, 1280, 1440, 1920). What the measuring
changed:

- On 320 and 360px phones "TrafficPatternsXD" ran off the screen on its own
  page (38px, 358px wide). A name now starts at 30px. This is a bug on main
  today, on an ad landing page; it can go to main as its own PR.
- A section's heading was 36px on a phone and took three lines; it is 28 to 30.
- An article's title is a step smaller on a phone (`.h1-long`): at 38px a
  sixty-character title took five lines on a 320px screen.
- From a tablet up nothing moved: each step meets its old formula there.

Still to do: headings that set their own size (the projects lead story, a
post's h2s, the card titles) join the scale; a section heading keeps one line
count across desktop widths ("For the toughest environments." is one line at
1280 and two at 1440).

### Motion

Nothing moves when a page opens. The client ticker under the home page's hero
is a still line of names. Still to do: the entrances that play on load, the
"single pulse" on a button.

### The home page

8,900px at 1440 on main; 8,574 now (9,673 to about 9,200 at 390). Same sections
in the same order. Cut: the ticker's motion, four redundant labels, the orange
glow and bloom in the hero, 16px of air above and below each section. The
applications band is the night band. Target for the rollout: under 8,000.

### The bar and the menus

Charcoal, like the footer. The panels keep the structure Vernon signed off on
24 to 26 Oct 2026; their six orange ticks are grey hairlines, so the only
orange in a panel is what can be pressed. The phone menu sits on the same
ground as the panels.

### The map and the reader stay classic

`data-surface="classic"` (and `[data-catalogue-route]`) carries the pre-2.0
dark values, the old label and heading sizes and the old button, so those two
blocks are the same to the pixel. Check after any token change:
`scripts/hubss-2/shoot.mjs` before and after, and compare the map's block.

## The preview

- Branch `feat/hubss-2`, off main. Merge main into it at the start of every
  work block. Never rebase, never force. It never touches main, review/main,
  hubss.com or the Studio.
- The preview asks for a key (`middleware.ts`): `?key=...` once, then a cookie
  for 30 days. Previews on this project open for anyone with the address, and
  this repository is public, so the address can be worked out from the branch's
  name. The key is not in the repository; the keyed link is on the 21e8
  Motherboard. It goes to Vernon only.
- **Before 2.0 merges to main:** take the key block out of `middleware.ts`, and
  the catch-all line at the end of its matcher.
- No pull request is open for this branch on purpose: Vercel would post the
  preview's address on it in public.

## Checks before anything is shown

`npx tsc --noEmit`, the test scripts CI runs, `npm run verify`, then, against
`npx next start -p 4311` on the branch's build:

| Script (`scripts/hubss-2/`) | What it holds |
|---|---|
| `overflow.mjs` | Nothing past the screen's edge on the slice pages, 320 to 1440. |
| `first-screen.mjs` | The ten ad pages' and /lunch-learn's first-screen rules, at CLAUDE.md's sizes (72 cells). |
| `weigh.mjs` | No page heavier on a phone (390 at DPR 3) than on main. |
| `map-same.mjs` | The map block is the same as on hubss.com, element by element. |
| `type-census.mjs` | Every heading's size and line count at eight widths. |
| `shoot.mjs` | The before-and-after pictures. |

Block 1's numbers (13 Nov 2026): verify 16/16; overflow clean (5 pages, 9
widths); first screen 72 of 72; weight equal or lower on all seven pages
measured (home 1,607 to 1,605 KB on load); the map block the same.

A trap that cost half an hour: `next start` renames its process to
`next-server`, so `pkill -f "[n]ext start"` does not stop it. An old server
kept answering on the port with the old build's pages while the files under
it were the new build's, and every page came up unstyled. Stop a server by
its process id (`ps -eo pid,args | grep next-server`), then start the new one
and check that a page's stylesheet answers 200.
ESLint does not run in this repository (its config crashes under ESLint 10, on
main too); that is a small fix for main, not part of 2.0.

## For approval (Studio-held lines and what the page no longer prints)

Nothing in Studio was changed. On this branch:

1. The four small labels over the home page's section headings ("The systems",
   "Applications", "Projects", "On the ground") are not printed. Studio keeps
   them.
2. "The job decides the system." prints in one colour. Its second half was
   orange to yellow.

Not changed, for Vernon to raise with HUB: Doug's note of 12 Nov 2026 on the
review copy asks for the line under the home page's headline to read "Let us
help create your vision." It is his to change in Studio, on main.

## Done (13 Nov 2026, block 1)

- Step 0, apart from 2.0: PR #144, the forms' spam screen, merged and live
  (1:03 am Vancouver; hubss.com checked on commit c8fde2c). Left from its
  review, for the next small PR to main: a doubled "@" typo ("jane@@city.ca")
  is no longer redacted, a second address joined to a first can keep its bare
  domain, and the timing test's limit should be 50 ms, not 250.
- Funnelled to main as its own PR, waiting on Vernon's go: #145, a product's
  name no longer runs off a 320 or 360px phone (the `.h1-hero` step alone).
- Shown to Vernon: the page "HUBSS 2.0 first slice" (before and after, three
  calls), linked from the 21e8 Motherboard with the keyed preview.
- Tokens: the colour jobs, one dark list and one light list, the night band,
  the classic dark.
- The type scale and the phone fixes above.
- The bar, the three panels, the phone menu: Charcoal, grey hairlines.
- The home page: hero, the still line of names, the audience strip, the
  section headers, the night band, the footer.
- Carried by the tokens and the scale: the product, application, Projects and
  post pages (bar, footer, labels, buttons, headings on a phone).

## Next

1. Vernon's notes on the slice.
2. The slice's own templates, by hand: the product page (details card, the
   spec list's tags), the application page, the Projects front (the room above
   its title, the lead story), the post (reading measure, captions, what to
   read next).
3. The rollout: every other template; images (one set of ratios, crops from
   the hotspot, captions under the photo, placeholders); the blog; the voice
   (docs/VOICE.md); share cards; the social calendar's next ten posts.
4. The proof: hubss.com and the preview measured the same way, then the page
   "What 2.0 changes" for Cleve and Doug.
