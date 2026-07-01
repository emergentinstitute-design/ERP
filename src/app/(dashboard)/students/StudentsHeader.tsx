import { User, Users } from "lucide-react";

interface StudentsHeaderProps {
  totalStudents: number;
}

export default function StudentsHeader({ totalStudents }: StudentsHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 mb-8">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-6 w-6 text-indigo-600" />
            Student Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage active admissions, track transaction records, and monitor dues.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100/80 flex items-center gap-3 shadow-sm">
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                Active Enrollments
              </span>
              <span className="text-lg font-bold text-emerald-700 leading-none">
                {totalStudents}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}