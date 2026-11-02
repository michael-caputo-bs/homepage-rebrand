# homepage-rebrand

Static HTML marketing pages, one self-contained file per route, served by Vercel with `cleanUrls`.

## /pro-fit

Self-selection page for borderline PRO demo leads (Fillout redirects them here instead of straight to Calendly).

Files:

- `pro-fit.html` — the page
- `pro-fit.config.js` — URLs, webhook, fit-check questions and the `FIT_RULES` thresholds (set `FIT_RULES.enabled: false` to hide the fit check entirely)

### Env var

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_OPTIN_WEBHOOK_URL` | n8n webhook that receives the tracking events. Empty = mock mode (payloads are `console.log`ged instead of posted). |

This repo has no build step, so the value is not injected from Vercel env. Set it as `OPTIN_WEBHOOK_URL` in `pro-fit.config.js` (or define `window.NEXT_PUBLIC_OPTIN_WEBHOOK_URL` before the config loads). When the page is ported to Next.js, read it from `process.env.NEXT_PUBLIC_OPTIN_WEBHOOK_URL`.

Events are POSTed as `application/json` with `keepalive: true`, so the n8n webhook must answer the CORS preflight (allowed origin = the site's domain).

Events: `page_view`, `fitcheck_open`, `fitcheck_submit`, `click_book`, `click_self_serve`.

Payload:

```json
{
  "event": "click_book",
  "timestamp": "2026-11-02T15:04:05.000Z",
  "name": "", "email": "", "phone": "",
  "lead_type": "", "unit_size": "", "budget": "",
  "utm_source": "", "utm_medium": "", "utm_campaign": "", "utm_content": "", "utm_term": "",
  "fit_result": "fit | not_fit (only after the fit check is submitted)",
  "page": "pro-fit",
  "variant": "v1"
}
```

`fitcheck_submit` also carries `fit_bankroll`, `fit_bet_size`, `fit_tool_use`, `fit_up_overall`.

Button clicks fire the event, then redirect as soon as it resolves or after 300 ms, whichever comes first.

### URL params

Read on load; any of them can be missing.

`name`, `email`, `phone`, `lead_type`, `unit_size`, `budget`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

- **Book** → `https://calendly.com/betstampliam/betstamp-pro-free-demo` + `name`, `email`, all `utm_*`
- **Self-serve** → `https://pro.betstamp.com/create-account-trial` + all `utm_*`

Example: `/pro-fit?name=Jane%20Doe&email=jane@example.com&lead_type=props&budget=100-500&utm_source=fillout`
