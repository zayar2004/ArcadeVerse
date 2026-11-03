import { NextResponse } from "next/server";
import { authenticatePhone } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { attachSessionCookie } from "@/lib/auth/cookie";
import {
  consumeAuthRateLimit,
  clearAuthRateLimit,
} from "@/lib/auth/rate-limit";
import { isTrustedRequestOrigin } from "@/lib/auth/origin";
import {
  getRequestRateLimitKey,
  invalidRequest,
  rateLimited,
  readJsonBody,
} from "@/lib/auth/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  }

  const body = await readJsonBody(request);

  if (
    !body ||
    typeof body.phone !== "string" ||
    typeof body.password !== "string" ||
    body.phone.length > 30 ||
    body.password.length > 72
  ) {
    return invalidRequest();
  }

  const phone = body.phone.trim();

  const ipLimit = await consumeAuthRateLimit(getRequestRateLimitKey(request));

  if (!ipLimit.allowed) {
    return rateLimited(ipLimit.retryAfterSeconds);
  }

  const phoneLimit = await consumeAuthRateLimit(`login-phone:${phone}`);

  if (!phoneLimit.allowed) {
    return rateLimited(phoneLimit.retryAfterSeconds);
  }

  try {
    const user = await authenticatePhone(phone, body.password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid phone number or password." },
        { status: 401 },
      );
    }

    const session = await createSession(user.id);

    await Promise.all([
      clearAuthRateLimit(`login-phone:${phone}`),
      clearAuthRateLimit(getRequestRateLimitKey(request)),
    ]);

    const response = NextResponse.json({
      user: {
        userId: user.userId,
        displayName: user.displayName,
        role: user.role,
      },
    });

    return attachSessionCookie(response, session.token, session.expiresAt);
  } catch (error) {
    console.error("Login API error:", error);

    return NextResponse.json(
      { error: "Unable to complete login." },
      { status: 500 },
    );
  }
}
