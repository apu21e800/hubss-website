import { NextRequest, NextResponse } from "next/server";

// ── Catalogue feature gate ───────────────────────────────────────────────────
// Mirrors lib/feature-flags.ts (kept inline because middleware runs on Edge
// runtime and we want zero external imports). NEXT_PUBLIC_SHOW_CATALOGUE is
// the explicit override; absent that, hidden on Vercel production only.
function isCatalogueVisible(): boolean {
  const raw = (process.env.NEXT_PUBLIC_SHOW_CATALOGUE ?? "").toLowerCase();
  if (raw === "1" || raw === "true" || raw === "on" || raw === "yes") return true;
  if (raw === "0" || raw === "false" || raw === "off" || raw === "no") return false;
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;
  return vercelEnv !== "production";
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

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

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
  ],
};
