interface StatusBadgeProps {
  status: "present" | "absent" | "pending";
}

const statusStyles = {
  present: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
  absent: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
  pending: "bg-slate-100 text-slate-400",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}