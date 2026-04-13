import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const bankReconciliation = {
  slug: 'bank-reconciliation',
  title: 'Bank Reconciliation',
  readTime: 9,
  sections: [
    { id: 'purpose', title: 'Purpose & Process' },
    { id: 'common-differences', title: 'Common Differences' },
    { id: 'worked-example', title: 'Worked Example' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `A bank reconciliation is a process of matching the balances in an organisation's accounting
    records for a bank account to the corresponding information on the bank statement.
    The goal is to verify that the cash book balance and the bank statement balance agree,
    after accounting for timing differences and errors.`,

    process: [
      { step: 1, description: 'Obtain the bank statement and the business\'s cash book.' },
      { step: 2, description: 'Tick off items that appear in both — they are already reconciled.' },
      { step: 3, description: 'Identify items in the cash book but NOT on the bank statement (outstanding cheques, unpresented deposits).' },
      { step: 4, description: 'Identify items on the bank statement but NOT in the cash book (bank charges, direct debits, interest).' },
      { step: 5, description: 'Update the cash book for bank-only items, then prepare the reconciliation statement.' },
    ],

    commonDifferences: [
      {
        type: 'Outstanding Cheques (Unpresented)',
        description: 'Cheques written and recorded in the cash book but not yet cleared at the bank.',
        effect: 'Cash book balance > Bank statement balance.',
        action: 'Deduct from bank balance in reconciliation.',
      },
      {
        type: 'Deposits in Transit (Outstanding Lodgements)',
        description: 'Deposits recorded in cash book but not yet shown on bank statement.',
        effect: 'Cash book balance > Bank statement balance.',
        action: 'Add to bank balance in reconciliation.',
      },
      {
        type: 'Bank Charges',
        description: 'Fees charged by the bank — appear on statement but not yet in cash book.',
        effect: 'Bank statement balance < Cash book balance.',
        action: 'Update cash book: DR Bank Charges / CR Cash.',
      },
      {
        type: 'Direct Debits / Standing Orders',
        description: 'Automatic payments set up but not recorded in the cash book.',
        effect: 'Bank statement balance < Cash book balance.',
        action: 'Update cash book: DR relevant expense / CR Cash.',
      },
      {
        type: 'NSF Cheque (Returned)',
        description: 'A customer\'s cheque bounced — the bank reverses the deposit.',
        effect: 'Bank shows lower balance than cash book.',
        action: 'DR Trade Receivables / CR Cash — reverse the receipt.',
      },
      {
        type: 'Bank Interest Received',
        description: 'Interest credited by the bank, not yet recorded in the cash book.',
        effect: 'Bank statement balance > Cash book balance.',
        action: 'Update cash book: DR Cash / CR Interest Income.',
      },
    ],

    workedExample: {
      setup: 'Sunrise Bakery Ltd. 31 January 2025.',
      cashBookBalance: 8450,
      bankStatementBalance: 7980,
      differences: [
        { item: 'Outstanding cheque to Mill Supplies', amount: -820, type: 'bank_reconciling' },
        { item: 'Deposit in transit (30 Jan lodgement)', amount: 1200, type: 'bank_reconciling' },
        { item: 'Bank charges not in cash book', amount: -90, type: 'cash_book_update' },
        { item: 'Direct debit (insurance) missed in cash book', amount: -240, type: 'cash_book_update' },
      ],
      reconciliation: {
        bankBalance: 7980,
        addDepositsInTransit: 1200,
        lessOutstandingCheques: -820,
        adjustedBankBalance: 8360,
        cashBookBalance: 8450,
        lessBankCharges: -90,
        lessDirectDebit: -240,
        adjustedCashBookBalance: 8120,
        note: 'There is still a discrepancy — in a real exam, find the remaining error. Typically a transposition or unrecorded item.',
      },
    },
  },

  keyTerms: [
    { term: 'Reconciliation', definition: 'The process of ensuring two sets of records agree — here, the cash book and bank statement.', example: 'Monthly bank reconciliation confirms the cash book balance is correct.' },
    { term: 'Outstanding Cheque', definition: 'A cheque written by the business and recorded in the cash book, but not yet presented to or cleared by the bank.', example: 'Cheque #1042 to Mill Supplies, written 29 Jan, cleared 3 Feb.' },
    { term: 'Deposit in Transit', definition: 'A deposit recorded in the cash book but not yet shown on the bank statement.', example: 'Cash sales of £1,200 banked on 31 Jan, showing on statement 1 Feb.' },
    { term: 'Bank Charges', definition: 'Fees charged by the bank for account maintenance or transactions, appearing on the bank statement.', example: 'Monthly account fee: £15.' },
    { term: 'NSF Cheque', definition: 'Non-Sufficient Funds — a customer cheque that bounced because the customer had insufficient funds.', example: 'Customer cheque for £480 returned — must re-invoice the customer.' },
  ],

  didYouKnow: [
    'Before computerised banking, bank reconciliations were done entirely by hand — a tedious but critical monthly process.',
    'The most common errors found during reconciliation are transposition errors (e.g., recording £892 as £982) and omitted transactions.',
    'Regular bank reconciliations are one of the most effective internal controls against fraud — discrepancies are quickly identified.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Update the cash book for items found on the bank statement only.',
    rows: [
      { id: 't1', transaction: 'Bank charges of £85 appear on bank statement', correctDebit: 'Bank Charges Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't2', transaction: 'Bank interest received £32 on deposit account', correctDebit: 'Bank / Cash', correctCredit: 'Interest Income', correctCategory: 'Asset' },
      { id: 't3', transaction: 'Standing order for insurance £180 not in cash book', correctDebit: 'Insurance Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't4', transaction: 'Customer cheque £650 returned NSF (bounced)', correctDebit: 'Trade Receivables', correctCredit: 'Bank / Cash', correctCategory: 'Asset' },
      { id: 't5', transaction: 'Direct credit from customer £2,100 (not recorded)', correctDebit: 'Bank / Cash', correctCredit: 'Trade Receivables', correctCategory: 'Asset' },
      { id: 't6', transaction: 'Error: cash book recorded receipt as £980, actual £890', correctDebit: 'Cash Book Correction', correctCredit: 'Bank / Cash', correctCategory: 'Asset' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify the following bank reconciliation-related items.',
    rows: [
      { id: 'c1', accountName: 'Bank / Cash (positive balance)', correctClassification: 'Current Asset' },
      { id: 'c2', accountName: 'Bank Overdraft', correctClassification: 'Current Liability' },
      { id: 'c3', accountName: 'Bank Charges Expense', correctClassification: 'Expense' },
      { id: 'c4', accountName: 'Interest Received', correctClassification: 'Income' },
      { id: 'c5', accountName: 'Insurance Expense (from direct debit)', correctClassification: 'Expense' },
      { id: 'c6', accountName: 'NSF Cheque Reinstated (Trade Receivable)', correctClassification: 'Current Asset' },
    ] as ClassifyRow[],
  },
}
