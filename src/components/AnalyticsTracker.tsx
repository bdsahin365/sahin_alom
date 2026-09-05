import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { initGoogleAnalytics, initMicrosoftClarity, sendPageView } from '../lib/analytics'
import { useSite } from '../context/SiteContext'

/**
 * AnalyticsTracker handles:
 * 1. Initializing Google Analytics (GA4) & Microsoft Clarity with dynamic IDs from SiteContext
 * 2. Dynamically updating Webmaster meta verification tags in <head>
 * 3. Listening to SPA route changes via React Router and firing virtual pageviews
 */
export default function AnalyticsTracker() {
  const location = useLocation()
  const { data: { settings } } = useSite()

  const gaId = settings.analytics?.googleAnalyticsId
  const clarityId = settings.analytics?.clarityId
  const googleVer = settings.verification?.googleSiteVerification
  const bingVer = settings.verification?.bingSiteVerification

  // Initialize scripts and update verification tags when settings change
  useEffect(() => {
    if (gaId) {
      initGoogleAnalytics(gaId)
    }
    if (clarityId) {
      initMicrosoftClarity(clarityId)
    }

    // Synchronize Google Webmaster verification meta tag in <head>
    if (googleVer) {
      let gMeta = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement
      if (!gMeta) {
        gMeta = document.createElement('meta')
        gMeta.name = 'google-site-verification'
        document.head.appendChild(gMeta)
      }
      gMeta.content = googleVer
    }

    // Synchronize Bing Webmaster verification meta tag in <head>
    if (bingVer) {
      let bMeta = document.querySelector('meta[name="msvalidate.01"]') as HTMLMetaElement
      if (!bMeta) {
        bMeta = document.createElement('meta')
        bMeta.name = 'msvalidate.01'
        document.head.appendChild(bMeta)
      }
      bMeta.content = bingVer
    }
  }, [gaId, clarityId, googleVer, bingVer])

  // Send virtual pageview on route change
  useEffect(() => {
    const pagePath = location.pathname + location.search
    // Small timeout ensures document.title has been set by SEOHead / component
    const timer = setTimeout(() => {
      sendPageView(pagePath, document.title, gaId)
    }, 120)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search, gaId])

  return null
}
