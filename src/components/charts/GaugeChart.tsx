'use client';

import { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

interface GaugeChartProps {
  score: number; // 0-100
  label?: string;
}

export default function GaugeChart({ score, label = 'Risk Score' }: GaugeChartProps) {
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
      console.warn('[GaugeChart] Parent container has no width, delaying chart initialization');
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Determine color based on score
    const getColor = (score: number) => {
      if (score >= 80) return '#16A34A'; // Green - Low risk
      if (score >= 60) return '#EAB308'; // Yellow - Medium risk
      return '#DC2626'; // Red - High risk
    };

    const color = getColor(score);

    // Create gauge chart (doughnut with half circle)
    chartRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [score, 100 - score],
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
  }, [isMounted, score]);

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { text: 'LOW RISK', color: 'text-green-600' };
    if (score >= 60) return { text: 'MEDIUM RISK', color: 'text-yellow-600' };
    return { text: 'HIGH RISK', color: 'text-red-600' };
  };

  const riskLevel = getRiskLevel(score);

  return (
    <div className="relative">
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '40%' }}>
        <div className="font-mono text-4xl font-bold text-primary-900">{score.toFixed(0)}</div>
        <div className={`mt-1 text-xs font-semibold ${riskLevel.color}`}>{riskLevel.text}</div>
      </div>
      {label && (
        <div className="mt-2 text-center text-sm font-medium text-slate-600">{label}</div>
      )}
    </div>
  );
}
