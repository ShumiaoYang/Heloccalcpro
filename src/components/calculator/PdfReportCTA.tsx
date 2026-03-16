'use client';

import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import SliderWithValue from './SliderWithValue';
import {
  calculateCLTV,
  calculateDTI,
  calculateHelocRate,
  calculateMonthlySavingsByScenario,
  calculateInterestOnlyPayment,
  getMarginByCredit
} from '@/lib/heloc/core-metrics';
import {
  calculateDebtConsolidation,
  calculateHomeRenovation,
  calculateCreditOptimization,
  calculateContingentLiquidity,
  calculateInvestment,
} from '@/lib/heloc/scenario-calculator';
import type { ScenarioType } from '@/types/heloc-ai';
import type { PropertyType, OccupancyType } from '@/lib/heloc/types';

interface FinancialData {
  homeValue: number;
  mortgageBalance: number;
  creditScore: number;
  annualIncome: number;
  monthlyDebt: number;
}

interface PdfReportCTAProps {
  isOpen: boolean;
  onClose: () => void;
  homeValue: number;
  mortgageBalance: number;
  creditScore: number;
  annualIncome: number;
  monthlyDebt: number;
  primeRate: number;
  margin: number;
  availableAmount: number;
  maxHelocAmount: number;
  propertyType: PropertyType;
  occupancyType: OccupancyType;
  subjectHousingPayment: number;
  otherMonthlyDebt: number;
}

type Scenario =
  | 'home_renovation'
  | 'debt_consolidation'
  | 'credit_optimization'
  | 'contingent_liquidity'
  | 'investment';

export default function PdfReportCTA({
  isOpen,
  onClose,
  homeValue: propHomeValue,
  mortgageBalance: propMortgageBalance,
  creditScore: propCreditScore,
  annualIncome: propAnnualIncome,
  monthlyDebt: propMonthlyDebt,
  primeRate: propPrimeRate,
  margin: propMargin,
  availableAmount,
  maxHelocAmount,
  propertyType: propPropertyType,
  occupancyType: propOccupancyType,
  subjectHousingPayment: propSubjectHousingPayment,
  otherMonthlyDebt: propOtherMonthlyDebt
}: PdfReportCTAProps) {
  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Your Goal
  const [email, setEmail] = useState('');
  const [amountNeeded, setAmountNeeded] = useState('');
  const [amountType, setAmountType] = useState<'custom' | 'max' | 'none'>('custom');
  const [scenario, setScenario] = useState<Scenario | ''>('');

  // Step 1 conditional fields (Home Renovation)
  const [renovationDuration, setRenovationDuration] = useState('');
  const [renovationType, setRenovationType] = useState('simple');

  // Step 2: Confirm Financials (local state for user adjustments, initialized from props)
  const [homeValue, setHomeValue] = useState(propHomeValue);
  const [mortgageBalance, setMortgageBalance] = useState(propMortgageBalance);
  const [creditScore, setCreditScore] = useState(propCreditScore);
  const [annualIncome, setAnnualIncome] = useState(propAnnualIncome);
  const [propertyType, setPropertyType] = useState(propPropertyType);
  const [occupancy, setOccupancy] = useState(propOccupancyType);
  const [housingPayment, setHousingPayment] = useState(propSubjectHousingPayment);
  const [otherDebt, setOtherDebt] = useState(propOtherMonthlyDebt);

  // Step 3: Scenario Details
  const [creditCardLimit, setCreditCardLimit] = useState('');
  const [creditCardBalance, setCreditCardBalance] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFreePromo, setIsFreePromo] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Sync props to Step 2 local state when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setHomeValue(propHomeValue);
      setMortgageBalance(propMortgageBalance);
      setCreditScore(propCreditScore);
      setAnnualIncome(propAnnualIncome);
      setPropertyType(propPropertyType);
      setOccupancy(propOccupancyType);
      setHousingPayment(propSubjectHousingPayment);
      setOtherDebt(propOtherMonthlyDebt);
    }
  }, [isOpen, propHomeValue, propMortgageBalance, propCreditScore, propAnnualIncome, propPropertyType, propOccupancyType, propSubjectHousingPayment, propOtherMonthlyDebt]);

  // Poll for PDF generation status
  useEffect(() => {
    if (!isGenerating || !purchaseId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/heloc/purchase-status/${purchaseId}`);
        const data = await response.json();

        if (data.status === 'COMPLETED' && data.pdfUrl) {
          setIsGenerating(false);
          setPdfUrl(data.pdfUrl);
          clearInterval(pollInterval);

          // Auto download PDF
          window.open(data.pdfUrl, '_blank');
        }
      } catch (error) {
        console.error('Failed to check status:', error);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(pollInterval);
  }, [isGenerating, purchaseId]);

  if (!isOpen) return null;

  const steps = [
    { label: 'Your Goal', number: 1 },
    { label: 'Confirm Financials', number: 2 },
    { label: 'Scenario Details', number: 3 },
  ];

  // Validation functions
  const validateStep1 = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!amountNeeded) {
      setError('Please enter the amount needed');
      return false;
    }
    // Validate custom amount must be > 0
    if (amountType === 'custom') {
      const amount = parseFloat(amountNeeded);
      if (isNaN(amount) || amount <= 0) {
        setError('Amount must be greater than 0');
        return false;
      }
    }
    if (!scenario) {
      setError('Please select a usage scenario');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // All fields have default values from sliders, so always valid
    return true;
  };

  const validateStep3 = () => {
    if (scenario !== 'home_renovation') {
      if (!creditCardLimit || !creditCardBalance) {
        setError('Please fill in all credit card information');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setError('');

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handlePurchase = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    setError('');

    try {
      // Calculate HELOC amount based on amountType
      let helocAmount = 0;
      if (amountType === 'custom') {
        helocAmount = parseFloat(amountNeeded) || 0;
      } else if (amountType === 'max') {
        helocAmount = maxHelocAmount;
      } else if (amountType === 'none') {
        helocAmount = maxHelocAmount * 0.5;
      }

      // Use page-level parameters for rate calculation
      const helocRate = calculateHelocRate(propPrimeRate, propMargin);

      // Calculate core metrics using Step 2 local state (user may have adjusted)
      const monthlyDebt = housingPayment + otherDebt;
      const cltv = calculateCLTV(homeValue, mortgageBalance, helocAmount);
      const drawPeriodPayment = calculateInterestOnlyPayment(helocAmount, helocRate);
      const dti = calculateDTI(annualIncome, monthlyDebt, drawPeriodPayment);
      const maxLimit = maxHelocAmount;

      // Calculate monthly savings based on scenario
      const monthlySavings = calculateMonthlySavingsByScenario(scenario as ScenarioType, {
        helocAmount,
        helocRate,
        creditCardBalance: parseFloat(creditCardBalance) || 0,
        creditCardRate: 18, // Average credit card rate
        currentMonthlyPayment: monthlyDebt,
      });

      // Calculate scenario-specific metrics
      let scenarioMetrics = {};
      const baseInput = {
        homeValue,
        mortgageBalance,
        helocLimit: maxLimit,
        helocRate,
        creditScore,
        annualIncome,
        monthlyDebt,
      };

      switch (scenario) {
        case 'debt_consolidation':
          scenarioMetrics = calculateDebtConsolidation({
            ...baseInput,
            creditCardBalance: parseFloat(creditCardBalance) || 0,
            creditCardLimit: parseFloat(creditCardLimit) || 0,
          });
          break;
        case 'home_renovation':
          scenarioMetrics = calculateHomeRenovation({
            ...baseInput,
            renovationCost: helocAmount,
            renovationType: renovationType as 'simple' | 'kitchen_bath' | 'structural',
            renovationDuration: parseInt(renovationDuration) || 6,
          });
          break;
        case 'credit_optimization':
          scenarioMetrics = calculateCreditOptimization({
            ...baseInput,
            creditCardBalance: parseFloat(creditCardBalance) || 0,
            creditCardLimit: parseFloat(creditCardLimit) || 0,
          });
          break;
        case 'contingent_liquidity':
          scenarioMetrics = calculateContingentLiquidity({
            ...baseInput,
            monthlyExpenses: monthlyDebt, // Use monthlyDebt as proxy for expenses
          });
          break;
        case 'investment':
          scenarioMetrics = calculateInvestment({
            ...baseInput,
            investmentAmount: helocAmount,
            expectedReturn: 8, // Default expected return
          });
          break;
      }

      // Build complete calculated data
      const calculatedData = {
        scenario: scenario as ScenarioType,
        coreMetrics: {
          maxLimit,
          helocRate,
          cltv,
          dti,
          monthlySavings,
        },
        scenarioMetrics,
      };

      const response = await fetch('/api/heloc/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          calculationData: {
            inputs: {
              drawAmount: helocAmount,
              primeRate: propPrimeRate,
              margin: propMargin,
            },
            results: {
              effectiveRate: helocRate,
              drawPeriodPayment,
              repaymentPeriodPayment: drawPeriodPayment * 1.5,
            },
          },
          calculatedData,
          // Step 1 data
          amountNeeded: amountType === 'custom' ? parseFloat(amountNeeded) : amountType,
          scenario,
          renovationDuration: scenario === 'home_renovation' ? parseInt(renovationDuration) : undefined,
          renovationType: scenario === 'home_renovation' ? renovationType : undefined,
          // Step 2 data
          homeValue: homeValue,
          mortgageBalance: mortgageBalance,
          creditScore: creditScore,
          annualIncome: annualIncome,
          monthlyDebt: housingPayment + otherDebt,
          propertyType,
          occupancy,
          subjectHousingPayment: housingPayment,
          otherMonthlyDebt: otherDebt,
          // Step 3 data
          creditCardLimit: scenario !== 'home_renovation' ? parseFloat(creditCardLimit) : undefined,
          creditCardBalance: scenario !== 'home_renovation' ? parseFloat(creditCardBalance) : undefined,
        }),
      });

      const data = await response.json();

      if (data.isFreePromo) {
        // Free promo user - show generating state
        setIsFreePromo(true);
        setIsGenerating(true);
        setPurchaseId(data.purchaseId);
        setLoading(false);
      } else if (data.url) {
        // Regular paid user - redirect to Stripe
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[85vh] rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-stone-50 shadow-2xl flex flex-col">
        {/* Header Section (Fixed) */}
        <div className="flex-shrink-0 p-5 pb-3">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-xl text-stone-400 hover:text-stone-600 transition"
          >
            ×
          </button>

          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} steps={steps} />
        </div>

        {/* Step Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 min-h-[350px]">
          {/* Step 1: Your Goal */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <h3 className="text-lg font-bold text-stone-900 mb-3">Your Goal</h3>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-red-600 mb-1">
                  <span className="text-lg">⚠️</span>
                  Email for report copy:
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Amount Needed */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Amount Needed *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">$</span>
                  <input
                    type="text"
                    list="amount-options"
                    placeholder="Enter amount or select"
                    value={amountNeeded}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAmountNeeded(value);
                      // Check if it's a preset option
                      if (value === 'As much as possible' || value === 'No specific target') {
                        setAmountType(value === 'As much as possible' ? 'max' : 'none');
                      } else {
                        setAmountType('custom');
                      }
                    }}
                    className="w-full px-3 py-2 pl-7 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <datalist id="amount-options">
                    <option value="As much as possible" />
                    <option value="No specific target" />
                  </datalist>
                </div>
              </div>

              {/* Scenario */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Scenario *
                </label>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as Scenario)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select usage scenario</option>
                  <option value="home_renovation">Home Renovation</option>
                  <option value="debt_consolidation">Debt Consolidation</option>
                  <option value="credit_optimization">Credit/Asset Optimization</option>
                  <option value="contingent_liquidity">Contingent Liquidity</option>
                  <option value="investment">Investment/Other</option>
                </select>
              </div>

              {error && <p className="text-red-600 text-xs">{error}</p>}

              <button
                onClick={handleNext}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 text-sm rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Confirm Financials */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-stone-900 mb-3">Confirm Financials</h3>

              {/* Sliders */}
              <div className="space-y-3">
                <SliderWithValue
                  label="Home Value (FMV)"
                  value={homeValue}
                  min={100000}
                  max={2000000}
                  step={10000}
                  onChange={setHomeValue}
                  formatValue={formatCurrency}
                />

                <SliderWithValue
                  label="Mortgage Balance"
                  value={mortgageBalance}
                  min={0}
                  max={homeValue}
                  step={5000}
                  onChange={setMortgageBalance}
                  formatValue={formatCurrency}
                />

                <SliderWithValue
                  label="Housing Payment"
                  value={housingPayment}
                  min={0}
                  max={10000}
                  step={100}
                  onChange={setHousingPayment}
                  formatValue={formatCurrency}
                />

                <SliderWithValue
                  label="Other Debt"
                  value={otherDebt}
                  min={0}
                  max={10000}
                  step={100}
                  onChange={setOtherDebt}
                  formatValue={formatCurrency}
                />

                <SliderWithValue
                  label="Credit Score"
                  value={creditScore}
                  min={300}
                  max={850}
                  step={5}
                  onChange={setCreditScore}
                />

                <SliderWithValue
                  label="Annual Gross Income"
                  value={annualIncome}
                  min={20000}
                  max={500000}
                  step={5000}
                  onChange={setAnnualIncome}
                  formatValue={formatCurrency}
                />
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Single-family">Single Family</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Multi-family">Multi-family</option>
                    <option value="Manufactured">Manufactured</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Occupancy
                  </label>
                  <select
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value as OccupancyType)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Primary residence">Primary Residence</option>
                    <option value="Second home">Second Home</option>
                    <option value="Investment property">Investment</option>
                  </select>
                </div>
              </div>

              <p className="text-center text-sm text-stone-600 font-medium">Looks accurate?</p>

              {error && <p className="text-red-600 text-xs">{error}</p>}

              <div className="flex gap-2">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-2 px-4 text-sm rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 text-sm rounded-lg transition-colors"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Scenario Details */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-stone-900 mb-3">Scenario Details</h3>

              {/* Home Renovation Scenario */}
              {scenario === 'home_renovation' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Expected Duration (months) *
                    </label>
                    <input
                      type="number"
                      placeholder="6"
                      value={renovationDuration}
                      onChange={(e) => setRenovationDuration(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Renovation Type *
                    </label>
                    <select
                      value={renovationType}
                      onChange={(e) => setRenovationType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="simple">Simple Renovation (ROI 50%)</option>
                      <option value="kitchen_bath">Kitchen/Bath Upgrade (ROI 75%)</option>
                      <option value="structural">Structural Addition (ROI 75%)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Other Scenarios - Credit Card Info */}
              {scenario !== 'home_renovation' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Credit Card Total Limit *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">$</span>
                      <input
                        type="number"
                        placeholder="50000"
                        value={creditCardLimit}
                        onChange={(e) => setCreditCardLimit(e.target.value)}
                        className="w-full px-3 py-2 pl-7 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Credit Card Total Balance *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">$</span>
                      <input
                        type="number"
                        placeholder="10000"
                        value={creditCardBalance}
                        onChange={(e) => setCreditCardBalance(e.target.value)}
                        className="w-full px-3 py-2 pl-7 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-red-600 text-xs">{error}</p>}

              {isGenerating ? (
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">
                    Congratulations!
                  </h3>
                  <p className="text-emerald-800 mb-4">
                    You are one of the first 50 Product Hunt users. Your premium report is on us!
                  </p>
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-700"></div>
                    <span>Generating your report...</span>
                  </div>
                  <p className="text-sm text-emerald-600 mt-3">
                    Your report will be sent to <strong>{email}</strong> shortly.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : isFreePromo ? (
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">
                    Report Generated!
                  </h3>
                  <p className="text-emerald-800 mb-4">
                    Your premium HELOC report has been sent to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-emerald-600 mb-4">
                    The download should start automatically. If not, click the button below.
                  </p>
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mb-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Download Report
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-2 px-4 text-sm rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePurchase}
                      disabled={loading}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-400 text-white font-semibold py-2 px-4 text-sm rounded-lg transition-colors"
                    >
                      {loading ? 'Processing...' : 'Generate AI Analysis & Pay $4.99'}
                    </button>
                  </div>

                  {/* Trust Badge */}
                  <p className="text-center text-xs text-stone-500 mt-1">
                    🔒 Secure payment powered by Stripe
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
