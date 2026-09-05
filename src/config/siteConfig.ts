/**
 * Centralized Site, SEO, Analytics & Webmaster Configuration
 * Values can be configured via environment variables (e.g. in .env or Vercel Environment Variables)
 * or edited directly below.
 */

export const siteConfig = {
  // Website Base URL & Identity
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://sahinalom.com',
  siteName: 'Md Sahin Alom — Senior Electrical Engineer',
  siteTagline: 'Class ABC Licensed Electrical Engineer | Power Systems & Substation Design',
  defaultDescription:
    'Official website and technical engineering journal of Md Sahin Alom — Senior Electrical Engineer specialized in substation design, BNBC 2020 compliance, solar PV, and power distribution.',
  defaultOgImage: '/img/lighting-design-cover.jpg',

  // Author & Credentials
  author: {
    name: 'Md Sahin Alom',
    title: 'Senior Electrical Engineer & Building Services Specialist',
    license: 'Class ABC Licensed (Lic: ABC-74892)',
    email: 'contact@sahinalom.com',
    phone: '+880 1700-000000',
    location: 'Dhaka, Bangladesh',
    website: 'https://sahinalom.com',
  },

  // Social & Professional Profiles
  social: {
    linkedin: 'https://linkedin.com/in/sahinalom',
    github: 'https://github.com/bdsahin365',
    twitter: 'https://twitter.com/sahinalom',
    facebook: 'https://facebook.com/sahinalom',
  },

  // Analytics & Tracking IDs
  analytics: {
    // Google Analytics 4 (GA4) Measurement ID (e.g., 'G-XXXXXXXXXX')
    googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-D2L3P6E88X',
    
    // Microsoft Clarity ID for UX Heatmaps & Session Recording (e.g., 'xxxxxxxxxx')
    clarityId: import.meta.env.VITE_CLARITY_ID || '',
  },

  // Webmaster Tools & Search Engine Verification Keys
  verification: {
    // Google Search Console (Webmaster Tools) Verification Code
    // Get from https://search.google.com/search-console -> Settings -> Ownership verification -> HTML tag
    googleSiteVerification:
      import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || 'google-site-verification-sahinalom-official',

    // Bing Webmaster Tools Verification Code
    // Get from https://www.bing.com/webmasters -> Settings -> Verification -> Meta tag
    bingSiteVerification:
      import.meta.env.VITE_BING_SITE_VERIFICATION || 'bing-site-verification-sahinalom',

    // Yandex Webmaster Verification (Optional)
    yandexVerification:
      import.meta.env.VITE_YANDEX_VERIFICATION || '',

    // Baidu / Pinterest / Other Verification (Optional)
    pinterestVerification:
      import.meta.env.VITE_PINTEREST_VERIFICATION || '',
  },
}
