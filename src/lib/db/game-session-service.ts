import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";

import { getDb } from "./index";
import {
  coinLedger,
  gameConfigurations,
  gameSessions,
  games,
  ticketLedger,
  userWallets,
} from "./schema";

export type StartGameSessionInput = {
  userId: string;
  gameId: string;
  configVersionId: string;
  difficulty: string;
  playCostCoins: number;
  idempotencyKey: string;
};

export type FinalizeGameSessionInput = {
  sessionId: string;
  userId: string;
  idempotencyKey: string;
  finalScore: number;
  durationMs: number;
  rewardTickets: number;
};

function requiredText(value: string, code: string): void {
  if (!value.trim()) throw new Error(code);
}

function validateKey(key: string): void {
  requiredText(key, "IDEMPOTENCY_KEY_REQUIRED");
  if (key.length > 200) throw new Error("IDEMPOTENCY_KEY_TOO_LONG");
}

export async function startGameSession(input: StartGameSessionInput) {
  requiredText(input.userId, "USER_ID_REQUIRED");
  requiredText(input.gameId, "GAME_ID_REQUIRED");
  requiredText(input.configVersionId, "CONFIG_VERSION_REQUIRED");
  requiredText(input.difficulty, "DIFFICULTY_REQUIRED");
  validateKey(input.idempotencyKey);

  if (!Number.isSafeInteger(input.playCostCoins) || input.playCostCoins < 0) {
    throw new Error("INVALID_PLAY_COST");
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    await tx.execute(sql`
      SELECT pg_advisory_xact_lock(hashtext(${`session-start:${input.idempotencyKey}`}))
    `);

    const [existing] = await tx
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.idempotencyKey, input.idempotencyKey))
      .limit(1);

    if (existing) {
      if (
        existing.userId !== input.userId ||
        existing.gameId !== input.gameId ||
        existing.configVersionId !== input.configVersionId ||
        existing.difficulty !== input.difficulty ||
        existing.playCostCoins !== input.playCostCoins
      ) {
        throw new Error("IDEMPOTENCY_KEY_CONFLICT");
      }

      return { session: existing, duplicate: true };
    }

    const [game] = await tx
      .select()
      .from(games)
      .where(eq(games.id, input.gameId))
      .limit(1);

    if (!game || game.status !== "active") {
      throw new Error("GAME_NOT_AVAILABLE");
    }

    const [config] = await tx
      .select()
      .from(gameConfigurations)
      .where(eq(gameConfigurations.id, input.configVersionId))
      .limit(1);

    if (
      !config ||
      config.gameId !== input.gameId ||
      config.state !== "published"
    ) {
      throw new Error("GAME_CONFIG_NOT_PUBLISHED");
    }

    const [wallet] = await tx
      .select()
      .from(userWallets)
      .where(eq(userWallets.userId, input.userId))
      .for("update")
      .limit(1);

    if (!wallet) throw new Error("WALLET_NOT_FOUND");

    // Spend Promotional -> Free -> Purchased.
    // All changes remain inside this database transaction.
    let remainingCost = input.playCostCoins;

    const promotionalSpent = Math.min(
      wallet.promotionalCoinBalance,
      remainingCost,
    );
    remainingCost -= promotionalSpent;

    const freeSpent = Math.min(
      wallet.freeCoinBalance,
      remainingCost,
    );
    remainingCost -= freeSpent;

    const purchasedSpent = Math.min(
      wallet.purchasedCoinBalance,
      remainingCost,
    );
    remainingCost -= purchasedSpent;

    if (remainingCost > 0) {
      throw new Error("INSUFFICIENT_COINS");
    }

    const nextBalance = wallet.coinBalance - input.playCostCoins;
    const nextPromotional = wallet.promotionalCoinBalance - promotionalSpent;
    const nextFree = wallet.freeCoinBalance - freeSpent;
    const nextPurchased = wallet.purchasedCoinBalance - purchasedSpent;

    const sessionId = randomUUID();

    const [session] = await tx
      .insert(gameSessions)
      .values({
        id: sessionId,
        userId: input.userId,
        gameId: input.gameId,
        configVersionId: input.configVersionId,
        difficulty: input.difficulty,
        status: "active",
        playCostCoins: input.playCostCoins,
        idempotencyKey: input.idempotencyKey,
      })
      .returning();

    const coinDebits = [
      { coinType: "promotional", amount: promotionalSpent },
      { coinType: "free", amount: freeSpent },
      { coinType: "purchased", amount: purchasedSpent },
    ] as const;

    for (const debit of coinDebits) {
      if (debit.amount <= 0) continue;

      await tx.insert(coinLedger).values({
        id: randomUUID(),
        userId: input.userId,
        sessionId,
        amount: -debit.amount,
        coinType: debit.coinType,
        reason: "game_session_start",
        idempotencyKey:
          `session-coin:${input.idempotencyKey}:${debit.coinType}`,
      });
    }

    await tx
      .update(userWallets)
      .set({
        coinBalance: nextBalance,
        promotionalCoinBalance: nextPromotional,
        freeCoinBalance: nextFree,
        purchasedCoinBalance: nextPurchased,
        lifetimeCoinsSpent: wallet.lifetimeCoinsSpent + input.playCostCoins,
        version: wallet.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(userWallets.id, wallet.id));

    return { session, duplicate: false };
  });
}

/**
 * Server-only operation.
 * rewardTickets must be calculated and validated by trusted server logic.
 * Never pass client-submitted reward values directly to this function.
 */
export async function finalizeGameSession(input: FinalizeGameSessionInput) {
  requiredText(input.sessionId, "SESSION_ID_REQUIRED");
  requiredText(input.userId, "USER_ID_REQUIRED");
  validateKey(input.idempotencyKey);

  for (const [value, code] of [
    [input.finalScore, "INVALID_FINAL_SCORE"],
    [input.durationMs, "INVALID_DURATION"],
    [input.rewardTickets, "INVALID_REWARD"],
  ] as const) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error(code);
    }
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    await tx.execute(sql`
      SELECT pg_advisory_xact_lock(hashtext(${`session-finalize:${input.idempotencyKey}`}))
    `);

    const [session] = await tx
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.id, input.sessionId))
      .for("update")
      .limit(1);

    if (!session) throw new Error("SESSION_NOT_FOUND");

    if (session.userId !== input.userId) {
      throw new Error("SESSION_OWNER_MISMATCH");
    }

    if (session.status !== "active") {
      if (
        session.finalizeIdempotencyKey === input.idempotencyKey &&
        session.finalScore === input.finalScore &&
        session.durationMs === input.durationMs &&
        session.rewardTickets === input.rewardTickets
      ) {
        return { session, duplicate: true };
      }

      throw new Error("SESSION_ALREADY_FINALIZED");
    }

    const [wallet] = await tx
      .select()
      .from(userWallets)
      .where(eq(userWallets.userId, input.userId))
      .for("update")
      .limit(1);

    if (!wallet) throw new Error("WALLET_NOT_FOUND");

    const [updatedSession] = await tx
      .update(gameSessions)
      .set({
        status: "completed",
        finishedAt: new Date(),
        durationMs: input.durationMs,
        finalScore: input.finalScore,
        rewardTickets: input.rewardTickets,
        finalizeIdempotencyKey: input.idempotencyKey,
      })
      .where(eq(gameSessions.id, input.sessionId))
      .returning();

    if (input.rewardTickets > 0) {
      await tx.insert(ticketLedger).values({
        id: randomUUID(),
        userId: input.userId,
        sessionId: input.sessionId,
        amount: input.rewardTickets,
        reason: "game_session_reward",
        idempotencyKey: `session-reward:${input.idempotencyKey}`,
      });
    }

    await tx
      .update(userWallets)
      .set({
        ticketBalance: wallet.ticketBalance + input.rewardTickets,
        lifetimeTicketsEarned:
          wallet.lifetimeTicketsEarned + input.rewardTickets,
        version: wallet.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(userWallets.id, wallet.id));

    return { session: updatedSession, duplicate: false };
  });
}
