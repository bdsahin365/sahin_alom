import { useState, useRef } from 'react'
import { Zap, Loader2, Upload, Check } from 'lucide-react'
import { useSite } from '../../../context/SiteContext'
import HeaderLogo from '../../../components/HeaderLogo'
import { compressAndConvertToBase64, formatBytes } from '../../../lib/imageUtils'
import {
  Section,
  Grid2,
  Input,
  Switch,
  ImagePicker,
} from '../components/AdminPrimitives'

interface BrandingSectionProps {
  onNavigate?: (tab: any) => void
}

export default function BrandingSection({ onNavigate }: BrandingSectionProps = {}) {
  const { data: { settings, engineer: E }, updateSettings } = useSite()
  const B = settings.branding || {}

  const [compressingLogo, setCompressingLogo] = useState(false)
  const [compressingFavicon, setCompressingFavicon] = useState(false)
  const [logoStatus, setLogoStatus] = useState<string | null>(null)
  const [favStatus, setFavStatus] = useState<string | null>(null)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const favInputRef = useRef<HTMLInputElement>(null)

  const updateB = (patch: Partial<typeof B>) => {
    updateSettings({
      branding: {
        ...B,
        ...patch,
      },
    })
  }

  const handleLogoUpload = async (file: File) => {
    try {
      setCompressingLogo(true)
      setLogoStatus('Processing logo...')
      const { base64, originalSize, compressedSize } = await compressAndConvertToBase64(file, {
        maxWidth: 600,
        maxHeight: 200,
        quality: 0.9,
        mimeType: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
      })
      updateB({
        logo: base64,
        logoType: 'custom_image',
      })
      setLogoStatus(`Logo saved (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`)
      setTimeout(() => setLogoStatus(null), 3500)
    } catch (err: any) {
      setLogoStatus('Error: ' + (err?.message || 'Failed to upload logo'))
    } finally {
      setCompressingLogo(false)
    }
  }

  const handleFaviconUpload = async (file: File) => {
    try {
      setCompressingFavicon(true)
      setFavStatus('Processing favicon...')
      const { base64 } = await compressAndConvertToBase64(file, {
        maxWidth: 128,
        maxHeight: 128,
        quality: 0.95,
        mimeType: 'image/png',
      })
      updateB({
        favicon: base64,
      })
      setFavStatus('Favicon saved & applied!')
      setTimeout(() => setFavStatus(null), 3500)
    } catch (err: any) {
      setFavStatus('Error: ' + (err?.message || 'Failed to upload favicon'))
    } finally {
      setCompressingFavicon(false)
    }
  }

  return (
    <div>
      {/* Quick link to Hero Customizer */}
      {onNavigate && (
        <div
          style={{
            padding: '12px 18px',
            background: '#0F172A',
            color: '#FFFFFF',
            borderRadius: 8,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#F59E0B', display: 'flex' }}>✦</span>
            <div>
              <span style={{ fontWeight: 600, fontSize: 13, fontFamily: 'Outfit,sans-serif' }}>
                Looking to customize the Homepage Hero?
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8, fontFamily: 'Outfit,sans-serif' }}>
                Cinematic headlines, spotlight images, and CTAs have a dedicated editor.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('hero')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 6,
              background: '#C47D0E',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Outfit,sans-serif',
            }}
          >
            Open Hero & Visuals Editor →
          </button>
        </div>
      )}

      {/* Live Header Preview */}
      <Section title="Live Header Brand Preview" description="Real-time preview of how your brand title, badge, subtitle, and logo appear on the header.">
        <div style={{ padding: '18px 24px', background: '#FAF8F5', border: '1px solid #EAE6DD', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <HeaderLogo />
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: B.primaryColor || '#C47D0E', background: 'var(--accent-dim, rgba(196, 125, 14, 0.1))', padding: '4px 10px', borderRadius: 4, fontWeight: 700 }}>
            LIVE PREVIEW
          </div>
        </div>
      </Section>

      {/* ── Brand Accent Color & Theme Palette ── */}
      <Section title="Brand Accent Color & Theme Palette" description="Choose a signature engineering accent color or define a custom hex code applied across buttons, highlights, badges, and emblems site-wide.">
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8,
              background: B.primaryColor || '#C47D0E',
              boxShadow: `0 2px 8px ${B.primaryColor || '#C47D0E'}40`,
              border: '2px solid #FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF',
              flexShrink: 0,
            }}>
              <Zap size={18} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 13, color: '#0F172A' }}>
                Active Accent Color: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: B.primaryColor || '#C47D0E' }}>{B.primaryColor || '#C47D0E'}</span>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11.5, color: '#64748B' }}>
                Applied across the entire site including navigation, buttons, icons, highlights, and the hero section.
              </div>
            </div>
          </div>

          {/* Quick Preset Palette Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {[
              { name: 'Precision Amber', hex: '#C47D0E' },
              { name: 'Electric Cobalt', hex: '#1E6FD9' },
              { name: 'High-Voltage Emerald', hex: '#16A34A' },
              { name: 'Cyber Violet', hex: '#7C3AED' },
              { name: 'Signal Crimson', hex: '#DC2626' },
              { name: 'Tech Cyan', hex: '#0891B2' },
              { name: 'Solar Copper', hex: '#D97706' },
              { name: 'Slate Titanium', hex: '#475569' },
              { name: 'Deep Obsidian', hex: '#0F172A' },
            ].map(p => {
              const active = (B.primaryColor || '#C47D0E').toLowerCase() === p.hex.toLowerCase()
              return (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => updateB({ primaryColor: p.hex })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: active ? `2px solid ${p.hex}` : '1px solid #E2E8F0',
                    background: active ? `${p.hex}15` : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.hex, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? p.hex : '#334155' }}>
                    {p.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Custom Hex & Native Color Picker */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: 22 }}>
              <input
                type="color"
                value={B.primaryColor || '#C47D0E'}
                onChange={e => updateB({ primaryColor: e.target.value })}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  padding: 2,
                  background: '#FFFFFF',
                }}
                title="Click to pick custom color"
              />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <Input
                label="Custom Hex Color Code"
                value={B.primaryColor || '#C47D0E'}
                onChange={v => updateB({ primaryColor: v.startsWith('#') ? v : `#${v}` })}
                placeholder="#C47D0E"
              />
            </div>
            {(B.primaryColor && B.primaryColor !== '#C47D0E') && (
              <button
                type="button"
                onClick={() => updateB({ primaryColor: '#C47D0E' })}
                style={{
                  padding: '9px 14px', borderRadius: 6,
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  color: '#64748B', fontSize: 11.5, fontFamily: 'Outfit,sans-serif',
                  fontWeight: 500, cursor: 'pointer', marginTop: 22,
                }}
              >
                ↺ Reset Amber
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* ── Brand Typography & Font Selection ── */}
      <Section title="Brand Typography & Google Fonts" description="Select the primary display font for headlines & header titles, and the body reading font.">
        <Grid2>
          {/* Display Font */}
          <div>
            <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: 6 }}>
              Display / Headline Font
            </label>
            <select
              value={B.displayFont || 'Plus Jakarta Sans'}
              onChange={e => updateB({ displayFont: e.target.value })}
              style={{
                width: '100%', padding: '9px 12px', background: '#FFFFFF',
                border: '1px solid #E2E8F0', borderRadius: 6,
                color: '#0F172A', fontFamily: 'Outfit,sans-serif', fontSize: 13,
                outline: 'none', marginBottom: 6,
              }}
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Editorial & Geometric Luxury — Default)</option>
              <option value="Outfit">Outfit (Modern Clean Geometric)</option>
              <option value="Space Grotesk">Space Grotesk (Futuristic Precision)</option>
              <option value="Inter">Inter (Minimalist Swiss Tech)</option>
              <option value="Syne">Syne (Bold Display)</option>
            </select>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B' }}>
              Used for giant hero headlines, section banners, and brand headers.
            </div>
          </div>

          {/* Body Font */}
          <div>
            <label style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: 6 }}>
              Body &amp; Reading Font
            </label>
            <select
              value={B.bodyFont || 'Outfit'}
              onChange={e => updateB({ bodyFont: e.target.value })}
              style={{
                width: '100%', padding: '9px 12px', background: '#FFFFFF',
                border: '1px solid #E2E8F0', borderRadius: 6,
                color: '#0F172A', fontFamily: 'Outfit,sans-serif', fontSize: 13,
                outline: 'none', marginBottom: 6,
              }}
            >
              <option value="Outfit">Outfit (Clean & High Readability — Default)</option>
              <option value="Inter">Inter (Standard Modern Tech UI)</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Refined Editorial)</option>
              <option value="Hind Siliguri">Hind Siliguri (Bengali & English Bilingual)</option>
              <option value="Roboto">Roboto (Universal Neutral)</option>
              <option value="Space Grotesk">Space Grotesk (Tech Monospace Feel)</option>
            </select>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 11, color: '#64748B' }}>
              Used for article paragraphs, project specifications, and body text.
            </div>
          </div>
        </Grid2>

        {/* Live Font & Color Preview Box */}
        <div style={{
          marginTop: 16,
          padding: '16px 20px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
              Live Typography &amp; Color Preview
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: B.primaryColor || '#C47D0E', fontWeight: 700 }}>
              {B.displayFont || 'Plus Jakarta Sans'} + {B.bodyFont || 'Outfit'}
            </span>
          </div>

          <div style={{
            fontFamily: `var(--font-display, '${B.displayFont || "Plus Jakarta Sans"}', sans-serif)`,
            fontSize: 24,
            fontWeight: 800,
            color: '#0D1218',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: 1.1,
            marginBottom: 6,
          }}>
            Substation <span style={{ color: B.primaryColor || '#C47D0E' }}>Engineering</span> &amp; Power Systems
          </div>

          <p style={{
            fontFamily: `var(--font-body, '${B.bodyFont || "Outfit"}', sans-serif)`,
            fontSize: 13,
            color: '#475569',
            lineHeight: 1.6,
            margin: 0,
          }}>
            Design and verification of 11kV/0.415kV electrical substations according to BNBC 2020 standards, IEEE guidelines, and local statutory Electricity Licensing Board regulations.
          </p>
        </div>
      </Section>

      {/* 1. Header Typography & Element Visibility (Changeable & Hideable) */}
      <Section title="Header Brand Typography & Visibility Controls" description="Change text or hide/show individual header elements (Brand Title, Credential Badge, Subtitle, and Logo Emblem).">
        {/* Brand Title (e.g. SAHIN ALOM) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <Input
              label="Brand Title Text"
              value={B.brandTitle ?? (E.initials || 'SAHIN ALOM')}
              onChange={v => updateB({ brandTitle: v })}
              placeholder="e.g. SAHIN ALOM or MD SAHIN ALOM"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
            <Switch
              checked={B.showBrandTitle !== false}
              onChange={v => updateB({ showBrandTitle: v })}
            />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 500, color: B.showBrandTitle !== false ? '#16A34A' : '#64748B' }}>
              {B.showBrandTitle !== false ? 'Visible' : 'Hidden'}
            </span>
          </div>
        </div>

        {/* Credential Badge (e.g. PE / ABC Licensed) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <Input
              label="Credential Badge Text"
              value={B.credentialBadge ?? (E.credentialsTag || 'PE')}
              onChange={v => updateB({ credentialBadge: v })}
              placeholder="e.g. PE, ABC Licensed, Engr."
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
            <Switch
              checked={B.showCredentialBadge !== false}
              onChange={v => updateB({ showCredentialBadge: v })}
            />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 500, color: B.showCredentialBadge !== false ? '#16A34A' : '#64748B' }}>
              {B.showCredentialBadge !== false ? 'Visible' : 'Hidden'}
            </span>
          </div>
        </div>

        {/* Header Subtitle (e.g. ELECTRICAL ENGINEER • ABC LICENSED) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <Input
              label="Header Subtitle Text"
              value={B.brandSubtitle ?? (E.title ? `${E.title.toUpperCase()} • ABC LICENSED` : 'ELECTRICAL ENGINEER • ABC LICENSED')}
              onChange={v => updateB({ brandSubtitle: v })}
              placeholder="e.g. ELECTRICAL ENGINEER • ABC LICENSED"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
            <Switch
              checked={B.showBrandSubtitle !== false}
              onChange={v => updateB({ showBrandSubtitle: v })}
            />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 500, color: B.showBrandSubtitle !== false ? '#16A34A' : '#64748B' }}>
              {B.showBrandSubtitle !== false ? 'Visible' : 'Hidden'}
            </span>
          </div>
        </div>

        {/* Logo Emblem / Icon Visibility */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 0' }}>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 13, color: '#0F172A' }}>
              Show Logo Emblem / Icon
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11.5, color: '#64748B' }}>
              Controls visibility of the vector CAD lightning emblem or custom logo image in the header.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Switch
              checked={B.showLogoEmblem !== false}
              onChange={v => updateB({ showLogoEmblem: v })}
            />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 500, color: B.showLogoEmblem !== false ? '#16A34A' : '#64748B' }}>
              {B.showLogoEmblem !== false ? 'Visible' : 'Hidden'}
            </span>
          </div>
        </div>
      </Section>

      {/* 2. Custom Logo Upload / Vector Emblem Switcher */}
      <Section title="Header Logo Image / Vector Emblem" description="Upload a custom logo image (PNG/SVG/JPEG) or use the precision CAD vector emblem.">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*,.svg"
            style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handleLogoUpload(f)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={compressingLogo}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 6,
              background: '#C47D0E', color: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12,
              cursor: compressingLogo ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
          >
            {compressingLogo ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />}
            Upload Custom Logo Image
          </button>

          {B.logo && (
            <button
              type="button"
              onClick={() => updateB({ logo: '', logoType: 'default_emblem' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '8px 14px', borderRadius: 6,
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                color: '#475569', fontSize: 12, fontFamily: 'Outfit,sans-serif',
                fontWeight: 500, cursor: 'pointer',
              }}
            >
              ↺ Reset to Vector CAD Emblem
            </button>
          )}
        </div>

        {logoStatus && (
          <div style={{ fontSize: 11, color: logoStatus.includes('Error') ? '#EF4444' : '#16A34A', fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Check size={12} /> {logoStatus}
          </div>
        )}

        <Input
          label="Or Custom Logo URL / SVG Data"
          value={B.logo || ''}
          onChange={v => updateB({ logo: v, logoType: v ? 'custom_image' : 'default_emblem' })}
          placeholder="https://... or data:image/..."
        />
      </Section>

      {/* 3. Browser Tab Favicon */}
      <Section title="Browser Tab Favicon" description="Upload a favicon icon (.png, .ico, .svg) to display in the browser tab and bookmarks.">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          {/* Favicon Browser Tab Mockup */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', background: '#E2E8F0', borderRadius: '8px 8px 0 0',
            border: '1px solid #CBD5E1', borderBottom: 'none', minWidth: 200,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 3, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {B.favicon ? (
                <img src={B.favicon} alt="Favicon" style={{ width: 16, height: 16, objectFit: 'contain' }} />
              ) : (
                <Zap size={14} style={{ color: '#C47D0E' }} />
              )}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#334155', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {settings.siteTitle || 'Md Sahin Alom'}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <input
                ref={favInputRef}
                type="file"
                accept="image/*,.ico,.svg"
                style={{ display: 'none' }}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handleFaviconUpload(f)
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => favInputRef.current?.click()}
                disabled={compressingFavicon}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 6,
                  background: '#C47D0E', color: '#FFFFFF',
                  fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12,
                  cursor: compressingFavicon ? 'not-allowed' : 'pointer',
                  border: 'none',
                }}
              >
                {compressingFavicon ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />}
                Upload Favicon Image (.png / .ico)
              </button>

              {B.favicon && (
                <button
                  type="button"
                  onClick={() => updateB({ favicon: '' })}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '7px 12px', borderRadius: 6,
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    color: '#475569', fontSize: 12, fontFamily: 'Outfit,sans-serif',
                    fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  ↺ Reset Default Favicon
                </button>
              )}
            </div>

            {favStatus && (
              <div style={{ fontSize: 11, color: favStatus.includes('Error') ? '#EF4444' : '#16A34A', fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={12} /> {favStatus}
              </div>
            )}

            <Input
              label="Or Favicon URL / Base64 Data"
              value={B.favicon || ''}
              onChange={v => updateB({ favicon: v })}
              placeholder="data:image/svg+xml,... or https://..."
            />
          </div>
        </div>
      </Section>

      {/* 4. Social Share Cover (OpenGraph Image) */}
      <Section title="Social Share Cover (OpenGraph Image)" description="Image shown when your website is shared on LinkedIn, WhatsApp, Facebook, or Twitter.">
        <ImagePicker
          value={B.ogImage || ''}
          onChange={url => updateB({ ogImage: url })}
        />
      </Section>

      {/* 5. Curriculum Vitae (PDF Resume) */}
      <Section title="Curriculum Vitae (PDF Document)" description="File path or URL for the downloadable CV button in the header and hero.">
        <Input
          label="CV Document URL or Local Path"
          value={B.resumeUrl || '/CV.pdf'}
          onChange={v => updateB({ resumeUrl: v })}
          placeholder="/CV.pdf or https://..."
        />
      </Section>
    </div>
  )
}
