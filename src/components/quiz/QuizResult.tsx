import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { LESSON_SLUGS } from '@/lessons'

interface QuizResultProps {
  correct: number
  total: number
  topicSlug: string
  onTryAgain: () => void
  feedback: { correct: boolean; question: string; yourAnswer: string; correctAnswer: string }[]
}

export function QuizResult({ correct, total, topicSlug, onTryAgain, feedback }: QuizResultProps) {
  const { t } = useTranslation()
  const percent = Math.round((correct / total) * 100)
  const fired = useRef(false)

  useEffect(() => {
    if (percent >= 80 && !fired.current) {
      fired.current = true
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3B5BDB', '#7950F2', '#2F9E44', '#F08C00'],
      })
    }
  }, [percent])

  const nextIdx = LESSON_SLUGS.indexOf(topicSlug) + 1
  const nextSlug = nextIdx < LESSON_SLUGS.length ? LESSON_SLUGS[nextIdx] : null

  const getMessage = () => {
    if (percent === 100) return t('quiz.perfect')
    if (percent >= 80) return t('quiz.great')
    if (percent >= 50) return t('quiz.good')
    return t('quiz.keepTrying')
  }

  // Circumference of circle r=44: 2π*44 ≈ 276
  const circumference = 2 * Math.PI * 44
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
    >
      {/* Score banner */}
      <div className={`px-6 py-8 text-center ${percent >= 80 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
        {/* Progress ring */}
        <div className="flex justify-center mb-4">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200 dark:text-slate-700"
              />
              <motion.circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={percent >= 80 ? 'text-success' : percent >= 50 ? 'text-warning' : 'text-danger'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-2xl font-bold font-heading text-slate-900 dark:text-white"
              >
                {percent}%
              </motion.span>
            </div>
          </div>
        </div>

        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          {t('quiz.score', { correct, total, percent })}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{getMessage()}</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 p-5 border-b border-slate-100 dark:border-slate-700">
        <Button variant="outline" size="sm" onClick={onTryAgain} className="gap-1.5">
          <RotateCcw size={14} /> {t('quiz.tryAgain')}
        </Button>
        {nextSlug && (
          <Button size="sm" asChild className="gap-1.5">
            <Link to={`/lessons/${nextSlug}`}>
              {t('quiz.nextTopic')} <ArrowRight size={14} />
            </Link>
          </Button>
        )}
      </div>

      {/* Feedback list */}
      <div className="p-5 space-y-3">
        <h3 className="font-heading font-semibold text-slate-800 dark:text-slate-200 text-sm">
          Answer Review
        </h3>
        {feedback.map((f, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
              f.correct
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            {f.correct
              ? <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
              : <XCircle size={16} className="text-danger mt-0.5 flex-shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{f.question}</p>
              {!f.correct && (
                <>
                  <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">
                    Your answer: {f.yourAnswer || '—'}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">
                    Correct: {f.correctAnswer}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
