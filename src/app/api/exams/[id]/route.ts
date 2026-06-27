import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server-route';

type Params = {
  params: Promise<{ id: string }>;
};

// GET: Fetch one exam by ID for edit popup
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createRouteHandlerClient();

    const { data: exam, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !exam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Exam details not found.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: exam,
    });
  } catch (err: any) {
    console.error('EXAM_FETCH_BY_ID_ERROR:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch exam details.',
      },
      { status: 500 }
    );
  }
}

// PATCH: Update exam details
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
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
    const parsedDuration = duration_minutes ? Number(duration_minutes) : null;

    if (!parsedMaxMarks || parsedMaxMarks <= 0) {
      throw new Error('Valid maximum marks are required.');
    }

    if (parsedDuration !== null && parsedDuration <= 0) {
      throw new Error('Valid duration is required.');
    }

    const { data: updatedExam, error } = await supabase
      .from('exams')
      .update({
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
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Exam Update Error: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Exam updated successfully.',
      data: updatedExam,
    });
  } catch (err: any) {
    console.error('EXAM_UPDATE_ERROR:', err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to update exam.',
      },
      { status: 500 }
    );
  }
}