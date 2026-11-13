// The Grey look, for the check scripts. Every script here opens `${base}${path}`, and
// the look is the site's default (Blue) unless the browser has chosen: this stands in
// front of a local build and serves the same pages with Grey as the default, so the
// same scripts check the second look unchanged.
//   npx next start -p 4311 &
//   node scripts/hubss-2/as-grey.mjs 4311 4312 &
//   node scripts/hubss-2/a11y.mjs https://hubss.com http://localhost:4312
// Only the <html> tag's data-tone and the bootstrap's fallback change. Nothing else.
import http from "node:http";
const [from = "4311", to = "4312"] = process.argv.slice(2);
http
  .createServer((req, res) => {
    const headers = { ...req.headers, host: `localhost:${from}`, "accept-encoding": "identity" };
    const up = http.request({ host: "localhost", port: Number(from), path: req.url, method: req.method, headers }, (r) => {
      const type = String(r.headers["content-type"] ?? "");
      if (!type.includes("text/html")) { res.writeHead(r.statusCode ?? 502, r.headers); r.pipe(res); return; }
      const chunks = [];
      r.on("data", (c) => chunks.push(c));
      r.on("end", () => {
        const html = Buffer.concat(chunks).toString("utf8").replaceAll('data-tone="blue"', 'data-tone="grey"').replaceAll("{o='blue'}", "{o='grey'}");
        const out = Buffer.from(html, "utf8");
        const h = { ...r.headers, "content-length": String(out.length) };
        delete h["transfer-encoding"]; delete h["content-encoding"];
        res.writeHead(r.statusCode ?? 502, h); res.end(out);
      });
    });
    up.on("error", () => { res.writeHead(502); res.end("the build on " + from + " is not answering"); });
    req.pipe(up);
  })
  .listen(Number(to), () => console.log(`the build on ${from}, in Grey, on ${to}`));
