/* The Idea Book's service worker.
 *
 * Registered only by the reader (app/idea-book/CatalogueViewer.tsx), from
 * the site root so the app can start at /idea-book when it is opened from a
 * home screen. It touches three kinds of request and passes everything else
 * straight to the network, untouched:
 *
 *   1. The book's page rasters (/catalogue/<edition>/pNNN-WWW.webp): cache
 *      first. A page seen once is served from the cache after that, and
 *      "Save for offline" in the reader fills the same cache with every
 *      page at the phone width.
 *   2. The reader's own routes (/idea-book and below): network first, cache
 *      fallback, so the last version read still opens with no signal.
 *   3. The site's hashed build files (/_next/static/): cache first. Their
 *      names change with every build, so a stale copy can never be served.
 *
 * Bump CACHE when the shape of what is cached changes; old caches are
 * removed on activate.
 */
const CACHE = "idea-book-v1";
const PAGE = /^\/catalogue\/[^/]+\/p\d{3}-\d+\.webp$/;
const READER = /^\/idea-book(\/|$)/;
const BUILD = /^\/_next\/static\//;

self.addEventListener("install", (event) => {
  // The reader's own page, so the app has something to open with no signal
  // even if the first visit was the only visit.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add("/idea-book").catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("idea-book-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (PAGE.test(url.pathname) || BUILD.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (request.mode === "navigate" && READER.test(url.pathname)) {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, { ignoreSearch: false });
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    // The exact page, then the reader's front page, then any reader page we
    // have. The reader reads the page number from the address on mount, so
    // the front page's HTML opens at the page that was asked for.
    const exact = await cache.match(request, { ignoreSearch: true });
    if (exact) return exact;
    const front = await cache.match("/idea-book", { ignoreSearch: true });
    if (front) return front;
    const keys = await cache.keys();
    const any = keys.find((k) => /^\/idea-book(\/\d+)?$/.test(new URL(k.url).pathname));
    if (any) return cache.match(any);
    throw new Error("offline");
  }
}
