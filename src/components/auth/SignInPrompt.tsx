import { useTranslation } from 'react-i18next'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SignInPromptProps {
  onSignIn: () => void
  message?: string
}

export function SignInPrompt({ onSignIn, message }: SignInPromptProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
        <Lock size={18} className="text-slate-400" />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {message ?? t('auth.signInSubtitle')}
      </p>
      <Button size="sm" onClick={onSignIn}>
        {t('auth.signIn')}
      </Button>
    </div>
  )
}
