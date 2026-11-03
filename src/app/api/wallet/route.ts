import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSessionCookie } from "@/lib/auth/cookie";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { userWallets } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "UNAUTHENTICATED" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const user = await verifySession(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "UNAUTHENTICATED" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const db = getDb();
    const result = await db
      .select({
        coinBalance: userWallets.coinBalance,
        freeCoinBalance: userWallets.freeCoinBalance,
        purchasedCoinBalance: userWallets.purchasedCoinBalance,
        promotionalCoinBalance: userWallets.promotionalCoinBalance,
        ticketBalance: userWallets.ticketBalance,
        lifetimeCoinsEarned: userWallets.lifetimeCoinsEarned,
        lifetimeCoinsSpent: userWallets.lifetimeCoinsSpent,
        lifetimeTicketsEarned: userWallets.lifetimeTicketsEarned,
      })
      .from(userWallets)
      .where(eq(userWallets.userId, user.id))
      .limit(1);

    const wallet = result[0];

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "WALLET_NOT_FOUND" },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { success: true, wallet },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "INTERNAL_SERVER_ERROR" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
