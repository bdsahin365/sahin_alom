---
name: ui-ux-pro-max
description: >-
  Professional UI/UX Pro Max design system, visual hierarchy, luxury micro-interactions,
  responsive typography, conversion optimization, and state-of-the-art web aesthetics.
  Use when designing or auditing user interfaces, components, color systems, and interactive experiences.
---

# UI/UX Pro Max: Design & Aesthetic Engineering System

A comprehensive guide and reference for building high-end, award-winning web interfaces with world-class user experiences.

---

## 1. The Core Aesthetic Principles

### 1.1 Visual Hierarchy & Rhythm
* **The 60-30-10 Rule**: 
  - 60% Dominant canvas / background tone (`--bg`, `--bg-2`)
  - 30% Structural elements, cards, borders, typography (`--fg`, `--fg-dim`, `--border`)
  - 10% High-voltage accent for key focal points & primary CTAs (`--accent`)
* **Scale & Contrast**: Every screen must have a clear "Hero" element that commands attention before secondary details. Avoid flat visual weight.
* **Optical Spacing**: Use modular spacing (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`). Keep intra-component padding tighter than inter-section margins.

### 1.2 Modern Typography Stacking
* **Headline Display**: High-character fonts (`Barlow Condensed`, `Space Grotesk`, `Outfit`, `Syne`) with tight line-heights (`0.92` – `1.05`) and uppercase letter-spacing (`-0.02em` to `0.04em`).
* **Body Reading**: Clean modern sans-serifs (`Outfit`, `Inter`, `Plus Jakarta Sans`) with generous line-heights (`1.6` – `1.75`) and medium weights (`300`–`400`).
* **Technical Monospace**: `JetBrains Mono` for badges, indices, telemetry values, timestamps, and metadata with `0.1em`–`0.2em` letter spacing.

---

## 2. Kinetic Experience & Micro-Interactions

### 2.1 Physics-Based Transitions
* **Spring Dynamics**: Prefer spring physics (`stiffness: 300, damping: 25`) over linear curves.
* **Cubic-Bezier Curves**: For CSS transitions, use `cubic-bezier(0.16, 1, 0.3, 1)` for snappy, fluid response.

### 2.2 Micro-Interactions Checklist
* **Hover Lifts**: Cards lift by `-2px` to `-4px` with subtle shadow expansion (`box-shadow: 0 12px 32px rgba(0,0,0,0.08)`).
* **Active Press Feedback**: Buttons scale down slightly (`transform: scale(0.98)`) on `:active` for tactile responsiveness.
* **Magnetic Cursor / Glow Orbs**: Subtle radial glows that track or illuminate active interactive regions.
* **Pulsing Status Indicators**: Micro-beacons with glowing box-shadows (`box-shadow: 0 0 10px var(--green)`) for live statuses.

---

## 3. Component Architecture & Patterns

### 3.1 Buttons & Interactive Actions
```tsx
// Primary CTA with subtle hover glow & micro-lift
<button className="btn-primary" style={{
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '12px 24px', background: 'var(--accent)', color: '#FFF',
  borderRadius: 6, fontWeight: 700, letterSpacing: '0.04em',
  textTransform: 'uppercase', transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
  boxShadow: '0 2px 10px rgba(196,125,14,0.25)',
}}>
  <span>{label}</span>
  <ArrowRight size={14} />
</button>
```

### 3.2 Glassmorphism & Elevated Surfaces
```css
.surface-glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}
```

### 3.3 Mobile Touch Ergonomics
* Minimum touch target: **44px × 44px**.
* Bottom sticky CTAs for critical actions on mobile viewports.
* Generous horizontal gutter: `clamp(16px, 4vw, 32px)`.

---

## 4. Accessibility & Quality Standards (WCAG AAA)
* **Contrast Compliance**: Minimum 4.5:1 ratio for normal text, 3:1 for large display text.
* **Interactive Focus Rings**: `outline: 2px solid var(--accent)` with `outline-offset: 2px`.
* **Reduced Motion**: Respect `prefers-reduced-motion: reduce` by disabling non-essential parallax or looping transforms.
