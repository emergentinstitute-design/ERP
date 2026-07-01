import type { StudentResultCell } from "./types";
import { StatusBadge } from "./StatusBadge";

interface ResultCellProps {
  result: StudentResultCell;
}

export function ResultCell({ result }: ResultCellProps) {
  const scoreColor =
    result.status === "pending" ? "text-slate-400" : "text-slate-800";

  const score = result.status === "present" ? result.score ?? 0 : 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-black ${scoreColor}`}>
        {score}/{result.maxMarks}
      </span>

      <StatusBadge status={result.status} />
    </div>
  );
}