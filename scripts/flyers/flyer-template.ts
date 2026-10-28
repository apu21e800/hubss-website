/**
 * The product flyer's page: two Letter pages, front and back, in the
 * Product Portfolio Book's language (the dark band with the system's name and
 * the orange dash, Inter, the printed page's spec grid and uses strip), as
 * HTML that Chromium prints to PDF (scripts/flyers/build-flyers.ts).
 *
 * Units are CSS pixels at 96 to the inch: a Letter page is 816 x 1056.
 */
import type { Flyer } from "./flyer-content";

export interface FlyerAssets {
  /** file:// URLs of the prepared photographs, in the flyer's own order. */
  hero: string;
  jobs: string[];
  steps: string[];
  logoWhite: string;
  /** The QR code, as inline SVG. */
  qr: string;
  /** file:// URL of the folder holding the TrueType Inter files. */
  fontDir: string;
}

export const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Photo boxes, in CSS px: build-flyers.ts crops each photo to its box at up to 300 dpi. */
export const BOX = {
  heroFull: { w: 816, h: 458 },
  heroFramed: { w: 432, h: 324 },
  /** For a small original (AggreFill's are 476px): the photo's own shape, near 160 dpi. */
  heroFramedSmall: { w: 288, h: 273 },
  job3: { w: 232, h: 152 },
  job2: { w: 353, h: 200 },
  step: { w: 232, h: 132 },
} as const;

function css(fontDir: string): string {
  return `
@page { size: 8.5in 11in; margin: 0; }
@font-face { font-family: "FInter"; src: url("${fontDir}/Inter-Regular.ttf"); font-weight: 400; }
@font-face { font-family: "FInter"; src: url("${fontDir}/Inter-Medium.ttf"); font-weight: 500; }
@font-face { font-family: "FInter"; src: url("${fontDir}/Inter-SemiBold.ttf"); font-weight: 600; }
@font-face { font-family: "FInter"; src: url("${fontDir}/Inter-Bold.ttf"); font-weight: 700; }
@font-face { font-family: "FInterDisplay"; src: url("${fontDir}/InterDisplay-Bold.ttf"); font-weight: 700; }
@font-face { font-family: "FInterDisplay"; src: url("${fontDir}/InterDisplay-ExtraBold.ttf"); font-weight: 800; }
:root { --ink: #1f1f1f; --text: #161616; --body: #3d3b38; --muted: #77716a; --rule: #d9d4cc; --hair: #e8e4dd; --orange: #f97316; --orange-text: #b83e0b; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #fff; }
body { font-family: "FInter", sans-serif; color: var(--text); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; width: 816px; height: 1056px; overflow: hidden; break-after: page; background: #fff; }
.page:last-child { break-after: auto; }
img { display: block; }
a { color: inherit; text-decoration: none; }
.display { font-family: "FInterDisplay", "FInter", sans-serif; }
.kick { font-size: 8px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--orange-text); }
.h2 { font-size: 18px; font-weight: 800; letter-spacing: -.012em; line-height: 1.15; color: var(--text); margin-top: 5px; }

/* front: the photograph, full bleed */
.hero { position: absolute; top: 0; left: 0; right: 0; height: ${BOX.heroFull.h}px; background: #2a2a2a; overflow: hidden; }
.hero img.photo { width: 100%; height: 100%; object-fit: cover; }
.hero .shade-t { position: absolute; inset: 0 0 auto 0; height: 150px; background: linear-gradient(rgba(0,0,0,.56), rgba(0,0,0,0)); }
.hero .shade-b { position: absolute; inset: auto 0 0 0; height: 96px; background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.42)); }
.logo { position: absolute; top: 34px; left: 48px; width: 164px; height: auto; }
.tag { position: absolute; top: 44px; right: 48px; color: rgba(255,255,255,.9); font-size: 8px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; }
.hero .cap { position: absolute; left: 48px; bottom: 15px; color: rgba(255,255,255,.94); font-size: 9px; font-weight: 500; letter-spacing: .05em; }
.band { position: absolute; top: ${BOX.heroFull.h}px; left: 0; right: 0; height: 122px; background: var(--ink); padding: 25px 48px 0; }
.fam { color: var(--orange); font-size: 9px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; }
.name { color: #fff; font-size: 49px; font-weight: 800; letter-spacing: -.022em; line-height: 1; margin-top: 11px; }
.dash { width: 56px; height: 4px; background: var(--orange); margin-top: 14px; }

/* front: the photograph framed in the dark (a small original) */
.framed { position: absolute; top: 0; left: 0; right: 0; height: 580px; background: var(--ink); }
.framed .ph { position: absolute; top: 96px; right: 48px; width: ${BOX.heroFramed.w}px; height: ${BOX.heroFramed.h}px; border-radius: 4px; overflow: hidden; background: #2a2a2a; }
.framed .ph img { width: 100%; height: 100%; object-fit: cover; }
.framed .ph.sm { top: 112px; width: ${BOX.heroFramedSmall.w}px; height: ${BOX.heroFramedSmall.h}px; }
.framed .cap.sm { top: ${112 + BOX.heroFramedSmall.h + 10}px; width: ${BOX.heroFramedSmall.w}px; }
.framed .cap { position: absolute; top: ${96 + BOX.heroFramed.h + 10}px; right: 48px; width: ${BOX.heroFramed.w}px; color: rgba(255,255,255,.7); font-size: 9px; font-weight: 500; letter-spacing: .05em; }
.framed .tag { top: 44px; }
.framed .id { position: absolute; left: 48px; bottom: 54px; width: 250px; }
.framed .name { font-size: 44px; line-height: 1.02; }

.front-body { position: absolute; top: 580px; left: 48px; right: 48px; bottom: 0; }
.headline { font-size: 30px; font-weight: 800; letter-spacing: -.02em; line-height: 1.06; color: #111; margin-top: 28px; }
.subhead { font-size: 14.5px; font-weight: 500; line-height: 1.42; color: #262422; margin-top: 8px; max-width: 660px; }
.cols { display: grid; grid-template-columns: 1.14fr 1fr; column-gap: 38px; margin-top: 19px; }
.prose p { font-size: 10.9px; line-height: 1.56; color: var(--body); }
.prose p + p { margin-top: 7px; }
.specs { border-top: 1.5px solid var(--ink); }
.spec { display: grid; grid-template-columns: 104px 1fr; column-gap: 12px; padding: 6.5px 0; border-bottom: 1px solid var(--hair); }
.spec .l { font-size: 7.8px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); padding-top: 2.5px; }
.spec .v { font-size: 10.9px; font-weight: 600; color: var(--text); line-height: 1.36; }
.quote { margin-top: 18px; padding: 1px 0 1px 16px; border-left: 3px solid var(--orange); max-width: 640px; }
.quote q { display: block; quotes: "\\201C" "\\201D"; font-size: 12.6px; font-weight: 500; line-height: 1.45; color: #1d1c1a; }
.quote .who { font-size: 8.6px; color: var(--muted); margin-top: 5px; }
.front-foot { position: absolute; left: 0; right: 0; bottom: 24px; }
.uses { border-top: 1px solid var(--rule); padding-top: 12px; text-align: center; font-size: 9.4px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: #59544c; }
.uses span + span::before { content: "·"; margin: 0 13px; color: #b4ada2; }
.micro { display: flex; justify-content: space-between; margin-top: 11px; font-size: 7.6px; color: #8c867c; }

/* back */
.top { position: absolute; top: 0; left: 0; right: 0; height: 64px; background: var(--ink); padding: 0 48px; display: flex; align-items: center; justify-content: space-between; }
.top .n { color: #fff; font-size: 21px; font-weight: 800; letter-spacing: -.016em; }
.top .f { color: var(--orange); font-size: 8px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; }
.back-body { position: absolute; top: 64px; left: 48px; right: 48px; bottom: 224px; display: flex; flex-direction: column; justify-content: space-evenly; }
.steps { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 28px; margin-top: 12px; }
.step { border-top: 1px solid var(--rule); padding-top: 9px; }
.step .sp { height: ${BOX.step.h}px; border-radius: 3px; overflow: hidden; background: #e3dfd8; margin-bottom: 9px; }
.step .sp img { width: 100%; height: 100%; object-fit: cover; }
/* A step with no photograph beside steps that have one: its number, large, in the photo's place. */
.step .sp.none { display: flex; align-items: center; justify-content: center; background: #f3f0ea; font-size: 44px; font-weight: 800; color: #e2cdb8; letter-spacing: -.02em; }
.step .no { font-size: 8.6px; font-weight: 700; color: var(--orange-text); letter-spacing: .12em; }
.step .t { font-size: 13.4px; font-weight: 800; color: var(--text); margin-top: 3px; }
.step .b { font-size: 9.9px; line-height: 1.5; color: var(--body); margin-top: 4px; }
.lede { font-size: 10.4px; line-height: 1.55; color: var(--body); margin-top: 8px; max-width: 660px; }
.jobs { display: grid; column-gap: 14px; margin-top: 12px; }
.jobs.n3 { grid-template-columns: repeat(3, 1fr); }
.jobs.n2 { grid-template-columns: repeat(2, 1fr); column-gap: 24px; }
.job .ph { height: ${BOX.job3.h}px; border-radius: 3px; overflow: hidden; background: #e3dfd8; }
.jobs.n2 .job .ph { height: ${BOX.job2.h}px; }
.job .ph img { width: 100%; height: 100%; object-fit: cover; }
.job .t { font-size: 9.8px; font-weight: 700; color: var(--text); margin-top: 7px; line-height: 1.3; }
.job .s { font-size: 8.7px; color: #69635a; margin-top: 2px; line-height: 1.35; }
.split { display: grid; grid-template-columns: 1fr 1fr; column-gap: 40px; }
.chips { display: grid; gap: 4px; margin-top: 11px; }
.chip { aspect-ratio: 1 / 1; border-radius: 2px; }
.chip.k { box-shadow: inset 0 0 0 1px #cfc8bd; }
.named { display: grid; gap: 10px 12px; margin-top: 11px; }
.named div { font-size: 8.4px; line-height: 1.3; color: #4a4640; }
.named i { display: block; height: 34px; border-radius: 2px; margin-bottom: 4px; }
.named i.k { box-shadow: inset 0 0 0 1px #cfc8bd; }
.named b { display: block; font-weight: 700; color: var(--text); }
.note { font-size: 9px; line-height: 1.5; color: #5a554c; margin-top: 8px; }
.list { margin-top: 10px; columns: 2; column-gap: 24px; font-size: 9.4px; line-height: 1.6; color: var(--body); }
.list.one { columns: 1; }
.list div { break-inside: avoid; }
.list b { font-weight: 700; color: var(--text); }
.where { margin-top: 10px; border-top: 1.5px solid var(--ink); }
.where div { display: grid; grid-template-columns: 112px 1fr 40px; column-gap: 10px; padding: 5.5px 0; border-bottom: 1px solid var(--hair); font-size: 9.6px; line-height: 1.35; }
.where b { font-weight: 700; color: var(--text); }
.where span { color: #55504a; }
.where i { font-style: normal; color: var(--muted); text-align: right; font-size: 8.6px; padding-top: 1px; }
.docs { columns: 3; column-gap: 24px; margin-top: 9px; font-size: 9.4px; line-height: 1.45; color: var(--body); }
.docs div { padding-left: 10px; position: relative; break-inside: avoid; margin-bottom: 3px; }
.docs div::before { content: ""; position: absolute; left: 0; top: .58em; width: 4px; height: 4px; background: var(--orange); border-radius: 1px; }
.pair { border: 1px solid var(--rule); border-radius: 4px; padding: 14px 16px; }
.pair .lede { margin-top: 6px; }

.close { position: absolute; left: 0; right: 0; bottom: 0; height: 224px; background: var(--ink); color: #fff; padding: 26px 48px 0; display: grid; grid-template-columns: 1.18fr 1fr 112px; column-gap: 34px; }
.close .kick { color: var(--orange); }
.close .h { font-size: 15.5px; font-weight: 800; letter-spacing: -.01em; line-height: 1.2; margin-top: 6px; }
.office { margin-top: 11px; font-size: 9.6px; line-height: 1.5; color: rgba(255,255,255,.8); }
.office b { color: #fff; font-weight: 700; }
.ll p { font-size: 9.6px; line-height: 1.5; color: rgba(255,255,255,.8); margin-top: 9px; }
.ll .go { color: #fff; font-weight: 700; }
.qr { background: #fff; border-radius: 6px; padding: 8px; width: 112px; height: 112px; }
.qr svg { width: 100%; height: 100%; display: block; }
.qrcap { font-size: 8px; line-height: 1.4; color: rgba(255,255,255,.72); margin-top: 8px; }
.qrcap b { display: block; color: #fff; font-weight: 600; overflow-wrap: anywhere; }
.legal { position: absolute; left: 48px; right: 48px; bottom: 15px; display: flex; justify-content: space-between; font-size: 7.2px; color: rgba(255,255,255,.48); }
`;
}

const chipCols = (n: number) => (n > 40 ? 16 : n > 24 ? 13 : n > 12 ? 12 : Math.max(n, 8));
/** A page's address: it may break after a slash, never inside the last part (a slug's own hyphens). */
const wbr = (s: string) => {
  const i = s.lastIndexOf("/");
  return `${esc(s.slice(0, i + 1)).replace(/\//g, "/<wbr>")}<span style="white-space:nowrap">${esc(s.slice(i + 1))}</span>`;
};

function front(f: Flyer, a: FlyerAssets): string {
  const specs = f.specs.map((s) => `<div class="spec"><div class="l">${esc(s.label)}</div><div class="v">${esc(s.value)}</div></div>`).join("");
  const uses = f.uses.map((u) => `<span>${esc(u)}</span>`).join("");
  const prose = f.body.map((p) => `<p>${esc(p)}</p>`).join("");
  const quote = f.quote ? `<div class="quote"><q>${esc(f.quote.text)}</q><div class="who">${esc(f.quote.who)}</div></div>` : "";
  const id = `<div class="fam">${esc(f.family)}</div><div class="name display">${esc(f.name)}</div><div class="dash"></div>`;
  const top =
    f.hero.layout === "framed"
      ? `<div class="framed"><img class="logo" src="${a.logoWhite}" alt="HUB Surface Systems"><div class="tag">Product flyer</div>
           <div class="ph${f.hero.small ? " sm" : ""}"><img src="${a.hero}" alt="${esc(f.hero.alt)}"></div>${f.hero.caption ? `<div class="cap${f.hero.small ? " sm" : ""}">${esc(f.hero.caption)}</div>` : ""}
           <div class="id">${id}</div></div>`
      : `<div class="hero"><img class="photo" src="${a.hero}" alt="${esc(f.hero.alt)}"><div class="shade-t"></div><div class="shade-b"></div>
           <img class="logo" src="${a.logoWhite}" alt="HUB Surface Systems"><div class="tag">Product flyer</div>
           ${f.hero.caption ? `<div class="cap">${esc(f.hero.caption)}</div>` : ""}</div>
         <div class="band">${id}</div>`;
  return `<div class="page">
  ${top}
  <div class="front-body">
    <div class="headline display">${esc(f.headline)}</div>
    ${f.subhead ? `<div class="subhead">${esc(f.subhead)}</div>` : ""}
    <div class="cols"><div class="prose">${prose}</div><div class="specs">${specs}</div></div>
    ${quote}
    <div class="front-foot"><div class="uses">${uses}</div>
      <div class="micro"><span>HUB Surface Systems · Canadian-owned since 1999</span><span>${esc(f.footLine)}</span></div></div>
  </div>
</div>`;
}

function back(f: Flyer, a: FlyerAssets): string {
  const how = f.steps
    ? `<section><div class="kick">How it goes in</div><div class="h2 display">${esc(f.steps.title)}</div>
       <div class="steps">${f.steps.items.map((s, i) => `<div class="step">${a.steps[i] ? `<div class="sp"><img src="${a.steps[i]}" alt="${esc(s.alt ?? s.name)}"></div>` : a.steps.some(Boolean) ? `<div class="sp none display" aria-hidden="true">0${i + 1}</div>` : ""}<div class="no">0${i + 1}</div><div class="t">${esc(s.name)}</div><div class="b">${esc(s.body)}</div></div>`).join("")}</div></section>`
    : f.how
      ? `<section><div class="kick">How it goes in</div><div class="h2 display">${esc(f.how.title)}</div><p class="lede">${esc(f.how.body)}</p></section>`
      : "";
  const jobs = f.jobs.length
    ? `<section><div class="kick">${esc(f.jobsKick)}</div><div class="h2 display">${esc(f.jobsTitle)}</div>
       <div class="jobs n${f.jobs.length}">${f.jobs.map((j, i) => `<div class="job"><div class="ph"><img src="${a.jobs[i]}" alt="${esc(j.alt)}"></div><div class="t">${esc(j.title)}</div><div class="s">${j.sub.split(" · ").map(esc).join("<br>")}</div></div>`).join("")}</div></section>`
    : "";

  let left = "";
  if (f.colours?.named) {
    const n = f.colours.chips.length;
    left = `<div><div class="kick">Colour</div><div class="h2 display">${esc(f.colours.heading)}</div>
      <div class="named" style="grid-template-columns:repeat(${n > 8 ? 6 : Math.min(n, 6)},1fr)">${f.colours.chips.map((c) => `<div><i class="${c.keyline ? "k" : ""}" style="background:${c.hex}"></i><b>${esc(c.name)}</b>${c.sr != null ? `SR ${c.sr.toFixed(2)}` : ""}</div>`).join("")}</div>
      <div class="note">${esc(f.colours.note)}</div></div>`;
  } else if (f.colours) {
    left = `<div><div class="kick">Colour</div><div class="h2 display">${esc(f.colours.heading)}</div>
      <div class="chips" style="grid-template-columns:repeat(${chipCols(f.colours.chips.length)},1fr)">${f.colours.chips.map((c) => `<div class="chip${c.keyline ? " k" : ""}" style="background:${c.hex}"></div>`).join("")}</div>
      <div class="note">${esc(f.colours.note)}</div></div>`;
  } else if (f.list) {
    left = `<div><div class="kick">${esc(f.list.kick)}</div><div class="h2 display">${esc(f.list.heading)}</div>
      <div class="list${f.list.oneColumn ? " one" : ""}">${f.list.items.map((x) => `<div>${x.strong ? `<b>${esc(x.strong)}</b> ` : ""}${esc(x.text ?? "")}</div>`).join("")}</div>
      ${f.list.note ? `<div class="note">${esc(f.list.note)}</div>` : ""}</div>`;
  } else if (f.pairWith) {
    left = `<div class="pair"><div class="kick">${esc(f.pairWith.kick)}</div><div class="h2 display">${esc(f.pairWith.heading)}</div><p class="lede">${esc(f.pairWith.body)}</p></div>`;
  }
  const where = f.where?.length
    ? `<div><div class="kick">Where it goes</div><div class="h2 display">${esc(f.whereTitle ?? "")}</div>
       <div class="where">${f.where.map((w) => `<div><b>${esc(w.name)}</b><span>${esc(w.note ?? "")}</span><i>${w.page ? `p. ${w.page}` : ""}</i></div>`).join("")}</div></div>`
    : "";
  // With nothing for the left column, the table takes it.
  const split = left && where ? `<section class="split">${left}${where}</section>` : left || where ? `<section class="split">${left || where}<div></div></section>` : "";
  const docs = f.documents.length
    ? `<section><div class="kick">On the product page</div><div class="docs">${f.documents.map((d) => `<div>${esc(d)}</div>`).join("")}</div></section>`
    : "";

  return `<div class="page">
  <div class="top"><div class="n display">${esc(f.name)}</div><div class="f">${esc(f.family)}</div></div>
  <div class="back-body">${how}${jobs}${split}${docs}</div>
  <div class="close">
    <div><div class="kick">Talk to HUB</div><div class="h display">${esc(f.closeTitle)}</div>
      ${f.offices.map((o) => `<div class="office"><b>${esc(o.label)}</b> · ${esc(o.place)}<br><a href="${o.telHref}">${esc(o.phone)}</a> · <a href="mailto:${esc(o.email)}">${esc(o.email)}</a></div>`).join("")}</div>
    <div class="ll"><div class="kick">Lunch &amp; Learn</div><div class="h display">${esc(f.lunch.title)}</div><p>${esc(f.lunch.body)}</p><p class="go"><a href="${esc(f.lunch.href)}">${esc(f.lunch.label)}</a></p></div>
    <div><a href="${esc(f.pageHref)}"><div class="qr">${a.qr}</div></a><div class="qrcap">${esc(f.qrCaption)}<b>${wbr(f.pageLabel)}</b></div></div>
    <div class="legal"><span>${esc(f.legal)}</span><span>hubss.com</span></div>
  </div>
</div>`;
}

export function flyerHtml(f: Flyer, a: FlyerAssets): string {
  return `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><title>${esc(f.name)} product flyer · HUB Surface Systems</title><style>${css(a.fontDir)}</style></head><body>
${front(f, a)}
${back(f, a)}
</body></html>`;
}

/** The share image (1200 x 630): the hero photograph, the logo, the family and the name. */
export function shareHtml(f: Flyer, a: FlyerAssets): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css(a.fontDir)}
.share { position: relative; width: 1200px; height: 630px; overflow: hidden; background: var(--ink); }
.share img.photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.share .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20,20,20,.92) 0%, rgba(20,20,20,.72) 38%, rgba(20,20,20,0) 72%); }
.share .logo { top: 52px; left: 64px; width: 230px; }
.share .id { position: absolute; left: 64px; bottom: 64px; width: 560px; }
.share .fam { font-size: 13px; }
.share .name { font-size: 76px; margin-top: 14px; }
.share .dash { width: 84px; height: 6px; margin-top: 20px; }
.share .line { color: rgba(255,255,255,.86); font-size: 22px; font-weight: 500; line-height: 1.35; margin-top: 22px; }
</style></head><body style="width:1200px;height:630px">
<div class="share"><img class="photo" src="${a.hero}" alt=""><div class="shade"></div>
<img class="logo" src="${a.logoWhite}" alt="HUB Surface Systems">
<div class="id"><div class="fam">${esc(f.family)}</div><div class="name display">${esc(f.name)}</div><div class="dash"></div><div class="line">${esc(f.headline)}</div></div></div>
</body></html>`;
}
