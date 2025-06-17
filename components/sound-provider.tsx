"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface SoundContextType {
  soundEnabled: boolean
  toggleSound: () => void
  playSound: (type: "high" | "medium" | "low" | "success" | "error") => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContext) {
        setAudioContext(new AudioContext())
      } else {
        console.warn("Web Audio API not supported in this browser.")
        setSoundEnabled(false) // Disable sound if API not supported
      }
    }
  }, [])

  const playSound = useCallback(
    (type: "high" | "medium" | "low" | "success" | "error") => {
      if (!soundEnabled || !audioContext) return

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      let frequency: number
      let duration = 0.1 // seconds
      let volume = 0.1

      switch (type) {
        case "high": // Navigation clicks
          frequency = 880 // A5
          break
        case "medium": // Button interactions
          frequency = 440 // A4
          break
        case "low": // Error states
          frequency = 220 // A3
          duration = 0.2
          break
        case "success": // Confirmation beep
          frequency = 660 // E5
          duration = 0.15
          volume = 0.15
          break
        case "error": // Lower tone for errors
          frequency = 180 // F#3
          duration = 0.3
          volume = 0.2
          break
        default:
          frequency = 440
      }

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    },
    [soundEnabled, audioContext],
  )

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  return <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
