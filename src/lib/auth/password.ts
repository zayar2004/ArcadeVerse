import "server-only";

import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

const BCRYPT_ROUNDS = 12;

export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s()-]/g, "");
}

export function validatePassword(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 72 &&
    /[a-zA-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export async function hashPassword(password: string): Promise<string> {
  if (!validatePassword(password)) {
    throw new Error(
      "Password must be 8-72 characters and include letters and numbers.",
    );
  }

  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  if (
    typeof password !== "string" ||
    typeof passwordHash !== "string" ||
    password.length > 72 ||
    !passwordHash.startsWith("$2")
  ) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

export async function authenticatePhone(phone: string, password: string) {
  const normalizedPhone = normalizePhone(phone);

  if (
    !normalizedPhone ||
    normalizedPhone.length > 30 ||
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 72
  ) {
    return null;
  }

  const db = getDb();

  const result = await db
    .select({
      id: users.id,
      userId: users.userId,
      phone: users.phone,
      displayName: users.displayName,
      passwordHash: users.passwordHash,
      role: users.role,
      status: users.status,
      deletedAt: users.deletedAt,
    })
    .from(users)
    .where(or(eq(users.phone, normalizedPhone), eq(users.phone, phone.trim())))
    .limit(1);

  const user = result[0];

  if (!user || user.status !== "active" || user.deletedAt) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    userId: user.userId,
    phone: user.phone,
    displayName: user.displayName,
    role: user.role,
  };
}
