import "server-only";

import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { authRateLimits } from "@/lib/db/schema";

const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

function hashKey(identifier: string): string {
  return createHash("sha256").update(identifier).digest("hex");
}

export async function consumeAuthRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  if (!identifier || identifier.length > 500) {
    throw new Error("INVALID_RATE_LIMIT_IDENTIFIER");
  }

  const keyHash = hashKey(identifier);
  const now = new Date();
  const db = getDb();

  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${keyHash}))`);

    const rows = await tx
      .select()
      .from(authRateLimits)
      .where(eq(authRateLimits.keyHash, keyHash))
      .limit(1);

    const current = rows[0];

    if (current?.blockedUntil && current.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.ceil(
          (current.blockedUntil.getTime() - now.getTime()) / 1000,
        ),
      };
    }

    const windowExpired =
      !current ||
      now.getTime() - current.windowStartedAt.getTime() >= WINDOW_MS;

    const attempts = windowExpired ? 0 : current.attempts;

    if (attempts >= MAX_ATTEMPTS) {
      const blockedUntil = new Date(now.getTime() + BLOCK_MS);

      await tx
        .update(authRateLimits)
        .set({ blockedUntil, updatedAt: now })
        .where(eq(authRateLimits.keyHash, keyHash));

      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.ceil(BLOCK_MS / 1000),
      };
    }

    const nextAttempts = attempts + 1;

    if (current) {
      await tx
        .update(authRateLimits)
        .set({
          attempts: nextAttempts,
          windowStartedAt: windowExpired ? now : current.windowStartedAt,
          blockedUntil: null,
          updatedAt: now,
        })
        .where(eq(authRateLimits.keyHash, keyHash));
    } else {
      await tx.insert(authRateLimits).values({
        keyHash,
        attempts: nextAttempts,
        windowStartedAt: now,
        updatedAt: now,
      });
    }

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - nextAttempts,
      retryAfterSeconds: 0,
    };
  });
}

export async function clearAuthRateLimit(identifier: string) {
  if (!identifier || identifier.length > 500) return;

  const db = getDb();
  const keyHash = hashKey(identifier);

  await db.delete(authRateLimits).where(eq(authRateLimits.keyHash, keyHash));
}
