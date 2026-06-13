'use client'
import { useEffect, useRef } from 'react'
import { AssistantMessage } from './AssistantMessage'
import type { Message } from '@/types/assistant'

const SUGGESTED_QUESTIONS = [
  "What is Garv's strongest project?",
  "What role is Garv best suited for?",
  "How does Garv approach system design?",
  "What's Garv's backend experience?",
]

interface AssistantChatProps {
  messages: Message[]
  isLoading: boolean
  onSuggestedQuestion: (q: string) => void
}

export function AssistantChat({
  messages,
  isLoading,
  onSuggestedQuestion,
}: AssistantChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isEmpty = messages.length === 0

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isEmpty ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          {/* Empty state */}
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--accent)',
                fontWeight: 600,
              }}
            >
              AI
            </div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              Ask me anything about Garv&apos;s work, experience, or engineering decisions.
            </p>
          </div>

          {/* Suggested questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              Try asking
            </p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => onSuggestedQuestion(q)}
                style={{
                  padding: '0.6rem 0.875rem',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {messages.map((msg) => (
            <AssistantMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}