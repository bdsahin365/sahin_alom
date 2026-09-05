---
name: audit-skill
description: >-
  Comprehensive web application audit skill covering code quality, Core Web Vitals,
  SEO performance, accessibility (a11y), responsive design, and security best practices.
  Use to audit, diagnose, and benchmark web applications before deployment.
---

# Web Application & Full-Stack Audit Skill

A standardized audit methodology for verifying performance, accessibility, SEO, responsive UI, and security integrity.

---

## 1. Audit Checklists & Verification Matrix

### 1.1 Performance & Core Web Vitals
* **Largest Contentful Paint (LCP)**: Must render under 2.5s.
  - Optimize hero background images & font preload tags.
  - Inline critical CSS; avoid blocking script tags in `<head>`.
* **Cumulative Layout Shift (CLS)**: Must score below 0.1.
  - Set explicit `width` and `height` or `aspect-ratio` on all images and video containers.
  - Avoid layout-shifting dynamic banners without reserved DOM space.
* **Interaction to Next Paint (INP)**: Must respond in <200ms.
  - Offload heavy calculations to Web Workers or memoized callbacks.
* **Bundle Analysis**:
  - Keep initial bundle < 500kB gzip.
  - Use code splitting for admin panels, calculators, and secondary routes (`React.lazy`).

### 1.2 Technical SEO & Structured Data
* **Title Tags**: Unique, descriptive, under 60 characters with branding (`<Title> — Site Name`).
* **Meta Descriptions**: Compelling summary between 140–160 characters.
* **OpenGraph & Social Sharing**:
  - `og:title`, `og:description`, `og:image` (1200×630px), `og:type`, `og:url`.
  - `twitter:card: summary_large_image`.
* **Canonical URLs**: Self-referential or authoritative canonical `<link rel="canonical">`.
* **JSON-LD Structured Data**:
  - `Person` / `Organization` / `Article` / `SoftwareApplication` schemas.
* **Sitemap & Robots**:
  - Valid `sitemap.xml` with `<lastmod>` timestamps.
  - Configured `robots.txt` allowing indexing.

### 1.3 Accessibility (a11y) & WCAG 2.1 AA
* **Color Contrast**: Minimum 4.5:1 for regular text, 3:1 for headings and graphic interfaces.
* **Semantic Structure**: Single `<h1>` per page, sequential `<h2>` -> `<h3>` hierarchy.
* **Images**: Descriptive `alt` tags on all informational images; `alt=""` or `aria-hidden` on decorative emblems.
* **Keyboard Navigation**:
  - Every interactive button, link, and input must be focusable via `Tab`.
  - Visible focus indicators (`:focus-visible`).
  - No keyboard focus traps in modals.

### 1.4 Security & State Robustness
* **Database & RLS**: Verify Supabase Row Level Security on all exposed tables.
* **Input Sanitization**: Sanitize user strings, validate email formats, prevent XSS.
* **Environment Secrets**: Never commit secret keys (`service_role`, admin API keys) to client bundles.

---

## 2. Audit Execution Workflow

1. **Step 1 — Build & Type Validation**: Run `npm run build` or `tsc --noEmit` to ensure 0 compile-time errors.
2. **Step 2 — Route & Link Verification**: Walk all internal routes (`/`, `/cv`, `/biodata`, `/tools`, `/blog`, `/contact`, `/admin`) and verify no 404 dead ends.
3. **Step 3 — Mobile Viewport Inspection**: Test at `360px`, `414px`, `768px`, and `1024px` to ensure no horizontal scroll (`overflow-x: hidden`).
4. **Step 4 — Database Sync**: Test write and read operations from the Admin panel to Supabase.
