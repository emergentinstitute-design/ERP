"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Edit3,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import EditExamModal, { type Exam } from "./EditExamModal";

export default function CreatedExamsList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExamForEdit, setSelectedExamForEdit] = useState<Exam | null>(
    null
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      setErrorMessage(null);

      const res = await fetch("/api/exams", {
        method: "GET",
        cache: "no-store",
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        setErrorMessage(payload.error || "Failed to load exams.");
        return;
      }

      setExams(payload.data || []);
    } catch (err) {
      console.error("Exam loading error:", err);
      setErrorMessage("Network error: Unable to load exams.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchExams();
  };

  const handleEditClick = async (examId: string) => {
    try {
      setEditingExamId(examId);
      setErrorMessage(null);

      const res = await fetch(`/api/exams/${examId}`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = await res.json();

      if (!res.ok || !payload.success) {
        setErrorMessage(payload.error || "Failed to load exam details.");
        return;
      }

      setSelectedExamForEdit(payload.data);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Exam edit loading error:", err);
      setErrorMessage("Network error: Unable to load exam details.");
    } finally {
      setEditingExamId(null);
    }
  };

  const formatDate = (dateValue: string) => {
    if (!dateValue) return "-";

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Loading created exams...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
              Created Exams
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              View and edit all exams created batch-wise.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>

        <div className="p-5">
          {errorMessage && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {exams.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">
              <ClipboardList className="h-9 w-9 text-slate-400 mx-auto mb-3" />

              <h3 className="text-sm font-bold text-slate-800">
                No exams created yet
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Created exams will appear here after you submit the exam form.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b">
                      Exam
                    </th>

                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b">
                      Subject
                    </th>

                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b">
                      Board
                    </th>

                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b">
                      Batch
                    </th>

                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b">
                      Date
                    </th>

                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b">
                      Marks
                    </th>

                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b">
                      Duration
                    </th>

                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide border-b text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 border-b align-top">
                        <p className="font-bold text-slate-900">
                          {exam.exam_name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {exam.exam_type} • {exam.language}
                        </p>
                      </td>

                      <td className="px-4 py-4 border-b align-top">
                        <p className="font-semibold text-slate-800">
                          {exam.subject_name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {exam.chapter}
                        </p>
                      </td>

                      <td className="px-4 py-4 border-b align-top">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                          {exam.board}
                        </span>
                      </td>

                      <td className="px-4 py-4 border-b align-top">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          {exam.batch}
                        </span>
                      </td>

                      <td className="px-4 py-4 border-b align-top">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {formatDate(exam.exam_date)}
                        </div>
                      </td>

                      <td className="px-4 py-4 border-b align-top font-semibold text-slate-800">
                        {exam.max_marks}
                      </td>

                      <td className="px-4 py-4 border-b align-top text-slate-700">
                        {exam.duration_minutes
                          ? `${exam.duration_minutes} min`
                          : "-"}
                      </td>

                      <td className="px-4 py-4 border-b align-top text-right">
                        <button
                          type="button"
                          onClick={() => handleEditClick(exam.id)}
                          disabled={editingExamId === exam.id}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold disabled:opacity-50"
                        >
                          {editingExamId === exam.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit3 className="h-4 w-4" />
                          )}
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <EditExamModal
        open={isEditModalOpen}
        exam={selectedExamForEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExamForEdit(null);
        }}
        onUpdated={fetchExams}
      />
    </>
  );
}