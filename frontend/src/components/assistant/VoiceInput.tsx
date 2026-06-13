'use client'
import { useVoiceInput } from '@/hooks/useVoiceInput'

interface VoiceInputProps {
  onResult: (transcript: string) => void
  disabled?: boolean
}

export function VoiceInput({ onResult, disabled }: VoiceInputProps) {
  const { isListening, isSupported, startListening, stopListening } =
    useVoiceInput({ onResult })

  if (!isSupported) return null

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Voice input'}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: 'var(--radius)',
        background: isListening ? 'rgba(255, 80, 80, 0.15)' : 'var(--bg-elevated)',
        border: `1px solid ${isListening ? 'rgba(255,80,80,0.4)' : 'var(--border)'}`,
        color: isListening ? '#ff5050' : 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        transition: 'all var(--transition)',
        animation: isListening ? 'mic-pulse 1.5s ease-in-out infinite' : 'none',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
      <style>{`
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,80,80,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(255,80,80,0); }
        }
      `}</style>
    </button>
  )
}