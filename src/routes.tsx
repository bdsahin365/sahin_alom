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
import ContactPage from './pages/ContactPage'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter(
  [
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


