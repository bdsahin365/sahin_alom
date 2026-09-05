import { useState } from 'react'
import { Link } from 'react-router'
import {
  Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2,
  Clock, ShieldCheck, ArrowRight, Copy, Check, Calendar,
  Zap, AlertCircle, FileCheck, Layers, Award
} from 'lucide-react'
import EngineerNav from '../components/EngineerNav'
import SEOHead from '../components/SEOHead'
import HeaderLogo from '../components/HeaderLogo'
import { useSite } from '../context/SiteContext'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const { data: { engineer: E } } = useSite()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Substation & Transformer Design',
    voltageLevel: '11kV / 0.415kV',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Please complete all required fields.')
      return
    }

    setSending(true)
    setErrorMsg(null)

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: `[Consultation: ${form.serviceType}] - ${form.voltageLevel || 'Standard'}`,
        message: `Phone / Contact: ${form.phone || 'Not provided'}\nService Requested: ${form.serviceType}\nVoltage / Capacity: ${form.voltageLevel}\n\nProject Scope & Message:\n${form.message}`,
      })

      if (error) throw error

      setSent(true)
      setForm({
        name: '',
        email: '',
        phone: '',
        serviceType: 'Substation & Transformer Design',
        voltageLevel: '11kV / 0.415kV',
        message: '',
      })
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setErrorMsg('Unable to submit inquiry right now. Please call or email directly.')
    } finally {
      setSending(false)
    }
  }

  const rawWhatsapp = E.whatsapp || E.phone || '01760816120'
  const cleanPhone = rawWhatsapp.replace(/\D/g, '').replace(/^880/, '').replace(/^0/, '')
  const whatsappUrl = `https://wa.me/880${cleanPhone}?text=Hello%20Engr.%20Sahin,%20I%20would%20like%20to%20request%20an%20engineering%20consultation.`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', display: 'flex', flexDirection: 'column' }}>
      <SEOHead
        title="Schedule Consultation & Direct Engineering Review"
        description="Book a technical engineering review, substation design consultation, or BNBC 2020 compliance audit with Class ABC Licensed Electrical Engineer Md Sahin Alom."
        keywords={['Electrical Engineering Consultation', 'Substation Review', 'BNBC Compliance', 'SLD Design Audit', 'Dhaka Electrical Engineer']}
      />

      <EngineerNav />

      <main style={{ flex: 1, padding: 'calc(var(--nav-h) + clamp(24px, 4vh, 48px)) var(--px) clamp(48px, 8vh, 80px)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--fg-dim)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Direct Consultation</span>
          </div>

          {/* Header Title Banner */}
          <div style={{ paddingBottom: 'clamp(24px, 4vh, 36px)', marginBottom: 'clamp(28px, 5vh, 48px)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: 'rgba(196,125,14,0.1)', border: '1px solid rgba(196,125,14,0.3)', borderRadius: 20, marginBottom: 12 }}>
              <Zap size={11} style={{ color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
                Direct Engineering Inquiries
              </span>
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(32px, 5.5vw, 68px)', lineHeight: 1.05, color: 'var(--fg)', margin: '0 0 14px' }}>
              Schedule Technical Review &amp; Consultation
            </h1>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'var(--fg-dim)', maxWidth: 720, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
              Direct consultation channel for industrial power systems, 11kV/0.415kV substation design, BNBC 2020 statutory compliance audits, and single-line diagram (SLD) engineering reviews.
            </p>
          </div>

          {/* Main 2-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'start'
          }}>

            {/* Left Column: Direct Contact & Scope Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Direct Channels Card */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 'clamp(20px, 3vw, 28px)' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>
                  Direct Contact Channels
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(196,125,14,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                        <Phone size={16} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Direct Phone</div>
                        <a href={`tel:${E.phone}`} style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--fg)', textDecoration: 'none' }}>
                          {E.phone}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(E.phone, 'phone')}
                      title="Copy phone"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-dim)', padding: 6, display: 'flex', alignItems: 'center' }}
                    >
                      {copiedKey === 'phone' ? <Check size={14} style={{ color: 'var(--green)' }} /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', background: 'rgba(34,197,94,0.08)',
                      border: '1px solid rgba(34,197,94,0.3)', borderRadius: 4,
                      textDecoration: 'none', transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#16A34A', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>WhatsApp Chat</div>
                        <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>
                          Message directly on WhatsApp
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={15} style={{ color: '#16A34A' }} />
                  </a>

                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(196,125,14,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                        <Mail size={16} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Official Email</div>
                        <a href={`mailto:${E.email}`} style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13.5, fontWeight: 600, color: 'var(--fg)', textDecoration: 'none' }}>
                          {E.email}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(E.email, 'email')}
                      title="Copy email"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-dim)', padding: 6, display: 'flex', alignItems: 'center' }}
                    >
                      {copiedKey === 'email' ? <Check size={14} style={{ color: 'var(--green)' }} /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(196,125,14,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Practice Location</div>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>
                        {E.location} · Bangladesh
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Areas & Turnaround */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 'clamp(20px, 3vw, 28px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.16em', color: 'var(--fg)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Consultation &amp; Review Scope
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                  {[
                    '11kV / 0.415kV Substation & Transformer Sizing',
                    'BNBC 2020 & Fire Safety Electrical Audits',
                    'Single-Line Diagram (SLD) & Load Schedule Review',
                    'Power Factor Improvement (PFI) & Harmonic Sizing',
                    'Generator, ATS & Auto-Synchronizing Scheme',
                    'Rooftop Solar PV & Net Metering Integration',
                  ].map((scope, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, fontFamily: 'Outfit,sans-serif', color: 'var(--fg-dim)' }}>
                      <span style={{ color: 'var(--accent)', marginTop: 2 }}>◆</span>
                      <span>{scope}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={13} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.06em' }}>
                    SLA: Formal review response within 24–48 hours
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Consultation Request Form */}
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 'clamp(24px, 4vw, 36px)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Calendar size={18} style={{ color: 'var(--accent)' }} />
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--fg)' }}>
                  Request Consultation
                </h2>
              </div>
              <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--fg-dim)', margin: '0 0 24px', lineHeight: 1.6 }}>
                Fill out the engineering scope details below. All submitted documentation and project details are treated with strict professional confidentiality.
              </p>

              {sent ? (
                <div style={{
                  padding: '36px 24px',
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: 6,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <CheckCircle2 size={44} style={{ color: 'var(--green)' }} />
                  <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
                    Consultation Request Transmitted!
                  </h3>
                  <p style={{ fontFamily: 'Outfit,sans-serif', fontSize: 13.5, color: 'var(--fg-dim)', maxWidth: 440, lineHeight: 1.6, margin: 0 }}>
                    Thank you. Engr. Md Sahin Alom has received your technical project request and will respond via email/phone within 24 to 48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    style={{
                      marginTop: 12,
                      padding: '8px 18px',
                      background: 'var(--accent)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 4,
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {errorMsg && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 14px', background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.25)', borderRadius: 4,
                      fontFamily: 'Outfit,sans-serif', fontSize: 12.5, color: '#EF4444'
                    }}>
                      <AlertCircle size={14} style={{ flexShrink: 0 }} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name & Phone */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Engr. Rafiqul Islam / Company Name"
                        style={{
                          width: '100%', padding: '10px 12px', background: 'var(--bg)',
                          border: '1px solid var(--border)', borderRadius: 4,
                          color: 'var(--fg)', fontFamily: 'Outfit,sans-serif', fontSize: 13.5,
                          outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+880 17... / Contact number"
                        style={{
                          width: '100%', padding: '10px 12px', background: 'var(--bg)',
                          border: '1px solid var(--border)', borderRadius: 4,
                          color: 'var(--fg)', fontFamily: 'Outfit,sans-serif', fontSize: 13.5,
                          outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="name@company.com"
                      style={{
                        width: '100%', padding: '10px 12px', background: 'var(--bg)',
                        border: '1px solid var(--border)', borderRadius: 4,
                        color: 'var(--fg)', fontFamily: 'Outfit,sans-serif', fontSize: 13.5,
                        outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Service Type & Voltage */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                        Consultation Subject / Type
                      </label>
                      <select
                        value={form.serviceType}
                        onChange={e => setForm(p => ({ ...p, serviceType: e.target.value }))}
                        style={{
                          width: '100%', padding: '10px 12px', background: 'var(--bg)',
                          border: '1px solid var(--border)', borderRadius: 4,
                          color: 'var(--fg)', fontFamily: 'Outfit,sans-serif', fontSize: 13,
                          outline: 'none', boxSizing: 'border-box'
                        }}
                      >
                        <option value="Substation & Transformer Design">Substation &amp; Transformer Design</option>
                        <option value="BNBC 2020 Compliance Audit">BNBC 2020 Compliance Audit</option>
                        <option value="SLD & Load Schedule Review">SLD &amp; Load Schedule Review</option>
                        <option value="Industrial Power Distribution">Industrial Power Distribution</option>
                        <option value="PFI / Harmonic Mitigation">PFI / Harmonic Mitigation</option>
                        <option value="Solar PV & Net Metering">Solar PV &amp; Net Metering</option>
                        <option value="Generator & ATS Synchronizing">Generator &amp; ATS Synchronizing</option>
                        <option value="General Engineering Inquiry">General Engineering Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                        Capacity / Voltage Rating
                      </label>
                      <input
                        type="text"
                        value={form.voltageLevel}
                        onChange={e => setForm(p => ({ ...p, voltageLevel: e.target.value }))}
                        placeholder="e.g. 500 kVA, 11kV, 415V"
                        style={{
                          width: '100%', padding: '10px 12px', background: 'var(--bg)',
                          border: '1px solid var(--border)', borderRadius: 4,
                          color: 'var(--fg)', fontFamily: 'Outfit,sans-serif', fontSize: 13.5,
                          outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Message / Scope */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--fg-dim)', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                      Project Scope &amp; Requirements *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Describe your plant/building power requirements, single line diagram verification needs, or electrical audit timeline..."
                      style={{
                        width: '100%', padding: '12px', background: 'var(--bg)',
                        border: '1px solid var(--border)', borderRadius: 4,
                        color: 'var(--fg)', fontFamily: 'Outfit,sans-serif', fontSize: 13.5,
                        outline: 'none', resize: 'vertical', boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      marginTop: 6,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '13px 24px',
                      background: 'var(--accent)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 4,
                      fontFamily: 'Outfit,sans-serif',
                      fontSize: 13.5,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: sending ? 'not-allowed' : 'pointer',
                      opacity: sending ? 0.7 : 1,
                      transition: 'background 0.2s ease, transform 0.15s ease',
                      boxShadow: '0 2px 8px rgba(196,125,14,0.3)',
                    }}
                  >
                    {sending ? (
                      <>Transmitting Inquiry...</>
                    ) : (
                      <>
                        <Send size={15} /> Submit Consultation Request
                      </>
                    )}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, justifyContent: 'center' }}>
                    <ShieldCheck size={13} style={{ color: 'var(--muted)' }} />
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: 'var(--muted)', letterSpacing: '0.04em' }}>
                      Certified Class ABC Registered Professional · Direct Response
                    </span>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* Bottom Quick Reference Strip */}
          <div style={{
            marginTop: 'clamp(40px, 7vh, 72px)',
            paddingTop: 'clamp(24px, 4vh, 36px)',
            borderTop: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ padding: 8, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--accent)' }}>
                <FileCheck size={16} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 13.5, color: 'var(--fg)', marginBottom: 2 }}>
                  Verified Calculations
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.5 }}>
                  Substation design and cable sizing calculated as per BNBC 2020 &amp; IEEE standards.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ padding: 8, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--accent)' }}>
                <Layers size={16} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 13.5, color: 'var(--fg)', marginBottom: 2 }}>
                  Complete SLD Package
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.5 }}>
                  AutoCAD electrical drawings, equipment schedules, and protection relay coordination.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ padding: 8, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--accent)' }}>
                <Award size={16} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: 13.5, color: 'var(--fg)', marginBottom: 2 }}>
                  Statutory ELB License
                </div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.5 }}>
                  Statutory authorization for low, medium, and high voltage electrical installations.
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px var(--px)', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <HeaderLogo compact={true} showSubtitle={false} />
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: 'var(--muted)', letterSpacing: '0.08em' }}>
            &copy; {new Date().getFullYear()} {E.name} · Power Systems &amp; Substation Engineering
          </div>
          <Link to="/" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Return to Portfolio ↑
          </Link>
        </div>
      </footer>
    </div>
  )
}
