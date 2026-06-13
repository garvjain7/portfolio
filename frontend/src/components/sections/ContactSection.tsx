'use client'
import { useState } from 'react'
import { sendContactForm } from '@/lib/api'

interface FormState {
  name: string
  email: string
  message: string
}

export function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    const result = await sendContactForm(form)
    if (result.success) {
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } else {
      setStatus('error')
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focusedField === field ? 'var(--accent)' : 'var(--border)'}`,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    padding: '0.5rem 0',
    outline: 'none',
    transition: 'border-color var(--transition)',
    caretColor: 'var(--accent)',
  })

  return (
    <section
      id="contact"
      style={{
        padding: '5rem 2rem 8rem',
        maxWidth: '700px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--accent)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          Get in Touch
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Contact
        </h2>
      </div>

      {/* Terminal form */}
      <div
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Terminal bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
            <div
              key={color}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: color,
                opacity: 0.7,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: '0.5rem',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}
          >
            garv@workspace:~
          </span>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {(['name', 'email', 'message'] as const).map((field) => (
            <div key={field}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: field === 'message' ? 'flex-start' : 'center',
                }}
              >
                <span
                  style={{
                    color: 'var(--accent)',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    marginTop: field === 'message' ? '0.5rem' : 0,
                  }}
                >
                  &gt;
                </span>
                {field === 'message' ? (
                  <textarea
                    placeholder={`${field}_`}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    style={{
                      ...inputStyle(field),
                      resize: 'none',
                      paddingTop: '0.5rem',
                    }}
                  />
                ) : (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={`${field}_`}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle(field)}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>&gt;</span>
            <button
              onClick={handleSubmit}
              disabled={status === 'sending' || status === 'sent'}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius)',
                background:
                  status === 'sent'
                    ? 'rgba(40, 200, 100, 0.15)'
                    : 'var(--accent-dim)',
                border: `1px solid ${status === 'sent' ? 'rgba(40,200,100,0.3)' : 'var(--accent-border)'}`,
                color: status === 'sent' ? '#28c864' : 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                cursor: status === 'sending' || status === 'sent' ? 'default' : 'pointer',
                transition: 'all var(--transition)',
                letterSpacing: '0.04em',
              }}
            >
              {status === 'idle' && './send_message.sh'}
              {status === 'sending' && 'Sending...'}
              {status === 'sent' && '✓ Sent'}
              {status === 'error' && './retry.sh'}
            </button>
          </div>

          {/* Inline response */}
          {status === 'sent' && (
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#28c864',
                paddingLeft: '1.5rem',
                animation: 'fade-in 0.3s ease forwards',
              }}
            >
              &gt; Message sent. Garv will respond shortly.
            </p>
          )}
          {status === 'error' && (
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#ff5f57',
                paddingLeft: '1.5rem',
              }}
            >
              &gt; Error: failed to send. Try again.
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}