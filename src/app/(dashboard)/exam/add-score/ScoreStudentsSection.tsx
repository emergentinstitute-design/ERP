import React from "react";
import { ClipboardCheck, Loader2, Save, Users } from "lucide-react";
import { Exam, Student } from "./types";

interface ScoreStudentsSectionProps {
  selectedExam: Exam | null;
  students: Student[];
  scores: Record<string, string>;
  absentStudents: Record<string, boolean>;
  saving: boolean;
  loadingScores: boolean;
  onScoreChange: (studentId: string, value: string) => void;
  onAbsentChange: (studentId: string, checked: boolean) => void;
  onScoreKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
  setInputRef: (
    studentId: string
  ) => (node: HTMLInputElement | null) => void;
  onSaveScores: () => void;
}

export default function ScoreStudentsSection({
  selectedExam,
  students,
  scores,
  absentStudents,
  saving,
  loadingScores,
  onScoreChange,
  onAbsentChange,
  onScoreKeyDown,
  setInputRef,
  onSaveScores,
}: ScoreStudentsSectionProps) {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-sm font-extrabold text-slate-900">
            Student Score Entry
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Enter marks one by one. Tick absent if the student did not appear.
            If absent is checked, the score will be treated as zero in reports.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="w-16 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  No.
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Student Name
                </th>

                <th className="w-64 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Score
                </th>

                <th className="w-32 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Absent
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {!selectedExam ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-70">
                      <ClipboardCheck className="mb-3 h-12 w-12 text-slate-300" />

                      <p className="text-sm font-semibold text-slate-500">
                        Select an exam first.
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Batch students will appear here automatically.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : loadingScores ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                      Loading saved scores...
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-70">
                      <Users className="mb-3 h-12 w-12 text-slate-300" />

                      <p className="text-sm font-semibold text-slate-500">
                        No students found for this exam batch.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, index) => {
                  const isAbsent = absentStudents[student.id] === true;

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors hover:bg-slate-50/50 ${
                        isAbsent ? "bg-rose-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4 align-middle">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <div className="text-sm font-bold text-slate-800">
                          {student.name}
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          <input
                            ref={setInputRef(student.id)}
                            type="number"
                            min="0"
                            max={selectedExam.max_marks}
                            step="0.5"
                            value={isAbsent ? "0" : scores[student.id] || ""}
                            disabled={saving || isAbsent}
                            onChange={(e) =>
                              onScoreChange(student.id, e.target.value)
                            }
                            onKeyDown={(e) => onScoreKeyDown(e, index)}
                            placeholder="0"
                            className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          />

                          <span className="text-xs font-bold text-slate-400">
                            / {selectedExam.max_marks}
                          </span>

                          {isAbsent && (
                            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-rose-600 ring-1 ring-rose-100">
                              Absent
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center align-middle">
                        <label className="inline-flex cursor-pointer items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isAbsent}
                            disabled={saving}
                            onChange={(e) =>
                              onAbsentChange(student.id, e.target.checked)
                            }
                            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-rose-600 focus:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </label>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {selectedExam && students.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-6 py-4">
            <div className="text-xs font-semibold text-slate-500">
              Checked students will be saved as absent. Reports can count them
              as zero while still showing their absent status.
            </div>

            <button
              type="button"
              onClick={onSaveScores}
              disabled={saving || loadingScores}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving ? "Saving Scores..." : "Save Scores"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}