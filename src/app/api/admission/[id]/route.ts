import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server-route';

type Params = {
  params: Promise<{ id: string }>;
};

// GET: Fetch raw enquiry details to prefill the admission form layout
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createRouteHandlerClient();

    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !enquiry) {
      return NextResponse.json({ success: false, error: 'Enquiry details not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Confirm Admission, Save Student, and Log First Fee Payment
export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params; // This is the enquiry_id
    const supabase = await createRouteHandlerClient();
    const body = await req.json();

    const {
      name,
      father_name,
      mother_name,
      mobile_student,
      mobile_father,
      mobile_mother,
      address,
      school,
      standard,
      batch,
      subjects,
      total_fees,
      concession,
      amount_paid,
      payment_mode,
      transaction_id,
      payment_remarks
    } = body;

    // 1. Create the Student row entry
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        enquiry_id: id,
        name,
        father_name,
        mother_name,
        mobile_student,
        mobile_father,
        mobile_mother,
        address,
        school,
        standard,
        batch,
        subjects,
        total_fees: parseFloat(total_fees || 0),
        concession: parseFloat(concession || 0),
      })
      .select()
      .single();

    if (studentError) throw new Error(`Student Registry Error: ${studentError.message}`);

    // 2. If an upfront payment was made during admission, log it in fee_payments
    const parsedAmountPaid = parseFloat(amount_paid || 0);
    if (parsedAmountPaid > 0) {
      const { error: paymentError } = await supabase
        .from('fee_payments')
        .insert({
          student_id: student.id,
          amount_paid: parsedAmountPaid,
          payment_mode: payment_mode || 'Cash',
          transaction_id: transaction_id || null,
          remarks: payment_remarks || 'Collected at time of official admission.'
        });

      if (paymentError) throw new Error(`Fee Ledger Error: ${paymentError.message}`);
    }

    // 3. Mark the source enquiry pipeline entry as successfully converted
    await supabase
      .from('enquiries')
      .update({
        converted_to_student: true,
        converted_student_id: student.id,
        converted_at: new Date().toISOString(),
        status: 'converted'
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      message: 'Admission finalized and fee payment logged successfully!',
      student_id: student.id
    });

  } catch (err: any) {
    console.error('ADMISSION_PROCESS_ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}