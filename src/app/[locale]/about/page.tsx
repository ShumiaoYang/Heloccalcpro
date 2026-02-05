export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-stone-900 mb-6">
          About HELOC Calculator
        </h1>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-3">
            Our Mission
          </h2>
          <p className="text-stone-700 leading-relaxed mb-3">
            HELOC Calculator Pro is designed to help homeowners make informed
            decisions about Home Equity Lines of Credit. We provide transparent,
            accurate calculations and comprehensive financial analysis tools.
          </p>
        </section>

        {/* Methodology */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-3">
            Calculation Methodology
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-stone-800 mb-2">
                Credit Limit Calculation
              </h3>
              <p className="text-stone-700">
                Maximum HELOC = (Home Value × LTV Ratio) - Mortgage Balance
              </p>
              <p className="text-sm text-stone-600 mt-1">
                Standard LTV: 85% for excellent credit (740+)
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-stone-800 mb-2">
                Payment Calculation
              </h3>
              <p className="text-stone-700">
                Draw Period: Interest-only payments (typically 10 years)
              </p>
              <p className="text-stone-700">
                Repayment Period: Principal + Interest (typically 20 years)
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-stone-800 mb-2">
                Credit Score Impact
              </h3>
              <p className="text-stone-700">
                We calculate the impact based on hard inquiry (-5 points),
                new account age (-5 points), and credit utilization changes.
              </p>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-3">
            Data Sources
          </h2>
          <ul className="list-disc list-inside text-stone-700 space-y-2">
            <li>Prime Rate: Based on current market rates</li>
            <li>LTV Ratios: Industry standard lending guidelines</li>
            <li>Credit Score Impact: FICO scoring methodology</li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-3">
            Important Disclaimer
          </h2>
          <p className="text-stone-700 leading-relaxed">
            This calculator is for educational purposes only. Results are
            estimates based on the information you provide. Actual loan terms,
            rates, and credit impacts may vary. Always consult with qualified
            financial advisors, mortgage specialists, and tax professionals
            before making financial decisions.
          </p>
        </section>
      </div>
    </div>
  );
}
