/**
 * Tiered, persistent rate limiter for /api/connect/prize-draw.
 *
 * Tries backends in priority order, returning the first one that's
 * configured. No npm deps — REST APIs only.
 *
 *   1. Vercel KV     — KV_REST_API_URL + KV_REST_API_TOKEN
 *   2. Upstash Redis — UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *   3. Sanity audit  — counts rows in the audit log within the window
 *   4. In-memory     — last-resort (won't survive cold starts; here so the
 *                       limiter never returns "no protection at all")
 *
 * Two windows enforced per submission:
 *   - SHORT: 3 attempts per 10 min (legit human re-submits after typos)
 *   - LONG:  10 attempts per 24 h  (absolute cap)
 */

import { clientNoCache } from "../sanity.client";

export type RateLimitBackend = "kv" | "upstash" | "sanity" | "memory";

export interface RateLimitResult {
  allowed:        boolean;
  backend:        RateLimitBackend;
  shortCount:     number;
  longCount:      number;
  retryAfterSec?: number;
}

export const SHORT_WINDOW_SEC = 10 * 60;     // 10 min
export const SHORT_LIMIT      = 3;
export const LONG_WINDOW_SEC  = 24 * 60 * 60; // 24 h
export const LONG_LIMIT       = 10;

// ── In-memory fallback ────────────────────────────────────────────────────
// Stored on globalThis so dev HMR / route module reloads can't wipe it
// mid-session. In a warm Lambda this is just a Map; in dev it survives
// hot-reload boundaries the same way.
const GLOBAL_KEY = "__hubss_connect_rl_memory__" as const;
type GlobalWithMem = typeof globalThis & { [GLOBAL_KEY]?: Map<string, number[]> };
const g = globalThis as GlobalWithMem;
const memoryHits: Map<string, number[]> = g[GLOBAL_KEY] ?? new Map<string, number[]>();
g[GLOBAL_KEY] = memoryHits;

function pruneMemory(hashedIp: string, now: number) {
  const cutoff = now - LONG_WINDOW_SEC * 1000;
  const arr = memoryHits.get(hashedIp);
  if (!arr) return [];
  const kept = arr.filter((t) => t >= cutoff);
  memoryHits.set(hashedIp, kept);
  return kept;
}

function recordMemory(hashedIp: string, now: number) {
  const kept = pruneMemory(hashedIp, now);
  kept.push(now);
  memoryHits.set(hashedIp, kept);
  return kept;
}

async function checkMemory(hashedIp: string): Promise<RateLimitResult> {
  const now = Date.now();
  const kept = recordMemory(hashedIp, now);
  const shortCount = kept.filter((t) => t >= now - SHORT_WINDOW_SEC * 1000).length;
  const longCount  = kept.length;
  const allowed = shortCount <= SHORT_LIMIT && longCount <= LONG_LIMIT;
  return {
    allowed,
    backend: "memory",
    shortCount,
    longCount,
    retryAfterSec: allowed ? undefined : SHORT_WINDOW_SEC,
  };
}

// ── Upstash REST (Vercel KV uses the same protocol) ───────────────────────
interface RedisCfg {
  url:   string;
  token: string;
  label: RateLimitBackend;
}

function pickRedisBackend(): RedisCfg | null {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return {
      url:   process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
      label: "kv",
    };
  }
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return {
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      label: "upstash",
    };
  }
  return null;
}

async function redisCommand(cfg: RedisCfg, command: (string | number)[]): Promise<unknown> {
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    // Don't cache rate-limit calls
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis HTTP ${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`Redis error: ${json.error}`);
  return json.result;
}

async function checkRedis(cfg: RedisCfg, hashedIp: string): Promise<RateLimitResult> {
  const shortKey = `connect:rl:s:${hashedIp}`;
  const longKey  = `connect:rl:l:${hashedIp}`;

  // INCR both keys, then set EXPIRE if this is the first write.
  // We do it in two pairs of round-trips — simple and well within the
  // call budget for a single API request.
  const shortCount = Number(await redisCommand(cfg, ["INCR", shortKey]));
  if (shortCount === 1) {
    await redisCommand(cfg, ["EXPIRE", shortKey, SHORT_WINDOW_SEC]);
  }
  const longCount = Number(await redisCommand(cfg, ["INCR", longKey]));
  if (longCount === 1) {
    await redisCommand(cfg, ["EXPIRE", longKey, LONG_WINDOW_SEC]);
  }

  const allowed = shortCount <= SHORT_LIMIT && longCount <= LONG_LIMIT;
  return {
    allowed,
    backend: cfg.label,
    shortCount,
    longCount,
    retryAfterSec: allowed ? undefined : SHORT_WINDOW_SEC,
  };
}

// ── Sanity audit-log fallback ─────────────────────────────────────────────
// Counts audit rows for this hashed IP inside each window. Doesn't write
// a counter — the audit row written by the API route caller is the
// "increment". Caveat: only consults the *audit log*, so the API route
// must always write the audit before returning. The orchestration code
// guarantees that.
async function checkSanity(hashedIp: string): Promise<RateLimitResult> {
  const now = new Date();
  const shortCutoff = new Date(now.getTime() - SHORT_WINDOW_SEC * 1000).toISOString();
  const longCutoff  = new Date(now.getTime() - LONG_WINDOW_SEC  * 1000).toISOString();

  const query = `{
    "short": count(*[_type == "prizeDrawAudit" && hashedIp == $hashedIp && timestamp > $shortCutoff]),
    "long":  count(*[_type == "prizeDrawAudit" && hashedIp == $hashedIp && timestamp > $longCutoff])
  }`;

  const result = (await clientNoCache.fetch<{ short: number; long: number }>(query, {
    hashedIp,
    shortCutoff,
    longCutoff,
  })) ?? { short: 0, long: 0 };

  // The current request would push these by 1 once the API route writes
  // its audit row, so compare against the +1 limit.
  const shortCount = result.short + 1;
  const longCount  = result.long  + 1;
  const allowed = shortCount <= SHORT_LIMIT && longCount <= LONG_LIMIT;
  return {
    allowed,
    backend: "sanity",
    shortCount,
    longCount,
    retryAfterSec: allowed ? undefined : SHORT_WINDOW_SEC,
  };
}

// ── Public entry point ────────────────────────────────────────────────────
export async function checkRateLimit(hashedIp: string): Promise<RateLimitResult> {
  const redisCfg = pickRedisBackend();
  if (redisCfg) {
    try {
      return await checkRedis(redisCfg, hashedIp);
    } catch (err) {
      console.warn(`[connect/rate-limit] ${redisCfg.label} backend failed, falling back:`, err);
    }
  }

  // Sanity fallback only works when the API route can actually WRITE audit
  // rows — otherwise the query always returns 0 and the limiter never bites.
  // If there's no write token, skip straight to the in-memory limiter.
  if (process.env.SANITY_API_WRITE_TOKEN) {
    try {
      return await checkSanity(hashedIp);
    } catch (err) {
      console.warn("[connect/rate-limit] Sanity backend failed, using memory:", err);
    }
  }

  return checkMemory(hashedIp);
}
