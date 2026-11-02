"use client";

import React from "react";
import { SupportedLanguage, translations } from "@/lib/i18n";

export type NavTab = "home" | "games" | "wallet" | "prizes" | "profile";

interface BottomNavProps {
  currentLang: SupportedLanguage;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentLang,
  activeTab,
  onTabChange,
}) => {
  const t = translations[currentLang].tabs;

  const tabs: { id: NavTab; label: string; icon: string }[] = [
    { id: "home", label: t.home, icon: "⚡" },
    { id: "games", label: t.games, icon: "🎮" },
    { id: "wallet", label: t.wallet, icon: "🪙" },
    { id: "prizes", label: t.prizes, icon: "🎁" },
    { id: "profile", label: t.profile, icon: "👤" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg bg-arcade-card/90 border-t border-arcade-cardBorder py-2 px-3 shadow-2xl shadow-black max-w-md mx-auto"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? "text-arcade-cyan bg-arcade-cyan/15 border border-arcade-cyan/30 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                  : "text-arcade-muted hover:text-arcade-text"
              }`}
            >
              <span className="text-base leading-none mb-1">{tab.icon}</span>
              <span className="text-[10px] font-bold tracking-tight truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
