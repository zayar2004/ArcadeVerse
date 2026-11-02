export type SupportedLanguage = "my" | "en";

export interface TranslationDictionary {
  brandTitle: string;
  brandTagline: string;
  systemStatus: string;
  demoModeBadge: string;
  demoBalanceNotice: string;
  tabs: {
    home: string;
    games: string;
    wallet: string;
    prizes: string;
    profile: string;
  };
  balances: {
    demoCoins: string;
    demoTickets: string;
    notice: string;
  };
  gamesSection: {
    title: string;
    comingSoon: string;
  };
  prizesSection: {
    title: string;
    notice: string;
  };
  walletSection: {
    title: string;
    notice: string;
  };
  profileSection: {
    title: string;
    notice: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  my: {
    brandTitle: "ARCADEVERSE",
    brandTagline: "နောက်မျိုးဆက် အာကိတ်ပလက်ဖောင်း",
    systemStatus: "အွန်လိုင်း",
    demoModeBadge: "စမ်းသပ်အဆင့် (DEMO)",
    demoBalanceNotice: "သတိပေးချက် - ဤလက်ကျန်ငွေသည် စနစ်စမ်းသပ်ရန် သီးသန့်ဖြစ်ပြီး ငွေကြေးတန်ဖိုးမရှိပါ။ ငွေပေးချေမှုစနစ် ချိတ်ဆက်ထားခြင်း မရှိသေးပါ။",
    tabs: {
      home: "ပင်မ",
      games: "ဂိမ်းများ",
      wallet: "ပိုက်ဆံအိတ်",
      prizes: "ဆုလက်ဆောင်",
      profile: "ပရိုဖိုင်",
    },
    balances: {
      demoCoins: "သရုပ်ပြဒင်္ဂါး (Demo Coins)",
      demoTickets: "သရုပ်ပြလက်မှတ် (Demo Tickets)",
      notice: "စမ်းသပ်အသုံးပြုရန်အတွက်သာ ဖြစ်ပါသည်",
    },
    gamesSection: {
      title: "အာကိတ်ဂိမ်းများ",
      comingSoon: "မကြာမီလာမည်",
    },
    prizesSection: {
      title: "ဆုလက်ဆောင် လဲလှယ်ရေး",
      notice: "ဆုလက်ဆောင်ကတ်တလောက် ပြင်ဆင်နေဆဲဖြစ်ပါသည် (Phase 2 Placeholder)",
    },
    walletSection: {
      title: "ဒင်္ဂါးနှင့် လက်မှတ် စီမံခန့်ခွဲမှု",
      notice: "ပိုက်ဆံအိတ်နှင့် ငွေပေးချေမှုစနစ် ချိတ်ဆက်ခြင်း မပြုလုပ်ရသေးပါ (Phase 2 Placeholder)",
    },
    profileSection: {
      title: "အကောင့်နှင့် အချက်အလက်",
      notice: "အသုံးပြုသူ စစ်ဆေးအတည်ပြုခြင်း စနစ် မဖွင့်သေးပါ (Phase 2 Placeholder)",
    },
  },
  en: {
    brandTitle: "ARCADEVERSE",
    brandTagline: "Next-Gen Arcade Platform",
    systemStatus: "ONLINE",
    demoModeBadge: "DEMO MODE",
    demoBalanceNotice: "Notice: These balances are strictly simulated for UI testing and carry no real monetary value. No payment processing exists in Phase 2.",
    tabs: {
      home: "Home",
      games: "Games",
      wallet: "Wallet",
      prizes: "Prizes",
      profile: "Profile",
    },
    balances: {
      demoCoins: "Demo Coins",
      demoTickets: "Demo Tickets",
      notice: "For Interface Demonstration Only",
    },
    gamesSection: {
      title: "Arcade Games Lineup",
      comingSoon: "COMING SOON",
    },
    prizesSection: {
      title: "Prize Redemption Catalog",
      notice: "Prize redemption catalog is under preparation (Phase 2 Placeholder).",
    },
    walletSection: {
      title: "Wallet & Transaction Ledger",
      notice: "Wallet and payment gateways are unconfigured (Phase 2 Placeholder).",
    },
    profileSection: {
      title: "Player Identity & Profile",
      notice: "Authentication and user profiles are unconfigured (Phase 2 Placeholder).",
    },
  },
};
