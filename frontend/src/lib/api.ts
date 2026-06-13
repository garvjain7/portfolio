const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function sendChatMessage(
  query: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      onError('Failed to reach the assistant. Please try again.')
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      onError('Streaming not supported.')
      return
    }

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      onChunk(chunk)
    }

    onDone()
  } catch {
    onError('Connection error. Please check your network.')
  }
}

export async function sendContactForm(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to send message.' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Connection error.' }
  }
}