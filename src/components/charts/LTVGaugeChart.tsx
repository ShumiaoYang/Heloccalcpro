'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

interface LTVGaugeChartProps {
  currentLTV: number; // 0-100
  projectedLTV: number; // 0-100
  label?: string;
}

export default function LTVGaugeChart({
  currentLTV,
  projectedLTV,
  label = 'LTV Ratio'
}: LTVGaugeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || !canvasRef.current) return;

    // Check if canvas parent has valid dimensions
    const parent = canvasRef.current.parentElement;
    if (!parent || parent.clientWidth === 0) {
      console.warn('[LTVGaugeChart] Parent container has no width, delaying chart initialization');
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Determine color based on projected LTV
    const getColor = (ltv: number) => {
      if (ltv < 80) return '#16A34A'; // Green - Safe
      if (ltv < 85) return '#EAB308'; // Yellow - Caution
      return '#DC2626'; // Red - High risk
    };

    const color = getColor(projectedLTV);

    // Create gauge chart (doughnut with half circle)
    chartRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [projectedLTV, 100 - projectedLTV],
            backgroundColor: [color, '#E5E7EB'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [isMounted, projectedLTV]);

  const getRiskLevel = (ltv: number) => {
    if (ltv < 80) return { text: 'SAFE', color: 'text-green-600' };
    if (ltv < 85) return { text: 'CAUTION', color: 'text-yellow-600' };
    return { text: 'HIGH RISK', color: 'text-red-600' };
  };

  const riskLevel = getRiskLevel(projectedLTV);

  return (
    <div className="relative">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '40%' }}>
        <div className="font-mono text-4xl font-bold text-primary-900">
          {projectedLTV.toFixed(1)}%
        </div>
        <div className={`mt-1 text-xs font-semibold ${riskLevel.color}`}>
          {riskLevel.text}
        </div>
      </div>
      {label && (
        <div className="mt-2 text-center text-sm font-medium text-slate-600">{label}</div>
      )}
      {currentLTV > 0 && (
        <div className="mt-3 text-center text-xs text-slate-500">
          Current LTV: {currentLTV.toFixed(1)}% → Projected: {projectedLTV.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
