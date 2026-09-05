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
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Download,
  Share2,
  Type,
  ExternalLink,
  ChevronDown,
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

  // Fullscreen Diagram Modal State
  const [fullscreenDiagram, setFullscreenDiagram] = useState<{
    svg: string
    caption: string
    figNum: string
    category?: string
  } | null>(null)
  const [modalZoom, setModalZoom] = useState(100)

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
      if (pre.querySelector('.code-top-bar') || pre.classList.contains('mermaid') || pre.parentElement?.classList.contains('mermaid-render-zone')) return

      pre.style.position = 'relative'
      const code = pre.querySelector('code')
      const langClass = Array.from(code?.classList || []).find(c => c.startsWith('language-'))
      const langName = langClass ? langClass.replace('language-', '').toUpperCase() : 'CODE'

      if (langName === 'MERMAID') return

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

  // KaTeX Math Rendering
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
          throwOnError: false,
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
                { left: '\\[', right: '\\]', display: true },
                { left: '\\(', right: '\\)', display: false },
              ],
              throwOnError: false,
            })
          }
        }
        document.head.appendChild(s)
      }
    }
    setTimeout(tryRender, 350)
  }, [html])

  // Mermaid Diagrams Render & Interactive Controls Enhancer
  useEffect(() => {
    if (!contentRef.current) return
    const mermaidNodes = contentRef.current.querySelectorAll('.language-mermaid, pre code.language-mermaid, div.mermaid, [data-type="mermaid-block"]')
    if (mermaidNodes.length === 0) return

    const renderMermaid = () => {
      const w = window as any
      if (w.mermaid) {
        w.mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Outfit, sans-serif',
        })

        mermaidNodes.forEach(async (node, idx) => {
          // Prevent double processing
          if (node.classList.contains('mermaid-enhanced')) return
          node.classList.add('mermaid-enhanced')

          const isCustomBlock = node.getAttribute('data-type') === 'mermaid-block'
          let code = ''
          let caption = ''
          let figNum = ''
          let category = 'ELECTRICAL & SYSTEM SCHEMATIC'
          let voltageTier = ''
          let standardRef = ''
          let legend: any[] = []
          let steps: any[] = []

          if (isCustomBlock) {
            const rawAttrs = node.getAttribute('data-attrs')
            if (rawAttrs) {
              try {
                const parsed = JSON.parse(decodeURIComponent(rawAttrs))
                code = parsed.code || ''
                caption = parsed.caption || ''
                figNum = parsed.figNum || ''
                category = parsed.category || 'ELECTRICAL & SYSTEM SCHEMATIC'
                voltageTier = parsed.voltageTier || ''
                standardRef = parsed.standardRef || ''
                legend = parsed.legend || []
                steps = parsed.steps || []
              } catch {}
            }
            if (!code) {
              code = node.getAttribute('data-code') || node.querySelector('pre')?.textContent || ''
            }
          } else {
            code = node.textContent || ''
          }

          if (!code.trim()) return

          const card = document.createElement('div')
          card.className = 'mermaid-interactive-card'
          card.style.cssText = `
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            overflow: hidden;
            margin: 28px 0;
            background: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            font-family: Outfit, sans-serif;
          `

          // 1. Header Toolbar
          const header = document.createElement('div')
          header.className = 'mermaid-card-header'
          header.style.cssText = `
            background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
            padding: 12px 18px;
            color: #FFFFFF;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            border-bottom: 3px solid #059669;
          `

          const titleBox = document.createElement('div')
          titleBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px; flex-wrap: wrap;">
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: 0.18em; background: #059669; color: #FFFFFF; padding: 2px 7px; border-radius: 3px; font-weight: 700;">📊 ${category}</span>
              ${voltageTier ? `<span style="font-family: 'JetBrains Mono', monospace; font-size: 8.5px; background: rgba(255,255,255,0.15); color: #F8FAFC; padding: 2px 7px; border-radius: 3px;">⚡ ${voltageTier}</span>` : ''}
              ${standardRef ? `<span style="font-family: 'JetBrains Mono', monospace; font-size: 8.5px; background: rgba(255,255,255,0.1); color: #E2E8F0; padding: 2px 7px; border-radius: 3px;">📜 ${standardRef}</span>` : ''}
            </div>
            <div style="font-size: 14.5px; font-weight: 700; color: #FFFFFF;">
              ${figNum ? `<span style="color: #FBBF24; font-family: 'JetBrains Mono', monospace; margin-right: 6px;">${figNum}:</span>` : ''}
              ${caption || 'Electrical Single Line Diagram & Control Schematic'}
            </div>
          `

          // Control Toolbar (Zoom, Fullscreen, Copy)
          const toolGroup = document.createElement('div')
          toolGroup.style.cssText = 'display: flex; align-items: center; gap: 6px;'

          let currentZoom = 100

          const zoomOutBtn = document.createElement('button')
          zoomOutBtn.innerHTML = '−'
          zoomOutBtn.title = 'Zoom Out'
          zoomOutBtn.style.cssText = 'background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #FFF; border-radius: 4px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; font-weight: bold;'

          const zoomBadge = document.createElement('span')
          zoomBadge.innerText = '100%'
          zoomBadge.style.cssText = 'font-family: "JetBrains Mono", monospace; font-size: 10px; color: #94A3B8; min-width: 38px; text-align: center;'

          const zoomInBtn = document.createElement('button')
          zoomInBtn.innerHTML = '+'
          zoomInBtn.title = 'Zoom In'
          zoomInBtn.style.cssText = 'background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #FFF; border-radius: 4px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; font-weight: bold;'

          const resetBtn = document.createElement('button')
          resetBtn.innerText = '1:1'
          resetBtn.title = 'Reset Zoom'
          resetBtn.style.cssText = 'background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #FFF; border-radius: 4px; height: 26px; padding: 0 6px; font-family: "JetBrains Mono", monospace; font-size: 10px; cursor: pointer;'

          const fullBtn = document.createElement('button')
          fullBtn.innerHTML = '⛶ Fullscreen'
          fullBtn.title = 'Expand Fullscreen'
          fullBtn.style.cssText = 'background: #059669; border: none; color: #FFF; border-radius: 4px; height: 26px; padding: 0 9px; font-family: Outfit, sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;'

          toolGroup.appendChild(zoomOutBtn)
          toolGroup.appendChild(zoomBadge)
          toolGroup.appendChild(zoomInBtn)
          toolGroup.appendChild(resetBtn)
          toolGroup.appendChild(fullBtn)

          header.appendChild(titleBox)
          header.appendChild(toolGroup)
          card.appendChild(header)

          // 2. SVG Container
          const svgViewport = document.createElement('div')
          svgViewport.className = 'mermaid-svg-viewport'
          svgViewport.style.cssText = `
            padding: 24px;
            background: #FFFFFF;
            display: flex;
            justify-content: center;
            overflow-x: auto;
            position: relative;
            min-height: 140px;
          `

          const svgContainer = document.createElement('div')
          svgContainer.style.cssText = 'transition: transform 0.2s ease; transform-origin: center center; width: 100%; display: flex; justify-content: center;'
          svgViewport.appendChild(svgContainer)
          card.appendChild(svgViewport)

          // Zoom Handlers
          const applyZoom = () => {
            zoomBadge.innerText = `${currentZoom}%`
            svgContainer.style.transform = `scale(${currentZoom / 100})`
          }

          zoomOutBtn.onclick = () => {
            currentZoom = Math.max(50, currentZoom - 15)
            applyZoom()
          }

          zoomInBtn.onclick = () => {
            currentZoom = Math.min(220, currentZoom + 15)
            applyZoom()
          }

          resetBtn.onclick = () => {
            currentZoom = 100
            applyZoom()
          }

          // 3. Render SVG via Mermaid API
          let renderedSvg = ''
          const id = `mermaid-render-${Date.now()}-${idx}`
          try {
            const { svg } = await w.mermaid.render(id, code)
            renderedSvg = svg
            svgContainer.innerHTML = svg
            const innerSvg = svgContainer.querySelector('svg')
            if (innerSvg) {
              innerSvg.style.maxWidth = '100%'
              innerSvg.style.height = 'auto'
            }
          } catch (err) {
            svgContainer.innerHTML = `<pre style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#64748B;padding:12px;margin:0;overflow-x:auto;">${code}</pre>`
          }

          fullBtn.onclick = () => {
            setFullscreenDiagram({
              svg: renderedSvg || code,
              caption: caption || 'Electrical Diagram',
              figNum: figNum || '',
              category: category,
            })
            setModalZoom(100)
          }

          // 4. Legend & Glossary Key (if available)
          if (legend && legend.length > 0) {
            const legendDiv = document.createElement('div')
            legendDiv.style.cssText = 'padding: 14px 20px; background: #FAF8F5; border-top: 1px solid #F1F5F9;'
            legendDiv.innerHTML = `
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #475569; font-weight: 700; margin-bottom: 8px;">
                🔑 ELECTRICAL SYMBOLS & ABBREVIATIONS KEY:
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 8px;">
                ${legend
                  .map(
                    item => `
                  <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 10px; display: flex; gap: 8px; align-items: center;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${item.color || '#C47D0E'}; background: #FEF3C7; padding: 2px 6px; border-radius: 3px; flex-shrink: 0;">${item.symbol}</span>
                    <div>
                      <div style="font-size: 12px; font-weight: 600; color: #0F172A;">${item.label}</div>
                      <div style="font-size: 10.5px; color: #64748B;">${item.desc}</div>
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            `
            card.appendChild(legendDiv)
          }

          // 5. Power Flow Steps (if available)
          if (steps && steps.length > 0) {
            const flowDiv = document.createElement('div')
            flowDiv.style.cssText = 'padding: 14px 20px; background: #FEFDF9; border-top: 1px solid #F1F5F9;'
            flowDiv.innerHTML = `
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #92400E; font-weight: 700; margin-bottom: 8px;">
                ⚡ POWER FLOW & OPERATING SEQUENCE:
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${steps
                  .map(
                    s => `
                  <div style="display: flex; gap: 10px; align-items: baseline; font-size: 12.5px; color: #334155;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; background: #059669; color: #FFFFFF; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${s.stepNum}</span>
                    <div>
                      <strong style="color: #0F172A;">${s.title}:</strong> ${s.desc}
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            `
            card.appendChild(flowDiv)
          }

          // Replace old node
          if (isCustomBlock) {
            node.replaceWith(card)
          } else {
            node.closest('pre')?.replaceWith(card) || node.replaceWith(card)
          }
        })
      }
    }

    const w = window as any
    if (!w.mermaid) {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
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

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=600')
  }

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=500')
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=500')
  }

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank')
  }

  const shareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent('Read this engineering article:\n\n' + shareUrl)}`
  }

  // Structured Data Schema for Google Rich Results
  const jsonLdArticleSchema = useMemo(() => {
    if (!article) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: article.title,
      description: article.excerpt || article.meta_desc,
      image: article.featured_image ? [article.featured_image] : undefined,
      datePublished: article.created_at || new Date().toISOString(),
      dateModified: article.updated_at || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: article.author || 'Md Sahin Alom',
        url: 'https://sahinalom.com',
        jobTitle: 'Senior Electrical Engineer & Building Services Specialist',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Md Sahin Alom Engineering',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sahinalom.com/img/sahin.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': typeof window !== 'undefined' ? window.location.href : `https://sahinalom.com/blog/${slug}`,
      },
      keywords: article.tags?.join(', '),
      articleSection: article.category || 'Electrical Engineering',
      wordCount: wordCount,
      inLanguage: isBengali(article.title) ? 'bn-BD' : 'en-US',
    }
  }, [article, slug, wordCount])

  if (loading) {
    return (
      <>
        <SEOHead title="Loading Engineering Article..." description="Please wait while the article loads." />
        <EngineerNav />
        <div style={{ textAlign: 'center', padding: '140px 20px', fontFamily: 'Outfit,sans-serif' }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: '3px solid #E2E8F0',
              borderTopColor: '#C47D0E',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div style={{ color: '#64748B', fontSize: 15, fontWeight: 500 }}>
            Loading engineering research & calculations…
          </div>
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
            boxShadow: '0 0 8px rgba(196,125,14,0.6)',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      <EngineerNav />

      {/* ══ FULLSCREEN DIAGRAM MODAL ════════════════════════════════════════ */}
      {fullscreenDiagram && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 17, 24, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(8px, 2vw, 18px)',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setFullscreenDiagram(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                padding: '12px 18px',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                borderBottom: '3px solid #C47D0E',
              }}
            >
              <div style={{ minWidth: 0, flex: '1 1 200px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, background: '#C47D0E', color: '#FFF', padding: '2px 8px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.08em' }}>
                  {fullscreenDiagram.category || 'ELECTRICAL SCHEMATIC'}
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: 15, color: '#FFFFFF', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {fullscreenDiagram.figNum ? `${fullscreenDiagram.figNum}: ` : ''}
                  {fullscreenDiagram.caption}
                </h3>
              </div>

              {/* Zoom & Close Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => setModalZoom(z => Math.max(40, z - 20))}
                  title="Zoom Out"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFF',
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  −
                </button>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F8FAFC', minWidth: 44, textAlign: 'center', fontWeight: 600 }}>
                  {modalZoom}%
                </span>
                <button
                  onClick={() => setModalZoom(z => Math.min(300, z + 20))}
                  title="Zoom In"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFF',
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => setModalZoom(100)}
                  title="Reset Zoom"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFF',
                    padding: '0 10px',
                    height: 32,
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                  }}
                >
                  100%
                </button>
                <button
                  onClick={() => setFullscreenDiagram(null)}
                  title="Close (Esc)"
                  style={{
                    background: 'rgba(239,68,68,0.2)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    color: '#F87171',
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 4,
                  }}
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Modal SVG Viewport with CAD Grid */}
            <div
              style={{
                flex: 1,
                padding: '24px',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#FAFAF8',
                backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                touchAction: 'pan-x pan-y pinch-zoom',
              }}
            >
              <div
                style={{
                  transform: `scale(${modalZoom / 100})`,
                  transition: 'transform 0.15s ease',
                  transformOrigin: 'center center',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                dangerouslySetInnerHTML={{ __html: fullscreenDiagram.svg }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ══ ARTICLE MAIN CONTAINER ════════════════════════════════════════════ */}
      <main
        style={{
          background: '#FAF8F5',
          minHeight: '100vh',
          paddingTop: 'calc(var(--nav-h) + 24px)',
          paddingBottom: '80px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {/* Breadcrumbs */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#64748B',
              marginBottom: 20,
              flexWrap: 'wrap',
            }}
          >
            <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>
              HOME
            </Link>
            <ChevronRight size={13} />
            <Link to="/blog" style={{ color: '#C47D0E', textDecoration: 'none', fontWeight: 600 }}>
              ENGINEERING JOURNAL
            </Link>
            <ChevronRight size={13} />
            <span style={{ color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>
              {article.title}
            </span>
          </nav>

          {/* Article Header & Hero */}
          <header style={{ marginBottom: 36 }}>
            {/* Badges Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              {article.category && (
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#C47D0E',
                    background: '#FEF3C7',
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  ⚡ {article.category}
                </span>
              )}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#16A34A',
                  background: '#DCFCE7',
                  padding: '3px 10px',
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                ✓ BNBC 2020 & IEC REVIEWED
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: getBlogTitleStyles(article.title).fontFamily,
                fontWeight: getBlogTitleStyles(article.title).fontWeight as any,
                fontSize: isBengali(article.title) ? '36px' : '40px',
                lineHeight: getBlogTitleStyles(article.title).lineHeight,
                color: '#0F172A',
                marginBottom: 16,
                letterSpacing: getBlogTitleStyles(article.title).letterSpacing,
              }}
            >
              {article.title}
            </h1>

            {/* Excerpt / Lead */}
            {article.excerpt && (
              <p
                style={{
                  fontFamily: getBlogBodyStyles(article.excerpt).fontFamily,
                  fontSize: '18px',
                  lineHeight: '1.7',
                  color: '#475569',
                  marginBottom: 20,
                  borderLeft: '3px solid #C47D0E',
                  paddingLeft: 16,
                  fontStyle: 'normal',
                }}
              >
                {article.excerpt}
              </p>
            )}

            {/* Author, Meta & Reader Font Controls Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                padding: '14px 20px',
                background: '#FFFFFF',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              {/* Author & Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={sahinAvatar}
                    alt={article.author || 'Md Sahin Alom'}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #C47D0E',
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>
                      {article.author || 'Md Sahin Alom'}
                    </div>
                    <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B' }}>
                      Senior Electrical Engineer & ABC Licensed
                    </div>
                  </div>
                </div>

                <div style={{ width: 1, height: 28, background: '#E2E8F0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, color: '#64748B', fontFamily: 'Outfit,sans-serif' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Calendar size={14} color="#C47D0E" />
                    {formatDate(article.created_at || article.updated_at)}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={14} color="#C47D0E" />
                    {article.read_time || Math.max(3, Math.ceil(wordCount / 200))} min read
                  </span>
                </div>
              </div>

              {/* Action Buttons: Font Scale, Share & Copy */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Font Scaling */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#F1F5F9',
                    borderRadius: 6,
                    padding: 2,
                  }}
                >
                  <button
                    onClick={() => setFontSizeScale('normal')}
                    title="Normal text size"
                    style={{
                      border: 'none',
                      background: fontSizeScale === 'normal' ? '#FFFFFF' : 'transparent',
                      color: fontSizeScale === 'normal' ? '#C47D0E' : '#64748B',
                      borderRadius: 4,
                      padding: '4px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: 'Outfit,sans-serif',
                      cursor: 'pointer',
                      boxShadow: fontSizeScale === 'normal' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSizeScale('large')}
                    title="Large text size"
                    style={{
                      border: 'none',
                      background: fontSizeScale === 'large' ? '#FFFFFF' : 'transparent',
                      color: fontSizeScale === 'large' ? '#C47D0E' : '#64748B',
                      borderRadius: 4,
                      padding: '4px 8px',
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'Outfit,sans-serif',
                      cursor: 'pointer',
                      boxShadow: fontSizeScale === 'large' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSizeScale('larger')}
                    title="Extra large text size"
                    style={{
                      border: 'none',
                      background: fontSizeScale === 'larger' ? '#FFFFFF' : 'transparent',
                      color: fontSizeScale === 'larger' ? '#C47D0E' : '#64748B',
                      borderRadius: 4,
                      padding: '4px 8px',
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: 'Outfit,sans-serif',
                      cursor: 'pointer',
                      boxShadow: fontSizeScale === 'larger' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    A++
                  </button>
                </div>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: copiedToast ? '#16A34A' : '#FFFFFF',
                    border: `1px solid ${copiedToast ? '#16A34A' : '#CBD5E1'}`,
                    color: copiedToast ? '#FFFFFF' : '#475569',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: 'Outfit,sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copiedToast ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedToast ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            {article.featured_image && (
              <div
                style={{
                  marginTop: 24,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                  maxHeight: 460,
                }}
              >
                <img
                  src={article.featured_image}
                  alt={article.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: 460,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            )}
          </header>

          {/* ══ 2-COLUMN ARTICLE LAYOUT ════════════════════════════════════════ */}
          <div
            className="article-two-column"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 300px',
              gap: 40,
              alignItems: 'flex-start',
            }}
          >
            {/* ── LEFT COLUMN: ARTICLE BODY ── */}
            <article
              ref={contentRef}
              className={`article-body font-scale-${fontSizeScale}`}
              style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '36px 40px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                fontFamily: getBlogBodyStyles(article.title).fontFamily,
                color: '#1E293B',
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* ── RIGHT COLUMN: STICKY SIDEBAR ── */}
            <aside
              className="article-sidebar"
              style={{
                position: 'sticky',
                top: 'calc(var(--nav-h) + 20px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {/* Table of Contents Box */}
              {toc.length > 0 && (
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 12,
                    padding: 20,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      color: '#C47D0E',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <ListOrdered size={14} /> TABLE OF CONTENTS
                  </div>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '380px', overflowY: 'auto' }}>
                    {toc.map(item => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={e => {
                          e.preventDefault()
                          const target = document.getElementById(item.id)
                          if (target) {
                            const y = target.getBoundingClientRect().top + window.scrollY - 100
                            window.scrollTo({ top: y, behavior: 'smooth' })
                          }
                        }}
                        style={{
                          display: 'block',
                          fontSize: item.level === 2 ? 13 : 12,
                          paddingLeft: (item.level - 2) * 12,
                          color: activeHeadingId === item.id ? '#C47D0E' : '#64748B',
                          fontWeight: activeHeadingId === item.id ? 700 : 500,
                          textDecoration: 'none',
                          lineHeight: 1.4,
                          borderLeft: activeHeadingId === item.id ? '2px solid #C47D0E' : '2px solid transparent',
                          padding: '3px 8px',
                          borderRadius: '0 4px 4px 0',
                          background: activeHeadingId === item.id ? '#FEF9EC' : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Author Profile Card */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  padding: 20,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  textAlign: 'center',
                }}
              >
                <img
                  src={sahinAvatar}
                  alt="Md Sahin Alom"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 10px',
                    border: '3px solid #C47D0E',
                  }}
                />
                <h4 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, color: '#0F172A', margin: '0 0 2px' }}>
                  Md Sahin Alom
                </h4>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginBottom: 12 }}>
                  Electrical Design & Safety Specialist
                </div>
                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 14px' }}>
                  10+ years specializing in Industrial Substation Design, BNBC 2020 Electrical Compliance, and Energy Efficiency.
                </p>
                <Link
                  to="/contact"
                  style={{
                    display: 'block',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    padding: '8px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'Outfit,sans-serif',
                  }}
                >
                  Request Consultation
                </Link>
              </div>

              {/* Social Share Box */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  padding: 18,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: '0.15em',
                    color: '#64748B',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Share2 size={13} /> SHARE RESEARCH
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  <button
                    onClick={shareLinkedIn}
                    title="Share on LinkedIn"
                    style={{
                      height: 36,
                      background: '#0A66C2',
                      border: 'none',
                      color: '#fff',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LinkedInIcon size={16} />
                  </button>
                  <button
                    onClick={shareTwitter}
                    title="Share on X"
                    style={{
                      height: 36,
                      background: '#000000',
                      border: 'none',
                      color: '#fff',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TwitterXIcon size={14} />
                  </button>
                  <button
                    onClick={shareFacebook}
                    title="Share on Facebook"
                    style={{
                      height: 36,
                      background: '#1877F2',
                      border: 'none',
                      color: '#fff',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FacebookIcon size={16} />
                  </button>
                  <button
                    onClick={shareWhatsApp}
                    title="Share via WhatsApp"
                    style={{
                      height: 36,
                      background: '#25D366',
                      border: 'none',
                      color: '#fff',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* ══ ARTICLE FOOTER & SIGNATURE SECTION ══════════════════════════════ */}
          <footer style={{ marginTop: 48 }}>
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                  TOPICS:
                </span>
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 12,
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: 20,
                      padding: '4px 12px',
                      color: '#334155',
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Signature Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                color: '#FFFFFF',
                borderRadius: 14,
                padding: '32px',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                flexWrap: 'wrap',
                marginBottom: 40,
                boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={sahinAvatar}
                alt="Md Sahin Alom"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #C47D0E',
                }}
              />
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#FFFFFF' }}>
                    Md Sahin Alom
                  </h3>
                  <span style={{ background: '#C47D0E', color: '#FFFFFF', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                    ABC LICENSED
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8, fontFamily: 'Outfit,sans-serif' }}>
                  Professional Electrical Engineer • Bangladesh National Building Code (BNBC 2020) Specialist
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: '#CBD5E1', lineHeight: 1.6, fontFamily: 'Outfit,sans-serif' }}>
                  Have questions about this calculation or need assistance with your building's electrical & substation design? Connect with me directly.
                </p>
              </div>
              <Link
                to="/contact"
                style={{
                  background: '#C47D0E',
                  color: '#FFFFFF',
                  padding: '12px 20px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'Outfit,sans-serif',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(196,125,14,0.4)',
                }}
              >
                Get in Touch
              </Link>
            </div>

            {/* Next / Prev Article Navigation */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
                marginBottom: 48,
              }}
            >
              {prevArticle ? (
                <Link
                  to={`/blog/${prevArticle.slug}`}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '20px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#C47D0E', fontWeight: 700 }}>
                    ← PREVIOUS ARTICLE
                  </span>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#0F172A', lineHeight: 1.4 }}>
                    {prevArticle.title}
                  </span>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link
                  to={`/blog/${nextArticle.slug}`}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '20px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 6,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#C47D0E', fontWeight: 700 }}>
                    NEXT ARTICLE →
                  </span>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#0F172A', lineHeight: 1.4, textAlign: 'right' }}>
                    {nextArticle.title}
                  </span>
                </Link>
              ) : <div />}
            </div>
          </footer>
        </div>
      </main>

      {/* ══ MOBILE FLOATING ToC BUTTON ══════════════════════════════════════ */}
      {toc.length > 0 && (
        <div className="mobile-toc-fab-container">
          <button
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 900,
              background: '#0F172A',
              color: '#FFFFFF',
              border: '1px solid #334155',
              borderRadius: 30,
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <ListOrdered size={16} color="#C47D0E" />
            <span>Table of Contents ({toc.length})</span>
          </button>

          {/* Mobile ToC Drawer Sheet */}
          {mobileTocOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 950,
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'column',
                animation: 'fadeIn 0.2s ease',
              }}
              onClick={() => setMobileTocOpen(false)}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  maxHeight: 'min(78vh, 600px)',
                  paddingTop: 14,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
                  overflowY: 'auto',
                  boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Grab Handle */}
                <div style={{ width: 36, height: 4, borderRadius: 2, background: '#CBD5E1', margin: '0 auto 14px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(196,125,14,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C47D0E' }}>
                      <ListOrdered size={16} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#0F172A' }}>
                      Table of Contents
                    </h3>
                  </div>
                  <button onClick={() => setMobileTocOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#64748B', display: 'flex' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {toc.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => {
                        setMobileTocOpen(false)
                        const target = document.getElementById(item.id)
                        if (target) {
                          const y = target.getBoundingClientRect().top + window.scrollY - 90
                          window.scrollTo({ top: y, behavior: 'smooth' })
                        }
                      }}
                      style={{
                        display: 'block',
                        fontSize: 13.5,
                        padding: '10px 12px',
                        paddingLeft: Math.max(12, (item.level - 2) * 16 + 12),
                        borderRadius: 8,
                        background: activeHeadingId === item.id ? 'rgba(196,125,14,0.08)' : 'transparent',
                        color: activeHeadingId === item.id ? '#C47D0E' : '#334155',
                        fontWeight: activeHeadingId === item.id ? 700 : 500,
                        textDecoration: 'none',
                        lineHeight: 1.4,
                        transition: 'background 0.15s, color 0.15s',
                        borderLeft: `3px solid ${activeHeadingId === item.id ? '#C47D0E' : 'transparent'}`,
                      }}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ COMPREHENSIVE CSS STYLING INJECTION ══════════════════════════════ */}
      <style>{`
        /* Dynamic Typography Scaling */
        .article-body.font-scale-normal {
          font-size: 17px;
          line-height: 1.8;
        }
        .article-body.font-scale-large {
          font-size: 19px;
          line-height: 1.85;
        }
        .article-body.font-scale-larger {
          font-size: 21px;
          line-height: 1.9;
        }

        .article-body p {
          margin-bottom: 1.6em;
          color: #334155;
        }

        .article-body h1, .article-body h2, .article-body h3, .article-body h4 {
          color: #0F172A;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          margin-top: 1.8em;
          margin-bottom: 0.8em;
          line-height: 1.35;
        }
        .article-body h1 { font-size: 28px; border-bottom: 2px solid #F1F5F9; padding-bottom: 8px; }
        .article-body h2 { font-size: 23px; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; }
        .article-body h3 { font-size: 19px; }
        .article-body h4 { font-size: 17px; }

        .article-body ul, .article-body ol {
          margin-bottom: 1.6em;
          padding-left: 24px;
          color: #334155;
        }
        .article-body li {
          margin-bottom: 0.5em;
          line-height: 1.7;
        }

        .article-body blockquote {
          border-left: 4px solid #C47D0E;
          background: #FAF8F5;
          padding: 18px 22px;
          border-radius: 0 8px 8px 0;
          margin: 1.8em 0;
          color: #334155;
          font-size: 16px;
          line-height: 1.7;
        }

        .article-body hr {
          border: none;
          border-top: 1px solid #E2E8F0;
          margin: 2.4em 0;
        }

        .article-body code:not(pre code) {
          font-family: 'JetBrains Mono', monospace;
          background: #F1F5F9;
          color: #92400E;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.88em;
          font-weight: 600;
        }

        .article-body pre {
          background: #0F172A !important;
          color: #F8FAFC !important;
          padding: 16px 20px 20px;
          border-radius: 10px;
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
          padding: 14px 0;
          margin: 1.5em 0 !important;
        }
        .katex {
          font-size: 1.15em !important;
        }

        /* Upgraded Calculation Blocks */
        .article-body .calc-block-wrapper {
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          margin: 2em 0;
          font-family: 'Outfit', sans-serif;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          background: #FFFFFF;
        }
        .article-body .calc-block-header {
          background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
          padding: 16px 22px;
          color: #FFFFFF;
          border-bottom: 3px solid #C47D0E;
        }
        .article-body .calc-header-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .article-body .calc-category-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          background: #C47D0E;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
        }
        .article-body .calc-standard-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          background: rgba(255,255,255,0.12);
          color: #F8FAFC;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .article-body .calc-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .article-body .calc-section {
          padding: 16px 22px;
          border-top: 1px solid #F1F5F9;
        }
        .article-body .calc-given-section {
          background: #FAF8F5;
        }
        .article-body .calc-section-label {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          color: #92400E;
          background: #FEF3C7;
          padding: 2px 8px;
          border-radius: 3px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .article-body .calc-given-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 10px;
        }
        .article-body .calc-given-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 10px 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .article-body .calc-given-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .article-body .calc-given-label {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }
        .article-body .calc-given-symbol {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #C47D0E;
          font-weight: 700;
        }
        .article-body .calc-given-val-row {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
        }
        .article-body .calc-given-unit {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }
        .article-body .calc-given-note {
          display: block;
          font-size: 10.5px;
          color: #94A3B8;
          margin-top: 3px;
        }

        .article-body .calc-formula-section {
          background: #FEFDF9;
        }
        .article-body .calc-formula-display {
          background: #FFFFFF;
          border: 1px solid #F5E6C8;
          border-radius: 8px;
          padding: 18px;
          text-align: center;
          margin-bottom: 12px;
          font-size: 20px;
          color: #0F172A;
        }
        .article-body .calc-nomenclature-box {
          background: #FAF8F5;
          border-radius: 6px;
          padding: 12px 16px;
          border: 1px solid #F1F5F9;
        }
        .article-body .calc-nomen-title {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
          font-family: 'JetBrains Mono', monospace;
        }
        .article-body .calc-nomen-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 6px;
          font-size: 12.5px;
        }
        .article-body .calc-nomen-item {
          display: flex;
          gap: 6px;
          align-items: baseline;
        }
        .article-body .calc-nomen-sym {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: #C47D0E;
        }
        .article-body .calc-nomen-eq { color: #94A3B8; }
        .article-body .calc-nomen-desc { color: #334155; }

        .article-body .calc-steps-section {
          background: #FFFFFF;
        }
        .article-body .calc-steps-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .article-body .calc-step-row {
          display: flex;
          gap: 12px;
          align-items: baseline;
          padding: 10px 14px;
          background: #FAF8F5;
          border-radius: 6px;
          border-left: 3px solid #C47D0E;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13.5px;
          color: #334155;
        }
        .article-body .calc-step-card {
          background: #FAF8F5;
          border-radius: 8px;
          border: 1px solid #F1F5F9;
          border-left: 3px solid #C47D0E;
          padding: 12px 16px;
        }
        .article-body .calc-step-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .article-body .calc-step-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          color: #C47D0E;
          background: #FEF3C7;
          padding: 2px 7px;
          border-radius: 3px;
        }
        .article-body .calc-step-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
        }
        .article-body .calc-step-math {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: #1E293B;
          margin: 6px 0;
          font-weight: 600;
        }
        .article-body .calc-step-expl {
          font-size: 12px;
          color: #64748B;
          margin-top: 4px;
          font-style: italic;
        }

        .article-body .calc-result-box {
          background: linear-gradient(180deg, #FEF9EC 0%, #FEF3C7 100%);
          padding: 22px;
          border-top: 1px solid #F5E6C8;
        }
        .article-body .calc-result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 6px;
        }
        .article-body .calc-result-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #92400E;
          font-weight: 700;
        }
        .article-body .calc-compliance-tag {
          font-size: 11.5px;
          color: #16A34A;
          font-weight: 700;
        }
        .article-body .calc-result-main {
          margin: 6px 0 12px 0;
        }
        .article-body .calc-result-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 40px;
          color: #92400E;
          text-transform: uppercase;
          line-height: 1;
        }
        .article-body .calc-result-unit-large {
          font-size: 24px;
          color: #B45309;
          font-weight: 600;
        }
        .article-body .calc-result-note-box {
          background: rgba(255,255,255,0.9);
          border-left: 3px solid #C47D0E;
          border-radius: 6px;
          padding: 12px 16px;
          font-size: 13.5px;
          color: #334155;
          line-height: 1.5;
          margin-bottom: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .article-body .calc-equipment-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 10px;
          margin-top: 12px;
        }
        .article-body .calc-spec-item {
          background: #FFFFFF;
          border: 1px solid #F5E6C8;
          border-radius: 6px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .article-body .calc-spec-lbl {
          font-size: 11px;
          color: #78350F;
          text-transform: uppercase;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }
        .article-body .calc-spec-val {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
        }
        .article-body .calc-spec-badge {
          font-size: 10px;
          color: #16A34A;
          font-weight: 600;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .article-two-column {
            grid-template-columns: 1fr !important;
          }
          .article-sidebar {
            display: none !important;
          }
          .mobile-toc-fab-container {
            display: block !important;
          }
        }

        @media (min-width: 1025px) {
          .mobile-toc-fab-container {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .article-body {
            padding: 24px 18px !important;
          }
          .article-body h1 {
            font-size: 24px !important;
          }
          .article-body h2 {
            font-size: 20px !important;
          }
          .article-body pre {
            padding: 14px 16px;
          }
        }
      `}</style>
    </>
  )
}
