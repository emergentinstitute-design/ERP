import { Trophy } from "lucide-react";
import type { Exam, StudentResultRow } from "./types";
import { formatDate } from "./utils";
import { PercentageBadge } from "./PercentageBadge";
import { ResultCell } from "./ResultCell";

interface ResultTableProps {
  batchExams: Exam[];
  reportRows: StudentResultRow[];
}

export function ResultTable({ batchExams, reportRows }: ResultTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="sticky left-0 z-20 w-20 bg-slate-50/80 px-4 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
              Rank
            </th>

            <th className="sticky left-20 z-20 min-w-56 bg-slate-50/80 px-4 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
              Student
            </th>

            {batchExams.map((exam) => (
              <th
                key={exam.id}
                className="min-w-40 px-4 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500"
              >
                <div className="truncate">{exam.exam_name}</div>

                <div className="mt-0.5 truncate text-[10px] font-bold normal-case tracking-normal text-slate-400">
                  {exam.subject_name} • {exam.max_marks} marks
                </div>

                <div className="mt-0.5 truncate text-[10px] font-bold normal-case tracking-normal text-slate-400">
                  {formatDate(exam.exam_date)}
                </div>
              </th>
            ))}

            <th className="min-w-32 px-4 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
              Total
            </th>

            <th className="min-w-28 px-4 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
              %
            </th>

            <th className="min-w-24 px-4 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
              Absent
            </th>

            <th className="min-w-24 px-4 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
              Pending
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {reportRows.map((row) => (
            <tr
              key={row.student.id}
              className="transition-colors hover:bg-slate-50/60"
            >
              <td className="sticky left-0 z-10 bg-white px-4 py-4 align-middle">
                <div className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">
                  <Trophy className="h-3.5 w-3.5" />
                  {row.rank}
                </div>
              </td>

              <td className="sticky left-20 z-10 bg-white px-4 py-4 align-middle">
                <div className="font-black text-slate-800">
                  {row.student.name}
                </div>
              </td>

              {row.results.map((result) => (
                <td
                  key={`${row.student.id}-${result.exam.id}`}
                  className="px-4 py-4 text-center align-middle"
                >
                  <ResultCell result={result} />
                </td>
              ))}

              <td className="px-4 py-4 text-center align-middle">
                <div className="font-black text-indigo-700">
                  {row.totalObtained}/{row.totalMax}
                </div>
              </td>

              <td className="px-4 py-4 text-center align-middle">
                <PercentageBadge percentage={row.percentage} />
              </td>

              <td className="px-4 py-4 text-center align-middle">
                <span className="font-black text-rose-600">
                  {row.absentCount}
                </span>
              </td>

              <td className="px-4 py-4 text-center align-middle">
                <span className="font-black text-slate-500">
                  {row.pendingCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}