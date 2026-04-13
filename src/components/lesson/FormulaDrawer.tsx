import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Hash, ChevronDown, ChevronUp } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { motion, AnimatePresence } from 'framer-motion'

interface FormulaItem {
  name: string
  formula: string
  note: string
  example?: string
  variables?: string[]
  verdict?: string
}

interface FormulaGroup {
  category: string
  color: string
  items: FormulaItem[]
}

const FORMULAS: FormulaGroup[] = [
  {
    category: 'Foundation',
    color: 'blue',
    items: [
      {
        name: 'Accounting Equation',
        formula: 'Assets = Equity + Liabilities',
        note: 'Must always balance — the cornerstone of double-entry bookkeeping.',
        example: 'Cash £25,000 = Capital £20,000 + Loan £5,000 ✓',
        variables: ['Assets: everything the business owns or is owed', 'Equity: owner\'s stake in the business', 'Liabilities: debts owed to third parties'],
      },
      {
        name: 'Net Assets',
        formula: 'Net Assets = Total Assets − Total Liabilities',
        note: 'Always equal to Total Equity.',
        example: '£192,000 − £24,000 = £168,000 = Equity',
      },
      {
        name: 'Capital Equation',
        formula: 'Capital = Opening Capital + Net Profit − Drawings',
        note: 'How the owner\'s equity changes over the period.',
        example: '£50,000 + £23,600 − £8,000 = £65,600',
      },
    ],
  },
  {
    category: 'Profitability',
    color: 'green',
    items: [
      {
        name: 'Gross Profit',
        formula: 'Gross Profit = Revenue − Cost of Goods Sold',
        note: 'Profit before operating expenses (wages, rent, etc.).',
        example: '£186,500 − £82,000 = £104,500',
      },
      {
        name: 'Gross Profit Margin',
        formula: 'GPM (%) = (Gross Profit ÷ Revenue) × 100',
        note: 'Higher % = more profitable product/service mix.',
        example: '(£104,500 ÷ £186,500) × 100 = 56.0%',
        verdict: 'Good if > 40% in most industries',
      },
      {
        name: 'Net Profit',
        formula: 'Net Profit = Gross Profit − Operating Expenses',
        note: 'After all costs including wages, rent, depreciation.',
        example: '£104,500 − £73,200 = £31,300 operating profit',
      },
      {
        name: 'Net Profit Margin',
        formula: 'NPM (%) = (Net Profit ÷ Revenue) × 100',
        note: 'The "bottom line" profitability percentage.',
        example: '(£23,600 ÷ £186,500) × 100 = 12.7%',
      },
      {
        name: 'ROCE',
        formula: 'ROCE (%) = EBIT ÷ Capital Employed × 100',
        note: 'Return on Capital Employed. Capital Employed = Total Assets − Current Liabilities.',
        verdict: 'Good if > cost of borrowing',
      },
    ],
  },
  {
    category: 'Liquidity',
    color: 'cyan',
    items: [
      {
        name: 'Current Ratio',
        formula: 'Current Ratio = Current Assets ÷ Current Liabilities',
        note: 'Measures ability to pay short-term debts.',
        example: '£18,000 ÷ £6,000 = 3:1',
        verdict: 'Ideal: 1.5:1 – 2:1. Too high = idle assets.',
      },
      {
        name: 'Quick Ratio (Acid Test)',
        formula: 'Quick Ratio = (Current Assets − Inventory) ÷ Current Liabilities',
        note: 'Stricter liquidity — excludes inventory (least liquid).',
        example: '(£18,000 − £4,000) ÷ £6,000 = 2.3:1',
        verdict: 'Ideal: ≥ 1:1',
      },
      {
        name: 'Net Working Capital',
        formula: 'NWC = Current Assets − Current Liabilities',
        note: 'Positive NWC = able to pay short-term obligations.',
        example: '£18,000 − £6,000 = £12,000',
      },
    ],
  },
  {
    category: 'Efficiency',
    color: 'orange',
    items: [
      {
        name: 'Inventory Days',
        formula: '(Inventory ÷ COGS) × 365',
        note: 'Average days to sell inventory. Lower = faster-moving stock.',
        example: '(£11,000 ÷ £82,000) × 365 = 49 days',
        verdict: 'Compare vs industry average',
      },
      {
        name: 'Receivable Days (Debtor Days)',
        formula: '(Trade Receivables ÷ Revenue) × 365',
        note: 'Average days to collect payment from customers.',
        example: '(£14,000 ÷ £186,500) × 365 = 27 days',
        verdict: 'Lower is better (less cash tied up)',
      },
      {
        name: 'Payable Days (Creditor Days)',
        formula: '(Trade Payables ÷ COGS) × 365',
        note: 'Average days taken to pay suppliers.',
        example: '(£5,400 ÷ £82,000) × 365 = 24 days',
        verdict: 'Longer = better cash management, but too long risks supplier relationships',
      },
      {
        name: 'Asset Turnover',
        formula: 'Asset Turnover = Revenue ÷ Total Assets',
        note: 'How efficiently assets generate revenue.',
        example: '£186,500 ÷ £192,000 = 0.97×',
      },
    ],
  },
  {
    category: 'Inventory & COGS',
    color: 'amber',
    items: [
      {
        name: 'COGS Formula',
        formula: 'COGS = Opening Stock + Purchases − Closing Stock',
        note: 'Total cost of goods sold during the period.',
        example: '£8,000 + £45,000 − £11,000 = £42,000',
      },
      {
        name: 'FIFO Closing Stock',
        formula: 'Closing Stock = Latest Batch Price × Remaining Units',
        note: 'First In First Out — oldest inventory sold first.',
        example: 'Last 150 units @ £6.00 = £900 closing stock',
      },
      {
        name: 'Weighted Average Cost',
        formula: 'WAC per unit = Total Cost ÷ Total Units Available',
        note: 'Smooths price fluctuations. Recalculated after each purchase.',
        example: '(£500 + £1,100) ÷ 300 units = £5.33 per unit',
      },
    ],
  },
  {
    category: 'Depreciation',
    color: 'purple',
    items: [
      {
        name: 'Straight-Line',
        formula: '(Cost − Residual Value) ÷ Useful Life',
        note: 'Equal depreciation charge each year.',
        example: '(£40,000 − £4,000) ÷ 5 years = £7,200/year',
        variables: ['Cost: original purchase price', 'Residual Value: estimated scrap/resale value at end of life', 'Useful Life: expected years of use'],
      },
      {
        name: 'Reducing Balance',
        formula: 'Depreciation = Carrying Value × Rate %',
        note: 'Higher charge in early years — matches usage for vehicles/tech.',
        example: 'Year 1: £40,000 × 25% = £10,000. Year 2: £30,000 × 25% = £7,500',
      },
      {
        name: 'Net Book Value',
        formula: 'NBV = Cost − Accumulated Depreciation',
        note: 'The carrying value shown on the balance sheet.',
        example: 'Cost £40,000 − Acc. Dep £17,500 = NBV £22,500',
      },
    ],
  },
  {
    category: 'Payroll',
    color: 'pink',
    items: [
      {
        name: 'Net Pay',
        formula: 'Net Pay = Gross Pay − All Employee Deductions',
        note: 'The amount transferred to the employee\'s bank account.',
        example: '£3,500 − (£350 + £270 + £175 + £80) = £2,625',
        variables: ['Gross Pay: salary + overtime + bonuses', 'Deductions: income tax, employee NIC, pension, student loan'],
      },
      {
        name: 'Total Payroll Cost',
        formula: 'Payroll Cost = Gross Pay + Employer NIC + Employer Pension',
        note: 'The full cost to the employer — higher than gross pay.',
        example: '£3,500 + £340 + £105 = £3,945 total employer cost',
      },
      {
        name: 'Income Tax (Basic Rate)',
        formula: 'Tax = (Gross Pay − Personal Allowance) × Rate',
        note: 'Simplified annual calculation. Applied monthly in practice via PAYE tables.',
        example: '(£42,000 − £12,570) × 20% = £5,886/year = £490.50/month',
      },
    ],
  },
]

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
  green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
  cyan: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300',
  orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
  pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300',
}

function FormulaCard({ item, color }: { item: FormulaItem; color: string }) {
  const [expanded, setExpanded] = useState(false)
  const colorClass = COLOR_MAP[color] ?? COLOR_MAP.blue

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{item.name}</p>
            <p className={`text-sm font-mono font-medium px-2 py-1 rounded-lg border inline-block ${colorClass}`}>
              {item.formula}
            </p>
          </div>
          {(item.example || item.variables || item.verdict) && (
            expanded ? <ChevronUp size={14} className="flex-shrink-0 mt-1 text-slate-400" />
                     : <ChevronDown size={14} className="flex-shrink-0 mt-1 text-slate-400" />
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{item.note}</p>
      </button>

      <AnimatePresence>
        {expanded && (item.example || item.variables || item.verdict) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-2">
              {item.example && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Example</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 rounded-lg px-2 py-1.5">{item.example}</p>
                </div>
              )}
              {item.variables && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Variables</p>
                  <ul className="space-y-0.5">
                    {item.variables.map((v, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 before:content-['•'] before:mr-1.5">{v}</li>
                    ))}
                  </ul>
                </div>
              )}
              {item.verdict && (
                <div className="flex items-start gap-1.5">
                  <span className="text-xs font-semibold text-primary dark:text-primary-dark shrink-0">✓</span>
                  <p className="text-xs text-primary dark:text-primary-dark">{item.verdict}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FormulaDrawer() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary dark:bg-primary-dark text-white text-sm font-medium shadow-lg hover:opacity-90 transition-opacity print:hidden"
      >
        <Hash size={16} /> {t('lessons.formulas')}
        <ChevronRight size={14} />
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} title={t('lessons.formulas')} side="right">
        <div className="p-4 space-y-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any formula to see a worked example and interpretation guidance.
          </p>
          {FORMULAS.map((group) => (
            <div key={group.category}>
              <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 px-2 py-1 rounded-lg border inline-block ${COLOR_MAP[group.color]}`}>
                {group.category}
              </h3>
              <div className="space-y-2 mt-2">
                {group.items.map((item) => (
                  <FormulaCard key={item.name} item={item} color={group.color} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  )
}
