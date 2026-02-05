'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import CreditHealthGaugeChart from '@/components/charts/CreditHealthGaugeChart';
import MortgageBalanceCalculator from './MortgageBalanceCalculator';
import { calculateCredit, getMaxLTVByCredit } from '@/lib/heloc/credit-calculator';

// Default values
const DEFAULT_HOME_VALUE = 500000;
const DEFAULT_MORTGAGE_BALANCE = 350000;
const DEFAULT_CREDIT_SCORE = 740;
const DEFAULT_DESIRED_LTV = 85;
const DEFAULT_UTILIZATION_RATIO = 30;

interface HelocCreditCalculatorProps {
  initialHomeValue?: number;
  initialMortgageBalance?: number;
  initialCreditScore?: number;
  initialDesiredLTV?: number;
  initialUtilizationRatio?: number;
  onValuesChange?: (values: {
    homeValue: number;
    mortgageBalance: number;
    creditScore: number;
    desiredLTV: number;
    utilizationRatio: number;
  }) => void;
}

export default function HelocCreditCalculator({
  initialHomeValue,
  initialMortgageBalance,
  initialCreditScore,
  initialDesiredLTV,
  initialUtilizationRatio,
  onValuesChange
}: HelocCreditCalculatorProps) {
  // Input states (internal, for immediate UI feedback)
  const [homeValue, setHomeValue] = useState<string>(
    initialHomeValue?.toString() || DEFAULT_HOME_VALUE.toString()
  );
  const [mortgageBalance, setMortgageBalance] = useState<string>(
    initialMortgageBalance?.toString() || DEFAULT_MORTGAGE_BALANCE.toString()
  );
  const [creditScore, setCreditScore] = useState<string>(
    initialCreditScore?.toString() || DEFAULT_CREDIT_SCORE.toString()
  );
  const [desiredLTV, setDesiredLTV] = useState<number>(
    initialDesiredLTV || DEFAULT_DESIRED_LTV
  );
  const [utilizationRatio, setUtilizationRatio] = useState<number>(
    initialUtilizationRatio || DEFAULT_UTILIZATION_RATIO
  );

  // Controlled handler for utilization ratio to prevent unnecessary updates
  const handleUtilizationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);

    setUtilizationRatio(prev => {
      // Only update if value actually changed
      if (prev !== newValue) {
        return newValue;
      }
      return prev;
    });
  }, []);

  // Mortgage calculator modal state
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);

  // Track previous values to prevent unnecessary updates
  const prevDataRef = useRef<string>('');

  // Debounce inputs
  const debouncedHomeValue = useDebounce(homeValue, 300);
  const debouncedMortgageBalance = useDebounce(mortgageBalance, 300);
  const debouncedCreditScore = useDebounce(creditScore, 300);

  // Calculate credit result
  const creditResult = useMemo(() => {
    const home = parseFloat(debouncedHomeValue) || 0;
    const mortgage = parseFloat(debouncedMortgageBalance) || 0;
    const credit = parseFloat(debouncedCreditScore) || 0;

    if (home <= 0 || credit < 300 || credit > 850) {
      return null;
    }

    try {
      return calculateCredit({
        homeValue: home,
        mortgageBalance: mortgage,
        creditScore: credit,
        desiredLTV: desiredLTV,
      });
    } catch (error) {
      return null;
    }
  }, [debouncedHomeValue, debouncedMortgageBalance, debouncedCreditScore, desiredLTV]);

  // Calculate available amount based on utilization ratio
  const availableAmount = useMemo(() => {
    if (!creditResult) return 0;
    // Round to 2 decimal places to avoid floating point precision issues
    return Math.round(creditResult.maxHelocAmount * (utilizationRatio / 100) * 100) / 100;
  }, [creditResult, utilizationRatio]);

  // Calculate credit score impact
  const creditScoreImpact = useMemo(() => {
    const hardInquiry = 5;
    const newAccount = 5;
    const utilizationPenalty =
      utilizationRatio < 50 ? 0 :
      utilizationRatio >= 80 ? 70 :
      35;

    return hardInquiry + newAccount + utilizationPenalty;
  }, [utilizationRatio]);

  // Calculate health score
  const healthScore = useMemo(() => {
    const credit = parseFloat(debouncedCreditScore) || 0;
    return credit - creditScoreImpact;
  }, [debouncedCreditScore, creditScoreImpact]);

  // Get max allowed LTV
  const maxAllowedLTV = useMemo(() => {
    const credit = parseFloat(debouncedCreditScore) || 0;
    if (credit < 300 || credit > 850) return 90;
    return getMaxLTVByCredit(credit);
  }, [debouncedCreditScore]);

  // Notify parent component when debounced values change
  useEffect(() => {
    if (onValuesChange) {
      const credit = parseFloat(debouncedCreditScore) || 0;
      const home = parseFloat(debouncedHomeValue) || 0;
      const mortgage = parseFloat(debouncedMortgageBalance) || 0;

      // Create a unique key for current data
      const currentDataKey = `${home}-${mortgage}-${credit}-${desiredLTV}-${utilizationRatio}`;

      // Only call onValuesChange if data actually changed
      if (prevDataRef.current !== currentDataKey) {
        prevDataRef.current = currentDataKey;
        onValuesChange({
          homeValue: home,
          mortgageBalance: mortgage,
          creditScore: credit,
          desiredLTV: desiredLTV,
          utilizationRatio: utilizationRatio,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedHomeValue, debouncedMortgageBalance, debouncedCreditScore, desiredLTV, utilizationRatio]);

  const handleMortgageConfirm = (balance: number) => {
    setMortgageBalance(balance.toString());
  };

  return (
    <div className="space-y-6">
      {/* Input Parameters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start gap-6">
          {/* Home Value */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-slate-700">Home Value:</label>
            <div className="relative" style={{ width: '140px' }}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
              <input
                type="number"
                value={homeValue}
                onChange={(e) => setHomeValue(e.target.value)}
                placeholder="500000"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 pl-7 pr-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          {/* Mortgage Balance */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap text-sm font-medium text-slate-700">Mortgage Balance:</label>
              <div className="relative" style={{ width: '140px' }}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                <input
                  type="number"
                  value={mortgageBalance}
                  onChange={(e) => setMortgageBalance(e.target.value)}
                  placeholder="350000"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 pl-7 pr-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
            <button
              onClick={() => setShowMortgageCalc(true)}
              className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Forget Your Mortgage Balance?
            </button>
          </div>

          {/* Credit Score */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-slate-700">Credit Score:</label>
            <div className="relative" style={{ width: '70px' }}>
              <input
                type="number"
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                placeholder="740"
                min="300"
                max="850"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          {/* Desired LTV Slider */}
          <div className="flex items-center gap-2 pt-2">
            <label className="whitespace-nowrap text-sm font-medium text-slate-700">Desired LTV:</label>
            <input
              type="range"
              min="75"
              max={maxAllowedLTV}
              step="1"
              value={desiredLTV}
              onChange={(e) => setDesiredLTV(parseFloat(e.target.value))}
              className="accent-emerald-500"
              style={{ width: '108px' }}
            />
            <span className="whitespace-nowrap font-mono text-base font-semibold text-emerald-600">
              {desiredLTV}%
            </span>
          </div>
        </div>

        {/* Max LTV Notice */}
        {maxAllowedLTV < 90 && (
          <div className="text-xs text-slate-500">
            Max LTV for your credit score: {maxAllowedLTV}%
          </div>
        )}
      </div>

      {/* Results */}
      <div className={`grid grid-cols-2 gap-3 ${!creditResult ? 'opacity-0 pointer-events-none' : ''}`}>
        {/* Row 1: Max HELOC Amount */}
        <ResultCard
          label="Maximum HELOC Amount"
          value={creditResult ? `$${creditResult.maxHelocAmount.toLocaleString()}` : '$0'}
          description="Total credit line available"
          highlight
        />

        {/* Row 1: Available Amount */}
        <ResultCard
          label="Available Amount"
          value={`$${availableAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          description={`At ${utilizationRatio}% utilization`}
          highlight
        />

        {/* Row 2: Utilization Ratio */}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
          <label className="text-sm font-medium text-slate-700">Utilization Ratio</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              key="utilization-ratio-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={utilizationRatio}
              onChange={handleUtilizationChange}
              className="min-w-0 flex-1 accent-emerald-500"
            />
            <div className="flex-shrink-0 font-mono text-base font-semibold text-emerald-600">
              {utilizationRatio}%
            </div>
          </div>
        </div>

        {/* Row 2-3: Credit Health Chart (spans 2 rows) */}
        <div className="row-span-2 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50/30 p-2" style={{ minHeight: '200px' }}>
          <CreditHealthGaugeChart
            key="credit-health-gauge"
            currentScore={parseFloat(creditScore) || 0}
            healthScore={healthScore}
            label="Credit Health Score"
          />
        </div>

        {/* Row 3: Credit Score Impact */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Potential Credit Score Impact
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold leading-tight text-red-600">
            -{creditScoreImpact} points
          </div>
          <div className="mt-2 space-y-1 text-[10px] text-slate-600">
            <div>• Hard Inquiry: -5 points</div>
            <div>• New Account: -5 points</div>
            <div>
              • Utilization Impact: -
              {utilizationRatio < 50 ? 0 : utilizationRatio >= 80 ? 70 : 35} points
            </div>
          </div>
        </div>
      </div>

      {/* Mortgage Balance Calculator Modal */}
      <MortgageBalanceCalculator
        isOpen={showMortgageCalc}
        onClose={() => setShowMortgageCalc(false)}
        onConfirm={handleMortgageConfirm}
      />
    </div>
  );
}

// Result Card Component
function ResultCard({
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
        highlight ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{label}</div>
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
