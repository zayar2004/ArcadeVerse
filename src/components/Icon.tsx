import React from "react";

export type IconName =
  | "home"
  | "gamepad"
  | "wallet"
  | "ticket"
  | "gift"
  | "user"
  | "alert"
  | "coin"
  | "zap"
  | "check"
  | "car"
  | "alien"
  | "swords"
  | "close"
  | "chevron-right";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 22,
  className = "",
  strokeWidth = 1.8,
}: IconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    gamepad: <><path d="M6 12h4m-2-2v4" /><path d="M15 11h.01M18 13h.01" /><path d="M7 7h10a4 4 0 0 1 3.8 5.2l-1.2 4A2.5 2.5 0 0 1 15 17l-2-2h-2l-2 2a2.5 2.5 0 0 1-4.6-.8l-1.2-4A4 4 0 0 1 7 7Z" /></>,
    wallet: <><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18" /><path d="M16 15h2" /><path d="M6 6V4h12v2" /></>,
    ticket: <><path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3v4Z" /><path d="M13 4v2m0 3v2m0 3v2" /></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M12 9v12M3 13h18M12 9H7.5a2.5 2.5 0 1 1 2.4-3.2L12 9Zm0 0h4.5a2.5 2.5 0 1 0-2.4-3.2L12 9Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    alert: <><path d="m12 3 9 17H3L12 3Z" /><path d="M12 9v5m0 3h.01" /></>,
    coin: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="6" /><path d="M14.5 9.5c-.5-1-4-1-4 1s4 1 4 3-3.5 2-5 1" /></>,
    zap: <><path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    car: <><path d="m5 11 2-5h10l2 5" /><path d="M3 11h18v7H3z" /><path d="M6 18v2m12-2v2M6 14h2m8 0h2" /></>,
    alien: <><path d="M12 3c-5 0-8 4-8 9 0 5 3 9 8 9s8-4 8-9c0-5-3-9-8-9Z" /><path d="M7 11c1-2 3-2 5 0 2-2 4-2 5 0M9 16h.01M15 16h.01" /></>,
    swords: <><path d="m5 3 16 16M19 3 3 19" /><path d="m5 3 4 1-3 3-1-4Zm14 0-4 1 3 3 1-4ZM3 19l4-1-3-3-1 4Zm18 0-4-1 3-3 1 4Z" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...common}
    >
      {paths[name]}
    </svg>
  );
}
