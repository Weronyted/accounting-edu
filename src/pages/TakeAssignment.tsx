import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, BookOpen, Loader2, ChevronRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from '@/store/useToastStore'
import { confirm } from '@/store/useConfirmStore'
import { getAssignment, submitAssignment, getMySubmission } from '@/services/submission.service'
import type { Assignment, AssignmentSubmission } from '@/types/roles'
import { LESSON_META } from '@/lessons'

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({
  submission,
  assignment,
}: {
  submission: AssignmentSubmission
  assignment: Assignment
}) {
  const pct = submission.percentage
  const passed = pct >= 60

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center space-y-6"
    >
      <div
        className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
          passed
            ? 'bg-green-100 dark:bg-green-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
        }`}
      >
        {passed ? (
          <CheckCircle2 size={40} className="text-green-500" />
        ) : (
          <XCircle size={40} className="text-red-400" />
        )}
      </div>

      <div>
        <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white mb-1">
          {passed ? 'Well done!' : 'Keep practising'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {assignment.title}
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 space-y-3">
        <div className="text-5xl font-heading font-bold text-slate-900 dark:text-white">
          {pct}%
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {submission.score} / {submission.maxScore} points
        </p>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              pct >= 80
                ? 'bg-green-500'
                : pct >= 60
                ? 'bg-yellow-500'
                : 'bg-red-400'
            }`}
          />
        </div>
      </div>

      {/* Per-question breakdown */}
      {assignment.questions && assignment.questions.length > 0 && (
        <Card className="text-left space-y-2">
          <h3 className="font-heading font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            Answer Review
          </h3>
          {assignment.questions.map((q) => {
            const given = submission.answers[q.id] ?? ''
            const isCorrect =
              q.type === 'multiple_choice'
                ? given === q.correctAnswer
                : q.type === 'true_false'
                ? given.toLowerCase() === q.correctAnswer.toLowerCase()
                : given.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()

            const correctLabel =
              q.type === 'multiple_choice'
                ? q.options?.[Number(q.correctAnswer)] ?? q.correctAnswer
                : q.correctAnswer

            return (
              <div
                key={q.id}
                className={`p-3 rounded-lg border text-sm ${
                  isCorrect
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{q.text}</p>
                    {!isCorrect && (
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                        Correct answer: <strong>{correctLabel}</strong>
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-medium shrink-0 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {isCorrect ? `+${q.points}` : '0'} pts
                  </span>
                </div>
              </div>
            )
          })}
        </Card>
      )}

      <div className="flex justify-center gap-3">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            Dashboard
          </Button>
        </Link>
        {assignment.lessonSlug && (
          <Link to={`/lessons/${assignment.lessonSlug}`}>
            <Button size="sm">
              <BookOpen size={14} /> Review Lesson
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function TakeAssignment() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [existing, setExisting] = useState<AssignmentSubmission | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<AssignmentSubmission | null>(null)
  const [currentQ, setCurrentQ] = useState(0)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getAssignment(id),
      user ? getMySubmission(id, user.uid) : Promise.resolve(null),
    ])
      .then(([a, sub]) => {
        setAssignment(a)
        setExisting(sub)
        if (sub) setResult(sub)
      })
      .finally(() => setPageLoading(false))
  }, [id, user])

  async function handleSubmit() {
    if (!assignment || !user || !id) return
    const questions = assignment.questions ?? []
    const unanswered = questions.filter((q) => !answers[q.id])
    if (unanswered.length > 0) {
      const ok = await confirm({
        title: 'Unanswered questions',
        message: `${unanswered.length} question(s) left unanswered. Submit anyway?`,
        confirmLabel: 'Submit anyway',
      })
      if (!ok) return
    }
    setSubmitting(true)
    try {
      const sub = await submitAssignment(id, user.uid, user.displayName ?? '', assignment, answers)
      setResult(sub)
      if (sub.percentage >= 80) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      }
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <p className="text-slate-500">Assignment not found.</p>
        <Link to="/dashboard" className="text-primary dark:text-primary-dark hover:underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const questions = assignment.questions ?? []

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/dashboard" className="hover:text-slate-600 dark:hover:text-slate-300">
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <span>Assignment</span>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
            {assignment.title}
          </h1>
          {assignment.description && (
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              {assignment.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            {assignment.dueDate && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Due {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            )}
            {assignment.lessonSlug && LESSON_META[assignment.lessonSlug] && (
              <Link
                to={`/lessons/${assignment.lessonSlug}`}
                className="flex items-center gap-1 text-primary dark:text-primary-dark hover:underline"
              >
                <BookOpen size={12} />
                {LESSON_META[assignment.lessonSlug].title}
              </Link>
            )}
            {questions.length > 0 && (
              <span>{questions.length} questions · {assignment.maxScore} pts</span>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            <ResultScreen key="result" submission={result} assignment={assignment} />
          ) : questions.length === 0 ? (
            <Card key="no-q" className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">
                This assignment has no questions yet.
              </p>
            </Card>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary dark:bg-primary-dark rounded-full transition-all"
                    style={{
                      width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {Object.keys(answers).length} / {questions.length} answered
                </span>
              </div>

              {/* Questions */}
              {questions.map((q, idx) => (
                <Card key={q.id}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{q.text}</p>
                    <Badge variant="default" className="shrink-0 text-xs ml-auto">
                      {q.points} pt{q.points !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {/* Multiple choice */}
                  {q.type === 'multiple_choice' && (
                    <div className="space-y-2 ml-9">
                      {(q.options ?? []).map((opt, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            answers[q.id] === String(i)
                              ? 'border-primary dark:border-primary-dark bg-primary/5 dark:bg-primary-dark/10'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={String(i)}
                            checked={answers[q.id] === String(i)}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: String(i) }))}
                            className="text-primary focus:ring-primary/30"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* True / False */}
                  {q.type === 'true_false' && (
                    <div className="flex gap-3 ml-9">
                      {(['true', 'false'] as const).map((v) => (
                        <label
                          key={v}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border cursor-pointer transition-all capitalize ${
                            answers[q.id] === v
                              ? 'border-primary dark:border-primary-dark bg-primary/5 dark:bg-primary-dark/10 text-primary dark:text-primary-dark font-medium'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={v}
                            checked={answers[q.id] === v}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: v }))}
                            className="sr-only"
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Short answer */}
                  {q.type === 'short_answer' && (
                    <input
                      className="w-full ml-9 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Your answer…"
                      value={answers[q.id] ?? ''}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    />
                  )}
                </Card>
              ))}

              <Button
                className="w-full"
                onClick={handleSubmit}
                loading={submitting}
                size="lg"
              >
                Submit Assignment
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
