/**
 * Sanity read/write operations for the prize-draw flow.
 *
 *   - emailAlreadyEntered() — dedup check (no-cache read, lower-cased match)
 *   - writeEntry()          — create a prizeDrawEntry document
 *   - writeAudit()          — append a prizeDrawAudit row
 *
 * All writes use SANITY_API_WRITE_TOKEN. Without it, writeEntry / writeAudit
 * become no-ops so local dev works without secrets — but the API route logs
 * the skip clearly so it can't go unnoticed in production by accident.
 */

import { createClient, type SanityClient } from "@sanity/client";
import { clientNoCache } from "../sanity.client";
import type { RateLimitBackend } from "./rate-limit";

let cachedWriteClient: SanityClient | null = null;

function getWriteClient(): SanityClient | null {
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  if (!writeToken) return null;
  if (cachedWriteClient) return cachedWriteClient;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";
  cachedWriteClient = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token: writeToken,
    useCdn: false,
  });
  return cachedWriteClient;
}

// ── Email dedup ───────────────────────────────────────────────────────────
// Case-insensitive — we lowercase on both sides. Uses no-cache to avoid a
// stale dedup miss within seconds of a prior entry.
export async function emailAlreadyEntered(emailLower: string): Promise<boolean> {
  const query =
    'count(*[_type == "prizeDrawEntry" && lower(email) == $email]) > 0';
  try {
    const found = await clientNoCache.fetch<boolean>(query, { email: emailLower });
    return found === true;
  } catch (err) {
    // Fail-open on transient Sanity errors — better to allow a possible
    // duplicate than to lock a legit entrant out of the draw.
    console.warn("[connect/sanity-ops] dedup query failed, allowing through:", err);
    return false;
  }
}

// ── Write entry ───────────────────────────────────────────────────────────
export interface EntryDoc {
  name:           string;
  email:          string;
  company:        string;
  role?:          string;
  phone?:         string;
  optInMarketing: boolean;
}

export async function writeEntry(doc: EntryDoc): Promise<{ written: boolean; id?: string }> {
  const client = getWriteClient();
  if (!client) {
    console.warn("[connect/sanity-ops] SANITY_API_WRITE_TOKEN missing — entry skipped.");
    return { written: false };
  }
  const created = await client.create({
    _type: "prizeDrawEntry",
    name:           doc.name,
    email:          doc.email,
    company:        doc.company,
    role:           doc.role,
    phone:          doc.phone,
    optInMarketing: doc.optInMarketing,
    source:         "booth-connect",
    submittedAt:    new Date().toISOString(),
  });
  return { written: true, id: created._id };
}

// ── Audit log ─────────────────────────────────────────────────────────────
export type AuditOutcome =
  | "success"
  | "duplicate"
  | "rate_limited"
  | "bot_timing"
  | "origin_rejected"
  | "validation_failed"
  | "nonce_invalid"
  | "server_error";

export interface AuditDoc {
  outcome:          AuditOutcome;
  reason:           string;
  hashedIp:         string;
  userAgentPrefix:  string;
  rateLimitBackend?: RateLimitBackend;
}

export async function writeAudit(doc: AuditDoc): Promise<void> {
  const client = getWriteClient();
  if (!client) return; // no token, skip silently — dev/preview without secrets
  try {
    await client.create({
      _type:            "prizeDrawAudit",
      timestamp:        new Date().toISOString(),
      outcome:          doc.outcome,
      reason:           doc.reason,
      hashedIp:         doc.hashedIp,
      userAgentPrefix:  doc.userAgentPrefix,
      rateLimitBackend: doc.rateLimitBackend,
    });
  } catch (err) {
    // Never let an audit-write failure break the user-facing flow.
    console.warn("[connect/sanity-ops] audit write failed:", err);
  }
}
