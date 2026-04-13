import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Menu, Clock, BookOpen, CheckCircle2, Circle } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { LessonProgress } from '@/components/lesson/LessonProgress'
import { FormulaDrawer } from '@/components/lesson/FormulaDrawer'
import { KeyTermBox } from '@/components/lesson/KeyTermBox'
import { DidYouKnow } from '@/components/lesson/DidYouKnow'
import { TransactionTable } from '@/components/quiz/TransactionTable'
import { ClassifyTable } from '@/components/quiz/ClassifyTable'
import { TAccountSVG } from '@/components/diagrams/TAccountSVG'
import { EquationDiagram } from '@/components/diagrams/EquationDiagram'
import { BalanceSheetSVG } from '@/components/diagrams/BalanceSheetSVG'
import { Drawer } from '@/components/ui/Drawer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useProgress } from '@/hooks/useProgress'
import { LESSON_SLUGS, LESSON_META } from '@/lessons'
import { introToAccounting } from '@/lessons/intro-to-accounting'
import { doubleEntryBookkeeping } from '@/lessons/double-entry-bookkeeping'
import { accountClassification } from '@/lessons/account-classification'
import { financialStatements } from '@/lessons/financial-statements'
import { tradeReceivablesPayables } from '@/lessons/trade-receivables-payables'
import { inventoryCogs } from '@/lessons/inventory-cogs'
import { bankReconciliation } from '@/lessons/bank-reconciliation'
import { payrollSalaries } from '@/lessons/payroll-salaries'
import { formatScore, scoreVariant } from '@/utils/formatScore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LESSONS: Record<string, any> = {
  'intro-to-accounting': introToAccounting,
  'double-entry-bookkeeping': doubleEntryBookkeeping,
  'account-classification': accountClassification,
  'financial-statements': financialStatements,
  'trade-receivables-payables': tradeReceivablesPayables,
  'inventory-cogs': inventoryCogs,
  'bank-reconciliation': bankReconciliation,
  'payroll-salaries': payrollSalaries,
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GenericCards({ items }: { items: any[] }) {
  const nameKey = items[0]
    ? (['name', 'ruleType', 'category', 'type', 'step'].find((k) => k in items[0]) ?? 'name')
    : 'name'
  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {items.map((item: any, i: number) => (
        <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
            {item[nameKey] ?? item.label ?? `Item ${i + 1}`}
          </p>
          {item.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
          )}
          {item.debit && (
            <p className="text-xs text-slate-500 mt-1">DR: {item.debit} | CR: {item.credit}</p>
          )}
          {item.example && (
            <p className="text-xs text-primary dark:text-primary-dark mt-1 italic">{item.example}</p>
          )}
          {item.action && (
            <p className="text-xs text-slate-500 mt-1">→ {item.action}</p>
          )}
          {item.effect && (
            <p className="text-xs text-warning mt-1">{item.effect}</p>
          )}
          {item.examples && (
            <ul className="mt-2 space-y-0.5">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {item.examples.map((ex: any, j: number) => (
                <li key={j} className="text-xs text-slate-500 dark:text-slate-400 before:content-['•'] before:mr-1">{ex}</li>
              ))}
            </ul>
          )}
          {item.normalBalance && (
            <p className="text-xs mt-1 font-medium text-primary dark:text-primary-dark">Normal balance: {item.normalBalance}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StepList({ steps }: { steps: any[] }) {
  return (
    <ol className="mt-4 space-y-3">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {steps.map((s: any, i: number) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary dark:bg-primary-dark text-white text-xs font-bold flex items-center justify-center">
            {s.step ?? i + 1}
          </span>
          <p className="text-sm text-slate-700 dark:text-slate-300 pt-0.5">
            {s.description ?? s.label}
          </p>
        </li>
      ))}
    </ol>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkedExamples({ examples }: { examples: any[] }) {
  return (
    <div className="mt-4 space-y-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {examples.map((ex: any, i: number) => (
        <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-primary/5 dark:bg-primary-dark/10 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-sm text-slate-900 dark:text-white">{ex.title ?? `Example ${i + 1}`}</p>
          </div>
          <div className="p-4 space-y-2">
            {ex.scenario && (
              <p className="text-sm text-slate-600 dark:text-slate-400">{ex.scenario}</p>
            )}
            {ex.solution && (
              <pre className="text-sm text-slate-800 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-800 rounded-lg p-3 whitespace-pre-wrap">
                {ex.solution}
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DebitCreditTable({ rows }: { rows: any[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <th className="text-left px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Account Type</th>
            <th className="text-left px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Increase</th>
            <th className="text-left px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Decrease</th>
            <th className="text-left px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Normal Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {rows.map((r: any, i: number) => (
            <tr key={i} className="bg-white dark:bg-slate-900">
              <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{r.accountType}</td>
              <td className="px-4 py-2 text-success font-medium">{r.increase}</td>
              <td className="px-4 py-2 text-danger font-medium">{r.decrease}</td>
              <td className="px-4 py-2">
                <Badge variant={r.normalBalance === 'Debit' ? 'warning' : 'info'}>{r.normalBalance}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IncomeStatementTable({ data }: { data: any }) {
  const fmt = (n: number) => n === 0 ? '' : `£${Math.abs(n).toLocaleString()}`
  return (
    <div className="mt-4">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{data.description}</p>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.structure.map((row: any, i: number) => (
              <tr key={i} className={row.bold ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'}>
                <td className={`px-4 py-2 ${row.indent ? 'pl-8' : ''} ${row.bold ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {row.label}
                </td>
                <td className={`px-4 py-2 text-right font-mono ${row.amount < 0 ? 'text-danger' : row.bold ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                  {row.amount !== 0 ? (row.amount < 0 ? `(${fmt(row.amount)})` : fmt(row.amount)) : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CashFlowTable({ data }: { data: any }) {
  const fmt = (n: number) => `${n < 0 ? '(' : ''}£${Math.abs(n).toLocaleString()}${n < 0 ? ')' : ''}`
  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">{data.description}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {data.sections.map((section: any, i: number) => (
        <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-sm text-slate-900 dark:text-white">{section.name}</p>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {section.items.map((item: any, j: number) => (
                <tr key={j} className={item.bold ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'}>
                  <td className={`px-4 py-2 ${item.bold ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{item.label}</td>
                  <td className={`px-4 py-2 text-right font-mono ${item.amount < 0 ? 'text-danger' : ''}`}>{fmt(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InventoryTable({ data, title }: { data: any; title: string }) {
  if (!data) return null
  return (
    <div className="mt-4">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{data.description}</p>
      {data.transactions && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                <th className="text-right px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Units</th>
                <th className="text-right px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Cost/Unit</th>
                <th className="text-right px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Total / COGS</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {data.transactions.map((r: any, i: number) => (
                <tr key={i} className={`${r.type === 'Sale' ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-white dark:bg-slate-900'}`}>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{r.date}</td>
                  <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{r.type}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.units}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.costPerUnit ? `£${r.costPerUnit.toFixed(2)}` : '—'}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.totalCost ? `£${r.totalCost.toFixed(2)}` : r.cogs ? `£${r.cogs.toFixed(2)}` : '—'}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{r.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PayslipCard({ data }: { data: any }) {
  if (!data) return null
  const fmt = (n: number) => `£${n.toFixed(2)}`
  return (
    <div className="mt-4 max-w-sm">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-primary dark:bg-primary-dark text-white px-4 py-3">
          <p className="font-semibold">{data.employee}</p>
          <p className="text-sm opacity-80">{data.period}</p>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Gross Pay</span>
            <span className="font-semibold text-slate-900 dark:text-white">{fmt(data.grossPay)}</span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.deductions?.map((d: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{d.type}</span>
                <span className="text-danger font-mono">({fmt(d.amount)})</span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-primary dark:border-primary-dark pt-2 flex justify-between">
            <span className="font-semibold text-slate-900 dark:text-white">Net Pay</span>
            <span className="font-bold text-success text-lg">{fmt(data.netPay)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function JournalBlock({ text, entries }: { text?: string; entries?: any[] }) {
  if (text) {
    return (
      <pre className="mt-4 text-sm font-mono bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 whitespace-pre-wrap overflow-x-auto">
        {text}
      </pre>
    )
  }
  if (entries) {
    return (
      <div className="mt-4 space-y-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {entries.map((e: any, i: number) => (
          <div key={i} className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
            <p className="font-semibold text-sm text-slate-900 dark:text-white mb-2">{e.narration ?? e.description ?? `Entry ${i + 1}`}</p>
            <table className="w-full text-sm">
              <tbody>
                {e.debits?.map((d: { account: string; amount: number }, j: number) => (
                  <tr key={j}>
                    <td className="py-0.5 text-slate-700 dark:text-slate-300">DR {d.account}</td>
                    <td className="py-0.5 text-right font-mono text-slate-800 dark:text-slate-200">£{d.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {e.credits?.map((c: { account: string; amount: number }, j: number) => (
                  <tr key={j}>
                    <td className="py-0.5 pl-6 text-slate-500">CR {c.account}</td>
                    <td className="py-0.5 text-right font-mono text-slate-500">£{c.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSectionBody(sectionId: string, slug: string, lesson: any): React.ReactNode {
  const c = lesson.content

  // Special diagram sections
  if (sectionId === 'equation') return <div className="mt-4"><EquationDiagram /></div>
  if (sectionId === 't-accounts') return <div className="mt-4"><TAccountSVG accountName="Cash at Bank" /></div>
  if (sectionId === 'balance-sheet') return <div className="mt-4"><BalanceSheetSVG /></div>

  // Income Statement
  if (sectionId === 'income-statement' && c?.incomeStatement) return <IncomeStatementTable data={c.incomeStatement} />

  // Cash Flow
  if (sectionId === 'cash-flow' && c?.cashFlow) return <CashFlowTable data={c.cashFlow} />

  // Debit/Credit rules table
  if (sectionId === 'debit-credit' && c?.debitCreditRules) return <DebitCreditTable rows={c.debitCreditRules} />

  // FIFO inventory
  if (sectionId === 'fifo' && c?.fifoExample) return <InventoryTable data={c.fifoExample} title="FIFO" />

  // Weighted average
  if (sectionId === 'weighted-average' && c?.weightedAvgExample) return <InventoryTable data={c.weightedAvgExample} title="Weighted Average" />

  // COGS formula
  if (sectionId === 'cogs-formula' && c?.cogsFormula) {
    const f = c.cogsFormula
    return (
      <div className="mt-4 space-y-3">
        <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary-dark/10 border border-primary/20 dark:border-primary-dark/30">
          <p className="font-mono text-lg font-semibold text-primary dark:text-primary-dark">{f.formula}</p>
        </div>
        {f.example && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm space-y-1">
            <p className="text-slate-700 dark:text-slate-300">Opening Stock: <strong>£{f.example.openingStock?.toLocaleString()}</strong></p>
            <p className="text-slate-700 dark:text-slate-300">+ Purchases: <strong>£{f.example.purchases?.toLocaleString()}</strong></p>
            <p className="text-slate-700 dark:text-slate-300">− Closing Stock: <strong>£{f.example.closingStock?.toLocaleString()}</strong></p>
            <p className="font-semibold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-1 mt-1">= COGS: £{f.example.cogs?.toLocaleString()}</p>
          </div>
        )}
        {f.note && <p className="text-sm text-slate-500 dark:text-slate-400">{f.note}</p>}
      </div>
    )
  }

  // Comparison table (inventory methods)
  if (sectionId === 'comparison' && c?.comparison) {
    return (
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              {Object.keys(c.comparison[0] ?? {}).map((k) => (
                <th key={k} className="text-left px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 capitalize">{k}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {c.comparison.map((row: any, i: number) => (
              <tr key={i} className="bg-white dark:bg-slate-900">
                {Object.values(row).map((v: unknown, j: number) => (
                  <td key={j} className="px-4 py-2 text-slate-700 dark:text-slate-300">{String(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Gross vs Net payroll
  if (sectionId === 'gross-net' && c?.grossVsNet) {
    const g = c.grossVsNet
    return (
      <div className="mt-4 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="font-semibold text-sm text-green-800 dark:text-green-300 mb-1">Gross Pay</p>
            <p className="text-sm text-green-700 dark:text-green-400">{g.grossPay}</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1">Net Pay</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">{g.netPay}</p>
          </div>
        </div>
        {g.formula && (
          <div className="p-3 rounded-xl bg-primary/5 dark:bg-primary-dark/10 border border-primary/20 dark:border-primary-dark/30">
            <p className="font-mono text-sm font-semibold text-primary dark:text-primary-dark">{g.formula}</p>
          </div>
        )}
      </div>
    )
  }

  // Payslip
  if (sectionId === 'payslip' && c?.payslipExample) return <PayslipCard data={c.payslipExample} />

  // Aging schedule
  if (sectionId === 'aging-schedule' && c?.agingSchedule) {
    const ag = c.agingSchedule
    return (
      <div className="mt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{ag.description}</p>
        {ag.rows && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  {ag.rows[0] && Object.keys(ag.rows[0]).map((k: string) => (
                    <th key={k} className="text-left px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 capitalize">{k.replace(/([A-Z])/g, ' $1')}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {ag.rows.map((row: any, i: number) => (
                  <tr key={i} className="bg-white dark:bg-slate-900">
                    {Object.values(row).map((v: unknown, j: number) => (
                      <td key={j} className="px-4 py-2 text-slate-700 dark:text-slate-300">{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  // Journal entries
  if (sectionId === 'journal-entries') {
    if (c?.journalFormat) return <JournalBlock text={c.journalFormat} />
    if (c?.journalEntries) return <JournalBlock entries={c.journalEntries} />
  }

  // Worked examples (plural or singular)
  if (sectionId === 'worked-examples' && c?.workedExamples) return <WorkedExamples examples={c.workedExamples} />
  if (sectionId === 'worked-example' && c?.workedExample) {
    const we = c.workedExample
    return (
      <div className="mt-4 space-y-3">
        {we.scenario && <p className="text-sm text-slate-600 dark:text-slate-400">{we.scenario}</p>}
        {we.cashBookBalance !== undefined && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">Cash Book Balance</p>
              <p className="font-mono text-primary dark:text-primary-dark">£{we.cashBookBalance?.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">Bank Statement Balance</p>
              <p className="font-mono text-primary dark:text-primary-dark">£{we.bankStatementBalance?.toLocaleString()}</p>
            </div>
          </div>
        )}
        {we.adjustments && (
          <div>
            <p className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Reconciliation Adjustments</p>
            <div className="space-y-1">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {we.adjustments.map((adj: any, i: number) => (
                <div key={i} className="flex justify-between text-sm px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">{adj.item}</span>
                  <span className={`font-mono ${adj.amount < 0 ? 'text-danger' : 'text-success'}`}>
                    {adj.amount < 0 ? `(£${Math.abs(adj.amount).toLocaleString()})` : `£${adj.amount.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {we.reconciledBalance !== undefined && (
          <div className="flex justify-between items-center p-3 rounded-xl bg-success/10 dark:bg-success/20 border border-success/30">
            <span className="font-semibold text-sm text-slate-900 dark:text-white">Reconciled Balance</span>
            <span className="font-mono font-bold text-success">£{we.reconciledBalance?.toLocaleString()}</span>
          </div>
        )}
      </div>
    )
  }

  // Arrays of cards: branches, entityTypes, goldenRules, commonDifferences, deductions, classificationTree, receivablesLifecycle, payablesLifecycle
  const ARRAY_FIELDS: Record<string, string> = {
    'branches': 'branches',
    'entities': 'entityTypes',
    'golden-rules': 'goldenRules',
    'common-differences': 'commonDifferences',
    'deductions': 'deductions',
    'classification-tree': 'classificationTree',
    'receivables': 'receivablesLifecycle',
    'payables': 'payablesLifecycle',
    'purpose': 'process',
  }
  const arrayField = ARRAY_FIELDS[sectionId]
  if (arrayField && c?.[arrayField]) {
    const items = c[arrayField]
    if (Array.isArray(items) && items.length > 0) {
      const firstItem = items[0]
      if ('step' in firstItem) return <StepList steps={items} />
      return <GenericCards items={items} />
    }
  }

  // How they connect (financial statements)
  if (sectionId === 'how-they-connect' && c?.connections) {
    return (
      <div className="mt-4 space-y-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {c.connections.map((conn: any, i: number) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">{conn.from} → {conn.to}</p>
            <p className="text-slate-600 dark:text-slate-400">{conn.description}</p>
          </div>
        ))}
      </div>
    )
  }

  // Overview / definition / what-is sections for non-first sections: show intro if it's the first section
  // For sections we have no specific handler, show nothing (return null)
  return null
}

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileContentsOpen, setMobileContentsOpen] = useState(false)
  const [lessonSwitcherOpen, setLessonSwitcherOpen] = useState(false)
  const timeRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const secondsRef = useRef(0)

  const lesson = slug ? LESSONS[slug] : null
  const idx = slug ? LESSON_SLUGS.indexOf(slug) : -1
  const prevSlug = idx > 0 ? LESSON_SLUGS[idx - 1] : null
  const nextSlug = idx < LESSON_SLUGS.length - 1 ? LESSON_SLUGS[idx + 1] : null

  const { progress, markVisited, toggleBookmark, bestScore, allProgress } = useProgress(slug ?? '')

  useEffect(() => {
    if (!slug || !lesson) {
      navigate('/lessons/intro-to-accounting')
      return
    }
    markVisited(slug)
    timeRef.current = setInterval(() => { secondsRef.current += 5 }, 5000)
    return () => { if (timeRef.current) clearInterval(timeRef.current) }
  }, [slug])

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">{t('common.loading')}</p>
      </div>
    )
  }

  const bookmarks = progress?.bookmarks ?? []

  const SidebarContent = () => (
    <div className="space-y-6 p-5">
      {/* Section outline */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          {t('lessons.sections')}
        </p>
        <nav className="space-y-0.5">
          {lesson.sections.map((s: { id: string; title: string }) => (
            <button
              key={s.id}
              onClick={() => { scrollToSection(s.id); setMobileContentsOpen(false) }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm w-full text-left transition-colors ${
                bookmarks.includes(s.id)
                  ? 'text-primary dark:text-primary-dark font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {s.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Meta */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Clock size={14} />
          <span>{t('lessons.readTime', { min: lesson.readTime })}</span>
        </div>
        {bestScore > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">{t('lessons.yourScore')}:</span>
            <Badge variant={scoreVariant(bestScore)}>{formatScore(bestScore)}</Badge>
          </div>
        )}
      </div>

      {/* Bookmarks */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          {t('lessons.bookmark')}
        </p>
        <div className="space-y-1">
          {lesson.sections.map((s: { id: string; title: string }) => (
            <button
              key={s.id}
              onClick={() => slug && toggleBookmark(slug, s.id)}
              className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                bookmarks.includes(s.id)
                  ? 'text-primary dark:text-primary-dark bg-primary/5 dark:bg-primary-dark/10'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {bookmarks.includes(s.id) ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* All lessons switcher */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          {t('nav.lessons')}
        </p>
        <div className="space-y-1">
          {LESSON_SLUGS.map((s) => {
            const meta = LESSON_META[s]
            const p = allProgress[s]
            const done = p?.completed
            const active = s === slug
            return (
              <Link
                key={s}
                to={`/lessons/${s}`}
                onClick={() => setMobileContentsOpen(false)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs w-full transition-colors ${
                  active
                    ? 'bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="flex-shrink-0">{meta.icon}</span>
                <span className="flex-1 truncate">{meta.title}</span>
                {done
                  ? <CheckCircle2 size={12} className="flex-shrink-0 text-success" />
                  : <Circle size={12} className="flex-shrink-0 text-slate-300 dark:text-slate-600" />
                }
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <PageTransition>
      <LessonProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
            {t('common.home')}
          </Link>
          <span>/</span>
          <span>{t('nav.lessons')}</span>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200">{lesson.title}</span>
        </nav>

        {/* Mobile bar */}
        <div className="lg:hidden mb-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setMobileContentsOpen(true)} className="gap-2">
            <Menu size={14} /> {t('lessons.contentsButton')}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setLessonSwitcherOpen(true)} className="gap-2">
            <BookOpen size={14} /> {t('nav.lessons')}
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <SidebarContent />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <h1 id="top" className="font-heading text-3xl font-semibold text-slate-900 dark:text-white mb-6">
              {lesson.title}
            </h1>

            {/* Render all sections */}
            {lesson.sections.map((section: { id: string; title: string }, i: number) => {
              // Skip key-terms and quiz sections — handled separately below
              if (section.id === 'key-terms') return null
              if (section.id === 'quiz-transaction') return null
              if (section.id === 'quiz-classify') return null

              const isIntro = i === 0

              return (
                <motion.section
                  key={section.id}
                  id={section.id}
                  className="mb-10 scroll-mt-20"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {section.title}
                  </h2>
                  {isIntro && (
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {lesson.content.intro}
                    </p>
                  )}
                  {!isIntro && renderSectionBody(section.id, slug ?? '', lesson)}
                </motion.section>
              )
            })}

            {/* Did You Know */}
            {lesson.didYouKnow && (
              <div className="mb-8 space-y-3">
                {lesson.didYouKnow.map((fact: string, i: number) => (
                  <DidYouKnow key={i}>{fact}</DidYouKnow>
                ))}
              </div>
            )}

            {/* Key Terms */}
            {lesson.keyTerms && (
              <section id="key-terms" className="mb-8 scroll-mt-20">
                <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {t('lessons.keyTerms')}
                </h2>
                <KeyTermBox terms={lesson.keyTerms} />
              </section>
            )}

            {/* Transaction Quiz */}
            {lesson.transactionQuiz && slug && (
              <section id="quiz-transaction" className="mb-8 scroll-mt-20">
                <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {t('lessons.quizTransaction')}
                </h2>
                <TransactionTable
                  rows={lesson.transactionQuiz.rows}
                  topicSlug={slug}
                  businessName={lesson.transactionQuiz.businessName}
                  scenario={lesson.transactionQuiz.scenario}
                />
              </section>
            )}

            {/* Classify Quiz */}
            {lesson.classifyQuiz && slug && (
              <section id="quiz-classify" className="mb-8 scroll-mt-20">
                <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {t('lessons.quizClassify')}
                </h2>
                <ClassifyTable
                  rows={lesson.classifyQuiz.rows}
                  topicSlug={slug}
                  businessContext={lesson.classifyQuiz.businessContext}
                />
              </section>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
              {prevSlug ? (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/lessons/${prevSlug}`} className="gap-1.5">
                    <ArrowLeft size={14} /> {t('lessons.prevLesson')}
                  </Link>
                </Button>
              ) : <div />}

              {nextSlug && (
                <Button size="sm" asChild>
                  <Link to={`/lessons/${nextSlug}`} className="gap-1.5">
                    {t('lessons.nextLesson')} <ArrowRight size={14} />
                  </Link>
                </Button>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile contents drawer */}
      <Drawer open={mobileContentsOpen} onClose={() => setMobileContentsOpen(false)} title={t('lessons.contentsButton')} side="bottom">
        <SidebarContent />
      </Drawer>

      {/* Mobile lesson switcher */}
      <Drawer open={lessonSwitcherOpen} onClose={() => setLessonSwitcherOpen(false)} title={t('nav.lessons')} side="bottom">
        <div className="p-4 space-y-1">
          {LESSON_SLUGS.map((s) => {
            const meta = LESSON_META[s]
            const p = allProgress[s]
            const done = p?.completed
            return (
              <Link
                key={s}
                to={`/lessons/${s}`}
                onClick={() => setLessonSwitcherOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  s === slug
                    ? 'bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{meta.icon}</span>
                <span className="flex-1 text-sm">{meta.title}</span>
                {done ? <CheckCircle2 size={16} className="text-success" /> : <Circle size={16} className="text-slate-300 dark:text-slate-600" />}
              </Link>
            )
          })}
        </div>
      </Drawer>

      <FormulaDrawer />
    </PageTransition>
  )
}
