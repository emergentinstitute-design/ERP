import React from "react";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Filter,
  GraduationCap,
  Languages,
  Users,
} from "lucide-react";
import { Exam } from "./types";

interface AddScoreHeaderProps {
  exams: Exam[];
  selectedExamId: string;
  selectedExam: Exam | null;
  batchStudentsCount: number;
  completedCount: number;
  pendingCount: number;
  averageScore: number;
  onExamChange: (examId: string) => void;
  formatDate: (value: string | null | undefined) => string;
}

export default function AddScoreHeader({
  exams,
  selectedExamId,
  selectedExam,
  batchStudentsCount,
  completedCount,
  pendingCount,
  averageScore,
  onExamChange,
  formatDate,
}: AddScoreHeaderProps) {
  return (
    <div className="mb-5 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900">
              <ClipboardCheck className="h-5 w-5 text-indigo-600" />
              Add Exam Scores
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              Select an exam and enter marks for its batch students.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <MiniCount
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="Exams"
              value={exams.length}
              color="indigo"
            />

            <MiniCount
              icon={<Users className="h-3.5 w-3.5" />}
              label="Students"
              value={batchStudentsCount}
              color="emerald"
            />
          </div>
        </div>

        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={selectedExamId}
            onChange={(e) => onExamChange(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="">Select an exam to enter scores</option>

            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.exam_name} • {exam.subject_name} • {exam.chapter} •
                Batch: {exam.batch} • {formatDate(exam.exam_date)}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400">
            ▼
          </div>
        </div>

        {selectedExam && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <h2 className="text-center text-lg font-black tracking-tight text-slate-900">
              {selectedExam.exam_name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-slate-500">
              <DetailItem
                icon={<GraduationCap className="h-3 w-3" />}
                label="Type"
                value={selectedExam.exam_type}
              />

              <DetailItem
                icon={<GraduationCap className="h-3 w-3" />}
                label="Board"
                value={selectedExam.board}
              />

              <DetailItem
                icon={<BookOpen className="h-3 w-3" />}
                label="Subject"
                value={selectedExam.subject_name}
              />

              <DetailItem
                icon={<BookOpen className="h-3 w-3" />}
                label="Chapter"
                value={selectedExam.chapter}
              />

              <DetailItem
                icon={<Languages className="h-3 w-3" />}
                label="Language"
                value={selectedExam.language}
              />

              <DetailItem
                icon={<Users className="h-3 w-3" />}
                label="Batch"
                value={selectedExam.batch}
              />

              <DetailItem
                icon={<Award className="h-3 w-3" />}
                label="Marks"
                value={String(selectedExam.max_marks)}
              />

              <DetailItem
                icon={<Calendar className="h-3 w-3" />}
                label="Date"
                value={formatDate(selectedExam.exam_date)}
              />

              <DetailItem
                icon={<Clock className="h-3 w-3" />}
                label="Duration"
                value={
                  selectedExam.duration_minutes
                    ? `${selectedExam.duration_minutes} min`
                    : "Not set"
                }
              />

              <DetailItem
                icon={<CheckCircle2 className="h-3 w-3" />}
                label="Filled"
                value={`${completedCount}/${batchStudentsCount}`}
              />

              <DetailItem
                icon={<ClipboardCheck className="h-3 w-3" />}
                label="Pending"
                value={String(pendingCount)}
              />

              <DetailItem
                icon={<Award className="h-3 w-3" />}
                label="Avg"
                value={averageScore.toFixed(1)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span className="text-slate-400">{icon}</span>
      <span className="text-slate-400">{label}:</span>
      <span className="max-w-[130px] truncate text-slate-700">{value}</span>
    </span>
  );
}

interface MiniCountProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "indigo" | "emerald";
}

function MiniCount({ icon, label, value, color }: MiniCountProps) {
  const colorClass =
    color === "indigo"
      ? "border-indigo-100 bg-indigo-50 text-indigo-700"
      : "border-emerald-100 bg-emerald-50 text-emerald-700";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-bold ${colorClass}`}
    >
      {icon}
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}