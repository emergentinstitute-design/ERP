import { ArrowUpRight, Loader2, Receipt } from "lucide-react";
import type { Transaction } from "./types";
import { formatTransactionDate } from "./formatDate";

interface TransactionDrawerProps {
  studentId: string;
  transactions?: Transaction[];
  isLoading: boolean;
}

export default function TransactionDrawer({
  studentId,
  transactions,
  isLoading,
}: TransactionDrawerProps) {
  const transactionCount = transactions?.length || 0;

  return (
    <tr className="bg-slate-50/40">
      <td
        colSpan={6}
        className="px-8 py-4 border-l-4 border-indigo-500 bg-indigo-50/5"
      >
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Receipt className="h-4 w-4 text-indigo-500" />
              Transaction Ledger Receipts ({transactionCount})
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-mono">
              REF ID: {studentId.substring(0, 8)}...
            </span>
          </div>

          {isLoading ? (
            <div className="py-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              <span>Compiling past payments data...</span>
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 italic">
              No transaction logs detected for this candidate profile.
            </div>
          ) : (
            <div className="overflow-hidden border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 text-slate-500 font-bold">
                  <tr>
                    <th className="p-2.5">Payment Date</th>
                    <th className="p-2.5">Transaction ID</th>
                    <th className="p-2.5">Mode</th>
                    <th className="p-2.5">Accounting Remarks</th>
                    <th className="p-2.5 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/30">
                      <td className="p-2.5 whitespace-nowrap text-slate-500 font-medium">
                        {formatTransactionDate(tx)}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-400">
                        {tx.transaction_id || "—"}
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">
                          {tx.payment_mode}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 truncate max-w-[220px]">
                        {tx.remarks || "—"}
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                        ₹{parseFloat(tx.amount_paid).toLocaleString()}
                        <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}