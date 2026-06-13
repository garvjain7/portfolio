'use client'
import { useState } from 'react'
import { ACHIEVEMENTS } from '@/lib/constants'
import { useUIStore } from '@/stores/uiStore'

export function AchievementsSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const openAssistant = useUIStore((s) => s.openAssistant)

  return (
    <section
      id="achievements"
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
          Recognition
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Achievements
        </h2>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {ACHIEVEMENTS.map((ach) => {
          const isHovered = hoveredId === ach.id
          return (
            <div
              key={ach.id}
              onMouseEnter={() => setHoveredId(ach.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: isHovered ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                border: `1px solid ${isHovered ? 'var(--accent-border)' : 'var(--border)'}`,
                transition: 'all var(--transition)',
                cursor: 'default',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 12px 40px rgba(0,212,255,0.1)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow accent on hover */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'var(--accent-glow)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Tag + year */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--accent)',
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {ach.tag}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {ach.year}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.6rem',
                  lineHeight: 1.3,
                }}
              >
                {ach.title}
              </h3>

              {/* Description — revealed on hover */}
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.845rem',
                  lineHeight: 1.65,
                  opacity: isHovered ? 1 : 0.5,
                  transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity var(--transition), transform var(--transition)',
                }}
              >
                {ach.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* AI nudge */}
      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() =>
            openAssistant("What are Garv's notable achievements and recognitions?")
          }
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'color var(--transition)',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')
          }
        >
          Ask AI about Garv&apos;s achievements →
        </button>
      </div>
    </section>
  )
}