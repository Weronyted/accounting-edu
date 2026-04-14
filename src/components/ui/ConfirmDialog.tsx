import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useConfirmStore } from '@/store/useConfirmStore'
import { Button } from './Button'

export function ConfirmDialog() {
  const { open, options, answer } = useConfirmStore()

  return (
    <AnimatePresence>
      {open && options && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
            onClick={() => answer(false)}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  options.danger
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  <AlertTriangle size={18} className={options.danger ? 'text-red-500' : 'text-amber-500'} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                    {options.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {options.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => answer(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className={options.danger ? 'bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600' : ''}
                  onClick={() => answer(true)}
                >
                  {options.confirmLabel ?? 'Confirm'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
