import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Loader2, Lock, Calendar, CheckCircle2 } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listAssignments } from '@/services/admin.service'
import { getMySubmission } from '@/services/submission.service'
import { useAuthStore } from '@/store/useAuthStore'
import type { Assignment } from '@/types/roles'

export function AssignmentsListPage() {
  const { user } = useAuthStore()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAssignments()
      .then((all) => {
        const published = all.filter((a) => a.published && a.type === 'internal')
        setAssignments(published)

        if (user) {
          Promise.all(
            published.map((a) =>
              getMySubmission(a.id, user.uid).then((s) => (s ? a.id : null))
            )
          ).then((results) => {
            setSubmitted(new Set(results.filter(Boolean) as string[]))
          })
        }
      })
      .finally(() => setLoading(false))
  }, [user])

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
            <ClipboardList size={20} className="text-primary dark:text-primary-dark" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
              Assignments
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All published assignments
            </p>
          </div>
        </div>

        {!user && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm border border-amber-200 dark:border-amber-800">
            <Lock size={14} />
            Sign in to take assignments.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-slate-400" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
            <p>No assignments published yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {assignments.map((a) => {
              const done = submitted.has(a.id)
              return (
                <Link
                  key={a.id}
                  to={user ? `/assignments/${a.id}` : '#'}
                  onClick={!user ? (e) => e.preventDefault() : undefined}
                  className={`block group ${!user ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Card className="h-full transition-all group-hover:shadow-md group-hover:border-primary/30 dark:group-hover:border-primary-dark/30">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="font-heading font-semibold text-slate-900 dark:text-white leading-tight">
                        {a.title}
                      </h2>
                      {done ? (
                        <Badge variant="success" className="shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Done
                        </Badge>
                      ) : (
                        <Badge variant="default" className="shrink-0">Quiz</Badge>
                      )}
                    </div>
                    {a.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                        {a.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>By {a.teacherName}</span>
                      {a.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          Due {new Date(a.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {a.maxScore && (
                      <p className="text-xs text-slate-400 mt-1">{a.maxScore} pts total</p>
                    )}
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
