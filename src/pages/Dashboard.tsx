import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Trophy, Flame, CheckCircle2, Circle, Clock, ArrowRight, Lock } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useProgress } from '@/hooks/useProgress'
import { useAuthStore } from '@/store/useAuthStore'
import { LESSON_SLUGS, LESSON_META } from '@/lessons'
import { formatScore, scoreVariant } from '@/utils/formatScore'

const BADGES = [
  { id: 'firstStep', icon: '🌱', titleKey: 'dashboard.badges.firstStep', descKey: 'dashboard.badges.firstStepDesc', required: 1 },
  { id: 'bookkeeper', icon: '📒', titleKey: 'dashboard.badges.bookkeeper', descKey: 'dashboard.badges.bookkeeperDesc', required: 3 },
  { id: 'accountant', icon: '💼', titleKey: 'dashboard.badges.accountant', descKey: 'dashboard.badges.accountantDesc', required: 6 },
  { id: 'seniorAccountant', icon: '🏆', titleKey: 'dashboard.badges.seniorAccountant', descKey: 'dashboard.badges.seniorAccountantDesc', required: 9 },
  { id: 'cfo', icon: '👑', titleKey: 'dashboard.badges.cfo', descKey: 'dashboard.badges.cfoDesc', required: 8 },
]

export function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { allProgress, streak, completedCount } = useProgress()

  const radarData = LESSON_SLUGS.map((slug) => ({
    subject: LESSON_META[slug].title.split(' ')[0],
    score: allProgress[slug]?.quizScore ?? 0,
  }))

  function getStatus(slug: string) {
    const p = allProgress[slug]
    if (!p || p.lastVisited === 0) return 'notStarted'
    if (p.completed) return 'completed'
    return 'inProgress'
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
              {t('dashboard.welcome', { name: user?.displayName ?? 'Learner' })}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t('dashboard.topicsCompleted', { completed: completedCount, total: 8 })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <Flame size={18} className="text-orange-500" />
              <span className="font-semibold text-orange-700 dark:text-orange-400">{streak}</span>
              <span className="text-sm text-orange-600 dark:text-orange-400">{t('dashboard.streakDesc')}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Topic grid */}
          <div className="lg:col-span-2">
            <h2 className="font-heading font-semibold text-slate-900 dark:text-white mb-4">
              {t('dashboard.progress')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {LESSON_SLUGS.map((slug, i) => {
                const meta = LESSON_META[slug]
                const status = getStatus(slug)
                const score = allProgress[slug]?.quizScore ?? 0

                return (
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card padding="sm" className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{meta.title}</p>
                          {status === 'completed' && <CheckCircle2 size={16} className="text-success flex-shrink-0 mt-0.5" />}
                          {status === 'inProgress' && <Clock size={16} className="text-warning flex-shrink-0 mt-0.5" />}
                          {status === 'notStarted' && <Circle size={16} className="text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5" />}
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <Badge variant={status === 'completed' ? 'success' : status === 'inProgress' ? 'warning' : 'default'} className="text-[10px]">
                            {t(`dashboard.status.${status}`)}
                          </Badge>
                          {score > 0 && (
                            <Badge variant={scoreVariant(score)} className="text-[10px]">
                              {formatScore(score)}
                            </Badge>
                          )}
                        </div>
                        <Link to={`/lessons/${slug}`}>
                          <Button size="sm" variant={status === 'notStarted' ? 'primary' : 'outline'} className="mt-2 w-full text-xs py-1 min-h-0 h-7">
                            {t(`dashboard.buttons.${status === 'notStarted' ? 'start' : status === 'inProgress' ? 'continue' : 'review'}`)}
                            <ArrowRight size={12} />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Radar chart */}
            <Card>
              <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-4 text-sm">
                {t('dashboard.radarTitle')}
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#3B5BDB"
                    fill="#3B5BDB"
                    fillOpacity={0.25}
                  />
                  <Tooltip formatter={(v) => `${v}%`} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Badges */}
            <Card>
              <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-4 text-sm">
                {t('dashboard.badgesTitle')}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {BADGES.map((badge) => {
                  const earned = completedCount >= badge.required
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center ${
                        earned ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 'bg-slate-50 dark:bg-slate-800 opacity-50'
                      }`}>
                        <span className="text-2xl">{badge.icon}</span>
                        <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
                          {t(badge.titleKey)}
                        </p>
                        {!earned && <Lock size={10} className="text-slate-400" />}
                      </div>
                    </motion.div>
                  )
                })}

                {/* Perfect score badge */}
                {(() => {
                  const perfect = Object.values(allProgress).some((p) => p.quizScore === 100)
                  return (
                    <div className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center ${
                      perfect ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 'bg-slate-50 dark:bg-slate-800 opacity-50'
                    }`}>
                      <span className="text-2xl">⭐</span>
                      <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
                        {t('dashboard.badges.perfectScore')}
                      </p>
                      {!perfect && <Lock size={10} className="text-slate-400" />}
                    </div>
                  )
                })()}
              </div>
            </Card>

            {/* Recent activity */}
            <Card>
              <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-3 text-sm">
                {t('dashboard.recentActivity')}
              </h3>
              <div className="space-y-2">
                {Object.entries(allProgress)
                  .filter(([, p]) => p.lastVisited > 0)
                  .sort(([, a], [, b]) => b.lastVisited - a.lastVisited)
                  .slice(0, 5)
                  .map(([slug, p]) => (
                    <div key={slug} className="flex items-center gap-2">
                      <span className="text-sm">{LESSON_META[slug]?.icon ?? '📚'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 dark:text-slate-300 truncate">{LESSON_META[slug]?.title}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(p.lastVisited).toLocaleDateString()}
                        </p>
                      </div>
                      {p.quizScore > 0 && (
                        <Badge variant={scoreVariant(p.quizScore)} className="text-[10px]">
                          {formatScore(p.quizScore)}
                        </Badge>
                      )}
                    </div>
                  ))}
                {Object.keys(allProgress).length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">{t('dashboard.noActivity')}</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
