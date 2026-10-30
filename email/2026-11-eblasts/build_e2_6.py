"""E-blasts 2 to 6 as Constant Contact custom-code HTML, on build_e1.py's shell (29 Oct 2026).

Same shell as E-blast 1 (claude/HUBSS-eblast-builder.md): the 600 px table, the mobile CSS,
the buttons, the footer, [[trackingImage]] just before </body>. Added: the feature split (the
printed-copy split's layout) that E-blasts 2 to 6 carry after the plate.

Words: Figma Marketing Material, page 176:2, frames 220:2, 222:2, 223:2, 224:2, 225:2, with
the copy fixes in FIXES. Casing follows Figma and the copy rule of 26 Oct (product names in
their own capitals): project captions and the plate's eyebrow as typed; kickers and product
captions in capitals.

Photos: hubss.com/email/2026-11-eblast-N/; the logo, Moose, the flag and the printed copy are
E-blast 1's files.

Usage: python3 build_e2_6.py OUTDIR [--local PUBLIC_EMAIL_DIR]   (--local: render checks only)
"""
import html, json, os, sys

SITE = "https://hubss.com"
F = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
OR, YE, INK, BODY, CAP, LIGHT, DARK, BLACK = "#F97316", "#EAB308", "#1B1A18", "#44403C", "#57534E", "#FAF9F6", "#151515", "#101010"
GRAD = f"background-color:{OR};background-image:linear-gradient(90deg,{OR} 0%,{YE} 100%);"
e = html.escape

FIXES = {
    0: ["All: the Lunch & Learn chip '10 Provinces served' is now '27 Years in the field' (not in the book; the site dropped it on 30 Sep; docs/GLOSSARY.md: goes nowhere new). E-blast 1 still has it."],
    2: ["Hero eyebrow 'Maple Ridge, British Columbia' is now 'Coquitlam, British Columbia': the hero photo is Sheffield Park, Coquitlam (book pp.82-83, map coquitlam-sheffield-park).",
        "Deck 'StreetBond lets you transform asphalt and concrete in' is now the 26 Oct line 'StreetBond puts your palette on asphalt and concrete,' ('transform' is on docs/STYLE.md's list)."],
    4: ["Deck: 'crossings' is now 'crosswalks' (house rule).",
        "Every Child Matters row: the Figma photo (gallery public-art-03, a marina crosswalk) has no record placing it in Georgina; the row now carries the Georgina post's own photo."],
    5: ["Hero button 'Read the East London Link project' is now 'Read the East London Link' (it wrapped to two lines at desktop width).",
        "Products: the kicker 'DEORATIVE · APPLICATIONS' is now 'Crosswalks · Entrance features' (book p.11).",
        "Kelowna row links its source, /blog/performance-crosswalks-asphalt-concrete (over 80 crosswalks), not the product page."],
    6: ["Main button went to the StreetBond page with E-blast 2's tags; it now goes to /applications/pedestrian-safety.",
        "Preview text named 'DuraTherm on the Spirit Trail', no longer in this e-blast; it now names Kitchener's veterans crosswalk.",
        "Feature headline 'A crossing to remember.' is now 'A crosswalk to remember.' (house rule); its kicker is singular: one crosswalk.",
        "Feature link 'Explore the memorial crosswalk' is now 'Read the Kitchener project' ('Explore' is not a link verb, docs/STYLE.md).",
        "Lunch & Learn link topic PreMark (not in this e-blast) is now TrafficPatterns."],
}

# Rows: projects (img, h, alt, kicker, title, path, utm_content, place, system)
#       products (img, h, alt, kicker, title, slug, line, caption-left, caption-right)
EBLASTS = [
 dict(n=2, name="E-blast 2 · Landscape Architects", camp="landscape-architects",
  title="Your vision. Your design. Our materials make it work.",
  pre="Colour, cooler surfaces and graphics for parks and plazas, with the spec for each system.",
  strap="Public spaces",
  hero=("hero-sheffield-park.jpg", 380, "Sheffield Park’s skate plaza and StreetBond paths from above, Coquitlam, British Columbia"),
  eyebrow="Coquitlam, British Columbia · StreetBond",
  h1=("Your vision. Your&nbsp;design.", "Our materials make it&nbsp;work."),
  deck="StreetBond puts your palette on asphalt and concrete, in 63 standard colours or a custom match. Twelve StreetBondSR colours reflect sunlight rather than absorb it, so asphalt stays cooler underfoot.",
  cta=("See the StreetBond colours", "/products/streetbond", "hero-streetbond-colours"),
  feature=dict(img=("bc-childrens-labyrinth.jpg", 320, "A green labyrinth on a garden deck at BC Children’s Hospital"),
    kicker="Healing garden", head="A labyrinth on the hospital deck.",
    body=e("Oren Mizrahi of Connect Landscape Architecture, on the StreetBond and DecoMark at BC Children’s Hospital: ")
         + '<span style="font-style:italic;font-weight:500;">' + e("“a successful implementation and translation of our design ideas to the ground plane.”") + "</span>",
    link=("Read the BC Children’s project", "/blog/bc-childrens-hospital-labyrinth", "feature-bc-childrens")),
  projects=("The ground is part of the plan.", [
    ("kitchener-kings-queens.jpg", 150, "Colourful TrafficPatterns art across a downtown intersection in Kitchener, Ontario, seen from above", "Intersection art", "Kings and Queens", "/product-book/107", "project-kitchener-kings-queens", "Kitchener, Ontario", "TrafficPatterns"),
    ("toronto-geary-works.jpg", 150, "GEARY WORKS lettering and green gears in DecoMark along a Toronto path", "Placemaking", "The path carries the name", "/blog/geary-works-toronto-park-walkway", "project-geary-works", "Toronto, Ontario", "DecoMark"),
    ("bowen-island-snug-cove.jpg", 150, "Coloured shapes and a seal saying “I wish this were a water slide!” on a StreetBond path at Snug Cove, Bowen Island", "Parks & paths", "A path with a sense of humour", "/blog/bowen-island-asphalt-path", "project-bowen-island", "Bowen Island, British Columbia", "StreetBond")]),
  products=("What carries the colour.", [
    ("streetbond.jpg", 150, "A StreetBond sports court in orange, green and blue", "Parks · Playgrounds", "StreetBond", "streetbond", "Moves with the pavement, so it resists cracking, wear and slipping.", "63 colours + custom", None),
    ("streetbondsr-canada-post-lot.jpg", 150, "Canada Post trucks parked on a StreetBondSR fleet lot", "Commercial · Parking", "StreetBondSR", "streetbondsr", "Solar-reflective colours that keep parking lots and plazas cooler.", "SR 0.33 or higher", "Urban heat island"),
    ("decomark.jpg", 150, "The First Nations land recognition in Fort Langley, British Columbia, in DecoMark on asphalt", "Identity · Public art", "DecoMark", "decomark", "Your vector artwork, made in the factory and heat-applied on site.", "Custom graphics", "Asphalt or concrete")]),
  ll=("Bring your palette.", "Case studies, spec language and samples for your office, built around colour, cooler surfaces and graphics.", "StreetBond")),

 dict(n=3, name="E-blast 3 · Commercial Properties", camp="commercial-specifiers",
  title="Fourteen years on a retail crosswalk in Halton Hills",
  pre="The crosswalks at Toronto Premium Outlets, and the systems for entrances, lots and townhome lanes.",
  strap="Commercial properties",
  hero=("hero-toronto-premium-outlets.jpg", 375, "The TrafficPatternsXD crosswalk at the entrance to Toronto Premium Outlets in Halton Hills, Ontario"),
  eyebrow="Halton Hills, Ontario · TrafficPatternsXD",
  h1=("Appearance matters.", "Year after year<br>of performance."),
  deck="The TrafficPatternsXD crosswalks at Toronto Premium Outlets have carried shoppers and delivery trucks through fourteen Ontario winters.",
  cta=("Read the fourteen-year story", "/blog/toronto-premium-outlets-14-years", "hero-fourteen-year-story"),
  feature=dict(img=("new-westminster-oxford-townhomes.jpg", 320, "A charcoal StreetPrint laneway between townhomes in New Westminster, British Columbia"),
    kicker="Townhomes", head="A strata is judged<br>at the curb.",
    body=e("Charcoal StreetPrint on the laneways of Oxford Townhomes in Queensborough, New Westminster: stamped asphalt, with no pavers to settle and no joints to weed."),
    link=("See townhome projects", "/applications/townhomes", "feature-townhomes")),
  projects=("Where customers walk first.", [
    ("vancouver-granville-island.jpg", 150, "A red brick-pattern TrafficPatternsXD crosswalk outside a taproom on Granville Island, Vancouver", "Brewery entrance", "Seven years at Granville Island", "/product-book/130", "project-granville-island", "Vancouver, British Columbia", "TrafficPatternsXD"),
    ("vaughan-audi-dealership.jpg", 150, "A light grey brick-pattern entrance at an Audi dealership in Vaughan, Ontario", "Car dealership", "First impressions at Audi", "/product-book/109", "project-vaughan-audi", "Vaughan, Ontario", "TrafficPatternsXD"),
    ("oakville-fortinos.jpg", 150, "A red brick-pattern TrafficPatternsXD crosswalk in front of a Fortinos store in Oakville, Ontario", "Fortinos parking lot", "Still performing 10 years later", "/product-book/72", "project-oakville", "Oakville, Ontario", "TrafficPatternsXD")]),
  products=("Match the system to the wear.", [
    ("trafficpatternsxd.jpg", 150, "A shopper crossing a brick-pattern TrafficPatternsXD crosswalk", "Crosswalks · Transit", "TrafficPatternsXD", "traffic-patterns-xd", "Aggregate-reinforced and stamped into the asphalt, for heavy traffic.", "150 mil", "10+ year service life"),
    ("streetprint.jpg", 150, "Red StreetPrint brick pattern under autumn leaves", "Entrances · Streetscapes", "StreetPrint", "streetprint", "Brick and stone patterns stamped into new or existing asphalt, then coloured.", "Custom patterns", "10–20 year service life"),
    ("trafficpatterns.jpg", 158, "Green and blue artwork by Fauxreel set into a Toronto street", "Community · Artwork", "TrafficPatterns", "traffic-patterns", "Made to your design and heat-applied to asphalt or concrete.", "125 mil", "8+ year service life"),
    ("streetbond-parking.jpg", 150, "Grey StreetBond parking stalls at a building entrance", "Parking · Entrances", "StreetBond", "streetbond", "Colour coatings for asphalt and concrete that move with the pavement.", "63 colours", "8+ year service life")]),
  ll=("Bring the site plan.", "Case studies, spec language and samples for your team, built around entrances, drive aisles and lots.", "TrafficPatternsXD")),

 dict(n=4, name="E-blast 4 · Public Works and Transit", camp="government-specifiers",
  title="The spec sheets are ready when your tender is",
  pre="Where to find the spec sheets, and why Vaughan chose TrafficPatternsXD for Woodbridge Avenue.",
  strap="Public works and operations",
  hero=("hero-toronto-ttc-bus-lane.jpg", 375, "A TTC bus in a red MMAX transit lane in Toronto"),
  eyebrow="Toronto, Ontario · MMAX",
  h1=("Specify with confidence.", "Materials that work<br>in Canada."),
  deck="Surface systems for the streets, crosswalks and transit lanes your community relies on.",
  cta=("See the systems", "/products", "hero-see-the-systems"),
  feature=dict(img=("woodbridge-avenue-crosswalk.jpg", 320, "A brick-pattern TrafficPatternsXD crosswalk on Woodbridge Avenue in Vaughan, with snow at the curb"),
    kicker="City of Vaughan", head="The crosswalk survives the plow.",
    body=e("Woodbridge Avenue runs through a designated Heritage Conservation District. The City chose TrafficPatternsXD for every crosswalk at its intersections, because real brick pavers catch plow blades."),
    link=("Read the Woodbridge project", "/blog/trafficpatternsxd-urban-design", "feature-woodbridge")),
  projects=("Chosen by Canadian cities.", [
    ("toronto-emery-village.jpg", 150, "A truck crossing the blue TrafficPatternsXD gateway in Emery Village, Toronto", "Emery Village Gateway feature", "Replacing paving stones with TrafficPatternsXD", "/blog/decorative-asphalt-high-traffic", "project-emery-village", "Toronto, Ontario", "TrafficPatternsXD"),
    ("verdun-flush-medians.jpg", 150, "A grey brick-pattern TrafficPatternsXD median in Verdun, Québec", "Traffic control", "Medians a plow can clear", "/product-book/116", "project-verdun", "Verdun, Québec", "TrafficPatternsXD"),
    ("georgina-every-child-matters.jpg", 150, "The orange Every Child Matters crosswalk in Georgina, Ontario, lettered in white script", "Community crosswalk", "Every Child Matters", "/blog/every-child-matters-crosswalk", "project-georgina", "Georgina, Ontario", "TrafficPatterns")]),
  products=("What the corridors are made of.", [
    ("mmax.jpg", 150, "A London Transit bus beside a red MMAX transit lane", "Bus lanes · Bike lanes", "MMAX", "mmax", "Methyl methacrylate with embedded aggregate for skid resistance.", "Traffic-ready in 45–60 min", "From +3°C"),
    ("trafficpatternsxd.jpg", 150, "A dark brick-pattern TrafficPatternsXD crosswalk on a residential street", "Crosswalks · Transit", "TrafficPatternsXD", "traffic-patterns-xd", "Aggregate-reinforced and stamped into the asphalt, for heavy traffic.", "150 mil", "10+ year service life"),
    ("trafficpatterns-langley.jpg", 150, "Langley City’s railroad heritage crosswalk in TrafficPatterns, at the entrance to Linwood Park", "Crosswalks · Parks", "TrafficPatterns", "traffic-patterns", "Made to your design and heat-applied to asphalt or concrete.", "125 mil", "8+ year service life")]),
  ll=("Bring your next tender.", "Case studies, spec language and samples for your department, built around the work you’re tendering.", "MMAX")),

 dict(n=5, name="E-blast 5 · Transportation Engineers", camp="engineers",
  title="Crosswalks and bus lanes fail differently",
  pre="Thickness, skid resistance, cure time and service life, system by system.",
  strap="Public transportation engineers",
  hero=("hero-london-east-link.jpg", 375, "Red MMAX transit lanes and a TrafficPatternsXD crosswalk at an East London Link station in London, Ontario"),
  eyebrow="London, Ontario · MMAX and TrafficPatternsXD",
  h1=("Multiple products.", "Innovative solutions."),
  deck="On the East London Link, the City used TrafficPatternsXD at the crosswalks, where buses brake and turn, along with red MMAX.",
  cta=("Read the East London Link", "/blog/london-east-link-brt", "hero-east-london-link"),
  feature=dict(img=("richmond-brighouse-station.jpg", 320, "A TrafficPatternsXD crosswalk at TransLink’s Brighouse Station in Richmond, British Columbia"),
    kicker="Transit station", head="A station crosswalk that keeps its grip.",
    body=e("At TransLink’s Brighouse Station, TrafficPatternsXD crosswalks run across No. 3 Road and through the development area, with anti-skid aggregate through the full thickness."),
    link=("Read the Brighouse project", "/blog/richmond-brighouse-crosswalk", "feature-brighouse")),
  projects=("Built into transit corridors.", [
    ("waterloo-ion-crosswalk.jpg", 150, "A pedestrian with a white cane on a red TrafficPatternsXD crosswalk on the ION corridor", "Light rail", "Crosswalks on the ION corridor", "/product-book/63", "project-ion-corridor", "Waterloo Region, Ontario", "TrafficPatternsXD"),
    ("york-region-highway-7.jpg", 150, "A TrafficPatternsXD crosswalk and green bike lanes at a Highway 7 rapidway station", "Bus rapid transit", "The Highway 7 rapidway", "/blog/multimodal-connectivity-york-region", "project-highway-7-rapidway", "York Region, Ontario", "TrafficPatternsXD"),
    ("kelowna-crosswalk.jpg", 150, "A red TrafficPatternsXD crosswalk between green bike lanes in Kelowna, British Columbia", "Downtown core", "80+ crosswalks, one system", "/blog/performance-crosswalks-asphalt-concrete", "project-kelowna", "Kelowna, British Columbia", "TrafficPatternsXD")]),
  products=("The numbers, system by system.", [
    ("trafficpatternsxd.jpg", 150, "A person walking across a TrafficPatternsXD crosswalk", "Crosswalks · Transit", "TrafficPatternsXD", "traffic-patterns-xd", "The look of brick pavers without the maintenance in some of the busiest locations.", "150 mil", "60 BPN, ASTM E303"),
    ("mmax.jpg", 150, "A red MMAX bus lane marked BUS ONLY", "Bus lanes · Bike lanes", "MMAX", "mmax", "Methyl methacrylate with embedded aggregate for skid resistance.", "Traffic-ready in 45–60 min", "From +3°C"),
    ("trafficpatterns.jpg", 150, "White Rock’s Seaside Stroll crosswalk in TrafficPatterns, in blue and sand waves", "Crosswalks · Entrance features", "TrafficPatterns", "traffic-patterns", "Made to your design and heat-applied to asphalt or concrete.", "125 mil", "8+ year service life")]),
  ll=("Bring the corridor.", "Case studies, spec language and samples, built around the corridor you’re designing.", "TrafficPatternsXD")),

 dict(n=6, name="E-blast 6 · Pedestrian Safety", camp="pedestrian-safety",
  title="Crosswalks that stay visible for 8+ years",
  pre="White Rock’s Seaside Stroll, Kitchener’s veterans crosswalk, and a rail safety marking in Brantford.",
  strap="Pedestrian safety",
  hero=("hero-white-rock-seaside-stroll.jpg", 375, "White Rock’s Seaside Stroll crosswalk in TrafficPatterns, in blue and sand waves"),
  eyebrow="White Rock, British Columbia · TrafficPatterns",
  h1=("Crosswalks that stay", "visible for 8+ years."),
  deck="White Rock’s Seaside Stroll crosswalk is made using TrafficPatterns, heat-applied so it bonds to the asphalt. Its aggregate runs through the full thickness, so the grip lasts as long as the colour.",
  cta=("Pedestrian safety systems", "/applications/pedestrian-safety", "hero-pedestrian-safety"),
  feature=dict(img=("kitchener-veterans-crosswalk.jpg", 245, "Veterans and a Canadian flag at Kitchener’s veterans crosswalk, which reads Lest We Forget"),
    kicker="Veterans memorial crosswalk", head="A crosswalk to<br>remember.",
    body=e("TrafficPatterns brings remembrance to the street with a memorial crosswalk honouring veterans. Maple leaves and commemorative imagery create a tribute with every step."),
    link=("Read the Kitchener project", "/blog/veterans-crosswalk-kitchener", "feature-kitchener-veterans")),
  projects=("Markings people notice.", [
    ("brantford-look-listen-live.jpg", 150, "A yellow Look Listen Live DecoMark marking on a sidewalk beside a rail crossing in Brantford, Ontario", "Rail safety", "Look Listen Live at a rail crossing", "/blog/look-listen-live-rail-safety-marking-brantford", "project-brantford", "Brantford, Ontario", "DecoMark"),
    ("vancouver-little-italy.jpg", 150, "The Little Italy DecoMark medallion and a TrafficPatterns crosswalk on Commercial Drive, Vancouver", "Main street", "Little Italy, in the crosswalk", "/blog/community-spaces", "project-little-italy", "Vancouver, British Columbia", "TrafficPatterns · DecoMark"),
    ("sechelt-pictograph-crosswalk.jpg", 150, "A crosswalk with orange pictograph figures in Sechelt, British Columbia", "Community crosswalk", "The shíshálh origin story", "/blog/pictograph-crosswalk-sechelt", "project-sechelt", "Sechelt, British Columbia", "TrafficPatterns")]),
  products=("Made to stay visible.", [
    ("trafficpatterns.jpg", 150, "Multicoloured TrafficPatterns borders around a neighbourhood intersection", "Crosswalks · Parks", "TrafficPatterns", "traffic-patterns", "Made to your design and heat-applied to asphalt or concrete.", "125 mil", "8+ year service life"),
    ("duratherm.jpg", 150, "A blue DuraTherm hexagon pattern at a school entrance", "Crosswalks · Calming", "DuraTherm", "duratherm", "Inlaid flush with the road, with nothing for a plow blade to catch.", "90 mil", "Snowplow-safe"),
    ("decomark.jpg", 150, "A red and orange DecoMark medallion on a concrete plaza", "Identity · Public art", "DecoMark", "decomark", "Your vector artwork, made in the factory and heat-applied on site.", "Custom graphics", "Asphalt or concrete")]),
  ll=("Bring your toughest crosswalk.", "Case studies, spec language and samples, built around your crosswalks, near a rail line, a school or a campus.", "TrafficPatterns")),
]


def build(b, base):
    IMG = f"{base}/2026-11-eblast-{b['n']}"
    SHARED = f"{base}/2026-11-eblast-1"
    CAMP = b["camp"]
    links = []

    def u(path, content):
        base_, frag = (path.split("#", 1) + [""])[:2]
        sep = "&" if "?" in base_ else "?"
        url = f"{SITE}{base_}{sep}utm_source=eblast&amp;utm_medium=email&amp;utm_campaign={CAMP}&amp;utm_content={content}" + (f"#{frag}" if frag else "")
        links.append(url.replace("&amp;", "&"))
        return url

    def rule(h=5): return f'<tr><td style="height:{h}px;line-height:{h}px;font-size:0;{GRAD}">&nbsp;</td></tr>'

    def eyebrow(t, color="#EA580C", upper=True):
        style = "letter-spacing:3px;text-transform:uppercase;" if upper else "letter-spacing:0.2px;"
        return f'<p style="margin:0;font-family:{F};font-size:12px;line-height:16px;font-weight:700;{style}color:{color};">{e(t)}</p>'

    def h2(t, size=30, color=INK, mt=10): return f'<h2 style="margin:{mt}px 0 0;font-family:{F};font-size:{size}px;line-height:{round(size*1.15)}px;font-weight:800;letter-spacing:-0.5px;color:{color};">{t}</h2>'
    def textlink(href, t, color="#EA580C"): return f'<a href="{href}" style="font-family:{F};font-size:15px;line-height:22px;font-weight:700;color:{color};text-decoration:none;">{e(t)}&nbsp;&nbsp;&rarr;</a>'

    def button(href, t, primary=True):
        if primary:
            return (f'<a href="{href}" style="display:inline-block;{GRAD}color:#ffffff;font-family:{F};font-size:17px;line-height:22px;font-weight:600;'
                    f'text-decoration:none;padding:11px 18px;border-radius:6px;mso-padding-alt:0;">{e(t)}&nbsp;&nbsp;&rarr;</a>')
        return (f'<a href="{href}" style="display:inline-block;border:1px solid #6B6B6B;color:#ffffff;font-family:{F};font-size:15px;line-height:22px;font-weight:600;'
                f'text-decoration:none;padding:10px 18px;border-radius:6px;">{e(t)}</a>')

    divider = '<tr><td style="height:1px;line-height:1px;font-size:0;background:#E4E1DA;">&nbsp;</td></tr>'

    def row(img, h, alt, kicker, title, href, left, right, line=None, upper=True):
        ln = f'<p style="margin:8px 0 0;font-family:{F};font-size:15px;line-height:23px;color:{BODY};">{e(line)}</p>' if line else ""
        cap = e(left) + (f'<span style="color:{OR};">&nbsp;|&nbsp;</span>' + e(right) if right else "")
        tt = "text-transform:uppercase;" if upper else ""
        return f'''<tr><td style="padding:18px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="stack" width="200" valign="middle" style="width:200px;"><a href="{href}"><img src="{IMG}/{img}" width="200" height="{h}" alt="{e(alt)}" style="display:block;width:200px;height:auto;border:0;border-radius:4px;" /></a></td>
<td class="gap" width="20" style="width:20px;font-size:0;">&nbsp;</td>
<td class="stack" valign="middle">{eyebrow(kicker)}
<p style="margin:8px 0 0;font-family:{F};font-size:19px;line-height:24px;font-weight:700;color:{INK};"><a href="{href}" style="color:{INK};text-decoration:none;">{e(title)}</a></p>{ln}
<p style="margin:8px 0 0;font-family:{F};font-size:12px;line-height:17px;font-weight:600;{tt}color:{CAP};">{cap}</p></td>
</tr></table></td></tr>'''

    def rows(items):
        out = []
        for i, it in enumerate(items):
            if i: out.append(divider)
            out.append(row(*it))
        return "".join(out)

    def split(img_html, text_html):
        return f'''<tr><td class="pad" style="background:#F3F1EB;padding:40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="col" width="240" valign="middle" style="width:240px;">{img_html}</td>
<td class="gap" width="24" style="width:24px;font-size:0;">&nbsp;</td>
<td class="col" valign="middle">{text_html}</td>
</tr></table></td></tr>'''

    def split_img(src, h, alt, href):
        return f'<a href="{href}"><img src="{src}" width="240" height="{h}" alt="{e(alt)}" style="display:block;width:240px;max-width:100%;height:auto;border:0;border-radius:6px;" /></a>'

    projects = rows([(img, h, alt, k, t, u(path, c), left, right, None, False) for img, h, alt, k, t, path, c, left, right in b["projects"][1]])
    products = rows([(img, h, alt, k, t, u(f"/products/{slug}", f"product-{slug}"), left, right, line, True) for img, h, alt, k, t, slug, line, left, right in b["products"][1]])

    chip = lambda num, label: (f'<span style="display:inline-block;margin:0 6px 8px 0;border:1px solid #3A3A3A;border-radius:6px;padding:7px 11px;'
                               f'font-family:{F};font-size:12px;line-height:16px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#A8A29E;white-space:nowrap;"><span style="color:{OR};font-weight:700;">{num}</span>&nbsp; {label}</span>')

    hero_img, hero_h, hero_alt = b["hero"]
    cta_t, cta_path, cta_c = b["cta"]
    fe = b["feature"]
    f_img, f_h, f_alt = fe["img"]
    f_t, f_path, f_c = fe["link"]
    f_href = u(f_path, f_c)
    l1, l2 = b["h1"]
    ll_head, ll_body, ll_topic = b["ll"]

    feature = split(split_img(f"{IMG}/{f_img}", f_h, f_alt, f_href),
                    f'{eyebrow(fe["kicker"])}{h2(fe["head"], 26)}\n<p style="margin:14px 0 0;font-family:{F};font-size:16px;line-height:25px;color:{BODY};">{fe["body"]}</p>\n<p style="margin:18px 0 0;">{textlink(f_href, f_t)}</p>')
    printed = split(split_img(f"{SHARED}/printed-copy.jpg", 320, "The printed HUB Product Portfolio Book, Volume 5", u("/request-product-book", "printed-image")),
                    f'{eyebrow("Printed edition")}{h2("Keep Volume 5<br>on your shelf.", 26)}\n<p style="margin:14px 0 0;font-family:{F};font-size:16px;line-height:25px;color:{BODY};">We’ll mail the printed edition to any Canadian address, with every system, every application, and everything else you need to know about these innovative technologies.</p>\n<p style="margin:18px 0 0;">{textlink(u("/request-product-book", "printed-request"), "Request a printed copy")}</p>')

    body = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting">
<title>{e(b["title"])}</title>
<style>
body{{margin:0;padding:0;background:#E9E7E2;}} a{{color:inherit;}} img{{-ms-interpolation-mode:bicubic;}}
@media only screen and (max-width:620px){{
 .wrap{{width:100%!important;}} .pad{{padding-left:24px!important;padding-right:24px!important;}}
 .stack{{display:block!important;width:100%!important;}} .stack img{{width:100%!important;}} .gap{{display:block!important;height:14px!important;width:100%!important;}}
 .hl{{font-size:30px!important;line-height:35px!important;}} .col{{display:block!important;width:100%!important;padding:0 0 22px 0!important;}}
 .btn1,.btn2{{display:block!important;}} .strap{{letter-spacing:1px!important;font-size:11px!important;}} .btn2{{padding:12px 0 0 0!important;}}
}}
</style></head>
<body style="margin:0;padding:0;background:#E9E7E2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">{e(b["pre"])}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E9E7E2;"><tr><td align="center" style="padding:0;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:{LIGHT};">

<tr><td class="pad" style="background:{BLACK};padding:22px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td><a href="{u('/', 'logo')}"><img src="{SHARED}/hub-logo-white.png" width="150" height="37" alt="HUB Surface Systems" style="display:block;border:0;" /></a></td>
<td class="strap" align="right" style="font-family:{F};font-size:12px;line-height:16px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#9CA3AF;">{e(b["strap"])}</td>
</tr></table></td></tr>

<tr><td style="background:#E7E3DC;"><a href="{u(cta_path, 'hero-image')}"><img src="{IMG}/{hero_img}" width="600" height="{hero_h}" alt="{e(hero_alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;" /></a></td></tr>
{rule()}

<tr><td class="pad" style="background:{DARK};padding:44px 40px 46px;">
{eyebrow(b["eyebrow"], "#FDBA74", upper=False)}
<h1 class="hl" style="margin:16px 0 0;font-family:{F};font-size:38px;line-height:42px;font-weight:800;letter-spacing:-0.8px;color:#ffffff;">{l1}<br><span style="color:{OR};">{l2}</span></h1>
<p style="margin:18px 0 0;font-family:{F};font-size:17px;line-height:27px;color:#C9C9C9;">{e(b["deck"])}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;"><tr>
<td class="btn1">{button(u(cta_path, cta_c), cta_t)}</td>
<td class="btn2" style="padding-left:12px;">{button(u('/product-book', 'hero-view-portfolio'), 'View product portfolio', False)}</td>
</tr></table>
</td></tr>

{feature}

<tr><td class="pad" style="padding:52px 40px 4px;">{eyebrow("Projects")}{h2(e(b["projects"][0]))}</td></tr>
<tr><td class="pad" style="padding:14px 40px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{projects}</table></td></tr>
<tr><td style="height:1px;line-height:1px;font-size:0;background:#E4E1DA;">&nbsp;</td></tr>

<tr><td class="pad" style="padding:52px 40px 4px;">{eyebrow("Products")}{h2(e(b["products"][0]))}</td></tr>
<tr><td class="pad" style="padding:14px 40px 48px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{products}
<tr><td style="padding:26px 0 0;">{textlink(u('/products', 'specs-every-system'), 'Specs and colours for every system')}</td></tr></table></td></tr>

{printed}

<tr><td class="pad" style="background:{DARK};padding:32px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#222222;border-radius:14px;">
{rule(4).replace('<td style="', '<td style="border-radius:14px 14px 0 0;')}
<tr><td style="padding:30px 30px 34px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="74" valign="middle"><img src="{SHARED}/moose.png" width="74" height="74" alt="Moose, HUB's dog, in a hard hat" style="display:block;border:0;" /></td>
<td style="padding-left:14px;" valign="middle">{eyebrow("Lunch & Learn", "#FDBA74")}<p style="margin:6px 0 0;font-family:{F};font-size:15px;line-height:21px;font-weight:600;color:#C9C9C9;">Hosted by the HUB team (and Moose, our gentle giant)</p></td>
</tr></table>
<h2 style="margin:26px 0 0;font-family:{F};font-size:32px;line-height:36px;font-weight:800;letter-spacing:-0.6px;color:#ffffff;">{e(ll_head)}<br>Lunch is on us.</h2>
<p style="margin:16px 0 0;font-family:{F};font-size:16px;line-height:26px;color:#9CA3AF;">{e(ll_body)}</p>
<p style="margin:20px 0 0;font-size:0;line-height:0;">{chip("60 min", "Focused")}{chip("$0", "To attend")}{chip("27", "Years in the field")}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;"><tr><td>{button(u(f'/lunch-learn?topic={ll_topic}#book', 'lunch-learn'), 'Book a Lunch & Learn')}</td></tr></table>
</td></tr></table></td></tr>

<tr><td class="pad" style="padding:52px 40px 48px;">{eyebrow("27 years · 1,000+ projects")}{h2("Speak with HUB.")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr>
<td class="col" width="50%" valign="top">{eyebrow("Western Canada")}<p style="margin:8px 0 0;font-family:{F};font-size:20px;line-height:26px;font-weight:800;color:{INK};">Cleve Stordy</p>
<p style="margin:8px 0 0;font-family:{F};font-size:16px;line-height:25px;color:{BODY};"><a href="mailto:cleve.stordy@hubss.com" style="color:{INK};">cleve.stordy@hubss.com</a><br><a href="tel:+16043098212" style="color:{BODY};text-decoration:none;">604-309-8212</a></p></td>
<td class="col" width="50%" valign="top">{eyebrow("Eastern Canada")}<p style="margin:8px 0 0;font-family:{F};font-size:20px;line-height:26px;font-weight:800;color:{INK};">Doug Bain</p>
<p style="margin:8px 0 0;font-family:{F};font-size:16px;line-height:25px;color:{BODY};"><a href="mailto:doug.bain@hubss.com" style="color:{INK};">doug.bain@hubss.com</a><br><a href="tel:+14165409287" style="color:{BODY};text-decoration:none;">416-540-9287</a></p></td>
</tr></table></td></tr>
{rule()}

<tr><td class="pad" style="background:{BLACK};padding:38px 40px 40px;">
<a href="{u('/', 'footer-logo')}"><img src="{SHARED}/hub-logo-white.png" width="120" height="30" alt="HUB Surface Systems" style="display:block;border:0;" /></a>
<p style="margin:18px 0 0;font-family:{F};font-size:15px;line-height:23px;font-weight:600;color:#ffffff;">Pedestrian safety, traffic calming, civic identity.<br><span style="color:{OR};">Coast to coast since 1999.</span></p>
<p style="margin:20px 0 0;font-family:{F};font-size:11px;line-height:20px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#ffffff;">
<a href="{u('/products', 'footer-products')}" style="color:#ffffff;text-decoration:none;">Products</a> &nbsp;/&nbsp; <a href="{u('/applications', 'footer-applications')}" style="color:#ffffff;text-decoration:none;">Applications</a> &nbsp;/&nbsp; <a href="{u('/product-book', 'footer-book')}" style="color:#ffffff;text-decoration:none;">Product Portfolio Book</a><br>
<a href="{u('/lunch-learn', 'footer-lunch-learn')}" style="color:#ffffff;text-decoration:none;">Lunch &amp; Learn</a> &nbsp;/&nbsp; <a href="{u('/contact', 'footer-contact')}" style="color:#ffffff;text-decoration:none;">Contact</a></p>
<p style="margin:16px 0 0;font-family:{F};font-size:13px;line-height:20px;color:#9CA3AF;"><a href="https://www.linkedin.com/company/hub-surface-systems" style="color:#9CA3AF;">LinkedIn</a> &nbsp;·&nbsp; <a href="https://www.instagram.com/hub_surface_systems/" style="color:#9CA3AF;">Instagram</a> &nbsp;·&nbsp; <a href="https://www.facebook.com/hubsurfacesystems" style="color:#9CA3AF;">Facebook</a></p>
<p style="margin:18px 0 0;font-family:{F};font-size:12px;line-height:16px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#8E8A83;">Canadian owned and operated &nbsp;<img src="{SHARED}/flag-canada.png" width="19" height="13" alt="" style="display:inline-block;vertical-align:-1px;border:0;" /></p>
</td></tr>
</table>
</td></tr></table>
[[trackingImage]]
</body></html>'''
    return body, links


if __name__ == "__main__":
    out = sys.argv[1]
    local = sys.argv[sys.argv.index("--local") + 1] if "--local" in sys.argv else None
    os.makedirs(out, exist_ok=True)
    manifest = []
    for b in EBLASTS:
        doc, links = build(b, local or f"{SITE}/email")
        name = f"eblast-{b['n']}{'-local' if local else ''}.html"
        open(os.path.join(out, name), "w").write(doc)
        manifest.append(dict(n=b["n"], name=b["name"], subject=b["title"], preheader=b["pre"], camp=b["camp"], file=name,
                             chars=len(doc), em_dashes=doc.count("—"), links=sorted(set(links)), fixes=FIXES[0] + FIXES.get(b["n"], [])))
        print(f"{name}: {len(doc)} chars; em dashes: {doc.count('—')}; links: {len(set(links))}")
    json.dump(manifest, open(os.path.join(out, "manifest-local.json" if local else "manifest.json"), "w"), indent=1, ensure_ascii=False)
