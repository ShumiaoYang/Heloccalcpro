'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import CreditHealthGaugeChart from '@/components/charts/CreditHealthGaugeChart';
import MortgageBalanceCalculator from './MortgageBalanceCalculator';
import DebtCalculatorDialog from './DebtCalculatorDialog';
import DiagnosticChart from '@/components/charts/DiagnosticChart';
import SliderWithValue from './SliderWithValue';
import { calculateCredit, calculateApprovedCreditLimit, getMaxLTVByCredit } from '@/lib/heloc/credit-calculator';
import { PropertyType, OccupancyType, DebtDetail } from '@/lib/heloc/types';

// Default values
const DEFAULT_HOME_VALUE = 600000;
const DEFAULT_MORTGAGE_BALANCE = 300000;
const DEFAULT_CREDIT_SCORE = 740;
const DEFAULT_DESIRED_LTV = 85;
const DEFAULT_UTILIZATION_RATIO = 40;

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

  // Input states - now using number type for SliderWithValue
  const [homeValue, setHomeValue] = useState<number>(initialHomeValue || DEFAULT_HOME_VALUE);
  const [mortgageBalance, setMortgageBalance] = useState<number>(initialMortgageBalance || DEFAULT_MORTGAGE_BALANCE);
  const [creditScore, setCreditScore] = useState<number>(initialCreditScore || DEFAULT_CREDIT_SCORE);
  const [desiredLTV, setDesiredLTV] = useState<number>(initialDesiredLTV || DEFAULT_DESIRED_LTV);
  const [utilizationRatio, setUtilizationRatio] = useState<number>(initialUtilizationRatio || DEFAULT_UTILIZATION_RATIO);

  // v3.0 fields
  const [propertyType, setPropertyType] = useState<PropertyType>('Single-family');
  const [occupancyType, setOccupancyType] = useState<OccupancyType>('Primary residence');
  const [otherMonthlyDebt, setOtherMonthlyDebt] = useState<number>(950);
  const [annualIncome, setAnnualIncome] = useState<number>(120000);
  const [subjectHousingPayment, setSubjectHousingPayment] = useState<number>(2800);

  const [showDebtCalculator, setShowDebtCalculator] = useState(false);
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);
  const prevDataRef = useRef<string>('');

  const debouncedHomeValue = useDebounce(homeValue, 300);
  const debouncedMortgageBalance = useDebounce(mortgageBalance, 300);
  const debouncedCreditScore = useDebounce(creditScore, 300);

  // Dynamic mortgage max based on home value
  const dynamicMortgageMax = useMemo(() => {
    return homeValue || 500000;
  }, [homeValue]);

  // Enforce mortgage balance <= home value
  useEffect(() => {
    if (mortgageBalance > dynamicMortgageMax) {
      setMortgageBalance(dynamicMortgageMax);
    }
  }, [mortgageBalance, dynamicMortgageMax]);

  const handleUtilizationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setUtilizationRatio(prev => (prev !== newValue ? newValue : prev));
  }, []);

  // Calculate credit result
  const creditResult = useMemo(() => {
    const home = debouncedHomeValue || 0;
    const mortgage = debouncedMortgageBalance || 0;
    const credit = debouncedCreditScore || 0;
    const income = annualIncome || 0;
    const debt = otherMonthlyDebt || 0;
    const housing = subjectHousingPayment || 0;

    if (home <= 0 || credit < 300 || credit > 850) return null;

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

  // Calculate available amount
  const availableAmount = useMemo(() => {
    if (!creditResult) return 0;
    const limit = 'approvedCreditLimit' in creditResult ? creditResult.approvedCreditLimit : (creditResult as any).maxHelocAmount;
    return Math.round(limit * (utilizationRatio / 100) / 1000) * 1000;
  }, [creditResult, utilizationRatio]);

  // Calculate credit score impact
  const creditScoreImpact = useMemo(() => {
    const hardInquiry = 5;
    const newAccount = 5;
    const utilizationPenalty = utilizationRatio < 50 ? 0 : utilizationRatio >= 80 ? 70 : 35;
    return hardInquiry + newAccount + utilizationPenalty;
  }, [utilizationRatio]);

  const healthScore = useMemo(() => {
    const credit = debouncedCreditScore || 0;
    return credit - creditScoreImpact;
  }, [debouncedCreditScore, creditScoreImpact]);

  // Notify parent component when debounced values change
  useEffect(() => {
    if (onValuesChange) {
      const credit = debouncedCreditScore || 0;
      const home = debouncedHomeValue || 0;
      const mortgage = debouncedMortgageBalance || 0;
      const income = annualIncome || 0;
      const debt = otherMonthlyDebt || 0;
      const housing = subjectHousingPayment || 0;

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
  }, [debouncedHomeValue, debouncedMortgageBalance, debouncedCreditScore, desiredLTV, utilizationRatio, propertyType, occupancyType, annualIncome, otherMonthlyDebt, subjectHousingPayment, onValuesChange]);

  const handleMortgageConfirm = (balance: number) => setMortgageBalance(balance);
  const handleDebtCalculatorApply = (totalDebt: number) => setOtherMonthlyDebt(totalDebt);

  return (
    <div className="space-y-6">
      
      {/* ========================================================= */}
      {/* 顶层：控制台 (The Control Panel) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Assets Group */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Property Details</h3>
          <div className="space-y-4">
            <SliderWithValue
              label="Home Value"
              value={homeValue}
              min={50000}
              max={5000000}
              step={5000}
              onChange={setHomeValue}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
            <SliderWithValue
              label="Mortgage Balance"
              value={mortgageBalance}
              min={0}
              max={dynamicMortgageMax}
              step={5000}
              onChange={setMortgageBalance}
              formatValue={(val) => `$${val.toLocaleString()}`}
              helpText={
                <button type="button" onClick={() => setShowMortgageCalc(true)} className="text-left text-[11px] font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                  Forget Your Mortgage Balance?
                </button>
              }
            />
          </div>
        </div>

        {/* Cash Flow Group */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Cash Flow (DTI)</h3>
          <div className="space-y-4">
            <SliderWithValue
              label="Annual Income"
              value={annualIncome}
              min={10000}
              max={1000000}
              step={1000}
              onChange={setAnnualIncome}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
            <SliderWithValue
              label="Housing Payment"
              value={subjectHousingPayment}
              min={0}
              max={25000}
              step={100}
              onChange={setSubjectHousingPayment}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
            <SliderWithValue
              label="Other Debt"
              value={otherMonthlyDebt}
              min={0}
              max={15000}
              step={100}
              onChange={setOtherMonthlyDebt}
              formatValue={(val) => `$${val.toLocaleString()}`}
              helpText={
                <button
                  onClick={() => setShowDebtCalculator(true)}
                  type="button"
                  className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Not sure what Other Debt includes?
                </button>
              }
            />
          </div>
        </div>

        {/* Credit & Terms Group */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Credit & Property Profile</h3>
          <div className="space-y-4">
            <SliderWithValue
              label="Credit Score"
              value={creditScore}
              min={300}
              max={850}
              step={5}
              onChange={setCreditScore}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">Property Type</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyType)} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none">
                <option value="Single-family">Single-family</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Condo">Condo</option>
                <option value="Multi-family">Multi-family</option>
                <option value="Manufactured">Manufactured</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">Occupancy</label>
              <select value={occupancyType} onChange={(e) => setOccupancyType(e.target.value as OccupancyType)} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none">
                <option value="Primary residence">Primary</option>
                <option value="Second home">Second Home</option>
                <option value="Investment property">Investment</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 中层：视觉沙盘 (Diagnostic Chart) */}
      {/* ========================================================= */}
      <div className={`transition-opacity duration-500 ${!creditResult ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        <DiagnosticChart
          annualIncome={annualIncome || 0}
          totalMonthlyDebt={(otherMonthlyDebt || 0) + (subjectHousingPayment || 0)}
          homeValue={debouncedHomeValue || 0}
          mortgageBalance={debouncedMortgageBalance || 0}
          currentApprovedLimit={creditResult ? ('approvedCreditLimit' in creditResult ? creditResult.approvedCreditLimit : (creditResult as any).maxHelocAmount) : 0}
          cltvCap={creditResult ? (creditResult as any).cltvCap : 85}
          creditScore={debouncedCreditScore || 740}
          projectedCLTV={creditResult ? (creditResult as any).projectedLTV : 0}
        />
      </div>

      {/* ========================================================= */}
      {/* 底层：两大金柱 (The Two Pillars: Money & Risk) */}
      {/* ========================================================= */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!creditResult ? 'hidden' : ''}`}>

        {/* Pillar 1: Money (Left) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Bank Approved Limit</div>
            <div className="text-4xl md:text-5xl font-black text-slate-900 mt-2 tracking-tight">
              ${creditResult ? Math.round(('approvedCreditLimit' in creditResult ? creditResult.approvedCreditLimit : (creditResult as any).maxHelocAmount) / 1000) * 1000 : 0}
            </div>
            
            <div className="text-xs text-slate-500 mt-2 mb-8 leading-relaxed">
              💡 Note: Remember, a HELOC is essentially a home-secured credit card. Borrow rationally.
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end text-sm font-medium">
                <span className="text-slate-600">Planned Draw (Utilization)</span>
                <span className={`text-xl font-bold ${utilizationRatio >= 50 ? 'text-red-500' : 'text-emerald-600'}`}>{utilizationRatio}%</span>
              </div>
              <input type="range" min="0" max="100" value={utilizationRatio} onChange={handleUtilizationChange} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-xl border shadow-sm ${utilizationRatio >= 50 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="text-[11px] font-bold tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              {utilizationRatio >= 50 ? (
                <>
                  <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <span className="text-red-600">High Risk Warning</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  <span className="text-emerald-600">Score-Safe Draw Limit</span>
                </>
              )}
            </div>
            <div className={`text-2xl font-bold ${utilizationRatio >= 50 ? 'text-red-600' : 'text-emerald-600'}`}>
              ${availableAmount.toLocaleString()}
            </div>
            
            <div className="text-[11px] mt-1.5 font-medium leading-tight">
              {utilizationRatio >= 50 ?
                  <span className="text-red-600">Exceeding 50% utilization will heavily damage your credit score.</span> :
                  <span className="text-emerald-700">Keeps your utilization under 50% to protect your credit score.</span>}
            </div>
          </div>
        </div>

        {/* Pillar 2: Risk (Right) - 极致瘦身与绝对居中 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-full">
          
          <div className="w-full flex justify-center items-start -mb-6">
            <div className="w-full max-w-[200px]">
              <CreditHealthGaugeChart currentScore={creditScore || 0} healthScore={healthScore} label="Predicted Credit Score" />
            </div>
          </div>

          <div className="w-full bg-slate-50 rounded-xl border border-slate-200 p-4 shadow-sm relative z-10">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
              <span className="text-[13px] font-bold text-slate-700">Total Point Impact</span>
              <span className="text-sm font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-md leading-none shadow-sm border border-red-200/50">
                -{creditScoreImpact} pts
              </span>
            </div>
            
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-400"></div>Hard Inquiry</span>
                  <span className="font-mono font-medium">-5</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-400"></div>New Account</span>
                  <span className="font-mono font-medium">-5</span>
              </div>
              <div className={`flex justify-between items-center pt-2 mt-1 border-t border-slate-200/60 ${utilizationRatio >= 50 ? 'text-red-600 font-bold' : 'font-medium'}`}>
                <span className="flex items-center gap-1.5"><div className={`w-1 h-1 rounded-full ${utilizationRatio >= 50 ? 'bg-red-500' : 'bg-slate-400'}`}></div>Utilization Penalty</span>
                <span className="font-mono">-{utilizationRatio < 50 ? 0 : utilizationRatio >= 80 ? 70 : 35}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <MortgageBalanceCalculator isOpen={showMortgageCalc} onClose={() => setShowMortgageCalc(false)} onConfirm={handleMortgageConfirm} />
      <DebtCalculatorDialog isOpen={showDebtCalculator} onClose={() => setShowDebtCalculator(false)} onApply={handleDebtCalculatorApply} initialValue={otherMonthlyDebt || 0} locale="en" />
    </div>
  );
}