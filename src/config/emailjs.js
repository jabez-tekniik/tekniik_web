/* EmailJS credentials.
   All three values are public by design — EmailJS is a browser-side service
   and they ship in the bundle regardless. The env vars exist so a fork or a
   staging account can be pointed elsewhere without a code edit. */
export const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_0y1838e',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_4w6dj49',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '_ScRb32MA7m0DOobf',
}
