import { Users } from "lucide-react";
import type { Student, Transaction } from "./types";
import StudentRow from "./StudentRow";

interface StudentsTableProps {
  students: Student[];
  expandedStudentId: string | null;
  transactions: Record<string, Transaction[]>;
  loadingTransactions: Record<string, boolean>;
  onToggleExpand: (studentId: string) => void;
  onCollectFees: (student: Student) => void;
  onEditStudent: (student: Student) => void;
}

export default function StudentsTable({
  students,
  expandedStudentId,
  transactions,
  loadingTransactions,
  onToggleExpand,
  onCollectFees,
  onEditStudent,
}: StudentsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200">
              <th className="w-8 px-4 py-4"></th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Student Profile
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Academic Assignment
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Fee Context & Dues
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                DOA
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider pr-8">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center opacity-60">
                    <Users className="h-12 w-12 text-slate-300 mb-2" />
                    <p className="text-slate-400 font-medium text-sm">
                      No students found matching your criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  isExpanded={expandedStudentId === student.id}
                  transactions={transactions[student.id]}
                  isLoadingTransactions={!!loadingTransactions[student.id]}
                  onToggleExpand={onToggleExpand}
                  onCollectFees={onCollectFees}
                  onEditStudent={onEditStudent}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}