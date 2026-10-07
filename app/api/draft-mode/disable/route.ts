/**
 * GET /api/draft-mode/disable: turns Studio's preview off for this browser
 * and goes back to the live page. The "Exit preview" button on the site
 * (components/PreviewBanner.tsx) and Studio both use it.
 */

import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  (await draftMode()).disable();
  // Back to the page the visitor was on, and only ever on this site: the
  // address is resolved against our own origin and anything that lands on
  // another host ("//x.com", "/\x.com", a tab after the slash) goes home.
  const origin = request.nextUrl.origin;
  let to = "/";
  try {
    const dest = new URL(request.nextUrl.searchParams.get("to") ?? "/", origin);
    if (dest.origin === origin) to = dest.pathname + dest.search;
  } catch {
    // Not a parseable address: home.
  }
  return NextResponse.redirect(new URL(to, origin));
}
