import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server-route";

export async function GET() {
  try {
    // 1. Initialize the client using your route handler utility function
    const supabase = await createRouteHandlerClient();

    // 2. Query your public.students table matrix and left-join relevant fee payment sums
    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        fee_payments (
          amount_paid
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // 3. Dynamically compute aggregated payment totals per student profile
    const processedStudents = (data || []).map((student: any) => {
      const paymentsArray = student.fee_payments || [];
      
      // Reduce the array to calculate total amount paid till date
      const aggregatePaid = paymentsArray.reduce(
        (sum: number, record: any) => sum + (parseFloat(record.amount_paid) || 0),
        0
      );

      // Clean up the response body object so we don't leak raw nested arrays to the frontend
      const { fee_payments, ...studentData } = student;

      return {
        ...studentData,
        amount_paid_till_date: aggregatePaid.toString(), // Passes directly into frontend mathematical state parsing
      };
    });

    // 4. Return payload mapping cleanly to client states
    return NextResponse.json({ 
      success: true, 
      data: processedStudents 
    });
  } catch (error: any) {
    console.error("API Students Fetch Crash:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}