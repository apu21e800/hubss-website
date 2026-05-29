import { NextRequest, NextResponse } from "next/server";
import {
  getClientIp,
  hashIp,
  isOriginAllowed,
  verifyNonce,
  validateAndNormalize,
  emailDomainHasMx,
  uaPrefix,
} from "@/lib/connect/security";
import { checkRateLimit } from "@/lib/connect/rate-limit";
import {
  emailAlreadyEntered,
  writeEntry,
  writeAudit,
  type AuditOutcome,
} from "@/lib/connect/sanity-ops";

export const runtime = "nodejs";   // dns + crypto require node, not edge
export const dynamic = "force-dynamic";

// Generic message returned for anything that should NOT leak detail.
// Attackers learn nothing from "please try again later"; legit users still
// get a polite signal that the submit didn't go through.
const GENERIC_BLOCK_MSG = "Please try again later.";

// User-facing field message — kept simple. Server-side validation runs
// before this is returned, so the client just shows the message verbatim.
const VALIDATION_MSG = "Please check that your name, email, and company are filled in correctly.";

const DONE_COOKIE = "hbss_draw_done";

interface FailContext {
  outcome:          AuditOutcome;
  reason:           string;
  status:           number;
  body:             Record<string, unknown>;
  retryAfterSec?:   number;
  rateLimitBackend?: Awaited<ReturnType<typeof checkRateLimit>>["backend"];
}

export async function POST(req: NextRequest) {
  const ipRaw   = getClientIp(req);
  const hashed  = hashIp(ipRaw);
  const ua      = uaPrefix(req);
  // Shared audit context — every exit path writes one audit row.
  let rateLimitBackend: Awaited<ReturnType<typeof checkRateLimit>>["backend"] | undefined;

  const audit = (outcome: AuditOutcome, reason: string) =>
    writeAudit({ outcome, reason, hashedIp: hashed, userAgentPrefix: ua, rateLimitBackend });

  const fail = async (ctx: FailContext) => {
    rateLimitBackend = ctx.rateLimitBackend ?? rateLimitBackend;
    await audit(ctx.outcome, ctx.reason);
    const headers: Record<string, string> = {};
    if (ctx.retryAfterSec) headers["Retry-After"] = String(ctx.retryAfterSec);
    return NextResponse.json(ctx.body, { status: ctx.status, headers });
  };

  try {
    // ── Layer 4: Origin / Referer allowlist ─────────────────────────────
    // Cheapest check — does the request even come from one of our pages?
    // Kills curl / Postman scraper traffic before any work is done.
    if (!isOriginAllowed(req)) {
      return fail({
        outcome: "origin_rejected",
        reason:  `origin=${req.headers.get("origin") ?? "none"} referer=${req.headers.get("referer") ?? "none"}`,
        status:  403,
        body:    { error: GENERIC_BLOCK_MSG },
      });
    }

    // ── Parse body ──────────────────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return fail({
        outcome: "validation_failed",
        reason:  "body_not_json",
        status:  400,
        body:    { error: GENERIC_BLOCK_MSG },
      });
    }

    // ── Honeypot ────────────────────────────────────────────────────────
    // Silently succeed so bots don't learn it's a trap. NO audit write
    // either — we don't want to flood the log with bot hits, since by
    // design these never make it past this point.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    // ── Layer 3: Timing-based bot detection (HMAC nonce) ────────────────
    const verdict = verifyNonce(body.formToken);
    if (!verdict.ok) {
      // Only treat as bot when the form was filled too fast — other
      // failures (missing/malformed/bad-sig) are likely scraper attempts.
      const outcome: AuditOutcome =
        verdict.reason === "too_fast" ? "bot_timing" : "nonce_invalid";
      return fail({
        outcome,
        reason:  `nonce_${verdict.reason}`,
        status:  outcome === "bot_timing" ? 200 : 400,
        // For bot timing, return the GENERIC success so the bot doesn't
        // learn what tripped it. Bots that "succeed" but produce no
        // Sanity entry are exactly what we want.
        body: outcome === "bot_timing"
          ? { success: true }
          : { error: GENERIC_BLOCK_MSG },
      });
    }

    // ── Layer 5: Server-side validation ─────────────────────────────────
    const validation = validateAndNormalize(body);
    if (!validation.ok) {
      return fail({
        outcome: "validation_failed",
        reason:  validation.reason,
        status:  400,
        body:    { error: VALIDATION_MSG },
      });
    }
    const payload = validation.payload;

    // ── MX check on email domain (fail-open on DNS errors) ──────────────
    const hasMx = await emailDomainHasMx(payload.email);
    if (!hasMx) {
      return fail({
        outcome: "validation_failed",
        reason:  "no_mx_record",
        status:  400,
        body:    { error: VALIDATION_MSG },
      });
    }

    // ── Layer 2: Persistent rate limit ──────────────────────────────────
    const rl = await checkRateLimit(hashed);
    rateLimitBackend = rl.backend;
    if (!rl.allowed) {
      return fail({
        outcome:          "rate_limited",
        reason:           `short=${rl.shortCount}/${3} long=${rl.longCount}/${10} via=${rl.backend}`,
        status:           429,
        body:             { error: GENERIC_BLOCK_MSG },
        retryAfterSec:    rl.retryAfterSec,
        rateLimitBackend: rl.backend,
      });
    }

    // ── Layer 1: Email-based dedup ──────────────────────────────────────
    // Generic success either way — no email enumeration leak.
    if (await emailAlreadyEntered(payload.email)) {
      await audit("duplicate", `email=${payload.email.slice(0, 60)}`);
      // Set the cookie too, so subsequent GETs see the already-entered state.
      const res = NextResponse.json({ success: true });
      res.cookies.set(DONE_COOKIE, "1", {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge:   60 * 60 * 24, // 24h
        path:     "/",
      });
      return res;
    }

    // ── Write the entry ─────────────────────────────────────────────────
    const written = await writeEntry({
      name:           payload.name,
      email:          payload.email,
      company:        payload.company,
      role:           payload.role,
      phone:          payload.phone,
      optInMarketing: payload.optInMarketing,
    });

    await audit("success", written.written ? `id=${written.id}` : "dev_no_write");

    // ── Layer 6: Single-submission cookie ───────────────────────────────
    const res = NextResponse.json({ success: true });
    res.cookies.set(DONE_COOKIE, "1", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24, // 24h
      path:     "/",
    });
    return res;
  } catch (err) {
    console.error("[prize-draw] unexpected error:", err);
    await audit("server_error", String(err).slice(0, 200));
    return NextResponse.json({ error: GENERIC_BLOCK_MSG }, { status: 500 });
  }
}
