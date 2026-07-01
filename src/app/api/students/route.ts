import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server-route";

export async function GET() {
  try {
    const supabase = await createRouteHandlerClient();

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

    const processedStudents = (data || []).map((student: any) => {
      const paymentsArray = student.fee_payments || [];

      const aggregatePaid = paymentsArray.reduce(
        (sum: number, record: any) =>
          sum + (parseFloat(record.amount_paid) || 0),
        0
      );

      const { fee_payments, ...studentData } = student;

      return {
        ...studentData,
        amount_paid_till_date: aggregatePaid.toString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: processedStudents,
    });
  } catch (error: any) {
    console.error("API Students Fetch Crash:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const body = await request.json();

    const { id, ...payload } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Student ID is required." },
        { status: 400 }
      );
    }

    const updatePayload = {
      name: payload.name,
      father_name: payload.father_name || null,
      mobile_student: payload.mobile_student || null,
      mobile_father: payload.mobile_father || null,
      standard: payload.standard || null,
      batch: payload.batch || null,
      subjects: payload.subjects || null,
      total_fees: payload.total_fees || "0",
      concession: payload.concession || "0",
      admission_date: payload.admission_date,
    };

    const { data, error } = await supabase
      .from("students")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Student not found or update blocked. Check student ID and Supabase RLS policy.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("API Student Update Crash:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}