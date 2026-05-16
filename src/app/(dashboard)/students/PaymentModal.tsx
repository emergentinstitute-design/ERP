"use client";

import React from "react";
import { Wallet, X, Loader2, CheckCircle2 } from "lucide-react";

interface Student {
  id: string;
  enquiry_id: string | null;
  name: string;
  father_name: string | null;
  mobile_student: string | null;
  mobile_father: string | null;
  standard: string | null;
  batch: string | null;
  subjects: string | null;
  total_fees: string;
  concession: string;
  net_payable_fees: string;
  admission_date: string;
}

interface PaymentFormState {
  amount_paid: string;
  payment_mode: string;
  transaction_id: string;
  remarks: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  isSubmitting: boolean;
  formState: PaymentFormState;
  onFormChange: React.Dispatch<React.SetStateAction<PaymentFormState>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  student,
  isSubmitting,
  formState,
  onFormChange,
  onSubmit,
}: PaymentModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto antialiased">
      {/* Backdrop Layer */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Real Modal Window Box */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
          
          {/* Header block */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Installment Payment</h3>
                <p className="text-xs text-slate-400">Post transaction payload into financial ledger</p>
              </div>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="p-6 space-y-4">
              {/* Student Context Badge Summary */}
              <div className="bg-indigo-50/50 rounded-xl p-3.5 border border-indigo-100/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Candidate Reference</span>
                  <strong className="text-slate-800 font-bold text-sm">{student.name}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Net Payable Target</span>
                  <strong className="text-slate-800 font-extrabold text-sm text-indigo-700">
                    ₹{parseFloat(student.net_payable_fees).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Input Paid Amount */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Amount Paid (INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                    ₹
                  </div>
                  <input
                    type="number"
                    name="amount_paid"
                    required
                    min="1"
                    step="0.01"
                    placeholder="e.g. 5000"
                    value={formState.amount_paid}
                    onChange={(e) =>
                      onFormChange((prev) => ({ ...prev, amount_paid: e.target.value }))
                    }
                    className="block w-full pl-8 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Input Mode Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Payment Gateway/Mode
                  </label>
                  <select
                    name="payment_mode"
                    value={formState.payment_mode}
                    onChange={(e) =>
                      onFormChange((prev) => ({ ...prev, payment_mode: e.target.value }))
                    }
                    className="block w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer appearance-none"
                  >
                    <option value="Cash">💵 Cash Settlement</option>
                    <option value="UPI">📱 UPI / QR Code</option>
                    <option value="Net Banking">🏦 Net Banking / NEFT</option>
                    <option value="Cheque">✍️ Cheque Remittance</option>
                  </select>
                </div>

                {/* Transaction Reference Token */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Transaction / Ref ID
                  </label>
                  <input
                    type="text"
                    name="transaction_id"
                    placeholder="e.g. UPI Ref, Bank ID"
                    value={formState.transaction_id}
                    onChange={(e) =>
                      onFormChange((prev) => ({ ...prev, transaction_id: e.target.value }))
                    }
                    className="block w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Remarks Block */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Accounting Remarks
                </label>
                <textarea
                  name="remarks"
                  rows={2}
                  placeholder="e.g. Received Part-payment 1st Installment..."
                  value={formState.remarks}
                  onChange={(e) =>
                    onFormChange((prev) => ({ ...prev, remarks: e.target.value }))
                  }
                  className="block w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Footer Controls */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Posting Ledger...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Commit Payment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}