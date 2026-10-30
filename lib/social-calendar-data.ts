/**
 * Social posts written ahead, one per published article, for Buffer to send
 * at a set time (lib/social-calendar.ts schedules them; Vern, 30 Oct 2026:
 * "schedule a couple months posts in advance, we will continue to improve the
 * social media post quality over time").
 *
 * Every line is the article's own: the copy says nothing its article doesn't,
 * follows lib/social-drafter.ts's rules (VOICE, MACHINE TELLS, CHANNELS) and
 * docs/GLOSSARY.md, and `npm run test:social` lints it. `{link}` is replaced
 * with the article's address, tagged for the network (utm_campaign=archive);
 * Instagram has no link ("Link in bio").
 *
 * The articles were picked from the 26 Oct copy review's "improve" and
 * "fine" lists (docs/site-audits/copy-review-2026-10-26.md), never a rewrite
 * candidate, and none repeats a claim flagged there for Doug. A photo is the
 * article's cover, or the same job's photo from the map's record
 * (lib/map-projects.ts) where the cover is small or carries a private detail.
 *
 * Times: Mondays and Fridays at 11:00 Toronto, so Buffer's queue slots
 * (Tuesdays and Thursdays, 11:00 Toronto) stay free for new articles.
 * An entry whose time has passed before it was scheduled is skipped, never
 * sent late. To add a month: append entries with later times; the daily run
 * schedules each one once (its socialLog-<key> record says it's done).
 */

export interface CalendarEntry {
  /** The article's slug: the log key, so the library never repeats the job. */
  key: string;
  /** When Buffer sends it (ISO, UTC). */
  dueAt: string;
  title: string;
  /** The page the posts link to, without UTM tags. */
  pageUrl: string;
  image: string;
  imageAlt: string;
  /** The photo's focal point, when the crop should centre on it. */
  imageHotspot?: { x: number; y: number };
  copy: { linkedin: string; facebook: string; instagram: string };
}

const CDN = "https://cdn.sanity.io/images/9dbro2m1/production";
const SITE = "https://hubss.com";
const ASK = "book a 60-minute Lunch & Learn for your team (samples, specs and lunch included)";

export const CALENDAR: CalendarEntry[] = [
  {
    key: "geary-works-toronto-park-walkway",
    dueAt: "2026-11-06T16:00:00Z",
    title: "Geary Works, where the pavement does the placemaking",
    pageUrl: `${SITE}/blog/geary-works-toronto-park-walkway`,
    image: `${CDN}/06cd4e8b7cfd065a0f3248fe06e3b0c3f9ae87f8-2400x1800.jpg`,
    imageAlt: "The words Geary Works and green gear shapes in DecoMark on an asphalt park path in Toronto",
    imageHotspot: { x: 0.367, y: 0.454 },
    copy: {
      linkedin: `At Geary Works in Toronto, Ontario, the placemaking budget went into the ground.

There is no plinth and no interpretive panel. The walkway's name and its gear motif read straight off the path. It's DecoMark preformed thermoplastic, cut to the vector artwork and heat-applied so it bonds to the asphalt.

For a parks department, the useful part comes later. The surface is maintained as pavement rather than replaced, on the same maintenance cycle the path was already on, with no separate asset or budget line to plan for. That is often what decides whether a placemaking idea survives the capital review.

Read the project, and ${ASK}: {link}

#placemaking #parks #urbandesign`,
      facebook: `At Geary Works in Toronto, Ontario, the walkway carries its identity in the surface. The name and gear motif are DecoMark preformed thermoplastic, cut to the artwork and heat-applied so it bonds to the asphalt, and the path is maintained as pavement. Read the project and book a 60-minute Lunch & Learn for your team: {link} #placemaking #Toronto`,
      instagram: `At Geary Works in Toronto, Ontario, the walkway carries its identity in the surface itself.

The name and its gear motif read straight off the path, with no plinth and no interpretive panel. It's DecoMark preformed thermoplastic, cut to the vector artwork and heat-applied so it bonds to the asphalt, and it holds grip in wet weather.

The surface is maintained as pavement rather than replaced, on the same cycle the path was already on.

Link in bio for the project, and to book a 60-minute Lunch & Learn for your team.

#decomark #placemaking #parks #urbandesign #landscapearchitecture #toronto #ontario #publicspace #pavement #canada`,
    },
  },
  {
    key: "veterans-crosswalk-kitchener",
    dueAt: "2026-11-09T16:00:00Z",
    title: "Kitchener's veterans crosswalk in TrafficPatterns",
    pageUrl: `${SITE}/blog/veterans-crosswalk-kitchener`,
    image: `${CDN}/a256098ee9641fa08337f019db181b5d9c391cc9-2400x1800.jpg`,
    imageAlt: "Kitchener's veterans crosswalk in red and white TrafficPatterns, with a maple leaf, a soldier's silhouette and the words Lest We Forget, during a ceremony",
    copy: {
      linkedin: `The Veterans Crosswalk in Kitchener, Ontario, puts a Remembrance Day tribute on an everyday route.

It's TrafficPatterns preformed thermoplastic, heat-applied so it bonds to the asphalt, with crisp edges and true colour. The City of Kitchener needed it ready for the ceremony without long closures, and needed a surface that holds up through winter. Preformed panels made a precise layout possible, installed off-peak.

A crosswalk like this can carry meaning for years, through every snowplow pass and every Remembrance Day service.

See the project, and book a 60-minute Lunch & Learn for your team: {link}

#Kitchener #communitybranding #crosswalks`,
      facebook: `The Veterans Crosswalk in Kitchener, Ontario, puts a Remembrance Day tribute on an everyday route. It's TrafficPatterns preformed thermoplastic, heat-applied so it bonds to the asphalt and holds up through winter, with crisp edges and true colour. See the project and book a 60-minute Lunch & Learn for your team: {link} #Kitchener #crosswalks`,
      instagram: `The Veterans Crosswalk in Kitchener, Ontario, puts a Remembrance Day tribute on an everyday route.

It's TrafficPatterns preformed thermoplastic, heat-applied so it bonds to the asphalt, with crisp edges and true colour. The City needed it ready for the ceremony without long closures, and a surface that holds up through winter.

A crosswalk like this can carry meaning for years, through every snowplow pass and every Remembrance Day service.

Link in bio to see the project and to book a 60-minute Lunch & Learn for your team.

#kitchener #ontario #crosswalks #communitybranding #trafficpatterns #publicspace #urbandesign #canada`,
    },
  },
  {
    key: "how-stamped-asphalt-is-installed",
    dueAt: "2026-11-13T16:00:00Z",
    title: "How stamped asphalt is installed in three steps",
    pageUrl: `${SITE}/blog/how-stamped-asphalt-is-installed`,
    // Not the article's cover: that photo is a private driveway (CLAUDE.md, "The gate photo").
    image: `${CDN}/cce74ceb9fe8b2ffbc6a127275eb666599525db1-2400x1800.jpg`,
    imageAlt: "Light grey StreetPrint stamped asphalt on a parking lane of Dundas Street in Woodstock, Ontario, with City Hall across the street",
    copy: {
      linkedin: `StreetPrint stamped asphalt goes into the pavement that's already there. The installation has three steps.

Reheat: infrared reheaters bring the existing asphalt back to a workable temperature, so there's no removal or repaving.
Stamp: templates press the pattern into the warm surface, and a plate compactor sets it flush.
Coat: StreetBond pavement coating adds the colour and locks the pattern in.

The pattern is an impression in the asphalt rather than a layer on top, so nothing stands proud of the road for a plow blade to catch. Installed on sound pavement, StreetPrint has a service life of 10 to 20 years.

Read the guide, and ${ASK}: {link}

#stampedasphalt #streetscape #landscapearchitecture`,
      facebook: `StreetPrint stamped asphalt works with the pavement that's already there. The asphalt is reheated, the pattern is stamped in and set flush, and StreetBond coating adds the colour. Read the three steps, and book a 60-minute Lunch & Learn for your team: {link} #stampedasphalt #StreetPrint`,
      instagram: `StreetPrint stamped asphalt goes into the pavement that's already there.

First, infrared reheaters bring the existing asphalt back to a workable temperature. Then templates press the pattern in, and a plate compactor sets it flush. Last, StreetBond pavement coating adds the colour and locks the pattern in.

The finished surface is level with the road, so there's nothing for a plow blade to catch. Installed on sound pavement, StreetPrint has a service life of 10 to 20 years.

Link in bio for the guide, and to book a 60-minute Lunch & Learn for your team.

#streetprint #stampedasphalt #streetscape #landscapearchitecture #urbandesign #publicspace #asphalt #municipal #pavement #canada`,
    },
  },
  {
    key: "trafficpatternsxd-urban-design",
    dueAt: "2026-11-16T16:00:00Z",
    title: "Heritage crosswalks in Woodbridge with TrafficPatternsXD",
    pageUrl: `${SITE}/blog/trafficpatternsxd-urban-design`,
    image: `${CDN}/5f2e91e7833e468e0d8720bda9e3a67bcc30f11e-1200x750.jpg`,
    imageAlt: "A red brick-pattern TrafficPatternsXD crosswalk with light grey bands at an intersection in Woodbridge, Ontario",
    copy: {
      linkedin: `Woodbridge Avenue in Vaughan, Ontario, runs through a designated Heritage Conservation District, and snowplows work its streets from November to April.

When the City of Vaughan improved the streetscape, real brick at the intersections was the obvious look and a maintenance problem: brick pavers leave raised edges for a plow blade to catch. The City chose TrafficPatternsXD for all pedestrian crosswalks at the intersections. It's aggregate-reinforced preformed thermoplastic, 150 mil, heated on the asphalt and stamped into it in brick and cobblestone patterns, with no raised edges or grout joints. The brick look comes from texture and colour.

Read the case study, and ${ASK}: {link}

#heritage #streetscape #crosswalks`,
      facebook: `Woodbridge Avenue in Vaughan, Ontario, runs through a designated Heritage Conservation District. For its intersections, the City chose TrafficPatternsXD crosswalks: the look of brick and cobblestone, stamped into the asphalt, with no raised edges for a snowplow to catch. Read the case study and book a 60-minute Lunch & Learn for your team: {link} #Vaughan #heritage`,
      instagram: `Woodbridge Avenue in Vaughan, Ontario, runs through a designated Heritage Conservation District, and it's plowed from November to April.

Brick pavers at intersections leave raised edges a plow blade can catch. So the City of Vaughan chose TrafficPatternsXD for the pedestrian crosswalks at its intersections: aggregate-reinforced preformed thermoplastic in brick and cobblestone patterns, stamped into the asphalt. There are no raised edges or grout joints. The brick look comes from texture and colour.

Link in bio for the case study, and to book a 60-minute Lunch & Learn for your team.

#trafficpatternsxd #heritage #vaughan #woodbridge #ontario #crosswalks #streetscape #urbandesign #landscapearchitecture #canada`,
    },
  },
  {
    key: "snowplow-safe-decorative-pavement",
    dueAt: "2026-11-20T16:00:00Z",
    title: "The plow came through. The pattern stayed.",
    pageUrl: `${SITE}/blog/snowplow-safe-decorative-pavement`,
    image: `${CDN}/a06cb995d5ca80d38e15c68e8695e4a03e526f0c-1800x2400.jpg`,
    imageAlt: "A red brick-pattern surface beside a road after a snowfall",
    copy: {
      linkedin: `Every decorative pavement product looks good in July. A Canadian municipality needs to know what it looks like in April.

Most of the decorative surface failures we get called about are profile failures: something stood proud of the road, and a plow blade found it. If the surface is on a plow route, our guide comes down to a short checklist.

Is it flush with the road?
Is the material bonded to the asphalt, or attached to it?
Is the anti-skid aggregate mixed through the material, or only on top of it?

Read the guide, and ${ASK}: {link}

#wintermaintenance #municipal #streetscape`,
      facebook: `Every decorative pavement product looks good in July. On a plow route, the surface that lasts sits flush with the road and is bonded to the asphalt, with the anti-skid aggregate mixed right through it. Read why, and book a 60-minute Lunch & Learn for your team: {link} #winter #pavement`,
      instagram: `What a decorative surface looks like in April is the real test in Canada.

A plow blade finds anything that stands proud of the road, so the surfaces that last a winter sit flush with it. In TrafficPatterns and TrafficPatternsXD preformed thermoplastic, the anti-skid aggregate runs through the full thickness, so the grip lasts as long as the colour.

StreetPrint stamps the pattern into the asphalt. DuraTherm sets thermoplastic into a stamped impression, flush with the road.

Link in bio for the guide, and to book a 60-minute Lunch & Learn for your team.

#snowplow #winter #canadianwinter #streetprint #duratherm #pavement #crosswalks #municipal #urbandesign #canada`,
    },
  },
  {
    key: "london-east-link-brt",
    dueAt: "2026-11-23T16:00:00Z",
    title: "Two products on the East London Link BRT corridor",
    pageUrl: `${SITE}/blog/london-east-link-brt`,
    image: `${CDN}/217e5873e43b99d6b4689bdf8ddc53c0da4c7d8b-2400x1800.jpg`,
    imageAlt: "Red MMAX bus lanes and a crosswalk at an East London Link transit station in London, Ontario",
    copy: {
      linkedin: `A bus rapid transit (BRT) corridor asks a road surface to do two different jobs in the same few hundred metres. On the East London Link in London, Ontario, the City used two materials.

At the crosswalks: TrafficPatternsXD, aggregate-reinforced preformed thermoplastic at 150 mil, stamped into the asphalt, with the aggregate through the full cross-section so the skid resistance doesn't wear off with the top layer.

In the bus lanes: red MMAX, a methyl methacrylate (MMA) lane treatment that cures traffic-ready in 45 to 60 minutes, so the lane is carrying buses again the same shift.

Read the project, and ${ASK}: {link}

#BRT #transit #buslanes`,
      facebook: `On the East London Link bus rapid transit (BRT) corridor in London, Ontario, each material does its own job. TrafficPatternsXD is at the crosswalks, and red MMAX is in the bus lanes, curing traffic-ready in 45 to 60 minutes. Read the project and book a 60-minute Lunch & Learn for your team: {link} #LdnOnt #transit`,
      instagram: `The East London Link in London, Ontario, uses two materials in one bus rapid transit corridor.

The crosswalks are TrafficPatternsXD, aggregate-reinforced preformed thermoplastic stamped into the asphalt, built for the wear that concentrates where buses brake and turn.

The bus lanes are red MMAX, a methyl methacrylate lane treatment that cures traffic-ready in 45 to 60 minutes, so the corridor isn't closed for days.

Link in bio for the project, and to book a 60-minute Lunch & Learn for your team.

#ldnont #londonontario #ontario #brt #buslanes #transit #mmax #trafficpatternsxd #crosswalks #canada`,
    },
  },
  {
    key: "toronto-premium-outlets-14-years",
    dueAt: "2026-11-27T16:00:00Z",
    title: "Fourteen Years at Toronto Premium Outlets",
    pageUrl: `${SITE}/blog/toronto-premium-outlets-14-years`,
    // The map's photo of the 14-year-old entrance crossing (Product Book p.86).
    image: `${CDN}/9758e5594656e1b185ef5c1bb15c0bef25a3eebb-1600x1200.jpg`,
    imageAlt: "A red brick-pattern TrafficPatternsXD crosswalk at the entrance to Toronto Premium Outlets in Halton Hills, Ontario",
    copy: {
      linkedin: `The crosswalks at Toronto Premium Outlets in Halton Hills, Ontario, have been in service for fourteen years.

They're TrafficPatternsXD, aggregate-reinforced preformed thermoplastic stamped into the asphalt, in a pattern that reads as laid masonry. In a retail lot, that look does real work: a driver registers the pedestrian route as different ground. The aggregate runs through the full cross-section, so the surface hasn't gone slick where the wheel paths cross it.

Fourteen years is the record of one installation, still in service, that anyone can go and stand on.

Read the project, and ${ASK}: {link}

#retail #propertymanagement #parkinglots`,
      facebook: `Fourteen years in a busy retail lot, and the TrafficPatternsXD crosswalks at Toronto Premium Outlets in Halton Hills are still carrying shoppers and delivery trucks through Ontario winters. See the project and book a 60-minute Lunch & Learn for your team: {link} #HaltonHills #retail`,
      instagram: `Fourteen years at Toronto Premium Outlets in Halton Hills, Ontario.

The crosswalks are TrafficPatternsXD, aggregate-reinforced preformed thermoplastic stamped into the asphalt in a pattern that reads as laid masonry. Drivers see the pedestrian route as different ground.

The aggregate runs through the full thickness, so the surface hasn't gone slick where the wheel paths cross it.

Link in bio to see the project, and to book a 60-minute Lunch & Learn for your team.

#trafficpatternsxd #haltonhills #ontario #retail #parkinglot #crosswalks #propertymanagement #commercialrealestate #pavement #canada`,
    },
  },
  {
    key: "thermoplastic-colour-selection",
    dueAt: "2026-11-30T16:00:00Z",
    title: "Choosing colour from the thermoplastic, coating and MMA palettes",
    pageUrl: `${SITE}/blog/thermoplastic-colour-selection`,
    image: `${CDN}/160c5daf2482b37a41234bde5efb39732cdfabd4-2400x1800.jpg`,
    imageAlt: "Pavement artwork of green roots and a blue water drop across a street-corner plaza",
    copy: {
      linkedin: `Colour is usually the first decision a project makes about a decorative surface. It's worth making it second.

The palette you can draw from depends on the material, and the material is chosen by the job it has to do. Preformed thermoplastic, StreetBond pavement coating and MMAX each have their own palette.

Two things worth knowing before you specify. Screen colour is not colour, so where a precise match matters, specify from a physical sample. And dark colours get hot: on a splash pad or a playground, the solar reflectance value on the StreetBond colour card is the deciding number.

Read the guide, and ${ASK}: {link}

#landscapearchitecture #colour #specification`,
      facebook: `Colour for a crosswalk or a splash pad starts with the material, since each system has its own palette. Ask for a physical sample too, because screen colour is not colour. Read the guide and book a 60-minute Lunch & Learn for your team: {link} #colour #landscapearchitecture`,
      instagram: `Screen colour is not colour.

Monitors and printers shift what you see. Where a precise match matters, like a brand colour or a Nation's artwork, specify from a physical sample.

The palette also depends on the material: preformed thermoplastic, StreetBond pavement coating and MMAX each have their own. On a splash pad or a playground, check the solar reflectance value on the colour card. Dark colours get hot.

Link in bio for the guide, and to book a 60-minute Lunch & Learn for your team.

#colour #landscapearchitecture #urbandesign #streetbond #crosswalks #splashpad #playground #specification #pavement #canada`,
    },
  },
  {
    key: "decorative-asphalt-high-traffic",
    dueAt: "2026-12-04T16:00:00Z",
    title: "Decorative asphalt for high-traffic areas in Emery Village",
    pageUrl: `${SITE}/blog/decorative-asphalt-high-traffic`,
    image: `${CDN}/e57aef10de8411b5d3e2023d4480ba9badd73b8f-800x600.jpg`,
    imageAlt: "A truck crossing Emery Village's blue TrafficPatternsXD gateway in Toronto",
    copy: {
      linkedin: `Emery Village BIA in Toronto, Ontario, had unit pavers in the neighbourhood's own Emery Blue at its entrance gateway. Heavy truck traffic broke them down, and patching them only held for a while.

In 2020 the BIA replaced them with TrafficPatternsXD across 440 m², keeping the colour and the paver grid design.

"The material provided us with continuity of design and less traffic disruption in construction than with replacing the pavers or demolishing the concrete base," said Al Ruggero of the BIA.

Read the case study, and ${ASK}: {link}

#BIA #Toronto #streetscape`,
      facebook: `Emery Village BIA in Toronto, Ontario, replaced its gateway pavers with TrafficPatternsXD across 440 m², keeping the neighbourhood's own Emery Blue and the original paver grid. Read the case study and book a 60-minute Lunch & Learn for your team: {link} #EmeryVillage #BIA`,
      instagram: `Emery Village, Toronto, Ontario.

The BIA's gateway pavers, in the neighbourhood's own Emery Blue, couldn't take the heavy truck traffic. In 2020 they were replaced with TrafficPatternsXD across 440 m², keeping the colour and the paver grid design.

The aggregate-reinforced preformed thermoplastic gave the BIA continuity of design, with less traffic disruption than replacing the pavers.

Link in bio for the case study, and to book a 60-minute Lunch & Learn for your team.

#emeryvillage #toronto #ontario #bia #trafficpatternsxd #streetscape #crosswalks #urbandesign #pavement #canada`,
    },
  },
  {
    key: "hub-certified-installer-network",
    dueAt: "2026-12-07T16:00:00Z",
    title: "The HUB certified installer network, province by province",
    pageUrl: `${SITE}/blog/hub-certified-installer-network`,
    image: `${CDN}/d9ee32e490cf1880569cdf6fbd654041227dc76e-2400x1800.jpg`,
    imageAlt: "A heater rig over a colourful preformed thermoplastic crosswalk during installation",
    copy: {
      linkedin: `Every specification for a decorative surface assumes somebody within driving distance knows how to install it.

For preformed thermoplastic, the difference between a crosswalk that lasts a decade and one that lifts at the edges is almost entirely in the application. That's why HUB Surface Systems works through certified installers, trained and authorized by HUB to install each system to specification: Square One Paving in British Columbia, ULS Landscaping in Alberta, Virtue Construction in Saskatchewan, Multiseal in Ontario and Thermo Design in Québec.

A line worth putting in your tender: "Installed by a HUB-certified installer to manufacturer specification."

Read the article, and ${ASK}: {link}

#specification #procurement #landscapearchitecture`,
      facebook: `At HUB Surface Systems, each system goes in through certified installers, trained and authorized by HUB to install it to specification, with Multiseal in Ontario and Square One Paving in British Columbia among them. Read how the network works, and book a 60-minute Lunch & Learn for your team: {link} #specification #construction`,
      instagram: `Every specification assumes somebody nearby knows how to install it.

HUB Surface Systems' certified installers are trained and authorized by HUB to install each system to specification: Square One Paving in British Columbia, ULS Landscaping in Alberta, Virtue Construction in Saskatchewan, Multiseal in Ontario and Thermo Design in Québec.

Behind them are HUB's two regional offices, in Milton, Ontario, and Ladysmith, British Columbia.

Link in bio to read how the network works, and to book a 60-minute Lunch & Learn for your team.

#specification #construction #pavement #crosswalks #stampedasphalt #landscapearchitecture #municipal #ontario #britishcolumbia #canada`,
    },
  },
  {
    key: "municipalities-case-study",
    dueAt: "2026-12-11T16:00:00Z",
    title: "The Toronto Laneway Project",
    pageUrl: `${SITE}/blog/municipalities-case-study`,
    image: `${CDN}/661945c1afb8419c50a2da3093bb216da97e47a3-1200x795.jpg`,
    imageAlt: "A laneway in Leslieville, Toronto, coated in bold yellow and blue StreetBond shapes",
    copy: {
      linkedin: `Most laneways serve only as service corridors. The Laneway Project, a non-profit of planners, designers and placemakers, works with the City of Toronto to turn them into public space.

In the Leslieville laneway in Toronto, Ontario, the surface does that work. StreetBond pavement coating in bold shapes and deep colours makes it a space where families and children feel welcome, and it needs little upkeep. A coating in a place like this has to be hard enough for heavy foot traffic and flexible enough not to crack.

Read the case study, and ${ASK}: {link}

#placemaking #Toronto #publicspace`,
      facebook: `In Leslieville, Toronto, Ontario, a laneway became a public space with StreetBond pavement coating in bold shapes and deep colours. It's part of the Laneway Project, a non-profit working with the City of Toronto. See the case study and book a 60-minute Lunch & Learn for your team: {link} #Leslieville #placemaking`,
      instagram: `A laneway in Leslieville, Toronto, Ontario, became a public space.

The Laneway Project, a non-profit working with the City of Toronto, turns service corridors into places people want to be. Here, StreetBond pavement coating in bold shapes and deep colours makes a laneway where families and children feel welcome, and it needs little upkeep.

Link in bio to see the case study, and to book a 60-minute Lunch & Learn for your team.

#leslieville #toronto #ontario #lanewayproject #placemaking #streetbond #publicspace #urbandesign #pavement #canada`,
    },
  },
  {
    key: "bc-childrens-hospital-labyrinth",
    dueAt: "2026-12-14T16:00:00Z",
    title: "Decorative paving and a labyrinth for BC Children's Hospital",
    pageUrl: `${SITE}/blog/bc-childrens-hospital-labyrinth`,
    // The map's photo of the same job (Product Book p.94).
    image: `${CDN}/44401860b10a412b05dd329a1e1ae60ff120e597-2400x1800.jpg`,
    imageAlt: "A labyrinth in StreetBond coating on a hospital deck in Vancouver, with DecoMark animal icons in the paving",
    copy: {
      linkedin: `At BC Women & Children's Hospital in Vancouver, British Columbia, the outdoor spaces off the wards were designed to be playful and meditative.

The DecoMark icons show female animals native to British Columbia with their young. Some were applied to precast concrete tiles off-site, then delivered, lifted to the upper floors and placed, which made for efficient installation and high quality control. On one deck, a labyrinth is laid out in StreetBond pavement coating.

Landscape architect: Connect Landscape Architecture. Installer: Square One Paving.

See the project, and ${ASK}: {link}

#healthcaredesign #landscapearchitecture #Vancouver`,
      facebook: `At BC Women & Children's Hospital in Vancouver, British Columbia, the outdoor spaces off the wards carry DecoMark icons of female animals native to British Columbia with their young, and a labyrinth in StreetBond pavement coating. See the project and book a 60-minute Lunch & Learn for your team: {link} #Vancouver #healthcaredesign`,
      instagram: `A labyrinth, and animals with their young, off the wards at BC Women & Children's Hospital in Vancouver, British Columbia.

The DecoMark icons show female animals native to British Columbia with their young. Several were applied to precast concrete tiles off-site, then lifted to the upper floors and set in place. On one deck, a labyrinth is laid out in StreetBond pavement coating.

Designed by Connect Landscape Architecture and installed by Square One Paving.

Link in bio to see the project, and to book a 60-minute Lunch & Learn for your team.

#vancouver #britishcolumbia #healthcaredesign #landscapearchitecture #decomark #streetbond #labyrinth #urbandesign #canada`,
    },
  },
  {
    key: "ubc-musqueam-crosswalk",
    dueAt: "2026-12-18T16:00:00Z",
    title: "UBC & Musqueam Crosswalk",
    pageUrl: `${SITE}/blog/ubc-musqueam-crosswalk`,
    image: `${CDN}/d2c1e165208423a75255e72eea43312489359002-1200x900.jpg`,
    imageAlt: "The UBC and Musqueam crosswalk at University Boulevard and Wesbrook Mall, with the UBC sign behind it",
    copy: {
      linkedin: `At the main gateway to the University of British Columbia, the crosswalk at University Boulevard and Wesbrook Mall marks the arrival to campus.

UBC and Musqueam designed it together. The crests of both are woven together in the crosswalk, acknowledging that UBC is on the ancestral, traditional and unceded territory of Musqueam. It's TrafficPatterns preformed thermoplastic, heat-applied so it bonds to the asphalt, installed by Square One Paving.

See the project, and ${ASK}: {link}

#UBC #campusdesign #crosswalks`,
      facebook: `At UBC's main gateway, the crosswalk at University Boulevard and Wesbrook Mall weaves together the crests of UBC and Musqueam, who designed it together. It's TrafficPatterns preformed thermoplastic. See the project and book a 60-minute Lunch & Learn for your team: {link} #UBC #Vancouver`,
      instagram: `University Boulevard and Wesbrook Mall, at the main gateway to UBC in Vancouver, British Columbia.

UBC and Musqueam designed this crosswalk together to mark the arrival to campus. Their crests are woven together, acknowledging that UBC is on the ancestral, traditional and unceded territory of Musqueam.

It's TrafficPatterns preformed thermoplastic, heat-applied so it bonds to the asphalt, installed by Square One Paving.

Link in bio to see the project, and to book a 60-minute Lunch & Learn for your team.

#ubc #vancouver #britishcolumbia #crosswalks #trafficpatterns #campusdesign #publicspace #urbandesign #canada`,
    },
  },
  {
    key: "complete-streets-new-westminster",
    dueAt: "2026-12-21T16:00:00Z",
    title: "Complete Streets in New Westminster, British Columbia",
    pageUrl: `${SITE}/blog/complete-streets-new-westminster`,
    image: `${CDN}/64ac2863fdfc84a26959e4b2fdf2f56ed41448aa-1080x720.jpg`,
    imageAlt: "Front Street Mews in New Westminster, with planters and grey bands running across the street and sidewalk",
    copy: {
      linkedin: `On Front Street Mews in New Westminster, British Columbia, the street and the sidewalk read as one surface.

The Complete Streets redevelopment, completed in 2017, turned the old Frontage Road into a mews. Contrasting grey bands run across both the street and the sidewalk: TrafficPatterns preformed thermoplastic on the roadway and StreetBond pavement coating on the concrete sidewalk. The continuous treatment supports a shared street, designed for local access, walking, cycling and restaurant activity.

See the project, and ${ASK}: {link}

#CompleteStreets #landscapearchitecture #NewWestminster`,
      facebook: `Front Street Mews in New Westminster, British Columbia, runs one surface across street and sidewalk. Its contrasting grey bands are TrafficPatterns on the road and StreetBond pavement coating on the concrete sidewalk. See the project and book a 60-minute Lunch & Learn for your team: {link} #NewWest #CompleteStreets`,
      instagram: `Front Street Mews, New Westminster, British Columbia.

The Complete Streets redevelopment, completed in 2017, made the old Frontage Road into a mews. Contrasting grey bands run across the street and the sidewalk as one surface: TrafficPatterns preformed thermoplastic on the roadway and StreetBond pavement coating on the concrete.

Link in bio to see the project, and to book a 60-minute Lunch & Learn for your team.

#newwestminster #newwest #britishcolumbia #completestreets #streetscape #trafficpatterns #streetbond #urbandesign #landscapearchitecture #canada`,
    },
  },
];
