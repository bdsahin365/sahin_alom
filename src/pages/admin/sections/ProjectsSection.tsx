import { useState, useMemo, useEffect, useRef, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Search, Plus, ArrowUpDown, ArrowUp, ArrowDown,
  Pencil, Trash2, ExternalLink, FolderX,
  CheckCircle, Zap, Shield, Sparkles, X, ChevronLeft, ChevronRight,
  Upload, Image, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'
import { useSite, type Project } from '../../../context/SiteContext'
import ConfirmationModal from '../components/ConfirmationModal'
import { TableSkeleton } from '../components/SkeletonLoader'
import { compressAndConvertToBase64, formatBytes } from '../../../lib/imageUtils'

// ─── PROJECT MODAL ─────────────────────────────────────────────────────────────

export interface ProjectModalProps {
  isOpen: boolean
  initialData?: Project | null
  onSave: (project: Project) => void
  onClose: () => void
}

const CATEGORY_OPTIONS = [
  'Substation & Grid',
  'Renewable Solar PV',
  'Industrial Captive Power',
  'Commercial Infrastructure',
  'Power System Studies & ETAP',
  'Testing & Commissioning',
]

export function ProjectModal({
  isOpen,
  initialData,
  onSave,
  onClose,
}: ProjectModalProps) {
  const isEditing = Boolean(initialData?.id)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Substation & Grid')
  const [client, setClient] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [summary, setSummary] = useState('')
  const [img, setImg] = useState('')
  const [imgColor, setImgColor] = useState('#D4CFC5')
  const [scopeText, setScopeText] = useState('')
  const [deliverablesText, setDeliverablesText] = useState('')
  const [toolsText, setToolsText] = useState('')
  const [outcome, setOutcome] = useState('')

  const [compressing, setCompressing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '')
        setCategory(initialData.category || 'Substation & Grid')
        setClient(initialData.client || '')
        setLocation(initialData.location || '')
        setCapacity(initialData.capacity || '')
        setYear(initialData.year || String(new Date().getFullYear()))
        setSummary(initialData.summary || '')
        setImg(initialData.img || '')
        setImgColor(initialData.imgColor || '#D4CFC5')
        setScopeText((initialData.scope || []).join('\n'))
        setDeliverablesText((initialData.deliverables || []).join('\n'))
        setToolsText((initialData.tools || []).join(', '))
        setOutcome(initialData.outcome || '')
      } else {
        setTitle('')
        setCategory('Substation & Grid')
        setClient('')
        setLocation('')
        setCapacity('')
        setYear(String(new Date().getFullYear()))
        setSummary('')
        setImg('')
        setImgColor('#D4CFC5')
        setScopeText('')
        setDeliverablesText('')
        setToolsText('')
        setOutcome('')
      }
      setErrorMsg(null)
      setUploadStatus(null)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressing(true)
    setErrorMsg(null)
    setUploadStatus(`Reading ${file.name} (${formatBytes(file.size)})...`)

    try {
      const result = await compressAndConvertToBase64(file, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.82,
        format: 'webp',
      })
      setImg(result.base64)
      setUploadStatus(`Compressed to ${formatBytes(result.size)} (${result.savings}% reduction)`)
    } catch (err: any) {
      setErrorMsg(err.message || 'Image compression failed')
      setUploadStatus(null)
    } finally {
      setCompressing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMsg('Project Title is required')
      return
    }

    const scopeArr = scopeText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const deliverablesArr = deliverablesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const toolsArr = toolsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const projectPayload: Project = {
      id: initialData?.id || `proj_${Date.now()}`,
      title: title.trim(),
      category,
      client: client.trim(),
      location: location.trim(),
      capacity: capacity.trim(),
      year: year.trim(),
      summary: summary.trim(),
      img: img || undefined,
      imgColor: imgColor || '#D4CFC5',
      scope: scopeArr.length > 0 ? scopeArr : undefined,
      deliverables: deliverablesArr.length > 0 ? deliverablesArr : undefined,
      tools: toolsArr.length > 0 ? toolsArr : undefined,
      outcome: outcome.trim() || undefined,
    }

    onSave(projectPayload)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 780,
          maxHeight: '92vh',
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAFAFA',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
              {isEditing ? 'Edit Engineering Project' : 'Create New Project'}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748B' }}>
              Document substation, renewable solar, or industrial electrical installations
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {errorMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#FEF2F2',
                  border: '1px solid #F87171',
                  borderRadius: 6,
                  color: '#991B1B',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}

            {/* Row 1: Title & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Project Title *
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 132/33kV Grid Substation at Meghnaghat"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Discipline / Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#FFFFFF',
                  }}
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Client & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Client / Owner
                </label>
                <input
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  placeholder="e.g. PGCB / Apex Holdings"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Location
                </label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Narayanganj, Bangladesh"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Row 3: Capacity & Year */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Capacity / Rating
                </label>
                <input
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  placeholder="e.g. 2 x 50/75 MVA or 10 MWp"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Execution Year
                </label>
                <input
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="e.g. 2024"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Row 4: Summary */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                Executive Summary / Description
              </label>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="High-level engineering overview, single-line diagram scope, transformer commissioning..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  fontSize: 13,
                  fontFamily: 'Outfit,sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Row 5: Photo / Blueprint Upload */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                Project Photo or Blueprint (Auto-compressed WebP)
              </label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={compressing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC',
                    cursor: compressing ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {compressing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {img ? 'Change Photo' : 'Upload Image'}
                </button>

                {img && (
                  <button
                    type="button"
                    onClick={() => setImg('')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #FCA5A5',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Remove Photo
                  </button>
                )}

                {uploadStatus && (
                  <span style={{ fontSize: 11, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={13} /> {uploadStatus}
                  </span>
                )}
              </div>

              {img && (
                <div style={{ marginTop: 10, width: '100%', height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                  <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Row 6: Scope items & Deliverables (multi-line) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Scope of Work (1 item per line)
                </label>
                <textarea
                  value={scopeText}
                  onChange={e => setScopeText(e.target.value)}
                  placeholder={"132kV GIS bay erection\nProtection relay coordination\nSCADA telemetry"}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Key Deliverables (1 item per line)
                </label>
                <textarea
                  value={deliverablesText}
                  onChange={e => setDeliverablesText(e.target.value)}
                  placeholder={"As-built single-line diagrams\nFactory acceptance test (FAT) cert\nGrid synchronization approval"}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            {/* Row 7: Engineering Tools & Outcome */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Software / Standards Used (comma separated)
                </label>
                <input
                  value={toolsText}
                  onChange={e => setToolsText(e.target.value)}
                  placeholder="AutoCAD Electrical, ETAP, IEC 61850, BNBC 2020"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Verified Outcome / Milestone
                </label>
                <input
                  value={outcome}
                  onChange={e => setOutcome(e.target.value)}
                  placeholder="e.g. Successfully energized on schedule with zero LTI"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #E2E8F0',
              background: '#FAFAFA',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                borderRadius: 6,
                border: 'none',
                background: '#C47D0E',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Sparkles size={14} />
              {isEditing ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── PRO PROJECTS DATA TABLE ──────────────────────────────────────────────────

export interface ProProjectsTableProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onAdd: () => void
  isLoading?: boolean
}

type SortField = 'title' | 'client' | 'year' | 'capacity' | 'category'

export function ProProjectsTable({
  projects,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: ProProjectsTableProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortField, setSortField] = useState<SortField>('year')
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  const categories = useMemo(() => {
    const set = new Set(projects.map(p => p.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [projects])

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.capacity.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)

      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter
      return matchesSearch && matchesCat
    })
  }, [projects, search, categoryFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA = (a[sortField] || '').toLowerCase()
      let valB = (b[sortField] || '').toLowerCase()
      if (sortField === 'year') {
        valA = a.year || ''
        valB = b.year || ''
      }
      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1 : -1
      return 0
    })
  }, [filtered, sortField, sortAsc])

  const totalPages = Math.ceil(sorted.length / pageSize) || 1
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  if (isLoading) {
    return <TableSkeleton rows={5} />
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      {/* Table Top Controls */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 16, fontWeight: 600, color: '#0F172A', margin: 0 }}>
                Engineered Power Projects
              </h3>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono,monospace',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: '#FEF3C7',
                  color: '#92400E',
                }}
              >
                {projects.length} Total
              </span>
            </div>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', margin: '3px 0 0' }}>
              Grid substations, solar PV power plants, and industrial electrical infrastructure
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: 8,
                padding: '0 10px',
                height: 36,
                width: 'clamp(180px, 24vw, 240px)',
              }}
            >
              <Search size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search projects, client..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 12.5,
                  fontFamily: 'Outfit,sans-serif',
                  color: '#0F172A',
                  width: '100%',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#94A3B8' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <Link
              to="/admin/projects/new"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                background: '#0F172A',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontFamily: 'Outfit,sans-serif',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <Sparkles size={14} style={{ color: '#F59E0B' }} /> Studio Editor
            </Link>

            <button
              type="button"
              onClick={onAdd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                height: 36,
                padding: '0 14px',
                borderRadius: 8,
                background: '#C47D0E',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'Outfit,sans-serif',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={15} /> Quick Add
            </button>
          </div>
        </div>

        {/* Categories Tab Pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => { setCategoryFilter(cat); setPage(1); }}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: '1px solid',
                borderColor: categoryFilter === cat ? '#C47D0E' : '#E2E8F0',
                background: categoryFilter === cat ? '#FEF3C7' : '#FFFFFF',
                color: categoryFilter === cat ? '#92400E' : '#64748B',
                fontSize: 11.5,
                fontWeight: categoryFilter === cat ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 18px', fontWeight: 600 }}>Project & Scope</th>
              <th onClick={() => handleSort('category')} style={{ padding: '12px 14px', fontWeight: 600, cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Discipline <ArrowUpDown size={12} />
                </span>
              </th>
              <th onClick={() => handleSort('client')} style={{ padding: '12px 14px', fontWeight: 600, cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Client / Location <ArrowUpDown size={12} />
                </span>
              </th>
              <th onClick={() => handleSort('capacity')} style={{ padding: '12px 14px', fontWeight: 600, cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Rating <ArrowUpDown size={12} />
                </span>
              </th>
              <th onClick={() => handleSort('year')} style={{ padding: '12px 14px', fontWeight: 600, cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Year <ArrowUpDown size={12} />
                </span>
              </th>
              <th style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
                  <FolderX size={36} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.6 }} />
                  No projects match your filter.
                </td>
              </tr>
            ) : (
              paginated.map(p => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFD')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                >
                  <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 6,
                          overflow: 'hidden',
                          background: p.imgColor || '#F1F5F9',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {p.img ? (
                          <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Zap size={18} style={{ color: '#C47D0E' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{p.title}</div>
                        {p.summary && (
                          <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.summary}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: '#F1F5F9',
                        color: '#475569',
                      }}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 500, color: '#1E293B' }}>{p.client || '—'}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.location || 'Bangladesh'}</div>
                  </td>
                  <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11.5, fontWeight: 600, color: '#0F172A' }}>
                      {p.capacity || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#64748B' }}>
                      {p.year || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', verticalAlign: 'middle', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <Link
                        to={`/admin/projects/${p.id}`}
                        style={{
                          padding: '5px 9px',
                          background: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          borderRadius: 6,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11.5,
                          color: '#92400E',
                          fontWeight: 600,
                        }}
                        title="Edit in Full Studio Editor"
                      >
                        <Sparkles size={11} /> Studio
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        style={{
                          padding: '5px 9px',
                          background: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          borderRadius: 6,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11.5,
                          color: '#334155',
                          fontWeight: 500,
                        }}
                        title="Quick Edit Info"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <a
                        href={`/projects/${p.slug || p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '5px 8px',
                          background: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          borderRadius: 6,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: '#64748B',
                        }}
                        title="View Public Case Study"
                      >
                        <ExternalLink size={12} />
                      </a>
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(p)}
                        style={{
                          padding: '5px 8px',
                          background: '#FEF2F2',
                          border: '1px solid #FECACA',
                          borderRadius: 6,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: '#DC2626',
                        }}
                        title="Delete Project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          background: '#FAFAFA',
          fontSize: 12,
          color: '#64748B',
        }}
      >
        <div>
          Showing {paginated.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(page * pageSize, sorted.length)} of {sorted.length} projects
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #CBD5E1',
              background: page <= 1 ? '#F1F5F9' : '#FFFFFF',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              color: page <= 1 ? '#94A3B8' : '#334155',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #CBD5E1',
              background: page >= totalPages ? '#F1F5F9' : '#FFFFFF',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              color: page >= totalPages ? '#94A3B8' : '#334155',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Engineering Project?"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"?`}
        confirmText="Delete Project"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          if (projectToDelete) {
            onDelete(projectToDelete.id)
            setProjectToDelete(null)
          }
        }}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  )
}

// ─── MASTER PROJECTS SECTION ──────────────────────────────────────────────────

export default function ProjectsSection() {
  const { data: { projects }, updateProjects } = useSite()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleSaveProject = (newOrUpdated: Project) => {
    const existingIndex = projects.findIndex(p => p.id === newOrUpdated.id)
    if (existingIndex >= 0) {
      updateProjects(projects.map(p => (p.id === newOrUpdated.id ? newOrUpdated : p)))
    } else {
      updateProjects([newOrUpdated, ...projects])
    }
  }

  const handleDeleteProject = (id: string) => {
    updateProjects(projects.filter(p => p.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProProjectsTable
        projects={projects}
        onEdit={p => {
          setEditingProject(p)
          setModalOpen(true)
        }}
        onDelete={handleDeleteProject}
        onAdd={() => {
          setEditingProject(null)
          setModalOpen(true)
        }}
      />

      <ProjectModal
        isOpen={modalOpen}
        initialData={editingProject}
        onSave={handleSaveProject}
        onClose={() => {
          setModalOpen(false)
          setEditingProject(null)
        }}
      />
    </div>
  )
}
