window.FUNNEL_CONFIG = {
  VARIANT: "v1",

  OPTIN_WEBHOOK_URL: window.NEXT_PUBLIC_OPTIN_WEBHOOK_URL || "https://michaelbetstamp.app.n8n.cloud/webhook/pro-fit-events",
  REDIRECT_MAX_WAIT_MS: 300,

  BOOK_DEMO_PATH: "/book-demo",
  SELF_SERVE_URL: "https://pro.betstamp.com/create-account-trial",
  CALENDLY_URL: "https://calendly.com/betstampliam/betstamp-pro-free-demo",
  CALENDLY_WIDGET_JS: "https://assets.calendly.com/assets/external/widget.js",
  DEMO_CONFIRMED_URL: "https://betstamp.com/demo-confirmed",
  CHAT_SOONER_URL: "https://forms.fillout.com/t/oYBtozcrGJus",
  TELEGRAM_URL: "https://t.me/michaelcaputo",
  SALES_EMAIL: "sales@betstamppro.com",

  LEAD_KEYS: ["name", "email", "phone", "lead_type", "unit_size", "budget"],
  UTM_KEYS: ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"],

  UTM_STORAGE_KEY: "betstamp_funnel_utm",
  UTM_TTL_MS: 10 * 24 * 60 * 60 * 1000
};
