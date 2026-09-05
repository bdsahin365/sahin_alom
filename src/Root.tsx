import { Outlet } from 'react-router'
import { SiteProvider } from './context/SiteContext'
import Cursor from './components/Cursor'
import AnalyticsTracker from './components/AnalyticsTracker'

export default function Root() {
  return (
    <SiteProvider>
      <AnalyticsTracker />
      <Cursor />
      <Outlet />
    </SiteProvider>
  )
}
