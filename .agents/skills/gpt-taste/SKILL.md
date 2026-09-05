---
name: gpt-taste
description: >-
  Elite aesthetic judgment, anti-generic AI design heuristics, editorial refinement,
  and high-taste visual/copywriting guidelines. Use to eliminate AI clichés (purple gradients,
  cookie-cutter cards, robotic copy) and engineer bespoke, award-winning digital experiences.
---

# GPT-Taste: High-Taste Design & Anti-Slop Aesthetic System

A curated framework for imbuing AI-assisted software with human-level aesthetic taste, typographic tension, editorial distinction, and refined visual craft.

---

## 1. The Anti-Generic AI Rules (What NEVER to Do)

### 1.1 Visual & UI Clichés to Eliminate
* ❌ **The "AI Indigo/Purple" Gradient**: Never default to purple-to-indigo or cyan-to-purple gradient backgrounds. Use curated, intentional palettes (warm amber, titanium slate, deep obsidian, Swiss neutral, forest emerald).
* ❌ **Identical 3-Card Symmetrical Grid**: Avoid 3 identical centered rounded boxes with generic circular icons. Break symmetry with asymmetric spans (`2fr / 1fr`, bento grid layouts, horizontal editorial strips).
* ❌ **Floating Generic Blob Clutter**: Do not litter screens with meaningless blurred gradient blobs that have no structural anchor.
* ❌ **Over-Rounded "Toy" Elements**: Avoid excessive `border-radius: 32px` on enterprise or technical products. Prefer crisp `2px`–`6px` radius with architectural precision.

### 1.2 Copywriting Slop to Eliminate
* ❌ "In today's fast-paced digital landscape..."
* ❌ "Unlock the power of..."
* ❌ "Seamlessly integrate..."
* ❌ "Delve into...", "Testament to...", "Bespoke solutions for..."
* ✅ **Tasteful Copy**: Direct, assertive, domain-specific, and grounded in concrete numbers and real engineering specifications (e.g., *"11kV/0.415kV Substation Engineering & BNBC 2020 Compliance"*).

---

## 2. The 5 Pillars of High-Taste Digital Craft

### 2.1 Typographic Tension & Scale Contrast
Pair extreme scale differences to create immediate editorial drama:
* **Giant Scale**: Headline in massive condensed uppercase (`font-size: clamp(56px, 12vw, 180px)`, `line-height: 0.92`, `letter-spacing: -0.02em`).
* **Micro Precision**: Sub-labels, indices, and coordinate badges in crisp, spaced monospace (`font-size: 9.5px`, `letter-spacing: 0.18em`, `text-transform: uppercase`).
* **Reading Comfort**: Body copy in geometric sans (`line-height: 1.65`, `font-weight: 300`–`400`, max line width `65ch`).

### 2.2 Materiality & Architectural Precision
* **Delicate CAD Rules**: Ultra-fine borders (`1px solid rgba(...)`) and subtle grid lines (`opacity: 0.25`–`0.4`) that give structural authority.
* **Warm Ambient Illumination**: Soft, low-opacity radial glows (`rgba(196,125,14,0.08)`) with `65%`–`75%` falloffs centered behind key focal points.
* **Micro-Dots & Technical Grid**: Subtle `24px`–`32px` dot grids (`rgba(0,0,0,0.06)` or `rgba(255,255,255,0.06)`) that provide depth without visual noise.

### 2.3 Dynamic Asymmetry (Bento & Editorial Layouts)
* **Feature Anchors**: Make the primary item 2× larger or span full-width across rows.
* **Telemetry Strips**: Replace generic bullet points with technical data strips (Value + Unit + Label + Monospace index).

### 2.4 Tactile Micro-Interactions
* **Spring Dynamics**: Subtle `-2px` to `-4px` hover elevation with expanding soft shadow.
* **Feedback Loops**: Immediate visual acknowledgement on copy (`"COPIED!"` micro-badge in green), button click (`scale(0.98)`), and focus rings.

---

## 3. High-Taste Component Cookbook

### 3.1 Editorial Hero Ribbon
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
    01 // SYSTEM ARCHITECTURE
  </span>
  <div style={{ flex: 1, height: 1, background: 'var(--border-strong)' }} />
  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--muted)', letterSpacing: '0.12em' }}>
    REV. 2026.09
  </span>
</div>
```

### 3.2 Technical Stat Cell (Non-Generic)
```tsx
<div style={{ padding: '20px 0', borderRight: '1px solid var(--border)', paddingRight: 24 }}>
  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, marginBottom: 4 }}>
    15+ MVA
  </div>
  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
    Grid Capacity Delivered
  </div>
</div>
```

---

## 4. Taste Audit Checklist

Before considering any UI or copy complete, verify:
- [ ] Is there an obvious visual focal point within the first 2 seconds?
- [ ] Does the page avoid generic AI purple gradients and floating blobs?
- [ ] Is every headline grounded in authentic, fluff-free terminology?
- [ ] Are touch targets at least 44×44px on mobile viewports?
- [ ] Do interactive elements feel alive with kinetic micro-transitions?
- [ ] Is there high contrast and strict adherence to WCAG AAA standards?
