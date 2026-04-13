import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Fuse from 'fuse.js'
import { Search, Tag } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LESSON_META, LESSON_SLUGS } from '@/lessons'

interface GlossaryTerm {
  term: string
  definition: string
  example: string
  topicSlug: string
}

const TERMS: GlossaryTerm[] = [
  { term: 'Accounting', definition: 'The systematic process of recording, measuring, classifying, and communicating financial information.', example: 'Preparing annual accounts for a limited company.', topicSlug: 'intro-to-accounting' },
  { term: 'Bookkeeping', definition: 'Day-to-day recording of financial transactions — the data-entry stage of accounting.', example: 'Entering sales invoices into the ledger daily.', topicSlug: 'intro-to-accounting' },
  { term: 'Accounting Equation', definition: 'Assets = Equity + Liabilities. The fundamental principle of double-entry.', example: 'Assets £30,000 = Equity £20,000 + Liabilities £10,000.', topicSlug: 'intro-to-accounting' },
  { term: 'Entity Concept', definition: 'A business is treated as separate from its owner for accounting purposes.', example: "Maria's personal car is not an asset of her business.", topicSlug: 'intro-to-accounting' },
  { term: 'Debit (DR)', definition: 'An entry on the LEFT side of a T-account. Increases assets and expenses.', example: 'DR Bank — cash received.', topicSlug: 'double-entry-bookkeeping' },
  { term: 'Credit (CR)', definition: 'An entry on the RIGHT side of a T-account. Increases liabilities, equity, and income.', example: 'CR Capital — owner equity increased.', topicSlug: 'double-entry-bookkeeping' },
  { term: 'T-Account', definition: 'A visual representation of a ledger account shaped like the letter T.', example: 'Bank T-account shows all inflows (DR) and outflows (CR).', topicSlug: 'double-entry-bookkeeping' },
  { term: 'Journal', definition: 'The book of original entry where transactions are recorded in date order.', example: 'Sales journal records all credit sale invoices.', topicSlug: 'double-entry-bookkeeping' },
  { term: 'Ledger', definition: 'A collection of all T-accounts used by the business.', example: 'General ledger contains accounts for cash, inventory, payables.', topicSlug: 'double-entry-bookkeeping' },
  { term: 'Trial Balance', definition: 'A list of all ledger account balances verifying that total debits equal total credits.', example: 'Trial balance totals of £145,000 DR = £145,000 CR.', topicSlug: 'double-entry-bookkeeping' },
  { term: 'Current Asset', definition: 'Asset expected to be converted to cash or used within 12 months.', example: 'Trade receivables, inventory, cash.', topicSlug: 'account-classification' },
  { term: 'Non-Current Asset', definition: 'Asset held for more than one year, used in the business.', example: 'Buildings, machinery, patents.', topicSlug: 'account-classification' },
  { term: 'Current Liability', definition: 'Obligation due to be settled within 12 months.', example: 'Trade payables, bank overdraft, tax due.', topicSlug: 'account-classification' },
  { term: 'Non-Current Liability', definition: 'Long-term obligation not due within 12 months.', example: '5-year bank loan, debentures.', topicSlug: 'account-classification' },
  { term: 'Revenue', definition: 'Income from the primary business activities.', example: 'Sunrise Bakery bread sales: £186,500.', topicSlug: 'financial-statements' },
  { term: 'Gross Profit', definition: 'Revenue minus Cost of Goods Sold. Before operating expenses.', example: 'Revenue £186,500 − COGS £82,000 = GP £104,500.', topicSlug: 'financial-statements' },
  { term: 'Net Profit', definition: 'Gross profit minus all operating expenses, interest, and tax.', example: 'Net profit £23,600 after all costs.', topicSlug: 'financial-statements' },
  { term: 'Retained Earnings', definition: 'Cumulative profits kept in the business, not distributed to owners.', example: 'After paying drawings, £18,000 retained in the business.', topicSlug: 'financial-statements' },
  { term: 'Trade Receivable', definition: 'Amount owed to the business by a credit customer. Current asset.', example: 'Grand Hotel owes £4,200 for pastries.', topicSlug: 'trade-receivables-payables' },
  { term: 'Trade Payable', definition: 'Amount owed by the business to a credit supplier. Current liability.', example: 'Mill Supplies is owed £1,800 for flour.', topicSlug: 'trade-receivables-payables' },
  { term: 'Irrecoverable Debt', definition: 'A receivable written off because the customer cannot or will not pay.', example: 'Old Account bankrupt; £340 written off as bad debt.', topicSlug: 'trade-receivables-payables' },
  { term: 'FIFO', definition: 'First In, First Out — oldest inventory cost assigned to goods sold first.', example: 'January stock at £5 sold before February stock at £6.', topicSlug: 'inventory-cogs' },
  { term: 'Weighted Average (AVCO)', definition: 'Recalculates average cost after each purchase; applied to all sales.', example: '100 @ £5 + 200 @ £6 → AVCO £5.67.', topicSlug: 'inventory-cogs' },
  { term: 'COGS', definition: 'Cost of Goods Sold: Opening Stock + Purchases − Closing Stock.', example: 'Opening £8,000 + Purchases £45,000 − Closing £11,000 = COGS £42,000.', topicSlug: 'inventory-cogs' },
  { term: 'Depreciation', definition: 'Systematic allocation of a non-current asset\'s cost over its useful life.', example: '£10,000 oven over 5 years = £2,000/year (straight-line).', topicSlug: 'depreciation' },
  { term: 'Straight-Line', definition: 'Depreciation method: (Cost − Residual Value) ÷ Useful Life.', example: '(£10,000 − £2,000) ÷ 5 = £1,600/year.', topicSlug: 'depreciation' },
  { term: 'Reducing Balance', definition: 'Depreciation method: Carrying Value × Rate %. Higher charge in early years.', example: '£22,000 × 30% = £6,600 Year 1.', topicSlug: 'depreciation' },
  { term: 'Carrying Value', definition: 'Net book value: Cost minus Accumulated Depreciation.', example: 'Oven £10,000 − accum dep £3,200 = carrying value £6,800.', topicSlug: 'depreciation' },
  { term: 'Reconciliation', definition: 'Process of matching two sets of records to ensure they agree.', example: 'Matching cash book balance to bank statement.', topicSlug: 'bank-reconciliation' },
  { term: 'Outstanding Cheque', definition: 'Cheque written and recorded in cash book but not yet cleared at the bank.', example: 'Cheque to Mill Supplies written 29 Jan, cleared 3 Feb.', topicSlug: 'bank-reconciliation' },
  { term: 'Gross Pay', definition: 'Total earnings before any deductions.', example: 'Monthly salary of £3,500 before tax and NIC.', topicSlug: 'payroll-salaries' },
  { term: 'Net Pay', definition: 'Take-home pay after all deductions.', example: 'Gross £3,500 − deductions £875 = net £2,625.', topicSlug: 'payroll-salaries' },
  { term: 'PAYE', definition: 'Pay As You Earn — UK system of deducting income tax from wages at source.', example: 'HMRC sets tax code; employer deducts and remits monthly.', topicSlug: 'payroll-salaries' },
  { term: 'Budget', definition: 'A financial plan for a future period expressed in monetary terms.', example: 'January 2025 revenue budget: £45,000.', topicSlug: 'budgeting-variance' },
  { term: 'Variance', definition: 'Actual − Budget. Favourable if benefits the business; Adverse if harms it.', example: 'Revenue variance = £48,500 − £45,000 = £3,500 Favourable.', topicSlug: 'budgeting-variance' },
  { term: 'Favourable Variance', definition: 'A variance that benefits the business — higher revenue or lower cost than budgeted.', example: 'Wages underspent by £200 — Favourable.', topicSlug: 'budgeting-variance' },
  { term: 'Adverse Variance', definition: 'A variance that harms the business — lower revenue or higher cost than budgeted.', example: 'Electricity overspent by £380 — Adverse.', topicSlug: 'budgeting-variance' },
  { term: 'Current Ratio', definition: 'Current Assets ÷ Current Liabilities. Ideal ≥ 2:1.', example: '£27,000 ÷ £6,000 = 4.5:1 — strong liquidity.', topicSlug: 'ratio-analysis' },
  { term: 'Quick Ratio', definition: '(Current Assets − Inventory) ÷ Current Liabilities. Excludes inventory.', example: '(£27,000 − £12,500) ÷ £6,000 = 2.4:1.', topicSlug: 'ratio-analysis' },
  { term: 'ROCE', definition: 'Return on Capital Employed: EBIT ÷ Capital Employed × 100.', example: '£31,300 ÷ £186,000 × 100 = 16.8%.', topicSlug: 'ratio-analysis' },
  { term: 'Gross Profit Margin', definition: '(Gross Profit ÷ Revenue) × 100.', example: '(£104,500 ÷ £186,500) × 100 = 56%.', topicSlug: 'ratio-analysis' },
  { term: 'Net Profit Margin', definition: '(Net Profit ÷ Revenue) × 100.', example: '(£23,600 ÷ £186,500) × 100 = 12.7%.', topicSlug: 'ratio-analysis' },
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function Glossary() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const [letterFilter, setLetterFilter] = useState('')

  const fuse = useMemo(
    () =>
      new Fuse(TERMS, {
        keys: ['term', 'definition', 'example'],
        threshold: 0.35,
      }),
    []
  )

  const filtered = useMemo(() => {
    let results = search ? fuse.search(search).map((r) => r.item) : [...TERMS]
    if (topicFilter) results = results.filter((t) => t.topicSlug === topicFilter)
    if (letterFilter) results = results.filter((t) => t.term[0].toUpperCase() === letterFilter)
    return results.sort((a, b) => a.term.localeCompare(b.term))
  }, [search, topicFilter, letterFilter, fuse])

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-semibold text-slate-900 dark:text-white">
            {t('glossary.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{t('glossary.subtitle')}</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setLetterFilter('') }}
            placeholder={t('glossary.search')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none min-h-[44px]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
          >
            <option value="">{t('glossary.allTopics')}</option>
            {LESSON_SLUGS.map((slug) => (
              <option key={slug} value={slug}>{LESSON_META[slug].title}</option>
            ))}
          </select>

          {/* Letter filter */}
          <div className="flex flex-wrap gap-1">
            {ALPHABET.map((l) => (
              <button
                key={l}
                onClick={() => { setLetterFilter(letterFilter === l ? '' : l); setSearch('') }}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  letterFilter === l
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Terms */}
        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-12">{t('glossary.noResults')}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <Card key={item.term} padding="sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-heading font-semibold text-slate-900 dark:text-white">{item.term}</h3>
                  <Badge variant="default" className="text-[10px] flex-shrink-0">
                    <Tag size={8} /> {LESSON_META[item.topicSlug]?.title.split(' ')[0]}
                  </Badge>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.definition}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                  {t('glossary.example')}: {item.example}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
