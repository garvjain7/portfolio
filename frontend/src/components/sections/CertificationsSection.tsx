'use client'
import { useState } from 'react'
import Image from 'next/image'
import { CERTIFICATIONS } from '@/lib/constants'
import { useUIStore, type StoreState } from '@/stores/uiStore'

export function CertificationsSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [animating, setAnimating] = useState(false)
  const openAssistant = useUIStore((s: StoreState) => s.openAssistant)

  const cert = CERTIFICATIONS[activeIdx]

  function navigate(dir: 'left' | 'right') {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setActiveIdx((i) =>
        dir === 'right'
          ? (i + 1) % CERTIFICATIONS.length
          : (i - 1 + CERTIFICATIONS.length) % CERTIFICATIONS.length
      )
      setAnimating(false)
    }, 220)
  }

  return (
    <section
      id="certifications"
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
          Credentials
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Certifications
        </h2>
      </div>

      {/* Carousel */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Left arrow */}
        <button
          onClick={() => navigate('left')}
          disabled={CERTIFICATIONS.length <= 1}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all var(--transition)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
          }}
        >
          ←
        </button>

        {/* Card */}
        <div
          style={{
            flex: 1,
            maxWidth: cert.hasBadge ? '720px' : '520px',
            transition: 'max-width var(--transition-slow)',
          }}
        >
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--accent-border)',
              overflow: 'hidden',
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === 'right' ? '-20px' : '20px'})`
                : 'translateX(0)',
              transition: 'opacity 0.22s ease, transform 0.22s ease',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: cert.hasBadge ? '1fr auto' : '1fr',
                gap: 0,
              }}
            >
              {/* Content */}
              <div style={{ padding: '2rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--accent)',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--accent-border)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {cert.shortName}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {cert.issuer} · {cert.year}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.3,
                  }}
                >
                  {cert.name}
                </h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    marginBottom: '1.25rem',
                  }}
                >
                  {cert.description}
                </p>

                <button
                  onClick={() =>
                    openAssistant(
                      `Tell me about Garv's ${cert.shortName} certification and what it means technically.`
                    )
                  }
                  style={{
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
                  Ask AI what this means technically →
                </button>
              </div>

              {/* Badge panel */}
              {cert.hasBadge && (
                <div
                  style={{
                    width: '160px',
                    flexShrink: 0,
                    background: 'var(--bg-elevated)',
                    borderLeft: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                  }}
                >
                  {cert.badgeUrl ? (
                    <Image
                      src={cert.badgeUrl}
                      alt={`${cert.shortName} badge`}
                      width={100}
                      height={100}
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'var(--accent-dim)',
                        border: '2px solid var(--accent-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--accent)',
                        textAlign: 'center',
                        lineHeight: 1.3,
                      }}
                    >
                      {cert.shortName}
                      <br />
                      Badge
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => navigate('right')}
          disabled={CERTIFICATIONS.length <= 1}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all var(--transition)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
          }}
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.5rem',
        }}
      >
        {CERTIFICATIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > activeIdx ? 'right' : 'left')
              setActiveIdx(i)
            }}
            style={{
              width: i === activeIdx ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === activeIdx ? 'var(--accent)' : 'var(--border)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition)',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  )
}