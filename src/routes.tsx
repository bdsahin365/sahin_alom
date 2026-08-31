import { createBrowserRouter } from 'react-router'
import Root from './Root'
import SiteView from './pages/SiteView'
import Dashboard from './pages/Dashboard'
import CV from './pages/CV'
import Biodata from './pages/Biodata'
import AdminLogin from './pages/AdminLogin'
import AuthGuard from './components/AuthGuard'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Root,
      children: [
        { index: true, Component: SiteView },
        { path: 'cv', Component: CV },
        { path: 'biodata', Component: Biodata },
        {
          path: 'admin',
          children: [
            { path: 'login', Component: AdminLogin },
            {
              Component: AuthGuard,
              children: [
                { index: true, Component: Dashboard },
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' }
)
