'use client'
import { useCallback, useRef, useState } from 'react'

interface UseVoiceInputOptions {
  onResult: (transcript: string) => void
  onError?: (error: string) => void
}

export function useVoiceInput({ onResult, onError }: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null)

  const isSupported =
    typeof window !== 'undefined' &&
    !!(
      (window as typeof window & { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    )

  const startListening = useCallback(() => {
    const SpeechRecognitionConstructor =
      (window as typeof window & { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition

    if (!SpeechRecognitionConstructor) {
      onError?.('Voice input is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognitionConstructor()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onError?.(`Voice error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [onResult, onError])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return { isListening, isSupported, startListening, stopListening }
}