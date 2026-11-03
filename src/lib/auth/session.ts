import "server-only";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt, isNull, lte, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { authSessions, users } from "@/lib/db/schema";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type AuthUser = {
  id: string;
  userId: string;
  phone: string;
  displayName: string;
  role: string;
};

export async function createSession(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const db = getDb();
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(authSessions).values({
    id: randomUUID(),
    userId,
    tokenHash,
    expiresAt,
  });

  return {
    token,
    expiresAt,
  };
}

export async function verifySession(
  token: string | undefined,
): Promise<AuthUser | null> {
  if (!token || token.length > 200) {
    return null;
  }

  const db = getDb();
  const tokenHash = hashToken(token);
  const now = new Date();

  const result = await db
    .select({
      sessionId: authSessions.id,
      userId: users.id,
      publicUserId: users.userId,
      phone: users.phone,
      displayName: users.displayName,
      role: users.role,
    })
    .from(authSessions)
    .innerJoin(users, eq(authSessions.userId, users.id))
    .where(
      and(
        eq(authSessions.tokenHash, tokenHash),
        isNull(authSessions.revokedAt),
        gt(authSessions.expiresAt, now),
        eq(users.status, "active"),
        isNull(users.deletedAt),
      ),
    )
    .limit(1);

  const session = result[0];

  if (!session) {
    return null;
  }

  const lastSeenCutoff = new Date(now.getTime() - 5 * 60 * 1000);

  await db
    .update(authSessions)
    .set({ lastSeenAt: now })
    .where(
      and(
        eq(authSessions.id, session.sessionId),
        or(
          isNull(authSessions.lastSeenAt),
          lte(authSessions.lastSeenAt, lastSeenCutoff),
        ),
      ),
    );

  return {
    id: session.userId,
    userId: session.publicUserId,
    phone: session.phone,
    displayName: session.displayName,
    role: session.role,
  };
}

export async function revokeSession(token: string | undefined) {
  if (!token || token.length > 200) {
    return;
  }

  const db = getDb();
  const tokenHash = hashToken(token);

  await db
    .update(authSessions)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(authSessions.tokenHash, tokenHash),
        isNull(authSessions.revokedAt),
      ),
    );
}

export async function revokeAllUserSessions(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const db = getDb();

  await db
    .update(authSessions)
    .set({ revokedAt: new Date() })
    .where(
      and(eq(authSessions.userId, userId), isNull(authSessions.revokedAt)),
    );
}
