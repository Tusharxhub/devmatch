// Enhanced AI Sound Manager with futuristic effects
class AIFuturisticSoundManager {
  private audioContext: AudioContext | null = null
  private sounds: { [key: string]: AudioBuffer } = {}
  private enabled = true
  private masterVolume = 0.3

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  // Create futuristic AI sounds using Web Audio API
  private createAISound(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    modulation?: { freq: number; depth: number },
  ): void {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filterNode = this.audioContext.createBiquadFilter()

    // Add modulation for AI-like effects
    let modulatorOsc: OscillatorNode | null = null
    let modulatorGain: GainNode | null = null

    if (modulation) {
      modulatorOsc = this.audioContext.createOscillator()
      modulatorGain = this.audioContext.createGain()

      modulatorOsc.frequency.value = modulation.freq
      modulatorGain.gain.value = modulation.depth

      modulatorOsc.connect(modulatorGain)
      modulatorGain.connect(oscillator.frequency)
    }

    // Setup filter for futuristic sound
    filterNode.type = "lowpass"
    filterNode.frequency.value = frequency * 2
    filterNode.Q.value = 1

    oscillator.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    // AI-style envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    // Frequency sweep for AI effect
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)

    if (modulatorOsc) {
      modulatorOsc.start(this.audioContext.currentTime)
      modulatorOsc.stop(this.audioContext.currentTime + duration)
    }
  }

  // Create complex AI chord
  private createAIChord(frequencies: number[], duration: number): void {
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createAISound(freq, duration * 0.8, "sine", { freq: 5, depth: 10 })
      }, index * 20)
    })
  }

  // Navigation sounds with AI personality
  playNavigationClick(): void {
    // Futuristic beep with harmonic
    this.createAISound(800, 0.15, "triangle", { freq: 3, depth: 20 })
    setTimeout(() => {
      this.createAISound(1200, 0.08, "sine")
    }, 50)
  }

  playButtonClick(): void {
    // AI confirmation sound
    this.createAISound(600, 0.12, "square", { freq: 8, depth: 15 })
    setTimeout(() => {
      this.createAISound(900, 0.06, "triangle")
    }, 40)
  }

  playSuccessSound(): void {
    // AI success chord progression
    const successChord = [523, 659, 784, 1047] // C major chord
    this.createAIChord(successChord, 0.3)
  }

  playErrorSound(): void {
    // AI error sound with distortion
    this.createAISound(200, 0.25, "sawtooth", { freq: 2, depth: 50 })
    setTimeout(() => {
      this.createAISound(150, 0.15, "square")
    }, 100)
  }

  playHoverSound(): void {
    // Subtle AI hover with modulation
    this.createAISound(400, 0.08, "sine", { freq: 10, depth: 5 })
  }

  playAIProcessing(): void {
    // AI thinking/processing sound
    this.createAISound(300, 0.5, "sawtooth", { freq: 1.5, depth: 30 })
  }

  playDataTransfer(): void {
    // Data transfer/sync sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createAISound(800 + i * 100, 0.05, "square")
      }, i * 30)
    }
  }

  playNeuralActivation(): void {
    // Neural network activation
    const frequencies = [440, 554, 659, 880]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createAISound(freq, 0.1, "sine", { freq: 20, depth: 10 })
      }, index * 25)
    })
  }

  playSystemBoot(): void {
    // AI system boot sequence
    const bootSequence = [220, 330, 440, 660, 880]
    bootSequence.forEach((freq, index) => {
      setTimeout(() => {
        this.createAISound(freq, 0.2, "triangle", { freq: 2, depth: 20 })
      }, index * 100)
    })
  }

  playHologramActivate(): void {
    // Hologram activation sound
    this.createAISound(1000, 0.3, "sine", { freq: 15, depth: 100 })
    setTimeout(() => {
      this.createAISound(1500, 0.2, "triangle")
    }, 150)
  }

  // Volume and settings
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  toggleSound(): void {
    this.enabled = !this.enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  getVolume(): number {
    return this.masterVolume
  }
}

// Export singleton instance
export const soundManager = new AIFuturisticSoundManager()
