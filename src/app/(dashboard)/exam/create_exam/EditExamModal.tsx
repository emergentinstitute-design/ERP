"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Save, X } from "lucide-react";

export interface Exam {
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

interface Student {
  id: string;
  name: string;
  batch: string | null;
}

interface EditExamModalProps {
  open: boolean;
  exam: Exam | null;
  onClose: () => void;
  onUpdated: () => void;
}

const examOptions = [
  "Weekly Test",
  "Monthly Test",
  "Quarterly Test",
  "Half Yearly Exam",
  "Annual Exam",
  "Unit Test",
  "Preliminary Exam",
  "Practice Test",
];

const examTypeOptions = ["MCQ", "Subjective"];

const boardOptions = ["CBSE", "SSC", "ICSE"];

const languageOptions = ["English", "Hindi", "Marathi"];

const subjectOptions = [
  "English",
  "Hindi",
  "Marathi",
  "Sanskrit",
  "Mathematics",
  "Maths 1",
  "Maths 2",
  "Science",
  "Science 1",
  "Science 2",
  "Social Science",
  "History",
  "Geography",
  "Civics",
  "Political Science",
  "Economics",
  "Computer",
  "Computer Science",
  "Environmental Studies",
  "Physics",
  "Chemistry",
  "Biology",
  "Commerce",
  "Accountancy",
  "Business Studies",
  "Commercial Studies",
  "General Knowledge",
  "Moral Science",
];

export default function EditExamModal({
  open,
  exam,
  onClose,
  onUpdated,
}: EditExamModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [saving, setSaving] = useState(false);

  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [language, setLanguage] = useState("");
  const [board, setBoard] = useState("");
  const [chapter, setChapter] = useState("");
  const [examDate, setExamDate] = useState("");
  const [batch, setBatch] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const batches = useMemo(() => {
    return Array.from(
      new Set(students.map((student) => student.batch || "Unassigned"))
    ).sort();
  }, [students]);

  const labelClass =
    "block text-[9px] font-bold text-slate-500 uppercase mb-1";

  const inputClass =
    "w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-md bg-white text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70";

  const formatTitleCase = (value: string) => {
    return value
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const normalizeDate = (value: string) => {
    if (!value) return "";
    return value.slice(0, 10);
  };

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, saving]);

  useEffect(() => {
    if (!open) return;

    const fetchStudents = async () => {
      try {
        setLoadingBatches(true);

        const res = await fetch("/api/students", {
          method: "GET",
          cache: "no-store",
        });

        const payload = await res.json();

        if (payload.success) {
          setStudents(payload.data || []);
        }
      } catch (err) {
        console.error("Batch loading error:", err);
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchStudents();
  }, [open]);

  useEffect(() => {
    if (!exam) return;

    setExamName(exam.exam_name || "");
    setExamType(exam.exam_type || "");
    setSubjectName(exam.subject_name || "");
    setLanguage(exam.language || "");
    setBoard(exam.board || "");
    setChapter(exam.chapter || "");
    setExamDate(normalizeDate(exam.exam_date || ""));
    setBatch(exam.batch || "");
    setMaxMarks(String(exam.max_marks || 100));
    setDurationMinutes(
      exam.duration_minutes ? String(exam.duration_minutes) : ""
    );
    setErrorMessage(null);
  }, [exam]);

  const validateForm = () => {
    const numericMaxMarks = Number(maxMarks);
    const numericDuration = Number(durationMinutes);

    if (!examName) return "Please select exam.";
    if (!examType) return "Please select exam type.";
    if (!subjectName) return "Please select subject.";
    if (!language) return "Please select language.";
    if (!board) return "Please select board.";
    if (!chapter.trim()) return "Please enter chapter.";
    if (!examDate) return "Please select exam date.";
    if (!batch) return "Please select batch.";

    if (!Number.isFinite(numericMaxMarks) || numericMaxMarks <= 0) {
      return "Please enter valid maximum marks.";
    }

    if (
      durationMinutes &&
      (!Number.isFinite(numericDuration) || numericDuration <= 0)
    ) {
      return "Please enter valid exam duration.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!exam) return;

    setErrorMessage(null);

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/exams/${exam.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam_name: examName,
          exam_type: examType,
          subject_name: subjectName,
          language,
          board,
          chapter: formatTitleCase(chapter),
          exam_date: examDate,
          batch,
          max_marks: Number(maxMarks),
          duration_minutes: durationMinutes ? Number(durationMinutes) : null,
        }),
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        setErrorMessage(payload.error || "Failed to update exam.");
        return;
      }

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Exam update error:", err);
      setErrorMessage("Network error: Unable to update exam.");
    } finally {
      setSaving(false);
    }
  };

  if (!open || !exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-exam-title"
        className="w-[calc(100%-1.5rem)] max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
          <h3
            id="edit-exam-title"
            className="text-xs font-bold uppercase tracking-wider text-slate-800"
          >
            Edit Exam
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close edit exam popup"
            className="text-slate-400 transition-colors hover:text-slate-600 disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[72vh] overflow-y-auto p-4">
            {errorMessage && (
              <div className="mb-3 flex items-start gap-2 rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-rose-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p className="text-xs font-semibold">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelClass}>Exam Name</label>
                <select
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                >
                  <option value="">Select exam</option>

                  {examName && !examOptions.includes(examName) && (
                    <option value={examName}>{examName}</option>
                  )}

                  {examOptions.map((examOption) => (
                    <option key={examOption} value={examOption}>
                      {examOption}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                >
                  <option value="">Select type</option>

                  {examType && !examTypeOptions.includes(examType) && (
                    <option value={examType}>{examType}</option>
                  )}

                  {examTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Board</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                >
                  <option value="">Select board</option>

                  {board && !boardOptions.includes(board) && (
                    <option value={board}>{board}</option>
                  )}

                  {boardOptions.map((boardName) => (
                    <option key={boardName} value={boardName}>
                      {boardName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Subject</label>
                <select
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                >
                  <option value="">Select subject</option>

                  {subjectName && !subjectOptions.includes(subjectName) && (
                    <option value={subjectName}>{subjectName}</option>
                  )}

                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                >
                  <option value="">Select language</option>

                  {language && !languageOptions.includes(language) && (
                    <option value={language}>{language}</option>
                  )}

                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Chapter</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(formatTitleCase(e.target.value))}
                  disabled={saving}
                  placeholder="Example: Light Reflection And Refraction"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Batch</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  disabled={saving || loadingBatches}
                  className={inputClass}
                >
                  <option value="">
                    {loadingBatches ? "Loading..." : "Select batch"}
                  </option>

                  {batch && !batches.includes(batch) && (
                    <option value={batch}>
                      {batch === "Unassigned" ? "Unassigned" : `Batch: ${batch}`}
                    </option>
                  )}

                  {batches.map((batchName) => (
                    <option key={batchName} value={batchName}>
                      {batchName === "Unassigned"
                        ? "Unassigned"
                        : `Batch: ${batchName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Max Marks</label>
                <input
                  type="number"
                  min="1"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Duration Min</label>
                <input
                  type="number"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  disabled={saving}
                  placeholder="60"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Save className="h-3 w-3" />
              )}

              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}