import { useEffect, useSyncExternalStore } from 'react'
import { getCurrency, refineCurrencyFromIp, subscribeCurrency } from '../config/currency.js'

/* Reads the detected currency for /website-package and re-renders if the
   IP lookup corrects the device guess. `useSyncExternalStore` (not
   useState + setState in an effect) because the answer lives in a module
   store shared by the page and the hero vignette — and because setting
   state from an effect is a lint error in this codebase. */
export default function useCurrency() {
  const currency = useSyncExternalStore(subscribeCurrency, getCurrency, getCurrency)

  /* fires once per page load; the module guards against repeats */
  useEffect(() => {
    refineCurrencyFromIp()
  }, [])

  return currency
}
