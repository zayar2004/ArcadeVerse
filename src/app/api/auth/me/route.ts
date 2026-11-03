import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/auth/cookie";
import { verifySession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = await getSessionCookie();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "UNAUTHENTICATED" },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const user = await verifySession(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "UNAUTHENTICATED" },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          userId: user.userId,
          displayName: user.displayName,
          phone: user.phone,
          role: user.role,
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "INTERNAL_SERVER_ERROR" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
