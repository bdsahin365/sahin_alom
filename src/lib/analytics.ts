import { siteConfig } from '../config/siteConfig'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    clarity: (...args: any[]) => void
  }
}

let isGAInitialized = false
let isClarityInitialized = false

/**
 * Check if the user's browser has requested Do Not Track (DNT)
 */
function isDoNotTrackEnabled(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as any
  return nav.doNotTrack === '1' || window.doNotTrack === '1' || nav.msDoNotTrack === '1'
}

/**
 * Initialize Google Analytics 4 (gtag.js)
 */
export function initGoogleAnalytics(): void {
  if (typeof window === 'undefined') return
  if (isGAInitialized) return

  const gaId = siteConfig.analytics.googleAnalyticsId
  if (!gaId || gaId === 'G-XXXXXXXXXX') {
    // Analytics ID not configured yet; skip silently
    return
  }

  // If user has DNT enabled, respect privacy
  if (isDoNotTrackEnabled()) {
    console.info('[Analytics] Do Not Track is enabled; analytics disabled.')
    return
  }

  try {
    // 1. Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId, {
      send_page_view: false, // Managed manually via React Router in sendPageView
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    })

    // 2. Dynamically inject Google Tag Manager script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    script.async = true
    script.id = 'google-analytics-gtag'
    document.head.appendChild(script)

    isGAInitialized = true
    console.info(`[Analytics] Google Analytics 4 (${gaId}) initialized successfully.`)
  } catch (err) {
    console.warn('[Analytics] Failed to initialize Google Analytics:', err)
  }
}

/**
 * Initialize Microsoft Clarity (Heatmaps & Session Recording)
 */
export function initMicrosoftClarity(): void {
  if (typeof window === 'undefined') return
  if (isClarityInitialized) return

  const clarityId = siteConfig.analytics.clarityId
  if (!clarityId || clarityId === 'xxxxxxxxxx') return

  if (isDoNotTrackEnabled()) return

  try {
    const w = window as any
    w.clarity =
      w.clarity ||
      function () {
        ;(w.clarity.q = w.clarity.q || []).push(arguments)
      }

    const script = document.createElement('script')
    script.src = `https://www.clarity.ms/tag/${clarityId}`
    script.async = true
    script.id = 'microsoft-clarity'
    document.head.appendChild(script)

    isClarityInitialized = true
  } catch (err) {
    console.warn('[Analytics] Failed to initialize Microsoft Clarity:', err)
  }
}

/**
 * Send SPA virtual pageview on React Router navigation
 */
export function sendPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === 'undefined') return

  const gaId = siteConfig.analytics.googleAnalyticsId
  const title = pageTitle || document.title

  if (typeof window.gtag === 'function' && gaId && gaId !== 'G-XXXXXXXXXX') {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: window.location.href,
      page_path: pagePath,
      send_to: gaId,
    })
  }
}

/**
 * Track custom events (e.g. CV download, calculator use, diagram interactions)
 */
export function trackEvent(
  eventName: string,
  eventParams: Record<string, any> = {}
): void {
  if (typeof window === 'undefined') return

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...eventParams,
      event_time: new Date().toISOString(),
    })
  }
}
