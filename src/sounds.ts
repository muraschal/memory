// Einen einzelnen AudioContext für alle Sounds erstellen
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

const createSound = (frequency: number, duration: number, gainValue = 0.2) => {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = frequency
  oscillator.type = 'sine'
  
  const now = audioContext.currentTime
  gainNode.gain.setValueAtTime(gainValue, now)
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)
  
  oscillator.start(now)
  oscillator.stop(now + duration)
}

export const playSound = (soundName: 'flip' | 'match' | 'wrong' | 'victory'): void => {
  const now = audioContext.currentTime
  
  switch (soundName) {
    case 'flip':
      createSound(523.25, 0.08, 0.1) // Sehr kurzer C5
      break
      
    case 'match':
      createSound(523.25, 0.1, 0.1) // C5
      createSound(659.25, 0.1, 0.1) // E5
      break
      
    case 'wrong':
      createSound(440, 0.1, 0.1) // A4
      createSound(349.23, 0.1, 0.1) // F4
      break
      
    case 'victory':
      createSound(523.25, 0.15, 0.1) // C5
      createSound(659.25, 0.15, 0.1) // E5
      createSound(783.99, 0.15, 0.1) // G5
      break
  }
}

// AudioContext beim ersten Klick initialisieren
document.addEventListener('click', () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
}, { once: true }) 