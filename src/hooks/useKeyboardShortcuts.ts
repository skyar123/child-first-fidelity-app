import { useEffect, useCallback } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  description: string
  action: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault()
          shortcut.action()
          return
        }
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Common navigation shortcuts for sections
export function useSectionNavigation(
  sections: string[],
  currentIndex: number,
  onNavigate: (index: number) => void
) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'ArrowLeft',
      alt: true,
      description: 'Previous section',
      action: () => {
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1)
        }
      },
    },
    {
      key: 'ArrowRight',
      alt: true,
      description: 'Next section',
      action: () => {
        if (currentIndex < sections.length - 1) {
          onNavigate(currentIndex + 1)
        }
      },
    },
    // Number keys 1-9 for quick navigation
    ...Array.from({ length: Math.min(9, sections.length) }, (_, i) => ({
      key: String(i + 1),
      alt: true,
      description: `Go to section ${i + 1}`,
      action: () => onNavigate(i),
    })),
  ]

  useKeyboardShortcuts(shortcuts)
}
