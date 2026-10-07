/**
 * GET /api/draft-mode/disable — turns Studio's preview off for this browser
 * and goes back to the live page. The "Exit preview" button on the site
 * (components/PreviewBanner.tsx) and Studio both use it.
 */

import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  (await draftMode()).disable();
  // Back to the page the visitor was on, when it's one of ours.
  const back = request.nextUrl.searchParams.get("to");
  const to = back && back.startsWith("/") && !back.startsWith("//") ? back : "/";
  return NextResponse.redirect(new URL(to, request.url));
}
