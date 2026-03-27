'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDebounce } from '@/lib/hooks/useDebounce';

const PaymentTimelineChart = dynamic(
  () => import('@/components/charts/PaymentTimelineChart'),
  {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-xl bg-slate-100/50 flex items-center justify-center text-slate-400 text-sm">Loading chart...</div>
  }
);

// Constants
const DEFAULT_DRAW_AMOUNT = 100000;
const DEFAULT_PRIME_RATE = 7.5;
const DEFAULT_MARGIN = 1.5;
const DRAW_PERIOD_MONTHS = 120; // 10 years
const REPAYMENT_PERIOD_MONTHS = 240; // 20 years
const TOTAL_MONTHS = 360; // 30 years

// Income growth presets
const INCOME_GROWTH_PRESETS = {
  conservative: 2,
  moderate: 3,
  aggressive: 5,
} as const;

// Inflation presets
const INFLATION_PRESETS = {
  mild: 0.5,
  high: 3,
} as const;

// Calculate monthly payment for interest-only period
function calculateInterestOnlyPayment(principal: number, annualRate: number): number {
  return (principal * (annualRate / 100)) / 12;
}

// Calculate monthly P&I payment using standard amortization formula
function calculatePIPayment(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

// Calculate payment timeline for 360 months
function calculatePaymentTimeline(drawAmount: number, effectiveRate: number) {
  const timeline: { month: number; payment: number }[] = [];

  // Draw period (months 1-120): Interest-only
  const interestOnlyPayment = calculateInterestOnlyPayment(drawAmount, effectiveRate);
  for (let month = 1; month <= DRAW_PERIOD_MONTHS; month++) {
    timeline.push({ month, payment: interestOnlyPayment });
  }

  // Repayment period (months 121-360): P&I
  const piPayment = calculatePIPayment(drawAmount, effectiveRate, REPAYMENT_PERIOD_MONTHS);
  for (let month = DRAW_PERIOD_MONTHS + 1; month <= TOTAL_MONTHS; month++) {
    timeline.push({ month, payment: piPayment });
  }

  return timeline;
}

// Calculate burden ratio timeline considering income growth and inflation
function calculateBurdenRatioTimeline(
  timeline: { month: number; payment: number }[],
  annualIncome: number,
  incomeGrowthRate: number,
  inflationRate: number
) {
  return timeline.map(({ month, payment }) => {
    const year = Math.floor((month - 1) / 12);

    // Calculate adjusted income with compound growth
    const adjustedIncome = annualIncome * Math.pow(1 + incomeGrowthRate / 100, year);
    const monthlyIncome = adjustedIncome / 12;

    // Calculate real payment value adjusted for inflation
    const realPayment = payment * Math.pow(1 - inflationRate / 100, year);

    // Burden ratio = real payment / monthly income
    const burdenRatio = (realPayment / monthlyIncome) * 100;

    return {
      month,
      payment,
      burdenRatio,
    };
  });
}

interface HelocPaymentCalculatorProps {
  initialDrawAmount?: number;
  initialPrimeRate?: number;
  initialMargin?: number;
  initialAnnualIncome?: number;
  initialMonthlyDebt?: number;
  creditScore?: number;
  onValuesChange?: (values: {
    primeRate: number;
    margin: number;
    annualIncome: number;
    monthlyDebt: number;
  }) => void;
}

export default function HelocPaymentCalculator({
  initialDrawAmount,
  initialPrimeRate,
  initialMargin,
  initialAnnualIncome,
  initialMonthlyDebt,
  creditScore,
  onValuesChange
}: HelocPaymentCalculatorProps = {}) {
  // Basic inputs (internal state for immediate UI feedback)
  const [drawAmount, setDrawAmount] = useState<string>(
    initialDrawAmount ? initialDrawAmount.toString() : DEFAULT_DRAW_AMOUNT.toString()
  );
  const [primeRate, setPrimeRate] = useState<string>(
    initialPrimeRate ? initialPrimeRate.toString() : DEFAULT_PRIME_RATE.toString()
  );
  const [margin, setMargin] = useState<number>(
    initialMargin !== undefined ? initialMargin : DEFAULT_MARGIN
  );
  const [showCreditWarning, setShowCreditWarning] = useState(false);

  // Apply credit score adjustment
  useMemo(() => {
    if (creditScore && creditScore >= 300 && creditScore <= 850) {
      let adjustment = 0;

      if (creditScore >= 740) {
        // Excellent: No adjustment
        adjustment = 0;
      } else if (creditScore >= 700) {
        // Good: +0.375%
        adjustment = 0.375;
      } else if (creditScore >= 660) {
        // Fair: +1%
        adjustment = 1.0;
      } else {
        // Low: +2% and show warning
        adjustment = 2.0;
        setShowCreditWarning(true);
      }

      setMargin(DEFAULT_MARGIN + adjustment);
    }
  }, [creditScore]);

  // Update drawAmount when initialDrawAmount changes (from Credit Calculator)
  useEffect(() => {
    if (initialDrawAmount !== undefined) {
      setDrawAmount(initialDrawAmount.toString());
    }
  }, [initialDrawAmount]);

  // Advanced inputs (internal state for immediate UI feedback)
  const [annualIncome, setAnnualIncome] = useState<string>(
    initialAnnualIncome ? initialAnnualIncome.toString() : '120000'
  );
  const [monthlyDebt, setMonthlyDebt] = useState<string>(
    initialMonthlyDebt ? initialMonthlyDebt.toString() : '2000'
  );
  const [incomeGrowth, setIncomeGrowth] = useState<keyof typeof INCOME_GROWTH_PRESETS>('moderate');
  const [inflation, setInflation] = useState<keyof typeof INFLATION_PRESETS>('mild');

  // Debounce inputs
  const debouncedDrawAmount = useDebounce(drawAmount, 300);
  const debouncedPrimeRate = useDebounce(primeRate, 300);
  const debouncedAnnualIncome = useDebounce(annualIncome, 300);
  const debouncedMonthlyDebt = useDebounce(monthlyDebt, 300);

  // Calculate effective rate (Prime Rate + Margin)
  const effectiveRate = useMemo(() => {
    const prime = parseFloat(debouncedPrimeRate) || 0;
    return prime + margin;
  }, [debouncedPrimeRate, margin]);

  // Calculate payment timeline
  const paymentTimeline = useMemo(() => {
    const amount = parseFloat(debouncedDrawAmount) || 0;
    return calculatePaymentTimeline(amount, effectiveRate);
  }, [debouncedDrawAmount, effectiveRate]);

  // Calculate burden ratio timeline (always calculated)
  const burdenRatioTimeline = useMemo(() => {
    const income = parseFloat(debouncedAnnualIncome) || 0;
    if (income === 0) return null;

    const incomeGrowthRate = INCOME_GROWTH_PRESETS[incomeGrowth];
    const inflationRate = INFLATION_PRESETS[inflation];

    return calculateBurdenRatioTimeline(paymentTimeline, income, incomeGrowthRate, inflationRate);
  }, [paymentTimeline, debouncedAnnualIncome, incomeGrowth, inflation]);

  // Notify parent component when debounced values change
  useEffect(() => {
    if (onValuesChange) {
      const income = parseFloat(debouncedAnnualIncome) || 0;
      const debt = parseFloat(debouncedMonthlyDebt) || 0;
      const prime = parseFloat(debouncedPrimeRate) || 0;

      onValuesChange({
        primeRate: prime,
        margin: margin,
        annualIncome: income,
        monthlyDebt: debt,
      });
    }
  }, [debouncedAnnualIncome, debouncedMonthlyDebt, debouncedPrimeRate, margin, onValuesChange]);

  return (
    <div className="space-y-6">
      {/* Basic Inputs */}
      <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Draw Amount */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Draw Amount:</label>
              <div className="relative" style={{ width: '140px' }}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                <input
                  type="number"
                  value={drawAmount}
                  onChange={(e) => setDrawAmount(e.target.value)}
                  placeholder="100000"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 pl-7 pr-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            {/* Income Growth */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Income Growth:</label>
              <select
                value={incomeGrowth}
                onChange={(e) => setIncomeGrowth(e.target.value as keyof typeof INCOME_GROWTH_PRESETS)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                style={{ width: '160px' }}
              >
                <option value="conservative">Conservative (2%)</option>
                <option value="moderate">Moderate (3%)</option>
                <option value="aggressive">Aggressive (5%)</option>
              </select>
            </div>

            {/* Economic Outlook */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Economic Outlook:</label>
              <select
                value={inflation}
                onChange={(e) => setInflation(e.target.value as keyof typeof INFLATION_PRESETS)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                style={{ width: '180px' }}
              >
                <option value="mild">Mild Inflation (0.5%)</option>
                <option value="high">High Inflation (3%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Credit Score Adjustment Notice */}
        {creditScore && creditScore < 740 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            <strong>Rate Adjusted:</strong> Based on your credit score ({creditScore}),
            the margin has been adjusted by +{(margin - DEFAULT_MARGIN).toFixed(2)}%.
          </div>
        )}

        {/* Summary Cards - Above Chart */}
        {paymentTimeline.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SummaryCard
              label="Draw Period Payment"
              value={`$${paymentTimeline[0].payment.toFixed(2)}`}
              description="Months 1-120 (Interest-Only)"
              highlight
            />
            <SummaryCard
              label="Repayment Period Payment"
              value={`$${paymentTimeline[DRAW_PERIOD_MONTHS].payment.toFixed(2)}`}
              description="Months 121-360 (Principal & Interest)"
              highlight
            />
          </div>
        )}

        {/* Chart and Info Card */}
        <div className="mt-6 space-y-6">
          {/* Chart */}
          <div className="w-full overflow-hidden">
            <PaymentTimelineChart
              timeline={burdenRatioTimeline || paymentTimeline}
              showBurdenRatio={burdenRatioTimeline !== null}
              isAdvancedExpanded={true}
            />
          </div>

          {/* Info Card */}
          <div className="w-full">
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4">
              <p className="font-medium text-emerald-900">What does this show?</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                The burden ratio line shows how your payment feels over time, accounting for your income growth and inflation.
                A declining ratio means the payment becomes easier to afford as your income grows.
              </p>
            </div>
          </div>
        </div>

      {/* Credit Warning Modal */}
      {showCreditWarning && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreditWarning(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-red-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-red-700">Credit Score Notice</h3>
            <p className="mt-3 text-sm text-slate-700">
              获批难度较大，建议咨询专业人士。
            </p>
            <p className="mt-2 text-sm text-slate-600">
              With a credit score below 660, HELOC approval may be challenging. We recommend consulting with a financial professional.
            </p>
            <button
              onClick={() => setShowCreditWarning(false)}
              className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              I Understand
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Helper Components

function SummaryCard({
  label,
  value,
  description,
  highlight = false,
}: {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </div>
      <div
        className={`mt-1.5 font-mono text-xl font-bold leading-tight ${
          highlight ? 'text-emerald-600' : 'text-slate-900'
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] leading-tight text-slate-500">{description}</div>
    </div>
  );
}
