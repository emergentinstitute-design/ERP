"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Users,
  Calendar,
  Phone,
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Receipt,
  CreditCard,
} from "lucide-react";
import PaymentModal from "./PaymentModal";

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
  amount_paid_till_date?: string; 
}

interface Transaction {
  id: string;
  amount_paid: string;
  payment_mode: string;
  transaction_id: string | null;
  remarks: string | null;
  created_at: string;
}

export default function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");

  // Accordion Expander State Management
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [loadingTransactions, setLoadingTransactions] = useState<Record<string, boolean>>({});

  // Payment Form Modal State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount_paid: "",
    payment_mode: "Cash",
    transaction_id: "",
    remarks: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) setStudents(payload.data || []);
      })
      .catch((err) => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  };

  // Dedicated transaction fetcher accessible via both row expanders and post-submission clear lines
  const fetchStudentTransactions = async (studentId: string) => {
    setLoadingTransactions((prev) => ({ ...prev, [studentId]: true }));
    try {
      const res = await fetch(`/api/fee-payments?student_id=${studentId}`);
      const payload = await res.json();
      if (payload.success) {
        setTransactions((prev) => ({ ...prev, [studentId]: payload.data || [] }));
      }
    } catch (err) {
      console.error("Error retrieving student structural financial ledger:", err);
    } bits: {
      setLoadingTransactions((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const toggleExpandStudent = async (studentId: string) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
      return;
    }

    setExpandedStudentId(studentId);

    // Fetch transactions asynchronously only when expanded if not already cached
    if (!transactions[studentId]) {
      await fetchStudentTransactions(studentId);
    }
  };

  const handleOpenPaymentModal = (student: Student) => {
    setSelectedStudent(student);
    setPaymentForm({
      amount_paid: "",
      payment_mode: "Cash",
      transaction_id: "",
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setIsSubmittingPayment(true);
    try {
      const response = await fetch("/api/fee-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          amount_paid: parseFloat(paymentForm.amount_paid),
          payment_mode: paymentForm.payment_mode,
          transaction_id: paymentForm.transaction_id || null,
          remarks: paymentForm.remarks || null,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Payment aggregation insertion failed.");

      alert("Transaction compiled into ledger successfully!");
      setIsModalOpen(false);
      
      // Hot-reload the transaction table for this student to display the new entry immediately
      await fetchStudentTransactions(selectedStudent.id);
      
      // Ensure the row stays expanded or snaps open to show the new transaction receipt
      setExpandedStudentId(selectedStudent.id);

      // Refresh aggregate metadata on the primary table rows (Pending Dues calculation sums)
      fetchStudents(); 
    } catch (error: any) {
      alert("Operational Error: " + error.message);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mobile_student?.includes(searchTerm) ||
      student.mobile_father?.includes(searchTerm);

    const studentBatch = student.batch || "Unassigned";
    const matchesBatch = selectedBatch === "All" || studentBatch === selectedBatch;
    
    return matchesSearch && matchesBatch;
  });

  const batches = ["All", ...Array.from(new Set(students.map((s) => s.batch || "Unassigned"))).sort()];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Accessing student ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 antialiased selection:bg-indigo-500/10">
      {/* HEADER SECTION */}
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
                  {students.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* FILTER TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or contact parameter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <div className="w-full md:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer shadow-sm text-slate-700"
            >
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch === "All" ? "All Batches" : `Batch: ${batch}`}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
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
                {filteredStudents.length === 0 ? (
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
                  filteredStudents.map((student) => {
                    const netPayable = parseFloat(student.net_payable_fees || "0");
                    const amountPaid = parseFloat(student.amount_paid_till_date || "0");
                    const pendingFees = netPayable - amountPaid;
                    const isExpanded = expandedStudentId === student.id;

                    return (
                      <React.Fragment key={student.id}>
                        <tr className={`group hover:bg-slate-50/40 transition-colors ${isExpanded ? 'bg-indigo-50/20' : ''}`}>
                          {/* Chevron Action Expander Arrow */}
                          <td className="px-4 py-4.5 text-center">
                            <button
                              type="button"
                              onClick={() => toggleExpandStudent(student.id)}
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

                          {/* Fees and Dues Block */}
                          <td className="px-6 py-4.5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-4 text-xs">
                                <div>
                                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Net Payable</span>
                                  <div className="font-bold text-slate-700 mt-0.5">
                                    ₹{netPayable.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Pending Dues</span>
                                  <div className={`font-extrabold text-sm flex items-center gap-0.5 mt-0.5 ${pendingFees > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                    ₹{pendingFees.toLocaleString()}
                                    {pendingFees > 0 && <AlertCircle className="h-3 w-3 inline text-rose-400" />}
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
                              {new Date(student.admission_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </td>

                          <td className="px-6 py-4.5 text-right pr-8">
                            <button
                              type="button"
                              onClick={() => handleOpenPaymentModal(student)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all transform active:scale-[0.98]"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              Collect Fees
                              <ChevronRight className="h-3 w-3 opacity-60" />
                            </button>
                          </td>
                        </tr>

                        {/* TRANSACTION HISTORY GRID DRAWER VIEW */}
                        {isExpanded && (
                          <tr className="bg-slate-50/40">
                            <td colSpan={6} className="px-8 py-4 border-l-4 border-indigo-500 bg-indigo-50/5">
                              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    <Receipt className="h-4 w-4 text-indigo-500" />
                                    Transaction Ledger Receipts ({transactions[student.id]?.length || 0})
                                  </div>
                                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-mono">
                                    REF ID: {student.id.substring(0, 8)}...
                                  </span>
                                </div>

                                {loadingTransactions[student.id] ? (
                                  <div className="py-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                                    <span>Compiling past payments data...</span>
                                  </div>
                                ) : !transactions[student.id] || transactions[student.id].length === 0 ? (
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
                                        {transactions[student.id].map((tx) => (
                                          <tr key={tx.id} className="hover:bg-slate-50/30">
<td className="p-2.5 whitespace-nowrap text-slate-500 font-medium">
  {(() => {
    // Check both potential backend column mappings (snake_case vs camelCase)
    const rawTimestamp = tx.created_at || (tx as any).createdAt || (tx as any).payment_date;

    if (!rawTimestamp) return "—";

    // Standardize space dividers to handle browser engine variants safely
    const sanitizedDateStr = typeof rawTimestamp === "string" && rawTimestamp.includes(" ") && !rawTimestamp.includes("T") 
      ? rawTimestamp.replace(" ", "T") 
      : rawTimestamp;

    const dateInstance = new Date(sanitizedDateStr);

    if (isNaN(dateInstance.getTime())) return "Format Error";

    // 🛠️ REMOVED hour and minute attributes completely to isolate the true calendar date
    return dateInstance.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  })()}
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
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        isSubmitting={isSubmittingPayment}
        formState={paymentForm}
        onFormChange={setPaymentForm}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}