import { useState, useRef } from 'react'
import {
  Play,
  Film,
  Plus,
  Video,
  ChevronUp,
  ChevronDown,
  Trash2,
  Upload,
  Loader2,
  Check,
} from 'lucide-react'
import { useSite, StoryItem } from '../../../context/SiteContext'
import StoryModal from '../../../components/StoryModal'
import { formatBytes } from '../../../lib/imageUtils'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Switch,
  Grid2,
  Input,
  Textarea,
  ImagePicker,
} from '../components/AdminPrimitives'

export default function ShortsSection() {
  const { data, updateShorts, updateFloatingShortsBubble } = useSite()
  const shorts = data.shorts || []
  const showBubble = data.showFloatingShortsBubble !== false

  const [expandedId, setExpandedId] = useState<string | null>(shorts[0]?.id || null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [uploadingVideoId, setUploadingVideoId] = useState<string | null>(null)
  const [uploadMsg, setUploadMsg] = useState<{ id: string; text: string } | null>(null)

  const videoFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const updateItem = (id: string, patch: Partial<StoryItem>) => {
    const next = shorts.map(s => (s.id === id ? { ...s, ...patch } : s))
    updateShorts(next)
  }

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this video story?')) {
      updateShorts(shorts.filter(s => s.id !== id))
    }
  }

  const moveItem = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= shorts.length) return
    const next = [...shorts]
    const temp = next[index]
    next[index] = next[target]
    next[target] = temp
    updateShorts(next)
  }

  const addItem = () => {
    const newId = `story-${Date.now()}`
    const newItem: StoryItem = {
      id: newId,
      title: 'New Engineering Demonstration',
      subtitle: 'Technical field log, equipment inspection & operational testing',
      category: 'Power Engineering',
      videoUrl: '',
      timestamp: 'New Demo',
      enabled: true,
    }
    updateShorts([newItem, ...shorts])
    setExpandedId(newId)
  }

  const handleVideoUpload = (storyId: string, file: File) => {
    if (file.size > 80 * 1024 * 1024) {
      alert('Video file is larger than 80MB. Please use a compressed MP4 video or hosted video URL for optimal web performance.')
      return
    }
    setUploadingVideoId(storyId)
    setUploadMsg({ id: storyId, text: 'Processing video file…' })
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      updateItem(storyId, { videoUrl: dataUrl })
      setUploadingVideoId(null)
      setUploadMsg({ id: storyId, text: `Video loaded (${formatBytes(file.size)})` })
      setTimeout(() => setUploadMsg(null), 3500)
    }
    reader.onerror = () => {
      alert('Failed to read video file. Please try another video file.')
      setUploadingVideoId(null)
      setUploadMsg(null)
    }
    reader.readAsDataURL(file)
  }

  const launchPreview = (idx: number = 0) => {
    setPreviewIndex(idx)
    setPreviewOpen(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Overview & Floating Bubble Settings Card */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <CardTitle>Video Shorts & Story Highlights</CardTitle>
              <CardDescription>
                Manage vertical video reels, equipment breakdowns, and on-site engineering field stories shown on the homepage and searchable across the site.
              </CardDescription>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => launchPreview(0)}
                disabled={shorts.length === 0}
                style={{ borderColor: '#C47D0E', color: '#C47D0E' }}
              >
                <Play size={12} /> Live Story Player Preview
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#FAF8F5', borderRadius: 8, border: '1px solid #ECE7DE', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C47D0E', border: '1px solid #FDE68A', flexShrink: 0 }}>
                <Film size={18} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 13, color: '#0F172A' }}>
                  Floating Stories Bubble (Bottom Left)
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Show glowing floating story bubble with active story count on homepage
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontFamily: 'Outfit,sans-serif', color: showBubble ? '#16A34A' : '#94A3B8', fontWeight: 600 }}>
                {showBubble ? 'Enabled' : 'Disabled'}
              </span>
              <Switch checked={showBubble} onChange={v => updateFloatingShortsBubble(v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stories Management List */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle>Active Stories ({shorts.length})</CardTitle>
            <Button size="sm" onClick={addItem}>
              <Plus size={13} /> Add Video Story
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {shorts.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', background: '#FAF8F5', borderRadius: 8, border: '1px dashed #E2E8F0' }}>
              <Video size={32} style={{ color: '#94A3B8', margin: '0 auto 10px' }} />
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 14, color: '#0F172A', marginBottom: 4 }}>No video stories yet</div>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', maxWidth: 360, margin: '0 auto 16px' }}>
                Upload vertical field videos (.mp4) or paste URLs to showcase real engineering site work.
              </p>
              <Button size="sm" onClick={addItem}>
                <Plus size={12} /> Add First Video Story
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {shorts.map((item, i) => {
                const isExpanded = expandedId === item.id
                const isEnabled = item.enabled !== false
                const hasVideo = !!item.videoUrl

                return (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: 8,
                      overflow: 'hidden',
                      background: '#FFFFFF',
                      boxShadow: isExpanded ? '0 4px 12px rgba(0,0,0,0.04)' : 'none',
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', alignItems: 'center', background: isExpanded ? '#FAF8F5' : '#FFFFFF', borderBottom: isExpanded ? '1px solid #F1F5F9' : 'none' }}>
                      {/* Reorder Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #F1F5F9', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => i > 0 && moveItem(i, 'up')}
                          disabled={i === 0}
                          style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: i > 0 ? '#64748B' : '#CBD5E1', padding: '5px 8px' }}
                        >
                          <ChevronUp size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => i < shorts.length - 1 && moveItem(i, 'down')}
                          disabled={i >= shorts.length - 1}
                          style={{ background: 'none', border: 'none', cursor: i < shorts.length - 1 ? 'pointer' : 'default', color: i < shorts.length - 1 ? '#64748B' : '#CBD5E1', padding: '5px 8px' }}
                        >
                          <ChevronDown size={11} />
                        </button>
                      </div>

                      {/* Main Title & Click to expand */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 14px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          minWidth: 0,
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: hasVideo ? '#FEF3C7' : '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hasVideo ? '#C47D0E' : '#94A3B8', flexShrink: 0 }}>
                          <Play size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13.5, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.title || 'Untitled Video Story'}
                            </span>
                            <span style={{ padding: '1px 6px', background: '#F1F5F9', borderRadius: 4, fontSize: 10, fontFamily: 'JetBrains Mono,monospace', color: '#475569', fontWeight: 600 }}>
                              {item.category || 'General'}
                            </span>
                            {!hasVideo && (
                              <span style={{ padding: '1px 6px', background: '#FEF2F2', color: '#DC2626', borderRadius: 4, fontSize: 10, fontWeight: 500 }}>
                                No Video Attached
                              </span>
                            )}
                          </div>
                          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11.5, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                            {item.subtitle || 'No subtitle provided'}
                          </div>
                        </div>
                        <ChevronDown size={14} style={{ color: '#94A3B8', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
                      </button>

                      {/* Quick Enable Toggle */}
                      <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid #F1F5F9' }}>
                        <Switch checked={isEnabled} onChange={v => updateItem(item.id, { enabled: v })} />
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        style={{ padding: '0 12px', background: 'none', border: 'none', borderLeft: '1px solid #F1F5F9', cursor: 'pointer', color: '#CBD5E1', height: 48, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
                        title="Delete story"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Expanded Edit Form */}
                    {isExpanded && (
                      <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9', background: '#FFFFFF' }}>
                        <Grid2>
                          <Input
                            label="Story Title"
                            value={item.title}
                            onChange={v => updateItem(item.id, { title: v })}
                            placeholder="e.g. Substation High-Voltage Testing"
                          />
                          <Input
                            label="Category / Field Tag"
                            value={item.category}
                            onChange={v => updateItem(item.id, { category: v })}
                            placeholder="e.g. Protection Engineering, Solar PV"
                          />
                        </Grid2>

                        <Textarea
                          label="Subtitle & Technical Description"
                          value={item.subtitle}
                          onChange={v => updateItem(item.id, { subtitle: v })}
                          placeholder="Brief technical explanation shown at the bottom of the video player..."
                          rows={2}
                        />

                        <Grid2>
                          <Input
                            label="Timestamp Tag / Badge"
                            value={item.timestamp || 'Featured Demo'}
                            onChange={v => updateItem(item.id, { timestamp: v })}
                            placeholder="e.g. Featured Demo, Field Log, Site Audit"
                          />
                          <div style={{ marginBottom: 16 }}>
                            <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
                              Story Visibility
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36 }}>
                              <Switch checked={isEnabled} onChange={v => updateItem(item.id, { enabled: v })} />
                              <span style={{ fontSize: 12, fontFamily: 'Outfit,sans-serif', color: isEnabled ? '#16A34A' : '#64748B', fontWeight: 500 }}>
                                {isEnabled ? 'Visible in Story reels' : 'Hidden from frontend'}
                              </span>
                            </div>
                          </div>
                        </Grid2>

                        {/* Video Source Picker */}
                        <div style={{ marginBottom: 16, padding: '14px', background: '#FAF8F5', borderRadius: 6, border: '1px solid #ECE7DE' }}>
                          <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: 8 }}>
                            Video Source (.mp4 / .webm / CDN URL)
                          </label>

                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                            <input
                              ref={el => {
                                videoFileInputRefs.current[item.id] = el
                              }}
                              type="file"
                              accept="video/mp4,video/webm,video/*"
                              style={{ display: 'none' }}
                              onChange={e => {
                                const f = e.target.files?.[0]
                                if (f) handleVideoUpload(item.id, f)
                                e.target.value = ''
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => videoFileInputRefs.current[item.id]?.click()}
                              disabled={uploadingVideoId === item.id}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '7px 14px', borderRadius: 6,
                                background: '#C47D0E', color: '#FFFFFF',
                                fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12,
                                cursor: uploadingVideoId === item.id ? 'not-allowed' : 'pointer',
                                border: 'none',
                              }}
                            >
                              {uploadingVideoId === item.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />}
                              Upload Video from Device (.mp4)
                            </button>

                            {hasVideo && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => launchPreview(i)}
                              >
                                <Play size={11} /> Test Playback
                              </Button>
                            )}

                            {uploadMsg && uploadMsg.id === item.id && (
                              <span style={{ fontSize: 11, fontFamily: 'Outfit,sans-serif', color: '#16A34A', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <Check size={11} /> {uploadMsg.text}
                              </span>
                            )}
                          </div>

                          <Input
                            label="Or Direct Video URL"
                            value={item.videoUrl}
                            onChange={v => updateItem(item.id, { videoUrl: v })}
                            placeholder="https://...mp4 or data:video/mp4;base64,..."
                            hint="Works with MP4 links, Supabase storage, Cloudflare Stream, or direct video files"
                          />

                          {/* Video Preview Mini Player */}
                          {hasVideo && (
                            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: '#FFFFFF', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                              <video
                                src={item.videoUrl}
                                style={{ width: 64, height: 96, borderRadius: 4, objectFit: 'cover', background: '#000' }}
                                preload="metadata"
                                muted
                                playsInline
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Video Ready for Playback</div>
                                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                                  Will play seamlessly in vertical 9:16 mobile story reel mode with auto-progression.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Optional Poster Image */}
                        <ImagePicker
                          value={item.poster || ''}
                          onChange={url => updateItem(item.id, { poster: url })}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Interactive Story Modal Preview */}
      <StoryModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        initialIndex={previewIndex}
        stories={shorts}
      />
    </div>
  )
}
