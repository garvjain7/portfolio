import { create } from 'zustand'
import type { Message } from '@/types/assistant'

interface UIStore {
  // Welcome screen
  welcomeDismissed: boolean
  dismissWelcome: () => void

  // Portal animation
  portalOpened: boolean
  setPortalOpened: (opened: boolean) => void

  // Sound
  soundEnabled: boolean
  toggleSound: () => void

  // Assistant panel
  assistantOpen: boolean
  prefillQuery: string | null
  openAssistant: (prefill?: string) => void
  closeAssistant: () => void

  // Messages
  messages: Message[]
  addMessage: (message: Message) => void
  updateLastMessage: (content: string) => void
  clearMessages: () => void

  // Loading
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // Project overlay
  activeProjectId: string | null
  openProject: (id: string) => void
  closeProject: () => void

  // Resume overlay
  resumeOpen: boolean
  openResume: () => void
  closeResume: () => void
}

export type StoreState = UIStore

export const useUIStore = create<UIStore>((set) => ({
  welcomeDismissed: false,
  dismissWelcome: () => set({ welcomeDismissed: true }),

  portalOpened: false,
  setPortalOpened: (opened: boolean) => set({ portalOpened: opened }),

  soundEnabled: true,
  toggleSound: () => set((s: UIStore) => ({ soundEnabled: !s.soundEnabled })),

  assistantOpen: false,
  prefillQuery: null,
  openAssistant: (prefill?: string) =>
    set({ assistantOpen: true, prefillQuery: prefill ?? null }),
  closeAssistant: () => set({ assistantOpen: false, prefillQuery: null }),

  messages: [],
  addMessage: (message: Message) =>
    set((s: UIStore) => ({ messages: [...s.messages, message] })),
  updateLastMessage: (content: string) =>
    set((s: UIStore) => {
      const msgs = [...s.messages]
      if (msgs.length === 0) return s
      msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content }
      return { messages: msgs }
    }),
  clearMessages: () => set({ messages: [] }),

  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  activeProjectId: null,
  openProject: (id: string) => set({ activeProjectId: id }),
  closeProject: () => set({ activeProjectId: null }),

  resumeOpen: false,
  openResume: () => set({ resumeOpen: true }),
  closeResume: () => set({ resumeOpen: false }),
}))