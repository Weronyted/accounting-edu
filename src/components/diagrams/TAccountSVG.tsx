import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface TEntry {
  id: string
  description: string
  amount: number
  side: 'debit' | 'credit'
}

interface TAccountSVGProps {
  accountName?: string
  readOnly?: boolean
  initialDebits?: { description: string; amount: number }[]
  initialCredits?: { description: string; amount: number }[]
}

export function TAccountSVG({
  accountName = 'Account',
  readOnly = false,
  initialDebits = [],
  initialCredits = [],
}: TAccountSVGProps) {
  const [entries, setEntries] = useState<TEntry[]>([
    ...initialDebits.map((d, i) => ({ id: `d${i}`, ...d, side: 'debit' as const })),
    ...initialCredits.map((c, i) => ({ id: `c${i}`, ...c, side: 'credit' as const })),
  ])
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState<'debit' | 'credit'>('debit')

  const debits = entries.filter((e) => e.side === 'debit')
  const credits = entries.filter((e) => e.side === 'credit')
  const debitTotal = debits.reduce((s, e) => s + e.amount, 0)
  const creditTotal = credits.reduce((s, e) => s + e.amount, 0)
  const balance = debitTotal - creditTotal

  function addEntry() {
    if (!desc.trim() || !amount) return
    const entry: TEntry = {
      id: crypto.randomUUID(),
      description: desc.trim(),
      amount: parseFloat(amount),
      side,
    }
    setEntries((prev) => [...prev, entry])
    setDesc('')
    setAmount('')
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="my-6">
      <h3 className="text-center font-heading font-semibold text-slate-800 dark:text-slate-200 mb-3">
        {accountName}
      </h3>
      <div className="border-2 border-slate-800 dark:border-slate-400 rounded-lg overflow-hidden">
        {/* T-account columns */}
        <div className="grid grid-cols-2 divide-x-2 divide-slate-800 dark:divide-slate-400 min-h-[160px]">
          {/* Debit side */}
          <div>
            <div className="bg-green-50 dark:bg-green-900/20 px-3 py-2 border-b-2 border-slate-800 dark:border-slate-400 text-center">
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                DR (Debit)
              </span>
            </div>
            <div className="p-2 space-y-1">
              <AnimatePresence>
                {debits.map((e) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex items-center justify-between gap-2 group"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300 flex-1 truncate">{e.description}</span>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                      {e.amount.toFixed(2)}
                    </span>
                    {!readOnly && (
                      <button
                        onClick={() => removeEntry(e.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-danger transition-all"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="px-3 py-1.5 border-t border-slate-300 dark:border-slate-600 text-right">
              <span className="text-xs font-bold text-green-700 dark:text-green-400">
                Total: {debitTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Credit side */}
          <div>
            <div className="bg-red-50 dark:bg-red-900/20 px-3 py-2 border-b-2 border-slate-800 dark:border-slate-400 text-center">
              <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
                CR (Credit)
              </span>
            </div>
            <div className="p-2 space-y-1">
              <AnimatePresence>
                {credits.map((e) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex items-center justify-between gap-2 group"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300 flex-1 truncate">{e.description}</span>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                      {e.amount.toFixed(2)}
                    </span>
                    {!readOnly && (
                      <button
                        onClick={() => removeEntry(e.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-danger transition-all"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="px-3 py-1.5 border-t border-slate-300 dark:border-slate-600 text-right">
              <span className="text-xs font-bold text-red-700 dark:text-red-400">
                Total: {creditTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-800 dark:border-slate-400 text-center">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Balance: {' '}
            <span className={balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              {Math.abs(balance).toFixed(2)} {balance >= 0 ? 'DR' : 'CR'}
            </span>
          </span>
        </div>
      </div>

      {/* Input form */}
      {!readOnly && (
        <div className="mt-3 flex gap-2 flex-wrap">
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="flex-1 min-w-[140px] px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px]"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            min="0"
            step="0.01"
            className="w-28 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px]"
          />
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as 'debit' | 'credit')}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px]"
          >
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
          <Button size="sm" onClick={addEntry} className="gap-1.5">
            <Plus size={14} /> Add Entry
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEntries([])}>
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
