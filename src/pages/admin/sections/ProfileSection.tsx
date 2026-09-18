import { useState, useRef } from 'react'
import { Loader2, Upload, Check, Trash2 } from 'lucide-react'
import { useSite } from '../../../context/SiteContext'
import sahinPhoto from '../../../img/sahin.png'
import { compressAndConvertToBase64, formatBytes } from '../../../lib/imageUtils'
import {
  Section,
  Grid2,
  Input,
  Textarea,
  Switch,
  TagChips,
  AddButton,
} from '../components/AdminPrimitives'

export default function ProfileSection() {
  const { data: { engineer: E }, updateEngineer } = useSite()
  const [compressing, setCompressing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const u = (k: keyof typeof E) => (v: string | boolean) => updateEngineer({ [k]: v } as any)
  const updateBio = (i: number, v: string) => {
    const b = [...E.bio]
    b[i] = v
    updateEngineer({ bio: b })
  }

  const handlePhotoUpload = async (file: File) => {
    try {
      setCompressing(true)
      setUploadStatus('Compressing & saving…')
      const { base64, originalSize, compressedSize } = await compressAndConvertToBase64(file, {
        maxWidth: 700,
        maxHeight: 700,
        quality: 0.85,
        mimeType: 'image/jpeg',
      })
      updateEngineer({ photo: base64 })
      setUploadStatus(`Saved to database (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`)
      setTimeout(() => setUploadStatus(null), 4000)
    } catch (err: any) {
      setUploadStatus('Failed: ' + (err?.message || 'Error processing photo'))
    } finally {
      setCompressing(false)
    }
  }

  return (
    <div>
      <Section title="Profile Photo" description="Upload your photo directly from your device to save to database as Base64 (used in About, CV, Biodata, & Hero)">
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{ width: 90, height: 110, borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F8FAFC', flexShrink: 0, position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {E.photo ? (
              <img src={E.photo} alt={E.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 11 }}>No photo</div>
            )}
            {compressing && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={20} style={{ color: '#C47D0E', animation: 'spin 1s linear infinite' }} />
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handlePhotoUpload(f)
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={compressing}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 6,
                  background: '#C47D0E', color: '#FFFFFF',
                  fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 12,
                  cursor: compressing ? 'not-allowed' : 'pointer',
                  border: 'none', transition: 'all 0.15s',
                  boxShadow: '0 1px 2px rgba(196,125,14,0.2)',
                }}
              >
                {compressing ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />}
                {compressing ? 'Processing…' : 'Upload Photo from Device'}
              </button>

              <button
                type="button"
                onClick={() => updateEngineer({ photo: sahinPhoto })}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '7px 12px', borderRadius: 6,
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  color: '#475569', fontSize: 12, fontFamily: 'Outfit,sans-serif',
                  fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                ↺ Reset to default (sahin.png)
              </button>
            </div>

            {uploadStatus && (
              <div style={{ fontSize: 11, fontFamily: 'Outfit,sans-serif', color: uploadStatus.includes('Failed') ? '#EF4444' : '#16A34A', fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={12} /> {uploadStatus}
              </div>
            )}

            <div style={{ marginTop: 6 }}>
              <Input label="Or Photo URL / Base64" value={E.photo || ''} onChange={u('photo') as (v: string) => void} placeholder="data:image/... or https://..." />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Personal Information" description="Name, contact, and role details">
        <Grid2>
          <Input label="Full Name"           value={E.name}                       onChange={u('name') as (v: string) => void} />
          <Input label="Initials (Brand)"    value={E.initials}                   onChange={u('initials') as (v: string) => void} />
          <Input label="Credential Badge"   value={E.credentialsTag || 'PE'}     onChange={u('credentialsTag') as (v: string) => void} placeholder="PE / ABC Licensed" />
          <Input label="Job Title"           value={E.title}                      onChange={u('title') as (v: string) => void} />
          <Input label="Subtitle"            value={E.subtitle}                   onChange={u('subtitle') as (v: string) => void} />
          <Input label="Location"            value={E.location}                   onChange={u('location') as (v: string) => void} />
          <Input label="Email"               value={E.email}                      onChange={u('email') as (v: string) => void}    type="email" />
          <Input label="Phone Number"        value={E.phone}                      onChange={u('phone') as (v: string) => void}    type="tel" />
          <Input label="WhatsApp Number"     value={E.whatsapp || ''}             onChange={u('whatsapp') as (v: string) => void} placeholder="01760816120" />
          <Input label="LinkedIn URL"        value={E.linkedin}                   onChange={u('linkedin') as (v: string) => void} />
        </Grid2>
        <Textarea label="Tagline" hint="one sentence, shown in hero" value={E.tagline} onChange={u('tagline') as (v: string) => void} rows={2} />
      </Section>

      <Section title="Key Statistics" description="Numbers shown in the hero section">
        <Grid2>
          <Input label="Years Experience"   value={E.yearsExp}       onChange={u('yearsExp') as (v: string) => void}       placeholder="8+" />
          <Input label="Capacity Delivered" value={E.projectsMW}     onChange={u('projectsMW') as (v: string) => void}     placeholder="15+ MVA" />
          <Input label="Projects Completed" value={E.projectsCount}  onChange={u('projectsCount') as (v: string) => void}  placeholder="40+" />
          <Input label="Clients Served"     value={E.clients}        onChange={u('clients') as (v: string) => void}        placeholder="20+" />
        </Grid2>
      </Section>

      <Section title="Biography" description={`${E.bio.length} paragraph${E.bio.length !== 1 ? 's' : ''}`}>
        {E.bio.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Textarea label={`Paragraph ${i + 1}`} value={p} onChange={v => updateBio(i, v)} rows={3} />
            </div>
            <button
              type="button"
              onClick={() => updateEngineer({ bio: E.bio.filter((_, j) => j !== i) })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', marginTop: 22, padding: 6, transition: 'color 0.15s', borderRadius: 4 }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#EF4444')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#CBD5E1')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <AddButton label="Add paragraph" onClick={() => updateEngineer({ bio: [...E.bio, ''] })} />
      </Section>

      <Section title="Biodata & Personal Particulars" description="Personal details displayed in the Official Biodata (/biodata)">
        <Grid2>
          <Input label="Father's Name"      value={E.fatherName || ''}       onChange={u('fatherName') as (v: string) => void}       placeholder="Father's full name" />
          <Input label="Mother's Name"      value={E.motherName || ''}       onChange={u('motherName') as (v: string) => void}       placeholder="Mother's full name" />
          <Input label="Date of Birth"      value={E.dob || ''}              onChange={u('dob') as (v: string) => void}              placeholder="YYYY-MM-DD or DD Month YYYY" />
          <Input label="Blood Group"        value={E.bloodGroup || ''}       onChange={u('bloodGroup') as (v: string) => void}       placeholder="B+, A+, O+, etc." />
          <Input label="Nationality"        value={E.nationality || ''}      onChange={u('nationality') as (v: string) => void}      placeholder="Bangladeshi (By Birth)" />
          <Input label="Religion"           value={E.religion || ''}         onChange={u('religion') as (v: string) => void}         placeholder="Islam, Christianity, Hinduism..." />
          <Input label="Marital Status"     value={E.maritalStatus || ''}    onChange={u('maritalStatus') as (v: string) => void}    placeholder="Single / Married" />
          <Input label="Present Address"    value={E.presentAddress || ''}   onChange={u('presentAddress') as (v: string) => void}   placeholder="Present residential address" />
          <Input label="Permanent Address"  value={E.permanentAddress || ''} onChange={u('permanentAddress') as (v: string) => void} placeholder="Permanent home district / address" />
        </Grid2>
      </Section>

      <Section title="Official Affirmation & Declaration" description="Legal declaration statement displayed in the footer of CV (/cv) and Biodata (/biodata)">
        <Textarea
          label="Declaration Statement"
          value={E.declaration || ''}
          onChange={u('declaration') as (v: string) => void}
          placeholder="Certified electrical engineer. All details and educational qualifications stated herein are accurate..."
          rows={3}
        />
      </Section>

      <Section title="CV Tools & Software Skills" description="Specific technical instruments, software, and tools listed in the CV (/cv)">
        <TagChips
          label="Software, Standards & Tools List"
          tags={E.cvTools || []}
          onChange={t => updateEngineer({ cvTools: t })}
        />
      </Section>

      <Section title="Availability">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={E.available} onChange={v => updateEngineer({ available: v })} />
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 500, fontSize: 13, color: '#1E293B' }}>Available for new projects</div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: '#64748B', marginTop: 2 }}>Shows status in admin and consultation options when enabled</div>
          </div>
        </div>
      </Section>
    </div>
  )
}
