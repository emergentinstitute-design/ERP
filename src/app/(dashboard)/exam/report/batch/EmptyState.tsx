import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center opacity-80">
      {icon}

      <p className="mt-3 text-sm font-black text-slate-500">{title}</p>

      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}