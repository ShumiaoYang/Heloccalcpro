'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend, Filler);

interface PaymentTimelineChartProps {
  timeline: { month: number; payment: number; burdenRatio?: number }[];
  showBurdenRatio?: boolean;
  isAdvancedExpanded?: boolean;
}

export default function PaymentTimelineChart({ timeline, showBurdenRatio = false, isAdvancedExpanded = false }: PaymentTimelineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount and container to have valid dimensions
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || !canvasRef.current || !timeline || timeline.length === 0) return;

    // Check if canvas parent has valid dimensions
    const parent = canvasRef.current.parentElement;
    if (!parent || parent.clientWidth === 0) {
      console.warn('[Chart] Parent container has no width, delaying chart initialization');
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Prepare data
    const labels = timeline.map((t) => t.month);
    const payments = timeline.map((t) => t.payment);
    const burdenRatios = showBurdenRatio ? timeline.map((t) => t.burdenRatio || 0) : [];

    // Create datasets
    const datasets: any[] = [
      {
        label: 'Monthly Payment ($)',
        data: payments,
        borderColor: '#0B3B24',
        backgroundColor: 'rgba(11, 59, 36, 0.1)',
        borderWidth: 2,
        tension: 0,
        yAxisID: 'y',
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ];

    if (showBurdenRatio && burdenRatios.length > 0) {
      datasets.push({
        label: 'Burden Ratio (%)',
        data: burdenRatios,
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 0,
        pointHoverRadius: 4,
      });
    }

    // Create chart
    chartRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: isAdvancedExpanded ? 1.5 : 2.5,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                family: 'Inter, sans-serif',
                size: 12,
              },
              color: '#475569',
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#0F172A',
            bodyColor: '#475569',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              title: function (context) {
                const month = context[0].parsed.x;
                if (month === null) return '';
                const year = Math.floor(month / 12);
                const monthInYear = month % 12;
                return `Year ${year}, Month ${monthInYear === 0 ? 12 : monthInYear}`;
              },
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  if (context.datasetIndex === 0) {
                    label += '$' + context.parsed.y.toFixed(2);
                  } else {
                    label += context.parsed.y.toFixed(2) + '%';
                  }
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Month',
              font: {
                family: 'Inter, sans-serif',
                size: 12,
                weight: 600,
              },
              color: '#64748B',
            },
            grid: {
              display: true,
              color: 'rgba(226, 232, 240, 0.3)',
            },
            ticks: {
              font: {
                family: 'JetBrains Mono, monospace',
                size: 10,
              },
              color: '#64748B',
              maxTicksLimit: 12,
              callback: function (value) {
                // Show every 30 months (approximately every 2.5 years)
                if (typeof value === 'number' && value % 30 === 0) {
                  return value;
                }
                return '';
              },
            },
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Monthly Payment ($)',
              font: {
                family: 'Inter, sans-serif',
                size: 12,
                weight: 600,
              },
              color: '#0B3B24',
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.5)',
            },
            ticks: {
              font: {
                family: 'JetBrains Mono, monospace',
                size: 11,
              },
              color: '#64748B',
              callback: function (value) {
                return '$' + value.toLocaleString();
              },
            },
          },
          ...(showBurdenRatio && {
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Burden Ratio (%)',
                font: {
                  family: 'Inter, sans-serif',
                  size: 12,
                  weight: 600,
                },
                color: '#16A34A',
              },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                font: {
                  family: 'JetBrains Mono, monospace',
                  size: 11,
                },
                color: '#64748B',
                callback: function (value) {
                  return Number(value).toFixed(1) + '%';
                },
              },
            },
          }),
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [isMounted, timeline, showBurdenRatio, isAdvancedExpanded]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
