"use client";

import React from "react";
import { SupportedLanguage, translations } from "@/lib/i18n";

interface HeaderProps {
  currentLang: SupportedLanguage;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onToggleLang }) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-arcade-card/80 border-b border-arcade-cardBorder px-4 py-3 flex items-center justify-between shadow-lg shadow-black/40">
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-arcade-cyan to-arcade-magenta">
          {t.brandTitle}
        </h1>
        <span className="text-[10px] font-bold tracking-wider text-arcade-cyan uppercase">
          {t.brandTagline}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleLang}
          className="text-xs font-bold px-2.5 py-1 rounded-md border border-arcade-cyan/30 text-arcade-cyan bg-arcade-cyan/10 hover:bg-arcade-cyan/20 active:scale-95 transition-all"
          aria-label="Toggle Language"
        >
          {currentLang === "my" ? "EN" : "မြန်မာ"}
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
          <span>{t.systemStatus}</span>
        </div>
      </div>
    </header>
  );
};
