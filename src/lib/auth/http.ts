import "server-only";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const MAX_AUTH_BODY_BYTES = 16 * 1024;

export async function readJsonBody(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get("content-type") || "";
  const mediaType = contentType.split(";")[0].trim().toLowerCase();

  if (mediaType !== "application/json") return null;

  const lengthHeader = request.headers.get("content-length");

  if (lengthHeader) {
    if (!/^\d+$/.test(lengthHeader)) return null;
    if (Number(lengthHeader) > MAX_AUTH_BODY_BYTES) return null;
  }

  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_AUTH_BODY_BYTES) {
        await reader.cancel();
        return null;
      }

      chunks.push(value);
    }

    const combined = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const raw = new TextDecoder("utf-8", { fatal: true }).decode(combined);
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    try {
      await reader.cancel();
    } catch {
      // Ignore cancellation errors.
    }
    return null;
  } finally {
    reader.releaseLock();
  }
}

export function getRequestRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  const candidate = forwarded?.split(",")[0]?.trim() || realIp?.trim();
  const normalized =
    candidate && candidate.length <= 100 ? candidate : "unknown";

  const digest = createHash("sha256").update(normalized).digest("hex");

  return `auth-ip:${digest}`;
}

export function invalidRequest() {
  return NextResponse.json({ error: "Invalid request." }, { status: 400 });
}

export function rateLimited(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many attempts. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, retryAfterSeconds)),
      },
    },
  );
}

export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;

  for (let depth = 0; depth < 5 && current; depth++) {
    if (typeof current !== "object") return false;

    const candidate = current as {
      code?: unknown;
      cause?: unknown;
    };

    if (candidate.code === "23505") return true;
    current = candidate.cause;
  }

  return false;
}
