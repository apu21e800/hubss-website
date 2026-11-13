import { NextRequest, NextResponse } from "next/server";

// ── Catalogue feature gate ───────────────────────────────────────────────────
// Mirrors lib/feature-flags.ts (kept inline because middleware runs on Edge
// runtime and we want zero external imports). NEXT_PUBLIC_SHOW_CATALOGUE is the
// explicit override; absent that, visible - same default as the flag module.
// These two drifted before: the flag said "hidden everywhere" while this said
// "hidden on production only", so previews served a page the flag had disowned.
function isCatalogueVisible(): boolean {
  const raw = (process.env.NEXT_PUBLIC_SHOW_CATALOGUE ?? "").toLowerCase();
  if (raw === "1" || raw === "true" || raw === "on" || raw === "yes") return true;
  if (raw === "0" || raw === "false" || raw === "off" || raw === "no") return false;
  return true;
}

// ── Admin Basic Auth ─────────────────────────────────────────────────────────
// Protects /admin/* routes via HTTP Basic Auth.
// Set ADMIN_USER and ADMIN_PASSWORD in Vercel env vars. If either is missing,
// access is denied by default (fail-closed).
function requireAdminAuth(req: NextRequest): NextResponse | null {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Fail-closed: if creds aren't configured, lock the route entirely.
  if (!adminUser || !adminPassword) {
    return new NextResponse("Admin disabled — credentials not configured.", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="HUBSS Admin", charset="UTF-8"',
        "Content-Type": "text/plain",
      },
    });
  }

  // Decode "user:password" from base64
  const encoded = header.slice("Basic ".length).trim();
  let decoded = "";
  try {
    decoded = atob(encoded);
  } catch {
    return new NextResponse("Malformed credentials.", { status: 400 });
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) {
    return new NextResponse("Malformed credentials.", { status: 400 });
  }
  const user = decoded.slice(0, sep);
  const password = decoded.slice(sep + 1);

  if (user !== adminUser || password !== adminPassword) {
    return new NextResponse("Invalid credentials.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="HUBSS Admin", charset="UTF-8"',
        "Content-Type": "text/plain",
      },
    });
  }

  return null;
}

// ── The 2.0 preview's key (13 Nov 2026) ─────────────────────────────────────
// HUBSS 2.0 lives on one branch's Vercel preview until Vernon offers it to
// HUB. A preview opens for anyone who has its address, and that address can
// be worked out from the branch's name, which anyone can read in this
// repository. So this one preview asks for a key: the link Vernon was sent
// carries it once (?key=...), and a cookie remembers it for 30 days. Only the
// key's SHA-256 is written here; the key itself is on the 21e8 Motherboard.
//
// It runs on that branch's preview and nowhere else: never hubss.com, never
// the review copy, never a local or CI build (Vercel sets neither variable
// there). BEFORE 2.0 MERGES TO MAIN: take this block out, and the catch-all
// line at the end of the matcher with it (it sends every request through
// this file).
const PREVIEW_BRANCH = "feat/hubss-2";
const PREVIEW_KEY_SHA256 = "a4e017ff18bb2b98425681f2f09da47faf80803dd9ff456f025fd68f5e11cb52";
const PREVIEW_COOKIE = "hubss2";

function isKeyedPreview(): boolean {
  return process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF === PREVIEW_BRANCH;
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compared in full, so the time taken says nothing about where two strings part. */
function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function holdsKey(value: string | null | undefined): Promise<boolean> {
  if (!value || value.length > 200) return false;
  return sameText(await sha256Hex(value), PREVIEW_KEY_SHA256);
}

async function requirePreviewKey(req: NextRequest): Promise<NextResponse | null> {
  const offered = req.nextUrl.searchParams.get("key");
  if (await holdsKey(offered)) {
    // Keep the key out of the address bar, the history and any referrer.
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("key");
    const res = NextResponse.redirect(clean, 307);
    res.cookies.set(PREVIEW_COOKIE, offered as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
  if (await holdsKey(req.cookies.get(PREVIEW_COOKIE)?.value)) return null;
  return new NextResponse("This preview is private. Open it with the link you were sent.", {
    status: 401,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // The 2.0 preview asks for its key before anything else (above).
  if (isKeyedPreview()) {
    const denied = await requirePreviewKey(req);
    if (denied) return denied;
  }

  // Feature-gated catalogue. Redirects to /resources with HTTP 307 when off
  // so visitors land somewhere useful. Done in middleware (not the page) so
  // we get a real HTTP status — Next 16's notFound()/redirect() from a
  // force-dynamic server component returns 200 with the redirect body, which
  // is bad for SEO.
  if (path === "/catalogue" || path.startsWith("/catalogue/")) {
    if (!isCatalogueVisible()) {
      return NextResponse.redirect(new URL("/resources", req.url), 307);
    }
  }

  // Gate /admin/* behind Basic Auth.
  //
  // /studio is deliberately NOT gated here. Sanity Studio has its own per-user
  // login (Google / GitHub / email) with a real audit trail of who changed what.
  // Putting a shared Basic Auth password in front of it meant two passwords for
  // one CMS and no way to tell editors apart — worse security AND worse UX.
  // Studio is noindex by default and every write is authorised by Sanity.
  if (
    path.startsWith("/admin") ||
    path.startsWith("/api/blog/approve") ||
    path.startsWith("/api/blog/drafts") ||
    path.startsWith("/api/blog/generate") ||
    path.startsWith("/api/social/")
  ) {
    const denied = requireAdminAuth(req);
    if (denied) return denied;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/catalogue",
    "/catalogue/:path*",
    "/admin/:path*",
    "/api/blog/approve/:path*",
    "/api/blog/drafts/:path*",
    "/api/blog/generate/:path*",
    "/api/social/:path*",
    // Everything else, for the 2.0 preview's key only (see above). Remove with it.
    "/((?!_next/static|_next/image).*)",
  ],
};
