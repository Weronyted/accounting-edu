import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const depreciation = {
  slug: 'depreciation',
  title: 'Depreciation',
  readTime: 11,
  sections: [
    { id: 'why-depreciate', title: 'Why Assets Depreciate' },
    { id: 'straight-line', title: 'Straight-Line Method' },
    { id: 'reducing-balance', title: 'Reducing Balance Method' },
    { id: 'calculator', title: 'Interactive Calculator' },
    { id: 'journal-entries', title: 'Journal Entries' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `Depreciation is the systematic allocation of the cost of a non-current (fixed) asset
    over its useful economic life. It recognises that assets lose value over time through use, wear
    and tear, or obsolescence. Depreciation is charged as an expense on the income statement and
    reduces the carrying value of the asset on the balance sheet.`,

    whyDepreciate: [
      'Match the cost of the asset against the revenue it generates (matching principle).',
      'Reflect the true value of assets on the balance sheet.',
      'Comply with accounting standards (IAS 16 — Property, Plant & Equipment).',
      'Provide a true and fair view of financial performance.',
    ],

    straightLine: {
      formula: 'Annual Depreciation = (Cost − Residual Value) ÷ Useful Life (years)',
      example: {
        assetName: 'Industrial Oven',
        cost: 10000,
        residualValue: 2000,
        usefulLife: 5,
        annualCharge: 1600,
        table: [
          { year: 1, depCharge: 1600, accDep: 1600, carryingValue: 8400 },
          { year: 2, depCharge: 1600, accDep: 3200, carryingValue: 6800 },
          { year: 3, depCharge: 1600, accDep: 4800, carryingValue: 5200 },
          { year: 4, depCharge: 1600, accDep: 6400, carryingValue: 3600 },
          { year: 5, depCharge: 1600, accDep: 8000, carryingValue: 2000 },
        ],
      },
      note: 'Equal charge every year. Simple and predictable. Most common for buildings and equipment.',
    },

    reducingBalance: {
      formula: 'Annual Depreciation = Carrying Value × Rate %',
      example: {
        assetName: 'Delivery Van',
        cost: 22000,
        rate: 30,
        table: [
          { year: 1, openingCV: 22000, depCharge: 6600, closingCV: 15400 },
          { year: 2, openingCV: 15400, depCharge: 4620, closingCV: 10780 },
          { year: 3, openingCV: 10780, depCharge: 3234, closingCV: 7546 },
          { year: 4, openingCV: 7546, depCharge: 2264, closingCV: 5282 },
          { year: 5, openingCV: 5282, depCharge: 1585, closingCV: 3697 },
        ],
      },
      note: 'Higher charge in early years when asset is most productive. Suitable for vehicles and technology.',
    },

    journalEntries: [
      {
        description: 'Record annual depreciation on the industrial oven (Year 1):',
        debit: 'Depreciation Expense — £1,600',
        credit: 'Accumulated Depreciation (Oven) — £1,600',
        note: 'Accumulated depreciation is a contra-asset — it reduces the asset\'s carrying value on the balance sheet.',
      },
      {
        description: 'Balance sheet presentation (end of Year 2):',
        debit: 'Industrial Oven — Cost: £10,000',
        credit: 'Less: Accumulated Depreciation: (£3,200)\nCarrying Value: £6,800',
        note: 'The asset is never credited directly — Accumulated Depreciation acts as a contra account.',
      },
    ],
  },

  keyTerms: [
    { term: 'Depreciation', definition: 'The systematic allocation of a non-current asset\'s cost over its useful economic life.', example: 'A £10,000 oven depreciated over 5 years: £1,600 per year.' },
    { term: 'Straight-Line', definition: 'Depreciation method that charges an equal amount each year: (Cost − Residual Value) ÷ Life.', example: '(£10,000 − £2,000) ÷ 5 = £1,600/year.' },
    { term: 'Reducing Balance', definition: 'Depreciation method that applies a fixed % to the reducing carrying value each year.', example: '£22,000 × 30% = £6,600 in Year 1; £15,400 × 30% = £4,620 in Year 2.' },
    { term: 'Carrying Value', definition: 'The net book value of an asset: Cost minus Accumulated Depreciation.', example: 'Oven cost £10,000, accumulated dep £3,200 → carrying value £6,800.' },
    { term: 'Accumulated Depreciation', definition: 'The total depreciation charged on an asset since it was acquired. A contra-asset account.', example: 'After 3 years at £1,600/year: accumulated depreciation = £4,800.' },
    { term: 'Residual Value', definition: 'The estimated value of an asset at the end of its useful life. Deducted in straight-line method.', example: 'Van expected to be sold for £2,000 scrap — residual value = £2,000.' },
  ],

  didYouKnow: [
    'Depreciation does not represent a cash outflow — it is a non-cash expense. That is why it is added back in the cash flow statement.',
    'Land is the one tangible non-current asset that is NOT depreciated — it has an indefinite useful life.',
    'Accelerated depreciation (like reducing balance) results in lower taxable profit in early years — some businesses choose it for tax efficiency.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Record the following depreciation-related transactions for Year 1.',
    rows: [
      { id: 't1', transaction: 'Records straight-line depreciation on oven: £1,600', correctDebit: 'Depreciation Expense', correctCredit: 'Accumulated Depreciation (Oven)', correctCategory: 'Expense' },
      { id: 't2', transaction: 'Records reducing balance depreciation on van: £6,600', correctDebit: 'Depreciation Expense', correctCredit: 'Accumulated Depreciation (Van)', correctCategory: 'Expense' },
      { id: 't3', transaction: 'Sells old equipment (carrying value £3,000) for £2,500 cash (loss on disposal)', correctDebit: 'Bank / Cash', correctCredit: 'Equipment', correctCategory: 'Asset' },
      { id: 't4', transaction: 'Records loss on disposal: £500', correctDebit: 'Loss on Disposal', correctCredit: 'Equipment', correctCategory: 'Expense' },
      { id: 't5', transaction: 'Purchases new oven for £12,000 cash', correctDebit: 'Equipment / Oven', correctCredit: 'Bank / Cash', correctCategory: 'Asset' },
      { id: 't6', transaction: 'Closes accumulated depreciation account on fully depreciated asset', correctDebit: 'Accumulated Depreciation', correctCredit: 'Equipment', correctCategory: 'Expense' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify the following accounts related to depreciation.',
    rows: [
      { id: 'c1', accountName: 'Depreciation Expense', correctClassification: 'Expense' },
      { id: 'c2', accountName: 'Accumulated Depreciation', correctClassification: 'Non-Current Asset' },
      { id: 'c3', accountName: 'Equipment (at cost)', correctClassification: 'Non-Current Asset' },
      { id: 'c4', accountName: 'Loss on Disposal', correctClassification: 'Expense' },
      { id: 'c5', accountName: 'Gain on Disposal', correctClassification: 'Income' },
      { id: 'c6', accountName: 'Carrying Value / Net Book Value', correctClassification: 'Non-Current Asset' },
      { id: 'c7', accountName: 'Land & Buildings', correctClassification: 'Non-Current Asset' },
      { id: 'c8', accountName: 'Motor Vehicle (net)', correctClassification: 'Non-Current Asset' },
    ] as ClassifyRow[],
  },
}
