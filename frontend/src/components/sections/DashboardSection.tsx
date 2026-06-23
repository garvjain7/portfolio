'use client'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'
import { STATS } from '@/lib/constants'
import { useUIStore } from '@/stores/uiStore'

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { count, ref } = useAnimatedCounter(value)

  return (
    <div
      ref={ref}
      style={{
        padding: '1.75rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        transition: 'all var(--transition)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--accent-border)'
        el.style.background = 'var(--bg-elevated)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border)'
        el.style.background = 'var(--bg-surface)'
      }}
    >
      {/* Background number glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, var(--accent-dim) 0%, transparent 70%)',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 700,
          color: 'var(--accent)',
          lineHeight: 1,
          position: 'relative',
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          position: 'relative',
        }}
      >
        {label}
      </div>
    </div>
  )
}

export function DashboardSection() {
  const openAssistant = useUIStore((s) => s.openAssistant)

  return (
    <section
      id="dashboard"
      style={{
        padding: '5rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--accent)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          At a Glance
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Stats
        </h2>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem',
        }}
      >
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
          />
        ))}
      </div>

      {/* Strong AI nudge */}
      <div
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--accent-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.3rem',
            }}
          >
            Numbers don&apos;t tell the full story.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            Ask Garv&apos;s AI about the decisions, failures, and thinking behind the work.
          </p>
        </div>
        <button
          onClick={() =>
            openAssistant(
              "Give me a full picture of Garv as an engineer — not just stats, but the thinking, decisions, and what makes him stand out."
            )
          }
          style={{
            padding: '0.65rem 1.5rem',
            borderRadius: 'var(--radius)',
            background: 'var(--accent)',
            color: '#000',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            flexShrink: 0,
            letterSpacing: '0.04em',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px var(--accent-glow)'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          }}
        >
          Ask Garv&apos;s AI →
        </button>
      </div>
    </section>
  )
}