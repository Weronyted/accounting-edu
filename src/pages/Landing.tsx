import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, BarChart2, Globe, Zap } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LESSON_META, LESSON_SLUGS } from '@/lessons'

// Floating shapes config
const SHAPES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 20 + Math.random() * 60,
  opacity: 0.04 + Math.random() * 0.08,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * 4,
  shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'triangle',
}))

export function Landing() {
  const { t } = useTranslation()

  const features = [
    { icon: Zap, title: t('landing.features.interactive.title'), desc: t('landing.features.interactive.desc') },
    { icon: BookOpen, title: t('landing.features.quizzes.title'), desc: t('landing.features.quizzes.desc') },
    { icon: BarChart2, title: t('landing.features.progress.title'), desc: t('landing.features.progress.desc') },
    { icon: Globe, title: t('landing.features.free.title'), desc: t('landing.features.free.desc') },
  ]

  return (
    <PageTransition>
      {/* Hero section */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Background animated shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {SHAPES.map((s) => (
            <motion.div
              key={s.id}
              className="absolute"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
              }}
              animate={{
                y: [-20, 10, -20],
                rotate: [0, 5, -3, 0],
                x: [-5, 5, -5],
              }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {s.shape === 'circle' && (
                <div className="w-full h-full rounded-full bg-primary dark:bg-primary-dark" />
              )}
              {s.shape === 'square' && (
                <div className="w-full h-full rounded-xl bg-secondary dark:bg-secondary-dark" />
              )}
              {s.shape === 'triangle' && (
                <svg viewBox="0 0 100 86" className="w-full h-full">
                  <polygon points="50,0 100,86 0,86" className="fill-primary dark:fill-primary-dark" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark text-sm font-medium mb-6">
              <BookOpen size={14} />
              {t('landing.hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-700 text-slate-900 dark:text-white leading-tight"
          >
            {t('landing.hero.title')}{' '}
            <span className="text-primary dark:text-primary-dark">
              {t('landing.hero.titleHighlight')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            {t('landing.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button size="lg" asChild>
              <Link to="/lessons/intro-to-accounting" className="flex items-center gap-2">
                {t('landing.hero.cta')} <ArrowRight size={16} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">{t('landing.hero.ctaSecondary')}</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: t('landing.hero.stats.lessons'), label: t('landing.hero.stats.lessonsDesc') },
              { value: t('landing.hero.stats.quizzes'), label: t('landing.hero.stats.quizzesDesc') },
              { value: t('landing.hero.stats.free'), label: t('landing.hero.stats.freeDesc') },
            ].map((stat) => (
              <div key={stat.value} className="text-center">
                <p className="font-heading font-semibold text-xl text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-600 text-center text-slate-900 dark:text-white mb-12">
            {t('landing.features.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full" hover>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-primary dark:text-primary-dark" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-600 text-slate-900 dark:text-white">
              {t('landing.topics.title')}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{t('landing.topics.subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {LESSON_SLUGS.map((slug, i) => {
              const meta = LESSON_META[slug]
              return (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/lessons/${slug}`}>
                    <Card hover className="flex items-start gap-3 group">
                      <span className="text-2xl flex-shrink-0">{meta.icon}</span>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
                          {meta.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {meta.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-primary dark:bg-slate-800">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-heading text-3xl font-600 text-white mb-3">
            {t('landing.cta.title')}
          </h2>
          <p className="text-blue-100 dark:text-slate-300 mb-8">{t('landing.cta.subtitle')}</p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/lessons/intro-to-accounting" className="flex items-center gap-2">
              {t('landing.cta.button')} <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </PageTransition>
  )
}
