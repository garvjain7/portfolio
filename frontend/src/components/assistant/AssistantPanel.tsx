'use client'
import { useEffect, useRef } from 'react'
import { useAssistant } from '@/hooks/useAssistant'
import { useUIStore } from '@/stores/uiStore'
import { AssistantChat } from './AssistantChat'
import { AssistantInput } from './AssistantInput'

export function AssistantPanel() {
  const {
    messages,
    isLoading,
    sendMessage,
    assistantOpen,
    closeAssistant,
    prefillQuery,
  } = useAssistant()
  const clearMessages = useUIStore((s) => s.clearMessages)
  const prefillHandled = useRef(false)

  // Handle prefill query from project/section nudges
  useEffect(() => {
    if (assistantOpen && prefillQuery && !prefillHandled.current) {
      prefillHandled.current = true
      sendMessage(prefillQuery)
    }
    if (!assistantOpen) {
      prefillHandled.current = false
    }
  }, [assistantOpen, prefillQuery])

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAssistant()
    }
    if (assistantOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [assistantOpen, closeAssistant])

  if (!assistantOpen) return null

  return (
    <>
      {/* Backdrop — subtle, doesn't block scroll */}
      <div
        onClick={closeAssistant}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 92vw)',
          zIndex: 70,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(11, 11, 20, 0.82)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          animation: 'panel-slide-in 0.3s cubic-bezier(0.4,0,0.2,1) forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'var(--accent)',
                fontWeight: 600,
              }}
            >
              AI
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                Garv&apos;s AI
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.06em',
                }}
              >
                Know the reality
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius)',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')
                }
              >
                Clear
              </button>
            )}
            <button
              onClick={closeAssistant}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat area */}
        <AssistantChat
          messages={messages}
          isLoading={isLoading}
          onSuggestedQuestion={sendMessage}
        />

        {/* Input */}
        <AssistantInput onSend={sendMessage} disabled={isLoading} />
      </div>

      <style>{`
        @keyframes panel-slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}