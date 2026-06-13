export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface StreamChunk {
  text: string
  done: boolean
}

export interface AssistantState {
  isOpen: boolean
  messages: Message[]
  isLoading: boolean
  prefillQuery: string | null
}