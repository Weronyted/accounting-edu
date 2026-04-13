import type { ClassifyRow } from '@/components/quiz/ClassifyTable'
import type { TransactionRow } from '@/components/quiz/TransactionTable'

export const accountClassification = {
  slug: 'account-classification',
  title: 'Account Classification',
  readTime: 10,
  sections: [
    { id: 'chart-of-accounts', title: 'Chart of Accounts' },
    { id: 'classification-tree', title: 'Classification Tree' },
    { id: 'examples', title: '20+ Account Examples' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `Every business uses a Chart of Accounts (CoA) — a structured list of all accounts used
    to record transactions. Each account falls into one of seven categories, which determine how
    it appears in the financial statements and whether it normally has a debit or credit balance.`,

    classificationTree: [
      {
        category: 'Current Assets',
        description: 'Assets expected to be converted to cash or used within 12 months.',
        normalBalance: 'Debit',
        examples: ['Cash & Bank', 'Trade Receivables', 'Inventory / Stock', 'Prepaid Expenses', 'Short-term Investments'],
      },
      {
        category: 'Non-Current Assets',
        description: 'Assets held for more than one year, used in the business.',
        normalBalance: 'Debit',
        examples: ['Land & Buildings', 'Plant & Machinery', 'Motor Vehicles', 'Equipment', 'Patents & Trademarks'],
      },
      {
        category: 'Current Liabilities',
        description: 'Obligations due to be settled within 12 months.',
        normalBalance: 'Credit',
        examples: ['Trade Payables', 'Bank Overdraft', 'Accrued Expenses', 'Tax Payable', 'Short-term Loans'],
      },
      {
        category: 'Non-Current Liabilities',
        description: 'Long-term obligations not due within 12 months.',
        normalBalance: 'Credit',
        examples: ['Long-term Bank Loan', 'Debentures', 'Lease Obligations', 'Pension Liability'],
      },
      {
        category: 'Income',
        description: 'Revenue earned from the business\'s primary activities and other sources.',
        normalBalance: 'Credit',
        examples: ['Sales Revenue', 'Service Revenue', 'Interest Received', 'Rental Income', 'Commission Income'],
      },
      {
        category: 'Expenses',
        description: 'Costs incurred in running the business.',
        normalBalance: 'Debit',
        examples: ['Cost of Goods Sold', 'Wages & Salaries', 'Rent Expense', 'Electricity', 'Depreciation', 'Insurance'],
      },
      {
        category: 'Equity',
        description: 'Owner\'s interest in the business (assets minus liabilities).',
        normalBalance: 'Credit',
        examples: ["Owner's Capital", 'Retained Earnings', 'Share Capital', 'Drawings (contra-equity)', 'Reserves'],
      },
    ],

    detailedAccounts: [
      { account: 'Cash at Bank', category: 'Current Asset', why: 'Immediately available — most liquid asset.', example: 'Balance per bank statement: £12,400' },
      { account: 'Petty Cash', category: 'Current Asset', why: 'Small cash held on premises for minor expenses.', example: 'Float of £200 for office supplies.' },
      { account: 'Trade Receivables', category: 'Current Asset', why: 'Customers who owe money — expected within 30-90 days.', example: 'Hotel owes £4,200 for pastries.' },
      { account: 'Inventory / Stock', category: 'Current Asset', why: 'Raw materials or finished goods ready for sale.', example: 'Flour, sugar, packaging materials.' },
      { account: 'Prepaid Rent', category: 'Current Asset', why: 'Rent paid in advance — not yet consumed.', example: 'Paid 3 months\' rent upfront = asset until used.' },
      { account: 'Land & Buildings', category: 'Non-Current Asset', why: 'Held for long-term business use, not for resale.', example: 'Bakery premises valued at £120,000.' },
      { account: 'Motor Vehicles', category: 'Non-Current Asset', why: 'Delivery vans used in the business.', example: 'Delivery van cost £22,000, carries goods to clients.' },
      { account: 'Equipment', category: 'Non-Current Asset', why: 'Machinery used to produce goods/services.', example: 'Industrial oven: £8,000.' },
      { account: 'Trade Payables', category: 'Current Liability', why: 'Amounts owed to suppliers — due within 30-60 days.', example: 'Mill Supplies Ltd: £3,200 for flour.' },
      { account: 'Bank Overdraft', category: 'Current Liability', why: 'Short-term credit from the bank — repayable on demand.', example: 'Current account £500 overdrawn.' },
      { account: 'Accrued Wages', category: 'Current Liability', why: 'Wages earned by employees but not yet paid.', example: 'Wages for last 3 days of December, paid in January.' },
      { account: 'Bank Loan (5-year)', category: 'Non-Current Liability', why: 'Repayment due over more than 12 months.', example: '£15,000 loan repayable over 5 years.' },
      { account: 'Sales Revenue', category: 'Income', why: 'Primary source of income from selling bread and cakes.', example: 'November sales: £28,500.' },
      { account: 'Interest Received', category: 'Income', why: 'Earned on savings account.', example: 'Bank pays 2% per annum on deposits.' },
      { account: 'Cost of Goods Sold', category: 'Expense', why: 'Direct cost of producing the goods sold.', example: 'Flour, eggs, and packaging used to bake sold products.' },
      { account: 'Wages Expense', category: 'Expense', why: 'Gross pay for employees.', example: 'Monthly payroll: £9,500 for 3 bakers and 1 driver.' },
      { account: 'Rent Expense', category: 'Expense', why: 'Periodic payment for use of premises.', example: 'Monthly rent: £1,200.' },
      { account: 'Depreciation Expense', category: 'Expense', why: 'Allocation of an asset\'s cost over its useful life.', example: 'Oven depreciated by £1,600 per year.' },
      { account: "Owner's Capital", category: 'Equity', why: 'Initial and additional funds invested by the owner.', example: 'Maria invested £50,000 to start the bakery.' },
      { account: 'Retained Earnings', category: 'Equity', why: 'Cumulative profits left in the business (not drawn out).', example: 'Retained profits after 3 years: £22,000.' },
    ],
  },

  keyTerms: [
    {
      term: 'Current',
      definition: 'Expected to be converted to cash or settled within 12 months of the balance sheet date.',
      example: 'Trade receivables are current assets; bank loans >1 year are non-current.',
    },
    {
      term: 'Non-Current',
      definition: 'Held or due for more than 12 months from the balance sheet date.',
      example: 'A 5-year lease is a non-current liability.',
    },
    {
      term: 'Asset',
      definition: 'A resource controlled by the business from which future economic benefits are expected.',
      example: 'The industrial oven generates revenue by baking products.',
    },
    {
      term: 'Liability',
      definition: 'A present obligation of the business to transfer economic resources in the future.',
      example: 'Trade payables represent money owed to flour suppliers.',
    },
    {
      term: 'Equity',
      definition: "The residual interest in the entity's assets after deducting all liabilities (Assets − Liabilities).",
      example: "If assets = £80,000 and liabilities = £30,000, equity = £50,000.",
    },
  ],

  didYouKnow: [
    'A business\'s Chart of Accounts can have hundreds or thousands of accounts — large companies like Amazon have tens of thousands.',
    'The account classification determines where it appears in financial statements: balance sheet (assets/liabilities/equity) or income statement (income/expenses).',
    'The "liquidity order" — listing assets from most to least liquid — is standard practice: Cash → Receivables → Inventory → Fixed Assets.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Identify the accounts affected by each transaction and classify the debited account.',
    rows: [
      { id: 't1', transaction: 'Buys a commercial fridge on credit: £3,500', correctDebit: 'Equipment / Fridge', correctCredit: 'Trade Payables', correctCategory: 'Asset' },
      { id: 't2', transaction: 'Pays insurance premium for the year: £840', correctDebit: 'Prepaid Insurance / Insurance Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't3', transaction: 'Receives £1,800 from a credit customer', correctDebit: 'Bank / Cash', correctCredit: 'Trade Receivables', correctCategory: 'Asset' },
      { id: 't4', transaction: 'Takes a 3-year business loan: £20,000', correctDebit: 'Bank / Cash', correctCredit: 'Bank Loan', correctCategory: 'Asset' },
      { id: 't5', transaction: 'Pays wages: £4,200', correctDebit: 'Wages Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't6', transaction: 'Sells cake on credit to a restaurant: £650', correctDebit: 'Trade Receivables', correctCredit: 'Sales Revenue', correctCategory: 'Asset' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify each of the following accounts from Sunrise Bakery Ltd\'s chart of accounts.',
    rows: [
      { id: 'c1', accountName: 'Industrial Oven', correctClassification: 'Non-Current Asset' },
      { id: 'c2', accountName: 'Prepaid Insurance', correctClassification: 'Current Asset' },
      { id: 'c3', accountName: 'Accrued Rent', correctClassification: 'Current Liability' },
      { id: 'c4', accountName: 'Retained Earnings', correctClassification: 'Equity' },
      { id: 'c5', accountName: 'Depreciation Expense', correctClassification: 'Expense' },
      { id: 'c6', accountName: 'Long-term Bank Loan', correctClassification: 'Non-Current Liability' },
      { id: 'c7', accountName: 'Commission Received', correctClassification: 'Income' },
      { id: 'c8', accountName: 'Petty Cash', correctClassification: 'Current Asset' },
      { id: 'c9', accountName: 'Trade Receivables', correctClassification: 'Current Asset' },
      { id: 'c10', accountName: 'Owner\'s Capital', correctClassification: 'Equity' },
      { id: 'c11', accountName: 'Motor Vehicle (delivery van)', correctClassification: 'Non-Current Asset' },
      { id: 'c12', accountName: 'Bank Overdraft', correctClassification: 'Current Liability' },
    ] as ClassifyRow[],
  },
}
