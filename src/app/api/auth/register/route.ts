import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookie";
import { registerUser } from "@/lib/auth/register";
import { consumeAuthRateLimit } from "@/lib/auth/rate-limit";
import { isTrustedRequestOrigin } from "@/lib/auth/origin";
import {
  getRequestRateLimitKey,
  invalidRequest,
  isUniqueViolation,
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
    typeof body.displayName !== "string"
  ) {
    return invalidRequest();
  }

  const phone = body.phone.trim();

  if (phone.length > 30 || body.displayName.length > 100) {
    return invalidRequest();
  }

  const ipLimit = await consumeAuthRateLimit(getRequestRateLimitKey(request));

  if (!ipLimit.allowed) {
    return rateLimited(ipLimit.retryAfterSeconds);
  }

  const phoneLimit = await consumeAuthRateLimit(`register-phone:${phone}`);

  if (!phoneLimit.allowed) {
    return rateLimited(phoneLimit.retryAfterSeconds);
  }

  try {
    const user = await registerUser({
      phone,
      password: body.password,
      displayName: body.displayName,
    });

    const session = await createSession(user.id);
    const response = NextResponse.json(
      {
        user: {
          userId: user.userId,
          displayName: user.displayName,
          role: user.role,
        },
      },
      { status: 201 },
    );

    await setSessionCookie(session.token, session.expiresAt);

    return response;
  } catch (error) {
    if (
      (error instanceof Error &&
        error.message === "PHONE_ALREADY_REGISTERED") ||
      isUniqueViolation(error)
    ) {
      return NextResponse.json(
        { error: "Unable to create account with these details." },
        { status: 409 },
      );
    }

    if (
      error instanceof Error &&
      [
        "INVALID_PHONE",
        "INVALID_DISPLAY_NAME",
        "Password must be 10-72 characters and include letters and numbers.",
      ].includes(error.message)
    ) {
      return invalidRequest();
    }

    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Unable to complete registration." },
      { status: 500 },
    );
  }
}
