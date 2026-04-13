import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const doubleEntryBookkeeping = {
  slug: 'double-entry-bookkeeping',
  title: 'Double-Entry Bookkeeping',
  readTime: 12,
  sections: [
    { id: 'what-is-double-entry', title: 'What is Double-Entry?' },
    { id: 'golden-rules', title: 'The Golden Rules' },
    { id: 'debit-credit', title: 'Debit & Credit Rules' },
    { id: 't-accounts', title: 'T-Account Widget' },
    { id: 'journal-entries', title: 'Journal Entries' },
    { id: 'worked-examples', title: 'Worked Examples' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `Every business transaction has two aspects: something is received and something is given.
    Double-entry bookkeeping records both aspects of every transaction — ensuring the accounting equation
    (Assets = Equity + Liabilities) always remains in balance. The system was codified by Luca Pacioli
    in 1494 and remains the global standard today.`,

    goldenRules: [
      {
        ruleType: 'Real Accounts (Assets)',
        debit: 'What comes IN',
        credit: 'What goes OUT',
        example: 'Buying equipment: DR Equipment (comes in), CR Cash (goes out)',
      },
      {
        ruleType: 'Personal Accounts (People)',
        debit: 'The RECEIVER',
        credit: 'The GIVER',
        example: 'Paying a supplier: DR Supplier (receiver of payment), CR Bank (giver)',
      },
      {
        ruleType: 'Nominal Accounts (Income & Expenses)',
        debit: 'All EXPENSES and LOSSES',
        credit: 'All INCOME and GAINS',
        example: 'Paying rent: DR Rent Expense, CR Bank',
      },
    ],

    debitCreditRules: [
      { accountType: 'Assets', increase: 'Debit', decrease: 'Credit', normalBalance: 'Debit' },
      { accountType: 'Liabilities', increase: 'Credit', decrease: 'Debit', normalBalance: 'Credit' },
      { accountType: 'Equity / Capital', increase: 'Credit', decrease: 'Debit', normalBalance: 'Credit' },
      { accountType: 'Revenue / Income', increase: 'Credit', decrease: 'Debit', normalBalance: 'Credit' },
      { accountType: 'Expenses', increase: 'Debit', decrease: 'Credit', normalBalance: 'Debit' },
      { accountType: 'Drawings', increase: 'Debit', decrease: 'Credit', normalBalance: 'Debit' },
    ],

    journalFormat: `A journal entry records the date, accounts affected, amounts, and a brief narration.

    Format:
    Date    | Account                  | Dr (£)  | Cr (£)
    --------|--------------------------|---------|--------
    01 Jan  | Equipment                | 8,000   |
            |   Bank                  |         | 8,000
    Narration: Purchase of oven — cash payment`,

    workedExamples: [
      {
        title: 'Example 1: Capital Introduction',
        transaction: 'Maria introduces £50,000 cash into Sunrise Bakery Ltd.',
        debit: 'Bank / Cash — £50,000',
        credit: "Capital / Owner's Equity — £50,000",
        explanation: 'Cash (asset) comes in → Debit. Capital (equity) increases → Credit.',
      },
      {
        title: 'Example 2: Credit Purchase of Inventory',
        transaction: 'Buys flour on credit from Mill Supplies Ltd: £3,200.',
        debit: 'Purchases / Inventory — £3,200',
        credit: 'Trade Payables (Mill Supplies) — £3,200',
        explanation: 'Inventory (asset) comes in → Debit. Liability created → Credit.',
      },
      {
        title: 'Example 3: Cash Sale',
        transaction: 'Sells bread to café for £800 cash.',
        debit: 'Bank / Cash — £800',
        credit: 'Sales Revenue — £800',
        explanation: 'Cash (asset) comes in → Debit. Revenue (income) increases → Credit.',
      },
      {
        title: 'Example 4: Credit Sale',
        transaction: 'Sells pastries to Hotel on credit: £1,500.',
        debit: 'Trade Receivables (Hotel) — £1,500',
        credit: 'Sales Revenue — £1,500',
        explanation: 'Receivable (asset) increases → Debit. Revenue increases → Credit.',
      },
      {
        title: 'Example 5: Payment to Supplier',
        transaction: 'Pays Mill Supplies £2,000 from bank.',
        debit: 'Trade Payables (Mill Supplies) — £2,000',
        credit: 'Bank / Cash — £2,000',
        explanation: 'Liability reduced → Debit. Cash (asset) goes out → Credit.',
      },
      {
        title: 'Example 6: Receipt from Customer',
        transaction: 'Hotel pays £1,000 of its debt.',
        debit: 'Bank / Cash — £1,000',
        credit: 'Trade Receivables (Hotel) — £1,000',
        explanation: 'Cash comes in → Debit. Receivable reduced → Credit.',
      },
      {
        title: 'Example 7: Bank Loan Received',
        transaction: 'Business receives a £15,000 bank loan.',
        debit: 'Bank / Cash — £15,000',
        credit: 'Bank Loan — £15,000',
        explanation: 'Cash (asset) comes in → Debit. Loan (liability) created → Credit.',
      },
      {
        title: 'Example 8: Rent Expense',
        transaction: 'Pays monthly rent of £1,200 by bank transfer.',
        debit: 'Rent Expense — £1,200',
        credit: 'Bank / Cash — £1,200',
        explanation: 'Expense increases → Debit. Cash (asset) goes out → Credit.',
      },
      {
        title: 'Example 9: Owner Drawings',
        transaction: 'Owner withdraws £600 for personal use.',
        debit: 'Drawings — £600',
        credit: 'Bank / Cash — £600',
        explanation: 'Drawings (contra-equity) increases → Debit. Cash goes out → Credit.',
      },
      {
        title: 'Example 10: Loan Repayment',
        transaction: 'Repays £3,000 of bank loan.',
        debit: 'Bank Loan — £3,000',
        credit: 'Bank / Cash — £3,000',
        explanation: 'Liability (loan) reduced → Debit. Cash (asset) goes out → Credit.',
      },
    ],
  },

  keyTerms: [
    {
      term: 'Debit (DR)',
      definition: 'An entry on the LEFT side of a T-account. Increases assets and expenses; decreases liabilities, equity, and income.',
      example: 'DR Bank £10,000 — cash received into the account.',
    },
    {
      term: 'Credit (CR)',
      definition: 'An entry on the RIGHT side of a T-account. Increases liabilities, equity, and income; decreases assets and expenses.',
      example: 'CR Capital £10,000 — owner\'s equity increased.',
    },
    {
      term: 'T-Account',
      definition: 'A visual representation of a ledger account shaped like the letter T, with debits on the left and credits on the right.',
      example: 'The Bank T-account shows all money in (DR) and out (CR).',
    },
    {
      term: 'Journal',
      definition: 'The "book of original entry" — the first place transactions are recorded in date order before being posted to ledger accounts.',
      example: 'The sales journal records all credit sale invoices.',
    },
    {
      term: 'Ledger',
      definition: 'A collection of all T-accounts. The general ledger contains every account used by the business.',
      example: 'The general ledger has accounts for cash, inventory, payables, revenue, etc.',
    },
    {
      term: 'Trial Balance',
      definition: 'A list of all ledger account balances, used to verify that total debits equal total credits.',
      example: 'If the trial balance totals match, no arithmetic errors exist in the ledger.',
    },
  ],

  didYouKnow: [
    'Every single transaction in double-entry bookkeeping creates at least one debit and one credit of equal value.',
    'The "dual aspect concept" — that every transaction has two sides — is one of the oldest concepts in accounting.',
    'Modern accounting software like QuickBooks and Xero still uses double-entry behind the scenes.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Record each transaction using double-entry. Identify the debited account, credited account, and the category of the debited account.',
    rows: [
      { id: 't1', transaction: 'Owner introduces £40,000 cash', correctDebit: 'Bank / Cash', correctCredit: 'Capital', correctCategory: 'Asset' },
      { id: 't2', transaction: 'Purchases baking trays on credit from Kitchenware Co: £900', correctDebit: 'Purchases / Inventory', correctCredit: 'Trade Payables', correctCategory: 'Asset' },
      { id: 't3', transaction: 'Receives £2,000 from a credit customer', correctDebit: 'Bank / Cash', correctCredit: 'Trade Receivables', correctCategory: 'Asset' },
      { id: 't4', transaction: 'Pays wages of £3,500 by bank transfer', correctDebit: 'Wages Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't5', transaction: 'Sells cakes to a hotel on credit: £4,200', correctDebit: 'Trade Receivables', correctCredit: 'Sales Revenue', correctCategory: 'Asset' },
      { id: 't6', transaction: 'Pays electricity bill of £320 by direct debit', correctDebit: 'Electricity Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't7', transaction: 'Owner withdraws £750 cash for personal use', correctDebit: 'Drawings', correctCredit: 'Bank / Cash', correctCategory: 'Equity' },
      { id: 't8', transaction: 'Receives bank interest income of £45', correctDebit: 'Bank / Cash', correctCredit: 'Interest Income', correctCategory: 'Asset' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'For each account below, identify whether it has a normal debit or credit balance.',
    rows: [
      { id: 'c1', accountName: 'Cash at Bank', correctClassification: 'Current Asset' },
      { id: 'c2', accountName: 'Trade Receivables', correctClassification: 'Current Asset' },
      { id: 'c3', accountName: 'Equipment', correctClassification: 'Non-Current Asset' },
      { id: 'c4', accountName: 'Trade Payables', correctClassification: 'Current Liability' },
      { id: 'c5', accountName: "Capital / Owner's Equity", correctClassification: 'Equity' },
      { id: 'c6', accountName: 'Sales Revenue', correctClassification: 'Income' },
      { id: 'c7', accountName: 'Wages Expense', correctClassification: 'Expense' },
      { id: 'c8', accountName: 'Drawings', correctClassification: 'Equity' },
      { id: 'c9', accountName: 'Bank Loan (2-year)', correctClassification: 'Non-Current Liability' },
      { id: 'c10', accountName: 'Inventory', correctClassification: 'Current Asset' },
    ] as ClassifyRow[],
  },
}
