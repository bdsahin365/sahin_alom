import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import {
  X, Upload, Image, Check, Sparkles, FolderOpen,
  Layers, FileText, CheckCircle2, Sliders, AlertCircle, Loader2,
} from 'lucide-react'
import { type Project } from '../../context/SiteContext'
import { compressAndConvertToBase64, formatBytes } from '../../lib/imageUtils'

interface ProjectModalProps {
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

export default function ProjectModal({
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
        setToolsText((initialData.tools || []).join('\n'))
        setOutcome(initialData.outcome || '')
      } else {
        // Reset to clean state for new project
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
      setUploadStatus(null)
      setErrorMsg(null)
    }
  }, [isOpen, initialData])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setCompressing(true)
      setUploadStatus('Compressing project image...')
      const { base64, originalSize, compressedSize } = await compressAndConvertToBase64(file, {
        maxWidth: 1600,
        maxHeight: 1000,
        quality: 0.85,
        mimeType: 'image/jpeg',
      })
      setImg(base64)
      setUploadStatus(`Saved (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`)
      setTimeout(() => setUploadStatus(null), 3500)
    } catch (err: any) {
      setUploadStatus('Failed: ' + (err?.message || 'Error processing image'))
    } finally {
      setCompressing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMsg('Project title is required.')
      return
    }

    const scope = scopeText.split('\n').map(s => s.trim()).filter(Boolean)
    const deliverables = deliverablesText.split('\n').map(s => s.trim()).filter(Boolean)
    const tools = toolsText.split('\n').map(s => s.trim()).filter(Boolean)

    const project: Project = {
      id: initialData?.id || `proj-${Date.now()}`,
      num: initialData?.num || '01',
      title: title.trim(),
      category: category.trim(),
      client: client.trim(),
      location: location.trim(),
      capacity: capacity.trim(),
      year: year.trim(),
      summary: summary.trim(),
      img: img.trim(),
      imgColor: imgColor || '#D4CFC5',
      scope,
      deliverables,
      tools,
      outcome: outcome.trim(),
    }

    onSave(project)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        animation: 'adminFadeIn 0.18s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 820,
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'adminModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #E2E8F0',
            background: '#FAFAFA',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#FEF3C7',
                color: '#C47D0E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderOpen size={18} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                {isEditing ? 'Edit Engineered Project' : 'Create New Engineered Project'}
              </h2>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                Publish or update technical projects with full engineering specifications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#FEE2E2',
                color: '#DC2626',
                fontSize: 13,
                fontFamily: 'Outfit,sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 14, fontFamily: 'Outfit,sans-serif' }}>
              Project Identification & Scope
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                  Project Title *
                </label>
                <input
                  value={title}
                  onChange={e => { setTitle(e.target.value); setErrorMsg(null); }}
                  placeholder="e.g. 132/33kV Grid Substation Automation"
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                  Category / Discipline
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{
                      flex: 1,
                      height: 38,
                      padding: '0 10px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      fontSize: 13,
                      fontFamily: 'Outfit,sans-serif',
                      color: '#0F172A',
                      background: '#FFFFFF',
                      outline: 'none',
                    }}
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                  Client / Owner
                </label>
                <input
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  placeholder="e.g. DESCO / PGCB / Apex Textiles"
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                  Location / Site
                </label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Gazipur, Bangladesh"
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                  Capacity / Rating
                </label>
                <input
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  placeholder="e.g. 2 x 50/75 MVA, 132/33kV"
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                  Year of Delivery
                </label>
                <input
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="e.g. 2024"
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    fontFamily: 'Outfit,sans-serif',
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                Technical Summary Narrative
              </label>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Comprehensive technical summary describing the engineering objectives, challenge, and engineered solution..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  fontSize: 13,
                  fontFamily: 'Outfit,sans-serif',
                  color: '#0F172A',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Section 2: Cover Image & Presentation */}
          <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 14, fontFamily: 'Outfit,sans-serif' }}>
              Project Cover Image & Media
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={compressing}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 6,
                      background: '#C47D0E',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 12.5,
                      fontFamily: 'Outfit,sans-serif',
                      fontWeight: 600,
                      cursor: compressing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {compressing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {compressing ? 'Compressing…' : 'Upload Image'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="color"
                      value={imgColor}
                      onChange={e => setImgColor(e.target.value)}
                      style={{ width: 34, height: 34, padding: 2, border: '1px solid #CBD5E1', borderRadius: 6, cursor: 'pointer' }}
                      title="Card accent color"
                    />
                    <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{imgColor}</span>
                  </div>
                </div>

                {uploadStatus && (
                  <div style={{ fontSize: 11, color: uploadStatus.startsWith('Failed') ? '#DC2626' : '#16A34A', marginTop: 6, fontFamily: 'Outfit,sans-serif' }}>
                    {uploadStatus}
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4, fontFamily: 'Outfit,sans-serif' }}>
                    Or paste Image URL directly:
                  </label>
                  <input
                    value={img}
                    onChange={e => setImg(e.target.value)}
                    placeholder="https://... or data:image/..."
                    style={{
                      width: '100%',
                      height: 32,
                      padding: '0 10px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      fontSize: 12,
                      fontFamily: 'monospace',
                      color: '#334155',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div
                style={{
                  height: 120,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  background: img ? `url(${img}) center/cover no-repeat` : imgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {!img && (
                  <div style={{ textAlign: 'center', padding: 10 }}>
                    <Image size={24} style={{ margin: '0 auto 4px', opacity: 0.5 }} />
                    <div style={{ fontSize: 11, fontFamily: 'Outfit,sans-serif' }}>No Image Uploaded</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Deliverables & Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                Scope Items (one per line)
              </label>
              <textarea
                value={scopeText}
                onChange={e => setScopeText(e.target.value)}
                placeholder="132kV GIS bay engineering&#10;Relay coordination study&#10;Earthing grid design"
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  fontSize: 12,
                  fontFamily: 'Outfit,sans-serif',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                Deliverables (one per line)
              </label>
              <textarea
                value={deliverablesText}
                onChange={e => setDeliverablesText(e.target.value)}
                placeholder="Single Line Diagram (SLD)&#10;Protection relay settings matrix&#10;Commissioning test report"
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  fontSize: 12,
                  fontFamily: 'Outfit,sans-serif',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
                Tools & Standards (one per line)
              </label>
              <textarea
                value={toolsText}
                onChange={e => setToolsText(e.target.value)}
                placeholder="ETAP 20.5&#10;AutoCAD Electrical&#10;IEEE 80 / BNBC 2020"
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  fontSize: 12,
                  fontFamily: 'Outfit,sans-serif',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#334155', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>
              Key Outcome / Result
            </label>
            <input
              value={outcome}
              onChange={e => setOutcome(e.target.value)}
              placeholder="e.g. Commissioned 3 weeks ahead of schedule; zero relay trip incidents in 12 months."
              style={{
                width: '100%',
                height: 38,
                padding: '0 12px',
                borderRadius: 6,
                border: '1px solid #CBD5E1',
                fontSize: 13,
                fontFamily: 'Outfit,sans-serif',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
              paddingTop: 16,
              borderTop: '1px solid #E2E8F0',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: 6,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#334155',
                fontSize: 13,
                fontFamily: 'Outfit,sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={compressing}
              style={{
                padding: '8px 22px',
                borderRadius: 6,
                background: '#C47D0E',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 13,
                fontFamily: 'Outfit,sans-serif',
                fontWeight: 600,
                cursor: compressing ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(196, 125, 14, 0.3)',
              }}
            >
              {isEditing ? 'Update Project' : 'Save & Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
