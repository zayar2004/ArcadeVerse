import React from "react";

interface GameCardProps {
  title: string;
  genre: string;
  icon: string;
  comingSoonText: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  genre,
  icon,
  comingSoonText,
}) => {
  return (
    <article className="p-4 rounded-2xl bg-arcade-card/70 backdrop-blur-md border border-arcade-cardBorder flex items-center justify-between gap-3 shadow-md hover:border-arcade-cyan/40 transition-all">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-bold text-white tracking-wide truncate">
            {title}
          </h3>
          <span className="text-[11px] font-semibold text-arcade-muted uppercase tracking-wider">
            {genre}
          </span>
        </div>
      </div>

      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-arcade-amber/15 text-arcade-amber border border-arcade-amber/40 whitespace-nowrap shadow-[0_0_8px_rgba(255,184,0,0.2)]">
        {comingSoonText}
      </span>
    </article>
  );
};
