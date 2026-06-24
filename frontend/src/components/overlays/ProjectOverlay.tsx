'use client'
import { useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { PROJECTS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

export function ProjectOverlay() {
  const { activeProjectId, closeProject, openAssistant } = useUIStore()
  const project = PROJECTS.find((p) => p.id === activeProjectId)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
    }
    if (activeProjectId) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKey)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [activeProjectId, closeProject])

  if (!activeProjectId || !project) return null

  const statusVariant =
    project.status === 'Live'
      ? 'live'
      : project.status === 'Archived'
      ? 'archived'
      : 'progress'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(9,9,15,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        animation: 'slide-up 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          padding: '2rem',
          flex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Badge variant={statusVariant}>{project.status}</Badge>
              {project.featured && (
                <Badge variant="tag">Featured</Badge>
              )}
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {project.name}
            </h2>
          </div>

          <button
            onClick={closeProject}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all var(--transition)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body — two columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
          }}
        >
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem',
                }}
              >
                About
              </p>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                }}
              >
                {project.longDescription}
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem',
                }}
              >
                Stack
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.stack.map((tech) => (
                  <Badge key={tech} variant="tech">{tech}</Badge>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius)',
                    background: 'var(--accent)',
                    color: '#000',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all var(--transition)',
                  }}
                >
                  ↗ Live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    transition: 'all var(--transition)',
                  }}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem',
                }}
              >
                Highlights
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {project.highlights.map((h, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: 'var(--accent)', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginTop: '0.1rem' }}>›</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI nudge */}
            <div
              style={{
                marginTop: 'auto',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                Want the full technical story?
              </p>
              <button
                onClick={() => {
                  closeProject()
                  openAssistant(project.aiQuery)
                }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--accent)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'opacity var(--transition)',
                }}
              >
                Ask Garv&apos;s AI about {project.name} →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}