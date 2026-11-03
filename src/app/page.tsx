"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav, NavTab } from "@/components/BottomNav";
import { GameCard } from "@/components/GameCard";
import { Icon } from "@/components/Icon";
import { SupportedLanguage, translations } from "@/lib/i18n";
import { AuthPanel } from "@/components/AuthPanel";
import { WalletPanel } from "@/components/WalletPanel";

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("my");
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [interactionToast, setInteractionToast] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("arcadeverse_language");
      if (saved === "my" || saved === "en") {
        setCurrentLang(saved);
      }
    } catch {
      // Keep the default language if storage is unavailable.
    }
  }, []);

  const t = translations[currentLang];

  const handleToggleLang = () => {
    setCurrentLang((prev) => {
      const next = prev === "my" ? "en" : "my";
      try {
        localStorage.setItem("arcadeverse_language", next);
      } catch {
        // Language switching still works for this session.
      }
      return next;
    });
  };

  const handleTestInteraction = () => {
    setInteractionToast(true);
    setTimeout(() => {
      setInteractionToast(false);
    }, 3000);
  };

  const gamesList = [
    {
      title: "Cyber Drift 2099",
      genre: currentLang === "my" ? "နီယွန် ပြိုင်ကားဂိမ်း" : "Neon Racing",
      icon: "car",
    },
    {
      title: "Neon Strike",
      genre: currentLang === "my" ? "အာကိတ် ပစ်ခတ်ဂိမ်း" : "Retro Shooter",
      icon: "alien",
    },
    {
      title: "Quantum Arena",
      genre: currentLang === "my" ? "ဗျူဟာမြောက် တိုက်ခိုက်ရေး" : "Tactical Battle",
      icon: "swords",
    },
  ] as const;

  return (
    <div className="flex-1 flex flex-col">
      <Header currentLang={currentLang} onToggleLang={handleToggleLang} />

      <main className="flex-1 p-4 flex flex-col gap-5">
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <>
            {/* Disclaimer Banner: No real money */}
            <div className="p-3 rounded-xl bg-arcade-amber/10 border border-arcade-amber/30 text-arcade-amber text-xs leading-relaxed flex items-start gap-2.5 shadow-sm">
              <span className="text-base flex-shrink-0"><Icon name="alert" size={18} /></span>
              <div>
                <p className="font-bold uppercase tracking-wider text-[11px] mb-0.5">
                  {t.demoModeBadge}
                </p>
                <p className="text-[11px] opacity-90">{t.demoBalanceNotice}</p>
              </div>
            </div>

            {/* Balances Grid */}
            <section className="grid grid-cols-2 gap-3" aria-label="Simulated Balances">
              <article className="p-4 rounded-2xl bg-arcade-card/80 backdrop-blur-md border border-arcade-cardBorder relative overflow-hidden shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-arcade-amber to-transparent" />
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded bg-arcade-amber/20 text-arcade-amber flex items-center justify-center text-xs">
                    <Icon name="coin" size={36} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-arcade-muted">
                    {t.balances.demoCoins}
                  </span>
                </div>
                <p className="text-2xl font-black tracking-tight text-white">1,000</p>
                <span className="text-[9px] text-arcade-muted/80 block mt-1">
                  {t.balances.notice}
                </span>
              </article>

              <article className="p-4 rounded-2xl bg-arcade-card/80 backdrop-blur-md border border-arcade-cardBorder relative overflow-hidden shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-arcade-magenta to-transparent" />
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded bg-arcade-magenta/20 text-arcade-magenta flex items-center justify-center text-xs">
                    <Icon name="ticket" size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-arcade-muted">
                    {t.balances.demoTickets}
                  </span>
                </div>
                <p className="text-2xl font-black tracking-tight text-white">250</p>
                <span className="text-[9px] text-arcade-muted/80 block mt-1">
                  {t.balances.notice}
                </span>
              </article>
            </section>

            {/* Test Interaction Area */}
            <section className="p-4 rounded-2xl bg-arcade-card/60 backdrop-blur-md border border-arcade-cardBorder flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={handleTestInteraction}
                className="w-full min-h-[50px] rounded-xl font-black tracking-wider uppercase text-sm text-white bg-gradient-to-r from-arcade-cyan via-blue-600 to-arcade-magenta shadow-[0_4px_16px_rgba(0,114,255,0.35)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span><Icon name="zap" size={18} /></span>
                <span>{currentLang === "my" ? "စမ်းသပ်အသုံးပြုရန် နှိပ်ပါ" : "Test Interaction"}</span>
              </button>

              <div
                className={`text-xs font-bold text-arcade-green flex items-center gap-1.5 transition-all duration-200 min-h-[20px] ${
                  interactionToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
                role="status"
                aria-live="polite"
              >
                <span><Icon name="check" size={18} /></span>
                <span>{currentLang === "my" ? "စမ်းသပ်မှု အောင်မြင်ပါသည်!" : "Interaction Successful!"}</span>
              </div>
            </section>

            {/* Featured Games Section */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-arcade-muted">
                  {t.gamesSection.title}
                </h2>
              </div>

              <div className="flex flex-col gap-2.5">
                {gamesList.map((game) => (
                  <GameCard
                    key={game.title}
                    title={game.title}
                    genre={game.genre}
                    icon={game.icon}
                    comingSoonText={t.gamesSection.comingSoon}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* TAB 2: GAMES */}
        {activeTab === "games" && (
          <section className="flex flex-col gap-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-arcade-muted px-1">
              {t.tabs.games}
            </h2>
            <div className="flex flex-col gap-2.5">
              {gamesList.map((game) => (
                <GameCard
                  key={game.title}
                  title={game.title}
                  genre={game.genre}
                  icon={game.icon}
                  comingSoonText={t.gamesSection.comingSoon}
                />
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: WALLET */}
        {activeTab === "wallet" && (
          <WalletPanel currentLang={currentLang} />
        )}

        {/* TAB 4: PRIZES PLACEHOLDER */}
        {activeTab === "prizes" && (
          <section className="p-6 rounded-2xl bg-arcade-card/80 border border-arcade-cardBorder text-center flex flex-col items-center gap-3">
            <span className="text-4xl"><Icon name="gift" size={36} /></span>
            <h2 className="text-base font-extrabold text-white">{t.prizesSection.title}</h2>
            <p className="text-xs text-arcade-muted leading-relaxed max-w-xs">
              {t.prizesSection.notice}
            </p>
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-arcade-magenta/15 text-arcade-magenta border border-arcade-magenta/30">
              Phase 4 Redemption Engine Target
            </span>
          </section>
        )}

        {/* TAB 5: PROFILE + AUTHENTICATION */}
        {activeTab === "profile" && (
          <section className="flex flex-col gap-4">
            <div className="px-1">
              <h2 className="text-xs font-black uppercase tracking-widest text-arcade-muted">
                {t.profileSection.title}
              </h2>
            </div>
            <AuthPanel currentLang={currentLang} />
          </section>
        )}
      </main>

      <BottomNav
        currentLang={currentLang}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
