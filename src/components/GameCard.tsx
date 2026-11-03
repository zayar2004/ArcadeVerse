import React from "react";
import { Icon, IconName } from "@/components/Icon";

interface GameCardProps {
  title: string;
  genre: string;
  icon: IconName;
  comingSoonText: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  genre,
  icon,
  comingSoonText,
}) => {
  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl border border-arcade-cardBorder bg-arcade-card/70 p-4 shadow-md backdrop-blur-md transition-all hover:border-arcade-cyan/40">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-arcade-cyan/20 bg-arcade-cyan/10 text-arcade-cyan shadow-inner">
          <Icon name={icon} size={25} strokeWidth={1.7} />
        </div>

        <div className="flex min-w-0 flex-col">
          <h3 className="truncate text-sm font-bold tracking-wide text-white">
            {title}
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-arcade-muted">
            {genre}
          </span>
        </div>
      </div>

      <span className="whitespace-nowrap rounded-full border border-arcade-amber/40 bg-arcade-amber/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-arcade-amber">
        {comingSoonText}
      </span>
    </article>
  );
};
