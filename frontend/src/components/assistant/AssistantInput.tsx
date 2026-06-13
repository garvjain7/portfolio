'use client'
import { useState, useRef, KeyboardEvent } from 'react'
import { VoiceInput } from './VoiceInput'

interface AssistantInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function AssistantInput({ onSend, disabled }: AssistantInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    // Auto-grow textarea
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div
      style={{
        padding: '0.75rem',
        borderTop: '1px solid var(--border)',
        background: 'rgba(9,9,15,0.5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-end',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          transition: 'border-color var(--transition)',
        }}
        onFocus={() => {}}
      >
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about Garv..."
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            resize: 'none',
            caretColor: 'var(--accent)',
            maxHeight: '120px',
            overflowY: 'auto',
          }}
        />
        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center' }}>
          <VoiceInput
            onResult={(t) => {
              setValue(t)
              setTimeout(handleSend, 100)
            }}
            disabled={disabled}
          />
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius)',
              background: value.trim() && !disabled ? 'var(--accent)' : 'var(--bg-surface)',
              border: '1px solid transparent',
              color: value.trim() && !disabled ? '#000' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
              transition: 'all var(--transition)',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: '0.4rem',
        }}
      >
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  )
}