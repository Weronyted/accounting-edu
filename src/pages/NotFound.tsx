import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <PageTransition>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-8xl font-heading font-bold text-slate-200 dark:text-slate-700 mb-4">404</p>
        <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          {t('errors.notFound')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">{t('errors.notFoundDesc')}</p>
        <Button asChild>
          <Link to="/" className="gap-2">
            <Home size={16} /> {t('errors.backHome')}
          </Link>
        </Button>
      </div>
    </PageTransition>
  )
}
