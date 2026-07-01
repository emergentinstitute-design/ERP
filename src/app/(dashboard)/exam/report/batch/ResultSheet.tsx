import { Award, BookOpen, Loader2, Users } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { PdfDownloadButton } from "./PdfDownloadButton";
import { ResultTable } from "./ResultTable";
import type { Exam, Student, StudentResultRow } from "./types";

interface ResultSheetProps {
  selectedBatch: string;
  batchStudents: Student[];
  batchExams: Exam[];
  loadingScores: boolean;
  reportRows: StudentResultRow[];
}

export function ResultSheet({
  selectedBatch,
  batchStudents,
  batchExams,
  loadingScores,
  reportRows,
}: ResultSheetProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            Result Sheet
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Present shows marks. Absent and pending are counted as zero.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {loadingScores && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              Loading scores...
            </div>
          )}

          <PdfDownloadButton
            selectedBatch={selectedBatch}
            batchStudents={batchStudents}
            batchExams={batchExams}
            reportRows={reportRows}
          />
        </div>
      </div>

      <ResultSheetBody
        selectedBatch={selectedBatch}
        batchStudents={batchStudents}
        batchExams={batchExams}
        loadingScores={loadingScores}
        reportRows={reportRows}
      />

      {selectedBatch !== "All" && reportRows.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-3 text-xs font-semibold text-slate-500">
          <Award className="mr-1 inline h-3.5 w-3.5 text-indigo-500" />
          Pending means score entry has not been saved yet. Absent means the
          student was marked absent. Both are counted as zero in percentage.
        </div>
      )}
    </div>
  );
}

function ResultSheetBody({
  selectedBatch,
  batchStudents,
  batchExams,
  loadingScores,
  reportRows,
}: ResultSheetProps) {
  if (selectedBatch === "All") {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12 text-slate-300" />}
        title="Select a specific batch."
        subtitle="All Batches is only for matching the student ledger dropdown style."
      />
    );
  }

  if (batchStudents.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12 text-slate-300" />}
        title="No students found."
        subtitle="This batch has no students."
      />
    );
  }

  if (batchExams.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="h-12 w-12 text-slate-300" />}
        title="No exams found."
        subtitle="No exams have been created for this batch."
      />
    );
  }

  if (loadingScores) {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-20 text-sm font-bold text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        Loading exam scores...
      </div>
    );
  }

  return <ResultTable batchExams={batchExams} reportRows={reportRows} />;
}