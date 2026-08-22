# §5 all-product-logos variant — MOCK for Doug (not shipped)

Vernon's ruling ships **one** logo: the streetbond® rainbow on the StreetBond
spec page (light-bg version, white body, bottom-anchored above the spec grid).
This mock shows what an *every-page* logo treatment would look like — and why
it can't ship today.

## What's here
| File | Shows |
|---|---|
| `StreetBond-with-logo.png` | the shipped single exception (rainbow ®) |
| `StreetBondSR-with-logo.png` | SR™ mark in the same slot — clean, works |
| `StreetPrint-with-logo.png` | StreetPrint® "Genuine Stamped Asphalt" — clean, works |
| `MMAX-control-no-logo.png` | control: the typographic treatment every other page keeps |

## Why all-or-nothing fails today (the gap list for Doug)
Clean, HUB-usable official marks exist for **3 of 11** products
(StreetBond, StreetBondSR, StreetPrint). The only "official" art in the
libraries for **DecoMark, DuraTherm, TrafficPatterns** is TrafficScapes-
branded (`TS-*-Preferred_logo ….pdf`) — manufacturer co-branding this book
excludes by standing decision. **TrafficPatternsXD, MMAX, DuraShield,
PreMark, AirMark** have no product mark in the libraries at all.

§5 is explicit: all or nothing — never a random subset. To ship the variant,
Doug would need to supply clean light-background marks for the 8 missing
products (or approve TrafficScapes branding, reversing the standing
Ennis-Flint decision — see ISSUES.md).

Regenerate: `python mock_all_logos.py` from `catalogue-finishing/`.
