import { motion } from 'framer-motion'

interface LineItem {
  label: string
  amount: number
  indent?: boolean
  bold?: boolean
  separator?: boolean
}

interface BalanceSheetSVGProps {
  assetItems?: LineItem[]
  equityItems?: LineItem[]
  liabilityItems?: LineItem[]
  companyName?: string
  date?: string
}

const DEFAULT_ASSETS: LineItem[] = [
  { label: 'Non-Current Assets', amount: 0, bold: true },
  { label: 'Equipment', amount: 45000, indent: true },
  { label: 'Premises', amount: 120000, indent: true },
  { label: '', amount: 165000, bold: true, separator: true },
  { label: 'Current Assets', amount: 0, bold: true },
  { label: 'Inventory', amount: 12500, indent: true },
  { label: 'Trade Receivables', amount: 8300, indent: true },
  { label: 'Cash & Bank', amount: 6200, indent: true },
  { label: '', amount: 27000, bold: true, separator: true },
]

const DEFAULT_EQUITY: LineItem[] = [
  { label: 'Equity', amount: 0, bold: true },
  { label: "Owner's Capital", amount: 150000, indent: true },
  { label: 'Retained Earnings', amount: 18000, indent: true },
  { label: '', amount: 168000, bold: true, separator: true },
]

const DEFAULT_LIABILITIES: LineItem[] = [
  { label: 'Non-Current Liabilities', amount: 0, bold: true },
  { label: 'Bank Loan', amount: 18000, indent: true },
  { label: 'Current Liabilities', amount: 0, bold: true },
  { label: 'Trade Payables', amount: 5400, indent: true },
  { label: 'Accruals', amount: 600, indent: true },
  { label: '', amount: 24000, bold: true, separator: true },
]

function LineRow({ item }: { item: LineItem }) {
  if (item.separator) {
    return (
      <div className="flex items-center justify-between py-1 border-t border-double border-slate-400 dark:border-slate-500 mt-1">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Total</span>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
          £{item.amount.toLocaleString()}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between py-0.5 ${item.indent ? 'pl-4' : ''}`}>
      <span className={`text-sm ${item.bold ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
        {item.label}
      </span>
      {item.amount > 0 && (
        <span className={`text-sm tabular-nums ${item.bold ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
          £{item.amount.toLocaleString()}
        </span>
      )}
    </div>
  )
}

export function BalanceSheetSVG({
  assetItems = DEFAULT_ASSETS,
  equityItems = DEFAULT_EQUITY,
  liabilityItems = DEFAULT_LIABILITIES,
  companyName = 'Sunrise Bakery Ltd',
  date = '31 December 2024',
}: BalanceSheetSVGProps) {
  const totalAssets = 192000
  const totalEqLiab = 192000

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-6 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-primary dark:bg-primary-dark px-5 py-3 text-white text-center">
        <p className="font-heading font-semibold">{companyName}</p>
        <p className="text-sm text-blue-100">Balance Sheet as at {date}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
        {/* Assets column */}
        <div className="p-5">
          <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
            Assets
          </h3>
          <div className="space-y-0.5">
            {assetItems.map((item, i) => <LineRow key={i} item={item} />)}
          </div>
          <div className="mt-3 pt-2 border-t-2 border-slate-800 dark:border-slate-300 flex justify-between">
            <span className="font-bold text-slate-900 dark:text-white">TOTAL ASSETS</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">£{totalAssets.toLocaleString()}</span>
          </div>
        </div>

        {/* Equity + Liabilities column */}
        <div className="p-5">
          <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
            Equity & Liabilities
          </h3>
          <div className="space-y-0.5">
            {[...equityItems, ...liabilityItems].map((item, i) => (
              <LineRow key={i} item={item} />
            ))}
          </div>
          <div className="mt-3 pt-2 border-t-2 border-slate-800 dark:border-slate-300 flex justify-between">
            <span className="font-bold text-slate-900 dark:text-white">TOTAL EQUITY & LIABILITIES</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">£{totalEqLiab.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
