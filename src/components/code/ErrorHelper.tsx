import { AlertTriangle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { explainError, type ErrorInfo } from '../../utils/errorExplainer'

interface Props {
  error: ErrorInfo
  onDismiss: () => void
}

export function ErrorHelper({ error, onDismiss }: Props) {
  const { i18n } = useTranslation()
  const isRu = i18n.language?.startsWith('ru') || i18n.language?.startsWith('uz')
  const lang = isRu ? 'ru' : 'en'

  const explanation = explainError(error)
  const ex = explanation[lang]

  const lineLabel = isRu ? 'Строка' : 'Line'
  const tipLabel = isRu ? 'Совет: ' : 'Tip: '

  return (
    <div
      role="alert"
      className="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/40 rounded-lg p-3 text-sm"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" aria-hidden />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-red-700 dark:text-red-400">{ex.title}</span>
            <button
              onClick={onDismiss}
              aria-label="Dismiss error"
              className="text-red-400 hover:text-red-600 dark:hover:text-red-300 shrink-0 rounded focus:outline-none focus:ring-1 focus:ring-red-400"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-red-700 dark:text-red-300">{ex.explanation}</p>
          <p className="text-red-600 dark:text-red-400 mt-1">
            <span className="font-medium">{tipLabel}</span>
            {ex.tip}
          </p>
          {(error.message || error.errorType) && (
            <code className="block mt-2 text-xs bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 px-2 py-1 rounded font-mono break-all">
              {error.errorType && `${error.errorType}: `}
              {error.message}
              {error.lineno ? ` · ${lineLabel} ${error.lineno}${error.colno ? `:${error.colno}` : ''}` : ''}
            </code>
          )}
        </div>
      </div>
    </div>
  )
}
