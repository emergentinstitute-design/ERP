"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import AddScoreHeader from "./AddScoreHeader";
import ScoreStudentsSection from "./ScoreStudentsSection";
import { Exam, SavedScore, Student } from "./types";

export default function AddScorePage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedExamId, setSelectedExamId] = useState("");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [absentStudents, setAbsentStudents] = useState<Record<string, boolean>>(
    {}
  );

  const [loading, setLoading] = useState(true);
  const [loadingScores, setLoadingScores] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const selectedExam = useMemo(() => {
    return exams.find((exam) => exam.id === selectedExamId) || null;
  }, [exams, selectedExamId]);

  const batchStudents = useMemo(() => {
    if (!selectedExam) return [];

    const selectedBatch = selectedExam.batch || "Unassigned";

    return students.filter((student) => {
      const studentBatch = student.batch || "Unassigned";
      return studentBatch === selectedBatch;
    });
  }, [students, selectedExam]);

  const completedCount = useMemo(() => {
    return batchStudents.filter((student) => {
      const isAbsent = absentStudents[student.id] === true;
      const hasScore = Boolean(scores[student.id]?.trim());

      return isAbsent || hasScore;
    }).length;
  }, [batchStudents, scores, absentStudents]);

  const pendingCount = batchStudents.length - completedCount;

  const averageScore = useMemo(() => {
    const validScores = batchStudents
      .map((student) => {
        const isAbsent = absentStudents[student.id] === true;

        if (isAbsent) return 0;

        const rawScore = scores[student.id]?.trim();

        if (!rawScore) return null;

        const numericScore = Number(rawScore);

        return Number.isFinite(numericScore) ? numericScore : null;
      })
      .filter((score): score is number => score !== null);

    if (validScores.length === 0) return 0;

    const total = validScores.reduce((sum, score) => sum + score, 0);

    return total / validScores.length;
  }, [batchStudents, scores, absentStudents]);

  const setInputRef =
    (studentId: string) => (node: HTMLInputElement | null) => {
      inputRefs.current[studentId] = node;
    };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedExamId) {
      setScores({});
      setAbsentStudents({});
      setSuccessMessage(null);
      setErrorMessage(null);
      return;
    }

    fetchExistingScores(selectedExamId);
  }, [selectedExamId]);

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

  const fetchInitialData = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [examsRes, studentsRes] = await Promise.all([
        fetch("/api/exams", {
          method: "GET",
          cache: "no-store",
        }),
        fetch("/api/students", {
          method: "GET",
          cache: "no-store",
        }),
      ]);

      const examsPayload = await examsRes.json();
      const studentsPayload = await studentsRes.json();

      if (!examsRes.ok || !examsPayload.success) {
        throw new Error(examsPayload.error || "Failed to load exams.");
      }

      if (!studentsRes.ok || !studentsPayload.success) {
        throw new Error(studentsPayload.error || "Failed to load students.");
      }

      setExams(examsPayload.data || []);
      setStudents(studentsPayload.data || []);
    } catch (err: any) {
      console.error("ADD_SCORE_INITIAL_LOAD_ERROR:", err);
      setErrorMessage(err.message || "Unable to load exam score page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingScores = async (examId: string) => {
    setLoadingScores(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/exam-scores?exam_id=${examId}`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        throw new Error(payload.error || "Failed to load existing scores.");
      }

      const savedScores: SavedScore[] = payload.data || [];

      const nextScores: Record<string, string> = {};
      const nextAbsentStudents: Record<string, boolean> = {};

      savedScores.forEach((row) => {
        const savedRow = row as SavedScore & {
          status?: string | null;
          is_absent?: boolean | null;
        };

        const isAbsent =
          savedRow.status === "absent" || savedRow.is_absent === true;

        nextAbsentStudents[savedRow.student_id] = isAbsent;

        nextScores[savedRow.student_id] =
          savedRow.score_obtained === null ||
          savedRow.score_obtained === undefined
            ? isAbsent
              ? "0"
              : ""
            : String(savedRow.score_obtained);
      });

      setScores(nextScores);
      setAbsentStudents(nextAbsentStudents);
    } catch (err: any) {
      console.error("EXISTING_SCORE_LOAD_ERROR:", err);
      setErrorMessage(err.message || "Unable to load existing scores.");
    } finally {
      setLoadingScores(false);
    }
  };

  const handleScoreChange = (studentId: string, value: string) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setScores((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleAbsentChange = (studentId: string, checked: boolean) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setAbsentStudents((prev) => ({
      ...prev,
      [studentId]: checked,
    }));

    setScores((prev) => ({
      ...prev,
      [studentId]: checked ? "0" : "",
    }));
  };

  const handleScoreKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const nextStudent = batchStudents
      .slice(index + 1)
      .find((student) => absentStudents[student.id] !== true);

    if (nextStudent) {
      inputRefs.current[nextStudent.id]?.focus();
    }
  };

  const validateBeforeSave = () => {
    if (!selectedExam) {
      return "Please select an exam.";
    }

    if (batchStudents.length === 0) {
      return "No students found in this exam batch.";
    }

    const maxMarks = Number(selectedExam.max_marks || 0);

    if (!Number.isFinite(maxMarks) || maxMarks <= 0) {
      return "Selected exam has invalid maximum marks.";
    }

    for (const student of batchStudents) {
      const isAbsent = absentStudents[student.id] === true;

      if (isAbsent) {
        continue;
      }

      const rawScore = scores[student.id]?.trim() || "";

      if (!rawScore) {
        return `Please enter score for ${student.name} or mark absent.`;
      }

      const numericScore = Number(rawScore);

      if (!Number.isFinite(numericScore) || numericScore < 0) {
        return `Please enter a valid score for ${student.name}.`;
      }

      if (numericScore > maxMarks) {
        return `${student.name}'s score cannot be greater than maximum marks ${maxMarks}.`;
      }
    }

    return null;
  };

  const handleSaveScores = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationError = validateBeforeSave();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!selectedExam) return;

    setSaving(true);

    try {
      const scoreRows = batchStudents.map((student) => {
        const isAbsent = absentStudents[student.id] === true;

        return {
          student_id: student.id,
          score_obtained: isAbsent ? 0 : Number(scores[student.id]),
          status: isAbsent ? "absent" : "present",
          remarks: isAbsent ? "Absent" : null,
        };
      });

      const res = await fetch("/api/exam-scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam_id: selectedExam.id,
          scores: scoreRows,
        }),
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        throw new Error(payload.error || "Failed to save scores.");
      }

      setSuccessMessage("Scores saved successfully.");

      await fetchExistingScores(selectedExam.id);
    } catch (err: any) {
      console.error("SCORE_SAVE_ERROR:", err);
      setErrorMessage(err.message || "Unable to save scores.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

        <p className="animate-pulse font-medium text-slate-500">
          Loading exams and students...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 antialiased selection:bg-indigo-500/10">
      <AddScoreHeader
        exams={exams}
        selectedExamId={selectedExamId}
        selectedExam={selectedExam}
        batchStudentsCount={batchStudents.length}
        completedCount={completedCount}
        pendingCount={pendingCount}
        averageScore={averageScore}
        onExamChange={setSelectedExamId}
        formatDate={formatDate}
      />

      <div className="mx-auto max-w-7xl px-6">
        {errorMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <p className="text-sm font-semibold">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

            <p className="text-sm font-semibold">{successMessage}</p>
          </div>
        )}
      </div>

      <ScoreStudentsSection
        selectedExam={selectedExam}
        students={batchStudents}
        scores={scores}
        absentStudents={absentStudents}
        saving={saving}
        loadingScores={loadingScores}
        onScoreChange={handleScoreChange}
        onAbsentChange={handleAbsentChange}
        onScoreKeyDown={handleScoreKeyDown}
        setInputRef={setInputRef}
        onSaveScores={handleSaveScores}
      />
    </div>
  );
}