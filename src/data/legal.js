/* Legal pages — copy transcribed verbatim from the locked spec
   content/tekniik-legal-pages-spec.md (July 2026). Do not rewrite.
   Rendered by src/pages/Legal.jsx.

   Section body blocks:
     { type: 'p',     text }          paragraph
     { type: 'label', text }          italic sub-label ("Information you provide directly:")
     { type: 'sub',   text }          bold sub-heading ("Strictly Necessary Cookies")
     { type: 'list',  items: [...] }  bullet list
     { type: 'table', head, rows }    clean HTML table

   Inline markup understood by the template: **bold**,
   [label](/internal-route); bare https:// URLs and email
   addresses auto-link. Everything else renders as plain text. */

export const LEGAL_PAGES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'July 2026',
    sections: [
      {
        heading: '1. Who we are',
        blocks: [
          {
            type: 'p',
            text: 'This website is operated by Tekniik AI Studio Private Limited ("Tekniik", "we", "us", "our"). We are committed to protecting your privacy and handling your personal data responsibly.',
          },
          { type: 'p', text: 'Contact: hello@tekniik.ai' },
        ],
      },
      {
        heading: '2. What data we collect',
        blocks: [
          {
            type: 'p',
            text: 'When you use our website, we may collect the following personal data:',
          },
          { type: 'label', text: 'Information you provide directly:' },
          {
            type: 'list',
            items: [
              'Name, email address, and message content when you submit our contact form',
            ],
          },
          { type: 'label', text: 'Information collected automatically:' },
          {
            type: 'list',
            items: [
              'Pages visited, time spent on pages, and general browsing behaviour through Google Analytics',
              'Device type, browser type, and approximate geographic location (country/city level)',
              'Referring website (how you found us)',
            ],
          },
        ],
      },
      {
        heading: '3. How we use your data',
        blocks: [
          { type: 'p', text: 'We use your personal data for the following purposes:' },
          {
            type: 'list',
            items: [
              'To respond to your enquiries submitted through our contact form',
              'To analyse website traffic and improve our website experience',
              'To comply with legal obligations',
            ],
          },
          {
            type: 'p',
            text: 'We do not sell, rent, or share your personal data with third parties for marketing purposes.',
          },
        ],
      },
      {
        heading: '4. Legal basis for processing (UK & EU GDPR)',
        blocks: [
          {
            type: 'p',
            text: 'If you are located in the United Kingdom or European Economic Area, we process your data under the following legal bases:',
          },
          {
            type: 'list',
            items: [
              '**Legitimate interest**: to respond to your enquiry and to analyse website usage for improving our services',
              '**Consent**: for the use of analytics cookies (collected via our cookie consent banner)',
            ],
          },
        ],
      },
      {
        heading: '5. Third-party services',
        blocks: [
          {
            type: 'p',
            text: 'We use the following third-party services that may process your data:',
          },
          {
            type: 'list',
            items: [
              "**Google Analytics 4**: website traffic analysis. Google may process data on servers outside the UK/EEA. Google's privacy policy: https://policies.google.com/privacy",
              '**Google Search Console**: search performance monitoring (no personal data collected from visitors)',
              '**Firebase**: contact form submission processing',
            ],
          },
        ],
      },
      {
        heading: '6. Data retention',
        blocks: [
          {
            type: 'list',
            items: [
              'Contact form submissions: retained for 12 months after your last communication, then deleted',
              'Analytics data: retained according to Google Analytics default settings (14 months)',
            ],
          },
        ],
      },
      {
        heading: '7. Your rights',
        blocks: [
          {
            type: 'p',
            text: 'If you are located in the UK or EEA, you have the following rights under GDPR:',
          },
          {
            type: 'list',
            items: [
              '**Access**: request a copy of the personal data we hold about you',
              '**Rectification**: request correction of inaccurate data',
              '**Erasure**: request deletion of your data ("right to be forgotten")',
              '**Restriction**: request we limit how we use your data',
              '**Portability**: request your data in a portable format',
              '**Objection**: object to processing based on legitimate interest',
            ],
          },
          {
            type: 'p',
            text: 'To exercise any of these rights, contact us at hello@tekniik.ai. We will respond within 30 days.',
          },
        ],
      },
      {
        heading: '8. Cookies',
        blocks: [
          {
            type: 'p',
            text: 'We use cookies on this website. For full details, please see our [Cookie Policy](/cookie-policy).',
          },
        ],
      },
      {
        heading: "9. Children's privacy",
        blocks: [
          {
            type: 'p',
            text: 'Our website and services are not directed at individuals under 16. We do not knowingly collect personal data from children.',
          },
        ],
      },
      {
        heading: '10. Changes to this policy',
        blocks: [
          {
            type: 'p',
            text: 'We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.',
          },
        ],
      },
      {
        heading: '11. Contact us',
        blocks: [
          {
            type: 'p',
            text: 'If you have questions about this privacy policy or how we handle your data:',
          },
          { type: 'p', text: 'Email: hello@tekniik.ai' },
          {
            type: 'p',
            text: 'If you are unsatisfied with our response, you have the right to lodge a complaint with:',
          },
          {
            type: 'list',
            items: [
              "**UK:** Information Commissioner's Office (ICO): https://ico.org.uk",
              '**EU:** Your local data protection authority',
            ],
          },
        ],
      },
    ],
  },

  'terms-of-service': {
    title: 'Terms of Service',
    lastUpdated: 'July 2026',
    sections: [
      {
        heading: '1. Introduction',
        blocks: [
          {
            type: 'p',
            text: 'These terms of service ("Terms") govern your use of the website www.tekniik.ai ("Website") operated by Tekniik AI Studio Private Limited ("Tekniik", "we", "us", "our").',
          },
          {
            type: 'p',
            text: 'By accessing or using our Website, you agree to be bound by these Terms. If you do not agree, please do not use the Website.',
          },
        ],
      },
      {
        heading: '2. Use of the website',
        blocks: [
          {
            type: 'p',
            text: 'You may use this Website for lawful purposes only. You agree not to:',
          },
          {
            type: 'list',
            items: [
              'Use the Website in any way that violates applicable laws or regulations',
              'Attempt to gain unauthorised access to any part of the Website',
              'Use the Website to transmit harmful, offensive, or misleading content',
              'Copy, reproduce, or distribute any content from this Website without our permission',
            ],
          },
        ],
      },
      {
        heading: '3. Services',
        blocks: [
          {
            type: 'p',
            text: "Our Website provides information about Tekniik's software development services. The content on this Website is for general information purposes and does not constitute a contractual offer.",
          },
          {
            type: 'p',
            text: 'Specific project engagements are governed by separate agreements between Tekniik and the client.',
          },
        ],
      },
      {
        heading: '4. Intellectual property',
        blocks: [
          {
            type: 'p',
            text: 'All content on this Website, including but not limited to text, graphics, logos, icons, images, code, and design, is the property of Tekniik AI Studio Private Limited and is protected by applicable intellectual property laws.',
          },
          {
            type: 'p',
            text: 'You may not reproduce, distribute, modify, or create derivative works from any content on this Website without our prior written consent.',
          },
        ],
      },
      {
        heading: '5. Contact form',
        blocks: [
          {
            type: 'p',
            text: 'When you submit information through our contact form, you agree that:',
          },
          {
            type: 'list',
            items: [
              'The information you provide is accurate and complete',
              'We may use your contact details to respond to your enquiry',
              'Your data will be handled in accordance with our [Privacy Policy](/privacy-policy)',
            ],
          },
        ],
      },
      {
        heading: '6. Third-party links',
        blocks: [
          {
            type: 'p',
            text: 'Our Website may contain links to third-party websites. We are not responsible for the content, privacy practices, or availability of these external sites.',
          },
        ],
      },
      {
        heading: '7. Disclaimer',
        blocks: [
          {
            type: 'p',
            text: 'This Website and its content are provided "as is" without warranties of any kind, whether express or implied. We do not guarantee that the Website will be uninterrupted, error-free, or free from harmful components.',
          },
        ],
      },
      {
        heading: '8. Limitation of liability',
        blocks: [
          {
            type: 'p',
            text: 'To the fullest extent permitted by law, Tekniik shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Website.',
          },
        ],
      },
      {
        heading: '9. Governing law',
        blocks: [
          {
            type: 'p',
            text: 'These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
          },
        ],
      },
      {
        heading: '10. Changes to these terms',
        blocks: [
          {
            type: 'p',
            text: 'We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of the Website after changes are posted constitutes acceptance of the revised Terms.',
          },
        ],
      },
      {
        heading: '11. Contact us',
        blocks: [
          { type: 'p', text: 'If you have any questions about these Terms:' },
          { type: 'p', text: 'Email: hello@tekniik.ai' },
        ],
      },
    ],
  },

  'cookie-policy': {
    title: 'Cookie Policy',
    lastUpdated: 'July 2026',
    sections: [
      {
        heading: '1. What are cookies?',
        blocks: [
          {
            type: 'p',
            text: 'Cookies are small text files stored on your device when you visit a website. They help us understand how you use our website and improve your experience.',
          },
        ],
      },
      {
        heading: '2. How we use cookies',
        blocks: [
          {
            type: 'p',
            text: 'We use a limited number of cookies on this website, categorised as follows:',
          },
          { type: 'sub', text: 'Strictly Necessary Cookies' },
          {
            type: 'p',
            text: 'These cookies are essential for the website to function properly. They do not collect personal data and cannot be disabled.',
          },
          {
            type: 'table',
            head: ['Cookie', 'Purpose', 'Duration'],
            rows: [
              [
                'Cookie consent preference',
                'Remembers your cookie consent choice',
                '12 months',
              ],
            ],
          },
          { type: 'sub', text: 'Analytics Cookies' },
          {
            type: 'p',
            text: 'These cookies help us understand how visitors use our website. All data is anonymised and aggregated. These cookies are only set if you give consent.',
          },
          {
            type: 'table',
            head: ['Cookie', 'Provider', 'Purpose', 'Duration'],
            rows: [
              ['_ga', 'Google Analytics', 'Distinguishes unique visitors', '2 years'],
              ['_ga_[ID]', 'Google Analytics', 'Maintains session state', '2 years'],
            ],
          },
        ],
      },
      {
        heading: '3. Cookie consent',
        blocks: [
          {
            type: 'p',
            text: 'When you first visit our website, you will see a cookie consent banner. You can:',
          },
          {
            type: 'list',
            items: [
              '**Accept all cookies**: enables analytics cookies',
              '**Reject non-essential cookies**: only strictly necessary cookies are used',
              '**Manage preferences**: choose which categories to enable',
            ],
          },
          {
            type: 'p',
            text: 'You can change your cookie preferences at any time by clicking the cookie settings link in our website footer.',
          },
        ],
      },
      {
        heading: '4. How to control cookies in your browser',
        blocks: [
          {
            type: 'p',
            text: 'You can also control cookies through your browser settings. Most browsers allow you to:',
          },
          {
            type: 'list',
            items: [
              'View what cookies are stored',
              'Delete individual or all cookies',
              'Block cookies from specific or all websites',
              'Block third-party cookies',
            ],
          },
          {
            type: 'p',
            text: 'Please note that blocking cookies may affect your experience on our website.',
          },
          { type: 'p', text: 'Common browser cookie settings:' },
          {
            type: 'list',
            items: [
              'Chrome: Settings → Privacy and Security → Cookies',
              'Firefox: Settings → Privacy & Security → Cookies',
              'Safari: Preferences → Privacy → Cookies',
              'Edge: Settings → Cookies and Site Permissions',
            ],
          },
        ],
      },
      {
        heading: '5. Third-party cookies',
        blocks: [
          {
            type: 'p',
            text: "Google Analytics sets cookies on our behalf to collect anonymised usage data. Google's use of this data is governed by their privacy policy: https://policies.google.com/privacy",
          },
          {
            type: 'p',
            text: 'We do not use any advertising cookies or tracking pixels.',
          },
        ],
      },
      {
        heading: '6. Changes to this policy',
        blocks: [
          {
            type: 'p',
            text: 'We may update this cookie policy from time to time. Any changes will be posted on this page.',
          },
        ],
      },
      {
        heading: '7. Contact us',
        blocks: [
          { type: 'p', text: 'If you have questions about our use of cookies:' },
          { type: 'p', text: 'Email: hello@tekniik.ai' },
        ],
      },
    ],
  },

  gdpr: {
    title: 'GDPR Compliance',
    lastUpdated: 'July 2026',
    /* spec design note: this page should feel slightly warmer than the
       Privacy Policy — the template gives the opening section a teal-railed
       lede treatment when warm is set */
    warm: true,
    sections: [
      {
        heading: 'Our commitment to your data privacy',
        blocks: [
          {
            type: 'p',
            text: "At Tekniik, we take data protection seriously. We comply with the UK General Data Protection Regulation (UK GDPR), the EU General Data Protection Regulation (EU GDPR), and India's Digital Personal Data Protection Act 2023 (DPDP Act).",
          },
          {
            type: 'p',
            text: 'This page explains how we protect your data in plain English.',
          },
        ],
      },
      {
        heading: 'What data do we collect?',
        blocks: [
          { type: 'p', text: 'We keep it minimal. We only collect:' },
          {
            type: 'list',
            items: [
              'Your name, email, and message when you submit our contact form',
              'Anonymous website usage data through Google Analytics (only with your cookie consent)',
            ],
          },
          {
            type: 'p',
            text: "That's it. We don't collect payment details, track you across other websites, or build advertising profiles.",
          },
        ],
      },
      {
        heading: 'How do we protect it?',
        blocks: [
          {
            type: 'list',
            items: [
              'All data is transmitted over encrypted connections (HTTPS/SSL)',
              'Contact form submissions are stored securely with access limited to authorised team members only',
              'We use Google Analytics with IP anonymisation enabled',
              'Analytics cookies are only activated after you give explicit consent',
              'We do not share your personal data with third parties for marketing purposes',
            ],
          },
        ],
      },
      {
        heading: 'Your rights',
        blocks: [
          {
            type: 'p',
            text: "If you're located in the UK or EEA, you have the right to:",
          },
          {
            type: 'list',
            items: [
              '**Access** your data: ask us what we hold about you',
              "**Correct** your data: ask us to fix anything that's wrong",
              '**Delete** your data: ask us to erase it ("right to be forgotten")',
              '**Restrict** processing: ask us to limit how we use your data',
              '**Port** your data: receive your data in a standard format',
              '**Object**: tell us to stop processing your data',
            ],
          },
          {
            type: 'p',
            text: "To exercise any of these rights, email us at hello@tekniik.ai. We'll respond within 30 days.",
          },
        ],
      },
      {
        heading: 'Cookies',
        blocks: [
          {
            type: 'p',
            text: 'We use a small number of cookies. Analytics cookies are only set after you give consent through our cookie banner. You can change your preferences at any time through the cookie settings link in our footer.',
          },
          { type: 'p', text: 'Full details: [Cookie Policy](/cookie-policy)' },
        ],
      },
      {
        heading: 'Third-party services',
        blocks: [
          {
            type: 'table',
            head: ['Service', 'Purpose', 'Data processed'],
            rows: [
              [
                'Google Analytics 4',
                'Website traffic analysis',
                'Anonymous usage data (with consent)',
              ],
              ['Google Search Console', 'Search performance monitoring', 'No personal data'],
              ['Firebase', 'Contact form processing', 'Name, email, message'],
            ],
          },
        ],
      },
      {
        heading: 'Data retention',
        blocks: [
          {
            type: 'list',
            items: [
              'Contact form data: deleted after 12 months of inactivity',
              'Analytics data: retained for 14 months (Google default)',
            ],
          },
        ],
      },
      {
        heading: 'How to contact us',
        blocks: [
          { type: 'p', text: 'For any data protection queries:' },
          { type: 'p', text: 'Email: hello@tekniik.ai' },
          {
            type: 'p',
            text: "If you're unsatisfied with our response, you can lodge a complaint with:",
          },
          {
            type: 'list',
            items: [
              "**UK:** Information Commissioner's Office (ICO): ico.org.uk",
              '**EU:** Your local data protection authority',
            ],
          },
        ],
      },
      {
        heading: 'Updates',
        blocks: [
          {
            type: 'p',
            text: 'This page is reviewed regularly and updated when our data practices change. The date at the top shows the last revision.',
          },
        ],
      },
    ],
  },
}
