"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  BookOpen, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck, 
  Coins,
  Wallet,
} from "lucide-react";

type PageProps = {
  params: Promise<{ dashboard: string; id: string }>;
};

export default function ProcessAdmissionPage({ params }: PageProps) {
  const router = useRouter();
  
  const [enquiryId, setEnquiryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    father_name: "",
    mother_name: "",
    mobile_student: "",
    mobile_father: "",
    mobile_mother: "",
    address: "",
    school: "",
    standard: "",
    batch: "",
    subjects: "",
    total_fees: "0",
    concession: "0",
    amount_paid: "0",
    payment_mode: "Cash",
    transaction_id: "",
    payment_remarks: "",
  });

  // Unwrap params safely using native Promise handling
  useEffect(() => {
    params.then((resolved) => {
      setEnquiryId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    if (!enquiryId) return;

    fetch(`/api/admission/${enquiryId}`)
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          const item = payload.data;
          setFormData((prev) => ({
            ...prev,
            name: item.student_name || "",
            father_name: item.parent_name || "",
            mobile_student: item.contact_number || "",
            mobile_father: item.alternate_contact || "",
            address: item.address || "",
            school: item.current_school || "",
            standard: item.current_standard || "",
            subjects: item.interested_course || "",
          }));
        }
      })
      .catch((err) => console.error("Prefill fetch crash:", err))
      .finally(() => setLoading(false));
  }, [enquiryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admission/${enquiryId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Processing failed");
      router.push("/students"); 
    } catch (err: any) {
      alert("Error processing transition: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const netPayable = parseFloat(formData.total_fees || "0") - parseFloat(formData.concession || "0");
  const balanceRemaining = netPayable - parseFloat(formData.amount_paid || "0");

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Fetching pipeline context...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pipeline
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Conversion Mode
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finalize Admission</h1>
          <p className="text-slate-500 mt-1 text-sm">Review mapped enquiry values and establish the student's fee ledger.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: PERSONAL DETAILS */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
              <User className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-800">Primary Demographics</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Student Full Name" required>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="form-input-custom" placeholder="Full legal name" />
              </FormGroup>
              <FormGroup label="Student Mobile">
                <input type="text" name="mobile_student" value={formData.mobile_student} onChange={handleChange} className="form-input-custom" placeholder="Student phone" />
              </FormGroup>
              <FormGroup label="Father's Name">
                <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="form-input-custom" placeholder="Father's name" />
              </FormGroup>
              <FormGroup label="Father's Mobile">
                <input type="text" name="mobile_father" value={formData.mobile_father} onChange={handleChange} className="form-input-custom" placeholder="Father's phone" />
              </FormGroup>
              <FormGroup label="Mother's Name">
                <input type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} className="form-input-custom" placeholder="Mother's name" />
              </FormGroup>
              <FormGroup label="Mother's Mobile">
                <input type="text" name="mobile_mother" value={formData.mobile_mother} onChange={handleChange} className="form-input-custom" placeholder="Mother's phone" />
              </FormGroup>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-purple-500" />
              <h2 className="text-sm font-semibold text-slate-800">Institutional Assignments</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormGroup label="Target Standard">
                <input type="text" name="standard" value={formData.standard} onChange={handleChange} className="form-input-custom" />
              </FormGroup>
              
              {/* UPDATED: DYNAMIC SELECT BATCH OPTGROUP SELECTION DROPDOWN */}
              <FormGroup label="Allocated Batch" required>
                <select 
                  name="batch" 
                  required 
                  value={formData.batch} 
                  onChange={handleChange} 
                  className="form-input-custom cursor-pointer appearance-none bg-white"
                >
                  <option value="" disabled>Select Institutional Batch</option>
                  
                  <optgroup label="School Section (6th to 10th)">
                    <option value="6th to 10th CBSE">6th to 10th CBSE</option>
                    <option value="6th to 10th SSC">6th to 10th SSC</option>
                    <option value="6th to 10th ICSE">6th to 10th ICSE</option>
                  </optgroup>

                  <optgroup label="Academic Foundation Programs">
                    <option value="8th, 9th, 10th Foundation">8th, 9th & 10th Foundation</option>
                  </optgroup>

                  <optgroup label="Junior College Section (11th & 12th)">
                    <option value="11th & 12th SCI">11th & 12th Science (SCI)</option>
                    <option value="11th & 12th Commerce">11th & 12th Commerce</option>
                  </optgroup>

                  <optgroup label="Competitive Entrance Tracks">
                    <option value="JEE Foundation">JEE Foundation</option>
                    <option value="NEET Foundation">NEET Foundation</option>
                    <option value="MHT-CET Foundation">MHT-CET Foundation</option>
                  </optgroup>
                </select>
              </FormGroup>

              <div className="md:col-span-2 lg:col-span-1">
                <FormGroup label="Enrolled Subjects">
                  <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} className="form-input-custom" />
                </FormGroup>
              </div>
            </div>
          </div>

          {/* SECTION 3: FEE LEDGER */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
            <div className="px-6 py-4 border-b border-slate-100 bg-emerald-50/20 flex items-center gap-3">
              <Coins className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-slate-800">Fee Ledger & Initial Deposit</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <FormGroup label="Gross Annual Fees (₹)">
                  <input type="number" name="total_fees" value={formData.total_fees} onChange={handleChange} className="form-input-custom font-bold text-slate-900" />
                </FormGroup>
                <FormGroup label="Concession (₹)">
                  <input type="number" name="concession" value={formData.concession} onChange={handleChange} className="form-input-custom text-amber-600 font-bold" />
                </FormGroup>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Net Payable</label>
                  <span className="text-xl font-black text-slate-900">₹ {netPayable.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="Amount Collected Now (₹)">
                    <div className="relative">
                       <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                       <input type="number" name="amount_paid" value={formData.amount_paid} onChange={handleChange} className="form-input-custom pl-10 border-indigo-200 bg-white ring-2 ring-indigo-500/5 font-bold text-indigo-700" />
                    </div>
                  </FormGroup>
                  <FormGroup label="Payment Mode">
                    <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} className="form-input-custom cursor-pointer appearance-none">
                      <option value="Cash">Cash Payment</option>
                      <option value="UPI">UPI / Digital</option>
                      <option value="Card">Card Swipe</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </FormGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="Reference / Transaction ID">
                    <input type="text" name="transaction_id" placeholder="Optional reference" value={formData.transaction_id} onChange={handleChange} className="form-input-custom bg-white" />
                  </FormGroup>
                  <FormGroup label="Remaining Balance">
                    <div className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between ${balanceRemaining > 0 ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}>
                      <span>Pending:</span>
                      <span>₹ {balanceRemaining.toLocaleString()}</span>
                    </div>
                  </FormGroup>
                </div>

                <FormGroup label="Payment Note">
                  <textarea name="payment_remarks" rows={2} placeholder="Installment details or remarks..." value={formData.payment_remarks} onChange={handleChange} className="form-input-custom bg-white resize-none" />
                </FormGroup>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm active:scale-[0.97] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Finalizing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Confirm & Register Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormGroup({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[12px] font-bold text-slate-600 ml-0.5 flex items-center gap-1 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}