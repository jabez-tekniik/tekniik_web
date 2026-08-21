/* Pricing for /website-package (user 2026-08-04).

   ONE source of truth for every figure on the page. `config/currency.js`
   decides WHICH currency a visitor gets; this file decides WHAT the
   numbers are, and `moneyFor(code)` hands the page a ready-made set of
   strings. Nothing outside this file may hardcode a price.

   TWO PRICE LISTS, NOT A CONVERSION
   The UK sees sterling; everyone else sees US dollars (user 2026-08-04:
   "UK related IP should show pounds 599, 1199 and 2499 and other IPs
   should show in dollars with 799, 1499 and 2999"). Both lists are real
   market prices set by hand, not one list converted into the other, so
   there is no exchange rate here to drift, no FX request on a page that
   must price in the first paint, and no headline that twitches between
   visits. USD is the DEFAULT: an unrecognised country and a blocked geo
   lookup both land on dollars. CRAWLERS ARE THE EXCEPTION - they resolve
   to GBP (stage 0 in `currency.js`, user 2026-08-13), so the page is
   indexed at the primary market's price rather than at the price
   Googlebot's US IP would otherwise have picked.

   (This replaced a 19-currency model on 2026-08-04. Per-country pricing
   meant hardcoded rates going stale in currencies we do not actually
   sell in; two hand-set lists say the same thing to a buyer and cannot
   go wrong. If a third market ever earns its own list, add it here, add
   its countries and time zones in `currency.js`, and check the price
   stamp's size classes in HeroPackageSite.module.css still fit.) */

/* symbol    prefix as it should read to a local buyer
   tiers     starter / growth / professional
   agency    competitive anchor: what an agency quotes for a comparable
             5-page build (2026 market guides: GBP 2,500-5,000+,
             USD 3,000-10,000+ for a small-business site)
   renewal   year-two domain + hosting, the FAQ's range */
const CURRENCIES = {
  GBP: {
    symbol: '£',
    tiers: [599, 1199, 2499],
    agency: 2500,
    renewal: [80, 120],
  },
  USD: {
    symbol: '$',
    tiers: [799, 1499, 2999],
    agency: 3000,
    renewal: [110, 160],
  },
}

/* dollars, not pounds: sterling is the exception, granted by a UK IP */
export const DEFAULT_CURRENCY = 'USD'
export const SUPPORTED_CURRENCIES = Object.keys(CURRENCIES)

export function isSupportedCurrency(code) {
  return Object.prototype.hasOwnProperty.call(CURRENCIES, code)
}

function group(value) {
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(value)
}

function format(cur, value) {
  return cur.symbol + group(value)
}

function build(code) {
  const cur = CURRENCIES[code]
  const starter = format(cur, cur.tiers[0])

  return {
    code,
    note: `Prices shown in ${code}`,
    starter,
    growth: format(cur, cur.tiers[1]),
    professional: format(cur, cur.tiers[2]),
    from: `From ${starter}`,
    packagesFrom: `Plans from ${starter}.`,
    agencyWas: `${format(cur, cur.agency)}+`,
    /* the symbol leads the range once, the way a price range is written:
       "£80-120/year" */
    renewal: `${format(cur, cur.renewal[0])}-${group(cur.renewal[1])}/year`,
    /* browser tab title (user 2026-08-04: the title follows the
       detected currency too) */
    title: `Business Website Plans · From ${starter}`,
    /* meta description for <head> — it quotes the price, so it follows
       the detected currency exactly like the title does. No "+ VAT"
       anywhere on this page (user 2026-08-04). Read by config/seo.js.

       The STERLING variant names the UK market and the .co.uk domain,
       the dollar one stays neutral (2026-08-13). This is the description
       that gets INDEXED — crawlers resolve to GBP — so it is the one a
       UK searcher reads in the results, and market words earn their
       place there. The dollar variant is what a US visitor sees in their
       own tab, where a UK reference would be wrong. Market served, never
       "based in": the geography rule still holds. */
    description:
      code === 'GBP'
        ? `Professionally designed business websites for UK companies from ${starter}. A .co.uk domain, hosting, business email and SEO included in one all-inclusive price.`
        : `Professionally designed business websites from ${starter}. Domain, hosting, business email and SEO included in one all-inclusive price.`,
    /* the domain ending the hero vignette shows in its address bar. A
       .co.uk under a dollar price is the same mistake as the chart's
       ".co.uk domain" row, so sterling keeps the UK ending and everyone
       else sees .com. */
    tld: code === 'GBP' ? '.co.uk' : '.com',
  }
}

/* built once per currency: the page memoises its copy against this
   object's identity, so it has to be stable */
const cache = new Map()

export default function moneyFor(code) {
  const key = isSupportedCurrency(code) ? code : DEFAULT_CURRENCY
  let money = cache.get(key)
  if (!money) {
    money = build(key)
    cache.set(key, money)
  }
  return money
}
