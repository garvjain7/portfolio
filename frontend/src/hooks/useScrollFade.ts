'use client'
import { useEffect, useState } from 'react'

export function useScrollFade(threshold = 100): number {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const fade = Math.max(0, 1 - scrollY / threshold)
      setOpacity(fade)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return opacity
}