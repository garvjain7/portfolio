'use client'
import { useState } from 'react'
import { useUIStore } from '@/stores/uiStore'

const EXPERIENCE = [
  {
    id: 'exp1',
    role: 'Technical Lead — Intern',
    company: 'GRC SaaS Startup',
    duration: 'Apr 2025 – Present',
    type: 'Internship',
    description:
      'Sole technical lead on ComplySense, a GRC SaaS platform for Indian universities. Designed a 28-table PostgreSQL schema, 9-role RBAC system, and full compliance control library mapping six regulatory frameworks simultaneously. Directed implementation across the team using AI coding tools.',
    highlights: [
      'Architected full backend from scratch — FastAPI, PostgreSQL, MongoDB, Redis, Ollama',
      'Wrote 28-table normalized schema and full SQLAlchemy async ORM models',
      'Designed RBAC with dependency injection across all API routes',
      'Built compliance control library mapping DPDP, IT Act, ISO 27001, NIST CSF simultaneously',
    ],
    aiQuery: "Tell me about Garv's experience as a technical lead and what he built.",
  },
  {
    id: 'exp2',
    role: 'Independent Builder',
    company: 'Self-directed Projects',
    duration: '2022 – Present',
    type: 'Self-directed',
    description:
      'Designed and built multiple production-level full-stack systems independently, taking ownership of architecture, backend, frontend, and deployment decisions across ScanVista, DataInsights.ai, CodeAlive, and more.',
    highlights: [
      'Built 6+ production-quality full-stack systems end to end',
      'Managed full architecture, implementation, and deployment independently',
      'Worked as technical lead directing smaller teams on ScanVista and ComplySense',
      'Consistent focus on backend depth: auth systems, multi-tenancy, AI pipelines',
    ],
    aiQuery: "What does Garv's independent project work demonstrate about his capabilities?",
  },
]

export function ExperienceSection() {
  const [expandedId, setExpandedId] = useState<string | null>(EXPERIENCE[0].id)
  const openAssistant = useUIStore((s) => s.openAssistant)

  return (
    <section
      id="experience"
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
          Work History
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Experience
        </h2>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '8px',
            bottom: '8px',
            width: '1px',
            background: 'linear-gradient(to bottom, var(--accent), var(--border))',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {EXPERIENCE.map((exp, idx) => {
            const isExpanded = expandedId === exp.id
            return (
              <div key={exp.id} style={{ position: 'relative', paddingBottom: '2rem' }}>
                {/* Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.625rem',
                    top: '6px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: isExpanded ? 'var(--accent)' : 'var(--bg-elevated)',
                    border: `2px solid ${isExpanded ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'all var(--transition)',
                    zIndex: 1,
                  }}
                />

                {/* Card */}
                <div
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-surface)',
                    border: `1px solid ${isExpanded ? 'var(--accent-border)' : 'var(--border)'}`,
                    overflow: 'hidden',
                    transition: 'all var(--transition)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  {/* Header row */}
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          marginBottom: '0.3rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            color: 'var(--accent)',
                            letterSpacing: '0.08em',
                            background: 'var(--accent-dim)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid var(--accent-border)',
                          }}
                        >
                          {exp.type}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {exp.duration}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '0.15rem',
                        }}
                      >
                        {exp.role}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '1rem',
                        transition: 'transform var(--transition)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                        flexShrink: 0,
                        marginTop: '0.2rem',
                      }}
                    >
                      ↓
                    </span>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.5rem',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '1rem',
                        animation: 'expand-in 0.2s ease forwards',
                      }}
                    >
                      <p
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.875rem',
                          lineHeight: 1.7,
                          marginBottom: '1rem',
                        }}
                      >
                        {exp.description}
                      </p>
                      <ul
                        style={{
                          listStyle: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        {exp.highlights.map((h, i) => (
                          <li
                            key={i}
                            style={{
                              display: 'flex',
                              gap: '0.6rem',
                              color: 'var(--text-secondary)',
                              fontSize: '0.845rem',
                              lineHeight: 1.6,
                            }}
                          >
                            <span
                              style={{
                                color: 'var(--accent)',
                                flexShrink: 0,
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.75rem',
                                marginTop: '0.15rem',
                              }}
                            >
                              ›
                            </span>
                            {h}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openAssistant(exp.aiQuery)
                        }}
                        style={{
                          marginTop: '1rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
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
                        Ask AI about this →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom AI nudge */}
      <div style={{ paddingLeft: '2rem', marginTop: '-0.5rem' }}>
        <button
          onClick={() =>
            openAssistant(
              "How has Garv's experience shaped his approach to engineering?"
            )
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
          Ask AI how this experience shaped Garv&apos;s approach →
        </button>
      </div>

      <style>{`
        @keyframes expand-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}