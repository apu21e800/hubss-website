# Product Pillar Content — Canonical Source of Truth

Per Vernon (2026-05-31): "These flyers should be so well built and
thought out that they should even inform the entire website, print
catalogue etc. Let's make these product info flyers a kind of pillar
content that even the product owner and operator would love to
reference, like us! But built for the audience at tradeshows."

Each `<slug>.md` here is the fact-checked product pillar — verified
against the original manufacturer PDFs (PPG / Ennis-Flint, GAF,
Geveko Markings, Willamette Valley) and curated for the architect /
specifier audience. Doug Bain (HUB East) reviews and signs off; once
signed, these become the canonical input for **all** HUBSS surfaces:

- The 8.5×11 tradeshow flyers (built via `../original_content.py`
  + `../build_flyers.py`)
- Website product pages (`/products/<slug>`)
- Print catalogue (catalog_content.py)
- Sales decks, RFP responses, sole-source spec language

If you find a discrepancy between this pillar and any of those
surfaces, the pillar wins — update the surface to match.

`../original_content.py` carries the flyer-fit extract (4-6 spec
rows, ~6-word tagline) that the print pipeline reads. Doug edits →
update both the pillar `.md` and the `.py` dict, regenerate flyers
(`python -m catalog-print-build.src.build_flyers`), ship.

## Source Google Docs (fetched 2026-05-31)

| Slug | Source Doc ID |
|------|---------------|
| traffic-patterns-xd | 11FW6DBjR4GXJcc6QeJ5qStLo1n5S8ZRv |
| traffic-patterns    | 1BZ0OfOZ_y-BzVaHsktYu7z_0ait2DhcV |
| streetbond          | 1t7KFtKXy5BPbAdJ8UgTwtsoN69mlroU3 |
| streetbondsr        | 1zVTxesr9Mih0Udn5-7F2gVXu0EMyxWx0 |
| streetprint         | 1WxmtuY3ulKtS_MR1qovGUzyQeHRatIru |
| decomark            | 1unB76ySvem-6CmN8UOAwy62b3dqdjcCl |
| mmax                | 1BB2k0qdKqXFLASlFJKMOTxp3Q3sy27A- |
| duratherm           | 1aMTiwcGcigiSQ2KDWQM-WnWOHOc2mLO1 |
| durashield          | 1KDGFjDJGtYW2BVw1Hc3eN0FcXcj61BZY |
| airmark             | 1A4qkn1-SNJf8WIL_J4k2mBdvwuJH9rTV |
| premark             | 1xPHWA-2m6meDXnGC6-NF3ALjimJsW5HN |
| chipfill            | 1OQGPg0yNG61buw60C_e6IMoSqKMRyBku |
| aggrefill           | 1aYQKcm3zA9OzumfZT9wh_WM0Kc7jdMci |
| fast-patch          | 1PqNCUMp48coi_SCZ2JDIb2Z7Ovq6lZq8 |
| _index              | 1SZunn0KB-UX2O0FRNxYd74BBja2iJf_T |

Doug must review and sign off each before any [VERIFY] flagged content
ships to the live site. The flyers pick the safest verified facts —
nothing flagged as embellishment, nothing pending verification.
