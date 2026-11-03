import "server-only";

import { randomBytes, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users, userPreferences, userWallets } from "@/lib/db/schema";
import { hashPassword, normalizePhone } from "./password";

type RegisterInput = {
  phone: string;
  password: string;
  displayName: string;
};

function generatePublicUserId(): string {
  return `AV${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function registerUser(input: RegisterInput) {
  const phone = normalizePhone(input.phone);
  const displayName = input.displayName.trim();

  if (!/^\+?[0-9]{7,20}$/.test(phone)) {
    throw new Error("INVALID_PHONE");
  }

  if (displayName.length < 2 || displayName.length > 50) {
    throw new Error("INVALID_DISPLAY_NAME");
  }

  const passwordHash = await hashPassword(input.password);
  const db = getDb();

  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("PHONE_ALREADY_REGISTERED");
    }

    const userId = generatePublicUserId();
    const internalId = randomUUID();

    await tx.insert(users).values({
      id: internalId,
      userId,
      phone,
      displayName,
      passwordHash,
      role: "user",
      status: "active",
    });

    await tx.insert(userPreferences).values({
      id: randomUUID(),
      userId: internalId,
      language: "my",
      soundEnabled: true,
      reducedMotion: false,
      theme: "dark",
    });

    await tx.insert(userWallets).values({
      id: randomUUID(),
      userId: internalId,
      coinBalance: 0,
      ticketBalance: 0,
    });

    return {
      id: internalId,
      userId,
      phone,
      displayName,
      role: "user",
    };
  });
}
