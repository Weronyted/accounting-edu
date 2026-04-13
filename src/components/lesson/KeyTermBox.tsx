import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'

interface Term {
  term: string
  definition: string
  example?: string
}

interface KeyTermBoxProps {
  terms: Term[]
  title?: string
}

export function KeyTermBox({ terms, title = 'Key Terms' }: KeyTermBoxProps) {
  return (
    <div className="my-6 border-l-4 border-primary dark:border-primary-dark rounded-r-xl bg-blue-50 dark:bg-blue-900/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-primary dark:text-primary-dark" />
        <h3 className="font-heading font-semibold text-primary dark:text-primary-dark">{title}</h3>
      </div>
      <dl className="space-y-3">
        {terms.map((t) => (
          <div key={t.term}>
            <dt className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{t.term}</dt>
            <dd className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{t.definition}</dd>
            {t.example && (
              <dd className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 italic">
                e.g. {t.example}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  )
}

interface KeyTermBoxSingleProps {
  children: ReactNode
}

export function CalloutBox({ children, type = 'info' }: { children: ReactNode; type?: 'info' | 'warning' | 'success' | 'tip' }) {
  const styles = {
    info: 'border-info bg-blue-50 dark:bg-blue-900/10 text-info',
    warning: 'border-warning bg-amber-50 dark:bg-amber-900/10 text-warning',
    success: 'border-success bg-green-50 dark:bg-green-900/10 text-success',
    tip: 'border-secondary bg-purple-50 dark:bg-purple-900/10 text-secondary dark:text-secondary-dark',
  }

  return (
    <div className={`my-4 border-l-4 rounded-r-xl p-4 ${styles[type]}`}>
      {children}
    </div>
  )
}
