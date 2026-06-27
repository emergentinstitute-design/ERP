import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server-route';

// GET: Fetch all exams
export async function GET() {
  try {
    const supabase = await createRouteHandlerClient();

    const { data: exams, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Exam Fetch Error: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: exams || [],
    });
  } catch (err: any) {
    console.error('EXAMS_FETCH_ERROR:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch exams.',
      },
      { status: 500 }
    );
  }
}

// POST: Create exam paper for selected batch
export async function POST(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const body = await req.json();

    const {
      exam_name,
      exam_type,
      subject_name,
      language,
      board,
      chapter,
      exam_date,
      batch,
      max_marks,
      duration_minutes,
    } = body;

    if (!exam_name) throw new Error('Exam name is required.');
    if (!exam_type) throw new Error('Exam type is required.');
    if (!subject_name) throw new Error('Subject name is required.');
    if (!language) throw new Error('Language is required.');
    if (!board) throw new Error('Board is required.');
    if (!chapter) throw new Error('Chapter is required.');
    if (!exam_date) throw new Error('Exam date is required.');
    if (!batch) throw new Error('Batch is required.');

    const parsedMaxMarks = Number(max_marks || 0);
    const parsedDuration = duration_minutes
      ? Number(duration_minutes)
      : null;

    if (!parsedMaxMarks || parsedMaxMarks <= 0) {
      throw new Error('Valid maximum marks are required.');
    }

    if (parsedDuration !== null && parsedDuration <= 0) {
      throw new Error('Valid duration is required.');
    }

    const { data: exam, error: examError } = await supabase
      .from('exams')
      .insert({
        exam_name,
        exam_type,
        subject_name,
        language,
        board,
        chapter,
        exam_date,
        batch,
        max_marks: parsedMaxMarks,
        duration_minutes: parsedDuration,
      })
      .select()
      .single();

    if (examError) {
      throw new Error(`Exam Creation Error: ${examError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Exam created successfully.',
      exam_id: exam.id,
      data: exam,
    });
  } catch (err: any) {
    console.error('EXAM_CREATION_ERROR:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to create exam.',
      },
      { status: 500 }
    );
  }
}