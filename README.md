# homepage-rebrand

Static HTML marketing pages, one self-contained file per route, served by Vercel with `cleanUrls`.

## PRO demo funnel: /pro-fit → /book-demo

Fillout sends borderline PRO demo leads to `/pro-fit` (self-selection). Leads who book go to `/book-demo` (inline Calendly), then to `https://betstamp.com/demo-confirmed`. Both pages are `noindex,nofollow`.

Files:

- `funnel.config.js` — shared constants: webhook, destination URLs (`SELF_SERVE_URL`, `CALENDLY_URL`, `DEMO_CONFIRMED_URL`, `CHAT_SOONER_URL`, `TELEGRAM_URL`), param keys, UTM storage
- `funnel.js` — shared helpers: `Funnel.getUtms()`, `getLead()`, `track()`, `bindLink()`, `bookHref()`, `selfServeHref()`
- `funnel.css` — shared brand styling (matches betstamp.com/demo-confirmed)
- `pro-fit.html` + `pro-fit.config.js` — the page, fit-check questions and `FIT_RULES` thresholds (`FIT_RULES.enabled: false` hides the fit check)
- `book-demo.html` — Calendly inline embed, booking listener, "Don't see a time" block

### Env var

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_OPTIN_WEBHOOK_URL` | n8n webhook that receives the tracking events. Empty = mock mode (payloads are `console.log`ged instead of posted). |

This repo has no build step, so the value is not injected from Vercel env. Set it as `OPTIN_WEBHOOK_URL` in `funnel.config.js` (or define `window.NEXT_PUBLIC_OPTIN_WEBHOOK_URL` before the config loads). When ported to Next.js, read it from `process.env.NEXT_PUBLIC_OPTIN_WEBHOOK_URL`.

Events are POSTed as `application/json` with `keepalive: true`, so the n8n webhook must answer the CORS preflight (allowed origin = the site's domain). Any navigation waits for the event at most 300 ms.

Events: `page_view` (`page`: `pro-fit` | `book-demo`), `fitcheck_open`, `fitcheck_submit`, `click_book`, `click_self_serve`, `click_chat_sooner`, `demo_booked`.

Payload:

```json
{
  "event": "click_book",
  "page": "pro-fit",
  "variant": "v1",
  "timestamp": "2026-11-04T15:04:05.000Z",
  "name": "", "email": "", "phone": "",
  "lead_type": "", "unit_size": "", "budget": "",
  "utm_source": "", "utm_medium": "", "utm_campaign": "", "utm_content": "", "utm_term": "",
  "fit_result": "fit | not_fit (only after the fit check is submitted)"
}
```

`fitcheck_submit` adds `fit_bankroll`, `fit_tool_use`, `fit_up_overall`. `demo_booked` adds `calendly_event_uri`, `calendly_invitee_uri`.

### URL params

Read on load; any of them can be missing.

`name`, `email`, `phone`, `lead_type`, `unit_size`, `budget`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

UTMs come from `Funnel.getUtms()`: the URL's `utm_*` if any are present (saved to localStorage `betstamp_funnel_utm` for 10 days), otherwise the saved set.

- **Book** (`/pro-fit` buttons) → `/book-demo` + every param above
- **Self-serve** → `https://pro.betstamp.com/create-account-trial` + `utm_*`
- **Calendly embed** → `https://calendly.com/betstampliam/betstamp-pro-free-demo` + `name`, `email`, `utm_*`, `hide_gdpr_banner=1`
- **After booking** → `https://betstamp.com/demo-confirmed` + `name`, `email`

Example: `/pro-fit?name=Test&email=a@b.com&lead_type=props&utm_source=google&utm_medium=cpc`
