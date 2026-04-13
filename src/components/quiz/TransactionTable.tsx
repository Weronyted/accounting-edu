import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { QuizResult } from './QuizResult'
import { useProgress } from '@/hooks/useProgress'
import { matchAnswer } from '@/utils/matchAnswer'

export interface TransactionRow {
  id: string
  transaction: string
  correctDebit: string
  correctCredit: string
  correctCategory: string // 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense'
}

interface TransactionTableProps {
  rows: TransactionRow[]
  topicSlug: string
  businessName?: string
  scenario?: string
}

const CATEGORIES = ['Asset', 'Liability', 'Equity', 'Income', 'Expense']

export function TransactionTable({ rows, topicSlug, businessName = 'Sunrise Bakery Ltd', scenario }: TransactionTableProps) {
  const { t } = useTranslation()
  const { submitQuiz } = useProgress(topicSlug)
  const [answers, setAnswers] = useState<Record<string, { debit: string; credit: string; category: string }>>({})
  const [submitted, setSubmitted] = useState(false)

  function updateAnswer(id: string, field: 'debit' | 'credit' | 'category', value: string) {
    if (submitted) return
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { debit: '', credit: '', category: '' }), [field]: value },
    }))
  }

  function cellState(id: string, field: 'debit' | 'credit' | 'category'): 'correct' | 'wrong' | 'neutral' {
    if (!submitted) return 'neutral'
    const row = rows.find((r) => r.id === id)!
    const ans = answers[id]
    if (field === 'debit') {
      return matchAnswer(ans?.debit ?? '', row.correctDebit) ? 'correct' : 'wrong'
    }
    if (field === 'credit') {
      return matchAnswer(ans?.credit ?? '', row.correctCredit) ? 'correct' : 'wrong'
    }
    return ans?.category === row.correctCategory ? 'correct' : 'wrong'
  }

  function cellClass(state: 'correct' | 'wrong' | 'neutral') {
    if (state === 'correct') return 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
    if (state === 'wrong') return 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
    return ''
  }

  async function handleSubmit() {
    setSubmitted(true)
    const answerMap: Record<string, string> = {}
    rows.forEach((r) => {
      const ans = answers[r.id] ?? {}
      answerMap[`${r.id}_debit`] = ans.debit ?? ''
      answerMap[`${r.id}_credit`] = ans.credit ?? ''
      answerMap[`${r.id}_category`] = ans.category ?? ''
    })

    let correct = 0
    rows.forEach((r) => {
      const ans = answers[r.id] ?? {}
      if (matchAnswer(ans.debit ?? '', r.correctDebit)) correct++
      if (matchAnswer(ans.credit ?? '', r.correctCredit)) correct++
      if (ans.category === r.correctCategory) correct++
    })
    const total = rows.length * 3
    const score = Math.round((correct / total) * 100)
    await submitQuiz(topicSlug, score, total, answerMap)
  }

  if (submitted) {
    let correct = 0
    const total = rows.length * 3
    const feedback: { correct: boolean; question: string; yourAnswer: string; correctAnswer: string }[] = []

    rows.forEach((r) => {
      const ans = answers[r.id] ?? {}
      const dOk = matchAnswer(ans.debit ?? '', r.correctDebit)
      const cOk = matchAnswer(ans.credit ?? '', r.correctCredit)
      const catOk = ans.category === r.correctCategory
      if (dOk) correct++
      if (cOk) correct++
      if (catOk) correct++

      feedback.push({
        correct: dOk && cOk && catOk,
        question: r.transaction,
        yourAnswer: `DR: ${ans.debit || '—'} | CR: ${ans.credit || '—'} | Cat: ${ans.category || '—'}`,
        correctAnswer: `DR: ${r.correctDebit} | CR: ${r.correctCredit} | Cat: ${r.correctCategory}`,
      })
    })

    return (
      <QuizResult
        correct={correct}
        total={total}
        topicSlug={topicSlug}
        onTryAgain={() => { setSubmitted(false); setAnswers({}) }}
        feedback={feedback}
      />
    )
  }

  return (
    <div className="my-6">
      <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-1">
        {t('quiz.title')} — Transaction Table
      </h3>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Business: {businessName}
      </p>
      {scenario && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{scenario}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-3 py-3 font-semibold text-slate-700 dark:text-slate-300 w-8">#</th>
              <th className="text-left px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">{t('quiz.transaction')}</th>
              <th className="text-left px-3 py-3 font-semibold text-slate-700 dark:text-slate-300 w-44">{t('quiz.accountDebited')}</th>
              <th className="text-left px-3 py-3 font-semibold text-slate-700 dark:text-slate-300 w-44">{t('quiz.accountCredited')}</th>
              <th className="text-left px-3 py-3 font-semibold text-slate-700 dark:text-slate-300 w-36">{t('quiz.category')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, i) => (
              <tr key={row.id} className="bg-white dark:bg-slate-900">
                <td className="px-3 py-2 text-slate-400 font-mono text-xs">{i + 1}</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300 leading-snug">{row.transaction}</td>
                <td className="px-3 py-2">
                  <div className={`relative ${cellClass(cellState(row.id, 'debit'))}`}>
                    <input
                      type="text"
                      value={answers[row.id]?.debit ?? ''}
                      onChange={(e) => updateAnswer(row.id, 'debit', e.target.value)}
                      placeholder="Account..."
                      className={`w-full px-2 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px] bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${cellClass(cellState(row.id, 'debit')) || 'border-slate-300 dark:border-slate-600'}`}
                    />
                    {submitted && cellState(row.id, 'debit') === 'wrong' && (
                      <p className="text-xs text-danger mt-0.5">→ {row.correctDebit}</p>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className={`relative ${cellClass(cellState(row.id, 'credit'))}`}>
                    <input
                      type="text"
                      value={answers[row.id]?.credit ?? ''}
                      onChange={(e) => updateAnswer(row.id, 'credit', e.target.value)}
                      placeholder="Account..."
                      className={`w-full px-2 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px] bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${cellClass(cellState(row.id, 'credit')) || 'border-slate-300 dark:border-slate-600'}`}
                    />
                    {submitted && cellState(row.id, 'credit') === 'wrong' && (
                      <p className="text-xs text-danger mt-0.5">→ {row.correctCredit}</p>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <select
                    value={answers[row.id]?.category ?? ''}
                    onChange={(e) => updateAnswer(row.id, 'category', e.target.value)}
                    className={`w-full px-2 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px] bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${cellClass(cellState(row.id, 'category')) || 'border-slate-300 dark:border-slate-600'}`}
                  >
                    <option value="">Select...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {submitted && cellState(row.id, 'category') === 'wrong' && (
                    <p className="text-xs text-danger mt-0.5">→ {row.correctCategory}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Button onClick={handleSubmit}>
          {t('quiz.submit')}
        </Button>
      </div>
    </div>
  )
}
