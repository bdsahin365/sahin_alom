import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TiptapLink from '@tiptap/extension-link'
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
import {
  Clock,
  ArrowLeft,
  Check,
  Copy,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Mail,
  ListOrdered,
  X,
} from 'lucide-react'
import { fetchArticleBySlug, fetchPublishedArticles, Article } from '../lib/articlesService'
import { CalcBlock } from './blog/extensions/CalcBlock'
import { getBlogTitleStyles, getBlogBodyStyles, isBengali } from '../lib/langUtils'
import { MermaidBlock } from './blog/extensions/MermaidBlock'
import { FileAttachment } from './blog/extensions/FileAttachment'
import EngineerNav from '../components/EngineerNav'
import SEOHead from '../components/SEOHead'
import sahinAvatar from '../img/sahin.png'

// Clean Social SVG Icons
const LinkedInIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z" />
  </svg>
)

const TwitterXIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12Z" />
  </svg>
)

const lowlight = createLowlight()
lowlight.register('python', python)
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('bash', bash)

const EXTENSIONS = [
  StarterKit.configure({ codeBlock: false }),
  Underline,
  TiptapLink,
  Image,
  Highlight,
  TaskList,
  TaskItem,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Youtube,
  CodeBlockLowlight.configure({ lowlight }),
  CalcBlock,
  MermaidBlock,
  FileAttachment,
]

type TocItem = { id: string; text: string; level: number }

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [article, setArticle] = useState<Article | null>(null)
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [html, setHtml] = useState('')
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeHeadingId, setActiveHeadingId] = useState<string>('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'larger'>('normal')
  const [copiedToast, setCopiedToast] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  // Fetch current article & all published articles
  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)

    Promise.all([fetchArticleBySlug(slug), fetchPublishedArticles()])
      .then(([currentData, listData]) => {
        if (!currentData) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setArticle(currentData)
        setAllArticles(listData)

        // Generate HTML
        if (currentData.content) {
          if (typeof currentData.content === 'object') {
            try {
              const generatedHtml = generateHTML(currentData.content, EXTENSIONS)
              setHtml(generatedHtml)
            } catch {
              setHtml('<p>Content could not be rendered.</p>')
            }
          } else if (typeof currentData.content === 'string') {
            const trimmed = currentData.content.trim()
            if (trimmed.startsWith('{') || trimmed.startsWith('{"')) {
              try {
                const parsed = JSON.parse(trimmed)
                setHtml(generateHTML(parsed, EXTENSIONS))
              } catch {
                setHtml(currentData.content)
              }
            } else {
              setHtml(currentData.content)
            }
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [slug])

  // Track Reading Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      const currentProgress = (window.scrollY / totalHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Build ToC & Add Copy Buttons to Code Blocks
  useEffect(() => {
    if (!contentRef.current || !html) return

    // 1. Extract Headings and assign IDs
    const headings = Array.from(contentRef.current.querySelectorAll('h1,h2,h3,h4')) as HTMLElement[]
    const items: TocItem[] = headings.map((h, i) => {
      const rawText = h.innerText.trim()
      const safeId = `heading-${i}-${rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`
      h.id = safeId
      return { id: safeId, text: rawText, level: parseInt(h.tagName[1]) }
    })
    setToc(items)

    // 2. Add 1-Click "Copy Code" button and Language Badges to pre blocks
    const preBlocks = Array.from(contentRef.current.querySelectorAll('pre'))
    preBlocks.forEach(pre => {
      if (pre.querySelector('.copy-code-btn')) return

      pre.style.position = 'relative'
      const code = pre.querySelector('code')
      const langClass = Array.from(code?.classList || []).find(c => c.startsWith('language-'))
      const langName = langClass ? langClass.replace('language-', '').toUpperCase() : 'CODE'

      // Top bar inside pre
      const topBar = document.createElement('div')
      topBar.className = 'code-top-bar'
      topBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 14px;
        background: rgba(255,255,255,0.06);
        border-bottom: 1px solid rgba(255,255,255,0.08);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        margin: -16px -20px 12px -20px;
      `

      const langSpan = document.createElement('span')
      langSpan.style.cssText = `
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.12em;
        color: #C47D0E;
        font-weight: 600;
      `
      langSpan.innerText = langName

      const copyBtn = document.createElement('button')
      copyBtn.className = 'copy-code-btn'
      copyBtn.innerHTML = `<span>Copy</span>`
      copyBtn.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.15);
        color: #E2E8F0;
        border-radius: 4px;
        padding: 2px 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        cursor: pointer;
        transition: all 0.15s ease;
      `

      copyBtn.onclick = async e => {
        e.stopPropagation()
        const textToCopy = code?.innerText || pre.innerText || ''
        try {
          await navigator.clipboard.writeText(textToCopy)
          copyBtn.innerHTML = `<span>Copied!</span>`
          copyBtn.style.background = '#16A34A'
          copyBtn.style.borderColor = '#16A34A'
          setTimeout(() => {
            copyBtn.innerHTML = `<span>Copy</span>`
            copyBtn.style.background = 'rgba(255,255,255,0.1)'
            copyBtn.style.borderColor = 'rgba(255,255,255,0.15)'
          }, 2000)
        } catch {}
      }

      topBar.appendChild(langSpan)
      topBar.appendChild(copyBtn)
      pre.insertBefore(topBar, pre.firstChild)
    })

    // 3. Wrap Tables for responsive horizontal scrolling
    const tables = Array.from(contentRef.current.querySelectorAll('table'))
    tables.forEach(table => {
      if (table.parentElement?.classList.contains('table-responsive-wrapper')) return
      const wrapper = document.createElement('div')
      wrapper.className = 'table-responsive-wrapper'
      table.parentNode?.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    })
  }, [html])

  // ScrollSpy: Track active heading
  useEffect(() => {
    if (toc.length === 0) return

    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 140
      let currentActive = ''
      for (const item of toc) {
        const el = document.getElementById(item.id)
        if (el && el.offsetTop <= scrollPos) {
          currentActive = item.id
        }
      }
      if (currentActive) {
        setActiveHeadingId(currentActive)
      }
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true })
    handleScrollSpy()
    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [toc])

  // KaTeX math render
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

    const tryRender = () => {
      const w2 = window as any
      if (w2.renderMathInElement && contentRef.current) {
        w2.renderMathInElement(contentRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
          ],
        })
      } else {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js'
        s.onload = () => {
          const w3 = window as any
          if (w3.renderMathInElement && contentRef.current) {
            w3.renderMathInElement(contentRef.current, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
              ],
            })
          }
        }
        document.head.appendChild(s)
      }
    }
    setTimeout(tryRender, 300)
  }, [html])

  // Mermaid diagrams render
  useEffect(() => {
    if (!contentRef.current) return
    const mermaidNodes = contentRef.current.querySelectorAll('.language-mermaid, pre code.language-mermaid, div.mermaid')
    if (mermaidNodes.length === 0) return

    const renderMermaid = () => {
      const w = window as any
      if (w.mermaid) {
        w.mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' })
        mermaidNodes.forEach(async (node, idx) => {
          const code = node.textContent || ''
          const container = document.createElement('div')
          container.style.cssText =
            'background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin:24px 0;display:flex;justify-content:center;overflow-x:auto;box-shadow:0 2px 10px rgba(0,0,0,0.03);'
          const id = `mermaid-render-${Date.now()}-${idx}`
          try {
            const { svg } = await w.mermaid.render(id, code)
            container.innerHTML = svg
            node.closest('pre')?.replaceWith(container) || node.replaceWith(container)
          } catch (err) {
            console.warn('Mermaid render error:', err)
          }
        })
      }
    }

    const w = window as any
    if (!w.mermaid) {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'
      s.onload = renderMermaid
      document.head.appendChild(s)
    } else {
      setTimeout(renderMermaid, 300)
    }
  }, [html])

  // Calculate word count
  const wordCount = useMemo(() => {
    if (!html) return 0
    const plainText = html.replace(/<[^>]+>/g, ' ')
    const words = plainText.trim().split(/\s+/).filter(Boolean)
    return words.length
  }, [html])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return ''
    }
  }

  // Next / Previous and Related Articles
  const { prevArticle, nextArticle, relatedArticles } = useMemo(() => {
    if (!article || allArticles.length === 0) {
      return { prevArticle: null, nextArticle: null, relatedArticles: [] }
    }
    const currentIndex = allArticles.findIndex(a => a.id === article.id || a.slug === article.slug)
    const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null
    const next = currentIndex >= 0 && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null

    const related = allArticles
      .filter(a => a.id !== article.id && (a.category === article.category || !article.category))
      .slice(0, 2)

    return { prevArticle: prev, nextArticle: next, relatedArticles: related }
  }, [article, allArticles])

  // Share handlers
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedToast(true)
      setTimeout(() => setCopiedToast(false), 2500)
    } catch {}
  }

  const shareTitle = article?.title || 'Engineering Article by Md Sahin Alom'
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://sahinalom.com/blog/${slug}`

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  // JSON-LD Structured Data Schema (TechArticle / BlogPosting)
  const jsonLdArticleSchema = useMemo(() => {
    if (!article) return undefined
    const isBn = isBengali(article.title)
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: article.title,
      description: article.meta_desc || article.excerpt,
      image: article.featured_image
        ? [
            article.featured_image.startsWith('http')
              ? article.featured_image
              : `https://sahinalom.com${article.featured_image}`,
          ]
        : ['https://sahinalom.com/img/lighting-design-cover.jpg'],
      datePublished: article.created_at || article.updated_at,
      dateModified: article.updated_at,
      inLanguage: isBn ? 'bn' : 'en',
      author: {
        '@type': 'Person',
        name: article.author || 'Md Sahin Alom',
        jobTitle: 'Electrical Engineer',
        url: 'https://sahinalom.com',
      },
      publisher: {
        '@type': 'Person',
        name: 'Md Sahin Alom',
        url: 'https://sahinalom.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sahinalom.com/img/sahin.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': shareUrl,
      },
      keywords: article.tags?.join(', '),
      articleSection: article.category || 'Electrical Engineering',
      wordCount: wordCount,
    }
  }, [article, shareUrl, wordCount])

  if (loading) {
    return (
      <>
        <EngineerNav />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            paddingTop: 'var(--nav-h)',
            fontFamily: 'Outfit,sans-serif',
            color: '#64748B',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid #E2E8F0',
              borderTopColor: '#C47D0E',
              borderRadius: '50%',
              marginBottom: 16,
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div>Loading article…</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    )
  }

  if (notFound || !article) {
    return (
      <>
        <SEOHead title="Article Not Found" description="The requested engineering article was not found." />
        <EngineerNav />
        <div
          style={{
            textAlign: 'center',
            padding: '120px 24px 80px',
            paddingTop: 'calc(var(--nav-h) + 60px)',
            fontFamily: 'Outfit,sans-serif',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(196,125,14,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#C47D0E',
            }}
          >
            <BookOpen size={30} />
          </div>
          <h1
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 800,
              fontSize: 34,
              textTransform: 'uppercase',
              color: '#0F172A',
              marginBottom: 12,
            }}
          >
            Article Not Found
          </h1>
          <p style={{ color: '#64748B', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
            The article you are looking for might have been moved, renamed, or is currently unpublished.
          </p>
          <button
            onClick={() => navigate('/blog')}
            style={{
              background: '#C47D0E',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              padding: '12px 24px',
              cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ArrowLeft size={16} /> Back to Blog Directory
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead
        title={article.meta_title || article.title}
        description={article.meta_desc || article.excerpt}
        keywords={article.tags}
        ogImage={article.featured_image}
        ogType="article"
        publishedTime={article.created_at || article.updated_at}
        modifiedTime={article.updated_at}
        authorName={article.author || 'Md Sahin Alom'}
        category={article.category}
        schema={jsonLdArticleSchema}
      />

      {/* ══ FIXED READING PROGRESS BAR ════════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          zIndex: 999,
          background: 'transparent',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${readingProgress}%`,
            background: 'linear-gradient(90deg, #C47D0E 0%, #F59E0B 100%)',
            transition: 'width 0.1s ease-out',
            boxShadow: '0 0 8px rgba(196,125,14,0.6)',
          }}
        />
      </div>

      <EngineerNav />

      <div style={{ background: '#F7F5F0', minHeight: '100vh', paddingTop: 'var(--nav-h)' }}>
        {/* ══ TOP BREADCRUMB & READER CONTROLS RIBBON ═════════════════════════ */}
        <div
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            position: 'sticky',
            top: 'var(--nav-h)',
            zIndex: 40,
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              maxWidth: 1140,
              margin: '0 auto',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {/* Back & Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
              <button
                onClick={() => navigate('/blog')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: '#FAF8F5',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#475569',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                  ;(e.currentTarget as HTMLElement).style.color = '#C47D0E'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                  ;(e.currentTarget as HTMLElement).style.color = '#475569'
                }}
              >
                <ArrowLeft size={13} strokeWidth={2.5} /> Blog
              </button>

              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Link to="/blog" style={{ color: '#64748B', textDecoration: 'none' }}>
                  BLOG
                </Link>{' '}
                /{' '}
                <span style={{ color: '#C47D0E', fontWeight: 600 }}>
                  {article.category?.toUpperCase() || 'ARTICLE'}
                </span>
              </div>
            </div>

            {/* Reader Controls (Font scale & Share) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Font Size Adjuster */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#FAF8F5',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  padding: '2px',
                }}
              >
                <button
                  onClick={() => setFontSizeScale('normal')}
                  title="Normal Text Size"
                  style={{
                    border: 'none',
                    background: fontSizeScale === 'normal' ? '#FFFFFF' : 'transparent',
                    color: fontSizeScale === 'normal' ? '#C47D0E' : '#64748B',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono,monospace',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: fontSizeScale === 'normal' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSizeScale('large')}
                  title="Large Text Size"
                  style={{
                    border: 'none',
                    background: fontSizeScale === 'large' ? '#FFFFFF' : 'transparent',
                    color: fontSizeScale === 'large' ? '#C47D0E' : '#64748B',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono,monospace',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: fontSizeScale === 'large' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  A+
                </button>
              </div>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: copiedToast ? '#16A34A' : '#FAF8F5',
                  border: `1px solid ${copiedToast ? '#16A34A' : '#E2E8F0'}`,
                  color: copiedToast ? '#FFFFFF' : '#475569',
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {copiedToast ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedToast ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              {/* Mobile Table of Contents Trigger */}
              {toc.length >= 2 && (
                <button
                  className="mobile-only"
                  onClick={() => setMobileTocOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: '#FAF8F5',
                    border: '1px solid #E2E8F0',
                    color: '#C47D0E',
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <ListOrdered size={13} /> Chapters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ══ ARTICLE HEADER / HERO ════════════════════════════════════════════ */}
        <header
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)',
            borderBottom: '1px solid #E2E8F0',
            padding: '48px 0 40px',
          }}
        >
          <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px' }}>
            {/* Category Ribbon */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(196,125,14,0.08)',
                border: '1px solid rgba(196,125,14,0.25)',
                padding: '3px 10px',
                borderRadius: 4,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 9.5,
                  letterSpacing: '0.15em',
                  color: '#C47D0E',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {article.category || 'TECHNICAL PUBLICATION'}
              </span>
            </div>

            {/* Article Title */}
            <h1
              style={{
                ...getBlogTitleStyles(article.title),
                fontSize: 'clamp(28px, 4.5vw, 50px)',
                color: '#0F172A',
                margin: '0 0 16px',
                lineHeight: 1.25,
              }}
            >
              {article.title}
            </h1>

            {/* Excerpt / Lead */}
            {article.excerpt && (
              <p
                style={{
                  ...getBlogBodyStyles(article.excerpt),
                  fontSize: 'clamp(16px, 2.2vw, 19px)',
                  color: '#475569',
                  marginBottom: 24,
                  lineHeight: 1.7,
                }}
              >
                {article.excerpt}
              </p>
            )}

            {/* Author Profile Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                paddingTop: 18,
                borderTop: '1px solid #E2E8F0',
              }}
            >
              {/* Author Photo & Credentials */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={sahinAvatar}
                  alt={article.author || 'Md Sahin Alom'}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #E2E8F0',
                  }}
                />
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'Outfit,sans-serif',
                      fontWeight: 700,
                      fontSize: 14.5,
                      color: '#0F172A',
                    }}
                  >
                    <span>{article.author || 'Md Sahin Alom'}</span>
                    <span
                      style={{
                        background: '#DCFCE7',
                        color: '#166534',
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontFamily: 'JetBrains Mono,monospace',
                      }}
                    >
                      ABC LICENSED
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 12,
                      color: '#64748B',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>Electrical Engineer</span>
                    <span>•</span>
                    <span>{formatDate(article.updated_at || article.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Stats: Read Time & Word Count */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 11,
                  color: '#64748B',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} style={{ color: '#C47D0E' }} /> {article.read_time || 5} MIN READ
                </span>
                {wordCount > 0 && (
                  <>
                    <span>•</span>
                    <span>~{wordCount.toLocaleString()} WORDS</span>
                  </>
                )}
              </div>
            </div>

            {/* Tags Strip */}
            {article.tags && article.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 18 }}>
                {article.tags.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'JetBrains Mono,monospace',
                      fontSize: 9.5,
                      letterSpacing: '0.08em',
                      padding: '3px 9px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 4,
                      color: '#475569',
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ══ FEATURED HERO COVER IMAGE ═══════════════════════════════════════ */}
        {article.featured_image && (
          <div style={{ maxWidth: 840, margin: '0 auto', padding: '32px 24px 0' }}>
            <div
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                border: '1px solid #E2E8F0',
                background: '#0F172A',
              }}
            >
              <img
                src={article.featured_image}
                alt={article.title}
                style={{
                  width: '100%',
                  display: 'block',
                  maxHeight: 460,
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        )}

        {/* ══ MAIN 2-COLUMN ARTICLE LAYOUT ════════════════════════════════════ */}
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            padding: '40px 24px 80px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 780px) minmax(0, 300px)',
            gap: 48,
            alignItems: 'start',
            justifyContent: 'center',
          }}
          className="blog-content-layout"
        >
          {/* LEFT: MAIN ARTICLE PROSE BODY */}
          <main style={{ minWidth: 0 }}>
            <article
              ref={contentRef}
              className={`article-body font-scale-${fontSizeScale}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* ══ INLINE ARTICLE SHARE & ACTIONS STRIP ════════════════════════ */}
            <div
              style={{
                marginTop: 48,
                padding: '24px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  color: '#C47D0E',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                SHARE THIS ENGINEERING ARTICLE
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href={shareWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: '#25D366',
                    color: '#FFFFFF',
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>

                <a
                  href={shareLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: '#0A66C2',
                    color: '#FFFFFF',
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <LinkedInIcon size={14} /> LinkedIn
                </a>

                <a
                  href={shareTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: '#0F172A',
                    color: '#FFFFFF',
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <TwitterXIcon size={14} /> X (Twitter)
                </a>

                <a
                  href={shareFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: '#1877F2',
                    color: '#FFFFFF',
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <FacebookIcon size={14} /> Facebook
                </a>

                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: copiedToast ? '#16A34A' : '#FAF8F5',
                    border: '1px solid #E2E8F0',
                    color: copiedToast ? '#FFFFFF' : '#334155',
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copiedToast ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedToast ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* ══ AUTHOR DOSSIER & SIGNATURE CARD ══════════════════════════════ */}
            <div
              style={{
                marginTop: 32,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 14,
                padding: '28px',
                display: 'flex',
                gap: 20,
                alignItems: 'center',
                flexWrap: 'wrap',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <img
                src={sahinAvatar}
                alt="Md Sahin Alom"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #C47D0E',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 240 }}>
                <div
                  style={{
                    fontFamily: 'Outfit,sans-serif',
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#0F172A',
                    marginBottom: 4,
                  }}
                >
                  {article.author || 'Md Sahin Alom'}
                </div>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 10.5,
                    color: '#C47D0E',
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  Class ABC Licensed Electrical Engineer · Power Systems Specialist
                </div>
                <p
                  style={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 13.5,
                    color: '#64748B',
                    lineHeight: 1.6,
                    margin: '0 0 12px',
                  }}
                >
                  Practicing electrical engineer in Bangladesh specializing in substation engineering, industrial power
                  distribution, solar PV system integration, and building code compliance (BNBC 2020).
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a
                    href="/#contact"
                    style={{
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#C47D0E',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Request Technical Consultation <ChevronRight size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* ══ NEXT / PREVIOUS ARTICLE NAVIGATION ══════════════════════════ */}
            {(prevArticle || nextArticle) && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 16,
                  marginTop: 32,
                }}
              >
                {prevArticle && (
                  <div
                    onClick={() => navigate(`/blog/${prevArticle.slug}`)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                      ;(e.currentTarget as HTMLElement).style.transform = 'none'
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 9.5,
                        color: '#94A3B8',
                        letterSpacing: '0.12em',
                        marginBottom: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <ArrowLeft size={10} /> PREVIOUS ARTICLE
                    </div>
                    <div
                      style={{
                        ...getBlogTitleStyles(prevArticle.title),
                        fontSize: 15,
                        color: '#0F172A',
                        lineHeight: 1.3,
                      }}
                    >
                      {prevArticle.title}
                    </div>
                  </div>
                )}

                {nextArticle && (
                  <div
                    onClick={() => navigate(`/blog/${nextArticle.slug}`)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '18px',
                      cursor: 'pointer',
                      textAlign: 'right',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                      ;(e.currentTarget as HTMLElement).style.transform = 'none'
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono,monospace',
                        fontSize: 9.5,
                        color: '#94A3B8',
                        letterSpacing: '0.12em',
                        marginBottom: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 4,
                      }}
                    >
                      NEXT ARTICLE <ChevronRight size={10} />
                    </div>
                    <div
                      style={{
                        ...getBlogTitleStyles(nextArticle.title),
                        fontSize: 15,
                        color: '#0F172A',
                        lineHeight: 1.3,
                      }}
                    >
                      {nextArticle.title}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══ RELATED ARTICLES SECTION ════════════════════════════════════ */}
            {relatedArticles.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: '#C47D0E',
                    textTransform: 'uppercase',
                    marginBottom: 16,
                  }}
                >
                  RELATED ENGINEERING GUIDES
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                  }}
                >
                  {relatedArticles.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => navigate(`/blog/${rel.slug}`)}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={e => {
                        ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                        ;(e.currentTarget as HTMLElement).style.transform = 'none'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono,monospace',
                          fontSize: 8.5,
                          color: '#C47D0E',
                          letterSpacing: '0.1em',
                          fontWeight: 700,
                        }}
                      >
                        {rel.category?.toUpperCase() || 'GUIDE'}
                      </span>
                      <h4
                        style={{
                          ...getBlogTitleStyles(rel.title),
                          fontSize: 16,
                          color: '#0F172A',
                          margin: '6px 0 8px',
                          lineHeight: 1.3,
                        }}
                      >
                        {rel.title}
                      </h4>
                      <span
                        style={{
                          fontFamily: 'Outfit,sans-serif',
                          fontSize: 11,
                          color: '#94A3B8',
                        }}
                      >
                        {rel.read_time || 5} min read
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* RIGHT: DESKTOP STICKY SIDEBAR (ToC + Author Box + Quick Tools) */}
          <aside className="blog-desktop-sidebar">
            <div
              style={{
                position: 'sticky',
                top: 'calc(var(--nav-h) + 60px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {/* Interactive ScrollSpy Table of Contents */}
              {toc.length >= 2 && (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    maxHeight: 'calc(100vh - 220px)',
                    overflowY: 'auto',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono,monospace',
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      color: '#C47D0E',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <ListOrdered size={14} /> TABLE OF CONTENTS
                  </div>

                  <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {toc.map(item => {
                      const isActive = activeHeadingId === item.id
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={e => {
                            e.preventDefault()
                            const el = document.getElementById(item.id)
                            if (el) {
                              const y = el.getBoundingClientRect().top + window.scrollY - 100
                              window.scrollTo({ top: y, behavior: 'smooth' })
                            }
                          }}
                          style={{
                            display: 'block',
                            fontFamily: 'Outfit,sans-serif',
                            fontSize: item.level === 2 ? 13 : 12,
                            color: isActive ? '#C47D0E' : item.level === 2 ? '#334155' : '#64748B',
                            fontWeight: isActive ? 700 : item.level === 2 ? 500 : 400,
                            padding: `5px 8px 5px ${item.level === 2 ? 8 : 16}px`,
                            textDecoration: 'none',
                            borderRadius: 4,
                            background: isActive ? 'rgba(196,125,14,0.08)' : 'transparent',
                            borderLeft: isActive ? '2px solid #C47D0E' : '2px solid transparent',
                            transition: 'all 0.15s ease',
                            lineHeight: 1.4,
                          }}
                          onMouseEnter={e => {
                            if (!isActive) (e.currentTarget as HTMLElement).style.color = '#C47D0E'
                          }}
                          onMouseLeave={e => {
                            if (!isActive)
                              (e.currentTarget as HTMLElement).style.color =
                                item.level === 2 ? '#334155' : '#64748B'
                          }}
                        >
                          {item.text}
                        </a>
                      )
                    })}
                  </nav>
                </div>
              )}

              {/* Sidebar Author Mini-Card */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  padding: '18px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <img
                    src={sahinAvatar}
                    alt="Sahin"
                    style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
                      Md Sahin Alom
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: '#64748B' }}>
                      Electrical Engineer
                    </div>
                  </div>
                </div>
                <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: '0 0 12px' }}>
                  Need technical review or electrical consulting? Let's connect.
                </p>
                <a
                  href="/#contact"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '8px 12px',
                    background: '#FAF8F5',
                    border: '1px solid #E2E8F0',
                    borderRadius: 6,
                    color: '#C47D0E',
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'
                    ;(e.currentTarget as HTMLElement).style.background = '#C47D0E'
                    ;(e.currentTarget as HTMLElement).style.color = '#FFFFFF'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'
                    ;(e.currentTarget as HTMLElement).style.background = '#FAF8F5'
                    ;(e.currentTarget as HTMLElement).style.color = '#C47D0E'
                  }}
                >
                  Contact Engineer
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ══ MOBILE FLOATING TABLE OF CONTENTS DRAWER / MODAL ════════════════ */}
        {mobileTocOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              background: 'rgba(15,23,42,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
            onClick={() => setMobileTocOpen(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                padding: '24px 20px',
                maxHeight: '75vh',
                overflowY: 'auto',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <div
                  style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 11,
                    letterSpacing: '0.15em',
                    color: '#C47D0E',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  ARTICLE CHAPTERS & SECTIONS
                </div>
                <button
                  onClick={() => setMobileTocOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                    padding: 4,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {toc.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileTocOpen(false)
                      const el = document.getElementById(item.id)
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 100
                        window.scrollTo({ top: y, behavior: 'smooth' })
                      }
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: activeHeadingId === item.id ? 'rgba(196,125,14,0.1)' : '#FAF8F5',
                      border: 'none',
                      color: activeHeadingId === item.id ? '#C47D0E' : '#334155',
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 14,
                      fontWeight: activeHeadingId === item.id ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ RICH PROSE & CODE STYLING ═════════════════════════════════════════ */}
      <style>{`
        /* Article Content Layout Responsiveness */
        @media (max-width: 1024px) {
          .blog-content-layout {
            grid-template-columns: 1fr !important;
          }
          .blog-desktop-sidebar {
            display: none !important;
          }
        }

        /* Prose Font Scaling */
        .article-body {
          font-family: 'Hind Siliguri', 'Outfit', sans-serif;
          color: #0F172A;
          line-height: 1.85;
        }
        .article-body.font-scale-normal p,
        .article-body.font-scale-normal li {
          font-size: 17.5px;
        }
        .article-body.font-scale-large p,
        .article-body.font-scale-large li {
          font-size: 19px;
        }
        .article-body.font-scale-larger p,
        .article-body.font-scale-larger li {
          font-size: 21px;
        }

        .article-body p {
          margin: 0 0 1.4em;
          color: #1E293B;
          letter-spacing: 0.01em;
        }

        .article-body h1 {
          font-family: 'Hind Siliguri', 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: clamp(28px, 4vw, 36px);
          line-height: 1.3;
          margin: 2.2em 0 0.7em;
          color: #0F172A;
          scroll-margin-top: 100px;
        }
        .article-body h2 {
          font-family: 'Hind Siliguri', 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: clamp(23px, 3.2vw, 28px);
          line-height: 1.35;
          margin: 2em 0 0.6em;
          color: #0F172A;
          scroll-margin-top: 100px;
        }
        .article-body h3 {
          font-family: 'Hind Siliguri', 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 21px;
          line-height: 1.4;
          margin: 1.6em 0 0.5em;
          color: #0F172A;
          scroll-margin-top: 100px;
        }
        .article-body h4 {
          font-family: 'Hind Siliguri', 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 17px;
          line-height: 1.4;
          margin: 1.3em 0 0.4em;
          color: #0F172A;
          scroll-margin-top: 100px;
        }

        .article-body ul, .article-body ol {
          margin: 0 0 1.4em;
          padding-left: 1.8em;
          color: #1E293B;
        }
        .article-body li {
          margin-bottom: 0.45em;
          line-height: 1.8;
        }

        .article-body blockquote {
          border-left: 4px solid #C47D0E;
          margin: 1.8em 0;
          padding: 16px 24px;
          background: #FEF9EC;
          border-radius: 0 10px 10px 0;
          color: #334155;
          font-size: 17px;
          line-height: 1.75;
          box-shadow: 0 1px 4px rgba(196,125,14,0.06);
        }

        .article-body hr {
          border: none;
          border-top: 1px solid #E2E8F0;
          margin: 2.8em 0;
        }

        .article-body a {
          color: #C47D0E;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 500;
          transition: color 0.15s;
        }
        .article-body a:hover {
          color: #D97706;
        }

        .article-body code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13.5px;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          padding: 2px 6px;
          color: #0F172A;
        }

        /* Syntax Highlighted Code Blocks */
        .article-body pre {
          background: #0F172A;
          border-radius: 10px;
          padding: 16px 20px 20px;
          margin: 1.8em 0;
          overflow-x: auto;
          box-shadow: 0 4px 20px rgba(15,23,42,0.12);
        }
        .article-body pre code {
          background: none;
          border: none;
          padding: 0;
          color: #E2E8F0;
          font-size: 13.5px;
          line-height: 1.7;
          display: block;
        }

        .article-body mark {
          background: #FEF3C7;
          color: #92400E;
          border-radius: 3px;
          padding: 1px 4px;
        }

        .article-body img {
          max-width: 100%;
          border-radius: 12px;
          margin: 1.8em 0;
          display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        /* Responsive Tables */
        .table-responsive-wrapper {
          width: 100%;
          overflow-x: auto;
          margin: 1.8em 0;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Outfit', sans-serif;
          min-width: 500px;
        }
        .article-body th {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 12px 16px;
          font-weight: 700;
          font-size: 12.5px;
          text-align: left;
          color: #0F172A;
          letter-spacing: 0.03em;
        }
        .article-body td {
          border: 1px solid #E2E8F0;
          padding: 12px 16px;
          font-size: 14.5px;
          color: #334155;
          line-height: 1.6;
        }
        .article-body tr:nth-child(even) td {
          background: #FAFAFA;
        }
        .article-body tr:hover td {
          background: #FEF9EC;
        }

        /* KaTeX Math Equations */
        .katex-display {
          overflow-x: auto;
          overflow-y: hidden;
          padding: 12px 0;
          margin: 1.5em 0 !important;
        }

        /* Calculation Blocks */
        .article-body .calc-block-wrapper {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          overflow: hidden;
          margin: 1.8em 0;
          font-family: 'Outfit', sans-serif;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          background: #FFFFFF;
        }
        .article-body .calc-block-header {
          border-left: 4px solid #C47D0E;
          background: #FAF8F5;
          padding: 14px 20px;
        }
        .article-body .calc-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.2em;
          color: #C47D0E;
          display: block;
          margin-bottom: 4px;
          font-weight: 700;
        }
        .article-body .calc-title {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
        }
        .article-body .calc-section {
          padding: 16px 20px;
          border-top: 1px solid #F1F5F9;
        }
        .article-body .calc-formula-section {
          background: #FEF9EC;
        }
        .article-body .calc-section-label {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.2em;
          color: #C47D0E;
          background: #FEF3C7;
          padding: 2px 6px;
          border-radius: 3px;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .article-body .calc-given-row {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          padding: 4px 0;
        }
        .article-body .calc-given-label {
          color: #64748B;
        }
        .article-body .calc-given-value {
          font-family: 'JetBrains Mono', monospace;
          color: #0F172A;
          font-weight: 600;
        }
        .article-body .calc-formula {
          font-size: 20px;
          text-align: center;
          color: #0F172A;
          padding: 10px 0;
        }
        .article-body .calc-step {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          color: #334155;
          padding: 3px 0;
        }
        .article-body .calc-result-section {
          background: #FEF3C7;
          padding: 18px 20px;
          border-top: 1px solid #F5E6C8;
        }
        .article-body .calc-result-label {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.2em;
          color: #92400E;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .article-body .calc-result-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 38px;
          color: #C47D0E;
          text-transform: uppercase;
          line-height: 1;
        }
        .article-body .calc-result-unit {
          font-size: 24px;
        }
        .article-body .calc-result-note {
          font-size: 13px;
          color: #64748B;
          margin-top: 6px;
        }
        .article-body .calc-edit-btn {
          display: none;
        }

        /* Syntax Highlight Lowlight Theme */
        .article-body .hljs-keyword { color: #C47D0E; font-weight: 600; }
        .article-body .hljs-string { color: #86EFAC; }
        .article-body .hljs-number { color: #60A5FA; }
        .article-body .hljs-comment { color: #64748B; font-style: italic; }
        .article-body .hljs-function, .article-body .hljs-title { color: #A78BFA; }
        .article-body .hljs-params { color: #E2E8F0; }

        @media (max-width: 768px) {
          .article-body p, .article-body li {
            font-size: 16px !important;
          }
          .article-body h1 {
            font-size: 26px !important;
          }
          .article-body h2 {
            font-size: 22px !important;
          }
          .article-body pre {
            padding: 14px 16px 16px;
            border-radius: 8px;
          }
        }
      `}</style>
    </>
  )
}
