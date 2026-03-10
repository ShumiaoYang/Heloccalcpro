import Image from 'next/image';

interface ArchitectNoteProps {
  children: React.ReactNode;
  isZh?: boolean;
}

export default function ArchitectNote({ children, isZh = false }: ArchitectNoteProps) {
  return (
    <div className="my-8 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-6 shadow-md">
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 flex-shrink-0">
          <Image
            src="/images/profile-placeholder.jpg"
            alt="Sapling Yang"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">👨‍💻</span>
            <h4 className="text-sm font-bold text-blue-900">
              {isZh ? 'Sapling 的架构师洞察' : "Sapling's Architect Note"}
            </h4>
          </div>
          <div className="text-sm leading-relaxed text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
