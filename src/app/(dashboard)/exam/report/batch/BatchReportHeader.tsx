import { ClipboardList } from "lucide-react";
import { MiniStat } from "./MiniStat";

interface BatchReportHeaderProps {
  totalStudents: number;
  batchStudents: number;
  batchExams: number;
  scoreCount: number;
}

export function BatchReportHeader({
  totalStudents,
  batchStudents,
  batchExams,
  scoreCount,
}: BatchReportHeaderProps) {
  return (
    <div className="mb-8 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-24 max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900">
            <ClipboardList className="h-6 w-6 text-indigo-600" />
            Batch Exam Report
          </h1>

          <p className="mt-0.5 text-sm text-slate-500">
            Select a batch to view all exam scores of its students.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Students" value={totalStudents} color="emerald" />
          <MiniStat label="Batch Students" value={batchStudents} color="blue" />
          <MiniStat label="Batch Exams" value={batchExams} color="indigo" />
          <MiniStat label="Scores" value={scoreCount} color="amber" />
        </div>
      </div>
    </div>
  );
}