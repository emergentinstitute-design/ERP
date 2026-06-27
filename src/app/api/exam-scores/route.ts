import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/server-route";

type ScoreStatus = "present" | "absent";

type ScoreInput = {
  student_id: string;
  score_obtained: number | string | null;
  status?: ScoreStatus;
  remarks?: string | null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("exam_id");

    if (!examId) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam id is required.",
        },
        { status: 400 }
      );
    }

    const supabase = await createRouteHandlerClient();

    const { data, error } = await supabase
      .from("exam_scores")
      .select("*")
      .eq("exam_id", examId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Score Fetch Error: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err: any) {
    console.error("EXAM_SCORE_FETCH_ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to fetch exam scores.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const body = await req.json();

    const { exam_id, scores } = body as {
      exam_id: string;
      scores: ScoreInput[];
    };

    if (!exam_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam id is required.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Scores are required.",
        },
        { status: 400 }
      );
    }

    const { data: exam, error: examError } = await supabase
      .from("exams")
      .select("id, batch, max_marks")
      .eq("id", exam_id)
      .single();

    if (examError || !exam) {
      throw new Error("Exam not found.");
    }

    const examBatch = exam.batch || "Unassigned";
    const maxMarks = Number(exam.max_marks || 0);

    if (!Number.isFinite(maxMarks) || maxMarks <= 0) {
      throw new Error("Selected exam has invalid maximum marks.");
    }

    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, batch");

    if (studentsError) {
      throw new Error(`Student Validation Error: ${studentsError.message}`);
    }

    const allowedStudentIds = new Set(
      (students || [])
        .filter((student) => {
          const studentBatch = student.batch || "Unassigned";
          return studentBatch === examBatch;
        })
        .map((student) => student.id)
    );

    if (allowedStudentIds.size === 0) {
      throw new Error("No students found for the selected exam batch.");
    }

    const seenStudentIds = new Set<string>();

    const rows = scores.map((score) => {
      const studentId = score.student_id;

      const rawScore =
        score.score_obtained === null || score.score_obtained === undefined
          ? ""
          : String(score.score_obtained).trim();

      const status: ScoreStatus =
        score.status === "absent" || rawScore === "" ? "absent" : "present";

      if (!studentId) {
        throw new Error("Student id is required in every score row.");
      }

      if (seenStudentIds.has(studentId)) {
        throw new Error("Duplicate student score found in request.");
      }

      seenStudentIds.add(studentId);

      if (!allowedStudentIds.has(studentId)) {
        throw new Error(
          "One or more students do not belong to the selected exam batch."
        );
      }

      let scoreObtained: number | null = null;

      if (status === "present") {
        scoreObtained = Number(rawScore);

        if (!Number.isFinite(scoreObtained) || scoreObtained < 0) {
          throw new Error("Invalid score entered.");
        }

        if (scoreObtained > maxMarks) {
          throw new Error(
            `Score cannot be greater than maximum marks ${maxMarks}.`
          );
        }
      }

      return {
        exam_id,
        student_id: studentId,
        score_obtained: status === "absent" ? null : scoreObtained,
        max_marks_snapshot: maxMarks,
        status,
        remarks:
          status === "absent"
            ? score.remarks?.trim() || "Absent"
            : score.remarks?.trim() || null,
        updated_at: new Date().toISOString(),
      };
    });

    const { data, error } = await supabase
      .from("exam_scores")
      .upsert(rows, {
        onConflict: "exam_id,student_id",
      })
      .select();

    if (error) {
      throw new Error(`Score Save Error: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Scores saved successfully.",
      data: data || [],
    });
  } catch (err: any) {
    console.error("EXAM_SCORE_SAVE_ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to save exam scores.",
      },
      { status: 500 }
    );
  }
}