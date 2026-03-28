'use client';

import { useState, useMemo, useId } from 'react';
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

export default function HelocCalculatorV3() {
  const drawAmountId = useId();
  const primeRateId = useId();

  // Basic inputs
  const [drawAmount, setDrawAmount] = useState<string>(DEFAULT_DRAW_AMOUNT.toString());
  const [primeRate, setPrimeRate] = useState<string>(DEFAULT_PRIME_RATE.toString());
  const [margin, setMargin] = useState<number>(DEFAULT_MARGIN);

  // Advanced inputs
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [annualIncome, setAnnualIncome] = useState<string>('100000');
  const [incomeGrowth, setIncomeGrowth] = useState<keyof typeof INCOME_GROWTH_PRESETS>('moderate');
  const [inflation, setInflation] = useState<keyof typeof INFLATION_PRESETS>('mild');

  // Debounce inputs
  const debouncedDrawAmount = useDebounce(drawAmount, 300);
  const debouncedPrimeRate = useDebounce(primeRate, 300);
  const debouncedAnnualIncome = useDebounce(annualIncome, 300);

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

  // Calculate burden ratio timeline (only when advanced mode is on)
  const burdenRatioTimeline = useMemo(() => {
    if (!showAdvanced) return null;

    const income = parseFloat(debouncedAnnualIncome) || 0;
    if (income === 0) return null;

    const incomeGrowthRate = INCOME_GROWTH_PRESETS[incomeGrowth];
    const inflationRate = INFLATION_PRESETS[inflation];

    return calculateBurdenRatioTimeline(paymentTimeline, income, incomeGrowthRate, inflationRate);
  }, [showAdvanced, paymentTimeline, debouncedAnnualIncome, incomeGrowth, inflation]);

  return (
    <div className="space-y-6">
      {/* Input Form + Chart in Single View */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg">
        {/* Basic Inputs */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">HELOC Payment Calculator</h2>

          {/* Three inputs in one row */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Draw Amount */}
            <div className="flex items-center gap-2">
              <label htmlFor={drawAmountId} className="text-sm font-medium text-slate-700 whitespace-nowrap">Draw Amount:</label>
              <div className="relative" style={{ width: '140px' }}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">$</span>
                <input
                  id={drawAmountId}
                  type="number"
                  value={drawAmount}
                  onChange={(e) => setDrawAmount(e.target.value)}
                  placeholder="100000"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 pl-7 pr-2 text-sm text-slate-800 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            {/* Prime Rate */}
            <div className="flex items-center gap-2">
              <label htmlFor={primeRateId} className="text-sm font-medium text-slate-700 whitespace-nowrap">Prime Rate:</label>
              <div className="relative" style={{ width: '100px' }}>
                <input
                  id={primeRateId}
                  type="number"
                  value={primeRate}
                  onChange={(e) => setPrimeRate(e.target.value)}
                  placeholder="7.5"
                  step="0.1"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 pr-7 text-sm text-slate-800 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">%</span>
              </div>
            </div>

            {/* Margin Slider */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Margin:</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={margin}
                onChange={(e) => setMargin(parseFloat(e.target.value))}
                className="accent-emerald-500"
                style={{ width: '180px' }}
              />
              <span className="font-mono text-base font-semibold text-emerald-600 whitespace-nowrap">
                {margin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart and Advanced Options - Side by side on large screens */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          {/* Chart and Summary Cards */}
          <div className="space-y-3">
            <PaymentTimelineChart
              timeline={burdenRatioTimeline || paymentTimeline}
              showBurdenRatio={showAdvanced && burdenRatioTimeline !== null}
              isAdvancedExpanded={showAdvanced}
            />

            {/* Summary Cards - Below Chart */}
            <div className="min-h-[90px] w-full">
              {paymentTimeline.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>

          {/* Advanced Toggle and Options */}
          <div className="flex flex-col">
            {/* Advanced Toggle */}
            <div className="flex items-center justify-center lg:justify-start">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="group flex items-center gap-3 rounded-full border-2 border-emerald-500 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                <span className="text-base transition-transform group-hover:scale-110">
                  {showAdvanced ? '▼' : '▶'}
                </span>
                <span>See the Real Value over Time</span>
              </button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="mt-4 space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/30 p-4">
                <h3 className="text-sm font-semibold text-emerald-900">Advanced Options</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Current Annual Income</label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">$</span>
                      <input
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        placeholder="100000"
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 pl-7 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="income-growth" className="text-xs font-medium text-slate-700">
                      Income Growth
                    </label>
                    <select
                      id="income-growth"
                      value={incomeGrowth}
                      onChange={(e) => setIncomeGrowth(e.target.value as keyof typeof INCOME_GROWTH_PRESETS)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="conservative">Conservative (2%)</option>
                      <option value="moderate">Moderate (3%)</option>
                      <option value="aggressive">Aggressive (5%)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="inflation" className="text-xs font-medium text-slate-700">
                      Economic Outlook
                    </label>
                    <select
                      id="inflation"
                      value={inflation}
                      onChange={(e) => setInflation(e.target.value as keyof typeof INFLATION_PRESETS)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="mild">Mild Inflation (0.5%)</option>
                      <option value="high">High Inflation (3%)</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-300 bg-white p-3 text-xs text-slate-700">
                  <p className="font-medium text-emerald-800">What does this show?</p>
                  <p className="mt-1.5 leading-relaxed">
                    The burden ratio line shows how your payment feels over time, accounting for your income growth and inflation.
                    A declining ratio means the payment becomes easier to afford as your income grows.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
      <div className="mt-1 text-[10px] leading-tight text-slate-600">{description}</div>
    </div>
  );
}
