import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  attachClearSessionCookie,
} from "@/lib/auth/cookie";
import { revokeSession } from "@/lib/auth/session";
import { isTrustedRequestOrigin } from "@/lib/auth/origin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  }

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
      ?.slice(SESSION_COOKIE_NAME.length + 1);

    await revokeSession(token);

    return attachClearSessionCookie(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("Logout API error:", error);

    return NextResponse.json(
      { error: "Unable to complete logout." },
      { status: 500 },
    );
  }
}
