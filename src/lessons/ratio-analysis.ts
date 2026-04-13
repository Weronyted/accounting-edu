import type { ClassifyRow } from '@/components/quiz/ClassifyTable'
import type { TransactionRow } from '@/components/quiz/TransactionTable'

export const ratioAnalysis = {
  slug: 'ratio-analysis',
  title: 'Ratio Analysis',
  readTime: 13,
  sections: [
    { id: 'overview', title: 'Overview' },
    { id: 'liquidity', title: 'Liquidity Ratios' },
    { id: 'profitability', title: 'Profitability Ratios' },
    { id: 'efficiency', title: 'Efficiency Ratios' },
    { id: 'calculator', title: 'Interactive Calculator' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `Ratio analysis is the process of calculating and interpreting financial ratios from a
    company's financial statements. Ratios allow comparison across time periods, against industry
    benchmarks, and between competitors. They measure four key dimensions: liquidity, profitability,
    efficiency, and solvency.`,

    liquidity: [
      {
        name: 'Current Ratio',
        formula: 'Current Assets ÷ Current Liabilities',
        ideal: '≥ 2:1',
        interpretation: 'Measures ability to pay short-term debts. Below 1 means more current liabilities than assets — liquidity risk.',
        example: '£27,000 ÷ £6,000 = 4.5:1 — very strong liquidity.',
      },
      {
        name: 'Quick Ratio (Acid Test)',
        formula: '(Current Assets − Inventory) ÷ Current Liabilities',
        ideal: '≥ 1:1',
        interpretation: 'Excludes inventory (hardest to liquidate). A stricter test of immediate liquidity.',
        example: '(£27,000 − £12,500) ÷ £6,000 = 2.4:1 — excellent.',
      },
    ],

    profitability: [
      {
        name: 'Gross Profit Margin',
        formula: '(Gross Profit ÷ Revenue) × 100',
        ideal: 'Depends on industry; higher is better',
        interpretation: 'Shows how much of each pound of revenue is kept as gross profit after COGS.',
        example: '(£104,500 ÷ £186,500) × 100 = 56.0% — strong margin for a bakery.',
      },
      {
        name: 'Net Profit Margin',
        formula: '(Net Profit ÷ Revenue) × 100',
        ideal: '>10% is generally healthy',
        interpretation: 'Shows overall profitability after all expenses and tax.',
        example: '(£23,600 ÷ £186,500) × 100 = 12.7% — healthy.',
      },
      {
        name: 'Return on Capital Employed (ROCE)',
        formula: 'EBIT ÷ Capital Employed × 100',
        ideal: 'Should exceed cost of borrowing (e.g., >5%)',
        interpretation: 'Measures how efficiently the business generates profit from its capital. Capital Employed = Total Assets − Current Liabilities.',
        example: '£31,300 ÷ (£192,000 − £6,000) × 100 = 16.8% — excellent.',
      },
    ],

    efficiency: [
      {
        name: 'Inventory Days',
        formula: '(Inventory ÷ COGS) × 365',
        ideal: 'Lower is generally better',
        interpretation: 'Average days inventory is held before being sold. High days = slow-moving stock risk.',
        example: '(£12,500 ÷ £82,000) × 365 = 55.6 days.',
      },
      {
        name: 'Receivable Days',
        formula: '(Trade Receivables ÷ Revenue) × 365',
        ideal: 'Should be ≤ credit terms offered',
        interpretation: 'Average days to collect from credit customers. High = poor credit control.',
        example: '(£8,300 ÷ £186,500) × 365 = 16.2 days — excellent credit control.',
      },
      {
        name: 'Payable Days',
        formula: '(Trade Payables ÷ COGS) × 365',
        ideal: 'Should reflect negotiated terms',
        interpretation: 'Average days taken to pay suppliers. Longer = better cash management, but risk damaging supplier relationships.',
        example: '(£5,400 ÷ £82,000) × 365 = 24.0 days.',
      },
    ],

    sunriseBakeryRatios: {
      currentRatio: 4.5,
      quickRatio: 2.4,
      grossMargin: 56.0,
      netMargin: 12.7,
      roce: 16.8,
      inventoryDays: 55.6,
      receivableDays: 16.2,
      payableDays: 24.0,
    },

    interpretationBadges: {
      currentRatio: { value: '>2', label: 'Good', color: 'success' },
      quickRatio: { value: '>1', label: 'Good', color: 'success' },
      grossMargin: { value: '>40%', label: 'Good', color: 'success' },
      netMargin: { value: '>10%', label: 'Good', color: 'success' },
      roce: { value: '>10%', label: 'Good', color: 'success' },
      inventoryDays: { value: '55.6 days', label: 'Watch', color: 'warning' },
      receivableDays: { value: '16.2 days', label: 'Excellent', color: 'success' },
      payableDays: { value: '24 days', label: 'Acceptable', color: 'success' },
    },
  },

  keyTerms: [
    { term: 'Liquidity', definition: 'The ability of a business to meet its short-term financial obligations as they fall due.', example: 'A current ratio of 4.5:1 indicates strong liquidity.' },
    { term: 'Solvency', definition: 'The ability to pay all debts in the long run — measured by the relationship between debt and equity.', example: 'Gearing ratio above 50% may indicate excessive debt.' },
    { term: 'Profitability', definition: 'The ability to generate profit relative to revenue, assets, or equity.', example: 'Net profit margin of 12.7% shows Sunrise Bakery is well-managed.' },
    { term: 'Current Ratio', definition: 'Current Assets ÷ Current Liabilities. Ideal ≥ 2:1 for a healthy short-term liquidity position.', example: 'Ratio of 0.8:1 = more current debts than assets = high risk.' },
    { term: 'ROCE', definition: 'Return on Capital Employed — EBIT ÷ Capital Employed. Measures the return generated from invested capital.', example: 'ROCE of 16.8% means every £1 of capital generates £0.168 of profit.' },
  ],

  didYouKnow: [
    'Warren Buffett famously focuses on ROCE when evaluating companies — he looks for businesses that consistently generate high returns on employed capital.',
    'A current ratio that is too high (e.g., 10:1) may indicate the company is holding too much idle cash instead of investing it productively.',
    'Inventory days over 90 for a food business would be a serious red flag — the products would spoil before being sold!',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'These transactions affect the key ratios. Identify accounts affected.',
    rows: [
      { id: 't1', transaction: 'Borrows £20,000 long-term bank loan (affects ROCE denominator)', correctDebit: 'Bank / Cash', correctCredit: 'Long-term Bank Loan', correctCategory: 'Asset' },
      { id: 't2', transaction: 'Collects £8,300 from credit customers (improves receivable days)', correctDebit: 'Bank / Cash', correctCredit: 'Trade Receivables', correctCategory: 'Asset' },
      { id: 't3', transaction: 'Sells excess inventory for £4,000 cash (improves current ratio)', correctDebit: 'Bank / Cash', correctCredit: 'Sales Revenue', correctCategory: 'Asset' },
      { id: 't4', transaction: 'Records depreciation on equipment: £8,000 (reduces ROCE)', correctDebit: 'Depreciation Expense', correctCredit: 'Accumulated Depreciation', correctCategory: 'Expense' },
      { id: 't5', transaction: 'Pays off trade payables of £5,400 (improves payable days ratio)', correctDebit: 'Trade Payables', correctCredit: 'Bank / Cash', correctCategory: 'Liability' },
      { id: 't6', transaction: 'Purchases more inventory on credit: £9,000 (affects quick ratio)', correctDebit: 'Inventory', correctCredit: 'Trade Payables', correctCategory: 'Asset' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify each financial item used in ratio calculations.',
    rows: [
      { id: 'c1', accountName: 'Current Assets (Cash + Receivables + Inventory)', correctClassification: 'Current Asset' },
      { id: 'c2', accountName: 'Current Liabilities (Payables + Overdraft)', correctClassification: 'Current Liability' },
      { id: 'c3', accountName: 'EBIT (Earnings Before Interest & Tax)', correctClassification: 'Income' },
      { id: 'c4', accountName: 'Trade Receivables', correctClassification: 'Current Asset' },
      { id: 'c5', accountName: 'Inventory', correctClassification: 'Current Asset' },
      { id: 'c6', accountName: 'Long-term Bank Loan', correctClassification: 'Non-Current Liability' },
      { id: 'c7', accountName: 'Cost of Goods Sold', correctClassification: 'Expense' },
      { id: 'c8', accountName: 'Gross Profit', correctClassification: 'Income' },
      { id: 'c9', accountName: 'Net Profit', correctClassification: 'Income' },
      { id: 'c10', accountName: 'Trade Payables', correctClassification: 'Current Liability' },
    ] as ClassifyRow[],
  },
}
