import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server-route';

// GET: Fetch only active, pending inquiries (excluding those already converted to students)
export async function GET() {
  try {
    const supabase = await createRouteHandlerClient();
    
    // 1. Fetch enquiries along with a left join on the students table.
    // If a record exists in both, 'students' will contain an array with an ID.
    const { data, error } = await supabase
      .from('enquiries')
      .select('*, students(id)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 2. Filter records where the relation array is empty (meaning they haven't been converted yet)
    const pendingEnquiries = (data || []).filter((enquiry: any) => {
      return !enquiry.students || enquiry.students.length === 0;
    });

    // 3. Clean up the payload before sending it to the client by stripping out the relation node
    const cleanedData = pendingEnquiries.map(({ students, ...rest }) => rest);

    return NextResponse.json({ success: true, data: cleanedData });
  } catch (err: any) {
    console.error('ENQUIRY_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Save a brand new inquiry form submission
export async function POST(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const body = await req.json();

    const {
      student_name,
      parent_name,
      contact_number,
      alternate_contact,
      address,
      current_school,
      current_standard,
      interested_course,
      enquiry_source,
      remarks,
      follow_up_date,
    } = body;

    // Server-side validation
    if (!student_name || !contact_number) {
      return NextResponse.json(
        { success: false, error: 'Student Name and Contact Number are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert({
        student_name,
        parent_name,
        contact_number,
        alternate_contact,
        address,
        current_school,
        current_standard,
        interested_course,
        enquiry_source,
        remarks,
        follow_up_date: follow_up_date || null,
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      data, 
      message: 'Enquiry captured successfully!' 
    });
  } catch (err: any) {
    console.error('ENQUIRY_POST_ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}