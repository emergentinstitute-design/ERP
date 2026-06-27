"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  mobile_student: string | null;
  mobile_father: string | null;
  batch: string | null;
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

export default function CreateExamForm() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setStudents(payload.data || []);
        } else {
          setErrorMessage(payload.error || "Failed to load students.");
        }
      })
      .catch((err) => {
        console.error("Student loading error:", err);
        setErrorMessage("Network error: Unable to load students.");
      })
      .finally(() => setLoadingStudents(false));
  }, []);

  const batches = useMemo(() => {
    return [
      ...Array.from(
        new Set(students.map((student) => student.batch || "Unassigned"))
      ).sort(),
    ];
  }, [students]);

  const selectedBatchStudents = useMemo(() => {
    if (!batch) return [];

    return students.filter((student) => {
      const studentBatch = student.batch || "Unassigned";
      return studentBatch === batch;
    });
  }, [students, batch]);

  const formatTitleCase = (value: string) => {
    return value
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const resetForm = () => {
    setExamName("");
    setExamType("");
    setSubjectName("");
    setLanguage("");
    setBoard("");
    setChapter("");
    setExamDate("");
    setBatch("");
    setMaxMarks("100");
    setDurationMinutes("");
  };

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

    if (!numericMaxMarks || numericMaxMarks <= 0) {
      return "Please enter valid maximum marks.";
    }

    if (durationMinutes && numericDuration <= 0) {
      return "Please enter valid exam duration.";
    }

    if (selectedBatchStudents.length === 0) {
      return "No students found in selected batch.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
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
        setErrorMessage(payload.error || "Failed to create exam.");
        return;
      }

      setSuccessMessage(
        `Exam created successfully for batch: ${batch}.`
      );

      resetForm();
    } catch (err) {
      console.error("Exam creation error:", err);
      setErrorMessage("Network error: Unable to create exam.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingStudents) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          Loading students and batches...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-5 border-b border-slate-200 bg-slate-50/60">
        <h2 className="text-base font-bold text-slate-900">Exam Details</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select exam details, board, subject, chapter and batch.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Exam
            </label>

            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
            >
              <option value="">Choose exam</option>
              {examOptions.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Exam Type
            </label>

            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
            >
              <option value="">Choose exam type</option>
              {examTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Board
            </label>

            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
            >
              <option value="">Choose board</option>
              {boardOptions.map((boardName) => (
                <option key={boardName} value={boardName}>
                  {boardName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Subject
            </label>

            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
            >
              <option value="">Choose subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
            >
              <option value="">Choose language</option>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Chapter
          </label>

          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(formatTitleCase(e.target.value))}
            placeholder="Example: Light Reflection And Refraction"
            className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Exam Date
            </label>

            <div className="relative">
              <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Select Batch
            </label>

            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
            >
              <option value="">Choose batch</option>

              {batches.map((batchName) => (
                <option key={batchName} value={batchName}>
                  {batchName === "Unassigned"
                    ? "Unassigned"
                    : `Batch: ${batchName}`}
                </option>
              ))}
            </select>

            {batch && (
              <p className="text-xs text-slate-500 mt-2">
                This exam will be assigned to batch: {batch}.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Maximum Marks
            </label>

            <input
              type="number"
              min="1"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Duration In Minutes
            </label>

            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="Example: 60"
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={saving}
            className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-sm shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Exam
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}