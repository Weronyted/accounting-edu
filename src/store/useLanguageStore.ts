import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/i18n'

type Language = 'en' | 'ru' | 'uz'

interface LanguageStore {
  language: Language
  setLanguage: (lang: Language) => void
  cycleLanguage: () => void
}

const LANGS: Language[] = ['en', 'ru', 'uz']

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => {
        set({ language })
        i18n.changeLanguage(language)
        localStorage.setItem('language', language)
      },
      cycleLanguage: () => {
        const current = get().language
        const idx = LANGS.indexOf(current)
        const next = LANGS[(idx + 1) % LANGS.length]
        get().setLanguage(next)
      },
    }),
    { name: 'language' }
  )
)
