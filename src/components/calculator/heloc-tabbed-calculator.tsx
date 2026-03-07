'use client';

import { useState, useCallback, useMemo } from 'react';
import HelocCreditCalculator from './heloc-credit-calculator';
import HelocPaymentCalculator from './heloc-payment-calculator';
import HelocFooter from './HelocFooter';
import PdfReportCTA from './PdfReportCTA';
import { calculateCredit } from '@/lib/heloc/credit-calculator';
import { PropertyType, OccupancyType } from '@/lib/heloc/types';

type TabType = 'credit' | 'payment';

export default function HelocTabbedCalculator() {
  const [activeTab, setActiveTab] = useState<TabType>('credit');

  // Credit Line parameters (page-level state)
  const [homeValue, setHomeValue] = useState(500000);
  const [mortgageBalance, setMortgageBalance] = useState(350000);
  const [creditScore, setCreditScore] = useState(740);
  const [desiredLTV, setDesiredLTV] = useState(80);
  const [utilizationRatio, setUtilizationRatio] = useState(30);

  // v3.0 新增字段
  const [propertyType, setPropertyType] = useState<PropertyType>('Single-family');
  const [occupancyType, setOccupancyType] = useState<OccupancyType>('Primary residence');
  const [subjectHousingPayment, setSubjectHousingPayment] = useState(2500);
  const [otherMonthlyDebt, setOtherMonthlyDebt] = useState(0);

  // Payment Plan parameters (page-level state)
  const [primeRate, setPrimeRate] = useState(7.5);
  const [margin, setMargin] = useState(1.5);
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [monthlyDebt, setMonthlyDebt] = useState(2000);

  const [showPdfModal, setShowPdfModal] = useState(false);

  // Callbacks for child components (must be at top level, not in conditionals)
  const handleCreditValuesChange = useCallback((values: {
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
  }) => {
    setHomeValue(values.homeValue);
    setMortgageBalance(values.mortgageBalance);
    setCreditScore(values.creditScore);
    setDesiredLTV(values.desiredLTV);
    setUtilizationRatio(values.utilizationRatio);
    setPropertyType(values.propertyType);
    setOccupancyType(values.occupancyType);
    setAnnualIncome(values.annualIncome);
    setSubjectHousingPayment(values.subjectHousingPayment);
    setOtherMonthlyDebt(values.otherMonthlyDebt);
  }, []);

  const handlePaymentValuesChange = useCallback((values: {
    primeRate: number;
    margin: number;
    annualIncome: number;
    monthlyDebt: number;
  }) => {
    setPrimeRate(values.primeRate);
    setMargin(values.margin);
    setAnnualIncome(values.annualIncome);
    setMonthlyDebt(values.monthlyDebt);
  }, []);

  // Calculate credit result using page-level parameters
  const creditResult = useMemo(() => {
    if (homeValue <= 0 || creditScore < 300 || creditScore > 850) {
      return null;
    }
    try {
      return calculateCredit({
        homeValue,
        mortgageBalance,
        creditScore,
        desiredLTV,
      });
    } catch (error) {
      return null;
    }
  }, [homeValue, mortgageBalance, creditScore, desiredLTV]);

  // Calculate available amount
  const availableAmount = useMemo(() => {
    if (!creditResult) return 0;
    return Math.round(creditResult.maxHelocAmount * (utilizationRatio / 100) * 100) / 100;
  }, [creditResult, utilizationRatio]);

  const handleGetReportClick = useCallback(() => {
    setShowPdfModal(true);
  }, []);

  return (
    <>
      <div className="space-y-3">
        {/* Tab Buttons and Content - Connected */}
        <div>
          {/* Tab Buttons */}
          <div className="flex gap-0">
            <TabButton
              isActive={activeTab === 'credit'}
              onClick={() => setActiveTab('credit')}
              label="Credit Line"
            />
            <TabButton
              isActive={activeTab === 'payment'}
              onClick={() => setActiveTab('payment')}
              label="Payment Plan"
            />
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl rounded-tl-none border-2 border-emerald-100 bg-white shadow-lg">
            <div className="p-6">
              {/* H2 Titles - Both always in DOM for SEO, visibility controlled by CSS */}
              <div className={`mb-3 ${activeTab === 'credit' ? '' : 'sr-only'}`}>
                <h2 className="text-xl font-bold text-slate-900">HELOC Credit Calculator</h2>
              </div>
              <div className={`mb-3 ${activeTab === 'payment' ? '' : 'sr-only'}`}>
                <h2 className="text-xl font-bold text-slate-900">HELOC Payment Calculator</h2>
              </div>

              {/* Tab Content - Conditional rendering for proper chart initialization */}
              {activeTab === 'credit' ? (
                <HelocCreditCalculator
                  initialHomeValue={homeValue}
                  initialMortgageBalance={mortgageBalance}
                  initialCreditScore={creditScore}
                  initialDesiredLTV={desiredLTV}
                  initialUtilizationRatio={utilizationRatio}
                  onValuesChange={handleCreditValuesChange}
                />
              ) : (
                <HelocPaymentCalculator
                  initialDrawAmount={availableAmount}
                  initialPrimeRate={primeRate}
                  initialMargin={margin}
                  initialAnnualIncome={annualIncome}
                  initialMonthlyDebt={monthlyDebt}
                  creditScore={creditScore}
                  onValuesChange={handlePaymentValuesChange}
                />
              )}
            </div>

            {/* Tab Footer - Inside the tab content card */}
            <HelocFooter onGetReportClick={handleGetReportClick} />
          </div>
        </div>
      </div>

      {/* PDF Purchase Modal */}
      <PdfReportCTA
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        homeValue={homeValue}
        mortgageBalance={mortgageBalance}
        creditScore={creditScore}
        annualIncome={annualIncome}
        monthlyDebt={monthlyDebt}
        primeRate={primeRate}
        margin={margin}
        availableAmount={availableAmount}
        maxHelocAmount={creditResult?.maxHelocAmount || 0}
        propertyType={propertyType}
        occupancyType={occupancyType}
        subjectHousingPayment={subjectHousingPayment}
        otherMonthlyDebt={otherMonthlyDebt}
      />
    </>
  );
}

// Tab Button Component
function TabButton({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-1/4 rounded-t-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
        isActive
          ? 'border-t-2 border-x-2 border-emerald-500 border-b-0 bg-white text-emerald-700'
          : 'border-b-2 border-slate-200 bg-emerald-50 text-slate-600 hover:bg-emerald-100'
      }`}
    >
      {label}
    </button>
  );
}
