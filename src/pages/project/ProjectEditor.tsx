import { useState, useEffect, useRef, useMemo, type ChangeEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import {
  ArrowLeft, Save, Eye, ExternalLink, Trash2, Plus, X, Upload,
  CheckCircle2, AlertCircle, Loader2, Sparkles, Layers, Check,
  ShieldCheck, Image, FileText, Sliders, Cpu, MapPin, Building2, Calendar
} from 'lucide-react'
import { useSite, type Project } from '../../context/SiteContext'
import { compressAndConvertToBase64, formatBytes } from '../../lib/imageUtils'
import ConfirmationModal from '../admin/components/ConfirmationModal'

const CATEGORY_OPTIONS = [
  'Substation & Grid',
  'Renewable Solar PV',
  'Industrial Captive Power',
  'Commercial Infrastructure',
  'Power System Studies & ETAP',
  'Testing & Commissioning',
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: { projects }, updateProjects, saveSiteData } = useSite()

  const isEditing = Boolean(id && id !== 'new')
  const existingProject = useMemo(() => {
    if (!isEditing) return null
    return projects.find(p => p.id === id || p.slug === id) || null
  }, [isEditing, id, projects])

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('Substation & Grid')
  const [client, setClient] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [summary, setSummary] = useState('')
  const [detailedContent, setDetailedContent] = useState('')
  const [img, setImg] = useState('')
  const [imgColor, setImgColor] = useState('#D4CFC5')
  const [outcome, setOutcome] = useState('')

  // Dynamic Lists
  const [scopeList, setScopeList] = useState<string[]>([])
  const [newScopeItem, setNewScopeItem] = useState('')

  const [deliverablesList, setDeliverablesList] = useState<string[]>([])
  const [newDeliverableItem, setNewDeliverableItem] = useState('')

  const [toolsList, setToolsList] = useState<string[]>([])
  const [newToolItem, setNewToolItem] = useState('')

  const [specList, setSpecList] = useState<Array<{ key: string; value: string }>>([
    { key: 'Primary Voltage', value: '132 kV' },
    { key: 'Secondary Voltage', value: '33 kV' },
    { key: 'Grid Standards', value: 'IEC 61850 / BNBC 2020' },
  ])
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecVal, setNewSpecVal] = useState('')

  const [gallery, setGallery] = useState<string[]>([])

  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [saveToast, setSaveToast] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'gallery'>('details')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Initialize fields
  useEffect(() => {
    if (existingProject) {
      setTitle(existingProject.title || '')
      setSlug(existingProject.slug || slugify(existingProject.title || ''))
      setCategory(existingProject.category || 'Substation & Grid')
      setClient(existingProject.client || '')
      setLocation(existingProject.location || '')
      setCapacity(existingProject.capacity || '')
      setYear(existingProject.year || String(new Date().getFullYear()))
      setSummary(existingProject.summary || '')
      setDetailedContent(existingProject.detailedContent || '')
      setImg(existingProject.img || '')
      setImgColor(existingProject.imgColor || '#D4CFC5')
      setOutcome(existingProject.outcome || '')
      setScopeList(existingProject.scope || [])
      setDeliverablesList(existingProject.deliverables || [])
      setToolsList(existingProject.tools || [])
      setGallery(existingProject.gallery || [])

      if (existingProject.specifications) {
        setSpecList(Object.entries(existingProject.specifications).map(([key, value]) => ({ key, value })))
      }
    } else {
      setTitle('')
      setSlug('')
      setCategory('Substation & Grid')
      setClient('')
      setLocation('')
      setCapacity('')
      setYear(String(new Date().getFullYear()))
      setSummary('')
      setDetailedContent('')
      setImg('')
      setImgColor('#D4CFC5')
      setOutcome('')
      setScopeList([])
      setDeliverablesList([])
      setToolsList(['AutoCAD Electrical', 'ETAP'])
      setGallery([])
      setSpecList([
        { key: 'Primary Voltage', value: '132 kV' },
        { key: 'Secondary Voltage', value: '33 kV' },
      ])
    }
  }, [existingProject])

  // Handle auto-slugification on title change
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isEditing || !slug) {
      setSlug(slugify(val))
    }
  }

  // Handle Cover Photo Upload
  const handleCoverPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressing(true)
    setUploadStatus(`Compressing ${file.name}...`)

    try {
      const result = await compressAndConvertToBase64(file, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.82,
        mimeType: 'image/webp',
      })
      setImg(result.base64)
      const savings = Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100))
      setUploadStatus(`Optimized to ${formatBytes(result.compressedSize)} (${savings}% saved)`)
    } catch (err: any) {
      alert(err.message || 'Image compression failed')
    } finally {
      setCompressing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Handle Gallery Photo Uploads
  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setCompressing(true)
    try {
      const newImages: string[] = []
      for (let i = 0; i < files.length; i++) {
        const res = await compressAndConvertToBase64(files[i], {
          maxWidth: 1400,
          maxHeight: 1000,
          quality: 0.8,
          mimeType: 'image/webp',
        })
        newImages.push(res.base64)
      }
      setGallery(prev => [...prev, ...newImages])
    } catch (err: any) {
      alert('Gallery image upload failed: ' + err.message)
    } finally {
      setCompressing(false)
      if (galleryInputRef.current) galleryInputRef.current.value = ''
    }
  }

  // Save Project
  const handleSave = async () => {
    if (!title.trim()) {
      alert('Project Title is required.')
      return
    }

    setIsSaving(true)

    const specsRecord: Record<string, string> = {}
    specList.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specsRecord[s.key.trim()] = s.value.trim()
      }
    })

    const finalSlug = slug.trim() || slugify(title)
    const projectId = isEditing ? existingProject!.id : `proj_${Date.now()}`

    const payload: Project = {
      id: projectId,
      slug: finalSlug,
      title: title.trim(),
      category,
      client: client.trim(),
      location: location.trim(),
      capacity: capacity.trim(),
      year: year.trim(),
      summary: summary.trim(),
      detailedContent: detailedContent.trim() || undefined,
      img: img || undefined,
      imgColor: imgColor || '#D4CFC5',
      scope: scopeList.length > 0 ? scopeList : undefined,
      deliverables: deliverablesList.length > 0 ? deliverablesList : undefined,
      tools: toolsList.length > 0 ? toolsList : undefined,
      specifications: Object.keys(specsRecord).length > 0 ? specsRecord : undefined,
      gallery: gallery.length > 0 ? gallery : undefined,
      outcome: outcome.trim() || undefined,
    }

    let updatedProjects: Project[]
    if (isEditing) {
      updatedProjects = projects.map(p => (p.id === projectId ? payload : p))
    } else {
      updatedProjects = [payload, ...projects]
    }

    updateProjects(updatedProjects)
    await saveSiteData()

    setIsSaving(false)
    setSaveToast('Project saved successfully!')
    setTimeout(() => setSaveToast(null), 3000)

    if (!isEditing) {
      navigate(`/admin/projects/${payload.id}`, { replace: true })
    }
  }

  // Delete Project
  const handleDelete = async () => {
    if (!isEditing || !existingProject) return
    const updated = projects.filter(p => p.id !== existingProject.id)
    updateProjects(updated)
    await saveSiteData()
    navigate('/admin?tab=projects')
  }

  // Keyboard shortcut ⌘S
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void handleSave()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleSave])

  const previewSlug = slug || (existingProject ? existingProject.slug || existingProject.id : '')

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', display: 'flex', flexDirection: 'column', fontFamily: 'Outfit, sans-serif' }}>
      {/* ── Studio Top Bar ──────────────────────────────────────────────────── */}
      <header
        style={{
          height: 56,
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left: Back to Admin & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/admin?tab=projects')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#475569',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={13} /> Back to Projects
          </button>

          <span style={{ color: '#CBD5E1' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span style={{ color: '#94A3B8' }}>Studio</span>
            <span style={{ color: '#CBD5E1' }}>/</span>
            <span style={{ fontWeight: 600, color: '#0F172A', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title || (isEditing ? 'Edit Project' : 'New Project')}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {previewSlug && (
            <a
              href={`/projects/${previewSlug}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#475569',
                fontSize: 12,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              <Eye size={13} /> Preview Live <ExternalLink size={11} />
            </a>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 18px',
              borderRadius: 6,
              background: '#C47D0E',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(196,125,14,0.25)',
            }}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Project
          </button>
        </div>
      </header>

      {/* ── Studio Body: Two Columns ────────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: 1400, width: '100%', margin: '0 auto', padding: '24px 20px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Content Narrative & Structured Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Title & Slug Card */}
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Project Headline *
            </label>
            <input
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="e.g. 132/33kV Grid Substation at Meghnaghat"
              style={{
                width: '100%',
                fontSize: 22,
                fontWeight: 700,
                border: 'none',
                outline: 'none',
                color: '#0F172A',
                fontFamily: 'Outfit, sans-serif',
                marginBottom: 14,
              }}
            />

            {/* Slug row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12 }}>
              <span style={{ color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>/projects/</span>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="project-slug-identifier"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#C47D0E',
                  fontWeight: 600,
                  fontSize: 12,
                }}
              />
            </div>
          </div>

          {/* Navigation Tabs for Work Area */}
          <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
            {[
              { id: 'details' as const, label: 'Scope & Deliverables' },
              { id: 'specs' as const, label: 'Technical Specs Matrix' },
              { id: 'gallery' as const, label: `Blueprints & Gallery (${gallery.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeTab === tab.id ? '#FEF3C7' : 'transparent',
                  color: activeTab === tab.id ? '#92400E' : '#64748B',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Scope, Deliverables & Case Study Narrative */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Executive Summary */}
              <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Executive Engineering Summary
                </label>
                <textarea
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="Provide an executive summary of the power infrastructure scope, transformer rating, client objectives, and grid synchronization..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13.5,
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {/* Detailed Technical Narrative */}
              <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                    Full Technical Case Study Narrative
                  </label>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
                    MARKDOWN / PLAIN TEXT SUPPORTED
                  </span>
                </div>
                <textarea
                  value={detailedContent}
                  onChange={e => setDetailedContent(e.target.value)}
                  placeholder="Elaborate on the engineering methodology, single-line diagrams, relay settings calculation, power flow studies, switchgear installation hurdles, and on-site testing..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13.5,
                    fontFamily: 'Outfit, sans-serif',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    lineHeight: 1.7,
                  }}
                />
              </div>

              {/* Scope of Work Editor */}
              <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
                  Scope of Engineering Work ({scopeList.length} items)
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {scopeList.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#C47D0E', fontWeight: 700 }}>
                        0{idx + 1}
                      </span>
                      <span style={{ flex: 1, fontSize: 13 }}>{item}</span>
                      <button
                        type="button"
                        onClick={() => setScopeList(prev => prev.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 2 }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={newScopeItem}
                    onChange={e => setNewScopeItem(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (newScopeItem.trim()) {
                          setScopeList(prev => [...prev, newScopeItem.trim()])
                          setNewScopeItem('')
                        }
                      }
                    }}
                    placeholder="Add scope item (e.g. 132kV GIS bay erection & testing)..."
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newScopeItem.trim()) {
                        setScopeList(prev => [...prev, newScopeItem.trim()])
                        setNewScopeItem('')
                      }
                    }}
                    style={{ padding: '0 14px', borderRadius: 6, background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Key Deliverables Editor */}
              <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
                  Key Deliverables & Milestones ({deliverablesList.length} items)
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {deliverablesList.map((d, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <Check size={14} style={{ color: '#16A34A', flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13 }}>{d}</span>
                      <button
                        type="button"
                        onClick={() => setDeliverablesList(prev => prev.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 2 }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={newDeliverableItem}
                    onChange={e => setNewDeliverableItem(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (newDeliverableItem.trim()) {
                          setDeliverablesList(prev => [...prev, newDeliverableItem.trim()])
                          setNewDeliverableItem('')
                        }
                      }
                    }}
                    placeholder="Add deliverable (e.g. As-built single-line diagrams, FAT certificate)..."
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newDeliverableItem.trim()) {
                        setDeliverablesList(prev => [...prev, newDeliverableItem.trim()])
                        setNewDeliverableItem('')
                      }
                    }}
                    style={{ padding: '0 14px', borderRadius: 6, background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Verified Outcome */}
              <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Verified Outcome & Energization Milestone
                </label>
                <input
                  value={outcome}
                  onChange={e => setOutcome(e.target.value)}
                  placeholder="e.g. Successfully energized on schedule with zero LTI, achieving 99.98% power uptime."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Technical Specifications Matrix */}
          {activeTab === 'specs' && (
            <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#0F172A' }}>
                  Engineering Parameters & Key-Value Specifications
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748B' }}>
                  Displayed in the technical project matrix on the public case study page.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {specList.map((spec, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center' }}>
                    <input
                      value={spec.key}
                      onChange={e => {
                        const val = e.target.value
                        setSpecList(prev => prev.map((s, i) => (i === idx ? { ...s, key: val } : s)))
                      }}
                      placeholder="Parameter Name"
                      style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                    />
                    <input
                      value={spec.value}
                      onChange={e => {
                        const val = e.target.value
                        setSpecList(prev => prev.map((s, i) => (i === idx ? { ...s, value: val } : s)))
                      }}
                      placeholder="Engineering Value"
                      style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                    />
                    <button
                      type="button"
                      onClick={() => setSpecList(prev => prev.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center', paddingTop: 12, borderTop: '1px dashed #E2E8F0' }}>
                <input
                  value={newSpecKey}
                  onChange={e => setNewSpecKey(e.target.value)}
                  placeholder="e.g. Busbar Configuration"
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                />
                <input
                  value={newSpecVal}
                  onChange={e => setNewSpecVal(e.target.value)}
                  placeholder="e.g. Double Busbar with Bypass Isolator"
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSpecKey.trim() && newSpecVal.trim()) {
                      setSpecList(prev => [...prev, { key: newSpecKey.trim(), value: newSpecVal.trim() }])
                      setNewSpecKey('')
                      setNewSpecVal('')
                    }
                  }}
                  style={{ padding: '8px 14px', borderRadius: 6, background: '#C47D0E', color: '#FFFFFF', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                >
                  Add Spec
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Blueprints & Installation Gallery */}
          {activeTab === 'gallery' && (
            <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#0F172A' }}>
                    Blueprints & Site Photography Gallery
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748B' }}>
                    High-resolution SLDs and site photographs compressed into WebP automatically.
                  </p>
                </div>

                <input ref={galleryInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleGalleryUpload} />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={compressing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#334155',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: compressing ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Upload size={13} /> Upload Photos
                </button>
              </div>

              {gallery.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed #CBD5E1', borderRadius: 8, color: '#94A3B8' }}>
                  <Image size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                  No gallery images uploaded yet. Click "Upload Photos" to add blueprints or site installation views.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                  {gallery.map((imgUrl, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                      <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(239,68,68,0.9)',
                          color: '#FFFFFF',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Metadata & Settings Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Cover Photo Card */}
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
              Primary Cover Photo / Graphic
            </label>

            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverPhoto} />

            {img ? (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: 10 }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => setImg('')}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  borderRadius: 8,
                  border: '1px dashed #CBD5E1',
                  background: '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  marginBottom: 10,
                }}
              >
                <Upload size={24} style={{ color: '#94A3B8' }} />
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Click to upload project photo</span>
              </div>
            )}

            {uploadStatus && (
              <div style={{ fontSize: 11, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={12} /> {uploadStatus}
              </div>
            )}
          </div>

          {/* Project Details Card */}
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Project Parameters
            </h4>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Discipline</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none' }}
              >
                {CATEGORY_OPTIONS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Client */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Client / Organization</label>
              <input
                value={client}
                onChange={e => setClient(e.target.value)}
                placeholder="e.g. PGCB / Apex Group"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Location */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Site Location</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Savar, Dhaka, Bangladesh"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Installed Capacity */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Grid Rating / Capacity</label>
              <input
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                placeholder="e.g. 1250 KVA or 2x50/75 MVA"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Year */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Execution Year</label>
              <input
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="e.g. 2026"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Software & Tools Tags Card */}
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
              Software, Tools & Standards
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {toolsList.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    fontSize: 11,
                    color: '#334155',
                  }}
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setToolsList(prev => prev.filter((_, i) => i !== idx))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 1, color: '#94A3B8' }}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={newToolItem}
                onChange={e => setNewToolItem(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (newToolItem.trim()) {
                      setToolsList(prev => [...prev, newToolItem.trim()])
                      setNewToolItem('')
                    }
                  }
                }}
                placeholder="e.g. ETAP, CYMGRD"
                style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (newToolItem.trim()) {
                    setToolsList(prev => [...prev, newToolItem.trim()])
                    setNewToolItem('')
                  }
                }}
                style={{ padding: '0 10px', borderRadius: 6, background: '#F1F5F9', border: '1px solid #CBD5E1', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Delete Project Button (only when editing) */}
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px',
                borderRadius: 8,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={14} /> Delete This Project
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Engineering Project?"
        message={`Permanently remove "${title}" from the portfolio? This cannot be undone.`}
        confirmText="Yes, Delete Project"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Save Toast */}
      {saveToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            padding: '12px 20px',
            borderRadius: 8,
            background: '#0F172A',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
            zIndex: 1000,
          }}
        >
          <CheckCircle2 size={16} style={{ color: '#22C55E' }} /> {saveToast}
        </div>
      )}
    </div>
  )
}
