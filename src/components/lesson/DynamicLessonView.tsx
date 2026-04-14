import { useState } from 'react'
import DOMPurify from 'dompurify'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, BookOpen, ChevronRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { DynamicLesson, LessonQuizQuestion } from '@/types/roles'

// ─── Safe HTML renderer ───────────────────────────────────────────────────────

function SafeHTML({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1','h2','h3','h4','h5','h6',
      'p','br','strong','em','s','u','code','pre','blockquote','hr',
      'ul','ol','li',
      'a','img',
      'table','thead','tbody','tr','th','td',
      'figure','figcaption','div','span',
    ],
    ALLOWED_ATTR: ['href','src','alt','class','target','rel','style','colspan','rowspan'],
  })

  return (
    <div
      className="prose-editor"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

// ─── Lesson Quiz ──────────────────────────────────────────────────────────────

function LessonQuiz({ questions }: { questions: LessonQuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  function handleSubmit() {
    let correct = 0
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct++
    }
    setScore(correct)
    setSubmitted(true)
    if (correct / questions.length >= 0.8) {
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.7 } })
    }
  }

  const pct = submitted ? Math.round((score / questions.length) * 100) : 0

  return (
    <div className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-8">
      <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <BookOpen size={20} className="text-primary dark:text-primary-dark" />
        Lesson Quiz
      </h2>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <p className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {pct}%
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {score} / {questions.length} correct
              </p>
              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-400'}`}
                />
              </div>
            </div>

            {questions.map((q, i) => {
              const given = answers[q.id]
              const correct = given === q.correctIndex
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    correct
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {correct ? (
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    )}
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {i + 1}. {q.text}
                    </p>
                  </div>
                  {!correct && (
                    <p className="text-xs text-green-700 dark:text-green-400 ml-6">
                      Correct answer: <strong>{q.options[q.correctIndex]}</strong>
                    </p>
                  )}
                </div>
              )
            })}

            <Button variant="outline" size="sm" onClick={() => { setAnswers({}); setSubmitted(false) }}>
              Try Again
            </Button>
          </motion.div>
        ) : (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {questions.map((q, i) => (
              <Card key={q.id}>
                <p className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                  {i + 1}. {q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        answers[q.id] === idx
                          ? 'border-primary dark:border-primary-dark bg-primary/5 dark:bg-primary-dark/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`lq-${q.id}`}
                        checked={answers[q.id] === idx}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                        className="text-primary focus:ring-primary/30"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
                    </label>
                  ))}
                </div>
              </Card>
            ))}

            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
            >
              Submit Quiz <ChevronRight size={16} />
            </Button>
            {Object.keys(answers).length < questions.length && (
              <p className="text-xs text-slate-400 mt-1">
                Answer all {questions.length} questions to submit.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Full Dynamic Lesson View ─────────────────────────────────────────────────

export function DynamicLessonView({ lesson }: { lesson: DynamicLesson }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {lesson.coverImageUrl && (
        <img
          src={lesson.coverImageUrl}
          alt={lesson.title}
          className="w-full h-48 sm:h-64 object-cover rounded-2xl mb-8 border border-slate-200 dark:border-slate-700"
        />
      )}

      <div className="mb-8">
        <Badge variant="default" className="mb-3">Lesson</Badge>
        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-slate-500 dark:text-slate-400">{lesson.description}</p>
        )}
      </div>

      <SafeHTML html={lesson.content} />

      {lesson.quiz && lesson.quiz.length > 0 && (
        <LessonQuiz questions={lesson.quiz} />
      )}
    </div>
  )
}
