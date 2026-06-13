// Headless test harness: runs the plugin's code.js against a mocked Figma
// Plugin API to catch RUNTIME errors (scope/logic) that `node --check` can't.
// Counts frames appended; reports any throw + notify/postMessage traffic.
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const CODE = path.resolve(__dirname, "../catalog-print-build/figma-plugin/code.js");
const src = fs.readFileSync(CODE, "utf8");

// permissive node stub: stores set props (so reads like f.name.replace work),
// returns chainable callables for unknown methods.
function node(kind) {
  const store = { type: kind || "NODE", children: [] };
  const px = new Proxy(function () {}, {
    get(_t, k) {
      if (k === "then") return undefined; // never thenable
      if (k in store) return store[k];
      if (k === "appendChild") return (c) => { store.children.push(c); return c; };
      if (k === "resize" || k === "resizeWithoutConstraints") return () => {};
      if (k === "getRangeFontName" || k === "getRangeFills") return () => ({});
      return () => node();           // any other method → chainable stub
    },
    set(_t, k, v) { store[k] = v; return true; },
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
  loadFontAsync: async () => {},
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

(async () => {
  try {
    vm.runInNewContext(src, sandbox, { filename: "code.js" });
  } catch (e) {
    console.log("LOAD ERROR:", e.message); process.exit(1);
  }
  if (typeof onmsg !== "function") { console.log("NO onmessage registered"); process.exit(1); }
  const section = process.argv[2] || "all";
  try {
    await onmsg({ type: "build", section });
    console.log(`BUILD OK (section=${section}) — frames appended: ${appended}`);
    console.log("notify:", notifies.slice(0, 6));
    console.log("posts (last):", JSON.stringify(posts.slice(-2)));
  } catch (e) {
    console.log(`BUILD THREW (section=${section}):`, e.message);
    console.log(e.stack.split("\n").slice(0, 4).join("\n"));
    process.exit(2);
  }
})();
