import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const budgetingVariance = {
  slug: 'budgeting-variance',
  title: 'Budgeting & Variance',
  readTime: 10,
  sections: [
    { id: 'budgets', title: 'Types of Budget' },
    { id: 'variance', title: 'Variance Analysis' },
    { id: 'favorable-adverse', title: 'Favourable vs Adverse' },
    { id: 'worked-example', title: 'Worked Example' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `A budget is a financial plan for a future period, expressed in monetary terms.
    Variance analysis compares actual results to the budget to identify and explain differences.
    This helps management take corrective action and improve future planning.`,

    budgetTypes: [
      {
        type: 'Fixed Budget',
        description: 'Set for one level of activity — does not change even if actual output differs.',
        when: 'Suitable when output levels are predictable and stable.',
        advantage: 'Simple to prepare.',
        disadvantage: 'Misleading for comparison if actual activity differs from plan.',
      },
      {
        type: 'Flexible Budget',
        description: 'Adjusted for the actual level of activity achieved. Allows fair comparison.',
        when: 'Suitable in manufacturing or where costs vary significantly with output.',
        advantage: 'More meaningful variance analysis.',
        disadvantage: 'More complex to prepare — requires cost behaviour analysis.',
      },
    ],

    varianceFormula: {
      formula: 'Variance = Actual − Budget',
      note: 'For costs: Adverse if Actual > Budget (overspend). Favourable if Actual < Budget (underspend).\nFor revenue: Favourable if Actual > Budget (better than expected). Adverse if Actual < Budget (shortfall).',
    },

    chartData: [
      { category: 'Sales Revenue', budget: 45000, actual: 48500 },
      { category: 'Cost of Sales', budget: 18000, actual: 19200 },
      { category: 'Wages', budget: 12000, actual: 11800 },
      { category: 'Rent', budget: 3600, actual: 3600 },
      { category: 'Electricity', budget: 1200, actual: 1580 },
      { category: 'Marketing', budget: 2000, actual: 1600 },
    ],

    workedExample: {
      title: 'Sunrise Bakery Ltd — January 2025 Budget vs Actual',
      rows: [
        { item: 'Sales Revenue', budget: 45000, actual: 48500, variance: 3500, favourable: true },
        { item: 'Cost of Goods Sold', budget: 18000, actual: 19200, variance: 1200, favourable: false },
        { item: 'Gross Profit', budget: 27000, actual: 29300, variance: 2300, favourable: true },
        { item: 'Wages', budget: 12000, actual: 11800, variance: 200, favourable: true },
        { item: 'Rent', budget: 3600, actual: 3600, variance: 0, favourable: true },
        { item: 'Electricity', budget: 1200, actual: 1580, variance: 380, favourable: false },
        { item: 'Marketing', budget: 2000, actual: 1600, variance: 400, favourable: true },
        { item: 'Net Profit', budget: 8200, actual: 10720, variance: 2520, favourable: true },
      ],
      analysis: [
        'Sales revenue was £3,500 FAVOURABLE — higher volume or prices than expected.',
        'COGS was £1,200 ADVERSE — increased because sales volume was higher (input cost rose proportionally).',
        'Electricity was £380 ADVERSE — higher than budgeted, possibly due to increased oven usage or price rise.',
        'Marketing was £400 FAVOURABLE — underspent on advertising this month.',
      ],
    },
  },

  keyTerms: [
    { term: 'Budget', definition: 'A financial plan for a future period expressed in monetary terms, used as a control tool.', example: 'January 2025 revenue budget: £45,000.' },
    { term: 'Variance', definition: 'The difference between actual and budgeted results: Actual − Budget.', example: 'Revenue variance = £48,500 − £45,000 = £3,500 F.' },
    { term: 'Favourable (F)', definition: 'A variance that benefits the business — higher than expected revenue or lower than expected costs.', example: 'Wages underspent by £200 — Favourable variance.' },
    { term: 'Adverse (A)', definition: 'A variance that harms the business — lower than expected revenue or higher than expected costs.', example: 'Electricity overspent by £380 — Adverse variance.' },
    { term: 'Flexible Budget', definition: 'A budget adjusted for the actual level of activity to enable meaningful variance analysis.', example: 'If actual output is 20% higher, COGS budget is increased by 20% before comparing.' },
  ],

  didYouKnow: [
    'Many large companies operate on "zero-based budgeting" — every budget line must be justified from scratch each year, rather than rolling forward last year\'s figures.',
    'A favourable variance is not always good news. If costs are under-budget because quality corners were cut, the business may suffer long-term.',
    'Amazon is famous for detailed internal variance reporting — teams are expected to explain any deviation above a certain threshold.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Classify each item as related to budget management.',
    rows: [
      { id: 't1', transaction: 'Actual electricity cost £1,580 vs budget £1,200: records overspend', correctDebit: 'Electricity Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't2', transaction: 'Sales £48,500 recorded for the month', correctDebit: 'Bank / Cash', correctCredit: 'Sales Revenue', correctCategory: 'Asset' },
      { id: 't3', transaction: 'Marketing underspend: saves £400 — no journal needed, just note', correctDebit: 'Marketing Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't4', transaction: 'Wages paid £11,800 (under budget by £200)', correctDebit: 'Wages Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
      { id: 't5', transaction: 'COGS recorded at £19,200 (over budget by £1,200)', correctDebit: 'Cost of Goods Sold', correctCredit: 'Inventory', correctCategory: 'Expense' },
      { id: 't6', transaction: 'Rent paid as budgeted: £3,600', correctDebit: 'Rent Expense', correctCredit: 'Bank / Cash', correctCategory: 'Expense' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify each account for Sunrise Bakery Ltd\'s budget report.',
    rows: [
      { id: 'c1', accountName: 'Sales Revenue', correctClassification: 'Income' },
      { id: 'c2', accountName: 'Cost of Goods Sold', correctClassification: 'Expense' },
      { id: 'c3', accountName: 'Wages Expense', correctClassification: 'Expense' },
      { id: 'c4', accountName: 'Electricity Expense', correctClassification: 'Expense' },
      { id: 'c5', accountName: 'Gross Profit', correctClassification: 'Income' },
      { id: 'c6', accountName: 'Marketing Expense', correctClassification: 'Expense' },
      { id: 'c7', accountName: 'Net Profit', correctClassification: 'Income' },
      { id: 'c8', accountName: 'Accrued Expenses', correctClassification: 'Current Liability' },
    ] as ClassifyRow[],
  },
}
