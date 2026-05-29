/**
 * Hardening primitives for /connect prize-draw flow.
 *
 * All helpers fail-safe: on a missing env var or transient external failure,
 * they degrade rather than blocking legitimate users. The combined defense
 * is the seven-layer stack documented in lib/connect/README.md (origin →
 * nonce/timing → length caps → email regex → strip HTML → MX → rate limit →
 * dedup), so any single check failing open still leaves five layers active.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { resolveMx } from "node:dns/promises";

// ── Constants ─────────────────────────────────────────────────────────────
export const NONCE_MIN_AGE_MS = 3_000;      // anything faster than 3s = bot
export const NONCE_MAX_AGE_MS = 60 * 60_000; // 60 min — stale form / replay

export const FIELD_LIMITS = {
  name:    100,
  email:   200,
  company: 200,
  role:    100,
  phone:   30,
};

// Allow-listed origins. `*.vercel.app` is matched by suffix below so every
// branch preview URL works without per-branch config.
const ALLOWED_ORIGIN_HOSTS = new Set<string>([
  "hubss.com",
  "www.hubss.com",
]);

// ── Secret resolution ─────────────────────────────────────────────────────
// HMAC + IP-salt secrets. If unset, fall back to a per-deploy derived value
// so the system still works without explicit config (Vernon can set both
// explicitly for stronger guarantees — see README in this dir).
function resolveSecret(envName: string, suffix: string): string {
  const explicit = process.env[envName];
  if (explicit && explicit.length > 0) return explicit;
  const deployId =
    process.env.VERCEL_DEPLOYMENT_ID ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.VERCEL_URL ??
    "local-dev";
  return createHash("sha256").update(`${deployId}:${suffix}`).digest("hex");
}

const HMAC_SECRET = resolveSecret("CONNECT_HMAC_SECRET", "hmac");
const IP_SALT     = resolveSecret("CONNECT_IP_SALT",     "ip-salt");

// ── IP utilities ──────────────────────────────────────────────────────────
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function hashIp(raw: string): string {
  return createHash("sha256").update(`${IP_SALT}:${raw}`).digest("hex").slice(0, 32);
}

// ── Origin allowlist ──────────────────────────────────────────────────────
export function isOriginAllowed(req: Request): boolean {
  const origin  = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // Use the Origin header when present (always set by browsers on POST);
  // fall back to Referer for clients that only send that.
  const candidate = origin ?? referer;
  if (!candidate) return false;

  let host: string;
  try {
    host = new URL(candidate).host.toLowerCase();
  } catch {
    return false;
  }

  // Strip port for matching
  const hostNoPort = host.replace(/:\d+$/, "");

  if (ALLOWED_ORIGIN_HOSTS.has(hostNoPort)) return true;

  // Any vercel.app preview host
  if (hostNoPort.endsWith(".vercel.app")) return true;

  // Local dev
  if (process.env.NODE_ENV !== "production") {
    if (hostNoPort === "localhost" || hostNoPort === "127.0.0.1") return true;
  }

  return false;
}

// ── HMAC-signed form nonce ────────────────────────────────────────────────
// Format: `${tsMs}.${randomHex}.${sigHex}`. Server-only secret signs the
// pair so the timestamp can't be forged to bypass the timing window.
export function issueNonce(): { token: string; ts: number } {
  const ts = Date.now();
  const rand = randomBytes(12).toString("hex");
  const sig = createHmac("sha256", HMAC_SECRET)
    .update(`${ts}.${rand}`)
    .digest("hex");
  return { token: `${ts}.${rand}.${sig}`, ts };
}

export type NonceVerdict =
  | { ok: true; ts: number }
  | { ok: false; reason: "missing" | "malformed" | "bad_signature" | "too_fast" | "too_old" };

export function verifyNonce(token: unknown): NonceVerdict {
  if (typeof token !== "string" || token.length < 16) {
    return { ok: false, reason: "missing" };
  }
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed" };
  const [tsStr, rand, sig] = parts;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return { ok: false, reason: "malformed" };

  const expected = createHmac("sha256", HMAC_SECRET)
    .update(`${tsStr}.${rand}`)
    .digest("hex");
  // Constant-time compare
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(sig, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "bad_signature" };
  }

  const age = Date.now() - ts;
  if (age < NONCE_MIN_AGE_MS) return { ok: false, reason: "too_fast" };
  if (age > NONCE_MAX_AGE_MS) return { ok: false, reason: "too_old" };

  return { ok: true, ts };
}

// ── Field hygiene ─────────────────────────────────────────────────────────
const HTML_TAG_RE = /<\/?[a-z][^>]*>/gi;

export function stripHtml(s: string): string {
  return s.replace(HTML_TAG_RE, "").replace(/[\r\n\t]+/g, " ").trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isPlausibleEmail(s: string): boolean {
  return EMAIL_RE.test(s) && s.length <= FIELD_LIMITS.email;
}

const PHONE_RE = /^[+]?[\d\s().\-]{6,}$/;

export function isPlausiblePhone(s: string): boolean {
  return PHONE_RE.test(s) && s.length <= FIELD_LIMITS.phone;
}

export interface NormalizedPayload {
  name:           string;
  email:          string;       // lowercased
  emailRaw:       string;       // exact case as submitted (for record-keeping)
  company:        string;
  role?:          string;
  phone?:         string;
  optInMarketing: boolean;
}

export type ValidationResult =
  | { ok: true; payload: NormalizedPayload }
  | { ok: false; reason: string };

// Server-side validation — never trust client.
export function validateAndNormalize(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object") return { ok: false, reason: "payload_not_object" };
  const r = raw as Record<string, unknown>;

  const pickStr = (v: unknown, limit: number): string => {
    if (typeof v !== "string") return "";
    const clean = stripHtml(v);
    return clean.length > limit ? clean.slice(0, limit) : clean;
  };

  const name    = pickStr(r.name,    FIELD_LIMITS.name);
  const company = pickStr(r.company, FIELD_LIMITS.company);
  const role    = pickStr(r.role,    FIELD_LIMITS.role);
  const phone   = pickStr(r.phone,   FIELD_LIMITS.phone);
  const emailRaw = pickStr(r.email,  FIELD_LIMITS.email);
  const email = emailRaw.toLowerCase();
  const optInMarketing = r.optInMarketing === true;

  if (!name)    return { ok: false, reason: "missing_name" };
  if (!email)   return { ok: false, reason: "missing_email" };
  if (!company) return { ok: false, reason: "missing_company" };
  if (!isPlausibleEmail(email)) return { ok: false, reason: "bad_email" };
  if (phone && !isPlausiblePhone(phone)) return { ok: false, reason: "bad_phone" };

  return {
    ok: true,
    payload: {
      name,
      email,
      emailRaw,
      company,
      role: role || undefined,
      phone: phone || undefined,
      optInMarketing,
    },
  };
}

// ── MX-record check (fail-open) ───────────────────────────────────────────
// Rejects domains that publish no MX records. Short timeout, fail-open on
// transient DNS errors so legit users aren't punished by network blips.
export async function emailDomainHasMx(email: string, timeoutMs = 1500): Promise<boolean> {
  const at = email.lastIndexOf("@");
  if (at < 0) return false;
  const domain = email.slice(at + 1);
  if (!domain || domain.length > 253) return false;

  const lookup = (async () => {
    try {
      const records = await resolveMx(domain);
      return records.length > 0;
    } catch {
      // NXDOMAIN, NODATA, etc. — treat as fail; the email regex already
      // matched, so the user gets a generic "try again" message.
      return false;
    }
  })();

  const timeout = new Promise<true>((resolve) =>
    setTimeout(() => resolve(true), timeoutMs)  // fail-open on timeout
  );

  return Promise.race([lookup, timeout]);
}

// ── UA prefix (audit log only) ────────────────────────────────────────────
export function uaPrefix(req: Request, limit = 100): string {
  const ua = req.headers.get("user-agent") ?? "";
  return ua.slice(0, limit);
}
