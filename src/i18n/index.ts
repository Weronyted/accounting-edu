import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ru from './ru.json'
import uz from './uz.json'

const VALID_LANGS = ['en', 'ru', 'uz']

function getInitialLang(): string {
  try {
    const raw = localStorage.getItem('language')
    if (!raw) return 'en'
    // Plain string (e.g. 'ru')
    if (VALID_LANGS.includes(raw)) return raw
    // Zustand persist format: {"state":{"language":"ru"},"version":0}
    const parsed = JSON.parse(raw)
    const lang = parsed?.state?.language
    return VALID_LANGS.includes(lang) ? lang : 'en'
  } catch {
    return 'en'
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz },
    },
    lng: getInitialLang(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
