import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Service role to bypass RLS safely for reports
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // 1. Fetch students and their total historic payments from Supabase
    // Using a join to fetch payment amounts relative to each student profile
    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select(`
        id,
        name,
        mobile_student,
        batch,
        total_fees,
        concession,
        net_payable_fees,
        fee_payments (
          amount_paid
        )
      `);

    if (studentsError) throw studentsError;

    // 2. Parse and calculate aggregate statistics
    const reportData = (studentsData || [])
      .map((student: any) => {
        // Sum up all historic transaction logs for this student
        const historicPaymentsSum = student.fee_payments?.reduce(
          (sum: number, payment: any) => sum + parseFloat(payment.amount_paid || "0"),
          0
        ) || 0;

        const netPayable = parseFloat(student.net_payable_fees || "0");
        const pendingOutstanding = netPayable - historicPaymentsSum;

        return {
          id: student.id,
          student_name: student.name,
          contact_number: student.mobile_student || "N/A",
          batch: student.batch || "Unassigned",
          total_fees: netPayable + parseFloat(student.concession || "0"), // Base total
          amount_paid: historicPaymentsSum,
          pending_fees: pendingOutstanding,
        };
      })
      // Filter out profiles who have completely cleared their dues balances (<= 0)
      .filter((student) => student.pending_fees > 0);

    return NextResponse.json({ success: true, data: reportData });
  } catch (error: any) {
    console.error("Database query exception in backend reporting system:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch fee data ledger rows" },
      { status: 500 }
    );
  }
}