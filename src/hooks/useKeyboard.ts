import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/useThemeStore'
import { LESSON_SLUGS } from '@/lessons'

interface UseKeyboardOptions {
  onSearchOpen?: () => void
}

export function useKeyboard({ onSearchOpen }: UseKeyboardOptions = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleTheme } = useThemeStore()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      const isEditable = tag === 'input' || tag === 'textarea' || tag === 'select'

      // Ctrl+K — search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onSearchOpen?.()
        return
      }

      if (isEditable) return

      // T — toggle theme
      if (e.key === 't' || e.key === 'T') {
        toggleTheme()
        return
      }

      // Arrow keys on lesson pages
      const lessonMatch = location.pathname.match(/\/lessons\/(.+)/)
      if (lessonMatch) {
        const currentSlug = lessonMatch[1]
        const idx = LESSON_SLUGS.indexOf(currentSlug)

        if (e.key === 'ArrowRight' && idx < LESSON_SLUGS.length - 1) {
          navigate(`/lessons/${LESSON_SLUGS[idx + 1]}`)
        }
        if (e.key === 'ArrowLeft' && idx > 0) {
          navigate(`/lessons/${LESSON_SLUGS[idx - 1]}`)
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, location, toggleTheme, onSearchOpen])
}
