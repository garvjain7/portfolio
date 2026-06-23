'use client'
import { useState } from 'react'

interface PortalAnimationProps {
  onComplete: () => void
}

export function PortalAnimation({ onComplete }: PortalAnimationProps) {
  const [phase, setPhase] = useState<'idle' | 'breach' | 'opening' | 'done'>('idle')

  function handleEnter() {
    if (phase !== 'idle') return
    setPhase('breach')
    onComplete()

    // Ring glitch + portal core flash
    setTimeout(() => {
      setPhase('opening')
    }, 500)

    // Doors fully open, remove overlay after animation finishes
    setTimeout(() => {
      setPhase('done')
    }, 1900)
  }

  if (phase === 'done') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 150,
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Doors — split open */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '50%',
          background: 'rgba(9,9,15,0.92)',
          backdropFilter: 'blur(6px)',
          borderRight: '1px solid var(--accent-border)',
          boxShadow: 'inset -30px 0 60px rgba(0,0,0,0.85)',
          zIndex: 10,
          transition: 'transform 1.3s cubic-bezier(0.8,0,0.2,1)',
          transform: phase === 'opening' ? 'translateX(-100%)' : 'translateX(0)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '50%',
          background: 'rgba(9,9,15,0.92)',
          backdropFilter: 'blur(6px)',
          borderLeft: '1px solid var(--accent-border)',
          boxShadow: 'inset 30px 0 60px rgba(0,0,0,0.85)',
          zIndex: 10,
          transition: 'transform 1.3s cubic-bezier(0.8,0,0.2,1)',
          transform: phase === 'opening' ? 'translateX(100%)' : 'translateX(0)',
        }}
      />

      {/* Portal core */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: phase === 'opening' ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: phase === 'idle' ? 'all' : 'none',
        }}
      >
        {/* Outer ring 1 */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: phase === 'idle' ? 'portal-spin 14s linear infinite' : 'none',
          }}
        >
          <circle
            cx="50" cy="50" r="45"
            fill="none" stroke="var(--accent)" strokeWidth="0.6"
            strokeDasharray="3 6" opacity="0.5"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none" stroke="var(--accent)" strokeWidth="1.2"
            strokeDasharray="16 30 8 40" opacity="0.3"
          />
        </svg>

        {/* Outer ring 2, reverse */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            width: '340px',
            height: '340px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: phase === 'idle' ? 'portal-spin-reverse 18s linear infinite' : 'none',
          }}
        >
          <circle
            cx="50" cy="50" r="48"
            fill="none" stroke="var(--accent)" strokeWidth="0.4"
            strokeDasharray="2 4" opacity="0.25"
          />
          <path
            d="M 50 2 A 48 48 0 0 1 98 50"
            fill="none" stroke="var(--accent)" strokeWidth="1"
            opacity="0.4"
          />
          <path
            d="M 50 98 A 48 48 0 0 1 2 50"
            fill="none" stroke="var(--accent)" strokeWidth="1"
            opacity="0.4"
          />
        </svg>

        {/* Core button */}
        <button
          onClick={handleEnter}
          aria-label="Enter Garv's World"
          style={{
            position: 'relative',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'var(--bg-primary)',
            border: '1px solid var(--accent-border)',
            boxShadow:
              '0 0 30px rgba(0,212,255,0.25), inset 0 0 24px rgba(0,212,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            animation:
              phase === 'breach' ? 'portal-glitch 0.4s ease' : 'none',
            zIndex: 1,
          }}
          onMouseEnter={(e) => {
            if (phase !== 'idle') return
            const el = e.currentTarget
            el.style.boxShadow =
              '0 0 50px rgba(0,212,255,0.5), inset 0 0 36px rgba(0,212,255,0.25)'
            el.style.borderColor = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            if (phase !== 'idle') return
            const el = e.currentTarget
            el.style.boxShadow =
              '0 0 30px rgba(0,212,255,0.25), inset 0 0 24px rgba(0,212,255,0.12)'
            el.style.borderColor = 'var(--accent-border)'
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.4">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </button>

        {/* CTA text */}
        <p
          style={{
            marginTop: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--accent)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            padding: '0.5rem 1.25rem',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius)',
            background: 'rgba(0,212,255,0.06)',
          }}
        >
          Enter Garv's World
        </p>
      </div>

      <style>{`
        @keyframes portal-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes portal-spin-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes portal-glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  )
}