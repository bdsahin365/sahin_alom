import { useState, useRef, useEffect, useCallback, ReactNode, ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, User, Award, Zap, FolderOpen, Briefcase, GraduationCap,
  Sparkles, Globe, Heart, Inbox, Play, BookOpen, Menu, X, ExternalLink,
  RotateCcw, LogOut, Save, CheckCircle2, FileDown, FileUp, ArrowUpRight, Plus, Copy
} from 'lucide-react'

import { useSite } from '../../context/SiteContext'
import { supabase } from '../../lib/supabase'
import sahinPhoto from '../../img/sahin.png'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import ConfirmationModal from './components/ConfirmationModal'
import {
  SectionId, Switch, Button, CommandPaletteModal, type CommandItem
} from './components/AdminPrimitives'

// 12 Dedicated Modular Sections
import OverviewSection from './sections/OverviewSection'
import ProjectsSection from './sections/ProjectsSection'
import BrandingSection from './sections/BrandingSection'
import ProfileSection from './sections/ProfileSection'
import HeroSection from './sections/HeroSection'
import CredentialsSection from './sections/CredentialsSection'
import ExpertiseSection from './sections/ExpertiseSection'
import ServicesSection from './sections/ServicesSection'
import EducationSection from './sections/EducationSection'
import SettingsSection from './sections/SettingsSection'
import MessagesSection from './sections/MessagesSection'
import ShortsSection from './sections/ShortsSection'
import WeddingSection from './sections/WeddingSection'
import ArticlesList from '../blog/ArticlesList'

const VALID_SECTIONS: SectionId[] = [
  'overview', 'hero', 'branding', 'shorts', 'articles', 'profile', 'credentials',
  'expertise', 'projects', 'services', 'education', 'settings', 'messages', 'wedding'
]

const TAB_STORAGE_KEY = 'sahin_admin_active_tab'

const getInitialSection = (): SectionId => {
  if (typeof window !== 'undefined') {
    try {
      const urlTab = new URLSearchParams(window.location.search).get('tab') as SectionId
      if (urlTab && VALID_SECTIONS.includes(urlTab)) return urlTab
      const savedTab = localStorage.getItem(TAB_STORAGE_KEY) as SectionId
      if (savedTab && VALID_SECTIONS.includes(savedTab)) return savedTab
    } catch {}
  }
  return 'overview'
}

const PANELS: Record<SectionId, (props: { onNavigate: (s: SectionId) => void }) => ReactNode> = {
  overview:    ({ onNavigate }) => <OverviewSection onNavigate={onNavigate} />,
  hero:        ({ onNavigate }) => <HeroSection onNavigate={onNavigate} />,
  branding:    ({ onNavigate }) => <BrandingSection onNavigate={onNavigate} />,
  shorts:      () => <ShortsSection />,
  articles:    () => <ArticlesList />,
  profile:     () => <ProfileSection />,
  credentials: () => <CredentialsSection />,
  expertise:   () => <ExpertiseSection />,
  projects:    () => <ProjectsSection />,
  services:    () => <ServicesSection />,
  education:   () => <EducationSection />,
  settings:    () => <SettingsSection />,
  messages:    () => <MessagesSection />,
  wedding:     () => <WeddingSection />,
}

const SECTION_LABELS: Record<SectionId, string> = {
  overview: 'Overview', hero: 'Hero & Visuals', branding: 'Logo & Colors', shorts: 'Video Shorts',
  articles: 'Articles', profile: 'Profile & Bio', credentials: 'Credentials',
  expertise: 'Expertise', projects: 'Projects', services: 'Services',
  education: 'Education', settings: 'SEO & Analytics', messages: 'Messages Inbox',
  wedding: 'Marriage Invitation',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, saved, isSaving, lastSaved, saveSiteData, resetToDefaults, updateEngineer, importSiteData } = useSite()

  const [section, setSectionState] = useState<SectionId>(getInitialSection)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 768
    return false
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [saveToast, setSaveToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [recentMsgs, setRecentMsgs] = useState<any[]>([])

  const mainScrollRef = useRef<HTMLElement>(null)
  const backupFileInputRef = useRef<HTMLInputElement>(null)

  const [articlesCount, setArticlesCount] = useState<number>(0)

  useEffect(() => {
    supabase.from('contact_messages').select('id, name, subject, created_at, read')
      .order('created_at', { ascending: false }).limit(6)
      .then((res: any) => { if (res?.data) setRecentMsgs(res.data) })
      .catch(() => {})

    supabase.from('articles').select('*', { count: 'exact', head: true })
      .then((res: any) => {
        if (typeof res?.count === 'number') setArticlesCount(res.count)
      })
      .catch(() => {})
  }, [section])

  const selectSection = useCallback((s: SectionId) => {
    setSectionState(s)
    setMobileMenuOpen(false)
    try { localStorage.setItem(TAB_STORAGE_KEY, s) } catch {}
    setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('tab', s); return n }, { replace: true })
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setSearchParams])

  useEffect(() => {
    const tabParam = searchParams.get('tab') as SectionId
    if (tabParam && VALID_SECTIONS.includes(tabParam) && tabParam !== section) {
      setSectionState(tabParam)
    }
  }, [searchParams, section])

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileMenuOpen(o => !o)
    } else {
      setCollapsed(c => !c)
    }
  }

  const handleSave = async () => {
    if (isSaving) return
    const res = await saveSiteData()
    if (res.success) {
      setSaveToast({
        type: 'success',
        message: (res as any).offline
          ? 'Saved to local browser cache (Supabase offline)'
          : 'All changes saved to database!',
      })
    } else {
      setSaveToast({ type: 'error', message: res.error || 'Failed to save.' })
    }
    setTimeout(() => setSaveToast(null), 3500)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); void handleSave() }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommandPaletteOpen(o => !o) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleSave])

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ app: 'sahin-portfolio', data }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `sahin_site_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setSaveToast({ type: 'success', message: 'Full site backup JSON exported!' })
    setTimeout(() => setSaveToast(null), 3000)
  }

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        if (parsed.data) { importSiteData(parsed.data); setSaveToast({ type: 'success', message: 'Backup loaded! Click Save to commit.' }) }
      } catch { setSaveToast({ type: 'error', message: 'Invalid JSON file.' }) }
    }
    reader.readAsText(file)
  }

  const commandItems: CommandItem[] = [
    ...VALID_SECTIONS.map(s => ({
      id: `p-${s}`, label: SECTION_LABELS[s], category: 'Pages & Sections' as const,
      icon: <FolderOpen size={15} />, onSelect: () => selectSection(s)
    })),
    { id: 'a-save', label: 'Save Changes to Database', category: 'Pro Actions', icon: <Save size={15} />, shortcut: '⌘S', onSelect: handleSave },
    { id: 'a-export', label: 'Export Backup JSON', category: 'Pro Actions', icon: <FileDown size={15} />, onSelect: handleExport },
    { id: 'a-preview', label: 'Open Live Website', category: 'Pro Actions', icon: <ArrowUpRight size={15} />, onSelect: () => window.open('/', '_blank') },
  ]

  const unreadCount = recentMsgs.filter(m => !m.read).length

  return (
    <div className="admin-shell" style={{ display: 'flex', height: '100vh', background: '#F8FAFC', fontFamily: 'Outfit,sans-serif', overflow: 'hidden' }}>
      <input ref={backupFileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
      <CommandPaletteModal open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} items={commandItems} />

      <AdminSidebar
        currentSection={section}
        onSelectSection={selectSection}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        itemCounts={{
          projects: data.projects?.length,
          articles: articlesCount,
          messages: unreadCount || undefined,
          credentials: data.credentials?.length,
          expertise: data.expertise?.length,
          services: data.services?.length,
          education: (data.education?.length || 0) + (data.experience?.length || 0),
          shorts: data.shorts?.length,
        }}
        onExportBackup={handleExport}
        onLogout={async () => { await supabase.auth.signOut(); navigate('/admin/login') }}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <AdminHeader
          sidebarCollapsed={collapsed}
          onToggleSidebar={handleToggleSidebar}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onViewSite={() => window.open('/', '_blank')}
          onSave={handleSave}
          isSaving={isSaving}
          saved={saved}
          lastSaved={lastSaved}
          currentSectionTitle={SECTION_LABELS[section] || 'Overview'}
          unreadMessagesCount={unreadCount}
          recentMessages={recentMsgs}
          onNavigateToMessages={() => selectSection('messages')}
          onNavigateToProfile={() => selectSection('profile')}
          onLogout={async () => { await supabase.auth.signOut(); navigate('/admin/login') }}
        />

        <main ref={mainScrollRef} className="admin-content-main" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: 'clamp(14px, 2.5vw, 24px)' }}>
          <div style={{ width: '100%', maxWidth: ['overview', 'projects', 'messages'].includes(section) ? '100%' : 940, margin: '0 auto' }}>
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }}>
                {PANELS[section]({ onNavigate: selectSection })}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ── Native App Bottom Navigation Bar (Mobile Viewports Only) ── */}
      <nav
        className="admin-mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(58px + env(safe-area-inset-bottom, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid #E2E8F0',
          display: 'none',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 850,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {/* 1. Overview */}
        <button
          type="button"
          onClick={() => selectSection('overview')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: '6px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: section === 'overview' ? '#C47D0E' : '#64748B',
            transition: 'all 0.15s ease',
          }}
        >
          <LayoutDashboard size={19} strokeWidth={section === 'overview' ? 2.5 : 2} />
          <span style={{ fontSize: 10.5, fontWeight: section === 'overview' ? 700 : 500, fontFamily: 'Outfit,sans-serif' }}>
            Home
          </span>
        </button>

        {/* 2. Projects */}
        <button
          type="button"
          onClick={() => selectSection('projects')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: '6px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: section === 'projects' ? '#C47D0E' : '#64748B',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ position: 'relative' }}>
            <FolderOpen size={19} strokeWidth={section === 'projects' ? 2.5 : 2} />
            {Boolean(data.projects?.length) && (
              <span
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -8,
                  fontSize: 9,
                  fontWeight: 700,
                  background: section === 'projects' ? '#C47D0E' : '#94A3B8',
                  color: '#FFFFFF',
                  borderRadius: 99,
                  padding: '1px 4px',
                  lineHeight: 1,
                }}
              >
                {data.projects?.length}
              </span>
            )}
          </div>
          <span style={{ fontSize: 10.5, fontWeight: section === 'projects' ? 700 : 500, fontFamily: 'Outfit,sans-serif' }}>
            Projects
          </span>
        </button>

        {/* 3. Articles */}
        <button
          type="button"
          onClick={() => selectSection('articles')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: '6px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: section === 'articles' ? '#C47D0E' : '#64748B',
            transition: 'all 0.15s ease',
          }}
        >
          <BookOpen size={19} strokeWidth={section === 'articles' ? 2.5 : 2} />
          <span style={{ fontSize: 10.5, fontWeight: section === 'articles' ? 700 : 500, fontFamily: 'Outfit,sans-serif' }}>
            Articles
          </span>
        </button>

        {/* 4. Inquiries / Messages */}
        <button
          type="button"
          onClick={() => selectSection('messages')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: '6px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: section === 'messages' ? '#C47D0E' : '#64748B',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ position: 'relative' }}>
            <Inbox size={19} strokeWidth={section === 'messages' ? 2.5 : 2} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -6,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#EF4444',
                }}
              />
            )}
          </div>
          <span style={{ fontSize: 10.5, fontWeight: section === 'messages' ? 700 : 500, fontFamily: 'Outfit,sans-serif' }}>
            Inquiries
          </span>
        </button>

        {/* 5. More / Drawer Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: '6px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: mobileMenuOpen ? '#C47D0E' : '#64748B',
            transition: 'all 0.15s ease',
          }}
        >
          <Menu size={19} strokeWidth={mobileMenuOpen ? 2.5 : 2} />
          <span style={{ fontSize: 10.5, fontWeight: mobileMenuOpen ? 700 : 500, fontFamily: 'Outfit,sans-serif' }}>
            More
          </span>
        </button>
      </nav>

      <ConfirmationModal
        isOpen={showReset}
        title="Reset Portfolio to Defaults?"
        message="This will overwrite customized content with baseline data. Action cannot be undone."
        confirmText="Yes, Reset"
        onConfirm={() => { resetToDefaults(); setShowReset(false) }}
        onCancel={() => setShowReset(false)}
      />

      {saveToast && (
        <div style={{ position: 'fixed', bottom: 76, right: 16, zIndex: 3000, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 8, background: saveToast.type === 'success' ? '#0F172A' : '#EF4444', color: '#FFF', fontSize: 13, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
          {saveToast.type === 'success' ? <CheckCircle2 size={16} style={{ color: '#22C55E' }} /> : <X size={16} />}
          {saveToast.message}
        </div>
      )}
    </div>
  )
}
