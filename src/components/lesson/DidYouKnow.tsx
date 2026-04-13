import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Lightbulb } from 'lucide-react'

interface DidYouKnowProps {
  children: ReactNode
}

export function DidYouKnow({ children }: DidYouKnowProps) {
  const { t } = useTranslation()

  return (
    <div className="my-6 border-l-4 border-warning rounded-r-xl bg-amber-50 dark:bg-amber-900/10 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={18} className="text-warning" />
        <h3 className="font-heading font-semibold text-warning text-sm uppercase tracking-wide">
          {t('lessons.didYouKnow')}
        </h3>
      </div>
      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
  )
}
