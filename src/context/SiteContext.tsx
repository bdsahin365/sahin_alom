import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import {
  ENGINEER as D_ENG,
  CREDENTIALS as D_CRED,
  EXPERTISE as D_EXP,
  PROJECTS as D_PROJ,
  SERVICES as D_SVC,
  EDUCATION as D_EDU,
  EXPERIENCE as D_EXP2,
} from '../data/engineer'
import type { Project, Experience } from '../data/engineer'
import { supabase } from '../lib/supabase'
import { siteConfig } from '../config/siteConfig'

import breakerVideo from '../vid/How_circuit_breaker_works_202608220725.mp4'
import fieldVideo from '../vid/lv_0_20260822030810.mp4'
import { DEFAULT_WEDDING_CONFIG, type WeddingConfig } from '../wedding/weddingConfig'

// ── Types ────────────────────────────────────────────────────────────────────
export type EngineerInfo = typeof D_ENG & {
  available: boolean
  credentialsTag?: string
  whatsapp?: string
  fatherName?: string
  motherName?: string
  dob?: string
  bloodGroup?: string
  nationality?: string
  religion?: string
  maritalStatus?: string
  presentAddress?: string
  permanentAddress?: string
  declaration?: string
  cvTools?: string[]
}

export type Credential = { label: string; value: string; detail: string; url?: string }
export type ExpertiseItem = { id: string; num: string; title: string; tags: string[]; desc: string }
export type ServiceItem = { id: string; num: string; name: string; detail: string }
export type EducationItem = { period: string; degree: string; institution: string; note: string }

export type StoryItem = {
  id: string
  title: string
  subtitle: string
  category: string
  videoUrl: string
  poster?: string
  timestamp: string
  enabled?: boolean
}

export type AnalyticsSettings = {
  googleAnalyticsId: string
  clarityId: string
}

export type VerificationSettings = {
  googleSiteVerification: string
  bingSiteVerification: string
  yandexVerification?: string
  pinterestVerification?: string
}

export type BrandingSettings = {
  logo?: string
  logoType?: 'default_emblem' | 'custom_image'
  favicon?: string
  ogImage?: string
  resumeUrl?: string
  brandTitle?: string
  showBrandTitle?: boolean
  credentialBadge?: string
  showCredentialBadge?: boolean
  brandSubtitle?: string
  showBrandSubtitle?: boolean
  showLogoEmblem?: boolean
  primaryColor?: string
  displayFont?: string
  bodyFont?: string
}

export type Settings = {
  siteTitle: string
  pageDescription: string
  siteUrl: string
  tools: string[]
  branding: BrandingSettings
  social: {
    linkedin: string
    twitter: string
    github: string
    facebook?: string
    youtube?: string
  }
  analytics: AnalyticsSettings
  verification: VerificationSettings
}

export { type Project, type Experience }

export type SiteData = {
  engineer: EngineerInfo
  credentials: Credential[]
  expertise: ExpertiseItem[]
  projects: Project[]
  services: ServiceItem[]
  education: EducationItem[]
  experience: Experience[]
  settings: Settings
  shorts: StoryItem[]
  showFloatingShortsBubble?: boolean
  wedding: WeddingConfig
}

type Ctx = {
  data: SiteData
  loading: boolean
  saved: boolean
  isSaving: boolean
  lastSaved: string
  saveSiteData: () => Promise<{ success: boolean; error?: string }>
  updateEngineer: (p: Partial<EngineerInfo>) => void
  updateCredentials: (v: Credential[]) => void
  updateExpertise: (v: ExpertiseItem[]) => void
  updateProjects: (v: Project[]) => void
  updateServices: (v: ServiceItem[]) => void
  updateEducation: (v: EducationItem[]) => void
  updateExperience: (v: Experience[]) => void
  updateSettings: (p: Partial<Settings>) => void
  updateShorts: (v: StoryItem[]) => void
  updateFloatingShortsBubble: (v: boolean) => void
  updateWedding: (p: Partial<WeddingConfig>) => void
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  toggleTheme: () => void
  importSiteData: (imported: Partial<SiteData>) => void
  resetToDefaults: () => Promise<void> | void
}

const CACHE_KEY = 'msa_site_v13'
const DB_ROW_ID = 1

const DEFAULT: SiteData = {
  engineer: {
    ...D_ENG,
    available: true,
    credentialsTag: 'Class ABC Licensed',
    whatsapp: '01760816120',
    nationality: 'Bangladeshi (By Birth)',
    religion: 'Islam',
    maritalStatus: 'Single',
    fatherName: 'Md Hazrot Ali',
    motherName: 'Mrs Feroza Khatun',
    dob: '1998-08-10',
    bloodGroup: 'AB+',
    presentAddress: 'Savar, Dhaka, Bangladesh',
    permanentAddress: 'Bakura, Jhikargachha, Jashore',
    declaration: 'Certified electrical engineer. All details and educational qualifications stated herein are accurate, authentic, and verifiable in all aspects.',
    cvTools: [
      'AutoCAD Electrical', 'Single-Line Diagrams (SLD)', 'Load Schedule Analysis',
      'Generator / ATS Wiring', 'Transformer & Switchgear', 'Power Factor Improvement (PFI)',
      'Fluke Earth Tester', 'Megger Insulation Tester', 'MS Office / Excel', 'ETAP', 'PVSyst'
    ],
  },
  credentials: D_CRED,
  expertise: D_EXP,
  projects: D_PROJ,
  services: D_SVC,
  education: D_EDU,
  experience: D_EXP2,
  shorts: [
    {
      id: 'story-breaker',
      title: 'How Circuit Breakers Work',
      subtitle: 'Trip mechanism, arc chute & thermal-magnetic protection in industrial power systems',
      category: 'Protection Engineering',
      videoUrl: breakerVideo,
      timestamp: 'Featured Demo',
      enabled: true,
    },
    {
      id: 'story-field',
      title: 'Industrial Field Operations',
      subtitle: 'On-site power distribution, switchgear maintenance & electrical commissioning',
      category: 'Field Engineering',
      videoUrl: fieldVideo,
      timestamp: 'Field Log',
      enabled: true,
    },
  ],
  showFloatingShortsBubble: true,
  settings: {
    siteTitle: siteConfig.siteName || 'Md Sahin Alom — Senior Electrical Engineer',
    pageDescription: siteConfig.defaultDescription || 'Power systems engineer specialized in substation design, BNBC 2020, and industrial power distribution.',
    siteUrl: siteConfig.siteUrl || 'https://sahinalom.com',
    tools: ['PSS/E', 'PSCAD', 'ETAP', 'DIgSILENT', 'AutoCAD Electrical', 'CYMGRD', 'SKM Power Tools', 'MATLAB/Simulink', 'Python', 'Microstation'],
    branding: {
      logo: '',
      logoType: 'default_emblem',
      favicon: '',
      ogImage: '/img/lighting-design-cover.jpg',
      resumeUrl: '/CV.pdf',
      brandTitle: 'SAHIN ALOM',
      showBrandTitle: true,
      credentialBadge: 'PE',
      showCredentialBadge: true,
      brandSubtitle: 'ELECTRICAL ENGINEER • ABC LICENSED',
      showBrandSubtitle: true,
      showLogoEmblem: true,
      primaryColor: '#C47D0E',
      displayFont: 'Plus Jakarta Sans',
      bodyFont: 'Outfit',
    },
    social: {
      linkedin: siteConfig.social.linkedin || 'https://linkedin.com/in/sahinalom',
      twitter: siteConfig.social.twitter || 'https://twitter.com/sahinalom',
      github: siteConfig.social.github || 'https://github.com/bdsahin365',
      facebook: siteConfig.social.facebook || 'https://facebook.com/sahinalom',
      youtube: '',
    },
    analytics: {
      googleAnalyticsId: siteConfig.analytics.googleAnalyticsId || 'G-D2L3P6E88X',
      clarityId: siteConfig.analytics.clarityId || '',
    },
    verification: {
      googleSiteVerification: siteConfig.verification.googleSiteVerification || 'google-site-verification-sahinalom-official',
      bingSiteVerification: siteConfig.verification.bingSiteVerification || 'bing-site-verification-sahinalom',
      yandexVerification: siteConfig.verification.yandexVerification || '',
      pinterestVerification: siteConfig.verification.pinterestVerification || '',
    },
  },
  wedding: DEFAULT_WEDDING_CONFIG,
}

function deepMerge(parsed: Partial<SiteData>): SiteData {
  return {
    ...DEFAULT,
    ...parsed,
    engineer: {
      ...DEFAULT.engineer,
      ...(parsed.engineer ?? {}),
      photo: parsed.engineer?.photo || DEFAULT.engineer.photo,
      credentialsTag: parsed.engineer?.credentialsTag || DEFAULT.engineer.credentialsTag,
      whatsapp: parsed.engineer?.whatsapp || DEFAULT.engineer.whatsapp,
    },
    experience: parsed.experience ?? DEFAULT.experience,
    settings: {
      ...DEFAULT.settings,
      ...(parsed.settings ?? {}),
      branding: { ...DEFAULT.settings.branding, ...(parsed.settings?.branding ?? {}) },
      social: { ...DEFAULT.settings.social, ...(parsed.settings?.social ?? {}) },
      analytics: { ...DEFAULT.settings.analytics, ...(parsed.settings?.analytics ?? {}) },
      verification: { ...DEFAULT.settings.verification, ...(parsed.settings?.verification ?? {}) },
    },
    shorts: parsed.shorts && parsed.shorts.length > 0 ? parsed.shorts : DEFAULT.shorts,
    showFloatingShortsBubble: parsed.showFloatingShortsBubble ?? DEFAULT.showFloatingShortsBubble,
    wedding: {
      ...DEFAULT_WEDDING_CONFIG,
      ...(parsed.wedding ?? {}),
      events: parsed.wedding?.events && parsed.wedding.events.length > 0 ? parsed.wedding.events : DEFAULT_WEDDING_CONFIG.events,
      story: parsed.wedding?.story && parsed.wedding.story.length > 0 ? parsed.wedding.story : DEFAULT_WEDDING_CONFIG.story,
    },
  }
}

function readCache(): SiteData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return deepMerge(JSON.parse(raw))
  } catch { return null }
}

function writeCache(d: SiteData) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)) } catch { }
}

const SiteCtx = createContext<Ctx | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => readCache() ?? DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('')
  const dataRef = useRef<SiteData>(data)

  // ── Global Theme Management (Dark / Light) ──────────────────────────────────
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('msa_theme')
      if (saved === 'dark' || saved === 'light') return saved
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    } catch {}
    return 'light'
  })

  const setTheme = useCallback((t: 'light' | 'dark') => {
    setThemeState(t)
    try {
      localStorage.setItem('msa_theme', t)
      document.documentElement.setAttribute('data-theme', t)
      if (t === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch {}
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Dynamically synchronize favicon with document head
  useEffect(() => {
    const faviconUrl = data.settings.branding?.favicon
    if (faviconUrl) {
      let fav = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (!fav) {
        fav = document.createElement('link')
        fav.rel = 'icon'
        document.head.appendChild(fav)
      }
      fav.href = faviconUrl
    }
  }, [data.settings.branding?.favicon])

  // Dynamically synchronize primary brand color and typography across entire site
  useEffect(() => {
    const primaryColor = data.settings.branding?.primaryColor || '#C47D0E'
    const rawDisplay = data.settings.branding?.displayFont
    const displayFont = (!rawDisplay || rawDisplay === 'Barlow Condensed') ? 'Plus Jakarta Sans' : rawDisplay
    const bodyFont = data.settings.branding?.bodyFont || 'Outfit'

    // 1. Update CSS Variables on :root
    document.documentElement.style.setProperty('--accent', primaryColor)
    document.documentElement.style.setProperty('--font-display', `'${displayFont}', sans-serif`)
    document.documentElement.style.setProperty('--font-body', `'${bodyFont}', 'Hind Siliguri', sans-serif`)

    // Compute RGB for dim & glow tokens
    const hex = primaryColor.replace('#', '')
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        document.documentElement.style.setProperty('--accent-dim', `rgba(${r}, ${g}, ${b}, 0.1)`)
        document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.07)`)
      }
    }

    // 2. Ensure selected Google Fonts are loaded dynamically
    const fontFamilies = [displayFont, bodyFont].filter(f => f && f !== 'sans-serif')
    const uniqueFonts = Array.from(new Set(fontFamilies))
    const fontQuery = uniqueFonts.map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900`).join('&')

    let fontLink = document.getElementById('dynamic-google-fonts') as HTMLLinkElement
    if (!fontLink) {
      fontLink = document.createElement('link')
      fontLink.id = 'dynamic-google-fonts'
      fontLink.rel = 'stylesheet'
      document.head.appendChild(fontLink)
    }
    fontLink.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`
  }, [
    data.settings.branding?.primaryColor,
    data.settings.branding?.displayFont,
    data.settings.branding?.bodyFont
  ])

  // Fetch from Supabase on mount
  useEffect(() => {
    let cancelled = false

    async function loadSiteData() {
      try {
        // 1. Fetch site_config first (holds comprehensive JSON state including branding, settings, analytics)
        const { data: configRow } = await supabase
          .from('site_config')
          .select('data')
          .eq('id', DB_ROW_ID)
          .single()

        const baseData: Partial<SiteData> = configRow?.data ? (configRow.data as Partial<SiteData>) : {}

        // 2. Fetch structured tables in parallel to merge any direct edits
        const [engRes, credRes, expRes, projRes, svcRes, eduRes, exp2Res, setRes, shortsRes] = await Promise.allSettled([
          supabase.from('engineer_profile').select('*').single(),
          supabase.from('credentials').select('*').order('display_order', { ascending: true }),
          supabase.from('expertise').select('*').order('display_order', { ascending: true }),
          supabase.from('projects').select('*').order('display_order', { ascending: true }),
          supabase.from('services').select('*').order('display_order', { ascending: true }),
          supabase.from('education').select('*').order('display_order', { ascending: true }),
          supabase.from('experience').select('*').order('display_order', { ascending: true }),
          supabase.from('site_settings').select('*').single(),
          supabase.from('shorts').select('*').order('display_order', { ascending: true }),
        ])

        if (cancelled) return

        const structured: Partial<SiteData> = { ...baseData }

        const engData = engRes.status === 'fulfilled' ? engRes.value.data : null
        const credData = credRes.status === 'fulfilled' ? credRes.value.data : null
        const expData = expRes.status === 'fulfilled' ? expRes.value.data : null
        const projData = projRes.status === 'fulfilled' ? projRes.value.data : null
        const svcData = svcRes.status === 'fulfilled' ? svcRes.value.data : null
        const eduData = eduRes.status === 'fulfilled' ? eduRes.value.data : null
        const exp2Data = exp2Res.status === 'fulfilled' ? exp2Res.value.data : null
        const setDataRes = setRes.status === 'fulfilled' ? setRes.value.data : null
        const shortsData = shortsRes.status === 'fulfilled' ? shortsRes.value.data : null

        if (engData) {
          structured.engineer = {
            ...DEFAULT.engineer,
            ...(baseData.engineer ?? {}),
            ...engData,
            yearsExp: engData.years_exp ?? baseData.engineer?.yearsExp ?? DEFAULT.engineer.yearsExp,
            projectsMW: engData.projects_mw ?? baseData.engineer?.projectsMW ?? DEFAULT.engineer.projectsMW,
            projectsCount: engData.projects_count ?? baseData.engineer?.projectsCount ?? DEFAULT.engineer.projectsCount,
            credentialsTag: engData.credentials_tag ?? baseData.engineer?.credentialsTag ?? DEFAULT.engineer.credentialsTag,
            whatsapp: engData.whatsapp ?? baseData.engineer?.whatsapp ?? DEFAULT.engineer.whatsapp,
          }
        }
        if (credData?.length) structured.credentials = credData
        if (expData?.length) structured.expertise = expData.map((x: any) => ({ ...x, desc: x.description || x.desc }))
        if (projData?.length) structured.projects = projData.map((x: any) => ({ ...x, imgColor: x.img_color || x.imgColor }))
        if (svcData?.length) structured.services = svcData
        if (eduData?.length) structured.education = eduData
        if (exp2Data?.length) structured.experience = exp2Data

        if (shortsData?.length) {
          structured.shorts = shortsData.map((s: any) => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            category: s.category,
            videoUrl: s.video_url || s.videoUrl,
            poster: s.poster_url || s.poster,
            timestamp: s.timestamp_badge || s.timestamp || 'Demo',
            enabled: s.enabled !== false,
          }))
        }

        if (setDataRes) {
          structured.settings = {
            ...DEFAULT.settings,
            ...(baseData.settings ?? {}),
            siteTitle: setDataRes.site_title || baseData.settings?.siteTitle || DEFAULT.settings.siteTitle,
            pageDescription: setDataRes.page_description || baseData.settings?.pageDescription || DEFAULT.settings.pageDescription,
            siteUrl: setDataRes.site_url || baseData.settings?.siteUrl || DEFAULT.settings.siteUrl,
            tools: setDataRes.tools || baseData.settings?.tools || DEFAULT.settings.tools,
            branding: {
              ...DEFAULT.settings.branding,
              ...(baseData.settings?.branding ?? {}),
              logo: setDataRes.logo_url || baseData.settings?.branding?.logo || DEFAULT.settings.branding.logo,
              logoType: setDataRes.logo_type || baseData.settings?.branding?.logoType || DEFAULT.settings.branding.logoType,
              favicon: setDataRes.favicon_url || baseData.settings?.branding?.favicon || DEFAULT.settings.branding.favicon,
              ogImage: setDataRes.og_image_url || baseData.settings?.branding?.ogImage || DEFAULT.settings.branding.ogImage,
              resumeUrl: setDataRes.resume_url || baseData.settings?.branding?.resumeUrl || DEFAULT.settings.branding.resumeUrl,
              brandTitle: setDataRes.brand_title ?? baseData.settings?.branding?.brandTitle ?? DEFAULT.settings.branding.brandTitle,
              showBrandTitle: setDataRes.show_brand_title ?? baseData.settings?.branding?.showBrandTitle ?? DEFAULT.settings.branding.showBrandTitle,
              credentialBadge: setDataRes.credential_badge ?? baseData.settings?.branding?.credentialBadge ?? DEFAULT.settings.branding.credentialBadge,
              showCredentialBadge: setDataRes.show_credential_badge ?? baseData.settings?.branding?.showCredentialBadge ?? DEFAULT.settings.branding.showCredentialBadge,
              brandSubtitle: setDataRes.brand_subtitle ?? baseData.settings?.branding?.brandSubtitle ?? DEFAULT.settings.branding.brandSubtitle,
              showBrandSubtitle: setDataRes.show_brand_subtitle ?? baseData.settings?.branding?.showBrandSubtitle ?? DEFAULT.settings.branding.showBrandSubtitle,
              showLogoEmblem: setDataRes.show_logo_emblem ?? baseData.settings?.branding?.showLogoEmblem ?? DEFAULT.settings.branding.showLogoEmblem,
            },
            social: {
              ...DEFAULT.settings.social,
              ...(baseData.settings?.social ?? {}),
              linkedin: setDataRes.social_linkedin || baseData.settings?.social?.linkedin || DEFAULT.settings.social.linkedin,
              twitter: setDataRes.social_twitter || baseData.settings?.social?.twitter || DEFAULT.settings.social.twitter,
              github: setDataRes.social_github || baseData.settings?.social?.github || DEFAULT.settings.social.github,
              facebook: setDataRes.social_facebook || baseData.settings?.social?.facebook || DEFAULT.settings.social.facebook,
              youtube: setDataRes.social_youtube || baseData.settings?.social?.youtube || '',
            },
            analytics: {
              ...DEFAULT.settings.analytics,
              ...(baseData.settings?.analytics ?? {}),
              googleAnalyticsId: setDataRes.ga_id || baseData.settings?.analytics?.googleAnalyticsId || DEFAULT.settings.analytics.googleAnalyticsId,
              clarityId: setDataRes.clarity_id || baseData.settings?.analytics?.clarityId || DEFAULT.settings.analytics.clarityId,
            },
            verification: {
              ...DEFAULT.settings.verification,
              ...(baseData.settings?.verification ?? {}),
              googleSiteVerification: setDataRes.google_verification || baseData.settings?.verification?.googleSiteVerification || DEFAULT.settings.verification.googleSiteVerification,
              bingSiteVerification: setDataRes.bing_verification || baseData.settings?.verification?.bingSiteVerification || DEFAULT.settings.verification.bingSiteVerification,
              yandexVerification: setDataRes.yandex_verification || baseData.settings?.verification?.yandexVerification || '',
              pinterestVerification: setDataRes.pinterest_verification || baseData.settings?.verification?.pinterestVerification || '',
            },
          }
        }

        const merged = deepMerge(structured)
        dataRef.current = merged
        setData(merged)
        writeCache(merged)
        setSaved(true)
      } catch (err) {
        console.warn('Error loading site data from Supabase:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSiteData()
    return () => { cancelled = true }
  }, [])

  // ── MANUAL SAVE / SYNC WITH DATABASE ───────────────────────────────────────
  const saveSiteData = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsSaving(true)
    const current = dataRef.current
    const now = new Date().toISOString()

    try {
      // 1. Primary Sync: site_config (guaranteed full JSON state)
      let configErr: any = null
      try {
        const res = await supabase
          .from('site_config')
          .upsert({ id: DB_ROW_ID, data: current, updated_at: now })
        configErr = res.error
      } catch (networkErr: any) {
        configErr = networkErr
      }

      if (configErr) {
        console.warn('Supabase sync notice, cached locally:', configErr)
        writeCache(current)
        setSaved(true)
        setIsSaving(false)
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setLastSaved(timeStr)
        const msg = String(configErr?.message || configErr)
        if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('network') || msg.includes('Load failed')) {
          return { success: true, offline: true } as any
        }
        return { success: false, error: configErr.message || 'Saved to local cache' }
      }

      // 2. Safe background sync to structured tables
      try {
        const promises = []

        if (current.engineer) {
          promises.push(
            supabase.from('engineer_profile').upsert({
              id: 'sahin',
              name: current.engineer.name,
              initials: current.engineer.initials,
              photo: current.engineer.photo,
              title: current.engineer.title,
              subtitle: current.engineer.subtitle,
              location: current.engineer.location,
              email: current.engineer.email,
              phone: current.engineer.phone,
              linkedin: current.engineer.linkedin,
              tagline: current.engineer.tagline,
              bio: current.engineer.bio,
              years_exp: current.engineer.yearsExp,
              projects_mw: current.engineer.projectsMW,
              projects_count: current.engineer.projectsCount,
              clients: current.engineer.clients,
              available: current.engineer.available,
              updated_at: now
            })
          )
        }

        if (current.shorts?.length) {
          promises.push(
            supabase.from('shorts').upsert(current.shorts.map((s, i) => ({
              id: s.id,
              title: s.title,
              subtitle: s.subtitle,
              category: s.category,
              video_url: s.videoUrl,
              poster_url: s.poster || '',
              timestamp_badge: s.timestamp,
              enabled: s.enabled !== false,
              display_order: i + 1,
              updated_at: now
            })))
          )
        }

        if (current.projects?.length) {
          promises.push(
            supabase.from('projects').upsert(current.projects.map((p, i) => ({
              id: p.id,
              num: p.num || String(i + 1).padStart(2, '0'),
              title: p.title,
              client: p.client,
              location: p.location,
              capacity: p.capacity,
              year: p.year,
              category: p.category,
              img: p.img,
              img_color: p.imgColor,
              summary: p.summary,
              scope: p.scope,
              deliverables: p.deliverables,
              outcome: p.outcome,
              tools: p.tools,
              featured: (p as any).featured ?? true,
              display_order: i + 1,
              updated_at: now
            })))
          )
        }

        if (current.services?.length) {
          promises.push(
            supabase.from('services').upsert(current.services.map((s, i) => ({
              id: s.id,
              num: s.num || String(i + 1).padStart(2, '0'),
              name: s.name,
              detail: s.detail,
              display_order: i + 1,
            })))
          )
        }

        if (current.expertise?.length) {
          promises.push(
            supabase.from('expertise').upsert(current.expertise.map((e, i) => ({
              id: e.id,
              num: e.num || String(i + 1).padStart(2, '0'),
              title: e.title,
              tags: e.tags,
              description: e.desc,
              display_order: i + 1,
            })))
          )
        }

        if (current.credentials?.length) {
          promises.push(
            supabase.from('credentials').upsert(current.credentials.map((c, i) => ({
              id: `cred-${i + 1}`,
              label: c.label,
              value: c.value,
              detail: c.detail,
              url: c.url,
              display_order: i + 1,
            })))
          )
        }

        if (current.experience?.length) {
          promises.push(
            supabase.from('experience').upsert(current.experience.map((e, i) => ({
              id: e.id,
              role: e.role,
              company: e.company,
              location: e.location,
              period: e.period,
              current: e.current,
              description: e.description,
              highlights: e.highlights,
              display_order: i + 1,
            })))
          )
        }

        if (current.education?.length) {
          promises.push(
            supabase.from('education').upsert(current.education.map((e, i) => ({
              id: `edu-${i + 1}`,
              period: e.period,
              degree: e.degree,
              institution: e.institution,
              note: e.note,
              display_order: i + 1,
            })))
          )
        }

        if (current.settings) {
          promises.push(
            supabase.from('site_settings').upsert({
              id: 'general',
              site_title: current.settings.siteTitle,
              page_description: current.settings.pageDescription,
              site_url: current.settings.siteUrl,
              tools: current.settings.tools,
              social_linkedin: current.settings.social?.linkedin || '',
              social_twitter: current.settings.social?.twitter || '',
              social_github: current.settings.social?.github || '',
              updated_at: now
            })
          )
        }

        await Promise.allSettled(promises)
      } catch (syncErr) {
        console.warn('Background structured sync notice:', syncErr)
      }

      setSaved(true)
      setIsSaving(false)
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setLastSaved(timeStr)
      return { success: true }
    } catch (err: any) {
      console.warn('Network sync interrupted, safely saved to local cache:', err)
      writeCache(current)
      setSaved(true)
      setIsSaving(false)
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setLastSaved(timeStr)
      return { success: true, offline: true } as any
    }
  }, [])

  // ── LOCAL DRAFT STATE UPDATERS (NO NETWORK FLOODING ON EVERY KEYSTROKE) ─────
  const updateEngineer = useCallback((p: Partial<EngineerInfo>) => {
    setData(prev => {
      const next = { ...prev, engineer: { ...prev.engineer, ...p } }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateCredentials = useCallback((v: Credential[]) => {
    setData(prev => {
      const next = { ...prev, credentials: v }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateExpertise = useCallback((v: ExpertiseItem[]) => {
    setData(prev => {
      const next = { ...prev, expertise: v }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateProjects = useCallback((v: Project[]) => {
    setData(prev => {
      const next = { ...prev, projects: v }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateServices = useCallback((v: ServiceItem[]) => {
    setData(prev => {
      const next = { ...prev, services: v }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateEducation = useCallback((v: EducationItem[]) => {
    setData(prev => {
      const next = { ...prev, education: v }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateExperience = useCallback((v: Experience[]) => {
    setData(prev => {
      const next = { ...prev, experience: v }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateSettings = useCallback((p: Partial<Settings>) => {
    setData(prev => {
      const next = { ...prev, settings: { ...prev.settings, ...p } }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateShorts = useCallback((v: StoryItem[]) => {
    setData(prev => {
      const next = { ...prev, shorts: v }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateFloatingShortsBubble = useCallback((v: boolean) => {
    setData(prev => {
      const next = { ...prev, showFloatingShortsBubble: v }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const updateWedding = useCallback((p: Partial<WeddingConfig>) => {
    setData(prev => {
      const next = {
        ...prev,
        wedding: { ...(prev.wedding || DEFAULT_WEDDING_CONFIG), ...p },
      }
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const importSiteData = useCallback((imported: Partial<SiteData>) => {
    setData(prev => {
      const next = deepMerge({ ...prev, ...imported })
      dataRef.current = next
      writeCache(next)
      return next
    })
    setSaved(false)
  }, [])

  const resetToDefaults = async () => {
    await supabase.from('site_config').delete().eq('id', DB_ROW_ID)
    localStorage.removeItem(CACHE_KEY)
    dataRef.current = DEFAULT
    setData(DEFAULT)
    setSaved(true)
    setLastSaved('')
  }

  return (
    <SiteCtx.Provider value={{
      data, loading, saved, isSaving, lastSaved,
      theme, setTheme, toggleTheme,
      saveSiteData,
      updateEngineer, updateCredentials, updateExpertise,
      updateProjects, updateServices, updateEducation,
      updateExperience, updateSettings, updateShorts, updateFloatingShortsBubble,
      updateWedding,
      importSiteData,
      resetToDefaults,
    }}>
      {children}
    </SiteCtx.Provider>
  )
}

export const useSite = () => {
  const ctx = useContext(SiteCtx)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
