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

  // Fetch from Supabase on mount
  useEffect(() => {
    let cancelled = false
    supabase
      .from('site_config')
      .select('data')
      .eq('id', DB_ROW_ID)
      .single()
      .then(({ data: row }) => {
        if (cancelled) return
        if (row?.data) {
          const merged = deepMerge(row.data as Partial<SiteData>)
          setData(merged)
          writeCache(merged)
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const persist = useCallback((next: SiteData) => {
    setData(next)
    writeCache(next)
    setSaved(false)
    if (timer) clearTimeout(timer)

    let cancelled = false
    supabase
      .from('site_config')
      .upsert({ id: DB_ROW_ID, data: next, updated_at: new Date().toISOString() })
      .then(() => {
        if (!cancelled) {
          setTimer(setTimeout(() => setSaved(true), 800))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTimer(setTimeout(() => setSaved(true), 800))
        }
      })

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
