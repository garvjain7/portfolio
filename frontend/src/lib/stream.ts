export async function readStream(
  response: Response,
  onChunk: (text: string) => void,
  onDone: () => void
): Promise<void> {
  const reader = response.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      if (chunk) onChunk(chunk)
    }
    onDone()
  } finally {
    reader.releaseLock()
  }
}