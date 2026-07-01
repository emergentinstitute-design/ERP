import type { Exam, SavedScore, Student, StudentResultRow } from "./types";
import { toNumber } from "./utils";

interface BuildReportRowsInput {
  selectedBatch: string;
  batchStudents: Student[];
  batchExams: Exam[];
  scoreMap: Record<string, SavedScore>;
}

export function buildReportRows({
  selectedBatch,
  batchStudents,
  batchExams,
  scoreMap,
}: BuildReportRowsInput): StudentResultRow[] {
  if (selectedBatch === "All" || batchStudents.length === 0) return [];

  const rows = batchStudents.map((student) =>
    buildStudentRow(student, batchExams, scoreMap)
  );

  return rankRows(rows);
}

function buildStudentRow(
  student: Student,
  batchExams: Exam[],
  scoreMap: Record<string, SavedScore>
): StudentResultRow {
  let totalObtained = 0;
  let totalMax = 0;
  let absentCount = 0;
  let pendingCount = 0;

  const results = batchExams.map((exam) => {
    const maxMarks = toNumber(exam.max_marks);
    const scoreRecord = scoreMap[`${exam.id}-${student.id}`];

    totalMax += maxMarks;

    if (!scoreRecord) {
      pendingCount += 1;
      return { exam, status: "pending" as const, score: null, maxMarks };
    }

    if (scoreRecord.status === "absent") {
      absentCount += 1;
      return { exam, status: "absent" as const, score: null, maxMarks };
    }

    const obtained = toNumber(scoreRecord.score_obtained);
    totalObtained += obtained;

    return { exam, status: "present" as const, score: obtained, maxMarks };
  });

  const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

  return {
    rank: 0,
    student,
    totalObtained,
    totalMax,
    percentage,
    absentCount,
    pendingCount,
    results,
  };
}

function rankRows(rows: StudentResultRow[]) {
  const sortedRows = [...rows].sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage;

    if (b.totalObtained !== a.totalObtained) {
      return b.totalObtained - a.totalObtained;
    }

    return a.student.name.localeCompare(b.student.name);
  });

  let lastRank = 0;
  let lastKey = "";

  return sortedRows.map((row, index) => {
    const currentKey = `${row.totalObtained}-${
      row.totalMax
    }-${row.percentage.toFixed(4)}`;

    if (currentKey !== lastKey) {
      lastRank = index + 1;
      lastKey = currentKey;
    }

    return { ...row, rank: lastRank };
  });
}