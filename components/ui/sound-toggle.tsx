"use client"

import { Button } from "@/components/ui/button"
import { Volume1, VolumeX } from "lucide-react"
import { useSound } from "@/components/sound-provider"

export function SoundToggle() {
  const { soundEnabled, toggleSound, playSound } = useSound()

  const handleClick = () => {
    toggleSound()
    if (!soundEnabled) {
      // If sound is about to be enabled, play a high beep
      playSound("high")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
    >
      {soundEnabled ? <Volume1 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </Button>
  )
}
