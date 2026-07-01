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

export interface Transaction {
  id: string;
  amount_paid: string;
  payment_mode: string;
  transaction_id: string | null;
  remarks: string | null;
  created_at: string;
}

export interface PaymentFormState {
  amount_paid: string;
  payment_mode: string;
  transaction_id: string;
  remarks: string;
}

export interface EditStudentFormState {
  name: string;
  father_name: string;
  mobile_student: string;
  mobile_father: string;
  standard: string;
  batch: string;
  subjects: string;
  total_fees: string;
  concession: string;
  net_payable_fees: string;
  admission_date: string;
}