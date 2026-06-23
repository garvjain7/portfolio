'use client'
import { useState, useCallback, useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { PortalAnimation } from './PortalAnimation'

type FlowStage = 'welcome' | 'portal' | 'workspace'

/**
 * Sequence:
 * 1. welcome   — title + "Enter Garv's World" CTA + Skip + Sound toggle
 * 2. portal    — circular gateway, door-split reveal (NEVER skippable once started)
 * 3. workspace — fullscreen ai-intro.mp4 video hero
 *
 * Skip (from welcome only) jumps straight to "workspace" stage, landing the
 * user at the About section.
 */
export function Workspace({
  children, // the actual 3D workspace hero, rendered once stage === 'workspace'
}: {
  children: React.ReactNode
}) {
  const { soundEnabled, toggleSound, welcomeDismissed, dismissWelcome } = useUIStore()
  const [stage, setStage] = useState<FlowStage>(() => welcomeDismissed ? 'workspace' : 'welcome')
  const [skippedToContent, setSkippedToContent] = useState(false)

  // Disable body scroll during the introduction stages
  useEffect(() => {
    if (stage !== 'workspace' && !skippedToContent) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [stage, skippedToContent])

  const handleSkip = useCallback(() => {
    dismissWelcome()
    setSkippedToContent(true)
    setStage('workspace')
    // Smooth scroll straight to About after unmounting settles
    setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [dismissWelcome])

  const handleEnter = useCallback(() => {
    setStage('portal')
  }, [])

  const handlePortalComplete = useCallback(() => {
    dismissWelcome()
    setStage('workspace')
  }, [dismissWelcome])

  return (
    <>
      {stage === 'welcome' && (
        <WelcomeStage
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onEnter={handleEnter}
          onSkip={handleSkip}
        />
      )}

      {stage === 'portal' && <PortalAnimation onComplete={handlePortalComplete} />}

      {/* Workspace hero — preloaded when stage !== 'welcome' and transitioned smoothly */}
      {stage !== 'welcome' && (
        <div
          style={{
            opacity: (stage === 'workspace' || skippedToContent) ? 1 : 0,
            transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: (stage === 'workspace' || skippedToContent) ? 'all' : 'none',
            width: '100%',
            height: (stage === 'workspace' || skippedToContent) ? 'auto' : '100vh',
            position: (stage === 'workspace' || skippedToContent) ? 'relative' : 'fixed',
            top: 0,
            left: 0,
            zIndex: (stage === 'workspace' || skippedToContent) ? 'auto' : 1,
          }}
        >
          {children}
        </div>
      )}
    </>
  )
}

function WelcomeStage({
  soundEnabled,
  onToggleSound,
  onEnter,
  onSkip,
}: {
  soundEnabled: boolean
  onToggleSound: () => void
  onEnter: () => void
  onSkip: () => void
}) {
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
      }}
    >
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

      <div
        style={{
          textAlign: 'center',
          animation: 'flow-fade-in 1.1s ease forwards',
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
            marginBottom: '3rem',
          }}
        >
          Welcome to{' '}
          <span style={{ color: 'var(--accent)' }}>Garv Jain&apos;s</span>
          <br />
          World
        </h1>

        <button
          onClick={onEnter}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: 'var(--radius)',
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-border)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(0,212,255,0.18)'
            el.style.boxShadow = '0 0 24px var(--accent-glow)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'var(--accent-dim)'
            el.style.boxShadow = 'none'
          }}
        >
          Enter Garv&apos;s World →
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          animation: 'flow-fade-in 1.4s ease forwards',
          opacity: 0,
        }}
      >
        <button
          onClick={onToggleSound}
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
          onClick={onSkip}
          title="Skip to About section"
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
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
          }}
        >
          Skip →
        </button>
      </div>

      <style>{`
        @keyframes flow-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}