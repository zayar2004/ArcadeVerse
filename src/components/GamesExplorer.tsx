"use client";

import React, { useMemo, useState } from "react";
import { SupportedLanguage } from "@/lib/i18n";
import { Icon } from "@/components/Icon";

type Category = "all" | "racing" | "action" | "strategy";

interface Props {
  language: SupportedLanguage;
}

const games = [
  {
    id: "cyber-drift-2099",
    title: "Cyber Drift 2099",
    icon: "car" as const,
    category: "racing" as const,
    genre: { my: "နီယွန် ပြိုင်ကားဂိမ်း", en: "Neon Racing" },
    description: {
      my: "အနာဂတ်မြို့တော်ရဲ့ နီယွန်လမ်းမတွေပေါ်မှာ အရှိန်ပြင်းပြင်း မောင်းနှင်ယှဉ်ပြိုင်ဖို့ ပြင်ဆင်ထားပါ။",
      en: "Race at high speed through the neon streets of a futuristic city.",
    },
  },
  {
    id: "neon-strike",
    title: "Neon Strike",
    icon: "alien" as const,
    category: "action" as const,
    genre: { my: "အာကိတ် ပစ်ခတ်ဂိမ်း", en: "Arcade Shooter" },
    description: {
      my: "အတားအဆီးတွေကို ရှောင်ရှားပြီး စိန်ခေါ်မှုတွေကို ရင်ဆိုင်ပါ။",
      en: "Dodge obstacles and take on challenging arcade stages.",
    },
  },
  {
    id: "quantum-arena",
    title: "Quantum Arena",
    icon: "swords" as const,
    category: "strategy" as const,
    genre: { my: "ဗျူဟာမြောက် တိုက်ခိုက်ရေး", en: "Tactical Battle" },
    description: {
      my: "အနိုင်ရဖို့ လှုပ်ရှားမှုတိုင်းကို စဉ်းစားဆုံးဖြတ်ရမယ့် ဗျူဟာဂိမ်း။",
      en: "Plan every move in a tactical battle built around smart decisions.",
    },
  },
];

const text = {
  my: {
    heading: "ဂိမ်းအားလုံး",
    subtitle: "သင့်အကြိုက်ဆုံး အာကိတ်စိန်ခေါ်မှုကို ရှာဖွေလိုက်ပါ",
    all: "အားလုံး",
    racing: "ပြိုင်ကား",
    action: "အက်ရှင်",
    strategy: "ဗျူဟာ",
    coming: "မကြာမီလာမည်",
    details: "အသေးစိတ်",
    close: "ပိတ်ရန်",
    status: "ဂိမ်းအခြေအနေ",
    unavailable: "ဂိမ်းကို မကြာမီ ဖွင့်လှစ်ပေးပါမည်။ ယခုအချိန်တွင် ကစားခွင့် မရှိသေးပါ။",
  },
  en: {
    heading: "All Games",
    subtitle: "Discover your next arcade challenge",
    all: "All",
    racing: "Racing",
    action: "Action",
    strategy: "Strategy",
    coming: "Coming Soon",
    details: "Details",
    close: "Close",
    status: "Game Status",
    unavailable: "This game will be available soon. Gameplay is not enabled yet.",
  },
};

export function GamesExplorer({ language }: Props) {
  const [category, setCategory] = useState<Category>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const t = text[language];

  const categories: { id: Category; label: string }[] = [
    { id: "all", label: t.all },
    { id: "racing", label: t.racing },
    { id: "action", label: t.action },
    { id: "strategy", label: t.strategy },
  ];

  const filteredGames = useMemo(
    () =>
      games.filter(
        (game) => category === "all" || game.category === category,
      ),
    [category],
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-2xl border border-arcade-cyan/20 bg-gradient-to-br from-arcade-cyan/10 via-arcade-card to-arcade-magenta/10 p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-arcade-cyan">
          ARCADEVERSE / PLAY
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white">{t.heading}</h2>
            <p className="mt-1 text-xs text-arcade-muted">{t.subtitle}</p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-arcade-cyan/30 bg-arcade-cyan/10 text-3xl">
            <Icon name="gamepad" size={29} />
          </div>
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-arcade-muted">
          {filteredGames.length} GAMES
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setCategory(item.id);
              setSelectedId(null);
            }}
            aria-pressed={category === item.id}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
              category === item.id
                ? "border-arcade-cyan bg-arcade-cyan/15 text-arcade-cyan"
                : "border-white/10 bg-arcade-card text-arcade-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredGames.map((game) => {
          const expanded = selectedId === game.id;

          return (
            <article
              key={game.id}
              className="overflow-hidden rounded-2xl border border-arcade-cardBorder bg-arcade-card/80 shadow-lg"
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-3xl">
                  <Icon name={game.icon} size={27} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-extrabold text-white">
                    {game.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-arcade-muted">
                    {game.genre[language]}
                  </p>
                  <span className="mt-2 inline-flex rounded-full border border-arcade-amber/30 bg-arcade-amber/10 px-2.5 py-1 text-[9px] font-black text-arcade-amber">
                    {t.coming}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedId(expanded ? null : game.id)
                  }
                  aria-expanded={expanded}
                  className="shrink-0 rounded-lg border border-arcade-cyan/30 bg-arcade-cyan/10 px-3 py-2 text-[10px] font-bold text-arcade-cyan"
                >
                  {expanded ? t.close : t.details}
                </button>
              </div>

              {expanded && (
                <div className="border-t border-white/10 bg-black/20 px-4 py-4">
                  <p className="text-xs leading-relaxed text-arcade-muted">
                    {game.description[language]}
                  </p>

                  <div className="mt-3 rounded-xl bg-white/5 p-3">
                    <p className="text-[9px] font-bold uppercase text-arcade-muted">
                      {t.status}
                    </p>
                    <p className="mt-1 text-xs font-bold text-arcade-amber">
                      {t.coming}
                    </p>
                  </div>

                  <p className="mt-3 rounded-lg border border-arcade-amber/20 bg-arcade-amber/5 p-3 text-[11px] leading-relaxed text-arcade-amber">
                    {t.unavailable}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
