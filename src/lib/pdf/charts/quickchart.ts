interface QuickChartSize {
  width?: number;
  height?: number;
  format?: 'png' | 'svg';
  backgroundColor?: string;
}

interface CltvGaugeInput {
  projectedCltv: number;
  maxCltv?: number;
}

interface DtiBarInput {
  currentDti: number;
  projectedDti: number;
}

interface CashFlowInput {
  currentMonthlyDebt: number;
  newHelocInterest: number;
}

interface GoalAmountVsApprovalInput {
  amountNeeded: number;
  approvedLimit: number;
  safeUsageRatio?: number;
}

interface EmergencyGoalAmountVsApprovalInput {
  amountNeeded: number;
  approvedLimit: number;
}

interface GoalDtiComparisonInput {
  currentDti: number;
  projectedDti: number;
}

interface GoalUtilizationComparisonInput {
  currentUtilization: number;
  projectedUtilization: number;
}

interface SurvivalRunwayInput {
  survivalMonths: number;
}

interface LiquidityMixInput {
  cashReserve: number;
  helocBackup: number;
}

interface ArbitrageSpreadInput {
  costOfDebtRate: number;
  expectedReturnRate: number;
  netSpreadRate: number;
}

interface CashFlowStressGroupedInput {
  currentRate: number;
  drawAtCurrent: number;
  repaymentAtCurrent: number;
  drawAtPlus2: number;
  repaymentAtPlus2: number;
  drawAtPlus4: number;
  repaymentAtPlus4: number;
}

interface DebtRestructuringComparisonInput {
  currentCardMinPayment: number;
  newHelocInterestOnlyPayment: number;
}

interface RoiImpactInput {
  renovationCost: number;
  estimatedValueAdded: number;
  netEquityImpact: number;
}

interface BorrowingCapacityEnvelopeInput {
  monthlyIncome: number;
  currentMonthlyDebt: number;
  homeValue: number;
  mortgageBalance: number;
  effectiveCltvPct: number;
  effectiveDtiPct: number;
  estimatedApproval?: number;
  amountNeeded?: number;
  helocPaymentCtrlRate?: number;
}

export function buildQuickChartUrl(chartConfig: unknown, size: QuickChartSize = {}): string {
  const {
    width = 700,
    height = 340,
    format = 'png',
    backgroundColor = 'white',
  } = size;

  const params = new URLSearchParams({
    c: JSON.stringify(chartConfig),
    w: String(width),
    h: String(height),
    format,
    bkg: backgroundColor,
  });

  return `https://quickchart.io/chart?${params.toString()}`;
}

export function buildCltvGaugeChart({ projectedCltv, maxCltv = 85 }: CltvGaugeInput): string {
  const clamped = Math.max(0, Math.min(projectedCltv, 100));
  const safeRemaining = Math.max(0, 100 - clamped);
  const isOverLimit = clamped > maxCltv;

  const chartConfig = {
    type: 'doughnut',
    data: {
      labels: ['Projected CLTV', 'Remaining'],
      datasets: [
        {
          data: [clamped, safeRemaining],
          backgroundColor: [isOverLimit ? '#dc2626' : '#16a34a', '#e2e8f0'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutoutPercentage: 70,
      rotation: Math.PI,
      circumference: Math.PI,
      legend: { display: true, position: 'bottom' },
      title: {
        display: true,
        text: `Projected CLTV ${clamped.toFixed(1)}% vs ${maxCltv}% Policy`,
        fontSize: 14,
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 680, height: 300 });
}

export function buildDtiBarChart({ currentDti, projectedDti }: DtiBarInput): string {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Current DTI', 'DTI After HELOC'],
      datasets: [
        {
          label: 'DTI (%)',
          data: [currentDti, projectedDti],
          backgroundColor: ['#0284c7', projectedDti > 43 ? '#dc2626' : '#16a34a'],
        },
      ],
    },
    options: {
      legend: { display: false },
      title: { display: true, text: 'DTI Before vs After Renovation Draw', fontSize: 14 },
      scales: {
        yAxes: [
          {
            ticks: { beginAtZero: true, suggestedMax: Math.max(50, projectedDti + 8) },
            scaleLabel: { display: true, labelString: 'Percent (%)' },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 700, height: 320 });
}

export function buildCashFlowChart({ currentMonthlyDebt, newHelocInterest }: CashFlowInput): string {
  const chartConfig = {
    type: 'pie',
    data: {
      labels: ['Current Monthly Debt', 'New HELOC Interest'],
      datasets: [
        {
          data: [Math.max(currentMonthlyDebt, 0), Math.max(newHelocInterest, 0)],
          backgroundColor: ['#0ea5e9', '#f97316'],
        },
      ],
    },
    options: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Monthly Cash Flow Composition', fontSize: 14 },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 680, height: 300 });
}

export function buildGoalAmountVsApprovalChart({
  amountNeeded,
  approvedLimit,
  safeUsageRatio = 0.5,
}: GoalAmountVsApprovalInput): string {
  const safeRatio = Math.max(0, Math.min(safeUsageRatio, 1));
  const safeUsage = Math.max(0, approvedLimit * safeRatio);
  const remainingApproval = Math.max(0, approvedLimit - safeUsage);

  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Amount Needed', 'Estimated Approved Limit'],
      datasets: [
        {
          label: 'Amount Needed',
          data: [Math.max(amountNeeded, 0), 0],
          backgroundColor: '#7c3aed',
          stack: 'approval',
        },
        {
          label: 'Safe Usage (50%)',
          data: [0, safeUsage],
          backgroundColor: '#16a34a',
          stack: 'approval',
        },
        {
          label: 'Remaining Approval',
          data: [0, remainingApproval],
          backgroundColor: '#86efac',
          stack: 'approval',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Funding Goal vs Estimated Approval',
        fontSize: 12,
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          fontSize: 8,
        },
      },
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [
          {
            stacked: true,
            ticks: { beginAtZero: true },
            scaleLabel: { display: true, labelString: 'USD' },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 520, height: 300 });
}

export function buildEmergencyGoalAmountVsApprovalChart({
  amountNeeded,
  approvedLimit,
}: EmergencyGoalAmountVsApprovalInput): string {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Amount Needed', 'Estimated Approved Limit'],
      datasets: [
        {
          label: 'USD',
          data: [Math.max(0, amountNeeded), Math.max(0, approvedLimit)],
          backgroundColor: ['#7c3aed', '#16a34a'],
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Emergency Target vs Estimated Approval',
        fontSize: 12,
      },
      scales: {
        yAxes: [
          {
            ticks: { beginAtZero: true },
            scaleLabel: { display: true, labelString: 'USD' },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 520, height: 300 });
}

export function buildGoalDtiComparisonChart({
  currentDti,
  projectedDti,
}: GoalDtiComparisonInput): string {
  const normalizedCurrent = Math.max(0, Math.min(currentDti, 100));
  const normalizedProjected = Math.max(0, Math.min(projectedDti, 100));
  const projectedColor = normalizedProjected >= 43 ? '#dc2626' : '#16a34a';

  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Current DTI', 'DTI After Draw'],
      datasets: [
        {
          label: 'DTI Level',
          data: [normalizedCurrent, normalizedProjected],
          backgroundColor: ['#0284c7', projectedColor],
          stack: 'dti',
        },
        {
          label: 'Buffer to 100%',
          data: [100 - normalizedCurrent, 100 - normalizedProjected],
          backgroundColor: 'rgba(148, 163, 184, 0.12)',
          stack: 'dti',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'DTI Before vs After Draw',
        fontSize: 12,
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          fontSize: 8,
        },
      },
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [
          {
            stacked: true,
            ticks: { beginAtZero: true, max: 100, stepSize: 10 },
            scaleLabel: { display: true, labelString: 'DTI (%)' },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 520, height: 300 });
}

export function buildGoalUtilizationComparisonChart({
  currentUtilization,
  projectedUtilization,
}: GoalUtilizationComparisonInput): string {
  const current = Math.max(0, Math.min(currentUtilization, 100));
  const projected = Math.max(0, Math.min(projectedUtilization, 100));
  const projectedColor = projected >= 30 ? '#dc2626' : projected >= 10 ? '#f59e0b' : '#16a34a';

  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Current Utilization', 'After Paydown Utilization'],
      datasets: [
        {
          label: 'Utilization',
          data: [current, projected],
          backgroundColor: ['#2563eb', projectedColor],
          stack: 'util',
        },
        {
          label: 'Buffer to 100%',
          data: [100 - current, 100 - projected],
          backgroundColor: 'rgba(148, 163, 184, 0.12)',
          stack: 'util',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Credit Utilization Before vs After Paydown',
        fontSize: 12,
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          fontSize: 8,
        },
      },
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [
          {
            stacked: true,
            ticks: { beginAtZero: true, max: 100, stepSize: 10 },
            scaleLabel: { display: true, labelString: 'Utilization (%)' },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 520, height: 300 });
}

export function buildSurvivalRunwayChart({
  survivalMonths,
}: SurvivalRunwayInput): string {
  const months = Math.max(0, survivalMonths);
  const roundedMonths = Math.round(months * 10) / 10;
  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Your Runway', '6-Month Baseline'],
      datasets: [
        {
          label: 'Months',
          data: [roundedMonths, 6],
          backgroundColor: [roundedMonths >= 6 ? '#16a34a' : '#f59e0b', '#94a3b8'],
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: `Survival Runway (${roundedMonths.toFixed(1)} months)`,
        fontSize: 12,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              suggestedMax: Math.max(12, Math.ceil(roundedMonths * 1.2)),
            },
            scaleLabel: { display: true, labelString: 'Months' },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 520, height: 300 });
}

export function buildLiquidityMixChart({
  cashReserve,
  helocBackup,
}: LiquidityMixInput): string {
  const cash = Math.max(0, cashReserve);
  const heloc = Math.max(0, helocBackup);
  const normalizedCash = cash > 0 || heloc > 0 ? cash : 1;
  const normalizedHeloc = cash > 0 || heloc > 0 ? heloc : 1;
  const chartConfig = {
    type: 'doughnut',
    data: {
      labels: ['Cash Savings', 'HELOC Backup Line'],
      datasets: [
        {
          data: [normalizedCash, normalizedHeloc],
          backgroundColor: ['#16a34a', '#2563eb'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutoutPercentage: 58,
      legend: {
        position: 'bottom',
        labels: { boxWidth: 10, fontSize: 8 },
      },
      title: {
        display: true,
        text: 'Liquidity Mix (Cash vs HELOC Backup)',
        fontSize: 12,
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 650, height: 280 });
}

export function buildArbitrageSpreadChart({
  costOfDebtRate,
  expectedReturnRate,
  netSpreadRate,
}: ArbitrageSpreadInput): string {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Cost of Debt', 'Expected Return', 'Net Spread'],
      datasets: [
        {
          label: 'Rate (%)',
          data: [
            Math.max(0, costOfDebtRate),
            Math.max(0, expectedReturnRate),
            netSpreadRate,
          ],
          backgroundColor: [
            '#ef4444',
            '#16a34a',
            netSpreadRate >= 3 ? '#16a34a' : netSpreadRate > 0 ? '#f59e0b' : '#dc2626',
          ],
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Arbitrage Spread (Return vs Debt Cost)',
        fontSize: 12,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: Math.min(0, Math.floor(netSpreadRate - 1)),
              suggestedMax: Math.max(expectedReturnRate, costOfDebtRate, netSpreadRate) + 2,
            },
            scaleLabel: { display: true, labelString: 'Rate (%)' },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 700, height: 280 });
}

export function buildCashFlowStressGroupedChart({
  currentRate,
  drawAtCurrent,
  repaymentAtCurrent,
  drawAtPlus2,
  repaymentAtPlus2,
  drawAtPlus4,
  repaymentAtPlus4,
}: CashFlowStressGroupedInput): string {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: [
        `${currentRate.toFixed(2)}%`,
        `${(currentRate + 2).toFixed(2)}%`,
        `${(currentRate + 4).toFixed(2)}%`,
      ],
      datasets: [
        {
          label: 'Draw Period (Interest-Only)',
          data: [
            Math.max(0, drawAtCurrent),
            Math.max(0, drawAtPlus2),
            Math.max(0, drawAtPlus4),
          ],
          backgroundColor: '#0ea5e9',
        },
        {
          label: 'Repayment Period (Principal + Interest)',
          data: [
            Math.max(0, repaymentAtCurrent),
            Math.max(0, repaymentAtPlus2),
            Math.max(0, repaymentAtPlus4),
          ],
          backgroundColor: '#f97316',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Payment Shock & Stress Test',
        fontSize: 12,
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          fontSize: 8,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: { beginAtZero: true },
            scaleLabel: { display: true, labelString: 'Monthly Payment (USD)' },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Rate Scenario',
            },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 700, height: 320 });
}

export function buildDebtRestructuringComparisonChart({
  currentCardMinPayment,
  newHelocInterestOnlyPayment,
}: DebtRestructuringComparisonInput): string {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Current Card Min Payment', 'New HELOC Interest-Only'],
      datasets: [
        {
          label: 'Monthly Payment (USD)',
          data: [
            Math.max(0, currentCardMinPayment),
            Math.max(0, newHelocInterestOnlyPayment),
          ],
          backgroundColor: ['#ef4444', '#16a34a'],
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Cash Flow Release Comparison',
        fontSize: 12,
      },
      scales: {
        yAxes: [
          {
            ticks: { beginAtZero: true },
            scaleLabel: { display: true, labelString: 'Monthly Payment (USD)' },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 700, height: 260 });
}

export function buildRoiImpactChart({
  renovationCost,
  estimatedValueAdded,
  netEquityImpact,
}: RoiImpactInput): string {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['Renovation Cost', 'Estimated Value Added', 'Net Equity Impact'],
      datasets: [
        {
          label: 'USD',
          data: [renovationCost, estimatedValueAdded, netEquityImpact],
          backgroundColor: [
            '#ef4444',
            '#22c55e',
            netEquityImpact >= 0 ? '#16a34a' : '#dc2626',
          ],
        },
      ],
    },
    options: {
      legend: { display: false },
      title: { display: true, text: 'ROI & Equity Impact', fontSize: 14 },
      scales: {
        yAxes: [
          {
            ticks: { beginAtZero: true },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 700, height: 320 });
}

export function buildBorrowingCapacityEnvelopeChart({
  monthlyIncome,
  currentMonthlyDebt,
  homeValue,
  mortgageBalance,
  effectiveCltvPct,
  effectiveDtiPct,
  estimatedApproval = 0,
  amountNeeded = 0,
  helocPaymentCtrlRate = 0.0125,
}: BorrowingCapacityEnvelopeInput): string {
  const safeMonthlyIncome = Math.max(monthlyIncome, 1);
  const xMin = Math.max(2000, Math.round(safeMonthlyIncome * 0.6));
  const xMax = Math.max(xMin + 1000, Math.round(safeMonthlyIncome * 1.4));
  const steps = 10;
  const incomePoints = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return xMin + (xMax - xMin) * t;
  });

  const cltv80Limit = Math.max(0, homeValue * 0.8 - mortgageBalance);
  const cltvEffectiveLimit = Math.max(0, homeValue * (effectiveCltvPct / 100) - mortgageBalance);

  const dti43Curve = incomePoints.map((x) => ({
    x,
    y: Math.max(0, (x * 0.43 - currentMonthlyDebt) / helocPaymentCtrlRate),
  }));

  const dtiEffectiveCurve = incomePoints.map((x) => ({
    x,
    y: Math.max(0, (x * (effectiveDtiPct / 100) - currentMonthlyDebt) / helocPaymentCtrlRate),
  }));

  const yMax = Math.max(
    cltv80Limit,
    cltvEffectiveLimit,
    estimatedApproval,
    amountNeeded,
    ...dti43Curve.map((p) => p.y),
    ...dtiEffectiveCurve.map((p) => p.y),
    100000
  );

  // Readability: use $K units on all axes for cleaner labels in PDF
  const xMinK = xMin / 1000;
  const xMaxK = xMax / 1000;
  const xStepK = Math.max(1, Math.round((xMaxK - xMinK) / 4));
  const yMaxK = Math.max(100, Math.round((yMax / 1000) * 1.08));
  const yStepK = Math.max(25, Math.round(yMaxK / 6 / 5) * 5);

  const chartConfig = {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'CLTV 80%',
          data: [{ x: xMinK, y: cltv80Limit / 1000 }, { x: xMaxK, y: cltv80Limit / 1000 }],
          xAxisID: 'xMonthly',
          yAxisID: 'yMain',
          borderColor: '#0ea5e9',
          borderWidth: 2,
          borderDash: [6, 3],
          fill: false,
          pointRadius: 0,
        },
        {
          label: `Effective CLTV ${effectiveCltvPct.toFixed(1)}%`,
          data: [{ x: xMinK, y: cltvEffectiveLimit / 1000 }, { x: xMaxK, y: cltvEffectiveLimit / 1000 }],
          xAxisID: 'xMonthly',
          yAxisID: 'yMain',
          borderColor: '#0284c7',
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
        {
          label: 'DTI 43%',
          data: dti43Curve.map((p) => ({ x: p.x / 1000, y: p.y / 1000 })),
          xAxisID: 'xMonthly',
          yAxisID: 'yMain',
          borderColor: '#f97316',
          borderWidth: 2,
          borderDash: [4, 2],
          tension: 0,
          fill: false,
          pointRadius: 0,
        },
        {
          label: `Effective DTI ${effectiveDtiPct.toFixed(1)}%`,
          data: dtiEffectiveCurve.map((p) => ({ x: p.x / 1000, y: p.y / 1000 })),
          xAxisID: 'xMonthly',
          yAxisID: 'yMain',
          borderColor: '#dc2626',
          borderWidth: 2,
          tension: 0,
          fill: false,
          pointRadius: 0,
        },
        {
          type: 'scatter',
          label: 'estimated approval point',
          data: [{ x: safeMonthlyIncome / 1000, y: Math.max(0, estimatedApproval) / 1000 }],
          xAxisID: 'xMonthly',
          yAxisID: 'yMain',
          showLine: false,
          backgroundColor: '#111827',
          borderColor: '#111827',
          pointRadius: 5,
          pointHoverRadius: 5,
          pointBackgroundColor: '#111827',
          pointBorderColor: '#111827',
        },
        {
          type: 'scatter',
          label: 'Requested amount point',
          data: [{ x: safeMonthlyIncome / 1000, y: Math.max(0, amountNeeded) / 1000 }],
          xAxisID: 'xMonthly',
          yAxisID: 'yMain',
          showLine: false,
          backgroundColor: '#7e22ce',
          borderColor: '#7e22ce',
          pointRadius: 5,
          pointHoverRadius: 5,
          pointBackgroundColor: '#7e22ce',
          pointBorderColor: '#7e22ce',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Borrowing Capacity Envelope (all values in $K)',
        fontSize: 14,
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          fontSize: 9,
        },
      },
      scales: {
        xAxes: [
          {
            id: 'xMonthly',
            type: 'linear',
            position: 'bottom',
            gridLines: {
              color: '#e5e7eb',
            },
            ticks: {
              min: xMinK,
              max: xMaxK,
              stepSize: xStepK,
            },
            scaleLabel: {
              display: true,
              labelString: 'Monthly Income ($K)',
            },
          },
          {
            id: 'xAnnual',
            type: 'linear',
            position: 'top',
            gridLines: {
              drawOnChartArea: false,
            },
            ticks: {
              min: xMinK * 12,
              max: xMaxK * 12,
              stepSize: Math.max(12, xStepK * 12),
            },
            scaleLabel: {
              display: true,
              labelString: 'Annual Income ($K)',
            },
          },
        ],
        yAxes: [
          {
            id: 'yMain',
            gridLines: {
              color: '#e5e7eb',
            },
            ticks: {
              beginAtZero: true,
              suggestedMax: yMaxK,
              stepSize: yStepK,
            },
            scaleLabel: {
              display: true,
              labelString: 'Trial Credit Line ($K)',
            },
          },
        ],
      },
    },
  };

  return buildQuickChartUrl(chartConfig, { width: 700, height: 280 });
}
