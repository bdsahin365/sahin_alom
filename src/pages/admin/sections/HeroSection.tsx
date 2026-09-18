import { useState, useRef, type ChangeEvent } from 'react'
import {
  Zap, Sparkles, Upload, Loader2, Check, ArrowUpRight,
  Download, Eye, RefreshCw, Layers, ArrowRight, Image as ImageIcon,
} from 'lucide-react'
import { useSite, type HeroSettings } from '../../../context/SiteContext'
import { Section, Grid2, Input, Textarea } from '../components/AdminPrimitives'
import { compressAndConvertToBase64, formatBytes } from '../../../lib/imageUtils'
import designerImg from '../../../img/designer.png'
import engineerImg from '../../../img/engineer.png'

interface HeroSectionProps {
  onNavigate?: (tab: any) => void
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const { data: { settings, engineer: E }, updateSettings } = useSite()
  const H: HeroSettings = settings.hero || {
    headlineLine1: 'Power Systems',
    headlineLine2: '& Engineering',
    tagline: 'High-voltage substation design, protection coordination, and renewable grid interconnection engineered to international standards (IEC / IEEE / BNBC).',
    ctaPrimaryText: 'Contact Me',
    ctaPrimaryLink: '/contact',
    ctaSecondaryText: 'View CV',
    ctaSecondaryLink: '/cv',
    imageBase: '',
    imageReveal: '',
  }

  const [compressingBase, setCompressingBase] = useState(false)
  const [compressingReveal, setCompressingReveal] = useState(false)
  const [baseStatus, setBaseStatus] = useState<string | null>(null)
  const [revealStatus, setRevealStatus] = useState<string | null>(null)

  const baseInputRef = useRef<HTMLInputElement>(null)
  const revealInputRef = useRef<HTMLInputElement>(null)

  const updateH = (patch: Partial<HeroSettings>) => {
    updateSettings({
      hero: {
        ...H,
        ...patch,
      },
    })
  }

  const handleBaseUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setCompressingBase(true)
      setBaseStatus('Optimizing base image...')
      const { base64, originalSize, compressedSize } = await compressAndConvertToBase64(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.82,
        mimeType: 'image/webp',
      })
      updateH({ imageBase: base64 })
      setBaseStatus(`Saved (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`)
      setTimeout(() => setBaseStatus(null), 4000)
    } catch (err: any) {
      setBaseStatus('Upload failed: ' + (err?.message || 'Error processing image'))
    } finally {
      setCompressingBase(false)
      e.target.value = ''
    }
  }

  const handleRevealUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setCompressingReveal(true)
      setRevealStatus('Optimizing reveal image...')
      const { base64, originalSize, compressedSize } = await compressAndConvertToBase64(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.82,
        mimeType: 'image/webp',
      })
      updateH({ imageReveal: base64 })
      setRevealStatus(`Saved (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`)
      setTimeout(() => setRevealStatus(null), 4000)
    } catch (err: any) {
      setRevealStatus('Upload failed: ' + (err?.message || 'Error processing image'))
    } finally {
      setCompressingReveal(false)
      e.target.value = ''
    }
  }

  const resetToDefaultTypography = () => {
    updateH({
      headlineLine1: 'Power Systems',
      headlineLine2: '& Engineering',
      tagline: 'High-voltage substation design, protection coordination, and renewable grid interconnection engineered to international standards (IEC / IEEE / BNBC).',
      ctaPrimaryText: 'Contact Me',
      ctaPrimaryLink: '/contact',
      ctaSecondaryText: 'View CV',
      ctaSecondaryLink: '/cv',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── LIVE HERO REAL-TIME SIMULATOR ── */}
      <Section
        title="Live Homepage Hero Preview"
        description="Instant visual mockup of your hero typography, buttons, and dual-layer spotlight imagery."
      >
        <div
          style={{
            position: 'relative',
            background: '#0A0D14',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #1E293B',
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '40px 24px',
            color: '#FFFFFF',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(${H.imageBase || designerImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Top Live Badge */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(196,125,14,0.2)',
              border: '1px solid rgba(196,125,14,0.4)',
              color: '#F59E0B',
              fontSize: 10,
              fontFamily: 'JetBrains Mono,monospace',
              padding: '3px 9px',
              borderRadius: 4,
              fontWeight: 700,
            }}
          >
            <Sparkles size={11} /> LIVE PREVIEW
          </div>

          {/* Headline Preview */}
          <div style={{ maxWidth: 640 }}>
            <div
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(28px, 4vw, 44px)',
                lineHeight: 1,
                color: '#FFFFFF',
                marginBottom: 2,
                textShadow: '0 2px 14px rgba(0,0,0,0.8)',
              }}
            >
              {H.headlineLine1 || 'Power Systems'}
            </div>
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(22px, 3.5vw, 36px)',
                lineHeight: 1.05,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: 14,
                textShadow: '0 2px 14px rgba(0,0,0,0.8)',
              }}
            >
              {H.headlineLine2 || '& Engineering'}
            </div>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.5,
                margin: '0 auto 20px',
                maxWidth: 480,
              }}
            >
              {H.tagline || 'High-voltage substation design, protection coordination, and renewable grid interconnection.'}
            </p>

            {/* CTAs Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span
                style={{
                  background: settings.branding?.primaryColor || '#C47D0E',
                  color: '#FFFFFF',
                  padding: '9px 20px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(196,125,14,0.4)',
                }}
              >
                {H.ctaPrimaryText || 'Contact Me'} <ArrowUpRight size={13} />
              </span>

              <span
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Download size={12} /> {H.ctaSecondaryText || 'View CV'}
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 1. TYPOGRAPHY & HERO MESSAGING ── */}
      <Section
        title="Hero Headlines & Messaging"
        description="Configure the primary cinematic title, Playfair serif accent, and technical value proposition."
      >
        <Grid2>
          <Input
            label="Headline Line 1 (Playfair Serif Italic)"
            value={H.headlineLine1}
            onChange={v => updateH({ headlineLine1: v })}
            placeholder="e.g. Power Systems"
          />
          <Input
            label="Headline Line 2 (Bold Uppercase Sans)"
            value={H.headlineLine2}
            onChange={v => updateH({ headlineLine2: v })}
            placeholder="e.g. & Engineering"
          />
        </Grid2>

        <div style={{ marginTop: 12 }}>
          <Textarea
            label="Hero Tagline & Subtitle"
            hint="Summarizes your core engineering specialization directly beneath the main title"
            value={H.tagline}
            onChange={v => updateH({ tagline: v })}
            rows={3}
            placeholder="High-voltage substation design, protection coordination, and renewable grid interconnection..."
          />
        </div>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={resetToDefaultTypography}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#475569',
              fontSize: 11.5,
              cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif',
            }}
          >
            <RefreshCw size={12} /> Reset Headlines to Default
          </button>
        </div>
      </Section>

      {/* ── 2. CALL-TO-ACTION BUTTONS ── */}
      <Section
        title="Call-To-Action (CTA) Buttons"
        description="Customize the two high-converting buttons displayed prominently in the hero section."
      >
        <Grid2>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Primary Button Text (Amber Filled)
            </label>
            <Input
              label=""
              value={H.ctaPrimaryText}
              onChange={v => updateH({ ctaPrimaryText: v })}
              placeholder="Contact Me"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Primary Button Target URL / Route
            </label>
            <Input
              label=""
              value={H.ctaPrimaryLink}
              onChange={v => updateH({ ctaPrimaryLink: v })}
              placeholder="/contact or #contact"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Secondary Button Text (Glass Translucent)
            </label>
            <Input
              label=""
              value={H.ctaSecondaryText}
              onChange={v => updateH({ ctaSecondaryText: v })}
              placeholder="View CV"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Secondary Button Target URL / Route
            </label>
            <Input
              label=""
              value={H.ctaSecondaryLink}
              onChange={v => updateH({ ctaSecondaryLink: v })}
              placeholder="/cv or /CV.pdf"
            />
          </div>
        </Grid2>
      </Section>

      {/* ── 3. DUAL-LAYER CINEMATIC IMAGES ── */}
      <Section
        title="Cinematic Hero Background Layers (Spotlight Interaction)"
        description="The homepage hero features an interactive spotlight: moving the cursor or tapping reveals the Engineer layer over the Base Designer layer."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {/* Layer 1: Base Background */}
          <div
            style={{
              padding: 16,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'Outfit,sans-serif' }}>
                  Base Layer (Designer Image)
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#64748B' }}>
                  Default visible backdrop with Ken Burns zoom
                </p>
              </div>
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', background: '#E2E8F0', padding: '2px 6px', borderRadius: 4 }}>
                Layer 1
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: 140,
                borderRadius: 6,
                overflow: 'hidden',
                background: '#0F172A',
                border: '1px solid #CBD5E1',
                position: 'relative',
              }}
            >
              <img
                src={H.imageBase || designerImg}
                alt="Hero Base Layer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {H.imageBase && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 6,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#FFF',
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  Custom
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                ref={baseInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleBaseUpload}
              />
              <button
                type="button"
                onClick={() => baseInputRef.current?.click()}
                disabled={compressingBase}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 6,
                  background: '#C47D0E',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: compressingBase ? 'not-allowed' : 'pointer',
                }}
              >
                {compressingBase ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                Upload New Base Image
              </button>

              {H.imageBase && (
                <button
                  type="button"
                  onClick={() => updateH({ imageBase: '' })}
                  style={{
                    padding: '7px 10px',
                    borderRadius: 6,
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#64748B',
                    fontSize: 11.5,
                    cursor: 'pointer',
                  }}
                >
                  Reset Default
                </button>
              )}
            </div>

            {baseStatus && (
              <div style={{ fontSize: 11, color: baseStatus.includes('failed') ? '#DC2626' : '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={12} /> {baseStatus}
              </div>
            )}

            <Input
              label="Or Image URL / Base64"
              value={H.imageBase || ''}
              onChange={v => updateH({ imageBase: v })}
              placeholder="https://... or data:image/..."
            />
          </div>

          {/* Layer 2: Spotlight Reveal */}
          <div
            style={{
              padding: 16,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'Outfit,sans-serif' }}>
                  Spotlight Reveal Layer (Engineer Image)
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#64748B' }}>
                  Interactive canvas layer revealed on cursor / touch
                </p>
              </div>
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4 }}>
                Layer 2
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: 140,
                borderRadius: 6,
                overflow: 'hidden',
                background: '#0F172A',
                border: '1px solid #CBD5E1',
                position: 'relative',
              }}
            >
              <img
                src={H.imageReveal || engineerImg}
                alt="Hero Reveal Layer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {H.imageReveal && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 6,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#FFF',
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  Custom
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                ref={revealInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleRevealUpload}
              />
              <button
                type="button"
                onClick={() => revealInputRef.current?.click()}
                disabled={compressingReveal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 6,
                  background: '#C47D0E',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: compressingReveal ? 'not-allowed' : 'pointer',
                }}
              >
                {compressingReveal ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                Upload New Reveal Image
              </button>

              {H.imageReveal && (
                <button
                  type="button"
                  onClick={() => updateH({ imageReveal: '' })}
                  style={{
                    padding: '7px 10px',
                    borderRadius: 6,
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#64748B',
                    fontSize: 11.5,
                    cursor: 'pointer',
                  }}
                >
                  Reset Default
                </button>
              )}
            </div>

            {revealStatus && (
              <div style={{ fontSize: 11, color: revealStatus.includes('failed') ? '#DC2626' : '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={12} /> {revealStatus}
              </div>
            )}

            <Input
              label="Or Image URL / Base64"
              value={H.imageReveal || ''}
              onChange={v => updateH({ imageReveal: v })}
              placeholder="https://... or data:image/..."
            />
          </div>
        </div>
      </Section>

      {/* ── 4. KEY METRICS SYNC NOTE ── */}
      <Section
        title="Hero Key Metrics & Stats Sync"
        description="The live numbers displayed in the Hero Bottom Ribbon (Years Exp, Capacity Delivered, Projects Completed) sync directly from your Profile Information."
      >
        <div
          style={{
            padding: 16,
            background: '#F1F5F9',
            borderRadius: 8,
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 18, color: '#C47D0E' }}>
                {E.yearsExp || '8+'}
              </div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Years Exp.</div>
            </div>
            <div style={{ width: 1, height: 28, background: '#CBD5E1' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 18, color: '#C47D0E' }}>
                {E.projectsMW || '15+ MVA'}
              </div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Installed Capacity</div>
            </div>
            <div style={{ width: 1, height: 28, background: '#CBD5E1' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 18, color: '#C47D0E' }}>
                {E.projectsCount || '40+'}
              </div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Delivered Projects</div>
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 6,
                background: '#0F172A',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Outfit,sans-serif',
              }}
            >
              Edit Stats in Profile <ArrowRight size={13} />
            </button>
          )}
        </div>
      </Section>
    </div>
  )
}
