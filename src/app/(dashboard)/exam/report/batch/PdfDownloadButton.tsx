"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { exportBatchReportPdf } from "./exportBatchReportPdf";
import type { Exam, Student, StudentResultRow } from "./types";

interface PdfDownloadButtonProps {
  selectedBatch: string;
  batchStudents: Student[];
  batchExams: Exam[];
  reportRows: StudentResultRow[];
}

export function PdfDownloadButton({
  selectedBatch,
  batchStudents,
  batchExams,
  reportRows,
}: PdfDownloadButtonProps) {
  const [exporting, setExporting] = useState(false);

  const disabled =
    exporting ||
    selectedBatch === "All" ||
    batchStudents.length === 0 ||
    batchExams.length === 0 ||
    reportRows.length === 0;

  const handleDownload = async () => {
    if (disabled) return;

    setExporting(true);

    try {
      await exportBatchReportPdf({
        selectedBatch,
        batchStudents,
        batchExams,
        reportRows,
      });
    } catch (error) {
      console.error("BATCH_REPORT_PDF_EXPORT_ERROR:", error);
      alert("Unable to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {exporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}

      {exporting ? "Preparing PDF..." : "Download PDF"}
    </button>
  );
}