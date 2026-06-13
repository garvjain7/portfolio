'use client'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'mono'
  size?: 'sm' | 'md' | 'lg'
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--transition)',
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
  },
}

export function Button({
  variant = 'primary',
  size = 'md',
  style,
  children,
  ...props
}: ButtonProps) {
  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'var(--accent)',
          color: '#000',
          border: '1px solid var(--accent)',
        }
      : variant === 'outline'
      ? {
          background: 'transparent',
          color: 'var(--accent)',
          border: '1px solid var(--accent-border)',
        }
      : variant === 'ghost'
      ? {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        }
      : {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
        }

  const sizeStyle: React.CSSProperties =
    size === 'sm'
      ? { padding: '0.375rem 0.875rem', fontSize: '0.8rem' }
      : size === 'lg'
      ? { padding: '0.75rem 1.75rem', fontSize: '1rem' }
      : { padding: '0.5rem 1.25rem', fontSize: '0.9rem' }

  return (
    <button
      style={{ ...styles.base, ...variantStyle, ...sizeStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  )
}