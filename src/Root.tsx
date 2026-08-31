import { Outlet } from 'react-router'
import { SiteProvider } from './context/SiteContext'
import Cursor from './components/Cursor'

export default function Root() {
  return (
    <SiteProvider>
      <Cursor />
      <Outlet />
    </SiteProvider>
  )
}
