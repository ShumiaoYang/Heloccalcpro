'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CLTVComparisonChartProps {
  locale?: string;
}

export default function CLTVComparisonChart({ locale = 'en' }: CLTVComparisonChartProps) {
  const isZh = locale === 'zh';

  const cltvPoints = [60, 65, 70, 75, 80, 85, 90, 95];

  const property1Data = cltvPoints.map(cltv => Math.max(0, (1000000 * cltv / 100) - 400000));
  const property2Data = cltvPoints.map(cltv => Math.max(0, (600000 * cltv / 100) - 250000));

  const data = {
    labels: cltvPoints.map(v => `${v}%`),
    datasets: [
      {
        label: isZh ? '房产 1 ($1M, $400K 抵押)' : 'Property 1 ($1M, $400K Mortgage)',
        data: property1Data,
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: isZh ? '房产 2 ($600K, $250K 抵押)' : 'Property 2 ($600K, $250K Mortgage)',
        data: property2Data,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value?.toLocaleString() ?? '0'}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: isZh ? 'CLTV 比率' : 'CLTV Ratio',
          font: { size: 14 },
        },
        grid: {
          color: '#e2e8f0',
        },
      },
      y: {
        title: {
          display: true,
          text: isZh ? '可用 HELOC 额度 ($)' : 'Available HELOC Amount ($)',
          font: { size: 14 },
        },
        ticks: {
          callback: (value) => `$${(Number(value) / 1000).toFixed(0)}K`,
        },
        grid: {
          color: '#e2e8f0',
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}
