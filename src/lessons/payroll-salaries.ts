import type { TransactionRow } from '@/components/quiz/TransactionTable'
import type { ClassifyRow } from '@/components/quiz/ClassifyTable'

export const payrollSalaries = {
  slug: 'payroll-salaries',
  title: 'Payroll & Salaries',
  readTime: 9,
  sections: [
    { id: 'gross-net', title: 'Gross Pay vs Net Pay' },
    { id: 'deductions', title: 'Deductions' },
    { id: 'journal-entries', title: 'Payroll Journal Entries' },
    { id: 'payslip', title: 'Payslip Example' },
    { id: 'key-terms', title: 'Key Terms' },
  ],
  content: {
    intro: `Payroll is the total amount paid to employees for their work.
    Understanding the difference between gross pay and net pay, and being able to
    record payroll journal entries correctly, is an essential accounting skill.`,

    grossVsNet: {
      grossPay: 'Total earnings before any deductions (includes salary, overtime, bonuses).',
      netPay: 'The amount actually received by the employee after all deductions.',
      formula: 'Net Pay = Gross Pay − Employee Deductions',
    },

    deductions: [
      { type: 'Income Tax (PAYE)', description: 'Tax on earnings, deducted at source and paid to HMRC.', example: '20% basic rate on earnings above the personal allowance.' },
      { type: 'Employee NIC', description: 'National Insurance Contribution — social security deducted from employee\'s pay.', example: '12% on earnings between £12,570 and £50,270 per year.' },
      { type: 'Employer NIC', description: 'Employer\'s share of National Insurance — an additional employment cost (NOT deducted from pay).', example: '13.8% on earnings above £9,100 per year.' },
      { type: 'Pension', description: 'Auto-enrolment pension contribution, deducted from gross pay.', example: 'Employee contributes 5%, employer contributes 3% (minimum auto-enrolment rates).' },
      { type: 'Student Loan', description: 'Repayment deducted if income exceeds threshold.', example: 'Plan 2: 9% of income above £27,295/year.' },
    ],

    payslipExample: {
      employee: 'James Baker',
      period: 'January 2025',
      grossPay: 3500,
      deductions: [
        { label: 'Income Tax (PAYE)', amount: 420 },
        { label: 'Employee NIC', amount: 280 },
        { label: 'Pension (5%)', amount: 175 },
      ],
      totalDeductions: 875,
      netPay: 2625,
      employerNIC: 332,
      employerPension: 105,
      totalEmploymentCost: 3937,
    },

    journalEntries: [
      {
        title: 'Step 1: Record gross wages expense',
        entries: [
          { account: 'Wages Expense (Gross)', side: 'DR', amount: '3,500' },
          { account: 'PAYE Payable (Tax creditor)', side: 'CR', amount: '420' },
          { account: 'NIC Payable (Employee)', side: 'CR', amount: '280' },
          { account: 'Pension Payable (Employee)', side: 'CR', amount: '175' },
          { account: 'Wages Payable / Net Pay Due', side: 'CR', amount: '2,625' },
        ],
      },
      {
        title: 'Step 2: Record employer\'s NIC and pension',
        entries: [
          { account: 'Employer NIC Expense', side: 'DR', amount: '332' },
          { account: 'Employer Pension Expense', side: 'DR', amount: '105' },
          { account: 'NIC Payable (Employer)', side: 'CR', amount: '332' },
          { account: 'Pension Payable (Employer)', side: 'CR', amount: '105' },
        ],
      },
      {
        title: 'Step 3: Pay employees',
        entries: [
          { account: 'Wages Payable / Net Pay Due', side: 'DR', amount: '2,625' },
          { account: 'Bank / Cash', side: 'CR', amount: '2,625' },
        ],
      },
      {
        title: 'Step 4: Pay HMRC (Tax + NIC)',
        entries: [
          { account: 'PAYE Payable', side: 'DR', amount: '420' },
          { account: 'NIC Payable (Employee + Employer)', side: 'DR', amount: '612' },
          { account: 'Bank / Cash', side: 'CR', amount: '1,032' },
        ],
      },
    ],
  },

  keyTerms: [
    { term: 'Gross Pay', definition: 'Total earnings before any deductions — the headline figure on a job offer.', example: 'Annual salary £42,000 ÷ 12 = monthly gross pay £3,500.' },
    { term: 'Net Pay', definition: 'Take-home pay — what the employee actually receives after all deductions.', example: 'Gross £3,500 − deductions £875 = net pay £2,625.' },
    { term: 'PAYE', definition: 'Pay As You Earn — the UK system of deducting income tax from wages at source before the employee is paid.', example: 'HMRC sets the tax code; the employer deducts tax from each payroll run.' },
    { term: 'Deductions', definition: 'Amounts withheld from gross pay before payment to the employee: tax, NIC, pension, student loan.', example: 'Total deductions: £875 from James Baker\'s January payslip.' },
    { term: 'Employer Contributions', definition: 'Additional costs borne by the employer beyond gross pay — employer NIC and employer pension.', example: 'Employer NIC £332 + Employer pension £105 = additional cost of £437.' },
  ],

  didYouKnow: [
    'The employer\'s NIC and pension contributions are a "hidden" cost of employment — hiring someone on a £30,000 salary can actually cost over £35,000 in total.',
    'PAYE was introduced in the UK in 1944 to collect tax continuously rather than in one annual lump sum.',
    'The total employment cost (gross pay + employer contributions) is sometimes called the "fully loaded cost" of an employee.',
  ],

  transactionQuiz: {
    businessName: 'Sunrise Bakery Ltd',
    scenario: 'Record the payroll transactions for January 2025. Gross wages: £9,500.',
    rows: [
      { id: 't1', transaction: 'Records gross wages of £9,500 (employees total)', correctDebit: 'Wages Expense', correctCredit: 'Wages Payable / Net Pay Due', correctCategory: 'Expense' },
      { id: 't2', transaction: 'Records PAYE deduction of £1,140 (tax due to HMRC)', correctDebit: 'Wages Expense / PAYE', correctCredit: 'PAYE Payable', correctCategory: 'Expense' },
      { id: 't3', transaction: 'Records employee NIC of £760', correctDebit: 'Wages Expense', correctCredit: 'NIC Payable (Employee)', correctCategory: 'Expense' },
      { id: 't4', transaction: 'Records employer NIC of £902', correctDebit: 'Employer NIC Expense', correctCredit: 'NIC Payable (Employer)', correctCategory: 'Expense' },
      { id: 't5', transaction: 'Pays employees net wages via bank transfer: £7,600', correctDebit: 'Wages Payable', correctCredit: 'Bank / Cash', correctCategory: 'Liability' },
      { id: 't6', transaction: 'Pays HMRC: PAYE £1,140 + Employee NIC £760 + Employer NIC £902', correctDebit: 'PAYE & NIC Payable', correctCredit: 'Bank / Cash', correctCategory: 'Liability' },
    ] as TransactionRow[],
  },

  classifyQuiz: {
    businessContext: 'Classify each payroll-related account for Sunrise Bakery Ltd.',
    rows: [
      { id: 'c1', accountName: 'Wages Expense (Gross)', correctClassification: 'Expense' },
      { id: 'c2', accountName: 'PAYE Payable', correctClassification: 'Current Liability' },
      { id: 'c3', accountName: 'NIC Payable (Employee)', correctClassification: 'Current Liability' },
      { id: 'c4', accountName: 'Employer NIC Expense', correctClassification: 'Expense' },
      { id: 'c5', accountName: 'Pension Payable', correctClassification: 'Current Liability' },
      { id: 'c6', accountName: 'Net Pay Due / Wages Payable', correctClassification: 'Current Liability' },
      { id: 'c7', accountName: 'Pension Expense (Employer)', correctClassification: 'Expense' },
      { id: 'c8', accountName: 'Bank / Cash (after wages paid)', correctClassification: 'Current Asset' },
    ] as ClassifyRow[],
  },
}
