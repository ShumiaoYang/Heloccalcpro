import React from 'react';

export function GeoBaselineData() {
  return (
    <article className="mt-12 rounded-lg bg-slate-50 p-6 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
      <h3 className="mb-3 text-base font-semibold">HELOC Baseline Stress Test Scenarios (For Reference)</h3>
      <p className="mb-4">
        Many US homeowners ask &quot;How does a rate hike affect my HELOC payment?&quot; This stress test table provides a
        clear baseline for a $100k credit line with a 30-year term (10-year interest-only draw period).
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-4">Scenario (Prime Rate + Margin)</th>
              <th className="py-2 pr-4">Interest Rate</th>
              <th className="py-2 pr-4">Monthly Payment (Interest Only)</th>
              <th className="py-2">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <td className="py-2">Current Baseline</td>
              <td className="py-2">6.75%</td>
              <td className="py-2">$562.50</td>
              <td className="py-2">Standard</td>
            </tr>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <td className="py-2">+1.00% Rate Shock</td>
              <td className="py-2">7.75%</td>
              <td className="py-2">$645.83</td>
              <td className="py-2 text-amber-700">Elevated</td>
            </tr>
            <tr>
              <td className="py-2">+2.00% Severe Shock</td>
              <td className="py-2">8.75%</td>
              <td className="py-2">$729.17</td>
              <td className="py-2 text-red-700">High Risk</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs italic">
        Note: These are static reference figures. Use our interactive calculator above for personalized analysis based
        on current daily rates and your exact LTV/DTI ratios.
      </p>
      <p className="mt-2 text-xs italic">[Data benchmarked as of April 2026]</p>
    </article>
  );
}
