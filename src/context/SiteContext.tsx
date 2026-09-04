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

// ── Types ────────────────────────────────────────────────────────────────────
export type EngineerInfo  = typeof D_ENG & { available: boolean }
export type Credential    = { label: string; value: string; detail: string; url?: string }
export type ExpertiseItem = { id: string; num: string; title: string; tags: string[]; desc: string }
export type ServiceItem   = { id: string; num: string; name: string; detail: string }
export type EducationItem = { period: string; degree: string; institution: string; note: string }
export type Settings      = {
  siteTitle: string
  pageDescription: string
  tools: string[]
  social: { linkedin: string; twitter: string; github: string }
}
export { type Project, type Experience }

export type SiteData = {
  engineer:    EngineerInfo
  credentials: Credential[]
  expertise:   ExpertiseItem[]
  projects:    Project[]
  services:    ServiceItem[]
  education:   EducationItem[]
  experience:  Experience[]
  settings:    Settings
}

type Ctx = {
  data:              SiteData
  loading:           boolean
  saved:             boolean
  updateEngineer:    (p: Partial<EngineerInfo>) => void
  updateCredentials: (v: Credential[]) => void
  updateExpertise:   (v: ExpertiseItem[]) => void
  updateProjects:    (v: Project[]) => void
  updateServices:    (v: ServiceItem[]) => void
  updateEducation:   (v: EducationItem[]) => void
  updateExperience:  (v: Experience[]) => void
  updateSettings:    (p: Partial<Settings>) => void
  resetToDefaults:   () => void
}

const CACHE_KEY = 'msa_site_v9'
const DB_ROW_ID = 1

const DEFAULT: SiteData = {
  engineer:    { ...D_ENG, available: true },
  credentials: D_CRED,
  expertise:   D_EXP,
  projects:    D_PROJ,
  services:    D_SVC,
  education:   D_EDU,
  experience:  D_EXP2,
  settings: {
    siteTitle:       'Md Sahin Alom — Electrical Engineer',
    pageDescription: 'Power systems engineer based in Zirabo, Ashulia, Savar, Dhaka.',
    tools: ['PSS/E', 'PSCAD', 'ETAP', 'DIgSILENT', 'AutoCAD Electrical', 'CYMGRD', 'SKM Power Tools', 'MATLAB/Simulink', 'Python', 'Microstation'],
    social: { linkedin: 'https://linkedin.com/in/sahinalom', twitter: '', github: '' },
  },
}

function deepMerge(parsed: Partial<SiteData>): SiteData {
  return {
    ...DEFAULT,
    ...parsed,
    engineer:   { ...DEFAULT.engineer,  ...parsed.engineer, photo: parsed.engineer?.photo || DEFAULT.engineer.photo },
    experience: parsed.experience ?? DEFAULT.experience,
    settings:   {
      ...DEFAULT.settings,
      ...parsed.settings,
      social: { ...DEFAULT.settings.social, ...(parsed.settings?.social ?? {}) },
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
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)) } catch {}
}

const SiteCtx = createContext<Ctx | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData]       = useState<SiteData>(() => readCache() ?? DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved]     = useState(true)
  const [timer, setTimer]     = useState<ReturnType<typeof setTimeout> | null>(null)

  // Fetch from Supabase on mount (tries structured relational tables first, falls back to site_config)
  useEffect(() => {
    let cancelled = false

    Promise.all([
      supabase.from('engineer_profile').select('*').single(),
      supabase.from('credentials').select('*').order('display_order', { ascending: true }),
      supabase.from('expertise').select('*').order('display_order', { ascending: true }),
      supabase.from('projects').select('*').order('display_order', { ascending: true }),
      supabase.from('services').select('*').order('display_order', { ascending: true }),
      supabase.from('education').select('*').order('display_order', { ascending: true }),
      supabase.from('experience').select('*').order('display_order', { ascending: true }),
      supabase.from('site_settings').select('*').single(),
    ]).then(([engRes, credRes, expRes, projRes, svcRes, eduRes, exp2Res, setRes]) => {
      if (cancelled) return
      if (engRes.data || (projRes.data && projRes.data.length > 0)) {
        const structured: Partial<SiteData> = {}
        if (engRes.data) {
          structured.engineer = {
            ...DEFAULT.engineer,
            ...engRes.data,
            yearsExp: engRes.data.years_exp ?? DEFAULT.engineer.yearsExp,
            projectsMW: engRes.data.projects_mw ?? DEFAULT.engineer.projectsMW,
            projectsCount: engRes.data.projects_count ?? DEFAULT.engineer.projectsCount,
          }
        }
        if (credRes.data?.length) structured.credentials = credRes.data
        if (expRes.data?.length) structured.expertise = expRes.data.map((x: any) => ({ ...x, desc: x.description || x.desc }))
        if (projRes.data?.length) structured.projects = projRes.data.map((x: any) => ({ ...x, imgColor: x.img_color || x.imgColor }))
        if (svcRes.data?.length) structured.services = svcRes.data
        if (eduRes.data?.length) structured.education = eduRes.data
        if (exp2Res.data?.length) structured.experience = exp2Res.data
        if (setRes.data) {
          structured.settings = {
            siteTitle: setRes.data.site_title || DEFAULT.settings.siteTitle,
            pageDescription: setRes.data.page_description || DEFAULT.settings.pageDescription,
            tools: setRes.data.tools || DEFAULT.settings.tools,
            social: {
              linkedin: setRes.data.social_linkedin || DEFAULT.settings.social.linkedin,
              twitter: setRes.data.social_twitter || '',
              github: setRes.data.social_github || '',
            }
          }
        }
        const merged = deepMerge(structured)
        setData(merged)
        writeCache(merged)
        setLoading(false)
        return
      }

      // Fallback to site_config
      supabase.from('site_config').select('data').eq('id', DB_ROW_ID).single().then(({ data: row }) => {
        if (cancelled) return
        if (row?.data) {
          const merged = deepMerge(row.data as Partial<SiteData>)
          setData(merged)
          writeCache(merged)
        }
        setLoading(false)
      }).catch(() => { if (!cancelled) setLoading(false) })
    }).catch(() => {
      supabase.from('site_config').select('data').eq('id', DB_ROW_ID).single().then(({ data: row }) => {
        if (cancelled) return
        if (row?.data) {
          const merged = deepMerge(row.data as Partial<SiteData>)
          setData(merged)
          writeCache(merged)
        }
        setLoading(false)
      }).catch(() => { if (!cancelled) setLoading(false) })
    })

    return () => { cancelled = true }
  }, [])

  const persist = useCallback((next: SiteData) => {
    setData(next)
    writeCache(next)
    setSaved(false)
    if (timer) clearTimeout(timer)

    let cancelled = false
    const now = new Date().toISOString()

    // 1. Sync to site_config
    supabase
      .from('site_config')
      .upsert({ id: DB_ROW_ID, data: next, updated_at: now })
      .then(() => {
        if (!cancelled) setTimer(setTimeout(() => setSaved(true), 800))
      })
      .catch(() => {
        if (!cancelled) setTimer(setTimeout(() => setSaved(true), 800))
      })

    // 2. Sync to structured tables in background
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
        tools: next.settings.tools,
        social_linkedin: next.settings.social?.linkedin || '',
        social_twitter: next.settings.social?.twitter || '',
        social_github: next.settings.social?.github || '',
        updated_at: now
      }).then(() => {}).catch(() => {})
    }

    return () => { cancelled = true }
  }, [timer])

  const updateEngineer    = (p: Partial<EngineerInfo>) => persist({ ...data, engineer: { ...data.engineer, ...p } })
  const updateCredentials = (v: Credential[])           => persist({ ...data, credentials: v })
  const updateExpertise   = (v: ExpertiseItem[])        => persist({ ...data, expertise: v })
  const updateProjects    = (v: Project[])              => persist({ ...data, projects: v })
  const updateServices    = (v: ServiceItem[])          => persist({ ...data, services: v })
  const updateEducation   = (v: EducationItem[])        => persist({ ...data, education: v })
  const updateExperience  = (v: Experience[])           => persist({ ...data, experience: v })
  const updateSettings    = (p: Partial<Settings>)      => persist({ ...data, settings: { ...data.settings, ...p } })

  const resetToDefaults = () => {
    supabase.from('site_config').delete().eq('id', DB_ROW_ID)
    localStorage.removeItem(CACHE_KEY)
    setData(DEFAULT)
    setSaved(true)
  }

  return (
    <SiteCtx.Provider value={{
      data, loading, saved,
      updateEngineer, updateCredentials, updateExpertise, updateProjects,
      updateServices, updateEducation, updateExperience, updateSettings,
      resetToDefaults,
    }}>
      {children}
    </SiteCtx.Provider>
  )
}

export function useSite() {
  const c = useContext(SiteCtx)
  if (!c) throw new Error('useSite outside SiteProvider')
  return c
}
