import { eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { getDb } from "./index";
import { coinLedger, ticketLedger, userWallets } from "./schema";

export type CoinType = "free" | "purchased" | "promotional";

export type WalletChangeInput = {
  userId: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
  sessionId?: string | null;
  redemptionId?: string | null;
};

export type CoinChangeInput = WalletChangeInput & {
  coinType: CoinType;
};

export type WalletChangeResult = {
  balance: number;
  duplicate: boolean;
  ledgerId: string;
};

function validateInput(input: WalletChangeInput): void {
  if (!input.userId.trim()) throw new Error("USER_ID_REQUIRED");

  if (!Number.isSafeInteger(input.amount) || input.amount === 0) {
    throw new Error("INVALID_AMOUNT");
  }

  if (!input.reason.trim()) throw new Error("REASON_REQUIRED");

  if (!input.idempotencyKey.trim()) {
    throw new Error("IDEMPOTENCY_KEY_REQUIRED");
  }

  if (input.idempotencyKey.length > 200) {
    throw new Error("IDEMPOTENCY_KEY_TOO_LONG");
  }
}

function validateCoinType(value: string): asserts value is CoinType {
  if (!["free", "purchased", "promotional"].includes(value)) {
    throw new Error("INVALID_COIN_TYPE");
  }
}

export async function changeCoins(
  input: CoinChangeInput,
): Promise<WalletChangeResult> {
  validateInput(input);
  validateCoinType(input.coinType);

  const db = getDb();

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtext(${"coin:" + input.idempotencyKey}))`,
    );

    const [existing] = await tx
      .select()
      .from(coinLedger)
      .where(eq(coinLedger.idempotencyKey, input.idempotencyKey))
      .limit(1);

    if (existing) {
      if (
        existing.userId !== input.userId ||
        existing.amount !== input.amount ||
        existing.reason !== input.reason ||
        existing.coinType !== input.coinType ||
        (existing.sessionId ?? null) !== (input.sessionId ?? null)
      ) {
        throw new Error("IDEMPOTENCY_KEY_CONFLICT");
      }

      const [wallet] = await tx
        .select()
        .from(userWallets)
        .where(eq(userWallets.userId, input.userId))
        .limit(1);

      if (!wallet) throw new Error("WALLET_NOT_FOUND");

      return {
        balance: wallet.coinBalance,
        duplicate: true,
        ledgerId: existing.id,
      };
    }

    const [wallet] = await tx
      .select()
      .from(userWallets)
      .where(eq(userWallets.userId, input.userId))
      .for("update")
      .limit(1);

    if (!wallet) throw new Error("WALLET_NOT_FOUND");

    const currentBucket =
      input.coinType === "free"
        ? wallet.freeCoinBalance
        : input.coinType === "purchased"
          ? wallet.purchasedCoinBalance
          : wallet.promotionalCoinBalance;

    const nextBucket = currentBucket + input.amount;
    const nextTotal = wallet.coinBalance + input.amount;

    if (
      !Number.isSafeInteger(nextBucket) ||
      !Number.isSafeInteger(nextTotal)
    ) {
      throw new Error("INVALID_BALANCE");
    }

    if (nextBucket < 0 || nextTotal < 0) {
      throw new Error("INSUFFICIENT_COINS");
    }

    const ledgerId = randomUUID();

    await tx.insert(coinLedger).values({
      id: ledgerId,
      userId: input.userId,
      sessionId: input.sessionId ?? null,
      amount: input.amount,
      coinType: input.coinType,
      reason: input.reason,
      idempotencyKey: input.idempotencyKey,
    });

    await tx
      .update(userWallets)
      .set({
        coinBalance: nextTotal,
        freeCoinBalance:
          input.coinType === "free" ? nextBucket : wallet.freeCoinBalance,
        purchasedCoinBalance:
          input.coinType === "purchased"
            ? nextBucket
            : wallet.purchasedCoinBalance,
        promotionalCoinBalance:
          input.coinType === "promotional"
            ? nextBucket
            : wallet.promotionalCoinBalance,
        lifetimeCoinsEarned:
          wallet.lifetimeCoinsEarned +
          (input.amount > 0 ? input.amount : 0),
        lifetimeCoinsSpent:
          wallet.lifetimeCoinsSpent +
          (input.amount < 0 ? Math.abs(input.amount) : 0),
        version: wallet.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(userWallets.id, wallet.id));

    return {
      balance: nextTotal,
      duplicate: false,
      ledgerId,
    };
  });
}

export async function changeTickets(
  input: WalletChangeInput,
): Promise<WalletChangeResult> {
  validateInput(input);

  const db = getDb();

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtext(${"ticket:" + input.idempotencyKey}))`,
    );

    const [existing] = await tx
      .select()
      .from(ticketLedger)
      .where(eq(ticketLedger.idempotencyKey, input.idempotencyKey))
      .limit(1);

    if (existing) {
      if (
        existing.userId !== input.userId ||
        existing.amount !== input.amount ||
        existing.reason !== input.reason ||
        (existing.sessionId ?? null) !== (input.sessionId ?? null) ||
        (existing.redemptionId ?? null) !== (input.redemptionId ?? null)
      ) {
        throw new Error("IDEMPOTENCY_KEY_CONFLICT");
      }

      const [wallet] = await tx
        .select()
        .from(userWallets)
        .where(eq(userWallets.userId, input.userId))
        .limit(1);

      if (!wallet) throw new Error("WALLET_NOT_FOUND");

      return {
        balance: wallet.ticketBalance,
        duplicate: true,
        ledgerId: existing.id,
      };
    }

    const [wallet] = await tx
      .select()
      .from(userWallets)
      .where(eq(userWallets.userId, input.userId))
      .for("update")
      .limit(1);

    if (!wallet) throw new Error("WALLET_NOT_FOUND");

    const nextBalance = wallet.ticketBalance + input.amount;

    if (!Number.isSafeInteger(nextBalance) || nextBalance < 0) {
      throw new Error("INSUFFICIENT_TICKETS");
    }

    const ledgerId = randomUUID();

    await tx.insert(ticketLedger).values({
      id: ledgerId,
      userId: input.userId,
      sessionId: input.sessionId ?? null,
      redemptionId: input.redemptionId ?? null,
      amount: input.amount,
      reason: input.reason,
      idempotencyKey: input.idempotencyKey,
    });

    await tx
      .update(userWallets)
      .set({
        ticketBalance: nextBalance,
        lifetimeTicketsEarned:
          wallet.lifetimeTicketsEarned +
          (input.amount > 0 ? input.amount : 0),
        lifetimeTicketsSpent:
          wallet.lifetimeTicketsSpent +
          (input.amount < 0 ? Math.abs(input.amount) : 0),
        version: wallet.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(userWallets.id, wallet.id));

    return {
      balance: nextBalance,
      duplicate: false,
      ledgerId,
    };
  });
}
