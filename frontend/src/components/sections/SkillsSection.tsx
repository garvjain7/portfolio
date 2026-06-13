'use client'
import { useState } from 'react'
import { SKILLS } from '@/lib/constants'
import { useUIStore } from '@/stores/uiStore'

const LEVEL_COLOR: Record<string, string> = {
  production: 'var(--accent)',
  working: '#a78bfa',
  surface: 'var(--text-muted)',
}

const LEVEL_LABEL: Record<string, string> = {
  production: 'Production',
  working: 'Working',
  surface: 'Learning',
}

export function SkillsSection() {
  const categories = Object.keys(SKILLS)
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const openAssistant = useUIStore((s) => s.openAssistant)

  const skills = SKILLS[activeCategory as keyof typeof SKILLS]

  return (
    <section
      id="skills"
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
          Technical Stack
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Skills
        </h2>
      </div>

      {/* Category tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all var(--transition)',
              background:
                activeCategory === cat ? 'var(--accent-dim)' : 'var(--bg-surface)',
              border:
                activeCategory === cat
                  ? '1px solid var(--accent-border)'
                  : '1px solid var(--border)',
              color:
                activeCategory === cat ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {skills.map((skill) => (
          <div
            key={skill.name}
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'
              ;(e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
              ;(e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {skill.name}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: LEVEL_COLOR[skill.level],
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}
            >
              {LEVEL_LABEL[skill.level]}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {Object.entries(LEVEL_COLOR).map(([level, color]) => (
          <div
            key={level}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
              }}
            />
            {LEVEL_LABEL[level]}
          </div>
        ))}
      </div>

      {/* AI nudge */}
      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() =>
            openAssistant('What is the depth of Garv\'s technical skills and where have they been applied?')
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
          Ask AI about the depth behind these skills →
        </button>
      </div>
    </section>
  )
}