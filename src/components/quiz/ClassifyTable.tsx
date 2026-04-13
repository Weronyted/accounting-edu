import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { QuizResult } from './QuizResult'
import { useProgress } from '@/hooks/useProgress'

export interface ClassifyRow {
  id: string
  accountName: string
  correctClassification: string
}

const CLASSIFICATIONS = [
  'Current Asset',
  'Non-Current Asset',
  'Current Liability',
  'Non-Current Liability',
  'Income',
  'Expense',
  'Equity',
]

interface ClassifyTableProps {
  rows: ClassifyRow[]
  topicSlug: string
  businessContext?: string
}

export function ClassifyTable({ rows, topicSlug, businessContext }: ClassifyTableProps) {
  const { t } = useTranslation()
  const { submitQuiz } = useProgress(topicSlug)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(id: string, value: string) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSubmit() {
    setSubmitted(true)
    const answerMap: Record<string, string> = {}
    rows.forEach((r) => { answerMap[r.id] = answers[r.id] ?? '' })
    const correct = rows.filter((r) => answers[r.id] === r.correctClassification).length
    const score = Math.round((correct / rows.length) * 100)
    await submitQuiz(topicSlug, score, rows.length, answerMap)
  }

  if (submitted) {
    const correct = rows.filter((r) => answers[r.id] === r.correctClassification).length
    const feedback = rows.map((r) => ({
      correct: answers[r.id] === r.correctClassification,
      question: r.accountName,
      yourAnswer: answers[r.id] ?? '',
      correctAnswer: r.correctClassification,
    }))
    return (
      <QuizResult
        correct={correct}
        total={rows.length}
        topicSlug={topicSlug}
        onTryAgain={() => { setSubmitted(false); setAnswers({}) }}
        feedback={feedback}
      />
    )
  }

  return (
    <div className="my-6">
      <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-2">
        {t('quiz.title')} — {t('quiz.classification')}
      </h3>
      {businessContext && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{businessContext}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 w-8">#</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{t('quiz.account')}</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{t('quiz.classification')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, i) => (
              <tr key={row.id} className="bg-white dark:bg-slate-900">
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">{row.accountName}</td>
                <td className="px-4 py-3">
                  <select
                    value={answers[row.id] ?? ''}
                    onChange={(e) => handleChange(row.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px]"
                  >
                    <option value="">Select...</option>
                    {CLASSIFICATIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < rows.length}
        >
          {t('quiz.submit')}
        </Button>
      </div>
    </div>
  )
}
