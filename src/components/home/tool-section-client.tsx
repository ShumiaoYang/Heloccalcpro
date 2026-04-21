'use client';

import HelocTabbedCalculator from '@/components/calculator/heloc-tabbed-calculator';
import { usePrimeRate } from '@/lib/hooks/usePrimeRate';

type ToolSectionClientProps = {
  fallbackRate: number;
  baseMargin: number;
};

export default function ToolSectionClient({ fallbackRate, baseMargin }: ToolSectionClientProps) {
  const { rate } = usePrimeRate({ fallbackRate });

  return <HelocTabbedCalculator livePrimeRate={rate} baseMargin={baseMargin} />;
}
