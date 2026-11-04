window.PRO_FIT_CONFIG = {
  PAGE: "pro-fit",

  FIT_RULES: {
    enabled: true,
    minBankroll: 10000,
    toolUseFit: ["now", "past"],
    upOverallFit: ["yes"]
  },

  FIT_QUESTIONS: {
    bankroll: {
      label: "Bankroll you bet with",
      type: "select",
      options: [
        { value: "under_5k", label: "Under $5K", min: 0 },
        { value: "5k_10k", label: "$5K–$10K", min: 5000 },
        { value: "10k_25k", label: "$10K–$25K", min: 10000 },
        { value: "25k_100k", label: "$25K–$100K", min: 25000 },
        { value: "100k_plus", label: "$100K+", min: 100000 }
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
    fit: "You're a fit.",
    fit_cta: "Book a 30-minute demo",
    not_fit: "Based on your answers, we'd recommend starting here.",
    not_fit_cta: "Explore Betstamp PRO",
    not_fit_book: "Book a demo anyway"
  }
};
