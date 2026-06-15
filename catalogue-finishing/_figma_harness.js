// Headless test harness: runs the plugin's code.js against a mocked Figma
// Plugin API to catch RUNTIME errors (scope / logic / FONT) that `node --check`
// can't. Counts frames appended; reports any throw + notify/postMessage traffic.
//
// v2 — FONT-AWARE. The v1 mock no-op'd loadFontAsync, so it was blind to the
// bug that drew nothing in real Figma: `loadFontAsync({family:"Inter",
// style:"SemiBold"})` — real Figma's semibold is "Semi Bold" WITH A SPACE, so
// that call rejects and aborts the build before any frame. Now:
//   • loadFontAsync MIMICS real Figma — only real Inter styles resolve; an
//     unknown style (e.g. "SemiBold") REJECTS, and is recorded as a reject.
//   • every requested (family,style) is tracked vs. every one that loaded.
//   • setting `.characters` on a TEXT node whose fontName was never loaded
//     THROWS, exactly like real Figma ("unloaded font").
//   • a static wiring check confirms ui.html posts the {pluginMessage:{type}}
//     shape the code.js handler switches on (guards suspect #2 from regressing).
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const CODE = path.resolve(__dirname, "../catalog-print-build/figma-plugin/code.js");
const UI = path.resolve(__dirname, "../catalog-print-build/figma-plugin/ui.html");
const src = fs.readFileSync(CODE, "utf8");

// The Inter styles real Figma actually exposes (what loadFontAsync accepts).
// Note the SPACE in "Semi Bold" / "Extra Bold" / "Extra Light" — the gotcha.
const REAL_INTER_STYLES = new Set([
  "Thin", "Thin Italic", "Extra Light", "Extra Light Italic", "Light", "Light Italic",
  "Regular", "Italic", "Medium", "Medium Italic", "Semi Bold", "Semi Bold Italic",
  "Bold", "Bold Italic", "Extra Bold", "Extra Bold Italic", "Black", "Black Italic",
]);
const fontKey = (fn) => (fn && fn.family) + " " + (fn && fn.style);
const requestedFonts = new Set();
const loadedFonts = new Set();
const fontRejects = [];      // styles real Figma would reject (e.g. "Inter SemiBold")
const unloadedWrites = [];   // .characters written on a node whose font wasn't loaded

// permissive node stub: stores set props (so reads like f.name.replace work),
// returns chainable callables for unknown methods. TEXT nodes additionally
// validate that their fontName was loaded before `.characters` is written.
function node(kind) {
  const store = { type: kind || "NODE", children: [] };
  if (kind === "TEXT") store.fontName = { family: "Inter", style: "Regular" }; // Figma default
  const px = new Proxy(function () {}, {
    get(_t, k) {
      if (k === "then") return undefined; // never thenable
      if (k in store) return store[k];
      if (k === "appendChild") return (c) => { store.children.push(c); return c; };
      if (k === "resize" || k === "resizeWithoutConstraints") return () => {};
      if (k === "getRangeFontName" || k === "getRangeFills") return () => ({});
      return () => node();           // any other method → chainable stub
    },
    set(_t, k, v) {
      if (k === "characters" && kind === "TEXT") {
        const key = fontKey(store.fontName);
        if (!loadedFonts.has(key)) {
          unloadedWrites.push(key);
          throw new Error("Cannot write to TextNode with unloaded font: " + key);
        }
      }
      store[k] = v; return true;
    },
    apply() { return node(); },
  });
  return px;
}

let appended = 0;
const notifies = [];
const posts = [];
let onmsg = null;

const figma = {
  mixed: Symbol("mixed"),
  loadFontAsync: async (fn) => {
    requestedFonts.add(fontKey(fn));
    if (fn && fn.family === "Inter" && !REAL_INTER_STYLES.has(fn.style)) {
      fontRejects.push(fontKey(fn));
      throw new Error('Cannot load font "Inter ' + fn.style + '": not a real Figma style ' +
        '(real names have a SPACE, e.g. "Semi Bold").');
    }
    loadedFonts.add(fontKey(fn));
  },
  createFrame: () => node("FRAME"),
  createText: () => node("TEXT"),
  createRectangle: () => node("RECTANGLE"),
  createEllipse: () => node("ELLIPSE"),
  createComponent: () => node("COMPONENT"),
  createPage: () => node("PAGE"),
  createImage: () => ({ hash: "deadbeef" }),
  createPaintStyle: () => node("PAINTSTYLE"),
  createTextStyle: () => node("TEXTSTYLE"),
  getLocalTextStyles: () => [],
  getLocalPaintStyles: () => [],
  getLocalEffectStyles: () => [],
  currentPage: { appendChild: (f) => { appended++; }, children: [], selection: [] },
  root: { children: [] },
  viewport: { scrollAndZoomIntoView: () => {} },
  notify: (m) => { notifies.push(String(m)); },
  closePlugin: (m) => { if (m) notifies.push("closePlugin:" + m); },
  showUI: () => {},
  ui: { postMessage: (m) => posts.push(m), set onmessage(fn) { onmsg = fn; }, get onmessage() { return onmsg; } },
};

const sandbox = {
  figma, __html__: "<html></html>", console,
  setTimeout, clearTimeout, Promise, Symbol, Math, JSON, String, Number, Array, Object,
};

// Static wiring check (suspect #2): the harness calls onmessage directly and so
// bypasses the real UI→code postMessage hop. Verify by inspection that ui.html
// posts the {pluginMessage:{type:...}} shape the handler reads, so a future
// rename can't silently break "click does nothing".
function wiringCheck() {
  let ui;
  try { ui = fs.readFileSync(UI, "utf8"); } catch (e) { return "ui.html not found — skipped"; }
  const okShape = /pluginMessage\s*:\s*\{[^}]*type\s*:/.test(ui);
  const okBuild = /type:\s*['"]build['"]/.test(ui);
  const handlerReads = /msg\.type\s*[=!]==\s*["']build["']/.test(src);  // === or !== (early-return)
  return (okShape && okBuild && handlerReads)
    ? "OK (ui posts pluginMessage.type='build'; handler switches on msg.type)"
    : `MISMATCH — ui pluginMessage.type:${okShape} ui 'build':${okBuild} handler msg.type==='build':${handlerReads}`;
}

(async () => {
  try {
    vm.runInNewContext(src, sandbox, { filename: "code.js" });
  } catch (e) {
    console.log("LOAD ERROR:", e.message); process.exit(1);
  }
  if (typeof onmsg !== "function") { console.log("NO onmessage registered"); process.exit(1); }
  const section = process.argv[2] || "all";
  let threw = null;
  try {
    await onmsg({ type: "build", section });
  } catch (e) {
    threw = e;   // NB: code.js's handler catches internally, so most build
                 // failures surface via fontRejects/unloadedWrites, not here.
  }

  console.log("wiring:", wiringCheck());
  console.log("fonts requested:", [...requestedFonts].join("  ·  ") || "(none)");
  console.log("fonts loaded:   ", [...loadedFonts].join("  ·  ") || "(none)");
  if (fontRejects.length)    console.log("FONT REJECTS (real Figma would FAIL):", [...new Set(fontRejects)].join(", "));
  if (unloadedWrites.length) console.log("UNLOADED-FONT WRITES:", [...new Set(unloadedWrites)].join(", "));

  const fontProblem = fontRejects.length || unloadedWrites.length;
  if (threw || fontProblem) {
    console.log(`BUILD FAILED (section=${section}) — frames appended: ${appended}`);
    if (threw) {
      console.log("threw:", threw.message);
      console.log((threw.stack || "").split("\n").slice(0, 4).join("\n"));
    }
    process.exit(2);
  }
  console.log(`BUILD OK (section=${section}) — frames appended: ${appended}`);
  console.log("notify:", notifies.slice(0, 6));
  console.log("posts (last):", JSON.stringify(posts.slice(-2)));
})();
