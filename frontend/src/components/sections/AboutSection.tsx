'use client'
import { useEffect, useState } from 'react'
import { ROTATING_ROLES, SOCIAL_LINKS } from '@/lib/constants'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'

const GITHUB_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LINKEDIN_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export function AboutSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [roleFade, setRoleFade] = useState(true)
  const { openResume, openAssistant } = useUIStore()

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleFade(false)
      setTimeout(() => {
        setRoleIndex((i) => (i + 1) % ROTATING_ROLES.length)
        setRoleFade(true)
      }, 300)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="about"
      style={{
        padding: '6rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}
      >
        {/* Left — content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Role tag */}
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            B.Tech CS · Poornima Institute, Jaipur
          </p>

          {/* Name */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
              }}
            >
              Garv Jain
            </h2>

            {/* Rotating role */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>I&apos;m a</span>
              <span
                style={{
                  color: 'var(--accent)',
                  transition: 'opacity 0.3s ease',
                  opacity: roleFade ? 1 : 0,
                  fontWeight: 500,
                }}
              >
                {ROTATING_ROLES[roleIndex]}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.75,
              maxWidth: '520px',
            }}
          >
            Backend-focused systems builder and B.Tech CS candidate (2023–2027). 
            RHCSA &amp; RHCE certified. Experienced as a Technical Lead across concurrent commercial 
            projects at SparkIIT and STPI Jaipur. Specializes in designing robust multi-tenant 
            SaaS architectures, RAG pipelines, and real-time collaboration engines. Highly motivated 
            by system design tradeoffs and underlying mechanisms.
          </p>

          {/* Resume buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={openResume}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius)',
                background: 'var(--accent)',
                color: '#000',
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px var(--accent-glow)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              View Resume
            </button>
            <a
              href="/resume.pdf"
              download
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius)',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all var(--transition)',
              }}
            >
              ↓ Download
            </a>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.875rem',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textDecoration: 'none',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
              }}
            >
              {GITHUB_ICON} garvjain7
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.875rem',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textDecoration: 'none',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
              }}
            >
              {LINKEDIN_ICON} garvjain7
            </a>
          </div>

          {/* AI nudge */}
          <button
            onClick={() =>
              openAssistant("Tell me about Garv's background, education, and experience.")
            }
            style={{
              alignSelf: 'flex-start',
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
            Not sure what to ask? Start with Garv&apos;s AI →
          </button>
        </div>

        {/* Right — photo */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: '260px',
              height: '260px',
            }}
          >
            {/* Accent ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-3px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), transparent 60%)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '3px solid var(--bg-primary)',
                overflow: 'hidden',
                zIndex: 1,
              }}
            >
              {/* Drop profile.jpg into frontend/public/ to use your photo */}
              <img
                src="/profile.jpeg"
                alt="Garv Jain"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
                onError={(e) => {
                  // Fallback while photo isn't added yet
                  const el = e.currentTarget
                  el.style.display = 'none'
                  const parent = el.parentElement as HTMLElement
                  parent.style.background = 'linear-gradient(135deg, var(--bg-elevated), var(--bg-surface))'
                  parent.style.display = 'flex'
                  parent.style.alignItems = 'center'
                  parent.style.justifyContent = 'center'
                  const fallback = document.createElement('span')
                  fallback.textContent = 'GJ'
                  fallback.style.cssText = `
                    font-family: var(--font-mono);
                    font-size: 2.5rem;
                    color: var(--accent);
                    font-weight: 600;
                  `
                  parent.appendChild(fallback)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}