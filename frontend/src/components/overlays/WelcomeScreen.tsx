'use client'
import { useEffect, useState, useCallback } from 'react'
import { useUIStore } from '@/stores/uiStore'

export function WelcomeScreen() {
  const { welcomeDismissed, dismissWelcome, soundEnabled, toggleSound } = useUIStore()
  // If already dismissed (e.g. revisit), don't show at all — no setState in effect
  const [visible, setVisible] = useState(!welcomeDismissed)
  const [fadeOut, setFadeOut] = useState(false)

  const handleDismiss = useCallback(() => {
    setFadeOut(true)
    setTimeout(() => {
      setVisible(false)
      dismissWelcome()
    }, 600)
  }, [dismissWelcome])

  useEffect(() => {
    if (welcomeDismissed) return
    const timer = setTimeout(() => handleDismiss(), 4000)
    return () => clearTimeout(timer)
  }, [welcomeDismissed, handleDismiss])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.6s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          animation: 'welcome-fade-in 1.2s ease forwards',
          opacity: 0,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--accent)',
            letterSpacing: '0.2em',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}
        >
          Engineering Workspace
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}
        >
          Welcome to{' '}
          <span style={{ color: 'var(--accent)' }}>Garv Jain&apos;s</span>
          <br />
          World
        </h1>
      </div>

      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          animation: 'welcome-fade-in 1.5s ease forwards',
          opacity: 0,
        }}
      >
        <button
          onClick={toggleSound}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
        <button
          onClick={handleDismiss}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius)',
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-border)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >
          Skip →
        </button>
      </div>

      <style>{`
        @keyframes welcome-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}