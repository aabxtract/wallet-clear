// ---------------------------------------------------------------------------
// Simple in-memory rate limiter
// ---------------------------------------------------------------------------
// Max `limit` requests per `windowMs` per IP address.
// Uses a Map with automatic cleanup of expired entries.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup every 60 seconds to prevent memory leaks
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of Array.from(store.entries())) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

// ---------------------------------------------------------------------------
// rateLimit
// ---------------------------------------------------------------------------

interface RateLimitConfig {
  /** Maximum requests allowed in the window. Default: 10 */
  limit?: number;
  /** Time window in milliseconds. Default: 60_000 (1 minute) */
  windowMs?: number;
}

interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
}

/**
 * Check whether a request from `ip` is within the rate limit.
 *
 * @returns `{ allowed, remaining }`
 */
export function rateLimit(
  ip: string,
  config: RateLimitConfig = {},
): RateLimitResult {
  const { limit = 10, windowMs = 60_000 } = config;
  const now = Date.now();

  cleanup();

  const existing = store.get(ip);

  // First request or window has expired → reset
  if (!existing || now > existing.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  // Within window
  existing.count += 1;

  if (existing.count > limit) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: limit - existing.count };
}
