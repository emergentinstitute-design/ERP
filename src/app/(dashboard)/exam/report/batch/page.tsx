"use client";

import { BatchReportHeader } from "./BatchReportHeader";
import { BatchSelector } from "./BatchSelector";
import { ErrorBanner } from "./ErrorBanner";
import { LoadingState } from "./LoadingState";
import { ResultSheet } from "./ResultSheet";
import { useBatchReportData } from "./useBatchReportData";

export default function BatchReportPage() {
  const {
    students,
    batchStudents,
    batchExams,
    batches,
    selectedBatch,
    setSelectedBatch,
    loading,
    loadingScores,
    errorMessage,
    scoreCount,
    reportRows,
  } = useBatchReportData();

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 antialiased selection:bg-indigo-500/10">
      <BatchReportHeader
        totalStudents={students.length}
        batchStudents={batchStudents.length}
        batchExams={batchExams.length}
        scoreCount={scoreCount}
      />

      <div className="mx-auto max-w-7xl px-6">
        {errorMessage && <ErrorBanner message={errorMessage} />}

        <BatchSelector
          batches={batches}
          selectedBatch={selectedBatch}
          onBatchChange={setSelectedBatch}
        />

        <ResultSheet
          selectedBatch={selectedBatch}
          batchStudents={batchStudents}
          batchExams={batchExams}
          loadingScores={loadingScores}
          reportRows={reportRows}
        />
      </div>
    </div>
  );
}