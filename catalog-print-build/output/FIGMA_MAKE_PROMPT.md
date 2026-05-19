# HUBSS Catalogue 2026 — Figma Make Prompt

Paste the entire prompt below into Figma Make. It will generate an editable Figma file matching this catalog's design system. Adjust as needed.

---

## PROMPT

Create a print-ready editorial product catalogue for **HUB Surface Systems**, a Canadian decorative pavement company established 1994. The catalogue is **100 pages**, square format, 5×5 inch trim with 0.125" bleed (final document size 5.25×5.25"). Audience: municipal engineers, landscape architects, and developers. Tone: confident, editorial, restrained — Aesop catalog meets Apple product book.

### Brand & Design System

**Colors (CMYK / hex equivalents):**
- Cream paper background — warm off-white, very light tint (CMYK 2/4/10/2, ~#F1EDE4)
- HUBSS Orange — `#F97316` (primary brand)
- HUBSS Navy Rich — `#0F1620` (back cover only)
- Text Dark — 88% black (CMYK 0/0/0/0.88)
- Text Mid — 55% black (CMYK 0/0/0/0.55)
- Text Faint — 35% black (CMYK 0/0/0/0.35)

**Typography (Inter family + Times Italic):**
- **Display headline** — Inter Black, 36–44pt, tracking -1.0 to -1.2, leading 1.12×
- **Page title** — Inter ExtraBold, 24–32pt, tracking -0.8
- **Subhead / spec callout** — Inter Black, 42pt, tracking -0.8 (e.g. "150 mil")
- **Italic accent / lede** — Times Italic, 10–11pt, leading 15pt
- **Body** — Inter Regular, 9.5pt, leading 14.5pt, tracking +0.05
- **Eyebrow / tracked-caps label** — Inter SemiBold, 6.5–7.5pt, tracking 2.4pt, often orange
- **Caption** — Inter Regular, 7.5–8.5pt, tracking 0.1pt
- **Pills** — Inter SemiBold, 6.5pt, tracking 1.2, in cream-grey rounded rectangle (4 figma units corner radius)

**Visual rules:**
- Generous whitespace
- Hairline rules: 0.3 pt at 35% black for separators
- Orange micro-rules: 1.2 pt × 24 figma units for editorial accents
- Hero pages have a 3-band vertical scrim from bottom (62%/42%/20% opacity black) so white overlay text always reads on photos
- Photos are full-bleed on hero pages, half-page on application/case-study/installer cards
- Each photo used at most once across the entire catalogue

### Page Structure (100 pages, divisible by 4)

1. **Cover** — Full-bleed UBC Crosswalk photo, small bottom scrim, white wordmark + "CATALOGUE 2026"
2. **Half-title** — Cream, centered orange/grey wordmark + "Catalogue 2026" + "Established 1994"
3. **Manifesto** — Eyebrow "Established 1994 · Coast to Coast", three-line display "The people who made / your city look / **like your city.**" (orange last line), body paragraph, orange rule, signature
4. **Why HUB stats** — Eyebrow "Why HUB", title "The durable / decorative hardscape.", italic subtitle, 2×2 grid of stats (30+ Years, 1,000+ Projects, 500+ Municipalities, 20yr Performance) each with big orange number
5. **Why HUB proof** — "If it goes on the street, **it stays on the street.**" + four numbered claims (Built for freeze-thaw, Lower lifecycle cost, Visible in every condition, Specified coast to coast)
6. **TOC** — "Whats Inside / Catalogue 2026." + bulleted entries with orange dots and right-aligned page numbers, hairline below each row

**Section 1 — Products** (1 opener + 12 products × hero/spec pair = 25 pages)
- Section opener: full-bleed photo, "Section One / Products." in white at bottom
- Each product gets: full-bleed photo hero (with serif italic-style tagline + tracked-caps name on dark scrim), and a cream spec card (orange eyebrow → display title → italic lede → big callout number → tracked-caps unit → body paragraph → 2×2 spec grid → 4-pill use-case row)

The 12 products are: TrafficPatternsXD (150 mil heavy-duty thermoplastic), TrafficPatterns (90 mil standard), StreetBond (acrylic colour coating), StreetPrint (stamped asphalt), DecoMark (custom thermoplastic graphics), MMAX (MMA resin lane coating), StreetBondSR (solar reflective LEED-contributing), DuraTherm (inlaid flush thermoplastic), DuraShield (penetrating asphalt rejuvenator), PreMark (pre-cut symbols), FastPatch (polyurethane pothole repair), Aquaphalt (water-activated permanent patch).

**Section 2 — Applications** (1 opener + 17 applications × 1 page = 18 pages)
- Each application: top half = photo (240 figma units tall), bottom half on cream = orange tracked-caps "Application 02 of 17", display name, italic tagline, body paragraph
- Applications: Crosswalks, Bike Lanes, Bus Lanes, Parking Lots, Parks & Paths, Playgrounds, Community Branding, Private Driveways, Sport Courts, Splash Pads, Public Spaces, Commercial Spaces, Townhomes, Pedestrian Safety, Traffic Calming, LEED & Heat Island, Public Art

**Section 3 — Projects** (1 opener + 18 case studies × hero/story pair = 37 pages)
- Hero: full-bleed project photo, white display headline at bottom on scrim, location and product as tracked caps in white and orange
- Story: cream, "Case Study 01" eyebrow, display title, location + product subhead, body paragraph, detail photo at bottom

The 18 case studies: York Region Pedestrian Safety, Vision Zero Crosswalks, Vancouver BIA Crosswalks, York Region VIVA BRT, Toronto Priority Bus Lanes, London East Link BRT, Kitchener Veterans Memorial, UBC Musqueam Crosswalk, More Awesome Now (Vancouver), White Rock Pier, Indigenous Recognition, BC Children's Hospital, Bowen Island Path, Every Child Matters (Georgina), Sechelt Pictograph Crosswalk, Simcoe Rainbow Crosswalk, New Westminster Complete Streets, Murrayville Schoolhouse.

**Section 4 — Network** (1 opener + 4 installer cards = 5 pages)
- Each installer card: orange "HUB Certified Installer" eyebrow, photo, region tracked-caps, name display, body, hairline, URL (orange) + phone (right-aligned)
- Installers: Square One Paving (BC), Thermo Design (QC), Virtue Construction (SK), ULS Landscaping (AB+SK)

**Section 5 — Reference** (1 opener + 5 pages)
- Section opener
- Technical reference table (12 product rows: name, key spec, description, hairline)
- Cities served — "Trusted, by name." 2-column list of 20 entities
- Lunch & Learn CTA — splash pad photo, "See it. Spec it. We'll bring lunch.", body, orange rounded-rect button "BOOK NOW · hubss.com/lnl"
- Contact — Two regional offices (Western: Cleve Stordy, Eastern: Doug Bain) with email/phone/location

**Page 100 — Back cover** — Navy field, centered combined wordmark, italic tagline, orange rule, contact stack, copyright

### Page geometry constants
- Document size: 378 × 378 pt (5.25" × 5.25")
- Trim size: 360 × 360 pt (5" × 5")
- Bleed: 9 pt (0.125") on every side
- Safe area: 18 pt inside trim
- Crop marks at corners (0.25 pt hairlines extending outside trim)
- All text/logos must stay inside the safe area

### Voice
- "Specified by Canadian municipalities coast to coast"
- "Outlasts paint by seasons, not months"
- "If it goes on the street, it stays on the street"
- "The people who made your city look like your city"
- Avoid em-dashes, parentheticals, exclamation marks. Sentence fragments are encouraged for editorial rhythm.

Generate this as a multi-page Figma file with frames named "1 — Cover", "2 — Half title", "3 — Manifesto", etc., using the design system defined above.
