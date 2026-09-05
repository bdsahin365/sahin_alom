import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Youtube from '@tiptap/extension-youtube'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import python from 'highlight.js/lib/languages/python'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import { fetchArticleById, saveArticle as persistArticle, Article } from '../../lib/articlesService'
import { isBengali } from '../../lib/langUtils'
import { CalcBlock } from './extensions/CalcBlock'
import { MermaidBlock } from './extensions/MermaidBlock'
import { FileAttachment } from './extensions/FileAttachment'
import EditorTopBar from './components/EditorTopBar'
import EditorToolbar from './components/EditorToolbar'
import FloatingToolbar from './components/FloatingToolbar'
import TableToolbar from './components/TableToolbar'
import SettingsPanel from './components/SettingsPanel'
import SlashMenu from './components/SlashMenu'
import PublishDialog from './components/PublishDialog'
import VersionHistory from './components/VersionHistory'
import ShortcutsDialog from './components/ShortcutsDialog'
import MathModal from './components/MathModal'
import CalcModal from './components/CalcModal'
import MediaUploadModal from './components/MediaUploadModal'
import FileAttachmentModal from './components/FileAttachmentModal'
import MermaidModal from './components/MermaidModal'
import LinkModal from './components/LinkModal'
import YoutubeModal from './components/YoutubeModal'
import TableInsertModal from './components/TableInsertModal'
import type { CalcBlockAttrs } from './extensions/CalcBlock'
import { ImageIcon, X, Trash2, Edit3, Sparkles } from 'lucide-react'

// ── Lowlight setup ────────────────────────────────────────────────────────────
const lowlight = createLowlight()
lowlight.register('python', python)
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('bash', bash)

// ── Article meta shape ───────────────────────────────────────────────────────
interface ArticleMeta {
  status: 'draft' | 'published' | 'scheduled'
  author: string
  category: string
  tags: string[]
  featuredImage: string
  publishDate: string
  visibility: 'public' | 'private'
  metaTitle: string
  metaDesc: string
  slug: string
  canonicalUrl: string
}

const DEFAULT_META: ArticleMeta = {
  status: 'draft',
  author: 'Md Sahin Alom',
  category: 'Electrical Engineering',
  tags: [],
  featuredImage: '',
  publishDate: '',
  visibility: 'public',
  metaTitle: '',
  metaDesc: '',
  slug: '',
  canonicalUrl: '',
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function renderMathInElement(el: HTMLElement) {
  const w = window as any
  if (w.renderMathInElement) {
    w.renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
    })
  }
}

const SUGGESTIONS = [
  { emoji: '📐', text: 'Start with a heading' },
  { emoji: '🖼️', text: 'Add a featured image' },
  { emoji: '∑', text: 'Insert an equation' },
  { emoji: '⚡', text: 'Engineering calculation' },
  { emoji: '📊', text: 'Create a diagram' },
]

export default function ArticleEditor() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [articleId, setArticleId] = useState<string | null>(isNew ? null : (id ?? null))
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [meta, setMeta] = useState<ArticleMeta>(DEFAULT_META)
  const [saved, setSaved] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState('Synced')
  const [syncToast, setSyncToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [panelOpen, setPanelOpen] = useState(true)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile' | null>(null)

  // Pending initial content from database for when TipTap editor mounts
  const [initialContentPending, setInitialContentPending] = useState<any>(null)
  const contentInitializedRef = useRef(false)

  // Modals state
  const [showPublish, setShowPublish] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showMath, setShowMath] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [showMermaid, setShowMermaid] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showFileAttach, setShowFileAttach] = useState(false)
  const [showFeaturedImageUpload, setShowFeaturedImageUpload] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [showTableModal, setShowTableModal] = useState(false)

  // Slash menu state
  const [slashPos, setSlashPos] = useState<{ top: number; left: number } | null>(null)
  const [slashQuery, setSlashQuery] = useState('')
  const [slashRange, setSlashRange] = useState<any>(null)

  const editorContainerRef = useRef<HTMLDivElement>(null)
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null)
  const excerptTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize title textarea
  const resizeTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  // ── TipTap editor configuration ─────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading…'
          return 'Start writing your engineering article, or type / to choose a block…'
        },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ width: 640, height: 360 }),
      CodeBlockLowlight.configure({ lowlight }),
      CalcBlock,
      MermaidBlock,
      FileAttachment,
    ],
    onUpdate: ({ editor: ed }) => {
      setSaved(false)
      if (editorContainerRef.current) renderMathInElement(editorContainerRef.current)

      // Slash command detection
      const { selection } = ed.state
      const { $anchor } = selection
      const text = $anchor.nodeBefore?.text ?? ''
      const slashIdx = text.lastIndexOf('/')
      if (slashIdx !== -1) {
        const query = text.slice(slashIdx + 1)
        const coords = ed.view.coordsAtPos($anchor.pos)
        setSlashPos({ top: coords.bottom + 4, left: coords.left })
        setSlashQuery(query)
        setSlashRange({ from: $anchor.pos - (text.length - slashIdx), to: $anchor.pos })
      } else {
        setSlashPos(null)
      }
    },
  })

  // Attach modal openers to editor so extensions or slash menus can call them
  useEffect(() => {
    if (!editor) return
    ;(editor as any).__openMathModal = () => setShowMath(true)
    ;(editor as any).__openCalcModal = () => setShowCalc(true)
    ;(editor as any).__openMermaidModal = () => setShowMermaid(true)
    ;(editor as any).__openImageModal = () => setShowImageUpload(true)
    ;(editor as any).__openFileModal = () => setShowFileAttach(true)
    ;(editor as any).__openLinkModal = () => setShowLinkModal(true)
    ;(editor as any).__openYoutubeModal = () => setShowYoutubeModal(true)
    ;(editor as any).__openTableModal = () => setShowTableModal(true)
  }, [editor])

  // Load KaTeX auto-render on mount
  useEffect(() => {
    const w = window as any
    if (!w.katex) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css'
      document.head.appendChild(link)
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js'
      document.head.appendChild(s)
    }
    if (!w.renderMathInElement) {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js'
      document.head.appendChild(s)
    }
  }, [])

  // ── LOAD ARTICLE DATA FROM DATABASE / LOCAL CACHE ──────────────────────────
  useEffect(() => {
    if (isNew || !id) {
      setLoading(false)
      return
    }

    setLoading(true)
    contentInitializedRef.current = false

    fetchArticleById(id).then(data => {
      if (data) {
        setTitle(data.title || '')
        setExcerpt(data.excerpt || '')
        setMeta({
          status: (data.status as any) || 'draft',
          author: data.author || 'Md Sahin Alom',
          category: data.category || 'Electrical Engineering',
          tags: data.tags || [],
          featuredImage: data.featured_image || '',
          publishDate: data.created_at || '',
          visibility: 'public',
          metaTitle: data.meta_title || '',
          metaDesc: data.meta_desc || '',
          slug: data.slug || '',
          canonicalUrl: '',
        })
        setArticleId(data.id)
        setInitialContentPending(data.content || null)
      }
      setLoading(false)
    })
  }, [id, isNew])

  // Populate TipTap editor content once editor is ready and content is available
  useEffect(() => {
    if (!editor || !initialContentPending || contentInitializedRef.current) return

    const raw = initialContentPending
    if (typeof raw === 'object') {
      try {
        editor.commands.setContent(raw)
        contentInitializedRef.current = true
      } catch (err) {
        console.warn('TipTap JSON setContent error:', err)
      }
    } else if (typeof raw === 'string') {
      const trimmed = raw.trim()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed)
          editor.commands.setContent(parsed)
          contentInitializedRef.current = true
        } catch {
          editor.commands.setContent(raw)
          contentInitializedRef.current = true
        }
      } else {
        editor.commands.setContent(raw)
        contentInitializedRef.current = true
      }
    }

    setSaved(true)
  }, [editor, initialContentPending])

  // Adjust textareas height when title or excerpt changes
  useEffect(() => {
    resizeTextarea(titleTextareaRef.current)
  }, [title])

  useEffect(() => {
    resizeTextarea(excerptTextareaRef.current)
  }, [excerpt])

  // ── SAVE / SYNC WITH DATABASE ───────────────────────────────────────────────
  const saveArticle = useCallback(
    async (targetStatus?: 'draft' | 'published' | 'scheduled') => {
      if (!editor) return
      setIsSaving(true)
      const content = editor.getJSON()
      const text = editor.getText()
      const wordCount = text.split(/\s+/).filter(Boolean).length
      const readTime = Math.max(1, Math.ceil(wordCount / 200))
      const currentStatus = targetStatus || meta.status || 'draft'

      try {
        const res = await persistArticle({
          id: articleId || undefined,
          title: title.trim() || 'Untitled Article',
          excerpt: excerpt.trim(),
          content,
          status: currentStatus,
          category: meta.category,
          tags: meta.tags,
          featured_image: meta.featuredImage,
          author: meta.author,
          meta_title: meta.metaTitle || title,
          meta_desc: meta.metaDesc || excerpt,
          slug: meta.slug || slugify(title) || `article-${Date.now()}`,
          read_time: readTime,
        })

        if (!articleId && res?.article?.id) {
          setArticleId(res.article.id)
          navigate(`/admin/articles/${res.article.id}`, { replace: true })
        }

        setSaved(true)
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setLastSaved(nowStr)

        if (res.synced) {
          setSyncToast({
            type: 'success',
            message: `Article saved and synced with Supabase database at ${nowStr}`,
          })
        } else {
          setSyncToast({
            type: 'error',
            message: `Saved locally. Database sync: ${res.error || 'Network error'}`,
          })
        }
      } catch (err: any) {
        setSyncToast({
          type: 'error',
          message: `Database sync error: ${err?.message || 'Failed to sync with database'}`,
        })
      } finally {
        setIsSaving(false)
        setTimeout(() => setSyncToast(null), 4500)
      }
    },
    [editor, title, excerpt, meta, articleId, navigate]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !editor?.isFocused) {
        setShowShortcuts(true)
        return
      }
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === 's') {
        e.preventDefault()
        void saveArticle()
      }
      if (ctrl && e.key === 'k') {
        e.preventDefault()
        setShowLinkModal(true)
      }
      if (ctrl && e.key === '\\') {
        e.preventDefault()
        setPanelOpen(o => !o)
      }
      if (ctrl && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault()
        setShowPublish(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [saveArticle, editor])

  // Update slug from title if not manually set
  useEffect(() => {
    if (!meta.slug && title) setMeta(m => ({ ...m, slug: slugify(title) }))
  }, [title])

  // Slash command select
  const onSlashSelect = (item: any) => {
    setSlashPos(null)
    if (!editor || !slashRange) return
    editor.chain().focus().deleteRange(slashRange).run()
    item.command(editor)
  }

  // Math insert
  const onMathInsert = (latex: string, isDisplay: boolean) => {
    setShowMath(false)
    if (!editor) return
    const node = isDisplay ? `<p>$$${latex}$$</p>` : `<span>$${latex}$</span>`
    editor.chain().focus().insertContent(node).run()
    if (editorContainerRef.current) setTimeout(() => renderMathInElement(editorContainerRef.current!), 100)
  }

  // Calc insert
  const onCalcInsert = (attrs: CalcBlockAttrs) => {
    setShowCalc(false)
    editor?.chain().focus().insertContent({ type: 'calcBlock', attrs }).run()
  }

  // Mermaid insert
  const onMermaidInsert = ({ code, caption, figNum }: { code: string; caption: string; figNum: string }) => {
    setShowMermaid(false)
    editor?.chain().focus().insertContent({ type: 'mermaidBlock', attrs: { code, caption, figNum } }).run()
  }

  // Inline image insert
  const onImageInsert = (url: string) => {
    setShowImageUpload(false)
    editor?.chain().focus().setImage({ src: url }).run()
  }

  // File attachment insert
  const onFileAttach = (attachment: { name: string; url: string; size: number; type: string }) => {
    setShowFileAttach(false)
    editor?.chain().focus().insertContent({
      type: 'fileAttachment',
      attrs: { name: attachment.name, url: attachment.url, size: attachment.size, fileType: attachment.type },
    }).run()
  }

  // Link insert
  const onLinkConfirm = (url: string, linkText?: string) => {
    setShowLinkModal(false)
    if (!editor) return
    if (linkText && editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${url}">${linkText}</a>`).run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  // YouTube insert
  const onYoutubeConfirm = (url: string) => {
    setShowYoutubeModal(false)
    if (!editor) return
    editor.chain().focus().setYoutubeVideo({ src: url }).run()
  }

  // Table insert
  const onTableConfirm = (rows: number, cols: number, withHeaderRow: boolean) => {
    setShowTableModal(false)
    if (!editor) return
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
  }

  // Publish
  const handlePublish = async () => {
    setShowPublish(false)
    setMeta(m => ({ ...m, status: 'published' }))
    await saveArticle('published')
  }

  const readTime = editor ? Math.max(1, Math.ceil(editor.getText().split(/\s+/).length / 200)) : 0
  const isEmpty = !title && (!editor || editor.isEmpty)

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#F8FAFC',
          fontFamily: 'Outfit,sans-serif',
          color: '#64748B',
          fontSize: 14,
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: '3px solid #E2E8F0',
            borderTopColor: '#C47D0E',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span>Loading article for editing…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#F7F5F0',
        fontFamily: 'Outfit,sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* ══ TOP STATUS & ACTION BAR ══════════════════════════════════════════ */}
      <EditorTopBar
        status={meta.status}
        saved={saved}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onBack={() => navigate('/admin')}
        onSaveDraft={() => void saveArticle('draft')}
        onUndo={() => editor?.chain().focus().undo().run()}
        onRedo={() => editor?.chain().focus().redo().run()}
        onPreview={() => window.open(`/blog/${meta.slug || slugify(title)}`, '_blank')}
        onPublish={() => setShowPublish(true)}
        onHistory={() => setShowHistory(true)}
        onShortcuts={() => setShowShortcuts(true)}
        previewMode={previewMode}
        onPreviewMode={setPreviewMode}
        canUndo={editor?.can().undo() ?? false}
        canRedo={editor?.can().redo() ?? false}
        onToggleSettings={() => setPanelOpen(o => !o)}
        settingsOpen={panelOpen}
      />

      {/* ══ STICKY RICH FORMATTING TOOLBAR RIBBON ═════════════════════════════ */}
      <EditorToolbar
        editor={editor}
        onOpenImageModal={() => setShowImageUpload(true)}
        onOpenFileModal={() => setShowFileAttach(true)}
        onOpenMathModal={() => setShowMath(true)}
        onOpenCalcModal={() => setShowCalc(true)}
        onOpenMermaidModal={() => setShowMermaid(true)}
        onOpenTableModal={() => setShowTableModal(true)}
        onOpenYoutubeModal={() => setShowYoutubeModal(true)}
        onOpenLinkModal={() => setShowLinkModal(true)}
      />

      {/* ══ EDITOR MAIN CANVAS & SETTINGS DRAWER ═════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Editor Canvas */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            padding: '0 clamp(12px, 3vw, 24px) 80px',
            background: '#F7F5F0',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: previewMode === 'mobile' ? 375 : previewMode === 'tablet' ? 768 : 800,
              paddingTop: 32,
              transition: 'max-width 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Featured Image Canvas Banner */}
            {meta.featuredImage ? (
              <div
                style={{
                  position: 'relative',
                  marginBottom: 24,
                  borderRadius: 12,
                  overflow: 'hidden',
                  maxHeight: 320,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  border: '1px solid #E2E8F0',
                }}
              >
                <img
                  src={meta.featuredImage}
                  alt="Featured cover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    gap: 6,
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(6px)',
                    padding: '4px 8px',
                    borderRadius: 6,
                  }}
                >
                  <button
                    onClick={() => setShowFeaturedImageUpload(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Edit3 size={12} /> Change Cover
                  </button>
                  <button
                    onClick={() => {
                      setMeta(m => ({ ...m, featuredImage: '' }))
                      setSaved(false)
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Remove Cover"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowFeaturedImageUpload(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  marginBottom: 24,
                  background: '#FFFFFF',
                  border: '1px dashed #CBD5E1',
                  borderRadius: 8,
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#64748B',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                  ;(e.currentTarget as HTMLElement).style.color = '#C47D0E'
                  ;(e.currentTarget as HTMLElement).style.background = '#FFFBEB'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1'
                  ;(e.currentTarget as HTMLElement).style.color = '#64748B'
                  ;(e.currentTarget as HTMLElement).style.background = '#FFFFFF'
                }}
              >
                <ImageIcon size={16} /> + Add Featured Cover Image
              </button>
            )}

            {/* Article Header (Controlled Title & Excerpt) */}
            <div style={{ marginBottom: 28 }}>
              {/* Category selector badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 10,
                    letterSpacing: '0.15em',
                    color: '#C47D0E',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: 'rgba(196,125,14,0.1)',
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  {meta.category || 'ELECTRICAL ENGINEERING'}
                </span>
                {readTime > 0 && (
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono,monospace',
                      fontSize: 10,
                      color: '#94A3B8',
                      letterSpacing: '0.1em',
                    }}
                  >
                    • {readTime} MIN READ
                  </span>
                )}
              </div>

              {/* Title Textarea */}
              <textarea
                ref={titleTextareaRef}
                value={title}
                onChange={e => {
                  setTitle(e.target.value)
                  setSaved(false)
                }}
                placeholder="Enter article title…"
                rows={1}
                style={{
                  width: '100%',
                  fontFamily: isBengali(title)
                    ? "'Hind Siliguri', sans-serif"
                    : "'Barlow Condensed', 'Hind Siliguri', sans-serif",
                  fontWeight: isBengali(title) ? 700 : 800,
                  fontSize: 'clamp(28px, 4.2vw, 48px)',
                  lineHeight: isBengali(title) ? 1.35 : 0.98,
                  letterSpacing: isBengali(title) ? '0' : '-0.01em',
                  textTransform: isBengali(title) ? 'none' : 'uppercase',
                  color: '#0F172A',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  overflow: 'hidden',
                  padding: 0,
                  marginBottom: 12,
                  boxSizing: 'border-box',
                }}
              />

              {/* Excerpt Textarea */}
              <textarea
                ref={excerptTextareaRef}
                value={excerpt}
                onChange={e => {
                  setExcerpt(e.target.value)
                  setSaved(false)
                }}
                placeholder="Add a brief executive summary or excerpt (used for SEO & card previews)…"
                rows={2}
                style={{
                  width: '100%',
                  fontFamily: isBengali(excerpt)
                    ? "'Hind Siliguri', 'Outfit', sans-serif"
                    : "'Outfit', 'Hind Siliguri', sans-serif",
                  fontSize: 17,
                  color: '#475569',
                  lineHeight: isBengali(excerpt) ? 1.75 : 1.55,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  overflow: 'hidden',
                  padding: 0,
                  marginBottom: 16,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Suggestions on Empty State */}
            {isEmpty && (
              <div style={{ padding: '16px 0', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s.text}
                      onClick={() => editor?.commands.focus()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        border: '1px solid #E2E8F0',
                        borderRadius: 6,
                        background: '#FFFFFF',
                        fontFamily: 'Outfit,sans-serif',
                        fontSize: 12,
                        color: '#64748B',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                        ;(e.currentTarget as HTMLElement).style.color = '#C47D0E'
                      }}
                      onMouseLeave={e => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                        ;(e.currentTarget as HTMLElement).style.color = '#64748B'
                      }}
                    >
                      <span>{s.emoji}</span> {s.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Divider */}
            <div style={{ height: 1, background: '#E2E8F0', marginBottom: 28 }} />

            {/* ══ TIPTAP RICH CANVAS ═══════════════════════════════════════════ */}
            <div ref={editorContainerRef} style={{ minHeight: 400 }}>
              <EditorContent editor={editor} />
            </div>
          </div>
        </main>

        {/* Settings Drawer Panel */}
        <SettingsPanel
          meta={meta}
          onChange={patch => {
            setMeta(m => ({ ...m, ...patch }))
            setSaved(false)
          }}
          visible={panelOpen && !previewMode}
          onClose={() => setPanelOpen(false)}
          onOpenImageUpload={() => setShowFeaturedImageUpload(true)}
        />
      </div>

      {/* Floating inline text toolbar */}
      <FloatingToolbar editor={editor} />

      {/* Dedicated floating table tools (add/del row, col, delete table) */}
      <TableToolbar editor={editor} />

      {/* Slash command popup menu */}
      {slashPos && (
        <SlashMenu
          editor={editor}
          position={slashPos}
          query={slashQuery}
          onClose={() => setSlashPos(null)}
          onSelect={onSlashSelect}
        />
      )}

      {/* Database Sync Toast Feedback Banner */}
      {syncToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 8,
            background: syncToast.type === 'success' ? '#0F172A' : '#7F1D1D',
            color: '#FFFFFF',
            fontSize: 13,
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            border: syncToast.type === 'success' ? '1px solid #334155' : '1px solid #991B1B',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>{syncToast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{syncToast.message}</span>
        </div>
      )}

      {/* ══ MODALS ════════════════════════════════════════════════════════════ */}
      {showPublish && (
        <PublishDialog
          onClose={() => setShowPublish(false)}
          onPublish={handlePublish}
          onSaveDraft={() => {
            setShowPublish(false)
            void saveArticle('draft')
          }}
          article={{
            title,
            slug: meta.slug,
            featuredImage: meta.featuredImage,
            category: meta.category,
            metaTitle: meta.metaTitle,
            metaDesc: meta.metaDesc,
            author: meta.author,
            status: meta.status,
          }}
        />
      )}

      {showHistory && (
        <VersionHistory
          articleTitle={title || 'Untitled Article'}
          versions={[]}
          onClose={() => setShowHistory(false)}
          onRestore={() => setShowHistory(false)}
        />
      )}

      {showShortcuts && <ShortcutsDialog onClose={() => setShowShortcuts(false)} />}
      {showMath && <MathModal onInsert={onMathInsert} onClose={() => setShowMath(false)} />}
      {showCalc && <CalcModal onInsert={onCalcInsert} onClose={() => setShowCalc(false)} />}
      {showMermaid && <MermaidModal onInsert={onMermaidInsert} onClose={() => setShowMermaid(false)} />}
      {showImageUpload && (
        <MediaUploadModal label="Image" onConfirm={onImageInsert} onClose={() => setShowImageUpload(false)} />
      )}
      {showFeaturedImageUpload && (
        <MediaUploadModal
          label="Featured Image"
          onConfirm={url => {
            setShowFeaturedImageUpload(false)
            setMeta(m => ({ ...m, featuredImage: url }))
            setSaved(false)
          }}
          onClose={() => setShowFeaturedImageUpload(false)}
        />
      )}
      {showFileAttach && <FileAttachmentModal onConfirm={onFileAttach} onClose={() => setShowFileAttach(false)} />}
      {showLinkModal && (
        <LinkModal
          initialUrl={editor?.getAttributes('link')?.href || ''}
          onConfirm={onLinkConfirm}
          onRemove={() => editor?.chain().focus().unsetLink().run()}
          onClose={() => setShowLinkModal(false)}
        />
      )}
      {showYoutubeModal && (
        <YoutubeModal onConfirm={onYoutubeConfirm} onClose={() => setShowYoutubeModal(false)} />
      )}
      {showTableModal && (
        <TableInsertModal onConfirm={onTableConfirm} onClose={() => setShowTableModal(false)} />
      )}

      {/* ══ STYLES ════════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        /* Placeholder */
        .tiptap p.is-editor-empty:first-child::before,
        .tiptap .is-empty::before {
          content: attr(data-placeholder);
          float: left; color: #9AA3B0; pointer-events: none; height: 0;
          font-style: italic;
        }

        /* Prose styles */
        .tiptap {
          outline: none;
          min-height: 280px;
          font-family: 'Hind Siliguri', 'Outfit', sans-serif;
        }
        .tiptap p {
          margin: 0 0 1.2em;
          font-size: 17.5px;
          line-height: 1.8;
          color: #0F172A;
        }
        .tiptap h1 {
          font-family: 'Hind Siliguri', 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 34px;
          line-height: 1.35;
          letter-spacing: -0.01em;
          color: #0F172A;
          margin: 1.6em 0 0.5em;
        }
        .tiptap h2 {
          font-family: 'Hind Siliguri', 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 26px;
          line-height: 1.35;
          color: #0F172A;
          margin: 1.4em 0 0.5em;
        }
        .tiptap h3 {
          font-family: 'Hind Siliguri', 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 20px;
          line-height: 1.4;
          color: #0F172A;
          margin: 1.2em 0 0.4em;
        }
        .tiptap h4 {
          font-family: 'Hind Siliguri', 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 16px;
          line-height: 1.4;
          color: #0F172A;
          margin: 1em 0 0.3em;
        }
        .tiptap ul, .tiptap ol {
          margin: 0 0 1.2em;
          padding-left: 1.6em;
        }
        .tiptap li {
          margin-bottom: 0.35em;
          font-size: 17px;
          line-height: 1.8;
          color: #0F172A;
        }
        .tiptap blockquote {
          border-left: 4px solid #C47D0E;
          margin: 1.6em 0;
          padding: 14px 22px;
          background: #FEF9EC;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #374151;
        }
        .tiptap hr {
          border: none;
          border-top: 1px solid #DDD9D0;
          margin: 2.2em 0;
        }
        .tiptap a {
          color: #C47D0E;
          text-decoration: underline;
        }
        .tiptap code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13.5px;
          background: #F1F5F9;
          border-radius: 4px;
          padding: 2px 5px;
          color: #0F172A;
        }
        .tiptap pre {
          background: #0F172A;
          border-radius: 8px;
          padding: 16px 20px;
          margin: 1.5em 0;
          overflow-x: auto;
        }
        .tiptap pre code {
          background: none;
          padding: 0;
          color: #E2E8F0;
          font-size: 13px;
          line-height: 1.65;
        }
        .tiptap mark {
          background: #FEF3C7;
          color: #92400E;
          border-radius: 2px;
          padding: 0 3px;
        }
        .tiptap img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1.2em 0;
        }

        /* Tables */
        .tiptap table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }
        .tiptap th {
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          padding: 10px 14px;
          text-align: left;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
        }
        .tiptap td {
          border: 1px solid #CBD5E1;
          padding: 10px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #334155;
          min-width: 80px;
          position: relative;
        }
        .tiptap tr:hover td {
          background: #F8FAFC;
        }
        .tiptap .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(196, 125, 14, 0.15);
          pointer-events: none;
        }
        .tiptap .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #C47D0E;
          pointer-events: none;
        }

        /* Task list */
        .tiptap ul[data-type="taskList"] { padding: 0; list-style: none; }
        .tiptap ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; }
        .tiptap ul[data-type="taskList"] li input[type="checkbox"] { margin-top: 3px; accent-color: #C47D0E; }

        /* YouTube embed */
        .tiptap .youtube-wrapper { margin: 1.5em 0; border-radius: 8px; overflow: hidden; }
        .tiptap iframe { max-width: 100%; border-radius: 8px; }

        /* Calc block styles */
        .calc-block-wrapper {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
          margin: 1.5em 0;
          font-family: 'Outfit', sans-serif;
        }
        .calc-block-header {
          border-left: 4px solid #C47D0E;
          background: #FAFAFA;
          padding: 12px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .calc-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          color: #C47D0E;
        }
        .calc-title {
          font-size: 15px;
          font-weight: 600;
          color: #0F172A;
        }
        .calc-section {
          padding: 14px 20px;
          border-top: 1px solid #F1F5F9;
        }
        .calc-formula-section {
          background: #FEF9EC;
        }
        .calc-section-label {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          color: #C47D0E;
          background: #FEF3C7;
          padding: 2px 6px;
          border-radius: 3px;
          margin-bottom: 8px;
        }
        .calc-given-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          padding: 3px 0;
          color: #374151;
        }
        .calc-given-label {
          color: #64748B;
        }
        .calc-given-value {
          font-family: 'JetBrains Mono', monospace;
          color: #0F172A;
        }
        .calc-formula {
          font-size: 20px;
          text-align: center;
          color: #0F172A;
          padding: 8px 0;
        }
        .calc-step {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #374151;
          padding: 2px 0;
        }
        .calc-result-section {
          background: #FEF3C7;
          padding: 16px 20px;
          border-top: 1px solid #F5E6C8;
        }
        .calc-result-label {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          color: #92400E;
          background: rgba(196,125,14,0.15);
          padding: 2px 6px;
          border-radius: 3px;
          margin-bottom: 8px;
        }
        .calc-result-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 32px;
          color: #C47D0E;
          text-transform: uppercase;
          line-height: 1;
        }
        .calc-result-unit {
          font-size: 20px;
        }
        .calc-result-note {
          font-size: 12px;
          color: #64748B;
          margin-top: 6px;
        }
        .calc-edit-btn {
          display: block;
          width: 100%;
          padding: 8px;
          background: none;
          border: none;
          border-top: 1px solid #F1F5F9;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          color: #94A3B8;
          text-align: center;
          transition: all 0.15s;
        }
        .calc-edit-btn:hover {
          color: #C47D0E;
          background: #FAFAFA;
        }

        /* Syntax highlight theme */
        .hljs-keyword, .hljs-selector-tag, .hljs-built_in { color: #C47D0E; }
        .hljs-string, .hljs-attr { color: #86EFAC; }
        .hljs-number, .hljs-literal { color: #60A5FA; }
        .hljs-comment { color: #64748B; font-style: italic; }
        .hljs-function, .hljs-title { color: #A78BFA; }
        .hljs-variable { color: #E2E8F0; }

        .tiptap .ProseMirror-selectednode {
          outline: 2px solid rgba(196,125,14,0.3);
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .tiptap p { font-size: 16px; }
          .tiptap h1 { font-size: 28px; }
          .tiptap h2 { font-size: 22px; }
        }
      `}</style>
    </div>
  )
}
