import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const tradeReceivablesPayables = {
  slug: 'trade-receivables-payables',
  title: 'Trade Receivables & Payables',
  readTime: 10,
  sections: [
    { id: 'definition', title: 'Definitions' },
    { id: 'receivables', title: 'Trade Receivables' },
    { id: 'payables', title: 'Trade Payables' },
    { id: 'aging-schedule', title: 'Aging Schedule' },
    { id: 'worked-examples', title: 'Worked Examples' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `When a business sells goods or services on credit, it creates a trade receivable (debtor) —
    someone who owes the business money. When it buys on credit, it creates a trade payable (creditor) —
    the business owes money to a supplier. Managing these balances is crucial for healthy cash flow.`,

    receivablesLifecycle: [
      { step: 1, label: 'Sale on Credit', description: 'Goods/services delivered. Invoice issued.' },
      { step: 2, label: 'Invoice Recorded', description: 'DR Trade Receivables / CR Sales Revenue.' },
      { step: 3, label: 'Payment Due', description: 'Customer must pay by agreed date (e.g., 30 days).' },
      { step: 4, label: 'Cash Received', description: 'DR Bank / CR Trade Receivables.' },
      { step: 5, label: 'Irrecoverable Debt', description: 'If unpaid → DR Bad Debt Expense / CR Trade Receivables.' },
    ],

    payablesLifecycle: [
      { step: 1, label: 'Purchase on Credit', description: 'Goods/services received. Supplier invoice received.' },
      { step: 2, label: 'Invoice Recorded', description: 'DR Purchases / CR Trade Payables.' },
      { step: 3, label: 'Payment Due', description: 'Must pay supplier by agreed date.' },
      { step: 4, label: 'Payment Made', description: 'DR Trade Payables / CR Bank.' },
      { step: 5, label: 'Returns', description: 'DR Trade Payables / CR Purchases Returns.' },
    ],

    agingSchedule: {
      description: 'An aging schedule categorises outstanding receivables by how overdue they are, highlighting collection risk.',
      rows: [
        { customer: 'Grand Hotel', total: 4200, current: 4200, days30: 0, days60: 0, days90: 0, over90: 0, risk: 'Low' },
        { customer: 'City Café', total: 1800, current: 0, days30: 1800, days60: 0, days90: 0, over90: 0, risk: 'Low' },
        { customer: 'School Canteen', total: 950, current: 0, days30: 0, days60: 950, days90: 0, over90: 0, risk: 'Medium' },
        { customer: 'Office Corp', total: 620, current: 0, days30: 0, days60: 0, days90: 620, over90: 0, risk: 'High' },
        { customer: 'Old Account', total: 340, current: 0, days30: 0, days60: 0, days90: 0, over90: 340, risk: 'Very High' },
        { customer: 'TOTAL', total: 7910, current: 4200, days30: 1800, days60: 950, days90: 620, over90: 340, risk: '' },
      ],
    },

    workedExamples: [
      {
        title: 'Example 1: Credit Sale',
        description: 'Sunrise Bakery sells £2,400 of cakes to Grand Hotel on 30-day credit terms.',
        journal: [
          { account: 'Trade Receivables (Grand Hotel)', dr: '2,400', cr: '' },
          { account: 'Sales Revenue', dr: '', cr: '2,400' },
        ],
        note: 'Asset (receivable) increases. Revenue recognised on delivery, not when paid.',
      },
      {
        title: 'Example 2: Receipt from Customer',
        description: 'Grand Hotel pays £2,400 by bank transfer.',
        journal: [
          { account: 'Bank / Cash', dr: '2,400', cr: '' },
          { account: 'Trade Receivables (Grand Hotel)', dr: '', cr: '2,400' },
        ],
        note: 'Cash received. Receivable cleared.',
      },
      {
        title: 'Example 3: Credit Purchase',
        description: 'Sunrise Bakery buys £1,800 of flour from Mill Supplies on credit.',
        journal: [
          { account: 'Purchases / Inventory', dr: '1,800', cr: '' },
          { account: 'Trade Payables (Mill Supplies)', dr: '', cr: '1,800' },
        ],
        note: 'Inventory (asset) increases. Liability created.',
      },
      {
        title: 'Example 4: Payment to Supplier',
        description: 'Sunrise Bakery pays Mill Supplies £1,500.',
        journal: [
          { account: 'Trade Payables (Mill Supplies)', dr: '1,500', cr: '' },
          { account: 'Bank / Cash', dr: '', cr: '1,500' },
        ],
        note: 'Liability reduced. Cash paid.',
      },
      {
        title: 'Example 5: Irrecoverable Debt Write-Off',
        description: 'Old Account is bankrupt. Remaining balance of £340 written off.',
        journal: [
          { account: 'Bad Debt Expense', dr: '340', cr: '' },
          { account: 'Trade Receivables (Old Account)', dr: '', cr: '340' },
        ],
        note: 'Expense recognised. Receivable removed from books.',
      },
    ],
  },

  keyTerms: [
    { term: 'Trade Receivable', definition: 'An amount owed to the business by a customer who bought goods/services on credit. Shown as a current asset.', example: 'Grand Hotel owes £4,200 for pastries delivered last week.' },
    { term: 'Trade Payable', definition: 'An amount owed by the business to a supplier for goods/services bought on credit. Shown as a current liability.', example: 'Mill Supplies Ltd is owed £1,800 for flour.' },
    { term: 'Credit Sale', definition: 'A sale where the customer pays after delivery, within agreed terms (e.g., 30 days).', example: 'Invoice issued 1 Jan, payment due 31 Jan.' },
    { term: 'Credit Purchase', definition: 'A purchase where payment is made after receipt of goods, within agreed terms.', example: 'Flour received, invoice payment due in 30 days.' },
    { term: 'Debtor', definition: 'Old terminology for trade receivable — a person or entity who owes money to the business.', example: 'Grand Hotel is a debtor.' },
    { term: 'Creditor', definition: 'Old terminology for trade payable — a person or entity to whom the business owes money.', example: 'Mill Supplies is a creditor.' },
    { term: 'Irrecoverable Debt', definition: 'A receivable that cannot be collected — the customer cannot or will not pay. Written off as an expense.', example: 'Old Account is bankrupt; £340 written off as bad debt.' },
  ],

  didYouKnow: [
    'Late payment of invoices is one of the leading causes of small business failure, even when the business is profitable on paper.',
    'Companies often offer early payment discounts (e.g., "2/10 net 30") — 2% discount if paid within 10 days, otherwise full amount due in 30 days.',
    'The average debtor collection period in the UK is around 50 days — well above the typical 30-day invoice term.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Record the following credit transactions using double-entry bookkeeping.',
    rows: [
      { id: 't1', transaction: 'Sells £3,600 bread to School Canteen on 30-day credit', correctDebit: 'Trade Receivables', correctCredit: 'Sales Revenue', correctCategory: 'Asset' },
      { id: 't2', transaction: 'Receives £1,200 from City Café settling their account', correctDebit: 'Bank / Cash', correctCredit: 'Trade Receivables', correctCategory: 'Asset' },
      { id: 't3', transaction: 'Buys £2,100 packaging from Packager Ltd on credit', correctDebit: 'Purchases / Inventory', correctCredit: 'Trade Payables', correctCategory: 'Asset' },
      { id: 't4', transaction: 'Returns faulty packaging worth £300 to Packager Ltd', correctDebit: 'Trade Payables', correctCredit: 'Purchases Returns', correctCategory: 'Liability' },
      { id: 't5', transaction: 'Pays Packager Ltd the remaining £1,800', correctDebit: 'Trade Payables', correctCredit: 'Bank / Cash', correctCategory: 'Liability' },
      { id: 't6', transaction: 'Writes off irrecoverable debt of £480 from a defunct café', correctDebit: 'Bad Debt Expense', correctCredit: 'Trade Receivables', correctCategory: 'Expense' },
      { id: 't7', transaction: 'Customer pays £900 for a previously written-off debt (bad debt recovery)', correctDebit: 'Trade Receivables', correctCredit: 'Bad Debt Recovered', correctCategory: 'Asset' },
      { id: 't8', transaction: 'Creates a provision for doubtful debts of £200', correctDebit: 'Bad Debt Provision Expense', correctCredit: 'Provision for Doubtful Debts', correctCategory: 'Expense' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify each balance for Sunrise Bakery Ltd.',
    rows: [
      { id: 'c1', accountName: 'Trade Receivables', correctClassification: 'Current Asset' },
      { id: 'c2', accountName: 'Trade Payables', correctClassification: 'Current Liability' },
      { id: 'c3', accountName: 'Bad Debt Expense', correctClassification: 'Expense' },
      { id: 'c4', accountName: 'Provision for Doubtful Debts', correctClassification: 'Current Asset' },
      { id: 'c5', accountName: 'Sales Revenue', correctClassification: 'Income' },
      { id: 'c6', accountName: 'Purchases Returns', correctClassification: 'Income' },
      { id: 'c7', accountName: 'Purchases / Inventory', correctClassification: 'Current Asset' },
      { id: 'c8', accountName: 'Bank / Cash', correctClassification: 'Current Asset' },
    ] as ClassifyRow[],
  },
}
