import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { initGoogleAnalytics, initMicrosoftClarity, sendPageView } from '../lib/analytics'

/**
 * AnalyticsTracker handles:
 * 1. Initializing Google Analytics (GA4) & Microsoft Clarity
 * 2. Listening to SPA route changes via React Router and firing virtual pageviews
 */
export default function AnalyticsTracker() {
  const location = useLocation()

  // Initialize scripts on initial load
  useEffect(() => {
    initGoogleAnalytics()
    initMicrosoftClarity()
  }, [])

  // Send virtual pageview on route change
  useEffect(() => {
    const pagePath = location.pathname + location.search
    // Small timeout ensures document.title has been set by SEOHead / component
    const timer = setTimeout(() => {
      sendPageView(pagePath, document.title)
    }, 100)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search])

  return null
}
