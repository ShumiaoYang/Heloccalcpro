export const metadata = {
  title: 'Login | AI Toolbox',
};

export default function LoginPlaceholderPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white via-sky-50 to-blue-50 px-6 py-20 text-center text-slate-700">
      <div className="max-w-md space-y-6 rounded-3xl border border-sky-100 bg-white/90 p-8 shadow-lg shadow-sky-100/60">
        <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
          Coming Soon
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Account system in progress</h1>
        <p className="text-sm leading-relaxed text-slate-600">
          Authentication and billing will land in Phase 2. Reach out to <a href="mailto:product@aitoolbox.com">product@aitoolbox.com</a> if you
          need early access or want to join the private beta.
        </p>
      </div>
    </div>
  );
}
