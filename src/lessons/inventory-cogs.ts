import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const inventoryCogs = {
  slug: 'inventory-cogs',
  title: 'Inventory & COGS',
  readTime: 12,
  sections: [
    { id: 'what-is-inventory', title: 'What is Inventory?' },
    { id: 'cogs-formula', title: 'COGS Formula' },
    { id: 'fifo', title: 'FIFO Method' },
    { id: 'weighted-average', title: 'Weighted Average Method' },
    { id: 'comparison', title: 'Method Comparison' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `Inventory (also called "stock") refers to goods held for sale or materials used in production.
    The cost of goods sold (COGS) is the direct cost of the items sold during a period.
    How COGS is calculated depends on the inventory valuation method chosen — FIFO, LIFO, or Weighted Average.`,

    cogsFormula: {
      formula: 'COGS = Opening Stock + Purchases − Closing Stock',
      example: {
        openingStock: 8000,
        purchases: 45000,
        closingStock: 11000,
        cogs: 42000,
      },
      note: 'Opening Stock + Purchases = Total Goods Available for Sale. Closing Stock is what remains unsold at period end.',
    },

    fifoExample: {
      description: 'FIFO (First In, First Out) assumes the oldest inventory is sold first.',
      transactions: [
        { date: '1 Jan', type: 'Opening', units: 100, costPerUnit: 5.00, totalCost: 500 },
        { date: '5 Jan', type: 'Purchase', units: 200, costPerUnit: 5.50, totalCost: 1100 },
        { date: '10 Jan', type: 'Sale', units: 150, soldAt: null, cogs: 787.50, note: '100 @ £5.00 + 50 @ £5.50' },
        { date: '15 Jan', type: 'Purchase', units: 100, costPerUnit: 6.00, totalCost: 600 },
        { date: '25 Jan', type: 'Sale', units: 100, soldAt: null, cogs: 575, note: '150 @ £5.50 remaining... 100 @ £5.50' },
        { date: '31 Jan', type: 'Closing', units: 150, costPerUnit: 5.83, totalCost: 875, note: 'Remaining: 0 @ £5.50 + 100 @ £6.00 + 50 @ £5.50 = correct FIFO calc' },
      ],
      summary: {
        openingStock: 500,
        purchases: 1700,
        closingStock: 875,
        cogs: 1325,
      },
    },

    weightedAverageExample: {
      description: 'Weighted Average (AVCO) recalculates average cost after each purchase.',
      transactions: [
        { date: '1 Jan', event: 'Opening Balance', units: 100, avgCost: 5.00, totalValue: 500 },
        { date: '5 Jan', event: 'Purchase 200 @ £5.50', units: 300, avgCost: 5.33, totalValue: 1600 },
        { date: '10 Jan', event: 'Sell 150 units', units: 150, avgCost: 5.33, totalValue: 800, cogs: 800 },
        { date: '15 Jan', event: 'Purchase 100 @ £6.00', units: 250, avgCost: 5.60, totalValue: 1400 },
        { date: '25 Jan', event: 'Sell 100 units', units: 150, avgCost: 5.60, totalValue: 840, cogs: 560 },
        { date: '31 Jan', event: 'Closing Stock', units: 150, avgCost: 5.60, totalValue: 840 },
      ],
      summary: {
        openingStock: 500,
        purchases: 1700,
        closingStock: 840,
        cogs: 1360,
      },
    },

    methodComparison: {
      description: 'The method chosen affects reported profit and inventory values, especially when prices are rising.',
      comparison: [
        { metric: 'Closing Stock Value', fifo: '£875', avco: '£840' },
        { metric: 'COGS', fifo: '£1,325', avco: '£1,360' },
        { metric: 'Gross Profit (if revenue = £2,000)', fifo: '£675', avco: '£640' },
        { metric: 'Effect in Rising Prices', fifo: 'Higher profit, higher stock value', avco: 'Smoothed profit, smoothed stock' },
      ],
      note: 'LIFO (Last In, First Out) is not permitted under IFRS but is allowed under US GAAP.',
    },
  },

  keyTerms: [
    { term: 'FIFO', definition: 'First In, First Out — oldest inventory cost is assigned to goods sold first.', example: 'January stock purchased at £5 is sold before February stock at £6.' },
    { term: 'LIFO', definition: 'Last In, First Out — newest inventory cost used for COGS (not permitted under IFRS).', example: 'Permitted in US GAAP; results in lower profit when prices rise.' },
    { term: 'Weighted Average (AVCO)', definition: 'Calculates a new average cost after each purchase; that average is used for all sales until the next purchase.', example: 'After 100 @ £5 and 200 @ £6, AVCO = £5.67 per unit.' },
    { term: 'COGS', definition: 'Cost of Goods Sold — the direct cost of inventory items sold during the period.', example: 'Opening stock £8,000 + Purchases £45,000 − Closing stock £11,000 = COGS £42,000.' },
    { term: 'Gross Profit', definition: 'Revenue minus COGS. Shows profitability before operating expenses.', example: 'Revenue £60,000 − COGS £42,000 = Gross Profit £18,000.' },
  ],

  didYouKnow: [
    'IFRS prohibits LIFO because it results in outdated inventory values on the balance sheet during periods of rising prices.',
    'Retailers like supermarkets physically rotate stock using FIFO — older products are placed at the front.',
    'A small change in inventory valuation method can significantly change a company\'s reported profit — one reason why consistency is required by accounting standards.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Record the following inventory-related transactions.',
    rows: [
      { id: 't1', transaction: 'Purchases 500 bags of flour at £2 each on credit', correctDebit: 'Purchases / Inventory', correctCredit: 'Trade Payables', correctCategory: 'Asset' },
      { id: 't2', transaction: 'Returns 20 damaged bags of flour to supplier', correctDebit: 'Trade Payables', correctCredit: 'Purchases Returns', correctCategory: 'Liability' },
      { id: 't3', transaction: 'Records COGS for the month: £3,800', correctDebit: 'Cost of Goods Sold', correctCredit: 'Inventory', correctCategory: 'Expense' },
      { id: 't4', transaction: 'Closing stock counted and valued at £1,200 (adjustment)', correctDebit: 'Inventory', correctCredit: 'Cost of Goods Sold', correctCategory: 'Asset' },
      { id: 't5', transaction: 'Sells goods with COGS of £1,600 for £2,400 cash', correctDebit: 'Bank / Cash', correctCredit: 'Sales Revenue', correctCategory: 'Asset' },
      { id: 't6', transaction: 'Writes off spoiled inventory: £180', correctDebit: 'Inventory Write-Off Expense', correctCredit: 'Inventory', correctCategory: 'Expense' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify each account in the inventory section of Sunrise Bakery Ltd.',
    rows: [
      { id: 'c1', accountName: 'Inventory / Stock', correctClassification: 'Current Asset' },
      { id: 'c2', accountName: 'Cost of Goods Sold', correctClassification: 'Expense' },
      { id: 'c3', accountName: 'Purchases Returns', correctClassification: 'Income' },
      { id: 'c4', accountName: 'Gross Profit', correctClassification: 'Income' },
      { id: 'c5', accountName: 'Trade Payables (supplier)', correctClassification: 'Current Liability' },
      { id: 'c6', accountName: 'Inventory Write-Off', correctClassification: 'Expense' },
      { id: 'c7', accountName: 'Sales Revenue', correctClassification: 'Income' },
      { id: 'c8', accountName: 'Purchases / Raw Materials', correctClassification: 'Current Asset' },
    ] as ClassifyRow[],
  },
}
