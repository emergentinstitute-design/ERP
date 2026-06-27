"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  ClipboardList,
  Filter,
  Loader2,
  Trophy,
  Users,
} from "lucide-react";

type ScoreStatus = "present" | "absent";

interface Student {
  id: string;
  enquiry_id: string | null;
  name: string;
  father_name: string | null;
  mobile_student: string | null;
  mobile_father: string | null;
  standard: string | null;
  batch: string | null;
  subjects: string | null;
  total_fees: string;
  concession: string;
  net_payable_fees: string;
  admission_date: string;
  amount_paid_till_date?: string;
}

interface Exam {
  id: string;
  exam_name: string;
  exam_type: string;
  board: string;
  subject_name: string;
  language: string;
  chapter: string;
  exam_date: string;
  batch: string;
  max_marks: number;
  duration_minutes: number | null;
  created_at?: string;
  updated_at?: string;
}

interface SavedScore {
  id: string;
  exam_id: string;
  student_id: string;
  score_obtained: number | string | null;
  max_marks_snapshot: number | string;
  status: ScoreStatus;
  remarks: string | null;
  created_at?: string;
  updated_at?: string;
}

interface StudentResultRow {
  rank: number;
  student: Student;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  absentCount: number;
  pendingCount: number;
  results: {
    exam: Exam;
    status: "present" | "absent" | "pending";
    score: number | null;
    maxMarks: number;
  }[];
}

const API_ENDPOINTS = {
  exams: "/api/exams",
  students: "/api/students",
  examScores: "/api/exam-scores",
};

export default function BatchReportPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [scoreMap, setScoreMap] = useState<Record<string, SavedScore>>({});

  const [selectedBatch, setSelectedBatch] = useState("All");

  const [loading, setLoading] = useState(true);
  const [loadingScores, setLoadingScores] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "—";

    const normalized =
      typeof value === "string" && value.includes(" ") && !value.includes("T")
        ? value.replace(" ", "T")
        : value;

    const date = new Date(normalized);

    if (isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const toNumber = (value: number | string | null | undefined) => {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const fetchInitialData = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [studentsRes, examsRes] = await Promise.all([
        fetch(API_ENDPOINTS.students, {
          method: "GET",
          cache: "no-store",
        }),
        fetch(API_ENDPOINTS.exams, {
          method: "GET",
          cache: "no-store",
        }),
      ]);

      const studentsPayload = await studentsRes.json();
      const examsPayload = await examsRes.json();

      if (!studentsRes.ok || !studentsPayload.success) {
        throw new Error(studentsPayload.error || "Failed to load students.");
      }

      if (!examsRes.ok || !examsPayload.success) {
        throw new Error(examsPayload.error || "Failed to load exams.");
      }

      setStudents(studentsPayload.data || []);
      setExams(examsPayload.data || []);
    } catch (err: any) {
      console.error("BATCH_REPORT_INITIAL_LOAD_ERROR:", err);
      setErrorMessage(err.message || "Unable to load batch report.");
    } finally {
      setLoading(false);
    }
  };

  const batches = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(students.map((student) => student.batch || "Unassigned"))
      ).sort(),
    ];
  }, [students]);

  const batchStudents = useMemo(() => {
    if (selectedBatch === "All") return [];

    return students
      .filter((student) => {
        const studentBatch = student.batch || "Unassigned";
        return studentBatch === selectedBatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedBatch]);

  const batchExams = useMemo(() => {
    if (selectedBatch === "All") return [];

    return exams
      .filter((exam) => {
        const examBatch = exam.batch || "Unassigned";
        return examBatch === selectedBatch;
      })
      .sort((a, b) => {
        const aDate = new Date(a.exam_date || a.created_at || "").getTime();
        const bDate = new Date(b.exam_date || b.created_at || "").getTime();

        if (Number.isFinite(aDate) && Number.isFinite(bDate)) {
          return aDate - bDate;
        }

        return a.exam_name.localeCompare(b.exam_name);
      });
  }, [exams, selectedBatch]);

  const fetchScoresForBatchExams = async () => {
    if (selectedBatch === "All" || batchExams.length === 0) {
      setScoreMap({});
      return;
    }

    setLoadingScores(true);
    setErrorMessage(null);

    try {
      const responses = await Promise.all(
        batchExams.map(async (exam) => {
          const res = await fetch(
            `${API_ENDPOINTS.examScores}?exam_id=${encodeURIComponent(
              exam.id
            )}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          const payload = await res.json();

          if (!res.ok || !payload.success) {
            throw new Error(
              payload.error || `Failed to load scores for ${exam.exam_name}.`
            );
          }

          return (payload.data || []) as SavedScore[];
        })
      );

      const nextScoreMap: Record<string, SavedScore> = {};

      responses.flat().forEach((score) => {
        nextScoreMap[`${score.exam_id}-${score.student_id}`] = score;
      });

      setScoreMap(nextScoreMap);
    } catch (err: any) {
      console.error("BATCH_SCORE_FETCH_ERROR:", err);
      setErrorMessage(err.message || "Unable to load exam scores.");
    } finally {
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchScoresForBatchExams();
  }, [selectedBatch, batchExams]);

  const reportRows = useMemo<StudentResultRow[]>(() => {
    if (selectedBatch === "All" || batchStudents.length === 0) return [];

    const rows = batchStudents.map((student) => {
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

          return {
            exam,
            status: "pending" as const,
            score: null,
            maxMarks,
          };
        }

        if (scoreRecord.status === "absent") {
          absentCount += 1;

          return {
            exam,
            status: "absent" as const,
            score: null,
            maxMarks,
          };
        }

        const obtained = toNumber(scoreRecord.score_obtained);
        totalObtained += obtained;

        return {
          exam,
          status: "present" as const,
          score: obtained,
          maxMarks,
        };
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
    });

    const sortedRows = [...rows].sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }

      if (b.totalObtained !== a.totalObtained) {
        return b.totalObtained - a.totalObtained;
      }

      return a.student.name.localeCompare(b.student.name);
    });

    let lastRank = 0;
    let lastKey = "";

    return sortedRows.map((row, index) => {
      const currentKey = `${row.totalObtained}-${row.totalMax}-${row.percentage.toFixed(
        4
      )}`;

      if (currentKey !== lastKey) {
        lastRank = index + 1;
        lastKey = currentKey;
      }

      return {
        ...row,
        rank: lastRank,
      };
    });
  }, [selectedBatch, batchStudents, batchExams, scoreMap]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

        <p className="animate-pulse font-medium text-slate-500">
          Loading batch report...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 antialiased selection:bg-indigo-500/10">
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
            <MiniStat
              label="Students"
              value={students.length}
              color="emerald"
            />

            <MiniStat
              label="Batch Students"
              value={batchStudents.length}
              color="blue"
            />

            <MiniStat
              label="Batch Exams"
              value={batchExams.length}
              color="indigo"
            />

            <MiniStat
              label="Scores"
              value={Object.keys(scoreMap).length}
              color="amber"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {errorMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <p className="text-sm font-semibold">{errorMessage}</p>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative w-full md:w-64">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch === "All" ? "All Batches" : `Batch: ${batch}`}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400">
              ▼
            </div>
          </div>

          {selectedBatch !== "All" && (
            <div className="flex items-center rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
              Showing report for Batch: {selectedBatch}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                Result Sheet
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Present shows marks. Absent and pending are counted as zero.
              </p>
            </div>

            {loadingScores && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                Loading scores...
              </div>
            )}
          </div>

          {selectedBatch === "All" ? (
            <EmptyState
              icon={<Users className="h-12 w-12 text-slate-300" />}
              title="Select a specific batch."
              subtitle="All Batches is only for matching the student ledger dropdown style."
            />
          ) : batchStudents.length === 0 ? (
            <EmptyState
              icon={<Users className="h-12 w-12 text-slate-300" />}
              title="No students found."
              subtitle="This batch has no students."
            />
          ) : batchExams.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-12 w-12 text-slate-300" />}
              title="No exams found."
              subtitle="No exams have been created for this batch."
            />
          ) : loadingScores ? (
            <div className="flex items-center justify-center gap-2 px-6 py-20 text-sm font-bold text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              Loading exam scores...
            </div>
          ) : (
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
                          {result.status === "present" && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-black text-slate-800">
                                {result.score}/{result.maxMarks}
                              </span>

                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-600 ring-1 ring-emerald-100">
                                Present
                              </span>
                            </div>
                          )}

                          {result.status === "absent" && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-black text-slate-700">
                                0/{result.maxMarks}
                              </span>

                              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-rose-600 ring-1 ring-rose-100">
                                Absent
                              </span>
                            </div>
                          )}

                          {result.status === "pending" && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-black text-slate-400">
                                0/{result.maxMarks}
                              </span>

                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-400">
                                Pending
                              </span>
                            </div>
                          )}
                        </td>
                      ))}

                      <td className="px-4 py-4 text-center align-middle">
                        <div className="font-black text-indigo-700">
                          {row.totalObtained}/{row.totalMax}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-black ${
                            row.percentage >= 75
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                              : row.percentage >= 40
                                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                                : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                          }`}
                        >
                          {row.percentage.toFixed(1)}%
                        </span>
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
          )}

          {selectedBatch !== "All" && reportRows.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-3 text-xs font-semibold text-slate-500">
              <Award className="mr-1 inline h-3.5 w-3.5 text-indigo-500" />
              Pending means score entry has not been saved yet. Absent means the
              student was marked absent. Both are counted as zero in percentage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: number;
  color: "emerald" | "blue" | "indigo" | "amber";
}

function MiniStat({ label, value, color }: MiniStatProps) {
  const colorMap = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <div
      className={`rounded-xl border px-4 py-2 shadow-sm ${colorMap[color]}`}
    >
      <span className="block text-[10px] font-black uppercase tracking-wider opacity-70">
        {label}
      </span>

      <span className="text-lg font-black leading-none">{value}</span>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center opacity-80">
      {icon}

      <p className="mt-3 text-sm font-black text-slate-500">{title}</p>

      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}