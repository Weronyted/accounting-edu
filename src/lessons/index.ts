export const LESSON_SLUGS = [
  'intro-to-accounting',
  'double-entry-bookkeeping',
  'account-classification',
  'financial-statements',
  'trade-receivables-payables',
  'inventory-cogs',
  'bank-reconciliation',
  'payroll-salaries',
]

export const LESSON_META: Record<string, { title: string; icon: string; description: string }> = {
  'intro-to-accounting': {
    title: 'Intro to Accounting',
    icon: '📚',
    description: 'What accounting is, why it matters, and the fundamental equation.',
  },
  'double-entry-bookkeeping': {
    title: 'Double-Entry Bookkeeping',
    icon: '↔️',
    description: 'The golden rules of debit and credit with worked journal entries.',
  },
  'account-classification': {
    title: 'Account Classification',
    icon: '🗂️',
    description: 'Chart of accounts, assets, liabilities, equity, income, and expenses.',
  },
  'financial-statements': {
    title: 'Financial Statements',
    icon: '📊',
    description: 'Income statement, balance sheet, and cash flow statement explained.',
  },
  'trade-receivables-payables': {
    title: 'Trade Receivables & Payables',
    icon: '🤝',
    description: 'Managing money owed to and from the business.',
  },
  'inventory-cogs': {
    title: 'Inventory & COGS',
    icon: '📦',
    description: 'FIFO, weighted average, and cost of goods sold calculations.',
  },
  'bank-reconciliation': {
    title: 'Bank Reconciliation',
    icon: '🏦',
    description: 'Reconciling the cash book with the bank statement.',
  },
  'payroll-salaries': {
    title: 'Payroll & Salaries',
    icon: '💰',
    description: 'Gross pay, net pay, deductions, and payroll journal entries.',
  },
}
