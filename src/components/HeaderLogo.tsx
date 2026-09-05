import React from 'react'
import { useSite } from '../context/SiteContext'

type Props = {
  compact?: boolean
  showSubtitle?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export default function HeaderLogo({ compact = false, showSubtitle = true, onClick }: Props) {
  const { data: { engineer: E, settings } } = useSite()
  const customLogo = settings.branding?.logo

  return (
    <a
      href="/"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textDecoration: 'none',
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      {/* 1. Custom Image / SVG Logo if Uploaded via Admin, or Precision Vector Emblem */}
      {customLogo ? (
        <div
          style={{
            width: compact ? 34 : 38,
            height: compact ? 34 : 38,
            borderRadius: 8,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            border: '1px solid rgba(196, 125, 14, 0.4)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            flexShrink: 0,
          }}
        >
          <img
            src={customLogo}
            alt={E.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      ) : (
        <div
          style={{
            position: 'relative',
            width: compact ? 34 : 38,
            height: compact ? 34 : 38,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            border: '1px solid rgba(196, 125, 14, 0.45)',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.18), 0 0 12px rgba(196, 125, 14, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            flexShrink: 0,
          }}
          className="header-logo-icon"
        >
          <svg
            width={compact ? 22 : 24}
            height={compact ? 22 : 24}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#C47D0E" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <linearGradient id="electricCore" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#C47D0E" />
              </linearGradient>
            </defs>

            {/* Background Circuit Grid & Busbar Traces */}
            <path
              d="M3 7H9M19 7H25M7 3V9M21 3V9M3 21H9M19 21H25M7 19V25M21 19V25"
              stroke="#C47D0E"
              strokeWidth="0.85"
              strokeOpacity="0.45"
              strokeLinecap="round"
            />

            {/* Substation CAD Corner Alignment Marks */}
            <path
              d="M4 4L7 4M4 4L4 7M24 4L21 4M24 4L24 7M4 24L7 24M4 24L4 21M24 24L21 24M24 24L24 21"
              stroke="#C47D0E"
              strokeWidth="1.2"
              strokeLinecap="square"
            />

            {/* High Voltage Lightning Bolt Energy Core */}
            <path
              d="M15.5 2.5L7.5 14H14.5L12.5 25.5L20.5 14H13.5L15.5 2.5Z"
              fill="url(#goldGradient)"
              stroke="url(#electricCore)"
              strokeWidth="0.75"
              strokeLinejoin="round"
            />

            {/* Center Spark */}
            <circle cx="14" cy="14" r="1.2" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>
      )}

      {/* 2. Brand Name & Professional Designation Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800,
              fontSize: compact ? 19 : 22,
              letterSpacing: '0.04em',
              color: 'var(--fg, #0D1218)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            {E.initials || 'SAHIN ALOM'}
          </span>

          <span
            style={{
              background: 'linear-gradient(135deg, rgba(196,125,14,0.15) 0%, rgba(196,125,14,0.05) 100%)',
              border: '1px solid rgba(196, 125, 14, 0.35)',
              color: '#C47D0E',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 8,
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: 3,
              letterSpacing: '0.08em',
              lineHeight: 1.2,
            }}
          >
            {E.credentialsTag || 'PE'}
          </span>
        </div>

        {showSubtitle && (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 8.5,
              fontWeight: 600,
              color: 'var(--accent, #C47D0E)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              lineHeight: 1.2,
              marginTop: 2,
            }}
          >
            {E.title ? `${E.title.toUpperCase()} • ABC LICENSED` : 'ELECTRICAL ENGINEER • ABC LICENSED'}
          </span>
        )}
      </div>
    </a>
  )
}
