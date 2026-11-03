import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getSessionCookie } from "@/lib/auth/cookie";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { coinLedger, ticketLedger } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
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

    const params = new URL(request.url).searchParams;
    const rawLimit = Number(params.get("limit") ?? 20);
    const rawOffset = Number(params.get("offset") ?? 0);

    if (
      !Number.isInteger(rawLimit) ||
      !Number.isInteger(rawOffset) ||
      rawLimit < 1 ||
      rawLimit > 50 ||
      rawOffset < 0 ||
      rawOffset > 10000
    ) {
      return NextResponse.json(
        { success: false, message: "INVALID_PAGINATION" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const db = getDb();
    const fetchCount = rawOffset + rawLimit;

    const [coins, tickets] = await Promise.all([
      db
        .select({
          id: coinLedger.id,
          amount: coinLedger.amount,
          coinType: coinLedger.coinType,
          reason: coinLedger.reason,
          createdAt: coinLedger.createdAt,
        })
        .from(coinLedger)
        .where(eq(coinLedger.userId, user.id))
        .orderBy(desc(coinLedger.createdAt), desc(coinLedger.id))
        .limit(fetchCount),

      db
        .select({
          id: ticketLedger.id,
          amount: ticketLedger.amount,
          reason: ticketLedger.reason,
          createdAt: ticketLedger.createdAt,
        })
        .from(ticketLedger)
        .where(eq(ticketLedger.userId, user.id))
        .orderBy(desc(ticketLedger.createdAt), desc(ticketLedger.id))
        .limit(fetchCount),
    ]);

    const combined = [
      ...coins.map((item) => ({
        ...item,
        type: "coin" as const,
      })),
      ...tickets.map((item) => ({
        ...item,
        coinType: null,
        type: "ticket" as const,
      })),
    ];

    combined.sort((a, b) => {
      const timeDifference =
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime();

      if (timeDifference !== 0) return timeDifference;
      return b.id.localeCompare(a.id);
    });

    const history = combined.slice(rawOffset, rawOffset + rawLimit);

    return NextResponse.json(
      {
        success: true,
        history,
        pagination: {
          limit: rawLimit,
          offset: rawOffset,
          hasMore: combined.length > rawOffset + rawLimit,
        },
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "INTERNAL_SERVER_ERROR" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
