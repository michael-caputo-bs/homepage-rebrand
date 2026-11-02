window.PRO_FIT_CONFIG = {
  PAGE: "pro-fit",
  VARIANT: "v1",

  OPTIN_WEBHOOK_URL: window.NEXT_PUBLIC_OPTIN_WEBHOOK_URL || "",
  REDIRECT_MAX_WAIT_MS: 300,

  BOOK_URL: "https://calendly.com/betstampliam/betstamp-pro-free-demo",
  SELF_SERVE_URL: "https://pro.betstamp.com/create-account-trial",
  TELEGRAM_URL: "https://t.me/REPLACE_ME",

  PARAM_KEYS: [
    "name", "email", "phone", "lead_type", "unit_size", "budget",
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"
  ],
  BOOK_PARAM_KEYS: ["name", "email", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"],
  SELF_SERVE_PARAM_KEYS: ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"],

  FIT_RULES: {
    enabled: true,
    minBankroll: 25000,
    minBetSize: 250,
    toolUseFit: ["now", "past"],
    upOverallFit: ["yes"]
  },

  FIT_QUESTIONS: {
    bankroll: {
      label: "Bankroll you bet with",
      type: "select",
      options: [
        { value: "under_5k", label: "Under $5K", min: 0 },
        { value: "5k_25k", label: "$5K–$25K", min: 5000 },
        { value: "25k_100k", label: "$25K–$100K", min: 25000 },
        { value: "100k_plus", label: "$100K+", min: 100000 }
      ]
    },
    bet_size: {
      label: "Typical bet size",
      type: "select",
      options: [
        { value: "0_100", label: "$0–100", min: 0 },
        { value: "100_250", label: "$100–250", min: 100 },
        { value: "250_500", label: "$250–500", min: 250 },
        { value: "500_1k", label: "$500–1K", min: 500 },
        { value: "1k_plus", label: "$1K+", min: 1000 }
      ]
    },
    tool_use: {
      label: "Have you used a +EV or odds-screen tool before?",
      type: "radio",
      options: [
        { value: "now", label: "Yes, I pay for one now" },
        { value: "past", label: "Yes, in the past" },
        { value: "no", label: "No" }
      ]
    },
    up_overall: {
      label: "Over the last 6 months, are you up overall?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "even", label: "Roughly break-even" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Not sure" }
      ]
    }
  },

  RESULT_COPY: {
    fit: "You're a fit. Grab a time below.",
    not_fit: "Most bettors at your stage get more out of exploring on their own first."
  }
};
