import { useEffect } from 'react'

export interface SEOProps {
  title: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authorName?: string
  category?: string
  schema?: Record<string, any> | Record<string, any>[]
}

/**
 * Sets document meta tags, OpenGraph, Twitter cards, and JSON-LD structured data dynamically.
 */
export default function SEOHead({
  title,
  description = 'Technical writing on electrical engineering, power systems, substation design, and BNBC 2020 by Md Sahin Alom.',
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  authorName = 'Md Sahin Alom',
  category,
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Page Title
    const fullTitle = title.includes('Md Sahin Alom') ? title : `${title} — Md Sahin Alom`
    document.title = fullTitle

    // Helper to create or update meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      if (!content) return
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Helper to set link tags (like canonical)
    const setLinkTag = (rel: string, href: string) => {
      if (!href) return
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    const currentUrl = canonicalUrl || window.location.href
    const defaultImage = `${window.location.origin}/img/lighting-design-cover.jpg`
    const absoluteImage = ogImage
      ? ogImage.startsWith('http')
        ? ogImage
        : `${window.location.origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`
      : defaultImage

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description)
    if (keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '))
    }
    setMetaTag('name', 'author', authorName)
    setLinkTag('canonical', currentUrl)

    // 3. OpenGraph Meta Tags
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:url', currentUrl)
    setMetaTag('property', 'og:image', absoluteImage)
    setMetaTag('property', 'og:site_name', 'Md Sahin Alom — Electrical Engineering Journal')
    setMetaTag('property', 'og:locale', 'en_US')

    if (ogType === 'article') {
      if (publishedTime) setMetaTag('property', 'article:published_time', publishedTime)
      if (modifiedTime) setMetaTag('property', 'article:modified_time', modifiedTime)
      if (authorName) setMetaTag('property', 'article:author', authorName)
      if (category) setMetaTag('property', 'article:section', category)
      keywords.forEach(tag => {
        setMetaTag('property', 'article:tag', tag)
      })
    }

    // 4. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', absoluteImage)
    setMetaTag('name', 'twitter:site', '@sahinalom')
    setMetaTag('name', 'twitter:creator', '@sahinalom')

    // 5. Inject JSON-LD Schema
    const existingScript = document.getElementById('jsonld-schema')
    if (existingScript) {
      existingScript.remove()
    }

    if (schema) {
      const script = document.createElement('script')
      script.id = 'jsonld-schema'
      script.type = 'application/ld+json'
      script.text = JSON.stringify(schema)
      document.head.appendChild(script)
    }

    return () => {
      const script = document.getElementById('jsonld-schema')
      if (script) script.remove()
    }
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType,
    publishedTime,
    modifiedTime,
    authorName,
    category,
    schema,
  ])

  return null
}
