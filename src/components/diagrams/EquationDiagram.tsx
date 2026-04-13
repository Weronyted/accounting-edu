import { motion } from 'framer-motion'

export function EquationDiagram() {
  return (
    <div className="my-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <h3 className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wide">
        The Accounting Equation
      </h3>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="px-6 py-4 rounded-xl bg-blue-500 dark:bg-blue-600 text-white shadow-lg">
            <p className="font-heading font-semibold text-lg">Assets</p>
            <p className="text-xs text-blue-100 mt-0.5">What we own</p>
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-light text-slate-400 dark:text-slate-500"
        >
          =
        </motion.span>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="px-6 py-4 rounded-xl bg-purple-500 dark:bg-purple-600 text-white shadow-lg">
            <p className="font-heading font-semibold text-lg">Equity</p>
            <p className="text-xs text-purple-100 mt-0.5">Owner's stake</p>
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-light text-slate-400 dark:text-slate-500"
        >
          +
        </motion.span>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="px-6 py-4 rounded-xl bg-rose-500 dark:bg-rose-600 text-white shadow-lg">
            <p className="font-heading font-semibold text-lg">Liabilities</p>
            <p className="text-xs text-rose-100 mt-0.5">What we owe</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center"
      >
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Examples</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Cash, Inventory, Equipment, Receivables</p>
        </div>
        <div className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Examples</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Capital, Retained Earnings, Drawings</p>
        </div>
        <div className="px-3 py-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
          <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">Examples</p>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Bank Loan, Payables, Accruals</p>
        </div>
      </motion.div>
    </div>
  )
}
