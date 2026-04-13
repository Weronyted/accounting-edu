import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const financialStatements = {
  slug: 'financial-statements',
  title: 'Financial Statements',
  readTime: 14,
  sections: [
    { id: 'overview', title: 'Overview' },
    { id: 'income-statement', title: 'Income Statement' },
    { id: 'balance-sheet', title: 'Balance Sheet' },
    { id: 'cash-flow', title: 'Cash Flow Statement' },
    { id: 'how-they-connect', title: 'How They Connect' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `Financial statements are the formal reports that summarise a business's financial activities.
    There are three primary statements: the Income Statement (profit/loss), the Balance Sheet (financial position),
    and the Cash Flow Statement (cash movements). Together they give a complete picture of performance, position, and liquidity.`,

    incomeStatement: {
      description: 'Shows revenue, expenses, and profit over a specific period (e.g., a year or quarter).',
      structure: [
        { label: 'Revenue (Sales)', amount: 186500, indent: false },
        { label: 'Less: Cost of Goods Sold', amount: -82000, indent: true },
        { label: 'GROSS PROFIT', amount: 104500, bold: true },
        { label: 'Less: Operating Expenses', amount: 0, bold: true },
        { label: 'Wages & Salaries', amount: -42000, indent: true },
        { label: 'Rent Expense', amount: -14400, indent: true },
        { label: 'Electricity & Gas', amount: -5600, indent: true },
        { label: 'Depreciation', amount: -8000, indent: true },
        { label: 'Other Expenses', amount: -3200, indent: true },
        { label: 'OPERATING PROFIT', amount: 31300, bold: true },
        { label: 'Less: Interest Expense', amount: -1800, indent: true },
        { label: 'PROFIT BEFORE TAX', amount: 29500, bold: true },
        { label: 'Less: Tax (20%)', amount: -5900, indent: true },
        { label: 'NET PROFIT', amount: 23600, bold: true },
      ],
    },

    balanceSheet: {
      description: 'A snapshot of what the business owns (assets), owes (liabilities), and the owner\'s stake (equity) at a point in time.',
      assets: [
        { label: 'NON-CURRENT ASSETS', amount: 0, bold: true },
        { label: 'Equipment (net)', amount: 45000, indent: true },
        { label: 'Premises (net)', amount: 120000, indent: true },
        { label: 'Total Non-Current Assets', amount: 165000, bold: true },
        { label: 'CURRENT ASSETS', amount: 0, bold: true },
        { label: 'Inventory', amount: 12500, indent: true },
        { label: 'Trade Receivables', amount: 8300, indent: true },
        { label: 'Cash & Bank', amount: 6200, indent: true },
        { label: 'Total Current Assets', amount: 27000, bold: true },
        { label: 'TOTAL ASSETS', amount: 192000, bold: true },
      ],
      equity: [
        { label: 'EQUITY', amount: 0, bold: true },
        { label: "Owner's Capital", amount: 150000, indent: true },
        { label: 'Retained Earnings', amount: 18000, indent: true },
        { label: 'Total Equity', amount: 168000, bold: true },
      ],
      liabilities: [
        { label: 'NON-CURRENT LIABILITIES', amount: 0, bold: true },
        { label: 'Bank Loan', amount: 18000, indent: true },
        { label: 'CURRENT LIABILITIES', amount: 0, bold: true },
        { label: 'Trade Payables', amount: 5400, indent: true },
        { label: 'Accruals', amount: 600, indent: true },
        { label: 'Total Liabilities', amount: 24000, bold: true },
        { label: 'TOTAL EQUITY & LIABILITIES', amount: 192000, bold: true },
      ],
    },

    cashFlow: {
      description: 'Shows actual cash inflows and outflows over a period. Profit ≠ Cash — a business can be profitable but run out of cash.',
      sections: [
        {
          name: 'Operating Activities',
          items: [
            { label: 'Net Profit', amount: 23600 },
            { label: 'Add: Depreciation', amount: 8000 },
            { label: 'Increase in Payables', amount: 1200 },
            { label: 'Increase in Receivables', amount: -2400 },
            { label: 'Net Cash from Operations', amount: 30400, bold: true },
          ],
        },
        {
          name: 'Investing Activities',
          items: [
            { label: 'Purchase of Equipment', amount: -12000 },
            { label: 'Net Cash from Investing', amount: -12000, bold: true },
          ],
        },
        {
          name: 'Financing Activities',
          items: [
            { label: 'Loan Repayment', amount: -5000 },
            { label: 'Owner Drawings', amount: -8000 },
            { label: 'Net Cash from Financing', amount: -13000, bold: true },
          ],
        },
        {
          name: 'Summary',
          items: [
            { label: 'Net Increase in Cash', amount: 5400, bold: true },
            { label: 'Opening Cash Balance', amount: 800 },
            { label: 'Closing Cash Balance', amount: 6200, bold: true },
          ],
        },
      ],
    },
  },

  keyTerms: [
    { term: 'Revenue', definition: 'Income generated from the primary business activities (sales of goods or services).', example: 'Sunrise Bakery\'s bread sales: £186,500.' },
    { term: 'Expenses', definition: 'Costs incurred in generating revenue during the period.', example: 'Wages, rent, and ingredients used to bake and sell products.' },
    { term: 'Profit', definition: 'The excess of revenue over expenses. Gross profit excludes operating costs; net profit is after all costs and tax.', example: 'Net profit = £23,600.' },
    { term: 'Net Assets', definition: 'Total assets minus total liabilities. Equal to total equity.', example: 'Net assets = £192,000 − £24,000 = £168,000.' },
    { term: 'Retained Earnings', definition: 'Cumulative net profits kept in the business rather than distributed to owners.', example: 'After paying dividends, £18,000 remains in the business.' },
    { term: 'Accruals Basis', definition: 'Transactions recorded when they occur, not when cash moves. Used in financial statements.', example: 'December electricity bill recorded in December, even if paid in January.' },
  ],

  didYouKnow: [
    'A company can show a large net profit on the income statement yet still become insolvent if it runs out of cash — this is called a "cash flow crisis."',
    'The balance sheet is called a "snapshot" because it shows position at one moment. The income statement shows a "film" — activity over a period.',
    'Large companies like Apple have balance sheet totals in the hundreds of billions of dollars, yet still carefully manage cash flow.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Classify each item and identify its placement in the financial statements.',
    rows: [
      { id: 't1', transaction: 'Records depreciation on equipment: £8,000', correctDebit: 'Depreciation Expense', correctCredit: 'Accumulated Depreciation', correctCategory: 'Expense' },
      { id: 't2', transaction: 'Accrues electricity bill of £450 (not yet paid)', correctDebit: 'Electricity Expense', correctCredit: 'Accrued Expenses', correctCategory: 'Expense' },
      { id: 't3', transaction: 'Owner withdraws profit as drawings: £5,000', correctDebit: 'Drawings', correctCredit: 'Bank / Cash', correctCategory: 'Equity' },
      { id: 't4', transaction: 'Transfers net profit to retained earnings: £18,000', correctDebit: 'Profit & Loss / Income Summary', correctCredit: 'Retained Earnings', correctCategory: 'Equity' },
      { id: 't5', transaction: 'Pays corporation tax liability: £5,900', correctDebit: 'Tax Payable', correctCredit: 'Bank / Cash', correctCategory: 'Liability' },
      { id: 't6', transaction: 'Purchases machinery for £12,000 cash', correctDebit: 'Equipment / Machinery', correctCredit: 'Bank / Cash', correctCategory: 'Asset' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'For each item, state whether it appears on the Income Statement (I/S) or Balance Sheet (B/S) by selecting its classification.',
    rows: [
      { id: 'c1', accountName: 'Sales Revenue', correctClassification: 'Income' },
      { id: 'c2', accountName: 'Trade Payables', correctClassification: 'Current Liability' },
      { id: 'c3', accountName: 'Retained Earnings', correctClassification: 'Equity' },
      { id: 'c4', accountName: 'Depreciation Expense', correctClassification: 'Expense' },
      { id: 'c5', accountName: 'Premises (net book value)', correctClassification: 'Non-Current Asset' },
      { id: 'c6', accountName: 'Interest Expense', correctClassification: 'Expense' },
      { id: 'c7', accountName: 'Accrued Expenses', correctClassification: 'Current Liability' },
      { id: 'c8', accountName: 'Prepaid Insurance', correctClassification: 'Current Asset' },
      { id: 'c9', accountName: 'Cost of Goods Sold', correctClassification: 'Expense' },
      { id: 'c10', accountName: 'Share Capital', correctClassification: 'Equity' },
    ] as ClassifyRow[],
  },
}
