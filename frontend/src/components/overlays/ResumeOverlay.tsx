'use client'
import { useUIStore } from '@/stores/uiStore'
import { useEffect } from 'react'

export function ResumeOverlay() {
  const { resumeOpen, closeResume, openAssistant } = useUIStore()

  // Don't lock scroll — page stays scrollable
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeResume()
    }
    if (resumeOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [resumeOpen, closeResume])

  if (!resumeOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'min(48%, 680px)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(9, 9, 15, 0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--border)',
        animation: 'slide-in-right 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--accent)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.2rem',
            }}
          >
            Document
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Garv Jain — Resume
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href="/resume.pdf"
            download
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius)',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              textDecoration: 'none',
              transition: 'all var(--transition)',
            }}
          >
            ↓ Download
          </a>
          <button
            onClick={closeResume}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '1rem' }}>
        <iframe
          src="/resume.pdf"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-surface)',
          }}
          title="Garv Jain Resume"
        />
      </div>

      {/* AI nudge */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
          }}
        >
          Prefer a conversation over a PDF?
        </p>
        <button
          onClick={() => {
            closeResume()
            openAssistant('Tell me about Garv\'s background and experience.')
          }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--accent)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity var(--transition)',
          }}
        >
          Ask the AI →
        </button>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}