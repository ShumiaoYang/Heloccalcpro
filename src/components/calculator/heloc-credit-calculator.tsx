'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import CreditHealthGaugeChart from '@/components/charts/CreditHealthGaugeChart';
import MortgageBalanceCalculator from './MortgageBalanceCalculator';
import DebtCalculatorDialog from './DebtCalculatorDialog';
import { calculateCredit, calculateApprovedCreditLimit, getMaxLTVByCredit } from '@/lib/heloc/credit-calculator';
import { PropertyType, OccupancyType, DebtDetail } from '@/lib/heloc/types';

// Default values
const DEFAULT_HOME_VALUE = 500000;
const DEFAULT_MORTGAGE_BALANCE = 350000;
const DEFAULT_CREDIT_SCORE = 740;
const DEFAULT_DESIRED_LTV = 85;
const DEFAULT_UTILIZATION_RATIO = 45;

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
    propertyType: PropertyType;
    occupancyType: OccupancyType;
    annualIncome: number;
    subjectHousingPayment: number;
    otherMonthlyDebt: number;
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

  // v3.0 新增字段状态
  const [propertyType, setPropertyType] = useState<PropertyType>('Single-family');
  const [occupancyType, setOccupancyType] = useState<OccupancyType>('Primary residence');
  const [otherMonthlyDebt, setOtherMonthlyDebt] = useState<string>('0');
  const [annualIncome, setAnnualIncome] = useState<string>('120000');
  const [subjectHousingPayment, setSubjectHousingPayment] = useState<string>('2500');
  const [showDebtCalculator, setShowDebtCalculator] = useState(false);

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
    const income = parseFloat(annualIncome) || 0;
    const debt = parseFloat(otherMonthlyDebt) || 0;
    const housing = parseFloat(subjectHousingPayment) || 0;

    if (home <= 0 || credit < 300 || credit > 850) {
      return null;
    }

    try {
      return calculateApprovedCreditLimit({
        homeValue: home,
        mortgageBalance: mortgage,
        creditScore: credit,
        desiredLTV: desiredLTV,
        propertyType: propertyType,
        occupancyType: occupancyType,
        annualIncome: income > 0 ? income : undefined,
        existingMonthlyDebt: debt + housing,
      });
    } catch (error) {
      return null;
    }
  }, [debouncedHomeValue, debouncedMortgageBalance, debouncedCreditScore, desiredLTV, propertyType, occupancyType, annualIncome, otherMonthlyDebt, subjectHousingPayment]);

  // Calculate available amount based on utilization ratio
  const availableAmount = useMemo(() => {
    if (!creditResult) return 0;
    // Use approvedCreditLimit instead of maxHelocAmount
    const limit = 'approvedCreditLimit' in creditResult ? creditResult.approvedCreditLimit : (creditResult as any).maxHelocAmount;
    return Math.round(limit * (utilizationRatio / 100) / 1000) * 1000;
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
      const income = parseFloat(annualIncome) || 0;
      const debt = parseFloat(otherMonthlyDebt) || 0;
      const housing = parseFloat(subjectHousingPayment) || 0;

      const currentDataKey = `${home}-${mortgage}-${credit}-${desiredLTV}-${utilizationRatio}-${propertyType}-${occupancyType}-${income}-${debt}-${housing}`;

      if (prevDataRef.current !== currentDataKey) {
        prevDataRef.current = currentDataKey;
        onValuesChange({
          homeValue: home,
          mortgageBalance: mortgage,
          creditScore: credit,
          desiredLTV: desiredLTV,
          utilizationRatio: utilizationRatio,
          propertyType: propertyType,
          occupancyType: occupancyType,
          annualIncome: income,
          subjectHousingPayment: housing,
          otherMonthlyDebt: debt,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedHomeValue, debouncedMortgageBalance, debouncedCreditScore, desiredLTV, utilizationRatio, propertyType, occupancyType, annualIncome, otherMonthlyDebt, subjectHousingPayment]);

  const handleMortgageConfirm = (balance: number) => {
    setMortgageBalance(balance.toString());
  };

  // v3.0: 债务计算器回调
  const handleDebtCalculatorApply = (totalDebt: number, detail: DebtDetail) => {
    setOtherMonthlyDebt(totalDebt.toString());
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

          {/* Property Type */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-slate-700">Property Type:</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              style={{ width: '140px' }}
            >
              <option value="Single-family">Single-family</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Condo">Condo</option>
              <option value="Multi-family">Multi-family</option>
              <option value="Manufactured">Manufactured</option>
            </select>
          </div>

          {/* Occupancy Type */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-slate-700">Occupancy:</label>
            <select
              value={occupancyType}
              onChange={(e) => setOccupancyType(e.target.value as OccupancyType)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              style={{ width: '150px' }}
            >
              <option value="Primary residence">Primary</option>
              <option value="Second home">Second Home</option>
              <option value="Investment property">Investment</option>
            </select>
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

          {/* Annual Income */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-slate-700">Annual Income:</label>
            <div className="relative" style={{ width: '120px' }}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                placeholder="120000"
                min="0"
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

          {/* Housing Payment */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-slate-700">Housing Payment:</label>
            <div className="relative" style={{ width: '100px' }}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
              <input
                type="number"
                value={subjectHousingPayment}
                onChange={(e) => setSubjectHousingPayment(e.target.value)}
                placeholder="2500"
                min="0"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 pl-7 pr-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          {/* Other Monthly Debt with Calculator */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium text-slate-700">Other Debt:</label>
            <div className="flex items-center gap-1">
              <div className="relative" style={{ width: '100px' }}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                <input
                  type="number"
                  value={otherMonthlyDebt}
                  onChange={(e) => setOtherMonthlyDebt(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 pl-7 pr-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <button
                onClick={() => setShowDebtCalculator(true)}
                className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100 transition-colors"
                title="Open Debt Calculator"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={`grid grid-cols-2 gap-3 ${!creditResult ? 'opacity-0 pointer-events-none' : ''}`}>
        {/* Row 1: Max HELOC Amount */}
        <ResultCard
          label="Maximum HELOC Amount"
          value={creditResult ? `$${Math.round(('approvedCreditLimit' in creditResult ? creditResult.approvedCreditLimit : (creditResult as any).maxHelocAmount) / 1000) * 1000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$0'}
          description="Approved credit line"
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

      {/* v3.0: Debt Calculator Dialog */}
      <DebtCalculatorDialog
        isOpen={showDebtCalculator}
        onClose={() => setShowDebtCalculator(false)}
        onApply={handleDebtCalculatorApply}
        initialValue={parseFloat(otherMonthlyDebt) || 0}
        locale="en"
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
