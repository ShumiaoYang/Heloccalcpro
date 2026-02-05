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

interface CreditHealthGaugeChartProps {
  currentScore: number; // Original credit score
  healthScore: number; // After HELOC impact
  label?: string;
}

export default function CreditHealthGaugeChart({
  currentScore,
  healthScore,
  label = 'Credit Health Score'
}: CreditHealthGaugeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Round healthScore to avoid floating point precision issues
  const roundedHealthScore = Math.round(healthScore);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || !canvasRef.current || !containerRef.current) return;

    // Check if canvas parent has valid dimensions
    const parent = canvasRef.current.parentElement;
    if (!parent || parent.clientWidth === 0) {
      console.warn('[CreditHealthGaugeChart] Parent container has no width, delaying chart initialization');
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Determine color based on health score
    const getColor = (score: number) => {
      if (score >= 740) return '#16A34A'; // Green - Excellent
      if (score >= 670) return '#EAB308'; // Yellow - Good
      if (score >= 580) return '#F97316'; // Orange - Fair
      return '#DC2626'; // Red - Poor
    };

    const color = getColor(roundedHealthScore);

    // Normalize score to 0-100 for gauge (300-850 range)
    const normalizedScore = ((roundedHealthScore - 300) / 550) * 100;

    // Create gauge chart (doughnut with half circle)
    chartRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [normalizedScore, 100 - normalizedScore],
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
        animation: false,
        resizeDelay: 500, // Increased delay to prevent resize loops
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
  }, [isMounted, roundedHealthScore]);

  const getHealthLevel = (score: number) => {
    if (score >= 740) return { text: 'EXCELLENT', color: 'text-green-600' };
    if (score >= 670) return { text: 'GOOD', color: 'text-yellow-600' };
    if (score >= 580) return { text: 'FAIR', color: 'text-orange-600' };
    return { text: 'POOR', color: 'text-red-600' };
  };

  const healthLevel = getHealthLevel(roundedHealthScore);

  return (
    <div ref={containerRef} className="relative w-full" style={{ maxWidth: '250px', margin: '0 auto' }}>
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '40%' }}>
        <div className="font-mono text-4xl font-bold text-primary-900">
          {roundedHealthScore}
        </div>
        <div className={`mt-1 text-xs font-semibold ${healthLevel.color}`}>
          {healthLevel.text}
        </div>
      </div>
      {label && (
        <div className="mt-2 text-center text-sm font-medium text-slate-600">{label}</div>
      )}
      {currentScore !== roundedHealthScore && (
        <div className="mt-3 text-center text-xs text-slate-500">
          Current: {currentScore} → After HELOC: {roundedHealthScore}
        </div>
      )}
    </div>
  );
}
