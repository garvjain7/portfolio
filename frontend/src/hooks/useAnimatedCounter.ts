'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export function useAnimatedCounter(
  target: number,
  duration = 1800,
  startOnVisible = true
): { count: number; ref: React.RefObject<HTMLDivElement> } {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null!)
  const started = useRef(false)

  const animate = useCallback(() => {
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  useEffect(() => {
    if (!startOnVisible) {
      animate()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          animate()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animate, startOnVisible])

  return { count, ref }
}