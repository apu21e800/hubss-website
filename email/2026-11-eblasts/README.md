# E-blasts 2 to 6 (November 2026)

Built in Constant Contact as custom-code drafts from Figma (Marketing Material,
page "E-blasts · new drafts (Oct 2026)", frames 220:2, 222:2, 223:2, 224:2, 225:2),
on E-blast 1's HTML system. Not deployed: only `public/email/` is served.

- `build_e2_6.py`: E-blast 1's builder (claude/HUBSS-eblast-builder.md in the
  Claude project) with the words, links and photos of E-blasts 2 to 6, and every
  change made to the Figma words at the build, with its reason (`FIXES`).
  `python3 build_e2_6.py OUT` writes the HTML that goes into Constant Contact.
- `images.py`: turns the Figma exports into the photos under
  `public/email/2026-11-eblast-N/` (2x, 3x where the source allows).
  E-blast 1's photos were re-exported the same way, same files and crops.

Photos are served from hubss.com because the Constant Contact connection gets a
403 on its image library. Never delete a folder under `public/email/` once its
e-blast has gone out: the sent emails load their photos from it.
