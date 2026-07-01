"use client";

import { Loader2, X } from "lucide-react";
import BatchSelect from "./BatchSelect";
import type { EditStudentFormState, Student } from "./types";

interface EditStudentModalProps {
  isOpen: boolean;
  student: Student | null;
  formState: EditStudentFormState;
  isSubmitting: boolean;
  onClose: () => void;
  onFormChange: (state: EditStudentFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditStudentModal({
  isOpen,
  student,
  formState,
  isSubmitting,
  onClose,
  onFormChange,
  onSubmit,
}: EditStudentModalProps) {
  if (!isOpen || !student) return null;

  const updateField = (field: keyof EditStudentFormState, value: string) => {
    onFormChange({
      ...formState,
      [field]: value,
    });
  };

  const totalFees = parseFloat(formState.total_fees || "0");
  const concession = parseFloat(formState.concession || "0");
  const calculatedNetPayable = Math.max(totalFees - concession, 0).toString();



  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Edit Student Data
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update admission, contact, academic, and fee details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Student Name"
              value={formState.name}
              onChange={(value) => updateField("name", value)}
              required
            />

            <Field
              label="Father Name"
              value={formState.father_name}
              onChange={(value) => updateField("father_name", value)}
            />

            <Field
              label="Student Mobile"
              value={formState.mobile_student}
              onChange={(value) => updateField("mobile_student", value)}
            />

            <Field
              label="Father Mobile"
              value={formState.mobile_father}
              onChange={(value) => updateField("mobile_father", value)}
            />

            <Field
              label="Standard"
              value={formState.standard}
              onChange={(value) => updateField("standard", value)}
            />

            <BatchSelect
            value={formState.batch}
            onChange={(value) => updateField("batch", value)}
            required
            />

            <Field
              label="Subjects"
              value={formState.subjects}
              onChange={(value) => updateField("subjects", value)}
            />

            <Field
              label="Admission Date"
              type="date"
              value={formState.admission_date}
              onChange={(value) => updateField("admission_date", value)}
              required
            />

            <Field
              label="Total Fees"
              type="number"
              value={formState.total_fees}
              onChange={(value) => updateField("total_fees", value)}
            />

            <Field
              label="Concession"
              type="number"
              value={formState.concession}
              onChange={(value) => updateField("concession", value)}
            />

            <div className="block">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Net Payable Fees
            </span>

            <div className="mt-1 w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700">
                ₹{parseFloat(calculatedNetPayable).toLocaleString()}
            </div>

            <p className="mt-1 text-[11px] text-slate-400">
                Auto calculated from Total Fees minus Concession.
            </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold rounded-xl shadow-sm transition"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

function Field({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition"
      />
    </label>
  );
}