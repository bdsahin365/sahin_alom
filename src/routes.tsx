import { createBrowserRouter } from 'react-router'
import Root from './Root'
import SiteView from './pages/SiteView'
import Dashboard from './pages/Dashboard'
import CV from './pages/CV'
import Biodata from './pages/Biodata'
import AdminLogin from './pages/AdminLogin'
import AuthGuard from './components/AuthGuard'
import ToolsPage from './pages/tools/ToolsPage'
import ToolPage from './pages/tools/ToolPage'
import ArticleEditor from './pages/blog/ArticleEditor'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'
import ProjectPost from './pages/ProjectPost'
import ProjectEditor from './pages/project/ProjectEditor'
import ContactPage from './pages/ContactPage'
import NotFound from './pages/NotFound'
// Wedding — fully isolated; registered outside Root to prevent global style/cursor bleed
import WeddingPage from './wedding/WeddingPage'
// Dedicated Story Page — isolated outside Root (no nav, cursor, or site analytics)
import OurStory from './pages/OurStory'

export const router = createBrowserRouter(
  [
    // ── Dedicated page for Sadiya — standalone, no Root wrapper ──────────────
    // Pure private page: no portfolio navbar, footer, custom cursor, or trackers
    {
      path: '/sadiya',
      Component: OurStory,
    },
    {
      path: '/our-story',
      Component: OurStory,
    },
    {
      path: '/story',
      Component: OurStory,
    },

    // ── Wedding invitation — standalone, no Root wrapper ─────────────────────
    // This ensures the global Cursor, SiteProvider, and AnalyticsTracker
    // do NOT mount when visiting /wedding.
    {
      path: '/wedding',
      Component: WeddingPage,
    },

    // ── Main site ─────────────────────────────────────────────────────────────
    {
      path: '/',
      Component: Root,
      children: [
        { index: true, Component: SiteView },
        { path: 'cv', Component: CV },
        { path: 'biodata', Component: Biodata },
        { path: 'contact', Component: ContactPage },
        { path: 'tools', Component: ToolsPage },
        { path: 'tools/:slug', Component: ToolPage },
        { path: 'blog', Component: BlogIndex },
        { path: 'blog/:slug', Component: BlogPost },
        { path: 'projects/:slug', Component: ProjectPost },
        {
          path: 'admin',
          children: [
            { path: 'login', Component: AdminLogin },
            {
              Component: AuthGuard,
              children: [
                { index: true, Component: Dashboard },
                { path: 'articles/new', Component: ArticleEditor },
                { path: 'articles/:id', Component: ArticleEditor },
                { path: 'projects/new', Component: ProjectEditor },
                { path: 'projects/:id', Component: ProjectEditor },
              ],
            },
          ],
        },
        { path: '*', Component: NotFound },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' }
)


