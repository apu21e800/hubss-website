# HUBSS 2.0

The record for the `feat/hubss-2` branch: what it is, what was decided, what is
done, what is next. A new chat reads this first, then CLAUDE.md. Started 13 Nov
2026.

## Where it stands (13 Nov 2026, evening): a gentle upgrade, in two looks

Vernon, 13 Nov, 2:32 pm, on the first slice: "I still like the white text on
orange button and the gradient on the text, the megamenu background color
could be darker. let's be able to toggle between a blue and grey theme. The
blue theme should still have dominant grey elements ... This feels more like
a gentle upgrade to what we already have, not a 2.0 overhaul, maybe we don't
need one."

So this branch is no longer a 2.0. It is hubss.com with the slice's quiet
gains (the type scale, the phone fixes, the label rule, the still line of
names, the lighter home page) in two looks behind one switch, and the things
Vernon missed are back. Read this section first; the sections under it were
corrected where it changed them.

- **The button is hubss.com's own again**, everywhere: white words on the
  orange that runs to amber, its glow on hover. `--on-accent` is white. (The
  slice's Charcoal words measured 5.8:1; white on the orange is 2.8:1. That
  is Vernon's call, made knowing the number.)
- **The orange-to-yellow gradient is HUB's signature**, with three jobs: the
  accent line of a headline on a dark ground (the hero's, "the system.", the
  404's), the thin rule on top of an offer card, and the line under the card
  you point at. One token, `--gradient-brand`. It is not a fill for buttons
  beyond the live one, and never a label.
- **Two looks**, `data-tone` on `<html>` (app/globals.css, "The two looks"):
  - Blue (the default): the bar and the menus in the navy black hubss.com has
    today, the blue grade over photo heroes, the blue night band.
  - Grey: the bar in HUB Charcoal, a deeper charcoal well for the menus
    (`#121211`), a charcoal grade and band.
  - Grey in both: paper, cards, the footer, every text grey. Blue has grey as
    its ground; it adds blue only where a photograph or the bar is.
- **The menus are darker** than the slice's: they sit on `--bg-menu`, the
  bar on `--bg-nav`.
- **The switch** (components/ui/ToneSwitch.tsx): bottom left, "Look: Blue /
  Grey", on this branch's keyed preview and on local builds only.
  `?tone=blue` or `?tone=grey` in any address sets it and sticks; the
  bootstrap in app/layout.tsx applies it before first paint. When a look is
  chosen: make it the default on `<html>` and in the bootstrap, delete the
  other look's two blocks and the switch.
- **The three hands-off blocks are hubss.com's, element by element, in both
  looks**: the map, the Lunch & Learn card (main's file again, on the classic
  dark, its page title at main's size) and the book's reader.
  `scripts/hubss-2/map-same.mjs <live> <local> [blue|grey]` and
  `block-same.mjs <live> <local> <path> <selector> [blue|grey]` measure it.
- **Checking the second look**: `scripts/hubss-2/as-grey.mjs 4311 4312`
  serves a local build with Grey as the default, so every check script runs
  on it unchanged.

Checked on a production build of e5ef19a (13 Nov): tsc; 17 test scripts;
verify 16/16; first screen 72 of 72; no sideways scroll on 16 pages at 9
widths; the label rule and the accessibility checker with tap targets in
both looks, as on hubss.com; what search reads the same as hubss.com on 21
pages; the map 672 elements at 1440 and 9 at 390, Lunch & Learn 74 and 76,
the home page's card 76 and 75, the reader 44 and 28, none differ, in both
looks. Weight on a phone, on load, against main: home 1,607 to 1,579 KB; the
other six pages 1 KB over main with the review switch mounted (four more
nodes; it never ships). Not yet measured without the switch.

**Who has seen it.** Vernon only, on the keyed preview. On 13 Nov HUB asked
for fewer places to keep track of and for directed work, so nothing from
this branch goes to HUB as a link. If Vernon wants HUB to choose, it is
shown to them by him (his keyed link on a shared screen), or as pictures on
HUB's own review page. Before any of it merges to main: one independent
review, the key block out of middleware.ts, one look made the default.

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
  Both are pinned to the classic dark and are the same as on hubss.com,
  element by element (the Lunch & Learn file is main's since 13 Nov, evening).
- Doug's settled rounds: the names, the page-turn reader, the hero's book
  callout, "Ten systems, endless applications.", 60 minutes.
- HUB's words: product facts (the book wins), Studio text, published articles.
  A Studio-held line that should change goes into `lib/copy-superseded.ts` on
  this branch and into "For approval" below. Studio is not written.
- Addresses, titles, h1 keywords, redirects, structured data, image names and
  captions.
- The ten ad pages and /lunch-learn keep their first-screen rules (CLAUDE.md,
  Conversion Goals).
- No page gets heavier on a phone than it is today (`scripts/hubss-2/weigh.mjs`:
  what a 390x844 phone at 3x fetches on load, and after reading to the foot).
- Sanity is read only. Nothing goes to Buffer, Resend or Apollo.

## Decisions

### Colour: every colour has a job (`app/globals.css`, top)

| Colour | Job | Where |
|---|---|---|
| Grey | The structure, in both looks | HUB Charcoal `#20201F` and its steps: the footer, the dark bands, the cards and hairlines on them. On paper the family goes warm: stone and paper. In the Grey look it is the bar, the menus and the grade over photos too. |
| Blue | The cinema, in the Blue look | The bar and menus (the navy black hubss.com has), the grade over a photo hero (`--grade`, `--grade-deep`), the night band (`data-surface="night"`: the home page's applications). Never a button or a label. |
| Orange | The action | Buttons, links, the current item, focus. The button is hubss.com's own: white words on the orange that runs to amber. |
| Orange to yellow | HUB's signature | The accent line of a headline on a dark ground, the thin rule on an offer card, the line under the card you point at (`--gradient-brand`). |

What changed from main:

- The dark ladder moved up one step, so Charcoal is the ground itself. It was
  `#151515` with Charcoal as the card colour. The bar and menus are a navy
  black, `rgb(7,11,18)`, in the Blue look, as on main; Charcoal in Grey.
- (Reversed on 13 Nov, evening: the slice had Charcoal words on a flat orange
  and no yellow. The button and the gradient are main's again; see "Where it
  stands".)
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
| White on orange (the button label, as on hubss.com) | 2.8 |
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
post's h2s, the card titles, the printed-book form's h1) join the scale; a section heading keeps one line
count across desktop widths ("For the toughest environments." is one line at
1280 and two at 1440).

### Motion

Nothing moves when a page opens. The client ticker under the home page's hero
is a still line of names. Still to do: the entrances that play on load, the
"single pulse" on a button.

### The home page

8,900px at 1440 on main; 8,574 now (9,673 to 9,248 at 390). Same sections
in the same order. Cut: the ticker's motion, four redundant labels, the orange
glow and bloom in the hero, 16px of air above and below each section. The
applications band is the night band. Target for the rollout: under 8,000.

### The bar and the menus

Navy black in the Blue look, Charcoal in Grey; the panels and the phone menu
sit on a darker ground than the slice had (`--bg-menu`). The panels keep the
structure Vernon signed off on 24 to 26 Oct 2026; their six orange ticks are
grey hairlines, so the only orange in a panel is what can be pressed.

### The map, Lunch & Learn and the reader stay classic

`data-surface="classic"` (and `[data-catalogue-route]`) carries the pre-2.0
dark values and the old label and heading sizes (the section heading's and,
since 13 Nov, the page title's: the Lunch & Learn page's h1 is the card's).
All three blocks are the same as on hubss.com, element by element, in both
looks: check with `map-same.mjs` and `block-same.mjs` after any token change.

What this leaves on the home page: the night band (applications), today's
near-black (the map and Lunch & Learn, which sit together as they do on
hubss.com) and Charcoal (the footer). Letting the map's band take the look's
dark is Vernon's to ask for, since it touches the map.

### One rule for the small capitals

A small-capitals label is grey (`--text-muted`), or cream on a photograph. It
is never orange: orange is the colour of action. Two things keep their colour,
because the colour is their job:

- A story's kicker names its section in the section's own colour (`StoryKicker`
  in components/blog/BlogCard.tsx: Projects in the accent, Guides in the softer
  tone). The home page's story cards follow it (`data-kicker`).
- The classic blocks keep today's labels.

`scripts/hubss-2/labels.mjs` reads 21 pages at 1440 and 390 and fails on any
other orange small capitals. The review of block 1 found the rule half-applied
("Lunch & Learn" orange in one card and grey in the band under it); the script
then found seven more (the application card's "Specify", the contact hero, the
printed-book form, the 404 page, the spec card, the PDF preview, the driveways
band).

### Fetching ahead only when reached for (`components/ui/IntentLink.tsx`)

A plain Link fetches its page once it is within 200px of the screen, and that
page's first photographs come with it. The home page's three entry cards sit
just under the first screen. Measured on hubss.com on 13 Nov 2026 with
`scripts/hubss-2/fetch-ahead.mjs`, in windows the size real browsers give,
"for other pages" being route data plus the photographs those routes ask for:

| Window | When | hubss.com | With IntentLink |
|---|---|---|---|
| Phone (390x664, 412x785, 430x833) | after the first 400px flick | 414 KB, 356 of it /products' three card photos | 0 |
| Tablet, 768x954 | as the page opens | 228 KB | 0 |
| Laptop, 1440x789 | as the page opens | 149 KB | 37 KB |
| Phone, 390x844, scripted read to the foot | at the foot | 636 KB | 196 KB |

The three cards now fetch on a pointer, a finger or the keyboard's focus
(Next's own "hover-triggered prefetch"). Checked in a browser: nothing fetched
before intent; fetched on hover, on focus and on touch; a click or a tap opens
the page. The same change is PR #146 to main, waiting on Vernon's go (the two
copies of IntentLink.tsx are the same file, so main merges back cleanly; the
entry cards' file will ask for the branch's side).

How it was found, and the lesson: `weigh.mjs` uses a 390x844 window, and on
this branch the home page measured 370 KB heavier on load, because the page
above the cards is shorter and the /products card had come inside the 200px
(on hubss.com it sat 4px outside at that height). The first write-up then said
phones fetched it "before the visitor had moved". That was wrong: 844px is the
phone's whole screen, and its browser shows 664 to 745px of page, so on a real
phone it comes with the first flick. Measure anything that depends on what is
near the screen in real window sizes.

Not changed: every other link still fetches as it comes near the screen. For
the rollout's weight pass, the same treatment lower down the home page would
take off most of what is left. It trades how quick a tap feels against how
much a phone downloads, so it gets measured first.

## The preview

- Branch `feat/hubss-2`, off main. Merge main into it at the start of every
  work block. Never rebase, never force. It never touches main, review/main,
  hubss.com or the Studio.
- The preview asks for a key (`middleware.ts`): `?key=...` once, then a cookie
  for 30 days. Previews on this project open for anyone with the address, and
  this repository is public, so the address can be worked out from the branch's
  name. The key is not in the repository; the keyed link is on the 21e8
  Motherboard. It goes to Vernon only.
- The Blue / Grey switch shows on this preview and on local builds only
  (`TONE_SWITCH` in app/layout.tsx).
- **Before any of it merges to main:** take the key block out of
  `middleware.ts`, and the catch-all line at the end of its matcher; make the
  chosen look the default and take the switch out.
- No pull request is open for this branch on purpose: Vercel would post the
  preview's address on it in public.

## Checks before anything is shown

`npx tsc --noEmit`, the test scripts CI runs, `npm run verify`, then, against
`npx next start -p 4311` on the branch's build:

| Script (`scripts/hubss-2/`) | What it holds |
|---|---|
| `overflow.mjs` | Nothing past the screen's edge, 320 to 1440 (a row made to swipe may start a gutter off the left edge; the page itself may not scroll sideways). |
| `first-screen.mjs` | The ten ad pages' and /lunch-learn's first-screen rules, at CLAUDE.md's sizes (72 cells). |
| `weigh.mjs` | No page heavier on a phone (390 at DPR 3) than on main. |
| `map-same.mjs` | The map block is the same as on hubss.com, element by element, read once the map says it is ready and its photos are in. A third word reads the local site in a look. |
| `block-same.mjs` | The same for any block by its selector: the Lunch & Learn card, the home page's card, the book's reader. |
| `as-grey.mjs` | Serves a local build with Grey as the default, so every script here checks the second look unchanged. |
| `labels.mjs` | No orange small-capitals label outside a kicker or a classic block. |
| `seo-same.mjs` | What search reads is the same as on hubss.com: title, description, canonical, robots, share tags, h1, structured data, images with their alt text, link addresses. |
| `a11y.mjs` | The accessibility checker at every impact, and the tap targets, beside hubss.com. |
| `fetch-ahead.mjs` | What the home page fetches for pages the visitor has not opened, in real window sizes, at load and after a first flick. |
| `type-census.mjs` | Every heading's size and line count at eight widths. |
| `shoot.mjs` | The before-and-after pictures. |

Block 1's numbers (13 Nov 2026, after the review's fixes): verify 16/16;
overflow clean (13 pages, 9 widths); first screen 72 of 72; labels clean (21
pages, two widths); the map block the same (672 elements at 1440, 9 at 390,
none differ); what search reads the same on 21 pages; the accessibility
checker and the tap targets clean on 11 pages at two widths, as on hubss.com.
Weight, on load and read to the foot, against main's build measured the same
way:

| Page | On load, KB | Read to the foot, KB |
|---|---|---|
| Home | 1,607 to 1,577 | 3,323 to 2,917 |
| Product (TrafficPatternsXD) | 1,033 to 1,032 | 1,636 to 1,636 |
| Application (crosswalks) | 1,012 to 1,012 | 1,106 to 1,105 |
| Projects front | 925 to 923 | 1,210 to 1,208 |
| A write-up | 938 to 937 | 1,142 to 1,142 |
| Lunch & Learn | 829 to 828 | 1,031 to 1,030 |
| The book's reader | 593 to 593 | 593 to 593 |

The stylesheet is 24,389 bytes compressed against hubss.com's 24,488 (135 KB
raw against 139): the new rules are paid for by the dead ones taken out
(the grain, the ticker, five unused background classes, `.btn-primary`,
`.card-eyebrow`, the gradient text, 25 token declarations nothing read).

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

Found by the review, not changed, for HUB to settle:

- The product page says "150 mil (about 4 mm)"; the Toronto write-up says
  "about 3.8 mm". One figure.
- The home page's card dates the Toronto write-up Oct 29; the write-up itself
  says Oct 30 (a time-zone slip between two components; on main too).

Not changed, for Vernon to raise with HUB: Doug's note of 12 Nov 2026 on the
review copy asks for the line under the home page's headline to read "Let us
help create your vision." It is his to change in Studio, on main.

## Done (13 Nov 2026, block 1)

- Step 0, apart from 2.0: PR #144, the forms' spam screen, merged and live
  (1:03 am Vancouver; hubss.com checked on commit c8fde2c). Left from its
  review, for the next small PR to main: a doubled "@" typo ("jane@@city.ca")
  is no longer redacted, a second address joined to a first can keep its bare
  domain, and the timing test's limit should be 50 ms, not 250.
- Funnelled to main as their own PRs, waiting on Vernon's go: #145, a
  product's name no longer runs off a 320 or 360px phone (the `.h1-hero` step
  alone); #146, the home page's three entry cards fetch on intent.
- Shown to Vernon: the page "HUBSS 2.0 first slice" (before and after, three
  calls), linked from the 21e8 Motherboard with the keyed preview. Published
  again after the review's fixes (pictures from commit 6e18172), with the two
  PRs to main and the review's verdict on it.
- Tokens: the colour jobs, one dark list and one light list, the night band,
  the classic dark.
- The type scale and the phone fixes above.
- The bar, the three panels, the phone menu: Charcoal, grey hairlines.
- The home page: hero, the still line of names, the audience strip, the
  section headers, the night band, the footer.
- Carried by the tokens and the scale: the product, application, Projects and
  post pages (bar, footer, labels, buttons, headings on a phone).

## From the review of block 1 (a city engineer on a phone, then Doug)

Fixed before the slice was shown: the label rule applied everywhere, with a
script that holds it; the home page's entry cards fetch on intent; "The job
decides the system." keeps its accent, in the one orange; Lunch & Learn back
to today's colours; the last yellow out of the card edges and rules; the names
under the hero are one row to swipe on a phone (wrapped, they made six ragged
lines); no dot left hanging at the end of a phone's line in "Also available";
the two office numbers no longer touch their boxes at 320px.

Left for the template passes:

- Contact on a phone: the two office numbers are under the whole form, on the
  second screen (forms first was the 5 Nov decision; a short line of numbers
  above the form would keep both).
- A product page on a phone: the spec sheets are about five screens down. A
  link to them in the first-screen card.
- "The work" tiles carry no town: captions under the photo, town and province
  (the rollout's image pass).

## Next

0. (13 Nov, evening) Vernon's call on Blue or Grey, and whether HUB chooses.
   Then, before main: an independent review, the weight measured with the
   switch off, the key block and the other look out. The list below was the
   2.0 plan; under "a gentle upgrade" it is a menu, not a schedule.
1. Vernon's notes on the slice.
2. The slice's own templates, by hand: the product page (details card, the
   spec list's tags), the application page, the Projects front (the room above
   its title, the lead story), the post (reading measure, captions, what to
   read next).
3. The rollout: every other template; images (one set of ratios, crops from
   the hotspot, captions under the photo, placeholders); the blog; the voice
   (docs/VOICE.md); share cards; the social calendar's next ten posts.

   Two weight findings for the image pass, measured on hubss.com's home page
   with a 390x844 phone (13 Nov 2026): it opens at 1,562 KB at 3x and 924 KB
   at 2x.
   - The applications band's first three tiles (crosswalks, commercial spaces,
     parks and paths) are fetched when the page opens, 482 KB at 3x, though
     the band is three screens down. They are `loading="eager"` on purpose
     (components/sections/ApplicationsGrid.tsx; QA, 28 Sep 2026: lazy left an
     empty box for a second after each swipe of the row). The fix that keeps
     both: fetch them as the band comes near, not at open.
   - Every card photo a 3x phone fetches is the 1200px file, for a card about
     310px wide (next.config.ts offers 640, 828, 1200). Serving cards at about
     2x would take the five on the first load from 730 KB to roughly half. The
     system cards' `sizes` also says 100vw for a card that is 82vw: at 2x that
     picks 828 where 640 would do.
   Neither is changed yet. Both want before-and-after pictures on a real 3x
   screen, and the second touches which variants Vercel makes.
4. The proof: hubss.com and the preview measured the same way, then the page
   "What 2.0 changes" for Cleve and Doug.
