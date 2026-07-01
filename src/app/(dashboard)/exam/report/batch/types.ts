export type ScoreStatus = "present" | "absent";

export interface Student {
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

export interface Exam {
  id: string;
  exam_name: string;
  exam_type: string;
  board: string;
  subject_name: string;
  language: string;
  chapter: string;
  exam_date: string;
  batch: string;
  max_marks: number;
  duration_minutes: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface SavedScore {
  id: string;
  exam_id: string;
  student_id: string;
  score_obtained: number | string | null;
  max_marks_snapshot: number | string;
  status: ScoreStatus;
  remarks: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface StudentResultCell {
  exam: Exam;
  status: "present" | "absent" | "pending";
  score: number | null;
  maxMarks: number;
}

export interface StudentResultRow {
  rank: number;
  student: Student;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  absentCount: number;
  pendingCount: number;
  results: StudentResultCell[];
}