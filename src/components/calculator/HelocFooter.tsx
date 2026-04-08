'use client';

interface HelocFooterProps {
  onGetReportClick: () => void;
}

export default function HelocFooter({ onGetReportClick }: HelocFooterProps) {
  return (
    <div className="border-t-2 border-emerald-100 bg-emerald-50/30 px-6 py-5">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Left side - CTA text */}
        <div className="text-center sm:text-left">
          <p className="text-base font-semibold text-slate-800 sm:text-lg mb-2">
            New Site Special: Get the <span className="line-through text-slate-500">$29.90</span> Professional Strategy Report.
          </p>
          <p className="text-base font-semibold text-slate-800 sm:text-lg mb-2">
            Everything you need to KNOW and AVOID for just{' '}
            <span className="text-emerald-600 font-bold">$4.99</span> today.
          </p>
          <a
            href="/en/sample-report"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            [View a Sample Strategy Report (PDF)]
          </a>
        </div>

        {/* Right side - Button */}
        <button
          onClick={onGetReportClick}
          className="whitespace-nowrap rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg"
        >
          Get My Report
        </button>
      </div>
    </div>
  );
}
