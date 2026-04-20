interface ArchitectNoteProps {
  children: React.ReactNode;
  isZh?: boolean;
}

export default function ArchitectNote({ children, isZh = false }: ArchitectNoteProps) {
  return (
    <aside
      aria-label={isZh ? '架构师专业洞察' : 'Architect pro insight'}
      className="my-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-6 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 items-center rounded-full bg-blue-700 px-2 text-xs font-semibold text-white">
          {isZh ? '专业洞察' : 'Pro Insight'}
        </span>
        <p className="text-sm font-semibold text-blue-900">
          {isZh ? 'Sapling Yang · 核心银行系统架构师' : 'Sapling Yang · Core Banking Architect'}
        </p>
      </div>
      <div className="text-sm leading-relaxed text-slate-700">{children}</div>
    </aside>
  );
}
