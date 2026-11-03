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
  auth: {
    login: string;
    register: string;
    loginTitle: string;
    registerTitle: string;
    loginDescription: string;
    registerDescription: string;
    displayName: string;
    displayNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    passwordRule: string;
    confirmPassword: string;
    passwordMismatch: string;
    showPassword: string;
    hidePassword: string;
    createAccount: string;
    checkingSession: string;
    accountActive: string;
    userId: string;
    role: string;
    logout: string;
    pleaseWait: string;
    copyUserId: string;
    copied: string;
    invalidCredentials: string;
    phoneExists: string;
    tooManyAttempts: string;
    invalidInput: string;
    generalError: string;
    connectionError: string;
    loginSuccess: string;
    registerSuccess: string;
    logoutSuccess: string;
    securityNotice: string;
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
    auth: {
      login: "အကောင့်ဝင်ရန်",
      register: "အကောင့်ဖွင့်ရန်",
      loginTitle: "ArcadeVerse သို့ ဝင်ရောက်ရန်",
      registerTitle: "အကောင့်အသစ် ဖွင့်ရန်",
      loginDescription: "သင့်အကောင့်သို့ ပြန်လည်ဝင်ရောက်ပါ",
      registerDescription: "ကစားသမားအကောင့် အသစ်တစ်ခု ဖန်တီးပါ",
      displayName: "အသုံးပြုသူအမည်",
      displayNamePlaceholder: "သင့်အမည်",
      phone: "ဖုန်းနံပါတ်",
      phonePlaceholder: "ဖုန်းနံပါတ် ထည့်ပါ",
      password: "စကားဝှက်",
      passwordPlaceholder: "အနည်းဆုံး ၈ လုံး",
      passwordRule: "စကားဝှက်သည် ၈ လုံးမှ ၇၂ လုံးအထိရှိပြီး အက္ခရာနှင့် ဂဏန်း ပါဝင်ရပါမည်။",
      confirmPassword: "စကားဝှက် ထပ်မံရိုက်ထည့်ပါ",
      passwordMismatch: "စကားဝှက်နှစ်ခု မတူညီပါ။",
      showPassword: "စကားဝှက် ပြရန်",
      hidePassword: "စကားဝှက် ဖျောက်ရန်",
      createAccount: "အကောင့်ဖွင့်မည်",
      checkingSession: "အကောင့်အခြေအနေ စစ်ဆေးနေသည်...",
      accountActive: "အကောင့်ဝင်ထားပါသည်",
      userId: "သင့်ကစားသမား ID",
      role: "အကောင့်အမျိုးအစား",
      logout: "အကောင့်ထွက်ရန်",
      pleaseWait: "ခဏစောင့်ပါ...",
      copyUserId: "User ID ကူးယူရန်",
      copied: "User ID ကူးယူပြီးပါပြီ",
      invalidCredentials: "ဖုန်းနံပါတ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။",
      phoneExists: "ဤဖုန်းနံပါတ်ဖြင့် အကောင့်ဖွင့်ထားပြီးဖြစ်သည်။",
      tooManyAttempts: "ကြိုးစားမှုများလွန်းပါသည်။ ခဏစောင့်ပြီး ပြန်ကြိုးစားပါ။",
      invalidInput: "ဖြည့်သွင်းထားသော အချက်အလက်များကို ပြန်စစ်ပါ။",
      generalError: "လုပ်ဆောင်မှု မအောင်မြင်ပါ။ ထပ်မံကြိုးစားပါ။",
      connectionError: "Server နှင့် ချိတ်ဆက်၍ မရပါ။",
      loginSuccess: "အကောင့်ဝင်ခြင်း အောင်မြင်ပါသည်။",
      registerSuccess: "အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။",
      logoutSuccess: "အကောင့်မှ ထွက်ပြီးပါပြီ။",
      securityNotice: "သင့်စကားဝှက်ကို အခြားသူများအား မမျှဝေပါနှင့်။",
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
    auth: {
      login: "Login",
      register: "Register",
      loginTitle: "Welcome Back",
      registerTitle: "Create Your Account",
      loginDescription: "Sign in to your ArcadeVerse account",
      registerDescription: "Create a new player account",
      displayName: "Display Name",
      displayNamePlaceholder: "Enter your name",
      phone: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      password: "Password",
      passwordPlaceholder: "At least 8 characters",
      passwordRule: "Password must be 8-72 characters and include letters and numbers.",
      confirmPassword: "Confirm Password",
      passwordMismatch: "Passwords do not match.",
      showPassword: "Show password",
      hidePassword: "Hide password",
      createAccount: "Create Account",
      checkingSession: "Checking account...",
      accountActive: "Account is active",
      userId: "Your Player ID",
      role: "Account Role",
      logout: "Log Out",
      pleaseWait: "Please wait...",
      copyUserId: "Copy User ID",
      copied: "User ID copied",
      invalidCredentials: "Invalid phone number or password.",
      phoneExists: "An account with this phone number already exists.",
      tooManyAttempts: "Too many attempts. Please wait and try again.",
      invalidInput: "Please check the information you entered.",
      generalError: "Request failed. Please try again.",
      connectionError: "Unable to connect to the server.",
      loginSuccess: "Login successful.",
      registerSuccess: "Registration successful.",
      logoutSuccess: "You have been logged out.",
      securityNotice: "Never share your password with anyone.",
    },
    profileSection: {
      title: "Player Identity & Profile",
      notice: "Authentication and user profiles are unconfigured (Phase 2 Placeholder).",
    },
  },
};
