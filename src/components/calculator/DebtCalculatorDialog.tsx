'use client';

import { useState, useEffect } from 'react';
import { DebtDetail, calculateTotalDebt } from '@/lib/heloc/types';
import SliderWithValue from './SliderWithValue';

interface DebtCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (totalDebt: number, detail: DebtDetail) => void;
  initialValue?: number;
  locale?: string;
}

/**
 * 债务计算器对话框
 * 帮助用户细分计算"其他固定月债务"总额
 */
export default function DebtCalculatorDialog({
  isOpen,
  onClose,
  onApply,
  initialValue = 0,
  locale = 'en',
}: DebtCalculatorDialogProps) {
  const [debtDetail, setDebtDetail] = useState<DebtDetail>({
    otherPropertyHousing: 0,
    studentLoanPayment: 0,
    autoLoanPayment: 0,
    creditCardMinPayment: 0,
    supportObligations: 0,
    otherInstallmentDebt: 0,
    rentalIncomeCredit: 0,
  });

  // 计算总债务
  const totalDebt = calculateTotalDebt(debtDetail);

  // 更新单个字段
  const updateField = (field: keyof DebtDetail, value: number) => {
    setDebtDetail((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 重置表单
  const handleReset = () => {
    setDebtDetail({
      otherPropertyHousing: 0,
      studentLoanPayment: 0,
      autoLoanPayment: 0,
      creditCardMinPayment: 0,
      supportObligations: 0,
      otherInstallmentDebt: 0,
      rentalIncomeCredit: 0,
    });
  };

  // 应用计算结果
  const handleApply = () => {
    onApply(totalDebt, debtDetail);
    onClose();
  };

  // 翻译文本
  const t = getTranslations(locale);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-xs text-gray-600 mt-0.5">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Total and Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-emerald-50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-emerald-900">{t.totalMonthlyDebt}:</span>
            <span className="text-xl font-bold text-emerald-600">
              ${totalDebt.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
            >
              {t.apply}
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="overflow-y-auto px-5 py-4 space-y-4">
          {/* Other Property Housing */}
          <div>
            <SliderWithValue
              label="Other Property Housing Payment (PITI)"
              value={debtDetail.otherPropertyHousing}
              min={0}
              max={50000}
              step={500}
              onChange={(val) => updateField('otherPropertyHousing', val)}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
          </div>

          {/* Student Loan Payment */}
          <div>
            <SliderWithValue
              label={t.studentLoanPayment}
              value={debtDetail.studentLoanPayment}
              min={0}
              max={10000}
              step={100}
              onChange={(val) => updateField('studentLoanPayment', val)}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
          </div>

          {/* Auto Loan Payment */}
          <div>
            <SliderWithValue
              label={t.autoLoanPayment}
              value={debtDetail.autoLoanPayment}
              min={0}
              max={10000}
              step={100}
              onChange={(val) => updateField('autoLoanPayment', val)}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
          </div>

          {/* Credit Card Min Payment */}
          <div>
            <SliderWithValue
              label={t.creditCardMinPayment}
              value={debtDetail.creditCardMinPayment}
              min={0}
              max={10000}
              step={100}
              onChange={(val) => updateField('creditCardMinPayment', val)}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
          </div>

          {/* Support Obligations */}
          <div>
            <SliderWithValue
              label={t.supportObligations}
              value={debtDetail.supportObligations}
              min={0}
              max={10000}
              step={100}
              onChange={(val) => updateField('supportObligations', val)}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
          </div>

          {/* Other Installment Debt */}
          <div>
            <SliderWithValue
              label={t.otherInstallmentDebt}
              value={debtDetail.otherInstallmentDebt}
              min={0}
              max={10000}
              step={100}
              onChange={(val) => updateField('otherInstallmentDebt', val)}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
          </div>

          {/* Rental Income Credit (Deduction) */}
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <SliderWithValue
              label={`${t.rentalIncomeCredit} ${t.deduction}`}
              value={debtDetail.rentalIncomeCredit}
              min={0}
              max={10000}
              step={100}
              onChange={(val) => updateField('rentalIncomeCredit', val)}
              formatValue={(val) => `-$${val.toLocaleString()}`}
            />
            <p className="text-xs text-green-700 mt-2">{t.rentalIncomeNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 翻译函数（简化版，后续可改为使用 next-intl）
function getTranslations(locale: string) {
  const translations = {
    en: {
      title: 'Monthly Debt Calculator',
      subtitle: 'Break down your fixed monthly debt obligations',
      piti: '(Principal, Interest, Taxes, Insurance)',
      deduction: '(Deduction)',
      rentalIncomeNote: 'Verified rental income that can offset debt obligations',
      otherPropertyHousing: 'Other Property Housing Payment',
      studentLoanPayment: 'Student Loan Payment',
      autoLoanPayment: 'Auto Loan Payment',
      creditCardMinPayment: 'Credit Card Minimum Payment',
      supportObligations: 'Alimony / Child Support',
      otherInstallmentDebt: 'Other Installment Debt',
      rentalIncomeCredit: 'Verified Rental Income',
      totalMonthlyDebt: 'Total Monthly Debt',
      reset: 'Reset',
      cancel: 'Cancel',
      apply: 'Apply',
    },
    zh: {
      title: '月度债务计算器',
      subtitle: '细分您的固定月债务',
      piti: '(本金、利息、税费、保险)',
      deduction: '(减项)',
      rentalIncomeNote: '可用于抵扣债务的已验证租金收入',
      otherPropertyHousing: '其他房产月住房支出',
      studentLoanPayment: '学生贷款月供',
      autoLoanPayment: '汽车贷款月供',
      creditCardMinPayment: '信用卡最低还款额',
      supportObligations: '抚养费/赡养费',
      otherInstallmentDebt: '其他分期债务',
      rentalIncomeCredit: '已验证租金收入',
      totalMonthlyDebt: '总月债务',
      reset: '重置',
      cancel: '取消',
      apply: '应用',
    },
  };

  return translations[locale as keyof typeof translations] || translations.en;
}
