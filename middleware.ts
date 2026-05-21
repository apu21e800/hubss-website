import { NextRequest, NextResponse } from "next/server";

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
  // Gate /admin/* and /studio/* behind Basic Auth.
  const path = req.nextUrl.pathname;
  if (
    path.startsWith("/admin") ||
    path.startsWith("/studio") ||
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
    "/admin/:path*",
    "/studio/:path*",
    "/api/blog/approve/:path*",
    "/api/blog/drafts/:path*",
    "/api/blog/generate/:path*",
    "/api/social/:path*",
  ],
};
