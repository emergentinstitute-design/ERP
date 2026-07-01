"use client";

import { useEffect, useMemo, useState } from "react";
import { API_ENDPOINTS } from "./constants";
import { buildReportRows } from "./reportLogic";
import type { Exam, SavedScore, Student, StudentResultRow } from "./types";

export function useBatchReportData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [scoreMap, setScoreMap] = useState<Record<string, SavedScore>>({});
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingScores, setLoadingScores] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const [studentsRes, examsRes] = await Promise.all([
          fetch(API_ENDPOINTS.students, { method: "GET", cache: "no-store" }),
          fetch(API_ENDPOINTS.exams, { method: "GET", cache: "no-store" }),
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

    fetchInitialData();
  }, []);

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
      .filter((student) => (student.batch || "Unassigned") === selectedBatch)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedBatch]);

  const batchExams = useMemo(() => {
    if (selectedBatch === "All") return [];

    return exams
      .filter((exam) => (exam.batch || "Unassigned") === selectedBatch)
      .sort((a, b) => {
        const aDate = new Date(a.exam_date || a.created_at || "").getTime();
        const bDate = new Date(b.exam_date || b.created_at || "").getTime();

        if (Number.isFinite(aDate) && Number.isFinite(bDate)) {
          return aDate - bDate;
        }

        return a.exam_name.localeCompare(b.exam_name);
      });
  }, [exams, selectedBatch]);

  useEffect(() => {
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
              { method: "GET", cache: "no-store" }
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

    fetchScoresForBatchExams();
  }, [selectedBatch, batchExams]);

  const reportRows = useMemo<StudentResultRow[]>(() => {
    return buildReportRows({
      selectedBatch,
      batchStudents,
      batchExams,
      scoreMap,
    });
  }, [selectedBatch, batchStudents, batchExams, scoreMap]);

  return {
    students,
    batchStudents,
    batchExams,
    batches,
    selectedBatch,
    setSelectedBatch,
    loading,
    loadingScores,
    errorMessage,
    scoreCount: Object.keys(scoreMap).length,
    reportRows,
  };
}