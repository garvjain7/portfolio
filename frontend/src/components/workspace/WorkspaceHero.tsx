'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useUIStore } from '@/stores/uiStore'

/** Detect iOS/iPadOS — these block autoplay with sound unconditionally */
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as Macintosh with touch
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/** Detect any touch-primary device (mobile / tablet) */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

export function WorkspaceHero() {
  const soundEnabled = useUIStore((s) => s.soundEnabled)
  const openAssistant = useUIStore((s) => s.openAssistant)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Refs for values used inside stable callbacks/observers (avoids stale closures)
  const shouldBePlayingRef = useRef(true)
  const hasEndedRef = useRef(false)
  const isInViewRef = useRef(true)

  // UI state
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [isBuffering, setIsBuffering] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showTimedText, setShowTimedText] = useState(false)
  const [isTouchPrimary] = useState(() => isTouchDevice())

  // ─── Stable IntersectionObserver (created once, reads from refs) ─────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          // Resume only if the user had not intentionally paused or ended
          if (shouldBePlayingRef.current && !hasEndedRef.current) {
            video.play().catch(() => {
              // Autoplay blocked — show controls so user can tap play
              setShowControls(true)
            })
          }
        } else {
          // Scrolled out — pause without changing intent
          video.pause()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, []) // ← stable: no deps, reads from refs

  // ─── Sound / mute management with iOS fallback ───────────────────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isIOS()) {
      // iOS blocks unmuted autoplay — keep muted, try to unmute after a user gesture
      video.muted = true
    } else {
      video.muted = !soundEnabled
    }
  }, [soundEnabled])

  // ─── Try to unmute on first user interaction (iOS) ───────────────────────────
  useEffect(() => {
    if (!isIOS()) return
    const tryUnmute = () => {
      const video = videoRef.current
      if (!video) return
      video.muted = !soundEnabled
      window.removeEventListener('pointerdown', tryUnmute)
    }
    window.addEventListener('pointerdown', tryUnmute, { once: true })
    return () => window.removeEventListener('pointerdown', tryUnmute)
  }, [soundEnabled])

  // ─── Video event handlers ─────────────────────────────────────────────────────
  const handleCanPlay = useCallback(() => {
    setIsBuffering(false)
  }, [])

  const handleWaiting = useCallback(() => {
    setIsBuffering(true)
  }, [])

  const handlePlaying = useCallback(() => {
    setIsBuffering(false)
    setIsPlaying(true)
    setHasEnded(false)
    hasEndedRef.current = false
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      const current = video.currentTime
      // Show overlay text at exactly 6.70s and hide after 1.2s
      if (current >= 6.7 && current < 7.9) {
        setShowTimedText(true)
      } else {
        setShowTimedText(false)
      }
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setHasEnded(true)
    hasEndedRef.current = true
    shouldBePlayingRef.current = false
    setShowControls(true)
  }, [])

  const handleError = useCallback(() => {
    setHasError(true)
    setIsBuffering(false)
  }, [])

  // ─── Play / Pause toggle ──────────────────────────────────────────────────────
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      // If fully ended, restart from beginning; otherwise resume from current time
      if (hasEndedRef.current) {
        video.currentTime = 0
        setHasEnded(false)
        hasEndedRef.current = false
      }
      shouldBePlayingRef.current = true
      video.play().catch(() => setShowControls(true))
    } else {
      shouldBePlayingRef.current = false
      video.pause()
    }
  }, [])

  // ─── Skip to About section (buffered for layout settle) ──────────────────────
  const handleSkip = useCallback(() => {
    setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  // ─── Auto-hide controls on desktop (mouse idle). Always show on touch. ────────
  useEffect(() => {
    if (isTouchPrimary) {
      setShowControls(true)
      return
    }
    if (!isPlaying) {
      setShowControls(true)
      return
    }

    let timer: ReturnType<typeof setTimeout>

    const resetTimer = () => {
      setShowControls(true)
      clearTimeout(timer)
      timer = setTimeout(() => setShowControls(false), 2500)
    }

    window.addEventListener('pointermove', resetTimer, { passive: true })
    resetTimer() // kick off on mount

    return () => {
      window.removeEventListener('pointermove', resetTimer)
      clearTimeout(timer)
    }
  }, [isPlaying, isTouchPrimary])

  // ─── Render ───────────────────────────────────────────────────────────────────
  const controlsVisible = showControls || !isPlaying || hasEnded

  return (
    <div
      id="workspace-hero"
      style={{
        height: '100vh',
        width: '100%', // avoids scrollbar-width jitter from 100vw
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Video ──────────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/ai-intro.mp4"
        autoPlay
        playsInline
        preload="auto"      // start buffering immediately
        muted               // overridden in useEffect (needed for initial autoplay)
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          // GPU-composite the video layer — prevents repaints from overlapping elements
          willChange: 'transform',
        }}
      />

      {/* ── Buffering skeleton ─────────────────────────────────────────────── */}
      {isBuffering && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          {/* Spinner ring */}
          <div style={{ position: 'relative', width: 48, height: 48 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid var(--border)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: 'var(--accent)',
                animation: 'hero-spin 0.8s linear infinite',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
            }}
          >
            Loading…
          </span>
        </div>
      )}

      {/* ── Error fallback ─────────────────────────────────────────────────── */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            Video unavailable
          </p>
          <button
            onClick={handleSkip}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius)',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
            }}
          >
            Go to About →
          </button>
        </div>
      )}

      {/* ── Subtle grid scanlines overlay ──────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Vignette ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(9,9,15,0.72) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Timed overlay text at 6.7s ───────────────────────────────────── */}
      {showTimedText && !isBuffering && !hasError && (
        <div
          style={{
            position: 'absolute',
            left: '26.7%',
            top: '26.5%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '999px',
              background: 'rgba(9,9,15,0.78)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.96rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 18px 48px rgba(0,0,0,0.35)',
            }}
          >
            Ask AI →
          </div>
        </div>
      )}

      {/* ── Central Play / Pause / Replay button (64 px) ───────────────────── */}
      {!isBuffering && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <button
            id="hero-play-pause"
            aria-label={hasEnded ? 'Replay video' : isPlaying ? 'Pause video' : 'Play video'}
            onClick={togglePlayPause}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(9,9,15,0.65)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid var(--accent-border)',
              boxShadow: '0 0 24px rgba(0,212,255,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              // Smooth appear/disappear — GPU composited (opacity + transform only)
              opacity: controlsVisible ? 1 : 0,
              transform: controlsVisible ? 'scale(1)' : 'scale(0.82)',
              transition: 'opacity 0.28s ease, transform 0.28s ease, background 0.2s ease, box-shadow 0.2s ease',
              pointerEvents: 'auto',
              // Minimum touch target
              minWidth: '44px',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(0,212,255,0.14)'
              el.style.borderColor = 'var(--accent)'
              el.style.boxShadow = '0 0 32px rgba(0,212,255,0.42)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(9,9,15,0.65)'
              el.style.borderColor = 'var(--accent-border)'
              el.style.boxShadow = '0 0 24px rgba(0,212,255,0.22)'
            }}
          >
            {hasEnded ? (
              // Replay icon
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            ) : isPlaying ? (
              // Pause icon
              <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              // Play icon (slightly offset to look optically centered)
              <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* ── Skip button (top-right, tap-friendly) ──────────────────────────── */}
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: '5.25rem',
          right: '1.75rem',
          zIndex: 60,
          // Minimum 44×44 touch target with visual padding
          padding: '0.55rem 1rem',
          borderRadius: 'var(--radius)',
          background: 'rgba(9,9,15,0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          cursor: 'pointer',
          transition: 'color 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.18s ease',
          boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
          // Prevent text selection on fast taps
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'auto',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'var(--accent)'
          el.style.borderColor = 'var(--accent-border)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'var(--text-muted)'
          el.style.borderColor = 'var(--border)'
        }}
      >
        Skip →
      </button>

      {/* ── Bouncing scroll indicator (bottom-center) ──────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.45rem',
          zIndex: 40,
          pointerEvents: 'none',
          animation: 'hero-scroll-bounce 2.2s ease-in-out infinite',
          opacity: 0.75,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Scroll to explore
        </span>
        {/* Mouse pill */}
        <div
          style={{
            width: '22px',
            height: '36px',
            borderRadius: '11px',
            border: '1.5px solid rgba(255,255,255,0.3)',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '3px',
              height: '7px',
              borderRadius: '2px',
              background: 'var(--accent)',
              position: 'absolute',
              top: '7px',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'hero-scroll-dot 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ── Keyframes ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hero-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes hero-scroll-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(7px); }
        }
        @keyframes hero-scroll-dot {
          0%   { opacity: 1;   top: 7px; }
          80%  { opacity: 0;   top: 20px; }
          100% { opacity: 0;   top: 7px; }
        }
      `}</style>
    </div>
  )
}
