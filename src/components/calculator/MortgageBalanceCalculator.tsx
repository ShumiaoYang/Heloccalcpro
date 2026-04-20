'use client';

import { useState, useMemo, useId, type CSSProperties } from 'react';
import { calculateMortgageBalance } from '@/lib/heloc/mortgage-calculator';
import SliderWithValue from './SliderWithValue';

interface MortgageBalanceCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (balance: number) => void;
}

export default function MortgageBalanceCalculator({
  isOpen,
  onClose,
  onConfirm,
}: MortgageBalanceCalculatorProps) {
  const startYearId = useId();
  const startMonthId = useId();
  const termYearsId = useId();
  const annualRateId = useId();

  // Input states
  const [initialAmount, setInitialAmount] = useState<number>(300000);
  const [startYear, setStartYear] = useState<string>('2020');
  const [startMonth, setStartMonth] = useState<string>('01');
  const [annualRate, setAnnualRate] = useState<number>(5.0);
  const [termYears, setTermYears] = useState<number>(30);
  const annualRateRangeStyle = {
    '--range-progress': `${Math.max(0, Math.min(100, (annualRate / 15) * 100))}%`,
  } as CSSProperties;

  // Calculate result
  const result = useMemo(() => {
    const amount = initialAmount || 0;
    if (amount <= 0) return null;

    const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, 1);

    try {
      return calculateMortgageBalance({
        initialAmount: amount,
        startDate,
        annualRate,
        termYears,
      });
    } catch (error) {
      return null;
    }
  }, [initialAmount, startYear, startMonth, annualRate, termYears]);

  const handleConfirm = () => {
    if (result) {
      onConfirm(result.remainingBalance);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-emerald-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Calculate Mortgage Balance
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close calculator"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Initial Amount */}
          <div>
            <SliderWithValue
              label="Initial Mortgage Amount"
              value={initialAmount}
              min={0}
              max={5000000}
              step={5000}
              onChange={setInitialAmount}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
          </div>

          {/* Start Date and Loan Term Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label htmlFor={startYearId} className="text-sm font-medium text-slate-700">
                Mortgage Start Date
              </label>
              <div className="mt-1.5 flex gap-2">
                <select
                  id={startYearId}
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="w-20 rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {Array.from({ length: 50 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <select
                  id={startMonthId}
                  aria-label="Mortgage start month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-16 rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, '0');
                    return (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label htmlFor={termYearsId} className="text-sm font-medium text-slate-700">
                Loan Term
              </label>
              <select
                id={termYearsId}
                value={termYears}
                onChange={(e) => setTermYears(parseInt(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={30}>30 years</option>
              </select>
            </div>
          </div>

          {/* Mortgage Rate Slider */}
          <div>
            <label htmlFor={annualRateId} className="text-sm font-medium text-slate-700">
              Mortgage Rate
            </label>
            <div className="mt-1.5 flex items-center gap-3">
              <input
                id={annualRateId}
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                className="heloc-range flex-1"
                style={annualRateRangeStyle}
              />
              <div className="font-mono text-base font-semibold text-emerald-600 w-14 text-right">
                {annualRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Remaining Balance
              </div>
              <div className="mt-2 font-mono text-2xl font-bold text-emerald-600">
                ${result.remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                {result.monthsPassed} months paid • {result.monthsRemaining} months remaining
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!result}
            className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}
