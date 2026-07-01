import React from "react";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import type { Student, Transaction } from "./types";
import { formatIndianDate } from "./formatDate";
import TransactionDrawer from "./TransactionDrawer";

interface StudentRowProps {
  student: Student;
  isExpanded: boolean;
  transactions?: Transaction[];
  isLoadingTransactions: boolean;
  onToggleExpand: (studentId: string) => void;
  onCollectFees: (student: Student) => void;
  onEditStudent: (student: Student) => void;
}

export default function StudentRow({
  student,
  isExpanded,
  transactions,
  isLoadingTransactions,
  onToggleExpand,
  onCollectFees,
  onEditStudent,
}: StudentRowProps) {
  const netPayable = parseFloat(student.net_payable_fees || "0");
  const amountPaid = parseFloat(student.amount_paid_till_date || "0");
  const pendingFees = netPayable - amountPaid;

  return (
    <React.Fragment>
      <tr
        className={`group hover:bg-slate-50/40 transition-colors ${
          isExpanded ? "bg-indigo-50/20" : ""
        }`}
      >
        <td className="px-4 py-4.5 text-center">
          <button
            type="button"
            onClick={() => onToggleExpand(student.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-all"
            title="View Transactions History"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-indigo-600 stroke-[2.5]" />
            ) : (
              <ChevronDown className="h-4 w-4 group-hover:text-slate-600 transition-colors" />
            )}
          </button>
        </td>

        <td className="px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50/60 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm leading-tight">
                {student.name}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <User className="h-3 w-3" /> {student.father_name || "N/A"}
              </div>
              <div className="text-[11px] text-indigo-600 font-semibold mt-0.5 flex items-center gap-1">
                <Phone className="h-3 w-3 text-indigo-400" />{" "}
                {student.mobile_student || student.mobile_father || "—"}
              </div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100/60 uppercase">
                Class {student.standard || "—"}
              </span>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md border border-purple-100/60">
                {student.batch || "Unassigned"}
              </span>
            </div>
            <div className="text-xs text-slate-400 italic max-w-[180px] truncate">
              {student.subjects || "No courses assigned"}
            </div>
          </div>
        </td>

        <td className="px-6 py-4.5">
          <div className="space-y-1">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Net Payable
                </span>
                <div className="font-bold text-slate-700 mt-0.5">
                  ₹{netPayable.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Pending Dues
                </span>
                <div
                  className={`font-extrabold text-sm flex items-center gap-0.5 mt-0.5 ${
                    pendingFees > 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  ₹{pendingFees.toLocaleString()}
                  {pendingFees > 0 && (
                    <AlertCircle className="h-3 w-3 inline text-rose-400" />
                  )}
                </div>
              </div>
            </div>
            {parseFloat(student.concession) > 0 && (
              <div className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100/70 inline-block px-1.5 py-0.25 rounded">
                Concession Given: ₹{parseFloat(student.concession).toLocaleString()}
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4.5">
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formatIndianDate(student.admission_date)}
          </div>
        </td>

        <td className="px-6 py-4.5 text-right pr-8">
            <div className="flex items-center justify-end gap-2">
                <button
                type="button"
                onClick={() => onEditStudent(student)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all"
                >
                <Pencil className="h-3.5 w-3.5" />
                Edit
                </button>

                <button
                type="button"
                onClick={() => onCollectFees(student)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all transform active:scale-[0.98]"
                >
                <CreditCard className="h-3.5 w-3.5" />
                Collect Fees
                <ChevronRight className="h-3 w-3 opacity-60" />
                </button>
            </div>
        </td>
      </tr>

      {isExpanded && (
        <TransactionDrawer
          studentId={student.id}
          transactions={transactions}
          isLoading={isLoadingTransactions}
        />
      )}
    </React.Fragment>
  );
}