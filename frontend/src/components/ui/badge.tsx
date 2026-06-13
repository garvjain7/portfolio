'use client'
import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'live' | 'progress' | 'archived' | 'tech' | 'tag'
  style?: React.CSSProperties
}

export function Badge({ children, variant = 'tech', style }: BadgeProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    fontWeight: 500,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  }

  const variantStyle: React.CSSProperties =
    variant === 'live'
      ? {
          background: 'rgba(0, 212, 255, 0.12)',
          color: 'var(--accent)',
          border: '1px solid var(--accent-border)',
        }
      : variant === 'progress'
      ? {
          background: 'rgba(255, 200, 80, 0.1)',
          color: '#ffc850',
          border: '1px solid rgba(255, 200, 80, 0.25)',
        }
      : variant === 'archived'
      ? {
          background: 'rgba(90, 90, 114, 0.2)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
        }
      : variant === 'tag'
      ? {
          background: 'rgba(255,255,255,0.04)',
          color: 'var(--accent)',
          border: '1px solid rgba(0,212,255,0.15)',
        }
      : {
          background: 'var(--bg-elevated)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
        }

  return <span style={{ ...base, ...variantStyle, ...style }}>{children}</span>
}