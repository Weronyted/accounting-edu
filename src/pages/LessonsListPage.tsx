import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Loader2, Lock } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listDynamicLessons } from '@/services/admin.service'
import { useAuthStore } from '@/store/useAuthStore'
import type { DynamicLesson } from '@/types/roles'

export function LessonsListPage() {
  const { user } = useAuthStore()
  const [lessons, setLessons] = useState<DynamicLesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listDynamicLessons()
      .then((all) => setLessons(all.filter((l) => l.published)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
            <BookOpen size={20} className="text-primary dark:text-primary-dark" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
              Lessons
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All published lessons
            </p>
          </div>
        </div>

        {!user && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm border border-amber-200 dark:border-amber-800">
            <Lock size={14} />
            Sign in to access lessons.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-slate-400" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p>No lessons published yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={user ? `/lessons/${lesson.slug}` : '#'}
                onClick={!user ? (e) => e.preventDefault() : undefined}
                className={`block group ${!user ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <Card className="h-full transition-all group-hover:shadow-md group-hover:border-primary/30 dark:group-hover:border-primary-dark/30">
                  {lesson.coverImageUrl && (
                    <img
                      src={lesson.coverImageUrl}
                      alt={lesson.title}
                      className="w-full h-36 object-cover rounded-lg mb-3 border border-slate-100 dark:border-slate-700"
                    />
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-heading font-semibold text-slate-900 dark:text-white leading-tight">
                      {lesson.title}
                    </h2>
                    <Badge variant="default" className="shrink-0">Lesson</Badge>
                  </div>
                  {lesson.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {lesson.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-3">
                    By {lesson.createdByName} · {new Date(lesson.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
