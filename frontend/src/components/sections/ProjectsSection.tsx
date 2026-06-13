'use client'
import { PROJECTS } from '@/lib/constants'
import { useUIStore } from '@/stores/uiStore'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types/projects'

function ProjectTile({
  project,
  featured = false,
}: {
  project: Project
  featured?: boolean
}) {
  const { openProject, openAssistant } = useUIStore()

  const statusVariant =
    project.status === 'Live'
      ? 'live'
      : project.status === 'Archived'
      ? 'archived'
      : 'progress'

  return (
    <div
      onClick={() => openProject(project.id)}
      style={{
        padding: featured ? '1.75rem' : '1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--accent-border)'
        el.style.background = 'var(--bg-elevated)'
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = '0 8px 32px rgba(0,212,255,0.08)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border)'
        el.style.background = 'var(--bg-surface)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Accent left border on featured */}
      {featured && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '3px',
            background: 'linear-gradient(to bottom, var(--accent), transparent)',
            borderRadius: '3px 0 0 3px',
          }}
        />
      )}

      {/* Top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: featured ? '1.2rem' : '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          {project.name}
        </h3>
        <Badge variant={statusVariant}>{project.status}</Badge>
      </div>

      {/* Description */}
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: featured ? '0.9rem' : '0.825rem',
          lineHeight: 1.65,
          flex: 1,
        }}
      >
        {project.description}
      </p>

      {/* Stack tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {project.stack.slice(0, 5).map((tech) => (
          <Badge key={tech} variant="tech">
            {tech}
          </Badge>
        ))}
        {project.stack.length > 5 && (
          <Badge variant="tech">+{project.stack.length - 5}</Badge>
        )}
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--accent)',
                textDecoration: 'none',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
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
              onClick={(e) => e.stopPropagation()}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                transition: 'all var(--transition)',
              }}
            >
              GitHub
            </a>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            openAssistant(project.aiQuery)
          }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
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
          Ask AI →
        </button>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const featured = PROJECTS.filter((p) => p.featured)
  const rest = PROJECTS.filter((p) => !p.featured)

  return (
    <section
      id="projects"
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
          Built Things
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Projects
        </h2>
      </div>

      {/* Featured — equal width side by side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {featured.map((p) => (
          <ProjectTile key={p.id} project={p} featured />
        ))}
      </div>

      {/* Rest — asymmetric grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {rest.map((p) => (
          <ProjectTile key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}