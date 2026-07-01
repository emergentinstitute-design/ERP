import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Exam, Student, StudentResultRow } from "./types";
import { formatDate } from "./utils";

interface ExportBatchReportPdfInput {
  selectedBatch: string;
  batchStudents: Student[];
  batchExams: Exam[];
  reportRows: StudentResultRow[];
}

const LOGO_PATH = "/client-logo.avif";

export async function exportBatchReportPdf({
  selectedBatch,
  batchStudents,
  batchExams,
  reportRows,
}: ExportBatchReportPdfInput) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const logoDataUrl = await loadImageAsPngDataUrl(LOGO_PATH);

  drawPdfHeader({
    doc,
    pageWidth,
    logoDataUrl,
    selectedBatch,
    batchStudentsCount: batchStudents.length,
    batchExamsCount: batchExams.length,
  });

  const tableHeaders = buildTableHeaders(batchExams);
  const tableBody = buildTableBody(reportRows);

  autoTable(doc, {
    startY: 42,
    head: [tableHeaders],
    body: tableBody,
    theme: "grid",
    tableWidth: "auto",
    margin: {
      left: 8,
      right: 8,
      bottom: 15,
    },
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 2,
      lineWidth: 0.1,
      lineColor: [180, 180, 180],
      textColor: [30, 41, 59],
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      halign: "center",
      lineColor: [148, 163, 184],
      lineWidth: 0.15,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 14 },
      1: { cellWidth: 36 },
    },
    didDrawPage: () => {
      drawFooter(doc, pageWidth, pageHeight);
    },
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: [0, 1],
  } as any);

  const fileName = makeSafeFileName(
    `Emergent-Institute-${selectedBatch}-Exam-Report.pdf`
  );

  doc.save(fileName);
}

function drawPdfHeader({
  doc,
  pageWidth,
  logoDataUrl,
  selectedBatch,
  batchStudentsCount,
  batchExamsCount,
}: {
  doc: jsPDF;
  pageWidth: number;
  logoDataUrl: string | null;
  selectedBatch: string;
  batchStudentsCount: number;
  batchExamsCount: number;
}) {
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 12, 9, 18, 18);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("EMERGENT INSTITUTE", pageWidth / 2, 15, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Batch Exam Report", pageWidth / 2, 21, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.text(`Batch: ${selectedBatch}`, 12, 34);
  doc.text(`Students: ${batchStudentsCount}`, 58, 34);
  doc.text(`Exams: ${batchExamsCount}`, 94, 34);
  doc.text(`Generated: ${formatGeneratedDate()}`, 126, 34);

  doc.setDrawColor(203, 213, 225);
  doc.line(8, 38, pageWidth - 8, 38);
}

function buildTableHeaders(batchExams: Exam[]) {
  return [
    "Rank",
    "Student",
    ...batchExams.map((exam) => {
      const name = exam.exam_name || "Exam";
      const subject = exam.subject_name || "Subject";
      const marks = exam.max_marks || 0;
      const date = formatDate(exam.exam_date);

      return `${name}\n${subject} | ${marks} marks\n${date}`;
    }),
    "Total",
    "%",
    "Absent",
    "Pending",
  ];
}

function buildTableBody(reportRows: StudentResultRow[]) {
  return reportRows.map((row) => [
    row.rank,
    row.student.name,
    ...row.results.map((result) => {
      if (result.status === "present") {
        return `${result.score}/${result.maxMarks}`;
      }

      if (result.status === "absent") {
        return `0/${result.maxMarks}\nAbsent`;
      }

      return `0/${result.maxMarks}\nPending`;
    }),
    `${row.totalObtained}/${row.totalMax}`,
    `${row.percentage.toFixed(1)}%`,
    row.absentCount,
    row.pendingCount,
  ]);
}

function drawFooter(doc: jsPDF, pageWidth: number, pageHeight: number) {
  const pageNumber = doc.getNumberOfPages();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);

  doc.text(
    "Pending and absent scores are counted as zero in percentage.",
    8,
    pageHeight - 7
  );

  doc.text(`Page ${pageNumber}`, pageWidth - 8, pageHeight - 7, {
    align: "right",
  });
}

function formatGeneratedDate() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function makeSafeFileName(fileName: string) {
  return fileName.replace(/[\\/:*?"<>|]+/g, "-");
}

function loadImageAsPngDataUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const image = new Image();

    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = Math.min(image.width, image.height);

      canvas.width = 512;
      canvas.height = 512;

      const context = canvas.getContext("2d");

      if (!context) {
        resolve(null);
        return;
      }

      const sourceX = (image.width - size) / 2;
      const sourceY = (image.height - size) / 2;

      context.drawImage(
        image,
        sourceX,
        sourceY,
        size,
        size,
        0,
        0,
        canvas.width,
        canvas.height
      );

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => resolve(null);

    image.src = src;
  });
}