'use client'
import type { Message } from '@/types/assistant'

export function AssistantMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '0.75rem',
      }}
    >
      {/* Assistant label */}
      {!isUser && (
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: '0.5rem',
            marginTop: '0.2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--accent)',
            fontWeight: 600,
          }}
        >
          AI
        </div>
      )}

      <div
        style={{
          maxWidth: '80%',
          padding: '0.65rem 1rem',
          borderRadius: isUser ? '12px 12px 4px 12px' : '4px 12px 12px 12px',
          background: isUser ? 'var(--accent-dim)' : 'var(--bg-elevated)',
          border: `1px solid ${isUser ? 'var(--accent-border)' : 'var(--border)'}`,
          color: isUser ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontFamily: isUser ? 'var(--font-display)' : 'var(--font-display)',
          fontSize: '0.85rem',
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
        {message.isStreaming && message.content === '' && (
          <span
            style={{
              display: 'inline-flex',
              gap: '3px',
              alignItems: 'center',
              height: '14px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </span>
        )}
      </div>

      <style>{`
        @keyframes typing-dot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}