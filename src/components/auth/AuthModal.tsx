import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/services/auth.service'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

type Mode = 'main' | 'signin' | 'signup'

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<Mode>('main')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errors.authFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailAuth() {
    setLoading(true)
    setError('')
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password, name)
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errors.authFailed'))
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setMode('main')
    setEmail('')
    setPassword('')
    setName('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth="sm">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
            {t('auth.signInTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        {/* Google Sign-In */}
        <Button
          onClick={handleGoogle}
          loading={loading}
          variant="outline"
          className="w-full mb-4 border-slate-300"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t('auth.continueWithGoogle')}
        </Button>

        {/* Email option */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-400">
              {t('auth.orSignInWithEmail')}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-2"
            >
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMode('signin')}
              >
                {t('auth.signIn')}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setMode('signup')}
              >
                {t('auth.signUp')}
              </Button>
            </motion.div>
          )}

          {(mode === 'signin' || mode === 'signup') && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={(e) => { e.preventDefault(); handleEmailAuth() }}
              className="space-y-3"
            >
              {mode === 'signup' && (
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t('auth.displayName')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px]"
                  />
                </div>
              )}
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px]"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-danger text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full">
                {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
              </Button>
              <button
                type="button"
                onClick={() => setMode('main')}
                className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-1"
              >
                {t('auth.backShort')}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          {t('auth.guestNote')}
        </p>
      </div>
    </Modal>
  )
}
