import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore()
  const { t } = useTranslation()
  const [authOpen, setAuthOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">{t('common.loading')}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm w-full text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center mx-auto">
            <Lock size={28} className="text-primary dark:text-primary-dark" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              {t('auth.requiredTitle')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {t('auth.requiredSubtitle')}
            </p>
          </div>
          <Button onClick={() => setAuthOpen(true)} className="w-full">
            {t('auth.signIn')}
          </Button>
        </motion.div>

        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    )
  }

  return <>{children}</>
}
