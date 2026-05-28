import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PrizeDrawPayload {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  phone?: string;
  optInMarketing?: boolean;
  website?: string; // honeypot
}

// ── In-memory rate limit (1 submission per IP per 30 seconds) ─────────────
// Module-level Map — survives across requests within a single serverless
// instance. Good enough to block hammering at the booth; not a defense
// against distributed abuse. The page is unindexed anyway.
const lastSeen = new Map<string, number>();
const RATE_WINDOW_MS = 30_000;

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PrizeDrawPayload;

    // Honeypot: silently succeed so bots don't learn the trap.
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const company = (body.company ?? "").trim();
    const role = (body.role ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const optInMarketing = body.optInMarketing === true;

    if (!name || !email || !company) {
      return NextResponse.json(
        { error: "Name, email, and company are required." },
        { status: 400 }
      );
    }
    if (!validEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const now = Date.now();
    const previous = lastSeen.get(ip);
    if (previous && now - previous < RATE_WINDOW_MS) {
      return NextResponse.json(
        { error: "Please wait a moment before submitting again." },
        { status: 429 }
      );
    }
    lastSeen.set(ip, now);

    // Sanity write — graceful no-op when token missing (e.g. local dev
    // without the secret). Preview/production on Vercel will write live.
    const writeToken = process.env.SANITY_API_WRITE_TOKEN;
    if (!writeToken) {
      console.warn("[prize-draw] SANITY_API_WRITE_TOKEN missing — skipping write.");
      return NextResponse.json({ success: true, dev: true });
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      token: writeToken,
      useCdn: false,
    });

    await writeClient.create({
      _type: "prizeDrawEntry",
      name,
      email,
      company,
      role: role || undefined,
      phone: phone || undefined,
      optInMarketing,
      source: "booth-connect",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[prize-draw] error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
