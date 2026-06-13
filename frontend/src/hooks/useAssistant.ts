'use client'
import { useCallback } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { sendChatMessage } from '@/lib/api'
import type { Message } from '@/types/assistant'

export function useAssistant() {
  const {
    messages,
    addMessage,
    updateLastMessage,
    isLoading,
    setLoading,
    prefillQuery,
    openAssistant,
    closeAssistant,
    assistantOpen,
  } = useUIStore()

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: query.trim(),
        timestamp: new Date(),
      }

      addMessage(userMsg)
      setLoading(true)

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      }

      addMessage(assistantMsg)

      let accumulated = ''

      await sendChatMessage(
        query,
        (chunk) => {
          accumulated += chunk
          updateLastMessage(accumulated)
        },
        () => {
          setLoading(false)
          updateLastMessage(accumulated)
        },
        (error) => {
          setLoading(false)
          updateLastMessage(`Error: ${error}`)
        }
      )
    },
    [isLoading, addMessage, updateLastMessage, setLoading]
  )

  return {
    messages,
    isLoading,
    sendMessage,
    assistantOpen,
    openAssistant,
    closeAssistant,
    prefillQuery,
  }
}