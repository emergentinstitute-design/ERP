import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server-route";

/**
 * GET: Retrieve specific historical transaction entries for an individual candidate profile.
 * Expects a query string parameter string: /api/fee-payments?student_id=[UUID]
 */
export async function GET(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id");

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Missing identity reference parameter (student_id)." },
        { status: 400 }
      );
    }

    // Pull historical payment parameters ordered from newest to oldest
    // 🛠️ FIX: Changed order criteria from 'created_at' to your database schema's true column name: 'payment_date'
    const { data, error } = await supabase
      .from("fee_payments")
      .select("*")
      .eq("student_id", studentId)
      .order("payment_date", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err: any) {
    console.error("FEE_PAYMENTS_GET_ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Record structural row data inside your table mapping schemas.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const body = await req.json();

    const { student_id, amount_paid, payment_mode, transaction_id, remarks } = body;

    // Strict validation parameters
    if (!student_id || amount_paid === undefined || amount_paid === null || !payment_mode) {
      return NextResponse.json(
        { success: false, error: "Missing required transactional variables." },
        { status: 400 }
      );
    }

    // Insert structured ledger data rows
    const { data, error } = await supabase
      .from("fee_payments")
      .insert({
        student_id,
        amount_paid: parseFloat(amount_paid), // Ensure safe parsing format matching schema type definitions
        payment_mode,
        transaction_id: transaction_id || null,
        remarks: remarks || null,
        // payment_date auto-defaults using now() via database layout configuration
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      data, 
      message: "Installment recorded successfully inside database entries." 
    });
  } catch (err: any) {
    console.error("FEE_PAYMENTS_POST_ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message }, 
      { status: 500 }
    );
  }
}