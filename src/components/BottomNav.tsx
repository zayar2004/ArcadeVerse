"use client";

import React from "react";
import { SupportedLanguage, translations } from "@/lib/i18n";
import { Icon, IconName } from "@/components/Icon";

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

  const tabs: { id: NavTab; label: string; icon: IconName }[] = [
    { id: "home", label: t.home, icon: "home" },
    { id: "games", label: t.games, icon: "gamepad" },
    { id: "wallet", label: t.wallet, icon: "wallet" },
    { id: "prizes", label: t.prizes, icon: "gift" },
    { id: "profile", label: t.profile, icon: "user" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-arcade-cardBorder bg-arcade-card/90 px-3 py-2 shadow-2xl shadow-black backdrop-blur-lg"
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
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 transition-all ${
                isActive
                  ? "border-arcade-cyan/30 bg-arcade-cyan/15 text-arcade-cyan shadow-[0_0_12px_rgba(0,240,255,0.18)]"
                  : "border-transparent text-arcade-muted hover:text-arcade-text"
              }`}
            >
              <Icon name={tab.icon} size={21} strokeWidth={1.9} />
              <span className="max-w-full truncate text-[10px] font-bold tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
