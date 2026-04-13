import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const introToAccounting = {
  slug: 'intro-to-accounting',
  title: 'Introduction to Accounting',
  readTime: 8,
  sections: [
    { id: 'what-is-accounting', title: 'What is Accounting?' },
    { id: 'branches', title: 'Branches of Accounting' },
    { id: 'equation', title: 'The Accounting Equation' },
    { id: 'entities', title: 'Types of Business Entity' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `Accounting is the systematic process of recording, measuring, classifying,
    summarising, and communicating financial information about an organisation.
    It is often called "the language of business" because it translates business
    activities into a standard format that stakeholders — owners, investors, banks,
    and tax authorities — can understand and rely upon.`,

    branches: [
      {
        name: 'Financial Accounting',
        description: 'Prepares reports (income statement, balance sheet) for external stakeholders such as investors and regulators. Governed by standards like IFRS and GAAP.',
      },
      {
        name: 'Management Accounting',
        description: 'Produces internal reports — budgets, forecasts, and variance analyses — to support decision-making by managers.',
      },
      {
        name: 'Cost Accounting',
        description: 'Focuses on calculating the cost of producing goods or services to enable pricing decisions and profitability analysis.',
      },
    ],

    entityTypes: [
      {
        name: 'Sole Trader',
        description: 'One owner who has unlimited liability. Simplest structure — common for freelancers and small businesses. The owner and the business are the same legal entity.',
        example: 'A freelance designer operating under their own name.',
      },
      {
        name: 'Partnership',
        description: 'Two or more owners sharing profits and liabilities (typically unlimited). Governed by a partnership agreement.',
        example: 'A two-partner law firm.',
      },
      {
        name: 'Limited Company',
        description: 'A separate legal entity. Shareholders have limited liability — they can only lose what they invested. Must file accounts publicly.',
        example: 'Sunrise Bakery Ltd.',
      },
    ],

    workedExamples: [
      {
        title: 'Example 1: Simple balance check',
        scenario: 'Maria starts a business with £20,000 cash and takes a bank loan of £5,000.',
        solution: `Assets = Cash £25,000 | Equity = Capital £20,000 | Liabilities = Loan £5,000
Assets (£25,000) = Equity (£20,000) + Liabilities (£5,000) ✓`,
      },
      {
        title: 'Example 2: Equipment purchase',
        scenario: 'The business buys equipment for £8,000 cash.',
        solution: `Cash decreases by £8,000. Equipment (Asset) increases by £8,000.
Total Assets remain £25,000. Equation still balances. ✓`,
      },
    ],
  },

  keyTerms: [
    {
      term: 'Accounting',
      definition: 'The process of recording, classifying, and summarising financial transactions to produce financial statements.',
      example: 'Preparing the annual accounts for Sunrise Bakery Ltd.',
    },
    {
      term: 'Bookkeeping',
      definition: 'The day-to-day recording of financial transactions — the data-entry stage of accounting.',
      example: 'Entering sales invoices into the ledger each day.',
    },
    {
      term: 'Financial Statements',
      definition: 'Formal reports summarising a business\'s financial position and performance: Income Statement, Balance Sheet, Cash Flow Statement.',
      example: 'The balance sheet shows assets of £192,000 and liabilities of £24,000.',
    },
    {
      term: 'Entity',
      definition: 'The accounting entity concept: a business is treated as separate from its owner(s), even in a sole tradership.',
      example: 'Maria\'s personal car is not an asset of her business.',
    },
    {
      term: 'Accounting Equation',
      definition: 'Assets = Equity + Liabilities. The fundamental principle that the balance sheet must always balance.',
      example: 'Assets £30,000 = Equity £20,000 + Liabilities £10,000.',
    },
  ],

  didYouKnow: [
    'Double-entry bookkeeping was first documented by Luca Pacioli in 1494 — it has been used for over 500 years.',
    'The word "debit" comes from the Latin "debere" (to owe), and "credit" from "credere" (to believe or trust).',
    'The accounting equation must always balance. If it doesn\'t, a recording error exists.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Sunrise Bakery Ltd has just started trading. Record each transaction by identifying the account debited, account credited, and the category (Asset/Equity/Liability).',
    rows: [
      { id: 't1', transaction: 'Owner invests £30,000 cash into the business', correctDebit: 'Bank / Cash', correctCredit: "Capital / Owner's Equity", correctCategory: 'Equity' },
      { id: 't2', transaction: 'Business takes out a bank loan of £10,000', correctDebit: 'Bank / Cash', correctCredit: 'Bank Loan', correctCategory: 'Liability' },
      { id: 't3', transaction: 'Purchases baking equipment for £8,000 cash', correctDebit: 'Equipment', correctCredit: 'Bank / Cash', correctCategory: 'Asset' },
      { id: 't4', transaction: 'Buys flour and ingredients on credit for £2,500', correctDebit: 'Inventory / Purchases', correctCredit: 'Trade Payables', correctCategory: 'Asset' },
      { id: 't5', transaction: 'Sells cakes to a café for £1,200 cash', correctDebit: 'Bank / Cash', correctCredit: 'Sales Revenue', correctCategory: 'Asset' },
      { id: 't6', transaction: 'Receives a telephone bill of £150 — pays immediately', correctDebit: 'Telephone Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't7', transaction: 'Owner withdraws £500 for personal use', correctDebit: 'Drawings', correctCredit: 'Bank / Cash', correctCategory: 'Equity' },
      { id: 't8', transaction: 'Pays back £2,000 of the bank loan', correctDebit: 'Bank Loan', correctCredit: 'Bank / Cash', correctCategory: 'Liability' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify each account for Sunrise Bakery Ltd.',
    rows: [
      { id: 'c1', accountName: 'Cash at Bank', correctClassification: 'Current Asset' },
      { id: 'c2', accountName: 'Baking Oven (5-year life)', correctClassification: 'Non-Current Asset' },
      { id: 'c3', accountName: 'Trade Payables', correctClassification: 'Current Liability' },
      { id: 'c4', accountName: "Owner's Capital", correctClassification: 'Equity' },
      { id: 'c5', accountName: 'Sales Revenue', correctClassification: 'Income' },
      { id: 'c6', accountName: 'Electricity Expense', correctClassification: 'Expense' },
      { id: 'c7', accountName: 'Bank Loan (5-year term)', correctClassification: 'Non-Current Liability' },
      { id: 'c8', accountName: 'Inventory (Flour & Sugar)', correctClassification: 'Current Asset' },
      { id: 'c9', accountName: 'Retained Earnings', correctClassification: 'Equity' },
      { id: 'c10', accountName: 'Trade Receivables', correctClassification: 'Current Asset' },
    ] as ClassifyRow[],
  },
}
