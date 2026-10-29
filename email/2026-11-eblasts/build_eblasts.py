"""Build E-blasts 2 to 6 as Constant Contact custom-code HTML, on E-blast 1's system.

The words are Figma's (Marketing Material, page 176:2, frames 220:2 to 225:2), with the
house-rule fixes listed in FIXES. Photos are served from hubss.com/email/2026-11-eblast-N/;
the logo, Moose, the flag and the printed copy are E-blast 1's files.

Usage: python3 build_eblasts.py OUTDIR [--local PUBLIC_EMAIL_DIR]
  --local rewrites image addresses to local files, for rendering checks only.
"""
import html, json, os, sys

FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
SITE = "https://hubss.com"
SHARED = f"{SITE}/email/2026-11-eblast-1"
GRAD = "background-color:#F97316;background-image:linear-gradient(90deg,#F97316 0%,#EAB308 100%);"

FIXES = {
    4: ["Deck: 'crossings' is now 'crosswalks' (house rule)."],
    5: ["Products: 'DEORATIVE' is now 'Decorative'."],
    6: ["Main button pointed at the StreetBond page with E-blast 2's tags; it now goes to /applications/pedestrian-safety.",
        "Preview text named 'DuraTherm on the Spirit Trail', which is no longer in this e-blast; it now names Kitchener's veterans crosswalk.",
        "Feature headline 'A crossing to remember.' is now 'A crosswalk to remember.' (house rule); eyebrow is singular: it is one crosswalk."],
}

EBLASTS = [
 dict(n=2, name="E-blast 2 · Landscape Architects", camp="landscape-architects",
  subject="Your vision. Your design. Our materials make it work.",
  preheader="Colour, cooler surfaces and graphics for parks and plazas, with the spec for each system.",
  strap="Public spaces",
  hero=("hero-maple-ridge.jpg", 600, 380, "Coloured StreetBond surfaces on a park plaza in Maple Ridge, British Columbia"),
  eyebrow="Maple Ridge, British Columbia · StreetBond",
  h1=(["Your vision. Your design."], ["Our materials make it work."]),
  deck="StreetBond lets you transform asphalt and concrete in 63 standard colours or a custom match. Twelve StreetBondSR colours reflect sunlight rather than absorb it, so asphalt stays cooler underfoot.",
  cta=("See the StreetBond colours", "/products/streetbond", "hero-streetbond-colours"),
  feature=dict(img=("bc-childrens-labyrinth.jpg", 240, 320, "A green labyrinth on the rooftop garden deck at BC Children’s Hospital"),
    eyebrow="Healing garden", head=["A labyrinth on the hospital deck."],
    body=[("Oren Mizrahi of Connect Landscape Architecture, on the StreetBond and DecoMark at BC Children’s Hospital: ", ""),
          ("“a successful implementation and translation of our design ideas to the ground plane.”", "q")],
    link=("Read the BC Children’s project", "/blog/bc-childrens-hospital-labyrinth", "feature-bc-childrens")),
  projects=("The ground is part of the plan.", [
    ("kitchener-kings-queens.jpg", 150, "Intersection art", "Kings and Queens", "Kitchener, Ontario", "TrafficPatterns", "/product-book/107", "project-kitchener-kings-queens", "Colourful TrafficPatterns art across a downtown intersection in Kitchener, Ontario, seen from above"),
    ("toronto-geary-works.jpg", 150, "Placemaking", "The path carries the name", "Toronto, Ontario", "DecoMark", "/blog/geary-works-toronto-park-walkway", "project-geary-works", "GEARY WORKS lettering and green gears in DecoMark along a Toronto path"),
    ("bowen-island-snug-cove.jpg", 150, "Parks & paths", "A path with a sense of humour", "Bowen Island, British Columbia", "StreetBond", "/blog/bowen-island-asphalt-path", "project-bowen-island", "Coloured shapes and a seal saying “I wish this were a water slide!” on a StreetBond path at Snug Cove, Bowen Island")]),
  products=("What carries the colour.", [
    ("streetbond.jpg", 150, "Parks · Playgrounds", "StreetBond", "Moves with the pavement, so it resists cracking, wear and slipping.", ["63 colours + custom"], "streetbond", "A StreetBond sports court in orange, green and blue"),
    ("streetbondsr-canada-post-lot.jpg", 150, "Commercial · Parking", "StreetBondSR", "Solar-reflective colours that keep parking lots and plazas cooler.", ["SR 0.33 or higher", "Urban heat island"], "streetbondsr", "Canada Post trucks parked on a StreetBondSR fleet lot"),
    ("decomark.jpg", 150, "Identity · Public art", "DecoMark", "Your vector artwork, made in the factory and heat-applied on site.", ["Custom graphics", "Asphalt or concrete"], "decomark", "A circular DecoMark medallion on a concrete plaza")]),
  ll=(["Bring your palette.", "Lunch is on us."], "Case studies, spec language and samples for your office, built around colour, cooler surfaces and graphics.", "StreetBond")),

 dict(n=3, name="E-blast 3 · Commercial Properties", camp="commercial-specifiers",
  subject="Fourteen years on a retail crosswalk in Halton Hills",
  preheader="The crosswalks at Toronto Premium Outlets, and the systems for entrances, lots and townhome lanes.",
  strap="Commercial properties",
  hero=("hero-toronto-premium-outlets.jpg", 600, 375, "The TrafficPatternsXD crosswalk at the entrance to Toronto Premium Outlets in Halton Hills, Ontario"),
  eyebrow="Halton Hills, Ontario · TrafficPatternsXD",
  h1=(["Appearance matters."], ["Year after year", "of performance."]),
  deck="The TrafficPatternsXD crosswalks at Toronto Premium Outlets have carried shoppers and delivery trucks through fourteen Ontario winters.",
  cta=("Read the fourteen-year story", "/blog/toronto-premium-outlets-14-years", "hero-fourteen-year-story"),
  feature=dict(img=("new-westminster-oxford-townhomes.jpg", 240, 320, "A charcoal StreetPrint laneway between townhomes in New Westminster, British Columbia"),
    eyebrow="Townhomes", head=["A strata is judged", "at the curb."],
    body=[("Charcoal StreetPrint on the laneways of Oxford Townhomes in Queensborough, New Westminster: stamped asphalt, with no pavers to settle and no joints to weed.", "")],
    link=("See townhome projects", "/applications/townhomes", "feature-townhomes")),
  projects=("Where customers walk first.", [
    ("vancouver-granville-island.jpg", 150, "Brewery entrance", "Seven years at Granville Island", "Vancouver, British Columbia", "TrafficPatternsXD", "/product-book/130", "project-granville-island", "A red brick-pattern TrafficPatternsXD crosswalk outside a taproom on Granville Island, Vancouver"),
    ("vaughan-audi-dealership.jpg", 150, "Car dealership", "First impressions at Audi", "Vaughan, Ontario", "TrafficPatternsXD", "/product-book/109", "project-vaughan-audi", "A light grey brick-pattern entrance at an Audi dealership in Vaughan, Ontario"),
    ("oakville-fortinos.jpg", 150, "Fortinos parking lot", "Still performing 10 years later", "Oakville, Ontario", "TrafficPatternsXD", "/product-book/72", "project-oakville", "A red brick-pattern TrafficPatternsXD crosswalk in front of a Fortinos store in Oakville, Ontario")]),
  products=("Match the system to the wear.", [
    ("trafficpatternsxd.jpg", 150, "Crosswalks · Transit", "TrafficPatternsXD", "Aggregate-reinforced and stamped into the asphalt, for heavy traffic.", ["150 mil", "10+ year service life"], "traffic-patterns-xd", "A shopper crossing a brick-pattern TrafficPatternsXD crosswalk"),
    ("streetprint.jpg", 150, "Entrances · Streetscapes", "StreetPrint", "Brick and stone patterns stamped into new or existing asphalt, then coloured.", ["Custom patterns", "10–20 year service life"], "streetprint", "Red StreetPrint brick pattern under autumn leaves"),
    ("trafficpatterns.jpg", 158, "Community · Artwork", "TrafficPatterns", "Made to your design and heat-applied to asphalt or concrete.", ["125 mil", "8+ year service life"], "traffic-patterns", "Green and blue TrafficPatterns artwork on the asphalt of a town centre"),
    ("streetbond-parking.jpg", 150, "Parking · Entrances", "StreetBond", "Colour coatings for asphalt and concrete that move with the pavement.", ["63 colours", "8+ year service life"], "streetbond", "Grey StreetBond parking stalls at a building entrance")]),
  ll=(["Bring the site plan.", "Lunch is on us."], "Case studies, spec language and samples for your team, built around entrances, drive aisles and lots.", "TrafficPatternsXD")),

 dict(n=4, name="E-blast 4 · Public Works and Transit", camp="government-specifiers",
  subject="The spec sheets are ready when your tender is",
  preheader="Where to find the spec sheets, and why Vaughan chose TrafficPatternsXD for Woodbridge Avenue.",
  strap="Public works and operations",
  hero=("hero-toronto-ttc-bus-lane.jpg", 600, 375, "A TTC bus in a red MMAX transit lane in Toronto"),
  eyebrow="Toronto, Ontario · MMAX",
  h1=(["Specify with confidence."], ["Materials that work", "in Canada."]),
  deck="Surface systems for the streets, crosswalks and transit lanes your community relies on.",
  cta=("See the systems", "/products", "hero-see-the-systems"),
  feature=dict(img=("woodbridge-avenue-crosswalk.jpg", 240, 320, "A brick-pattern TrafficPatternsXD crosswalk on Woodbridge Avenue in Vaughan, with snow at the curb"),
    eyebrow="City of Vaughan", head=["The crosswalk survives the plow."],
    body=[("Woodbridge Avenue runs through a designated Heritage Conservation District. The City chose TrafficPatternsXD for every crosswalk at its intersections, because real brick pavers catch plow blades.", "")],
    link=("Read the Woodbridge project", "/blog/trafficpatternsxd-urban-design", "feature-woodbridge")),
  projects=("Chosen by Canadian cities.", [
    ("toronto-emery-village.jpg", 150, "Emery Village Gateway feature", "Replacing paving stones with TrafficPatternsXD", "Toronto, Ontario", "TrafficPatternsXD", "/blog/decorative-asphalt-high-traffic", "project-emery-village", "A truck crossing the blue TrafficPatternsXD gateway in Emery Village, Toronto"),
    ("verdun-flush-medians.jpg", 150, "Traffic control", "Medians a plow can clear", "Verdun, Québec", "TrafficPatternsXD", "/product-book/116", "project-verdun", "A grey brick-pattern TrafficPatternsXD median in Verdun, Québec"),
    ("georgina-every-child-matters.jpg", 150, "Community crosswalk", "Every Child Matters", "Georgina, Ontario", "TrafficPatterns", "/blog/every-child-matters-crosswalk", "project-georgina", "The orange Every Child Matters crosswalk in Georgina, Ontario, with white feathers")]),
  products=("What the corridors are made of.", [
    ("mmax.jpg", 150, "Bus lanes · Bike lanes", "MMAX", "Methyl methacrylate with embedded aggregate for skid resistance.", ["Traffic-ready in 45–60 min", "From +3°C"], "mmax", "A London Transit bus beside a red MMAX transit lane"),
    ("trafficpatternsxd.jpg", 150, "Crosswalks · Transit", "TrafficPatternsXD", "Aggregate-reinforced and stamped into the asphalt, for heavy traffic.", ["150 mil", "10+ year service life"], "traffic-patterns-xd", "A dark brick-pattern TrafficPatternsXD crosswalk on a residential street"),
    ("trafficpatterns-langley.jpg", 150, "Crosswalks · Parks", "TrafficPatterns", "Made to your design and heat-applied to asphalt or concrete.", ["125 mil", "8+ year service life"], "traffic-patterns", "Langley City’s Railroad Heritage crosswalk in TrafficPatterns, at the entrance to Linwood Park")]),
  ll=(["Bring your next tender.", "Lunch is on us."], "Case studies, spec language and samples for your department, built around the work you’re tendering.", "MMAX")),

 dict(n=5, name="E-blast 5 · Transportation Engineers", camp="engineers",
  subject="Crosswalks and bus lanes fail differently",
  preheader="Thickness, skid resistance, cure time and service life, system by system.",
  strap="Public transportation engineers",
  hero=("hero-london-east-link.jpg", 600, 375, "Red MMAX transit lanes and a TrafficPatternsXD crosswalk at an East London Link station in London, Ontario"),
  eyebrow="London, Ontario · MMAX and TrafficPatternsXD",
  h1=(["Multiple products."], ["Innovative solutions."]),
  deck="On the East London Link, the City used TrafficPatternsXD at the crosswalks, where buses brake and turn, along with red MMAX.",
  cta=("Read the East London Link project", "/blog/london-east-link-brt", "hero-east-london-link"),
  feature=dict(img=("richmond-brighouse-station.jpg", 240, 320, "A TrafficPatternsXD crosswalk at TransLink’s Brighouse Station in Richmond, British Columbia"),
    eyebrow="Transit station", head=["A station crosswalk that keeps its grip."],
    body=[("At TransLink’s Brighouse Station, TrafficPatternsXD crosswalks run across No. 3 Road and through the development area, with anti-skid aggregate through the full thickness.", "")],
    link=("Read the Brighouse project", "/blog/richmond-brighouse-crosswalk", "feature-brighouse")),
  projects=("Built into transit corridors.", [
    ("waterloo-ion-crosswalk.jpg", 150, "Light rail", "Crosswalks on the ION corridor", "Waterloo Region, Ontario", "TrafficPatternsXD", "/product-book/63", "project-ion-corridor", "A pedestrian with a white cane on a red TrafficPatternsXD crosswalk on the ION corridor"),
    ("york-region-highway-7.jpg", 150, "Bus rapid transit", "The Highway 7 rapidway", "York Region, Ontario", "TrafficPatternsXD", "/blog/multimodal-connectivity-york-region", "project-highway-7-rapidway", "A TrafficPatternsXD crosswalk and green bike lanes at a Highway 7 rapidway station"),
    ("kelowna-crosswalk.jpg", 150, "Downtown core", "80+ crosswalks, one system", "Kelowna, British Columbia", "TrafficPatternsXD", "/products/traffic-patterns-xd", "project-kelowna", "A red TrafficPatternsXD crosswalk between green bike crossings in Kelowna")]),
  products=("The numbers, system by system.", [
    ("trafficpatternsxd.jpg", 150, "Crosswalks · Transit", "TrafficPatternsXD", "The look of brick pavers without the maintenance in some of the busiest locations.", ["150 mil", "60 BPN, ASTM E303"], "traffic-patterns-xd", "A person walking across a TrafficPatternsXD crosswalk"),
    ("mmax.jpg", 150, "Bus lanes · Bike lanes", "MMAX", "Methyl methacrylate with embedded aggregate for skid resistance.", ["Traffic-ready in 45–60 min", "From +3°C"], "mmax", "A red MMAX bus lane marked BUS ONLY"),
    ("trafficpatterns.jpg", 150, "Decorative · Applications", "TrafficPatterns", "Made to your design and heat-applied to asphalt or concrete.", ["125 mil", "8+ year service life"], "traffic-patterns", "White Rock’s Seaside Stroll crosswalk in TrafficPatterns, in blue and sand waves")]),
  ll=(["Bring the corridor.", "Lunch is on us."], "Case studies, spec language and samples, built around the corridor you’re designing.", "TrafficPatternsXD")),

 dict(n=6, name="E-blast 6 · Pedestrian Safety", camp="pedestrian-safety",
  subject="Crosswalks that stay visible for 8+ years",
  preheader="White Rock’s Seaside Stroll, Kitchener’s veterans crosswalk, and a rail safety marking in Brantford.",
  strap="Pedestrian safety",
  hero=("hero-white-rock-seaside-stroll.jpg", 600, 375, "White Rock’s Seaside Stroll crosswalk in TrafficPatterns, in blue and sand waves"),
  eyebrow="White Rock, British Columbia · TrafficPatterns",
  h1=(["Crosswalks that stay"], ["visible for 8+ years."]),
  deck="White Rock’s Seaside Stroll crosswalk is made using TrafficPatterns, heat-applied so it bonds to the asphalt. Its aggregate runs through the full thickness, so the grip lasts as long as the colour.",
  cta=("Pedestrian safety systems", "/applications/pedestrian-safety", "hero-pedestrian-safety"),
  feature=dict(img=("kitchener-veterans-crosswalk.jpg", 240, 245, "Veterans and a Canadian flag at Kitchener’s veterans crosswalk, which reads Lest We Forget"),
    eyebrow="Veterans memorial crosswalk", head=["A crosswalk to", "remember."],
    body=[("TrafficPatterns brings remembrance to the street with a memorial crosswalk honouring veterans. Maple leaves and commemorative imagery create a tribute with every step.", "")],
    link=("Explore the memorial crosswalk", "/blog/veterans-crosswalk-kitchener", "feature-kitchener-veterans")),
  projects=("Markings people notice.", [
    ("brantford-look-listen-live.jpg", 150, "Rail safety", "Look Listen Live at a rail crossing", "Brantford, Ontario", "DecoMark", "/blog/look-listen-live-rail-safety-marking-brantford", "project-brantford", "A yellow Look Listen Live DecoMark marking on a sidewalk beside a rail crossing in Brantford, Ontario"),
    ("vancouver-little-italy.jpg", 150, "Main street", "Little Italy, in the crosswalk", "Vancouver, British Columbia", "TrafficPatterns · DecoMark", "/blog/community-spaces", "project-little-italy", "The Little Italy DecoMark medallion and a TrafficPatterns crosswalk on Commercial Drive, Vancouver"),
    ("sechelt-pictograph-crosswalk.jpg", 150, "Community crosswalk", "The shíshálh origin story", "Sechelt, British Columbia", "TrafficPatterns", "/blog/pictograph-crosswalk-sechelt", "project-sechelt", "A crosswalk with orange pictograph figures in Sechelt, British Columbia")]),
  products=("Made to stay visible.", [
    ("trafficpatterns.jpg", 150, "Crosswalks · Parks", "TrafficPatterns", "Made to your design and heat-applied to asphalt or concrete.", ["125 mil", "8+ year service life"], "traffic-patterns", "Multicoloured TrafficPatterns borders around a neighbourhood intersection"),
    ("duratherm.jpg", 150, "Crosswalks · Calming", "DuraTherm", "Inlaid flush with the road, with nothing for a plow blade to catch.", ["90 mil", "Snowplow-safe"], "duratherm", "A blue DuraTherm hexagon pattern at a school entrance"),
    ("decomark.jpg", 150, "Identity · Public art", "DecoMark", "Your vector artwork, made in the factory and heat-applied on site.", ["Custom graphics", "Asphalt or concrete"], "decomark", "A red and orange DecoMark medallion on a concrete plaza")]),
  ll=(["Bring your toughest crosswalk.", "Lunch is on us."], "Case studies, spec language and samples, built around your crosswalks, near a rail line, a school or a campus.", "PreMark")),
]

e = html.escape  # text and attribute escaping (quote=True)


def build(b, img_base):
    n, camp = b["n"], b["camp"]
    folder = f"{img_base}/2026-11-eblast-{n}"
    shared = SHARED if img_base.startswith("http") else f"{img_base}/2026-11-eblast-1"
    links = []

    def u(path, content, query="", frag=""):
        q = (query + "&" if query else "") + f"utm_source=eblast&utm_medium=email&utm_campaign={camp}&utm_content={content}"
        url = f"{SITE}{path}?{q}" + (f"#{frag}" if frag else "")
        links.append(url)
        return url

    def p(text, size, lh, color, weight=None, mt=0, upper=False, ls=None, extra=""):
        st = f"margin:{mt}px 0 0;font-family:{FONT};font-size:{size}px;line-height:{lh}px;"
        if weight: st += f"font-weight:{weight};"
        if ls is not None: st += f"letter-spacing:{ls}px;"
        if upper: st += "text-transform:uppercase;"
        st += f"color:{color};{extra}"
        return f'<p style="{st}">{text}</p>'

    def eyebrow(text, color="#EA580C", mt=0):
        return p(e(text), 12, 16, color, 700, mt, upper=True, ls=3)

    def h2(text, size=30, lh=34, color="#1B1A18", mt=10, ls=-0.5):
        return (f'<h2 style="margin:{mt}px 0 0;font-family:{FONT};font-size:{size}px;line-height:{lh}px;'
                f'font-weight:800;letter-spacing:{ls}px;color:{color};">{text}</h2>')

    def img(src, w, h, alt, href, style_extra="", cls=None, display_w=None):
        dw = display_w or w
        return (f'<a href="{href}" style="color: inherit;"><img src="{src}" width="{dw}" height="{round(h * dw / w)}" alt="{e(alt)}" '
                f'style="-ms-interpolation-mode: bicubic; display: block; {style_extra} border: 0;"></a>')

    def arrow_link(text, href):
        return (f'<a href="{href}" style="font-family: {FONT}; font-size: 15px; line-height: 22px; font-weight: 700; '
                f'color: #EA580C; text-decoration: none;">{e(text)}&nbsp;&nbsp;→</a>')

    def caption(left, right, upper):
        return p(f'{e(left)} <span style="color:#F97316;">&nbsp;|&nbsp;</span> {e(right)}' if right else e(left),
                 12, 17, "#57534E", 600, 8, upper=upper)

    def rows(items, kind):
        out = []
        for i, r in enumerate(items):
            if kind == "project":
                f, h, eb, title, place, system, path, content, alt = r
                href = u(path, content)
                body = (eyebrow(eb) + p(f'<a href="{href}" style="color: #1B1A18; text-decoration: none;">{e(title)}</a>', 19, 24, "#1B1A18", 700, 8)
                        + caption(place, system, upper=False))
            else:
                f, h, eb, title, line, cap, slug, alt = r
                href = u(f"/products/{slug}", f"product-{slug}")
                body = (eyebrow(eb) + p(f'<a href="{href}" style="color: #1B1A18; text-decoration: none;">{e(title)}</a>', 19, 24, "#1B1A18", 700, 8)
                        + p(e(line), 15, 23, "#44403C", None, 8)
                        + caption(cap[0], cap[1] if len(cap) > 1 else None, upper=True))
            if i:
                out.append('<tr><td style="height:1px;line-height:1px;font-size:0;background:#E4E1DA;">&nbsp;</td></tr>')
            out.append(
                '<tr><td style="padding:18px 0;">\n<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>\n'
                f'<td class="stack" width="200" valign="middle" style="width:200px;">{img(f"{folder}/{f}", 200, h, alt, href, "width: 200px; height: auto; border-radius: 4px;")}</td>\n'
                '<td class="gap" width="20" style="width:20px;font-size:0;">&nbsp;</td>\n'
                f'<td class="stack" valign="middle">{body}</td>\n</tr></tbody></table></td></tr>')
        return "".join(out)

    def split(image_html, text_html):
        return ('<tr><td class="pad" style="background:#F3F1EB;padding:40px;">\n'
                '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>\n'
                f'<td class="col" width="240" valign="middle" style="width:240px;">{image_html}</td>\n'
                '<td class="gap" width="24" style="width:24px;font-size:0;">&nbsp;</td>\n'
                f'<td class="col" valign="middle">{text_html}</td>\n</tr></tbody></table></td></tr>\n\n')

    cta_text, cta_path, cta_content = b["cta"]
    cta_href = u(cta_path, cta_content)
    hf, hw, hh, halt = b["hero"]
    l1, l2 = b["h1"]
    eb_plate = p(e(b["eyebrow"]), 12, 16, "#FDBA74", 700, 0, ls=0.2)
    h1 = (f'<h1 class="hl" style="margin:16px 0 0;font-family:{FONT};font-size:38px;line-height:42px;font-weight:800;letter-spacing:-0.8px;color:#ffffff;">'
          + "<br>".join(e(x) for x in l1) + '<br><span style="color:#F97316;">' + "<br>".join(e(x) for x in l2) + "</span></h1>")

    fe = b["feature"]
    ff, fw, fh, falt = fe["img"]
    ftext, fpath, fcontent = fe["link"]
    fhref = u(fpath, fcontent)
    fbody = "".join(f'<span style="font-style:italic;font-weight:500;">{e(t)}</span>' if k == "q" else e(t) for t, k in fe["body"])
    feature = split(
        img(f"{folder}/{ff}", fw, fh, falt, fhref, "width: 240px; max-width: 100%; height: auto; border-radius: 6px;"),
        eyebrow(fe["eyebrow"]) + h2("<br>".join(e(x) for x in fe["head"]), 26, 30)
        + p(fbody, 16, 25, "#44403C", None, 14) + f'<p style="margin:18px 0 0;">{arrow_link(ftext, fhref)}</p>')

    printed_href = u("/request-product-book", "printed-request")
    printed = split(
        img(f"{shared}/printed-copy.jpg", 240, 320, "The printed HUB Product Portfolio Book, Volume 5",
            u("/request-product-book", "printed-image"), "width: 240px; max-width: 100%; height: auto; border-radius: 6px;"),
        eyebrow("Printed edition") + h2("Keep Volume 5<br>on your shelf.", 26, 30)
        + p("We’ll mail the printed edition to any Canadian address, with every system, every application, and everything else you need to know about these innovative technologies.", 16, 25, "#44403C", None, 14)
        + f'<p style="margin:18px 0 0;">{arrow_link("Request a printed copy", printed_href)}</p>')

    ll_head, ll_body, ll_topic = b["ll"]
    chip = ('<span style="display:inline-block;margin:0 6px 8px 0;border:1px solid #3A3A3A;border-radius:6px;padding:7px 11px;'
            f'font-family:{FONT};font-size:12px;line-height:16px;font-weight:600;letter-spacing:1px;text-transform:uppercase;'
            'color:#A8A29E;white-space:nowrap;"><span style="color:#F97316;font-weight:700;">{a}</span>&nbsp; {b}</span>')
    chips = "".join(chip.format(a=a, b=c) for a, c in [("60 min", "Focused"), ("$0", "To attend"), ("10", "Provinces served")])
    ll_href = u("/lunch-learn", "lunch-learn", query=f"topic={ll_topic}", frag="book")

    pr_eyebrow, pr_rows = b["products"]
    pj_head, pj_rows = b["projects"]

    body = f"""
<tr><td class="pad" style="background:#101010;padding:22px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
<td>{img(f"{shared}/hub-logo-white.png", 150, 37, "HUB Surface Systems", u("/", "logo"))}</td>
<td class="strap" align="right" style="font-family:{FONT};font-size:12px;line-height:16px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#9CA3AF;">{e(b["strap"])}</td>
</tr></tbody></table></td></tr>

<tr><td style="background:#E7E3DC;">{img(f"{folder}/{hf}", hw, hh, halt, u(cta_path, "hero-image"), "width: 100%; max-width: 600px; height: auto;")}</td></tr>
<tr><td style="height:5px;line-height:5px;font-size:0;{GRAD}">&nbsp;</td></tr>

<tr><td class="pad" style="background:#151515;padding:44px 40px 46px;">
{eb_plate}
{h1}
{p(e(b["deck"]), 17, 27, "#C9C9C9", None, 18)}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;"><tbody><tr>
<td class="btn1"><a href="{cta_href}" style="display: inline-block; {GRAD} color: #ffffff; font-family: {FONT}; font-size: 17px; line-height: 22px; font-weight: 600; text-decoration: none; padding: 11px 18px; border-radius: 6px; mso-padding-alt: 0;">{e(cta_text)}&nbsp;&nbsp;→</a></td>
<td class="btn2" style="padding-left:12px;"><a href="{u("/product-book", "hero-view-portfolio")}" style="display: inline-block; border: 1px solid #6B6B6B; color: #ffffff; font-family: {FONT}; font-size: 15px; line-height: 22px; font-weight: 600; text-decoration: none; padding: 10px 18px; border-radius: 6px;">View product portfolio</a></td>
</tr></tbody></table>
</td></tr>

{feature}<tr><td class="pad" style="padding:52px 40px 4px;">{eyebrow("Projects")}{h2(e(pj_head))}</td></tr>
<tr><td class="pad" style="padding:14px 40px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody>{rows(pj_rows, "project")}</tbody></table></td></tr>
<tr><td style="height:1px;line-height:1px;font-size:0;background:#E4E1DA;">&nbsp;</td></tr>

<tr><td class="pad" style="padding:52px 40px 4px;">{eyebrow("Products")}{h2(e(pr_eyebrow))}</td></tr>
<tr><td class="pad" style="padding:14px 40px 48px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody>{rows(pr_rows, "product")}
<tr><td style="padding:26px 0 0;">{arrow_link("Specs and colours for every system", u("/products", "specs-every-system"))}</td></tr></tbody></table></td></tr>

{printed}<tr><td class="pad" style="background:#151515;padding:32px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#222222;border-radius:14px;">
<tbody><tr><td style="border-radius:14px 14px 0 0;height:4px;line-height:4px;font-size:0;{GRAD}">&nbsp;</td></tr>
<tr><td style="padding:30px 30px 34px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
<td width="74" valign="middle"><img src="{shared}/moose.png" width="74" height="74" alt="Moose, HUB's dog, in a hard hat" style="-ms-interpolation-mode: bicubic; display: block; border: 0;"></td>
<td style="padding-left:14px;" valign="middle">{eyebrow("Lunch & Learn", "#FDBA74")}{p("Hosted by the HUB team (and Moose, our gentle giant)", 15, 21, "#C9C9C9", 600, 6)}</td>
</tr></tbody></table>
{h2("<br>".join(e(x) for x in ll_head), 32, 36, "#ffffff", 26, -0.6)}
{p(e(ll_body), 16, 26, "#9CA3AF", None, 16)}
<p style="margin:20px 0 0;font-size:0;line-height:0;">{chips}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;"><tbody><tr><td><a href="{ll_href}" style="display: inline-block; {GRAD} color: #ffffff; font-family: {FONT}; font-size: 17px; line-height: 22px; font-weight: 600; text-decoration: none; padding: 11px 18px; border-radius: 6px; mso-padding-alt: 0;">Book a Lunch &amp; Learn&nbsp;&nbsp;→</a></td></tr></tbody></table>
</td></tr></tbody></table></td></tr>

<tr><td class="pad" style="padding:52px 40px 48px;">{eyebrow("27 years · 1,000+ projects")}{h2("Speak with HUB.")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tbody><tr>
<td class="col" width="50%" valign="top">{eyebrow("Western Canada")}{p("Cleve Stordy", 20, 26, "#1B1A18", 800, 8)}
{p('<a href="mailto:cleve.stordy@hubss.com" style="color: #1B1A18;">cleve.stordy@hubss.com</a><br><a href="tel:+16043098212" style="color: #44403C; text-decoration: none;">604-309-8212</a>', 16, 25, "#44403C", None, 8)}</td>
<td class="col" width="50%" valign="top">{eyebrow("Eastern Canada")}{p("Doug Bain", 20, 26, "#1B1A18", 800, 8)}
{p('<a href="mailto:doug.bain@hubss.com" style="color: #1B1A18;">doug.bain@hubss.com</a><br><a href="tel:+14165409287" style="color: #44403C; text-decoration: none;">416-540-9287</a>', 16, 25, "#44403C", None, 8)}</td>
</tr></tbody></table></td></tr>
<tr><td style="height:5px;line-height:5px;font-size:0;{GRAD}">&nbsp;</td></tr>

<tr><td class="pad" style="background:#101010;padding:38px 40px 40px;">
{img(f"{shared}/hub-logo-white.png", 150, 37, "HUB Surface Systems", u("/", "footer-logo"), display_w=120)}
<p style="margin:18px 0 0;font-family:{FONT};font-size:15px;line-height:23px;font-weight:600;color:#ffffff;">Pedestrian safety, traffic calming, civic identity.<br><span style="color:#F97316;">Coast to coast since 1999.</span></p>
<p style="margin:20px 0 0;font-family:{FONT};font-size:11px;line-height:20px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#ffffff;">
<a href="{u("/products", "footer-products")}" style="color: #ffffff; text-decoration: none;">Products</a> &nbsp;/&nbsp; <a href="{u("/applications", "footer-applications")}" style="color: #ffffff; text-decoration: none;">Applications</a> &nbsp;/&nbsp; <a href="{u("/product-book", "footer-book")}" style="color: #ffffff; text-decoration: none;">Product Portfolio Book</a><br>
<a href="{u("/lunch-learn", "footer-lunch-learn")}" style="color: #ffffff; text-decoration: none;">Lunch &amp; Learn</a> &nbsp;/&nbsp; <a href="{u("/contact", "footer-contact")}" style="color: #ffffff; text-decoration: none;">Contact</a></p>
<p style="margin:16px 0 0;font-family:{FONT};font-size:13px;line-height:20px;color:#9CA3AF;"><a href="https://www.linkedin.com/company/hub-surface-systems" style="color: #9CA3AF;">LinkedIn</a> &nbsp;·&nbsp; <a href="https://www.instagram.com/hub_surface_systems/" style="color: #9CA3AF;">Instagram</a> &nbsp;·&nbsp; <a href="https://www.facebook.com/hubsurfacesystems" style="color: #9CA3AF;">Facebook</a></p>
<p style="margin:18px 0 0;font-family:{FONT};font-size:12px;line-height:16px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#8E8A83;">Canadian owned and operated &nbsp;<img src="{shared}/flag-canada.png" width="19" height="13" alt="" style="-ms-interpolation-mode: bicubic; display: inline-block; vertical-align: -1px; border: 0;"></p>
</td></tr>
"""
    doc = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting">
<title>{e(b["subject"])}</title>
<style>
@media only screen and (max-width:620px) {{
  .wrap {{ width: 100%!important; }}
  .pad {{ padding-left: 24px!important; padding-right: 24px!important; }}
  .stack {{ display: block!important; width: 100%!important; }}
  .stack img {{ width: 100%!important; }}
  .gap {{ display: block!important; height: 14px!important; width: 100%!important; }}
  .hl {{ font-size: 30px!important; line-height: 35px!important; }}
  .col {{ display: block!important; width: 100%!important; padding: 0 0 22px 0!important; }}
  .btn1, .btn2 {{ display: block!important; }}
  .strap {{ letter-spacing: 1px!important; font-size: 11px!important; }}
  .btn2 {{ padding: 12px 0 0 0!important; }}
}}
</style></head>
<body style="margin: 0; padding: 0; background: #E9E7E2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">{e(b["preheader"])} &#xFEFF;&#x34F; &#xFEFF;&#x34F; &#xFEFF;&#x34F; &#xFEFF;&#x34F;</div>
[[trackingImage]]
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E9E7E2;"><tbody><tr><td align="center" style="padding:0;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#FAF9F6;">
<tbody>{body}</tbody></table>
</td></tr></tbody></table>
</body></html>
"""
    return doc, links


if __name__ == "__main__":
    out = sys.argv[1]
    local = sys.argv[sys.argv.index("--local") + 1] if "--local" in sys.argv else None
    os.makedirs(out, exist_ok=True)
    manifest = []
    for b in EBLASTS:
        doc, links = build(b, local or f"{SITE}/email")
        name = f"eblast-{b['n']}{'-local' if local else ''}.html"
        with open(os.path.join(out, name), "w") as f:
            f.write(doc)
        manifest.append(dict(n=b["n"], name=b["name"], subject=b["subject"], preheader=b["preheader"], camp=b["camp"],
                             file=name, bytes=len(doc.encode()), links=sorted(set(links)), fixes=FIXES.get(b["n"], [])))
    with open(os.path.join(out, "manifest-local.json" if local else "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1, ensure_ascii=False)
    for m in manifest:
        print(m["file"], m["bytes"], "bytes,", len(m["links"]), "links")
