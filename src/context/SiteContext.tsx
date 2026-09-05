import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
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

export type Credential    = { label: string; value: string; detail: string; url?: string }
export type ExpertiseItem = { id: string; num: string; title: string; tags: string[]; desc: string }
export type ServiceItem   = { id: string; num: string; name: string; detail: string }
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
  engineer:                 EngineerInfo
  credentials:              Credential[]
  expertise:                ExpertiseItem[]
  projects:                 Project[]
  services:                 ServiceItem[]
  education:                EducationItem[]
  experience:               Experience[]
  settings:                 Settings
  shorts:                   StoryItem[]
  showFloatingShortsBubble?: boolean
}

type Ctx = {
  data:                       SiteData
  loading:                    boolean
  saved:                      boolean
  updateEngineer:             (p: Partial<EngineerInfo>) => void
  updateCredentials:          (v: Credential[]) => void
  updateExpertise:            (v: ExpertiseItem[]) => void
  updateProjects:             (v: Project[]) => void
  updateServices:             (v: ServiceItem[]) => void
  updateEducation:            (v: EducationItem[]) => void
  updateExperience:           (v: Experience[]) => void
  updateSettings:             (p: Partial<Settings>) => void
  updateShorts:               (v: StoryItem[]) => void
  updateFloatingShortsBubble: (v: boolean) => void
  resetToDefaults:            () => void
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
    fatherName: 'Late Md. ...',
    motherName: 'Mrs. ...',
    dob: '1995-01-01',
    bloodGroup: 'B+',
    presentAddress: 'Savar, Dhaka, Bangladesh',
    permanentAddress: 'Savar, Dhaka, Bangladesh',
    declaration: 'Certified electrical engineer. All details and educational qualifications stated herein are accurate, authentic, and verifiable in all aspects.',
    cvTools: [
      'AutoCAD Electrical', 'Single-Line Diagrams (SLD)', 'Load Schedule Analysis',
      'Generator / ATS Wiring', 'Transformer & Switchgear', 'Power Factor Improvement (PFI)',
      'Fluke Earth Tester', 'Megger Insulation Tester', 'MS Office / Excel', 'ETAP', 'PVSyst'
    ],
  },
  credentials: D_CRED,
  expertise:   D_EXP,
  projects:    D_PROJ,
  services:    D_SVC,
  education:   D_EDU,
  experience:  D_EXP2,
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
    siteTitle:       siteConfig.siteName || 'Md Sahin Alom — Senior Electrical Engineer',
    pageDescription: siteConfig.defaultDescription || 'Power systems engineer specialized in substation design, BNBC 2020, and industrial power distribution.',
    siteUrl:         siteConfig.siteUrl || 'https://sahinalom.com',
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
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)) } catch {}
}

const SiteCtx = createContext<Ctx | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData]       = useState<SiteData>(() => readCache() ?? DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved]     = useState(true)
  const [timer, setTimer]     = useState<ReturnType<typeof setTimeout> | null>(null)

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
        setData(merged)
        writeCache(merged)
      } catch (err) {
        console.warn('Error loading site data from Supabase:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSiteData()
    return () => { cancelled = true }
  }, [])

  const persist = useCallback((next: SiteData) => {
    setData(next)
    writeCache(next)
    setSaved(false)
    if (timer) clearTimeout(timer)

    let cancelled = false
    const now = new Date().toISOString()

    // 1. Primary Sync: site_config (guaranteed full JSON state)
    supabase
      .from('site_config')
      .upsert({ id: DB_ROW_ID, data: next, updated_at: now })
      .then(({ error }) => {
        if (error) console.error('Error saving site_config:', error)
        if (!cancelled) setTimer(setTimeout(() => setSaved(true), 600))
      })
      .catch((err) => {
        console.error('Failed to upsert site_config:', err)
        if (!cancelled) setTimer(setTimeout(() => setSaved(true), 600))
      })

    // 2. Safe background sync to structured tables
    try {
      if (next.engineer) {
        supabase.from('engineer_profile').upsert({
          id: 'sahin',
          name: next.engineer.name,
          initials: next.engineer.initials,
          photo: next.engineer.photo,
          title: next.engineer.title,
          subtitle: next.engineer.subtitle,
          location: next.engineer.location,
          email: next.engineer.email,
          phone: next.engineer.phone,
          linkedin: next.engineer.linkedin,
          tagline: next.engineer.tagline,
          bio: next.engineer.bio,
          years_exp: next.engineer.yearsExp,
          projects_mw: next.engineer.projectsMW,
          projects_count: next.engineer.projectsCount,
          clients: next.engineer.clients,
          available: next.engineer.available,
          updated_at: now
        }).then(() => {}).catch(() => {})
      }

      if (next.shorts?.length) {
        supabase.from('shorts').upsert(next.shorts.map((s, i) => ({
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
        }))).then(() => {}).catch(() => {})
      }

      if (next.projects?.length) {
        supabase.from('projects').upsert(next.projects.map((p, i) => ({
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
          featured: p.featured ?? true,
          display_order: i + 1,
          updated_at: now
        }))).then(() => {}).catch(() => {})
      }

      if (next.services?.length) {
        supabase.from('services').upsert(next.services.map((s, i) => ({
          id: s.id,
          num: s.num || String(i + 1).padStart(2, '0'),
          name: s.name,
          detail: s.detail,
          display_order: i + 1,
        }))).then(() => {}).catch(() => {})
      }

      if (next.expertise?.length) {
        supabase.from('expertise').upsert(next.expertise.map((e, i) => ({
          id: e.id,
          num: e.num || String(i + 1).padStart(2, '0'),
          title: e.title,
          tags: e.tags,
          description: e.desc,
          display_order: i + 1,
        }))).then(() => {}).catch(() => {})
      }

      if (next.credentials?.length) {
        supabase.from('credentials').upsert(next.credentials.map((c, i) => ({
          id: `cred-${i + 1}`,
          label: c.label,
          value: c.value,
          detail: c.detail,
          url: c.url,
          display_order: i + 1,
        }))).then(() => {}).catch(() => {})
      }

      if (next.experience?.length) {
        supabase.from('experience').upsert(next.experience.map((e, i) => ({
          id: e.id,
          role: e.role,
          company: e.company,
          location: e.location,
          period: e.period,
          current: e.current,
          description: e.description,
          highlights: e.highlights,
          display_order: i + 1,
        }))).then(() => {}).catch(() => {})
      }

      if (next.education?.length) {
        supabase.from('education').upsert(next.education.map((e, i) => ({
          id: `edu-${i + 1}`,
          period: e.period,
          degree: e.degree,
          institution: e.institution,
          note: e.note,
          display_order: i + 1,
        }))).then(() => {}).catch(() => {})
      }

      if (next.settings) {
        supabase.from('site_settings').upsert({
          id: 'general',
          site_title: next.settings.siteTitle,
          page_description: next.settings.pageDescription,
          site_url: next.settings.siteUrl,
          tools: next.settings.tools,
          social_linkedin: next.settings.social?.linkedin || '',
          social_twitter: next.settings.social?.twitter || '',
          social_github: next.settings.social?.github || '',
          updated_at: now
        }).then(() => {}).catch(() => {})
      }
    } catch (err) {
      console.warn('Background structured sync notice:', err)
    }

    return () => { cancelled = true }
  }, [timer])

  const updateEngineer             = (p: Partial<EngineerInfo>) => persist({ ...data, engineer: { ...data.engineer, ...p } })
  const updateCredentials          = (v: Credential[])           => persist({ ...data, credentials: v })
  const updateExpertise            = (v: ExpertiseItem[])        => persist({ ...data, expertise: v })
  const updateProjects             = (v: Project[])              => persist({ ...data, projects: v })
  const updateServices             = (v: ServiceItem[])          => persist({ ...data, services: v })
  const updateEducation            = (v: EducationItem[])        => persist({ ...data, education: v })
  const updateExperience           = (v: Experience[])           => persist({ ...data, experience: v })
  const updateSettings             = (p: Partial<Settings>)      => persist({ ...data, settings: { ...data.settings, ...p } })
  const updateShorts               = (v: StoryItem[])            => persist({ ...data, shorts: v })
  const updateFloatingShortsBubble = (v: boolean)                => persist({ ...data, showFloatingShortsBubble: v })

  const resetToDefaults = () => {
    supabase.from('site_config').delete().eq('id', DB_ROW_ID)
    localStorage.removeItem(CACHE_KEY)
    setData(DEFAULT)
    setSaved(true)
  }

  return (
    <SiteCtx.Provider value={{
      data, loading, saved,
      updateEngineer, updateCredentials, updateExpertise,
      updateProjects, updateServices, updateEducation,
      updateExperience, updateSettings, updateShorts, updateFloatingShortsBubble,
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
