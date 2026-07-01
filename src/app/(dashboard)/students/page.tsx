"use client";

import React, { useEffect, useMemo, useState } from "react";
import PaymentModal from "./PaymentModal";
import LoadingState from "./LoadingState";
import StudentsFilters from "./StudentsFilters";
import StudentsHeader from "./StudentsHeader";
import StudentsTable from "./StudentsTable";
import EditStudentModal from "./EditStudentModal";
import type {
  EditStudentFormState,
  PaymentFormState,
  Student,
  Transaction,
} from "./types";

const emptyPaymentForm: PaymentFormState = {
  amount_paid: "",
  payment_mode: "Cash",
  transaction_id: "",
  remarks: "",
};

const emptyEditForm: EditStudentFormState = {
  name: "",
  father_name: "",
  mobile_student: "",
  mobile_father: "",
  standard: "",
  batch: "",
  subjects: "",
  total_fees: "0",
  concession: "0",
  net_payable_fees: "0",
  admission_date: "",
};

export default function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [loadingTransactions, setLoadingTransactions] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(emptyPaymentForm);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState<EditStudentFormState>(emptyEditForm);

  const getDateInputValue = (dateValue: string) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    return dateValue.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
};

const handleOpenEditModal = (student: Student) => {
  setEditingStudent(student);

  setEditForm({
    name: student.name || "",
    father_name: student.father_name || "",
    mobile_student: student.mobile_student || "",
    mobile_father: student.mobile_father || "",
    standard: student.standard || "",
    batch: student.batch || "",
    subjects: student.subjects || "",
    total_fees: student.total_fees || "0",
    concession: student.concession || "0",
    net_payable_fees: student.net_payable_fees || "0",
    admission_date: getDateInputValue(student.admission_date),
  });

  setIsEditModalOpen(true);
};

const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!editingStudent) return;

  setIsSubmittingEdit(true);

  try {
    const response = await fetch("/api/students", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingStudent.id,
        name: editForm.name,
        father_name: editForm.father_name,
        mobile_student: editForm.mobile_student,
        mobile_father: editForm.mobile_father,
        standard: editForm.standard,
        batch: editForm.batch,
        subjects: editForm.subjects,
        total_fees: editForm.total_fees,
        concession: editForm.concession,
        admission_date: editForm.admission_date,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Student update failed.");
    }

    alert("Student data updated successfully!");
    setIsEditModalOpen(false);
    setEditingStudent(null);
    fetchStudents();
  } catch (error: any) {
    alert("Operational Error: " + error.message);
  } finally {
    setIsSubmittingEdit(false);
  }
};

  const fetchStudents = () => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) setStudents(payload.data || []);
      })
      .catch((err) => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
    } finally {
      setLoadingTransactions((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const toggleExpandStudent = async (studentId: string) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
      return;
    }

    setExpandedStudentId(studentId);

    if (!transactions[studentId]) {
      await fetchStudentTransactions(studentId);
    }
  };

  const handleOpenPaymentModal = (student: Student) => {
    setSelectedStudent(student);
    setPaymentForm(emptyPaymentForm);
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
      if (!response.ok) {
        throw new Error(result.error || "Payment aggregation insertion failed.");
      }

      alert("Transaction compiled into ledger successfully!");
      setIsModalOpen(false);
      await fetchStudentTransactions(selectedStudent.id);
      setExpandedStudentId(selectedStudent.id);
      fetchStudents();
    } catch (error: any) {
      alert("Operational Error: " + error.message);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(search) ||
        !!student.mobile_student?.includes(searchTerm) ||
        !!student.mobile_father?.includes(searchTerm);

      const studentBatch = student.batch || "Unassigned";
      const matchesBatch = selectedBatch === "All" || studentBatch === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [students, searchTerm, selectedBatch]);

  const batches = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(students.map((student) => student.batch || "Unassigned"))).sort(),
    ];
  }, [students]);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 antialiased selection:bg-indigo-500/10">
      <StudentsHeader totalStudents={students.length} />

      <div className="max-w-7xl mx-auto px-6">
        <StudentsFilters
          searchTerm={searchTerm}
          selectedBatch={selectedBatch}
          batches={batches}
          onSearchChange={setSearchTerm}
          onBatchChange={setSelectedBatch}
        />

        <StudentsTable
          students={filteredStudents}
          expandedStudentId={expandedStudentId}
          transactions={transactions}
          loadingTransactions={loadingTransactions}
          onToggleExpand={toggleExpandStudent}
          onCollectFees={handleOpenPaymentModal}
          onEditStudent={handleOpenEditModal}
        />
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

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={editingStudent}
        isSubmitting={isSubmittingEdit}
        formState={editForm}
        onFormChange={setEditForm}
        onSubmit={handleEditSubmit}
      />


    </div>
  );
}