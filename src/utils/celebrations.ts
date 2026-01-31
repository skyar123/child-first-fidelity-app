import confetti from 'canvas-confetti'

// Confetti celebration for completing a section
export function celebrateCompletion() {
  // Fire confetti from the center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'],
  })
}

// Big celebration for completing all sections
export function celebrateMilestone() {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#f59e0b', '#ec4899', '#06b6d4'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  frame()
}

// Subtle sparkle effect for small wins
export function sparkle() {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.7 },
    colors: ['#fbbf24', '#fcd34d', '#fef3c7'],
    ticks: 100,
    gravity: 1.2,
    scalar: 0.8,
  })
}

// Progress messages based on completion percentage
export function getProgressMessage(progress: number): { message: string; emoji: string } {
  if (progress === 0) {
    return { message: "Let's get started!", emoji: '🚀' }
  } else if (progress < 25) {
    return { message: 'Great start!', emoji: '💪' }
  } else if (progress < 50) {
    return { message: 'Making progress!', emoji: '📈' }
  } else if (progress < 75) {
    return { message: "You're halfway there!", emoji: '🎯' }
  } else if (progress < 90) {
    return { message: 'Almost done!', emoji: '🔥' }
  } else if (progress < 100) {
    return { message: 'So close!', emoji: '✨' }
  } else {
    return { message: 'Complete!', emoji: '🎉' }
  }
}

// Encouraging messages for section completion
export function getSectionCompleteMessage(): string {
  const messages = [
    'Awesome work! 🎉',
    'Section complete! 💪',
    'Nailed it! ⭐',
    'Great job! 🌟',
    'You did it! 🎊',
    'Fantastic! 🚀',
    'Well done! ✨',
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}
