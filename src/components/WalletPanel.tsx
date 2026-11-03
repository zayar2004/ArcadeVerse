"use client";

import React, { useCallback, useEffect, useState } from "react";
import { SupportedLanguage } from "@/lib/i18n";

type Props = { currentLang: SupportedLanguage };

type Wallet = {
  coinBalance: number;
  freeCoinBalance: number;
  purchasedCoinBalance: number;
  promotionalCoinBalance: number;
  ticketBalance: number;
  lifetimeCoinsEarned: number;
  lifetimeCoinsSpent: number;
  lifetimeTicketsEarned: number;
};

type HistoryItem = {
  id: string;
  amount: number;
  type: "coin" | "ticket";
  coinType: "free" | "purchased" | "promotional" | null;
  reason: string;
  createdAt: string;
};

type Filter = "all" | "free" | "purchased" | "promotional" | "ticket";

const PAGE_SIZE = 20;

export function WalletPanel({ currentLang }: Props) {
  const my = currentLang === "my";

  const text = {
    title: my ? "ကျွန်ုပ်၏ ပိုက်ဆံအိတ်" : "My Wallet",
    total: my ? "စုစုပေါင်း ဒင်္ဂါး" : "Total Coins",
    free: my ? "အခမဲ့ ဒင်္ဂါး" : "Free Coins",
    purchased: my ? "ဝယ်ယူထားသော ဒင်္ဂါး" : "Purchased Coins",
    promotional: my ? "ပရိုမိုးရှင်း ဒင်္ဂါး" : "Promotional Coins",
    tickets: my ? "လက်မှတ်များ" : "Tickets",
    history: my ? "ငွေစာရင်းမှတ်တမ်း" : "Transaction History",
    all: my ? "အားလုံး" : "All",
    ticket: my ? "လက်မှတ်" : "Tickets",
    loading: my ? "အချက်အလက် ရယူနေသည်..." : "Loading wallet...",
    login: my ? "ပိုက်ဆံအိတ်ကြည့်ရန် အကောင့်ဝင်ပါ" : "Please log in to view your wallet",
    loginHint: my ? "Profile ထဲသို့ဝင်ပြီး အကောင့်ဝင်ပါ။" : "Open Profile and sign in.",
    empty: my ? "မှတ်တမ်း မရှိသေးပါ။" : "No transactions yet.",
    error: my ? "အချက်အလက် ရယူ၍ မရပါ။" : "Unable to load wallet data.",
    retry: my ? "ပြန်ကြိုးစားရန်" : "Try Again",
    previous: my ? "ရှေ့သို့" : "Previous",
    next: my ? "နောက်သို့" : "Next",
    page: my ? "စာမျက်နှာ" : "Page",
    earned: my ? "ရရှိ" : "Earned",
    spent: my ? "သုံးစွဲ" : "Spent",
    coin: my ? "ဒင်္ဂါး" : "Coin",
    noPayment: my
      ? "ငွေပေးချေမှုနှင့် ဒင်္ဂါးဝယ်ယူမှုစနစ် မဖွင့်ရသေးပါ။"
      : "Payments and coin purchases are not enabled yet.",
  };

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthenticated, setUnauthenticated] = useState(false);

  const loadWallet = useCallback(async (nextOffset = 0) => {
    setLoading(true);
    setError("");
    setUnauthenticated(false);

    try {
      const [walletResponse, historyResponse] = await Promise.all([
        fetch("/api/wallet", {
          cache: "no-store",
          credentials: "same-origin",
        }),
        fetch(
          `/api/wallet/history?limit=${PAGE_SIZE}&offset=${nextOffset}`,
          {
            cache: "no-store",
            credentials: "same-origin",
          }
        ),
      ]);

      if (
        walletResponse.status === 401 ||
        historyResponse.status === 401
      ) {
        setUnauthenticated(true);
        setWallet(null);
        setHistory([]);
        return;
      }

      if (!walletResponse.ok || !historyResponse.ok) {
        throw new Error("WALLET_REQUEST_FAILED");
      }

      const walletData = await walletResponse.json();
      const historyData = await historyResponse.json();

      if (!walletData.success || !historyData.success) {
        throw new Error("WALLET_REQUEST_FAILED");
      }

      setWallet(walletData.wallet as Wallet);
      setHistory(historyData.history as HistoryItem[]);
      setHasMore(Boolean(historyData.pagination?.hasMore));
      setOffset(nextOffset);
    } catch {
      setError(text.error);
    } finally {
      setLoading(false);
    }
  }, [text.error]);

  useEffect(() => {
    void loadWallet(0);
  }, [loadWallet]);

  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;
    if (filter === "ticket") return item.type === "ticket";
    return item.type === "coin" && item.coinType === filter;
  });

  const number = (value: number) =>
    new Intl.NumberFormat(my ? "my-MM" : "en-US").format(value);

  const date = (value: string) =>
    new Intl.DateTimeFormat(my ? "my-MM" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: text.all },
    { id: "free", label: text.free },
    { id: "purchased", label: text.purchased },
    { id: "promotional", label: text.promotional },
    { id: "ticket", label: text.ticket },
  ];

  if (loading && !wallet && !unauthenticated) {
    return (
      <section className="rounded-2xl border border-arcade-cardBorder bg-arcade-card/80 p-8 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-arcade-cyan/20 border-t-arcade-cyan" />
        <p className="text-sm text-arcade-muted">{text.loading}</p>
      </section>
    );
  }

  if (unauthenticated) {
    return (
      <section className="rounded-2xl border border-arcade-cyan/20 bg-arcade-card/80 p-6 text-center">
        <div className="mb-3 text-4xl">🔐</div>
        <h2 className="font-extrabold text-white">{text.login}</h2>
        <p className="mt-2 text-sm text-arcade-muted">{text.loginHint}</p>
      </section>
    );
  }

  if (error && !wallet) {
    return (
      <section className="rounded-2xl border border-red-500/30 bg-arcade-card/80 p-6 text-center">
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={() => void loadWallet(0)}
          className="mt-4 rounded-xl bg-arcade-cyan/15 px-5 py-3 text-sm font-bold text-arcade-cyan"
        >
          {text.retry}
        </button>
      </section>
    );
  }

  if (!wallet) return null;

  const cards = [
    { label: text.free, value: wallet.freeCoinBalance, icon: "🪙", color: "text-arcade-cyan" },
    { label: text.purchased, value: wallet.purchasedCoinBalance, icon: "💎", color: "text-blue-400" },
    { label: text.promotional, value: wallet.promotionalCoinBalance, icon: "🎁", color: "text-purple-400" },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-black uppercase tracking-wider text-white">
          {text.title}
        </h2>
        <button
          onClick={() => void loadWallet(offset)}
          disabled={loading}
          aria-label={text.retry}
          className="rounded-lg border border-arcade-cardBorder p-2 text-arcade-cyan disabled:opacity-50"
        >
          ↻
        </button>
      </div>

      <div className="rounded-2xl border border-arcade-cyan/30 bg-gradient-to-br from-arcade-cyan/15 to-arcade-card p-5 shadow-lg">
        <p className="text-xs font-bold uppercase tracking-widest text-arcade-muted">
          {text.total}
        </p>
        <p className="mt-2 text-4xl font-black tabular-nums text-white">
          {number(wallet.coinBalance)}
        </p>
        <p className="mt-3 text-sm font-bold text-arcade-cyan">
          🎟 {text.tickets}: {number(wallet.ticketBalance)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-xl border border-arcade-cardBorder bg-arcade-card/80 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-sm font-semibold text-arcade-muted">
                {card.label}
              </span>
            </div>
            <strong className={`text-lg tabular-nums ${card.color}`}>
              {number(card.value)}
            </strong>
          </div>
        ))}
      </div>

      <p className="rounded-xl border border-arcade-cardBorder bg-arcade-dark/60 p-3 text-xs leading-relaxed text-arcade-muted">
        ℹ️ {text.noPayment}
      </p>

      <div className="rounded-2xl border border-arcade-cardBorder bg-arcade-card/80 p-4">
        <h3 className="mb-3 text-sm font-extrabold text-white">
          {text.history}
        </h3>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-full border px-3 py-2 text-xs font-bold ${
                filter === item.id
                  ? "border-arcade-cyan bg-arcade-cyan/15 text-arcade-cyan"
                  : "border-arcade-cardBorder text-arcade-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-8 text-center text-xs text-arcade-muted">{text.loading}</p>
        ) : filteredHistory.length === 0 ? (
          <p className="py-8 text-center text-sm text-arcade-muted">{text.empty}</p>
        ) : (
          <div className="mt-3 divide-y divide-arcade-cardBorder">
            {filteredHistory.map((item) => {
              const positive = item.amount > 0;
              const label =
                item.type === "ticket"
                  ? text.ticket
                  : item.coinType === "free"
                    ? text.free
                    : item.coinType === "purchased"
                      ? text.purchased
                      : text.promotional;

              return (
                <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{label}</p>
                    <p className="mt-1 truncate text-xs text-arcade-muted">{item.reason}</p>
                    <p className="mt-1 text-[10px] text-arcade-muted">{date(item.createdAt)}</p>
                  </div>
                  <strong className={`shrink-0 text-sm tabular-nums ${positive ? "text-arcade-green" : "text-red-400"}`}>
                    {positive ? "+" : ""}{number(item.amount)}
                  </strong>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-arcade-cardBorder pt-3">
          <button
            disabled={offset === 0 || loading}
            onClick={() => void loadWallet(Math.max(0, offset - PAGE_SIZE))}
            className="rounded-lg border border-arcade-cardBorder px-3 py-2 text-xs font-bold text-arcade-cyan disabled:opacity-30"
          >
            ← {text.previous}
          </button>
          <span className="text-xs text-arcade-muted">
            {text.page} {number(Math.floor(offset / PAGE_SIZE) + 1)}
          </span>
          <button
            disabled={!hasMore || loading}
            onClick={() => void loadWallet(offset + PAGE_SIZE)}
            className="rounded-lg border border-arcade-cardBorder px-3 py-2 text-xs font-bold text-arcade-cyan disabled:opacity-30"
          >
            {text.next} →
          </button>
        </div>
      </div>
    </section>
  );
}
