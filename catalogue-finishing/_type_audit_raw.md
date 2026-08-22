## A — Source inventory (every text-draw call, by archetype)

| archetype | kind | text hint | size(figma) | weight | leading | tracking |
|---|---|---|---|---|---|---|
| tracked_caps | text | `text.upper()` | size | 600 | auto(1.25) | 2.4 |
| folio | caps | `n` | 6.5 | 600(B) | — | 2.4 |
| page_cover | text | `"Catalogue 2026."` | 30 | 800 | auto(1.25) | -1.0 |
|  | caps | `"Decorative Pavement Solutions"` | 8.0 | 600(B) | — | 2.4 |
| page_half_title | caps | `"Catalogue 2026"` | 7.5 | 600(B) | — | 2.4 |
|  | caps | `"Established 1994"` | 6.5 | 600(B) | — | 2.4 |
| page_manifesto | caps | `m["eyebrow"]` | 7.5 | 600(B) | — | 2.4 |
|  | text | `no_orphan(m["body"], 3)` | 10 | 400(M) | 16 | 0 |
|  | caps | `m["signature"]` | 6.5 | 600(B) | — | 2.4 |
|  | text | `line` | 36 | 800 | auto(1.25) | -1.0 |
| page_why_stats | caps | `w["eyebrow"]` | 7.5 | 600(B) | — | 2.4 |
|  | text | `no_orphan(w["subtitle"], 3)` | 11 | 400(M) | 15 | 0 |
|  | text | `line` | 32 | 800 | auto(1.25) | -0.9 |
|  | text | `num` | 34 | 800 | auto(1.25) | -0.8 |
|  | caps | `label` | 7.0 | 600(B) | — | 2.4 |
|  | text | `sub` | 7.5 | 400(M) | 10 | 0 |
| page_why_proof | caps | `"Four Reasons"` | 6.5 | 600(B) | — | 2.4 |
|  | text | `"If it goes on the street,"` | 19 | 800 | auto(1.25) | -0.6 |
|  | text | `"it stays on the street."` | 19 | 800 | auto(1.25) | -0.6 |
|  | caps | `num` | 6.0 | 600(B) | — | 2.4 |
|  | text | `claim` | 11 | 800 | auto(1.25) | -0.3 |
|  | text | `detail` | 8.0 | 400(M) | 11 | 0 |
| page_toc | caps | `"What's Inside"` | 7.5 | 600(B) | — | 2.4 |
|  | text | `"Catalogue 2026."` | 32 | 800 | auto(1.25) | -1.0 |
|  | text | `label` | 10 | 600 | auto(1.25) | 0.3 |
|  | text | `str(num)` | 10 | 600 | auto(1.25) | 0 |
| page_section_open | caps | `("Section " + section_no).upper()` | 8.5 | 600(B) | — | 2.4 |
|  | text | `title` | 50 | 800 | 54 | -1.6 |
| page_product_hero | caps | `prod["name"]` | 7.5 | 600(B) | — | 2.4 |
|  | text | `tagline` | tagline_size | 400(M) | tagline_leading | -0.3 |
| page_product_spec | caps | `eyebrow` | 5.5 | 600(B) | — | 2.4 |
|  | text | `prod["name"]` | 22 | 800 | auto(1.25) | -1.0 |
|  | text | `no_orphan(title, 2)` | target_size | 800 | auto(1.25) | -0.9 |
|  | text | `no_orphan(prod["italic"], 3)` | 10.5 | 400(M) | 15 | 0 |
|  | text | `no_orphan(prod["body"], 3)` | 9.5 | 400(M) | 14 | 0 |
|  | caps | `joined` | 6.5 | 600(B) | — | 2.4 |
|  | caps | `label` | 6.0 | 600(B) | — | 2.4 |
|  | text | `value` | 8.5 | 600 | 11 | 0 |
| page_colour_system_a | caps | `"StreetBond Colour"` | 7.5 | 600(B) | — | 2.4 |
|  | text | `"The full palette."` | 26 | 800 | auto(1.25) | -0.9 |
|  | text | `"37 standard colours in two families. ` | 9.5 | 400(M) | 14 | 0 |
|  | text | `"Printed colours are representative — ` | 7.0 | 500 | auto(1.25) | 0 |
|  | caps | `label` | 6.5 | 600(B) | — | 2.4 |
|  | text | `col["name"]` | 6.2 | 500 | auto(1.25) | 0 |
| page_colour_system_b | caps | `"StreetBondSR · Solar Reflective"` | 7.5 | 600(B) | — | 2.4 |
|  | text | `"Cooler by design."` | 26 | 800 | auto(1.25) | -0.9 |
|  | text | `"Eleven solar-reflective colours, meas` | 9.5 | 400(M) | 14 | 0 |
|  | text | `"Reflectance ASTM C1549 · Emittance AS` | 6.5 | 500 | auto(1.25) | 0 |
|  | text | `"SR colourants can contribute to LEED ` | 8.5 | 400(M) | 12 | 0 |
|  | caps | `f"Cycle Lane — {len(cl)}"` | 6.5 | 600(B) | — | 2.4 |
|  | caps | `"hubss.com"` | 5.5 | 600(B) | — | 2.4 |
|  | text | `col["name"]` | 6.8 | 600 | auto(1.25) | 0 |
|  | text | `data` | 5.8 | 500 | auto(1.25) | 0 |
|  | text | `col["name"]` | 6.8 | 600 | auto(1.25) | 0 |
| page_process_left | caps | `"StreetPrint · The Process"` | 7.5 | 600(B) | — | 2.4 |
|  | text | `"Reheat. Stamp. Coat."` | 26 | 800 | auto(1.25) | -0.9 |
|  | text | `"How genuine stamped asphalt goes in —` | 9.5 | 400(M) | 14 | 0 |
|  | caps | `"hubss.com"` | 5.5 | 600(B) | — | 2.4 |
|  | caps | `num` | 7.0 | 600(B) | — | 2.4 |
|  | text | `title` | 13 | 800 | auto(1.25) | -0.3 |
|  | text | `no_orphan(desc, 3)` | 8.5 | 400(M) | 12.5 | 0 |
| page_process_right | caps | `"The result — pattern and colour, fuse` | 7.0 | 600(B) | — | 2.4 |
| page_application | caps | `app["name"]` | 7.5 | 600(B) | — | 2.4 |
|  | text | `no_orphan(app["tagline"], 3)` | 18 | 800 | 22 | -0.4 |
|  | text | `no_orphan(app["body"], 3)` | 8.5 | 400(M) | 12 | 0 |
|  | caps | `"hubss.com"` | 5.5 | 600(B) | — | 2.4 |
| page_project_hero | caps | `proj["name"]` | 7.5 | 600(B) | — | 2.4 |
|  | text | `no_orphan(proj["title"], 3)` | 20 | 400(M) | 24 | -0.3 |
|  | caps | `proj["location"]` | 6.0 | 600(B) | — | 2.4 |
|  | caps | `proj["product"]` | 6.0 | 600(B) | — | 2.4 |
| page_project_story | caps | `eyebrow_label` | 7.0 | 600(B) | — | 2.4 |
|  | text | `no_orphan(proj.get("name") or "", 3)` | 17 | 800 | 20 | -0.5 |
|  | caps | `sub` | 5.5 | 600(B) | — | 2.4 |
|  | text | `no_orphan(proj.get("story") or "", 3)` | 8.0 | 400(M) | 11 | 0 |
| _card_shell | caps | `eyebrow` | 7.5 | 600(B) | — | 2.4 |
|  | text | `no_orphan(headline, 3)` | head_size | 800 | head_size + 4 | -0.8 |
|  | text | `no_orphan(body, 3)` | 10.5 | 400(M) | 16 | 0 |
|  | caps | `"hubss.com"` | 6.0 | 600(B) | — | 2.4 |
|  | caps | `meta.upper()` | 6.5 | 600(B) | — | 2.4 |
|  | caps | `foot_right` | 6.0 | 600(B) | — | 2.4 |
| page_installer | caps | `"HUB Certified Installer"` | 6.5 | 600(B) | — | 2.4 |
|  | caps | `inst["region"]` | 6.5 | 600(B) | — | 2.4 |
|  | text | `inst["name"]` | 28 | 800 | 32 | -0.5 |
|  | text | `no_orphan(inst["body"], 3)` | 9.5 | 400(M) | 14.5 | 0 |
|  | caps | `"Phone"` | 6.0 | 600(B) | — | 2.4 |
|  | text | `inst["phone"]` | 15 | 800 | auto(1.25) | -0.3 |
|  | caps | `"Online"` | 6.0 | 600(B) | — | 2.4 |
|  | text | `inst["url"]` | 13 | 800 | auto(1.25) | -0.2 |
|  | caps | `"[Logo]"` | 5.5 | 600(B) | — | 2.4 |
| page_technical_reference | caps | `"Product Reference"` | 7.0 | 600(B) | — | 2.4 |
|  | text | `"The systems."` | 28 | 800 | auto(1.25) | -0.8 |
|  | text | `name` | 10 | 800 | auto(1.25) | 0 |
|  | caps | `key` | 6.5 | 600(B) | — | 2.4 |
|  | text | `desc` | 8.5 | 400(M) | auto(1.25) | 0 |
| page_cities | text | `"10"` | 60 | 800 | auto(1.25) | -1.2 |
|  | text | `"provinces and territories"` | 9 | 400(M) | 13 | 0 |
|  | text | `"specify HUB systems by name, coast to` | 9 | 400(M) | 13 | 0 |
|  | caps | `"From Halifax to Vancouver"` | 5.5 | 600(B) | — | 2.4 |
|  | text | `"A partial list"` | 7 | 400(M) | auto(1.25) | 0 |
|  | text | `cities[i]` | 8 | 400(M) | auto(1.25) | 0 |
|  | text | `cities[i + 1]` | 8 | 400(M) | auto(1.25) | 0 |
| page_lunch_learn | caps | `"An Invitation"` | 7.0 | 600(B) | — | 2.4 |
|  | text | `"Lunch is on us."` | 42 | 800 | 46 | -1.2 |
|  | text | `"Your spec is free."` | 42 | 800 | 46 | -1.2 |
|  | text | `"Forty-five minutes of technical depth` | 11 | 400(M) | 17 | 0 |
|  | text | `"BOOK NOW · hubss.com/lnl"` | 8.5 | 800 | auto(1.25) | 1.2 |
|  | caps | `"Cleve Stordy 604.309.8212 · Doug Bain` | 6.0 | 600(B) | — | 2.4 |
|  | text | `it` | 9.5 | 600 | 13 | 0 |
|  | caps | `"Scan to book"` | 6.0 | 600(B) | — | 2.4 |
| page_contact | caps | `"Two Offices. One Network."` | 5.5 | 600(B) | — | 2.4 |
|  | text | `"Speak with HUB."` | 22 | 800 | auto(1.25) | -0.6 |
|  | text | `"Every project starts with a conversat` | 10 | 400(M) | 15 | 0 |
|  | caps | `"Western Canada"` | 5.5 | 600(B) | — | 2.4 |
|  | text | `"Cleve Stordy"` | 20 | 800 | auto(1.25) | -0.4 |
|  | text | `"cleve.stordy@hubss.com"` | 8.5 | 400(M) | auto(1.25) | 0 |
|  | text | `"604.309.8212"` | 8.5 | 400(M) | auto(1.25) | 0 |
|  | text | `"Ladysmith, British Columbia"` | 7 | 400(M) | auto(1.25) | 0 |
|  | caps | `"Eastern Canada"` | 5.5 | 600(B) | — | 2.4 |
|  | text | `"Doug Bain"` | 20 | 800 | auto(1.25) | -0.4 |
|  | text | `"doug.bain@hubss.com"` | 8.5 | 400(M) | auto(1.25) | 0 |
|  | text | `"416.540.9287"` | 8.5 | 400(M) | auto(1.25) | 0 |
|  | text | `"Milton, Ontario"` | 7 | 400(M) | auto(1.25) | 0 |
|  | text | `"hubss.com"` | 16 | 800 | auto(1.25) | -0.4 |
|  | text | `"Spec sheets · project gallery · insta` | 8 | 400(M) | 12 | 0 |
|  | text | `"© 2026 HUB Surface Systems · Establis` | 5.5 | 400(M) | auto(1.25) | 1.4 |
| page_back | text | `"Canada's Leading Decorative Pavement ` | 8.5 | 400(M) | auto(1.25) | 0 |
|  | text | `"hubss.com"` | 11 | 600 | auto(1.25) | 1.4 |
|  | caps | `"Scan to view the virtual catalogue."` | 6.0 | 600(B) | — | 2.4 |
|  | text | `"West / Prairies 604.309.8212"` | 7.0 | 400(M) | auto(1.25) | 0 |
|  | text | `"Central / Maritimes 416.540.9287"` | 7.0 | 400(M) | auto(1.25) | 0 |
|  | text | `"(c) 2026 HUB Surface Systems"` | 6.5 | 400(M) | auto(1.25) | 1.0 |
|  | caps | `"[QR]"` | 8 | 600(B) | — | 2.4 |
| page_closing_manifesto | caps | `"A Final Word"` | 7.5 | 600(B) | — | 2.4 |
|  | text | `"The public realm."` | 42 | 800 | auto(1.25) | -1.2 |
|  | text | `"Ours to build right."` | 42 | 800 | auto(1.25) | -1.2 |
|  | text | `"Every surface we build is walked over` | 11 | 500 | 18 | 0 |
|  | caps | `"Specified."` | 8.0 | 600(B) | — | 2.4 |
|  | caps | `"Installed."` | 8.0 | 600(B) | — | 2.4 |
|  | caps | `"Backed."` | 8.0 | 600(B) | — | 2.4 |
|  | caps | `"HUB Surface Systems"` | 5.5 | 600(B) | — | 2.4 |
| page_service_promise | caps | `"How We Work"` | 7.0 | 600(B) | — | 2.4 |
|  | text | `"Specified."` | 32 | 800 | auto(1.25) | -1.0 |
|  | text | `"Installed."` | 32 | 800 | auto(1.25) | -1.0 |
|  | text | `"Backed."` | 32 | 800 | auto(1.25) | -1.0 |
|  | caps | `num` | 6.5 | 600(B) | — | 2.4 |
|  | text | `claim` | 11 | 800 | auto(1.25) | -0.3 |
|  | text | `detail` | 8.5 | 400(M) | 12 | 0 |
| page_quiet_mark | caps | `"HUB Surface Systems"` | 7.5 | 600(B) | — | 2.4 |
|  | caps | `"Established 1994 . Coast to Coast"` | 6.0 | 600(B) | — | 2.4 |
|  | text | `"Thank you."` | 14 | 400(M) | auto(1.25) | 0 |
| page_hub_numbers | caps | `"By the Numbers"` | 6.5 | 600(B) | — | 2.4 |
|  | caps | `"Specified coast to coast since 1994"` | 5.5 | 600(B) | — | 2.4 |
|  | text | `num` | 40 | 800 | auto(1.25) | -1.4 |
|  | caps | `label` | 7.0 | 600(B) | — | 2.4 |
|  | text | `sub` | 7.5 | 400(M) | 11 | 0 |
| page_statement | caps | `"Position"` | 6.5 | 600(B) | — | 2.4 |
|  | text | `"Asphalt is the canvas."` | 28 | 800 | 34 | -0.8 |
|  | text | `"The city is the gallery."` | 28 | 800 | 34 | -0.8 |
|  | text | `"Every crosswalk we install is a small` | 11 | 400(M) | 18 | 0 |
|  | caps | `"HUB Surface Systems · Established 199` | 5.5 | 600(B) | — | 2.4 |
| page_doublespread_right | caps | `label` | 6.5 | 600(B) | — | 2.4 |
|  | text | `caption` | 14 | 800 | 18 | -0.4 |
|  | caps | `"Thirty years in the making."` | 6.0 | 600(B) | — | 2.4 |
|  | text | `"Built to"` | 52 | 800 | auto(1.25) | -1.4 |
|  | text | `"outlast."` | 52 | 800 | auto(1.25) | -1.4 |
|  | text | `"30+ years · 1,000+ projects · 10 prov` | 7.5 | 400(M) | 11 | 0 |
|  | text | `"The surface beneath every city we've ` | 12 | 400(M) | auto(1.25) | 0 |
|  | text | `"Spec the surface. Watch it work. Walk` | 8.5 | 400(M) | 13 | 0 |
|  | caps | `"hubss.com"` | 7.5 | 600(B) | — | 2.4 |
| page_network_open | caps | `"Section Four"` | 7.5 | 600(B) | — | 2.4 |
|  | text | `"Network."` | 44 | 800 | 46 | -1.4 |
| page_field_notes | caps | `"Field Notes"` | 6.5 | 600(B) | — | 2.4 |
|  | text | `"Project notes."` | 24 | 800 | auto(1.25) | -0.6 |
|  | text | `"A place to capture surface specificat` | 8.5 | 400(M) | 13 | 0 |
|  | caps | `"hubss.com · 604.309.8212 · 416.540.92` | 5.5 | 600(B) | — | 2.4 |
| build | caps | `"Notes"` | 9.0 | 600(B) | — | 2.4 |
|  | caps | `"hubss.com"` | 5.5 | 600(B) | — | 2.4 |
| family_block | caps | `label` | 6.5 | 600(B) | — | 2.4 |
|  | text | `col["name"]` | 6.2 | 500 | auto(1.25) | 0 |
| page_blank_spacer | caps | `"Notes"` | 9.0 | 600(B) | — | 2.4 |
|  | caps | `"hubss.com"` | 5.5 | 600(B) | — | 2.4 |

## B — Static size histogram (figma units → pt ×0.96)

| figma | pt | calls |
|---|---|---|
| 5.5 | 5.3 | 17 |
| 5.8 | 5.6 | 1 |
| 6.0 | 5.8 | 13 |
| 6.2 | 6.0 | 2 |
| 6.5 | 6.2 | 19 |
| 6.8 | 6.5 | 2 |
| 7.0 | 6.7 | 14 |
| 7.5 | 7.2 | 18 |
| 8.0 | 7.7 | 10 |
| 8.5 | 8.2 | 15 |
| 9.0 | 8.6 | 4 |
| 9.5 | 9.1 | 6 |
| 10.0 | 9.6 | 5 |
| 10.5 | 10.1 | 2 |
| 11.0 | 10.6 | 7 |
| 12.0 | 11.5 | 1 |
| 13.0 | 12.5 | 2 |
| 14.0 | 13.4 | 2 |
| 15.0 | 14.4 | 1 |
| 16.0 | 15.4 | 1 |
| 17.0 | 16.3 | 1 |
| 18.0 | 17.3 | 1 |
| 19.0 | 18.2 | 2 |
| 20.0 | 19.2 | 3 |
| 22.0 | 21.1 | 2 |
| 24.0 | 23.0 | 1 |
| 26.0 | 25.0 | 3 |
| 28.0 | 26.9 | 4 |
| 30.0 | 28.8 | 1 |
| 32.0 | 30.7 | 5 |
| 34.0 | 32.6 | 1 |
| 36.0 | 34.6 | 1 |
| 40.0 | 38.4 | 1 |
| 42.0 | 40.3 | 4 |
| 44.0 | 42.2 | 1 |
| 50.0 | 48.0 | 1 |
| 52.0 | 49.9 | 2 |
| 60.0 | 57.6 | 1 |

## C — Dynamic/computed sizes (4 calls)

- `tracked_caps` → `text.upper()`: size = `size`
- `page_product_hero` → `tagline`: size = `tagline_size`
- `page_product_spec` → `no_orphan(title, 2)`: size = `target_size`
- `_card_shell` → `no_orphan(headline, 3)`: size = `head_size`

## D — Rendered ground truth (PDF spans)

| pt | spans |
|---|---|
| 5.3 | 521 |
| 5.6 | 11 |
| 5.8 | 1329 |
| 6.0 | 37 |
| 6.2 | 1283 |
| 6.5 | 14 |
| 6.7 | 152 |
| 7.2 | 765 |
| 7.7 | 82 |
| 8.2 | 78 |
| 8.6 | 3 |
| 9.1 | 82 |
| 9.6 | 30 |
| 10.1 | 172 |
| 10.6 | 15 |
| 11.5 | 1 |
| 12.5 | 7 |
| 13.4 | 7 |
| 14.4 | 5 |
| 15.4 | 1 |
| 17.3 | 1 |
| 18.2 | 3 |
| 19.2 | 3 |
| 20.2 | 1 |
| 21.1 | 17 |
| 23.0 | 2 |
| 25.0 | 4 |
| 25.9 | 32 |
| 26.9 | 7 |
| 27.8 | 37 |
| 28.8 | 1 |
| 30.7 | 5 |
| 32.6 | 11 |
| 34.6 | 3 |
| 38.4 | 4 |
| 40.3 | 4 |
| 42.2 | 1 |
| 48.0 | 4 |
| 49.9 | 2 |
| 57.6 | 1 |

**Fonts:** {'Inter-Bold': 4334, 'Inter-Medium': 351, 'Inter-SemiBold': 53}
