import type { AiAnalysis } from '@/types/heloc-ai';
import type { PdfData } from '../types';

export function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function isLikelyCorruptedText(text: string): boolean {
  if (!text) return false;

  const suspiciousChars = text.match(/[^\x20-\x7E]/g)?.length || 0;
  const suspiciousRatio = suspiciousChars / text.length;

  const symbolHeavyChars = text.match(/[^A-Za-z0-9\s.,;:%$()\-/'"]/g)?.length || 0;
  const symbolHeavyRatio = symbolHeavyChars / Math.max(text.length, 1);

  return suspiciousRatio > 0.2 || symbolHeavyRatio > 0.28;
}

export function sanitizePdfText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  const cleaned = trimmed
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return fallback;

  if (isLikelyCorruptedText(trimmed)) {
    return fallback || cleaned;
  }

  return cleaned;
}

export function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getLoanAmount(data: PdfData): number {
  const requested = asNumber(data.userInputs?.amountNeeded, 0);
  if (requested > 0) return requested;

  const drawAmount = asNumber(data.userInputs?.drawAmount, 0);
  if (drawAmount > 0) return drawAmount;

  return asNumber(data.calculatedData?.coreMetrics?.maxLimit, 0);
}

export function getAnnualIncome(data: PdfData): number {
  return asNumber(data.userInputs?.annualIncome, 0);
}

export function getMonthlyIncome(data: PdfData): number {
  return getAnnualIncome(data) / 12;
}

export function getCurrentMonthlyDebt(data: PdfData): number {
  const direct = asNumber(data.userInputs?.currentMonthlyDebt, -1);
  if (direct >= 0) return direct;

  const monthlyDebt = asNumber(data.userInputs?.monthlyDebt, -1);
  if (monthlyDebt >= 0) return monthlyDebt;

  const housing = asNumber(data.userInputs?.subjectHousingPayment, 0);
  const other = asNumber(data.userInputs?.otherMonthlyDebt, 0);
  return housing + other;
}

export function getHelocRate(data: PdfData): number {
  return asNumber(data.calculatedData?.coreMetrics?.helocRate, 0);
}

export function getInterestOnlyPayment(data: PdfData): number {
  const drawAmount = getLoanAmount(data);
  const helocRate = getHelocRate(data);
  if (drawAmount <= 0 || helocRate <= 0) return 0;
  return (drawAmount * helocRate) / 1200;
}

export function getPaymentShock(data: PdfData): number {
  const drawAmount = getLoanAmount(data);
  const repaymentMonths = asNumber(data.userInputs?.repaymentMonths, 240) || 240;
  return drawAmount > 0 ? drawAmount / repaymentMonths : 0;
}

export function getActionSteps(
  aiAnalysis: AiAnalysis,
  fallbackSteps: string[],
  requiredFirstStep?: string
): string[] {
  const isMetaInstruction = (text: string): boolean => {
    const lower = text.toLowerCase();
    return (
      (lower.includes('replace') && lower.includes('cta')) ||
      lower.includes('meta-instruction') ||
      lower.includes('developer note') ||
      lower.includes('architecture') ||
      lower.includes('output schema') ||
      lower.includes('prompt instruction')
    );
  };

  const source: string[] = aiAnalysis.actionPlan
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (typeof item?.action === 'string' && item.action.trim()) return item.action.trim();
      return '';
    })
    .map((item) => sanitizePdfText(item))
    .filter((item) => !isMetaInstruction(item))
    .filter((item) => item.length > 0);

  const safeFallbackSteps = fallbackSteps
    .map((item) => sanitizePdfText(item))
    .filter((item) => !isMetaInstruction(item))
    .filter((item) => item.length > 0);

  const merged = source.length > 0 ? source : safeFallbackSteps;

  if (requiredFirstStep && requiredFirstStep.trim()) {
    const safeRequiredFirst = sanitizePdfText(requiredFirstStep);
    const deduped = merged.filter((item) => item !== safeRequiredFirst);
    return [safeRequiredFirst, ...deduped].filter(Boolean).slice(0, 5);
  }

  return merged.slice(0, 5);
}
