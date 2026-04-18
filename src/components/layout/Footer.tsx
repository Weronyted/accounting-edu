import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, Heart, MessageCircle } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-heading font-semibold text-primary dark:text-primary-dark">
            <div className="w-6 h-6 bg-primary dark:bg-primary-dark rounded-md flex items-center justify-center">
              <BookOpen size={12} className="text-white" />
            </div>
            AccountingEdu
          </Link>

          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/glossary" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
              {t('nav.glossary')}
            </Link>
            <Link to="/dashboard" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
              {t('nav.dashboard')}
            </Link>
            <Link to="/lessons/intro-to-accounting" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
              {t('nav.lessons')}
            </Link>
            <a
              href="https://t.me/Weronyted"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              <MessageCircle size={14} />
              Support
            </a>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            {t('footer.madeWith')} <Heart size={12} className="text-danger" /> {t('footer.forLearners')}
          </p>
        </div>
      </div>
    </footer>
  )
}
