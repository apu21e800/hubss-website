"""T1: re-architect the Figma plugin to stream, not embed.
Patches the JS template + Python emitter in src/generate_plugin.py:
 - buildCatalogue(d, section): section filter (all|products|applications|
   projects|network|reference) = the sectioned-import fallback.
 - batched yield + progress postMessage so the main thread paints and large
   books don't stall.
 - Python: write catalogue-layout.json artifact (the directive's split data)
   alongside the (small, image-bank-free) code.js; never embed base64.
Keeps UPSERT, 22 styles, safeBuild, layer naming untouched.
All replacements assert exactly-once so a drift fails loudly.
"""
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "catalog-print-build" / "src" / "generate_plugin.py"
s = p.read_text(encoding="utf-8")
n = 0


def sub(old, new, cnt=1):
    global s, n
    c = s.count(old)
    assert c == cnt, f"expected {cnt}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)
    n += 1


# 1) buildCatalogue signature + section filter + progress/yield helpers
sub("""async function buildCatalogue(d) {
  // v51 — load all weights used by the design system + frames
  await figma.loadFontAsync({family:"Inter", style:"Regular"});
  await figma.loadFontAsync({family:"Inter", style:"Medium"});
  await figma.loadFontAsync({family:"Inter", style:"SemiBold"});
  await figma.loadFontAsync({family:"Inter", style:"Bold"});
  // Bootstrap the design system once per Figma session (idempotent).
  try { await createDesignSystem(); } catch (e) { console.warn("Design system init failed:", e); }

  const frames = [];""",
"""async function buildCatalogue(d, section) {
  // section: "all" (default) or one of products|applications|projects|
  // network|reference — the sectioned-import fallback so the book can be
  // brought in section by section if a full pass is too heavy on a machine.
  section = section || "all";
  const ALL = section === "all";
  const want = (s) => ALL || section === s;

  // Yield to the main thread between batches so the UI paints immediately and
  // a large book never stalls Figma. setTimeout exists in the plugin sandbox;
  // guard anyway so a missing timer degrades to a no-op rather than throwing.
  const tick = (typeof setTimeout === "function")
    ? () => new Promise((r) => setTimeout(r, 0))
    : () => Promise.resolve();
  let _built = 0;
  async function progress(label) {
    _built++;
    if (_built % 12 === 0) { figma.ui.postMessage({type:"progress", built:_built, label}); await tick(); }
  }

  // v51 — load all weights used by the design system + frames
  await figma.loadFontAsync({family:"Inter", style:"Regular"});
  await figma.loadFontAsync({family:"Inter", style:"Medium"});
  await figma.loadFontAsync({family:"Inter", style:"SemiBold"});
  await figma.loadFontAsync({family:"Inter", style:"Bold"});
  // Bootstrap the design system once per Figma session (idempotent).
  try { await createDesignSystem(); } catch (e) { console.warn("Design system init failed:", e); }

  const frames = [];""")

# 2) Front matter only in full builds (sectioned imports start at their section)
sub("""  const frames = [];

  // Front matter — TOC on p3 so readers can navigate from the first spread
  frames.push(await pageCover(d));        // 0 = p1""",
"""  const frames = [];

  // Front matter — full builds only (sectioned imports skip it).
  if (ALL) {
  // Front matter — TOC on p3 so readers can navigate from the first spread
  frames.push(await pageCover(d));        // 0 = p1""")

# close the front-matter `if (ALL)` right before Section 1
sub("""  // Section 1 — Products
  const productsPage = frames.length + 1;
  frames.push(await safeBuild("Section Open — Products", () => pageSectionOpen("One", "Products.", d.section_openers && d.section_openers.products)));
  for (const prod of (d.products || [])) {
    frames.push(await safeBuild("Product Hero — " + (prod && prod.name || "?"), () => pageProductHero(prod)));
    frames.push(await safeBuild("Product Spec — " + (prod && prod.name || "?"), () => pageProductSpec(prod)));
  }""",
"""  } // end front matter

  // Section 1 — Products
  const productsPage = frames.length + 1;
  if (want("products")) {
  frames.push(await safeBuild("Section Open — Products", () => pageSectionOpen("One", "Products.", d.section_openers && d.section_openers.products)));
  for (const prod of (d.products || [])) {
    frames.push(await safeBuild("Product Hero — " + (prod && prod.name || "?"), () => pageProductHero(prod)));
    frames.push(await safeBuild("Product Spec — " + (prod && prod.name || "?"), () => pageProductSpec(prod)));
    await progress("Products");
  }
  } // end products"""
)

# 3) wrap Applications section (opener + loop + DPS-B that follows it)
sub("""  // Section 2 — Applications
  const appsPage = frames.length + 1;
  frames.push(await safeBuild("Section Open — Applications", () => pageSectionOpen("Two", "Applications.", d.section_openers && d.section_openers.applications)));
  const nApps = (d.applications || []).length;
  let appIdx = 0;
  for (const app of (d.applications || [])) {
    appIdx++;
    const _idx = appIdx;
    frames.push(await safeBuild("Application — " + (app && app.name || "?"), () => pageApplication(app, _idx, nApps)));
  }""",
"""  // Section 2 — Applications
  const appsPage = frames.length + 1;
  if (want("applications")) {
  frames.push(await safeBuild("Section Open — Applications", () => pageSectionOpen("Two", "Applications.", d.section_openers && d.section_openers.applications)));
  const nApps = (d.applications || []).length;
  let appIdx = 0;
  for (const app of (d.applications || [])) {
    appIdx++;
    const _idx = appIdx;
    frames.push(await safeBuild("Application — " + (app && app.name || "?"), () => pageApplication(app, _idx, nApps)));
    await progress("Applications");
  }
  } // end applications""")

# 4) wrap Projects section header
sub("""  // Section 3 — Projects
  const projectsPage = frames.length + 1;
  frames.push(await safeBuild("Section Open — Projects", () => pageSectionOpen("Three", "Projects.", d.section_openers && d.section_openers.projects)));
  let projIdx = 0;
  const projs = d.projects || [];""",
"""  // Section 3 — Projects
  const projectsPage = frames.length + 1;
  const projs = d.projects || [];
  if (want("projects")) {
  frames.push(await safeBuild("Section Open — Projects", () => pageSectionOpen("Three", "Projects.", d.section_openers && d.section_openers.projects)));
  let projIdx = 0;""")

# progress in the projects loop + close the projects `if`
sub("""    frames.push(await safeBuild("Project Hero — " + (_proj && _proj.name || "?"), () => pageProjectHero(_proj)));
    frames.push(await safeBuild("Project Story — " + (_proj && _proj.name || "?"), () => pageProjectStory(_proj, _idx)));""",
"""    frames.push(await safeBuild("Project Hero — " + (_proj && _proj.name || "?"), () => pageProjectHero(_proj)));
    frames.push(await safeBuild("Project Story — " + (_proj && _proj.name || "?"), () => pageProjectStory(_proj, _idx)));
    await progress("Projects");""")

# 5) Network section — close projects `if` before it, wrap network
sub("""  // Section 4 — Network
  const networkPage = frames.length + 1;
  frames.push(await safeBuild("Network Section Opener", () => pageNetworkOpen(d)));
  const installs = d.installers || [];""",
"""  } // end projects

  // Section 4 — Network
  const networkPage = frames.length + 1;
  if (want("network")) {
  frames.push(await safeBuild("Network Section Opener", () => pageNetworkOpen(d)));
  const installs = d.installers || [];""")

# close network `if` before Section 5
sub("""  // Section 5 — Reference
  const referencePage = frames.length + 1;
  frames.push(await pageSectionOpen("Five", "Reference.", d.section_openers && d.section_openers.reference));""",
"""  } // end network

  // Section 5 — Reference
  const referencePage = frames.length + 1;
  if (want("reference")) {
  frames.push(await pageSectionOpen("Five", "Reference.", d.section_openers && d.section_openers.reference));""")

# close reference `if` before the pad-to-multiple-of-4 / closing trio,
# and only pad+TOC on full builds.
sub("""  // Pad to next multiple of 4 — saddle-stitch / perfect-bind requirement.
  // No upper-bound cap. Content count + 3 closing must be divisible by 4.
  while ((frames.length + 3) % 4 !== 0) {
    frames.push(await pageBlank(frames.length + 1));
  }

  // Closing pair + back cover
  // pageService ("Specified. Installed. Backed.") removed — DPS3 right already delivers this moment.
  frames.push(await pageClosing());
  frames.push(await pageQuietMark(d));
  frames.push(await pageBack(d));""",
"""  } // end reference

  // Closing matter — full builds only.
  if (ALL) {
  // Pad to next multiple of 4 — saddle-stitch / perfect-bind requirement.
  while ((frames.length + 3) % 4 !== 0) {
    frames.push(await pageBlank(frames.length + 1));
  }
  // Closing pair + back cover
  frames.push(await pageClosing());
  frames.push(await pageQuietMark(d));
  frames.push(await pageBack(d));
  } // end closing""")

# 6) TOC only on full builds (frames[2] slot exists only then)
sub("""  frames[2] = await pageTOC(tocEntries, frames.length);""",
"""  if (ALL && frames.length > 2) frames[2] = await pageTOC(tocEntries, frames.length);""")

# 7) progress yield in the append loop + final "done" message
sub("""  // Layout all frames in a grid and append to current page
  const COL = 10, GAP = 40;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    if (!f) continue;
    f.x = (i % COL) * (450 + GAP);
    f.y = Math.floor(i / COL) * (450 + GAP);
    figma.currentPage.appendChild(f);
  }""",
"""  // Layout all frames in a grid and append to current page — yield every
  // 10 so the canvas paints progressively instead of in one blocking burst.
  const COL = 10, GAP = 40;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    if (!f) continue;
    f.x = (i % COL) * (450 + GAP);
    f.y = Math.floor(i / COL) * (450 + GAP);
    figma.currentPage.appendChild(f);
    if (i % 10 === 9) { figma.ui.postMessage({type:"progress", built:i+1, label:"Placing"}); await tick(); }
  }
  figma.ui.postMessage({type:"done", count: frames.filter(Boolean).length});""")

# 8) onmessage — pass the requested section through
sub("""figma.ui.onmessage = async (msg) => {
  if (msg.type === "build") {
    try {
      await buildCatalogue(EMBEDDED_DATA);
      figma.closePlugin("Done!");
    } catch (e) {""",
"""figma.ui.onmessage = async (msg) => {
  if (msg.type === "build") {
    try {
      await buildCatalogue(EMBEDDED_DATA, msg.section || "all");
      // Leave the plugin open so the UI can show the done state; the user
      // closes it. (Auto-close raced the final progress paint.)
      figma.ui.postMessage({type:"done"});
    } catch (e) {""")

# 9) bigger UI panel for progress + section buttons
sub("""figma.showUI(__html__, {width: 320, height: 200});""",
    """figma.showUI(__html__, {width: 340, height: 420});""")

# 10) Python emitter — also write catalogue-layout.json (the split data) to
#     the plugin dir AND public/catalogue/figma/ (hosted + version-controlled).
sub("""    PLUGIN.write_bytes(code.encode("utf-8"))
    size_kb = PLUGIN.stat().st_size / 1024
    print(f"Wrote {PLUGIN.name}  ({size_kb:.0f} KB)")
    print(f"Frames: ~100 pages, all text live, photos = [PHOTO] placeholders")
    print(f"In Figma: remove old plugin, re-import manifest, click Build.")""",
"""    PLUGIN.write_bytes(code.encode("utf-8"))
    size_kb = PLUGIN.stat().st_size / 1024
    print(f"Wrote {PLUGIN.name}  ({size_kb:.0f} KB)")

    # Split data artifact (directive): catalogue-layout.json next to the
    # plugin AND under public/catalogue/figma/ so it deploys (a fetchable,
    # version-controlled record of the exact layout the plugin renders).
    layout_path = PLUGIN.parent / "catalogue-layout.json"
    layout_path.write_text(data_json, encoding="utf-8")
    hosted = ROOT.parent / "public" / "catalogue" / "figma"
    hosted.mkdir(parents=True, exist_ok=True)
    (hosted / "catalogue-layout.json").write_text(data_json, encoding="utf-8")
    print(f"Wrote catalogue-layout.json  ({len(data_json)/1024:.0f} KB)  -> plugin + public/catalogue/figma/")
    print(f"NOTE: do NOT run embed_images (that base64 bank is what dark-screened Figma).")
    print(f"In Figma: remove old plugin, re-import manifest, Build (All or by section).")""")

p.write_text(s, encoding="utf-8")
print(f"patched generate_plugin.py — {n} edits applied")
