"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  User, 
  GraduationCap, 
  Compass, 
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ChevronDown
} from "lucide-react";

export default function NewEnquiryPage() {
  const router = useRouter();
  const params = useParams();
  
  const dashboard = params?.dashboard;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student_name: "",
    parent_name: "",
    contact_number: "",
    alternate_contact: "",
    address: "",
    current_school: "",
    current_standard: "",
    interested_course: "",
    enquiry_source: "Walk-in",
    remarks: "",
    follow_up_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getBackPath = () => dashboard ? `/${dashboard}/enquiries` : "/enquiries";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to log entry");

      router.push(getBackPath());
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Header / Sticky Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push(getBackPath())}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pipeline
          </button>
          
          <div className="flex items-center gap-3">
             <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded">Draft</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Create New Lead</h1>
          <p className="text-slate-500 mt-1 text-sm">Fill in the prospect details to initiate the enrollment workflow.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Lead Identity */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
              <User className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-800">Lead Identity</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Student Name" required>
                <input name="student_name" required value={formData.student_name} onChange={handleChange} className="form-input-custom" placeholder="John Doe" />
              </FormGroup>

              <FormGroup label="Parent / Guardian Name">
                <input name="parent_name" value={formData.parent_name} onChange={handleChange} className="form-input-custom" placeholder="Jane Doe" />
              </FormGroup>

              <FormGroup label="Primary Phone" required>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">+91</span>
                  <input type="tel" name="contact_number" required value={formData.contact_number} onChange={handleChange} className="form-input-custom rounded-l-none" placeholder="9876543210" />
                </div>
              </FormGroup>

              <FormGroup label="Alternate Phone">
                <input type="tel" name="alternate_contact" value={formData.alternate_contact} onChange={handleChange} className="form-input-custom" placeholder="Secondary number" />
              </FormGroup>
            </div>
          </section>

          {/* Section 2: Academic Goals */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-purple-500" />
              <h2 className="text-sm font-semibold text-slate-800">Academic Context</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormGroup label="Current Institution">
                <input name="current_school" value={formData.current_school} onChange={handleChange} className="form-input-custom" placeholder="School/College Name" />
              </FormGroup>
              <FormGroup label="Grade / Class">
                <input name="current_standard" value={formData.current_standard} onChange={handleChange} className="form-input-custom" placeholder="e.g. 12th Standard" />
              </FormGroup>
              <FormGroup label="Target Course">
                <input name="interested_course" value={formData.interested_course} onChange={handleChange} className="form-input-custom" placeholder="e.g. JEE Mains" />
              </FormGroup>
            </div>
          </section>

          {/* Section 3: CRM & Meta Data */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
              <Compass className="h-4 w-4 text-orange-500" />
              <h2 className="text-sm font-semibold text-slate-800">Source & Retention</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label="Acquisition Channel">
                  <div className="relative">
                    <select name="enquiry_source" value={formData.enquiry_source} onChange={handleChange} className="form-input-custom appearance-none pr-10 cursor-pointer">
                      <option value="Walk-in">Walk-in Visit</option>
                      <option value="Meta Ads">Social Media (Meta)</option>
                      <option value="Google Search">Search Engine</option>
                      <option value="Reference">Referral / Word of Mouth</option>
                      <option value="Flyer/Banner">Physical Marketing</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </FormGroup>
                <FormGroup label="Next Follow-up Date">
                  <input type="date" name="follow_up_date" value={formData.follow_up_date} onChange={handleChange} className="form-input-custom" />
                </FormGroup>
              </div>

              <FormGroup label="Residential Address">
                <textarea name="address" rows={2} value={formData.address} onChange={handleChange} className="form-input-custom resize-none" placeholder="Enter area or full address..." />
              </FormGroup>

              <FormGroup label="Internal Discovery Remarks">
                <textarea name="remarks" rows={3} value={formData.remarks} onChange={handleChange} className="form-input-custom resize-none bg-slate-50/50 focus:bg-white" placeholder="What are the lead's main pain points or requirements?" />
              </FormGroup>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => router.push(getBackPath())}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-[0.97] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Create Enquiry</span>
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
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-slate-700 ml-0.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}