import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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
import { Clock, Tag, ArrowLeft, List } from 'lucide-react'
import { fetchArticleBySlug, Article } from '../lib/articlesService'
import { CalcBlock } from './blog/extensions/CalcBlock'
import { getBlogTitleStyles, getBlogBodyStyles } from '../lib/langUtils'
import { MermaidBlock } from './blog/extensions/MermaidBlock'
import { FileAttachment } from './blog/extensions/FileAttachment'
import EngineerNav from '../components/EngineerNav'

const lowlight = createLowlight()
lowlight.register('python', python)
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('bash', bash)

const EXTENSIONS = [
  StarterKit.configure({ codeBlock: false }),
  Underline, Link, Image, Highlight,
  TaskList, TaskItem,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Table, TableRow, TableHeader, TableCell,
  Youtube,
  CodeBlockLowlight.configure({ lowlight }),
  CalcBlock, MermaidBlock, FileAttachment,
]

type TocItem = { id: string; text: string; level: number }

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [html, setHtml] = useState('')
  const [toc, setToc] = useState<TocItem[]>([])
  const [tocOpen, setTocOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!slug) return
    fetchArticleBySlug(slug).then(data => {
      if (!data) { setNotFound(true); setLoading(false); return }
      setArticle(data)
      // Generate HTML from TipTap JSON or render HTML string
      if (data.content) {
        if (typeof data.content === 'object') {
          try {
            const generatedHtml = generateHTML(data.content, EXTENSIONS)
            setHtml(generatedHtml)
          } catch {
            setHtml('<p>Content could not be rendered.</p>')
          }
        } else if (typeof data.content === 'string') {
          const trimmed = data.content.trim()
          if (trimmed.startsWith('{') || trimmed.startsWith('{"')) {
            try {
              const parsed = JSON.parse(trimmed)
              setHtml(generateHTML(parsed, EXTENSIONS))
            } catch {
              setHtml(data.content)
            }
          } else {
            setHtml(data.content)
          }
        }
      }
      setLoading(false)
    }).catch(() => {
      setNotFound(true)
      setLoading(false)
    })
  }, [slug])

  // Build ToC from headings
  useEffect(() => {
    if (!contentRef.current) return
    const headings = Array.from(contentRef.current.querySelectorAll('h1,h2,h3,h4')) as HTMLElement[]
    const items: TocItem[] = headings.map((h, i) => {
      const id = `heading-${i}`
      h.id = id
      return { id, text: h.innerText, level: parseInt(h.tagName[1]) }
    })
    setToc(items)
  }, [html])

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
    setTimeout(tryRender, 400)
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
          container.style.cssText = 'background:#FFFFFF;border:1px solid #E2E8F0;border-radius:8px;padding:16px;margin:20px 0;display:flex;justify-content:center;overflow-x:auto;'
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

  // SEO
  useEffect(() => {
    if (!article) return
    document.title = article.meta_title || article.title || 'Article — Sahin Alom'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', article.meta_desc || article.excerpt || '')
  }, [article])

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return '' }
  }

  if (loading) return (
    <>
      <EngineerNav />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', paddingTop: 'var(--nav-h)', fontFamily: 'Outfit,sans-serif', color: '#94A3B8' }}>
        Loading…
      </div>
    </>
  )

  if (notFound) return (
    <>
      <EngineerNav />
      <div style={{ textAlign: 'center', padding: '120px 24px 80px', paddingTop: 'calc(var(--nav-h) + 60px)', fontFamily: 'Outfit,sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 32, textTransform: 'uppercase', color: '#0F172A', marginBottom: 12 }}>Article Not Found</h1>
        <p style={{ color: '#64748B', marginBottom: 24 }}>This article may have been moved or doesn't exist.</p>
        <button onClick={() => navigate('/blog')} style={{ background: '#C47D0E', border: 'none', borderRadius: 6, color: '#fff', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontWeight: 600 }}>
          ← Back to Blog
        </button>
      </div>
    </>
  )

  if (!article) return null

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
      <EngineerNav />

      <div style={{ background: '#F7F5F0', minHeight: '100vh', paddingTop: 'var(--nav-h)' }}>

        {/* Back nav */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <button
              onClick={() => navigate('/blog')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 4,
                background: '#FAF8F5', border: '1px solid #E2E8F0',
                cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
                fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
                textTransform: 'uppercase', color: '#475569',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#475569' }}
            >
              <ArrowLeft size={13} strokeWidth={2} /> Back to Blog
            </button>

            {/* Breadcrumb path */}
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.12em', color: '#94A3B8', textTransform: 'uppercase' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/blog')}>BLOG</span> / <span style={{ color: '#C47D0E' }}>{article.category || 'ARTICLE'}</span>
            </div>
          </div>
        </div>

        {/* Article header */}
        <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '48px 0 40px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
            {/* Category */}
            {article.category && (
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', color: '#C47D0E', marginBottom: 14 }}>
                {article.category.toUpperCase()}
              </div>
            )}
            {/* Title */}
            <h1 style={{
              ...getBlogTitleStyles(article.title),
              fontSize: 'clamp(30px,5vw,56px)',
              color: '#0F172A',
              margin: '0 0 16px',
            }}>
              {article.title}
            </h1>
            {/* Excerpt */}
            {article.excerpt && (
              <p style={{
                ...getBlogBodyStyles(article.excerpt),
                fontSize: 18,
                color: '#64748B',
                marginBottom: 20,
              }}>
                {article.excerpt}
              </p>
            )}
            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#64748B' }}>
                {article.author}
              </span>
              <span style={{ color: '#DDD9D0' }}>·</span>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#94A3B8' }}>
                {formatDate(article.updated_at)}
              </span>
              {article.read_time > 0 && (
                <>
                  <span style={{ color: '#DDD9D0' }}>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Outfit,sans-serif', fontSize: 13, color: '#94A3B8' }}>
                    <Clock size={12} /> {article.read_time} min read
                  </span>
                </>
              )}
            </div>
            {/* Tags */}
            {article.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                {article.tags.map((t, i) => (
                  <span key={i} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.1em', padding: '3px 8px', border: '1px solid #E2E8F0', borderRadius: 4, color: '#64748B' }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured image */}
        {article.featured_image && (
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 24px 0' }}>
            <img
              src={article.featured_image}
              alt={article.title}
              style={{ width: '100%', borderRadius: 10, display: 'block', maxHeight: 420, objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Table of contents (floating on desktop) */}
        {toc.length >= 3 && (
          <div style={{ position: 'fixed', right: 24, top: 120, zIndex: 10, display: 'none' }} className="toc-desktop">
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 16px', maxWidth: 200, maxHeight: 360, overflowY: 'auto' }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: '#C47D0E', marginBottom: 8 }}>CONTENTS</div>
              {toc.map(item => (
                <a key={item.id} href={`#${item.id}`}
                  style={{
                    display: 'block', fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B',
                    padding: `3px 0 3px ${(item.level - 1) * 10}px`,
                    textDecoration: 'none', transition: 'color 0.15s',
                    lineHeight: 1.4, borderLeft: item.level === 1 ? '2px solid #E2E8F0' : 'none', paddingLeft: item.level === 1 ? 8 : (item.level - 1) * 10,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B' }}
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Article body */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <div
            ref={contentRef}
            className="article-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Article footer */}
        <div style={{ borderTop: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{article.author}</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2 }}>Electrical Engineer · sahinalom.com</div>
            </div>
            <button onClick={() => navigate('/blog')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid #E2E8F0', borderRadius: 6, background: 'transparent', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.1em', color: '#64748B', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C47D0E'; (e.currentTarget as HTMLElement).style.color = '#C47D0E' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#64748B' }}>
              <ArrowLeft size={12} /> MORE ARTICLES
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* Article body prose */
        .article-body { font-family: 'Hind Siliguri', 'Outfit', sans-serif; color: #0F172A; }
        .article-body p { font-size: 17.5px; line-height: 1.8; margin: 0 0 1.25em; }
        .article-body h1 { font-family: 'Hind Siliguri', 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 34px; line-height: 1.35; letter-spacing: -0.01em; margin: 2em 0 0.6em; color: #0F172A; }
        .article-body h2 { font-family: 'Hind Siliguri', 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 26px; line-height: 1.35; margin: 1.8em 0 0.6em; color: #0F172A; }
        .article-body h3 { font-family: 'Hind Siliguri', 'Outfit', sans-serif; font-weight: 600; font-size: 20px; line-height: 1.4; margin: 1.5em 0 0.5em; color: #0F172A; }
        .article-body h4 { font-family: 'Hind Siliguri', 'Outfit', sans-serif; font-weight: 600; font-size: 16px; line-height: 1.4; margin: 1.2em 0 0.4em; color: #0F172A; }
        .article-body ul, .article-body ol { margin: 0 0 1.2em; padding-left: 1.8em; }
        .article-body li { font-size: 17px; line-height: 1.8; margin-bottom: 0.35em; }
        .article-body blockquote { border-left: 3px solid #C47D0E; margin: 1.5em 0; padding: 14px 20px; background: #FEF9EC; border-radius: 0 8px 8px 0; font-style: italic; color: #374151; font-size: 17px; }
        .article-body hr { border: none; border-top: 1px solid #DDD9D0; margin: 2.5em 0; }
        .article-body a { color: #C47D0E; text-decoration: underline; }
        .article-body code { font-family: 'JetBrains Mono',monospace; font-size: 13px; background: #F1F5F9; border-radius: 4px; padding: 2px 5px; color: #0F172A; }
        .article-body pre { background: #0F172A; border-radius: 10px; padding: 20px 24px; margin: 1.5em 0; overflow-x: auto; }
        .article-body pre code { background: none; padding: 0; color: #E2E8F0; font-size: 13px; line-height: 1.7; }
        .article-body mark { background: #FEF3C7; color: #92400E; border-radius: 2px; padding: 0 2px; }
        .article-body img { max-width: 100%; border-radius: 10px; margin: 1.5em 0; display: block; }
        .article-body table { width: 100%; border-collapse: collapse; margin: 1.5em 0; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; }
        .article-body th { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 14px; font-weight: 600; font-size: 12px; text-align: left; }
        .article-body td { border: 1px solid #E2E8F0; padding: 10px 14px; font-size: 14px; color: #374151; }
        .article-body tr:hover td { background: #FAFAFA; }
        .article-body iframe { max-width: 100%; border-radius: 8px; }

        /* Calc blocks in article */
        .article-body .calc-block-wrapper { border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin: 1.5em 0; font-family: 'Outfit',sans-serif; }
        .article-body .calc-block-header { border-left: 4px solid #C47D0E; background: #FAFAFA; padding: 12px 20px; }
        .article-body .calc-label { font-family: 'JetBrains Mono',monospace; font-size: 9px; letter-spacing: 0.2em; color: #C47D0E; display: block; margin-bottom: 4px; }
        .article-body .calc-title { font-size: 15px; font-weight: 600; color: #0F172A; }
        .article-body .calc-section { padding: 14px 20px; border-top: 1px solid #F1F5F9; }
        .article-body .calc-formula-section { background: #FEF9EC; }
        .article-body .calc-section-label { display: inline-block; font-family: 'JetBrains Mono',monospace; font-size: 8px; letter-spacing: 0.2em; color: #C47D0E; background: #FEF3C7; padding: 2px 6px; border-radius: 3px; margin-bottom: 8px; }
        .article-body .calc-given-row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
        .article-body .calc-given-label { color: #64748B; }
        .article-body .calc-given-value { font-family: 'JetBrains Mono',monospace; color: #0F172A; }
        .article-body .calc-formula { font-size: 20px; text-align: center; color: #0F172A; padding: 8px 0; }
        .article-body .calc-step { font-family: 'JetBrains Mono',monospace; font-size: 12px; color: #374151; padding: 2px 0; }
        .article-body .calc-result-section { background: #FEF3C7; padding: 16px 20px; border-top: 1px solid #F5E6C8; }
        .article-body .calc-result-label { display: inline-block; font-family: 'JetBrains Mono',monospace; font-size: 8px; letter-spacing: 0.2em; color: #92400E; margin-bottom: 8px; }
        .article-body .calc-result-value { font-family: 'Barlow Condensed',sans-serif; font-weight: 800; font-size: 36px; color: #C47D0E; text-transform: uppercase; line-height: 1; }
        .article-body .calc-result-unit { font-size: 22px; }
        .article-body .calc-result-note { font-size: 12px; color: #64748B; margin-top: 6px; }
        .article-body .calc-edit-btn { display: none; }

        /* Syntax highlight */
        .article-body .hljs-keyword { color: #C47D0E; }
        .article-body .hljs-string { color: #86EFAC; }
        .article-body .hljs-number { color: #60A5FA; }
        .article-body .hljs-comment { color: #64748B; font-style: italic; }
        .article-body .hljs-function, .article-body .hljs-title { color: #A78BFA; }

        @media (min-width: 1200px) {
          .toc-desktop { display: block !important; }
        }

        @media (max-width: 768px) {
          .article-body p, .article-body li { font-size: 16px; }
          .article-body h1 { font-size: 30px; }
          .article-body h2 { font-size: 24px; }
          .article-body pre { padding: 14px 16px; border-radius: 8px; }
        }
      `}</style>
    </>
  )
}
