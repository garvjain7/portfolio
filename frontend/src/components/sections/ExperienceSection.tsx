'use client'
import { useState } from 'react'
import { useUIStore } from '@/stores/uiStore'

const EXPERIENCE = [
  {
    id: 'exp1',
    role: 'Full Stack Developer Intern',
    company: 'STPI Jaipur',
    duration: 'May 2026 - Present',
    type: 'Internship',
    description:
      'Leading the development of ComplySense, an AI-powered Governance, Risk, and Compliance (GRC) platform designed to help institutions manage compliance, risk assessments, audits, evidence collection, and regulatory reporting through a centralized system.',
    highlights: [
      'Architecting the end-to-end backend using FastAPI, PostgreSQL, Redis, and AI integrations',
      'Designed a scalable RBAC system supporting 9 organizational roles and approval workflows',
      'Built compliance and risk management modules aligned with multiple regulatory frameworks',
      'Leading technical decisions, system design, database architecture, and team implementation',
    ],
    aiQuery: "Tell me about Garv's role on ComplySense and the architecture he designed.",
  },

  {
    id: 'exp2',
    role: 'Backend Engineer & Technical Lead',
    company: 'SparkIIT',
    duration: 'Feb 2026 - May 2026',
    type: 'Internship',
    description:
      'Worked as a Backend Engineer and Technical Lead on client and internal products, building scalable APIs, backend systems, and data-processing workflows while contributing to architecture and technical decision-making.',
    highlights: [
      'Contributed to DataInsights.ai, developing backend services and data workflows',
      'Led backend development for ScanVista, an intelligent document analysis platform',
      'Designed REST APIs, database schemas, and asynchronous backend services',
      'Collaborated across projects while guiding technical implementation and architecture',
    ],
    aiQuery: "Tell me about Garv's work at SparkIIT on DataInsights.ai and ScanVista.",
  },

  {
    id: 'exp3',
    role: 'Software Development Intern',
    company: 'STPI Jaipur',
    duration: 'May 2025 - July 2025',
    type: 'Internship',
    description:
      'Independently designed and developed ApnaEV, an EV charging station discovery platform that helps users locate nearby charging stations and access charging infrastructure information efficiently.',
    highlights: [
      'Built the complete platform independently from design to deployment',
      'Developed backend APIs and data management systems',
      'Implemented location-based EV charging station discovery workflows',
      'Delivered the project within a 45-day internship period',
    ],
    aiQuery: "Tell me about Garv's ApnaEV project and what he built during his STPI internship.",
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
      <div className="timeline-container">
        {/* Vertical line */}
        <div className="timeline-line" />

        <div className="timeline-list">
          {EXPERIENCE.map((exp, idx) => {
            const isExpanded = expandedId === exp.id
            const isLeft = idx % 2 === 0
            return (
              <div
                key={exp.id}
                className={`timeline-item ${isLeft ? 'left' : 'right'}`}
              >
                {/* Dot */}
                <div
                  className="timeline-dot"
                  style={{
                    background: isExpanded ? 'var(--accent)' : 'var(--bg-elevated)',
                    border: `2px solid ${isExpanded ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                />

                {/* Card Wrapper */}
                <div className="timeline-card-wrapper">
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
                        {!isExpanded && (
                          <p
                            style={{
                              marginTop: '0.5rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.65rem',
                              color: 'var(--accent)',
                              opacity: 0.8,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <span>⚡</span> Click to reveal details
                          </p>
                        )}
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
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom AI nudge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
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
        .timeline-container {
          position: relative;
          width: 100%;
          margin-top: 2rem;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 8px;
          bottom: 8px;
          width: 1px;
          background: linear-gradient(to bottom, var(--accent), var(--border));
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100%;
        }

        .timeline-item {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding-bottom: 2rem;
        }

        .timeline-item.left {
          align-items: flex-start;
        }

        .timeline-item.right {
          align-items: flex-end;
        }

        .timeline-dot {
          position: absolute;
          left: 50%;
          top: 24px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all var(--transition);
          z-index: 10;
        }

        .timeline-card-wrapper {
          width: 50%;
          box-sizing: border-box;
        }

        .timeline-item.left .timeline-card-wrapper {
          padding-right: 2rem;
        }

        .timeline-item.right .timeline-card-wrapper {
          padding-left: 2rem;
        }

        @keyframes expand-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .timeline-line {
            left: 8px;
            transform: none;
          }
          .timeline-item.left, .timeline-item.right {
            align-items: flex-start;
          }
          .timeline-dot {
            left: 8px;
            transform: translateY(-50%);
          }
          .timeline-card-wrapper {
            width: 100%;
          }
          .timeline-item.left .timeline-card-wrapper,
          .timeline-item.right .timeline-card-wrapper {
            padding-left: 2rem;
            padding-right: 0;
          }
        }
      `}</style>
    </section>
  )
}