interface MiniStatProps {
  label: string;
  value: number;
  color: "emerald" | "blue" | "indigo" | "amber";
}

export function MiniStat({ label, value, color }: MiniStatProps) {
  const colorMap = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <div className={`rounded-xl border px-4 py-2 shadow-sm ${colorMap[color]}`}>
      <span className="block text-[10px] font-black uppercase tracking-wider opacity-70">
        {label}
      </span>

      <span className="text-lg font-black leading-none">{value}</span>
    </div>
  );
}