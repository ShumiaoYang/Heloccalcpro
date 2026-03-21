'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { calculateCreditDTILimit } from '@/lib/heloc/core-metrics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController
);

interface DiagnosticChartProps {
  annualIncome: number;
  totalMonthlyDebt: number;
  homeValue: number;
  mortgageBalance: number;
  currentApprovedLimit: number;
  cltvCap: number;
  creditScore: number;
  projectedCLTV: number;
}

export default function DiagnosticChart({
  annualIncome,
  totalMonthlyDebt,
  homeValue,
  mortgageBalance,
  currentApprovedLimit,
  cltvCap,
  creditScore,
  projectedCLTV
}: DiagnosticChartProps) {

  const numAnnualIncome = Math.max(0, Number(annualIncome) || 0);
  const numMonthlyIncome = numAnnualIncome / 12;
  const numDebt = Math.max(0, Number(totalMonthlyDebt) || 0);
  const numHome = Math.max(0, Number(homeValue) || 0);
  const numMort = Math.max(0, Number(mortgageBalance) || 0);
  const numCLTV = (Number(cltvCap) > 0) ? Number(cltvCap) : 85;

  const chartMinX = Math.max(2000, Math.floor(numMonthlyIncome / 1000) * 1000 - 4000);
  const chartMaxX = chartMinX + 10000;

  const cltvMaxLimit = Math.max(0, numHome * (numCLTV / 100) - numMort);
  const cltvSafeLimit = Math.max(0, numHome * (Math.max(60, numCLTV - 10) / 100) - numMort);

  const dotY = Math.max(0, Number(currentApprovedLimit) || 0);
  
  const yMaxAxis = Math.max(50000, cltvMaxLimit + 20000);

  const chartData = useMemo(() => {
    const dtiLimitData = [];
    const cltvMaxData = [];
    const cltvSafeData = [];
    const monthlyIncomeLabels: number[] = [];

    for(let i = chartMinX; i <= chartMaxX; i += 1000) {
      monthlyIncomeLabels.push(i);
      const annualInc = i * 12;
      
      let limit = 0;
      try {
        limit = calculateCreditDTILimit(annualInc, numDebt, creditScore, projectedCLTV);
      } catch(e) {
        limit = (i * 0.43 - numDebt) / 0.0125;
      }
      
      const safeLimit = Math.max(0, limit);
      
      dtiLimitData.push({ x: i, y: safeLimit });
      cltvMaxData.push({ x: i, y: cltvMaxLimit });
      cltvSafeData.push({ x: i, y: cltvSafeLimit });
    }

    return {
      labels: monthlyIncomeLabels,
      datasets: [
        {
          type: 'scatter' as const,
          label: 'You are here',
          xAxisID: 'xMonthly',
          data: [{ x: numMonthlyIncome, y: dotY }],
          backgroundColor: '#0f172a',
          borderColor: '#ffffff',
          borderWidth: 3,
          pointRadius: 8,
          pointHoverRadius: 10,
          z: 10,
        },
        {
          type: 'line' as const,
          label: 'DTI Limit (Cash Flow)',
          xAxisID: 'xMonthly',
          data: dtiLimitData,
          borderColor: '#10b981',
          borderWidth: 3,
          tension: 0.1,
          pointRadius: 0,
        },
        {
          type: 'line' as const,
          label: `${numCLTV}% CLTV (Max Equity)`,
          xAxisID: 'xMonthly',
          data: cltvMaxData,
          borderColor: '#a855f7',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          type: 'line' as const,
          label: `${numCLTV - 10}% CLTV (Safe Equity)`,
          xAxisID: 'xMonthly',
          data: cltvSafeData,
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.15)',
          borderWidth: 2,
          fill: 2, 
          pointRadius: 0,
        },
        {
          type: 'line' as const,
          label: 'Hidden_Annual',
          xAxisID: 'xAnnual',
          data: [
            { x: chartMinX * 12, y: 0 },
            { x: chartMaxX * 12, y: 0 }
          ],
          borderWidth: 0,
          pointRadius: 0,
          showLine: false
        }
      ]
    };
  }, [numMonthlyIncome, dotY, numDebt, cltvMaxLimit, cltvSafeLimit, numCLTV, creditScore, projectedCLTV, chartMinX, chartMaxX]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart' as const,
    },
    scales: {
      xMonthly: {
        type: 'linear' as const,
        position: 'bottom' as const,
        min: chartMinX,
        max: chartMaxX,
        grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
        title: { display: true, text: 'Gross Monthly Income', color: '#64748b', font: { weight: 'bold' as const } },
        ticks: { stepSize: 2000, color: '#94a3b8', callback: (value: any) => '$' + Math.round(Number(value) / 1000) + 'k' }
      },
      xAnnual: {
        type: 'linear' as const,
        position: 'top' as const,
        min: chartMinX * 12,
        max: chartMaxX * 12,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Gross Annual Income (Yearly)', color: '#3b82f6', font: { weight: 'bold' as const } },
        ticks: { stepSize: 24000, color: '#60a5fa', callback: (value: any) => '$' + Math.round(Number(value) / 1000) + 'k' }
      },
      y: {
        min: 0,
        max: yMaxAxis,
        grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
        title: { display: true, text: 'Max Available Credit', color: '#64748b', font: { weight: 'bold' as const } },
        ticks: { stepSize: 20000, color: '#94a3b8', callback: (value: any) => '$' + Math.round(Number(value) / 1000) + 'k' }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true, boxWidth: 8, padding: 15, font: { size: 12 },
          filter: (item: any) => {
            return !item.text.includes('(Safe Equity)') && !item.text.includes('Hidden_Annual');
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
        padding: 12, 
        cornerRadius: 8,
        yAlign: 'bottom' as const,
        caretPadding: 15,
        callbacks: {
          label: function(context: any) {
            if (context.dataset.label.includes('Hidden_Annual')) return '';

            const xVal = context.parsed.x;
            const yVal = context.parsed.y;

            if (context.dataset.label === 'You are here') {
              return [
                `Monthly Income: $${Math.round(xVal).toLocaleString()}`,
                `Approved Limit: $${Math.round(yVal).toLocaleString()}`
              ];
            }
            return `${context.dataset.label}: $${Math.round(yVal).toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative">
      <div className="absolute top-5 left-6 z-10 pointer-events-none">
        <h3 className="text-lg font-bold text-slate-800">The HELOC Sandbox</h3>
        <p className="text-xs text-slate-500 mt-1">Find your bottleneck: Cash Flow (Green) vs. Equity (Purple)</p>
      </div>
      <div className="w-full h-full pt-12">
        <Chart type="scatter" data={chartData} options={options} />
      </div>
    </div>
  );
}