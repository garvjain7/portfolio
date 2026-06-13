'use client'

interface NavAssistantButtonProps {
  onClick: () => void
}

export function NavAssistantButton({ onClick }: NavAssistantButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 1rem',
        borderRadius: 'var(--radius)',
        background: 'var(--accent-dim)',
        border: '1px solid var(--accent-border)',
        color: 'var(--accent)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.05em',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        flexShrink: 0,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(0,212,255,0.2)'
        el.style.boxShadow = '0 0 16px var(--accent-glow)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.background = 'var(--accent-dim)'
        el.style.boxShadow = 'none'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--accent)',
          display: 'inline-block',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }}
      />
      Ask Garv&apos;s AI
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </button>
  )
}