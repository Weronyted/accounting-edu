import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { User, BookMarked, History, Settings } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { UserAvatar } from '@/components/auth/UserAvatar'
import { useAuthStore } from '@/store/useAuthStore'
import { useProgressStore } from '@/store/useProgressStore'
import { LESSON_META } from '@/lessons'
import { formatScore, scoreVariant } from '@/utils/formatScore'

export function Profile() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { progress } = useProgressStore()

  if (!user) {
    return (
      <PageTransition>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <User size={48} className="text-slate-300 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {t('profile.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {t('auth.signInSubtitle')}
          </p>
        </div>
      </PageTransition>
    )
  }

  const bookmarkedSections = Object.entries(progress)
    .flatMap(([slug, p]) =>
      p.bookmarks.map((sectionId) => ({
        slug,
        sectionId,
        topicTitle: LESSON_META[slug]?.title ?? slug,
      }))
    )

  const quizHistory = Object.entries(progress)
    .filter(([, p]) => p.quizAttempts > 0)
    .sort(([, a], [, b]) => b.lastVisited - a.lastVisited)

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white mb-6">
          {t('profile.title')}
        </h1>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="sm:col-span-1">
            <Card className="text-center">
              <div className="flex justify-center mb-3">
                <UserAvatar user={user} size={64} />
              </div>
              <h2 className="font-heading font-semibold text-slate-900 dark:text-white">
                {user.displayName}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Settings size={14} />
                  <span className="font-medium">{t('profile.language')}:</span>
                  <span>{localStorage.getItem('language')?.toUpperCase() ?? 'EN'}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right side */}
          <div className="sm:col-span-2 space-y-6">
            {/* Quiz history */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <History size={16} className="text-primary dark:text-primary-dark" />
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                  {t('profile.quizHistory')}
                </h3>
              </div>
              {quizHistory.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No quiz history yet. <Link to="/lessons/intro-to-accounting" className="text-primary dark:text-primary-dark hover:underline">Take a quiz</Link>
                </p>
              ) : (
                <div className="space-y-2">
                  {quizHistory.map(([slug, p]) => (
                    <div key={slug} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {LESSON_META[slug]?.title ?? slug}
                        </p>
                        <p className="text-xs text-slate-400">
                          {p.quizAttempts} {t('profile.attempts')} · {new Date(p.lastVisited).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={scoreVariant(p.quizScore)}>
                        {formatScore(p.quizScore)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Bookmarks */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BookMarked size={16} className="text-primary dark:text-primary-dark" />
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                  {t('profile.bookmarks')}
                </h3>
              </div>
              {bookmarkedSections.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('profile.noBookmarks')}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {bookmarkedSections.map(({ slug, sectionId, topicTitle }) => (
                    <Link
                      key={`${slug}-${sectionId}`}
                      to={`/lessons/${slug}#${sectionId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs font-medium hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors"
                    >
                      {topicTitle} › {sectionId.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
