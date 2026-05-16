"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  Download, 
  Loader2, 
  UserX, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface StudentFeeRow {
  id: string;
  student_name: string;
  contact_number: string;
  batch: string;
  total_fees: number;
  amount_paid: number;
  pending_fees: number;
}

export default function PendingFeesReportPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentFeeRow[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/fees/pending`)
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setStudents(payload.data || []);
        } else {
          setErrorMessage(payload.error || "Failed to load database entries.");
        }
      })
      .catch((err) => {
        console.error("Error loading ledger:", err);
        setErrorMessage("Network error: Unable to contact data stream.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter((student) =>
    student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.contact_number.includes(searchQuery) ||
    student.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOutstanding = filteredStudents.reduce((sum, s) => sum + s.pending_fees, 0);
  const totalCollected = filteredStudents.reduce((sum, s) => sum + s.amount_paid, 0);

  const handleDownloadPDF = () => {
    if (filteredStudents.length === 0) return;
    setIsDownloading(true);

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); 
      doc.text("INSTITUTIONAL FEE LEDGER", 14, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); 
      doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 25);
      doc.text(`Total Deficit Rows: ${filteredStudents.length} Students`, 14, 29);

      autoTable(doc, {
        startY: 35,
        head: [["Total Amount Collected", "Total Balance Due Outstanding"]],
        body: [[
          `INR ${totalCollected.toLocaleString("en-IN")}`, 
          `INR ${totalOutstanding.toLocaleString("en-IN")}`
        ]],
        theme: "plain",
        headStyles: { fontSize: 8, textColor: [100, 116, 139], fontStyle: "bold" },
        bodyStyles: { fontSize: 13, fontStyle: "bold", textColor: [220, 38, 38] },
      });

      const tableRows = filteredStudents.map((s, index) => [
        index + 1,
        s.student_name,
        s.contact_number,
        s.batch,
        s.total_fees.toLocaleString("en-IN"),
        s.amount_paid.toLocaleString("en-IN"),
        s.pending_fees.toLocaleString("en-IN")
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [["#", "Student Name", "Phone Number", "Assigned Batch", "Total (₹)", "Paid (₹)", "Pending (₹)"]],
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229], fontSize: 9, fontStyle: "bold" }, 
        columnStyles: {
          0: { cellWidth: 8 },
          1: { fontStyle: "bold" },
          4: { halign: "right" },
          5: { halign: "right" },
          6: { halign: "right", fontStyle: "bold", textColor: [185, 28, 28] } 
        },
        styles: { fontSize: 8.5, cellPadding: 3 },
      });

      doc.save(`Fee_Defaulters_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF Compilation failure:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-7 w-7 text-indigo-600 animate-spin" />
      <p className="text-slate-500 font-medium text-sm animate-pulse">Assembling report context metrics...</p>
    </div>
  );

  if (errorMessage) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center px-6">
      <div className="p-3 bg-rose-50 text-rose-600 rounded-full">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">Data Aggregation Failed</h3>
        <p className="text-sm text-slate-500 mt-1">{errorMessage}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-indigo-600" />
            Fee Outstanding Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1">Tracks, audits, and bundles data streams across profiles with active deficit parameters.</p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading || filteredStudents.length === 0}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-semibold text-sm shadow-sm active:scale-[0.98] disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Compiling Document...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Defaulters PDF
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><AlertCircle className="h-5 w-5" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Dues Receivable</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">₹ {totalOutstanding.toLocaleString("en-IN")}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Collected Capital Pool</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">₹ {totalCollected.toLocaleString("en-IN")}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg"><FileText className="h-5 w-5" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Dues Flagged Accounts</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{filteredStudents.length} Students</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 bg-slate-50/50 border-b border-slate-200/60 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search via name, batch setup or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <UserX className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No matching defaulter profiles found in current index configuration.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                  <th className="p-4 pl-6">Student Details</th>
                  <th className="p-4">Assigned Batch</th>
                  <th className="p-4 text-right">Gross Total Fees</th>
                  <th className="p-4 text-right">Collected Amount</th>
                  <th className="p-4 text-right pr-6">Pending Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-900">{student.student_name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{student.contact_number}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        {student.batch}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-500">
                      ₹{student.total_fees.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-right font-mono text-emerald-600 font-medium">
                      ₹{student.amount_paid.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-right font-mono text-rose-600 font-bold pr-6">
                      ₹{student.pending_fees.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}