import { useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

export interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'default'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const isDanger = variant === 'danger'

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'adminFadeIn 0.15s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          animation: 'adminModalPop 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ padding: '24px 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: isDanger ? '#FEE2E2' : '#FEF3C7',
                color: isDanger ? '#DC2626' : '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isDanger ? <Trash2 size={20} /> : <AlertTriangle size={20} />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3
                  style={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#0F172A',
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 4,
                    display: 'flex',
                    marginRight: -6,
                    marginTop: -4,
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <p
                style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: 13,
                  color: '#64748B',
                  lineHeight: 1.5,
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '14px 24px',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 13,
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '8px 18px',
              borderRadius: 6,
              background: isDanger ? '#DC2626' : '#C47D0E',
              border: 'none',
              color: '#FFFFFF',
              fontFamily: 'Outfit,sans-serif',
              fontSize: 13,
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isDanger
                ? '0 2px 8px rgba(220, 38, 38, 0.3)'
                : '0 2px 8px rgba(196, 125, 14, 0.3)',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.15s',
            }}
          >
            {isLoading ? 'Processing…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
