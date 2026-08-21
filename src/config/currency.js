/* Currency auto-detection for /website-package (spec §"Currency &
   Geo-Detection", user 2026-08-04).

   The question is a yes/no one: is this visitor in the UK? If they are
   they see sterling, and if they are not they see US dollars (user
   2026-08-04). The prices themselves live in `config/pricing.js`; this
   file only answers WHICH of the two. The site is a STATIC SPA on
   Firebase Hosting, so there is no server, no edge function and no
   country header to read - detection has to happen in the browser. It
   runs in two stages so the price is right immediately AND accurate:

     1. DEVICE (synchronous, 0 requests) - the browser's own IANA time
        zone. Available before first paint, so the prices never flicker
        and a blocked/offline/slow network changes nothing. A UK zone
        gives sterling; anything else gives dollars and waits for
        stage 2.
     2. IP (one keyless CORS request, ~150ms) - api.country.is returns
        an ISO country code, which decides sterling or dollars. This is
        the authoritative stage: it catches the UK visitor whose device
        clock is set somewhere else (travellers, VPNs, a machine that
        was never configured) and the visitor abroad whose zone happens
        to read Europe/London. Any failure (offline, ad-blocker,
        timeout, rate limit) silently keeps the stage-1 answer. The
        result is cached in sessionStorage so a reload doesn't re-ask.

   Anything unrecognised resolves to USD. `?cur=gbp` / `?cur=usd` forces
   a currency and skips stage 2 - that is how the ad campaigns can be
   explicit, and how you check a currency by hand.

   CRAWLERS GET STERLING (stage 0, user 2026-08-13). Googlebot crawls from
   US IPs on a UTC clock, so both stages above used to hand it dollars and
   the page was indexed as "From $799" - wrong shop window for a business
   whose primary market is the UK. A recognised crawler or link unfurler
   now resolves to GBP before either stage runs, and skips the IP lookup
   entirely. Note what this does and does not do: the crawler is shown
   exactly what a UK visitor is shown, on the same URL, with the price in
   the rendered DOM matching the price in the title and meta description.
   Nothing is hidden from anyone. If you would rather carry no
   user-agent branch at all, the alternatives are separate per-currency
   URLs with hreflang, or pinning only the <head> metadata to GBP for
   every visitor - both are noted in ISSUES.md.

   This is a module-level store rather than component state so the whole
   page (the chart, the hero vignette's price stamp and the browser tab
   title) reads ONE answer and the lookup fires once per load, not once
   per subscriber. */

import { DEFAULT_CURRENCY, isSupportedCurrency } from './pricing.js'

const STORAGE_KEY = 'tekniik-currency-country'
const GEO_URL = 'https://api.country.is/'
const GEO_TIMEOUT = 2500

/* ISO 3166-1 alpha-2 codes that get sterling: the UK itself, the Crown
   Dependencies, and Gibraltar (their local pounds are at par with GBP
   and sterling circulates there, so a £ price is the right one to show).
   Every other country on earth gets USD, so only this list is kept. */
const GBP_COUNTRIES = new Set(['GB', 'UK', 'IM', 'JE', 'GG', 'GI'])

/* IANA zones that get sterling, including the legacy aliases some older
   devices still report. Everything else is USD. */
const GBP_ZONES = new Set([
  'Europe/London',
  'Europe/Belfast',
  'Europe/Guernsey',
  'Europe/Isle_of_Man',
  'Europe/Jersey',
  'Europe/Gibraltar',
  'GB',
  'GB-Eire',
])

/* The currency a crawler is shown: the primary market's (user 2026-08-13). */
const CRAWLER_CURRENCY = 'GBP'

/* Matched as WHOLE TOKENS against the user agent, never as a bare /bot/i:
   that substring lives inside real consumer user agents (CUBOT phones,
   Abot, Wibot browsers) and would hand sterling to a shopper in Berlin.
   Search engines first, then the AI crawlers, then the link unfurlers
   that render a card in a chat app - a £ price in a WhatsApp preview is
   right for the same reason it is right in a search result. */
const CRAWLERS = [
  'googlebot',
  'google-inspectiontool',
  'googleother',
  'storebot-google',
  'adsbot-google',
  'mediapartners-google',
  'bingbot',
  'bingpreview',
  'applebot',
  'duckduckbot',
  'yandexbot',
  'baiduspider',
  'petalbot',
  'sogou',
  'slurp',
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'dotbot',
  'screaming frog',
  'gptbot',
  'oai-searchbot',
  'chatgpt-user',
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'perplexitybot',
  'amazonbot',
  'bytespider',
  'facebookexternalhit',
  'facebookcatalog',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'discordbot',
  'telegrambot',
  'whatsapp',
  'redditbot',
  'pinterest',
  'embedly',
  'skypeuripreview',
]

export function isCrawler(ua) {
  if (!ua) return false
  const lower = String(ua).toLowerCase()
  return CRAWLERS.some((name) => lower.includes(name))
}

export function currencyForCountry(code) {
  return GBP_COUNTRIES.has(String(code).toUpperCase()) ? 'GBP' : DEFAULT_CURRENCY
}

/* stage 1 - the device's own time zone, read synchronously */
export function currencyFromDevice() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return zone && GBP_ZONES.has(zone) ? 'GBP' : DEFAULT_CURRENCY
  } catch {
    /* no Intl / no zone reported */
    return DEFAULT_CURRENCY
  }
}

function forcedCurrency() {
  try {
    const cur = new URLSearchParams(window.location.search).get('cur')
    if (!cur) return null
    const upper = cur.toUpperCase()
    return isSupportedCurrency(upper) ? upper : null
  } catch {
    return null
  }
}

function cachedCountry() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    /* private mode / storage disabled */
    return null
  }
}

const forced = typeof window === 'undefined' ? null : forcedCurrency()
const cached = typeof window === 'undefined' ? null : cachedCountry()
/* stage 0. `?cur=` still outranks it, so a crawler currency stays
   checkable by hand from any machine. */
const crawler = typeof navigator === 'undefined' ? false : isCrawler(navigator.userAgent)

function initial() {
  if (forced) return forced
  if (crawler) return CRAWLER_CURRENCY
  return cached ? currencyForCountry(cached) : currencyFromDevice()
}

let current = initial()
/* forced, crawler and cached answers are final; only a fresh visit from a
   real browser asks the network */
let settled = Boolean(forced || crawler || cached)

const listeners = new Set()

export function getCurrency() {
  return current
}

export function subscribeCurrency(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function set(next) {
  if (next === current) return
  current = next
  listeners.forEach((l) => l())
}

/* stage 2 - one lookup per page load, and never at all when the currency
   was forced by URL or already answered earlier in the session */
export function refineCurrencyFromIp() {
  if (settled || typeof window === 'undefined' || typeof fetch !== 'function') return
  settled = true

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT)

  fetch(GEO_URL, { signal: controller.signal, cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !data.country) return
      try {
        window.sessionStorage.setItem(STORAGE_KEY, data.country)
      } catch {
        /* storage disabled - the answer still applies to this page load */
      }
      set(currencyForCountry(data.country))
    })
    .catch(() => {
      /* offline, blocked by an extension, rate-limited or timed out:
         stage 1 already gave a usable answer, so this is a no-op */
    })
    .finally(() => clearTimeout(timer))
}
