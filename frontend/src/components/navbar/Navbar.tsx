'use client'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/constants'
import { useSectionNav } from '@/hooks/useSectionNav'
import { useUIStore } from '@/stores/uiStore'
import { NavAssistantButton } from './NavAssistantButton'

export function Navbar() {
  const [pinned, setPinned] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { scrollTo, scrollToTop } = useSectionNav()
  const openAssistant = useUIStore((s) => s.openAssistant)

  useEffect(() => {
    const handleScroll = () => {
      setPinned(window.scrollY > window.innerHeight * 0.6)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        background: pinned
          ? 'rgba(9, 9, 15, 0.85)'
          : 'transparent',
        backdropFilter: pinned ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: pinned ? 'blur(20px)' : 'none',
        borderBottom: pinned ? '1px solid var(--border)' : '1px solid transparent',
        opacity: pinned ? 1 : 0,
        pointerEvents: pinned ? 'all' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Logo */}
        <button
          onClick={scrollToTop}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--accent)',
            letterSpacing: '0.1em',
            flexShrink: 0,
          }}
        >
          GJ
        </button>

        {/* Nav links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {NAV_LINKS.map((link) => {
            const id = link.href.replace('#', '')
            const isActive = activeSection === id
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(id)}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  transition: 'all var(--transition)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.target as HTMLElement).style.color = 'var(--text-secondary)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.target as HTMLElement).style.color = 'var(--text-muted)'
                }}
              >
                {link.label}
              </button>
            )
          })}
        </div>

        {/* AI button */}
        <NavAssistantButton onClick={() => openAssistant()} />
      </div>
    </nav>
  )
}